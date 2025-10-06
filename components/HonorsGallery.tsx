import React, { useState, useMemo } from 'react';
import { MaterialCard, MaterialButton, MaterialChip } from './MaterialDesign';
import { FadeInOnScroll, StaggeredFadeIn, ParallaxElement } from './AdvancedAnimations';

interface HonorCategory {
  id: string;
  name: string;
  icon: string;
}

const HonorsGallery: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'masonry'>('grid');

  const categories: HonorCategory[] = [
    { id: 'all', name: 'همه', icon: '🏆' },
    { id: 'mediation', name: 'میانجی‌گری', icon: '🤝' },
    { id: 'lawyer', name: 'وکالت', icon: '⚖️' },
    { id: 'ceremony', name: 'مراسم', icon: '🎉' },
    { id: 'award', name: 'تقدیرنامه', icon: '🏅' },
  ];

  const honors = [
    {
      id: 1,
      src: '/services/honor/1.jpg',
      title: 'کسب پروانه میانجی‌گری',
      description: 'کسب پروانه میانجیگری در امور کیفری مرکز حل اختلاف قوه قضائیه.',
      category: 'mediation',
      date: '۱۴۰۳',
      tags: ['میانجی‌گری', 'قوه قضائیه', 'پروانه']
    },
    {
      id: 2,
      src: '/services/honor/2.jpg',
      title: 'تقدیرنامه مرکز وکلا',
      description: 'تقدیر نامه مرکز وکلا قوه قضائیه استان همدان',
      category: 'award',
      date: '۱۴۰۳',
      tags: ['تقدیرنامه', 'مرکز وکلا', 'همدان']
    },
    {
      id: 3,
      src: '/services/honor/3.jpg',
      title: 'پروانه میانجیگری در امور کیفری',
      description: 'پروانه رسمی میانجیگری در امور کیفری از قوه قضائیه.',
      category: 'mediation',
      date: '۱۴۰۳',
      tags: ['میانجی‌گری', 'کیفری', 'رسمی']
    },
    {
      id: 4,
      src: '/services/honor/5.jpg',
      title: 'مراسم تحلیف جمعی از وکلا',
      description: 'مراسم تحلیف جمعی از وکلا قوه قضائیه استان همدان',
      category: 'ceremony',
      date: '۱۴۰۳',
      tags: ['تحلیف', 'وکلا', 'مراسم']
    },
    {
      id: 5,
      src: '/services/honor/12.jpg',
      title: 'مراسم تحلیف وکلا',
      description: 'مراسم تحلیف جمعی از وکلا قوه قضائیه استان همدان',
      category: 'ceremony',
      date: '۱۴۰۳',
      tags: ['تحلیف', 'وکلا', 'همدان']
    },
    {
      id: 6,
      src: '/services/13.jpg',
      title: 'مراسم تحلیف جمعی از وکلا',
      description: 'مراسم تحلیف جمعی از وکلا قوه قضائیه استان همدان',
      category: 'ceremony',
      date: '۱۴۰۳',
      tags: ['تحلیف', 'جمعی', 'مراسم']
    },
    {
      id: 7,
      src: '/services/15.jpg',
      title: 'مراسم تحلیف جمعی از وکلا',
      description: 'مراسم تحلیف جمعی از وکلا قوه قضائیه استان همدان',
      category: 'ceremony',
      date: '۱۴۰۳',
      tags: ['تحلیف', 'وکلا', 'مراسم']
    },
    {
      id: 8,
      src: '/services/18.jpg',
      title: 'مشاوره حقوقی تخصصی',
      description: 'ارائه خدمات مشاوره حقوقی توسط وکیل پایه یک دادگستری',
      category: 'lawyer',
      date: '۱۴۰۳',
      tags: ['مشاوره', 'حقوقی', 'تخصصی']
    },
    {
      id: 9,
      src: '/services/19.jpg',
      title: 'جشنواره حقوق و رسانه عامه',
      description: 'جشنواره حقوق و رسانه عامه فروردین 1404',
      category: 'ceremony',
      date: '۱۴۰۴',
      tags: ['جشنواره', 'حقوق', 'رسانه']
    },
  ];

  // Filter and search logic
  const filteredHonors = useMemo(() => {
    return honors.filter(honor => {
      const matchesCategory = selectedCategory === 'all' || honor.category === selectedCategory;
      const matchesSearch = searchTerm === '' ||
        honor.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        honor.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        honor.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

      return matchesCategory && matchesSearch;
    });
  }, [honors, selectedCategory, searchTerm]);

  const openModal = (imageSrc: string) => {
    setSelectedImage(imageSrc);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  return (
    <section id="honors" className="relative py-12 sm:py-20 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 overflow-hidden">
      {/* Simplified Background Elements - Only for desktop */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none hidden md:block">
        <div className="absolute top-10 left-10 w-20 h-20 border border-blue-400/20 rounded-full animate-pulse opacity-30"></div>
        <div className="absolute bottom-10 right-10 w-16 h-16 border border-purple-400/20 rounded-full animate-pulse opacity-20" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <FadeInOnScroll className="text-center mb-8 sm:mb-16">
          <div className="mb-6">
            <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-pulse mx-auto mb-4"></div>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-slate-800 mb-4 sm:mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            گالری افتخارات
          </h2>
          <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto font-medium leading-relaxed">
            افتخارات و دستاوردهای حرفه‌ای در حوزه وکالت و میانجی‌گری
          </p>
        </FadeInOnScroll>

        {/* Search and Filter Controls */}
        <FadeInOnScroll delay={200} className="mb-8 sm:mb-12">
          <MaterialCard className="bg-white/80 backdrop-blur-sm border-0 shadow-xl" elevation="medium" padding="lg">
            <div className="space-y-6">
              {/* Search Bar */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="جستجو در افتخارات..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-6 py-4 pr-12 text-lg border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300"
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                  🔍
                </div>
              </div>

              {/* Category Filters */}
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4">دسته‌بندی‌ها:</h3>
                <div className="flex flex-wrap gap-3 justify-center">
                  {categories.map((category) => (
                    <MaterialButton
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      variant={selectedCategory === category.id ? 'contained' : 'outlined'}
                      color="primary"
                      className="flex items-center gap-2"
                    >
                      <span className="text-lg">{category.icon}</span>
                      {category.name}
                    </MaterialButton>
                  ))}
                </div>
              </div>

              {/* Results Count */}
              <div className="text-center text-gray-600">
                {filteredHonors.length} مورد یافت شد
                {searchTerm && ` برای "${searchTerm}"`}
              </div>
            </div>
          </MaterialCard>
        </FadeInOnScroll>

        {/* Gallery Grid */}
        {filteredHonors.length > 0 ? (
          <StaggeredFadeIn className={`grid gap-6 lg:gap-8 ${
            viewMode === 'grid'
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
              : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 columns-1 sm:columns-2 lg:columns-3'
          }`}>
            {filteredHonors.map((honor, index) => (
              <FadeInOnScroll
                key={honor.id}
                delay={Math.min(index * 50, 500)}
                className={`group ${viewMode === 'masonry' ? 'break-inside-avoid' : ''}`}
              >
                <MaterialCard
                  className="bg-white/90 backdrop-blur-sm overflow-hidden hover:bg-white transition-all duration-500 cursor-pointer group"
                  elevation="hover"
                  onClick={() => openModal(honor.src)}
                >
                  {/* Image Container */}
                  <div className="relative overflow-hidden h-48 sm:h-56 md:h-64">
                    {/* Loading Skeleton */}
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse"></div>

                    <img
                      src={honor.src}
                      alt={honor.title}
                      className="w-full h-full object-cover object-center group-hover:scale-110 transition-all duration-700"
                      loading="lazy"
                      onLoad={(e) => {
                        e.currentTarget.previousElementSibling?.remove();
                        e.currentTarget.classList.add('opacity-100');
                      }}
                      onError={(e) => {
                        console.error(`Failed to load image: ${honor.src}`);
                        e.currentTarget.style.display = 'none';
                      }}
                    />

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    {/* Category Badge */}
                    <div className="absolute top-3 right-3">
                      <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-bold text-gray-800">
                        {categories.find(cat => cat.id === honor.category)?.icon} {categories.find(cat => cat.id === honor.category)?.name}
                      </div>
                    </div>

                    {/* Date Badge */}
                    <div className="absolute top-3 left-3">
                      <div className="bg-blue-600/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-bold text-white">
                        {honor.date}
                      </div>
                    </div>

                    {/* Hover Icon */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                        <span className="text-white text-xl">👁️</span>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 sm:p-6">
                    <h3 className="text-lg sm:text-xl font-black text-slate-700 mb-2 leading-tight group-hover:text-blue-600 transition-colors">
                      {honor.title}
                    </h3>
                    <p className="text-slate-500 text-sm font-medium leading-relaxed mb-4">
                      {honor.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      {honor.tags.slice(0, 3).map((tag, tagIndex) => (
                        <MaterialChip
                          key={tagIndex}
                          label={tag}
                          size="sm"
                          variant="outlined"
                          color="primary"
                        />
                      ))}
                      {honor.tags.length > 3 && (
                        <MaterialChip
                          label={`+${honor.tags.length - 3}`}
                          size="sm"
                          variant="outlined"
                          color="secondary"
                        />
                      )}
                    </div>
                  </div>
                </MaterialCard>
              </FadeInOnScroll>
            ))}
          </StaggeredFadeIn>
        ) : (
          <FadeInOnScroll className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-600 mb-2">نتیجه‌ای یافت نشد</h3>
            <p className="text-gray-500">برای جستجوی "{searchTerm}" نتیجه‌ای یافت نشد.</p>
          </FadeInOnScroll>
        )}

        {/* Advanced Modal */}
        {selectedImage && (
          <div className="fixed inset-0 z-50 animate-fade-in">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-fade-in"
              onClick={closeModal}
            />

            {/* Modal Content */}
            <div className="relative h-full flex items-center justify-center p-4">
              {/* Close Button */}
              <button
                className="absolute top-4 right-4 z-60 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300 animate-bounce-in"
                onClick={closeModal}
              >
                <span className="text-2xl">✕</span>
              </button>

              {/* Image Container */}
              <div className="relative max-w-5xl max-h-[90vh] animate-scale-in">
                <img
                  src={selectedImage}
                  alt="Selected Honor"
                  className="rounded-2xl shadow-2xl max-w-full max-h-full object-contain"
                  onError={(e) => {
                    console.error(`Failed to load modal image: ${selectedImage}`);
                  }}
                />

                {/* Image Info Overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 rounded-b-2xl">
                  <div className="text-white">
                    <h3 className="text-2xl font-bold mb-2">
                      {honors.find(h => h.src === selectedImage)?.title}
                    </h3>
                    <p className="text-lg opacity-90 mb-3">
                      {honors.find(h => h.src === selectedImage)?.description}
                    </p>

                    {/* Tags in Modal */}
                    <div className="flex flex-wrap gap-2">
                      {honors.find(h => h.src === selectedImage)?.tags.map((tag, index) => (
                        <MaterialChip
                          key={index}
                          label={tag}
                          size="sm"
                          variant="filled"
                          color="primary"
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Navigation Arrows */}
                <button className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300">
                  <span className="text-xl">‹</span>
                </button>
                <button className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300">
                  <span className="text-xl">›</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fade-in {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        @keyframes scale-in {
          0% { opacity: 0; transform: scale(0.8); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes bounce-in {
          0% { opacity: 0; transform: scale(0.3); }
          50% { opacity: 1; transform: scale(1.05); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spin-slow-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        .animate-scale-in {
          animation: scale-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .animate-bounce-in {
          animation: bounce-in 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        .animate-spin-slow-reverse {
          animation: spin-slow-reverse 25s linear infinite;
        }
      `}</style>
    </section>
  );
};

export default HonorsGallery;
