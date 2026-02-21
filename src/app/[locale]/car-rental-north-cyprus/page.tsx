import React from 'react';
import { HeroSection } from "@/components/features/home/HeroSection";
import { CategoryGrid } from "@/components/features/home/CategoryGrid";
import { WhyChooseUs } from "@/components/features/home/WhyChooseUs";
import { LocationGrid } from "@/components/features/home/LocationGrid";
import { FAQ } from "@/components/features/home/FAQ";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { Badge } from "@/components/ui/Badge";
import { Check } from "lucide-react";
import { JsonLd } from "@/components/seo/JsonLd";

type Params = {
  locale: string;
};

export async function generateMetadata({ params: { locale } }: { params: Params }) {
  const t = await getTranslations({ locale, namespace: "SEO.northCyprus" });

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

export default function CarRentalNorthCyprusPage({ params: { locale } }: { params: Params }) {
  const t = useTranslations("SEO.northCyprus");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CarRental",
    "name": "RentalX North Cyprus",
    "description": t("metaDescription"),
    "url": `${process.env.NEXT_PUBLIC_APP_URL}/${locale}/car-rental-north-cyprus`,
    "areaServed": "North Cyprus",
    "priceRange": "$$",
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

  let faqItems: Array<{ q: string; a: string }> = [];
  try {
    faqItems = t.raw("faq.items") as Array<{ q: string; a: string }>;
  } catch (e) {
      faqItems = [];
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

      {/* SEO Content Section 1 */}
      <section className="py-20 bg-[#0A1628] relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-12">
            {sections.length > 0 && (
               <div className="space-y-6 text-center md:text-left">
                  <h2 className="text-3xl md:text-4xl font-heading font-black text-white">
                    {sections[0].title}
                  </h2>
                  <p className="text-gray-400 leading-relaxed text-lg">
                    {sections[0].content}
                  </p>
               </div>
            )}
          </div>
        </div>
      </section>

      {/* Fleet Categories */}
      <CategoryGrid />

      {/* SEO Content Section 2 */}
      <section className="py-20 bg-[#0d1b2e] relative">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-12">
            {sections.length > 1 && (
                <div className="space-y-6">
                    <h2 className="text-3xl md:text-4xl font-heading font-black text-white">
                      {sections[1].title}
                    </h2>
                    <p className="text-gray-400 leading-relaxed text-lg">
                      {sections[1].content}
                    </p>
                </div>
            )}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <WhyChooseUs />

      {/* SEO Content Section 3 */}
      <section className="py-20 bg-[#0A1628]">
         <div className="container mx-auto px-4">
           <div className="max-w-4xl mx-auto">
             {sections.length > 2 && (
                <div className="bg-[#0d1b2e] p-8 md:p-12 rounded-3xl border border-white/5 space-y-6">
                    <div className="flex items-center gap-3">
                        <Badge variant="outline" className="border-gold text-gold rounded-full px-3 py-1 text-sm bg-gold/5">
                            High Trust
                        </Badge>
                        <h2 className="text-2xl md:text-3xl font-heading font-bold text-white">
                        {sections[2].title}
                        </h2>
                    </div>
                    
                    <p className="text-gray-300 leading-relaxed text-lg pb-4">
                      {sections[2].content}
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-white/5 pt-6">
                        <div className="flex items-center gap-3 text-sm text-gray-400">
                             <div className="p-1 rounded-full bg-gold/10">
                                <Check className="w-4 h-4 text-gold" />
                             </div>
                             No hidden fees
                        </div>
                         <div className="flex items-center gap-3 text-sm text-gray-400">
                             <div className="p-1 rounded-full bg-gold/10">
                                <Check className="w-4 h-4 text-gold" />
                             </div>
                             Free cancellation (48h)
                        </div>
                         <div className="flex items-center gap-3 text-sm text-gray-400">
                             <div className="p-1 rounded-full bg-gold/10">
                                <Check className="w-4 h-4 text-gold" />
                             </div>
                             24/7 Roadside Support
                        </div>
                         <div className="flex items-center gap-3 text-sm text-gray-400">
                             <div className="p-1 rounded-full bg-gold/10">
                                <Check className="w-4 h-4 text-gold" />
                             </div>
                             Instant Booking Confirmation
                        </div>
                    </div>
                </div>
             )}
           </div>
         </div>
      </section>

      {/* Locations */}
      <LocationGrid />

      {/* Specific FAQ for this page */}
      <section className="py-24 bg-[#0d1b2e] relative overflow-hidden">
         <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-16 space-y-4">
                <h2 className="text-3xl md:text-5xl font-black font-heading text-white tracking-tight">
                    {t("faq.title")}
                </h2>
                <div className="w-24 h-1 bg-gold mx-auto rounded-full" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                {faqItems.map((item, index) => (
                    <div key={index} className="bg-[#0A1628]/50 backdrop-blur-sm p-8 rounded-2xl border border-white/5 hover:border-gold/30 transition-all duration-500 ease-out hover:bg-[#0A1628]">
                        <h3 className="text-lg font-bold text-white mb-3 flex gap-3">
                            <span className="text-gold">Q.</span> 
                            {item.q}
                        </h3>
                        <p className="text-gray-400 text-sm leading-relaxed pl-7 border-l border-white/10">
                            {item.a}
                        </p>
                    </div>
                ))}
            </div>
         </div>
      </section>

      {/* Default FAQ as fallback or addition - actually we might duplicate FAQs if both present. 
          But the page specific FAQs are better. Let's keep the global FAQ but maybe give it a different title or just rely on page specific? 
          Actually, let's omit the global FAQ for this landing page to keep it focused, or keep it if it adds value. 
          I'll remove the global FAQ to reduce clutter.
      */}
      {/* <FAQ /> */}

    </main>
  );
}
