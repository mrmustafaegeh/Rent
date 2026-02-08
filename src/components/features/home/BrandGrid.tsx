'use client';

import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/Button"

const brands = [
  "Mercedes-Benz", "BMW", "Land Rover", "Kia", "Nissan", "Lamborghini",
  "Porsche", "Toyota", "Rolls Royce", "Ferrari", "Tesla", "Jeep",
  "Audi", "Hyundai", "Renault", "Volkswagen"
]

export function BrandGrid() {
  return (
    <section className="py-16 bg-muted/20">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-2">All Brands Available</h2>
        <p className="text-muted-foreground mb-12">Browse our extensive fleet from trusted manufacturers</p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 mb-10">
          {brands.map((brand, index) => (
            <Link href={`/brands/${brand.toLowerCase().replace(' ', '-')}`} key={brand}>
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="flex flex-col items-center justify-center p-6 bg-white dark:bg-card border rounded-xl shadow-sm hover:shadow-md transition-all h-32 gap-3"
              >
                <div className="relative w-12 h-12 flex items-center justify-center">
                   <img 
                      src={`https://logo.clearbit.com/${brand.toLowerCase().replace(/\s+/g, '')}.com?size=100`} 
                      alt={brand} 
                      className="object-contain w-full h-full opacity-80 hover:opacity-100 transition-opacity"
                      onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.parentElement?.querySelector('.fallback-text')?.classList.remove('hidden');
                      }}
                   />
                   <span className="fallback-text hidden text-xl font-bold text-muted-foreground">{brand.charAt(0)}</span>
                </div>
                <span className="font-medium text-sm text-center">{brand}</span>
              </motion.div>
            </Link>
          ))}
        </div>
        
        <Link href="/brands">
            <Button variant="outline" size="lg">View More Brands</Button>
        </Link>
      </div>
    </section>
  )
}
