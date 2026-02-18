'use client';

import { VehicleCard, VehicleCardProps } from "@/components/features/vehicle/VehicleCard"
import { Button } from "@/components/ui/Button"
import Link from "next/link"
import { motion } from "framer-motion"

interface SUVShowcaseProps {
    vehicles: VehicleCardProps['vehicle'][]
}

export function SUVShowcase({ vehicles }: SUVShowcaseProps) {
    if (!vehicles || vehicles.length === 0) return null;

    return (
        <section className="py-16 bg-muted/30">
            <div className="container mx-auto px-4">
                 <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 gap-6">
                     <div className="space-y-4">
                         <span className="text-gray-400 font-bold tracking-[0.2em] text-xs uppercase block">SPACIOUS & POWERFUL</span>
                         <h2 className="text-3xl md:text-4xl font-heading font-black text-navy uppercase tracking-tight">SUVs for rent</h2>
                         <p className="text-gray-500 text-base md:text-lg max-w-2xl font-body">
                            From spacious 7-seaters to the latest 5-seater sports utility vehicles, rent an SUV for city drives or comfortable long hauls.
                         </p>
                     </div>
                     <Link href="/cars?category=suv" className="w-full sm:w-auto">
                         <Button variant="outline" className="w-full sm:w-auto border-navy text-navy hover:bg-navy hover:text-white font-black px-8 h-12 rounded-xl transition-all uppercase tracking-widest text-xs">View Offers</Button>
                     </Link>
                 </div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                     {vehicles.map((vehicle, index) => (
                         <motion.div 
                            key={vehicle.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                         >
                            <VehicleCard vehicle={vehicle} />
                         </motion.div>
                     ))}
                 </div>
            </div>
        </section>
    )
}
