export interface TelegramConfig {
  botToken: string;
  chatId: string;
  parseMode?: 'HTML' | 'Markdown' | 'MarkdownV2';
}

export interface TelegramMessage {
  text: string;
  parse_mode?: 'HTML' | 'Markdown' | 'MarkdownV2';
  disable_notification?: boolean;
}

export interface TelegramResponse {
  ok: boolean;
  description?: string;
  result?: any;
  error_code?: number;
}

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

/**
 * سرویس ارسال پیام به تلگرام
 */
export class TelegramService {
  private botToken: string;
  private chatId: string;
  private baseUrl: string;

  constructor(config: TelegramConfig) {
    this.botToken = config.botToken;
    this.chatId = config.chatId;
    this.baseUrl = `https://api.telegram.org/bot${this.botToken}`;
  }

  /**
   * ارسال پیام متنی به تلگرام
   */
  async sendMessage(message: TelegramMessage): Promise<TelegramResponse> {
    try {
      const url = `${this.baseUrl}/sendMessage`;

      const payload = {
        chat_id: this.chatId,
        text: message.text,
        parse_mode: message.parse_mode || 'HTML',
        disable_notification: message.disable_notification || false
      };

      console.log('Sending Telegram message:', payload);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Telegram API error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      console.log('Telegram response:', result);

      return result;
    } catch (error) {
      console.error('Error sending Telegram message:', error);
      return {
        ok: false,
        description: error.message,
        error_code: 500
      };
    }
  }

  /**
   * ارسال پیام رزرو مشاوره با فرمت زیبا
   */
  async sendConsultationNotification(consultation: Consultation): Promise<TelegramResponse> {
    const formattedMessage = this.formatConsultationMessage(consultation);

    return this.sendMessage({
      text: formattedMessage,
      parse_mode: 'HTML',
      disable_notification: false
    });
  }

  /**
   * فرمت‌دهی پیام رزرو مشاوره با ایموجی‌ها و طراحی زیبا
   */
  private formatConsultationMessage(consultation: Consultation): string {
    const timestamp = new Date().toLocaleString('fa-IR');
    const consultationId = consultation.id ? consultation.id.toString() : 'نامشخص';

    // ترجمه نوع مشاوره
    const typeMap: { [key: string]: string } = {
      'phone': '📞 تلفنی',
      'video': '🎥 ویدئویی',
      'in_person': '🏢 حضوری'
    };

    const consultationType = typeMap[consultation.consultation_type] || consultation.consultation_type;

    // فرمت تاریخ شمسی
    const date = new Date(consultation.preferred_date).toLocaleDateString('fa-IR');

    let message = '';

    // هدر پیام
    message += '📋 <b>درخواست رزرو مشاوره جدید</b>\n\n';

    // اطلاعات اصلی
    message += '👤 <b>نام و نام خانوادگی:</b>\n';
    message += `   ${consultation.name}\n\n`;

    message += '📱 <b>شماره تلفن:</b>\n';
    message += `   ${consultation.phone}\n\n`;

    // اطلاعات مکانی (اختیاری)
    if (consultation.province || consultation.city) {
      message += '🌍 <b>مکان:</b>\n';
      if (consultation.province) {
        message += `   🏛️ استان: ${consultation.province}\n`;
      }
      if (consultation.city) {
        message += `   🏙️ شهر: ${consultation.city}\n`;
      }
      message += '\n';
    }

    // موضوع مشاوره (اختیاری)
    if (consultation.consultation_topic) {
      message += '📋 <b>موضوع مشاوره:</b>\n';
      message += `   ${consultation.consultation_topic}\n\n`;
    }

    // شرح مشکل (اختیاری)
    if (consultation.problem_description) {
      message += '📝 <b>شرح مشکل:</b>\n';
      message += `   ${consultation.problem_description}\n\n`;
    }

    // اطلاعات رزرو
    message += '📅 <b>زمان رزرو:</b>\n';
    message += `   📅 تاریخ: ${date}\n`;
    message += `   ⏰ زمان: ${consultation.preferred_time}\n`;
    message += `   🔧 نوع مشاوره: ${consultationType}\n\n`;

    // توضیحات (اختیاری)
    if (consultation.message) {
      message += '💬 <b>توضیحات:</b>\n';
      message += `   ${consultation.message}\n\n`;
    }

    // اطلاعات اضافی (اختیاری)
    if (consultation.national_id || consultation.documents) {
      message += '📎 <b>اطلاعات تکمیلی:</b>\n';

      if (consultation.national_id) {
        message += `   🆔 کد ملی: ${consultation.national_id}\n`;
      }

      if (consultation.documents) {
        message += `   📄 مدارک: ${consultation.documents}\n`;
      }
      message += '\n';
    }

    // فوتر
    message += '━━━━━━━━━━━━━━━━━━━━━━\n';
    message += `⏰ <b>زمان ثبت:</b> ${timestamp}\n`;
    message += `🆔 <b>شماره رزرو:</b> ${consultationId}\n`;
    message += '━━━━━━━━━━━━━━━━━━━━━━\n\n';

    // ایموجی پایانی
    message += '✅ <b>درخواست با موفقیت ثبت شد!</b>';

    return message;
  }

  /**
   * تست اتصال به تلگرام
   */
  async testConnection(): Promise<TelegramResponse> {
    try {
      const url = `${this.baseUrl}/getMe`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Telegram API error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();

      if (result.ok) {
        return {
          ok: true,
          result: {
            message: `✅ اتصال به ربات ${result.result.first_name} برقرار شد!`
          }
        };
      } else {
        return {
          ok: false,
          description: result.description || 'خطا در اتصال به ربات'
        };
      }
    } catch (error) {
      console.error('Error testing Telegram connection:', error);
      return {
        ok: false,
        description: error.message,
        error_code: 500
      };
    }
  }
}

/**
 * ایجاد instance از سرویس تلگرام با استفاده از متغیرهای محیطی
 */
export function createTelegramService(): TelegramService | null {
  const botToken = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
  const chatId = import.meta.env.VITE_TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    console.warn('Telegram credentials not found in environment variables');
    return null;
  }

  return new TelegramService({
    botToken,
    chatId,
    parseMode: 'HTML'
  });
}
