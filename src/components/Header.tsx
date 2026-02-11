'use client';

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/Button"
import { 
  Car, 
  Menu, 
  X,
  Globe,
  DollarSign,
  User,
  ChevronDown
} from "lucide-react"

export function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const pathname = usePathname();
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: "Rent Cars", href: "/cars" },
    { name: "Buy Cars", href: "/buy" },
    { name: "Chauffeur", href: "/chauffeur" },
    { name: "Locations", href: "/locations" },
    { name: "About", href: "/about" },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <header 
      className={`sticky top-0 z-[1000] w-full border-b transition-all duration-300 ${
        scrolled 
          ? "bg-[#0A1628]/95 backdrop-blur-[20px] border-white/10 shadow-lg py-2" 
          : "bg-[#0A1628]/85 backdrop-blur-[10px] border-white/5 py-4"
      }`}
    >
      <div className="container flex h-full items-center justify-between mx-auto px-4">
         {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-tr from-navy to-electric group-hover:rotate-180 transition-transform duration-700">
             <Car className="h-6 w-6 text-white" />
          </div>
          <span className="font-heading font-black text-2xl tracking-tight text-white">
            MEDITERRANEAN<span className="text-gold">DRIVE</span>
          </span>
        </Link>
        
        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link 
              key={link.name}
              href={link.href} 
              className={`relative font-heading font-medium text-[15px] transition-colors hover:text-electric group ${
                isActive(link.href) ? "text-gold" : "text-white/80"
              }`}
            >
              {link.name}
              <span className={`absolute -bottom-1 left-0 w-0 h-[2px] bg-electric transition-all duration-300 group-hover:w-full ${
                  isActive(link.href) ? "w-full bg-gold" : ""
              }`} />
            </Link>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="hidden lg:flex items-center gap-4">
             {/* Language & Currency (Mock) */}
             <div className="flex items-center gap-3 text-white/70 text-sm border-r border-white/10 pr-4 mr-2">
                <button className="flex items-center gap-1 hover:text-white transition-colors">
                    <Globe className="h-4 w-4" />
                    <span>EN</span>
                </button>
                <button className="flex items-center gap-1 hover:text-white transition-colors">
                    <DollarSign className="h-4 w-4" />
                    <span>EUR</span>
                </button>
             </div>

             {isAuthenticated ? (
               <div className="flex items-center gap-3">
                 <Link href="/dashboard">
                   <Button variant="ghost" className="text-white hover:text-electric hover:bg-white/5">
                     Dashboard
                   </Button>
                 </Link>
                 <Button 
                    variant="ghost" 
                    onClick={logout} 
                    className="text-white/70 hover:text-destructive hover:bg-destructive/10"
                 >
                    Sign Out
                 </Button>
               </div>
             ) : (
                <Link href="/auth/login">
                  <Button variant="ghost" className="text-white hover:text-electric hover:bg-white/5 border border-white/20 hover:border-electric transition-all">
                    Sign In
                  </Button>
                </Link>
             )}

             <Link href="/list-your-car">
                <Button className="bg-gradient-to-r from-gold to-yellow-500 text-navy font-bold hover:scale-105 hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all duration-300 border-none">
                   List Your Car
                </Button>
             </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="lg:hidden text-white hover:bg-white/10"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>
      
       {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-[70px] bg-navy/95 backdrop-blur-xl z-[900] p-6 animate-in slide-in-from-right-10 duration-300">
            <nav className="flex flex-col gap-6 mt-8">
                 {navLinks.map((link) => (
                    <Link 
                        key={link.name}
                        href={link.href} 
                        className="font-heading font-semibold text-2xl text-white hover:text-gold transition-colors flex justify-between items-center group" 
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        {link.name}
                        <span className="text-white/20 group-hover:text-gold transition-colors">→</span>
                    </Link>
                 ))}
                 
                 <div className="h-px bg-white/10 my-4" />

                 {isAuthenticated ? (
                    <>
                    <Link href="/dashboard" className="font-heading font-medium text-xl text-white" onClick={() => setMobileMenuOpen(false)}>Dashboard</Link>
                    <button onClick={() => {logout(); setMobileMenuOpen(false)}} className="font-heading font-medium text-xl text-left text-destructive">Sign Out</button>
                    </>
                 ) : (
                    <div className="flex flex-col gap-4">
                        <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)}>
                            <Button className="w-full h-12 text-lg border-white/20 text-white" variant="outline">Sign In</Button>
                        </Link>
                        <Link href="/list-your-car" onClick={() => setMobileMenuOpen(false)}>
                            <Button className="w-full h-12 text-lg bg-gold text-navy font-bold">List Your Car</Button>
                         </Link>
                    </div>
                 )}
            </nav>
        </div>
      )}
    </header>
  );
}
