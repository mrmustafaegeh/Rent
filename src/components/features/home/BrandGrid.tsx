'use client';

import { motion } from "framer-motion"
import Link from "next/link"
import { BrandIcon } from "./BrandIcon"
import { useTranslations } from "next-intl"

const brands = [
  "Mercedes-Benz", "BMW", "Audi", "Land Rover", 
  "Porsche", "Ferrari", "Lamborghini", "Rolls Royce",
  "Tesla", "Toyota", "Kia", "Hyundai"
]

export function BrandGrid() {
  const t = useTranslations('BrandGrid');
  return (
    <section className="py-20 bg-[#F8FAFC]">
      <div className="container mx-auto px-4 text-center">
        <span className="text-gold font-bold tracking-[0.2em] text-xs uppercase block mb-4">{t('overline')}</span>
        <h2 className="text-3xl md:text-4xl font-heading font-bold text-navy mb-12">{t('title')}</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 mb-12">
          {brands.map((brand, index) => (
            <Link href={`/brands/${brand.toLowerCase().replace(' ', '-')}`} key={brand}>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -5 }}
                className="group flex flex-col items-center justify-center p-4 sm:p-8 bg-white border border-transparent hover:border-gray-100 rounded-xl sm:rounded-2xl shadow-sm hover:shadow-lg transition-all duration-500 ease-out h-32 sm:h-40"
              >
                 <div className="mb-4 transform scale-100 sm:scale-125 transition-transform duration-300 group-hover:scale-110 sm:group-hover:scale-135">
                    <BrandIcon brand={brand} className="w-10 h-10 sm:w-12 sm:h-12" />
                 </div>
                 <span className="font-heading font-bold text-navy text-sm opacity-50 group-hover:opacity-100 transition-opacity">{brand}</span>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
