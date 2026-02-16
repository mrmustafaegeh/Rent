'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { 
  ChevronRight, 
  Star, 
  Calendar,
  Users,
  Settings,
  Fuel,
  Gauge,
  Shield,
  MapPin,
  Clock,
  FileText,
  Check,
  MessageCircle,
  Phone,
  Share2,
  ChevronLeft,
  X,
  Home
} from 'lucide-react';

interface VehicleDetailClientProps {
  vehicle: any;
}

export default function VehicleDetailClient({ vehicle }: VehicleDetailClientProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [calculatedPrice, setCalculatedPrice] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Calculate rental price
  const calculatePrice = () => {
    if (!startDate || !endDate) return;
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    
    if (days <= 0) {
      alert('End date must be after start date');
      return;
    }
    
    // Calculate based on duration
    let price = 0;
    if (days >= 30 && vehicle.pricing.monthly) {
      const months = Math.floor(days / 30);
      const remainingDays = days % 30;
      price = (months * vehicle.pricing.monthly) + (remainingDays * vehicle.pricing.daily);
    } else if (days >= 7 && vehicle.pricing.weekly) {
      const weeks = Math.floor(days / 7);
      const remainingDays = days % 7;
      price = (weeks * vehicle.pricing.weekly) + (remainingDays * vehicle.pricing.daily);
    } else {
      price = days * vehicle.pricing.daily;
    }
    
    setCalculatedPrice(price);
  };

  // WhatsApp & Phone
  const phoneNumber = vehicle.company?.phone || '+971501234567';
  const whatsappMessage = encodeURIComponent(
    `Hi! I'm interested in renting the ${vehicle.brand} ${vehicle.vehicleModel} ${vehicle.year}\n\nDaily Rate: AED ${vehicle.pricing.daily}\n${startDate && endDate ? `\nDates: ${startDate} to ${endDate}` : ''}`
  );
  const whatsappUrl = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}?text=${whatsappMessage}`;

  return (
    <>
      <Header />
      <div className="min-h-screen bg-[var(--background)] pt-20">
      {/* Breadcrumb */}
      <div className="bg-[var(--surface-light)] border-b border-[var(--border)]">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
            <Link href="/" className="hover:text-[var(--primary)] flex items-center gap-1">
              <Home className="w-4 h-4" />
              <span>Home</span>
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/fleet" className="hover:text-[var(--primary)]">
              Fleet
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white font-medium">
              {vehicle.brand} {vehicle.vehicleModel}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images & Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="bg-[var(--surface-light)] rounded-xl overflow-hidden shadow-sm border border-[var(--border)]">
              {/* Main Image */}
              <div 
                className="relative aspect-[16/9] bg-[var(--surface-lighter)] cursor-pointer group"
                onClick={() => setShowLightbox(true)}
              >
                <Image
                  src={vehicle.images[selectedImage]?.url || '/images/car-placeholder.jpg'}
                  alt={`${vehicle.brand} ${vehicle.vehicleModel}`}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 rounded-full p-3 backdrop-blur-sm">
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Thumbnail Gallery */}
              <div className="grid grid-cols-5 gap-2 p-4 bg-[var(--surface)]">
                {vehicle.images.slice(0, 5).map((img: any, index: number) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index
                        ? 'border-[var(--primary)] ring-2 ring-[var(--primary)]/20'
                        : 'border-[var(--border)] hover:border-[var(--text-secondary)]'
                    }`}
                  >
                    <Image
                      src={img.url}
                      alt={`View ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Specifications */}
            <div className="bg-[var(--surface-light)] rounded-xl p-6 shadow-sm border border-[var(--border)]">
              <h2 className="text-2xl font-bold text-white mb-6">Specifications</h2>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 p-4 bg-[var(--surface-lighter)] rounded-xl border border-[var(--border)]">
                  <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-xs text-[var(--text-secondary)]">Year</p>
                    <p className="font-semibold text-white">{vehicle.year}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-[var(--surface-lighter)] rounded-xl border border-[var(--border)]">
                  <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
                    <Settings className="w-5 h-5 text-purple-500" />
                  </div>
                  <div>
                    <p className="text-xs text-[var(--text-secondary)]">Transmission</p>
                    <p className="font-semibold text-white">{vehicle.transmission}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-[var(--surface-lighter)] rounded-xl border border-[var(--border)]">
                  <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-green-500" />
                  </div>
                  <div>
                    <p className="text-xs text-[var(--text-secondary)]">Seats</p>
                    <p className="font-semibold text-white">{vehicle.seats}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-[var(--surface-lighter)] rounded-xl border border-[var(--border)]">
                  <div className="w-10 h-10 bg-orange-500/10 rounded-lg flex items-center justify-center">
                    <Fuel className="w-5 h-5 text-orange-500" />
                  </div>
                  <div>
                    <p className="text-xs text-[var(--text-secondary)]">Fuel Type</p>
                    <p className="font-semibold text-white">{vehicle.fuelType}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-[var(--surface-lighter)] rounded-xl border border-[var(--border)]">
                  <div className="w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center">
                    <Gauge className="w-5 h-5 text-red-500" />
                  </div>
                  <div>
                    <p className="text-xs text-[var(--text-secondary)]">Category</p>
                    <p className="font-semibold text-white">{vehicle.category}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-[var(--surface-lighter)] rounded-xl border border-[var(--border)]">
                  <div className="w-10 h-10 bg-cyan-500/10 rounded-lg flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-cyan-500" />
                  </div>
                  <div>
                    <p className="text-xs text-[var(--text-secondary)]">Origin</p>
                    <p className="font-semibold text-white">
                      {vehicle.specs?.origin || 'GCC'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Features */}
            {vehicle.features && vehicle.features.length > 0 && (
              <div className="bg-[var(--surface-light)] rounded-xl p-6 shadow-sm border border-[var(--border)]">
                <h2 className="text-2xl font-bold text-white mb-6">Features</h2>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {vehicle.features.map((feature: string, index: number) => (
                    <div key={index} className="flex items-center gap-2 text-[var(--text-secondary)]">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Rental Policies */}
            <div className="bg-[var(--surface-light)] rounded-xl p-6 shadow-sm border border-[var(--border)]">
              <h2 className="text-2xl font-bold text-white mb-6">Rental Policies</h2>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-blue-500 mt-0.5" />
                  <div>
                    <p className="font-semibold text-white">Minimum Rental Period</p>
                    <p className="text-sm text-[var(--text-secondary)]">
                      {vehicle.specs?.minRentalDays || 1} day(s)
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-semibold text-white">Insurance</p>
                    <p className="text-sm text-[var(--text-secondary)]">
                      {vehicle.specs?.insurance ? 'Basic insurance included' : 'Not included'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Gauge className="w-5 h-5 text-orange-500 mt-0.5" />
                  <div>
                    <p className="font-semibold text-white">Mileage Limit</p>
                    <p className="text-sm text-[var(--text-secondary)]">
                      {vehicle.mileageLimits?.daily || 250} km per day<br />
                      {vehicle.mileageLimits?.monthly || 4500} km per month
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <FileText className="w-5 h-5 text-purple-500 mt-0.5" />
                  <div>
                    <p className="font-semibold text-white">Required Documents</p>
                    <p className="text-sm text-[var(--text-secondary)]">
                      Valid driving license, Passport/Emirates ID, Credit card for deposit
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <div className="bg-[var(--surface-light)] rounded-xl p-6 shadow-lg sticky top-24 space-y-6 border border-[var(--border)]">
              {/* Title */}
              <div>
                <h1 className="text-2xl font-bold text-white mb-2">
                  {vehicle.brand} {vehicle.vehicleModel}
                </h1>
                <p className="text-[var(--text-secondary)]">{vehicle.year} Rent in Dubai</p>
                
                {/* Rating */}
                {vehicle.company?.rating && (
                  <div className="flex items-center gap-2 mt-3">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(vehicle.company.rating)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-[var(--text-muted)]'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-semibold text-white">
                      {vehicle.company.rating.toFixed(1)}
                    </span>
                    <span className="text-sm text-[var(--text-muted)]">(156 reviews)</span>
                  </div>
                )}
              </div>

              {/* Pricing */}
              <div className="pt-6 border-t border-[var(--border)] space-y-3">
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-3xl font-bold text-white">
                      AED {vehicle.pricing.daily.toLocaleString()}
                    </span>
                    <span className="text-[var(--text-secondary)]"> / day</span>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-[var(--text-muted)]">Mileage</p>
                    <p className="font-semibold text-[var(--text-secondary)]">
                      {vehicle.mileageLimits?.daily || 250} km
                    </p>
                  </div>
                </div>

                {vehicle.pricing.monthly && (
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-xl font-semibold text-[var(--text-secondary)]">
                        AED {vehicle.pricing.monthly.toLocaleString()}
                      </span>
                      <span className="text-[var(--text-muted)] text-sm"> / month</span>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-[var(--text-muted)]">Mileage</p>
                      <p className="font-semibold text-[var(--text-secondary)]">
                        {vehicle.mileageLimits?.monthly || 4500} km
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Date Picker */}
              <div className="pt-6 border-t border-[var(--border)] space-y-4">
                <h3 className="font-semibold text-white">Select Rental Period</h3>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      min={mounted ? new Date().toISOString().split('T')[0] : ""}
                      className="w-full px-4 py-2.5 bg-[var(--surface)] text-white border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      min={startDate || (mounted ? new Date().toISOString().split('T')[0] : "")}
                      className="w-full px-4 py-2.5 bg-[var(--surface)] text-white border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                    />
                  </div>

                  <button
                    onClick={calculatePrice}
                    disabled={!startDate || !endDate}
                    className="w-full py-3 bg-[var(--primary)] hover:bg-[var(--primary)]/90 disabled:bg-[var(--surface-lighter)] disabled:text-[var(--text-muted)] disabled:cursor-not-allowed text-black font-semibold rounded-lg transition-colors"
                  >
                    Calculate Price
                  </button>

                  {calculatedPrice !== null && (
                    <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                      <p className="text-sm text-green-400 mb-1">Total Price</p>
                      <p className="text-2xl font-bold text-green-400">
                        AED {calculatedPrice.toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Contact Buttons */}
              <div className="pt-6 border-t border-[var(--border)] space-y-3">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors shadow-sm"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>WhatsApp</span>
                </a>

                <a
                  href={`tel:${phoneNumber}`}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors shadow-sm"
                >
                  <Phone className="w-5 h-5" />
                  <span>Call Now</span>
                </a>
              </div>

              {/* Company Info */}
              {vehicle.company && (
                <div className="pt-6 border-t border-[var(--border)]">
                  <p className="text-sm font-medium text-[var(--text-muted)] mb-3">Rental Company</p>
                  <div className="flex items-center gap-3">
                    {vehicle.company.logo && (
                      <div className="w-12 h-12 bg-white rounded-lg overflow-hidden flex-shrink-0 p-1">
                        <Image
                          src={vehicle.company.logo}
                          alt={vehicle.company.name}
                          width={48}
                          height={48}
                          className="object-contain"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-white truncate">
                        {vehicle.company.name}
                      </p>
                      {vehicle.company.rating && (
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium text-[var(--text-secondary)]">
                            {vehicle.company.rating.toFixed(1)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Image Lightbox */}
      {showLightbox && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center">
          <button
            onClick={() => setShowLightbox(false)}
            className="absolute top-4 right-4 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          <button
            onClick={() => setSelectedImage(prev => prev === 0 ? vehicle.images.length - 1 : prev - 1)}
            className="absolute left-4 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={() => setSelectedImage(prev => prev === vehicle.images.length - 1 ? 0 : prev + 1)}
            className="absolute right-4 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div className="relative w-full max-w-6xl aspect-video px-12">
            <Image
              src={vehicle.images[selectedImage]?.url || ''}
              alt={`${vehicle.brand} ${vehicle.vehicleModel}`}
              fill
              className="object-contain"
            />
          </div>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
            {vehicle.images.map((_: any, index: number) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  selectedImage === index ? 'bg-white' : 'bg-white/40'
                }`}
              />
            ))}
          </div>
        </div>
      )}
      </div>
      <Footer />
    </>
  );
}
