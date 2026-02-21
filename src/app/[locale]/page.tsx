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
import { PartnerCTA } from "@/components/features/home/PartnerCTA";
import { FAQ } from "@/components/features/home/FAQ";
import { Button } from "@/components/ui/Button";
import { ArrowRight } from "lucide-react";
import { Link } from "@/navigation";
import { getTranslations } from 'next-intl/server';
import { getVehicles as getVehiclesFromService } from "@/services/vehicleService";

async function getVehiclesData() {
  try {
    // Fetch luxury
    const luxuryResult = await getVehiclesFromService({ 
      category: 'Luxury', 
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
  } catch (error) {
    console.error("Failed to fetch home page data:", error);
    return {
      luxury: [],
      affordable: [],
      forSale: []
    };
  }
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
        
        <PartnerCTA />
        
        <FAQ />

        {/* Final CTA Section */}
        <section className="py-24 bg-gradient-to-br from-[#0D3B66] to-[#0a2e52] relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none"
                 style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.03) 1px, transparent 0)', backgroundSize: '36px 36px' }}
            />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
                <h2 className="font-display font-black text-white text-4xl sm:text-5xl md:text-6xl leading-tight">
                    {t('title')}
                </h2>
                <p className="font-body text-white/60 text-lg md:text-xl max-w-2xl mx-auto">
                    {t('subtitle')}
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4 pt-2">
                    <Link href="/cars">
                        <Button className="h-14 px-10 text-base font-body font-bold bg-[#C9A84C] hover:bg-[#b8973e] text-[#0D3B66] rounded-full shadow-[0_8px_32px_rgba(201,168,76,0.3)] transition-all">
                            {t('rentBtn')} <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                    </Link>
                    <Link href="/contact">
                        <Button variant="outline" className="h-14 px-10 text-base font-body font-semibold border-2 border-white/30 text-white hover:border-white hover:bg-white/10 rounded-full transition-all">
                            {t('expertBtn')}
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
