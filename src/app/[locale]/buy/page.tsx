import { Suspense } from 'react';
import { getVehicles, VehicleFilterParams } from '@/lib/vehicleService';
import SalesFilterSidebar from '@/components/buy/SalesFilterSidebar';
import SalesResultSection from '@/components/buy/SalesResultSection';
import { Metadata } from 'next';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/Button';
import { Filter } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/Sheet';

export const metadata: Metadata = {
  title: 'Buy Premium Cars | Luxury Marketplace - RENTALX',
  description: 'Browse our exclusive collection of luxury cars for sale. Verified listings, premium quality.',
};

export default async function BuyPage({
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
    limit: 12,
    type: 'sale',
    status: 'approved' // Only show approved listings
  };

  const result = await getVehicles(filterParams);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      
      <main className="flex-1">
        
        {/* Hero Header */}
        {/* Hero Header */}
        <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden py-24">
             {/* Background */}
             <div className="absolute inset-0">
                <div 
                    className="absolute inset-0 bg-[url('/images/buy-hero-bg.png')] bg-cover bg-center bg-no-repeat"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-navy/90 to-navy/70 mix-blend-multiply" />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-50 via-transparent to-transparent" />
             </div>
             
             <div className="relative z-10 max-w-4xl mx-auto space-y-6 text-center px-4">
                <span className="inline-block px-4 py-1.5 rounded-full border border-white/20 bg-white/10 text-gold text-xs font-bold tracking-[0.2em] uppercase backdrop-blur-md animate-in fade-in slide-in-from-bottom-2">
                    Premium Marketplace
                </span>
                <h1 className="text-3xl sm:text-4xl md:text-6xl font-heading font-black text-white leading-tight animate-in fade-in slide-in-from-bottom-4 shadow-sm">
                    Own The <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold to-amber-500">Exceptional</span>
                </h1>
                <p className="text-gray-200 text-base sm:text-lg md:text-xl font-body leading-relaxed max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-6 font-medium drop-shadow-md">
                    Discover a curated selection of premium vehicles. Verified quality, transparent pricing, and exclusive ownership benefits.
                </p>
             </div>
        </section>

        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Mobile Filter Button */}
            <div className="lg:hidden mb-6 flex items-center justify-between bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                <span className="font-heading font-bold text-navy">Refine Search</span>
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline" className="border-navy text-navy font-bold">
                            <Filter className="mr-2 h-4 w-4" /> Filters
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-[300px] sm:w-[400px] overflow-y-auto bg-gray-50 p-6">
                        <div className="py-4">
                            <Suspense fallback={<div className="h-64 bg-white rounded-3xl animate-pulse"/>}>
                                <SalesFilterSidebar />
                            </Suspense>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>

            {/* Sidebar (Desktop) */}
            <div className="hidden lg:block lg:col-span-1">
              <Suspense fallback={<div className="h-64 bg-gray-100 rounded-3xl animate-pulse"/>}>
                 <div className="sticky top-24">
                    <SalesFilterSidebar />
                 </div>
              </Suspense>
            </div>

            {/* Grid */}
            <div className="lg:col-span-3">
               <SalesResultSection 
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
