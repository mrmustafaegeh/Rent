'use client';

import { motion } from "framer-motion";
import { Search, CalendarCheck, Key } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Link } from "@/navigation";
import { useTranslations } from "next-intl";

export function HowItWorks() {
    const t = useTranslations('HowItWorks');

    const steps = [
        { number: "01", icon: Search,        title: t('steps.step1.title'), desc: t('steps.step1.desc') },
        { number: "02", icon: CalendarCheck, title: t('steps.step2.title'), desc: t('steps.step2.desc') },
        { number: "03", icon: Key,           title: t('steps.step3.title'), desc: t('steps.step3.desc') },
    ];

    return (
        <section className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-16 space-y-3">
                    <span className="font-body font-semibold text-[#64748B] tracking-[0.2em] text-xs uppercase">{t('overline')}</span>
                    <h2 className="font-heading text-4xl md:text-5xl font-bold text-[#0D3B66]">{t('title')}</h2>
                    <p className="font-body text-[#64748B] text-lg max-w-2xl mx-auto">{t('description')}</p>
                </div>

                {/* Steps */}
                <div className="relative grid grid-cols-1 md:grid-cols-3 gap-10 mb-14">
                    {/* Connecting dashed line desktop */}
                    <div className="hidden md:block absolute top-[34px] left-[20%] right-[20%] h-[2px] border-t-2 border-dashed border-[#00B4D8]/30 z-0" />

                    {steps.map((step, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.18, duration: 0.6 }}
                            className="relative z-10 flex flex-col items-center text-center group"
                        >
                            {/* Step number (bg watermark) */}
                            <span className="absolute -top-10 left-1/2 -translate-x-1/2 text-8xl font-black text-[#E2E8F0] select-none pointer-events-none z-0">
                                {step.number}
                            </span>

                            {/* Icon circle */}
                            <div className="mb-6 relative z-10">
                                <div className="w-16 h-16 rounded-full bg-[#0D3B66] flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                                    <step.icon className="w-8 h-8 text-white" />
                                </div>
                                <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full bg-[#00B4D8] text-white text-xs font-bold flex items-center justify-center shadow">
                                    {i + 1}
                                </div>
                            </div>

                            {/* Card */}
                            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-[var(--shadow-card)] group-hover:shadow-[var(--shadow-hover)] group-hover:-translate-y-1 transition-all duration-300 w-full">
                                <h3 className="font-heading text-xl font-semibold text-[#0F172A] mb-2">{step.title}</h3>
                                <p className="font-body text-[#64748B] text-sm leading-relaxed">{step.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* CTA */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link href="/cars">
                        <Button className="h-12 px-8 text-sm bg-[#00B4D8] hover:bg-[#0096b8] text-white font-body font-bold rounded-full shadow-[0_8px_24px_rgba(0,180,216,0.3)] hover:shadow-[0_12px_32px_rgba(0,180,216,0.4)] transition-all">
                            {t('button')}
                        </Button>
                    </Link>
                    <Link href="/how-it-works" className="font-body text-[#00B4D8] text-sm font-semibold underline decoration-dotted underline-offset-4 hover:text-[#0096b8] transition-colors">
                        {t('learnMore')}
                    </Link>
                </div>
            </div>
        </section>
    )
}
