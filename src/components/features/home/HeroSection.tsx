
'use client';

import * as React from "react"
import { OptimizedImage } from "@/components/ui/OptimizedImage"
import { motion, useScroll, useTransform } from "framer-motion"
import { Calendar, MapPin, Search, ChevronDown, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select"
import { Input } from "@/components/ui/Input"
import { useRouter } from "@/navigation";
import { useTranslations } from 'next-intl';

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

    React.useEffect(() => {
        setMounted(true);
    }, []);
    
    // Parallax effect & Ken Burns zoom
    const { scrollY } = useScroll();
    const y = useTransform(scrollY, [0, 500], [0, 200]);
    const opacity = useTransform(scrollY, [0, 300], [1, 0]);
    const scale = useTransform(scrollY, [0, 500], [1, 1.1]);

    const handleSearch = () => {
        const params = new URLSearchParams()
        if (location) params.append("location", location)
        if (pickupDate) params.append("pickup", pickupDate)
        if (dropoffDate) params.append("dropoff", dropoffDate)
        
        router.push(`/cars?${params.toString()}`);
    }

    // Get current date for min attribute - only used after mount
    const minDate = mounted ? new Date().toISOString().slice(0, 16) : "";

    return (
        <section className="relative w-full h-[100dvh] flex items-center justify-center overflow-hidden font-dm-sans">
             {/* Background - Ken Burns & Gradient */}
             <div className="absolute inset-0 z-0 overflow-hidden bg-black">
                <div 
                    className="relative w-full h-full"
                >
                    <OptimizedImage 
                      src="/images/girne-harbor-bright.png"
                      alt="Girne Harbor North Cyprus"
                      fill
                      className="object-cover object-center"
                      priority
                      sizes="100vw"
                      quality={100}
                    />
                </div>
                {/* Improved Readability Overlay - heavier at bottom and top, clean in middle */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/10 to-black/80 z-10" />
                
                {/* Extra Vignette specifically for text blocking */}
                <div className="absolute top-1/4 left-0 right-0 h-1/2 bg-black/40 blur-[100px] z-10 pointer-events-none rounded-full scale-150" />
                
                {/* Top Gold Shimmer Bar */}
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-gold to-transparent z-50 opacity-80" />
             </div>
             
             <motion.div 
               style={{ opacity }}
               className="container relative z-20 mx-auto px-4 flex flex-col items-center text-center py-12"
             >
                 {/* Hero Typography */}
                 <div className="space-y-6 max-w-6xl mx-auto pt-10 md:pt-0 mb-12">
                     <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="flex items-center justify-center gap-4"
                     >
                         <div className="w-10 h-[1px] bg-gold" />
                         <span className="text-gold text-[11px] tracking-[0.3em] font-medium uppercase font-dm-sans">Premium Car Rental</span>
                         <div className="w-10 h-[1px] bg-gold" />
                     </motion.div>

                     <motion.h1 
                        initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        transition={{ duration: 1.0, delay: 0.15, ease: [0.25, 0.1, 0.25, 1.0] }}
                        className="font-bebas text-white text-5xl md:text-7xl leading-[0.95] tracking-tight drop-shadow-[0_4px_15px_rgba(0,0,0,0.8)]"
                     >
                        {title || t('title')} <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-b from-gold via-[#FFD96A] to-yellow-600 drop-shadow-[0_4px_15px_rgba(0,0,0,0.8)]">{subtitleHighlight || t('subtitleHighlight')}</span>
                     </motion.h1>
                     
                     <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.0, delay: 0.3, ease: [0.25, 0.1, 0.25, 1.0] }}
                        className="font-dm-sans text-[15px] sm:text-base md:text-xl text-white font-medium tracking-wide max-w-xl mx-auto drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
                     >
                        {description || t('description')}
                     </motion.p>
                 </div>
                 
                 {/* Luxury Booking Widget */}
                 <motion.div 
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.0, delay: 0.5, ease: [0.25, 0.1, 0.25, 1.0] }}
                    className="w-full max-w-5xl relative z-30"
                 >
                     {/* The Card */}
                     <div className="relative rounded-3xl bg-white/10 backdrop-blur-2xl backdrop-saturate-[150%] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] border border-white/20 group overflow-hidden">
                         
                         {/* Top Shimmer Line */}
                         <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-50" />
                         
                         {/* Outer Glow via Box Shadow (simulated) */}
                         <div className="absolute -inset-[1px] rounded-[25px] bg-gradient-to-br from-white/20 to-transparent -z-10 opacity-30 blur-[2px] pointer-events-none" />

                         <div className="grid grid-cols-1 md:grid-cols-[1fr_1px_1fr_1px_1fr_auto] items-center p-2">
                             
                             {/* Location */}
                             <div className="relative group/field px-5 py-4 cursor-pointer hover:bg-white/5 transition-colors duration-300 rounded-xl">
                                 <label className="flex items-center gap-2 text-[10px] text-white/80 font-bold uppercase tracking-[0.2em] mb-1.5 font-dm-sans">
                                    <MapPin className="w-3.5 h-3.5 text-gold" /> {t('pickupLocation')}
                                 </label>
                                 <Select value={location} onValueChange={setLocation}>
                                    <SelectTrigger className="w-full border-0 p-0 h-6 text-base font-dm-sans font-medium text-white focus:ring-0 bg-transparent gap-2 truncate hover:bg-transparent shadow-none [&>svg]:text-white">
                                        <SelectValue placeholder={t('selectLocation')} />
                                    </SelectTrigger>
                                    <SelectContent className="border-white/10 bg-[#0a0a0a]/95 backdrop-blur-2xl text-white shadow-2xl rounded-xl">
                                        <SelectItem value="ercan" className="focus:bg-white/10 focus:text-[#F5C842] cursor-pointer py-3">{t('locations.ercan')}</SelectItem>
                                        <SelectItem value="nicosia" className="focus:bg-white/10 focus:text-[#F5C842] cursor-pointer py-3">{t('locations.nicosia')}</SelectItem>
                                        <SelectItem value="kyrenia" className="focus:bg-white/10 focus:text-[#F5C842] cursor-pointer py-3">{t('locations.kyrenia')}</SelectItem>
                                        <SelectItem value="famagusta" className="focus:bg-white/10 focus:text-[#F5C842] cursor-pointer py-3">{t('locations.famagusta')}</SelectItem>
                                    </SelectContent>
                                 </Select>
                             </div>

                             {/* Divider */}
                             <div className="hidden md:block w-px h-[60%] bg-white/10 self-center" />
                             
                             {/* Pickup */}
                             <div className="relative group/field px-5 py-4 hover:bg-white/5 transition-colors duration-300 rounded-xl">
                                 <label className="flex items-center gap-2 text-[10px] text-white/80 font-bold uppercase tracking-[0.2em] mb-1.5 font-dm-sans">
                                    <Calendar className="w-3.5 h-3.5 text-gold" /> {t('pickupDate')}
                                 </label>
                                 <Input
                                    type="datetime-local"
                                    min={minDate}
                                    className="w-full border-0 p-0 h-6 text-[15px] font-dm-sans text-white bg-transparent focus-visible:ring-0 shadow-none placeholder:text-white/30 cursor-pointer font-normal [color-scheme:dark] selection:bg-[#F5C842]/30"
                                    onChange={(e) => {
                                        setPickupDate(e.target.value);
                                        if (dropoffDate && e.target.value > dropoffDate) {
                                            setDropoffDate("");
                                        }
                                    }}
                                 />
                             </div>

                             {/* Divider */}
                             <div className="hidden md:block w-px h-[60%] bg-white/10 self-center" />

                             {/* Return */}
                             <div className="relative group/field px-5 py-4 hover:bg-white/5 transition-colors duration-300 rounded-xl">
                                 <label className="flex items-center gap-2 text-[10px] text-white/80 font-bold uppercase tracking-[0.2em] mb-1.5 font-dm-sans">
                                    <Calendar className="w-3.5 h-3.5 text-gold" /> {t('returnDate')}
                                 </label>
                                 <Input
                                    type="datetime-local"
                                    min={pickupDate || minDate}
                                    disabled={!pickupDate}
                                    className="w-full border-0 p-0 h-6 text-[15px] font-dm-sans text-white bg-transparent focus-visible:ring-0 shadow-none placeholder:text-white/30 cursor-pointer font-normal disabled:opacity-30 disabled:cursor-not-allowed [color-scheme:dark] selection:bg-[#F5C842]/30"
                                    onChange={(e) => setDropoffDate(e.target.value)}
                                    value={dropoffDate}
                                 />
                             </div>
                             
                             {/* Button */}
                             <div className="p-2 md:pl-2 w-full md:w-auto self-stretch flex items-center">
                                 <Button 
                                    onClick={handleSearch}
                                    className="w-full md:w-48 h-14 md:h-full rounded-2xl bg-gradient-to-br from-gold to-yellow-500 hover:from-yellow-400 hover:to-gold text-navy shadow-[0_8px_25px_rgba(212,175,55,0.4)] hover:shadow-[0_12px_35px_rgba(212,175,55,0.6)] transition-all duration-500 p-0 flex flex-row items-center justify-center gap-3 group/btn relative overflow-hidden active:scale-95 border-none"
                                 >
                                    <span className="font-dm-sans font-black text-sm uppercase tracking-wider">{t('findCar')}</span>
                                    <div className="w-8 h-8 rounded-full bg-navy/10 flex items-center justify-center group-hover/btn:bg-navy/20 transition-colors">
                                        <Search className="w-4 h-4 stroke-[2.5px] group-hover/btn:rotate-12 transition-transform duration-300" />
                                    </div>
                                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500 ease-out z-[-1]" />
                                 </Button>
                             </div>
                         </div>

                         {/* Perks Strip */}
                         <div className="border-t border-white/10 px-7 py-3 flex flex-wrap justify-center md:justify-start gap-6 bg-black/10 backdrop-blur-md">
                            {[
                                t('trust1'),
                                t('trust2'),
                                t('trust3')
                            ].map((item, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <div className="w-1 h-1 rounded-full bg-[#F5C842] shadow-[0_0_5px_#F5C842]" />
                                    <span className="font-dm-sans text-[11px] tracking-wide text-white/50">{item}</span>
                                </div>
                            ))}
                         </div>
                     </div>
                 </motion.div>
                 
                 {/* Scroll Indicator */}
                 <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.0, duration: 1.0 }}
                    onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 cursor-pointer flex flex-col items-center gap-3 opacity-60 hover:opacity-100 transition-opacity"
                 >
                    <span className="text-[9px] font-dm-sans font-bold uppercase tracking-[0.3em] text-[#F5C842]">{t('scroll')}</span>
                    <div className="w-[1px] h-12 bg-white/10 relative overflow-hidden">
                        <motion.div 
                            animate={{ y: ["-100%", "100%"] }}
                            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                            className="absolute inset-0 w-full h-full bg-gradient-to-b from-transparent via-[#F5C842] to-transparent"
                        />
                    </div>
                 </motion.div>
             </motion.div>
        </section>
    )
}
