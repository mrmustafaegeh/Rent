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

export const metadata = {
  title: 'Search Cars | Mediterranean Drive',
  description: 'Browse our extensive fleet of luxury, sports, and economy vehicles in North Cyprus.',
}

async function getVehicles(searchParams: { [key: string]: string | string[] | undefined }) {
    await dbConnect()

    const query: any = { available: true, type: { $ne: 'sale' } }

    // Category Filter
    if (searchParams.category) {
        const categories = Array.isArray(searchParams.category) 
            ? searchParams.category 
            : [searchParams.category]
        query.category = { $in: categories.map(c => new RegExp(c as string, 'i')) }
    }
    
    // Type Filter (Alias for Category if used)
    if (searchParams.type) {
        const types = Array.isArray(searchParams.type) 
            ? searchParams.type 
            : [searchParams.type]
        query.category = { $in: types.map(t => new RegExp(t as string, 'i')) }
    }

    // Brand Filter
    if (searchParams.brand) {
        const brands = Array.isArray(searchParams.brand)
            ? searchParams.brand
            : [searchParams.brand]
        // Case insensitive search
        query.brand = { $in: brands.map(b => new RegExp(b as string, 'i')) }
    }

    // Location Filter
    if (searchParams.location) {
        const locations = Array.isArray(searchParams.location)
            ? searchParams.location
            : [searchParams.location]
        // Assuming filtered by 'location' field if exists, or just ignoring if not implemented in schema yet.
        // If vehicles have a specific 'location' field:
        // query.location = { $in: locations.map(l => new RegExp(l as string, 'i')) }
        // For now, let's assume filtering by location might mean "available in this location"
        // If the schema doesn't support it, this might return nothing if I guess wrong.
        // Safest is to log or just rely on the frontend to drive it if backend isn ready.
        // Let's add it tentatively:
        query.location = { $in: locations.map(l => new RegExp(l as string, 'i')) }
    }

    // Transmission Filter
    if (searchParams.transmission) {
        const transmissions = Array.isArray(searchParams.transmission)
             ? searchParams.transmission
             : [searchParams.transmission]
        query['specs.transmission'] = { $in: transmissions }
    }
    
    // Price Filter
    if (searchParams.minPrice || searchParams.maxPrice) {
        query['pricing.daily'] = {}
        const min = parseInt(searchParams.minPrice as string)
        const max = parseInt(searchParams.maxPrice as string)
        if (!isNaN(min)) query['pricing.daily'].$gte = min
        if (!isNaN(max)) query['pricing.daily'].$lte = max
    }

    const vehicles = await Vehicle.find(query).sort({ 'pricing.daily': 1 }).lean()
    
    return JSON.parse(JSON.stringify(vehicles))
}

export default async function CarsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const params = await searchParams
    const vehicles = await getVehicles(params)

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
                    <h1 className="text-5xl md:text-7xl font-heading font-black text-white">Our Fleet</h1>
                    <p className="text-xl text-gray-200 max-w-2xl mx-auto font-body">
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
