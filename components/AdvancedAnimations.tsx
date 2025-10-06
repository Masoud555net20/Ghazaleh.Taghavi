import React, { useEffect, useRef, useState } from 'react';

interface FadeInOnScrollProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'fade';
  className?: string;
  threshold?: number;
}

export const FadeInOnScroll: React.FC<FadeInOnScrollProps> = ({
  children,
  delay = 0,
  duration = 600,
  direction = 'up',
  className = '',
  threshold = 0.1
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true);
          }, delay);
        }
      },
      {
        threshold,
        rootMargin: '50px'
      }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [delay, threshold]);

  const getAnimationStyles = () => {
    const baseStyle: React.CSSProperties = {
      transition: `all ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`,
      transitionDelay: `${delay}ms`,
    };

    if (!isVisible) {
      switch (direction) {
        case 'up':
          return {
            ...baseStyle,
            opacity: 0,
            transform: 'translateY(30px)',
          };
        case 'down':
          return {
            ...baseStyle,
            opacity: 0,
            transform: 'translateY(-30px)',
          };
        case 'left':
          return {
            ...baseStyle,
            opacity: 0,
            transform: 'translateX(30px)',
          };
        case 'right':
          return {
            ...baseStyle,
            opacity: 0,
            transform: 'translateX(-30px)',
          };
        case 'fade':
        default:
          return {
            ...baseStyle,
            opacity: 0,
          };
      }
    }

    return {
      ...baseStyle,
      opacity: 1,
      transform: 'translate(0, 0)',
    };
  };

  return (
    <div
      ref={elementRef}
      className={className}
      style={getAnimationStyles()}
    >
      {children}
    </div>
  );
};

interface StaggeredFadeInProps {
  children: React.ReactNode[];
  delay?: number;
  staggerDelay?: number;
  className?: string;
}

export const StaggeredFadeIn: React.FC<StaggeredFadeInProps> = ({
  children,
  delay = 0,
  staggerDelay = 50,
  className = ''
}) => {
  return (
    <div className={className}>
      {children.map((child, index) => (
        <FadeInOnScroll
          key={index}
          delay={delay + Math.min(index * staggerDelay, index * 30 + 200)}
          direction="up"
        >
          {child}
        </FadeInOnScroll>
      ))}
    </div>
  );
};

interface ParallaxElementProps {
  children: React.ReactNode;
  speed?: number;
  className?: string;
}

export const ParallaxElement: React.FC<ParallaxElementProps> = ({
  children,
  speed = 0.5,
  className = ''
}) => {
  const [offsetY, setOffsetY] = useState(0);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (elementRef.current) {
        const rect = elementRef.current.getBoundingClientRect();
        const scrolled = window.pageYOffset;
        const rate = scrolled * -speed;

        if (rect.top < window.innerHeight && rect.bottom > 0) {
          setOffsetY(rate);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);

  return (
    <div
      ref={elementRef}
      className={className}
      style={{
        transform: `translateY(${offsetY}px)`,
      }}
    >
      {children}
    </div>
  );
};

interface TypewriterTextProps {
  text: string;
  delay?: number;
  speed?: number;
  className?: string;
  onComplete?: () => void;
}

export const TypewriterText: React.FC<TypewriterTextProps> = ({
  text,
  delay = 0,
  speed = 50,
  className = '',
  onComplete
}) => {
  const [displayText, setDisplayText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      let currentIndex = 0;

      const typeInterval = setInterval(() => {
        if (currentIndex <= text.length) {
          setDisplayText(text.slice(0, currentIndex));
          currentIndex++;
        } else {
          clearInterval(typeInterval);
          setIsComplete(true);
          onComplete?.();
        }
      }, speed);

      return () => clearInterval(typeInterval);
    }, delay);

    return () => clearTimeout(timer);
  }, [text, delay, speed, onComplete]);

  return (
    <span className={`${className} ${isComplete ? '' : 'after:content-["|"] after:animate-pulse after:text-blue-400'}`}>
      {displayText}
    </span>
  );
};

interface MorphingShapeProps {
  className?: string;
  color?: string;
  size?: number;
}

export const MorphingShape: React.FC<MorphingShapeProps> = ({
  className = '',
  color = '#3b82f6',
  size = 100
}) => {
  return (
    <div
      className={`absolute pointer-events-none ${className}`}
      style={{
        width: size,
        height: size,
        background: `linear-gradient(45deg, ${color}, transparent)`,
        borderRadius: '50% 30% 70% 40%',
        animation: 'morph 6s ease-in-out infinite',
        filter: 'blur(1px)',
      }}
    >
      <style jsx>{`
        @keyframes morph {
          0%, 100% {
            border-radius: 50% 30% 70% 40%;
            transform: rotate(0deg) scale(1);
          }
          25% {
            border-radius: 30% 60% 40% 70%;
            transform: rotate(90deg) scale(1.1);
          }
          50% {
            border-radius: 60% 40% 30% 80%;
            transform: rotate(180deg) scale(0.9);
          }
          75% {
            border-radius: 40% 80% 60% 30%;
            transform: rotate(270deg) scale(1.05);
          }
        }
      `}</style>
    </div>
  );
};

interface ParticleFieldProps {
  count?: number;
  className?: string;
}

export const ParticleField: React.FC<ParticleFieldProps> = ({
  count = 12,
  className = ''
}) => {
  const particles = Array.from({ length: count }, (_, i) => i);

  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      {particles.map((particle) => (
        <div
          key={particle}
          className="absolute w-1 h-1 bg-white/20 rounded-full animate-float-particle"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 4}s`,
            animationDuration: `${4 + Math.random() * 3}s`,
          }}
        />
      ))}

      <style jsx>{`
        @keyframes float-particle {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
            opacity: 0.2;
          }
          50% {
            transform: translateY(-15px) translateX(5px);
            opacity: 0.4;
          }
        }

        .animate-float-particle {
          animation: float-particle 7s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default {
  FadeInOnScroll,
  StaggeredFadeIn,
  ParallaxElement,
  TypewriterText,
  MorphingShape,
  ParticleField
};
