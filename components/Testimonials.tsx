
import React from 'react';
import type { Testimonial } from '../types';
import { UsersIcon, ShieldCheckIcon, CheckCircleIcon } from './Icons';

const testimonialsData: Testimonial[] = [
  {
    quote: 'خانم تقوی با تخصص و دلسوزی پرونده ملکی پیچیده ما را به بهترین شکل ممکن به نتیجه رساندند. از ایشان بسیار سپاسگزارم.',
    name: 'محمد رضایی',
    role: 'موکل - پرونده ملکی',
  },
  {
    quote: 'در یک پرونده مالی بسیار نگران بودم، اما راهنمایی‌ها و پیگیری‌های مستمر خانم وکیل باعث شد حقم را کامل بگیرم. واقعاً حرفه‌ای هستند.',
    name: 'سارا احمدی',
    role: 'موکل - پرونده مالی',
  },
  {
    quote: 'صداقت، تعهد و دانش حقوقی بالای ایشان مثال‌زدنی است. بهترین وکیلی که تا به حال داشته‌ام. ایشان را به همه توصیه می‌کنم.',
    name: 'علی کریمی',
    role: 'موکل - پرونده کیفری',
  },
];

const TestimonialCard: React.FC<{ testimonial: Testimonial; icon: React.ReactNode }> = ({ testimonial, icon }) => (
    <div className="bg-white p-8 rounded-xl shadow-lg flex flex-col h-full group">
      <div className="text-blue-600 mb-4 transition-transform duration-300 group-hover:scale-110">
        {icon}
      </div>
      <p className="text-gray-600 italic mb-6 flex-grow">"{testimonial.quote}"</p>
      <div>
        <p className="font-bold text-gray-800">{testimonial.name}</p>
        <p className="text-sm text-gray-500">{testimonial.role}</p>
      </div>
    </div>
  );
  

const Testimonials: React.FC = () => {
  return (
    <section id="testimonials" className="py-20 bg-gray-100">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">اعتماد شما، افتخار ماست</h2>
          <p className="mt-4 text-lg text-gray-600">گوشه‌ای از نظرات موکلین پیشین</p>
          <div className="mt-4 w-24 h-1 bg-blue-700 mx-auto rounded"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonialsData.map((testimonial, index) => (
            <TestimonialCard 
              key={index} 
              testimonial={testimonial} 
              icon={
                index === 0 ? <UsersIcon className="h-10 w-10 text-blue-600" /> :
                index === 1 ? <ShieldCheckIcon className="h-10 w-10 text-green-600" /> :
                <CheckCircleIcon className="h-10 w-10 text-amber-500" />
              }
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
