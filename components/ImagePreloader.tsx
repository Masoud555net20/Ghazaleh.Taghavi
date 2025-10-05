import React, { useEffect } from 'react';

interface ImagePreloaderProps {
  images: string[];
  onComplete?: () => void;
}

const ImagePreloader: React.FC<ImagePreloaderProps> = ({ images, onComplete }) => {
  useEffect(() => {
    let loadedCount = 0;

    const handleImageLoad = () => {
      loadedCount++;
      if (loadedCount === images.length && onComplete) {
        onComplete();
      }
    };

    images.forEach((src) => {
      const img = new Image();
      img.onload = handleImageLoad;
      img.onerror = handleImageLoad; // Count errors as well to avoid hanging
      img.src = src;
    });
  }, [images, onComplete]);

  return null; // This component doesn't render anything
};

export default ImagePreloader;
