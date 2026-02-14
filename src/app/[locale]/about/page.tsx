import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import OptimizedImage from "@/components/ui/OptimizedImage"
import { Users, Target, Shield, Award } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[var(--background)]">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden bg-navy">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
             <div className="absolute inset-0 bg-navy">
                 <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-electric/10 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none" />
                 <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gold/5 rounded-full blur-[100px] -ml-24 -mb-24 pointer-events-none" />
            </div>

            <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl space-y-6">
                <span className="text-gold font-bold uppercase tracking-widest text-xs mb-4 block">Our Story</span>
                <h1 className="text-4xl md:text-6xl font-heading font-black text-white leading-tight">
                    Redefining Luxury <br/> Mobility in <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold to-yellow-500">North Cyprus</span>
                </h1>
                <p className="text-gray-300 text-lg md:text-xl font-body font-light leading-relaxed max-w-2xl mx-auto">
                    Mediterranean Drive was born from a passion for exceptional automobiles and a desire to elevate the car rental experience to a concierge-level service.
                </p>
            </div>
        </section>

        {/* Vision & Values */}
        <section className="py-24 bg-white">
             <div className="container mx-auto px-4">
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
                     <div className="order-2 lg:order-1 relative rounded-3xl overflow-hidden shadow-2xl shadow-gray-200 aspect-[4/3]">
                         <OptimizedImage 
                             src="/images/about-hero.jpg" 
                             alt="Luxury Fleet" 
                             fill 
                             className="object-cover"
                         />
                         <div className="absolute inset-0 bg-gradient-to-t from-navy/80 to-transparent flex items-end p-8">
                             <div className="text-white">
                                 <p className="font-heading font-bold text-2xl mb-1">Kyrenia HQ</p>
                                 <p className="text-gray-300 text-sm">Where our journey began in 2024</p>
                             </div>
                         </div>
                     </div>
                     <div className="order-1 lg:order-2 space-y-8">
                         <h2 className="text-3xl md:text-4xl font-heading font-black text-navy">Driven by Excellence</h2>
                         <p className="text-gray-500 text-lg leading-relaxed font-body">
                             We don't just rent cars; we curate journeys. Recognizing a gap in the market for reliable, premium, and transparent vehicle rentals, we established a fleet that speaks for itself. From the moment you land to the moment you depart, we ensure every mile is a memory.
                         </p>
                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                             <div className="flex gap-4">
                                 <div className="w-12 h-12 rounded-xl bg-navy/5 flex items-center justify-center text-navy shrink-0">
                                     <Target className="w-6 h-6" />
                                 </div>
                                 <div>
                                     <h3 className="font-bold text-navy text-lg">Our Mission</h3>
                                     <p className="text-sm text-gray-500 leading-relaxed">To provide the most seamless and prestigious car rental experience in the Mediterranean.</p>
                                 </div>
                             </div>
                             <div className="flex gap-4">
                                 <div className="w-12 h-12 rounded-xl bg-navy/5 flex items-center justify-center text-navy shrink-0">
                                     <Award className="w-6 h-6" />
                                 </div>
                                 <div>
                                     <h3 className="font-bold text-navy text-lg">Our Promise</h3>
                                     <p className="text-sm text-gray-500 leading-relaxed">No hidden fees, guaranteed model booking, and 24/7 concierge support.</p>
                                 </div>
                             </div>
                         </div>
                     </div>
                 </div>

                 <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-gray-100 pt-12">
                     {[
                         { label: 'Premium Vehicles', value: '50+' },
                         { label: 'Happy Clients', value: '2k+' },
                         { label: 'Years Experience', value: '10+' },
                         { label: 'Support', value: '24/7' }
                     ].map((stat, i) => (
                         <div key={i} className="text-center group">
                             <h4 className="text-4xl md:text-5xl font-heading font-black text-navy mb-2 group-hover:scale-110 transition-transform">{stat.value}</h4>
                             <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">{stat.label}</p>
                         </div>
                     ))}
                 </div>
             </div>
        </section>

        {/* Team / Culture */}
        <section className="py-24 bg-gray-50 relative overflow-hidden">
             {/* Decorative Elements */}
             <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white rounded-full blur-[80px] -mr-32 -mt-32 pointer-events-none" />
             
             <div className="container mx-auto px-4 relative z-10 text-center max-w-3xl space-y-6">
                 <div className="w-16 h-16 rounded-full bg-white shadow-lg mx-auto flex items-center justify-center text-gold mb-6">
                     <Users className="w-8 h-8" />
                 </div>
                 <h2 className="text-3xl md:text-4xl font-heading font-black text-navy">Meet the Team</h2>
                 <p className="text-gray-500 text-lg leading-relaxed font-body">
                     Behind every smooth wheel turn is a dedicated team of automotive enthusiasts, logistics experts, and customer service professionals working tirelessly to ensure your satisfaction.
                 </p>
             </div>
        </section>

      </main>
      <Footer />
    </div>
  )
}
