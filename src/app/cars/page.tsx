import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { CarFilters } from "@/components/features/cars/CarFilters"
import { VehicleCard } from "@/components/features/vehicle/VehicleCard"
import dbConnect from "@/lib/mongodb"
import Vehicle from "@/models/Vehicle"
import { Filter } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/Sheet"

export const metadata = {
  title: 'Search Cars | RENTALX',
  description: 'Browse our extensive fleet of luxury, sports, and economy vehicles.',
}

async function getVehicles(searchParams: { [key: string]: string | string[] | undefined }) {
    await dbConnect()

    const query: any = { available: true }

    // Category Filter
    if (searchParams.category) {
        const categories = Array.isArray(searchParams.category) 
            ? searchParams.category 
            : [searchParams.category]
        query.category = { $in: categories }
    }

    // Brand Filter
    if (searchParams.brand) {
        const brands = Array.isArray(searchParams.brand)
            ? searchParams.brand
            : [searchParams.brand]
        // Case insensitive search using regex if needed, or exact match if data is clean
        // query.brand = { $in: brands } 
        // For partial matches or case insensitivity:
        query.brand = { $in: brands.map(b => new RegExp(b as string, 'i')) }
    }

    // Transmission Filter
    if (searchParams.transmission) {
        const transmissions = Array.isArray(searchParams.transmission)
             ? searchParams.transmission
             : [searchParams.transmission]
        query.transmission = { $in: transmissions }
    }
    
    // Price Filter
    if (searchParams.minPrice || searchParams.maxPrice) {
        query['pricing.daily'] = {}
        if (searchParams.minPrice) query['pricing.daily'].$gte = parseInt(searchParams.minPrice as string)
        if (searchParams.maxPrice) query['pricing.daily'].$lte = parseInt(searchParams.maxPrice as string)
    }

    // Add more filters as needed

    const vehicles = await Vehicle.find(query).sort({ createdAt: -1 }).lean()
    
    return JSON.parse(JSON.stringify(vehicles))
}

export default async function CarsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const params = await searchParams // Awaiting searchParams for Next.js 15+ compat
    const vehicles = await getVehicles(params)

    return (
        <div className="flex flex-col min-h-screen bg-background">
            <Header />
            
            <main className="container mx-auto px-4 py-8 flex-1">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Desktop Sidebar */}
                    <aside className="hidden md:block w-64 flex-shrink-0">
                        <div className="sticky top-24">
                            <CarFilters />
                        </div>
                    </aside>
                    
                    {/* Main Content */}
                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-6">
                            <h1 className="text-3xl font-bold">Available Vehicles ({vehicles.length})</h1>
                            
                            {/* Mobile Filter Trigger */}
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button variant="outline" className="md:hidden">
                                        <Filter className="mr-2 h-4 w-4" /> Filters
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="left" className="w-[300px] sm:w-[400px] overflow-y-auto">
                                    <div className="py-4">
                                        <CarFilters />
                                    </div>
                                </SheetContent>
                            </Sheet>
                        </div>
                        
                        {vehicles.length === 0 ? (
                            <div className="text-center py-20 bg-muted/20 rounded-xl">
                                <h3 className="text-xl font-semibold mb-2">No vehicles found</h3>
                                <p className="text-muted-foreground">Try adjusting your filters to find what you're looking for.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {vehicles.map((vehicle: any) => (
                                    <VehicleCard key={vehicle._id} vehicle={vehicle} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>
            
            <Footer />
        </div>
    )
}
