'use client';

import Image from "next/image"
import Link from "next/link"
import { Heart, MessageCircle, Phone, Gauge, MapPin } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"

export interface VehicleCardProps {
    vehicle: {
        _id: string; 
        brand: string;
        vehicleModel: string; // mapped from name
        year: number;
        pricing: {
            daily: number;
            monthly?: number;
        };
        currency?: string;
        mileageLimits?: {
            daily: number;
        };
        images?: { url: string; isPrimary?: boolean }[];
        company?: {
            name: string;
            logo?: string;
            phone: string;
        };
        location?: string;
        isFeatured?: boolean;
    }
}

export function VehicleCard({ vehicle }: VehicleCardProps) {
    const primaryImage = vehicle.images?.find(img => img.isPrimary)?.url || vehicle.images?.[0]?.url || '/images/car-placeholder.jpg';
    const currency = vehicle.currency || 'AED'; // Default to AED as per prompt but should change to appropriate currency
    
    return (
        <div className="group relative flex flex-col bg-card border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all h-full">
            {/* Image Area */}
            <Link href={`/cars/${vehicle._id}`} className="block relative aspect-[16/10] overflow-hidden bg-muted">
                 <Image 
                    src={primaryImage} 
                    alt={`${vehicle.brand} ${vehicle.vehicleModel}`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                 />
                 <div className="absolute top-3 right-3 z-10">
                     <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white text-gray-500 hover:text-red-500 shadow-sm transition-colors">
                        <Heart className="h-4 w-4" />
                     </Button>
                 </div>
                 {vehicle.isFeatured && (
                    <div className="absolute top-3 left-3 z-10">
                        <Badge className="bg-primary text-white shadow-sm">Featured</Badge>
                    </div>
                 )}
            </Link>
            
            {/* Content */}
            <div className="p-4 flex flex-col flex-1 gap-2">
                <div className="flex justify-between items-start">
                    <Link href={`/cars/${vehicle._id}`} className="group-hover:text-primary transition-colors">
                        <h3 className="font-bold text-lg leading-tight line-clamp-1">{vehicle.brand} {vehicle.vehicleModel} {vehicle.year}</h3>
                        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1"><Gauge className="h-3 w-3" /> {vehicle.mileageLimits?.daily || 250}km</span>
                            <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {vehicle.location || 'North Cyprus'}</span>
                        </div>
                    </Link>
                     {vehicle.company?.logo && (
                        <div className="h-8 w-8 relative rounded overflow-hidden border bg-white shrink-0">
                            <Image src={vehicle.company.logo} alt="Provider" fill className="object-contain p-0.5" />
                        </div>
                    )}
                </div>
                
                <div className="mt-auto pt-2 space-y-1">
                    <div className="flex items-baseline gap-1">
                        <span className="text-xl font-bold text-primary">{currency} {vehicle.pricing.daily}</span>
                        <span className="text-xs text-muted-foreground">/ day</span>
                    </div>
                    {vehicle.pricing.monthly && (
                        <div className="flex items-baseline gap-1 text-sm text-muted-foreground">
                            <span className="font-semibold">{currency} {vehicle.pricing.monthly}</span>
                            <span className="text-xs">/ month</span>
                        </div>
                    )}
                </div>
                
                <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t">
                    <Button variant="outline" className="w-full gap-2 text-green-600 hover:text-green-700 hover:bg-green-50 border-green-200 h-9 text-sm">
                        <MessageCircle className="h-4 w-4" /> WhatsApp
                    </Button>
                    <Button variant="outline" className="w-full gap-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-blue-200 h-9 text-sm">
                        <Phone className="h-4 w-4" /> Call
                    </Button>
                </div>
            </div>
        </div>
    )
}
