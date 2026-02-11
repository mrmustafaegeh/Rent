import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { Button } from "@/components/ui/Button"
import Link from "next/link"

export const metadata = {
  title: 'Blog | Car Rental Tips & News - RENTALX', 
  description: 'Latest news, car reviews, and travel tips from RENTALX.'
}

const posts = [
  {
    id: 1,
    title: "10 Best Road Trips in the UAE",
    excerpt: "Discover the most scenic drives across the Emirates, from Jebel Jais to the desert dunes.",
    date: "Oct 24, 2024",
    category: "Travel",
    image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
      id: 2,
      title: "Luxury vs. Sports: Which Should You Rent?",
      excerpt: "A comprehensive guide to helping you choose the perfect high-end vehicle for your needs.",
      date: "Nov 12, 2024",
      category: "Guides",
      image: "https://images.unsplash.com/photo-1503376763036-066120622c74?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
      id: 3,
      title: "Understanding Car Rental Insurance",
      excerpt: "Everything you need to know about CDW, LDW, and other insurance options.",
      date: "Dec 05, 2024",
      category: "Tips",
      image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  }
]

export default function BlogPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      
      <main className="flex-1 pt-24 pb-12">
        <div className="container mx-auto px-4">
             <div className="text-center max-w-2xl mx-auto mb-16">
                 <h1 className="text-4xl font-bold mb-4">Latest Insights</h1>
                 <p className="text-muted-foreground text-lg">News, reviews, and travel inspiration from our team of experts.</p>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                 {posts.map(post => (
                     <article key={post.id} className="flex flex-col bg-card border rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                         <div className="relative h-48 w-full bg-muted">
                             <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                         </div>
                         <div className="p-6 flex-1 flex flex-col">
                             <div className="flex items-center gap-2 mb-3">
                                 <span className="text-xs font-semibold px-2 py-1 bg-primary/10 text-primary rounded-full">{post.category}</span>
                                 <span className="text-xs text-muted-foreground">{post.date}</span>
                             </div>
                             <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{post.title}</h3>
                             <p className="text-muted-foreground text-sm mb-4 flex-1">{post.excerpt}</p>
                             <Button variant="link" className="px-0 self-start">Read More &rarr;</Button>
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
