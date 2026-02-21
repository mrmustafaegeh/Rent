'use client';

import * as React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Search, CalendarCheck, Key } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { useTranslations } from "next-intl"

export function HowItWorks() {
    const t = useTranslations('HowItWorks');

    const steps = [
        {
            number: "01",
            icon: Search,
            title: t('steps.step1.title'),
            description: t('steps.step1.desc')
        },
        {
            number: "02",
            icon: CalendarCheck,
            title: t('steps.step2.title'),
            description: t('steps.step2.desc')
        },
        {
            number: "03",
            icon: Key,
            title: t('steps.step3.title'),
            description: t('steps.step3.desc')
        }
    ]

    return (
        <section className="py-24 bg-[#F8FAFC]">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16 space-y-4">
                    <span className="text-gold font-bold tracking-[0.2em] text-xs uppercase">{t('overline')}</span>
                    <h2 className="text-4xl md:text-5xl font-heading font-bold text-navy">{t('title')}</h2>
                    <p className="text-gray-500 text-lg max-w-2xl mx-auto font-body">
                        {t('description')}
                    </p>
                </div>

                <div className="relative grid grid-cols-1 md:grid-cols-3 gap-12 mt-12 mb-16">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden md:block absolute top-[60px] left-[16%] right-[16%] h-[2px] bg-gradient-to-r from-gray-200 via-gold/50 to-gray-200 border-t-2 border-dashed border-gray-300 z-0" />

                    {steps.map((step, index) => (
                        <motion.div 
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2, duration: 0.6 }}
                            className="relative z-10 flex flex-col items-center text-center group"
                        >
                            <div className="mb-6 relative">
                                <span className="absolute -top-10 left-1/2 -translate-x-1/2 text-8xl font-black text-gray-100 z-0 select-none group-hover:text-gold/5 transition-colors duration-500">
                                    {step.number}
                                </span>
                                
                                <div className="w-24 h-24 rounded-full bg-white shadow-lg shadow-gray-100 flex items-center justify-center border-4 border-white group-hover:border-gold transition-colors duration-500 relative z-10">
                                    <div className="w-16 h-16 rounded-full bg-navy/5 flex items-center justify-center text-navy group-hover:text-gold transition-colors duration-500">
                                        <step.icon className="w-8 h-8" />
                                    </div>
                                    <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-gold text-white font-bold flex items-center justify-center text-sm shadow">
                                        {index + 1}
                                    </div>
                                </div>
                            </div>
                            
                            <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 w-full relative group-hover:-translate-y-2">
                                <h3 className="text-2xl font-heading font-bold text-navy mb-3">{step.title}</h3>
                                <p className="text-gray-500 leading-relaxed font-body">
                                    {step.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="flex flex-col items-center gap-6">
                    <Link href="/cars">
                        <Button className="h-14 px-8 text-lg font-bold bg-electric hover:bg-electric/90 text-white rounded-full shadow-[0_10px_20px_rgba(0,212,255,0.3)] hover:shadow-[0_15px_30px_rgba(0,212,255,0.5)] hover:scale-105 transition-all">
                            {t('button')}
                        </Button>
                    </Link>
                    <Link href="/how-it-works" className="text-gray-500 hover:text-electric font-medium transition-colors border-b border-transparent hover:border-electric pb-0.5">
                        {t('learnMore')}
                    </Link>
                </div>
            </div>
        </section>
    )
}
