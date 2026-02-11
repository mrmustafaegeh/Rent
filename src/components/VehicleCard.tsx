'use client';

import Image from 'next/image';
import Link from 'next/link';
import { 
  Heart, 
  MessageCircle, 
  Phone, 
  Share2, 
  Star,
  Calendar,
  Shield,
  MapPin,
  Settings,
  Gauge,
} from 'lucide-react';
import { useState } from 'react';

interface VehicleCardProps {
  vehicle: {
    _id: string;
    brand: string;
    vehicleModel: string;
    year: number;
    category: string;
    transmission?: string;
    fuelType?: string;
    seats?: number;
    pricing?: { // pricing is now optional
      daily?: number;
      monthly?: number;
    };
    mileageLimits?: {
      daily: number;
      monthly: number;
    };
    images?: Array<{ url: string; isPrimary: boolean }>;
    features?: string[];
    company?: {
      _id: string;
      name: string;
      logo?: string;
      phone: string;
      rating?: number;
    };
    location?: string;
    isFeatured?: boolean;
    specs?: {
      origin: string; // GCC or Import
      insurance: boolean;
      minRentalDays: number;
    };
    type?: 'rent' | 'sale';
    salePrice?: number;
    mileage?: number; // For sale vehicles
  };
}

export default function VehicleCard({ vehicle }: VehicleCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);

  // Get primary image or fallback
  const primaryImage = 
    vehicle.images?.find(img => img.isPrimary)?.url || 
    vehicle.images?.[0]?.url || 
    '/images/car-placeholder.jpg';

  // WhatsApp & Phone
  const phoneNumber = vehicle.company?.phone || '+971501234567';
  
  // Determine price and label
  const isSale = vehicle.type === 'sale' || !!vehicle.salePrice;
  const price = isSale ? vehicle.salePrice : vehicle.pricing?.daily;
  const priceLabel = isSale ? '' : '/ day';
  const priceDisplay = price ? `AED ${price.toLocaleString()}` : 'Price on Request';

  const whatsappMessage = encodeURIComponent(
    `Hi! I'm interested in ${isSale ? 'buying' : 'renting'} the ${vehicle.brand} ${vehicle.vehicleModel} ${vehicle.year} (${priceDisplay}${priceLabel})\n\nVehicle Link: ${process.env.NEXT_PUBLIC_APP_URL}/vehicles/${vehicle._id}`
  );
  const whatsappUrl = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}?text=${whatsappMessage}`;

  // Mileage display
  const dailyMileage = vehicle.mileageLimits?.daily || 250;
  const monthlyMileage = vehicle.mileageLimits?.monthly || 4500;

  // Toggle wishlist
  const toggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isTogglingFavorite) return;
    
    setIsTogglingFavorite(true);
    
    try {
      if (isFavorite) {
        // Remove from wishlist
        const response = await fetch(`/api/wishlist?vehicleId=${vehicle._id}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          setIsFavorite(false);
        } else {
          const data = await response.json();
          alert(data.message || 'Please login to use wishlist');
        }
      } else {
        // Add to wishlist
        const response = await fetch('/api/wishlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ vehicleId: vehicle._id }),
        });
        
        if (response.ok) {
          setIsFavorite(true);
        } else {
          const data = await response.json();
          alert(data.message || 'Please login to use wishlist');
        }
      }
    } catch (error) {
      console.error('Wishlist error:', error);
      alert('Please login to use wishlist');
    } finally {
      setIsTogglingFavorite(false);
    }
  };

  return (
    <div className="group relative bg-[var(--surface-light)] rounded-xl overflow-hidden border border-[var(--border)] hover:border-[var(--primary)] transition-all duration-300 hover:-translate-y-1">
      {/* Image Section */}
      <Link href={`/vehicles/${vehicle._id}`} className="block relative aspect-[16/10] overflow-hidden bg-[var(--surface-lighter)]">
        <Image
          src={imageError ? '/images/car-placeholder.jpg' : primaryImage}
          alt={`${vehicle.brand} ${vehicle.vehicleModel}`}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          onError={() => setImageError(true)}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* Featured Badge */}
        {vehicle.isFeatured && (
          <div className="absolute top-3 left-3 px-3 py-1.5 bg-purple-600 text-white text-xs font-bold rounded-md flex items-center gap-1">
            <Star className="w-3 h-3 fill-white" />
            Featured
          </div>
        )}

        {/* Favorite Button */}
        <button
          onClick={toggleWishlist}
          disabled={isTogglingFavorite}
          className="absolute top-3 right-3 w-9 h-9 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/70 transition-colors disabled:opacity-50"
        >
          <Heart
            className={`w-5 h-5 ${
              isFavorite ? 'fill-red-500 text-red-500' : 'text-white'
            }`}
          />
        </button>

        {/* Company Logo Badge */}
        {vehicle.company?.logo && (
          <div className="absolute bottom-3 left-3 w-12 h-12 bg-white rounded-lg shadow-md overflow-hidden p-1">
            <Image
              src={vehicle.company.logo}
              alt={vehicle.company.name}
              fill
              className="object-contain"
            />
          </div>
        )}
      </Link>

      {/* Content Section */}
      <div className="p-4 space-y-3">
        {/* Vehicle Title */}
        <Link href={`/vehicles/${vehicle._id}`}>
          <h3 className="text-lg font-bold text-white hover:text-[var(--primary)] transition-colors line-clamp-1">
            {vehicle.brand} {vehicle.vehicleModel} {vehicle.year}
          </h3>
        </Link>

        {/* Specs Row */}
        <div className="flex items-center gap-4 text-sm text-[var(--text-secondary)]">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{vehicle.year}</span>
          </div>
          <div className="flex items-center gap-1">
            <Settings className="w-4 h-4" />
            <span>{vehicle.specs?.origin || 'GCC'}</span>
          </div>
          <div className="flex items-center gap-1">
            <Gauge className="w-4 h-4" />
            <span className="capitalize">{vehicle.category}</span>
          </div>
        </div>

        {/* Info Badges */}
        <div className="flex flex-wrap gap-2 text-xs">
          {vehicle.specs?.minRentalDays === 1 && !isSale && (
            <div className="flex items-center gap-1 text-green-400">
              <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
              <span>1 day rental available</span>
            </div>
          )}
          
          {vehicle.specs?.insurance && !isSale && (
            <div className="flex items-center gap-1 text-[var(--text-muted)]">
              <Shield className="w-3.5 h-3.5" />
              <span>Insurance included</span>
            </div>
          )}
          
          {vehicle.location && (
            <div className="flex items-center gap-1 text-[var(--text-muted)]">
              <MapPin className="w-3.5 h-3.5" />
              <span>{vehicle.location}</span>
            </div>
          )}
        </div>

        {/* Pricing Section */}
        <div className="pt-3 border-t border-[var(--border)] space-y-2">
          {/* Daily/Sale Rate */}
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-white">
                {priceDisplay}
              </span>
              {!isSale && price && <span className="text-sm text-[var(--text-secondary)]">/ day</span>}
            </div>
            {!isSale && (
              <div className="flex items-center gap-1 text-xs text-[var(--text-muted)]">
                <Gauge className="w-3.5 h-3.5" />
                <span>{dailyMileage} km</span>
              </div>
            )}
            {isSale && vehicle.mileage && (
              <div className="flex items-center gap-1 text-xs text-[var(--text-muted)]">
                <Gauge className="w-3.5 h-3.5" />
                <span>{vehicle.mileage.toLocaleString()} km</span>
              </div>
            )}
          </div>

          {/* Monthly Rate (Rent only) */}
          {!isSale && vehicle.pricing?.monthly && (
            <div className="flex items-baseline justify-between">
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-semibold text-[var(--text-secondary)]">
                  AED {vehicle.pricing.monthly.toLocaleString()}
                </span>
                <span className="text-xs text-[var(--text-muted)]">/ month</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-[var(--text-muted)]">
                <Gauge className="w-3.5 h-3.5" />
                <span>{monthlyMileage} km</span>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-3">
          {/* WhatsApp */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm font-semibold"
          >
            <MessageCircle className="w-4 h-4" />
            <span>WhatsApp</span>
          </a>

          {/* Call */}
          <a
            href={`tel:${phoneNumber}`}
            onClick={(e) => e.stopPropagation()}
            className="flex items-center justify-center px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <Phone className="w-4 h-4" />
          </a>

          {/* Share */}
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowShare(!showShare);
              }}
              className="flex items-center justify-center px-4 py-2.5 bg-[var(--surface)] hover:bg-[var(--surface-lighter)] text-[var(--text-primary)] border border-[var(--border)] rounded-lg transition-colors"
            >
              <Share2 className="w-4 h-4" />
            </button>

            {/* Share Dropdown */}
            {showShare && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowShare(false)}
                />
                <div className="absolute right-0 bottom-full mb-2 w-48 bg-[var(--surface)] rounded-lg shadow-xl border border-[var(--border)] z-20 overflow-hidden">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(
                        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                          `${process.env.NEXT_PUBLIC_APP_URL}/vehicles/${vehicle._id}`
                        )}`,
                        '_blank'
                      );
                      setShowShare(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[var(--surface-light)] text-white transition-colors text-sm"
                  >
                    <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">f</span>
                    </div>
                    <span>Share on Facebook</span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigator.clipboard.writeText(
                        `${process.env.NEXT_PUBLIC_APP_URL}/vehicles/${vehicle._id}`
                      );
                      alert('Link copied to clipboard!');
                      setShowShare(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[var(--surface-light)] text-white transition-colors text-sm border-t border-[var(--border)]"
                  >
                    <Share2 className="w-5 h-5 text-[var(--text-secondary)]" />
                    <span>Copy Link</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
