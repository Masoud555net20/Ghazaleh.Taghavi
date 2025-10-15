import React, { useEffect, useRef } from 'react';

interface FontOptimizerProps {
  fonts?: string[];
  onFontsLoaded?: () => void;
}

const FontOptimizer: React.FC<FontOptimizerProps> = ({
  fonts = ['Vazirmatn', 'IranNastaliq'],
  onFontsLoaded
}) => {
  const hasCompleted = useRef(false);

  useEffect(() => {
    // Prevent multiple executions
    if (hasCompleted.current) {
      return;
    }

    const handleFontsLoaded = () => {
      if (!hasCompleted.current) {
        hasCompleted.current = true;
        // Use setTimeout to avoid blocking the main thread
        setTimeout(() => {
          onFontsLoaded?.();
        }, 0);
      }
    };

    // Check if fonts are already loaded
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(handleFontsLoaded).catch(() => {
        // If font API fails, use timeout fallback
        setTimeout(handleFontsLoaded, 50);
      });
    } else {
      // Fallback for browsers without font API - shorter timeout for better UX
      setTimeout(handleFontsLoaded, 500);
    }

    // Additional fallback timeout to prevent indefinite waiting
    const fontTimer = setTimeout(handleFontsLoaded, 1500);

    return () => clearTimeout(fontTimer);
  }, [onFontsLoaded]);

  return null; // This component doesn't render anything
};

export default FontOptimizer;
