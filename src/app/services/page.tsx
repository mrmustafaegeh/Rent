import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { Button } from "@/components/ui/Button"
import { Crown, Key, Clock, ShieldCheck, MapPin, Plane } from "lucide-react"

export const metadata = {
  title: 'Our Services | Chauffeur, Long Term, Delivery - RENTALX',
  description: 'Explore our premium car rental services including airport transfer, chauffeur service, and long-term leasing.'
}

const services = [
    {
        icon: Crown,
        title: "Chauffeur Service",
        description: "Professional drivers available for daily or hourly hire. Relax and let us handle the driving.",
        features: ["Certified Drivers", "Luxury Fleet", "24/7 Availability"]
    },
    {
        icon: Plane,
        title: "Airport Transfers",
        description: "Seamless transfer from DXB or AUH directly to your hotel or meeting.",
        features: ["Flight Tracking", "Meet & Greet", "Fixed Pricing"]
    },
    {
        icon: Clock,
        title: "Long Term Leasing",
        description: "Flexible monthly and yearly rental plans with full maintenance included.",
        features: ["Best Rates", "Maintenance Covered", "Flexible Terms"]
    },
    {
        icon: MapPin,
        title: "Doorstep Delivery",
        description: "We deliver your chosen vehicle directly to your home, office, or hotel.",
        features: ["Across UAE", "Real-time Tracking", "Sanitized Cars"]
    },
    {
        icon: ShieldCheck,
        title: "Corporate Fleet",
        description: "Tailored solutions for business needs with volume discounts and dedicated support.",
        features: ["Dedicated Account Manager", "VAT Compliant", "Priority Support"]
    },
    {
        icon: Key,
        title: "Supercar Experience",
        description: "Rent the world's most exclusive cars for special occasions or weekend drives.",
        features: ["No Deposit Options", "Track Days", "Events"]
    }
]

export default function ServicesPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      
      <main className="flex-1 pt-24 pb-20">
        <div className="container mx-auto px-4">
             <div className="text-center max-w-3xl mx-auto mb-16">
                 <h1 className="text-4xl md:text-5xl font-bold mb-6">Premium Mobility Services</h1>
                 <p className="text-muted-foreground text-xl">More than just car rental. We provide comprehensive mobility solutions tailored to your lifestyle.</p>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                 {services.map((service, idx) => (
                     <div key={idx} className="bg-card border p-8 rounded-2xl hover:border-primary/50 transition-colors group">
                         <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                             <service.icon className="w-7 h-7 text-primary group-hover:text-white" />
                         </div>
                         <h3 className="text-2xl font-bold mb-3">{service.title}</h3>
                         <p className="text-muted-foreground mb-6">{service.description}</p>
                         <ul className="space-y-2 mb-8">
                             {service.features.map(feat => (
                                 <li key={feat} className="flex items-center text-sm font-medium">
                                     <div className="w-1.5 h-1.5 rounded-full bg-primary mr-2" />
                                     {feat}
                                 </li>
                             ))}
                         </ul>
                         <Button variant="outline" className="w-full">Learn More</Button>
                     </div>
                 ))}
             </div>
             
             <div className="mt-20 bg-muted/30 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 border border-border">
                 <div className="flex-1">
                     <h2 className="text-3xl font-bold mb-4">Need a Custom Solution?</h2>
                     <p className="text-muted-foreground text-lg">Contact our concierge team for personalized arrangements, wedding fleets, or special requests.</p>
                 </div>
                 <div className="flex gap-4">
                     <Button size="lg">Contact Us</Button>
                     <Button size="lg" variant="secondary">Download Brochure</Button>
                 </div>
             </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
