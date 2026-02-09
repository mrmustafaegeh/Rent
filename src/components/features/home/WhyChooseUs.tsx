'use client';

import { ShieldCheck, Tag, Layers, Star } from "lucide-react"
import { motion } from "framer-motion"

const features = [
    {
        icon: Layers,
        title: "Wide Range of Cars",
        subtitle: "300+ Vehicles Available",
        description: "From budget-friendly economy cars to exotic supercars, SUVs perfect for mountain roads, and electric vehicles for eco-conscious drivers."
    },
    {
        icon: Tag,
        title: "Best Prices, Always",
        subtitle: "Transparent, Competitive Pricing",
        description: "No hidden fees, no booking charges. Compare offers from 20+ trusted providers and get the best daily, weekly, or monthly rates in North Cyprus."
    },
    {
        icon: ShieldCheck,
        title: "Trusted Experience",
        subtitle: "4.6 ★ Rating from 1000+ Reviews",
        description: "High-quality vehicles, 24/7 support, and seamless booking process. Airport delivery available. Trusted by tourists and residents since 2020."
    }
]

export function WhyChooseUs() {
    return (
        <section className="py-32 bg-navy relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
                <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-electric/20 blur-[100px]" />
                <div className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-gold/20 blur-[100px]" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-20 space-y-4">
                    <span className="text-gold font-bold tracking-[0.2em] text-xs uppercase">WHY CHOOSE US</span>
                    <h2 className="text-4xl md:text-5xl font-heading font-bold text-white">The #1 Car Marketplace in North Cyprus</h2>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto font-body">
                        Trusted by thousands of travelers and residents for our premium service and reliable fleet.
                    </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {features.map((feature, index) => (
                        <motion.div 
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2, duration: 0.6 }}
                            whileHover={{ y: -10 }}
                            className="flex flex-col items-center text-center p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm hover:border-gold/50 hover:bg-white/10 transition-all duration-300 group"
                        >
                            <div className="mb-8 relative">
                                <div className="absolute inset-0 bg-gold/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500 opacity-0 group-hover:opacity-100" />
                                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center text-electric group-hover:text-gold group-hover:scale-110 transition-all duration-500 relative z-10">
                                    <feature.icon className="w-10 h-10" />
                                </div>
                            </div>
                            
                            <h3 className="text-2xl font-heading font-bold text-white mb-2">{feature.subtitle}</h3>
                            <p className="text-electric font-medium mb-4">{feature.title}</p>
                            <p className="text-gray-400 leading-relaxed font-body">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
