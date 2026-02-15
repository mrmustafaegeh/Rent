'use client';

import * as React from "react"
import { Link, usePathname } from "@/navigation"
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

import { useTranslations } from 'next-intl';
import { LanguageSwitcher } from "./LanguageSwitcher";
import { motion } from "framer-motion";

export function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const pathname = usePathname();
  const [scrolled, setScrolled] = React.useState(false);
  const t = useTranslations('Navigation');

  React.useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  React.useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [mobileMenuOpen]);

  const navLinks = [
    { name: t('rent'), href: "/cars" },
    { name: t('buy'), href: "/buy" },
    { name: t('chauffeur'), href: "/chauffeur" },
    { name: t('locations'), href: "/locations" },
    { name: t('about'), href: "/about" },
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
      <div className="container relative z-[1001] flex h-full items-center justify-between mx-auto px-4">
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
              key={link.href}
              href={link.href} 
              className={`relative font-heading font-medium text-[15px] transition-colors hover:text-electric group ${
                isActive(link.href) ? "text-gold" : "text-white/80"
              }`}
            >
              {link.name}
              <span className={`absolute -bottom-1 left-0 h-[2px] bg-electric transition-all duration-300 group-hover:w-full ${
                  isActive(link.href) ? "w-full bg-gold" : "w-0"
              }`} />
            </Link>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="hidden lg:flex items-center gap-4">
             {/* Language & Currency (Mock) */}
             <div className="flex items-center gap-3 text-white/70 text-sm border-r border-white/10 pr-4 mr-2">
                <LanguageSwitcher />

                <button 
                  className="flex items-center gap-1 hover:text-white transition-colors"
                  aria-label="Change currency"
                >
                    <DollarSign className="h-4 w-4" />
                    <span>EUR</span>
                </button>
             </div>

             {isAuthenticated ? (
               <div className="flex items-center gap-3">
                 <Link href="/dashboard">
                   <Button variant="ghost" className="text-white hover:text-electric hover:bg-white/5">
                     {t('dashboard')}
                   </Button>
                 </Link>
                 <Button 
                    variant="ghost" 
                    onClick={logout} 
                    className="text-white/70 hover:text-destructive hover:bg-destructive/10"
                 >
                    {t('logout')}
                 </Button>
               </div>
             ) : (
                <Link href="/auth/login">
                  <Button variant="ghost" className="text-white hover:text-electric hover:bg-white/5 border border-white/20 hover:border-electric transition-all">
                    {t('login')}
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
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-menu"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>
      
       {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div 
          id="mobile-menu"
          className="lg:hidden fixed inset-0 top-0 h-screen w-screen bg-navy/98 backdrop-blur-2xl z-[900] p-6 pt-24 animate-in fade-in slide-in-from-right-20 duration-500"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
        >
            <nav className="flex flex-col gap-6 mt-4">
                 {navLinks.map((link, idx) => (
                    <motion.div
                        key={link.name}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                    >
                        <Link 
                            href={link.href} 
                            className="font-heading font-black text-3xl text-white hover:text-gold transition-colors flex justify-between items-center group active:scale-95 duration-200" 
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            {link.name}
                            <span className="text-gold opacity-50 font-light">→</span>
                        </Link>
                    </motion.div>
                 ))}
                 
                 <div className="h-px bg-white/10 my-6" />
 
                 {isAuthenticated ? (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="flex flex-col gap-6"
                    >
                        <Link href="/dashboard" className="font-heading font-bold text-2xl text-white flex items-center gap-3" onClick={() => setMobileMenuOpen(false)}>
                            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                                <User className="w-5 h-5 text-gold" />
                            </div>
                            {t('dashboard')}
                        </Link>
                        <button onClick={() => {logout(); setMobileMenuOpen(false)}} className="font-heading font-bold text-2xl text-left text-red-500 flex items-center gap-3">
                             <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
                                <X className="w-5 h-5" />
                            </div>
                            {t('logout')}
                        </button>
                    </motion.div>
                 ) : (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="flex flex-col gap-4"
                    >
                        <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)}>
                            <Button className="w-full h-14 text-lg font-bold border-white/20 text-white rounded-2xl" variant="outline">{t('login')}</Button>
                        </Link>
                        <Link href="/list-your-car" onClick={() => setMobileMenuOpen(false)}>
                            <Button className="w-full h-14 text-lg bg-gold text-navy font-black rounded-2xl shadow-xl shadow-gold/10">List Your Car</Button>
                         </Link>
                    </motion.div>
                 )}
            </nav>
        </div>
      )}
    </header>
  );
}
