import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { HeroSection } from "@/components/features/home/HeroSection";
import { CategoryGrid } from "@/components/features/home/CategoryGrid";
import { LuxuryShowcase } from "@/components/features/home/LuxuryShowcase";
import { HowItWorks } from "@/components/features/home/HowItWorks";
import { AffordableCars } from "@/components/features/home/AffordableCars";
import { WhyChooseUs } from "@/components/features/home/WhyChooseUs";
import { LocationGrid } from "@/components/features/home/LocationGrid";
import { BrandGrid } from "@/components/features/home/BrandGrid";

import { SellingCarSection } from "@/components/features/home/SellingCarSection";
import { FAQ } from "@/components/features/home/FAQ";
import { Button } from "@/components/ui/Button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { getTranslations } from 'next-intl/server';
import { getVehicles as getVehiclesFromService } from "@/lib/vehicleService";

async function getVehiclesData() {
  // Fetch luxury
  const luxuryResult = await getVehiclesFromService({ 
    category: 'Luxury', // Simplified for now, or we can handle array in service if needed
    type: 'rent',
    status: 'approved',
    limit: 8,
    sort: 'price_desc'
  });

  // Fetch affordable
  const affordableResult = await getVehiclesFromService({ 
    type: 'rent',
    status: 'approved',
    maxPrice: 60,
    limit: 4,
    sort: 'price_asc'
  });

  // Fetch cars for sale
  const saleResult = await getVehiclesFromService({
      type: 'sale',
      status: 'approved',
      limit: 4
  });

  return {
    luxury: luxuryResult.vehicles,
    affordable: affordableResult.vehicles,
    forSale: saleResult.vehicles
  };
}

export default async function Home() {
  const { luxury, affordable, forSale } = await getVehiclesData();
  const t = await getTranslations('HomePage');

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      
      <main className="flex-1 w-full overflow-hidden">
        <HeroSection />
        
        <CategoryGrid />
        
        <LuxuryShowcase vehicles={luxury} />

        {/* Selling Car Section - HIDDEN PER USER REQUEST */}
        {/* <SellingCarSection vehicles={forSale} /> */}
        
        <HowItWorks />

        <AffordableCars vehicles={affordable} />

        <WhyChooseUs />

        <LocationGrid />

        <BrandGrid />

        <FAQ />

        {/* Final CTA Section */}
        <section className="py-24 bg-navy relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-electric/20 to-gold/20 opacity-30" />
            <div className="container mx-auto px-4 relative z-10 text-center space-y-8">
                <h2 className="text-3xl sm:text-4xl md:text-6xl font-heading font-black text-white leading-tight">
                    {t('title')}
                </h2>
                <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto font-body">
                    {t('subtitle')}
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
                    <Link href="/cars">
                        <Button className="h-16 px-10 text-xl font-bold bg-gold text-navy hover:bg-white hover:text-navy rounded-full shadow-[0_0_30px_rgba(255,215,0,0.3)] hover:shadow-[0_0_50px_rgba(255,215,0,0.5)] transition-all transform hover:-translate-y-1">
                            {t('rentBtn')} <ArrowRight className="ml-2 w-6 h-6" />
                        </Button>
                    </Link>
                    <Link href="/contact">
                        <Button variant="outline" className="h-16 px-10 text-xl font-bold border-white/20 text-white hover:bg-white/10 hover:border-white rounded-full transition-all">
                             Talk to an Expert
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
