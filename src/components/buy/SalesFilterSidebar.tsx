'use client';

import { useRouter } from '@/navigation';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

const CATEGORIES = ['Luxury', 'Sports', 'SUV', 'Sedan', 'Economy', 'Van', 'Electric'];
const FUEL_TYPES = ['Petrol', 'Diesel', 'Electric', 'Hybrid'];
const TRANSMISSIONS = ['Automatic', 'Manual'];

export default function SalesFilterSidebar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Local state for filters
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
    
    router.push(`/buy?${params.toString()}`);
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
    router.push('/buy');
  };

  const handleChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // Sync state with URL if URL changes externally
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
    <div className="bg-white border border-gray-100 rounded-3xl p-6 h-fit sticky top-24 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-heading font-black text-navy">Filters</h2>
        <button 
          onClick={handleClear}
          className="text-xs font-bold text-gray-400 hover:text-navy transition-colors uppercase tracking-wider"
        >
          Clear all
        </button>
      </div>

      <div className="space-y-8">
        {/* Search */}
        <div>
          <label className="text-xs text-navy font-bold uppercase tracking-wider mb-2 block">Search</label>
          <Input 
            value={filters.search}
            onChange={(e) => handleChange('search', e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleApply()}
            placeholder="Search make or model..."
            className="bg-gray-50 border-transparent focus:bg-white focus:border-gray-200 h-12 rounded-xl"
          />
        </div>

        {/* Price Range */}
        <div>
          <label className="text-xs text-navy font-bold uppercase tracking-wider mb-2 block">Price Range (€)</label>
          <div className="flex gap-2">
            <Input 
              type="number"
              placeholder="Min"
              value={filters.minPrice}
              onChange={(e) => handleChange('minPrice', e.target.value)}
              className="bg-gray-50 border-transparent focus:bg-white focus:border-gray-200 h-12 rounded-xl"
            />
            <Input 
              type="number"
              placeholder="Max"
              value={filters.maxPrice}
              onChange={(e) => handleChange('maxPrice', e.target.value)}
              className="bg-gray-50 border-transparent focus:bg-white focus:border-gray-200 h-12 rounded-xl"
            />
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="text-xs text-navy font-bold uppercase tracking-wider mb-3 block">Category</label>
          <div className="space-y-2">
            {CATEGORIES.map((cat) => (
              <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                <input 
                  type="radio" 
                  name="category"
                  checked={filters.category === cat}
                  onChange={() => handleChange('category', cat)}
                  className="accent-navy h-4 w-4"
                />
                <span className={`text-sm font-medium ${filters.category === cat ? 'text-navy font-bold' : 'text-gray-500'} group-hover:text-navy transition-colors`}>
                  {cat}
                </span>
              </label>
            ))}
          </div>
        </div>

         {/* Transmission */}
         <div>
          <label className="text-xs text-navy font-bold uppercase tracking-wider mb-3 block">Transmission</label>
          <div className="space-y-2">
            {TRANSMISSIONS.map((type) => (
              <label key={type} className="flex items-center gap-3 cursor-pointer group">
                <input 
                  type="radio" 
                  name="transmission"
                  checked={filters.transmission === type}
                  onChange={() => handleChange('transmission', type)}
                  className="accent-navy h-4 w-4"
                />
                <span className={`text-sm font-medium ${filters.transmission === type ? 'text-navy font-bold' : 'text-gray-500'} group-hover:text-navy transition-colors`}>
                  {type}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Apply Button */}
        <Button onClick={handleApply} className="w-full bg-navy text-gold font-bold hover:bg-navy/90 h-12 rounded-xl shadow-lg shadow-navy/20">
          Apply Filters
        </Button>
      </div>
    </div>
  );
}
