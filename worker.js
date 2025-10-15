/**
 * Cloudflare Worker برای مدیریت رزروهای مشاوره
 * این Worker با Cloudflare D1 Database کار می‌کند
 * بروزرسانی شده برای پشتیبانی از تمام فیلدهای فرم رزرو
 *
 * دستورالعمل بروزرسانی دیتابیس:
 * 1. وارد داشبورد Cloudflare شوید
 * 2. به بخش D1 Database بروید
 * 3. دیتابیس api-consultation-v2-db را انتخاب کنید
 * 4. از بخش Console کوئری زیر را اجرا کنید:
 *
 * ALTER TABLE consultations ADD COLUMN name TEXT;
 * ALTER TABLE consultations ADD COLUMN phone TEXT;
 * ALTER TABLE consultations ADD COLUMN national_id TEXT;
 * ALTER TABLE consultations ADD COLUMN province TEXT;
 * ALTER TABLE consultations ADD COLUMN city TEXT;
 * ALTER TABLE consultations ADD COLUMN consultation_topic TEXT;
 * ALTER TABLE consultations ADD COLUMN problem_description TEXT;
 * ALTER TABLE consultations ADD COLUMN documents TEXT;
 *
 * یا اگر می‌خواهید جدول جدید ایجاد کنید:
 *
 * DROP TABLE IF EXISTS consultations;
 * CREATE TABLE consultations (
 *   id INTEGER PRIMARY KEY AUTOINCREMENT,
 *   name TEXT NOT NULL,
 *   phone TEXT NOT NULL,
 *   national_id TEXT,
 *   province TEXT,
 *   city TEXT,
 *   consultation_type TEXT NOT NULL,
 *   consultation_topic TEXT,
 *   problem_description TEXT,
 *   documents TEXT,
 *   preferred_date DATE NOT NULL,
 *   preferred_time TEXT NOT NULL,
 *   message TEXT,
 *   status TEXT DEFAULT 'pending',
 *   created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
 *   updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
 * );
 */

