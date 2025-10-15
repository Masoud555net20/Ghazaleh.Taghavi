import React, { useRef, useEffect } from 'react';
import axios from 'axios';
import { consultationService } from '../services/consultationService';

// تعریف interface برای خطاها
interface ValidationErrors {
  name?: string;
  phone?: string;
  national_id?: string;
  preferred_date?: string;
  preferred_time?: string;
  consultation_topic?: string;
}

// تعریف props برای کامپوننت فرم
interface ConsultationFormProps {
  consultation?: Consultation | null;
  onClose: () => void;
  onSave: () => void;
  apiUrl: string;
}

// تعریف interfaceها
interface Consultation {
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

// interface برای موضوعات مشاوره
interface ConsultationTopic {
  id: string;
  title: string;
  description?: string;
}

// interface برای استان‌ها و شهرها
interface Province {
  id: string;
  name: string;
  cities: string[];
}

// کامپوننت فرم رزرو
const ConsultationForm = ({ consultation, onClose, onSave, apiUrl }: ConsultationFormProps) => {
  // Stateهای فرم
  const [formData, setFormData] = React.useState({
    name: '',
    phone: '',
    national_id: '',
    province: '',
    city: '',
    consultation_type: 'phone',
    consultation_topic: '',
    problem_description: '',
    documents: '',
    preferred_date: '',
    preferred_time: '',
    message: ''
  });
  const [loading, setLoading] = React.useState(false);
  const [errors, setErrors] = React.useState<ValidationErrors>({});

  // Refs برای کنترل focus
  const nameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const timeRef = useRef<HTMLInputElement>(null);
  const topicRef = useRef<HTMLSelectElement>(null);
  const nationalIdRef = useRef<HTMLInputElement>(null);

  // مقداردهی اولیه فرم
  React.useEffect(() => {
    if (consultation) {
      setFormData({
        name: consultation.name || '',
        phone: consultation.phone || '',
        national_id: consultation.national_id || '',
        province: consultation.province || '',
        city: consultation.city || '',
        consultation_type: consultation.consultation_type || 'phone',
        consultation_topic: consultation.consultation_topic || '',
        problem_description: consultation.problem_description || '',
        documents: consultation.documents || '',
        preferred_date: consultation.preferred_date || '',
        preferred_time: consultation.preferred_time || '',
        message: consultation.message || ''
      });
    } else {
      // تنظیم تاریخ امروز به عنوان پیش‌فرض با فرمت صحیح
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      const todayFormatted = `${year}-${month}-${day}`;

      console.log('📅 تاریخ امروز تنظیم شده:', todayFormatted);

      setFormData({
        name: '',
        phone: '',
        national_id: '',
        province: '',
        city: '',
        consultation_type: 'phone',
        consultation_topic: '',
        problem_description: '',
        documents: '',
        preferred_date: todayFormatted,
        preferred_time: '',
        message: ''
      });
    }
  }, [consultation]);

  // تغییر مقادیر فرم با اعتبارسنجی سخت‌گیرانه
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // اعتبارسنجی سخت‌گیرانه بلادرنگ
    validateField(field, value);
  };

