import React, { useState, useEffect } from 'react';

interface LoadingScreenProps {
  onLoadingComplete: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onLoadingComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [currentText, setCurrentText] = useState(0);

  const loadingTexts = [
    'در حال بارگذاری...',
    'آماده‌سازی تجربه کاربری...',
    'بارگذاری منابع...',
    'تقریباً آماده...'
  ];

  useEffect(() => {
    const textInterval = setInterval(() => {
      setCurrentText((prev) => (prev + 1) % loadingTexts.length);
    }, 800);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setTimeout(() => {
            setIsVisible(false);
            setTimeout(onLoadingComplete, 300);
          }, 500);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 100);

    return () => {
      clearInterval(textInterval);
      clearInterval(progressInterval);
    };
  }, [onLoadingComplete]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-60 h-60 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center px-8">
        {/* Logo/Brand */}
        <div className="mb-8">
          <div className="inline-block">
            <img
              src="/5.png"
              alt="غزاله تقوی"
              className="w-20 h-20 rounded-full shadow-2xl ring-4 ring-white/20 animate-pulse"
            />
          </div>
        </div>

        {/* Main Title */}
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 nastaliq-title animate-pulse">
          غزاله تقوی
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-blue-100 mb-8 iranian-sans">
          وکیل پایه یک دادگستری و میانجیگر رسمی قوه قضائیه
        </p>

        {/* Loading Animation */}
        <div className="mb-8">
          <div className="relative w-64 h-1 bg-white/20 rounded-full mx-auto overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-400 to-purple-400 rounded-full transition-all duration-300 ease-out relative"
              style={{ width: `${Math.min(progress, 100)}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
            </div>
          </div>
          <p className="text-blue-200 mt-2 text-sm">
            {Math.round(progress)}%
          </p>
        </div>

        {/* Loading Text */}
        <div className="h-6 flex items-center justify-center">
          <p className="text-blue-100 text-lg animate-fade-in">
            {loadingTexts[currentText]}
          </p>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <div className="w-96 h-96 border border-blue-400/20 rounded-full animate-spin-slow"></div>
          <div className="absolute top-0 left-0 w-96 h-96 border border-purple-400/20 rounded-full animate-spin-slow-reverse"></div>
        </div>
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
        @keyframes fade-in {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
        .animate-spin-slow-reverse {
          animation: spin-slow-reverse 12s linear infinite;
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen;
