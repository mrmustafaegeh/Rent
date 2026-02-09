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
                <div className="absolute inset-0 bg-gradient-to-br from-[#0A1628]/70 to-[#0A1628]/30 z-10 mix-blend-multiply" />
                {/* Fallback Image */}
                <Image 
                  src="/images/hero-bg-cyprus.png"
                  alt="North Cyprus Scenic Drive"
                  fill
                  className="object-cover"
                  priority
                />
                {/* 
                  Video Background Reminder: 
                  Uncomment and add source when video is available.
                  <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover">
                    <source src="/videos/hero.mp4" type="video/mp4" />
                  </video> 
                */}
             </motion.div>
             
             <motion.div 
               style={{ opacity }}
               className="container relative z-20 mx-auto px-4 flex flex-col items-center text-center space-y-12"
             >
                 <div className="space-y-4 max-w-5xl mx-auto">
                     <motion.h1 
                        initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="font-heading font-black text-5xl md:text-7xl lg:text-[5rem] leading-[1.1] text-transparent bg-clip-text bg-gradient-to-b from-white to-white/80 drop-shadow-2xl"
                     >
                        Discover Cyprus <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold to-yellow-200">Behind the Wheel</span>
                     </motion.h1>
                     
                     <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="font-body text-xl md:text-2xl text-electric font-medium tracking-wide drop-shadow-lg"
                     >
                        Premium Car Rentals from €30/day
                     </motion.p>
                 </div>
                 
                 {/* Floating Search Card */}
                 <motion.div 
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="w-full max-w-5xl bg-white/10 backdrop-blur-[20px] border border-white/20 p-2 md:p-4 rounded-3xl shadow-[0_0_40px_rgba(0,0,0,0.2)] ring-1 ring-white/10"
                 >
                     <div className="bg-white/95 rounded-2xl p-6 shadow-xl">
                         <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
                             {/* Location */}
                             <div className="md:col-span-3 space-y-2 text-left relative group">
                                 <label className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-primary" /> Location
                                 </label>
                                 <Select value={location} onValueChange={setLocation}>
                                    <SelectTrigger className="w-full border-0 border-r border-gray-100 rounded-none px-0 h-10 text-lg font-bold text-navy focus:ring-0 shadow-none bg-transparent hover:bg-gray-50/50 transition-colors">
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
                             <div className="md:col-span-3 space-y-2 text-left relative border-t md:border-t-0 md:border-l border-gray-100 md:pl-6">
                                 <label className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-primary" /> Pickup Date
                                 </label>
                                 <Input 
                                    type="datetime-local" 
                                    className="border-0 text-lg font-bold text-navy px-0 h-10 focus-visible:ring-0 shadow-none bg-transparent placeholder:text-gray-300"
                                    onChange={(e) => setPickupDate(e.target.value)}
                                 />
                             </div>

                             {/* Return */}
                             <div className="md:col-span-3 space-y-2 text-left relative border-t md:border-t-0 md:border-l border-gray-100 md:pl-6">
                                 <label className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-primary" /> Return Date
                                 </label>
                                 <Input 
                                    type="datetime-local" 
                                    className="border-0 text-lg font-bold text-navy px-0 h-10 focus-visible:ring-0 shadow-none bg-transparent placeholder:text-gray-300"
                                    onChange={(e) => setDropoffDate(e.target.value)}
                                 />
                             </div>
                             
                             {/* Button */}
                             <div className="md:col-span-3">
                                 <Button 
                                    size="lg" 
                                    className="w-full h-16 bg-gradient-to-r from-electric to-blue-600 hover:from-blue-600 hover:to-electric text-white font-bold text-lg rounded-xl shadow-[0_4px_20px_rgba(0,212,255,0.4)] hover:shadow-[0_8px_30px_rgba(0,212,255,0.6)] hover:scale-[1.02] transition-all duration-300"
                                    onClick={handleSearch}
                                 >
                                    <Search className="w-6 h-6 mr-2" /> Search Cars
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
                    className="flex flex-wrap justify-center gap-8 md:gap-12"
                 >
                    {[
                        "300+ Premium Cars",
                        "No Hidden Fees",
                        "24/7 Support"
                    ].map((item, index) => (
                        <div key={index} className="flex items-center gap-3 group">
                            <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center border border-gold/40 group-hover:scale-110 transition-transform">
                                <CheckCircle2 className="w-4 h-4 text-gold" />
                            </div>
                            <span className="font-medium text-white/90 text-lg">{item}</span>
                        </div>
                    ))}
                 </motion.div>
                 
                 {/* Scroll Indicator */}
                 <motion.div 
                    animate={{ y: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 cursor-pointer hidden md:flex flex-col items-center gap-2"
                    onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
                 >
                    <span className="text-xs uppercase tracking-widest text-white/60">Scroll to explore</span>
                    <div className="w-[1px] h-12 bg-gradient-to-b from-gold to-transparent" />
                 </motion.div>
             </motion.div>
        </section>
    )
}
