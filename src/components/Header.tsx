'use client';

import * as React from "react"
import Link from "next/link"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/Button"
import { 
  Car, 
  MapPin, 
  Phone, 
  User, 
  Menu, 
  X,
  Search,
  Heart
} from "lucide-react"
import { Input } from "@/components/ui/Input"

import { useRouter } from "next/navigation"

// ... imports

export function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/cars?search=${encodeURIComponent(search)}`);
      setMobileMenuOpen(false); // Close menu if open
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between mx-auto px-4">
         {/* Logo */}
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Car className="h-6 w-6 text-primary" />
          <span className="font-bold inline-block text-xl">
            RENTAL<span className="text-primary">X</span>
          </span>
        </Link>
        
        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="/cars" className="transition-colors hover:text-primary text-muted-foreground">Cars</Link>
          <Link href="/locations" className="transition-colors hover:text-primary text-muted-foreground">Locations</Link>
          <Link href="/services" className="transition-colors hover:text-primary text-muted-foreground">Services</Link>
          <Link href="/brands" className="transition-colors hover:text-primary text-muted-foreground">Brands</Link>
          <Link href="/blog" className="transition-colors hover:text-primary text-muted-foreground">Blog</Link>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
             <form onSubmit={handleSearch} className="relative hidden lg:flex items-center w-[200px]">
                 <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                 <Input
                  type="search"
                  placeholder="Search..."
                  className="pl-8 h-9"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                 />
             </form>
             
             {isAuthenticated ? (
               <div className="flex items-center gap-2">
                 <Link href="/wishlist">
                   <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                     <Heart className="h-5 w-5" />
                   </Button>
                 </Link>
                 <Link href="/dashboard">
                   <Button variant="ghost" size="sm">Dashboard</Button>
                 </Link>
                 <Button variant="ghost" size="sm" onClick={logout} className="text-destructive hover:bg-destructive/10">Sign Out</Button>
               </div>
             ) : (
                <div className="flex items-center gap-2">
                  <Link href="/auth/login">
                    <Button variant="ghost" size="sm">Log In</Button>
                  </Link>
                  <Link href="/auth/register">
                    <Button size="sm">Sign Up</Button>
                  </Link>
                </div>
             )}
             
             {/* Mobile Menu Toggle */}
             <Button 
               variant="ghost" 
               size="icon" 
               className="md:hidden"
               onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
             >
               {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
             </Button>
        </div>
      </div>
      
       {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t p-4 space-y-4 bg-background animate-in slide-in-from-top-2">
            <nav className="flex flex-col gap-4">
                 <Link href="/cars" className="font-medium text-lg" onClick={() => setMobileMenuOpen(false)}>Cars</Link>
                 <Link href="/locations" className="font-medium text-lg" onClick={() => setMobileMenuOpen(false)}>Locations</Link>
                 <Link href="/services" className="font-medium text-lg" onClick={() => setMobileMenuOpen(false)}>Services</Link>
                 <Link href="/brands" className="font-medium text-lg" onClick={() => setMobileMenuOpen(false)}>Brands</Link>
                 {isAuthenticated ? (
                    <>
                    <Link href="/dashboard" className="font-medium text-lg" onClick={() => setMobileMenuOpen(false)}>Dashboard</Link>
                    <button onClick={() => {logout(); setMobileMenuOpen(false)}} className="font-medium text-lg text-left text-destructive">Sign Out</button>
                    </>
                 ) : (
                    <div className="flex flex-col gap-2 mt-4">
                        <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)}>
                            <Button className="w-full" variant="outline">Log In</Button>
                        </Link>
                        <Link href="/auth/register" onClick={() => setMobileMenuOpen(false)}>
                            <Button className="w-full">Sign Up</Button>
                         </Link>
                    </div>
                 )}
            </nav>
        </div>
      )}
    </header>
  );
}
