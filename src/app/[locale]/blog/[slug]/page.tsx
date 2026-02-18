import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { Calendar, User, Tag, ChevronLeft } from "lucide-react";

const posts = {
  "how-to-rent-a-car-north-cyprus": {
    title: "How to Rent a Car in North Cyprus: Complete Tourist Guide",
    date: "Feb 15, 2026",
    category: "Guides",
    author: "RentalX Team",
    image: "https://images.unsplash.com/photo-1542296332-2e4473faf563?q=80&w=1200&auto=format&fit=crop",
    content: `
      <h2>The Ultimate Guide to Renting a Car in Northern Cyprus</h2>
      <p>Renting a car in Northern Cyprus (TRNC) is the most efficient and comfortable way to explore the island's stunning coastline, historic castles, and mountain villages.</p>
      <h3>1. Drivers License Requirements</h3>
      <p>To rent a car in the TRNC, you must hold a valid driver's license from your home country. Most international licenses are accepted as long as they are written in Roman script.</p>
      <h3>2. Driving on the Left</h3>
      <p>Traffic in North Cyprus moves on the left-hand side of the road. If you are used to driving on the right, don't worry—most rental cars have red license plates signaling to locals that the driver is likely a tourist.</p>
    `
  },
  "driving-rules-trnc": {
    title: "Driving Rules and Road Laws in the TRNC",
    date: "Feb 10, 2026",
    category: "Safety",
    author: "RentalX Safety",
    image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    content: `
      <h2>Stay Safe: Traffic Laws in Northern Cyprus</h2>
      <p>Understanding the local rules is key to a safe trip. The TRNC has strict laws regarding speed and alcohol consumption.</p>
      <h3>Speed Limits</h3>
      <p>Limits are 50km/h in cities and up to 100km/h on highways. Speed cameras are frequent and penalties are high.</p>
      <h3>Zero Tolerance</h3>
      <p>The legal limit for alcohol is extremely low. We recommend zero consumption if you are driving.</p>
    `
  },
  "ercan-airport-car-rental-guide": {
    title: "Ercan Airport Car Rental: Everything You Need to Know",
    date: "Feb 05, 2026",
    category: "Airport",
    author: "Terminal Ops",
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109c0f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    content: `
      <h2>Picking up Your Car at Ercan (ECN)</h2>
      <p>Ercan Airport is the primary entry point for North Cyprus. Our airport service is designed for maximum speed.</p>
      <h3>Terminal Meeting</h3>
      <p>Your RentalX driver will meet you at the arrivals gate with a name sign. No shuttles are required; your car is parked right at the terminal.</p>
    `
  },
  "best-cars-cyprus-mountains": {
    title: "Best Cars for Cyprus Mountain Roads",
    date: "Feb 01, 2026",
    category: "Fleet",
    author: "RentalX Team",
    image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    content: `
      <h2>Conquering the Five-Finger Mountains</h2>
      <p>While the roads in North Cyprus are generally good, some of the most beautiful views are found up steep mountain tracks.</p>
      <h3>Why an SUV?</h3>
      <p>An SUV offers better ground clearance and visibility for the winding roads leading to St. Hilarion Castle and Buffavento.</p>
    `
  },
  "car-rental-insurance-explained": {
    title: "Car Rental Insurance Explained — What Is Covered?",
    date: "Jan 28, 2026",
    category: "Insurance",
    author: "Admin",
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    content: `
      <h2>Demystified: Car Rental Insurance in TRNC</h2>
      <p>Insurance terminology can be confusing. Here is what you need to know about your coverage.</p>
      <h3>CDW vs Super CDW</h3>
      <p>Standard Collision Damage Waiver covers major accidents with a deductible, while Super CDW removes your excess responsibility entirely.</p>
    `
  },
  "tourist-driving-tips-cyprus": {
    title: "Tourist Driving Tips for Northern Cyprus",
    date: "Jan 25, 2026",
    category: "Tips",
    author: "RentalX Team",
    image: "https://images.unsplash.com/photo-1549112180-f3890886c57f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    content: `
      <h2>Drive Like a Local</h2>
      <p>Tips from our team to help you navigate the island like a pro.</p>
      <h3>Roundabouts</h3>
      <p>Traffic in roundabouts has the right of way. Always signal your exit.</p>
      <h3>The Red Number Plates</h3>
      <p>All rental cars in North Cyprus have distinctive red license plates. This is for your safety, helping locals identify you as a visitor.</p>
    `
  }
};

export default async function BlogPostPage({ 
  params 
}: { 
  params: Promise<{ locale: string, slug: string }> 
}) {
  const { slug } = await params;
  const post = (posts as any)[slug];

  if (!post) return <div className="p-20 text-center font-heading font-black text-navy text-2xl">Article Not Found</div>;

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      
      <main className="flex-1">
        {/* Article Hero */}
        <section className="relative h-[60vh] min-h-[400px] overflow-hidden">
            <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/20 to-transparent" />
            
            <div className="absolute bottom-0 left-0 w-full pb-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl space-y-6">
                        <Link href="/blog" className="inline-flex items-center gap-2 text-gold font-black text-[10px] uppercase tracking-[0.2em] mb-4 hover:translate-x-[-4px] transition-transform">
                            <ChevronLeft className="w-4 h-4" /> Back to Journal
                        </Link>
                        <h1 className="text-4xl md:text-6xl font-heading font-black text-white leading-tight italic">
                            {post.title}
                        </h1>
                        <div className="flex flex-wrap items-center gap-6 pt-4">
                            <div className="flex items-center gap-2 text-white/80">
                                <Calendar className="w-4 h-4 text-gold" />
                                <span className="text-xs font-bold uppercase tracking-widest">{post.date}</span>
                            </div>
                            <div className="flex items-center gap-2 text-white/80">
                                <User className="w-4 h-4 text-gold" />
                                <span className="text-xs font-bold uppercase tracking-widest">{post.author}</span>
                            </div>
                             <div className="flex items-center gap-2 text-white/80">
                                <Tag className="w-4 h-4 text-gold" />
                                <span className="text-xs font-bold uppercase tracking-widest">{post.category}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* Article Content */}
        <article className="py-24">
             <div className="container mx-auto px-4">
                 <div className="max-w-3xl mx-auto">
                    <div 
                        className="prose prose-lg prose-navy font-body text-gray-600 leading-relaxed italic
                                   prose-headings:font-heading prose-headings:font-black prose-headings:text-navy
                                   prose-h2:text-3xl prose-h2:italic prose-h3:text-xl
                                   prose-img:rounded-[2rem] prose-img:shadow-2xl"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />
                    
                    <div className="mt-20 pt-12 border-t border-gray-100 italic">
                        <h4 className="font-heading font-black text-navy text-xl mb-6">Explore More</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                             {Object.entries(posts).filter(([k]) => k !== slug).slice(0, 2).map(([k, p]) => (
                                <Link key={k} href={`/blog/${k}`} className="group space-y-4">
                                    <div className="relative h-48 rounded-3xl overflow-hidden shadow-lg border border-gray-100 italic transition-all group-hover:shadow-2xl">
                                        <img src={p.image} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                                    </div>
                                    <h5 className="font-heading font-bold text-navy group-hover:text-gold transition-colors">{p.title}</h5>
                                </Link>
                             ))}
                        </div>
                    </div>
                 </div>
             </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
