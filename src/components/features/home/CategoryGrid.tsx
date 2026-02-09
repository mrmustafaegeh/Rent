'use client';

import Link from "next/link"
import { motion } from "framer-motion"
import { Car, Gem, Zap, Shield, Calendar, User, Rocket, Wallet } from "lucide-react"

const categories = [
    { name: "Economy", icon: Wallet, count: "95+ vehicles", price: "€30/day", slug: "economy", gradient: "from-blue-500 to-cyan-400" },
    { name: "Luxury", icon: Gem, count: "120+ vehicles", price: "€80/day", slug: "luxury", gradient: "from-purple-500 to-indigo-500" },
    { name: "SUVs", icon: Shield, count: "180+ vehicles", price: "€50/day", slug: "suv", gradient: "from-slate-500 to-slate-700" },
    { name: "Sports", icon: Rocket, count: "35+ vehicles", price: "€200/day", slug: "sports", gradient: "from-red-500 to-orange-500" },
    { name: "Electric", icon: Zap, count: "25+ vehicles", price: "€45/day", slug: "electric", gradient: "from-green-400 to-emerald-600" },
    { name: "Monthly", icon: Calendar, count: "250+ vehicles", price: "€600/month", slug: "monthly", gradient: "from-blue-600 to-blue-800" },
    { name: "Chauffeur", icon: User, count: "Pro Drivers", price: "€100/day", slug: "chauffeur", gradient: "from-gray-800 to-black" },
    { name: "Supercars", icon: Car, count: "15+ vehicles", price: "€400/day", slug: "supercar", gradient: "from-gold to-yellow-600" },
]

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

export function CategoryGrid() {
  return (
    <section className="py-24 bg-[#F8FAFC]">
       <div className="container mx-auto px-4">
           <div className="text-center mb-16 space-y-4">
               <span className="text-gold font-bold tracking-[0.2em] text-xs uppercase">EXPLORE OUR FLEET</span>
               <h2 className="text-4xl md:text-5xl font-heading font-bold text-navy">Browse by Category</h2>
               <p className="text-gray-500 text-lg max-w-2xl mx-auto font-body">From budget-friendly to ultra-luxury, find your perfect ride for the Cyprus roads.</p>
           </div>
           
           <motion.div 
             variants={container}
             initial="hidden"
             whileInView="show"
             viewport={{ once: true }}
             className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
           >
              {categories.map((cat) => (
                 <Link key={cat.slug} href={`/cars?category=${cat.slug}`} className="block h-full">
                     <motion.div 
                        variants={item}
                        whileHover={{ y: -8 }}
                        className="bg-white border-2 border-transparent hover:border-gold rounded-2xl p-6 shadow-sm hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-all duration-300 h-full flex flex-col group cursor-pointer"
                     >
                         <div className={`h-40 rounded-xl bg-gradient-to-br ${cat.gradient} mb-6 flex items-center justify-center group-hover:scale-[1.02] transition-transform duration-500`}>
                            <cat.icon className="w-16 h-16 text-white drop-shadow-lg group-hover:rotate-12 transition-transform duration-300" />
                         </div>
                         
                         <div className="space-y-1">
                             <h3 className="font-heading font-bold text-2xl text-navy group-hover:text-electric transition-colors">{cat.name}</h3>
                             <p className="text-gray-400 font-medium text-sm">{cat.count}</p>
                         </div>
                         
                         <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                             <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Starting from</span>
                             <span className="text-electric font-bold text-lg group-hover:text-gold transition-colors">{cat.price}</span>
                         </div>
                     </motion.div>
                 </Link>
              ))}
           </motion.div>
           
           <div className="mt-16 text-center">
               <Link href="/cars">
                   <button className="px-8 py-4 bg-transparent border-2 border-electric text-electric font-bold rounded-lg hover:bg-electric hover:text-white transition-all duration-300 transform hover:scale-105">
                       View All Categories →
                   </button>
               </Link>
           </div>
       </div>
    </section>
  )
}