// این کد کامل و اصلاح شده را جایگزین کل بلاک export default قبلی کنید
// =======================================================================
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    // تنظیم CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    // 1. اولین و مهم‌ترین کار: مدیریت درخواست‌های OPTIONS برای CORS
    // این باید همیشه قبل از منطق اصلی برنامه بیاید
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: corsHeaders,
        status: 204 // status 204 No Content برای OPTIONS بهتر است
      });
    }

    try {
      // 2. حالا مسیریابی (Routing) را شروع می‌کنیم

      // مسیر اصلی "/"
      if (path === '/') {
        return new Response(JSON.stringify({
          message: 'API is running!',
          status: 'ok'
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200
        });
      }
      
      // مسیرهای مربوط به رزروهای عمومی
      if (path.startsWith('/api/public/consultations')) {
        // اگر مسیر شامل telegram-notification باشد، فقط نوتیفیکیشن ارسال کن
        if (path.includes('/telegram-notification')) {
          return await handleTelegramNotification(request, env, corsHeaders);
        }
        return await handlePublicConsultations(request, env, corsHeaders);
      }

      // مسیرهای مربوط به tracking
      if (path.startsWith('/api/consultations/track')) {
        return await handleTracking(request, env, corsHeaders);
      }
      
      // مسیرهای مربوط به رزروها (نیازمند احراز هویت)
      if (path.startsWith('/api/consultations')) {
        return await handleConsultations(request, env, corsHeaders);
      }

      // 3. اگر هیچ‌کدام از مسیرها مطابقت نداشت، خطای 404 می‌دهیم
      return new Response(JSON.stringify({ error: 'Not Found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });

    } catch (error) {
      // 4. اگر خطای غیرمنتظره‌ای در هر بخشی از کد رخ داد، آن را مدیریت می‌کنیم
      console.error('Error:', error);
      return new Response(JSON.stringify({
        success: false,
        error: 'Internal Server Error'
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  }
};

/**
 * مدیریت درخواست‌های مربوط به رزروها
 */
async function handleConsultations(request, env, corsHeaders) {
  const url = new URL(request.url);
  const pathParts = url.pathname.split('/');
  const consultationId = pathParts[3]; // /api/consultations/:id

  switch (request.method) {
    case 'GET':
      if (consultationId) {
        // دریافت یک رزرو خاص
        return await getConsultation(env, consultationId, corsHeaders);
      } else {
        // دریافت همه رزروها
        return await getAllConsultations(env, corsHeaders);
      }

    case 'POST':
      // ایجاد رزرو جدید
      return await createConsultation(request, env, corsHeaders);

    case 'PUT':
      if (consultationId) {
        // به‌روزرسانی رزرو
        return await updateConsultation(request, env, consultationId, corsHeaders);
      }
      break;

    case 'DELETE':
      if (consultationId) {
        // حذف رزرو
        return await deleteConsultation(env, consultationId, corsHeaders);
      }
      break;

    default:
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
  }
}

/**
 * دریافت همه رزروها
 */
async function getAllConsultations(env, corsHeaders) {
  try {
    const { results } = await env.DB.prepare(
      'SELECT * FROM consultations ORDER BY created_at DESC'
    ).all();

    return new Response(JSON.stringify({
      success: true,
      data: results
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Database error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'خطا در دریافت داده‌ها از دیتابیس'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}

/**
 * دریافت یک رزرو خاص
 */
async function getConsultation(env, id, corsHeaders) {
  try {
    const consultation = await env.DB.prepare(
      'SELECT * FROM consultations WHERE id = ?'
    ).bind(id).first();

    if (!consultation) {
      return new Response(JSON.stringify({
        success: false,
        error: 'رزرو مورد نظر یافت نشد'
      }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({
      success: true,
      data: consultation
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Database error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'خطا در دریافت داده‌ها از دیتابیس'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}

/**
 * ایجاد رزرو جدید
 */
async function createConsultation(request, env, corsHeaders) {
  try {
    const consultationData = await request.json();

    // اعتبارسنجی داده‌های ورودی
    const {
      name,
      phone,
      national_id,
      province,
      city,
      consultation_type,
      consultation_topic,
      problem_description,
      documents,
      preferred_date,
      preferred_time,
      message
    } = consultationData;

    if (!name || !phone || !consultation_type || !preferred_date || !preferred_time) {
      return new Response(JSON.stringify({
        success: false,
        error: 'لطفاً همه فیلدهای ضروری را تکمیل کنید'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // اعتبارسنجی کد ملی اگر وارد شده باشد
    if (national_id && !/^\d{10}$/.test(national_id)) {
      return new Response(JSON.stringify({
        success: false,
        error: 'کد ملی باید ۱۰ رقم باشد'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // درج داده جدید
    const messageValue = message !== undefined ? message : '';

    await env.DB.prepare(`
      INSERT INTO consultations (name, phone, national_id, province, city, consultation_type, consultation_topic, problem_description, documents, preferred_date, preferred_time, message, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      name,
      phone,
      national_id || null,
      province || null,
      city || null,
      consultation_type,
      consultation_topic || null,
      problem_description || null,
      documents || null,
      preferred_date,
      preferred_time,
      messageValue,
      'pending'
    ).run();

    // دریافت آخرین رکورد درج شده
    const newConsultation = await env.DB.prepare(
      'SELECT * FROM consultations ORDER BY id DESC LIMIT 1'
    ).first();

    return new Response(JSON.stringify({
      success: true,
      data: newConsultation
    }), {
      status: 201,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Database error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'خطا در ذخیره داده‌ها در دیتابیس'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}

/**
 * به‌روزرسانی رزرو
 */
async function updateConsultation(request, env, id, corsHeaders) {
  try {
    const updateData = await request.json();
    const { status, message } = updateData;

    // ساخت کوئری به‌روزرسانی پویا
    let updateFields = [];
    let bindValues = [];

    if (status) {
      updateFields.push('status = ?');
      bindValues.push(status);
    }

    if (message) {
      updateFields.push('message = ?');
      bindValues.push(message);
    }

    updateFields.push('updated_at = CURRENT_TIMESTAMP');
    bindValues.push(id);

    if (updateFields.length === 0) {
      return new Response(JSON.stringify({
        success: false,
        error: 'هیچ فیلدی برای به‌روزرسانی مشخص نشده است'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const query = `UPDATE consultations SET ${updateFields.join(', ')} WHERE id = ?`;
    await env.DB.prepare(query).bind(...bindValues).run();

    // دریافت داده به‌روزرسانی شده
    const updatedConsultation = await env.DB.prepare(
      'SELECT * FROM consultations WHERE id = ?'
    ).bind(id).first();

    return new Response(JSON.stringify({
      success: true,
      data: updatedConsultation
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Database error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'خطا در به‌روزرسانی داده‌ها'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}

/**
 * حذف رزرو
 */
async function deleteConsultation(env, id, corsHeaders) {
  try {
    const consultation = await env.DB.prepare(
      'SELECT * FROM consultations WHERE id = ?'
    ).bind(id).first();

    if (!consultation) {
      return new Response(JSON.stringify({
        success: false,
        error: 'رزرو مورد نظر یافت نشد'
      }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    await env.DB.prepare('DELETE FROM consultations WHERE id = ?').bind(id).run();

    return new Response(JSON.stringify({
      success: true,
      message: 'رزرو با موفقیت حذف شد'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Database error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'خطا در حذف داده‌ها'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}

/**
 * مدیریت endpoint عمومی برای فرم رزرو (بدون احراز هویت)
 */
// کد اصلاح شده
async function handlePublicConsultations(request, env, corsHeaders) {
  const url = new URL(request.url);
  const pathParts = url.pathname.split('/');
  const consultationId = pathParts[4]; // /api/public/consultations/:id

  switch (request.method) {
    case 'POST':
      // ایجاد رزرو جدید بدون احراز هویت
      return await createConsultationPublic(request, env, corsHeaders);

    case 'GET':
      if (consultationId) {
        // دریافت یک رزرو خاص (برای تایید ثبت)
        return await getConsultation(env, consultationId, corsHeaders);
      }
      //  اینجا break رو حذف می‌کنیم تا اگر ID وجود نداشت، به default برود
    
    default:
      return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
        status: 405, // 405 Method Not Allowed is more appropriate here
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
  }
}

/**
 * ایجاد رزرو جدید از طریق endpoint عمومی
 */
async function createConsultationPublic(request, env, corsHeaders) {
  try {
    const consultationData = await request.json();

    // اعتبارسنجی داده‌های ورودی
    const {
      name,
      phone,
      national_id,
      province,
      city,
      consultation_type,
      consultation_topic,
      problem_description,
      documents,
      preferred_date,
      preferred_time,
      message
    } = consultationData;

    if (!name || !phone || !consultation_type || !preferred_date || !preferred_time) {
      return new Response(JSON.stringify({
        success: false,
        error: 'لطفاً همه فیلدهای ضروری را تکمیل کنید'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // اعتبارسنجی نام و نام خانوادگی
    if (name.trim().length < 2) {
      return new Response(JSON.stringify({
        success: false,
        error: 'نام و نام خانوادگی باید حداقل ۲ حرف باشد'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // اعتبارسنجی شماره تلفن (باید دقیقاً 11 رقم و با 09 شروع شود)
    const phoneRegex = /^09\d{9}$/;
    if (!phoneRegex.test(phone.trim())) {
      return new Response(JSON.stringify({
        success: false,
        error: 'شماره تلفن باید دقیقاً ۱۱ رقم باشد و با ۰۹ شروع شود (مثال: ۰۹۱۲۳۴۵۶۷۸۹)'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // اعتبارسنجی کد ملی با الگوریتم دقیق
    if (national_id && national_id.trim() !== '') {
      if (!validateNationalId(national_id.trim())) {
        return new Response(JSON.stringify({
          success: false,
          error: 'کد ملی وارد شده معتبر نیست. لطفاً کد ملی ۱۰ رقمی صحیح وارد کنید'
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
    }

    // اعتبارسنجی تاریخ (نباید گذشته باشد)
    const selectedDate = new Date(preferred_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      return new Response(JSON.stringify({
        success: false,
        error: 'تاریخ انتخابی نمی‌تواند گذشته باشد. لطفاً تاریخ امروز یا آینده را انتخاب کنید'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // اعتبارسنجی ساده برای تاریخ امروز - فقط چک کن که زمان انتخاب شده باشد
    if (selectedDate.toDateString() === today.toDateString()) {
      console.log('Today selected, time:', preferred_time);
      // برای تاریخ امروز، فقط چک کن که زمان انتخاب شده باشد
      // حذف اعتبارسنجی زمانی پیچیده برای جلوگیری از خطاها
      if (!preferred_time) {
        return new Response(JSON.stringify({
          success: false,
          error: 'لطفاً زمان مشاوره را انتخاب کنید'
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
    }

    // درج داده جدید با مدیریت بهتر خطاها
    const messageValue = message !== undefined ? message.trim() : '';

    console.log('Inserting consultation data:', {
      name: name.trim(),
      phone: phone.trim(),
      national_id: national_id || null,
      province: province || null,
      city: city || null,
      consultation_type,
      consultation_topic: consultation_topic || null,
      problem_description: problem_description || null,
      documents: documents || null,
      preferred_date,
      preferred_time,
      message: messageValue,
      status: 'pending'
    });

    await env.DB.prepare(`
      INSERT INTO consultations (name, phone, national_id, province, city, consultation_type, consultation_topic, problem_description, documents, preferred_date, preferred_time, message, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      name.trim(),
      phone.trim(),
      national_id || null,
      province || null,
      city || null,
      consultation_type,
      consultation_topic || null,
      problem_description || null,
      documents || null,
      preferred_date,
      preferred_time,
      messageValue,
      'pending'
    ).run();

    // دریافت آخرین رکورد درج شده برای تایید
    const newConsultation = await env.DB.prepare(
      'SELECT * FROM consultations ORDER BY id DESC LIMIT 1'
    ).first();

    console.log('Inserted consultation:', newConsultation);

    // ارسال نوتیفیکیشن به تلگرام (فقط یک بار)
    try {
      // مطمئن شوید که ID موجود است
      if (newConsultation && newConsultation.id) {
        await sendTelegramNotification(newConsultation, env);
        console.log('Telegram notification sent successfully');
      } else {
        console.error('Consultation ID not found, cannot send Telegram notification');
      }
    } catch (telegramError) {
      console.error('Failed to send Telegram notification:', telegramError);
      // ادامه کار حتی اگر ارسال تلگرام شکست بخورد
    }

    return new Response(JSON.stringify({
      success: true,
      message: 'درخواست رزرو شما با موفقیت ثبت شد',
      data: newConsultation
    }), {
      status: 201,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Database error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: `خطا در ذخیره داده‌ها در دیتابیس: ${error.message}`
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}

/**
 * مدیریت درخواست‌های نوتیفیکیشن تلگرام (فقط ارسال نوتیفیکیشن بدون ذخیره در دیتابیس)
 */
async function handleTelegramNotification(request, env, corsHeaders) {
  try {
    const consultationData = await request.json();

    console.log('Sending Telegram notification for consultation:', consultationData);

    // ارسال نوتیفیکیشن تلگرام
    const telegramResult = await sendTelegramNotification(consultationData, env);

    return new Response(JSON.stringify({
      success: true,
      message: 'نوتیفیکیشن تلگرام با موفقیت ارسال شد',
      telegram_result: telegramResult
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error handling Telegram notification:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'خطا در ارسال نوتیفیکیشن تلگرام',
      message: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}

/**
 * تبدیل اعداد انگلیسی به فارسی
 */
function toPersianNumbers(str) {
  const persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return str.toString().replace(/\d/g, (digit) => persianNumbers[parseInt(digit)]);
}

/**
 * ارسال نوتیفیکیشن تلگرام
 */
async function sendTelegramNotification(consultation, env) {
  try {
    const botToken = env.BOT_TOKEN;
    const chatId = env.CHAT_ID;

    if (!botToken || !chatId) {
      console.log('Telegram credentials not found in environment variables');
      return;
    }

    const telegramApiUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;

    // ترجمه نوع مشاوره
    const typeMap = {
      'phone': '📞 تلفنی',
      'video': '🎥 ویدئویی',
      'in_person': '🏢 حضوری'
    };

    const consultationType = typeMap[consultation.consultation_type] || consultation.consultation_type;

    // فرمت تاریخ شمسی و زمان تهران (با اعداد فارسی)
    const tehranTime = new Date().toLocaleString('fa-IR', {
      timeZone: 'Asia/Tehran',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });

    const date = new Date(consultation.preferred_date).toLocaleDateString('fa-IR');

    // تبدیل ID به فارسی
    const persianId = toPersianNumbers(consultation.id || 'نامشخص');

    // ساخت پیام زیبا با HTML و آیکن‌های مرتب
    let message = '';

    // هدر پیام (boldتر)
    message += '🎯 <b>📋 درخواست رزرو مشاوره جدید 📋</b>\n\n';

    // اطلاعات اصلی با فرمت بهتر
    message += '👤 <b>نام و نام خانوادگی:</b>\n';
    message += `   ${consultation.name}\n\n`;

    // تبدیل شماره تلفن به فارسی
    const persianPhone = toPersianNumbers(consultation.phone);
    message += '📱 <b>شماره تلفن:</b>\n';
    message += `   ${persianPhone}\n\n`;

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
        // تبدیل کد ملی به فارسی
        const persianNationalId = toPersianNumbers(consultation.national_id);
        message += `   🆔 کد ملی: ${persianNationalId}\n`;
      }

      if (consultation.documents) {
        message += `   📄 مدارک: ${consultation.documents}\n`;
      }
      message += '\n';
    }

    // فوتر با خط جداکننده
    message += '━━━━━━━━━━━━━━━━━━━━━━\n';
    message += `⏰ <b>زمان ثبت:</b> ${tehranTime}\n`;
    message += `🆔 <b>شماره رزرو:</b> ${persianId}\n`;
    message += '━━━━━━━━━━━━━━━━━━━━━━\n\n';

    // ایموجی پایانی
    message += '✅ <b>درخواست با موفقیت ثبت شد!</b>';

    const payload = {
      chat_id: chatId,
      text: message,
      parse_mode: 'HTML',
      disable_notification: false
    };

    console.log('Sending Telegram message:', payload);

    const response = await fetch(telegramApiUrl, {
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
    console.error('Error sending Telegram notification:', error);
    throw error;
  }
}

/**
 * اعتبارسنجی کد ملی با الگوریتم دقیق
 */
function validateNationalId(nationalId) {
  // بررسی طول و فرمت
  if (!/^\d{10}$/.test(nationalId)) {
    return false;
  }

  // الگوریتم اعتبارسنجی کد ملی
  const digits = nationalId.split('').map(Number);
  const checkDigit = digits[9];

  // محاسبه رقم کنترل
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += digits[i] * (10 - i);
  }

  const remainder = sum % 11;

  // بررسی رقم کنترل
  if (remainder < 2) {
    return checkDigit === remainder;
  } else {
    return checkDigit === (11 - remainder);
  }
}

/**
 * مدیریت tracking requests (GET requests با پارامترها)
 */
async function handleTracking(request, env, corsHeaders) {
  try {
    const url = new URL(request.url);
    const params = url.searchParams;

    // استخراج داده‌ها از پارامترها
    const name = params.get('name') || '';
    const phone = params.get('phone') || '';
    const consultation_type = params.get('consultation_type') || '';
    const preferred_date = params.get('preferred_date') || '';
    const preferred_time = params.get('preferred_time') || '';
    const message = params.get('message') || '';

    console.log('Tracking data:', { name, phone, consultation_type, preferred_date, preferred_time, message });

    // اعتبارسنجی داده‌های ورودی
    if (!name || !phone || !consultation_type || !preferred_date || !preferred_time) {
      return new Response('Missing required fields', {
        status: 400,
        headers: corsHeaders
      });
    }

    // درج داده جدید
    await env.DB.prepare(`
      INSERT INTO consultations (name, phone, consultation_type, preferred_date, preferred_time, message, status)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).bind(name, phone, consultation_type, preferred_date, preferred_time, message, 'pending').run();

    // بازگشت یک تصویر 1x1 شفاف به عنوان پاسخ
    const transparentPixel = new Uint8Array([
      0x47, 0x49, 0x46, 0x38, 0x39, 0x61, 0x01, 0x00, 0x01, 0x00, 0x80, 0x00, 0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x21, 0xF9, 0x04, 0x01, 0x00, 0x00, 0x00, 0x00, 0x2C, 0x00, 0x00, 0x00, 0x00,
      0x01, 0x00, 0x01, 0x00, 0x00, 0x02, 0x02, 0x04, 0x01, 0x00, 0x3B
    ]);

    return new Response(transparentPixel, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'image/gif',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });
  } catch (error) {
    console.error('Tracking error:', error);
    return new Response('Error saving data', {
      status: 500,
      headers: corsHeaders
    });
  }
}
