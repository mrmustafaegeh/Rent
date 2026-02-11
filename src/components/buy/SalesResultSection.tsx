'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import SalesVehicleCard from './SalesVehicleCard';
import Link from 'next/link';

interface SalesResultSectionProps {
  vehicles: any[];
  pagination: {
    total: number;
    page: number;
    pages: number;
    limit: number;
  };
}

export default function SalesResultSection({ vehicles, pagination }: SalesResultSectionProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const currentSort = searchParams.get('sort') || 'newest';

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', e.target.value);
    params.set('page', '1'); // Reset to page 1
    router.push(`/buy?${params.toString()}`);
  };

  const buildPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    return `/buy?${params.toString()}`;
  };

  return (
    <div className="w-full">
      {/* Controls Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4 bg-white p-4 rounded-3xl border border-gray-100 shadow-sm">
        <span className="text-gray-500 font-bold text-sm">
          Showing <span className="text-navy font-black">{vehicles.length}</span> of <span className="text-navy font-black">{pagination.total}</span> vehicles
        </span>

        <div className="flex items-center gap-4">
          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider hidden sm:inline">Sort:</span>
            <div className="relative">
                <select
                  value={currentSort}
                  onChange={handleSortChange}
                  className="bg-gray-50 border border-transparent hover:border-gray-200 text-navy font-bold text-sm rounded-xl px-4 py-2 pr-8 appearance-none focus:outline-none focus:ring-2 focus:ring-navy/5 cursor-pointer transition-all"
                >
                  <option value="newest">Featured Listings</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="year_desc">Year: Newest First</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
            </div>
          </div>
        </div>
      </div>

      {vehicles.length === 0 ? (
        <div className="text-center py-32 bg-white rounded-3xl border border-dashed border-gray-200">
             <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
                 <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
             </div>
             <h3 className="text-2xl font-heading font-black text-navy mb-2">No cars listed yet</h3>
             <p className="text-gray-400 font-medium max-w-md mx-auto">
                 Be the first to list your car for sale on our premium marketplace.
             </p>
             <Link href="/list-your-car">
                <button className="mt-8 px-8 py-4 bg-navy text-gold font-bold rounded-xl hover:bg-navy/90 hover:scale-105 transition-all shadow-xl shadow-navy/20">
                    List Your Car
                </button>
             </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {vehicles.map((vehicle: any) => (
             <SalesVehicleCard 
                key={vehicle._id}
                vehicle={vehicle}
             />
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex justify-center mt-16 gap-2">
          <Link 
            href={buildPageUrl(Math.max(1, pagination.page - 1))}
            className={`px-4 py-3 rounded-xl border border-gray-100 bg-white font-bold text-gray-500 hover:text-navy hover:border-gray-200 transition-colors ${pagination.page <= 1 ? 'pointer-events-none opacity-50' : ''}`}
          >
            Previous
          </Link>
          
          {Array.from({ length: Math.min(5, pagination.pages) }).map((_, i) => {
            let p = i + 1;
            if (pagination.pages > 5 && pagination.page > 3) {
               p = pagination.page - 2 + i;
            }
            if (p > pagination.pages) return null;
            
            return (
              <Link 
                key={p}
                href={buildPageUrl(p)}
                className={`w-12 h-12 flex items-center justify-center rounded-xl font-bold transition-all ${
                  (pagination.page === p)
                    ? 'bg-navy text-gold shadow-lg shadow-navy/20'
                    : 'bg-white text-gray-500 border border-gray-100 hover:border-gray-200 hover:text-navy'
                }`}
              >
                {p}
              </Link>
            );
          })}

          <Link 
            href={buildPageUrl(Math.min(pagination.pages, pagination.page + 1))}
            className={`px-4 py-3 rounded-xl border border-gray-100 bg-white font-bold text-gray-500 hover:text-navy hover:border-gray-200 transition-colors ${pagination.page >= pagination.pages ? 'pointer-events-none opacity-50' : ''}`}
          >
            Next
          </Link>
        </div>
      )}
    </div>
  );
}
