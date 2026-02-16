'use client';

import Image, { ImageProps } from 'next/image';
import { useState } from 'react';

interface OptimizedImageProps extends ImageProps {
  containerClassName?: string;
}

export function OptimizedImage({ 
  src, 
  alt, 
  priority = false,
  className,
  containerClassName,
  ...props 
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);

  const { fill } = props;
  
  return (
    <div className={`relative overflow-hidden ${fill ? 'h-full w-full' : ''} ${containerClassName || ''}`}>
      <Image
        src={src}
        alt={alt}
        priority={priority}
        quality={75}
        onLoad={() => setIsLoading(false)}
        className={`
          duration-700 ease-in-out
          ${isLoading ? 'scale-110 blur-2xl grayscale' : 'scale-100 blur-0 grayscale-0'}
          ${className || ''}
        `}
        {...props}
      />
    </div>
  );
}

export default OptimizedImage;
