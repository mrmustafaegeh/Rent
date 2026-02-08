import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { ImageGallery } from "@/components/features/vehicle/ImageGallery"
import { VehicleSpecs } from "@/components/features/vehicle/VehicleSpecs"
import { BookingWidget } from "@/components/features/vehicle/BookingWidget"
import { Separator } from "@/components/ui/Separator"
import { Badge } from "@/components/ui/Badge"
import dbConnect from "@/lib/mongodb"
import Vehicle from "@/models/Vehicle"
import { notFound } from "next/navigation"
import { Check, Star, ShieldCheck } from "lucide-react"
import { RecommendedCars } from "@/components/features/vehicle/RecommendedCars"

async function getVehicle(id: string) {
    await dbConnect()
    try {
        const vehicle = await Vehicle.findById(id).lean()
        if (!vehicle) return null
        return JSON.parse(JSON.stringify(vehicle))
    } catch (e) {
        return null
    }
}

async function getRecommendedVehicles(category: string, currentId: string) {
    await dbConnect()
    try {
        const vehicles = await Vehicle.find({ 
            category: category,
            _id: { $ne: currentId }
        })
        .limit(4)
        .lean()
        
        // If not enough same category, fetch others
        if (vehicles.length < 4) {
            const others = await Vehicle.find({
                _id: { $ne: currentId, $nin: vehicles.map(v => v._id) }
            })
            .limit(4 - vehicles.length)
            .lean()
            
            return JSON.parse(JSON.stringify([...vehicles, ...others]))
        }

        return JSON.parse(JSON.stringify(vehicles))
    } catch (e) {
        return []
    }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const vehicle = await getVehicle(id)
    if (!vehicle) return { title: 'Vehicle Not Found' }
    
    return {
        title: `${vehicle.brand} ${vehicle.model} Rental | RENTALX`,
        description: `Rent a ${vehicle.brand} ${vehicle.model} in North Cyprus. Best prices, free delivery to Ercan Airport and Kyrenia.`
    }
}

export default async function VehicleDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const vehicle = await getVehicle(id)

    if (!vehicle) {
        notFound()
    }

    const recommended = await getRecommendedVehicles(vehicle.category, vehicle._id)

    return (
        <div className="flex flex-col min-h-screen bg-background">
            <Header />
            
            <main className="container mx-auto px-4 py-8 flex-1">
                 {/* Breadcrumb could go here */}
                 
                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                     {/* Left Column: Images & Details */}
                     <div className="lg:col-span-2 space-y-8">
                         <div className="space-y-4">
                             <div className="flex justify-between items-start">
                                 <div>
                                     <Badge variant="outline" className="mb-2">{vehicle.category}</Badge>
                                     <h1 className="text-3xl md:text-4xl font-bold">{vehicle.brand} {vehicle.model}</h1>
                                     <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                                         <span className="flex items-center text-yellow-500"><Star className="w-4 h-4 fill-current mr-1" /> 5.0 (24 reviews)</span>
                                         <span>•</span>
                                         <span>{vehicle.year} Model</span>
                                     </div>
                                 </div>
                             </div>
                             
                             <ImageGallery images={vehicle.images?.map((img: any) => img.url) || []} title={`${vehicle.brand} ${vehicle.model}`} />
                         </div>

                         <VehicleSpecs specs={{
                            ...vehicle.specs,
                            transmission: vehicle.transmission,
                            fuelType: vehicle.fuelType,
                            seats: vehicle.seats,
                            year: vehicle.year
                         }} />
                         
                         <div className="space-y-4">
                             <h2 className="text-2xl font-bold">About this car</h2>
                             <p className="text-muted-foreground leading-relaxed">
                                Experience the ultimate driving pleasure with our {vehicle.brand} {vehicle.model}. 
                                Perfect for exploring the beautiful coastlines of North Cyprus or making a statement at your business meetings.
                                This vehicle comes equipped with premium features and is maintained to the highest standards.
                             </p>
                             
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                                 <h3 className="font-semibold col-span-full">Key Features</h3>
                                 {vehicle.features?.map((feature: string, i: number) => (
                                     <div key={`feature-${i}`} className="flex items-center gap-2">
                                         <Check className="w-4 h-4 text-primary" />
                                         <span className="text-sm">{feature}</span>
                                     </div>
                                 ))}
                             </div>
                         </div>
                         
                         <Separator />
                         
                         <div className="space-y-4">
                             <h2 className="text-2xl font-bold">Rental Conditions</h2>
                             <div className="grid gap-4 md:grid-cols-2">
                                 <div className="flex gap-3">
                                     <ShieldCheck className="w-6 h-6 text-primary flex-shrink-0" />
                                     <div>
                                         <h4 className="font-semibold">Insurance Included</h4>
                                         <p className="text-sm text-muted-foreground">Basic CDW insurance is included in the price.</p>
                                     </div>
                                 </div>
                                 <div className="flex gap-3">
                                     <ShieldCheck className="w-6 h-6 text-primary flex-shrink-0" />
                                     <div>
                                         <h4 className="font-semibold">Free Cancellation</h4>
                                         <p className="text-sm text-muted-foreground">Cancel up to 48 hours before pickup for a full refund.</p>
                                     </div>
                                 </div>
                                  <div className="flex gap-3">
                                     <ShieldCheck className="w-6 h-6 text-primary flex-shrink-0" />
                                     <div>
                                         <h4 className="font-semibold">Security Deposit</h4>
                                         <p className="text-sm text-muted-foreground">€500 refundable deposit required at pickup.</p>
                                     </div>
                                 </div>
                                  <div className="flex gap-3">
                                     <ShieldCheck className="w-6 h-6 text-primary flex-shrink-0" />
                                     <div>
                                         <h4 className="font-semibold">Mileage Limit</h4>
                                         <p className="text-sm text-muted-foreground">Unlimited mileage for bookings over 3 days.</p>
                                     </div>
                                 </div>
                             </div>
                         </div>
                     </div>
                     
                     {/* Right Column: Booking Widget */}
                     <div className="lg:col-span-1">
                         <div className="sticky top-24">
                            <BookingWidget pricing={vehicle.pricing} vehicleId={vehicle._id} />
                         </div>
                     </div>
                 </div>

                 <RecommendedCars vehicles={recommended} />
            </main>
            
            <Footer />
        </div>
    )
}
