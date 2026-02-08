'use client';

import { useState, useEffect } from 'react';
import Image, { ImageProps } from 'next/image';

interface OptimizedImageProps extends ImageProps {
  fallbackSrc?: string;
}

const OptimizedImage = ({ 
  src, 
  alt, 
  fallbackSrc = 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&q=80', // Default car placeholder
  className,
  ...props 
}: OptimizedImageProps) => {
  // validatedSrc check
  const isValidSrc = (s: ImageProps['src'] | undefined): boolean => {
    if (!s) return false;
    if (typeof s === 'string') {
        return s.startsWith('/') || s.startsWith('http');
    }
    return true; // Assume StaticImport object is valid
  };

  const validSrc = isValidSrc(src) ? src! : fallbackSrc;

  const [imgSrc, setImgSrc] = useState(validSrc);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setImgSrc(isValidSrc(src) ? src! : fallbackSrc);
    setIsLoading(true);
  }, [src, fallbackSrc]);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Image
        {...props}
        src={imgSrc}
        alt={alt}
        className={`duration-700 ease-in-out ${props.fill ? 'object-cover' : ''} ${
          isLoading ? 'scale-110 blur-2xl grayscale' : 'scale-100 blur-0 grayscale-0'
        }`}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setImgSrc(fallbackSrc);
          setIsLoading(false);
        }}
      />
    </div>
  );
};

export default OptimizedImage;
