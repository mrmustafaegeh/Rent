'use client';

import * as React from "react"
import Image from "next/image"
import { motion, useScroll, useTransform } from "framer-motion"
import { Calendar, MapPin, Search, ChevronDown, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select"
import { Input } from "@/components/ui/Input"

export function HeroSection() {
    const [location, setLocation] = React.useState("nicosia")
    const [pickupDate, setPickupDate] = React.useState("")
    const [dropoffDate, setDropoffDate] = React.useState("")
    
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
                        Discover Cyprus <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold via-yellow-200 to-gold">Behind the Wheel</span>
                     </motion.h1>
                     
                     <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="font-body text-xl md:text-2xl text-gray-200 font-medium tracking-wide max-w-2xl mx-auto"
                     >
                        Experience premium car rental with delivery to any location in North Cyprus.
                     </motion.p>
                 </div>
                 
                 {/* Floating Search Pill */}
                 <motion.div 
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="w-full max-w-4xl relative z-30"
                 >
                     <div className="bg-white/90 backdrop-blur-xl rounded-3xl md:rounded-full p-2 shadow-[0_20px_60px_rgba(0,0,0,0.3)] ring-1 ring-white/40">
                         <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-gray-200/60">
                             
                             {/* Location */}
                             <div className="flex-1 px-6 py-4 relative group text-left hover:bg-white/50 transition-colors rounded-t-2xl md:rounded-l-full md:rounded-tr-none cursor-pointer">
                                 <label className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 group-focus-within:text-electric transition-colors">
                                    <MapPin className="w-3.5 h-3.5 text-electric/70 group-focus-within:text-electric" /> Pick Up Location
                                 </label>
                                 <Select value={location} onValueChange={setLocation}>
                                    <SelectTrigger className="w-full border-0 p-0 h-auto text-base md:text-lg font-bold text-navy shadow-none focus:ring-0 bg-transparent gap-2 truncate">
                                        <SelectValue placeholder="Select Location" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ercan">Ercan Airport</SelectItem>
                                        <SelectItem value="nicosia">Nicosia (Lefkoşa)</SelectItem>
                                        <SelectItem value="kyrenia">Kyrenia (Girne)</SelectItem>
                                        <SelectItem value="famagusta">Famagusta (Gazimağusa)</SelectItem>
                                    </SelectContent>
                                 </Select>
                             </div>
                             
                             {/* Pickup */}
                             <div className="flex-1 px-6 py-4 relative group text-left hover:bg-white/50 transition-colors">
                                 <label className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 group-focus-within:text-electric transition-colors">
                                    <Calendar className="w-3.5 h-3.5 text-electric/70 group-focus-within:text-electric" /> Pickup Date
                                 </label>
                                 <input
                                    type="datetime-local"
                                    className="w-full border-0 p-0 text-sm md:text-base font-bold text-navy bg-transparent focus:ring-0 placeholder:text-gray-300 font-heading cursor-pointer"
                                    onChange={(e) => setPickupDate(e.target.value)}
                                 />
                             </div>

                             {/* Return */}
                             <div className="flex-1 px-6 py-4 relative group text-left hover:bg-white/50 transition-colors">
                                 <label className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 group-focus-within:text-electric transition-colors">
                                    <Calendar className="w-3.5 h-3.5 text-electric/70 group-focus-within:text-electric" /> Return Date
                                 </label>
                                 <input
                                    type="datetime-local"
                                    className="w-full border-0 p-0 text-sm md:text-base font-bold text-navy bg-transparent focus:ring-0 placeholder:text-gray-300 font-heading cursor-pointer"
                                    onChange={(e) => setDropoffDate(e.target.value)}
                                 />
                             </div>
                             
                             {/* Button */}
                             <div className="p-2 md:pl-0">
                                 <Button 
                                    size="lg" 
                                    onClick={handleSearch}
                                    className="w-full md:w-auto h-16 md:h-full aspect-square rounded-2xl md:rounded-full bg-electric hover:bg-blue-600 text-white shadow-[0_0_20px_rgba(0,119,255,0.4)] hover:shadow-[0_0_30px_rgba(0,119,255,0.6)] transition-all p-0 flex items-center justify-center group/btn relative overflow-hidden"
                                 >
                                    <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                                    <Search className="w-7 h-7 group-hover/btn:scale-110 transition-transform relative z-10" />
                                    <span className="md:hidden ml-2 font-bold text-lg relative z-10">Find Your Car</span>
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
                        "Free Cancellation",
                        "Instant Confirmation",
                        "24/7 Support"
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
                    <span className="text-[10px] uppercase tracking-[0.2em] text-white">Scroll</span>
                    <ChevronDown className="w-5 h-5 text-white" />
                 </motion.div>
             </motion.div>
        </section>
    )
}
