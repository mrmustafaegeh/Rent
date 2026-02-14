import { Link } from '@/navigation';
import { Button } from '@/components/ui/Button';
import { Facebook, Instagram, Twitter, Linkedin, MapPin, Phone, Mail } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function Footer() {
  const t = useTranslations('Footer');

  return (
    <footer className="bg-navy text-white pt-24 pb-12 overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-16">
          {/* Brand Column */}
          <div className="lg:col-span-4 space-y-6">
            <Link href="/" className="inline-block">
                <span className="font-heading font-black text-2xl tracking-tighter text-white">
                    MEDITERRANEAN <span className="text-gold">DRIVE</span>
                </span>
            </Link>
            <p className="text-gray-400 font-body leading-relaxed max-w-sm">
              {t('about')}
            </p>
            <div className="flex flex-col gap-4 text-gray-400 text-sm">
                <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-electric" />
                    <span>Kyrenia, North Cyprus</span>
                </div>
                <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-electric" />
                    <span>+90 533 000 00 00</span>
                </div>
                <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-electric" />
                    <span>hello@mediterraneandrive.com</span>
                </div>
            </div>
          </div>
          
          {/* Quick Links */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="font-heading font-bold text-lg text-white">{t('company')}</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><Link href="/about" className="hover:text-gold transition-colors block py-1">{t('links.about')}</Link></li>
              <li><Link href="/how-it-works" className="hover:text-gold transition-colors block py-1">{t('links.howItWorks')}</Link></li>
              <li><Link href="/careers" className="hover:text-gold transition-colors block py-1">{t('links.careers')}</Link></li>
              <li><Link href="/blog" className="hover:text-gold transition-colors block py-1">{t('links.blog')}</Link></li>
              <li><Link href="/contact" className="hover:text-gold transition-colors block py-1">{t('links.contact')}</Link></li>
            </ul>
          </div>
          
          {/* Fleet */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="font-heading font-bold text-lg text-white">{t('fleet')}</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><Link href="/cars?category=luxury" className="hover:text-gold transition-colors block py-1">{t('links.luxury')}</Link></li>
              <li><Link href="/cars?category=suv" className="hover:text-gold transition-colors block py-1">{t('links.suv')}</Link></li>
              <li><Link href="/cars?category=economy" className="hover:text-gold transition-colors block py-1">{t('links.economy')}</Link></li>
              <li><Link href="/cars?category=sports" className="hover:text-gold transition-colors block py-1">{t('links.sports')}</Link></li>
              <li><Link href="/cars?category=electric" className="hover:text-gold transition-colors block py-1">{t('links.electric')}</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="font-heading font-bold text-lg text-white">{t('support')}</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><Link href="/faq" className="hover:text-gold transition-colors block py-1">{t('links.help')}</Link></li>
              <li><Link href="/terms" className="hover:text-gold transition-colors block py-1">{t('links.terms')}</Link></li>
              <li><Link href="/privacy" className="hover:text-gold transition-colors block py-1">{t('links.privacy')}</Link></li>
              <li><Link href="/insurance" className="hover:text-gold transition-colors block py-1">{t('links.insurance')}</Link></li>
              <li><Link href="/sitemap" className="hover:text-gold transition-colors block py-1">{t('links.sitemap')}</Link></li>
            </ul>
          </div>

          {/* Newsletter / App */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="font-heading font-bold text-lg text-white">{t('getApp')}</h3>
            <p className="text-sm text-gray-400">{t('appDesc')}</p>
            <div className="flex flex-col gap-3 w-full">
               <button className="flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-3 transition-colors group text-left w-full">
                 <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-gold group-hover:text-navy transition-colors shrink-0">
                    <span className="font-bold text-xs"></span>
                 </div>
                 <div>
                    <div className="text-[10px] text-gray-400 uppercase tracking-wider">{t('downloadApple')}</div>
                    <div className="font-bold text-sm">App Store</div>
                 </div>
               </button>
               <button className="flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-3 transition-colors group text-left w-full">
                 <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-gold group-hover:text-navy transition-colors shrink-0">
                    <span className="font-bold text-xs">▶</span>
                 </div>
                 <div>
                    <div className="text-[10px] text-gray-400 uppercase tracking-wider">{t('downloadGoogle')}</div>
                    <div className="font-bold text-sm">Google Play</div>
                 </div>
               </button>
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} {t('rights')}
          </p>
          
          <div className="flex gap-6">
            <Link href="#" className="text-gray-400 hover:text-gold transition-colors transform hover:-translate-y-1" aria-label="Facebook"><Facebook className="h-5 w-5" /></Link>
            <Link href="#" className="text-gray-400 hover:text-gold transition-colors transform hover:-translate-y-1" aria-label="Instagram"><Instagram className="h-5 w-5" /></Link>
            <Link href="#" className="text-gray-400 hover:text-gold transition-colors transform hover:-translate-y-1" aria-label="Twitter"><Twitter className="h-5 w-5" /></Link>
            <Link href="#" className="text-gray-400 hover:text-gold transition-colors transform hover:-translate-y-1" aria-label="LinkedIn"><Linkedin className="h-5 w-5" /></Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
