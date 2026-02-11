'use client';

import Link from "next/link"
import Image from "next/image"

const categories = [
    { 
        name: "Economy", 
        count: "95+ vehicles", 
        price: "€30", 
        period: "/day",
        slug: "economy", 
        image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=600&auto=format&fit=crop",
        alt: "Economy car on road"
    },
    { 
        name: "Luxury", 
        count: "120+ vehicles", 
        price: "€80", 
        period: "/day",
        slug: "luxury", 
        image: "https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=600&auto=format&fit=crop",
        alt: "Luxury sedan interior"
    },
    { 
        name: "SUVs", 
        count: "180+ vehicles", 
        price: "€50", 
        period: "/day",
        slug: "suv", 
        image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=600&auto=format&fit=crop",
        alt: "Black SUV"
    },
    { 
        name: "Sports", 
        count: "35+ vehicles", 
        price: "€200", 
        period: "/day",
        slug: "sports", 
        image: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?q=80&w=600&auto=format&fit=crop",
        alt: "Red sports car"
    },
    { 
        name: "Electric", 
        count: "25+ vehicles", 
        price: "€45", 
        period: "/day",
        slug: "electric", 
        image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?q=80&w=600&auto=format&fit=crop",
        alt: "Electric car charging"
    },
    { 
        name: "Monthly", 
        count: "250+ vehicles", 
        price: "€600", 
        period: "/month",
        slug: "monthly", 
        image: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=600&auto=format&fit=crop",
        alt: "Car driving on highway"
    },
    { 
        name: "Chauffeur", 
        count: "Pro Drivers", 
        price: "€100", 
        period: "/day",
        slug: "chauffeur", 
        image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3",
        alt: "Professional chauffeur service"
    },
    { 
        name: "Supercars", 
        count: "15+ vehicles", 
        price: "€400", 
        period: "/day",
        slug: "supercar", 
        image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3",
        alt: "Luxury supercar"
    },
]

export function CategoryGrid() {
  return (
    <section className="py-24 bg-gray-50 flex items-center justify-center">
       <div className="container mx-auto px-4">
           {/* Section Header */}
           <div className="text-center mb-16 space-y-4">
               <h2 className="text-4xl md:text-5xl font-heading font-black text-navy tracking-tight">Browse by Category</h2>
               <p className="text-gray-500 text-lg max-w-2xl mx-auto font-medium">From budget-friendly to ultra-luxury, find your perfect ride for the Cyprus roads.</p>
           </div>
           
           {/* Grid */}
           <div 
             className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
           >
              {categories.map((cat) => (
                 <Link key={cat.slug} href={`/cars?category=${cat.slug}`} className="block h-full group">
                     <article 
                        className="relative h-[320px] rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 group"
                     >
                         {/* Background Image */}
                         <div className="absolute inset-0">
                             <Image 
                                src={cat.image} 
                                alt={cat.alt}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
                             <div className="mt-6 pt-4 border-t border-white/20 w-full flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-75">
                                 <span className="text-xs font-bold text-white/90 uppercase tracking-wider">From</span>
                                 <span className="text-[#06B6D4] font-black text-2xl bg-white/10 px-3 py-1 rounded-lg backdrop-blur-md shadow-lg border border-white/10">
                                     {cat.price}
                                     <span className="text-xs font-bold text-white/70 ml-1">{cat.period}</span>
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