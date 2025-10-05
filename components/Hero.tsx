import React, { useState, useEffect } from 'react';
import LazyImage from './LazyImage';

const images = [
  '/1.png',
  '/2.png',
  '/3.jpg',
  '/4.webp',
  '/5.jpg',
];

const Hero: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState<Set<number>>(new Set());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 4000); // Increased interval for better performance

    return () => clearInterval(intervalId);
  }, []);

  const handleImageLoad = (index: number) => {
    setImagesLoaded(prev => new Set([...prev, index]));
  };

  // Preload next image for smoother transitions
  useEffect(() => {
    const nextIndex = (currentIndex + 1) % images.length;
    const preloadImg = new Image();
    preloadImg.src = images[nextIndex];
  }, [currentIndex]);

  return (
    <section id="home" className="relative min-h-screen flex items-start justify-center text-white text-center overflow-hidden bg-black pt-[15vh] sm:pt-0 sm:items-center">
      {/* Background Image Slideshow */}
      {images.map((src, index) => {
        const slideStyle: React.CSSProperties = {
          backgroundImage: `url('${src}')`,
          zIndex: 1,
          backgroundPosition: 'center center',
          backgroundSize: 'cover',
        };

        return (
          <div
            key={src}
            className={`absolute inset-0 hero-bg ${index === currentIndex ? 'active' : 'inactive'}`}
            style={{ ...slideStyle, opacity: index === currentIndex ? 1 : 0 }}
          />
        );
      })}
      
      {/* Overlay: Subtle overlay for better text readability */}
      <div className="absolute inset-0 bg-gray-900 bg-opacity-40" style={{ zIndex: 2 }}></div>

      {/* Content - Positioned higher for mobile */}
      <div className="relative z-10 p-4 sm:p-6 max-w-6xl mx-auto w-full flex flex-col items-center justify-center mobile-top-content" style={{ zIndex: 3 }}>
        <h1 className="font-nastaliq hero-title leading-none mb-4 animate-fade-in-down" style={{
          color: '#FFD700',
          animation: 'golden-glow 1.5s ease-in-out infinite, titleFloat 2s ease-in-out infinite',
          textShadow: '0 0 30px rgba(255, 215, 0, 0.8), 0 0 60px rgba(255, 165, 0, 0.5), 0 0 90px rgba(255, 255, 255, 0.3)',
          filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))',
          fontFeatureSettings: 'liga on, calt on',
          fontKerning: 'auto',
          textRendering: 'optimizeLegibility',
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
          letterSpacing: '0px',
          wordSpacing: '0px',
          lineHeight: '1.3',
          direction: 'rtl',
          unicodeBidi: 'embed'
        }}>
          غزاله تقوی
        </h1>
        <p className="hero-subtitle text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-light mb-6 animate-fade-in-up" style={{
          color: '#FFFFFF',
          animation: 'subtitleShimmer 2s ease-in-out infinite, subtitleFloat 2s ease-in-out infinite',
          textShadow: '0 0 20px rgba(255, 255, 255, 0.9), 0 0 40px rgba(255, 255, 255, 0.7), 0 0 60px rgba(255, 255, 255, 0.5), 0 0 80px rgba(255, 255, 255, 0.3), 2px 2px 4px rgba(0, 0, 0, 0.8)',
          filter: 'drop-shadow(0 2px 8px rgba(0, 0, 0, 0.6))',
          fontFeatureSettings: 'liga on, calt on',
          fontKerning: 'auto',
          textRendering: 'optimizeLegibility',
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
          letterSpacing: '1px',
          lineHeight: '1.8',
          direction: 'rtl',
          unicodeBidi: 'embed',
          fontWeight: '500'
        }}>
          وکیل پایه یک دادگستری و میانجیگر رسمی قوه قضائیه
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in-up animation-delay-300">
          <a href="#booking" className="luxury-button primary-button font-semibold py-4 px-8 sm:py-3 sm:px-8 rounded-2xl hover:scale-105 shadow-2xl w-full sm:w-auto text-center text-sm sm:text-base relative overflow-hidden group">
            <span className="relative z-10 text-white font-bold tracking-wide">رزرو وقت مشاوره</span>
            <div className="absolute inset-0 bg-blue-800 opacity-90 group-hover:opacity-100 transition-all duration-300"></div>
            <div className="absolute inset-0 bg-blue-700 opacity-0 group-hover:opacity-50 transition-all duration-300"></div>
            <div className="absolute inset-0 border-2 border-blue-600/50 rounded-2xl group-hover:border-blue-400/80 transition-all duration-300"></div>
          </a>
          <a href="#services" className="luxury-button glass-button font-semibold py-4 px-8 sm:py-3 sm:px-8 rounded-2xl hover:scale-105 shadow-2xl w-full sm:w-auto text-center text-sm sm:text-base relative overflow-hidden group">
            <span className="relative z-10 text-white font-bold tracking-wide">آشنایی با خدمات</span>
            <div className="absolute inset-0 bg-blue-600/90 backdrop-blur-md group-hover:backdrop-blur-lg transition-all duration-300"></div>
            <div className="absolute inset-0 border-2 border-blue-500/60 rounded-2xl group-hover:border-blue-300/80 transition-all duration-300"></div>
            <div className="absolute inset-0 bg-blue-500/50 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
          </a>
          <a href="#contact" className="luxury-button secondary-button font-semibold py-4 px-8 sm:py-3 sm:px-8 rounded-2xl hover:scale-105 shadow-2xl w-full sm:w-auto text-center text-sm sm:text-base relative overflow-hidden group">
            <span className="relative z-10 text-white font-bold tracking-wide">ارتباط با ما</span>
            <div className="absolute inset-0 bg-blue-900 opacity-90 group-hover:opacity-100 transition-all duration-300"></div>
            <div className="absolute inset-0 bg-blue-800 opacity-0 group-hover:opacity-40 transition-all duration-300"></div>
            <div className="absolute inset-0 border-2 border-blue-700/50 rounded-2xl group-hover:border-blue-500/80 transition-all duration-300"></div>
          </a>
        </div>
      </div>
      
      <style>{`
        :root {
          --hero-scale-active: 1;
          --hero-scale-inactive: 1;
          --hero-rotate-active: 0deg;
          --hero-rotate-inactive: 0deg;
          --hero-saturate-active: 1;
          --hero-saturate-inactive: 1;
          --hero-translate-x: 0%;
        }
        @media (min-width: 1024px) {
          :root {
            --hero-scale-active: 1;
            --hero-scale-inactive: 1;
            --hero-rotate-active: 0deg;
            --hero-rotate-inactive: 0deg;
            --hero-saturate-active: 1;
            --hero-saturate-inactive: 1;
            --hero-translate-x: 0%;
          }
        }
        @keyframes fade-in-down {
          0% { opacity: 0; transform: translateY(-20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes glow {
          0%, 100% {
            text-shadow: 0 0 10px rgba(255, 255, 255, 0.5), 0 0 20px rgba(255, 255, 255, 0.3);
          }
          50% {
            text-shadow: 0 0 20px rgba(255, 255, 255, 0.9), 0 0 35px rgba(255, 255, 255, 0.5);
          }
        }
        @keyframes smooth-fade-in {
          0% {
            opacity: 0;
            filter: brightness(0.9) contrast(0.9);
          }
          100% {
            opacity: 1;
            filter: brightness(1) contrast(1);
          }
        }
        @keyframes smooth-fade-out {
          0% {
            opacity: 1;
            filter: brightness(1) contrast(1);
          }
          100% {
            opacity: 0;
            filter: brightness(0.9) contrast(0.9);
          }
        }
        .hero-bg {
          background-position: center 25%; /* Higher position for mobile */
          background-size: cover;
          background-repeat: no-repeat;
          will-change: opacity, filter;
          animation-timing-function: ease-in-out;
        }
        .hero-bg.active {
          animation: smooth-fade-in 0.8s ease-out forwards, mobile-image-float 2s ease-in-out infinite;
          z-index: 2;
        }
        .hero-bg.inactive {
          animation: smooth-fade-out 0.8s ease-out forwards;
        }

        /* Mobile Image Effects */
        @keyframes mobile-image-float {
          0%, 100% {
            transform: scale(1.25) translateY(0px) rotate(0deg);
            filter: brightness(0.75) contrast(1.2) saturate(1.15);
          }
          25% {
            transform: scale(1.27) translateY(-2px) rotate(0.5deg);
            filter: brightness(0.8) contrast(1.25) saturate(1.2);
          }
          50% {
            transform: scale(1.25) translateY(-1px) rotate(0deg);
            filter: brightness(0.85) contrast(1.3) saturate(1.25);
          }
          75% {
            transform: scale(1.23) translateY(-3px) rotate(-0.5deg);
            filter: brightness(0.78) contrast(1.23) saturate(1.18);
          }
        }
        /* Rainbow gradient text effect - Enhanced for mobile */
        .rainbow-text {
          color: white;
          background: linear-gradient(45deg, #ff0000, #ff8000, #ffff00, #80ff00, #00ff00, #00ff80, #00ffff, #0080ff, #0000ff, #8000ff, #ff00ff, #ff0080, #ff0000);
          background-size: 400% 400%;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          -webkit-animation: rainbow-mobile 3s ease-in-out infinite;
          animation: rainbow-mobile 3s ease-in-out infinite;
          filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.5));
          text-shadow:
            0 0 5px #ff6b6b,
            0 0 10px #4ecdc4,
            0 0 15px #45b7d1,
            0 0 20px #96ceb4,
            0 0 25px #feca57,
            0 0 30px #ff9ff3,
            0 0 35px #54a0ff,
            2px 2px 10px rgba(0, 0, 0, 0.8);
          /* Force hardware acceleration for mobile */
          transform: translateZ(0);
          -webkit-transform: translateZ(0);
          will-change: background-position;
        }

        /* Desktop Rainbow Animation */
        @keyframes rainbow {
          0%, 100% {
            background-position: 0% 50%;
            text-shadow:
              0 0 5px #ff6b6b,
              0 0 10px #4ecdc4,
              0 0 15px #45b7d1,
              0 0 20px #96ceb4,
              0 0 25px #feca57,
              0 0 30px #ff9ff3,
              0 0 35px #54a0ff,
              2px 2px 10px rgba(0, 0, 0, 0.8);
          }
          16.67% {
            background-position: 16.67% 50%;
            text-shadow:
              0 0 5px #4ecdc4,
              0 0 10px #45b7d1,
              0 0 15px #96ceb4,
              0 0 20px #feca57,
              0 0 25px #ff9ff3,
              0 0 30px #54a0ff,
              0 0 35px #ff6b6b,
              2px 2px 10px rgba(0, 0, 0, 0.8);
          }
          33.33% {
            background-position: 33.33% 50%;
            text-shadow:
              0 0 5px #45b7d1,
              0 0 10px #96ceb4,
              0 0 15px #feca57,
              0 0 20px #ff9ff3,
              0 0 25px #54a0ff,
              0 0 30px #ff6b6b,
              0 0 35px #4ecdc4,
              2px 2px 10px rgba(0, 0, 0, 0.8);
          }
          50% {
            background-position: 50% 50%;
            text-shadow:
              0 0 5px #96ceb4,
              0 0 10px #feca57,
              0 0 15px #ff9ff3,
              0 0 20px #54a0ff,
              0 0 25px #ff6b6b,
              0 0 30px #4ecdc4,
              0 0 35px #45b7d1,
              2px 2px 10px rgba(0, 0, 0, 0.8);
          }
          66.67% {
            background-position: 66.67% 50%;
            text-shadow:
              0 0 5px #feca57,
              0 0 10px #ff9ff3,
              0 0 15px #54a0ff,
              0 0 20px #ff6b6b,
              0 0 25px #4ecdc4,
              0 0 30px #45b7d1,
              0 0 35px #96ceb4,
              2px 2px 10px rgba(0, 0, 0, 0.8);
          }
          83.33% {
            background-position: 83.33% 50%;
            text-shadow:
              0 0 5px #ff9ff3,
              0 0 10px #54a0ff,
              0 0 15px #ff6b6b,
              0 0 20px #4ecdc4,
              0 0 25px #45b7d1,
              0 0 30px #96ceb4,
              0 0 35px #feca57,
              2px 2px 10px rgba(0, 0, 0, 0.8);
          }
        }

        /* Mobile Rainbow Animation - Optimized for mobile devices */
        @keyframes rainbow-mobile {
          0%, 100% {
            background-position: 0% 50%;
            text-shadow:
              0 0 8px #3b82f6,
              0 0 15px #3b82f6,
              0 0 25px #8b5cf6,
              0 0 35px #ec4899,
              1px 1px 8px rgba(0, 0, 0, 0.9);
          }
          16.67% {
            background-position: 16.67% 50%;
            text-shadow:
              0 0 8px #ef4444,
              0 0 15px #ef4444,
              0 0 25px #f59e0b,
              0 0 35px #10b981,
              1px 1px 8px rgba(0, 0, 0, 0.9);
          }
          33.33% {
            background-position: 33.33% 50%;
            text-shadow:
              0 0 8px #8b5cf6,
              0 0 15px #8b5cf6,
              0 0 25px #06b6d4,
              0 0 35px #84cc16,
              1px 1px 8px rgba(0, 0, 0, 0.9);
          }
          50% {
            background-position: 50% 50%;
            text-shadow:
              0 0 8px #ec4899,
              0 0 15px #ec4899,
              0 0 25px #3b82f6,
              0 0 35px #f59e0b,
              1px 1px 8px rgba(0, 0, 0, 0.9);
          }
          66.67% {
            background-position: 66.67% 50%;
            text-shadow:
              0 0 8px #10b981,
              0 0 15px #10b981,
              0 0 25px #ef4444,
              0 0 35px #8b5cf6,
              1px 1px 8px rgba(0, 0, 0, 0.9);
          }
          83.33% {
            background-position: 83.33% 50%;
            text-shadow:
              0 0 8px #f59e0b,
              0 0 15px #f59e0b,
              0 0 25px #ec4899,
              0 0 35px #3b82f6,
              1px 1px 8px rgba(0, 0, 0, 0.9);
          }
        }

        /* Colorful outline effect */
        .colorful-outline {
          color: white;
          -webkit-text-stroke: 2px transparent;
          text-stroke: 2px transparent;
          position: relative;
          z-index: 1;
        }

        .colorful-outline::before {
          content: attr(data-text);
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          -webkit-text-stroke: 2px transparent;
          text-stroke: 2px transparent;
          background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #feca57, #ff9ff3, #54a0ff, #5f27cd, #00d2d3, #ff9f43);
          background-size: 600% 600%;
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: colorful-outline-shift 4s ease-in-out infinite;
          z-index: -1;
          font-family: inherit;
          font-size: inherit;
          line-height: inherit;
        }

        @keyframes colorful-outline-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @media (min-width: 640px) { 
          .hero-title { font-size: 5rem; }
          .hero-bg {
            background-position: center center;
          }
        }
        @media (min-width: 768px) { 
          .hero-title { font-size: 7rem; }
        }
        @media (min-width: 1024px) {
          .hero-title { font-size: 9rem; }

          /* Equal sized buttons on desktop */
          .flex.flex-col.justify-center.gap-4 a {
            padding: 16px 32px !important;
            font-size: 1.1rem !important;
            border-radius: 16px !important;
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3) !important;
            min-width: 200px !important;
            text-align: center !important;
          }
          .flex.flex-col.justify-center.gap-4 a:hover {
            transform: translateY(-3px) scale(1.05) !important;
            box-shadow: 0 12px 25px rgba(0, 0, 0, 0.4) !important;
          }
        }
        
        /* Mobile-First Optimization - Perfect image positioning and effects */
        @media (max-width: 640px) {
          #home {
            min-height: 100vh !important;
            padding-top: 10vh !important; /* Better spacing */
            justify-content: flex-start !important; /* Start from top */
            display: flex !important;
            flex-direction: column !important;
          }
          .hero-bg {
            background-position: center 20% !important; /* Show more of the image */
            background-size: cover !important;
            transform: scale(1.25) !important; /* Much larger scale for mobile */
            filter: brightness(0.75) contrast(1.2) saturate(1.15) !important; /* Enhanced visual appeal */
          }
          .mobile-top-content {
            margin-top: 15vh !important; /* Content positioned perfectly */
            padding-top: 2vh !important;
            flex: 1 !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: flex-start !important; /* Content at top */
          }
          .hero-title {
            font-size: 12rem !important; /* Much larger for mobile visibility */
            margin-bottom: 1.5rem !important;
            animation-duration: 3s !important;
            -webkit-text-stroke: 1px transparent !important;
            line-height: 1.1 !important;
          }
          .colorful-outline::before {
            -webkit-text-stroke: 1px transparent !important;
            animation-duration: 3s !important;
          }
          .hero-subtitle {
            font-size: 1.3rem !important; /* Much larger for mobile readability */
            text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.6);
            margin-bottom: 2.5rem !important;
            font-weight: 500;
            line-height: 1.6 !important;
          }
          /* Perfect Button layout for mobile */
          .flex.flex-col.justify-center.gap-4 {
            width: 100% !important;
            max-width: 280px !important; /* Larger mobile width */
            margin: 0 auto !important;
            gap: 1rem !important; /* More space between buttons */
          }
          .flex.flex-col.justify-center.gap-4 a {
            width: 100% !important;
            padding: 16px 20px !important; /* Larger touch targets */
            font-size: 1.1rem !important; /* Larger readable size */
            font-weight: 600 !important;
            border-radius: 12px !important;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3) !important;
            transform: translateY(0) !important;
            transition: all 0.3s ease !important;
            min-height: 52px !important; /* Larger mobile touch target */
          }
          .flex.flex-col.justify-center.gap-4 a:hover,
          .flex.flex-col.justify-center.gap-4 a:active {
            transform: translateY(-1px) !important;
            box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4) !important;
          }
          .flex.flex-col.justify-center.gap-4 a:first-child,
          .flex.flex-col.justify-center.gap-4 a:nth-child(3) {
            background: linear-gradient(135deg, #2563eb, #1d4ed8) !important;
            border: 2px solid rgba(255, 255, 255, 0.2) !important;
          }
          .flex.flex-col.justify-center.gap-4 a:nth-child(2) {
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.25), rgba(255, 255, 255, 0.15)) !important;
            backdrop-filter: blur(10px) !important;
            border: 2px solid rgba(255, 255, 255, 0.3) !important;
          }
        }

        @media (min-width: 641px) and (max-width: 1024px) {
          .hero-title { font-size: 6rem; }

          /* Equal sized buttons for tablets and medium screens */
          .flex.flex-col.justify-center.gap-4 a {
            padding: 14px 28px !important;
            font-size: 1rem !important;
            border-radius: 14px !important;
            box-shadow: 0 6px 18px rgba(0, 0, 0, 0.3) !important;
            min-width: 180px !important;
            text-align: center !important;
          }
          .flex.flex-col.justify-center.gap-4 a:hover {
            transform: translateY(-2px) scale(1.03) !important;
            box-shadow: 0 10px 22px rgba(0, 0, 0, 0.4) !important;
          }
        }

        @media (min-width: 1025px) {
          .hero-title { font-size: 15rem !important; /* Very large */
            animation-duration: 4s;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .hero-bg, .hero-bg.active { animation: none !important; transition: none !important; }
        }
        @keyframes gradient-shift {
          0%, 100% { 
            background-position: 0% 50%; 
          }
          50% { 
            background-position: 100% 50%; 
          }
        }
        @keyframes colorful-glow {
          0% {
            text-shadow:
              0 0 10px #3b82f6,
              0 0 20px #3b82f6,
              0 0 30px #8b5cf6,
              0 0 40px #ec4899,
              2px 2px 8px rgba(0, 0, 0, 0.8);
          }
          100% {
            text-shadow:
              0 0 15px #ec4899,
              0 0 25px #8b5cf6,
              0 0 35px #3b82f6,
              0 0 45px #3b82f6,
              3px 3px 10px rgba(0, 0, 0, 0.8);
          }
        }

        @keyframes white-glow {
          0% {
            text-shadow:
              0 0 10px rgba(255, 255, 255, 0.3),
              0 0 20px rgba(255, 255, 255, 0.2),
              0 0 30px rgba(255, 255, 255, 0.1);
          }
          100% {
            text-shadow:
              0 0 5px rgba(255, 255, 255, 0.5),
              0 0 15px rgba(255, 255, 255, 0.4),
              0 0 25px rgba(255, 255, 255, 0.3),
              0 0 35px rgba(255, 255, 255, 0.1);
          }
        }

        /* New Luxury Animations */
        @keyframes golden-glow {
          0% {
            text-shadow:
              0 0 20px rgba(255, 215, 0, 0.4),
              0 0 40px rgba(255, 165, 0, 0.3),
              0 0 60px rgba(255, 215, 0, 0.2);
          }
          50% {
            text-shadow:
              0 0 30px rgba(255, 215, 0, 0.8),
              0 0 60px rgba(255, 165, 0, 0.5),
              0 0 90px rgba(255, 215, 0, 0.3),
              0 0 120px rgba(255, 255, 255, 0.2);
          }
          100% {
            text-shadow:
              0 0 20px rgba(255, 215, 0, 0.4),
              0 0 40px rgba(255, 165, 0, 0.3),
              0 0 60px rgba(255, 215, 0, 0.2);
          }
        }

        @keyframes titleFloat {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          25% {
            transform: translateY(-3px) rotate(0.5deg);
          }
          75% {
            transform: translateY(3px) rotate(-0.5deg);
          }
        }

        @keyframes subtitleShimmer {
          0% {
            text-shadow:
              0 0 20px rgba(255, 255, 255, 0.6),
              0 0 40px rgba(255, 255, 255, 0.4),
              0 0 60px rgba(255, 255, 255, 0.2);
            filter: brightness(1) contrast(1) drop-shadow(0 2px 8px rgba(0, 0, 0, 0.3));
          }
          50% {
            text-shadow:
              0 0 30px rgba(255, 255, 255, 0.9),
              0 0 60px rgba(255, 255, 255, 0.6),
              0 0 90px rgba(255, 255, 255, 0.4),
              0 0 120px rgba(255, 255, 255, 0.2);
            filter: brightness(1.05) contrast(1.02) drop-shadow(0 4px 12px rgba(0, 0, 0, 0.2));
          }
          100% {
            text-shadow:
              0 0 20px rgba(255, 255, 255, 0.6),
              0 0 40px rgba(255, 255, 255, 0.4),
              0 0 60px rgba(255, 255, 255, 0.2);
            filter: brightness(1) contrast(1) drop-shadow(0 2px 8px rgba(0, 0, 0, 0.3));
          }
        }

        @keyframes subtitleFloat {
          0%, 100% {
            transform: translateY(0px) scale(1);
          }
          25% {
            transform: translateY(-2px) scale(1.02);
          }
          75% {
            transform: translateY(2px) scale(0.98);
          }
        }

        /* Luxury Button Styles */
        .luxury-button {
          position: relative;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          transform: translateY(0);
          box-shadow:
            0 8px 25px rgba(0, 0, 0, 0.3),
            0 0 0 1px rgba(255, 255, 255, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
        }

        .luxury-button:hover {
          transform: translateY(-2px) scale(1.02);
          box-shadow:
            0 12px 35px rgba(0, 0, 0, 0.4),
            0 0 0 1px rgba(255, 255, 255, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.3);
        }

        .luxury-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
          transition: left 0.6s ease;
        }

        .luxury-button:hover::before {
          left: 100%;
        }

        .primary-button {
          animation: primaryPulse 2s ease-in-out infinite;
        }

        .glass-button {
          animation: glassShimmer 3s ease-in-out infinite;
        }

        .secondary-button {
          animation: secondaryGlow 2.5s ease-in-out infinite;
        }

        @keyframes primaryPulse {
          0%, 100% {
            box-shadow:
              0 8px 25px rgba(30, 64, 175, 0.4),
              0 0 0 1px rgba(255, 255, 255, 0.1),
              inset 0 1px 0 rgba(255, 255, 255, 0.2);
          }
          50% {
            box-shadow:
              0 12px 35px rgba(37, 99, 235, 0.5),
              0 0 0 1px rgba(59, 130, 246, 0.4),
              inset 0 1px 0 rgba(255, 255, 255, 0.3);
          }
        }

        @keyframes glassShimmer {
          0%, 100% {
            backdrop-filter: blur(10px);
            border-color: rgba(30, 64, 175, 0.6);
          }
          50% {
            backdrop-filter: blur(15px);
            border-color: rgba(37, 99, 235, 0.8);
          }
        }

        @keyframes secondaryGlow {
          0%, 100% {
            box-shadow:
              0 8px 25px rgba(30, 58, 138, 0.4),
              0 0 0 1px rgba(255, 255, 255, 0.1),
              inset 0 1px 0 rgba(255, 255, 255, 0.2);
          }
          50% {
            box-shadow:
              0 12px 35px rgba(23, 37, 84, 0.5),
              0 0 0 1px rgba(55, 65, 81, 0.4),
              inset 0 1px 0 rgba(255, 255, 255, 0.3);
          }
        }


      `}</style>
    </section>
  );
};

export default Hero;
