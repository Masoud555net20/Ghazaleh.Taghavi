import React, { useState, useMemo, useCallback } from 'react';
import { UserIcon, PhoneIcon, CalendarIcon, ClockIcon, BriefcaseIcon, CheckCircleIcon } from './Icons';
import { consultationService, Consultation } from '../services/consultationService';
// @ts-ignore
import jalaali from 'jalaali-js';

// تعریف typeهای JSX برای رفع خطای TypeScript
type JSXElement = React.ReactElement;

// تبدیل اعداد انگلیسی به فارسی
const toPersianNumbers = (num: string | number) => {
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return num.toString().replace(/\d/g, (digit) => persianDigits[parseInt(digit)]);
};

// Persian Date Picker Component
const PersianDatePicker: React.FC<{
  id: string;
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  icon: React.ReactElement;
  required?: boolean;
}> = ({ id, label, name, value, onChange, icon, required = true }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(() => {
    const today = new Date();
    const jalali = jalaali.toJalaali(today);
    return jalali.jm - 1; // Convert to 0-based index
  });
  const [currentYear, setCurrentYear] = useState(() => {
    const today = new Date();
    const jalali = jalaali.toJalaali(today);
    return jalali.jy;
  });

  // دریافت سال جلالی فعلی
  const getCurrentJalaliYear = () => {
    const today = new Date();
    const jalali = jalaali.toJalaali(today);
    return jalali.jy;
  };

  // تبدیل تاریخ میلادی به جلالی
  const toJalali = (gregorianDate: Date) => {
    return jalaali.toJalaali(gregorianDate);
  };

  // تبدیل تاریخ جلالی به میلادی
  const toGregorian = (jalaliYear: number, jalaliMonth: number, jalaliDay: number) => {
    const gregorian = jalaali.toGregorian(jalaliYear, jalaliMonth, jalaliDay);
    return new Date(gregorian.gy, gregorian.gm - 1, gregorian.gd);
  };

  // نام ماه‌های فارسی
  const persianMonths = [
    'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
    'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
  ];

  // نام روزهای هفته فارسی
  const persianWeekDays = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'];

  // تولید روزهای ماه
  const getMonthDays = (year: number, month: number) => {
    const gregorianDate = toGregorian(year, month + 1, 1);
    const firstDayOfWeek = gregorianDate.getDay();
    const daysInMonth = jalaali.jalaaliMonthLength(year, month + 1);

    const days = [];

    // اضافه کردن روزهای خالی ابتدای ماه
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null);
    }

    // اضافه کردن روزهای ماه
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  };

  // بررسی اینکه آیا روز مشخص شده امروز است یا نه
  const isToday = (day: number) => {
    if (!day) return false;

    const today = new Date();
    const jalaliToday = toJalali(today);

    return jalaliToday.jy === currentYear &&
           jalaliToday.jm - 1 === currentMonth &&
           jalaliToday.jd === day;
  };

  // تغییر ماه
  const changeMonth = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(currentYear - 1);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    } else {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
    }
  };

  // انتخاب تاریخ
  const selectDate = (day: number) => {
    if (day) {
      const gregorianDate = toGregorian(currentYear, currentMonth + 1, day);

      // تنظیم ساعت به ۱۲ ظهر برای جلوگیری از مشکلات timezone
      gregorianDate.setHours(12, 0, 0, 0);

      // استفاده از روش ساده‌تر برای فرمت تاریخ بدون timezone issues
      const year = gregorianDate.getFullYear();
      const month = String(gregorianDate.getMonth() + 1).padStart(2, '0');
      const dayStr = String(gregorianDate.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${dayStr}`;

      console.log('Selected date (Gregorian):', formattedDate);
      console.log('Selected date (Jalali):', toJalali(gregorianDate));

      // تبدیل تاریخ انتخابی به شمسی برای نمایش بهتر در UI
      const jalaliDate = toJalali(gregorianDate);
      const jalaliDisplay = `${toPersianNumbers(jalaliDate.jd)} ${persianMonths[jalaliDate.jm - 1]} ${toPersianNumbers(jalaliDate.jy)}`;

      console.log('Jalali display:', jalaliDisplay);

      // ارسال تاریخ میلادی برای ذخیره در دیتابیس اما نمایش شمسی برای کاربر
      onChange(formattedDate);
      setIsOpen(false);
    }
  };

  // نمایش تاریخ انتخاب شده به صورت فارسی
  const getSelectedDateDisplay = () => {
    if (!value) return 'انتخاب تاریخ';

    try {
      console.log('Input value for date display:', value);

      // اگر value شامل تاریخ میلادی است (مثل ۲۰۲۵-۰۱-۰۵)
      if (value.includes('-')) {
        // استفاده از تاریخ محلی برای جلوگیری از مشکلات timezone
        const dateParts = value.split('-');
        if (dateParts.length !== 3) {
          console.error('Invalid date format:', value);
          return 'انتخاب تاریخ';
        }

        const year = parseInt(dateParts[0], 10);
        const month = parseInt(dateParts[1], 10) - 1; // JavaScript months are 0-indexed
        const day = parseInt(dateParts[2], 10);

        const date = new Date(year, month, day, 12, 0, 0);
        if (isNaN(date.getTime())) {
          console.error('Invalid date:', value);
          return 'انتخاب تاریخ';
        }

        const jalali = toJalali(date);
        const display = `${toPersianNumbers(jalali.jd)} ${persianMonths[jalali.jm - 1]} ${toPersianNumbers(jalali.jy)}`;
        console.log('Converted date:', value, 'to', display);
        return display;
      }

      // اگر value از قبل شمسی است
      return value;
    } catch (error) {
      console.error('Error parsing date:', error, 'Value:', value);
      return 'انتخاب تاریخ';
    }
  };

  const monthDays = getMonthDays(currentYear, currentMonth);

  return (
    <div>
      <label htmlFor={id} className="block text-base font-bold text-gray-800 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <span className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-gray-400">
          {icon}
        </span>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full p-4 pr-12 text-right border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white text-lg"
        >
          {getSelectedDateDisplay()}
        </button>
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </span>

        {/* Calendar Popup */}
        {isOpen && (
          <div className="absolute top-full left-0 mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">
            {/* Calendar Header - Modern Design */}
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-blue-200">
              <button
                type="button"
                onClick={() => changeMonth('prev')}
                className="p-2 hover:bg-white/50 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <div className="text-lg font-bold text-gray-800 bg-white/80 px-4 py-2 rounded-lg shadow-sm">
                {persianMonths[currentMonth]} {toPersianNumbers(currentYear)}
              </div>

              <button
                type="button"
                onClick={() => changeMonth('next')}
                className="p-2 hover:bg-white/50 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Week Days */}
            <div className="grid grid-cols-7 gap-1 p-3 bg-gray-50">
              {persianWeekDays.map((day, index) => (
                <div key={index} className="p-2 text-center text-sm font-bold text-gray-600 bg-white rounded-lg mx-1">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-1 p-2">
              {monthDays.map((day, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => selectDate(day as number)}
                  disabled={!day}
                  className={`p-2 text-sm rounded-lg transition-all duration-200 ${
                    day
                      ? isToday(day)
                        ? 'bg-red-500 text-white font-bold shadow-md hover:bg-red-600 cursor-pointer'
                        : 'text-gray-700 hover:bg-blue-500 hover:text-white cursor-pointer'
                      : 'text-transparent cursor-default'
                  }`}
                >
                  {day ? toPersianNumbers(day) : ''}
                </button>
              ))}
            </div>

            {/* Today Button */}
            <div className="p-3 border-t border-gray-200 text-center">
              <button
                type="button"
                onClick={() => {
                  const today = new Date();
                  const jalali = toJalali(today);
                  setCurrentMonth(jalali.jm - 1);
                  setCurrentYear(jalali.jy);
                }}
                className="px-4 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                امروز ({toPersianNumbers(getCurrentJalaliYear())})
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Close calendar when clicking outside */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

// A reusable InputField component with a label and an icon
const InputField: React.FC<{
  id: string;
  label: string;
  type: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon: React.ReactElement;
  required?: boolean;
}> = ({ id, label, type, name, value, onChange, icon, required = true }) => (
  <div>
    <label htmlFor={id} className="block text-base font-bold text-gray-800 mb-2">{label}</label>
    <div className="relative">
      <span className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-gray-400">
        {icon}
      </span>
      <input
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full p-4 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-lg"
      />
    </div>
  </div>
);

// A reusable SelectField component with a label and an icon
const SelectField: React.FC<{
  id: string;
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  icon: React.ReactElement;
  children: React.ReactNode;
  required?: boolean;
}> = ({ id, label, name, value, onChange, icon, children, required = true }) => (
  <div>
    <label htmlFor={id} className="block text-base font-bold text-gray-800 mb-2">{label}</label>
    <div className="relative">
      <span className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-gray-400">
        {icon}
      </span>
      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full p-4 pr-12 appearance-none bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-lg"
      >
        {children}
      </select>
      <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
      </span>
    </div>
  </div>
);

const Booking: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    national_id: '',
    province: '',
    city: '',
    consultationType: '',
    consultation_topic: '',
    problem_description: '',
    documents: '',
    date: '',
    time: '',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    // تبدیل اعداد به فارسی برای فیلدهای شماره تماس و کد ملی
    let processedValue = value;
    if ((name === 'phone' || name === 'national_id') && value) {
      processedValue = toPersianNumbers(value);
    }

    setFormData(prev => ({ ...prev, [name]: processedValue }));
  };

  // اعتبارسنجی کد ملی
  const validateNationalId = (nationalId: string) => {
    if (!nationalId) return true; // خالی بودن مجاز است

    // تبدیل اعداد فارسی به انگلیسی برای اعتبارسنجی
    const toEnglishNumbers = (num: string) => {
      const englishDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
      return num.toString().replace(/[۰-۹]/g, (digit) => englishDigits.indexOf(digit).toString());
    };

    const englishNationalId = toEnglishNumbers(nationalId);
    const regex = /^\d{10}$/;
    if (!regex.test(englishNationalId)) return false;

    // اعتبارسنجی الگوریتم کد ملی
    const digits = englishNationalId.split('').map(Number);
    const checkDigit = digits[9];
    let sum = 0;

    for (let i = 0; i < 9; i++) {
      sum += digits[i] * (10 - i);
    }

    const remainder = sum % 11;
    return (remainder < 2 && checkDigit === remainder) || (remainder >= 2 && checkDigit === 11 - remainder);
  };

  // تبدیل بازه زمانی به فرمت 24 ساعته
  const convertTimeTo24HourFormat = (timeRange: string): string => {
    const timeMap: { [key: string]: string } = {
      '10-12': '10:00',
      '12-14': '12:00',
      '14-16': '14:00',
      '16-18': '16:00',
      '18-20': '18:00',
    };

    const converted = timeMap[timeRange] || '';
    console.log('Time conversion:', { original: timeRange, converted });
    return converted;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // اعتبارسنجی کد ملی اگر وارد شده باشد
    if (formData.national_id && !validateNationalId(formData.national_id)) {
      setError('کد ملی وارد شده معتبر نیست');
      setIsLoading(false);
      return;
    }

    try {
      // تبدیل اعداد فارسی به انگلیسی برای ارسال به API
      const toEnglishNumbers = (num: string) => {
        const englishDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
        return num.toString().replace(/[۰-۹]/g, (digit) => englishDigits.indexOf(digit).toString());
      };

      // تبدیل زمان به فرمت 24 ساعته (فقط اگر زمان انتخاب شده باشد)
      const time24 = formData.time ? convertTimeTo24HourFormat(formData.time) : '';

      console.log('Time validation:', {
        originalTime: formData.time,
        convertedTime: time24,
        hasTime: !!formData.time,
        hasConvertedTime: !!time24
      });

      // فقط چک کن که زمان انتخاب شده باشد (بدون اعتبارسنجی فرمت)
      if (!formData.time) {
        setError('زمان را انتخاب کنید');
        setIsLoading(false);
        return;
      }

      // تبدیل نام فیلدها به فرمت API
      const consultationData = {
        name: formData.name,
        phone: formData.phone ? toEnglishNumbers(formData.phone) : '',
        national_id: formData.national_id ? toEnglishNumbers(formData.national_id) : '',
        province: formData.province,
        city: formData.city,
        consultation_type: formData.consultationType,
        consultation_topic: formData.consultation_topic,
        problem_description: formData.problem_description,
        documents: formData.documents,
        preferred_date: formData.date,
        preferred_time: time24,
        message: formData.message,
      };

      console.log('Sending data:', consultationData);
      console.log('Original time:', formData.time);
      console.log('Converted time:', time24);

      // ارسال داده‌ها از طریق consultationService
      const result = await consultationService.createConsultation(consultationData);

      if (result.success) {
        console.log('Data sent successfully');
        setIsSubmitted(true);
      } else {
        setError(result.error || 'خطا در ارسال داده‌ها');
      }
    } catch (error) {
      console.error('Error:', error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('خطا در اتصال به سرور. لطفاً بعداً دوباره تلاش کنید.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <section id="booking" className="py-20 bg-gray-100">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg">
            <CheckCircleIcon />
            <h3 className="text-2xl font-bold mb-2 text-gray-800">درخواست شما با موفقیت ثبت شد</h3>
            <p className="text-gray-600">
              متشکریم. درخواست شما برای رزرو وقت مشاوره ثبت گردید. همکاران ما به زودی برای هماهنگی نهایی با شما تماس خواهند گرفت.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="booking" className="py-20 bg-gray-100">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">رزرو وقت مشاوره</h2>
          <p className="mt-4 text-lg text-gray-600">فرم زیر را تکمیل کنید تا اولین قدم را برای حل مشکل حقوقی خود بردارید.</p>
          <div className="mt-4 w-24 h-1 bg-blue-700 mx-auto rounded"></div>
        </div>
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 sm:p-10 rounded-xl shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                id="name"
                label="نام و نام خانوادگی"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                icon={<UserIcon />}
              />
              <InputField
                id="phone"
                label="شماره تماس"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                icon={<PhoneIcon />}
              />
            </div>

            {/* کد ملی */}
            <InputField
              id="national_id"
              label="کد ملی (اختیاری)"
              type="text"
              name="national_id"
              value={formData.national_id}
              onChange={handleChange}
              icon={<UserIcon />}
              required={false}
            />

            {/* استان و شهر */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SelectField
                id="province"
                label="استان (اختیاری)"
                name="province"
                value={formData.province}
                onChange={handleChange}
                icon={<BriefcaseIcon />}
                required={false}
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
              </SelectField>

              <InputField
                id="city"
                label="شهر (اختیاری)"
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                icon={<BriefcaseIcon />}
                required={false}
              />
            </div>

            {/* موضوع مشاوره */}
            <SelectField
              id="consultation_topic"
              label="موضوع مشاوره (اختیاری)"
              name="consultation_topic"
              value={formData.consultation_topic}
              onChange={handleChange}
              icon={<BriefcaseIcon />}
              required={false}
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
            </SelectField>

            {/* شرح مشکل */}
            <div>
              <label htmlFor="problem_description" className="block text-base font-bold text-gray-800 mb-2">
                شرح خلاصه مشکل حقوقی یا پرونده (اختیاری)
              </label>
              <textarea
                id="problem_description"
                name="problem_description"
                rows={4}
                value={formData.problem_description}
                onChange={handleChange}
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-lg"
                placeholder="شرح مختصری از مشکل حقوقی یا پرونده خود را بنویسید..."
              />
            </div>

            {/* آپلود مدارک */}
            <div>
              <label className="block text-base font-bold text-gray-800 mb-2">
                آپلود مدارک اساسی (اختیاری)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                <input
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  onChange={(e) => {
                    const files = e.target.files;
                    if (files) {
                      const fileNames = Array.from(files).map(file => file.name).join(', ');
                      setFormData(prev => ({ ...prev, documents: fileNames }));
                    }
                  }}
                  className="hidden"
                  id="document-upload"
                />
                <label
                  htmlFor="document-upload"
                  className="cursor-pointer flex flex-col items-center space-y-2"
                >
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <div className="text-sm text-gray-600">
                    <span className="text-blue-600 font-medium">کلیک کنید</span> یا فایل‌ها را اینجا بکشید
                  </div>
                  <div className="text-xs text-gray-500">
                    فرمت‌های مجاز: PDF, DOC, DOCX, JPG, PNG (حداکثر ۱۰MB)
                  </div>
                </label>
              </div>
              {formData.documents && (
                <div className="mt-2 p-2 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-700">
                    📎 فایل‌های انتخاب شده: {formData.documents}
                  </div>
                </div>
              )}
            </div>
            <SelectField
              id="consultationType"
              label="نوع مشاوره"
              name="consultationType"
              value={formData.consultationType}
              onChange={handleChange}
              icon={<BriefcaseIcon />}
            >
              <option value="">انتخاب کنید...</option>
              <option value="in-person">🏢 مشاوره حضوری</option>
              <option value="phone">📞 مشاوره تلفنی</option>
              <option value="online">💻 مشاوره آنلاین (تصویری)</option>
            </SelectField>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <PersianDatePicker
                id="date"
                label="تاریخ پیشنهادی"
                name="date"
                value={formData.date}
                onChange={(value) => setFormData(prev => ({ ...prev, date: value }))}
                icon={<CalendarIcon />}
              />
              <SelectField
                id="time"
                label="ساعت پیشنهادی"
                name="time"
                value={formData.time}
                onChange={handleChange}
                icon={<ClockIcon />}
              >
                <option value="">انتخاب کنید</option>
                <option value="10-12">{toPersianNumbers('۱۰')} الی {toPersianNumbers('۱۲')}</option>
                <option value="12-14">{toPersianNumbers('۱۲')} الی {toPersianNumbers('۱۴')}</option>
                <option value="16-18">{toPersianNumbers('۱۶')} الی {toPersianNumbers('۱۸')} (عصر)</option>
                <option value="18-20">{toPersianNumbers('۱۸')} الی {toPersianNumbers('۲۰')} (عصر)</option>
              </SelectField>
            </div>
            <div>
              <label htmlFor="message" className="block text-base font-bold text-gray-800 mb-2">شرح مختصر موضوع (اختیاری)</label>
              <textarea
                id="message"
                name="message"
                rows={6}
                value={formData.message}
                onChange={handleChange}
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-lg"
                placeholder="لطفاً به طور خلاصه موضوعی که نیاز به مشاوره دارید را بیان کنید..."
              ></textarea>
            </div>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full font-bold py-3 px-6 rounded-lg transition-all duration-300 transform shadow-lg hover:shadow-blue-500/50 ${
                isLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-700 hover:bg-blue-800 hover:scale-105'
              } text-white`}
            >
              {isLoading ? 'در حال ارسال...' : 'ثبت و ارسال درخواست'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Booking;
