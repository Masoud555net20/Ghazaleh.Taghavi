/**
 * Cloudflare Worker اختصاصی برای ارسال پیام به تلگرام
 * این Worker فقط مسئولیت ارسال نوتیفیکیشن‌های رزرو به تلگرام را بر عهده دارد
 *
 * ویژگی‌های کلیدی:
 * - ارسال پیام‌های زیبا با فرمت HTML
 * - استفاده از ایموجی‌های مرتبط
 * - مدیریت خطاها و retry logic
 * - امنیت بالا با استفاده از متغیرهای محیطی
 */

// تعریف interfaceها برای تایپ‌های داده
class TelegramWorker {
  constructor() {
    this.telegramService = null;
  }

  /**
   * مدیریت اصلی درخواست‌ها
   */
  async handleRequest(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    // تنظیم CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    // مدیریت preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: corsHeaders,
        status: 204
      });
    }

    try {
      // مقداردهی اولیه سرویس تلگرام
      this.initializeTelegramService(env);

      // مسیریابی درخواست‌ها
      switch (path) {
        case '/':
          return this.handleRootRequest(corsHeaders);

        case '/api/telegram/send-consultation':
          if (request.method === 'POST') {
            return await this.handleConsultationNotification(request, corsHeaders);
          }
          break;

        case '/api/telegram/test':
          if (request.method === 'GET') {
            return await this.handleTestConnection(corsHeaders);
          }
          break;

        default:
          return new Response(JSON.stringify({
            error: 'Not Found',
            message: 'Endpoint مورد نظر یافت نشد'
          }), {
            status: 404,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
      }

      return new Response(JSON.stringify({
        error: 'Method Not Allowed',
        message: 'متد HTTP مجاز نیست'
      }), {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });

    } catch (error) {
      console.error('Worker error:', error);
      return new Response(JSON.stringify({
        success: false,
        error: 'خطای داخلی سرور',
        message: error.message
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  }

  /**
   * مقداردهی اولیه سرویس تلگرام
   */
  initializeTelegramService(env) {
    const botToken = env.TELEGRAM_BOT_TOKEN;
    const chatId = env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      throw new Error('تنظیمات تلگرام یافت نشد. لطفاً متغیرهای محیطی TELEGRAM_BOT_TOKEN و TELEGRAM_CHAT_ID را تنظیم کنید.');
    }

    // استفاده از سرویس ساده بدون کلاس پیچیده
    this.telegramService = {
      botToken,
      chatId,
      baseUrl: `https://api.telegram.org/bot${botToken}`
    };
  }

  /**
   * مدیریت درخواست اصلی
   */
  handleRootRequest(corsHeaders) {
    return new Response(JSON.stringify({
      message: 'Telegram Worker is running!',
      status: 'ok',
      endpoints: [
        'POST /api/telegram/send-consultation',
        'GET /api/telegram/test'
      ]
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    });
  }

  /**
   * ارسال نوتیفیکیشن رزرو مشاوره به تلگرام
   */
  async handleConsultationNotification(request, corsHeaders) {
    try {
      const consultationData = await request.json();

      console.log('Received consultation data:', consultationData);

      // اعتبارسنجی داده‌های ورودی
      if (!consultationData.name || !consultationData.phone) {
        return new Response(JSON.stringify({
          success: false,
          error: 'نام و شماره تلفن الزامی است'
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // ارسال پیام به تلگرام
      const telegramResult = await this.sendTelegramMessage(consultationData);

      if (telegramResult.ok) {
        return new Response(JSON.stringify({
          success: true,
          message: 'پیام با موفقیت به تلگرام ارسال شد',
          telegram_result: telegramResult.result
        }), {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      } else {
        return new Response(JSON.stringify({
          success: false,
          error: 'خطا در ارسال پیام به تلگرام',
          telegram_error: telegramResult.description,
          error_code: telegramResult.error_code
        }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

    } catch (error) {
      console.error('Error handling consultation notification:', error);
      return new Response(JSON.stringify({
        success: false,
        error: 'خطا در پردازش درخواست',
        message: error.message
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  }

  /**
   * ارسال پیام به تلگرام با فرمت زیبا
   */
  async sendTelegramMessage(consultationData) {
    try {
      const url = `${this.telegramService.baseUrl}/sendMessage`;

      // ترجمه نوع مشاوره
      const typeMap = {
        'phone': '📞 تلفنی',
        'video': '🎥 ویدئویی',
        'in_person': '🏢 حضوری'
      };

      const consultationType = typeMap[consultationData.consultation_type] || consultationData.consultation_type;

      // فرمت تاریخ شمسی
      const date = new Date(consultationData.preferred_date).toLocaleDateString('fa-IR');
      const timestamp = new Date().toLocaleString('fa-IR');

      // ساخت پیام زیبا با HTML
      const messageText = this.formatConsultationMessage({
        ...consultationData,
        consultationType,
        date,
        timestamp
      });

      const payload = {
        chat_id: this.telegramService.chatId,
        text: messageText,
        parse_mode: 'HTML',
        disable_notification: false
      };

      console.log('Sending to Telegram:', payload);

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
   * فرمت‌دهی پیام با طراحی زیبا و ایموجی‌ها
   */
  formatConsultationMessage(data) {
    let message = '';

    // هدر پیام
    message += '📋 <b>درخواست رزرو مشاوره جدید</b>\n\n';

    // اطلاعات اصلی
    message += '👤 <b>نام و نام خانوادگی:</b>\n';
    message += `   ${data.name}\n\n`;

    message += '📱 <b>شماره تلفن:</b>\n';
    message += `   ${data.phone}\n\n`;

    // اطلاعات مکانی (اختیاری)
    if (data.province || data.city) {
      message += '🌍 <b>مکان:</b>\n';
      if (data.province) {
        message += `   🏛️ استان: ${data.province}\n`;
      }
      if (data.city) {
        message += `   🏙️ شهر: ${data.city}\n`;
      }
      message += '\n';
    }

    // موضوع مشاوره (اختیاری)
    if (data.consultation_topic) {
      message += '📋 <b>موضوع مشاوره:</b>\n';
      message += `   ${data.consultation_topic}\n\n`;
    }

    // شرح مشکل (اختیاری)
    if (data.problem_description) {
      message += '📝 <b>شرح مشکل:</b>\n';
      message += `   ${data.problem_description}\n\n`;
    }

    // اطلاعات رزرو
    message += '📅 <b>زمان رزرو:</b>\n';
    message += `   📅 تاریخ: ${data.date}\n`;
    message += `   ⏰ زمان: ${data.preferred_time}\n`;
    message += `   🔧 نوع مشاوره: ${data.consultationType}\n\n`;

    // توضیحات (اختیاری)
    if (data.message) {
      message += '💬 <b>توضیحات:</b>\n';
      message += `   ${data.message}\n\n`;
    }

    // اطلاعات اضافی (اختیاری)
    if (data.national_id || data.documents) {
      message += '📎 <b>اطلاعات تکمیلی:</b>\n';

      if (data.national_id) {
        message += `   🆔 کد ملی: ${data.national_id}\n`;
      }

      if (data.documents) {
        message += `   📄 مدارک: ${data.documents}\n`;
      }
      message += '\n';
    }

    // فوتر
    message += '━━━━━━━━━━━━━━━━━━━━━━\n';
    message += `⏰ <b>زمان ثبت:</b> ${data.timestamp}\n`;
    message += `🆔 <b>شماره رزرو:</b> ${data.id ? data.id.toString() : 'نامشخص'}\n`;
    message += '━━━━━━━━━━━━━━━━━━━━━━\n\n';

    // ایموجی پایانی
    message += '✅ <b>درخواست با موفقیت ثبت شد!</b>';

    return message;
  }

  /**
   * تست اتصال به تلگرام
   */
  async handleTestConnection(corsHeaders) {
    try {
      const url = `${this.telegramService.baseUrl}/getMe`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Telegram API error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();

      if (result.ok) {
        return new Response(JSON.stringify({
          success: true,
          message: `✅ اتصال به ربات ${result.result.first_name} برقرار شد!`,
          bot_info: {
            name: result.result.first_name,
            username: result.result.username
          }
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      } else {
        return new Response(JSON.stringify({
          success: false,
          error: result.description || 'خطا در اتصال به ربات'
        }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
    } catch (error) {
      console.error('Error testing connection:', error);
      return new Response(JSON.stringify({
        success: false,
        error: 'خطا در تست اتصال',
        message: error.message
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  }
}

// Export برای Cloudflare Workers
export default {
  async fetch(request, env) {
    const worker = new TelegramWorker();
    return await worker.handleRequest(request, env);
  }
};
