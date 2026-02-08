'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

const CATEGORIES = ['Luxury', 'Sports', 'SUV', 'Sedan', 'Economy', 'Van', 'Electric'];
const FUEL_TYPES = ['Petrol', 'Diesel', 'Electric', 'Hybrid'];
const TRANSMISSIONS = ['Automatic', 'Manual'];
const BRANDS = ['Porsche', 'Mercedes-Benz', 'BMW', 'Audi', 'Tesla', 'Ferrari', 'Lamborghini', 'Toyota', 'Nissan'];

export default function FilterSidebar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Local state for filters to avoid too many URL updates while typing
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    category: searchParams.get('category') || '',
    brand: searchParams.get('brand') || '',
    transmission: searchParams.get('transmission') || '',
    fuelType: searchParams.get('fuelType') || '',
    seats: searchParams.get('seats') || ''
  });

  // Debounce effect logic could be added here, but for simplicity we'll update on loose blur/change or apply button
  // For better UX with text inputs, we usually wait for blur or a debounce
  
  const updateURL = useCallback((newFilters: any) => {
    const params = new URLSearchParams(searchParams.toString());
    
    // Update params
    Object.keys(newFilters).forEach(key => {
      if (newFilters[key]) {
        params.set(key, newFilters[key]);
      } else {
        params.delete(key);
      }
    });
    
    // Always reset to page 1 on filter change
    params.set('page', '1');
    
    router.push(`/fleet?${params.toString()}`);
  }, [router, searchParams]);

  const handleApply = () => {
    updateURL(filters);
  };
  
  const handleClear = () => {
    setFilters({
      search: '',
      minPrice: '',
      maxPrice: '',
      category: '',
      brand: '',
      transmission: '',
      fuelType: '',
      seats: ''
    });
    router.push('/fleet');
  };

  const handleChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // Sync state with URL if URL changes externally (e.g. back button)
  useEffect(() => {
    setFilters({
      search: searchParams.get('search') || '',
      minPrice: searchParams.get('minPrice') || '',
      maxPrice: searchParams.get('maxPrice') || '',
      category: searchParams.get('category') || '',
      brand: searchParams.get('brand') || '',
      transmission: searchParams.get('transmission') || '',
      fuelType: searchParams.get('fuelType') || '',
      seats: searchParams.get('seats') || ''
    });
  }, [searchParams]);

  return (
    <div className="bg-[var(--surface-light)] border border-[var(--border)] rounded-xl p-6 h-fit sticky top-24">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-white">Filters</h2>
        <button 
          onClick={handleClear}
          className="text-xs text-[var(--text-secondary)] hover:text-white transition-colors"
        >
          Clear all
        </button>
      </div>

      <div className="space-y-6">
        {/* Search */}
        <div>
          <label className="text-xs text-[var(--text-secondary)] font-medium mb-2 block">Search</label>
          <Input 
            value={filters.search}
            onChange={(e) => handleChange('search', e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleApply()}
            placeholder="Brand or model..."
            className="bg-[var(--surface-lighter)]"
          />
        </div>

        {/* Price Range */}
        <div>
          <label className="text-xs text-[var(--text-secondary)] font-medium mb-2 block">Daily Price (AED)</label>
          <div className="flex gap-2">
            <Input 
              type="number"
              placeholder="Min"
              value={filters.minPrice}
              onChange={(e) => handleChange('minPrice', e.target.value)}
              className="bg-[var(--surface-lighter)]"
            />
            <Input 
              type="number"
              placeholder="Max"
              value={filters.maxPrice}
              onChange={(e) => handleChange('maxPrice', e.target.value)}
              className="bg-[var(--surface-lighter)]"
            />
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="text-xs text-[var(--text-secondary)] font-medium mb-2 block">Category</label>
          <div className="space-y-2">
            {CATEGORIES.map((cat) => (
              <label key={cat} className="flex items-center gap-2 cursor-pointer group">
                <input 
                  type="radio" 
                  name="category"
                  checked={filters.category === cat}
                  onChange={() => handleChange('category', cat)}
                  className="accent-[var(--primary)] h-4 w-4"
                />
                <span className={`text-sm ${filters.category === cat ? 'text-white' : 'text-[var(--text-muted)]'} group-hover:text-white transition-colors`}>
                  {cat}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Apply Button */}
        <Button onClick={handleApply} className="w-full">
          Apply Filters
        </Button>
      </div>
    </div>
  );
}
