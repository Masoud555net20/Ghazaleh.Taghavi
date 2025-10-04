
import React, { useState } from 'react';
import { PlusIcon, MinusIcon } from './Icons';

const faqData = [
  {
    question: 'هزینه مشاوره حقوقی چقدر است؟',
    answer: 'هزینه مشاوره بر اساس نوع آن (حضوری، تلفنی، آنلاین) و پیچیدگی موضوع حقوقی شما متفاوت است. برای اطلاع دقیق از تعرفه‌ها لطفاً با دفتر تماس بگیرید یا فرم رزرو وقت را تکمیل نمایید.'
  },
  {
    question: 'آیا برای تنظیم قرارداد نیز مشاوره ارائه می‌دهید؟',
    answer: 'بله، یکی از خدمات اصلی ما، بررسی و تنظیم انواع قراردادهای حقوقی از جمله مبایعه‌نامه، اجاره‌نامه، قراردادهای مشارکت و تجاری است تا از بروز مشکلات حقوقی در آینده جلوگیری شود.'
  },
  {
    question: 'در چه زمینه‌هایی وکالت قبول می‌کنید؟',
    answer: 'حوزه‌های تخصصی ما شامل دعاوی ملکی، خانواده (طلاق، مهریه، حضانت)، کیفری، امور قراردادها، و مطالبات اسناد تجاری (چک و سفته) می‌باشد. برای مشاهده لیست کامل به بخش خدمات مراجعه کنید.'
  },
  {
    question: 'آیا امکان مشاوره به صورت غیرحضوری وجود دارد؟',
    answer: 'بله، شما می‌توانید از طریق فرم رزرو وقت در سایت، درخواست مشاوره تلفنی یا آنلاین (تصویری) ثبت کنید تا در زمان تعیین شده با شما تماس گرفته شود.'
  }
];

const FaqItem: React.FC<{ item: typeof faqData[0]; isOpen: boolean; onClick: () => void }> = ({ item, isOpen, onClick }) => {
  return (
    <div className="border-b border-gray-200 py-4">
      <button onClick={onClick} className="w-full flex justify-between items-center text-right">
        <h3 className="text-lg font-semibold text-gray-800">{item.question}</h3>
        <span className="text-blue-700">
          {isOpen ? <MinusIcon /> : <PlusIcon />}
        </span>
      </button>
      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-96 mt-4' : 'max-h-0'}`}
      >
        <p className="text-gray-600 leading-relaxed pr-2">{item.answer}</p>
      </div>
    </div>
  );
};

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleClick = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">سوالات متداول</h2>
          <p className="mt-4 text-lg text-gray-600">پاسخ به برخی از پرسش‌های رایج شما</p>
          <div className="mt-4 w-24 h-1 bg-blue-700 mx-auto rounded"></div>
        </div>
        <div className="max-w-3xl mx-auto">
          {faqData.map((item, index) => (
            <FaqItem
              key={index}
              item={item}
              isOpen={openIndex === index}
              onClick={() => handleClick(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
