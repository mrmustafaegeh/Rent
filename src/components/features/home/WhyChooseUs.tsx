'use client';

import { ShieldCheck, Percent, CarFront } from "lucide-react"

const features = [
    {
        icon: CarFront,
        title: "Wide Range of Cars",
        description: "Choose from economy to luxury options, including SUVs and 4x4s, ideal for exploring North Cyprus's mountains and coastal roads."
    },
    {
        icon: Percent,
        title: "Best Prices, Always",
        description: "Get competitive daily, weekly, and monthly rates with transparent pricing and great value compared to the regular rental market."
    },
    {
        icon: ShieldCheck,
        title: "Trusted Rental Experience",
        description: "High-quality vehicles, quick support, and a smooth booking process, designed for both tourists and residents in North Cyprus."
    }
]

export function WhyChooseUs() {
    return (
        <section className="py-20 bg-background text-foreground">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Why RENTALX is the #1 Car Marketplace in North Cyprus</h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Experience the difference with our customer-centric approach and premium fleet.
                    </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {features.map((feature, index) => (
                        <div key={index} className="flex flex-col items-center text-center p-6 rounded-2xl bg-card border shadow-sm hover:shadow-md transition-all">
                            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6 text-primary">
                                <feature.icon className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
