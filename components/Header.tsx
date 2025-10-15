import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAccessibility } from './AccessibilityProvider';

// کامپوننت نمایش تاریخ و زمان تهران برای موبایل - طراحی زیبا با افکت
const TehranTimeDisplay: React.FC = () => {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const tehranTime = now.toLocaleString('fa-IR', {
        timeZone: 'Asia/Tehran',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });

      // فرمت ساده و خوانا
      const timeParts = tehranTime.split(',');
      const date = timeParts[0] || '';
      const time = timeParts[1] ? timeParts[1].trim() : '';

      setCurrentDate(date);
      setCurrentTime(time);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="lg:hidden flex flex-col items-center text-center -mt-3 animate-tehran-time-float">
      <div className="relative">
        {/* کادر کوچکتر و مرتب */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200/50 rounded-lg px-3 py-1.5 shadow-md hover:shadow-lg transition-all duration-300 backdrop-blur-sm">
          <div className="flex items-center gap-1.5">
            {/* آیکون ساعت کوچکتر با افکت درخشان */}
            <div className="w-5 h-5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center animate-icon-glow">
              <span className="text-white text-xs">🕐</span>
            </div>

            {/* متن زمان و تاریخ کوچکتر */}
            <div className="flex flex-col">
              <span className="text-xs font-mono font-bold text-gray-800 animate-text-shimmer" style={{ fontFamily: 'Shabnam, Vazir, Samim, Nahid, sans-serif' }}>
                {currentTime}
              </span>
              <span className="text-xs text-gray-600 font-medium leading-tight" style={{ fontFamily: 'Shabnam, Vazir, Samim, Nahid, sans-serif' }}>
                {currentDate}
              </span>
            </div>

            {/* نقطه کوچک رنگی با انیمیشن */}
            <div className="w-1.5 h-1.5 bg-gradient-to-r from-green-400 to-blue-400 rounded-full animate-pulse"></div>
          </div>

          {/* افکت نورانی زیر کادر */}
          <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-400/10 to-purple-400/10 opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
        </div>

        {/* ذرات شناور کوچکتر اطراف کادر */}
        <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-blue-300 rounded-full animate-particle-float opacity-60"></div>
        <div className="absolute -bottom-0.5 -left-0.5 w-1 h-1 bg-purple-300 rounded-full animate-particle-float opacity-60" style={{ animationDelay: '1s' }}></div>
      </div>
    </div>
  );
};

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { announceToScreenReader } = useAccessibility();
  const mobileMenuButtonRef = useRef<HTMLButtonElement>(null);
  const firstMenuItemRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Focus management for mobile menu
  useEffect(() => {
    if (isMobileMenuOpen && firstMenuItemRef.current) {
      firstMenuItemRef.current.focus();
    }
  }, [isMobileMenuOpen]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
        mobileMenuButtonRef.current?.focus();
        announceToScreenReader('منو بسته شد');
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen, announceToScreenReader]);

  // اگر در صفحه گالری افتخارات هستیم، لینک‌های anchor باید به صفحه اصلی اشاره کنن
  const isHonorsPage = location.pathname === '/honors';

  const navLinks = [
    { name: 'خدمات', href: isHonorsPage ? '/#services' : '#services' },
    { name: 'درباره من', href: isHonorsPage ? '/#about' : '#about' },
    { name: 'روند کار', href: isHonorsPage ? '/#process' : '#process' },
    { name: 'گالری افتخارات', href: '/honors' },
    { name: 'مشاور هوشمند', href: isHonorsPage ? '/#assistant' : '#assistant' },
    { name: 'پرداخت', href: isHonorsPage ? '/#payment' : '#payment' },
    { name: 'سوالات متداول', href: isHonorsPage ? '/#faq' : '#faq' },
    { name: 'مقالات', href: isHonorsPage ? '/#blog' : '#blog' },
    { name: 'نظرات موکلین', href: isHonorsPage ? '/#testimonials' : '#testimonials' },
    { name: 'ارتباط با ما', href: isHonorsPage ? '/#contact' : '#contact' },
  ];

  return (
    <header
      className="sticky top-0 z-50 transition-all duration-300 bg-white shadow-xl border-b border-black/10"
      role="banner"
      aria-label="هدر اصلی وبسایت"
    >

      <div className="container mx-auto px-4 py-2 max-w-7xl">
        <div className="flex items-center justify-between gap-3">
          {/* Logo Section - Optimized for mobile */}
          <div className="flex items-center flex-shrink-0">
            <div className="w-28 sm:w-32 md:w-36 lg:w-28 xl:w-32 h-auto">
              <a
                href={isHonorsPage ? '/' : '#'}
                className="transition-all duration-300 hover:scale-110 block focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 rounded-full"
                aria-label="غزاله تقوی - صفحه اصلی"
              >
                <div className="relative">
                  <img
                    src="/5.png"
                    alt="لوگوی غزاله تقوی - وکیل پایه یک دادگستری"
                    className="w-28 sm:w-32 md:w-36 lg:w-28 xl:w-32 h-auto animated-logo max-w-full rounded-full shadow-xl ring-2 ring-white/30"
                  />
                </div>
              </a>
            </div>
          </div>

          {/* Navigation Menu - Centered and properly sized */}
          <nav
            className="hidden lg:flex items-center flex-1 justify-center"
            role="navigation"
            aria-label="منوی اصلی ناوبری"
          >
            <div className="flex items-center gap-1 xl:gap-2 text-sm xl:text-base bg-gray-50/80 rounded-xl px-4 py-3 shadow-sm">
              {navLinks.map((link, index) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="transition-all duration-300 font-medium px-3 py-2 whitespace-nowrap rounded-lg text-sm xl:text-base text-gray-800 hover:text-blue-700 hover:bg-blue-100 hover:shadow-md"
                  style={{
                    animation: `wave-motion 1s ease-in-out infinite ${index * 0.1}s`,
                    fontFamily: 'Shabnam, Vazir, Samim, Nahid, sans-serif'
                  }}
                  aria-label={`بخش ${link.name}`}
                >
                  {link.name}
                </a>
              ))}
            </div>
          </nav>

          {/* CTA Button - Properly sized for all devices */}
          <div className="flex items-center flex-shrink-0 ml-2">
            <a
              href={isHonorsPage ? '/#contact' : '#contact'}
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold py-2.5 px-5 sm:px-7 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 hover:scale-105 text-sm sm:text-base shadow-xl hover:shadow-2xl whitespace-nowrap focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
              style={{ fontFamily: 'Shabnam, Vazir, Samim, Nahid, sans-serif' }}
              aria-label="تماس با ما و اطلاعات ارتباطی"
            >
              پل ارتباطی با ما
            </a>
          </div>

          {/* Mobile Time and Menu Section */}
          <div className="lg:hidden flex items-center gap-3 ml-2">
            <TehranTimeDisplay />
            <button
              ref={mobileMenuButtonRef}
              className="p-2.5 rounded-lg transition-all duration-300 text-white bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
              onClick={() => {
                setIsMobileMenuOpen(!isMobileMenuOpen);
                announceToScreenReader(isMobileMenuOpen ? 'منو بسته شد' : 'منو باز شد');
              }}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-navigation"
              aria-label={isMobileMenuOpen ? 'بستن منوی موبایل' : 'باز کردن منوی موبایل'}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"} />
              </svg>
            </button>
          </div>
        </div>
        {isMobileMenuOpen && (
          <div
            className="lg:hidden relative bg-gradient-to-br from-slate-50 via-white to-blue-50 backdrop-blur-xl border-t border-blue-200/50 shadow-2xl animate-mobile-menu-slide"
            id="mobile-navigation"
            role="navigation"
            aria-label="منوی ناوبری موبایل"
          >
            {/* Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-indigo-500/5 rounded-t-3xl"></div>
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent"></div>

            <nav className="relative flex flex-col py-6 px-4" role="menu">
              {/* Menu Items with Enhanced Styling - Ultra Compact Mobile Version */}
              {navLinks.map((link, index) => (
                <a
                  key={link.name}
                  ref={index === 0 ? firstMenuItemRef : null}
                  href={link.href}
                  className="group relative font-bold transition-all duration-500 text-sm py-1.5 px-2 my-0.5 rounded-md hover:bg-gradient-to-r hover:from-blue-500/10 hover:to-purple-500/10 hover:shadow-md border border-transparent hover:border-blue-200/50 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 animate-mobile-menu-item"
                  style={{
                    animationDelay: `${index * 0.1}s`,
                    fontFamily: 'Shabnam, Vazir, Samim, Nahid, sans-serif',
                    background: `linear-gradient(135deg, rgba(59, 130, 246, 0.05), rgba(147, 51, 234, 0.05))`,
                    transform: `translateY(${index * 2}px)`,
                  }}
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    announceToScreenReader(`بخش ${link.name} انتخاب شد`);
                  }}
                  role="menuitem"
                  tabIndex={isMobileMenuOpen ? 0 : -1}
                  aria-label={`بخش ${link.name}`}
                >
                  <span className="relative z-10 text-gray-700 group-hover:text-blue-700 transition-colors duration-300 flex items-center gap-1.5">
                    {/* Icon placeholder for each menu item */}
                    <span className="w-1 h-1 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    {link.name}
                  </span>

                  {/* Hover background effect */}
                  <div className="absolute inset-0 rounded-md bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  {/* Animated border */}
                  <div className="absolute inset-0 rounded-md border-2 border-transparent group-hover:border-blue-300/50 transition-all duration-500"></div>

                  {/* Shimmer effect */}
                  <div className="absolute inset-0 rounded-md bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 transform -skew-x-12 group-hover:translate-x-full"></div>
                </a>
              ))}

              {/* Enhanced CTA Button - Ultra Compact Mobile Version */}
              <div className="pt-3 mt-1 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-indigo-600/20 rounded-lg blur-md animate-pulse"></div>
                <a
                  href={isHonorsPage ? '/#booking' : '#booking'}
                  className="group relative block w-full bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white font-bold py-2.5 px-3 rounded-lg text-center text-sm shadow-md hover:shadow-blue-500/50 transform hover:scale-105 transition-all duration-500 overflow-hidden"
                  style={{ fontFamily: 'Shabnam, Vazir, Samim, Nahid, sans-serif' }}
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    announceToScreenReader('رزرو وقت مشاوره انتخاب شد');
                  }}
                  role="menuitem"
                  tabIndex={isMobileMenuOpen ? 0 : -1}
                  aria-label="رزرو وقت مشاوره"
                >
                  {/* Button content */}
                  <span className="relative z-10 flex items-center justify-center gap-1.5">
                    <span className="text-base">📅</span>
                    رزرو وقت مشاوره
                    <span className="text-xs opacity-80">→</span>
                  </span>

                  {/* Animated background layers */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-800 to-purple-800 scale-0 group-hover:scale-100 transition-transform duration-700 rounded-lg"></div>

                  {/* Shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 transform -translate-x-full group-hover:translate-x-full"></div>

                  {/* Border animation */}
                  <div className="absolute inset-0 rounded-lg border-2 border-blue-300/50 group-hover:border-white/80 transition-all duration-500"></div>
                </a>
              </div>
            </nav>
          </div>
        )}
      </div>
      <style>{`
        @keyframes shimmer-glow {
          0% {
            background-position: 200% center;
            text-shadow: 0 0 10px rgba(0, 0, 0, 0.6), 0 0 20px rgba(0, 0, 0, 0.4);
          }
          50% {
            text-shadow: 0 0 25px rgba(0, 0, 0, 1), 0 0 40px rgba(0, 0, 0, 0.8);
          }
          100% {
            background-position: -200% center;
            text-shadow: 0 0 10px rgba(0, 0, 0, 0.6), 0 0 20px rgba(0, 0, 0, 0.4);
          }
        }
        .animate-shimmer-glow {
          animation: shimmer-glow 3s linear infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        @keyframes color-shift {
          0% { filter: hue-rotate(0deg) saturate(2); }
          100% { filter: hue-rotate(360deg) saturate(2); }
        }
        @keyframes wave-motion {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        .animate-color-shift {
          animation: color-shift 2s linear infinite;
        }
        @keyframes multi-color-shine {
          0% {
            box-shadow: 0 0 20px rgba(59, 130, 246, 1.0), 0 0 40px rgba(59, 130, 246, 0.8), 0 0 60px rgba(59, 130, 246, 0.6), 0 0 100px rgba(59, 130, 246, 0.4), 0 0 120px rgba(59, 130, 246, 0.2);
          }
          16.67% {
            box-shadow: 0 0 20px rgba(239, 68, 68, 1.0), 0 0 40px rgba(239, 68, 68, 0.8), 0 0 60px rgba(239, 68, 68, 0.6), 0 0 100px rgba(239, 68, 68, 0.4), 0 0 120px rgba(239, 68, 68, 0.2);
          }
          33.33% {
            box-shadow: 0 0 20px rgba(124, 58, 237, 1.0), 0 0 40px rgba(124, 58, 237, 0.8), 0 0 60px rgba(124, 58, 237, 0.6), 0 0 100px rgba(124, 58, 237, 0.4), 0 0 120px rgba(124, 58, 237, 0.2);
          }
          50% {
            box-shadow: 0 0 20px rgba(245, 158, 11, 1.0), 0 0 40px rgba(245, 158, 11, 0.8), 0 0 60px rgba(245, 158, 11, 0.6), 0 0 100px rgba(245, 158, 11, 0.4), 0 0 120px rgba(245, 158, 11, 0.2);
          }
          66.67% {
            box-shadow: 0 0 20px rgba(16, 185, 129, 1.0), 0 0 40px rgba(16, 185, 129, 0.8), 0 0 60px rgba(16, 185, 129, 0.6), 0 0 100px rgba(16, 185, 129, 0.4), 0 0 120px rgba(16, 185, 129, 0.2);
          }
          83.33% {
            box-shadow: 0 0 20px rgba(217, 119, 6, 1.0), 0 0 40px rgba(217, 119, 6, 0.8), 0 0 60px rgba(217, 119, 6, 0.6), 0 0 100px rgba(217, 119, 6, 0.4), 0 0 120px rgba(217, 119, 6, 0.2);
          }
          100% {
            box-shadow: 0 0 20px rgba(59, 130, 246, 1.0), 0 0 40px rgba(59, 130, 246, 0.8), 0 0 60px rgba(59, 130, 246, 0.6), 0 0 100px rgba(59, 130, 246, 0.4), 0 0 120px rgba(59, 130, 246, 0.2);
          }
        }
        .animate-multi-color-shine {
          animation: multi-color-shine 2s ease-in-out infinite;
        }
        @keyframes pulse-glow {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }
        @keyframes multi-color-border {
          0% { border-color: rgba(59, 130, 246, 1); }
          16.67% { border-color: rgba(239, 68, 68, 1); }
          33.33% { border-color: rgba(124, 58, 237, 1); }
          50% { border-color: rgba(245, 158, 11, 1); }
          66.67% { border-color: rgba(16, 185, 129, 1); }
          83.33% { border-color: rgba(217, 119, 6, 1); }
          100% { border-color: rgba(59, 130, 246, 1); }
        }
        .animate-multi-color-border {
          animation: multi-color-border 2s ease-in-out infinite;
        }

        /* انیمیشن‌های بخش زمان تهران */
        @keyframes tehran-time-float {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-2px) scale(1.02); }
        }
        .animate-tehran-time-float {
          animation: tehran-time-float 4s ease-in-out infinite;
        }

        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient-shift {
          background-size: 200% 200%;
          animation: gradient-shift 3s ease infinite;
        }

        @keyframes text-shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .animate-text-shimmer {
          background: linear-gradient(90deg, #1e40af 25%, #3b82f6 50%, #1e40af 75%);
          background-size: 200% 100%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: text-shimmer 2s linear infinite;
        }

        @keyframes icon-glow {
          0%, 100% {
            box-shadow: 0 0 5px rgba(59, 130, 246, 0.5), 0 0 10px rgba(59, 130, 246, 0.3);
          }
          50% {
            box-shadow: 0 0 15px rgba(59, 130, 246, 0.8), 0 0 25px rgba(59, 130, 246, 0.5);
          }
        }
        .animate-icon-glow {
          animation: icon-glow 2s ease-in-out infinite;
        }

        @keyframes particle-float {
          0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0.6; }
          33% { transform: translateY(-8px) translateX(4px); opacity: 1; }
          66% { transform: translateY(4px) translateX(-4px); opacity: 0.8; }
        }
        .animate-particle-float {
          animation: particle-float 3s ease-in-out infinite;
        }

        /* Enhanced Mobile Menu Animations */
        @keyframes mobile-menu-slide {
          0% {
            opacity: 0;
            transform: translateY(-20px) scale(0.95);
            filter: blur(4px);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0px);
          }
        }
        .animate-mobile-menu-slide {
          animation: mobile-menu-slide 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        @keyframes mobile-menu-item {
          0% {
            opacity: 0;
            transform: translateX(-20px) translateY(10px);
          }
          100% {
            opacity: 1;
            transform: translateX(0) translateY(0);
          }
        }
        .animate-mobile-menu-item {
          animation: mobile-menu-item 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        /* Staggered animation delays for menu items */
        .animate-mobile-menu-item:nth-child(1) { animation-delay: 0.1s; }
        .animate-mobile-menu-item:nth-child(2) { animation-delay: 0.2s; }
        .animate-mobile-menu-item:nth-child(3) { animation-delay: 0.3s; }
        .animate-mobile-menu-item:nth-child(4) { animation-delay: 0.4s; }
        .animate-mobile-menu-item:nth-child(5) { animation-delay: 0.5s; }
        .animate-mobile-menu-item:nth-child(6) { animation-delay: 0.6s; }
        .animate-mobile-menu-item:nth-child(7) { animation-delay: 0.7s; }
        .animate-mobile-menu-item:nth-child(8) { animation-delay: 0.8s; }
        .animate-mobile-menu-item:nth-child(9) { animation-delay: 0.9s; }
        .animate-mobile-menu-item:nth-child(10) { animation-delay: 1.0s; }

        /* Enhanced mobile menu button animation */
        @keyframes mobile-button-pulse {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4);
          }
          50% {
            box-shadow: 0 0 0 8px rgba(59, 130, 246, 0);
          }
        }
        .animate-mobile-button-pulse {
          animation: mobile-button-pulse 2s infinite;
        }

        /* Mobile menu backdrop blur animation */
        @keyframes backdrop-appear {
          0% {
            backdrop-filter: blur(0px);
            background: rgba(255, 255, 255, 0);
          }
          100% {
            backdrop-filter: blur(10px);
            background: rgba(255, 255, 255, 0.95);
          }
        }
        .animate-backdrop-appear {
          animation: backdrop-appear 0.3s ease-out forwards;
        }

        /* Header Title Animation */
        @keyframes header-title-glow {
          0%, 100% {
            text-shadow:
              0 0 5px rgba(255, 255, 255, 0.2),
              0 0 10px rgba(255, 255, 255, 0.1),
              0 0 15px rgba(255, 255, 255, 0.05);
            opacity: 0.7;
          }
          50% {
            text-shadow:
              0 0 20px rgba(255, 255, 255, 1),
              0 0 40px rgba(255, 255, 255, 0.8),
              0 0 60px rgba(255, 255, 255, 0.6),
              0 0 80px rgba(255, 255, 255, 0.4),
              0 0 100px rgba(255, 255, 255, 0.2);
            opacity: 1;
          }
        }

        @keyframes header-title-float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          25% {
            transform: translateY(-2px) rotate(0.5deg);
          }
          50% {
            transform: translateY(-4px) rotate(0deg);
          }
          75% {
            transform: translateY(-2px) rotate(-0.5deg);
          }
        }

        .animate-header-title {
          display: inline-block;
          will-change: transform, text-shadow;
        }

        @keyframes header-title-shine {
          0% {
            background-position: -200% center;
          }
          100% {
            background-position: 200% center;
          }
        }
        @keyframes rainbow-text {
          0% { color: #3b82f6; text-shadow: 0 0 10px rgba(59, 130, 246, 0.8); }
          12.5% { color: #ef4444; text-shadow: 0 0 10px rgba(239, 68, 68, 0.8); }
          25% { color: #7c3aed; text-shadow: 0 0 10px rgba(124, 58, 237, 0.8); }
          37.5% { color: #f59e0b; text-shadow: 0 0 10px rgba(245, 158, 11, 0.8); }
          50% { color: #10b981; text-shadow: 0 0 10px rgba(16, 185, 129, 0.8); }
          62.5% { color: #d97706; text-shadow: 0 0 10px rgba(217, 119, 6, 0.8); }
          75% { color: #ec4899; text-shadow: 0 0 10px rgba(236, 72, 153, 0.8); }
          87.5% { color: #eab308; text-shadow: 0 0 10px rgba(234, 179, 8, 0.8); }
          100% { color: #3b82f6; text-shadow: 0 0 10px rgba(59, 130, 246, 0.8); }
        }
        .rainbow-text {
          animation: rainbow-text 3s ease-in-out infinite;
          font-weight: bold;
          text-align: center;
          background: linear-gradient(45deg, #3b82f6, #ef4444, #7c3aed, #f59e0b, #10b981, #d97706, #ec4899, #eab308);
          background-size: 400% 400%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          display: inline-block;
        }
        /* Prominent logo animation: movement + hue cycling + glow */
        .animated-logo {
          display: block;
          max-width: 100%;
          height: auto;
          border-radius: 9999px;
          background: transparent;
          transform-origin: center center;
          will-change: transform, box-shadow, filter;
          animation: logo-move 4s ease-in-out infinite, logo-hue 6s linear infinite, logo-glow 6s ease-in-out infinite;
        }
        @keyframes logo-move {
          0% { transform: translateY(0) rotate(0deg) scale(1); }
          20% { transform: translateY(-3px) rotate(1deg) scale(1.02); }
          40% { transform: translateY(-6px) rotate(-1deg) scale(1.05); }
          60% { transform: translateY(-3px) rotate(2deg) scale(1.03); }
          80% { transform: translateY(-1px) rotate(0.5deg) scale(1.01); }
          100% { transform: translateY(0) rotate(0deg) scale(1); }
        }
        @keyframes logo-hue {
          0% { filter: hue-rotate(0deg) saturate(1.2); }
          14% { filter: hue-rotate(50deg) saturate(1.2); } /* Blue to Purple */
          28% { filter: hue-rotate(100deg) saturate(1.2); } /* Purple to Green */
          42% { filter: hue-rotate(150deg) saturate(1.2); } /* Green to Red */
          57% { filter: hue-rotate(200deg) saturate(1.2); } /* Red to Orange */
          71% { filter: hue-rotate(250deg) saturate(1.2); } /* Orange to Pink */
          85% { filter: hue-rotate(300deg) saturate(1.2); } /* Pink to Yellow */
          100% { filter: hue-rotate(360deg) saturate(1.2); } /* Yellow back to Blue */
        }
        @keyframes logo-glow {
          0% { box-shadow: 0 6px 14px rgba(59,130,246,0.3), 0 0 20px rgba(59,130,246,0.2); } /* Blue */
          14% { box-shadow: 0 8px 20px rgba(124,58,237,0.35), 0 0 25px rgba(124,58,237,0.25); } /* Purple */
          28% { box-shadow: 0 10px 28px rgba(16,185,129,0.4), 0 0 30px rgba(16,185,129,0.3); } /* Green */
          42% { box-shadow: 0 8px 20px rgba(239,68,68,0.35), 0 0 25px rgba(239,68,68,0.25); } /* Red */
          57% { box-shadow: 0 10px 28px rgba(245,158,11,0.4), 0 0 30px rgba(245,158,11,0.3); } /* Orange */
          71% { box-shadow: 0 8px 20px rgba(236,72,153,0.35), 0 0 25px rgba(236,72,153,0.25); } /* Pink */
          85% { box-shadow: 0 10px 28px rgba(234,179,8,0.4), 0 0 30px rgba(234,179,8,0.3); } /* Yellow */
          100% { box-shadow: 0 6px 14px rgba(59,130,246,0.3), 0 0 20px rgba(59,130,246,0.2); } /* Back to Blue */
        }
        @media (max-width: 640px) {
          /* Mobile-first logo optimization */
          .animated-logo {
            width: 112px !important; /* Larger mobile logo size */
            animation: logo-move 12s ease-in-out infinite, logo-hue 15s linear infinite, logo-glow 15s ease-in-out infinite !important;
            box-shadow: 0 1px 4px rgba(59,130,246,0.1) !important;
          }

          /* Mobile header optimization */
          .container.mx-auto.px-4.py-4 {
            padding: 0.75rem 1rem !important;
          }

          /* Mobile navigation improvements */
          .sticky {
            backdrop-filter: blur(5px) !important;
            background: rgba(255, 255, 255, 0.88) !important;
          }

          /* Mobile menu button positioning */
          button.lg\\:hidden {
            padding: 8px !important;
            border-radius: 8px !important;
            background: rgba(59, 130, 246, 0.05) !important;
            border: 1px solid rgba(59, 130, 246, 0.1) !important;
          }

          /* Mobile menu styling */
          .lg\\:hidden.bg-white {
            background: rgba(255, 255, 255, 0.94) !important;
            backdrop-filter: blur(5px) !important;
            border-top: 1px solid rgba(59, 130, 246, 0.05) !important;
            box-shadow: 0 1px 10px rgba(0, 0, 0, 0.05) !important;
          }

          /* Mobile menu links - ultra compact */
          .lg\\:hidden nav {
            padding: 0.75rem !important;
          }

          .lg\\:hidden a {
            padding: 0.5rem 0.75rem !important;
            border-radius: 6px !important;
            margin-bottom: 0.25rem !important;
            font-size: 0.875rem !important;
            font-weight: 600 !important;
            transition: all 0.2s ease !important;
            border-left: 2px solid transparent !important;
            color: #1e40af !important; /* Dark blue color for menu text */
          }

          .lg\\:hidden a:hover {
            background: rgba(59, 130, 246, 0.1) !important;
            border-left-color: #3b82f6 !important;
            transform: translateX(2px) !important;
            color: #1d4ed8 !important; /* Darker blue on hover */
          }

          /* Mobile CTA button - ultra compact */
          .lg\\:hidden a[href="#booking"] {
            background: linear-gradient(135deg, #3b82f6, #1d4ed8) !important;
            color: white !important;
            margin-top: 0.75rem !important;
            padding: 0.75rem !important;
            border-radius: 8px !important;
            box-shadow: 0 2px 6px rgba(59, 130, 246, 0.2) !important;
            font-size: 0.95rem !important;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .animated-logo { animation: none !important; filter: none !important; box-shadow: none !important; transform: none !important; }
        }

        /* Enhanced responsive design for better alignment */
        @media (min-width: 1024px) and (max-width: 1280px) {
          /* Tablet and smaller desktop screens */
          .container .mx-auto .px-4 .py-3 .max-w-7xl nav {
            margin-left: 1rem !important;
            margin-right: 1rem !important;
          }

          .container .mx-auto .px-4 .py-3 .max-w-7xl nav .flex {
            gap: 0.25rem !important;
          }

          .container .mx-auto .px-4 .py-3 .max-w-7xl nav .flex a {
            font-size: 0.75rem !important;
            padding-left: 0.5rem !important;
            padding-right: 0.5rem !important;
          }
        }

        @media (min-width: 1280px) {
          /* Large desktop screens */
          .container .mx-auto .px-4 .py-3 .max-w-7xl nav {
            margin-left: 2rem !important;
            margin-right: 2rem !important;
          }
        }

        /* Ensure proper text rendering at 100% zoom */
        @media screen and (-webkit-min-device-pixel-ratio: 1) {
          .container .mx-auto .px-4 .py-3 .max-w-7xl nav a {
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }
        }

        /* High DPI displays */
        @media screen and (-webkit-min-device-pixel-ratio: 2),
               screen and (min-resolution: 192dpi) {
          .animated-logo {
            image-rendering: -webkit-optimize-contrast;
            image-rendering: crisp-edges;
          }
        }

        /* Prevent layout shift on hover */
        .container .mx-auto .px-4 .py-3 .max-w-7xl nav a {
          will-change: transform, color, background-color;
          backface-visibility: hidden;
          transform: translateZ(0);
        }

        /* Better text spacing for Persian/Arabic text */
        .container .mx-auto .px-4 .py-3 .max-w-7xl nav .flex a {
          letter-spacing: 0.02em;
          word-spacing: 0.1em;
        }
        @keyframes multi-color-border {
          0% { border-color: rgba(59, 130, 246, 1); }
          16.67% { border-color: rgba(239, 68, 68, 1); }
          33.33% { border-color: rgba(124, 58, 237, 1); }
          50% { border-color: rgba(245, 158, 11, 1); }
          66.67% { border-color: rgba(16, 185, 129, 1); }
          83.33% { border-color: rgba(217, 119, 6, 1); }
          100% { border-color: rgba(59, 130, 246, 1); }
        }
        .animate-multi-color-border {
          animation: multi-color-border 2s ease-in-out infinite;
        }
      `}</style>
    </header>
  );
};

export default Header;
