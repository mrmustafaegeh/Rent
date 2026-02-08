import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--surface-light)] py-20">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="space-y-4">
          <Link href="/" className="text-2xl font-bold tracking-tighter block">
            RENTAL<span className="text-[var(--primary)]">X</span>
          </Link>
          <p className="text-[var(--text-secondary)] text-sm leading-relaxed max-w-xs">
            Premium car rental service for those who demand excellence. Experience the road like never before.
          </p>
        </div>
        
        <div>
          <h4 className="font-bold mb-6 text-white">Company</h4>
          <div className="flex flex-col gap-3 text-sm text-[var(--text-secondary)]">
            <Link href="/about" className="hover:text-white transition-colors">About Us</Link>
            <Link href="/careers" className="hover:text-white transition-colors">Careers</Link>
            <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
            <Link href="/press" className="hover:text-white transition-colors">Press</Link>
          </div>
        </div>

        <div>
          <h4 className="font-bold mb-6 text-white">Support</h4>
          <div className="flex flex-col gap-3 text-sm text-[var(--text-secondary)]">
            <Link href="/help" className="hover:text-white transition-colors">Help Center</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link>
          </div>
        </div>

        <div className="space-y-4">
           <h4 className="font-bold mb-2 text-white">Newsletter</h4>
           <p className="text-[var(--text-secondary)] text-sm">Join our newsletter for exclusive offers.</p>
           <div className="flex gap-2">
             <Input placeholder="Enter your email" className="h-10 text-sm" />
             <Button size="sm" className="h-10 px-4">Join</Button>
           </div>
        </div>
      </div>
      <div className="container mx-auto px-4 text-center text-[var(--text-muted)] text-sm mt-16 pt-8 border-t border-[var(--border)]">
        &copy; {new Date().getFullYear()} RENTALX. All rights reserved.
      </div>
    </footer>
  );
}
