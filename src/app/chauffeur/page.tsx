import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/Button';
import { Shield, Sparkles, Clock, Crown, ArrowRight } from 'lucide-react';

export default function ChauffeurPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[var(--background)]">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden py-20">
             {/* Fallback pattern if image fails */}
            <div className="absolute inset-0 bg-navy">
                <div className="absolute inset-0 bg-[url('/images/chauffeur-bg.jpg')] bg-cover bg-center opacity-40 mix-blend-overlay" />
                <div className="absolute inset-0 bg-gradient-to-t from-navy via-transparent to-navy/50" />
            </div>

            <div className="container mx-auto px-4 relative z-10 text-center space-y-6">
                <span className="inline-block px-4 py-1.5 rounded-full border border-gold/30 bg-gold/10 text-gold text-xs font-bold tracking-[0.2em] uppercase backdrop-blur-md animate-in fade-in slide-in-from-bottom-4 duration-700">
                    Premium Service
                </span>
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-black text-white leading-tight max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-100">
                    Driven by <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold to-amber-500">Excellence</span>
                </h1>
                <p className="text-gray-300 text-base md:text-xl lg:text-2xl max-w-2xl mx-auto font-light font-body animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
                    Sit back, relax, and let our professional chauffeurs take you where you need to go in ultimate comfort and style.
                </p>
                <div className="pt-8 animate-in fade-in zoom-in duration-1000 delay-300">
                    <Link href="/contact">
                        <Button className="h-12 md:h-14 px-6 md:px-8 text-base md:text-lg font-bold bg-white text-navy hover:bg-gold hover:text-navy rounded-full shadow-2xl shadow-white/10 transition-all">
                            Book a Chauffeur
                        </Button>
                    </Link>
                </div>
            </div>
        </section>

        {/* Features Grid */}
        <section className="py-16 md:py-24 bg-white relative">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 -mt-20 md:-mt-32 relative z-20">
                    {[
                        { icon: Crown, title: 'VIP Treatment', desc: 'Experience red-carpet service with our highly trained and discreet chauffeurs.' },
                        { icon: Clock, title: 'Punctuality', desc: 'We value your time. Our chauffeurs arrive 15 minutes early, every time.' },
                        { icon: Shield, title: 'Safe & Secure', desc: 'Navigate confidentially with our security-trained drivers and armored options.' },
                        { icon: Sparkles, title: 'Immaculate Fleet', desc: 'Choose from our range of pristine luxury sedans, limousines, and SUVs.' }
                    ].map((feature, idx) => (
                        <div key={idx} className="bg-white p-6 md:p-8 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 hover:-translate-y-2 transition-transform duration-300 group">
                            <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-navy flex items-center justify-center text-gold mb-4 md:mb-6 group-hover:bg-gold group-hover:text-navy transition-colors shadow-lg shadow-navy/20">
                                <feature.icon className="w-6 h-6 md:w-7 md:h-7" />
                            </div>
                            <h3 className="text-lg md:text-xl font-heading font-bold text-navy mb-2 md:mb-3">{feature.title}</h3>
                            <p className="text-gray-500 leading-relaxed text-sm font-body">
                                {feature.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        {/* Services List */}
        <section className="py-16 md:py-24 bg-gray-50">
             <div className="container mx-auto px-4">
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                     <div className="space-y-6 md:space-y-8 order-2 lg:order-1">
                         <h2 className="text-3xl md:text-5xl font-heading font-black text-navy leading-tight">
                             Services Tailored for <br/> <span className="text-electric">Every Occasion</span>
                         </h2>
                         <p className="text-gray-500 text-base md:text-lg leading-relaxed font-body">
                             Whether it's a high-stakes business meeting, a wedding, or an airport transfer, our chauffeur service ensures you arrive refreshed and on time.
                         </p>
                         
                         <div className="space-y-4 md:space-y-6">
                             {[
                                 'Airport Transfers (Ercan & Larnaca)',
                                 'Corporate & Business Travel',
                                 'Weddings & Special Events',
                                 'Private Island Tours',
                                 'Hourly As-Directed Service'
                             ].map((item, i) => (
                                 <div key={i} className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                     <div className="w-8 h-8 rounded-full bg-electric/10 flex items-center justify-center text-electric shrink-0">
                                         <ArrowRight className="w-4 h-4" />
                                     </div>
                                     <span className="font-bold text-navy text-sm md:text-base font-heading">{item}</span>
                                 </div>
                             ))}
                         </div>
                         
                         <div className="pt-4">
                             <Link href="/contact">
                                <Button variant="outline" className="h-12 border-navy text-navy hover:bg-navy hover:text-white rounded-xl px-8 font-bold w-full md:w-auto">
                                    Inquire for Rates
                                </Button>
                             </Link>
                         </div>
                     </div>
                     
                     <div className="relative h-[400px] md:h-[600px] bg-gray-200 rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl order-1 lg:order-2">
                         {/* Placeholder for service image */}
                         <div className="absolute inset-0 bg-navy flex items-center justify-center text-white/20">
                             <span className="font-heading font-black text-3xl md:text-4xl uppercase tracking-widest">Image</span>
                         </div>
                         <div className="absolute bottom-6 left-6 right-6 md:bottom-8 md:left-8 md:right-8 bg-white/90 backdrop-blur-md p-4 md:p-6 rounded-2xl border border-white/20 shadow-lg">
                             <div className="flex items-center gap-4">
                                 <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gold flex items-center justify-center text-navy font-bold text-base md:text-lg">
                                     24
                                 </div>
                                 <div className="flex-1">
                                     <h4 className="font-bold text-navy text-sm md:text-base font-heading">24/7 Availability</h4>
                                     <p className="text-gray-500 text-xs font-body">Always ready when you are.</p>
                                 </div>
                             </div>
                         </div>
                     </div>
                 </div>
             </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
