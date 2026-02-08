import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import VehicleCard from "@/components/VehicleCard";
import CarsInAction from "@/components/home/CarsInAction";
import dbConnect from "@/lib/mongodb";
import Vehicle from "@/models/Vehicle";

export const metadata = {
  title: 'RENTALX | Premium Luxury Car Rental',
  description: 'Drive the extraordinary. Rent the latest luxury and sports cars in Dubai with RENTALX.',
};

async function getFeaturedVehicles() {
  await dbConnect();
  // Fetch top 3 newest vehicles
  const vehicles = await Vehicle.find({ available: true })
    .sort({ createdAt: -1 })
    .limit(3)
    .lean();
    
  return JSON.parse(JSON.stringify(vehicles));
}

export default async function Home() {
  const vehicles = await getFeaturedVehicles();

  return (
    <div className="flex flex-col min-h-screen bg-[var(--background)] selection:bg-[var(--primary)] selection:text-white">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="relative pt-32 pb-32 text-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--background)] via-[var(--background)] to-[var(--surface)] z-0 pointer-events-none" />
          
          <div className="container relative z-10 px-4 mx-auto">
            <div className="inline-block mb-4 px-4 py-1.5 rounded-full border border-[var(--border)] bg-[var(--surface-light)]/50 backdrop-blur-sm">
                <span className="text-xs font-semibold tracking-wider uppercase text-[var(--accent)]">Premium Car Rental</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight leading-tight">
              Drive the <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary)] to-[var(--accent)]">Extraordinary</span>
            </h1>
            
            <p className="text-[var(--text-secondary)] text-lg md:text-xl mb-10 max-w-2xl mx-auto">
              Choose from our exclusive fleet of premium vehicles. Luxury, performance, and comfort at your fingertips.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
               <Link href="/fleet">
                  <Button size="lg" className="w-full sm:w-auto min-w-[160px]">Browse Fleet</Button>
               </Link>
               <Link href="/how-it-works">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto min-w-[160px]">How It Works</Button>
               </Link>
            </div>
            
            {/* Search Widget */}
            <div className="max-w-4xl mx-auto bg-[var(--surface-light)]/30 backdrop-blur-md border border-[var(--border)] rounded-2xl p-6 shadow-2xl">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                 <div className="text-left">
                   <label className="text-xs text-[var(--text-muted)] font-semibold uppercase mb-2 block">Pick-up Location</label>
                   <Input placeholder="City or Airport" className="bg-[var(--background)]/50 border-0 focus:ring-1" />
                 </div>
                 <div className="text-left">
                   <label className="text-xs text-[var(--text-muted)] font-semibold uppercase mb-2 block">Pick-up Date</label>
                   <Input type="date" className="bg-[var(--background)]/50 border-0 focus:ring-1" />
                 </div>
                 <div className="text-left">
                   <label className="text-xs text-[var(--text-muted)] font-semibold uppercase mb-2 block">Drop-off Date</label>
                   <Input type="date" className="bg-[var(--background)]/50 border-0 focus:ring-1" />
                 </div>
                 <div className="flex items-end">
                   <Button className="w-full h-11">Find Vehicle</Button>
                 </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Flow */}
        <section className="py-20 bg-[var(--surface)]">
          <div className="container mx-auto px-4">
             <div className="flex justify-between items-end mb-10">
               <div>
                  <h2 className="text-3xl font-bold mb-2">Featured Vehicles</h2>
                  <p className="text-[var(--text-secondary)]">Handpicked for your ultimate driving experience</p>
               </div>
               <Link href="/fleet" className="hidden sm:block text-[var(--primary)] hover:text-white transition-colors font-medium">
                  View All Collection &rarr;
               </Link>
             </div>
             
             {vehicles.length === 0 ? (
                <div className="text-center py-12 text-[var(--text-muted)]">
                   No featured vehicles available at the moment.
                </div>
             ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {vehicles.map((vehicle: any) => (
                    <VehicleCard 
                      key={vehicle._id}
                      vehicle={vehicle}
                    />
                  ))}
                </div>
             )}
             
             <div className="mt-8 text-center sm:hidden">
                <Link href="/fleet" className="text-[var(--primary)] font-medium">
                  View All Collection &rarr;
                </Link>
             </div>
          </div>
        </section>

        {/* Cars in Action */}
        <CarsInAction vehicles={vehicles} />

        {/* Value Props & CTA */}
         <section className="py-20 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-1/3 h-full bg-[var(--primary)]/5 blur-[100px] rounded-full pointer-events-none" />
             <div className="container mx-auto px-4 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    <div className="p-6">
                        <div className="w-16 h-16 bg-[var(--surface-light)] rounded-2xl flex items-center justify-center mx-auto mb-6 text-[var(--accent)] text-2xl">
                           ★
                        </div>
                        <h3 className="text-xl font-bold mb-3">Premium Only</h3>
                        <p className="text-[var(--text-secondary)]">We exclusively stock the latest models from top luxury manufacturers.</p>
                    </div>
                    <div className="p-6">
                         <div className="w-16 h-16 bg-[var(--surface-light)] rounded-2xl flex items-center justify-center mx-auto mb-6 text-[var(--accent)] text-2xl">
                           ⚡
                        </div>
                        <h3 className="text-xl font-bold mb-3">Instant Booking</h3>
                        <p className="text-[var(--text-secondary)]">Real-time availability and instant confirmation for all bookings.</p>
                    </div>
                    <div className="p-6">
                         <div className="w-16 h-16 bg-[var(--surface-light)] rounded-2xl flex items-center justify-center mx-auto mb-6 text-[var(--accent)] text-2xl">
                           🛡
                        </div>
                        <h3 className="text-xl font-bold mb-3">24/7 Support</h3>
                        <p className="text-[var(--text-secondary)]">Our concierge team is available around the clock to assist you.</p>
                    </div>
                </div>
             </div>
         </section>
      </main>

      <Footer />
    </div>
  );
}
