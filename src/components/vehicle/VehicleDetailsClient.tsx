'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ShareButtons from '@/components/ui/ShareButtons';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/context/AuthContext';
import ReviewsSection from '@/components/vehicle/ReviewsSection';
import { 
    Calendar, 
    Shield, 
    Zap, 
    Info, 
    CheckCircle,
    Fuel,
    Users,
    Settings,
    Gauge,
    Star,
    ChevronRight,
    MapPin
} from 'lucide-react';
import { useCurrency } from '@/context/CurrencyContext';
import { CurrencyCode } from '@/lib/currency';
import { useTranslations } from 'next-intl';

interface Vehicle {
  id: string;
  brand: string;
  vehicleModel: string;
  year: number;
  category: string;
  dailyPrice: number;
  currency?: string;
  transmission: string;
  fuelType: string;
  seats: number;
  description?: string;
  features?: string[];
  images: { url: string; isPrimary: boolean }[];
  owner?: {
      name: string;
  }
}

interface VehicleDetailsClientProps {
    vehicle: Vehicle;
}

export default function VehicleDetailsClient({ vehicle }: VehicleDetailsClientProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { formatPrice } = useCurrency();
  const t = useTranslations('VehicleDetails');
  const vehicleCurrency = (vehicle.currency as CurrencyCode) || 'EUR';
  
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Calculate total price effect
  useEffect(() => {
    if (startDate && endDate && vehicle) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffTime = end.getTime() - start.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays > 0) {
            setTotalPrice(diffDays * vehicle.dailyPrice);
        } else {
             setTotalPrice(0);
        }
    } else {
        setTotalPrice(0);
    }
  }, [startDate, endDate, vehicle]);

  const handleBooking = async () => {
    if (!startDate || !endDate) return;

    if (!isAuthenticated) {
        // Prepare redirect URL with booking params so they aren't lost
        const callbackUrl = `/vehicles/${vehicle.id}`; // Ideally pass params too but simple redirect for now
        router.push(`/auth/login?redirect=${encodeURIComponent(callbackUrl)}`);
        return;
    }

    // Redirect to checkout with params
    const query = new URLSearchParams({
        vehicleId: vehicle.id,
        startDate,
        endDate
    }).toString();

    router.push(`/checkout?${query}`);
  };

  const features = vehicle.features || [
      'Leather Interior', 'Navigation System', 'Bluetooth', 'Climate Control', 'Premium Sound'
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      
      <main className="flex-1 pt-24 pb-20">
        <div className="container mx-auto px-4 lg:px-8">
            {/* Breadcrumb */}
            <nav className="flex items-center text-sm font-medium text-gray-400 mb-8 space-x-2">
                <Link href="/" className="hover:text-navy transition-colors">{t('breadcrumb.home')}</Link>
                <ChevronRight className="w-4 h-4" />
                <Link href="/cars" className="hover:text-navy transition-colors">{t('breadcrumb.fleet')}</Link>
                <ChevronRight className="w-4 h-4" />
                <span className="text-navy font-bold">{vehicle.brand} {vehicle.vehicleModel}</span>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                
                {/* Left Column: Gallery & Details */}
                <div className="lg:col-span-8 space-y-12">
                     {/* Gallery */}
                    <div className="space-y-4">
                        <div className="relative h-[400px] md:h-[500px] w-full bg-gray-200 rounded-3xl overflow-hidden shadow-2xl">
                             {vehicle.images?.[activeImageIndex]?.url ? (
                                <Image 
                                    src={vehicle.images[activeImageIndex].url} 
                                    alt={`${vehicle.brand} ${vehicle.vehicleModel}`}
                                    fill
                                    className="object-cover"
                                    priority
                                />
                             ) : (
                                <div className="flex items-center justify-center h-full text-gray-400">{t('noImage')}</div>
                             )}
                             <div className="absolute top-4 left-4">
                                 <span className="bg-navy/90 backdrop-blur-md text-gold px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border border-white/10 shadow-lg">
                                     {t(`categories.${vehicle.category}`, { default: vehicle.category })} {t('class')}
                                 </span>
                             </div>
                        </div>
                        
                        {/* Thumbnails */}
                        {vehicle.images?.length > 1 && (
                            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                                {vehicle.images.map((img, idx) => (
                                    <button 
                                        key={idx}
                                        onClick={() => setActiveImageIndex(idx)}
                                        className={`relative w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                                            activeImageIndex === idx ? 'border-navy scale-105 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'
                                        }`}
                                    >
                                        <Image 
                                            src={img.url} 
                                            alt={`${t('view')} ${idx + 1}`}
                                            fill
                                            className="object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Specs & Description */}
                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 border-b border-gray-100 pb-8">
                             <div>
                                 <h1 className="text-3xl md:text-4xl font-heading font-black text-navy mb-2">
                                     {vehicle.brand} <span className="text-electric">{vehicle.vehicleModel}</span>
                                 </h1>
                                 <div className="flex items-center gap-4 text-sm font-bold text-gray-500">
                                     <span className="flex items-center gap-1"><Calendar className="w-4 h-4 text-gold" /> {vehicle.year}</span>
                                     <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                     <span className="flex items-center gap-1"><MapPin className="w-4 h-4 text-gold" /> Kyrenia Branch</span>
                                 </div>
                             </div>
                             <div className="flex flex-col items-end">
                                 <p className="text-3xl font-black text-navy">{formatPrice(vehicle.dailyPrice, vehicleCurrency)}</p>
                                 <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{t('perDay')}</p>
                             </div>
                        </div>

                        {/* Quick Specs Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
                             <div className="flex flex-col items-center p-4 bg-gray-50 rounded-2xl border border-gray-100 group hover:border-navy/20 transition-colors">
                                 <Settings className="w-6 h-6 text-navy mb-2 group-hover:scale-110 transition-transform" />
                                 <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{t('transmission')}</span>
                                 <span className="font-bold text-navy">{t(`transmissions.${vehicle.transmission}`, { default: vehicle.transmission })}</span>
                             </div>
                             <div className="flex flex-col items-center p-4 bg-gray-50 rounded-2xl border border-gray-100 group hover:border-navy/20 transition-colors">
                                 <Fuel className="w-6 h-6 text-navy mb-2 group-hover:scale-110 transition-transform" />
                                 <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{t('fuelType')}</span>
                                 <span className="font-bold text-navy">{t(`fuelTypes.${vehicle.fuelType}`, { default: vehicle.fuelType })}</span>
                             </div>
                             <div className="flex flex-col items-center p-4 bg-gray-50 rounded-2xl border border-gray-100 group hover:border-navy/20 transition-colors">
                                 <Users className="w-6 h-6 text-navy mb-2 group-hover:scale-110 transition-transform" />
                                 <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{t('seats')}</span>
                                 <span className="font-bold text-navy">{vehicle.seats} {t('persons')}</span>
                             </div>
                             <div className="flex flex-col items-center p-4 bg-gray-50 rounded-2xl border border-gray-100 group hover:border-navy/20 transition-colors">
                                 <Gauge className="w-6 h-6 text-navy mb-2 group-hover:scale-110 transition-transform" />
                                 <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{t('mileage')}</span>
                                 <span className="font-bold text-navy">{t('unlimited')}</span>
                             </div>
                        </div>

                        <div className="space-y-6">
                            <h3 className="text-xl font-bold text-navy">{t('featuresTitle')}</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {features.map((feature, i) => (
                                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                                        <div className="w-6 h-6 rounded-full bg-electric/10 flex items-center justify-center text-electric shrink-0">
                                            <CheckCircle className="w-3.5 h-3.5" />
                                        </div>
                                        <span className="text-gray-600 font-medium text-sm">{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                         <div className="mt-10 pt-10 border-t border-gray-100">
                            <h3 className="text-xl font-bold text-navy mb-4">{t('descriptionTitle')}</h3>
                            <p className="text-gray-500 leading-relaxed text-sm">
                                {vehicle.description || t('defaultDescription', { brand: vehicle.brand, model: vehicle.vehicleModel })}
                            </p>
                        </div>
                    </div>
                    
                    {/* Reviews */}
                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                        <ReviewsSection vehicleId={vehicle.id} />
                    </div>
                </div>

                {/* Right Column: Booking Card (Sticky) */}
                <div className="lg:col-span-4">
                    <div className="sticky top-24 space-y-6">
                        <div className="bg-navy rounded-3xl p-8 text-white shadow-2xl shadow-navy/20">
                             <div className="mb-6">
                                 <h3 className="text-2xl font-heading font-black text-white mb-2">{t('reserveTitle')}</h3>
                                 <p className="text-gray-400 text-sm">{t('reserveDesc')}</p>
                             </div>

                             <div className="space-y-4 mb-8">
                                 <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                                    <label className="block text-xs font-bold text-gold uppercase tracking-wider mb-2 text-left">{t('pickupDate')}</label>
                                    <Input 
                                        type="date" 
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        min={mounted ? new Date().toISOString().split('T')[0] : ""}
                                        className="bg-navy text-white border-white/20 focus:border-gold h-10 text-sm"
                                    />
                                 </div>
                                 <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                                    <label className="block text-xs font-bold text-gold uppercase tracking-wider mb-2 text-left">{t('dropoffDate')}</label>
                                    <Input 
                                        type="date" 
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        min={startDate || (mounted ? new Date().toISOString().split('T')[0] : "")}
                                        className="bg-navy text-white border-white/20 focus:border-gold h-10 text-sm"
                                    />
                                 </div>
                             </div>

                             {startDate && endDate && totalPrice > 0 && (
                                 <div className="bg-white/10 rounded-xl p-4 mb-6 border border-white/5 animate-in fade-in slide-in-from-bottom-2">
                                     <div className="flex justify-between items-center mb-2">
                                         <span className="text-gray-300 text-sm">{t('rate')}</span>
                                         <span className="font-bold">{formatPrice(vehicle.dailyPrice, vehicleCurrency)} x {Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24))} {t('days')}</span>
                                     </div>
                                     <div className="flex justify-between items-center text-sm mb-4">
                                         <span className="text-gray-300">{t('taxes')}</span>
                                         <span className="font-bold">{t('included')}</span>
                                     </div>
                                     <div className="h-px bg-white/20 my-2"></div>
                                     <div className="flex justify-between items-center">
                                         <span className="text-gold font-bold uppercase tracking-wider text-xs">{t('total')}</span>
                                         <span className="text-2xl font-black text-white">{formatPrice(totalPrice, vehicleCurrency)}</span>
                                     </div>
                                 </div>
                             )}

                             <Button 
                                size="lg" 
                                className="w-full bg-gold text-navy hover:bg-white hover:text-navy font-black h-14 rounded-xl text-lg shadow-lg shadow-gold/20 transition-all transform hover:scale-[1.02]" 
                                onClick={handleBooking} 
                                disabled={!startDate || !endDate}
                             >
                                 <Zap className="w-5 h-5 mr-2 fill-current" />
                                 {isAuthenticated ? t('proceed') : t('loginToBook')}
                             </Button>
                             
                             <p className="text-center text-xs text-gray-500 mt-4 font-medium">
                                 {t('notCharged')}
                             </p>
                        </div>

                        {/* Trust Badges */}
                        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
                             <div className="flex items-center gap-4">
                                 <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                                     <Shield className="w-5 h-5" />
                                 </div>
                                 <div>
                                     <h4 className="font-bold text-navy text-sm">{t('badges.insurance.title')}</h4>
                                     <p className="text-xs text-gray-400">{t('badges.insurance.desc')}</p>
                                 </div>
                             </div>
                             <div className="flex items-center gap-4">
                                 <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                                     <CheckCircle className="w-5 h-5" />
                                 </div>
                                 <div>
                                     <h4 className="font-bold text-navy text-sm">{t('badges.cancellation.title')}</h4>
                                     <p className="text-xs text-gray-400">{t('badges.cancellation.desc')}</p>
                                 </div>
                             </div>
                             <div className="flex items-center gap-4">
                                 <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 shrink-0">
                                     <Settings className="w-5 h-5" />
                                 </div>
                                 <div>
                                     <h4 className="font-bold text-navy text-sm">{t('badges.support.title')}</h4>
                                     <p className="text-xs text-gray-400">{t('badges.support.desc')}</p>
                                 </div>
                             </div>
                        </div>

                        {/* Share */}
                        <div className="bg-white rounded-2xl p-6 border border-gray-100 text-center">
                             <h4 className="font-bold text-navy text-sm mb-4 uppercase tracking-wider">{t('shareTitle')}</h4>
                             <div className="flex justify-center">
                                <ShareButtons 
                                    vehicle={{ 
                                        id: vehicle.id, 
                                        brand: vehicle.brand, 
                                        vehicleModel: vehicle.vehicleModel 
                                    }} 
                                    variant="inline"
                                />
                             </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
