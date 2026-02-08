'use client';

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/Button"

const locations = [
    {
        name: "Kyrenia (Girne)",
        count: "120+ Cars",
        image: "/images/kyrenia-thumb.png",
        slug: "kyrenia",
        description: "Coastal tourist destination, historic harbor"
    },
    {
        name: "Ercan Airport",
        count: "200+ Cars",
        image: "/images/hero-bg.png", // Fallback for now due to capacity
        slug: "ercan-airport",
        description: "Primary airport, convenient pickup"
    },
    {
        name: "Nicosia (Lefkoşa)",
        count: "150+ Cars",
        image: "/images/nicosia-thumb.png",
        slug: "nicosia",
        description: "Capital city, main business hub"
    },
    {
        name: "Famagusta (Gazimağusa)",
        count: "90+ Cars",
        image: "/images/nicosia-thumb.png", // Fallback
        slug: "famagusta",
        description: "Eastern coastal city, ancient walled city"
    }
]

export function LocationGrid() {
    return (
        <section className="py-20 bg-background">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                     <h2 className="text-3xl font-bold mb-4">Find car rental services near you in North Cyprus</h2>
                     <p className="text-muted-foreground">Convenient locations across the island</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {locations.map((loc, index) => (
                        <div key={loc.slug} className="group relative rounded-xl overflow-hidden aspect-[4/5] shadow-lg">
                            <Image 
                                src={loc.image}
                                alt={loc.name}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                            
                            <div className="absolute bottom-0 left-0 w-full p-6 text-white">
                                <h3 className="text-2xl font-bold mb-1">{loc.name}</h3>
                                <p className="text-white/80 text-sm mb-4">{loc.count}</p>
                                <Link href={`/locations/${loc.slug}`}>
                                    <Button className="w-full bg-white/20 hover:bg-white text-white hover:text-black backdrop-blur-md border border-white/30 transition-colors">
                                        View Cars
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
