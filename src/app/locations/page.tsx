import { Metadata } from 'next';
import Location from '@/models/Location';
import dbConnect from '@/lib/mongodb';
import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { MapPin, Phone, Mail, Clock, Navigation, ExternalLink, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'Luxury Car Rental Locations | Mediterranean Drive',
  description: 'Find Mediterranean Drive rental points across North Cyprus. Convenient pickup in Kyrenia, Nicosia, Famagusta, and Ercan Airport.',
};

async function getLocations() {
  await dbConnect();
  // If no locations in DB, return mock data for display
  const dbLocations = await Location.find({ isActive: true });
  if (dbLocations.length > 0) return JSON.parse(JSON.stringify(dbLocations));

  return [
    {
        _id: '1',
        name: 'Kyrenia Harbor HQ',
        address: '20 Kordonboyu St, Kyrenia',
        city: 'Kyrenia',
        phone: '+90 533 850 0000',
        email: 'kyrenia@mediterraneandrive.com',
        operatingHours: '08:00 - 22:00',
        image: '/images/kyrenia-thumb.png',
        coordinates: { lat: 35.3407, lng: 33.3199 }
    },
    {
        _id: '2',
        name: 'Ercan International Airport',
        address: 'Terminal Building, Arrivals Hall',
        city: 'Nicosia',
        phone: '+90 533 850 0001',
        email: 'airport@mediterraneandrive.com',
        operatingHours: '24/7 Service',
        image: '/images/hero-bg-cyprus.png', // Fallback
         coordinates: { lat: 35.1500, lng: 33.5000 }
    },
    {
        _id: '3',
        name: 'Famagusta City Center',
        address: 'Salamis Road, Famagusta',
        city: 'Famagusta',
        phone: '+90 533 850 0002',
        email: 'famagusta@mediterraneandrive.com',
        operatingHours: '09:00 - 20:00',
        image: '/images/hero-bg-cyprus.png', // Fallback
         coordinates: { lat: 35.1250, lng: 33.9400 }
    }
  ];
}

