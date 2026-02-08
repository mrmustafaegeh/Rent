import { Metadata } from 'next';
import Link from 'next/link';
import OptimizedImage from '@/components/ui/OptimizedImage';

export const metadata: Metadata = {
  title: 'About RENTALX | Premium Car Rental Dubai',
  description: 'RentalX is Dubai\'s premier luxury car rental marketplace. Learn about our mission, vision, and commitment to excellence.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] pb-20 pt-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Mission / Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
           <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                 Driving Excellence
                 <span className="block text-[var(--primary)]">Since 2024</span>
              </h1>
              <p className="text-[var(--text-secondary)] text-lg leading-relaxed">
                 RENTALX was founded with a singular mission: to provide the most seamless, transparent, and premium car rental experience in the UAE. We recognized the complexity and lack of trust in the traditional market and built a platform that puts the customer first.
              </p>
              <div className="flex gap-4">
                 <Link href="/fleet" className="px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-100 transition-colors">
                    Explore Fleet
                 </Link>
                 <Link href="/contact" className="px-6 py-3 border border-[var(--border)] text-white hover:border-[var(--primary)] transition-colors rounded-lg">
                    Contact Us
                 </Link>
              </div>
           </div>
           <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-2xl skew-y-3 hover:skew-y-0 transition-transform duration-500">
               <OptimizedImage 
                 src="https://images.unsplash.com/photo-1562911791-c7a97b729ec5?q=80&w=2137&auto=format&fit=crop" 
                 alt="Luxury Car Fleet" 
                 fill
                 className="object-cover w-full h-full"
                 priority
               />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
              <div className="absolute bottom-6 left-6">
                 <h3 className="text-2xl font-bold text-white">Premium Quality</h3>
                 <p className="text-white/80">Every vehicle inspected before rental</p>
              </div>
           </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 py-12 border-y border-[var(--border)]">
           {[
              { label: 'Vehicles in Fleet', value: '150+' },
              { label: 'Happy Customers', value: '5,000+' },
              { label: 'Years Experience', value: '10+' },
              { label: 'Emirates Covered', value: '7' }
           ].map((stat, i) => (
              <div key={i} className="text-center group hover:scale-105 transition-transform duration-300">
                 <h4 className="text-4xl lg:text-5xl font-bold text-[var(--primary)] mb-2" style={{ textShadow: '0 0 20px rgba(255,255,255,0.2)' }}>{stat.value}</h4>
                 <p className="text-[var(--text-secondary)] uppercase tracking-wider text-sm">{stat.label}</p>
              </div>
           ))}
        </div>

        {/* Why Choose Us */}
        <div className="text-center space-y-12">
            <h2 className="text-3xl font-bold text-white">Why Choose RENTALX?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
               <div className="p-8 bg-[var(--surface-light)] rounded-xl border border-[var(--border)]">
                  <div className="w-12 h-12 bg-blue-500/20 text-blue-400 rounded-lg flex items-center justify-center mb-6">
                     <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Verified Listings</h3>
                  <p className="text-[var(--text-secondary)]">Every car on our platform is verified for quality, insurance, and proper documentation.</p>
               </div>
               <div className="p-8 bg-[var(--surface-light)] rounded-xl border border-[var(--border)]">
                  <div className="w-12 h-12 bg-green-500/20 text-green-400 rounded-lg flex items-center justify-center mb-6">
                     <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Transparent Pricing</h3>
                  <p className="text-[var(--text-secondary)]">What you see is what you pay. No hidden administration fees or surprise charges at pickup.</p>
               </div>
               <div className="p-8 bg-[var(--surface-light)] rounded-xl border border-[var(--border)]">
                  <div className="w-12 h-12 bg-purple-500/20 text-purple-400 rounded-lg flex items-center justify-center mb-6">
                     <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">24/7 Support</h3>
                  <p className="text-[var(--text-secondary)]">Our dedicated support team is available around the clock to assist you with any questions.</p>
               </div>
            </div>
        </div>
      </div>
    </div>
  );
}
