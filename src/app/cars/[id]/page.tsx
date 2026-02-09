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
import { Check, Star, ShieldCheck, ArrowLeft, Info, HelpCircle } from "lucide-react"
import { RecommendedCars } from "@/components/features/vehicle/RecommendedCars"
import Link from "next/link"
import { Button } from "@/components/ui/Button"

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
        title: `${vehicle.brand} ${vehicle.model} Rental | Mediterranean Drive`,
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
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Header />
            
            <main className="container mx-auto px-4 py-8 flex-1">
                 {/* Breadcrumb / Back */}
                 <div className="mb-6">
                     <Link href="/cars" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-navy transition-colors">
                         <ArrowLeft className="w-4 h-4 mr-1" /> Back to Fleet
                     </Link>
                 </div>
                 
                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 mb-16">
                     {/* Left Column: Images & Details */}
                     <div className="lg:col-span-2 space-y-10">
                         {/* Header Section (Mobile/Tablet dominant) */}
                         <div className="space-y-4">
                             <div className="flex flex-col gap-2">
                                 <div className="flex items-center gap-2">
                                     <Badge variant="outline" className="text-xs bg-white text-navy border-navy/20">{vehicle.category}</Badge>
                                     <div className="flex items-center text-gold text-sm font-bold">
                                         <Star className="w-4 h-4 fill-current mr-1" /> 
                                         <span>5.0</span>
                                         <span className="text-gray-400 font-normal ml-1">(24 reviews)</span>
                                     </div>
                                 </div>
                                 <h1 className="text-4xl md:text-5xl font-heading font-black text-navy">{vehicle.brand} {vehicle.model}</h1>
                                 <p className="text-gray-500 font-medium flex items-center gap-2">
                                     {vehicle.year} Model • {vehicle.specs?.transmission || 'Automatic'} • {vehicle.specs?.fuelType || 'Petrol'}
                                 </p>
                             </div>
                             
                             <ImageGallery images={vehicle.images?.map((img: any) => img.url) || []} title={`${vehicle.brand} ${vehicle.model}`} />
                         </div>

                         {/* Specs Grid */}
                         <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                             <h2 className="text-xl font-heading font-bold text-navy mb-6">Vehicle Specifications</h2>
                             <VehicleSpecs specs={{
                                ...vehicle.specs,
                                transmission: vehicle.transmission, // Fallback if regular field exists
                                fuelType: vehicle.fuelType,
                                seats: vehicle.seats,
                                year: vehicle.year
                             }} />
                         </div>
                         
                         {/* Description & Features */}
                         <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-8">
                             <div>
                                 <h2 className="text-xl font-heading font-bold text-navy mb-4">About this {vehicle.brand}</h2>
                                 <p className="text-gray-500 leading-relaxed font-body">
                                    Experience the ultimate driving pleasure with our {vehicle.brand} {vehicle.model}. 
                                    Perfect for exploring the beautiful coastlines of North Cyprus or making a statement at your business meetings.
                                    This vehicle comes equipped with premium features and is maintained to the highest standards.
                                 </p>
                             </div>
                             
                             <Separator className="bg-gray-100" />

                             <div>
                                 <h3 className="font-heading font-bold text-navy mb-4">Key Features</h3>
                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-8">
                                     {(vehicle.features || ["Bluetooth", "Navigation System", "Parking Sensors", "Cruise Control", "Leather Interior", "USB Charging"]).map((feature: string, i: number) => (
                                         <div key={`feature-${i}`} className="flex items-center gap-3">
                                             <div className="w-6 h-6 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0">
                                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                                             </div>
                                             <span className="text-gray-600 font-medium">{feature}</span>
                                         </div>
                                     ))}
                                 </div>
                             </div>
                         </div>
                         
                         {/* Conditions */}
                         <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                             <div className="flex items-center gap-2 mb-6">
                                <h2 className="text-xl font-heading font-bold text-navy">Rental Conditions</h2>
                                <Info className="w-4 h-4 text-gray-400" />
                             </div>
                             
                             <div className="grid gap-6 md:grid-cols-2">
                                 <div className="flex gap-4 p-4 rounded-2xl bg-gray-50/50 hover:bg-gray-50 transition-colors">
                                     <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                                        <ShieldCheck className="w-5 h-5 text-blue-600" />
                                     </div>
                                     <div>
                                         <h4 className="font-bold text-navy">Insurance Included</h4>
                                         <p className="text-sm text-gray-500 mt-1">Basic CDW insurance covers you against major damages.</p>
                                     </div>
                                 </div>
                                 <div className="flex gap-4 p-4 rounded-2xl bg-gray-50/50 hover:bg-gray-50 transition-colors">
                                     <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0">
                                        <Check className="w-5 h-5 text-green-600" />
                                     </div>
                                     <div>
                                         <h4 className="font-bold text-navy">Free Cancellation</h4>
                                         <p className="text-sm text-gray-500 mt-1">Cancel up to 48 hours before pickup for a full refund.</p>
                                     </div>
                                 </div>
                                  <div className="flex gap-4 p-4 rounded-2xl bg-gray-50/50 hover:bg-gray-50 transition-colors">
                                     <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center flex-shrink-0">
                                        <HelpCircle className="w-5 h-5 text-amber-600" />
                                     </div>
                                     <div>
                                         <h4 className="font-bold text-navy">Security Deposit</h4>
                                         <p className="text-sm text-gray-500 mt-1">€500 refundable deposit required at pickup via Credit Card.</p>
                                     </div>
                                 </div>
                                  <div className="flex gap-4 p-4 rounded-2xl bg-gray-50/50 hover:bg-gray-50 transition-colors">
                                     <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center flex-shrink-0">
                                        <ArrowLeft className="w-5 h-5 text-purple-600 rotate-45" />
                                     </div>
                                     <div>
                                         <h4 className="font-bold text-navy">Mileage Limit</h4>
                                         <p className="text-sm text-gray-500 mt-1">250km/day included. Additional km at €0.15/km.</p>
                                     </div>
                                 </div>
                             </div>
                         </div>
                     </div>
                     
                     {/* Right Column: Booking Widget */}
                     <div className="lg:col-span-1 relative z-10">
                         <BookingWidget pricing={vehicle.pricing} vehicleId={vehicle._id} />
                         
                         <div className="mt-8 bg-navy p-8 rounded-3xl text-center shadow-lg relative overflow-hidden">
                             <div className="absolute top-0 right-0 w-32 h-32 bg-gold/10 rounded-full blur-3xl -mr-16 -mt-16" />
                             <div className="relative z-10">
                                 <h3 className="text-white font-heading font-bold text-lg mb-2">Need Help?</h3>
                                 <p className="text-gray-300 text-sm mb-6">
                                     Our support team is available 24/7 to answer your questions.
                                 </p>
                                 <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white hover:text-navy hover:border-white h-12 rounded-xl text-sm font-bold">
                                     Contact Support
                                 </Button>
                             </div>
                         </div>
                     </div>
                 </div>

                 <Separator className="bg-gray-200 mb-12" />

                 <div className="space-y-8">
                     <div className="flex items-center justify-between">
                         <h2 className="text-2xl md:text-3xl font-heading font-bold text-navy">Similar Models</h2>
                     </div>
                     <RecommendedCars vehicles={recommended} />
                 </div>
            </main>
            
            <Footer />
        </div>
    )
}
