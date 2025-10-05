import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    <header className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-xl border-b border-black/10' : 'bg-transparent'}`}>
      <div className="container mx-auto px-4 py-4 max-w-7xl">
        <div className="flex items-center justify-between gap-3">
          {/* Logo Section - Even Larger for mobile */}
          <div className="flex items-center flex-shrink-0">
            <div className="w-24 sm:w-28 lg:w-18 xl:w-20 h-auto">
              <a href={isHonorsPage ? '/' : '#'} className="transition-all duration-300 hover:scale-110 block">
                <div className="relative">
                  <img src="/5.png" alt="غزاله تقوی" className="w-24 sm:w-28 lg:w-18 xl:w-20 h-auto animated-logo max-w-full rounded-full shadow-xl ring-2 ring-white/30" />
                </div>
              </a>
            </div>
          </div>

          {/* Navigation Menu - Centered and prominent */}
          <nav className="hidden lg:flex items-center flex-1 justify-center">
            <div className={`flex items-center gap-1 xl:gap-2 text-sm xl:text-base ${isScrolled ? 'bg-gray-50/80' : 'bg-white/10'} rounded-xl px-4 py-3 shadow-sm`} style={{backdropFilter: isScrolled ? 'none' : 'blur(10px)'}}>
              {navLinks.map((link, index) => (
                <a
                  key={link.name}
                  href={link.href}
                  className={`transition-all duration-300 font-semibold px-3 py-2 whitespace-nowrap rounded-lg text-sm xl:text-base ${isScrolled ? 'text-gray-800 hover:text-blue-700 hover:bg-blue-100 hover:shadow-md' : 'text-gray-100 hover:text-white hover:bg-white/20 hover:shadow-lg'}`}
                  style={{
                    animation: `wave-motion 1s ease-in-out infinite ${index * 0.1}s`,
                    fontFamily: 'Shabnam, Vazir, Samim, Nahid, sans-serif'
                  }}
                >
                  {link.name}
                </a>
              ))}
            </div>
          </nav>

          {/* CTA Button - Wider and more prominent for mobile */}
          <div className="flex items-center flex-shrink-0 ml-3">
            <a href={isHonorsPage ? '/#booking' : '#booking'} className="bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold py-3 px-6 sm:px-8 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 hover:scale-105 text-sm xl:text-base shadow-xl hover:shadow-2xl whitespace-nowrap" style={{ fontFamily: 'Shabnam, Vazir, Samim, Nahid, sans-serif' }}>
              رزرو وقت مشاوره
            </a>
          </div>
          <button
            className={`lg:hidden p-3 rounded-xl transition-all duration-300 ${isScrolled ? 'text-gray-800 bg-gray-100 hover:bg-gray-200 shadow-md' : 'text-white bg-white/10 hover:bg-white/20 shadow-lg'} backdrop-blur-sm`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </div>
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-200 shadow-xl">
            <nav className="flex flex-col space-y-2 py-8 px-6">
            {navLinks.map((link, index) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-gray-800 hover:text-blue-700 font-bold transition-all duration-300 text-xl py-5 px-6 rounded-2xl hover:bg-blue-50 hover:shadow-lg border border-gray-200"
                  style={{
                    animation: `wave-motion 1s ease-in-out infinite ${index * 0.1}s`,
                    fontFamily: 'Shabnam, Vazir, Samim, Nahid, sans-serif'
                  }}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </a>
              ))}
              <div className="pt-4 border-t border-gray-200 mt-4">
                <a
                  href={isHonorsPage ? '/#booking' : '#booking'}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold py-5 px-8 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 text-center text-lg shadow-lg hover:shadow-xl transform hover:scale-105 block w-full"
                  style={{ fontFamily: 'Shabnam, Vazir, Samim, Nahid, sans-serif' }}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  رزرو وقت مشاوره
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
            width: 75px !important; /* Smaller for mobile */
            animation: logo-move 12s ease-in-out infinite, logo-hue 15s linear infinite, logo-glow 15s ease-in-out infinite !important;
            box-shadow: 0 1px 4px rgba(59,130,246,0.1) !important;
          }

          /* Mobile navigation improvements */
          .sticky {
            backdrop-filter: blur(5px) !important;
            background: rgba(255, 255, 255, 0.88) !important;
          }

          /* Mobile menu button positioning */
          button.lg\\:hidden {
            padding: 3px !important;
            border-radius: 3px !important;
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

          /* Mobile menu links */
          .lg\\:hidden nav {
            padding: 0.4rem 0.6rem !important;
          }

          .lg\\:hidden a {
            padding: 0.3rem 0.5rem !important;
            border-radius: 3px !important;
            margin-bottom: 0.15rem !important;
            font-size: 0.8rem !important;
            font-weight: 500 !important;
            transition: all 0.15s ease !important;
            border-left: 2px solid transparent !important;
          }

          .lg\\:hidden a:hover {
            background: rgba(59, 130, 246, 0.05) !important;
            border-left-color: #3b82f6 !important;
            transform: translateX(1px) !important;
          }

          /* Mobile CTA button */
          .lg\\:hidden a[href="#booking"] {
            background: linear-gradient(135deg, #3b82f6, #1d4ed8) !important;
            color: white !important;
            margin-top: 0.4rem !important;
            padding: 0.5rem !important;
            border-radius: 6px !important;
            box-shadow: 0 1px 6px rgba(59, 130, 246, 0.2) !important;
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
