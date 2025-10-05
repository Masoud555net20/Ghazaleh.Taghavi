import React, { useEffect } from 'react';

interface FontOptimizerProps {
  fonts?: string[];
  onFontsLoaded?: () => void;
}

const FontOptimizer: React.FC<FontOptimizerProps> = ({
  fonts = ['Vazirmatn', 'IranNastaliq'],
  onFontsLoaded
}) => {
  useEffect(() => {
    // Check if fonts are already loaded
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        console.log('Fonts loaded successfully');
        onFontsLoaded?.();
      });
    }

    // Fallback for browsers without font API
    const fontTimer = setTimeout(() => {
      console.log('Font loading timeout - assuming fonts are loaded');
      onFontsLoaded?.();
    }, 3000);

    return () => clearTimeout(fontTimer);
  }, [onFontsLoaded]);

  return null; // This component doesn't render anything
};

export default FontOptimizer;
