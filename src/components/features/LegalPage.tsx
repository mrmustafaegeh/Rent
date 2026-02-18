import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useTranslations } from "next-intl";
import { Shield, Lock, FileText, BadgeCheck, AlertCircle } from "lucide-react";

interface LegalPageProps {
  title: string;
  description: string;
  lastUpdated: string;
  children: React.ReactNode;
}

export function LegalPage({ title, description, lastUpdated, children }: LegalPageProps) {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-navy py-20 relative overflow-hidden">
             <div className="container mx-auto px-4 relative z-10">
                 <div className="max-w-3xl">
                    <span className="text-gold font-bold uppercase tracking-[0.3em] text-[10px] mb-4 block italic">Legal Information</span>
                    <h1 className="text-4xl md:text-5xl font-heading font-black text-white mb-6 italic">
                        {title}
                    </h1>
                    <p className="text-gray-400 text-lg font-body max-w-2xl leading-relaxed italic">
                        {description}
                    </p>
                    <div className="mt-8 pt-6 border-t border-white/10 flex items-center gap-2">
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Last Updated:</span>
                        <span className="text-[10px] font-bold text-gold uppercase tracking-widest">{lastUpdated}</span>
                    </div>
                 </div>
             </div>
        </section>

        <section className="py-24">
            <div className="container mx-auto px-4">
                <div className="max-w-3xl mx-auto prose prose-navy prose-lg font-body text-gray-600 leading-relaxed italic">
                    {children}
                </div>
            </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
