import React, { useEffect, useRef, useState } from 'react';

interface ParallaxSectionProps {
  children: React.ReactNode;
  speed?: number;
  className?: string;
  backgroundImage?: string;
  overlay?: boolean;
  overlayColor?: string;
  overlayOpacity?: number;
}

const ParallaxSection: React.FC<ParallaxSectionProps> = ({
  children,
  speed = 0.5,
  className = '',
  backgroundImage,
  overlay = false,
  overlayColor = 'rgba(0, 0, 0, 0.4)',
  overlayOpacity = 0.4
}) => {
  const [offsetY, setOffsetY] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        const scrolled = window.pageYOffset;
        const rate = scrolled * -speed;

        // Only apply parallax when section is in viewport
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          setOffsetY(rate);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial call

    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);

  const sectionStyle: React.CSSProperties = {
    transform: `translateY(${offsetY}px)`,
  };

  const backgroundStyle: React.CSSProperties = backgroundImage ? {
    backgroundImage: `url('${backgroundImage}')`,
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundAttachment: 'fixed',
  } : {};

  return (
    <section
      ref={sectionRef}
      className={`relative overflow-hidden ${className}`}
      style={backgroundStyle}
    >
      {overlay && (
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundColor: overlayColor,
            opacity: overlayOpacity
          }}
        />
      )}

      <div
        className="relative z-10"
        style={sectionStyle}
      >
        {children}
      </div>

      {/* Floating Elements for 3D Effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-float-1"></div>
        <div className="absolute top-32 right-20 w-16 h-16 bg-blue-400/20 rounded-full blur-lg animate-float-2"></div>
        <div className="absolute bottom-20 left-32 w-12 h-12 bg-purple-400/15 rounded-full blur-lg animate-float-3"></div>
        <div className="absolute bottom-32 right-10 w-24 h-24 bg-indigo-400/10 rounded-full blur-xl animate-float-4"></div>
      </div>

      <style jsx>{`
        @keyframes float-1 {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.3; }
          50% { transform: translateY(-20px) rotate(180deg); opacity: 0.6; }
        }
        @keyframes float-2 {
          0%, 100% { transform: translateY(0px) scale(1); opacity: 0.2; }
          50% { transform: translateY(-15px) scale(1.1); opacity: 0.4; }
        }
        @keyframes float-3 {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.1; }
          50% { transform: translateY(-25px) rotate(-180deg); opacity: 0.3; }
        }
        @keyframes float-4 {
          0%, 100% { transform: translateY(0px) scale(1); opacity: 0.15; }
          50% { transform: translateY(-18px) scale(0.9); opacity: 0.25; }
        }

        .animate-float-1 {
          animation: float-1 6s ease-in-out infinite;
        }
        .animate-float-2 {
          animation: float-2 8s ease-in-out infinite;
          animation-delay: 1s;
        }
        .animate-float-3 {
          animation: float-3 7s ease-in-out infinite;
          animation-delay: 2s;
        }
        .animate-float-4 {
          animation: float-4 9s ease-in-out infinite;
          animation-delay: 3s;
        }
      `}</style>
    </section>
  );
};

export default ParallaxSection;
