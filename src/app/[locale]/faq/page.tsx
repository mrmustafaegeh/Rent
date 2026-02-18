import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useTranslations } from "next-intl";
import { HelpCircle, ChevronRight, MessageSquare, PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export default function FAQPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      
      <main className="flex-1">
        {/* Support Hero */}
        <section className="bg-navy py-24 relative overflow-hidden">
             <div className="container mx-auto px-4 relative z-10">
                 <div className="max-w-3xl">
                    <span className="text-gold font-bold uppercase tracking-[0.3em] text-[10px] mb-4 block italic">Help Center</span>
                    <h1 className="text-5xl md:text-7xl font-heading font-black text-white mb-6 italic">
                        Common <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold to-yellow-500">Concerns</span>
                    </h1>
                    <p className="text-gray-400 text-xl font-body italic">
                        Everything you need to know about the RentalX experience.
                    </p>
                 </div>
             </div>
        </section>

        <section className="py-24">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto space-y-16">
                    
                    {/* Documents & Requirements */}
                    <div className="space-y-8">
                        <div className="flex items-center gap-4">
                             <div className="w-12 h-12 rounded-2xl bg-gold/10 flex items-center justify-center text-gold">
                                <HelpCircle className="w-6 h-6" />
                             </div>
                             <h2 className="text-3xl font-heading font-black text-navy italic uppercase tracking-tight">Eligibility & Documents</h2>
                        </div>
                        
                        <div className="grid grid-cols-1 gap-6">
                            {[
                                { 
                                    q: "What documents do I need to rent a car?", 
                                    a: "You must provide a valid driver's license (held for at least 2 years), your passport or national ID, and a credit card for the security deposit. International permits are only required if your license is not in Roman script." 
                                },
                                { 
                                    q: "What is the minimum age to rent?", 
                                    a: "The minimum age is 21 for economy cars and 25 for luxury and large SUVs. Maximum age for rental is 75." 
                                }
                            ].map((item, i) => (
                                <div key={i} className="p-8 rounded-3xl bg-gray-50 border border-gray-100 italic transition-all hover:shadow-xl hover:bg-white">
                                    <h4 className="font-heading font-bold text-navy text-lg mb-3">{item.q}</h4>
                                    <p className="text-gray-500 leading-relaxed">{item.a}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Booking & Payment */}
                    <div className="space-y-8">
                        <div className="flex items-center gap-4">
                             <div className="w-12 h-12 rounded-2xl bg-navy/5 flex items-center justify-center text-navy font-bold">BY</div>
                             <h2 className="text-3xl font-heading font-black text-navy italic uppercase tracking-tight">Booking & Payment</h2>
                        </div>
                        
                        <div className="grid grid-cols-1 gap-6">
                            {[
                                { 
                                    q: "How do I pay for my rental?", 
                                    a: "We accept major Credit Cards (Visa/Mastercard), PayPal, and Cash on delivery (limited to certain categories). A security deposit is mandatory for all rentals." 
                                },
                                { 
                                    q: "Can I cancel my reservation?", 
                                    a: "Yes, we offer free cancellation up to 48 hours before your scheduled pickup time. Cancellations within 48 hours may be subject to a one-day rental fee." 
                                }
                            ].map((item, i) => (
                                <div key={i} className="p-8 rounded-3xl bg-gray-50 border border-gray-100 italic transition-all hover:shadow-xl hover:bg-white">
                                    <h4 className="font-heading font-bold text-navy text-lg mb-3">{item.q}</h4>
                                    <p className="text-gray-500 leading-relaxed">{item.a}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Support CTA */}
                    <div className="bg-navy rounded-[3rem] p-12 text-center space-y-8 relative overflow-hidden shadow-2xl">
                         <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 rounded-full blur-[100px] pointer-events-none" />
                         <h3 className="text-3xl font-heading font-black text-white italic">Still have questions?</h3>
                         <p className="text-gray-400 max-w-xl mx-auto italic font-body">Our 24/7 concierge team is ready to assist you with any custom requests or complicated itineraries.</p>
                         <div className="flex flex-wrap justify-center gap-4 pt-4">
                             <Link href="/contact">
                                <Button className="bg-gold text-navy font-black h-14 px-10 rounded-full hover:bg-white transition-all shadow-xl shadow-gold/10">
                                    Contact Support
                                </Button>
                             </Link>
                             <Button variant="outline" className="border-white/20 text-white font-black h-14 px-10 rounded-full hover:bg-white/10">
                                WhatsApp Concierge
                             </Button>
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
