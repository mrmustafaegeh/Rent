'use client';

import Link from "next/link"
import { motion } from "framer-motion"
import { Car, Gem, Zap, Shield, Wallet, Star, Calendar, User } from "lucide-react"

const categories = [
    { name: "Rent Luxury", icon: Gem, count: "120+ Cars", slug: "luxury", color: "bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400" },
    { name: "Rent Sports", icon: Star, count: "35+ Cars", slug: "sports", color: "bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400" },
    { name: "Rent SUV", icon: Shield, count: "180+ Cars", slug: "suv", color: "bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400" },
    { name: "Rent Monthly", icon: Calendar, count: "250+ Cars", slug: "monthly", color: "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400" },
    { name: "Cheap Rent", icon: Wallet, count: "95+ Cars", slug: "economy", color: "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400" },
    { name: "Rent Electric", icon: Zap, count: "15+ Cars", slug: "electric", color: "bg-teal-100 text-teal-600 dark:bg-teal-900/20 dark:text-teal-400" },
    { name: "Convertible", icon: Car, count: "40+ Cars", slug: "convertible", color: "bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400" },
    { name: "With Driver", icon: User, count: "Chauffeur", slug: "chauffeur", color: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300" },
]

export function CategoryGrid() {
  return (
    <section className="py-16 container mx-auto px-4">
       <div className="text-center mb-10">
           <h2 className="text-3xl font-bold mb-2">Browse Car Rentals in North Cyprus</h2>
           <p className="text-muted-foreground">Choose from our extensive fleet of premium and budget vehicles</p>
       </div>
       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat, index) => (
             <Link key={cat.slug} href={`/cars?category=${cat.slug}`}>
                 <motion.div 
                    whileHover={{ y: -5, scale: 1.02 }}
                    className="flex flex-col items-center justify-center p-6 bg-card border rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer h-full group"
                 >
                     <div className={`p-4 rounded-full mb-4 ${cat.color} group-hover:scale-110 transition-transform`}>
                        <cat.icon className="w-8 h-8" />
                     </div>
                     <h3 className="font-semibold text-lg">{cat.name}</h3>
                     <span className="text-sm text-muted-foreground">{cat.count}</span>
                 </motion.div>
             </Link>
          ))}
       </div>
    </section>
  )
}
