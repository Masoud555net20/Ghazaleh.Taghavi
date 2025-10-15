// تعریف interfaceهای اصلی برنامه

// interface رزرو وقت مشاوره
export interface Consultation {
  id?: number;
  name: string;
  phone: string;
  national_id?: string; // کد ملی برای احراز هویت
  province?: string; // استان برای تعیین روش مشاوره
  city?: string; // شهر برای تعیین روش مشاوره
  consultation_type: string;
  consultation_topic?: string; // موضوع مشاوره (خانوادگی، کیفری، ملکی، کسب‌وکار)
  problem_description?: string; // شرح خلاصه مشکل حقوقی یا پرونده
  documents?: string; // لینک یا نام فایل مدارک آپلود شده
  preferred_date: string;
  preferred_time: string;
  message?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

// interface برای موضوعات مشاوره
export interface ConsultationTopic {
  id: string;
  title: string;
  description?: string;
}

// interface برای استان‌ها و شهرها
export interface Province {
  id: string;
  name: string;
  cities: string[];
}

// interface برای آپلود فایل
export interface UploadedFile {
  name: string;
  size: number;
  type: string;
  url?: string;
}
