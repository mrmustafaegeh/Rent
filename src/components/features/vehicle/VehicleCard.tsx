'use client';

import Image from "next/image"
import Link from "next/link"
import { Heart, MessageCircle, Phone, Gauge, MapPin, Fuel, Users, GaugeCircle } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { cn } from "@/lib/utils"

export interface VehicleCardProps {
    vehicle: {
        _id: string; 
        brand: string;
        vehicleModel: string; // mapped from name
        year: number;
    pricing?: {
            daily?: number;
            weekly?: number;
            monthly?: number;
        };
        currency?: string;
        mileageLimits?: {
            daily: number;
        };
        specs?: {
            fuel?: string;
            transmission?: string;
            seats?: number;
        };
        images?: { url: string; isPrimary?: boolean }[];
        company?: {
            name: string;
            logo?: string;
            phone: string;
        };
        location?: string;
        isFeatured?: boolean;
        category?: string;
        type?: 'rent' | 'sale';
        salePrice?: number;
    }
}

export function VehicleCard({ vehicle }: VehicleCardProps) {
    const primaryImage = vehicle.images?.find(img => img.isPrimary)?.url || vehicle.images?.[0]?.url || '/images/car-placeholder.jpg';
    
    const isSale = vehicle.type === 'sale' || !!vehicle.salePrice;
    const price = isSale ? vehicle.salePrice : vehicle.pricing?.daily;
    const priceDisplay = price ? `€${price.toLocaleString()}` : 'Price on Request';
    
    return (
        <div className="group relative flex flex-col bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-all duration-300 h-full hover:-translate-y-1">
            {/* Image Area */}
            <Link href={`/cars/${vehicle._id}`} className="block relative aspect-[4/3] overflow-hidden bg-gray-50">
                 <Image 
                    src={primaryImage} 
                    alt={`${vehicle.brand} ${vehicle.vehicleModel}`}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                 />
                 
                 <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                 
                 <div className="absolute top-4 right-4 z-10">
                     <button className="h-10 w-10 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white text-gray-400 hover:text-red-500 shadow-sm transition-colors flex items-center justify-center">
                        <Heart className="h-5 w-5" />
                     </button>
                 </div>
                 
                 {vehicle.isFeatured && (
                    <div className="absolute top-4 left-4 z-10">
                        <span className="bg-gold text-navy text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                            ★ Featured
                        </span>
                    </div>
                 )}

                 {/* Quick Specs Overlay on Hover */}
                 <div className="absolute bottom-4 left-4 right-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                     <div className="flex gap-2 text-white text-xs font-medium">
                         <span className="bg-black/40 backdrop-blur-md px-2 py-1 rounded-md flex items-center gap-1">
                             <GaugeCircle className="w-3 h-3" /> {vehicle.specs?.transmission || 'Auto'}
                         </span>
                         <span className="bg-black/40 backdrop-blur-md px-2 py-1 rounded-md flex items-center gap-1">
                             <Fuel className="w-3 h-3" /> {vehicle.specs?.fuel || 'Petrol'}
                         </span>
                         <span className="bg-black/40 backdrop-blur-md px-2 py-1 rounded-md flex items-center gap-1">
                             <Users className="w-3 h-3" /> {vehicle.specs?.seats || 5}
                         </span>
                     </div>
                 </div>
            </Link>
            
            {/* Content */}
            <div className="p-6 flex flex-col flex-1 gap-4">
                <div className="flex justify-between items-start">
                    <Link href={`/cars/${vehicle._id}`} className="group-hover:text-electric transition-colors">
                        <h3 className="font-heading font-bold text-xl text-navy leading-tight line-clamp-1">{vehicle.brand} {vehicle.vehicleModel}</h3>
                        <div className="flex items-center gap-2 mt-2 text-sm text-gray-400">
                            <MapPin className="h-3 w-3" /> 
                            <span>{vehicle.location || 'North Cyprus'}</span>
                            <span className="text-gray-300">•</span>
                            <span>{vehicle.year}</span>
                        </div>
                    </Link>
                </div>
                
                <div className="mt-auto pt-4 border-t border-gray-100 flex items-end justify-between">
                    <div>
                        <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block mb-1">{isSale ? 'Sale Price' : 'Daily Rate'}</span>
                        <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-bold text-electric">{priceDisplay}</span>
                            {!isSale && price && <span className="text-sm text-gray-400">/day</span>}
                        </div>
                    </div>
                    {!isSale && vehicle.pricing?.weekly && (
                         <div className="text-right">
                             <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block mb-1">Weekly</span>
                             <span className="text-sm font-bold text-navy">€{Math.round(vehicle.pricing.weekly)}</span>
                         </div>
                    )}
                </div>
                
                <div className="grid grid-cols-2 gap-3 pt-2">
                    <Button variant="outline" className="w-full gap-2 border-gray-200 hover:border-electric hover:text-electric hover:bg-white h-11 text-sm font-bold rounded-xl transition-all">
                        <Phone className="h-4 w-4" /> Call
                    </Button>
                    <Button className="w-full gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white border-none h-11 text-sm font-bold rounded-xl shadow-[0_4px_14px_0_rgba(37,211,102,0.39)] transition-all">
                        <MessageCircle className="h-4 w-4" /> WhatsApp
                    </Button>
                </div>
            </div>
        </div>
    )
}
