import React, { useState, useEffect } from 'react';

const images = [
  '/1.png',
  '/2.png',
  '/3.jpg',
  '/4.webp',
  '/5.jpg',
];

const Hero: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 8000);

    return () => clearInterval(intervalId);
  }, []);

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
        <h1 className="font-nastaliq hero-title leading-none mb-4 animate-fade-in-down animate-pulse" style={{ color: 'white', animation: 'white-glow 2s ease-in-out infinite alternate' }}>
          غزاله تقوی
        </h1>
        <p className="hero-subtitle text-base sm:text-lg md:text-xl font-light mb-6 animate-fade-in-up">
          وکیل پایه یک دادگستری و میانجیگر رسمی قوه قضائیه
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in-up animation-delay-300">
          <a href="#booking" className="bg-blue-600 text-white font-semibold py-3 px-6 sm:py-2 sm:px-6 rounded-lg hover:bg-blue-700 transition-transform duration-300 hover:scale-105 shadow-lg w-full sm:w-auto text-center text-sm sm:text-base">
            رزرو وقت مشاوره
          </a>
          <a href="#services" className="bg-white/20 text-white font-semibold py-3 px-6 sm:py-2 sm:px-6 rounded-lg hover:bg-white/30 backdrop-blur-sm transition-transform duration-300 hover:scale-105 shadow-lg w-full sm:w-auto text-center text-sm sm:text-base">
            آشنایی با خدمات
          </a>
          <a href="#contact" className="bg-blue-600 text-white font-semibold py-3 px-6 sm:py-2 sm:px-6 rounded-lg hover:bg-blue-700 transition-transform duration-300 hover:scale-105 shadow-lg w-full sm:w-auto text-center text-sm sm:text-base">
            ارتباط با ما
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
          animation: smooth-fade-in 1.5s ease-out forwards;
          z-index: 2;
        }
        .hero-bg.inactive {
          animation: smooth-fade-out 1.5s ease-out forwards;
        }
        /* Rainbow gradient text effect */
        .rainbow-text {
          color: white;
          background: linear-gradient(45deg, #ff0000, #ff8000, #ffff00, #80ff00, #00ff00, #00ff80, #00ffff, #0080ff, #0000ff, #8000ff, #ff00ff, #ff0080, #ff0000);
          background-size: 400% 400%;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: rainbow 3s ease-in-out infinite;
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
        }

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
          
          /* Larger contact button on desktop */
          .flex.flex-col.justify-center.gap-4 a[href="#contact"] {
            padding: 16px 32px !important;
            font-size: 1.25rem !important;
            border-radius: 16px !important;
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3) !important;
          }
          .flex.flex-col.justify-center.gap-4 a[href="#contact"]:hover {
            transform: translateY(-3px) scale(1.05) !important;
            box-shadow: 0 12px 25px rgba(0, 0, 0, 0.4) !important;
          }
        }
        
        /* Mobile adjustments - Content positioned much higher */
        @media (max-width: 640px) {
          #home {
            min-height: 100vh !important;
            padding-top: 5vh !important;
            justify-content: flex-start !important;
          }
          .hero-bg {
            background-position: center 30% !important; /* Higher image position */
          }
          .mobile-top-content {
            margin-top: 8vh !important;
            padding-top: 2vh !important;
          }
          .hero-title { 
            font-size: 7rem !important; /* Much larger for mobile */
            margin-bottom: 1.5rem !important;
            animation-duration: 3s !important;
            -webkit-text-stroke: 1px transparent !important;
          }
          .colorful-outline::before {
            -webkit-text-stroke: 1px transparent !important;
            animation-duration: 3s !important;
          }
          .hero-subtitle {
            font-size: 1.2rem !important;
            text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.6);
            margin-bottom: 2.5rem !important;
            font-weight: 500;
          }
          /* Button adjustments for mobile */
          .flex.flex-col.justify-center.gap-4 {
            width: 100% !important;
            max-width: 320px !important;
            margin: 0 auto !important;
          }
          .flex.flex-col.justify-center.gap-4 a {
            width: 100% !important;
            padding: 12px 20px !important;
            font-size: 1.1rem !important;
            font-weight: 600 !important;
            border-radius: 12px !important;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3) !important;
            transform: translateY(0) !important;
            transition: all 0.3s ease !important;
          }
          .flex.flex-col.justify-center.gap-4 a:hover {
            transform: translateY(-2px) !important;
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


      `}</style>
    </section>
  );
};

export default Hero;
