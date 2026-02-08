import { Suspense } from 'react';
import { getVehicles, VehicleFilterParams } from '@/lib/vehicleService';
import FilterSidebar from '@/components/fleet/FilterSidebar';
import VehicleResultSection from '@/components/fleet/VehicleResultSection';
import { Metadata } from 'next';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Rent Luxury Cars in Dubai | Premium Fleet - RENTALX',
  description: 'Browse our premium fleet of 100+ luxury cars. Sports cars, SUVs, and sedans available for rent in Dubai.',
};

export default async function FleetPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  
  // Safe parsing of query params
  const filterParams: VehicleFilterParams = {
    category: typeof params.category === 'string' ? params.category : undefined,
    brand: typeof params.brand === 'string' ? params.brand : undefined,
    minPrice: params.minPrice ? Number(params.minPrice) : undefined,
    maxPrice: params.maxPrice ? Number(params.maxPrice) : undefined,
    seats: params.seats ? Number(params.seats) : undefined,
    transmission: typeof params.transmission === 'string' ? params.transmission : undefined,
    fuelType: typeof params.fuelType === 'string' ? params.fuelType : undefined,
    search: typeof params.search === 'string' ? params.search : undefined,
    featured: params.featured === 'true',
    sort: typeof params.sort === 'string' ? params.sort : 'newest',
    page: params.page ? Number(params.page) : 1,
    limit: 12
  };

  const result = await getVehicles(filterParams);

  return (
    <div className="flex flex-col min-h-screen bg-[var(--background)]">
      <Header />
      
      <main className="flex-1 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4 max-w-2xl mx-auto mb-12">
            <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">
              Premium Fleet
            </h1>
            <p className="text-[var(--text-secondary)] text-lg">
              Choose from our exclusive collection of luxury vehicles.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Suspense fallback={<div className="h-64 bg-[var(--surface-light)] rounded-xl animate-pulse"/>}>
                <FilterSidebar />
              </Suspense>
            </div>

            {/* Grid */}
            <div className="lg:col-span-3">
               <VehicleResultSection 
                 vehicles={result.vehicles} 
                 pagination={result.pagination} 
               />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
