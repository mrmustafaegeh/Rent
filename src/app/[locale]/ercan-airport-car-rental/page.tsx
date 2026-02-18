import React from 'react';
import { HeroSection } from "@/components/features/home/HeroSection";
import { CategoryGrid } from "@/components/features/home/CategoryGrid";
import { FAQ } from "@/components/features/home/FAQ";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { Check, Plane, Clock, ShieldCheck } from "lucide-react";
import Image from 'next/image';

import { JsonLd } from "@/components/seo/JsonLd";

type Params = {
  locale: string;
};

export async function generateMetadata({ params: { locale } }: { params: Params }) {
  const t = await getTranslations({ locale, namespace: "SEO.ercan" });

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

export default function ErcanAirportCarRentalPage({ params: { locale } }: { params: Params }) {
  const t = useTranslations("SEO.ercan");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CarRental",
    "name": "RentalX Ercan Airport",
    "description": t("metaDescription"),
    "url": `${process.env.NEXT_PUBLIC_APP_URL}/${locale}/ercan-airport-car-rental`,
    "areaServed": "Ercan International Airport",
    "priceRange": "$$",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Nicosia",
      "addressRegion": "North Cyprus",
      "streetAddress": "Ercan International Airport"
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
      ],
      "opens": "00:00",
      "closes": "23:59"
    }
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

      {/* Intro Section with Image */}
      <section className="py-20 bg-background relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
             <div className="space-y-6">
                 {sections.length > 0 && (
                   <>
                      <h2 className="text-3xl md:text-4xl font-heading font-black text-white">
                        {sections[0].title}
                      </h2>
                      <p className="text-gray-400 leading-relaxed text-lg">
                        {sections[0].content}
                      </p>
                   </>
                 )}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                     <div className="flex flex-col gap-2 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-gold/20 transition-colors">
                         <Plane className="w-8 h-8 text-gold" />
                         <span className="font-bold text-white">Direct Terminal Pickup</span>
                         <span className="text-sm text-gray-400">No shuttle bus needed.</span>
                     </div>
                     <div className="flex flex-col gap-2 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-gold/20 transition-colors">
                         <Clock className="w-8 h-8 text-gold" />
                         <span className="font-bold text-white">24/7 Service</span>
                         <span className="text-sm text-gray-400">Late night flights covered.</span>
                     </div>
                     <div className="flex flex-col gap-2 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-gold/20 transition-colors">
                         <ShieldCheck className="w-8 h-8 text-gold" />
                         <span className="font-bold text-white">Zero Wait Time</span>
                         <span className="text-sm text-gray-400">Paperwork ready on arrival.</span>
                     </div>
                 </div>
             </div>
             
             {/* Decorative Element mimicking a flight board or airport vibe */}
             <div className="relative h-[400px] w-full rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-[#0F172A] flex flex-col items-center justify-center p-8 text-center space-y-4 group">
                 <div className="absolute inset-0 bg-[url('/images/airport-bg-pattern.svg')] opacity-10" />
                 <div className="w-20 h-20 rounded-full bg-gold/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500">
                     <Plane className="w-10 h-10 text-gold" />
                 </div>
                 <h3 className="text-2xl font-bold text-white">
                     Arriving at ECN?
                 </h3>
                 <p className="text-gray-400 max-w-sm mx-auto">
                     Enter your flight number during booking, and we'll track your arrival time automatically.
                 </p>
                 <div className="w-full max-w-xs h-12 bg-white/10 rounded-lg flex items-center px-4 font-mono text-gold text-lg tracking-widest mt-4">
                     FLIGHT: TK 1234
                 </div>
             </div>
          </div>
        </div>
      </section>

      {/* Fleet Categories */}
      <CategoryGrid />

      {/* Default FAQ */}
      <FAQ />

    </main>
  );
}
