import React, { useState } from 'react';

const HonorsGallery: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const honors = [
    {
      id: 1,
      src: '/services/honor/1.jpg',
      title: 'کسب پروانه میانجی‌گری',
      description: 'کسب پروانه میانجیگری در امور کیفری مرکز حل اختلاف قوه قضائیه.',
    },
    {
      id: 2,
      src: '/services/honor/2.jpg',
      title: 'تقدیرنامه مرکز وکلا',
      description: 'تقدیر نامه مرکز وکلا قوه قضائیه استان همدان',
    },
    {
      id: 3,
      src: '/services/honor/3.jpg',
      title: 'پروانه میانجیگری در امور کیفری',
      description: 'پروانه رسمی میانجیگری در امور کیفری از قوه قضائیه.',
    },
    {
      id: 4,
      src: '/services/honor/5.jpg',
      title: 'مراسم تحلیف جمعی از وکلا',
      description: 'مراسم تحلیف جمعی از وکلا قوه قضائیه استان همدان',
    },
    {
      id: 5,
      src: '/services/honor/12.jpg',
      title: 'مراسم تحلیف وکلا',
      description: 'مراسم تحلیف جمعی از وکلا قوه قضائیه استان همدان',
    },
    {
      id: 6,
      src: '/services/13.jpg',
      title: 'مراسم تحلیف جمعی از وکلا',
      description: 'مراسم تحلیف جمعی از وکلا قوه قضائیه استان همدان',
    },
    {
      id: 7,
      src: '/services/15.jpg',
      title: 'مراسم تحلیف جمعی از وکلا',
      description: 'مراسم تحلیف جمعی از وکلا قوه قضائیه استان همدان',
    },
    {
      id: 8,
      src: '/services/18.jpg',
      title: 'مشاوره حقوقی تخصصی',
      description: 'ارائه خدمات مشاوره حقوقی توسط وکیل پایه یک دادگستری',
    },
    {
      id: 9,
      src: '/services/19.jpg',
      title: 'جشنواره حقوق و رسانه عامه',
      description: 'جشنواره حقوق و رسانه عامه فروردین 1404',
    },
  ];

  const openModal = (imageSrc: string) => {
    setSelectedImage(imageSrc);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  return (
    <section id="honors" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-black text-slate-800 mb-6">
            گالری افتخارات
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto font-bold">
            افتخارات و دستاوردهای حرفه‌ای در حوزه وکالت و میانجی‌گری
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {honors.map((honor) => (
            <div
              key={honor.id}
              className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ease-in-out cursor-pointer"
              onClick={() => openModal(honor.src)}
            >
              <div className="overflow-hidden h-80">
                <img
                  src={honor.src}
                  alt={honor.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                  onError={(e) => {
                    console.error(`Failed to load image: ${honor.src}`);
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
              <div className="p-5 text-center">
                <h3 className="text-xl font-black text-slate-700 mb-2">{honor.title}</h3>
                <p className="text-slate-500 text-sm font-bold">{honor.description}</p>
              </div>
            </div>
          ))}
        </div>

        {selectedImage && (
          <div
            className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4 transition-opacity duration-300"
            onClick={closeModal}
          >
            <button
              className="absolute top-4 right-4 text-white text-4xl hover:text-gray-300 transition-colors"
              onClick={closeModal}
            >
              &times;
            </button>

            <div className="relative w-full h-full max-w-6xl max-h-[85vh] p-4 flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
              <img
                src={selectedImage}
                alt="Selected Honor"
                className="rounded-lg shadow-2xl max-w-full max-h-full object-contain cursor-zoom-in transition-transform duration-300"
                onError={(e) => {
                  console.error(`Failed to load modal image: ${selectedImage}`);
                }}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default HonorsGallery;
