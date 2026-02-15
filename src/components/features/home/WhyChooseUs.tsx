'use client';

import { ShieldCheck, Tag, Layers, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"

const features = [
    {
        icon: Layers,
        title: "Exclusive Selection",
        subtitle: "300+ Premium Vehicles",
        description: "From performance-tuned supercars to rugged luxury SUVs and eco-conscious electric fleets. We curate only the finest vehicles for the Mediterranean journey."
    },
    {
        icon: Tag,
        title: "Absolute Transparency",
        subtitle: "Best Price Guarantee",
        description: "No hidden fees, no surrogate charges. Our competitive pricing model ensures you get elite luxury at the most justified market rates in North Cyprus."
    },
    {
        icon: ShieldCheck,
        title: "Elite Experience",
        subtitle: "24/7 Dedicated Concierge",
        description: "Beyond just rentals—we provide a complete experience. From airport VIP handovers to 24/7 road assistance and personalized driving routes."
    }
]

export function WhyChooseUs() {
    return (
        <section className="py-32 bg-navy relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-electric/5 blur-[120px]" />
                <div className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] rounded-full bg-gold/5 blur-[120px]" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-16 md:mb-24 space-y-4">
                    <span className="text-gold font-black tracking-[0.4em] text-[10px] uppercase block">BEYOND EXPECTATIONS</span>
                    <h2 className="text-3xl sm:text-5xl md:text-7xl font-heading font-black text-white leading-tight">The Pinnacle of <br className="hidden md:block" /> Mediterranean Motion</h2>
                    <p className="text-gray-400 text-base md:text-xl max-w-3xl mx-auto font-body font-light">
                        Redefining the standard of car rental in North Cyprus through an unmatched fleet and world-class service.
                    </p>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 md:gap-16">
                    {features.map((feature, index) => (
                        <motion.div 
                            key={index}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2, duration: 0.8 }}
                            className="flex flex-col items-center text-center group"
                        >
                            <div className="mb-10 relative">
                                <div className="absolute inset-0 bg-gold/20 rounded-[2.5rem] blur-2xl group-hover:blur-3xl transition-all duration-700 opacity-0 group-hover:opacity-100" />
                                <div className="w-24 h-24 rounded-[2rem] bg-white/5 border border-white/10 flex items-center justify-center text-gold group-hover:bg-white/10 group-hover:scale-110 group-hover:border-gold/30 transition-all duration-700 relative z-10">
                                    <feature.icon className="w-10 h-10 stroke-[1.5px]" />
                                </div>
                            </div>
                            
                            <div className="space-y-4">
                                <h3 className="text-gold font-black text-xs uppercase tracking-[0.2em]">{feature.title}</h3>
                                <h4 className="text-3xl font-heading font-black text-white tracking-tight">{feature.subtitle}</h4>
                                <p className="text-gray-400 leading-relaxed font-body font-medium text-lg px-4 md:px-0">
                                    {feature.description}
                                </p>
                            </div>

                            <motion.div 
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                className="mt-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            >
                                <span className="flex items-center gap-2 text-white/40 font-black text-[10px] uppercase tracking-widest group-hover:text-white transition-colors cursor-pointer">
                                    Learn More <ArrowRight className="w-3 h-3 text-gold" />
                                </span>
                            </motion.div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
