"use client"

import * as React from "react"
import { Calendar, Info, MapPin, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { Separator } from "@/components/ui/Separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select"
import { addDays, format } from "date-fns"
import { useRouter } from "next/navigation"

interface PricingTier {
  daily: number
  threeDays?: number
  weekly?: number
}

interface BookingWidgetProps {
  pricing: PricingTier
  vehicleId: string
}

export function BookingWidget({ pricing, vehicleId }: BookingWidgetProps) {
  const router = useRouter()
  // Use empty initial state to avoid hydration mismatch
  const [pickupDate, setPickupDate] = React.useState<string>("")
  const [dropoffDate, setDropoffDate] = React.useState<string>("")
  const [pickupLocation, setPickupLocation] = React.useState("ercan")
  const [dropoffLocation, setDropoffLocation] = React.useState("ercan")
  
  const [mounted, setMounted] = React.useState(false)
  
  // Set default dates on mount
  React.useEffect(() => {
      setMounted(true)
      setPickupDate(new Date().toISOString().split('T')[0])
      setDropoffDate(addDays(new Date(), 3).toISOString().split('T')[0])
  }, [])

  // Basic calculation
  const calculateTotal = () => {
    if (!pickupDate || !dropoffDate) return { days: 0, rate: pricing.daily, total: 0 }
    
    const start = new Date(pickupDate)
    const end = new Date(dropoffDate)
    const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
    const days = Math.max(1, diff)

    let rate = pricing.daily
    
    // Simple logic for improved pricing display
    // In a real app, this might come from the backend or more complex logic
    if (days >= 7) rate = pricing.weekly || (pricing.daily * 0.85)
    else if (days >= 3) rate = pricing.threeDays || (pricing.daily * 0.9)

    return {
      days,
      rate: Math.round(rate),
      total: Math.round(days * rate)
    }
  }

  const { days, rate, total } = calculateTotal()

  const handleBookNow = () => {
      if (!pickupDate || !dropoffDate) return

      const params = new URLSearchParams()
      params.set('vehicleId', vehicleId)
      params.set('startDate', pickupDate)
      params.set('endDate', dropoffDate)
      params.set('pickupLocation', pickupLocation)
      params.set('dropoffLocation', dropoffLocation)
      
      router.push(`/checkout?${params.toString()}`)
  }

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgba(0,0,0,0.08)] p-6 md:p-8 space-y-6 md:space-y-8 sticky top-24 overflow-hidden">
      <div className="flex justify-between items-end border-b border-gray-100 pb-6">
        <div>
            <span className="text-gray-400 text-xs font-bold uppercase tracking-wider block mb-1">Daily Rate</span>
            <div className="flex items-baseline gap-1">
                <span className="text-3xl font-heading font-black text-navy">€{Math.round(rate)}</span>
                <span className="text-sm text-gray-400 font-medium">/ day</span>
            </div>
        </div>
        <div className="text-right">
            <span className="text-emerald-600 bg-emerald-50 px-2 py-1 rounded text-xs font-bold">Best Price</span>
        </div>
      </div>
      
      <div className="space-y-5">
        {/* Pickup & Dropoff Location */}
        <div className="space-y-4">
            <div className="grid gap-2">
                <Label className="text-xs font-bold text-navy uppercase tracking-wider">Pickup Location</Label>
                <Select value={pickupLocation} onValueChange={setPickupLocation}>
                    <SelectTrigger className="h-12 border-gray-200 bg-gray-50/50 rounded-xl focus:ring-gold/20 focus:border-gold">
                        <div className="flex items-center gap-2 text-navy font-medium">
                            <MapPin className="w-4 h-4 text-gold" />
                            <SelectValue placeholder="Select location" />
                        </div>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ercan">Ercan Airport (Free Delivery)</SelectItem>
                        <SelectItem value="nicosia">Nicosia Central</SelectItem>
                        <SelectItem value="kyrenia">Kyrenia Harbor</SelectItem>
                        <SelectItem value="famagusta">Famagusta City</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            
             <div className="grid gap-2">
                <Label className="text-xs font-bold text-navy uppercase tracking-wider">Return Location</Label>
                <Select value={dropoffLocation} onValueChange={setDropoffLocation}>
                    <SelectTrigger className="h-12 border-gray-200 bg-gray-50/50 rounded-xl focus:ring-gold/20 focus:border-gold">
                        <div className="flex items-center gap-2 text-navy font-medium">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <SelectValue placeholder="Select location" />
                        </div>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ercan">Ercan Airport (Free Return)</SelectItem>
                        <SelectItem value="nicosia">Nicosia Central</SelectItem>
                        <SelectItem value="kyrenia">Kyrenia Harbor</SelectItem>
                        <SelectItem value="famagusta">Famagusta City</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>

        {/* Date Selection */}
        <div className="grid grid-cols-2 gap-4">
             <div className="grid gap-2">
                 <Label className="text-xs font-bold text-navy uppercase tracking-wider">Pickup Date</Label>
                 <div className="relative">
                     <Input 
                        type="date" 
                        className="h-12 pl-4 border-gray-200 bg-gray-50/50 rounded-xl focus:ring-gold/20 focus:border-gold font-medium text-navy" 
                        value={pickupDate}
                        onChange={(e) => setPickupDate(e.target.value)}
                        min={mounted ? new Date().toISOString().split('T')[0] : ""}
                     />
                 </div>
             </div>
             
             <div className="grid gap-2">
                 <Label className="text-xs font-bold text-navy uppercase tracking-wider">Return Date</Label>
                 <div className="relative">
                     <Input 
                        type="date" 
                        className="h-12 pl-4 border-gray-200 bg-gray-50/50 rounded-xl focus:ring-gold/20 focus:border-gold font-medium text-navy"
                        value={dropoffDate}
                        onChange={(e) => setDropoffDate(e.target.value)}
                        min={pickupDate}
                     />
                 </div>
            </div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-2xl p-5 space-y-3 border border-gray-100">
        <div className="flex justify-between text-sm">
            <span className="text-gray-500 font-medium">{days} Days x €{rate}</span>
            <span className="font-bold text-navy">€{total}</span>
        </div>
        <div className="flex justify-between text-sm">
             <span className="text-gray-500 font-medium">Taxes & Fees</span>
             <span className="font-bold text-emerald-600">Included</span>
        </div>
        <Separator className="bg-gray-200/50" />
        <div className="flex justify-between items-center pt-1">
             <span className="font-heading font-bold text-navy text-lg">Total</span>
             <span className="font-heading font-black text-2xl text-electric">€{total}</span>
        </div>
      </div>

      <div className="space-y-3">
          <Button className="w-full h-14 text-base font-bold bg-gold text-navy hover:bg-gold/90 rounded-xl shadow-[0_10px_20px_rgba(255,215,0,0.25)] hover:shadow-lg transition-all hover:-translate-y-0.5" onClick={handleBookNow}>
              Book Now <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
          <Button variant="outline" className="w-full h-14 text-base font-bold border-gray-200 text-gray-500 hover:text-navy hover:border-gray-300 rounded-xl hover:bg-gray-50 transition-all">
            Chat on WhatsApp
          </Button>
      </div>

      <div className="text-center">
          <p className="text-xs text-gray-400 flex items-center justify-center gap-2">
             <Info className="w-4 h-4" /> No payment required until pickup
          </p>
      </div>
    </div>
  )
}
