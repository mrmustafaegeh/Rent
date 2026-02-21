'use client';

import { VehicleCard } from "@/components/features/vehicle/VehicleCard";
import { Button } from "@/components/ui/Button";
import { ArrowRight, Sparkles, ShieldCheck, Trophy } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

interface SellingCarSectionProps {
  vehicles: any[];
}

export function SellingCarSection({ vehicles }: SellingCarSectionProps) {
  if (!vehicles || vehicles.length === 0) return null;

  return (
    <section className="py-24 bg-gradient-to-b from-gray-900 to-navy relative overflow-hidden text-white">
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-electric/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gold/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div className="max-w-2xl">
            <span className="inline-block px-4 py-1.5 rounded-full border border-gold/30 bg-gold/10 text-gold text-xs font-bold tracking-[0.2em] uppercase backdrop-blur-md mb-6">
              Exclusive Marketplace
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-black leading-tight mb-4 uppercase tracking-tight">
              Own a Masterpiece <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold to-amber-500">
                Engineering
              </span>
            </h2>
            <p className="text-gray-400 text-base md:text-lg leading-relaxed">
              Discover our curated collection of verified premium vehicles available for immediate purchase. 
              Each car undergoes a rigorous 150-point inspection to ensure pristine condition.
            </p>
          </div>
 
          <Link href="/buy" className="w-full md:w-auto">
            <Button className="w-full md:w-auto h-12 px-8 bg-white text-navy hover:bg-gold hover:text-navy font-bold rounded-full transition-all flex items-center justify-center gap-2">
              View All Listings <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {/* Value Props */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {[
                { icon: ShieldCheck, title: "Verified Quality", desc: "Every vehicle is certified by our expert technicians." },
                { icon: Trophy, title: "Premium Selection", desc: "Access to exclusive models and limited editions." },
                { icon: Sparkles, title: "Concierge Service", desc: "Full ownership transfer handling and delivery." },
            ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                    <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center shrink-0">
                        <item.icon className="w-5 h-5 text-gold" />
                    </div>
                    <div>
                        <h3 className="font-bold text-white text-sm mb-1">{item.title}</h3>
                        <p className="text-gray-400 text-xs">{item.desc}</p>
                    </div>
                </div>
            ))}
        </div>

        {/* Cars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {vehicles.map((vehicle, index) => (
            <motion.div
              key={vehicle.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.1 }}
            >
              <VehicleCard vehicle={vehicle} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
