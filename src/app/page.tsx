import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { HeroSection } from "@/components/features/home/HeroSection";
import { CategoryGrid } from "@/components/features/home/CategoryGrid";
import { LuxuryShowcase } from "@/components/features/home/LuxuryShowcase";
import { AffordableCars } from "@/components/features/home/AffordableCars";
import { WhyChooseUs } from "@/components/features/home/WhyChooseUs";
import { BrandGrid } from "@/components/features/home/BrandGrid";
import { LocationGrid } from "@/components/features/home/LocationGrid";
import { SUVShowcase } from "@/components/features/home/SUVShowcase";
import { Testimonials } from "@/components/features/home/Testimonials";
import { FAQ } from "@/components/features/home/FAQ";
import dbConnect from "@/lib/mongodb";
import Vehicle from "@/models/Vehicle";

async function getVehicles() {
  await dbConnect();
  
  // Fetch luxury
  const luxuryVehicles = await Vehicle.find({ category: { $in: ['Luxury', 'Sports', 'Supersport'] } })
    .sort({ 'pricing.daily': -1 })
    .limit(4)
    .lean();

  // Fetch affordable
  const affordableVehicles = await Vehicle.find({ 
      $or: [
          { category: 'Economy' },
          { 'pricing.daily': { $lt: 50 } }
      ]
  })
    .sort({ 'pricing.daily': 1 })
    .limit(4)
    .lean();

  // Fetch SUVs
  const suvVehicles = await Vehicle.find({ category: 'SUV' })
    .sort({ createdAt: -1 })
    .limit(4)
    .lean();

  return {
    luxury: JSON.parse(JSON.stringify(luxuryVehicles)),
    affordable: JSON.parse(JSON.stringify(affordableVehicles)),
    suv: JSON.parse(JSON.stringify(suvVehicles))
  };
}

export default async function Home() {
  const { luxury, affordable, suv } = await getVehicles();

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      
      <main className="flex-1">
        <HeroSection />
        
        <CategoryGrid />
        
        <LuxuryShowcase vehicles={luxury} />

        <AffordableCars vehicles={affordable} />

        <WhyChooseUs />

        <SUVShowcase vehicles={suv} />

        <BrandGrid />

        <LocationGrid />

        <Testimonials />

        <FAQ />


        
        {/* Placeholder for other sections */}
        <section className="py-20 text-center container mx-auto">
            <h2 className="text-2xl font-bold mb-4">More Sections Coming Soon...</h2>
            <p className="text-muted-foreground">Affordable Cars, Chauffeur Service, and more being added.</p>
        </section>
      </main>

      <Footer />
    </div>
  );
}
