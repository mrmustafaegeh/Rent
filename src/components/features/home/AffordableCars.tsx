'use client';

import { VehicleCard, VehicleCardProps } from "@/components/features/vehicle/VehicleCard"
import { Button } from "@/components/ui/Button"
import Link from "next/link"
import { motion } from "framer-motion"

interface AffordableCarsProps {
    vehicles: VehicleCardProps['vehicle'][]
}

export function AffordableCars({ vehicles }: AffordableCarsProps) {
    if (!vehicles || vehicles.length === 0) return null;

    return (
        <section className="py-16 bg-background">
            <div className="container mx-auto px-4">
                 <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
                     <div>
                         <h2 className="text-3xl font-bold mb-2">Affordable Car Rental North Cyprus</h2>
                         <p className="text-muted-foreground max-w-2xl">
                            Enjoy budget-friendly car rentals starting from €30/day with seasonal discounts from some of the best car rental North Cyprus companies.
                         </p>
                     </div>
                     <Link href="/cars?category=economy">
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
