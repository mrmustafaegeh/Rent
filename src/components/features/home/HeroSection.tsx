'use client';

import * as React from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Calendar, MapPin, Search } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select"
import { Input } from "@/components/ui/Input"

export function HeroSection() {
    const [location, setLocation] = React.useState("")
    const [pickupDate, setPickupDate] = React.useState("")
    const [dropoffDate, setDropoffDate] = React.useState("")
    
    const handleSearch = () => {
        const params = new URLSearchParams()
        if (location) params.append("location", location)
        if (pickupDate) params.append("pickup", pickupDate)
        if (dropoffDate) params.append("dropoff", dropoffDate)
        
        window.location.href = `/cars?${params.toString()}`
    }

    return (
        <section className="relative w-full h-[600px] md:h-[700px] flex items-center justify-center overflow-hidden">
             {/* Background Image */}
             <div className="absolute inset-0 z-0 select-none">
                <Image 
                  src="/images/hero-bg.png"
                  alt="North Cyprus Scenic Drive"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-black/40" />
             </div>
             
             <div className="container relative z-10 mx-auto px-4 flex flex-col items-center text-center text-white space-y-8">
                 <motion.h1 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-4xl md:text-6xl font-bold tracking-tight drop-shadow-lg"
                 >
                    Explore North Cyprus with Freedom<br/>
                    <span className="text-primary font-extrabold text-stroke">Rent Your Perfect Car</span>
                 </motion.h1>
                 
                 <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-lg md:text-xl text-white/90 max-w-2xl drop-shadow-md"
                 >
                    Best rates for luxury, sports, and economy cars in Nicosia, Kyrenia, and Famagusta.
                 </motion.p>
                 
                 {/* Search Widget */}
                 <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="w-full max-w-4xl bg-white/10 backdrop-blur-md border border-white/20 p-4 md:p-6 rounded-xl shadow-2xl"
                 >
                     <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                         <div className="space-y-2 text-left">
                             <label className="text-xs font-semibold uppercase text-white/80 flex items-center gap-1">
                                <MapPin className="w-3 h-3" /> Pick-up Location
                             </label>
                             <Select onValueChange={setLocation}>
                                <SelectTrigger className="bg-white/90 border-0 text-black h-10">
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
                         
                          <div className="space-y-2 text-left">
                             <label className="text-xs font-semibold uppercase text-white/80 flex items-center gap-1">
                                <Calendar className="w-3 h-3" /> Pick-up Date
                             </label>
                             <Input 
                                type="datetime-local" 
                                className="bg-white/90 border-0 text-black placeholder:text-gray-500 h-10"
                                onChange={(e) => setPickupDate(e.target.value)}
                             />
                         </div>

                          <div className="space-y-2 text-left">
                             <label className="text-xs font-semibold uppercase text-white/80 flex items-center gap-1">
                                <Calendar className="w-3 h-3" /> Drop-off Date
                             </label>
                             <Input 
                                type="datetime-local" 
                                className="bg-white/90 border-0 text-black placeholder:text-gray-500 h-10"
                                onChange={(e) => setDropoffDate(e.target.value)}
                             />
                         </div>
                         
                         <div className="flex items-end">
                             <Button 
                                size="lg" 
                                className="w-full bg-primary hover:bg-primary/90 text-white font-bold h-10 shadow-lg transition-transform hover:scale-[1.02]"
                                onClick={handleSearch}
                             >
                                <Search className="w-4 h-4 mr-2" /> Search Cars
                             </Button>
                         </div>
                     </div>
                 </motion.div>
                 
                 <div className="flex flex-wrap justify-center gap-4 md:gap-8 text-sm font-medium text-white/80 pt-4">
                    <span className="flex items-center gap-2 px-3 py-1 bg-black/20 rounded-full backdrop-blur-sm">✓ 300+ Cars Available</span>
                    <span className="flex items-center gap-2 px-3 py-1 bg-black/20 rounded-full backdrop-blur-sm">✓ 24/7 Support</span>
                    <span className="flex items-center gap-2 px-3 py-1 bg-black/20 rounded-full backdrop-blur-sm">✓ Best Prices Guaranteed</span>
                 </div>
             </div>
        </section>
    )
}
