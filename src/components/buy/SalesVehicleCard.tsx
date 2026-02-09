'use client';

import Image from 'next/image';
import Link from 'next/link';
import { 
  Heart, 
  MessageCircle, 
  Phone, 
  Share2, 
  Calendar,
  MapPin,
  Settings,
  Gauge,
  Info
} from 'lucide-react';
import { useState } from 'react';

interface SalesVehicleCardProps {
  vehicle: {
    _id: string;
    brand: string;
    vehicleModel: string;
    year: number;
    category: string;
    transmission?: string;
    fuelType?: string;
    seats?: number;
    salePrice?: number;
    mileage?: number; // Total mileage
    condition?: string;
    images?: Array<{ url: string; isPrimary: boolean }>;
    location?: string;
    type?: 'rent' | 'sale';
  };
}

export default function SalesVehicleCard({ vehicle }: SalesVehicleCardProps) {
  const [imageError, setImageError] = useState(false);

  // Get primary image or fallback
  const primaryImage = 
    vehicle.images?.find(img => img.isPrimary)?.url || 
    vehicle.images?.[0]?.url || 
    '/images/car-placeholder.jpg';

  // WhatsApp & Phone
  const phoneNumber = '+971501234567'; // Default company phone, or vehicle.owner?.phone if we had it populated
  const whatsappMessage = encodeURIComponent(
    `Hi! I'm interested in buying the ${vehicle.brand} ${vehicle.vehicleModel} ${vehicle.year} (Price: €${vehicle.salePrice?.toLocaleString()})\n\nLink: ${process.env.NEXT_PUBLIC_APP_URL}/buy/vehicles/${vehicle._id}`
  );
  const whatsappUrl = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}?text=${whatsappMessage}`;

  return (
    <div className="group relative bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      {/* Image Section */}
      <Link href={`/buy/vehicles/${vehicle._id}`} className="block relative aspect-[16/10] overflow-hidden bg-gray-100">
        <Image
          src={imageError ? '/images/car-placeholder.jpg' : primaryImage}
          alt={`${vehicle.brand} ${vehicle.vehicleModel}`}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          onError={() => setImageError(true)}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        <div className="absolute top-3 left-3 px-3 py-1.5 bg-navy/90 backdrop-blur-md text-white text-xs font-bold rounded-lg flex items-center gap-1 shadow-lg">
           <span className="capitalize">{vehicle.condition || 'Used'}</span>
        </div>
      </Link>

      {/* Content Section */}
      <div className="p-6 space-y-4">
        {/* Vehicle Title */}
        <div className="space-y-1">
             <div className="flex justify-between items-start">
                 <div>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{vehicle.brand}</span>
                    <Link href={`/buy/vehicles/${vehicle._id}`}>
                    <h3 className="text-xl font-heading font-black text-navy hover:text-gold transition-colors line-clamp-1">
                        {vehicle.vehicleModel}
                    </h3>
                    </Link>
                 </div>
                 {vehicle.salePrice && (
                     <div className="text-right">
                         <div className="text-xl font-black text-navy">€{vehicle.salePrice.toLocaleString()}</div>
                     </div>
                 )}
             </div>
        </div>

        {/* Core Specs Grid */}
        <div className="grid grid-cols-2 gap-3 py-4 border-y border-gray-100">
            <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4 text-gold" />
                <span className="font-bold">{vehicle.year}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
                <Gauge className="w-4 h-4 text-gold" />
                <span className="font-bold">{vehicle.mileage?.toLocaleString() || '0'} km</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
                <Settings className="w-4 h-4 text-gold" />
                <span className="font-bold">{vehicle.transmission}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-4 h-4 rounded-full bg-gold/20 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-gold" />
                </div>
                <span className="font-bold">{vehicle.fuelType}</span>
            </div>
        </div>
        
        {/* Footer Actions */}
        <div className="flex items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-1 text-xs font-bold text-gray-400">
                <MapPin className="w-3 h-3" />
                {vehicle.location || 'Dubai, UAE'}
            </div>
            
            <div className="flex gap-2">
                 <Link href={`/buy/vehicles/${vehicle._id}`}>
                    <button className="w-10 h-10 rounded-xl bg-gray-50 text-navy hover:bg-navy hover:text-white transition-all flex items-center justify-center">
                        <Info className="w-5 h-5" />
                    </button>
                 </Link>
                 <a href={whatsappUrl} target="_blank" rel="noreferrer">
                    <button className="w-10 h-10 rounded-xl bg-green-50 text-green-600 hover:bg-green-600 hover:text-white transition-all flex items-center justify-center">
                        <MessageCircle className="w-5 h-5" />
                    </button>
                 </a>
            </div>
        </div>
      </div>
    </div>
  );
}
