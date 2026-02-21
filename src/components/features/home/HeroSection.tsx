
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
             <div className="absolute inset-0 z-0 overflow-hidden bg-[#050505]">
                <motion.div 
                    initial={{ scale: 1.04 }}
                    animate={{ scale: 1.10 }}
                    transition={{ duration: 18, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
                    className="relative w-full h-full"
                >
                    <OptimizedImage 
                      src="/images/kyrenia-hero.png"
                      alt="Kyrenia Harbour North Cyprus"
                      fill
                      className="object-cover"
                      priority
                      sizes="100vw"
                      quality={95}
                    />
                </motion.div>
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/60 to-black/85 z-10" />
                
                {/* Grain Texture */}
                <div className="absolute inset-0 z-10 opacity-35 mix-blend-overlay pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' opacity=\'1\'/%3E%3C/svg%3E")' }} />
                
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
                        className="font-bebas text-white text-5xl md:text-6xl leading-[0.95] tracking-tight drop-shadow-2xl"
                     >
                        {title || t('title')} <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F5C842] via-[#FFD96A] to-[#F5C842]">{subtitleHighlight || t('subtitleHighlight')}</span>
                     </motion.h1>
                     
                     <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.0, delay: 0.3, ease: [0.25, 0.1, 0.25, 1.0] }}
                        className="font-dm-sans text-[15px] sm:text-base md:text-lg text-white/60 font-light tracking-wide max-w-xl mx-auto"
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
                     <div className="relative rounded-[24px] bg-[rgba(10,10,10,0.55)] backdrop-blur-[28px] backdrop-saturate-[180%] shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 group overflow-hidden">
                         
                         {/* Top Shimmer Line */}
                         <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-gold/50 to-transparent opacity-50" />
                         
                         {/* Outer Glow via Box Shadow (simulated) */}
                         <div className="absolute -inset-[1px] rounded-[25px] bg-gradient-to-br from-[#F5C842]/20 to-transparent -z-10 opacity-50 blur-sm pointer-events-none" />

                         <div className="grid grid-cols-1 md:grid-cols-[1.1fr_1px_1fr_1px_1fr_auto] items-center">
                             
                             {/* Location */}
                             <div className="relative group/field px-5 py-4 cursor-pointer hover:bg-[#F5C842]/10 transition-colors duration-300">
                                 <label className="flex items-center gap-2 text-[9.5px] text-[#F5C842] font-medium uppercase tracking-[0.2em] mb-1.5 font-dm-sans">
                                    <MapPin className="w-3 h-3" /> {t('pickupLocation')}
                                 </label>
                                 <Select value={location} onValueChange={setLocation}>
                                    <SelectTrigger className="w-full border-0 p-0 h-6 text-[15px] font-dm-sans text-white focus:ring-0 bg-transparent gap-2 truncate font-normal hover:bg-transparent shadow-none [&>svg]:text-gold">
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
                             <div className="hidden md:block w-px h-12 bg-white/10" />
                             
                             {/* Pickup */}
                             <div className="relative group/field px-5 py-4 hover:bg-[#F5C842]/10 transition-colors duration-300">
                                 <label className="flex items-center gap-2 text-[9.5px] text-[#F5C842] font-medium uppercase tracking-[0.2em] mb-1.5 font-dm-sans">
                                    <Calendar className="w-3 h-3" /> {t('pickupDate')}
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
                             <div className="hidden md:block w-px h-12 bg-white/10" />

                             {/* Return */}
                             <div className="relative group/field px-5 py-4 hover:bg-[#F5C842]/10 transition-colors duration-300">
                                 <label className="flex items-center gap-2 text-[9.5px] text-[#F5C842] font-medium uppercase tracking-[0.2em] mb-1.5 font-dm-sans">
                                    <Calendar className="w-3 h-3" /> {t('returnDate')}
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
                             <div className="p-2 md:pr-2 w-full md:w-auto">
                                 <Button 
                                    onClick={handleSearch}
                                    className="w-full md:w-auto h-14 md:h-full aspect-auto md:aspect-square rounded-[18px] bg-[#F5C842] hover:bg-[#FFD96A] text-[#0a0a0a] shadow-[0_10px_30px_rgba(245,200,66,0.25)] hover:shadow-[0_14px_40px_rgba(245,200,66,0.45)] hover:scale-[1.03] hover:-translate-y-[2px] transition-all duration-500 p-0 flex flex-col items-center justify-center group/btn relative overflow-hidden active:scale-95"
                                 >
                                    <div className="flex flex-row md:flex-col items-center gap-2">
                                        <Search className="w-5 h-5 stroke-[2.5px] group-hover/btn:translate-x-[3px] md:group-hover/btn:translate-x-0 md:group-hover/btn:-translate-y-1 transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]" />
                                        <span className="font-dm-sans font-bold text-[11px] uppercase tracking-widest">{t('findCar').split(' ')[0]}</span>
                                    </div>
                                 </Button>
                             </div>
                         </div>

                         {/* Perks Strip */}
                         <div className="border-t border-white/10 px-7 py-3 flex flex-wrap justify-center md:justify-start gap-6 bg-black/20">
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
