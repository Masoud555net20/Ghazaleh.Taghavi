import React from 'react';
import { PhoneIcon, EnvelopeIcon, MapPinIcon } from './Icons';

const WhatsAppIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.516"/>
  </svg>
);

const InstagramIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.441s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.441-1.439-1.441z"/>
  </svg>
);

const TelegramIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
  </svg>
);

const Footer: React.FC = () => {
  return (
    <footer id="contact" className="relative bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-950 text-white py-12 px-6 overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-950 animate-gradient-x"></div>
      </div>
      <div className="relative max-w-4xl mx-auto text-center space-y-8 z-10">
        {/* Main Title */}
        <div className="space-y-2">
          <h2 className="text-6xl md:text-8xl font-extrabold font-nastaliq text-white drop-shadow-2xl" style={{ fontFamily: 'IranNastaliq, Shabnam, Vazir, Samim, Nahid, serif' }}>
            غزاله تقوی
          </h2>
          <p className="text-lg md:text-xl text-gray-200 font-light" style={{ fontFamily: 'Shabnam, Vazir, Samim, Nahid, sans-serif' }}>
            وکیل پایه یک دادگستری
          </p>
        </div>

        {/* Social and Contact Links */}
        <div className="space-y-6">
          {/* Social Links */}
          <div className="flex flex-wrap justify-center gap-6 mb-6">
            <a
              href="https://wa.me/989182308290"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative p-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 hover:border-white/40 transition-all duration-300 hover:scale-110 hover:rotate-12 shadow-lg hover:shadow-xl hover:shadow-green-500/30 animate-pulse"
              aria-label="WhatsApp"
            >
              <WhatsAppIcon className="group-hover:animate-bounce" />
              <div className="absolute inset-0 rounded-full bg-green-500/20 scale-0 group-hover:scale-100 transition-transform duration-300 opacity-0 group-hover:opacity-100" />
            </a>
            <a
              href="https://www.threads.com/@taghavi_ghazaleh?xmt=AQF0fSI7VOfXewTjN584IqRXNl8CqQTiCvGRdwPzIOZX8tA"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative p-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 hover:border-white/40 transition-all duration-300 hover:scale-110 hover:rotate-12 shadow-lg hover:shadow-xl hover:shadow-pink-500/30 animate-pulse"
              aria-label="Instagram"
            >
              <InstagramIcon className="group-hover:animate-bounce" />
              <div className="absolute inset-0 rounded-full bg-pink-500/20 scale-0 group-hover:scale-100 transition-transform duration-300 opacity-0 group-hover:opacity-100" />
            </a>
            <a
              href="https://t.me/ghazalehtaghavi"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative p-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 hover:border-white/40 transition-all duration-300 hover:scale-110 hover:rotate-12 shadow-lg hover:shadow-xl hover:shadow-blue-500/30 animate-pulse"
              aria-label="Telegram"
            >
              <TelegramIcon className="group-hover:animate-bounce" />
              <div className="absolute inset-0 rounded-full bg-blue-500/20 scale-0 group-hover:scale-100 transition-transform duration-300 opacity-0 group-hover:opacity-100" />
            </a>
          </div>

          {/* Contact Info */}
          <div className="space-y-6 text-gray-300">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8">
              <div className="flex items-center gap-3 group cursor-pointer">
                <div className="relative">
                  <PhoneIcon className="w-6 h-6 text-blue-400 group-hover:text-blue-300 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12 animate-pulse" />
                  <div className="absolute inset-0 bg-blue-400/30 rounded-full blur-md scale-0 group-hover:scale-150 transition-transform duration-300"></div>
                </div>
                <span dir="ltr" className="text-lg font-semibold text-white group-hover:text-blue-200 transition-colors duration-300 animate-pulse" style={{ fontFamily: 'Shabnam, Vazir, Samim, Nahid, sans-serif' }}>
                  ۰۹۱۸۲۳۰۸۲۹۰
                </span>
              </div>

              <div className="flex items-center gap-3 group cursor-pointer">
                <div className="relative">
                  <EnvelopeIcon className="w-6 h-6 text-green-400 group-hover:text-green-300 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12 animate-pulse" />
                  <div className="absolute inset-0 bg-green-400/30 rounded-full blur-md scale-0 group-hover:scale-150 transition-transform duration-300"></div>
                </div>
                <a href="mailto:Taghvii.lawyer@gmail.com" className="text-lg font-semibold text-white hover:text-green-200 transition-all duration-300 group-hover:underline decoration-2 underline-offset-4" style={{ fontFamily: 'Shabnam, Vazir, Samim, Nahid, sans-serif' }}>
                  Taghvii.lawyer@gmail.com
                </a>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3 group cursor-pointer animate-bounce">
              <div className="relative">
                <MapPinIcon className="w-6 h-6 text-red-400 group-hover:text-red-300 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12 animate-pulse" />
                <div className="absolute inset-0 bg-red-400/30 rounded-full blur-md scale-0 group-hover:scale-150 transition-transform duration-300"></div>
              </div>
              <span className="text-lg font-semibold text-white group-hover:text-red-200 transition-colors duration-300" style={{ fontFamily: 'Shabnam, Vazir, Samim, Nahid, sans-serif' }}>
                همدان، برج آریان، طبقه ۱۲، واحد ۴
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
              {/* Map Section */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-blue-600/20 rounded-lg blur-xl animate-pulse"></div>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3239.83!2d48.5146!3d34.7990!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3f8a5b0b0b0b0b0b%3A0x0!2zSGFtYWRhbiwgSVI!5e0!3m2!1sen!2sus!4v1690000000000"
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-64 rounded-lg shadow-2xl relative z-10 transition-all duration-500 hover:shadow-blue-500/50 hover:shadow-3xl hover:scale-105 hover:-translate-y-2 border-2 border-blue-300/30"
                  title="Location Map"
                ></iframe>
                <div className="absolute inset-0 rounded-lg bg-gradient-to-t from-blue-900/10 via-transparent to-purple-900/10 pointer-events-none animate-gradient-y"></div>
              </div>

              {/* Business Hours Section */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-blue-600/20 rounded-xl blur-xl animate-pulse"></div>
                <div className="relative bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 shadow-2xl hover:shadow-purple-500/30 transition-all duration-500 hover:scale-105 hover:bg-white/15 h-full">
                  <div className="text-center space-y-3 h-full flex flex-col justify-center">
                    <div className="flex items-center justify-center gap-2 mb-3">
                      <div className="relative">
                        <svg className="w-6 h-6 text-yellow-400 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                        <div className="absolute inset-0 bg-yellow-400/30 rounded-full blur-md animate-pulse"></div>
                      </div>
                      <h3 className="text-3xl font-bold text-white font-nastaliq" style={{ fontFamily: 'IranNastaliq, Shabnam, Vazir, Samim, Nahid, serif' }}>
                        ساعات کاری
                      </h3>
                    </div>

                    <div className="space-y-3 text-gray-200">
                      <div className="flex items-center justify-between bg-white/5 rounded-lg px-4 py-3 border border-white/10 hover:bg-white/10 transition-all duration-300">
                        <span className="text-lg font-bold text-green-400">شنبه تا چهارشنبه:</span>
                        <span className="text-lg font-bold text-white">۸:۰۰ تا ۱۸:۰۰</span>
                      </div>
                      <div className="flex items-center justify-between bg-white/5 rounded-lg px-4 py-3 border border-white/10 hover:bg-white/10 transition-all duration-300">
                        <span className="text-lg font-bold text-red-400">پنجشنبه و جمعه:</span>
                        <span className="text-lg font-bold text-white">تعطیل</span>
                      </div>
                    </div>

                    <div className="text-sm text-gray-300 mt-4 opacity-90 font-medium">
                      آماده ارائه خدمات حقوقی در ساعات کاری
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-6 border-t border-white/20 text-sm text-gray-300 animate-fade-in">
          <p>&copy; {new Date().getFullYear()} غزاله تقوی. تمامی حقوق محفوظ است.</p>
        </div>
      </div>
      
      <style>{`
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-x {
          background-size: 400% 400%;
          animation: gradient-x 15s ease infinite;
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out forwards;
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .group-hover\\:animate-bounce:hover {
          animation: bounce 0.6s ease-in-out;
        }
        @keyframes gradient-y {
          0%, 100% { background-position: 0% 0%; }
          50% { background-position: 0% 100%; }
        }
        .animate-gradient-y {
          background-size: 200% 200%;
          animation: gradient-y 8s ease infinite;
        }
      `}</style>
    </footer>
  );
};

export default Footer;
