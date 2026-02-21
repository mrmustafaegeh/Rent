'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Link } from '@/navigation';
import { Building2, TrendingUp, Users, ShieldCheck, ArrowRight, Car } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function PartnerCTA() {
  const t = useTranslations('PartnerCTA');

  return (
    <section className="py-24 bg-white overflow-hidden relative">
      {/* Background elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gold/5 rounded-full blur-[120px] -mr-48 -mt-48" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-navy/5 rounded-full blur-[120px] -ml-48 -mb-48" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="bg-navy rounded-[40px] p-8 md:p-16 overflow-hidden relative border border-white/5 shadow-2xl">
          {/* Section decoration */}
          <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none" 
               style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} 
          />
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-gold/10 rounded-full blur-3xl" />
          
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Column: Text Content */}
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-gold text-xs font-black uppercase tracking-widest"
              >
                <Car className="w-3 h-3" /> {t('overline')}
              </motion.div>
              
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: 0.1 }}
                className="text-4xl md:text-6xl font-heading font-black text-white leading-tight"
                dangerouslySetInnerHTML={{ __html: t.rich('title', { span: (chunks) => `<span class="text-gold">${chunks}</span>` }) as string }}
              />
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: 0.2 }}
                className="text-gray-400 text-lg md:text-xl font-body leading-relaxed max-w-xl"
              >
                {t('description')}
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: 0.3 }}
                className="grid sm:grid-cols-2 gap-6"
              >
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-gold shrink-0 border border-white/10">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-lg mb-1">{t('features.revenue.title')}</h4>
                    <p className="text-gray-500 text-sm">{t('features.revenue.desc')}</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-gold shrink-0 border border-white/10">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-lg mb-1">{t('features.secure.title')}</h4>
                    <p className="text-gray-500 text-sm">{t('features.secure.desc')}</p>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: 0.4 }}
                className="pt-6"
              >
                <Link href="/auth/partner-register">
                  <Button className="h-16 px-10 text-xl font-black bg-gold text-navy hover:bg-white hover:text-navy rounded-2xl transition-all group">
                    {t('button')} <ArrowRight className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </motion.div>
            </div>
            
            {/* Right Column: Visual Element / Stats Grid */}
            <div className="relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                className="grid grid-cols-2 gap-4"
              >
                <div className="space-y-4">
                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-[32px] text-center transform translate-y-8">
                    <div className="text-4xl font-black text-white mb-2">150+</div>
                    <div className="text-gold text-xs font-bold uppercase tracking-widest">{t('stats.partners')}</div>
                  </div>
                  <div className="bg-gradient-to-br from-gold to-yellow-500 p-8 rounded-[32px] text-center">
                    <div className="text-4xl font-black text-navy mb-2">500+</div>
                    <div className="text-navy/70 text-xs font-bold uppercase tracking-widest">{t('stats.vehicles')}</div>
                  </div>
                </div>
                <div className="space-y-4 mt-8">
                  <div className="bg-white p-8 rounded-[32px] text-center">
                    <Building2 className="w-10 h-10 text-navy mx-auto mb-4" />
                    <div className="text-navy font-black text-lg">{t('features.integration')}</div>
                  </div>
                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-[32px] text-center">
                    <Users className="w-10 h-10 text-gold mx-auto mb-4" />
                    <div className="text-white font-black text-lg">{t('features.global')}</div>
                  </div>
                </div>
              </motion.div>
              
              {/* Glow effect under the grid */}
              <div className="absolute inset-0 bg-gold/20 blur-[100px] rounded-full -z-10" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
