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
    limit: 50
  };

  const result = await getVehicles(filterParams);

  return (
    <div className="flex flex-col min-h-screen bg-[var(--background)]">
      <Header />
      
      <main className="flex-1">
        
        {/* Hero Header */}
        <section className="bg-navy pt-32 pb-20 px-4 text-center relative overflow-hidden">
             <div className="absolute inset-x-0 bottom-0 h-px bg-white/10" />
             <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-electric/10 rounded-full blur-[100px] pointer-events-none" />
             
             <div className="relative z-10 max-w-4xl mx-auto space-y-6">
                <span className="text-gold font-bold uppercase tracking-widest text-xs mb-2 block animate-in fade-in slide-in-from-bottom-2">
                    Our Collection
                </span>
                <h1 className="text-4xl md:text-6xl font-heading font-black text-white leading-tight animate-in fade-in slide-in-from-bottom-4">
                    The Premium <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold to-yellow-500">Fleet</span>
                </h1>
                <p className="text-gray-400 text-lg md:text-xl font-body leading-relaxed max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-6">
                    Meticulously maintained. Delivered to your door. Experience the freedom of the open road in ultimate luxury.
                </p>
             </div>
        </section>

        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Suspense fallback={<div className="h-64 bg-gray-100 rounded-3xl animate-pulse"/>}>
                 <div className="sticky top-24">
                    <FilterSidebar />
                 </div>
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
