import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Facebook, Instagram, Twitter, Linkedin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Column 1: Company */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold">Company</h3>
            <ul className="space-y-2 text-sm text-secondary-foreground/80">
              <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/how-it-works" className="hover:text-primary transition-colors">How it Works</Link></li>
              <li><Link href="/why-choose-us" className="hover:text-primary transition-colors">Why Choose Us</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
              <li><Link href="/careers" className="hover:text-primary transition-colors">Careers</Link></li>
              <li><Link href="/press" className="hover:text-primary transition-colors">Press & Media</Link></li>
            </ul>
          </div>
          
          {/* Column 2: Services */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold">Services</h3>
            <ul className="space-y-2 text-sm text-secondary-foreground/80">
              <li><Link href="/cars" className="hover:text-primary transition-colors">Car Rentals</Link></li>
              <li><Link href="/luxury" className="hover:text-primary transition-colors">Luxury Cars</Link></li>
              <li><Link href="/budget" className="hover:text-primary transition-colors">Budget Cars</Link></li>
              <li><Link href="/long-term" className="hover:text-primary transition-colors">Long-term Rentals</Link></li>
              <li><Link href="/airport" className="hover:text-primary transition-colors">Airport Rentals</Link></li>
              <li><Link href="/chauffeur" className="hover:text-primary transition-colors">Chauffeur Services</Link></li>
            </ul>
          </div>

          {/* Column 3: Locations */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold">Locations</h3>
            <ul className="space-y-2 text-sm text-secondary-foreground/80">
              <li><Link href="/locations/nicosia" className="hover:text-primary transition-colors">Nicosia</Link></li>
              <li><Link href="/locations/kyrenia" className="hover:text-primary transition-colors">Kyrenia</Link></li>
              <li><Link href="/locations/famagusta" className="hover:text-primary transition-colors">Famagusta</Link></li>
              <li><Link href="/locations/ercan-airport" className="hover:text-primary transition-colors">Ercan Airport</Link></li>
              <li><Link href="/locations" className="hover:text-primary transition-colors">All Locations</Link></li>
            </ul>
          </div>

          {/* Column 4: Support */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold">Support</h3>
            <ul className="space-y-2 text-sm text-secondary-foreground/80">
              <li><Link href="/faq" className="hover:text-primary transition-colors">FAQ</Link></li>
              <li><Link href="/guide" className="hover:text-primary transition-colors">Rental Guide</Link></li>
              <li><Link href="/documents" className="hover:text-primary transition-colors">Documentation</Link></li>
              <li><Link href="/terms" className="hover:text-primary transition-colors">Terms & Conditions</Link></li>
              <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Column 5: Download App */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold">Download App</h3>
            <p className="text-sm text-secondary-foreground/80">Get the best car rental experience on your phone.</p>
            <div className="flex flex-col gap-2">
               <Button variant="outline" className="w-full justify-start gap-2 bg-transparent border-secondary-foreground/20 hover:bg-secondary-foreground/10 hover:text-white">
                 <span className="flex-1 text-left">App Store</span>
               </Button>
               <Button variant="outline" className="w-full justify-start gap-2 bg-transparent border-secondary-foreground/20 hover:bg-secondary-foreground/10 hover:text-white">
                 <span className="flex-1 text-left">Google Play</span>
               </Button>
            </div>
          </div>
        </div>

        <div className="border-t border-secondary-foreground/10 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-secondary-foreground/60">
            © {new Date().getFullYear()} RENTALX. All rights reserved.
          </p>
          
          <div className="flex gap-4">
            <Link href="#" className="text-secondary-foreground/60 hover:text-white transition-colors"><Facebook className="h-5 w-5" /></Link>
            <Link href="#" className="text-secondary-foreground/60 hover:text-white transition-colors"><Instagram className="h-5 w-5" /></Link>
            <Link href="#" className="text-secondary-foreground/60 hover:text-white transition-colors"><Twitter className="h-5 w-5" /></Link>
            <Link href="#" className="text-secondary-foreground/60 hover:text-white transition-colors"><Linkedin className="h-5 w-5" /></Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
