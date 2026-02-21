'use client';

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/Button"
import { MapPin, ArrowRight } from "lucide-react"
import { useTranslations } from "next-intl"

export function LocationGrid() {
    const t = useTranslations('LocationGrid');
    
    const locations = [
        {
            name: t('locations.kyrenia.name'),
            count: t('premiumCars', { count: 120 }),
            image: "/images/kyrenia-new.png",
            slug: "kyrenia",
            description: t('locations.kyrenia.desc'),
            colSpan: "md:col-span-2 lg:col-span-2",
        },
        {
            name: t('locations.nicosia.name'),
            count: t('premiumCars', { count: 150 }),
            image: "/images/nicosia-new.png",
            slug: "nicosia",
            description: t('locations.nicosia.desc'),
            colSpan: "md:col-span-1 lg:col-span-1",
        },
        {
            name: t('locations.famagusta.name'),
            count: t('premiumCars', { count: 90 }),
            image: "/images/famagusta-new.png", 
            slug: "famagusta",
            description: t('locations.famagusta.desc'),
            colSpan: "md:col-span-1 lg:col-span-1",
        },
        {
            name: t('locations.ercan.name'),
            count: t('premiumCars', { count: 200 }),
            image: "https://images.unsplash.com/photo-1542296332-2e4473faf563?q=80&w=1200&auto=format&fit=crop", 
            slug: "ercan-airport",
            description: t('locations.ercan.desc'),
            badge: t('badgePopular'),
            colSpan: "md:col-span-3 lg:col-span-4", // Full width or large
        }
    ]

    return (
        <section className="py-32 bg-white relative overflow-hidden">
            {/* Subtle background pattern or element */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-navy/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
                     <div className="space-y-4">
                         <span className="text-gold font-black tracking-[0.4em] text-[10px] uppercase block">{t('overline')}</span>
                         <h2 className="text-3xl sm:text-5xl md:text-6xl font-heading font-black text-navy leading-tight" dangerouslySetInnerHTML={{ __html: t.rich('title', { br: () => '<br class="md:hidden" />' }) as string }} />
                         <p className="text-gray-500 text-base md:text-lg max-w-2xl font-body font-medium">{t('description')}</p>
                     </div>
                     <Link href="/locations" className="w-full md:w-auto">
                         <Button variant="outline" className="w-full md:w-auto border-navy/10 text-navy hover:bg-navy hover:text-white font-black px-8 h-14 rounded-full group transition-all">
                             {t('exploreAll')} <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                         </Button>
                     </Link>
                 </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 auto-rows-[300px] md:auto-rows-[350px]">
                    {locations.map((loc, index) => (
                        <motion.div 
                            key={loc.slug} 
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ delay: index * 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                            className={`group relative rounded-3xl md:rounded-[2.5rem] overflow-hidden shadow-2xl cursor-pointer ${loc.colSpan || ''} border border-black/5 hover:border-gold/20 transition-all duration-500`}
                        >
                            <Link href={`/cars?location=${loc.slug}`} className="block h-full w-full relative">
                                <Image 
                                    src={loc.image}
                                    alt={loc.name}
                                    fill
                                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-navy/95 via-navy/30 to-transparent group-hover:via-navy/50 transition-all duration-500" />
                                
                                {loc.badge && (
                                    <div className="absolute top-4 right-4 md:top-6 md:right-6 bg-gold text-navy text-[10px] font-black uppercase tracking-widest px-3 py-1.5 md:px-4 md:py-2 rounded-full shadow-2xl z-20 ring-1 ring-white/20">
                                        {loc.badge}
                                    </div>
                                )}
 
                                <div className="absolute bottom-0 left-0 w-full p-6 md:p-10 text-white transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                                    <div className="flex items-center gap-2 mb-3 md:mb-4 bg-white/10 backdrop-blur-md w-fit px-3 py-1 md:px-4 md:py-1.5 rounded-full border border-white/10">
                                        <MapPin className="w-3 md:w-3.5 h-3 md:h-3.5 text-gold" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-white/90">{loc.description}</span>
                                    </div>
                                    <h3 className="text-2xl md:text-3xl lg:text-4xl font-heading font-black mb-4 group-hover:text-gold transition-colors leading-tight">{loc.name}</h3>
                                    
                                    <div className="flex items-center justify-between opacity-0 md:group-hover:opacity-100 transition-all duration-500 delay-100 transform translate-y-4 group-hover:translate-y-0">
                                        <div className="flex flex-col">
                                            <span className="text-gold font-black text-[10px] md:text-xs uppercase tracking-tighter">{t('availableFleet')}</span>
                                            <span className="text-white/70 text-xs md:text-sm font-bold">{loc.count}</span>
                                        </div>
                                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gold flex items-center justify-center shadow-lg shadow-gold/20 group-hover:shadow-gold/40 transition-all">
                                            <ArrowRight className="w-5 h-5 md:w-6 md:h-6 text-navy" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
