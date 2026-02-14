'use client';

import * as React from "react"
import Image from "next/image"
import { motion, useScroll, useTransform } from "framer-motion"
import { Calendar, MapPin, Search, ChevronDown, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select"
import { Input } from "@/components/ui/Input"

import { useTranslations } from 'next-intl';

export function HeroSection() {
    const [location, setLocation] = React.useState("nicosia")
    const [pickupDate, setPickupDate] = React.useState("")
    const [dropoffDate, setDropoffDate] = React.useState("")
    const t = useTranslations('HeroSection');
    
    // Parallax effect
    const { scrollY } = useScroll();
    const y = useTransform(scrollY, [0, 500], [0, 200]);
    const opacity = useTransform(scrollY, [0, 300], [1, 0]);

    const handleSearch = () => {
        const params = new URLSearchParams()
        if (location) params.append("location", location)
        if (pickupDate) params.append("pickup", pickupDate)
        if (dropoffDate) params.append("dropoff", dropoffDate)
        
        window.location.href = `/cars?${params.toString()}`
    }

    return (
        <section className="relative w-full h-[100vh] min-h-[800px] flex items-center justify-center overflow-hidden">
             {/* Background Video/Image with Parallax */}
             <motion.div style={{ y }} className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-br from-[#0A1628]/80 via-[#0A1628]/60 to-[#0A1628]/30 z-10" />
                <Image 
                  src="/images/hero-bg-cyprus.png"
                  alt="North Cyprus Scenic Drive"
                  fill
                  className="object-cover"
                  priority
                />
             </motion.div>
             
             <motion.div 
               style={{ opacity }}
               className="container relative z-20 mx-auto px-4 flex flex-col items-center text-center space-y-10 md:space-y-16"
             >
                 <div className="space-y-6 max-w-5xl mx-auto pt-10">
                     <motion.h1 
                        initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="font-heading font-black text-5xl md:text-7xl lg:text-[5.5rem] leading-[1.05] text-white drop-shadow-2xl tracking-tight"
                     >
                        {t('title')} <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold via-yellow-200 to-gold">{t('subtitleHighlight')}</span>
                     </motion.h1>
                     
                     <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="font-body text-xl md:text-2xl text-gray-200 font-medium tracking-wide max-w-2xl mx-auto"
                     >
                        {t('description')}
                     </motion.p>
                 </div>
                 
                 {/* Floating Search Pill */}
                 <motion.div 
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="w-full max-w-4xl relative z-30"
                 >
                     <div className="bg-white/80 backdrop-blur-2xl rounded-3xl md:rounded-full p-3 shadow-[0_20px_60px_rgba(0,0,0,0.2)] border border-white/40">
                         <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-gray-200/50">
                             
                             {/* Location */}
                             <div className="flex-1 px-8 py-4 relative group text-left hover:bg-white/40 transition-colors rounded-t-2xl md:rounded-l-full md:rounded-tr-none cursor-pointer">
                                 <label className="flex items-center gap-2 text-[11px] font-bold text-navy/60 uppercase tracking-widest mb-1 group-focus-within:text-electric transition-colors">
                                    <MapPin className="w-4 h-4 text-electric" /> {t('pickupLocation')}
                                 </label>
                                 <Select value={location} onValueChange={setLocation}>
                                    <SelectTrigger className="w-full border-0 p-0 h-9 text-lg md:text-xl font-black text-navy shadow-none focus:ring-0 bg-transparent gap-2 truncate font-heading tracking-tight">
                                        <SelectValue placeholder={t('selectLocation')} />
                                    </SelectTrigger>
                                    <SelectContent className="font-body border-white/20 shadow-xl rounded-xl">
                                        <SelectItem value="ercan">Ercan Airport</SelectItem>
                                        <SelectItem value="nicosia">Nicosia (Lefkoşa)</SelectItem>
                                        <SelectItem value="kyrenia">Kyrenia (Girne)</SelectItem>
                                        <SelectItem value="famagusta">Famagusta (Gazimağusa)</SelectItem>
                                    </SelectContent>
                                 </Select>
                             </div>
                             
                             {/* Pickup */}
                             <div className="flex-1 px-8 py-4 relative group text-left hover:bg-white/40 transition-colors">
                                 <label className="flex items-center gap-2 text-[11px] font-bold text-navy/60 uppercase tracking-widest mb-1 group-focus-within:text-electric transition-colors">
                                    <Calendar className="w-4 h-4 text-electric" /> {t('pickupDate')}
                                 </label>
                                 <Input
                                    type="datetime-local"
                                    min={new Date().toISOString().slice(0, 16)}
                                    className="w-full border-0 p-0 text-sm md:text-base font-bold text-navy bg-transparent focus-visible:ring-0 shadow-none placeholder:text-navy/30 font-heading cursor-pointer h-9"
                                    onChange={(e) => {
                                        setPickupDate(e.target.value);
                                        // Reset dropoff if it's before new pickup
                                        if (dropoffDate && e.target.value > dropoffDate) {
                                            setDropoffDate("");
                                        }
                                    }}
                                 />
                             </div>

                             {/* Return */}
                             <div className="flex-1 px-8 py-4 relative group text-left hover:bg-white/40 transition-colors">
                                 <label className="flex items-center gap-2 text-[11px] font-bold text-navy/60 uppercase tracking-widest mb-1 group-focus-within:text-electric transition-colors">
                                    <Calendar className="w-4 h-4 text-electric" /> {t('returnDate')}
                                 </label>
                                 <Input
                                    type="datetime-local"
                                    min={pickupDate || new Date().toISOString().slice(0, 16)}
                                    disabled={!pickupDate}
                                    className="w-full border-0 p-0 text-sm md:text-base font-bold text-navy bg-transparent focus-visible:ring-0 shadow-none placeholder:text-navy/30 font-heading cursor-pointer h-9 disabled:opacity-50 disabled:cursor-not-allowed"
                                    onChange={(e) => setDropoffDate(e.target.value)}
                                    value={dropoffDate}
                                 />
                             </div>
                             
                             {/* Button */}
                             <div className="p-2 md:pl-2">
                                 <Button 
                                    size="lg" 
                                    onClick={handleSearch}
                                    className="w-full md:w-auto h-16 md:h-full aspect-square rounded-2xl md:rounded-full bg-electric hover:bg-blue-600 text-white shadow-[0_8px_30px_rgba(0,119,255,0.3)] hover:shadow-[0_15px_40px_rgba(0,119,255,0.5)] hover:-translate-y-1 transition-all duration-300 p-0 flex items-center justify-center group/btn relative overflow-hidden"
                                 >
                                    <div className="absolute inset-0 bg-gradient-to-tr from-white/30 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                                    <Search className="w-8 h-8 group-hover/btn:scale-110 transition-transform relative z-10 stroke-[2.5px]" />
                                    <span className="md:hidden ml-2 font-bold text-lg relative z-10">{t('findCar')}</span>
                                 </Button>
                             </div>
                         </div>
                     </div>
                 </motion.div>
                 
                 {/* Trust Indicators */}
                 <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                    className="flex flex-wrap justify-center gap-6 md:gap-12 pt-4"
                 >
                    {[
                        t('trust1'),
                        t('trust2'),
                        t('trust3')
                    ].map((item, index) => (
                        <div key={index} className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10">
                            <CheckCircle2 className="w-4 h-4 text-gold" />
                            <span className="font-medium text-white/90 text-sm md:text-base">{item}</span>
                        </div>
                    ))}
                 </motion.div>
                 
                 {/* Scroll Indicator */}
                 <motion.div 
                    animate={{ y: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                    onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 cursor-pointer hidden md:flex flex-col items-center gap-2 opacity-60 hover:opacity-100 transition-opacity"
                 >
                    <span className="text-[10px] uppercase tracking-[0.2em] text-white">{t('scroll')}</span>
                    <ChevronDown className="w-5 h-5 text-white" />
                 </motion.div>
             </motion.div>
        </section>
    )
}
