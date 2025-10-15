import React, { useEffect, useRef } from 'react';

interface ImagePreloaderProps {
  images: string[];
  onComplete?: () => void;
}

const ImagePreloader: React.FC<ImagePreloaderProps> = ({ images, onComplete }) => {
  const preloadedCount = useRef(0);
  const hasCompleted = useRef(false);

  useEffect(() => {
    // Don't preload if no images or already completed
    if (images.length === 0 || hasCompleted.current) {
      if (onComplete) onComplete();
      return;
    }

    const handleImageLoad = () => {
      preloadedCount.current++;

      // Only call onComplete once when all images are loaded
      if (preloadedCount.current >= images.length && !hasCompleted.current) {
        hasCompleted.current = true;
        if (onComplete) {
          // Use setTimeout to avoid blocking the main thread
          setTimeout(onComplete, 0);
        }
      }
    };

    // Preload images with error handling
    images.forEach((src) => {
      // Skip if already preloaded
      if (hasCompleted.current) return;

      const img = new Image();

      img.onload = () => {
        handleImageLoad();
      };

      img.onerror = () => {
        // Count failed loads as well to prevent hanging
        handleImageLoad();
      };

      // Start loading
      img.src = src;
    });

    // Fallback timeout to prevent indefinite loading
    const timeout = setTimeout(() => {
      if (!hasCompleted.current) {
        hasCompleted.current = true;
        if (onComplete) onComplete();
      }
    }, 5000); // 5 second timeout

    return () => clearTimeout(timeout);
  }, [images, onComplete]);

  return null; // This component doesn't render anything
};

export default ImagePreloader;
