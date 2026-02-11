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
                 <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
                     <div>
                         <h2 className="text-3xl font-bold mb-2">SUVs for rent in North Cyprus</h2>
                         <p className="text-muted-foreground max-w-2xl">
                            From spacious 7-seaters to the latest 5-seater sports utility vehicles, rent an SUV for city drives or comfortable long hauls.
                         </p>
                     </div>
                     <Link href="/cars?category=suv">
                         <Button variant="outline">View Offers</Button>
                     </Link>
                 </div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                     {vehicles.map((vehicle, index) => (
                         <motion.div 
                            key={vehicle._id}
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
