'use client';

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/Button"
import { MapPin, ArrowRight } from "lucide-react"

const locations = [
    {
        name: "Kyrenia (Girne)",
        count: "120+ Cars",
        image: "/images/kyrenia-thumb.png",
        slug: "kyrenia",
        description: "Coastal Paradise",
        colSpan: "md:col-span-2 lg:col-span-2",
    },
    {
        name: "Nicosia (Lefkoşa)",
        count: "150+ Cars",
        image: "/images/nicosia-thumb.png",
        slug: "nicosia",
        description: "Capital & Business Hub",
        colSpan: "md:col-span-1 lg:col-span-1",
    },
    {
        name: "Famagusta (Gazimağusa)",
        count: "90+ Cars",
        image: "/images/hero-bg-cyprus.png", // Using hero image as fallback for now
        slug: "famagusta",
        description: "Historic Eastern Coast",
        colSpan: "md:col-span-1 lg:col-span-1",
    },
    {
        name: "Ercan Airport",
        count: "200+ Cars",
        image: "/images/hero-bg-cyprus.png", // Using hero image as fallback
        slug: "ercan-airport",
        description: "Instant Pickup",
        badge: "Most Popular",
        colSpan: "md:col-span-3 lg:col-span-4", // Full width or large
    }
]

export function LocationGrid() {
    return (
        <section className="py-24 bg-white">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                     <div className="space-y-4">
                         <span className="text-electric font-bold tracking-[0.2em] text-xs uppercase block">DESTINATIONS</span>
                         <h2 className="text-4xl md:text-5xl font-heading font-bold text-navy">Explore North Cyprus</h2>
                         <p className="text-gray-500 text-lg max-w-2xl font-body">Rent cars in major cities and tourist destinations across the island.</p>
                     </div>
                     <Link href="/locations">
                         <Button variant="ghost" className="text-navy hover:text-electric font-bold group">
                             All Locations <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                         </Button>
                     </Link>
                 </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-[300px]">
                    {locations.map((loc, index) => (
                        <motion.div 
                            key={loc.slug} 
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className={`group relative rounded-3xl overflow-hidden shadow-lg cursor-pointer ${loc.colSpan || ''}`}
                        >
                            <Image 
                                src={loc.image}
                                alt={loc.name}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/20 to-transparent group-hover:opacity-90 transition-opacity duration-300" />
                            
                            {loc.badge && (
                                <div className="absolute top-4 right-4 bg-gold text-navy text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                                    {loc.badge}
                                </div>
                            )}

                            <div className="absolute bottom-0 left-0 w-full p-8 text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                <div className="flex items-center gap-2 mb-2 bg-white/20 backdrop-blur-sm w-fit px-3 py-1 rounded-full border border-white/10">
                                    <MapPin className="w-3 h-3 text-gold" />
                                    <span className="text-xs font-bold uppercase tracking-wide">{loc.description}</span>
                                </div>
                                <h3 className="text-3xl font-heading font-bold mb-2 group-hover:text-gold transition-colors">{loc.name}</h3>
                                <div className="flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                                    <span className="text-white/80 font-medium">{loc.count} Available</span>
                                    <Link href={`/locations/${loc.slug}`}>
                                        <Button size="sm" className="bg-white text-navy hover:bg-gold hover:text-navy font-bold rounded-full">
                                            View Cars
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
