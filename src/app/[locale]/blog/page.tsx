import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { Button } from "@/components/ui/Button"
import Link from "next/link"

export const metadata = {
  title: 'Blog | North Cyprus Car Rental Tips - RentalX', 
  description: 'Expert advice, driving rules, and travel guides for renting a car in Northern Cyprus (TRNC).'
}

const posts = [
  {
    id: 1,
    slug: "how-to-rent-a-car-north-cyprus",
    title: "How to Rent a Car in North Cyprus: Complete Tourist Guide",
    excerpt: "Everything you need to know about documentation, age limits, and picking up your car in the TRNC.",
    date: "Feb 15, 2026",
    category: "Guides",
    image: "https://images.unsplash.com/photo-1542296332-2e4473faf563?q=80&w=1200&auto=format&fit=crop"
  },
  {
    id: 2,
    slug: "driving-rules-trnc",
    title: "Driving Rules and Road Laws in the TRNC",
    excerpt: "Stay safe on the roads. A comprehensive guide to Northern Cyprus traffic laws and driving etiquette.",
    date: "Feb 10, 2026",
    category: "Safety",
    image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 3,
    slug: "ercan-airport-car-rental-guide",
    title: "Ercan Airport Car Rental: Everything You Need to Know",
    excerpt: "Pick up your car directly at Ercan (ECN). Learn about meeting points, airport fees, and return procedures.",
    date: "Feb 05, 2026",
    category: "Airport",
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109c0f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 4,
    slug: "best-cars-cyprus-mountains",
    title: "Best Cars for Cyprus Mountain Roads",
    excerpt: "Heading to the Five-Finger mountains or Troodos foothills? Here are the best SUVs and compacts for the terrain.",
    date: "Feb 01, 2026",
    category: "Fleet",
    image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 5,
    slug: "car-rental-insurance-explained",
    title: "Car Rental Insurance Explained — What Is Covered?",
    excerpt: "Don't be confused by CDW, Excess, and TP. We break down exactly what you're paying for.",
    date: "Jan 28, 2026",
    category: "Insurance",
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 6,
    slug: "tourist-driving-tips-cyprus",
    title: "Tourist Driving Tips for Northern Cyprus",
    excerpt: "From navigating roundabouts to handling red number plates, these tips will keep you moving safely.",
    date: "Jan 25, 2026",
    category: "Tips",
    image: "https://images.unsplash.com/photo-1549112180-f3890886c57f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  }
]

export default function BlogPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      
      <main className="flex-1 pt-24 pb-12">
        <div className="container mx-auto px-4">
             <div className="text-center max-w-2xl mx-auto mb-16">
                 <span className="text-gold font-bold uppercase tracking-[0.3em] text-[10px] mb-4 block italic">Our Journal</span>
                 <h1 className="text-4xl md:text-6xl font-heading font-black text-navy mb-4 italic">Latest Insights</h1>
                 <p className="text-gray-500 text-lg font-body">Expert advice and travel inspiration for your North Cyprus journey.</p>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                 {posts.map(post => (
                     <article key={post.id} className="flex flex-col bg-white border border-gray-100 rounded-[2rem] overflow-hidden hover:shadow-2xl transition-all group duration-500">
                         <div className="relative h-64 w-full overflow-hidden">
                             <img 
                                src={post.image} 
                                alt={post.title} 
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                             />
                             <div className="absolute top-6 left-6">
                                <span className="text-[10px] font-black uppercase tracking-widest px-4 py-2 bg-white/90 backdrop-blur-md text-navy rounded-full shadow-lg">
                                    {post.category}
                                </span>
                             </div>
                         </div>
                         <div className="p-8 flex-1 flex flex-col">
                             <div className="flex items-center gap-2 mb-4">
                                 <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{post.date}</span>
                             </div>
                             <h3 className="text-2xl font-heading font-black mb-4 text-navy group-hover:text-gold transition-colors leading-tight">
                                 {post.title}
                             </h3>
                             <p className="text-gray-500 text-sm mb-8 flex-1 leading-relaxed italic">
                                 {post.excerpt}
                             </p>
                             <Link href={`/blog/${post.slug}`} className="mt-auto">
                                <Button variant="outline" className="rounded-full px-8 border-navy/10 hover:bg-navy hover:text-white font-black text-xs uppercase tracking-widest">
                                    Read Article
                                </Button>
                             </Link>
                         </div>
                     </article>
                 ))}
             </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
