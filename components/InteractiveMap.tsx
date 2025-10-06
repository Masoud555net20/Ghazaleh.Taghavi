import React, { useState, useEffect } from 'react';
import { MaterialCard, MaterialButton } from './MaterialDesign';
import { FadeInOnScroll, ParallaxElement } from './AdvancedAnimations';

interface Location {
  id: string;
  name: string;
  address: string;
  coordinates: [number, number]; // [lat, lng]
  phone: string;
  hours: string;
  description: string;
}

const InteractiveMap: React.FC = () => {
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Sample office location (you should replace with actual coordinates)
  const officeLocation: Location = {
    id: 'office',
    name: 'دفتر وکالت غزاله تقوی',
    address: 'تهران، خیابان ولیعصر، پلاک ۱۲۳',
    coordinates: [35.6892, 51.3890], // Tehran coordinates (replace with actual)
    phone: '۰۲۱-۱۲۳۴۵۶۷۸',
    hours: 'شنبه تا چهارشنبه: ۹ صبح تا ۶ عصر',
    description: 'دفتر اصلی وکالت با فضایی مدرن و دسترسی آسان به مترو و پارکینگ'
  };

  const locations: Location[] = [officeLocation];

  useEffect(() => {
    // Simulate map loading
    const timer = setTimeout(() => {
      setMapLoaded(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const openInGoogleMaps = (location: Location) => {
    const [lat, lng] = location.coordinates;
    const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    window.open(url, '_blank');
  };

  const callPhone = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  return (
    <section id="location" className="relative py-20 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(59,130,246,0.2),transparent_70%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,rgba(147,51,234,0.2),transparent_70%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.1),transparent_70%)]"></div>
      </div>

      <div className="relative container mx-auto px-6 z-10">
        {/* Header */}
        <FadeInOnScroll className="text-center mb-16">
          <div className="mb-6">
            <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse mx-auto mb-4"></div>
          </div>
          <h2 className="text-5xl md:text-6xl lg:text-7xl mb-6 font-bold">
            📍 پیدا کردن ما
          </h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
            دفتر وکالت ما در قلب تهران قرار داره و به راحتی قابل دسترسیه
          </p>
        </FadeInOnScroll>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Map Section */}
          <FadeInOnScroll delay={300} className="order-2 lg:order-1">
            <MaterialCard
              className="h-96 bg-slate-800/50 backdrop-blur-sm border-slate-600/50"
              elevation="high"
            >
              {!mapLoaded ? (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-blue-300">در حال بارگذاری نقشه...</p>
                  </div>
                </div>
              ) : (
                <div className="h-full relative rounded-lg overflow-hidden">
                  {/* Custom Map Visualization */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-900/50 to-slate-900/50">
                    {/* Grid Pattern */}
                    <div className="absolute inset-0 opacity-20">
                      {Array.from({ length: 20 }).map((_, i) => (
                        <div
                          key={i}
                          className="absolute border border-blue-400/30"
                          style={{
                            left: `${(i % 5) * 20}%`,
                            top: `${Math.floor(i / 5) * 20}%`,
                            width: '20%',
                            height: '20%',
                          }}
                        />
                      ))}
                    </div>

                    {/* Location Marker */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <div className="relative">
                        <div className="w-8 h-8 bg-red-500 rounded-full animate-pulse shadow-lg"></div>
                        <div className="absolute inset-0 w-8 h-8 bg-red-500 rounded-full animate-ping"></div>
                        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-2 py-1 rounded text-xs whitespace-nowrap">
                          دفتر وکالت
                        </div>
                      </div>
                    </div>

                    {/* Floating Elements */}
                    <div className="absolute top-4 left-4">
                      <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce opacity-60"></div>
                    </div>
                    <div className="absolute bottom-4 right-4">
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce opacity-60" style={{ animationDelay: '0.5s' }}></div>
                    </div>
                  </div>

                  {/* Map Controls */}
                  <div className="absolute top-4 right-4 flex flex-col gap-2">
                    <button className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded border border-white/30 flex items-center justify-center hover:bg-white/30 transition-all">
                      <span className="text-white text-sm">+</span>
                    </button>
                    <button className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded border border-white/30 flex items-center justify-center hover:bg-white/30 transition-all">
                      <span className="text-white text-sm">−</span>
                    </button>
                  </div>
                </div>
              )}
            </MaterialCard>
          </FadeInOnScroll>

          {/* Location Details */}
          <FadeInOnScroll delay={500} className="order-1 lg:order-2">
            <div className="space-y-6">
              <MaterialCard
                className="bg-slate-800/50 backdrop-blur-sm border-slate-600/50"
                elevation="medium"
                padding="lg"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xl">🏢</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {officeLocation.name}
                    </h3>
                    <p className="text-blue-200 mb-4 leading-relaxed">
                      {officeLocation.description}
                    </p>

                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <span className="text-blue-400 mt-1">📍</span>
                        <div>
                          <p className="text-white font-medium">آدرس:</p>
                          <p className="text-blue-100">{officeLocation.address}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <span className="text-blue-400 mt-1">📞</span>
                        <div>
                          <p className="text-white font-medium">تلفن:</p>
                          <p className="text-blue-100">{officeLocation.phone}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <span className="text-blue-400 mt-1">🕒</span>
                        <div>
                          <p className="text-white font-medium">ساعات کاری:</p>
                          <p className="text-blue-100">{officeLocation.hours}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </MaterialCard>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <MaterialButton
                  onClick={() => openInGoogleMaps(officeLocation)}
                  variant="contained"
                  color="primary"
                  className="w-full"
                >
                  🗺️ باز کردن در گوگل مپ
                </MaterialButton>

                <MaterialButton
                  onClick={() => callPhone(officeLocation.phone)}
                  variant="outlined"
                  color="primary"
                  className="w-full"
                >
                  📞 تماس تلفنی
                </MaterialButton>
              </div>

              {/* Additional Info */}
              <MaterialCard
                className="bg-blue-900/30 backdrop-blur-sm border-blue-700/50"
                elevation="low"
                padding="md"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">💡</span>
                  <div>
                    <h4 className="text-white font-bold mb-1">نکته مهم</h4>
                    <p className="text-blue-100 text-sm">
                      برای مشاوره حضوری، لطفاً از قبل وقت رزرو کنید تا بهترین خدمات رو دریافت کنید.
                    </p>
                  </div>
                </div>
              </MaterialCard>
            </div>
          </FadeInOnScroll>
        </div>

        {/* Decorative Elements */}
        <ParallaxElement speed={0.2} className="absolute top-20 right-10 opacity-20">
          <div className="w-32 h-32 border-2 border-blue-400/30 rounded-full animate-spin-slow"></div>
        </ParallaxElement>

        <ParallaxElement speed={-0.1} className="absolute bottom-20 left-10 opacity-20">
          <div className="w-24 h-24 border-2 border-purple-400/30 rounded-full animate-spin-slow-reverse"></div>
        </ParallaxElement>
      </div>

      <style jsx>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spin-slow-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
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

export default InteractiveMap;
