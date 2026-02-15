'use client';

import { Star, Quote, ArrowLeft, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"

const testimonials = [
    {
        name: "Sarah Jenkins",
        location: "United Kingdom",
        rating: 5,
        text: "Exceptional experience from start to finish. The vehicle was pristine, and the Ercan Airport pickup was seamless. Mediterranean Drive truly understands luxury service.",
        date: "October 2024",
        avatar: "SJ"
    },
    {
        name: "Mehmet Yılmaz",
        location: "Istanbul, Turkey",
        rating: 5,
        text: "The best car rental company in Nicosia. Professional staff, transparent pricing, and a fantastic selection of SUVs. Their WhatsApp support is top-notch.",
        date: "December 2024",
        avatar: "MY"
    },
    {
        name: "Elena Petrova",
        location: "Moscow, Russia",
        rating: 5,
        text: "Renting a Range Rover for our stay in Kyrenia was the best decision. The car was brand new and the service was beyond my expectations. Five stars!",
        date: "September 2024",
        avatar: "EP"
    }
]

export function Testimonials() {
    return (
        <section className="py-32 bg-gray-50 relative overflow-hidden">
            {/* Background Accent */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-gold/5 rounded-full blur-[150px] pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-center mb-20 gap-8">
                    <div className="text-center md:text-left space-y-4">
                        <span className="text-gold font-black tracking-[0.4em] text-[10px] uppercase block">VOICE OF EXCELLENCE</span>
                        <h2 className="text-3xl sm:text-5xl md:text-6xl font-heading font-black text-navy tracking-tight leading-[1.1]">Loved by Travelers <br className="hidden md:block" /> Across the Globe</h2>
                    </div>
                    
                    <div className="flex flex-col items-center md:items-end gap-3">
                        <div className="flex text-gold">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className="w-6 h-6 fill-current" />
                            ))}
                        </div>
                        <span className="font-heading font-black text-navy text-xl">4.9 / 5.0</span>
                        <span className="text-gray-400 font-bold text-xs uppercase tracking-widest">Based on 2,500+ Luxury Rentals</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                    {testimonials.map((review, index) => (
                        <motion.div 
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.6 }}
                            className="group bg-white p-6 sm:p-10 rounded-3xl md:rounded-[3rem] shadow-2xl shadow-navy/5 border border-black/5 hover:border-gold/30 hover:-translate-y-2 transition-all duration-500 relative"
                        >
                            <Quote className="w-16 h-16 text-gold/10 absolute top-8 right-8 group-hover:text-gold/20 transition-colors" />
                            
                            <div className="flex text-gold mb-8">
                                {[...Array(review.rating)].map((_, i) => (
                                    <Star key={i} className="w-4 h-4 fill-current" />
                                ))}
                            </div>
                            
                            <p className="text-navy font-body text-lg leading-relaxed mb-10 min-h-[120px]">
                                "{review.text}"
                            </p>
                            
                            <div className="flex items-center gap-4 pt-8 border-t border-gray-100">
                                <div className="w-14 h-14 rounded-2xl bg-navy text-gold flex items-center justify-center text-xl font-black shadow-lg shadow-navy/20">
                                    {review.avatar}
                                </div>
                                <div className="flex flex-col">
                                    <h4 className="font-heading font-black text-navy text-lg leading-tight">{review.name}</h4>
                                    <span className="text-gray-400 font-bold text-[10px] uppercase tracking-widest">{review.location}</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-20 flex justify-center gap-4">
                    <button className="w-12 h-12 rounded-full border border-navy/10 flex items-center justify-center hover:bg-navy hover:text-white transition-all group">
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    </button>
                    <button className="w-12 h-12 rounded-full border border-navy/10 flex items-center justify-center hover:bg-navy hover:text-white transition-all group">
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>
        </section>
    )
}
