'use client';

import Link from "next/link"
import { OptimizedImage } from "@/components/ui/OptimizedImage"
import { useCurrency } from "@/context/CurrencyContext"
import { useTranslations } from "next-intl"

export function CategoryGrid() {
  const { formatPrice } = useCurrency();
  const t = useTranslations('CategoryGrid');
  
  const categories = [
    { 
        name: t('categories.Economy'), 
        count: t('vehiclesCount', { count: 95 }), 
        price: 30, 
        period: t('perDay'),
        slug: "Economy", 
        image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2",
        alt: "Economy car on road"
    },
    { 
        name: t('categories.Luxury'), 
        count: t('vehiclesCount', { count: 120 }), 
        price: 80, 
        period: t('perDay'),
        slug: "Luxury", 
        image: "https://images.unsplash.com/photo-1563720223185-11003d516935",
        alt: "Luxury sedan interior"
    },
    { 
        name: t('categories.SUV'), 
        count: t('vehiclesCount', { count: 180 }), 
        price: 50, 
        period: t('perDay'),
        slug: "SUV", 
        image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf",
        alt: "Black SUV"
    },
    { 
        name: t('categories.Sports'), 
        count: t('vehiclesCount', { count: 35 }), 
        price: 200, 
        period: t('perDay'),
        slug: "Sports", 
        image: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e",
        alt: "Red sports car"
    },
    { 
        name: t('categories.Hatchback'), 
        count: t('vehiclesCount', { count: 65 }), 
        price: 25, 
        period: t('perDay'),
        slug: "Hatchback", 
        image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80&w=1000",
        alt: "Compact hatchback car"
    },
    { 
        name: t('categories.Electric'), 
        count: t('vehiclesCount', { count: 15 }), 
        price: 40, 
        period: t('perDay'),
        slug: "Electric", 
        image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70",
        alt: "Luxury electric car"
    },
  ];

  return (
    <section className="py-24 bg-gray-50 flex items-center justify-center">
       <div className="container mx-auto px-4">
           {/* Section Header */}
           <div className="text-center mb-12 sm:mb-16 space-y-4">
               <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-black text-navy tracking-tight">{t('title')}</h2>
               <p className="text-gray-500 text-base md:text-lg max-w-2xl mx-auto font-medium">{t('subtitle')}</p>
           </div>
           
           {/* Grid */}
           <div 
             className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
           >
              {categories.map((cat) => (
                 <Link key={cat.slug} href={`/cars?category=${cat.slug}`} className="block h-full group">
                     <article 
                        className="relative h-[320px] rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 group"
                     >
                         {/* Background Image */}
                         <div className="absolute inset-0">
                             <OptimizedImage 
                                containerClassName="h-full w-full"
                                src={cat.image} 
                                alt={cat.alt}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                             />
                             {/* Gradient Overlay */}
                             <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />
                         </div>

                         {/* Content */}
                         <div className="relative z-10 flex flex-col items-center justify-end h-full w-full p-6 text-center pb-8">
                             
                             <div className="space-y-2 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                 <h3 className="font-heading font-bold text-3xl text-white tracking-wide drop-shadow-md">{cat.name}</h3>
                                 <p className="text-white/80 font-medium text-sm">{cat.count}</p>
                             </div>

                             {/* Price Tag with Glassmorphism */}
                             <div className="mt-6 pt-4 border-t border-white/20 w-full flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 ease-out delay-75">
                                 <span className="text-xs font-bold text-white/90 uppercase tracking-wider">{t('from')}</span>
                                 <span className="text-[#06B6D4] font-black text-2xl bg-white/10 px-3 py-1 rounded-lg backdrop-blur-md shadow-lg border border-white/10">
                                     {formatPrice(cat.price)}
                <span className="text-xs font-bold text-white/70 ms-1">{cat.period}</span>
                                 </span>
                             </div>
                         </div>
                     </article>
                 </Link>
              ))}
           </div>
       </div>
    </section>
  )
}