'use client';

import { Star, Quote } from "lucide-react"
import { motion } from "framer-motion"

const testimonials = [
    {
        name: "Sarah Jenkins",
        location: "UK",
        rating: 5,
        text: "Excellent service at Ercan Airport. The car was clean and the handover was smooth. Highly recommend for family trips.",
        date: "Oct 2024"
    },
    {
        name: "Mehmet Yilmaz",
        location: "Turkey",
        rating: 5,
        text: "Great prices for long-term rental in Nicosia. The team was very professional and responsive via WhatsApp.",
        date: "Dec 2024"
    },
    {
        name: "Elena Petrova",
        location: "Russia",
        rating: 4,
        text: "Rented a convertible for a week in Kyrenia. Unforgettable experience driving along the coast. Good condition of the car.",
        date: "Sep 2024"
    }
]

export function Testimonials() {
    return (
        <section className="py-20 bg-background">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold mb-4">What Our Customers Say</h2>
                    <div className="flex justify-center items-center gap-2 mb-2">
                        <div className="flex text-yellow-400">
                            <Star className="w-5 h-5 fill-current" />
                            <Star className="w-5 h-5 fill-current" />
                            <Star className="w-5 h-5 fill-current" />
                            <Star className="w-5 h-5 fill-current" />
                            <Star className="w-5 h-5 fill-current" />
                        </div>
                        <span className="font-semibold">Excellent 4.8 | 1200+ reviews</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((review, index) => (
                        <motion.div 
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-card p-8 rounded-2xl shadow-sm border relative"
                        >
                            <Quote className="w-10 h-10 text-primary/20 absolute top-6 right-6" />
                            
                            <div className="flex text-yellow-400 mb-4">
                                {[...Array(review.rating)].map((_, i) => (
                                    <Star key={i} className="w-4 h-4 fill-current" />
                                ))}
                            </div>
                            
                            <p className="text-muted-foreground mb-6 italic">"{review.text}"</p>
                            
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                    {review.name.charAt(0)}
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm">{review.name}</h4>
                                    <span className="text-xs text-muted-foreground">{review.location} • {review.date}</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