  // هندل تغییر نام با اعتبارسنجی سخت‌گیرانه
  const handleNameChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      name: value
    }));

    if (!value.trim()) {
      setErrors(prev => ({ ...prev, name: 'نام و نام خانوادگی الزامی است' }));
    } else if (value.trim().length < 2) {
      setErrors(prev => ({ ...prev, name: 'نام باید حداقل ۲ حرف باشد' }));
    } else if (!/^[\u0600-\u06FF\s]+$/.test(value.trim())) {
      setErrors(prev => ({ ...prev, name: 'نام باید فقط شامل حروف فارسی باشد' }));
    } else {
      setErrors(prev => ({ ...prev, name: undefined }));
    }
  };

  // هندل رویدادهای صفحه کلید برای نام
  const handleNameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Tab' && errors.name) {
      e.preventDefault();
      nameRef.current?.focus();
    }
  };

  // هندل تغییر شماره تلفن با اعتبارسنجی سخت‌گیرانه
  const handlePhoneChange = (value: string) => {
    // فقط اجازه ورود اعداد بده
    const numericValue = value.replace(/\D/g, '');

    setFormData(prev => ({
      ...prev,
      phone: numericValue
    }));

    if (!numericValue) {
      setErrors(prev => ({ ...prev, phone: 'شماره تلفن الزامی است' }));
    } else if (numericValue.length < 11) {
      setErrors(prev => ({ ...prev, phone: 'شماره تلفن باید ۱۱ رقم باشد' }));
    } else if (!/^09\d{9}$/.test(numericValue)) {
      setErrors(prev => ({ ...prev, phone: 'شماره تلفن باید با ۰۹ شروع شود' }));
    } else {
      setErrors(prev => ({ ...prev, phone: undefined }));
    }
  };

  // هندل رویدادهای صفحه کلید برای شماره تلفن
  const handlePhoneKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Tab' && errors.phone) {
      e.preventDefault();
      phoneRef.current?.focus();
    }
  };

  // هندل تغییر کد ملی با اعتبارسنجی سخت‌گیرانه
  const handleNationalIdChange = (value: string) => {
    // فقط اجازه ورود اعداد بده
    const numericValue = value.replace(/\D/g, '');

    setFormData(prev => ({
      ...prev,
      national_id: numericValue
    }));

    if (numericValue && numericValue.length > 0) {
      if (numericValue.length < 10) {
        setErrors(prev => ({ ...prev, national_id: 'کد ملی باید ۱۰ رقم باشد' }));
      } else if (!validateNationalId(numericValue)) {
        setErrors(prev => ({ ...prev, national_id: 'کد ملی وارد شده معتبر نیست' }));
      } else {
        setErrors(prev => ({ ...prev, national_id: undefined }));
      }
    } else {
      setErrors(prev => ({ ...prev, national_id: undefined }));
    }
  };

  // هندل رویدادهای صفحه کلید برای کد ملی
  const handleNationalIdKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Tab' && errors.national_id) {
      e.preventDefault();
      nationalIdRef.current?.focus();
    }
  };

  // هندل تغییر تاریخ با اعتبارسنجی سخت‌گیرانه
  const handleDateChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      preferred_date: value,
      preferred_time: '' // ریست زمان وقتی تاریخ تغییر می‌کنه
    }));

    if (!value) {
      setErrors(prev => ({ ...prev, preferred_date: 'لطفا تاریخ برای روزهای بعد از امروز ثبت گردد' }));
    } else {
      const selectedDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        setErrors(prev => ({ ...prev, preferred_date: 'لطفا تاریخ برای روزهای بعد از امروز ثبت گردد' }));
      } else {
        setErrors(prev => ({ ...prev, preferred_date: undefined }));
      }
    }
  };

  // هندل رویدادهای صفحه کلید برای تاریخ
  const handleDateKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Tab' && errors.preferred_date) {
      e.preventDefault();
      // فوکوس روی همین فیلد می‌ماند
    }
  };

  // هندل تغییر زمان با اعتبارسنجی سخت‌گیرانه
  const handleTimeChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      preferred_time: value
    }));

    if (!value) {
      setErrors(prev => ({ ...prev, preferred_time: 'انتخاب زمان الزامی است' }));
    } else if (formData.preferred_date) {
      // بررسی فرمت زمان - اگر شامل ':' باشد، فرمت 24 ساعته است
      let time24 = '';
      if (value.includes(':')) {
        // فرمت 24 ساعته از input زمان (مثل "23:30")
        time24 = value;
      } else {
        // فرمت بازه زمانی که نیاز به تبدیل دارد (مثل "۱۰ الی ۱۲")
        time24 = convertTimeTo24HourFormat(value);
      }

      if (!time24) {
        setErrors(prev => ({ ...prev, preferred_time: 'فرمت زمان اشتباه است' }));
        return;
      }

      // اعتبارسنجی فرمت زمان (باید HH:MM باشد)
      const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
      if (!timeRegex.test(time24)) {
        setErrors(prev => ({ ...prev, preferred_time: 'فرمت زمان اشتباه است' }));
        return;
      }

      const selectedDate = new Date(formData.preferred_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate.toDateString() === today.toDateString()) {
        const currentTime = today.toTimeString().slice(0, 5);
        if (time24 <= currentTime) {
          setErrors(prev => ({ ...prev, preferred_time: 'زمان انتخابی باید بعد از زمان فعلی باشد' }));
        } else {
          setErrors(prev => ({ ...prev, preferred_time: undefined }));
        }
      } else {
        setErrors(prev => ({ ...prev, preferred_time: undefined }));
      }
    }
  };

  // هندل رویدادهای صفحه کلید برای زمان
  const handleTimeKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Tab' && errors.preferred_time) {
      e.preventDefault();
      timeRef.current?.focus();
    }
  };

  // هندل تغییر موضوع مشاوره با اعتبارسنجی سخت‌گیرانه
  const handleTopicChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      consultation_topic: value
    }));

    if (!value.trim()) {
      setErrors(prev => ({ ...prev, consultation_topic: 'انتخاب موضوع مشاوره الزامی است' }));
    } else {
      setErrors(prev => ({ ...prev, consultation_topic: undefined }));
    }
  };

  // هندل رویدادهای صفحه کلید برای موضوع مشاوره
  const handleTopicKeyDown = (e: React.KeyboardEvent<HTMLSelectElement>) => {
    if (e.key === 'Tab' && errors.consultation_topic) {
      e.preventDefault();
      topicRef.current?.focus();
    }
  };

  // اعتبارسنجی بلادرنگ فیلدهای انفرادی
  const validateField = (field: string, value: string) => {
    const newErrors = { ...errors };

    switch (field) {
      case 'name':
        if (!value.trim()) {
          newErrors.name = 'نام و نام خانوادگی الزامی است';
        } else if (value.trim().length < 2) {
          newErrors.name = 'نام باید حداقل ۲ حرف باشد';
        } else if (!/^[\u0600-\u06FF\s]+$/.test(value.trim())) {
          newErrors.name = 'نام باید فقط شامل حروف فارسی باشد';
        } else {
          delete newErrors.name;
        }
        break;

      case 'phone':
        if (!value.trim()) {
          newErrors.phone = 'شماره تلفن الزامی است';
        } else if (!/^09\d{9}$/.test(value.trim())) {
          newErrors.phone = 'شماره تلفن باید ۱۱ رقم باشد و با ۰۹ شروع شود';
        } else {
          delete newErrors.phone;
        }
        break;

      case 'national_id':
        if (value && value.trim() && !/^\d{10}$/.test(value.trim())) {
          newErrors.national_id = 'کد ملی باید ۱۰ رقم باشد';
        } else if (value && value.trim() && !validateNationalId(value.trim())) {
          newErrors.national_id = 'کد ملی وارد شده معتبر نیست';
        } else {
          delete newErrors.national_id;
        }
        break;

      case 'preferred_date':
        if (!value) {
          newErrors.preferred_date = 'انتخاب تاریخ الزامی است';
        } else {
          const selectedDate = new Date(value + 'T00:00:00');
          const today = new Date();
          today.setHours(0, 0, 0, 0);

          console.log('📅 تاریخ انتخابی:', selectedDate);
          console.log('📅 تاریخ امروز:', today);
          console.log('📅 مقایسه:', selectedDate >= today);

          if (selectedDate < today) {
            newErrors.preferred_date = 'لطفا تاریخ برای روزهای بعد از امروز ثبت گردد';
          } else {
            delete newErrors.preferred_date;
          }
        }
        break;

      case 'preferred_time':
        if (!value) {
          newErrors.preferred_time = 'انتخاب زمان الزامی است';
        } else if (formData.preferred_date) {
          // بررسی فرمت زمان - اگر شامل ':' باشد، فرمت 24 ساعته است
          let time24 = '';
          if (value.includes(':')) {
            // فرمت 24 ساعته از input زمان (مثل "23:30")
            time24 = value;
          } else {
            // فرمت بازه زمانی که نیاز به تبدیل دارد (مثل "۱۰ الی ۱۲")
            time24 = convertTimeTo24HourFormat(value);
          }

          if (!time24) {
            newErrors.preferred_time = 'فرمت زمان اشتباه است';
            break;
          }

          // اعتبارسنجی فرمت زمان (باید HH:MM باشد)
          const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
          if (!timeRegex.test(time24)) {
            newErrors.preferred_time = 'فرمت زمان اشتباه است';
            break;
          }

          const selectedDate = new Date(formData.preferred_date);
          const today = new Date();
          today.setHours(0, 0, 0, 0);

          if (selectedDate.toDateString() === today.toDateString()) {
            const currentTime = today.toTimeString().slice(0, 5);
            if (time24 <= currentTime) {
              newErrors.preferred_time = 'زمان انتخابی باید بعد از زمان فعلی باشد';
            } else {
              delete newErrors.preferred_time;
            }
          } else {
            delete newErrors.preferred_time;
          }
        }
        break;

      case 'consultation_topic':
        if (!value.trim()) {
          newErrors.consultation_topic = 'انتخاب موضوع مشاوره الزامی است';
        } else {
          delete newErrors.consultation_topic;
        }
        break;
    }

    setErrors(newErrors);
  };

  // اعتبارسنجی کد ملی
  const validateNationalId = (nationalId: string) => {
    if (!nationalId) return true; // خالی بودن مجاز است
    const regex = /^\d{10}$/;
    if (!regex.test(nationalId)) return false;

    // اعتبارسنجی الگوریتم کد ملی
    const digits = nationalId.split('').map(Number);
    const checkDigit = digits[9];
    let sum = 0;

    for (let i = 0; i < 9; i++) {
      sum += digits[i] * (10 - i);
    }

    const remainder = sum % 11;
    return (remainder < 2 && checkDigit === remainder) || (remainder >= 2 && checkDigit === 11 - remainder);
  };

  // اعتبارسنجی فرم
  const validateForm = () => {
    const newErrors: ValidationErrors = {};

    // اعتبارسنجی نام
    if (!formData.name.trim()) {
      newErrors.name = 'نام و نام خانوادگی الزامی است';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'نام باید حداقل ۲ حرف باشد';
    } else if (!/^[\u0600-\u06FF\s]+$/.test(formData.name.trim())) {
      newErrors.name = 'نام باید فقط شامل حروف فارسی باشد';
    }

    // اعتبارسنجی شماره تلفن
    if (!formData.phone.trim()) {
      newErrors.phone = 'شماره تلفن الزامی است';
    } else if (!/^09\d{9}$/.test(formData.phone.trim())) {
      newErrors.phone = 'شماره تلفن باید ۱۱ رقم باشد و با ۰۹ شروع شود';
    }

    // اعتبارسنجی تاریخ
    if (!formData.preferred_date) {
      newErrors.preferred_date = 'انتخاب تاریخ الزامی است';
    } else {
      const selectedDate = new Date(formData.preferred_date + 'T00:00:00');
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      console.log('📅 اعتبارسنجی - تاریخ انتخابی:', selectedDate);
      console.log('📅 اعتبارسنجی - تاریخ امروز:', today);

      if (selectedDate < today) {
        newErrors.preferred_date = 'لطفا تاریخ برای روزهای بعد از امروز ثبت گردد';
      }
    }

    // اعتبارسنجی زمان
    if (!formData.preferred_time) {
      newErrors.preferred_time = 'انتخاب زمان الزامی است';
    } else if (formData.preferred_date) {
      const time24 = formData.preferred_time.includes(':')
        ? formData.preferred_time
        : convertTimeTo24HourFormat(formData.preferred_time);
      if (!time24) {
        newErrors.preferred_time = 'فرمت زمان اشتباه است';
      } else {
        const selectedDate = new Date(formData.preferred_date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (selectedDate.toDateString() === today.toDateString()) {
          const currentTime = today.toTimeString().slice(0, 5);
          if (time24 <= currentTime) {
            newErrors.preferred_time = 'زمان انتخابی باید بعد از زمان فعلی باشد';
          }
        }
      }
    }

    // اعتبارسنجی موضوع مشاوره
    if (!formData.consultation_topic.trim()) {
      newErrors.consultation_topic = 'انتخاب موضوع مشاوره الزامی است';
    }

    // اعتبارسنجی کد ملی اگر وارد شده باشد
    if (formData.national_id && formData.national_id.trim()) {
      if (!/^\d{10}$/.test(formData.national_id.trim())) {
        newErrors.national_id = 'کد ملی باید ۱۰ رقم باشد';
      } else if (!validateNationalId(formData.national_id.trim())) {
        newErrors.national_id = 'کد ملی وارد شده معتبر نیست';
      }
    }

    // اگر خطا وجود داشت، set کن و false برگردان
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);

      // ساخت پیام خطا برای نمایش به کاربر با جزئیات کامل
      const errorMessages = Object.entries(newErrors).map(([field, message]) => {
        const fieldNames: { [key: string]: string } = {
          name: 'نام و نام خانوادگی',
          phone: 'شماره تلفن',
          preferred_date: 'تاریخ',
          preferred_time: 'ساعت',
          consultation_topic: 'موضوع مشاوره',
          national_id: 'کد ملی'
        };
        return `• ${fieldNames[field] || field}: ${message}`;
      });

      // نمایش پیام خطا با مشخص کردن همه فیلدهای مشکل‌دار
      alert(`لطفاً خطاهای زیر را برطرف کنید:\n\n${errorMessages.join('\n')}`);

      // فوکوس روی اولین فیلد دارای خطا
      if (newErrors.name && nameRef.current) {
        nameRef.current.focus();
      } else if (newErrors.phone && phoneRef.current) {
        phoneRef.current.focus();
      } else if (newErrors.preferred_date) {
        // فوکوس روی فیلد تاریخ
        const dateInput = document.querySelector('input[type="date"]') as HTMLInputElement;
        dateInput?.focus();
      } else if (newErrors.preferred_time && timeRef.current) {
        timeRef.current.focus();
      } else if (newErrors.consultation_topic && topicRef.current) {
        topicRef.current.focus();
      } else if (newErrors.national_id && nationalIdRef.current) {
        nationalIdRef.current.focus();
      }

      return false;
    }

    return true;
  };

  // تست اتصال به سرور
  const testServerConnection = async () => {
    try {
      console.log('🔧 تست اتصال به سرور...');
      const testResponse = await fetch('https://public-api.masoud555net.workers.dev/api/public/consultations', {
        method: 'OPTIONS',
      });
      console.log('✅ تست اتصال موفق:', testResponse.status);
      return true;
    } catch (error) {
      console.error('❌ تست اتصال ناموفق:', error);
      return false;
    }
  };

  // ارسال فرم
  const convertTimeTo24HourFormat = (timeRange: string): string => {
    const timeMap: { [key: string]: string } = {
      '۱۰ الی ۱۲': '10:00',
      '۱۲ الی ۱۴': '12:00',
      '۱۴ الی ۱۶': '14:00',
      '۱۶ الی ۱۸': '16:00',
    };
    return timeMap[timeRange] || '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    console.log('🚀 شروع فرآیند ارسال فرم...');

    // تست اتصال به سرور قبل از ارسال
    const serverAvailable = await testServerConnection();
    if (!serverAvailable) {
      alert('خطا در اتصال به سرور: سرور در دسترس نیست');
      setLoading(false);
      return;
    }

    try {
      const consultationData = {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        national_id: formData.national_id.trim(),
        province: formData.province.trim(),
        city: formData.city.trim(),
        consultation_type: formData.consultation_type,
        consultation_topic: formData.consultation_topic.trim(),
        problem_description: formData.problem_description.trim(),
        documents: formData.documents.trim(),
        preferred_date: formData.preferred_date,
        preferred_time: formData.preferred_time,
        message: formData.message.trim()
      };

      console.log('📋 داده‌های آماده برای ارسال:', consultationData);
      console.log('📅 تاریخ انتخابی:', formData.preferred_date);
      console.log('📅 نوع تاریخ:', typeof formData.preferred_date);
      console.log('⏰ زمان انتخابی:', formData.preferred_time);
      console.log('⏰ نوع زمان:', typeof formData.preferred_time);

      const time24 = consultationData.preferred_time.includes(':')
        ? consultationData.preferred_time
        : convertTimeTo24HourFormat(consultationData.preferred_time);

      if (!time24) {
        alert('فرمت زمان اشتباه است');
        setLoading(false);
        return;
      }

      const finalConsultationData = { ...consultationData, preferred_time: time24 };

      let response;
      if (consultation && consultation.id) {
        // ویرایش
        console.log('🔄 حالت ویرایش - استفاده از axios');
        response = await axios.put(`${apiUrl}/api/consultations/${consultation.id}`, finalConsultationData);
      } else {
        // افزودن جدید - استفاده از consultationService که شامل ارسال تلگرام است
        console.log('🆕 حالت جدید - استفاده از consultationService');
        console.log('📡 ارسال به URL:', consultationService.apiUrl || 'https://public-api.masoud555net.workers.dev/api/public/consultations');

        response = await consultationService.createConsultation(finalConsultationData);
        console.log('📬 پاسخ دریافتی از سرویس:', response);
      }

      console.log('✅ پاسخ نهایی:', response);

      if (response && response.data && response.data.success) {
        console.log('🎉 موفقیت! رزرو ثبت شد');
        alert(consultation && consultation.id ? 'رکورد با موفقیت ویرایش شد' : 'رکورد با موفقیت اضافه شد');
        onSave();
      } else {
        console.error('❌ پاسخ موفقیت‌آمیز نبود:', response);

        // نمایش خطاهای خاص بر اساس وضعیت پاسخ
        if (response && response.status) {
          switch (response.status) {
            case 400:
              alert('خطا در اعتبار سنجی داده‌ها: لطفاً ورودی‌های خود را بررسی کنید');
              break;
            case 401:
              alert('خطا در احراز هویت: دسترسی غیرمجاز');
              break;
            case 403:
              alert('خطا در مجوزها: دسترسی ممنوع');
              break;
            case 404:
              alert('خطا: سرویس مورد نظر یافت نشد');
              break;
            case 500:
              alert('خطا در سرور: لطفاً بعداً دوباره تلاش کنید');
              break;
            default:
              alert(`خطا در ذخیره اطلاعات (${response.status})`);
          }
        } else {
          alert('خطا در ذخیره اطلاعات: پاسخ نامعتبر از سرور');
        }
      }
    } catch (error) {
      console.error('💥 خطا در ارسال فرم:', error);
      console.error('🔍 جزئیات خطا:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });

      // نمایش خطاهای خاص بر اساس نوع خطا
      if (error.message && error.message.includes('Network Error')) {
        alert('خطا در اتصال به اینترنت: لطفاً اتصال خود را بررسی کنید');
      } else if (error.message && error.message.includes('timeout')) {
        alert('خطا در زمان اتصال: سرور پاسخگو نیست، لطفاً بعداً تلاش کنید');
      } else if (error.response && error.response.status === 400) {
        alert('خطا در اعتبار سنجی داده‌ها: لطفاً ورودی‌های خود را بررسی کنید');
      } else if (error.response && error.response.status === 409) {
        alert('خطا: این زمان قبلاً رزرو شده است');
      } else if (error.response && error.response.status === 422) {
        alert('خطا در داده‌های ورودی: لطفاً اطلاعات را به درستی وارد کنید');
      } else {
        alert('خطا در اتصال به سرور: لطفاً بعداً دوباره تلاش کنید');
      }
    } finally {
      console.log('🏁 پایان فرآیند ارسال فرم');
      setLoading(false);
    }
  };

  // ترجمه نوع مشاوره
  const translateType = (type: string) => {
    const typeMap: { [key: string]: string } = {
      'phone': 'تلفنی',
      'video': 'ویدئویی',
      'in_person': 'حضوری'
    };
    return typeMap[type] || type;
  };

  // بررسی اینکه آیا همه فیلدهای الزامی معتبر هستند
  const isFormValid = () => {
    return (
      formData.name &&
      formData.phone &&
      formData.preferred_date &&
      formData.preferred_time &&
      formData.consultation_topic &&
      !errors.name &&
      !errors.phone &&
      !errors.preferred_date &&
      !errors.preferred_time &&
      !errors.consultation_topic &&
      (!formData.national_id || !errors.national_id) // اگر کد ملی وارد شده، نباید خطا داشته باشه
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-lg sm:rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto mx-2 sm:mx-0">
        {/* هدر فرم */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-3 sm:p-6 rounded-t-lg sm:rounded-t-xl">
          {/* بخش بالایی - منو و اطلاعات تماس */}
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            {/* سه خط منو (همبرگر) */}
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center hover:bg-opacity-30 transition-all cursor-pointer">
              <i className="ri-menu-line text-lg"></i>
            </div>

            {/* اطلاعات تماس و تاریخ */}
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              {/* تاریخ و زمان */}
              <div className="bg-white bg-opacity-20 rounded-lg px-3 py-2 text-center">
                <div className="text-xs opacity-90">۱۴:۳۶</div>
                <div className="text-xs opacity-75">۱۴۰۳/۰۷/۲۱</div>
              </div>

              {/* دکمه ارتباط با ما */}
              <div className="bg-white bg-opacity-20 rounded-lg px-3 py-2 hover:bg-opacity-30 transition-all cursor-pointer">
                <div className="text-xs font-medium">ارتباط با ما</div>
              </div>
            </div>
          </div>

          {/* عنوان اصلی فرم */}
          <div className="text-center">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
              <i className={`ri-${consultation ? 'edit' : 'add'}-line text-xl sm:text-2xl`}></i>
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold mb-1">
                {consultation ? 'ویرایش رزرو' : 'افزودن رزرو جدید'}
              </h2>
              <p className="text-blue-100 text-xs sm:text-sm">
                {consultation ? 'ویرایش اطلاعات رزرو موجود' : 'ایجاد رزرو مشاوره جدید'}
              </p>
            </div>
          </div>
        </div>

        {/* بدنه فرم */}
        <form onSubmit={handleSubmit} className="p-3 sm:p-6 space-y-3 sm:space-y-6">
          {/* بخش فیلدهای ضروری با استایل قرمز برجسته */}
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-3 sm:p-4 mb-3 sm:mb-6">
            <h3 className="text-red-600 font-bold text-base sm:text-lg mb-3 sm:mb-4 flex items-center">
              <i className="ri-error-warning-line ml-1 sm:ml-2 text-sm sm:text-base"></i>
              فیلدهای ضروری (الزامی)
            </h3>

            {/* ردیف اول - نام و تلفن */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="relative">
                <label className="block text-xs sm:text-sm font-bold text-red-700 mb-1 sm:mb-2">
                  نام و نام خانوادگی <span className="text-red-500 text-xs sm:text-sm mr-0.5">*</span>
                </label>
                <div className="relative">
                  <input
                    ref={nameRef}
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                  onBlur={(e) => {
                    // اگر فیلد هنوز خطا داره، فوکوس رو نگه دار
                    setTimeout(() => {
                      if (errors.name && nameRef.current) {
                        nameRef.current.focus();
                      }
                    }, 100);
                  }}
                    onKeyDown={(e) => {
                      if (e.key === 'Tab' && errors.name) {
                        e.preventDefault();
                        nameRef.current?.focus();
                      }
                    }}
                    className={`w-full px-2 sm:px-3 py-2 sm:py-2 border-2 rounded-md sm:rounded-lg focus:ring-1 sm:focus:ring-2 bg-white text-sm sm:text-base pr-8 sm:pr-10 ${
                      errors.name
                        ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                        : formData.name && !errors.name
                        ? 'border-green-500 focus:ring-green-500 focus:border-green-500'
                        : 'border-red-300 focus:ring-red-500 focus:border-red-500'
                    }`}
                    placeholder="نام و نام خانوادگی"
                    required
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:pr-3">
                    {formData.name && (
                      errors.name ? (
                        <i className="ri-error-warning-line text-red-500 text-sm sm:text-base"></i>
                      ) : (
                        <i className="ri-check-line text-green-500 text-sm sm:text-base"></i>
                      )
                    )}
                  </div>
                </div>
                {errors.name && (
                  <p className="text-xs sm:text-sm text-red-600 mt-1 flex items-center">
                    <i className="ri-error-warning-line ml-1 text-xs sm:text-sm"></i>
                    {errors.name}
                  </p>
                )}
              </div>

              <div className="relative">
                <label className="block text-xs sm:text-sm font-bold text-red-700 mb-1 sm:mb-2">
                  شماره تلفن <span className="text-red-500 text-xs sm:text-sm mr-0.5">*</span>
                </label>
                <div className="relative">
                  <input
                    ref={phoneRef}
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    onBlur={(e) => {
                      // اگر فیلد هنوز خطا داره، فوکوس رو نگه دار
                      setTimeout(() => {
                        if (errors.phone && phoneRef.current) {
                          phoneRef.current.focus();
                        }
                      }, 100);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Tab' && errors.phone) {
                        e.preventDefault();
                        phoneRef.current?.focus();
                      }
                    }}
                    className={`w-full px-2 sm:px-3 py-2 sm:py-2 border-2 rounded-md sm:rounded-lg focus:ring-1 sm:focus:ring-2 bg-white text-sm sm:text-base pr-8 sm:pr-10 ${
                      errors.phone
                        ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                        : formData.phone && !errors.phone
                        ? 'border-green-500 focus:ring-green-500 focus:border-green-500'
                        : 'border-red-300 focus:ring-red-500 focus:border-red-500'
                    }`}
                    placeholder="09xxxxxxxxx"
                    required
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:pr-3">
                    {formData.phone && (
                      errors.phone ? (
                        <i className="ri-error-warning-line text-red-500 text-sm sm:text-base"></i>
                      ) : (
                        <i className="ri-check-line text-green-500 text-sm sm:text-base"></i>
                      )
                    )}
                  </div>
                </div>
                {errors.phone && (
                  <p className="text-xs sm:text-sm text-red-600 mt-1 flex items-center">
                    <i className="ri-error-warning-line ml-1 text-xs sm:text-sm"></i>
                    {errors.phone}
                  </p>
                )}
              </div>
            </div>

            {/* ردیف جدید - زمان پیشنهادی */}
            <div className="mt-3 sm:mt-4 relative">
                <label className="block text-xs sm:text-sm font-bold text-red-700 mb-1 sm:mb-2">
                  ساعت پیشنهادی <span className="text-red-500 text-xs sm:text-sm mr-0.5">*</span>
                </label>
              <div className="relative">
                <input
                  ref={timeRef}
                  type="time"
                  value={formData.preferred_time}
                  onChange={(e) => handleTimeChange(e.target.value)}
                  onBlur={(e) => {
                    // اگر فیلد هنوز خطا داره، فوکوس رو نگه دار
                    setTimeout(() => {
                      if (errors.preferred_time && timeRef.current) {
                        timeRef.current.focus();
                      }
                    }, 100);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Tab' && errors.preferred_time) {
                      e.preventDefault();
                      timeRef.current?.focus();
                    }
                  }}
                  className={`w-full px-2 sm:px-3 py-2 sm:py-2 border-2 rounded-md sm:rounded-lg focus:ring-1 sm:focus:ring-2 bg-white text-sm sm:text-base pr-8 sm:pr-10 ${
                    errors.preferred_time
                      ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                      : formData.preferred_time && !errors.preferred_time
                      ? 'border-green-500 focus:ring-green-500 focus:border-green-500'
                      : 'border-red-300 focus:ring-red-500 focus:border-red-500'
                  }`}
                  required
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:pr-3">
                  {formData.preferred_time && (
                    errors.preferred_time ? (
                      <i className="ri-error-warning-line text-red-500 text-sm sm:text-base"></i>
                    ) : (
                      <i className="ri-check-line text-green-500 text-sm sm:text-base"></i>
                    )
                  )}
                </div>
              </div>
              {errors.preferred_time && (
                <p className="text-xs sm:text-sm text-red-600 mt-1 flex items-center">
                  <i className="ri-error-warning-line ml-1 text-xs sm:text-sm"></i>
                  {errors.preferred_time}
                </p>
              )}
            </div>

            {/* ردیف جدید - موضوع مشاوره */}
            <div className="mt-3 sm:mt-4 relative">
                <label className="block text-xs sm:text-sm font-bold text-red-700 mb-1 sm:mb-2">
                  موضوع مشاوره <span className="text-red-500 text-xs sm:text-sm mr-0.5">*</span>
                </label>
              <div className="relative">
                <select
                  ref={topicRef}
                  value={formData.consultation_topic}
                  onChange={(e) => handleTopicChange(e.target.value)}
                  onBlur={(e) => {
                    // اگر فیلد هنوز خطا داره، فوکوس رو نگه دار
                    setTimeout(() => {
                      if (errors.consultation_topic && topicRef.current) {
                        topicRef.current.focus();
                      }
                    }, 100);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Tab' && errors.consultation_topic) {
                      e.preventDefault();
                      topicRef.current?.focus();
                    }
                  }}
                  className={`w-full px-2 sm:px-3 py-2 sm:py-2 border-2 rounded-md sm:rounded-lg focus:ring-1 sm:focus:ring-2 bg-white text-sm sm:text-base pr-8 sm:pr-10 ${
                    errors.consultation_topic
                      ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                      : formData.consultation_topic && !errors.consultation_topic
                      ? 'border-green-500 focus:ring-green-500 focus:border-green-500'
                      : 'border-red-300 focus:ring-red-500 focus:border-red-500'
                  }`}
                  required
                >
                  <option value="">انتخاب موضوع مشاوره</option>
                  <option value="خانوادگی">👨‍👩‍👧‍👦 خانوادگی</option>
                  <option value="کیفری">⚖️ کیفری</option>
                  <option value="ملکی">🏠 ملکی</option>
                  <option value="کسب‌وکار">💼 کسب‌وکار</option>
                  <option value="وراثت">📜 وراثت</option>
                  <option value="قراردادها">📋 قراردادها</option>
                  <option value="حقوق کار">👷‍♂️ حقوق کار</option>
                  <option value="حقوق مالی">💰 حقوق مالی</option>
                  <option value="حقوق بین‌الملل">🌍 حقوق بین‌الملل</option>
                  <option value="سایر">❓ سایر</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:pr-3">
                  {formData.consultation_topic && (
                    errors.consultation_topic ? (
                      <i className="ri-error-warning-line text-red-500 text-sm sm:text-base"></i>
                    ) : (
                      <i className="ri-check-line text-green-500 text-sm sm:text-base"></i>
                    )
                  )}
                </div>
              </div>
              {errors.consultation_topic && (
                <p className="text-xs sm:text-sm text-red-600 mt-1 flex items-center">
                  <i className="ri-error-warning-line ml-1 text-xs sm:text-sm"></i>
                  {errors.consultation_topic}
                </p>
              )}
            </div>
          </div>

          {/* ردیف جدید - کد ملی */}
          <div className="relative">
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
              کد ملی (اختیاری)
            </label>
            <div className="relative">
              <input
                ref={nationalIdRef}
                type="text"
                value={formData.national_id}
                onChange={(e) => handleNationalIdChange(e.target.value)}
                onBlur={(e) => {
                  // اگر فیلد هنوز خطا داره، فوکوس رو نگه دار
                  setTimeout(() => {
                    if (errors.national_id && nationalIdRef.current) {
                      nationalIdRef.current.focus();
                    }
                  }, 100);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Tab' && errors.national_id) {
                    e.preventDefault();
                    nationalIdRef.current?.focus();
                  }
                }}
                className={`w-full px-2 sm:px-3 py-2 sm:py-2 border rounded-md sm:rounded-lg focus:ring-1 sm:focus:ring-2 bg-white text-sm sm:text-base pr-8 sm:pr-10 ${
                  errors.national_id
                    ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                    : formData.national_id && !errors.national_id
                    ? 'border-green-500 focus:ring-green-500 focus:border-green-500'
                    : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                }`}
                placeholder="کد ملی ۱۰ رقمی"
                maxLength={10}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:pr-3">
                {formData.national_id && (
                  errors.national_id ? (
                    <i className="ri-error-warning-line text-red-500 text-sm sm:text-base"></i>
                  ) : (
                    <i className="ri-check-line text-green-500 text-sm sm:text-base"></i>
                  )
                )}
              </div>
            </div>
            {errors.national_id && (
              <p className="text-xs sm:text-sm text-red-600 mt-1 flex items-center">
                <i className="ri-error-warning-line ml-1 text-xs sm:text-sm"></i>
                {errors.national_id}
              </p>
            )}
          </div>

          {/* ردیف جدید - استان و شهر */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                استان (اختیاری)
              </label>
              <select
                value={formData.province}
                onChange={(e) => handleInputChange('province', e.target.value)}
                className="w-full px-2 sm:px-3 py-2 sm:py-2 border border-gray-300 rounded-md sm:rounded-lg focus:ring-1 sm:focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
              >
                <option value="">انتخاب استان</option>
                <option value="تهران">تهران</option>
                <option value="اصفهان">اصفهان</option>
                <option value="فارس">فارس</option>
                <option value="خوزستان">خوزستان</option>
                <option value="آذربایجان شرقی">آذربایجان شرقی</option>
                <option value="آذربایجان غربی">آذربایجان غربی</option>
                <option value="گیلان">گیلان</option>
                <option value="مازندران">مازندران</option>
                <option value="کرمان">کرمان</option>
                <option value="هرمزگان">هرمزگان</option>
                <option value="سیستان و بلوچستان">سیستان و بلوچستان</option>
                <option value="خراسان رضوی">خراسان رضوی</option>
                <option value="خراسان شمالی">خراسان شمالی</option>
                <option value="خراسان جنوبی">خراسان جنوبی</option>
                <option value="یزد">یزد</option>
                <option value="همدان">همدان</option>
                <option value="کردستان">کردستان</option>
                <option value="کرمانشاه">کرمانشاه</option>
                <option value="لرستان">لرستان</option>
                <option value="چهارمحال و بختیاری">چهارمحال و بختیاری</option>
                <option value="کهگیلویه و بویراحمد">کهگیلویه و بویراحمد</option>
                <option value="بوشهر">بوشهر</option>
                <option value="اردبیل">اردبیل</option>
                <option value="زنجان">زنجان</option>
                <option value="قزوین">قزوین</option>
                <option value="البرز">البرز</option>
                <option value="مرکزی">مرکزی</option>
                <option value="سمنان">سمنان</option>
                <option value="گلستان">گلستان</option>
                <option value="قم">قم</option>
                <option value="ایلام">ایلام</option>
              </select>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                شهر (اختیاری)
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                className="w-full px-2 sm:px-3 py-2 sm:py-2 border border-gray-300 rounded-md sm:rounded-lg focus:ring-1 sm:focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                placeholder="نام شهر"
              />
            </div>
          </div>

          {/* ردیف جدید - شرح مشکل */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
              شرح خلاصه مشکل حقوقی یا پرونده (اختیاری)
            </label>
            <textarea
              value={formData.problem_description}
              onChange={(e) => handleInputChange('problem_description', e.target.value)}
              rows={3}
              className="w-full px-2 sm:px-3 py-2 sm:py-2 border border-gray-300 rounded-md sm:rounded-lg focus:ring-1 sm:focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-sm sm:text-base"
              placeholder="شرح مختصری از مشکل حقوقی..."
            />
          </div>

          {/* ردیف جدید - آپلود مدارک */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
              آپلود مدارک اساسی (اختیاری)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-md sm:rounded-lg p-3 sm:p-6 text-center hover:border-blue-400 transition-colors">
              <input
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                onChange={(e) => {
                  const files = e.target.files;
                  if (files) {
                    const fileNames = Array.from(files).map(file => file.name).join(', ');
                    handleInputChange('documents', fileNames);
                  }
                }}
                className="hidden"
                id="document-upload"
              />
              <label
                htmlFor="document-upload"
                className="cursor-pointer flex flex-col items-center space-y-1 sm:space-y-2"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <i className="ri-upload-cloud-line text-lg sm:text-2xl text-blue-600"></i>
                </div>
                <div className="text-xs sm:text-sm text-gray-600">
                  <span className="text-blue-600 font-medium">کلیک کنید</span> یا فایل‌ها را اینجا بکشید
                </div>
                <div className="text-xs text-gray-500">
                  فرمت‌های مجاز: PDF, DOC, DOCX, JPG, PNG
                </div>
              </label>
            </div>
            {formData.documents && (
              <div className="mt-2 p-1 sm:p-2 bg-gray-50 rounded-md sm:rounded-lg">
                <div className="text-xs sm:text-sm text-gray-700">
                  <i className="ri-file-line ml-1 sm:ml-2 text-xs sm:text-sm"></i>
                  فایل‌های انتخاب شده: {formData.documents}
                </div>
              </div>
            )}
          </div>

          {/* ردیف دوم - نوع مشاوره و تاریخ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                نوع مشاوره <span className="text-red-500 text-xs sm:text-sm mr-0.5">*</span>
              </label>
              <select
                value={formData.consultation_type}
                onChange={(e) => handleInputChange('consultation_type', e.target.value)}
                className="w-full px-2 sm:px-3 py-2 sm:py-2 border border-gray-300 rounded-md sm:rounded-lg focus:ring-1 sm:focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                required
              >
                <option value="phone">📞 تلفنی</option>
                <option value="video">🎥 ویدئویی</option>
                <option value="in_person">🏢 حضوری</option>
              </select>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                تاریخ مورد نظر <span className="text-red-500 text-xs sm:text-sm mr-0.5">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  value={formData.preferred_date}
                  onChange={(e) => handleDateChange(e.target.value)}
                  onBlur={(e) => {
                    if (errors.preferred_date) {
                      e.preventDefault();
                      // focus رو نگه می‌داریم رو همین فیلد
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Tab' && errors.preferred_date) {
                      e.preventDefault();
                      // focus رو نگه می‌داریم رو همین فیلد
                    }
                  }}
                  className={`w-full px-2 sm:px-3 py-2 sm:py-2 border-2 rounded-md sm:rounded-lg focus:ring-1 sm:focus:ring-2 bg-white text-sm sm:text-base pr-8 sm:pr-10 ${
                    errors.preferred_date
                      ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                      : formData.preferred_date && !errors.preferred_date
                      ? 'border-green-500 focus:ring-green-500 focus:border-green-500'
                      : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                  }`}
                  required
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:pr-3">
                  {formData.preferred_date && (
                    errors.preferred_date ? (
                      <i className="ri-error-warning-line text-red-500 text-sm sm:text-base"></i>
                    ) : (
                      <i className="ri-check-line text-green-500 text-sm sm:text-base"></i>
                    )
                  )}
                </div>
              </div>
              {errors.preferred_date && (
                <p className="text-xs sm:text-sm text-red-600 mt-1 flex items-center">
                  <i className="ri-error-warning-line ml-1 text-xs sm:text-sm"></i>
                  {errors.preferred_date}
                </p>
              )}
            </div>
          </div>

          {/* ردیف چهارم - پیام */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
              توضیحات (اختیاری)
            </label>
            <textarea
              value={formData.message}
              onChange={(e) => handleInputChange('message', e.target.value)}
              rows={3}
              className="w-full px-2 sm:px-3 py-2 sm:py-2 border border-gray-300 rounded-md sm:rounded-lg focus:ring-1 sm:focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-sm sm:text-base"
              placeholder="توضیحات یا جزئیات بیشتر..."
            />
          </div>

          {/* دکمه‌ها */}
          <div className="pt-3 sm:pt-4 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row justify-center sm:justify-end items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 rtl:space-x-reverse">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-all duration-200 font-medium text-sm border border-gray-200 flex items-center justify-center space-x-2 rtl:space-x-reverse w-full sm:w-auto disabled:opacity-50"
                disabled={loading}
              >
                <i className="ri-close-line text-base"></i>
                <span>لغو</span>
              </button>

              <button
                type="submit"
                className={`px-4 py-3 rounded-lg transition-all duration-200 font-medium text-sm border flex items-center justify-center space-x-2 rtl:space-x-reverse w-full sm:w-auto shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed ${
                  isFormValid() && !loading
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-blue-500'
                    : 'bg-gray-300 text-gray-500 border-gray-300 cursor-not-allowed'
                }`}
                disabled={loading || !isFormValid()}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>در حال ذخیره...</span>
                  </>
                ) : (
                  <>
                    <i className={`ri-${consultation ? 'edit' : 'add'}-line text-base`}></i>
                    <span>{consultation ? 'ویرایش' : 'افزودن'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
