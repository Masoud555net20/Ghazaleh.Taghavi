
import React from 'react';
import { ScaleIcon, BuildingOffice2Icon, UsersIcon, ShieldCheckIcon, BanknotesIcon, HomeModernIcon } from './Icons';

interface Service {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const servicesData: Service[] = [
  {
    icon: <ScaleIcon />,
    title: 'دعاوی حقوقی',
    description: 'مشاوره و وکالت در کلیه دعاوی ملکی، قراردادها، مطالبات، امور ثبتی و خانواده.',
  },
  {
    icon: <ShieldCheckIcon />,
    title: 'دعاوی کیفری',
    description: 'دفاع از حقوق شما در تمامی مراحل دادسرا و دادگاه در جرائم مختلف.',
  },
  {
    icon: <UsersIcon />,
    title: 'امور خانواده',
    description: 'وکالت تخصصی در پرونده‌های طلاق، مهریه، نفقه، حضانت فرزندان و انحصار وراثت.',
  },
  {
    icon: <BuildingOffice2Icon />,
    title: 'شرکت‌های تجاری',
    description: 'ارائه مشاوره حقوقی به شرکت‌ها، تنظیم قراردادهای تجاری و دعاوی مرتبط.',
  },
  {
    icon: <BanknotesIcon />,
    title: 'چک و اسناد تجاری',
    description: 'پیگیری حقوقی و کیفری جهت وصول مطالبات ناشی از چک، سفته و سایر اسناد تجاری.',
  },
  {
    icon: <HomeModernIcon />,
    title: 'املاک و اراضی',
    description: 'مشاوره در خرید و فروش ملک، تنظیم مبایعه‌نامه، دعاوی خلع ید و الزام به تنظیم سند.',
  },
];

const ServiceCard: React.FC<{ service: Service }> = ({ service }) => (
  <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 text-center">
    <div className="mx-auto mb-6 flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-700 rounded-full">
      {service.icon}
    </div>
    <h3 className="text-xl font-bold text-gray-800 mb-3">{service.title}</h3>
    <p className="text-gray-600 leading-relaxed">{service.description}</p>
  </div>
);

const Services: React.FC = () => {
  return (
    <section id="services" className="py-12 sm:py-20 bg-gray-100">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800">حوزه‌های تخصصی وکالت</h2>
          <p className="mt-2 sm:mt-4 text-base sm:text-lg text-gray-600">ارائه خدمات حقوقی جامع و تخصصی برای احقاق حقوق شما</p>
          <div className="mt-3 sm:mt-4 w-16 sm:w-24 h-1 bg-blue-700 mx-auto rounded"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {servicesData.map((service, index) => (
            <ServiceCard key={index} service={service} />
          ))}
        </div>

        {/* Mobile-specific CTA */}
        <div className="mt-8 sm:mt-12 text-center block sm:hidden">
          <div className="bg-blue-50 p-6 rounded-xl border-2 border-blue-200">
            <h3 className="text-lg font-bold text-blue-900 mb-2">نیاز به مشاوره حقوقی دارید؟</h3>
            <p className="text-sm text-blue-700 mb-4">همین الان با ما تماس بگیرید</p>
            <a
              href="#booking"
              className="inline-block bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors duration-300 shadow-lg"
            >
              رزرو مشاوره رایگان
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
