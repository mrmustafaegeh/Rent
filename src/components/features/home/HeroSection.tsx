'use client';

import * as React from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Calendar, MapPin, Search, ShieldCheck, Clock, Award } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select"
import { Input } from "@/components/ui/Input"
import { useRouter } from "@/navigation";
import { useTranslations } from 'next-intl';
import Image from "next/image";

export interface HeroSectionProps {
    title?: string;
    subtitleHighlight?: string;
    description?: string;
}

export function HeroSection({ title, subtitleHighlight, description }: HeroSectionProps) {
    const router = useRouter();
    const [location, setLocation] = React.useState("nicosia")
    const [pickupDate, setPickupDate] = React.useState("")
    const [dropoffDate, setDropoffDate] = React.useState("")
    const [mounted, setMounted] = React.useState(false);
    const t = useTranslations('HeroSection');

    React.useEffect(() => { setMounted(true); }, []);

    const { scrollY } = useScroll();
    const opacity = useTransform(scrollY, [0, 320], [1, 0]);
    const y = useTransform(scrollY, [0, 320], [0, 40]);

    const handleSearch = () => {
        const params = new URLSearchParams()
        if (location) params.append("location", location)
        if (pickupDate) params.append("pickup", pickupDate)
        if (dropoffDate) params.append("dropoff", dropoffDate)
        router.push(`/cars?${params.toString()}`);
    }

    const minDate = mounted ? new Date().toISOString().slice(0, 16) : "";

    return (
        <section className="relative w-full h-[100dvh] min-h-[660px] flex items-center justify-center overflow-hidden">

            {/* ── Top accent bar */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#0D3B66] via-[#00B4D8] to-[#0D3B66] z-20" />

            {/* ── Background photo — Verified 4K Kyrenia Harbor Shot */}
            <div className="absolute inset-0 z-0 bg-navy">
                <Image
                    src="https://images.unsplash.com/photo-1677023484264-421f167c985d?auto=format&fit=crop&q=80&w=2560"
                    alt="Kyrenia Harbor (Girne), North Cyprus - Luxury Car Rental"
                    fill
                    priority
                    quality={100}
                    className="object-cover object-[center_60%]"
                    sizes="100vw"
                />
                {/* Refined gradient for better text legibility */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-navy/80" />
            </div>

            {/* ── Content */}
            <motion.div
                style={{ opacity, y }}
                className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center gap-8"
            >
                {/* Eyebrow */}
                <motion.p
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    className="flex items-center gap-3 text-white/80 font-body text-xs tracking-[0.3em] uppercase"
                >
                    <span className="w-6 h-px bg-[#00B4D8]" />
                    Premium Car Rental — North Cyprus
                    <span className="w-6 h-px bg-[#00B4D8]" />
                </motion.p>

                {/* H1 */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                    className="font-display font-black text-white text-5xl sm:text-6xl md:text-7xl leading-[1.03] tracking-tight drop-shadow-lg max-w-4xl"
                >
                    {title || t('title')}
                    <br />
                    <span className="text-[#00B4D8]">{subtitleHighlight || t('subtitleHighlight')}</span>
                </motion.h1>

                {/* Sub */}
                <motion.p
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    className="font-body text-white/75 text-base sm:text-lg md:text-xl max-w-xl"
                >
                    {description || t('description')}
                </motion.p>

                {/* ── Booking Widget */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="w-full max-w-3xl"
                >
                    <div className="bg-white rounded-3xl shadow-[0_24px_64px_rgba(0,0,0,0.25)] overflow-hidden">
                        {/* Fields */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 sm:divide-x divide-y sm:divide-y-0 divide-[#E2E8F0]">

                            {/* Location */}
                            <div className="px-5 py-4 hover:bg-[#F8FAFC] transition-colors">
                                <label className="flex items-center gap-1.5 font-body font-bold text-[10px] tracking-widest text-[#64748B] uppercase mb-2">
                                    <MapPin className="w-3 h-3 text-[#00B4D8] shrink-0" />
                                    {t('pickupLocation')}
                                </label>
                                <Select value={location} onValueChange={setLocation}>
                                    <SelectTrigger className="w-full border-0 p-0 h-7 font-body text-[15px] font-semibold text-[#0F172A] focus:ring-0 bg-transparent shadow-none [&>svg]:text-[#00B4D8]">
                                        <SelectValue placeholder={t('selectLocation')} />
                                    </SelectTrigger>
                                    <SelectContent className="border-[#E2E8F0] bg-white shadow-[var(--shadow-hover)] rounded-xl">
                                        <SelectItem value="ercan" className="font-body py-3 cursor-pointer">{t('locations.ercan')}</SelectItem>
                                        <SelectItem value="nicosia" className="font-body py-3 cursor-pointer">{t('locations.nicosia')}</SelectItem>
                                        <SelectItem value="kyrenia" className="font-body py-3 cursor-pointer">{t('locations.kyrenia')}</SelectItem>
                                        <SelectItem value="famagusta" className="font-body py-3 cursor-pointer">{t('locations.famagusta')}</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Pickup */}
                            <div className="px-5 py-4 hover:bg-[#F8FAFC] transition-colors">
                                <label className="flex items-center gap-1.5 font-body font-bold text-[10px] tracking-widest text-[#64748B] uppercase mb-2">
                                    <Calendar className="w-3 h-3 text-[#00B4D8] shrink-0" />
                                    {t('pickupDate')}
                                </label>
                                <Input
                                    type="datetime-local"
                                    min={minDate}
                                    className="w-full border-0 p-0 h-7 font-body text-[15px] font-semibold text-[#0F172A] bg-transparent focus-visible:ring-0 shadow-none [color-scheme:light] cursor-pointer"
                                    onChange={(e) => {
                                        setPickupDate(e.target.value);
                                        if (dropoffDate && e.target.value > dropoffDate) setDropoffDate("");
                                    }}
                                />
                            </div>

                            {/* Return */}
                            <div className="px-5 py-4 hover:bg-[#F8FAFC] transition-colors">
                                <label className="flex items-center gap-1.5 font-body font-bold text-[10px] tracking-widest text-[#64748B] uppercase mb-2">
                                    <Calendar className="w-3 h-3 text-[#00B4D8] shrink-0" />
                                    {t('returnDate')}
                                </label>
                                <Input
                                    type="datetime-local"
                                    min={pickupDate || minDate}
                                    disabled={!pickupDate}
                                    className="w-full border-0 p-0 h-7 font-body text-[15px] font-semibold text-[#0F172A] bg-transparent focus-visible:ring-0 shadow-none [color-scheme:light] cursor-pointer disabled:opacity-35 disabled:cursor-not-allowed"
                                    onChange={(e) => setDropoffDate(e.target.value)}
                                    value={dropoffDate}
                                />
                            </div>
                        </div>

                        {/* CTA */}
                        <div className="px-4 pt-3 pb-0">
                            <Button
                                onClick={handleSearch}
                                style={{ height: 52 }}
                                className="w-full rounded-xl bg-[#0D3B66] hover:bg-[#0a2e52] text-white font-body font-bold text-sm tracking-wide flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(13,59,102,0.25)] transition-all duration-200 hover:shadow-[0_8px_24px_rgba(13,59,102,0.35)]"
                            >
                                <Search className="w-4 h-4 shrink-0" />
                                {t('findCar')}
                            </Button>
                        </div>

                        {/* Trust strip */}
                        <div className="flex flex-wrap items-center justify-center gap-5 px-5 py-3 border-t border-[#E2E8F0] mt-3">
                            {[
                                { icon: ShieldCheck, label: t('trust1') },
                                { icon: Clock,       label: t('trust2') },
                                { icon: Award,       label: t('trust3') },
                            ].map(({ icon: Icon, label }, i) => (
                                <div key={i} className="flex items-center gap-1.5">
                                    <Icon className="w-3.5 h-3.5 text-[#10B981] shrink-0" />
                                    <span className="font-body text-[11px] font-medium text-[#64748B]">{label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </motion.div>

            {/* Scroll cue */}
            <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.4 }}
                onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/50 hover:text-white/90 transition-colors z-20"
                aria-label="Scroll down"
            >
                <span className="font-body text-[9px] font-bold uppercase tracking-[0.28em]">{t('scroll')}</span>
                <div className="w-px h-10 bg-white/20 relative overflow-hidden rounded-full">
                    <motion.div
                        animate={{ y: ["-100%", "100%"] }}
                        transition={{ repeat: Infinity, duration: 1.6, ease: "linear" }}
                        className="absolute inset-0 bg-gradient-to-b from-transparent via-white/80 to-transparent"
                    />
                </div>
            </motion.button>
        </section>
    )
}
