import React from 'react';
import Image from 'next/image';

interface BrandIconProps {
  brand: string;
  className?: string;
}

const brandConfig: Record<string, { slug: string; color: string }> = {
  'Mercedes-Benz': { slug: 'mercedes', color: '333333' },
  'BMW': { slug: 'bmw', color: '0066B1' },
  'Audi': { slug: 'audi', color: '000000' },
  'Land Rover': { slug: 'landrover', color: '008D41' },
  'Porsche': { slug: 'porsche', color: 'D5001C' }, // Red for impact
  'Ferrari': { slug: 'ferrari', color: 'EF1A2D' },
  'Lamborghini': { slug: 'lamborghini', color: 'DDB321' },
  'Rolls Royce': { slug: 'rollsroyce', color: '666666' },
  'Tesla': { slug: 'tesla', color: 'E82127' },
  'Toyota': { slug: 'toyota', color: 'EB0A1E' },
  'Kia': { slug: 'kia', color: '05141F' },
  'Hyundai': { slug: 'hyundai', color: '002C5F' },
};

export function BrandIcon({ brand, className = "w-12 h-12" }: BrandIconProps) {
  // Custom SVG implementation for Mercedes-Benz and Land Rover due to CDN issues
  if (brand === 'Mercedes-Benz') {
    return (
      <div className={`relative ${className} flex items-center justify-center text-[#333333]`}>
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v4l3.5-2 1 1.73L14 12l3.5 1.27-1 1.73L13 13v4h-2v-4l-3.5 2-1-1.73L10 12l-3.5-1.27 1-1.73L11 11V7z" />
          <path d="M12 4.5l-3.5 6 3.5 2 3.5-2-3.5-6zm0 10.5l-4-2.3 4 7.3 4-7.3-4 2.3z" fill="none" /> {/* Simplified 3-pointed star representation */}
          <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1.732-6.5l-4.062-2.344 5.794-1.55 1.55-5.794 1.55 5.794 5.794 1.55-4.062 2.344L12 22l-1.732-6.5z"/>
        </svg>
      </div>
    );
  }

  if (brand === 'Land Rover') {
    return (
      <div className={`relative ${className} flex items-center justify-center text-[#008D41]`}>
         <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
            <ellipse cx="12" cy="12" rx="11" ry="6" />
            <path d="M4 12h2v-2h2v2h2v-3h2v3h2v-2h2v2" stroke="white" strokeWidth="2" strokeLinecap="round" />
            <text x="50%" y="54%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="5" fontWeight="bold" fontFamily="Arial">LAND ROVER</text>
         </svg>
      </div>
    );
  }

  const config = brandConfig[brand];
  
  if (!config) return null;

  // Use simple-icons CDN with color
  const src = `https://cdn.simpleicons.org/${config.slug}/${config.color}`;

  return (
    <div className={`relative ${className} flex items-center justify-center`}>
      <img 
        src={src} 
        alt={`${brand} logo`}
        className="w-full h-full object-contain"
      />
    </div>
  );
}
