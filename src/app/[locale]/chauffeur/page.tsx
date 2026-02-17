'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/Button';
import { Shield, Sparkles, Clock, Crown, ArrowRight, Check } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function ChauffeurPage() {
  const t = useTranslations('ChauffeurPage');

  return (
    <div className="flex flex-col min-h-screen bg-[var(--background)]">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden py-20">
             {/* Fallback pattern if image fails */}
            <div className="absolute inset-0 bg-navy">
                <div className="absolute inset-0 bg-[url('/images/chauffeur-bg.jpg')] bg-cover bg-center opacity-40 mix-blend-overlay" />
                <div className="absolute inset-0 bg-gradient-to-t from-navy via-transparent to-navy/80" />
            </div>

            <div className="container mx-auto px-4 relative z-10 text-center space-y-6">
                <span className="inline-block px-4 py-1.5 rounded-full border border-gold/30 bg-gold/10 text-gold text-xs font-bold tracking-[0.2em] uppercase backdrop-blur-md animate-in fade-in slide-in-from-bottom-4 duration-700">
                    {t('hero.overline')}
                </span>
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-black text-white leading-tight max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-100 drop-shadow-lg">
                    {t.rich('hero.title', {
                        highlight: (chunks) => <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold to-amber-500">{chunks}</span>
                    })}
                </h1>
                <p className="text-gray-200 text-base md:text-xl lg:text-2xl max-w-2xl mx-auto font-light font-body animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200 drop-shadow-md">
                    {t('hero.description')}
                </p>
                <div className="pt-8 animate-in fade-in zoom-in duration-1000 delay-300">
                    <Link href="/contact">
                        <Button className="h-12 md:h-14 px-6 md:px-8 text-base md:text-lg font-bold bg-white text-navy hover:bg-gold hover:text-navy rounded-full shadow-2xl shadow-white/10 transition-all">
                            {t('hero.button')}
                        </Button>
                    </Link>
                </div>
            </div>
        </section>

        {/* Features Grid */}
        <section className="py-16 md:py-24 bg-white relative">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 -mt-20 md:-mt-32 relative z-20">
                    {[
                        { icon: Crown, title: t('features.vip.title'), desc: t('features.vip.desc') },
                        { icon: Clock, title: t('features.punctuality.title'), desc: t('features.punctuality.desc') },
                        { icon: Shield, title: t('features.safety.title'), desc: t('features.safety.desc') },
                        { icon: Sparkles, title: t('features.fleet.title'), desc: t('features.fleet.desc') }
                    ].map((feature, idx) => (
                        <div key={idx} className="bg-white p-6 md:p-8 rounded-3xl shadow-2xl shadow-navy/10 border border-gray-100 hover:-translate-y-2 transition-transform duration-300 group">
                            <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-navy flex items-center justify-center text-gold mb-4 md:mb-6 group-hover:bg-gold group-hover:text-navy transition-colors shadow-lg shadow-navy/20">
                                <feature.icon className="w-6 h-6 md:w-7 md:h-7" />
                            </div>
                            <h3 className="text-lg md:text-xl font-heading font-bold text-navy mb-2 md:mb-3">{feature.title}</h3>
                            <p className="text-gray-600 leading-relaxed text-sm md:text-base font-body">
                                {feature.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        {/* Executive Business Feature */}
        <section className="py-24 bg-navy relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-electric/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gold/5 rounded-full blur-[100px] pointer-events-none" />
            
            <div className="container mx-auto px-4 relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    <div className="lg:w-1/2 space-y-8">
                        <span className="inline-block px-4 py-1.5 rounded-full border border-gold/30 bg-gold/10 text-gold text-xs font-bold tracking-[0.2em] uppercase backdrop-blur-md">
                            {t('business.overline')}
                        </span>
                        <h2 className="text-4xl md:text-5xl font-heading font-black text-white leading-tight">
                            {t.rich('business.title', {
                                br: () => <br/>,
                                highlight: (chunks) => <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold to-amber-500">{chunks}</span>
                            })}
                        </h2>
                        <p className="text-gray-300 text-lg leading-relaxed font-light font-body">
                            {t('business.description')}
                        </p>
                        
                        <div className="space-y-4">
                            {[
                                { title: t('business.features.connectivity.title'), desc: t('business.features.connectivity.desc') },
                                { title: t('business.features.privacy.title'), desc: t('business.features.privacy.desc') },
                                { title: t('business.features.amenities.title'), desc: t('business.features.amenities.desc') }
                            ].map((item, i) => (
                                <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                                    <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center text-gold shrink-0">
                                        <Check className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white text-sm">{item.title}</h4>
                                        <p className="text-gray-400 text-xs mt-1">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="pt-6">
                            <Link href="/contact">
                                <Button className="h-14 px-8 bg-white text-navy hover:bg-gold hover:text-navy font-bold rounded-full transition-all flex items-center gap-2 shadow-lg shadow-white/10">
                                    {t('business.button')} <ArrowRight className="w-5 h-5" />
                                </Button>
                            </Link>
                        </div>
                    </div>

                    <div className="lg:w-1/2 relative">
                        <div className="relative h-[600px] rounded-[3rem] overflow-hidden shadow-2xl border border-white/10 group">
                             <div className="absolute inset-0 bg-navy/20 z-10 group-hover:bg-navy/10 transition-colors duration-500" />
                             <Image
                                src="/images/chauffeur-interior.png"
                                alt={t('business.imageAlt')}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                             />
                             
                             {/* Floating Card */}
                             <div className="absolute bottom-8 left-8 right-8 bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-2xl z-20">
                                 <div className="flex items-center gap-4">
                                     <div className="flex-1">
                                         <p className="text-gold text-xs font-bold uppercase tracking-wider mb-1">{t('business.floatingCard.overline')}</p>
                                         <p className="text-white font-heading font-bold text-xl">{t('business.floatingCard.title')}</p>
                                     </div>
                                     <div className="w-12 h-12 rounded-full bg-white text-navy flex items-center justify-center font-bold">
                                         <ArrowRight className="w-5 h-5 -rotate-45" />
                                     </div>
                                 </div>
                             </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* Services List */}
        <section className="py-16 md:py-24 bg-white">
             <div className="container mx-auto px-4">
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                     <div className="space-y-6 md:space-y-8 order-2 lg:order-1">
                         <h2 className="text-3xl md:text-5xl font-heading font-black text-navy leading-tight">
                            {t.rich('services.title', {
                                br: () => <br/>,
                                highlight: (chunks) => <span className="text-electric">{chunks}</span>
                            })}
                         </h2>
                         <p className="text-gray-500 text-base md:text-lg leading-relaxed font-body">
                             {t('services.description')}
                         </p>
                         
                         <div className="space-y-4 md:space-y-6">
                             {['airport', 'corporate', 'wedding', 'tours', 'hourly'].map((key) => (
                                 <div key={key} className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                     <div className="w-8 h-8 rounded-full bg-electric/10 flex items-center justify-center text-electric shrink-0">
                                         <ArrowRight className="w-4 h-4" />
                                     </div>
                                     <span className="font-bold text-navy text-sm md:text-base font-heading">{t(`services.items.${key}`)}</span>
                                 </div>
                             ))}
                         </div>
                         
                         <div className="pt-4">
                             <Link href="/contact">
                                <Button className="h-12 bg-navy text-gold hover:bg-gold hover:text-navy rounded-full px-8 font-bold shadow-lg shadow-navy/20 transition-all w-full md:w-auto">
                                    {t('services.button')}
                                </Button>
                             </Link>
                         </div>
                     </div>
                     
                     <div className="relative h-[400px] md:h-[600px] bg-gray-200 rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl order-1 lg:order-2 group">
                         <div className="absolute inset-0 bg-navy/20 z-10 group-hover:bg-navy/10 transition-colors duration-500" />
                         <Image
                            src="/images/chauffeur-service.png"
                            alt={t('services.imageAlt')}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                         />
                         <div className="absolute bottom-6 left-6 right-6 md:bottom-8 md:left-8 md:right-8 bg-white/90 backdrop-blur-md p-4 md:p-6 rounded-2xl border border-white/20 shadow-lg z-20">
                             <div className="flex items-center gap-4">
                                 <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gold flex items-center justify-center text-navy font-bold text-base md:text-lg shrink-0">
                                     24
                                 </div>
                                 <div className="flex-1">
                                     <h4 className="font-bold text-navy text-sm md:text-base font-heading">{t('services.availability.title')}</h4>
                                     <p className="text-navy/70 text-xs md:text-sm font-body">{t('services.availability.desc')}</p>
                                 </div>
                             </div>
                         </div>
                     </div>
                 </div>
             </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
