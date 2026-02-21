'use client';

import { OptimizedImage } from '@/components/ui/OptimizedImage';
import { Link } from '@/navigation';
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
import { useTranslations } from 'next-intl';
import { useCurrency } from '@/context/CurrencyContext';
import { CurrencyCode } from '@/lib/currency';

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
    currency?: string;
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
  const { formatPrice } = useCurrency();
  const t = useTranslations('VehicleCard');
  // const tCommon = useTranslations('Common');

  // Get primary image or fallback
  const primaryImage = 
    vehicle.images?.find(img => img.isPrimary)?.url || 
    vehicle.images?.[0]?.url || 
    '/images/car-placeholder.jpg';

  // WhatsApp & Phone
  const phoneNumber = vehicle.company?.phone || '+971501234567';
  
  // Determine price and label
  const isSale = vehicle.type === 'sale' || !!vehicle.salePrice;
  const price = (isSale ? vehicle.salePrice : vehicle.pricing?.daily) || 0;
  const vehicleCurrency = (vehicle.currency as CurrencyCode) || 'EUR';
  const priceDisplay = price > 0 ? formatPrice(price, vehicleCurrency) : t('priceOnRequest');
  const priceLabel = isSale ? '' : ` / ${t('day')}`;

  const whatsappMessage = encodeURIComponent(
    `Hi! I'm interested in ${isSale ? 'buying' : 'renting'} the ${vehicle.brand} ${vehicle.vehicleModel} ${vehicle.year} (${priceDisplay}${priceLabel})\n\nVehicle Link: ${process.env.NEXT_PUBLIC_APP_URL}/cars/${vehicle._id}`
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
          alert(data.message || t('loginRequired'));
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
          alert(data.message || t('loginRequired'));
        }
      }
    } catch (error) {
      console.error('Wishlist error:', error);
      alert(t('loginRequired'));
    } finally {
      setIsTogglingFavorite(false);
    }
  };

  return (
    <div className="group relative bg-white rounded-xl overflow-hidden border border-slate-100 hover:border-turquoise shadow-sm hover:shadow-hover transition-all duration-300 hover:-translate-y-1">
      {/* Image Section */}
      <Link href={`/cars/${vehicle._id}`} className="block relative aspect-[16/10] overflow-hidden bg-slate-50">
        <OptimizedImage
          src={imageError ? '/images/car-placeholder.jpg' : primaryImage}
          alt={`${vehicle.brand} ${vehicle.vehicleModel}`}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          onError={() => setImageError(true)}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* Featured Badge */}
        {vehicle.isFeatured && (
          <div className="absolute top-3 start-3 px-3 py-1.5 bg-purple-600 text-white text-xs font-bold rounded-md flex items-center gap-1">
            <Star className="w-3 h-3 fill-white" />
            {t('featured')}
          </div>
        )}

        {/* Favorite Button */}
        <button
          onClick={toggleWishlist}
          disabled={isTogglingFavorite}
          aria-label={isFavorite ? t('removeFromWishlist') : t('addToWishlist')}
          className="absolute top-3 end-3 w-9 h-9 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/60 transition-colors disabled:opacity-50"
        >
          <Heart
            className={`w-5 h-5 ${
              isFavorite ? 'fill-red-500 text-red-500' : 'text-white'
            }`}
          />
        </button>

        {/* Company Logo Badge */}
        {vehicle.company?.logo && (
          <div className="absolute bottom-3 start-3 w-10 h-10 bg-white rounded-lg shadow-sm border border-slate-100 overflow-hidden p-1">
            <OptimizedImage
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
        <Link href={`/cars/${vehicle._id}`}>
          <h3 className="text-lg font-bold text-slate-900 group-hover:text-navy transition-colors line-clamp-1">
            {vehicle.brand} {vehicle.vehicleModel} {vehicle.year}
          </h3>
        </Link>

        {/* Specs Row */}
        <div className="flex items-center gap-4 text-sm text-slate-500">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4 text-turquoise" />
            <span>{vehicle.year}</span>
          </div>
          <div className="flex items-center gap-1">
            <Settings className="w-4 h-4 text-turquoise" />
            <span>{vehicle.specs?.origin || 'GCC'}</span>
          </div>
          <div className="flex items-center gap-1">
            <Gauge className="w-4 h-4 text-turquoise" />
            <span className="capitalize">{vehicle.category.toLowerCase()}</span>
          </div>
        </div>

        {/* Info Badges */}
        <div className="flex flex-wrap gap-2 text-xs">
          {vehicle.specs?.minRentalDays === 1 && !isSale && (
            <div className="flex items-center gap-1 text-green-600 font-medium">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
              <span>{t('oneDayRental')}</span>
            </div>
          )}
          
          {vehicle.specs?.insurance && !isSale && (
            <div className="flex items-center gap-1 text-slate-400">
              <Shield className="w-3.5 h-3.5" />
              <span>{t('insuranceIncluded')}</span>
            </div>
          )}
          
          {vehicle.location && (
            <div className="flex items-center gap-1 text-slate-400">
              <MapPin className="w-3.5 h-3.5" />
              <span>{vehicle.location}</span>
            </div>
          )}
        </div>

        {/* Pricing Section */}
        <div className="pt-3 border-t border-slate-100 space-y-2">
          {/* Daily/Sale Rate */}
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-navy">
                {priceDisplay}
              </span>
              {!isSale && price && <span className="text-sm text-slate-500">/ {t('day')}</span>}
            </div>
            {!isSale && (
              <div className="flex items-center gap-1 text-xs text-slate-400">
                <Gauge className="w-3.5 h-3.5" />
                <span>{dailyMileage} km</span>
              </div>
            )}
            {isSale && vehicle.mileage && (
              <div className="flex items-center gap-1 text-xs text-slate-400">
                <Gauge className="w-3.5 h-3.5" />
                <span>{vehicle.mileage.toLocaleString()} km</span>
              </div>
            )}
          </div>

          {/* Monthly Rate (Rent only) */}
          {!isSale && vehicle.pricing?.monthly && (
            <div className="flex items-baseline justify-between">
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-semibold text-slate-600">
                  {formatPrice(vehicle.pricing.monthly, vehicleCurrency)}
                </span>
                <span className="text-xs text-slate-400">/ {t('month')}</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-slate-400">
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
            aria-label={`Chat with us on WhatsApp about ${vehicle.brand} ${vehicle.vehicleModel}`}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm font-semibold"
          >
            <MessageCircle className="w-4 h-4" />
            <span>WhatsApp</span>
          </a>

          {/* Call */}
          <a
            href={`tel:${phoneNumber}`}
            onClick={(e) => e.stopPropagation()}
            aria-label={`Call us about ${vehicle.brand} ${vehicle.vehicleModel}`}
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
              aria-label="Share this vehicle"
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
                <div className="absolute end-0 bottom-full mb-2 w-48 bg-[var(--surface)] rounded-lg shadow-xl border border-[var(--border)] z-20 overflow-hidden">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(
                        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                          `${process.env.NEXT_PUBLIC_APP_URL}/cars/${vehicle._id}`
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
                        `${process.env.NEXT_PUBLIC_APP_URL}/cars/${vehicle._id}`
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
