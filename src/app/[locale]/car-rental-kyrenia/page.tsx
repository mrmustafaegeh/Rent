import React from 'react';
import { HeroSection } from "@/components/features/home/HeroSection";
import { CategoryGrid } from "@/components/features/home/CategoryGrid";
import { FAQ } from "@/components/features/home/FAQ";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { Check, MapPin } from "lucide-react";
import Image from 'next/image';

import { JsonLd } from "@/components/seo/JsonLd";

type Params = {
  locale: string;
};

export async function generateMetadata({ params: { locale } }: { params: Params }) {
  const t = await getTranslations({ locale, namespace: "SEO.kyrenia" });

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

export default function CarRentalKyreniaPage({ params: { locale } }: { params: Params }) {
  const t = useTranslations("SEO.kyrenia");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CarRental",
    "name": "RentalX Kyrenia",
    "description": t("metaDescription"),
    "url": `${process.env.NEXT_PUBLIC_APP_URL}/${locale}/car-rental-kyrenia`,
    "areaServed": "Kyrenia",
    "priceRange": "$$",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Kyrenia",
      "addressRegion": "North Cyprus"
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
      "opens": "08:00",
      "closes": "20:00"
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
                 <ul className="space-y-4 pt-4">
                     {[
                         "Kyrenia Harbor Pickup", 
                         "City Center Hotels Delivery", 
                         "Luxury Convertibles for Coastal Drives"
                     ].map((item, i) => (
                         <li key={i} className="flex items-center gap-3 text-gray-300">
                             <Check className="w-5 h-5 text-gold" />
                             {item}
                         </li>
                     ))}
                 </ul>
             </div>
             <div className="relative h-[400px] w-full rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                 <Image 
                    src="/images/kyrenia-harbor.jpg" // Placeholder, assuming this might exist or fallback
                    alt="Kyrenia Harbor"
                    fill
                    className="object-cover hover:scale-[1.03] duration-500 ease-out will-change-transform transition-transform duration-700"
                    
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-navy/80 to-transparent" />
                 <div className="absolute bottom-6 left-6 flex items-center gap-2 text-white/90">
                    <MapPin className="w-5 h-5 text-gold" />
                    <span className="font-bold tracking-wider uppercase text-sm">Girne, North Cyprus</span>
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
