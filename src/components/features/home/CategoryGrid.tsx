'use client';

import Image from "next/image"
import { Link } from "@/navigation"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { useTranslations } from "next-intl"
import { useCurrency } from "@/context/CurrencyContext"

export function CategoryGrid() {
    const t = useTranslations('CategoryGrid');
    const { formatPrice } = useCurrency();

    const categories = [
        {
            name: t('categories.Economy'),
            count: "35+ vehicles",
            price: 35,
            period: t('perDay'),
            slug: "ECONOMY",
            image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=90&w=1200",
            alt: "Economy car — affordable daily rentals",
        },
        {
            name: t('categories.Luxury'),
            count: "20+ vehicles",
            price: 60,
            period: t('perDay'),
            slug: "LUXURY",
            image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=90&w=1200",
            alt: "Luxury car — premium rentals North Cyprus",
        },
        {
            name: t('categories.SUV'),
            count: "30+ vehicles",
            price: 55,
            period: t('perDay'),
            slug: "SUV",
            image: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&q=90&w=1200",
            alt: "SUV rental — spacious and powerful",
        },
        {
            name: t('categories.Sports'),
            count: "10+ vehicles",
            price: 120,
            period: t('perDay'),
            slug: "SPORTS",
            image: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&q=90&w=1200",
            alt: "Sports car rental — exhilarating performance",
        },
        {
            name: t('categories.Hatchback'),
            count: "25+ vehicles",
            price: 30,
            period: t('perDay'),
            slug: "HATCHBACK",
            image: "https://images.unsplash.com/photo-1471444928139-48c5bf5173f8?auto=format&fit=crop&q=90&w=1200",
            alt: "Hatchback rental — compact and practical",
        },
        {
            name: t('categories.Electric'),
            count: "12+ vehicles",
            price: 45,
            period: t('perDay'),
            slug: "ELECTRIC",
            image: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&q=90&w=1200",
            alt: "Electric car rental — eco-friendly driving",
        },
    ];

    return (
        <section className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-14 space-y-3">
                    <span className="font-body font-semibold text-[#64748B] tracking-[0.2em] text-xs uppercase">
                        Browse by Type
                    </span>
                    <h2 className="font-heading font-bold text-4xl sm:text-5xl text-[#0F172A] tracking-tight">
                        {t('title')}
                    </h2>
                    <p className="font-body text-[#64748B] text-lg max-w-2xl mx-auto">
                        {t('subtitle')}
                    </p>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categories.map((cat, i) => (
                        <motion.div
                            key={cat.slug}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.08 }}
                        >
                            <Link href={`/cars?category=${cat.slug}`} className="block group">
                                <div className="relative h-[300px] rounded-2xl overflow-hidden shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-hover)] transition-all duration-300">
                                    {/* Photo */}
                                    <Image
                                        src={cat.image}
                                        alt={cat.alt}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                        quality={90}
                                    />
                                    {/* Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                                    {/* Price badge */}
                                    <div className="absolute top-4 right-4 bg-white text-[#0D3B66] font-mono font-bold text-sm px-3 py-1.5 rounded-full shadow-md">
                                        {formatPrice(cat.price)}<span className="text-[#64748B] font-body font-normal text-xs">/{cat.period}</span>
                                    </div>

                                    {/* Content */}
                                    <div className="absolute bottom-0 left-0 w-full p-6">
                                        <h3 className="font-heading text-2xl font-bold text-white mb-1">{cat.name}</h3>
                                        <p className="font-body text-white/70 text-sm mb-3">{cat.count}</p>
                                        <span className="inline-flex items-center gap-1.5 font-body text-[#00B4D8] text-sm font-semibold group-hover:gap-2.5 transition-all duration-300">
                                            Browse cars <ArrowRight className="w-4 h-4" />
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}