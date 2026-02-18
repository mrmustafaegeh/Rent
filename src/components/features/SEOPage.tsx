import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { GoogleMapEmbed } from "@/components/ui/GoogleMapEmbed";
import { useTranslations } from "next-intl";
import { MapPin, ShieldCheck, Clock, CheckCircle2, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

interface SEOPageProps {
  namespace: string;
}

export function SEOPage({ namespace }: SEOPageProps) {
  const t = useTranslations(`SEO.${namespace}`);
  const common = useTranslations('Common');

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      
      <main className="flex-1">
        {/* Breadcrumbs */}
        <div className="bg-navy/5 py-4">
            <div className="container mx-auto px-4">
                <nav className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400">
                    <Link href="/" className="hover:text-gold transition-colors">Home</Link>
                    <ChevronRight className="w-3 h-3" />
                    <span className="text-navy">{t('h1')}</span>
                </nav>
            </div>
        </div>

        {/* Hero Section */}
        <section className="relative py-20 md:py-32 overflow-hidden bg-navy">
             <div className="absolute inset-0 bg-navy">
                  <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gold/10 rounded-full blur-[120px] -mr-32 -mt-32 pointer-events-none" />
                  <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-electric/5 rounded-full blur-[100px] -ml-24 -mb-24 pointer-events-none" />
             </div>

             <div className="container mx-auto px-4 relative z-10">
                 <div className="max-w-4xl mx-auto text-center space-y-6">
                    <h1 className="text-4xl md:text-7xl font-heading font-black text-white leading-tight">
                        {t('h1')}
                    </h1>
                    <p className="text-gray-300 text-lg md:text-xl font-light leading-relaxed max-w-2xl mx-auto">
                        {t('intro')}
                    </p>
                    <div className="flex flex-wrap justify-center gap-4 pt-8">
                        <Link href="/cars">
                            <Button className="h-14 px-10 rounded-full bg-gold text-navy font-black hover:bg-white hover:scale-105 transition-all shadow-xl shadow-gold/20">
                                Book Your Car Now
                            </Button>
                        </Link>
                        <Link href="/contact">
                            <Button variant="outline" className="h-14 px-10 rounded-full border-white/20 text-white hover:bg-white/10 font-black">
                                Contact Concierge
                            </Button>
                        </Link>
                    </div>
                 </div>
             </div>
        </section>

        {/* Content Sections */}
        <section className="py-24 bg-white">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                    <div className="lg:col-span-2 space-y-16">
                        {/* Dynamically render sections if they exist in translations */}
                        {/* For now, we'll use a fixed structure or map if the layout allows */}
                        <div className="prose prose-lg max-w-none text-gray-600 font-body leading-relaxed space-y-8">
                            <h2 className="text-3xl font-heading font-black text-navy">{t('title')}</h2>
                            <p>{t('intro')}</p>
                            
                            {/* Assuming a certain structure in translations */}
                            <div className="space-y-12 py-8">
                                <div className="space-y-4">
                                    <h3 className="text-2xl font-heading font-bold text-navy">Why Choose RentalX?</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                                        {[
                                            { icon: ShieldCheck, title: "Full Insurance", desc: "Comprehensive CDW included with all rentals." },
                                            { icon: Clock, title: "24/7 Support", desc: "Roadside assistance and concierge available anytime." },
                                            { icon: MapPin, title: "Location Pickup", desc: "Free delivery to Ercan Airport and major hotels." },
                                            { icon: CheckCircle2, title: "Instant Booking", desc: "No waiting. Get immediate confirmation." },
                                        ].map((item, i) => (
                                            <div key={i} className="flex gap-4 p-6 rounded-3xl bg-gray-50 border border-gray-100 italic font-medium">
                                                <item.icon className="w-8 h-8 text-gold shrink-0" />
                                                <div>
                                                    <h4 className="font-bold text-navy mb-1">{item.title}</h4>
                                                    <p className="text-sm text-gray-500 leading-snug">{item.desc}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <aside className="lg:col-span-1 space-y-8">
                        <div className="bg-navy p-8 rounded-[2rem] text-white space-y-6 sticky top-24 shadow-2xl">
                            <h3 className="text-xl font-heading font-bold text-gold">Ready to Drive?</h3>
                            <p className="text-gray-400 text-sm italic">Join 2,000+ happy travelers who explored Cyprus with Mediterranean Drive.</p>
                            <div className="space-y-4">
                                <Link href="/cars" className="block">
                                    <Button className="w-full h-14 bg-gold text-navy font-black rounded-xl border-none">
                                        Browse Fleet
                                    </Button>
                                </Link>
                                <div className="text-center pt-2">
                                    <span className="text-xs font-bold uppercase tracking-widest text-gray-500">Starting from</span>
                                    <p className="text-3xl font-heading font-black text-white">€30<span className="text-sm font-normal text-gray-400">/day</span></p>
                                </div>
                            </div>
                            <div className="pt-6 border-t border-white/10 space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                                        <CheckCircle2 className="w-4 h-4 text-gold" />
                                    </div>
                                    <span className="text-xs font-medium">No hidden fees</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                                        <CheckCircle2 className="w-4 h-4 text-gold" />
                                    </div>
                                    <span className="text-xs font-medium">Free cancellation</span>
                                </div>
                            </div>
                        </div>

                        {/* Location Map */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-heading font-bold text-navy px-2">Local Branch</h3>
                            <GoogleMapEmbed location={namespace === 'northCyprus' ? "Kyrenia" : namespace} />
                        </div>
                    </aside>
                </div>
            </div>
        </section>

        {/* FAQ Section */}
        <section className="py-24 bg-gray-50 border-t border-gray-100">
            <div className="container mx-auto px-4">
                <div className="max-w-3xl mx-auto space-y-12">
                     <div className="text-center space-y-4">
                         <h2 className="text-3xl md:text-4xl font-heading font-black text-navy uppercase tracking-tight">Need to Know</h2>
                         <div className="w-20 h-1.5 bg-gold mx-auto rounded-full" />
                     </div>
                     <div className="space-y-6">
                        {[1, 2, 3].map((i) => (
                             <div key={i} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                <h4 className="font-heading font-bold text-navy text-lg mb-3">Is delivery available to my location?</h4>
                                <p className="text-gray-500 leading-relaxed italic">Yes, we provide island-wide delivery including Ercan Airport, Kyrenia Harbour, and all major hotels in Nicosia and Famagusta. Simply specify your location during checkout.</p>
                             </div>
                        ))}
                     </div>
                </div>
            </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
