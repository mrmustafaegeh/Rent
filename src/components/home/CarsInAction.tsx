'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import OptimizedImage from '@/components/ui/OptimizedImage';
import { Button } from '@/components/ui/Button';

interface Vehicle {
  _id: string;
  brand: string;
  vehicleModel: string;
  year: number;
  pricing: { daily: number };
  images: { url: string }[];
  category: string;
}

interface CarsInActionProps {
  vehicles: Vehicle[];
}

export default function CarsInAction({ vehicles }: CarsInActionProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
        const { current } = scrollContainerRef;
        const scrollAmount = 350; // Card width + gap
        if (direction === 'left') {
            current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        } else {
            current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    }
  };

  // If no vehicles, don't render section
  if (!vehicles || vehicles.length === 0) return null;

  return (
    <section className="py-20 bg-[var(--background)] relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute top-[20%] right-[10%] w-[500px] h-[500px] bg-[var(--accent)]/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-[10%] left-[5%] w-[300px] h-[300px] bg-[var(--primary)]/5 rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex justify-between items-end mb-10">
          <div>
             <h2 className="text-3xl md:text-4xl font-bold mb-2">Cars in Action</h2>
             <p className="text-[var(--text-secondary)]">Experience the thrill before you drive.</p>
          </div>
          
          {/* Navigation Controls */}
          <div className="flex gap-2">
            <button 
                onClick={() => scroll('left')}
                className="w-10 h-10 rounded-full border border-[var(--border)] flex items-center justify-center hover:bg-[var(--surface-light)] hover:border-[var(--primary)] transition-all text-white"
                aria-label="Previous"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
            </button>
            <button 
                onClick={() => scroll('right')}
                className="w-10 h-10 rounded-full border border-[var(--border)] flex items-center justify-center hover:bg-[var(--surface-light)] hover:border-[var(--primary)] transition-all text-white"
                aria-label="Next"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </button>
          </div>
        </div>

        {/* Carousel */}
        <div 
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory hide-scrollbar"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
            {vehicles.map((vehicle, index) => (
                <div 
                    key={vehicle.id} 
                    className="flex-shrink-0 w-[300px] md:w-[350px] snap-center group relative rounded-2xl overflow-hidden aspect-[9/16] md:aspect-[3/4] border border-[var(--border)] bg-[var(--surface-light)]"
                >
                    {/* Background Image / Thumbnail */}
                    <OptimizedImage 
                        src={vehicle.images?.[0]?.url || ''} 
                        alt={vehicle.vehicleModel}
                        fill
                        className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, 350px"
                    />
                    
                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 group-hover:scale-110 transition-transform duration-300 cursor-pointer">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white fill-current" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                            </svg>
                        </div>
                    </div>

                    {/* Content Overlay */}
                    <div className="absolute bottom-0 left-0 w-full p-6">
                        {/* Brand Badge */}
                        <div className="inline-block bg-[var(--primary)] text-white text-xs font-bold px-2 py-1 rounded-md mb-2 uppercase tracking-wide">
                            {vehicle.brand}
                        </div>
                        
                        <h3 className="text-2xl font-bold text-white mb-1">{vehicle.vehicleModel}</h3>
                        <p className="text-sm text-gray-300 mb-4">{vehicle.category} • {vehicle.year}</p>
                        
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-gray-400 line-through decoration-red-500 decoration-2">
                                    AED {Math.round(vehicle.pricing.daily * 1.2)}
                                </p>
                                <p className="text-xl font-bold text-white">
                                    AED {vehicle.pricing.daily}<span className="text-sm font-normal text-gray-300">/day</span>
                                </p>
                            </div>
                            <Link href={`/vehicles/${vehicle.id}`}>
                                <Button size="sm" className="rounded-full px-6">Book Now</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </section>
  );
}
