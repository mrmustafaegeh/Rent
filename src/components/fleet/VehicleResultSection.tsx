'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import VehicleCard from '@/components/VehicleCard';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import OptimizedImage from '@/components/ui/OptimizedImage';
import { useCurrency } from '@/context/CurrencyContext';

interface VehicleResultSectionProps {
  vehicles: any[];
  pagination: {
    total: number;
    page: number;
    pages: number;
    limit: number;
  };
}

export default function VehicleResultSection({ vehicles, pagination }: VehicleResultSectionProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const { formatPrice } = useCurrency();

  const currentSort = searchParams.get('sort') || 'newest';

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', e.target.value);
    params.set('page', '1'); // Reset to page 1
    router.push(`/fleet?${params.toString()}`);
  };

  const buildPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    return `/fleet?${params.toString()}`;
  };

  return (
    <div>
      {/* Controls Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4 bg-[var(--surface-light)] p-4 rounded-xl border border-[var(--border)]">
        <span className="text-[var(--text-muted)] text-sm">
          Showing <span className="text-white font-medium">{vehicles.length}</span> of <span className="text-white font-medium">{pagination.total}</span> vehicles
        </span>

        <div className="flex items-center gap-4">
          {/* View Toggle */}
          <div className="flex bg-[var(--surface)] p-1 rounded-lg border border-[var(--border)]">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-[var(--surface-light)] text-white shadow-sm' : 'text-[var(--text-muted)] hover:text-white'}`}
              aria-label="Grid View"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-[var(--surface-light)] text-white shadow-sm' : 'text-[var(--text-muted)] hover:text-white'}`}
              aria-label="List View"
            >
               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
            </button>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-[var(--text-muted)] hidden sm:inline">Sort by:</span>
            <select
              value={currentSort}
              onChange={handleSortChange}
              className="bg-[var(--surface)] border border-[var(--border)] text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
            >
              <option value="newest">Newest Added</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {vehicles.length === 0 ? (
        <div className="text-center py-20 bg-[var(--surface-light)] rounded-xl border border-[var(--border)]">
          <h3 className="text-xl font-medium text-white mb-2">No vehicles found</h3>
          <p className="text-[var(--text-muted)]">Try adjusting your filters.</p>
        </div>
      ) : (
        <div className={
          viewMode === 'grid' 
            ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" 
            : "flex flex-col gap-4"
        }>
          {vehicles.map((vehicle: any) => (
             viewMode === 'grid' ? (
                <VehicleCard 
                  key={vehicle._id}
                  vehicle={vehicle}
                />
             ) : (
                // List View Card
                <div key={vehicle.id} className="bg-[var(--surface-light)] border border-[var(--border)] rounded-xl p-4 flex flex-col sm:flex-row gap-6 hover:border-[var(--primary)] transition-all">
                  <div className="relative w-full sm:w-64 h-48 flex-shrink-0 bg-[var(--surface-lighter)] text-white rounded-lg overflow-hidden">
                    <OptimizedImage 
                      src={vehicle.images?.[0]?.url || ''} 
                      alt={vehicle.brand} 
                      fill
                      className="object-cover w-full h-full"
                      sizes="(max-width: 640px) 100vw, 300px" 
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-between p-4 sm:p-0">
                    <div>
                      <div className="flex justify-between items-start">
                         <div>
                            <span className="text-xs text-[var(--primary)] font-bold uppercase tracking-wider">{vehicle.brand}</span>
                            <h3 className="text-xl font-bold text-white mt-1">{vehicle.vehicleModel}</h3>
                         </div>
                         <div className="text-right">
                            <div className="text-xl font-bold text-white">{formatPrice(vehicle.dailyPrice)}</div>
                            <div className="text-xs text-[var(--text-secondary)]">/day</div>
                         </div>
                      </div>
                      <div className="flex flex-wrap gap-4 mt-3 text-sm text-[var(--text-secondary)]">
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                          {vehicle.transmission}
                        </span>
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                          {vehicle.fuelType}
                        </span>
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                          {vehicle.seats} Seats
                        </span>
                      </div>
                    </div>
                    <div className="mt-4 sm:mt-0 pt-4 sm:pt-0 flex justify-end">
                       <Link href={`/vehicles/${vehicle.id}`}>
                         <Button className="w-full sm:w-auto">Rent Now</Button>
                       </Link>
                    </div>
                  </div>
                </div>
             )
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex justify-center mt-12 gap-2">
          <Link 
            href={buildPageUrl(Math.max(1, pagination.page - 1))}
            className={`px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--surface-light)] text-[var(--text-secondary)] hover:text-white hover:border-[var(--primary)] transition-colors ${pagination.page <= 1 ? 'pointer-events-none opacity-50' : ''}`}
          >
            Prev
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
                className={`w-10 h-10 flex items-center justify-center rounded-lg border ${
                  (pagination.page === p)
                    ? 'bg-[var(--primary)] text-black border-[var(--primary)]'
                    : 'bg-[var(--surface-light)] text-[var(--text-secondary)] border-[var(--border)] hover:border-[var(--primary)] hover:text-white'
                }`}
              >
                {p}
              </Link>
            );
          })}

          <Link 
            href={buildPageUrl(Math.min(pagination.pages, pagination.page + 1))}
            className={`px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--surface-light)] text-[var(--text-secondary)] hover:text-white hover:border-[var(--primary)] transition-colors ${pagination.page >= pagination.pages ? 'pointer-events-none opacity-50' : ''}`}
          >
            Next
          </Link>
        </div>
      )}
    </div>
  );
}
