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
import dbConnect from "@/lib/mongodb";
import Vehicle from "@/models/Vehicle";

async function getVehicles() {
  await dbConnect();
  
  // Fetch luxury (expanded categories)
  const luxuryVehicles = await Vehicle.find({ 
    category: { $in: ['Luxury', 'Sports', 'Supersport', 'Convertible'] },
    type: 'rent' // Explicitly fetch rental cars for luxury showcase
  })
    .sort({ 'pricing.daily': -1 })
    .limit(8)
    .lean();

  // Fetch affordable
  const affordableVehicles = await Vehicle.find({ 
      $or: [
          { category: 'Economy' },
          { 'pricing.daily': { $lt: 60 } }
      ],
      type: 'rent' // Explicitly fetch rental cars
  })
    .sort({ 'pricing.daily': 1 })
    .limit(4)
    .lean();

  // Fetch cars for sale - NEW
  const saleVehicles = await Vehicle.find({
      type: 'sale',
      status: 'approved'
  })
    .sort({ 'createdAt': -1 })
    .limit(4)
    .lean();

  return {
    luxury: JSON.parse(JSON.stringify(luxuryVehicles)),
    affordable: JSON.parse(JSON.stringify(affordableVehicles)),
    forSale: JSON.parse(JSON.stringify(saleVehicles))
  };
}

export default async function Home() {
  const { luxury, affordable, forSale } = await getVehicles();

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      
      <main className="flex-1 w-full overflow-hidden">
        <HeroSection />
        
        <CategoryGrid />
        
        <LuxuryShowcase vehicles={luxury} />

        {/* Selling Car Section - NEW */}
        <SellingCarSection vehicles={forSale} />
        
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
                <h2 className="text-4xl md:text-6xl font-heading font-black text-white leading-tight">
                    Ready to Start Your Journey?
                </h2>
                <p className="text-xl text-gray-300 max-w-2xl mx-auto font-body">
                    Book your perfect car today and experience North Cyprus like never before.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
                    <Link href="/cars">
                        <Button className="h-16 px-10 text-xl font-bold bg-gold text-navy hover:bg-white hover:text-navy rounded-full shadow-[0_0_30px_rgba(255,215,0,0.3)] hover:shadow-[0_0_50px_rgba(255,215,0,0.5)] transition-all transform hover:-translate-y-1">
                            Browse All Cars <ArrowRight className="ml-2 w-6 h-6" />
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
