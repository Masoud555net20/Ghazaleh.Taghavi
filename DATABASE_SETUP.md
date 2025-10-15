# راه‌اندازی سیستم رزرو وقت مشاوره با Cloudflare D1

## مراحل راه‌اندازی

### ۱. راه‌اندازی Cloudflare D1 Database

1. وارد حساب [Cloudflare](https://dash.cloudflare.com) شوید
2. به بخش **Workers & Pages** بروید
3. روی **D1 Database** کلیک کنید
4. **Create database** را انتخاب کنید
5. نام دیتابیس را انتخاب کنید (مثلاً `consultation-db`)

### ۲. ایجاد جدول دیتابیس

پس از ایجاد دیتابیس، از بخش **Console** کوئری زیر را اجرا کنید:

```sql
CREATE TABLE consultations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  national_id TEXT, -- کد ملی برای احراز هویت و جلوگیری از رزروهای تکراری
  province TEXT, -- استان برای تعیین روش مشاوره حضوری یا آنلاین
  city TEXT, -- شهر برای تعیین روش مشاوره حضوری یا آنلاین
  consultation_type TEXT NOT NULL,
  consultation_topic TEXT, -- موضوع مشاوره (خانوادگی، کیفری، ملکی، کسب‌وکار)
  problem_description TEXT, -- شرح خلاصه مشکل حقوقی یا پرونده
  documents TEXT, -- لینک یا نام فایل مدارک آپلود شده
  preferred_date DATE NOT NULL,
  preferred_time TEXT NOT NULL,
  message TEXT,
  status TEXT DEFAULT 'pending',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### ۳. ایجاد Cloudflare Worker

1. در بخش **Workers & Pages** روی **Create Worker** کلیک کنید
2. نام Worker را انتخاب کنید (مثلاً `consultation-api`)
3. کد Worker را از فایل `worker.js` کپی کنید (این فایل را بعداً ایجاد می‌کنیم)

### ۴. اتصال Worker به D1 Database

در داشبورد Cloudflare:

1. به صفحه Worker خود بروید
2. بخش **Settings** را انتخاب کنید
3. به **Variables and Bindings** بروید
4. **Add binding** را انتخاب کنید
5. نوع **D1 Database** را انتخاب کنید
6. نام binding را `DB` بگذارید
7. دیتابیس خود را انتخاب کنید

### ۵. تنظیم متغیرهای محیطی

1. فایل `.env` را در پروژه ایجاد کنید:

```env
VITE_API_URL=https://your-worker-name.your-subdomain.workers.dev
VITE_GROQ_API_KEY=your_groq_api_key_here
```

2. `your-worker-name` را با نام واقعی Worker خود جایگزین کنید
3. `your-subdomain` را با subdomain واقعی خود جایگزین کنید

### ۶. استقرار Worker

```bash
# نصب Wrangler CLI (اگر نصب نیست)
npm install -g wrangler

# لاگین به Cloudflare
wrangler login

# انتشار Worker
wrangler deploy
```

## استفاده از سیستم

### مشاهده داده‌ها از داشبورد Cloudflare

1. به داشبورد Cloudflare بروید
2. بخش **Workers & Pages** > **D1 Database** را انتخاب کنید
3. روی دیتابیس خود کلیک کنید
4. از بخش **Console** کوئری‌های زیر را اجرا کنید:

```sql
-- دیدن همه رزروها
SELECT * FROM consultations;

-- دیدن رزروهای امروز
SELECT * FROM consultations
WHERE preferred_date = date('now');

-- دیدن رزروهای در انتظار
SELECT * FROM consultations
WHERE status = 'pending';

-- به‌روزرسانی وضعیت رزرو
UPDATE consultations
SET status = 'confirmed', updated_at = CURRENT_TIMESTAMP
WHERE id = 1;
```

### استفاده از کامپوننت ConsultationManager

کامپوننت `ConsultationManager` را در هر صفحه‌ای که می‌خواهید نمایش دهید، اضافه کنید:

```tsx
import ConsultationManager from './components/ConsultationManager';

// در کامپوننت خود استفاده کنید
<ConsultationManager />
```

## API Endpoints

سیستم API endpoints زیر را ارائه می‌دهد:

- `GET /api/consultations` - دریافت همه رزروها
- `POST /api/consultations` - ایجاد رزرو جدید
- `GET /api/consultations/:id` - دریافت یک رزرو خاص

## ساختار داده‌ها

```typescript
interface Consultation {
  id?: number;
  name: string;
  phone: string;
  national_id?: string; // کد ملی برای احراز هویت و جلوگیری از رزروهای تکراری
  province?: string; // استان برای تعیین روش مشاوره حضوری یا آنلاین
  city?: string; // شهر برای تعیین روش مشاوره حضوری یا آنلاین
  consultation_type: 'in-person' | 'phone' | 'online';
  consultation_topic?: string; // موضوع مشاوره (خانوادگی، کیفری، ملکی، کسب‌وکار)
  problem_description?: string; // شرح خلاصه مشکل حقوقی یا پرونده
  documents?: string; // لینک یا نام فایل مدارک آپلود شده
  preferred_date: string; // YYYY-MM-DD format
  preferred_time: string;
  message?: string;
  status?: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  created_at?: string;
  updated_at?: string;
}
```

## نکات مهم

1. **امنیت**: Worker را طوری تنظیم کنید که فقط از دامنه‌های مجاز درخواست قبول کند
2. **CORS**: هدرهای CORS مناسب برای اتصال از frontend تنظیم کنید
3. **Error Handling**: خطاها را به خوبی مدیریت کنید
4. **Rate Limiting**: محدودیت تعداد درخواست‌ها را در نظر بگیرید

## عیب‌یابی

### خطاهای رایج

1. **CORS Error**: مطمئن شوید که Worker هدرهای CORS مناسب ارسال می‌کند
2. **Database Connection Error**: اتصال Worker به D1 را بررسی کنید
3. **Environment Variables**: مطمئن شوید که `.env` درست تنظیم شده است

### لاگ‌ها

لاگ‌های Worker را از داشبورد Cloudflare بخش **Logs** ببینید.
