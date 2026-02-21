'use client';

import * as React from "react"
import { Link } from "@/navigation"
import { OptimizedImage } from "@/components/ui/OptimizedImage"
import { motion } from "framer-motion"
import { Phone, Check, Gauge, Fuel, Users, Briefcase, MessageCircle, Heart } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { useCurrency } from "@/context/CurrencyContext"
import { CurrencyCode } from "@/lib/currency"
import { useTranslations } from "next-intl"

interface AffordableCarsProps {
    vehicles: any[];
}

export function AffordableCars({ vehicles }: AffordableCarsProps) {
    const { formatPrice } = useCurrency();
    const t = useTranslations('AffordableCars');
    if (!vehicles || vehicles.length === 0) return null;

    return (
        <section className="py-24 bg-gray-50">
            <div className="container mx-auto px-4">
                 <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
                     <div className="space-y-3">
                         <span className="text-gray-400 font-semibold tracking-[0.2em] text-xs uppercase block">{t('overline')}</span>
                         <h2 className="text-3xl md:text-5xl font-heading font-bold text-gray-900">{t('title')}</h2>
                         <p className="text-gray-500 text-base md:text-lg max-w-2xl font-body">{t('description')}</p>
                     </div>
                     <Link href="/cars?category=ECONOMY" className="w-full md:w-auto">
                         <Button variant="outline" className="w-full md:w-auto border-gray-300 text-gray-700 hover:bg-gray-900 hover:text-white hover:border-gray-900 font-semibold px-6 h-11 rounded-xl transition-all">
                             {t('viewAll')}
                         </Button>
                     </Link>
                 </div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                     {vehicles.map((vehicle, index) => (
                         <motion.div 
                            key={vehicle.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -8 }}
                            className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group"
                         >
                            {/* Image Header */}
                            <div className="relative aspect-[4/3] w-full bg-gray-50">
                                <div className="absolute top-4 left-4 z-10 flex gap-2">
                                    <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                                        <Check className="w-3 h-3" /> Best Value
                                    </span>
                                </div>
                                <button className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 hover:bg-white text-gray-400 hover:text-red-500 transition-colors shadow-sm">
                                    <Heart className="w-4 h-4" />
                                </button>
                                
                                <OptimizedImage 
                                    src={vehicle.images?.[0]?.url || '/images/car-placeholder.jpg'} 
                                    alt={`${vehicle.brand} ${vehicle.vehicleModel}`}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            </div>

                            {/* Content */}
                            <div className="p-5 space-y-4">
                                <div>
                                    <h3 className="font-heading font-bold text-xl text-gray-900">{vehicle.brand} {vehicle.vehicleModel}</h3>
                                    <div className="text-gray-400 text-sm mt-1 flex items-center gap-3">
                                        <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {vehicle.seats || 5}</span>
                                        <span className="flex items-center gap-1"><Briefcase className="w-3 h-3" /> {vehicle.luggage || 2}</span>
                                        <span className="flex items-center gap-1"><Fuel className="w-3 h-3" /> {vehicle.fuelType || 'Petrol'}</span>
                                    </div>
                                </div>

                                <div className="flex items-end justify-between border-t border-gray-100 pt-4">
                                    {(() => {
                                        const vehicleCurrency = (vehicle.currency as CurrencyCode) || 'EUR';
                                        return (
                                            <>
                                                <div>
                                                    <span className="text-xs text-gray-400 uppercase font-bold">Daily Rate</span>
                                                    <div className="flex items-baseline gap-1">
                                                        <span className="text-2xl font-bold text-[#0D3B66]">{formatPrice(vehicle.dailyPrice || 35, vehicleCurrency)}</span>
                                                        <span className="text-gray-400 text-sm">/day</span>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <span className="text-xs text-gray-400 uppercase font-bold">Weekly</span>
                                                    <div className="text-sm font-bold text-[#0D3B66]">{formatPrice(vehicle.weeklyPrice || 210, vehicleCurrency)}</div>
                                                </div>
                                            </>
                                        )
                                    })()}
                                </div>

                                <div className="grid grid-cols-2 gap-3 pt-2">
                                    <Button variant="outline" size="sm" className="w-full border-gray-200 hover:border-[#00B4D8] hover:text-[#00B4D8]">
                                        <Phone className="w-4 h-4 mr-2" /> Call
                                    </Button>
                                    <Button size="sm" className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white border-none">
                                        <MessageCircle className="w-4 h-4 mr-2" /> WhatsApp
                                    </Button>
                                </div>
                            </div>
                         </motion.div>
                     ))}
                 </div>
            </div>
        </section>
    )
}
