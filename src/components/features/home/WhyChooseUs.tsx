'use client';

import { motion } from "framer-motion";
import { ShieldCheck, Tag, Layers, ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";

export function WhyChooseUs() {
    const t = useTranslations('WhyChooseUs');

    const features = [
        {
            icon: Layers,
            label: t('features.exclusive.title'),
            title: t('features.exclusive.subtitle'),
            desc:  t('features.exclusive.description'),
        },
        {
            icon: Tag,
            label: t('features.transparency.title'),
            title: t('features.transparency.subtitle'),
            desc:  t('features.transparency.description'),
        },
        {
            icon: ShieldCheck,
            label: t('features.experience.title'),
            title: t('features.experience.subtitle'),
            desc:  t('features.experience.description'),
        },
    ];

    return (
        <section className="py-32 bg-[#0D3B66] relative overflow-hidden">
            {/* Subtle dot grid */}
            <div className="absolute inset-0 dot-pattern-light pointer-events-none" />

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-20 space-y-4">
                    <span className="font-body text-[#00B4D8] text-xs tracking-widest uppercase">{t('overline')}</span>
                    <h2
                        className="font-display font-black text-white text-5xl md:text-6xl lg:text-7xl leading-tight"
                        dangerouslySetInnerHTML={{ __html: t.rich('title', { br: () => '<br class="hidden md:block" />' }) as string }}
                    />
                    <p className="font-body text-white/60 text-base md:text-xl max-w-3xl mx-auto">{t('description')}</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {features.map((f, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 32 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.18, duration: 0.7 }}
                            className="group border border-white/10 rounded-2xl p-8 hover:border-[#00B4D8]/40 transition-colors duration-300 flex flex-col"
                        >
                            {/* Icon */}
                            <div className="w-14 h-14 rounded-xl bg-white/5 flex items-center justify-center mb-6 group-hover:bg-white/10 transition-colors">
                                <f.icon className="w-7 h-7 text-[#C9A84C]" strokeWidth={1.5} />
                            </div>

                            {/* Label — gold caps */}
                            <span className="font-body text-[#C9A84C] text-xs tracking-widest uppercase font-bold">{f.label}</span>
                            <h3 className="font-heading text-white text-xl font-semibold mt-1 mb-3">{f.title}</h3>
                            <p className="font-body text-white/60 text-sm leading-relaxed flex-1">{f.desc}</p>

                            {/* Learn more — appears on hover */}
                            <span className="mt-5 flex items-center gap-2 font-body text-[#00B4D8] text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                {t('learnMore')} <ArrowRight className="w-4 h-4" />
                            </span>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
