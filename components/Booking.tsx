import React, { useState } from 'react';
import { UserIcon, PhoneIcon, CalendarIcon, ClockIcon, BriefcaseIcon, CheckCircleIcon } from './Icons';

// A reusable InputField component with a label and an icon
const InputField: React.FC<{
  id: string;
  label: string;
  type: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon: JSX.Element;
  required?: boolean;
}> = ({ id, label, type, name, value, onChange, icon, required = true }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
    <div className="relative">
      <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
        {icon}
      </span>
      <input
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full p-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
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
  icon: JSX.Element;
  children: React.ReactNode;
  required?: boolean;
}> = ({ id, label, name, value, onChange, icon, children, required = true }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
    <div className="relative">
      <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
        {icon}
      </span>
      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full p-3 pr-10 appearance-none bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
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
    consultationType: '',
    date: '',
    time: '',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Booking submitted:', formData);
    setIsSubmitted(true);
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
        <div className="max-w-3xl mx-auto">
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
            <SelectField
              id="consultationType"
              label="نوع مشاوره"
              name="consultationType"
              value={formData.consultationType}
              onChange={handleChange}
              icon={<BriefcaseIcon />}
            >
              <option value="">انتخاب کنید...</option>
              <option value="in-person">مشاوره حضوری</option>
              <option value="phone">مشاوره تلفنی</option>
              <option value="online">مشاوره آنلاین (تصویری)</option>
            </SelectField>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                id="date"
                label="تاریخ پیشنهادی"
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
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
                <option value="10-12">10 الی 12</option>
                <option value="12-14">12 الی 14</option>
                <option value="16-18">16 الی 18 (عصر)</option>
                <option value="18-20">18 الی 20 (عصر)</option>
              </SelectField>
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">شرح مختصر موضوع</label>
              <textarea
                id="message"
                name="message"
                rows={5}
                value={formData.message}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder="لطفاً به طور خلاصه موضوعی که نیاز به مشاوره دارید را بیان کنید..."
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-700 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-blue-500/50"
            >
              ثبت و ارسال درخواست
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Booking;
