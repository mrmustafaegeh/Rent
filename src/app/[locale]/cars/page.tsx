import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { CarFilters } from "@/components/features/cars/CarFilters"
import { VehicleCard } from "@/components/features/vehicle/VehicleCard"
import dbConnect from "@/lib/mongodb"
import Vehicle from "@/models/Vehicle"
import { Filter, ChevronDown, ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/Sheet"
import Image from "next/image"
import { getVehicles, VehicleFilterParams } from "@/lib/vehicleService"

export const metadata = {
  title: 'Search Cars | Mediterranean Drive',
  description: 'Browse our extensive fleet of luxury, sports, and economy vehicles in North Cyprus.',
}

// Local wrapper function to adapt searchParams to VehicleFilterParams
async function getVehiclesData(searchParams: { [key: string]: string | string[] | undefined }) {
    const params: VehicleFilterParams = {
        category: typeof searchParams.category === 'string' ? searchParams.category : undefined,
        brand: typeof searchParams.brand === 'string' ? searchParams.brand : undefined,
        location: typeof searchParams.location === 'string' ? searchParams.location : undefined,
        transmission: typeof searchParams.transmission === 'string' ? searchParams.transmission : undefined,
        fuelType: typeof searchParams.fuelType === 'string' ? searchParams.fuelType : undefined,
        minPrice: searchParams.minPrice ? parseInt(searchParams.minPrice as string) : undefined,
        maxPrice: searchParams.maxPrice ? parseInt(searchParams.maxPrice as string) : undefined,
        type: 'rent', // Fleet page is for rentals
        status: 'approved', // Only show approved cars to users
        limit: 100, // Show many for now
    };

    const result = await getVehicles(params);
    return result.vehicles;
}

export default async function CarsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const params = await searchParams
    const vehicles = await getVehiclesData(params)

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Header />
            
            {/* Page Hero */}
            <div className="relative h-[40vh] min-h-[400px] flex items-center justify-center overflow-hidden">
                <Image 
                    src="/images/hero-bg-cyprus.png"
                    alt="Our Fleet"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-navy/60 mix-blend-multiply" />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-50 via-transparent to-transparent" />
                
                <div className="relative z-10 text-center space-y-4 px-4">
                    <span className="text-gold font-bold tracking-[0.2em] text-sm uppercase">PREMIUM SELECTION</span>
                    <h1 className="text-3xl sm:text-5xl md:text-7xl font-heading font-black text-white">Our Fleet</h1>
                    <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto font-body">
                        Choose from our curated collection of luxury, sports, and economy vehicles for your North Cyprus journey.
                    </p>
                </div>
            </div>
            
            <main className="container mx-auto px-4 py-8 -mt-20 relative z-20">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Desktop Sidebar */}
                    <aside className="hidden lg:block w-80 flex-shrink-0">
                        <div className="sticky top-24">
                            <CarFilters />
                        </div>
                    </aside>
                    
                    {/* Main Content */}
                    <div className="flex-1">
                        {/* Toolbar */}
                        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between mb-8">
                            <div className="flex items-center gap-2">
                                <h2 className="font-heading font-bold text-navy text-lg">
                                    Available Vehicles 
                                    <span className="ml-2 text-gray-400 text-sm font-normal">({vehicles.length} found)</span>
                                </h2>
                            </div>
                            
                            <div className="flex items-center gap-3">
                                {/* Mobile Filter Trigger */}
                                <Sheet>
                                    <SheetTrigger asChild>
                                        <Button variant="outline" className="lg:hidden border-gray-200 text-navy font-bold" aria-label="Open filters">
                                            <Filter className="mr-2 h-4 w-4" /> Filters
                                        </Button>
                                    </SheetTrigger>
                                    <SheetContent side="left" className="w-[300px] sm:w-[400px] overflow-y-auto bg-gray-50">
                                        <div className="py-6">
                                            <CarFilters />
                                        </div>
                                    </SheetContent>
                                </Sheet>

                                {/* Sort (Visual only for now) */}
                                <Button variant="ghost" className="hidden sm:flex gap-2 text-gray-500 hover:text-navy font-medium">
                                    <ArrowUpDown className="w-4 h-4" /> Sort by: Price (Low to High) <ChevronDown className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                        
                        {vehicles.length === 0 ? (
                            <div className="text-center py-32 bg-white rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center justify-center">
                                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                                    <Filter className="w-8 h-8 text-gray-300" />
                                </div>
                                <h3 className="text-2xl font-heading font-bold text-navy mb-2">No vehicles found</h3>
                                <p className="text-gray-500 max-w-md mx-auto mb-8 font-body">
                                    We couldn't find any cars matching your criteria. Try adjusting your filters or search for something else.
                                </p>
                                <Button className="bg-electric hover:bg-electric/90 text-white font-bold rounded-full px-8 h-12">
                                    Clear All Filters
                                </Button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                                {vehicles.map((vehicle: any) => (
                                    <VehicleCard key={vehicle._id} vehicle={vehicle} />
                                ))}
                            </div>
                        )}
                        
                        {/* Pagination Placeholder */}
                        {vehicles.length > 0 && (
                            <div className="mt-16 flex justify-center">
                                <Button variant="outline" className="h-14 px-8 border-gray-200 text-gray-500 hover:text-navy hover:border-navy rounded-full font-bold transition-all">
                                    Load More Vehicles
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </main>
            
            <Footer />
        </div>
    )
}
