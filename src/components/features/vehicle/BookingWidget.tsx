"use client"

import * as React from "react"
import { Calendar, Info } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { Separator } from "@/components/ui/Separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select"
import { addDays } from "date-fns"
import { useRouter } from "next/navigation"

interface PricingTier {
  daily: number
  threeDays: number
  weekly: number
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
  
  // Set default dates on mount
  React.useEffect(() => {
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
    if (days >= 7) rate = pricing.weekly
    else if (days >= 3) rate = pricing.threeDays

    return {
      days,
      rate,
      total: days * rate
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
    <div className="bg-card rounded-xl border shadow-lg p-6 space-y-6 sticky top-24">
      <div className="flex justify-between items-baseline">
        <h3 className="text-xl font-bold">Booking Details</h3>
        <span className="text-primary font-bold text-lg">€{rate} <span className="text-sm font-normal text-muted-foreground">/ day</span></span>
      </div>
      
      <div className="space-y-4">
        {/* Pickup */}
        <div className="grid gap-2">
            <Label>Pickup Location</Label>
            <Select value={pickupLocation} onValueChange={setPickupLocation}>
                <SelectTrigger>
                    <SelectValue placeholder="Select location" />
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
             <Label>Pickup Date</Label>
             <div className="relative">
                 <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                 <Input 
                    type="date" 
                    className="pl-9" 
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                 />
             </div>
        </div>

        {/* Dropoff */}
         <div className="grid gap-2">
            <Label>Dropoff Location</Label>
            <Select value={dropoffLocation} onValueChange={setDropoffLocation}>
                <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="ercan">Ercan Airport (Free Return)</SelectItem>
                    <SelectItem value="nicosia">Nicosia Central</SelectItem>
                    <SelectItem value="kyrenia">Kyrenia Harbor</SelectItem>
                    <SelectItem value="famagusta">Famagusta City</SelectItem>
                </SelectContent>
            </Select>
        </div>
        
         <div className="grid gap-2">
             <Label>Dropoff Date</Label>
             <div className="relative">
                 <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                 <Input 
                    type="date" 
                    className="pl-9"
                    value={dropoffDate}
                    onChange={(e) => setDropoffDate(e.target.value)}
                     min={pickupDate}
                 />
             </div>
        </div>
      </div>

      <Separator />

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
            <span className="text-muted-foreground">Duration</span>
            <span className="font-medium">{days} Days</span>
        </div>
        <div className="flex justify-between">
             <span className="text-muted-foreground">Rate applied</span>
             <span className="font-medium">€{rate}/day</span>
        </div>
        <div className="flex justify-between font-bold text-lg pt-2 border-t mt-2">
             <span>Total</span>
             <span className="text-primary">€{total}</span>
        </div>
      </div>

      <div className="space-y-3 pt-2">
          <Button className="w-full" size="lg" onClick={handleBookNow}>Book Now</Button>
          <Button variant="outline" className="w-full" size="lg">
            Chat on WhatsApp
          </Button>
      </div>

      <div className="bg-muted/30 p-3 rounded text-xs text-muted-foreground flex items-start gap-2">
          <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <p>No credit card required for booking. Free cancellation up to 48 hours before pickup.</p>
      </div>
    </div>
  )
}
