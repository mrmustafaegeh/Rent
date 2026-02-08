import { Metadata } from 'next';
import Location from '@/models/Location';
import dbConnect from '@/lib/mongodb';
import Link from 'next/link';
import OptimizedImage from '@/components/ui/OptimizedImage';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { MapPin, Phone, Mail, Clock, Navigation } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Car Rental Locations | Dubai, Abu Dhabi - RENTALX',
  description: 'Find RENTALX locations across UAE. Convenient pickup and drop-off points in Dubai, Abu Dhabi, Sharjah, and more.',
};

async function getLocations() {
  await dbConnect();
  return Location.find({ isActive: true });
}

export default async function LocationsPage() {
  const locations = await getLocations();

  return (
    <div className="flex flex-col min-h-screen bg-[var(--background)]">
      <Header />
      
      <main className="flex-1 pt-24 pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Header */}
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <div className="inline-block mb-4 px-4 py-1.5 rounded-full border border-[var(--border)] bg-[var(--surface-light)]/50 backdrop-blur-sm">
              <span className="text-xs font-semibold tracking-wider uppercase text-[var(--accent)]">Our Locations</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
              Conveniently Located <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary)] to-[var(--accent)]">Across UAE</span>
            </h1>
            
            <p className="text-[var(--text-secondary)] text-lg md:text-xl">
              Easy pickup and drop-off at multiple locations in Dubai, Abu Dhabi, and beyond.
            </p>
          </div>

          {/* Map Section */}
          <div className="w-full h-[400px] md:h-[500px] bg-[var(--surface-light)] rounded-2xl overflow-hidden border border-[var(--border)] relative group shadow-xl">
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[var(--surface-lighter)] to-[var(--surface)]">
              <div className="text-center space-y-4">
                <div className="w-20 h-20 mx-auto bg-[var(--primary)]/10 rounded-full flex items-center justify-center">
                  <MapPin className="w-10 h-10 text-[var(--primary)]" />
                </div>
                <p className="text-[var(--text-muted)] text-lg">Interactive Map Coming Soon</p>
                <p className="text-[var(--text-secondary)] text-sm max-w-md mx-auto">
                  We're working on an interactive map to help you find the nearest location
                </p>
              </div>
            </div>
            
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Link 
                href="https://maps.google.com" 
                target="_blank" 
                className="bg-white text-black px-8 py-3 rounded-full font-semibold hover:bg-[var(--primary)] transition-colors shadow-lg flex items-center gap-2"
              >
                <Navigation className="w-5 h-5" />
                View on Google Maps
              </Link>
            </div>
          </div>

          {/* Locations Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {locations && locations.map((location: any) => (
              <div 
                key={location._id.toString()} 
                className="bg-[var(--surface-light)] border border-[var(--border)] rounded-2xl overflow-hidden hover:border-[var(--primary)] transition-all duration-300 group flex flex-col shadow-lg hover:shadow-2xl hover:-translate-y-1"
              >
                {/* Image */}
                <div className="h-56 relative overflow-hidden bg-[var(--surface-lighter)]">
                  {location.image ? (
                    <OptimizedImage 
                      src={location.image} 
                      alt={location.name} 
                      fill
                      className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <MapPin className="w-16 h-16 text-[var(--text-muted)] opacity-30" />
                    </div>
                  )}
                  
                  {/* City Badge */}
                  <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-md px-4 py-2 rounded-full text-sm font-bold text-white border border-white/20 shadow-lg">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    {location.city}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[var(--primary)] transition-colors">
                      {location.name}
                    </h3>
                    <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                      {location.address}
                    </p>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-3 mt-auto text-sm">
                    <div className="flex items-center gap-3 text-[var(--text-muted)] hover:text-white transition-colors">
                      <div className="w-9 h-9 bg-[var(--primary)]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Phone className="w-4 h-4 text-[var(--primary)]" />
                      </div>
                      <a href={`tel:${location.phone}`} className="hover:underline">
                        {location.phone}
                      </a>
                    </div>
                    
                    <div className="flex items-center gap-3 text-[var(--text-muted)] hover:text-white transition-colors">
                      <div className="w-9 h-9 bg-[var(--primary)]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Mail className="w-4 h-4 text-[var(--primary)]" />
                      </div>
                      <a href={`mailto:${location.email}`} className="truncate hover:underline">
                        {location.email}
                      </a>
                    </div>
                    
                    <div className="flex items-center gap-3 text-[var(--text-muted)]">
                      <div className="w-9 h-9 bg-[var(--primary)]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Clock className="w-4 h-4 text-[var(--primary)]" />
                      </div>
                      <span>{location.operatingHours}</span>
                    </div>
                  </div>
                  
                  {/* Get Directions Button */}
                  <Link 
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.address + ', ' + location.city)}`}
                    target="_blank"
                    className="mt-4 flex items-center justify-center gap-2 w-full py-3 text-center text-sm font-semibold border-2 border-[var(--border)] hover:border-[var(--primary)] hover:bg-[var(--primary)] hover:text-black text-white rounded-xl transition-all duration-300 group/btn"
                  >
                    <Navigation className="w-4 h-4 group-hover/btn:rotate-45 transition-transform" />
                    Get Directions
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Section */}
          <div className="mt-16 bg-gradient-to-br from-[var(--surface-light)] to-[var(--surface)] border border-[var(--border)] rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Can't Find a Location Near You?
            </h2>
            <p className="text-[var(--text-secondary)] text-lg mb-8 max-w-2xl mx-auto">
              We offer delivery services across UAE. Contact us to arrange vehicle delivery to your preferred location.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="tel:+971501234567"
                className="px-8 py-4 bg-[var(--primary)] text-black font-semibold rounded-xl hover:bg-[var(--primary)]/90 transition-colors shadow-lg"
              >
                Call Us Now
              </a>
              <a 
                href="https://wa.me/971501234567"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-colors shadow-lg"
              >
                WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
