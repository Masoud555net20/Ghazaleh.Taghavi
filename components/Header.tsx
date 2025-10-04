import React, { useState, useEffect } from 'react';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'خدمات', href: '#services' },
    { name: 'درباره من', href: '#about' },
    { name: 'روند کار', href: '#process' },
    { name: 'مشاور هوشمند', href: '#assistant' },
    { name: 'پرداخت', href: '#payment' },
    { name: 'سوالات متداول', href: '#faq' },
    { name: 'مقالات', href: '#blog' },
    { name: 'نظرات موکلین', href: '#testimonials' },
    { name: 'ارتباط با ما', href: '#contact' },
  ];

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-xl border-b border-black/10' : 'bg-transparent'}`}>
      <div className="container mx-auto px-4 py-0 max-w-7xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-20 sm:w-24 lg:w-20 h-auto">
              <a href="#" className="transition-all duration-300 hover:scale-110">
                <div className="relative">
                  <img src="/5.png" alt="غزاله تقوی" className="w-20 sm:w-24 lg:w-20 h-auto animated-logo max-w-full rounded-full" />
                </div>
              </a>
            </div>
            <div className="hidden sm:block">
              <h1 className="font-nastaliq text-xl lg:text-2xl font-bold text-white animate-header-title" style={{
                animation: 'header-title-glow 2s ease-in-out infinite, header-title-float 3s ease-in-out infinite, header-title-shine 4s linear infinite',
                textShadow: '0 0 20px rgba(255, 255, 255, 0.8), 0 0 40px rgba(255, 255, 255, 0.6), 0 0 60px rgba(255, 255, 255, 0.4), 0 0 80px rgba(255, 255, 255, 0.2)',
                background: 'linear-gradient(45deg, #ffffff, #f0f9ff, #e0f2fe, #ffffff)',
                backgroundSize: '300% 300%',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                غزاله تقوی
              </h1>
            </div>
          </div>
          <nav className="hidden lg:flex items-center space-x-4 space-x-reverse text-sm">
            {navLinks.map((link, index) => (
              <a
                key={link.name}
                href={link.href}
                className={`transition-colors duration-300 font-medium px-2 py-1 whitespace-nowrap ${isScrolled ? 'text-gray-700 hover:text-blue-600' : 'text-gray-200 hover:text-white'}`}
                style={{ animation: `wave-motion 1s ease-in-out infinite ${index * 0.1}s` }}
              >
                {link.name}
              </a>
            ))}
          </nav>
          <a href="#booking" className="hidden md:inline-block bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-800 transition-transform duration-300 hover:scale-105">
            رزرو وقت مشاوره
          </a>
          <button 
            className={`lg:hidden ${isScrolled ? 'text-gray-800' : 'text-white'}`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </div>
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-200">
            <nav className="flex flex-col space-y-4 py-4 px-6">
            {navLinks.map((link, index) => (
                <a 
                  key={link.name} 
                  href={link.href} 
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-300"
                  style={{ animation: `wave-motion 1s ease-in-out infinite ${index * 0.1}s` }}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </a>
              ))}
              <a 
                href="#booking" 
                className="bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-800 transition-colors duration-300 text-center mt-4"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                رزرو وقت مشاوره
              </a>
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
          /* increase mobile logo a bit for better visibility */
          .animated-logo { 
            width: 96px; 
            animation: logo-move 6s ease-in-out infinite, logo-hue 8s linear infinite, logo-glow 8s ease-in-out infinite !important;
            box-shadow: 0 4px 12px rgba(59,130,246,0.2) !important;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .animated-logo { animation: none !important; filter: none !important; box-shadow: none !important; transform: none !important; }
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
