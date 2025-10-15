import { createTelegramService, TelegramService } from './telegramService';

export interface Consultation {
  id?: number;
  name: string;
  phone: string;
  national_id?: string;
  province?: string;
  city?: string;
  consultation_type: string;
  consultation_topic?: string;
  problem_description?: string;
  documents?: string;
  preferred_date: string;
  preferred_time: string;
  message?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Singleton pattern برای جلوگیری از چند instance
let consultationServiceInstance: ConsultationService | null = null;

// Cloudflare D1 API service
class ConsultationService {
  private apiUrl: string;
  private telegramService: TelegramService | null;
  private static notificationSent: boolean = false;

  constructor() {
    // استفاده از ورکر جدید public-api برای اتصال به دیتابیس جدید
    this.apiUrl = import.meta.env.VITE_PUBLIC_CONSULT_API || 'https://public-api.masoud555net.workers.dev/api/public/consultations';

    // مقداردهی سرویس تلگرام فقط اگر توکن معتبر موجود باشد
    const botToken = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
    if (botToken && botToken !== 'YOUR_TELEGRAM_BOT_TOKEN_HERE') {
      this.telegramService = createTelegramService();
    } else {
      this.telegramService = null;
      console.log('ℹ️ سرویس تلگرام غیرفعال است - توکن معتبر یافت نشد');
    }
  }

  // متد static برای ایجاد instance یکتا
  static getInstance(): ConsultationService {
    if (!consultationServiceInstance) {
      consultationServiceInstance = new ConsultationService();
    }
    return consultationServiceInstance;
  }

  async createConsultation(consultation: Omit<Consultation, 'id' | 'status' | 'created_at' | 'updated_at'>): Promise<ApiResponse<Consultation>> {
    try {
      // اعتبارسنجی اولیه داده‌ها قبل از ارسال
      if (!consultation.name || !consultation.phone || !consultation.preferred_date || !consultation.preferred_time) {
        return {
          success: false,
          error: 'داده‌های الزامی کامل نیستند'
        };
      }

      // بررسی فرمت تاریخ
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(consultation.preferred_date)) {
        return {
          success: false,
          error: 'فرمت تاریخ اشتباه است'
        };
      }

      // بررسی زمان - فقط چک کن که زمان انتخاب شده باشه
      if (!consultation.preferred_time) {
        return {
          success: false,
          error: 'زمان را انتخاب کنید'
        };
      }

      // اعتبارسنجی ساده برای زمان - فقط چک کن که حداقل ۳ کاراکتر باشه
      if (consultation.preferred_time.trim().length < 3) {
        return {
          success: false,
          error: 'فرمت زمان اشتباه است'
        };
      }

      console.log('Time validation passed:', {
        preferred_time: consultation.preferred_time,
        length: consultation.preferred_time.length
      });

      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(consultation),
      });

      if (!response.ok) {
        let userFriendlyError = 'خطا در ذخیره اطلاعات';
        switch (response.status) {
          case 400:
            userFriendlyError = 'خطا در اعتبار سنجی داده‌ها: لطفاً ورودی‌های خود را بررسی کنید';
            break;
          case 409:
            userFriendlyError = 'این زمان قبلاً رزرو شده است';
            break;
          case 422:
            userFriendlyError = 'داده‌های ورودی معتبر نیستند';
            break;
          case 500:
            userFriendlyError = 'خطا در سرور، لطفاً بعداً تلاش کنید';
            break;
        }

        return {
          success: false,
          error: userFriendlyError
        };
      }

      const result = await response.json();

      // نوتیفیکیشن تلگرام فقط توسط Worker ارسال می‌شود
      // این بخش حذف شده تا از ارسال تکراری جلوگیری شود
      console.log('✅ رزرو با موفقیت ثبت شد - نوتیفیکیشن توسط Worker ارسال خواهد شد');

      return result;
    } catch (error) {
      let userFriendlyError = 'خطا در اتصال به سرور';

      if (error instanceof TypeError && error.message.includes('fetch')) {
        userFriendlyError = 'خطا در اتصال به اینترنت یا سرور';
      } else if (error instanceof Error) {
        if (error.message.includes('Network Error')) {
          userFriendlyError = 'خطا در اتصال به اینترنت';
        } else if (error.message.includes('timeout')) {
          userFriendlyError = 'پاسخ از سرور دریافت نشد، لطفاً دوباره تلاش کنید';
        }
      }

      return {
        success: false,
        error: userFriendlyError
      };
    }
  }

  /**
   * ارسال نوتیفیکیشن تلگرام برای رزرو جدید (از طریق سرویس سمت کلاینت)
   */
  private async sendTelegramNotification(consultation: Consultation): Promise<void> {
    if (!this.telegramService) {
      console.warn('Telegram service not available');
      return;
    }

    try {
      await this.telegramService.sendConsultationNotification(consultation);
    } catch (error) {
      console.error('Error sending Telegram notification:', error);
      throw error;
    }
  }

  /**
   * ارسال نوتیفیکیشن تلگرام از طریق Worker اصلی (برای حل مشکل CORS)
   */
  private async sendTelegramNotificationViaWorker(consultation: Consultation): Promise<void> {
    try {
      // استفاده از Worker اصلی که متغیرهای محیطی دارد
      const mainWorkerUrl = 'https://public-api.masoud555net.workers.dev/api/public/consultations';
      const telegramEndpoint = `${mainWorkerUrl}/telegram-notification`;

      console.log('Sending Telegram notification via main Worker:', telegramEndpoint);

      const response = await fetch(telegramEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(consultation)
      });

      if (!response.ok) {
        throw new Error(`Worker error! status: ${response.status}`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(`Telegram notification failed: ${result.error}`);
      }

      console.log('Main Worker Telegram response:', result);
    } catch (error) {
      console.error('Error sending Telegram notification via main Worker:', error);
      throw error;
    }
  }

  async getConsultations(): Promise<ApiResponse<Consultation[]>> {
    try {
      const response = await fetch(this.apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error fetching consultations:', error);
      return {
        success: false,
        error: 'خطا در اتصال به سرور. لطفاً بعداً دوباره تلاش کنید.'
      };
    }
  }

  async getConsultation(id: number): Promise<ApiResponse<Consultation>> {
    try {
      const response = await fetch(`${this.apiUrl}/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error fetching consultation:', error);
      return {
        success: false,
        error: 'خطا در اتصال به سرور. لطفاً بعداً دوباره تلاش کنید.'
      };
    }
  }
}

// استفاده از Singleton pattern برای جلوگیری از چند instance
export const consultationService = ConsultationService.getInstance();
