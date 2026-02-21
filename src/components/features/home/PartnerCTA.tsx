'use client';

import { motion } from "framer-motion";
import { TrendingUp, ShieldCheck, ArrowRight, Car, Building2, Users } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Link } from "@/navigation";
import { useTranslations } from "next-intl";

export function PartnerCTA() {
    const t = useTranslations('PartnerCTA');

    return (
        <section className="py-24 bg-white overflow-hidden relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Inner navy card */}
                <div className="bg-[#0D3B66] rounded-3xl p-8 md:p-16 overflow-hidden relative">
                    {/* Dot texture */}
                    <div className="absolute inset-0 pointer-events-none"
                         style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.06) 1px, transparent 0)', backgroundSize: '36px 36px' }}
                    />
                    <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#C9A84C]/10 rounded-full blur-3xl" />

                    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
                        {/* Left */}
                        <div className="space-y-7">
                            <motion.div
                                initial={{ opacity: 0, y: 16 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[#C9A84C] text-xs font-body font-bold uppercase tracking-widest"
                            >
                                <Car className="w-3 h-3" /> {t('overline')}
                            </motion.div>

                            <motion.h2
                                initial={{ opacity: 0, y: 16 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1 }}
                                className="font-heading text-4xl md:text-5xl font-bold text-white leading-tight"
                                dangerouslySetInnerHTML={{ __html: t.rich('title', { span: (c) => `<span class="text-[#C9A84C]">${c}</span>` }) as string }}
                            />

                            <motion.p
                                initial={{ opacity: 0, y: 16 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2 }}
                                className="font-body text-white/60 text-lg leading-relaxed max-w-xl"
                            >
                                {t('description')}
                            </motion.p>

                            {/* Features */}
                            <motion.div
                                initial={{ opacity: 0, y: 16 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.3 }}
                                className="grid sm:grid-cols-2 gap-5"
                            >
                                {[
                                    { icon: TrendingUp, title: t('features.revenue.title'), desc: t('features.revenue.desc') },
                                    { icon: ShieldCheck, title: t('features.secure.title'), desc: t('features.secure.desc') },
                                ].map((feat, i) => (
                                    <div key={i} className="flex gap-4 border border-white/10 rounded-xl p-4">
                                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                                            <feat.icon className="w-5 h-5 text-[#00B4D8]" />
                                        </div>
                                        <div>
                                            <h4 className="font-body font-bold text-white text-sm mb-0.5">{feat.title}</h4>
                                            <p className="font-body text-white/50 text-xs">{feat.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </motion.div>

                            {/* CTA */}
                            <motion.div
                                initial={{ opacity: 0, y: 16 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.4 }}
                            >
                                <Link href="/auth/partner-register">
                                    <Button className="h-14 px-8 bg-[#C9A84C] hover:bg-[#b8973e] text-[#0D3B66] font-body font-bold text-base rounded-2xl transition-all group">
                                        {t('button')} <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                                    </Button>
                                </Link>
                            </motion.div>
                        </div>

                        {/* Right — Stats */}
                        <div className="relative">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.92 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                className="grid grid-cols-2 gap-4"
                            >
                                <div className="space-y-4">
                                    <div className="bg-white/5 border border-white/10 p-8 rounded-2xl text-center translate-y-6">
                                        <div className="font-mono text-4xl font-bold text-white mb-1">150+</div>
                                        <div className="font-body text-[#C9A84C] text-xs font-bold uppercase tracking-widest">{t('stats.partners')}</div>
                                    </div>
                                    <div className="bg-[#C9A84C] p-8 rounded-2xl text-center">
                                        <div className="font-mono text-4xl font-bold text-[#0D3B66] mb-1">500+</div>
                                        <div className="font-body text-[#0D3B66]/70 text-xs font-bold uppercase tracking-widest">{t('stats.vehicles')}</div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="bg-white p-8 rounded-2xl text-center">
                                        <Building2 className="w-10 h-10 text-[#0D3B66] mx-auto mb-3" />
                                        <div className="font-body font-bold text-[#0D3B66] text-sm">{t('features.integration')}</div>
                                    </div>
                                    <div className="bg-white/5 border border-white/10 p-8 rounded-2xl text-center">
                                        <Users className="w-10 h-10 text-[#C9A84C] mx-auto mb-3" />
                                        <div className="font-body font-bold text-white text-sm">{t('features.global')}</div>
                                    </div>
                                </div>
                            </motion.div>
                            <div className="absolute inset-0 bg-[#C9A84C]/15 blur-[80px] rounded-full -z-10" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
