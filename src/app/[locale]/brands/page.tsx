import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { BrandGrid } from "@/components/features/home/BrandGrid"
import { Badge } from "@/components/ui/Badge"

export const metadata = {
  title: 'All Brands | Luxury Car Rental Brands - RENTALX',
  description: 'Browse our extensive collection of car brands including Ferrari, Lamborghini, Rolls Royce, and more.'
}

const featuredBrands = [
  { name: 'Ferrari', count: 12, topModel: 'F8 Tributo' },
  { name: 'Lamborghini', count: 8, topModel: 'Urus' },
  { name: 'Porsche', count: 15, topModel: '911 Turbo S' },
  { name: 'Rolls Royce', count: 5, topModel: 'Ghost' }
]

export default function BrandsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      
      <main className="flex-1 pt-24 pb-12">
        <div className="container mx-auto px-4">
             <div className="text-center max-w-4xl mx-auto mb-16 space-y-4">
                 <Badge variant="outline" className="mb-2">Official Partners</Badge>
                 <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">World Class. <span className="text-primary">Driven by You.</span></h1>
                 <p className="text-muted-foreground text-xl max-w-2xl mx-auto">
                     We partner with the world's most prestigious automotive manufacturers to bring you an unparalleled driving experience.
                 </p>
             </div>

             {/* Featured Stats */}
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
                 {featuredBrands.map((b) => (
                     <div key={b.name} className="bg-card border p-6 rounded-xl text-center hover:border-primary transition-colors cursor-pointer">
                         <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-orange-500 mb-1">{b.name}</h3>
                         <p className="text-sm font-medium text-muted-foreground">{b.count} Vehicles Available</p>
                         <div className="mt-4 pt-4 border-t text-xs text-muted-foreground">
                             Review Top Model: <span className="font-semibold text-foreground">{b.topModel}</span>
                         </div>
                     </div>
                 ))}
             </div>
             
             <BrandGrid />
             
             <div className="mt-20 text-center">
                 <h3 className="text-2xl font-bold mb-4">Don't see your favorite brand?</h3>
                 <p className="text-muted-foreground mb-8">We are constantly updating our fleet. Request a specific vehicle and we'll do our best to source it for you.</p>
             </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
