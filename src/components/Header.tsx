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
import { CurrencySwitcher } from "./CurrencySwitcher";
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
    // { name: t('buy'), href: "/buy" },
    // { name: t('chauffeur'), href: "/chauffeur" },
    { name: t('locations'), href: "/locations" },
    { name: t('about'), href: "/about" },
    { name: t('partners'), href: "/auth/partner-register" },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ease-in-out h-16 flex items-center ${
        scrolled
          ? "bg-white/96 backdrop-blur-md border-b border-[#E2E8F0] shadow-[0_1px_8px_rgba(13,59,102,0.08)]"
          : mobileMenuOpen
            ? "bg-[#0D3B66]"
            : "bg-transparent"
      }`}
    >

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between w-full">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group shrink-0" aria-label="MyIsland Home">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-[#0D3B66] shadow-md group-hover:scale-105 transition-transform duration-200">
            <Car className="h-4.5 w-4.5 text-[#00B4D8]" strokeWidth={2.5} />
          </div>
          <span className={`font-body font-black text-lg tracking-tight transition-colors duration-300 ${
            scrolled ? 'text-[#0F172A]' : 'text-white'
          }`}>
            My<span className="text-[#00B4D8]">Island</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-7" aria-label="Main navigation">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`relative font-body text-sm font-medium transition-colors duration-200 hover:text-[#00B4D8] group ${
                isActive(link.href)
                  ? 'text-[#00B4D8]'
                  : scrolled ? 'text-slate-700' : 'text-white'
              }`}
            >
              {link.name}
              <span className={`absolute -bottom-0.5 left-0 h-0.5 rounded-full bg-[#00B4D8] transition-all duration-300 group-hover:w-full ${
                isActive(link.href) ? 'w-full' : 'w-0'
              }`} />
            </Link>
          ))}
        </nav>

        {/* Desktop Right */}
        <div className="hidden lg:flex items-center gap-3">
          <div className={`flex items-center gap-3 text-sm border-e pe-4 me-1 transition-colors ${
            scrolled ? 'border-[#E2E8F0] text-slate-500' : 'border-white/20 text-white/70'
          }`}>
            <LanguageSwitcher />
            <CurrencySwitcher />
          </div>

          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Link href="/dashboard">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`font-body font-medium transition-colors ${
                    scrolled ? 'text-slate-700 hover:text-[#0D3B66] hover:bg-slate-50' : 'text-white/90 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {t('dashboard')}
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="text-red-400 hover:text-red-600 hover:bg-red-50 font-body font-medium"
              >
                {t('logout')}
              </Button>
            </div>
          ) : (
            <Link href="/auth/login">
              <Button
                variant="ghost"
                size="sm"
                className={`font-body font-medium border transition-all ${
                  scrolled
                    ? 'border-[#E2E8F0] text-slate-700 hover:border-[#0D3B66] hover:text-[#0D3B66] hover:bg-slate-50'
                    : 'border-white/40 text-white hover:border-white hover:bg-white/15'
                }`}
              >
                {t('login')}
              </Button>
            </Link>
          )}

          <Link href="/list-your-car">
            <Button
              size="sm"
              className={`font-body font-semibold rounded-xl shadow-sm transition-all duration-200 ${
                scrolled
                  ? 'bg-[#0D3B66] hover:bg-[#0a2e52] text-white'
                  : 'bg-white text-[#0D3B66] hover:bg-white/90'
              }`}
            >
              {t('listCar')}
            </Button>
          </Link>
        </div>

        {/* Mobile hamburger */}
        <Button
          variant="ghost"
          size="icon"
          className={`lg:hidden transition-colors rounded-xl ${ scrolled ? 'text-slate-700 hover:bg-slate-100' : mobileMenuOpen ? 'text-white hover:bg-white/15' : 'text-white hover:bg-white/15' }`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? t('menuClose') : t('menuOpen')}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-menu"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/* Mobile full-screen overlay */}
      {mobileMenuOpen && (
        <div
          id="mobile-menu"
          className="lg:hidden fixed inset-0 top-0 h-screen w-screen bg-[#0D3B66] z-[900] p-6 pt-20 flex flex-col animate-in fade-in slide-in-from-right-16 duration-300"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
        >
          <nav className="flex flex-col gap-5">
            {navLinks.map((link, idx) => (
              <motion.div
                key={link.name}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.08 }}
              >
                <Link
                  href={link.href}
                  className="font-heading text-3xl font-bold text-white hover:text-[#00B4D8] transition-colors flex justify-between items-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                  <span className="text-[#00B4D8] opacity-60">→</span>
                </Link>
              </motion.div>
            ))}

            <div className="h-px bg-white/10 my-3" />

            <div className="flex items-center gap-3 text-white/70">
              <LanguageSwitcher />
              <span className="w-px h-5 bg-white/20" />
              <CurrencySwitcher />
            </div>

            <div className="h-px bg-white/10 my-1" />

            {isAuthenticated ? (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex flex-col gap-4"
              >
                <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 text-white font-body font-bold text-xl">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                    <User className="w-5 h-5 text-[#00B4D8]" />
                  </div>
                  {t('dashboard')}
                </Link>
                <button
                  onClick={() => { logout(); setMobileMenuOpen(false); }}
                  className="flex items-center gap-3 text-red-400 font-body font-bold text-xl text-start"
                >
                  <div className="w-10 h-10 rounded-xl bg-red-400/10 flex items-center justify-center">
                    <X className="w-5 h-5" />
                  </div>
                  {t('logout')}
                </button>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex flex-col gap-3"
              >
                <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full h-13 text-base font-body font-semibold border-white/30 text-white hover:bg-white/10 rounded-xl">
                    {t('login')}
                  </Button>
                </Link>
                <Link href="/list-your-car" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full h-13 text-base bg-[#C9A84C] hover:bg-[#b8953e] text-white font-body font-bold rounded-xl transition-colors">
                    {t('listCar')}
                  </Button>
                </Link>
              </motion.div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

