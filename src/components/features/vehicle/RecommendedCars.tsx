'use client';

import { VehicleCard, VehicleCardProps } from "@/components/features/vehicle/VehicleCard"
import { motion } from "framer-motion"

interface RecommendedCarsProps {
    vehicles: VehicleCardProps['vehicle'][]
}

export function RecommendedCars({ vehicles }: RecommendedCarsProps) {
    if (!vehicles || vehicles.length === 0) return null;

    return (
        <section className="py-12 border-t mt-12">
             <h2 className="text-2xl font-bold mb-6">You might also like</h2>
             
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
        </section>
    )
}