export default async function LocationsPage() {
  const locations = await getLocations();

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
             <Image 
                src="/images/hero-bg-cyprus.png"
                alt="Cyprus Locations"
                fill
                className="object-cover"
                priority
             />
             <div className="absolute inset-0 bg-navy/80 mix-blend-multiply" />
             <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white" />
             
             <div className="container mx-auto px-4 relative z-10 text-center space-y-6">
                <span className="inline-block px-4 py-1.5 rounded-full border border-gold/30 bg-gold/10 text-gold text-xs font-bold tracking-[0.2em] uppercase backdrop-blur-md">
                    Island-Wide Coverage
                </span>
                <h1 className="text-4xl md:text-6xl font-heading font-black text-white leading-tight">
                    Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold to-amber-500">Locations</span>
                </h1>
                <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto font-light">
                    Experience seamless pickup and drop-off services at key destinations across North Cyprus.
                </p>
             </div>
        </section>

        <section className="py-20 -mt-20 relative z-20">
            <div className="container mx-auto px-4">
                 {/* Locations Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {locations.map((location: any, index: number) => (
                        <div 
                            key={location._id} 
                            className="group bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 flex flex-col"
                        >
                            {/* Image Header */}
                            <div className="h-64 relative overflow-hidden bg-gray-100">
                                <Image 
                                    src={location.image} 
                                    alt={location.name} 
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-transparent to-transparent opacity-80" />
                                
                                <div className="absolute top-4 left-4">
                                    <span className="bg-white/90 backdrop-blur-md text-navy px-3 py-1 rounded-full text-xs font-bold border border-white uppercase tracking-wider shadow-sm flex items-center gap-1">
                                        <MapPin className="w-3 h-3 text-gold" /> {location.city}
                                    </span>
                                </div>
                                <div className="absolute bottom-6 left-6 right-6">
                                    <h3 className="text-2xl font-heading font-bold text-white mb-1 group-hover:text-gold transition-colors">
                                        {location.name}
                                    </h3>
                                </div>
                            </div>

                            {/* Details */}
                            <div className="p-8 flex-1 flex flex-col space-y-6">
                                <p className="text-gray-500 text-sm leading-relaxed border-b border-gray-100 pb-6">
                                    {location.description || `Visit our premium branch in ${location.city} for personalized service and a wide range of luxury vehicles.`}
                                </p>

                                <div className="space-y-4">
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-navy/5 flex items-center justify-center shrink-0 group-hover:bg-navy group-hover:text-gold transition-colors text-navy">
                                            <MapPin className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Address</h4>
                                            <p className="text-navy font-bold text-sm">{location.address}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-navy/5 flex items-center justify-center shrink-0 group-hover:bg-navy group-hover:text-gold transition-colors text-navy">
                                            <Phone className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Phone</h4>
                                            <a href={`tel:${location.phone}`} className="text-navy font-bold text-sm hover:text-electric transition-colors block">
                                                {location.phone}
                                            </a>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-navy/5 flex items-center justify-center shrink-0 group-hover:bg-navy group-hover:text-gold transition-colors text-navy">
                                            <Clock className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Hours</h4>
                                            <p className="text-navy font-bold text-sm block">
                                                {location.operatingHours}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-6 mt-auto">
                                    <Link 
                                        href={`https://maps.google.com/?q=${encodeURIComponent(location.address + ', ' + location.city)}`}
                                        target="_blank"
                                        className="block"
                                    >
                                        <Button className="w-full bg-navy text-white hover:bg-electric hover:text-white font-bold h-12 rounded-xl group-hover:shadow-lg group-hover:shadow-electric/20 transition-all">
                                            <Navigation className="w-4 h-4 mr-2" /> Get Directions
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        {/* Interactive Map Placeholder (Visual Only) */}
        <section className="py-20 bg-gray-50 border-y border-gray-100">
             <div className="container mx-auto px-4 text-center">
                 <div className="relative rounded-3xl overflow-hidden shadow-2xl h-[500px] border border-gray-200 bg-gray-200 group">
                      {/* Placeholder Map Image/Gradient */}
                      <div className="absolute inset-0 bg-[url('/images/map-pattern.png')] opacity-20 bg-repeat bg-contain" />
                      <div className="absolute inset-0 bg-gradient-to-br from-navy/5 to-navy/20" />
                      
                      <div className="absolute inset-0 flex flex-col items-center justify-center space-y-6 p-6">
                           <div className="w-20 h-20 bg-white rounded-full shadow-lg flex items-center justify-center animate-bounce">
                                <MapPin className="w-10 h-10 text-electric" />
                           </div>
                           <h2 className="text-3xl font-heading font-black text-navy max-w-lg">
                               Find Your Nearest Branch
                           </h2>
                           <p className="text-gray-500 max-w-md text-lg">
                               We are strategically located to serve you better. Check our map for real-time navigation.
                           </p>
                           <Button className="bg-gold text-navy font-bold px-8 h-12 rounded-full hover:scale-105 transition-transform shadow-lg shadow-gold/30">
                               <ExternalLink className="w-4 h-4 mr-2" /> Open Interactive Map
                           </Button>
                      </div>
                 </div>
             </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-navy relative overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-r from-electric/20 to-gold/20 opacity-30" />
             <div className="container mx-auto px-4 relative z-10 text-center space-y-8">
                 <h2 className="text-4xl md:text-5xl font-heading font-black text-white leading-tight">
                     Not Near a Location?
                 </h2>
                 <p className="text-xl text-gray-400 max-w-2xl mx-auto font-light">
                     We offer VIP delivery service. Have your vehicle delivered to your hotel, villa, or office anywhere in North Cyprus.
                 </p>
                 <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
                     <Link href="/contact">
                         <Button className="h-14 px-8 text-lg font-bold bg-white text-navy hover:bg-gold hover:text-navy rounded-full shadow-lg transition-all">
                             Request Delivery <ArrowRight className="ml-2 w-5 h-5" />
                         </Button>
                     </Link>
                     <Link href="https://wa.me/905330000000">
                         <Button variant="outline" className="h-14 px-8 text-lg font-bold border-white/20 text-white hover:bg-white/10 hover:border-white rounded-full transition-all">
                             WhatsApp Concierge
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
