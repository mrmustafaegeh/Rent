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
        <section className="relative w-full h-screen md:h-[100vh] min-h-[500px] md:min-h-[800px] flex items-center justify-center overflow-hidden">
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
               className="container relative z-20 mx-auto px-4 flex flex-col items-center text-center space-y-8 md:space-y-16 py-12"
             >
                 <div className="space-y-4 md:space-y-6 max-w-5xl mx-auto pt-10 md:pt-0">
                     <motion.h1 
                        initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="font-heading font-black text-4xl sm:text-5xl md:text-7xl lg:text-[5.5rem] leading-[1.1] md:leading-[1.05] text-white drop-shadow-2xl tracking-tight"
                     >
                        {t('title')} <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold via-yellow-200 to-gold">{t('subtitleHighlight')}</span>
                     </motion.h1>
                     
                     <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="font-body text-base sm:text-lg md:text-2xl text-gray-200 font-medium tracking-wide max-w-2xl mx-auto opacity-90"
                     >
                        {t('description')}
                     </motion.p>
                 </div>
                 
                 {/* Floating Search Pill */}
                 <motion.div 
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="w-full max-w-5xl relative z-30"
                 >
                     <div className="bg-black/40 backdrop-blur-3xl rounded-3xl md:rounded-[2.5rem] p-1.5 md:p-2 shadow-[0_40px_100px_rgba(0,0,0,0.5)] border border-white/10 ring-1 ring-white/10 overflow-hidden group/pill">
                         <div className="flex flex-col md:flex-row items-center gap-1 p-1">
                             
                             {/* Location */}
                             <div className="flex-1 w-full px-5 py-4 md:px-8 md:py-5 relative group text-left hover:bg-white/5 transition-all duration-300 rounded-2xl md:rounded-3xl cursor-pointer">
                                 <label className="flex items-center gap-2 text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-1.5 md:mb-2 group-focus-within:text-gold group-hover:text-white/60 transition-colors">
                                    <MapPin className="w-3 h-3 md:w-3.5 md:h-3.5 text-gold/80" /> {t('pickupLocation')}
                                 </label>
                                 <Select value={location} onValueChange={setLocation}>
                                    <SelectTrigger className="w-full border-0 p-0 h-7 md:h-8 text-lg font-heading font-black text-white shadow-none focus:ring-0 bg-transparent gap-2 truncate tracking-tight">
                                        <SelectValue placeholder={<span className="text-white/30 font-bold">{t('selectLocation')}</span>} />
                                    </SelectTrigger>
                                    <SelectContent className="font-body border-white/10 bg-navy/95 backdrop-blur-2xl text-white shadow-2xl rounded-2xl ring-1 ring-white/5">
                                        <SelectItem value="ercan" className="focus:bg-white/10 focus:text-gold cursor-pointer py-4 transition-colors">Ercan Airport</SelectItem>
                                        <SelectItem value="nicosia" className="focus:bg-white/10 focus:text-gold cursor-pointer py-4 transition-colors">Nicosia (Lefkoşa)</SelectItem>
                                        <SelectItem value="kyrenia" className="focus:bg-white/10 focus:text-gold cursor-pointer py-4 transition-colors">Kyrenia (Girne)</SelectItem>
                                        <SelectItem value="famagusta" className="focus:bg-white/10 focus:text-gold cursor-pointer py-4 transition-colors">Famagusta (Gazimağusa)</SelectItem>
                                    </SelectContent>
                                 </Select>
                             </div>

                             <div className="hidden md:block w-px h-14 bg-white/5 self-center mx-2" />
                             
                             {/* Pickup */}
                             <div className="flex-1 w-full px-5 py-4 md:px-8 md:py-5 relative group text-left hover:bg-white/5 transition-all duration-300 rounded-2xl md:rounded-3xl">
                                 <label className="flex items-center gap-2 text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-1.5 md:mb-2 group-focus-within:text-gold group-hover:text-white/60 transition-colors">
                                    <Calendar className="w-3 h-3 md:w-3.5 md:h-3.5 text-gold/80" /> {t('pickupDate')}
                                 </label>
                                 <Input
                                    type="datetime-local"
                                    min={new Date().toISOString().slice(0, 16)}
                                    className="w-full border-0 p-0 text-base md:text-lg font-heading font-black text-white bg-transparent focus-visible:ring-0 shadow-none placeholder:text-white/20 cursor-pointer h-7 md:h-8 selection:bg-gold/30"
                                    onChange={(e) => {
                                        setPickupDate(e.target.value);
                                        if (dropoffDate && e.target.value > dropoffDate) {
                                            setDropoffDate("");
                                        }
                                    }}
                                 />
                             </div>

                             <div className="hidden md:block w-px h-14 bg-white/5 self-center mx-2" />

                             {/* Return */}
                             <div className="flex-1 w-full px-5 py-4 md:px-8 md:py-5 relative group text-left hover:bg-white/5 transition-all duration-300 rounded-2xl md:rounded-3xl">
                                 <label className="flex items-center gap-2 text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-1.5 md:mb-2 group-focus-within:text-gold group-hover:text-white/60 transition-colors">
                                    <Calendar className="w-3 h-3 md:w-3.5 md:h-3.5 text-gold/80" /> {t('returnDate')}
                                 </label>
                                 <Input
                                    type="datetime-local"
                                    min={pickupDate || new Date().toISOString().slice(0, 16)}
                                    disabled={!pickupDate}
                                    className="w-full border-0 p-0 text-base md:text-lg font-heading font-black text-white bg-transparent focus-visible:ring-0 shadow-none placeholder:text-white/20 cursor-pointer h-7 md:h-8 disabled:opacity-20 disabled:cursor-not-allowed selection:bg-gold/30"
                                    onChange={(e) => setDropoffDate(e.target.value)}
                                    value={dropoffDate}
                                 />
                             </div>
                             
                             {/* Button */}
                             <div className="w-full md:w-auto p-1 md:p-2">
                                 <Button 
                                    size="lg" 
                                    onClick={handleSearch}
                                    className="w-full md:w-auto h-14 md:h-24 aspect-auto md:aspect-square rounded-xl md:rounded-[2rem] bg-gold hover:bg-white text-navy shadow-[0_15px_40px_rgba(255,215,0,0.2)] hover:shadow-[0_20px_50px_rgba(255,215,0,0.4)] hover:scale-[1.02] md:hover:scale-105 active:scale-95 transition-all duration-500 p-0 flex items-center justify-center group/btn relative overflow-hidden group-hover/pill:shadow-gold/10"
                                 >
                                    <div className="absolute inset-0 bg-gradient-to-tr from-white/60 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                                    <Search className="w-5 h-5 md:w-10 md:h-10 group-hover/btn:scale-110 group-hover/btn:rotate-6 transition-all duration-500 relative z-10 stroke-[2.5px]" />
                                    <span className="md:hidden ml-3 font-black text-lg relative z-10 uppercase tracking-widest">{t('findCar')}</span>
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
                    className="flex flex-wrap justify-center gap-4 md:gap-12 pt-4"
                 >
                    {[
                        t('trust1'),
                        t('trust2'),
                        t('trust3')
                    ].map((item, index) => (
                        <div key={index} className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10">
                            <CheckCircle2 className="w-3.5 h-3.5 text-gold" />
                            <span className="font-medium text-white/90 text-xs md:text-base">{item}</span>
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
