import React from 'react';
import { HeroSection } from "@/components/features/home/HeroSection";
import { LuxuryShowcase } from "@/components/features/home/LuxuryShowcase";
import { FAQ } from "@/components/features/home/FAQ";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { Star, Crown, ShieldCheck, Diamond } from "lucide-react";
import Image from 'next/image';

import { JsonLd } from "@/components/seo/JsonLd";

type Params = {
  locale: string;
};

export async function generateMetadata({ params: { locale } }: { params: Params }) {
  const t = await getTranslations({ locale, namespace: "SEO.luxury" });

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

export default function LuxuryCarRentalPage({ params: { locale } }: { params: Params }) {
  const t = useTranslations("SEO.luxury");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CarRental",
    "name": "RentalX Luxury Fleet",
    "description": t("metaDescription"),
    "url": `${process.env.NEXT_PUBLIC_APP_URL}/${locale}/luxury-car-rental-north-cyprus`,
    "areaServed": "North Cyprus",
    "priceRange": "$$$$",
    "image": `${process.env.NEXT_PUBLIC_APP_URL}/images/luxury-showcase.jpg` // Assuming a relevant image
  };
  
  // Handing array access safely
  let sections: Array<{ title: string; content: string }> = [];
  try {
    sections = t.raw("sections") as Array<{ title: string; content: string }>;
  } catch (e) {
    sections = [];
  }

  return (
    <main className="min-h-screen bg-navy text-white selection:bg-gold/30">
      <JsonLd json={jsonLd} />
      {/* Hero Section with Custom SEO Title */}
      <HeroSection 
        title={t("h1")}
        subtitleHighlight={t("title")}
        description={t("intro")}
      />

       {/* Premium Benefits Section */}
       <section className="py-20 bg-background relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
             <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gold/30 bg-gold/5 text-gold text-sm font-medium tracking-wide uppercase">
                <Crown className="w-4 h-4" />
                <span>The Royal Treatment</span>
             </div>
             <h2 className="text-3xl md:text-5xl font-heading font-black text-white">
                Unmatched <span className="text-gold">Privileges</span>
             </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             <div className="bg-[#0F172A] p-8 rounded-3xl border border-white/5 hover:border-gold/30 transition-all duration-500 ease-out group">
                <div className="w-14 h-14 rounded-2xl bg-gold/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                   <Diamond className="w-7 h-7 text-gold" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Pristine Condition</h3>
                <p className="text-gray-400 leading-relaxed">
                   Every vehicle in our luxury fleet is meticulously detailed and inspected before every rental. Guaranteed showroom quality.
                </p>
             </div>
             <div className="bg-[#0F172A] p-8 rounded-3xl border border-white/5 hover:border-gold/30 transition-all duration-500 ease-out group">
                <div className="w-14 h-14 rounded-2xl bg-gold/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                   <Star className="w-7 h-7 text-gold" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">VIP Concierge</h3>
                <p className="text-gray-400 leading-relaxed">
                    Your personal concierge is available 24/7 to handle everything from restaurant reservations to custom driving routes.
                </p>
             </div>
             <div className="bg-[#0F172A] p-8 rounded-3xl border border-white/5 hover:border-gold/30 transition-all duration-500 ease-out group">
                <div className="w-14 h-14 rounded-2xl bg-gold/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                   <ShieldCheck className="w-7 h-7 text-gold" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Discreet & Secure</h3>
                <p className="text-gray-400 leading-relaxed">
                   We prioritize your privacy and security. Optional armored vehicles and security detail coordination available upon request.
                </p>
             </div>
          </div>
        </div>
      </section>

      {/* Luxury Showcase Reused */}
      <LuxuryShowcase />

      {/* SEO Content Section */}
      <section className="py-20 bg-navy-light relative border-t border-white/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-12 text-center md:text-left">
            {sections.length > 0 && (
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="order-2 md:order-1 relative h-[300px] rounded-2xl overflow-hidden border border-white/10">
                        <Image 
                            src="/images/luxury-interior.jpg" 
                            alt="Luxury Car Interior"
                            fill
                            className="object-cover"
                        />
                         <div className="absolute inset-0 bg-gradient-to-t from-navy/90 to-transparent" />
                         <div className="absolute bottom-6 left-6 right-6">
                            <p className="text-gold font-serif italic text-xl">"Luxury must be comfortable, otherwise it is not luxury."</p>
                         </div>
                    </div>
                    <div className="space-y-6 order-1 md:order-2">
                        <h2 className="text-3xl md:text-4xl font-heading font-black text-white">
                        {sections[0].title}
                        </h2>
                        <p className="text-gray-400 leading-relaxed text-lg">
                        {sections[0].content}
                        </p>
                    </div>
                </div>
            )}
          </div>
        </div>
      </section>


      {/* Default FAQ */}
      <FAQ />

    </main>
  );
}
