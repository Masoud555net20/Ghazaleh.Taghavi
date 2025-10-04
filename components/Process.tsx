
import React from 'react';
import { ChatBubbleLeftRightIcon, DocumentMagnifyingGlassIcon, GavelIcon, ShieldCheckIcon } from './Icons';

const Process: React.FC = () => {
    const processSteps = [
        {
            icon: <ChatBubbleLeftRightIcon />,
            title: 'مرحله اول: مشاوره اولیه',
            description: 'در این جلسه، شما مشکل خود را مطرح کرده و ما یک ارزیابی کلی از پرونده و راهکارهای ممکن ارائه می‌دهیم.',
        },
        {
            icon: <DocumentMagnifyingGlassIcon />,
            title: 'مرحله دوم: بررسی اسناد و استراتژی',
            description: 'پس از قبول وکالت، تمام اسناد و مدارک به دقت بررسی شده و بهترین استراتژی دفاعی برای پرونده شما تدوین می‌شود.',
        },
        {
            icon: <GavelIcon />,
            title: 'مرحله سوم: پیگیری در مراجع قضایی',
            description: 'با تنظیم دادخواست یا لایحه، پرونده شما را در دادسرا، دادگاه و سایر مراجع ذی‌صلاح با جدیت پیگیری می‌کنیم.',
        },
         {
            icon: <ShieldCheckIcon />,
            title: 'مرحله چهارم: دستیابی به نتیجه',
            description: 'تمام تلاش ما بر این است که با استفاده از دانش و تجربه، بهترین نتیجه ممکن را برای احقاق حقوق شما به دست آوریم.',
        },
    ];

    return (
        <section id="process" className="py-20 bg-gray-100">
            <div className="container mx-auto px-6">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800">مسیر همکاری با ما</h2>
                    <p className="mt-4 text-lg text-gray-600">یک فرآیند شفاف و گام به گام برای دفاع از حقوق شما</p>
                    <div className="mt-4 w-24 h-1 bg-blue-700 mx-auto rounded"></div>
                </div>
                <div className="relative">
                    <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-blue-200 -translate-y-1/2"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {processSteps.map((step, index) => (
                            <div key={index} className="text-center bg-white p-6 rounded-xl shadow-lg relative z-10">
                                <div className="mx-auto mb-4 flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-700 rounded-full border-4 border-white">
                                    {step.icon}
                                </div>
                                <h3 className="text-lg font-bold text-gray-800 mb-2">{step.title}</h3>
                                <p className="text-gray-600 text-sm">{step.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Process;
