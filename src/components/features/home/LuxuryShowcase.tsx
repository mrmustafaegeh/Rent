'use client';

import * as React from "react"
import { Link } from "@/navigation"
import Image from "next/image"
import { motion } from "framer-motion"
import { Phone, Heart, Fuel, Gauge, ArrowRight, ArrowLeft, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { useCurrency } from "@/context/CurrencyContext"
import { CurrencyCode } from "@/lib/currency"

// Define interface locally to avoid dependency issues if VehicleCardProps changes
interface Vehicle {
    _id: string;
    brand: string;
    vehicleModel: string;
    year: number;
    category: string;
    images: { url: string }[];
    pricing: {
        daily: number;
        weekly: number;
        monthly: number;
    };
    fuelType: string;
    seats: number;
    currency?: string;
}

interface LuxuryShowcaseProps {
    vehicles: any[]; // Using any to be safe with incoming data structure, will cast in component
}

import { useTranslations } from 'next-intl';

export function LuxuryShowcase({ vehicles }: LuxuryShowcaseProps) {
    const scrollRef = React.useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = React.useState(false);
    const [canScrollRight, setCanScrollRight] = React.useState(true);
    const { formatPrice } = useCurrency();
    const t = useTranslations('LuxuryShowcase');
    const tCommon = useTranslations('Common');

    const checkScroll = () => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
            setCanScrollLeft(scrollLeft > 0);
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
        }
    };

    React.useEffect(() => {
        checkScroll();
        window.addEventListener('resize', checkScroll);
        return () => window.removeEventListener('resize', checkScroll);
    }, [vehicles]);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const scrollAmount = 450; // Card width + gap
            const newScrollLeft = direction === 'left' 
                ? scrollRef.current.scrollLeft - scrollAmount 
                : scrollRef.current.scrollLeft + scrollAmount;
            
            scrollRef.current.scrollTo({
                left: newScrollLeft,
                behavior: 'smooth'
            });
            setTimeout(checkScroll, 300);
        }
    };

    if (!vehicles || vehicles.length === 0) return null;

    return (
        <section className="py-24 bg-navy relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10 pointer-events-none" 
                 style={{ 
                     backgroundImage: 'linear-gradient(45deg, #0A1628 25%, transparent 25%, transparent 75%, #0A1628 75%, #0A1628), linear-gradient(45deg, #0A1628 25%, transparent 25%, transparent 75%, #0A1628 75%, #0A1628)',
                     backgroundSize: '20px 20px',
                     backgroundPosition: '0 0, 10px 10px'
                 }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-navy via-transparent to-navy pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                 <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 gap-6">
                     <div className="space-y-4">
                         <span className="text-gold font-bold tracking-[0.2em] text-xs uppercase block">{t('tagline')}</span>
                         <h2 className="text-4xl md:text-5xl font-heading font-bold text-white">{t('title')}</h2>
                         <p className="text-gray-400 text-lg max-w-2xl font-body">{t('description')}</p>
                     </div>
                     
                     <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                         <div className="flex gap-2">
                             <Button 
                                variant="outline" 
                                size="icon" 
                                onClick={() => scroll('left')}
                                disabled={!canScrollLeft}
                                className="rounded-full w-10 h-10 md:w-12 md:h-12 border-white/10 bg-white/5 hover:bg-gold hover:border-gold hover:text-navy text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                             >
                                 <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
                             </Button>
                             <Button 
                                variant="outline" 
                                size="icon" 
                                onClick={() => scroll('right')}
                                disabled={!canScrollRight}
                                className="rounded-full w-10 h-10 md:w-12 md:h-12 border-white/10 bg-white/5 hover:bg-gold hover:border-gold hover:text-navy text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                             >
                                 <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
                             </Button>
                         </div>
                         <Link href="/cars?category=luxury" className="shrink-0">
                             <Button className="bg-gold text-navy hover:bg-white hover:text-navy font-bold px-5 h-11 md:px-6 md:h-12 rounded-full transition-all text-sm md:text-base">
                                 {t('viewAll')}
                             </Button>
                         </Link>
                     </div>
                 </div>
                 
                 {/* Carousel */}
                 <div 
                    ref={scrollRef}
                    onScroll={checkScroll}
                    className="flex overflow-x-auto gap-6 pb-12 snap-x snap-mandatory hide-scrollbar -mx-4 px-4 md:mx-0 md:px-0"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                 >
                     {vehicles.map((vehicle, index) => (
                         <motion.div 
                            key={vehicle._id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="flex-none w-[340px] md:w-[420px] snap-center"
                         >
                             <div className="bg-white/5 backdrop-blur-[20px] border border-white/10 rounded-2xl overflow-hidden group hover:border-gold/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_10px_40px_rgba(0,0,0,0.4)]">
                                 {/* Image Area */}
                                 <div className="relative aspect-[3/2] w-full overflow-hidden">
                                     {(() => {
                                         const vehicleCurrency = (vehicle.currency as CurrencyCode) || 'EUR';
                                         return (
                                             <>
                                                 <Image 
                                                    src={vehicle.images?.[0]?.url || '/images/car-placeholder.jpg'} 
                                                    alt={`${vehicle.brand} ${vehicle.vehicleModel}`}
                                                    fill
                                                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                                                 />
                                                 <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                                                 
                                                 <button className="absolute top-4 right-4 p-2 rounded-full bg-black/40 text-white hover:bg-gold hover:text-navy transition-colors backdrop-blur-md">
                                                     <Heart className="w-5 h-5" />
                                                 </button>
            
                                                 <div className="absolute bottom-4 left-4 right-4">
                                                     <h3 className="font-heading font-bold text-2xl text-white mb-1">{vehicle.brand} {vehicle.vehicleModel}</h3>
                                                 </div>
                                             </>
                                         )
                                     })()}
                                 </div>
            
                                 {/* Content */}
                                 <div className="p-6 space-y-6">
                                     {/* Pricing Grid */}
                                     {(() => {
                                         const vehicleCurrency = (vehicle.currency as CurrencyCode) || 'EUR';
                                         return (
                                             <div className="grid grid-cols-2 gap-4">
                                                 <div className="bg-white/5 rounded-xl p-3 text-center border border-white/5">
                                                     <span className="block text-gold font-bold text-xl">{vehicle.pricing?.daily ? formatPrice(vehicle.pricing.daily, vehicleCurrency) : t('poa')}</span>
                                                     <span className="text-gray-400 text-xs uppercase tracking-wider">{t('perDay')}</span>
                                                 </div>
                                                 <div className="bg-white/5 rounded-xl p-3 text-center border border-white/5">
                                                     <span className="block text-white font-bold text-xl">{vehicle.pricing?.monthly ? formatPrice(vehicle.pricing.monthly, vehicleCurrency) : t('poa')}</span>
                                                     <span className="text-gray-400 text-xs uppercase tracking-wider">{t('perMonth')}</span>
                                                 </div>
                                             </div>
                                         )
                                     })()}

                                      {/* Specs */}
                                     <div className="flex justify-between items-center text-gray-400 text-sm px-2">
                                         <div className="flex items-center gap-2">
                                             <Gauge className="w-4 h-4 text-gold" />
                                             <span>250 km/{t('dayAbbr')}</span>
                                         </div>
                                         <div className="flex items-center gap-2">
                                             <Fuel className="w-4 h-4 text-gold" />
                                             <span>{vehicle.fuelType || 'Petrol'}</span>
                                         </div>
                                     </div>

                                     {/* Actions */}
                                     <div className="flex gap-3 pt-2">
                                         <Button variant="outline" className="flex-1 border-gold text-gold hover:bg-gold hover:text-navy bg-transparent h-12 font-bold">
                                             <Phone className="w-4 h-4 mr-2" /> {t('call')}
                                         </Button>
                                         <Button className="flex-1 bg-green-600 hover:bg-green-700 text-white border-none h-12 font-bold">
                                             <MessageCircle className="w-4 h-4 mr-2" /> {t('whatsapp')}
                                         </Button>
                                     </div>
                                 </div>
                             </div>
                         </motion.div>
                     ))}
                 </div>
            </div>
        </section>
    )
}
