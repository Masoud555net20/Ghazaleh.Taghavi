/**
 * Cloudflare Worker برای مدیریت رزروهای مشاوره
 * این Worker با TiDB Cloud از طریق HTTP API کار می‌کند
 */

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    // تنظیم CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With, Accept, Origin, Access-Control-Request-Method, Access-Control-Request-Headers',
      'Access-Control-Max-Age': '86400',
    };

    // مدیریت preflight requests برای همه routes
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: corsHeaders,
        status: 200
      });
    }

    try {
    // Route handling
    if (path.startsWith('/api/consultations')) {
      return await handleConsultations(request, env, corsHeaders);
    }

    // مدیریت endpoint ساده برای tracking
    if (path.startsWith('/api/consultations/track')) {
      return await handleTracking(request, env, corsHeaders);
    }

    // endpoint عمومی برای فرم رزرو (بدون نیاز به احراز هویت)
    if (path.startsWith('/api/public/consultations')) {
      return await handlePublicConsultations(request, env, corsHeaders);
    }

      // 404 برای routes نامشخص
      return new Response(JSON.stringify({ error: 'Not Found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });

    } catch (error) {
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
}

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
    const { name, phone, consultation_type, preferred_date, preferred_time, message } = consultationData;

    if (!name || !phone || !consultation_type || !preferred_date || !preferred_time) {
      return new Response(JSON.stringify({
        success: false,
        error: 'لطفاً همه فیلدهای ضروری را تکمیل کنید'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // درج داده جدید
    const messageValue = message !== undefined ? message : '';

    await env.DB.prepare(`
      INSERT INTO consultations (name, phone, consultation_type, preferred_date, preferred_time, message, status)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).bind(name, phone, consultation_type, preferred_date, preferred_time, messageValue, 'pending').run();

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
      break;

    default:
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
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
    const { name, phone, consultation_type, preferred_date, preferred_time, message } = consultationData;

    if (!name || !phone || !consultation_type || !preferred_date || !preferred_time) {
      return new Response(JSON.stringify({
        success: false,
        error: 'لطفاً همه فیلدهای ضروری را تکمیل کنید'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // اعتبارسنجی اضافی برای فیلدهای متنی
    if (name.trim().length < 2) {
      return new Response(JSON.stringify({
        success: false,
        error: 'نام باید حداقل ۲ حرف باشد'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    if (phone.trim().length < 10) {
      return new Response(JSON.stringify({
        success: false,
        error: 'شماره تلفن باید حداقل ۱۰ رقم باشد'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // درج داده جدید
    const messageValue = message !== undefined ? message.trim() : '';

    await env.DB.prepare(`
      INSERT INTO consultations (name, phone, consultation_type, preferred_date, preferred_time, message, status)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).bind(name.trim(), phone.trim(), consultation_type, preferred_date, preferred_time, messageValue, 'pending').run();

    // دریافت آخرین رکورد درج شده
    const newConsultation = await env.DB.prepare(
      'SELECT * FROM consultations ORDER BY id DESC LIMIT 1'
    ).first();

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
      error: 'خطا در ذخیره داده‌ها در دیتابیس'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
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
