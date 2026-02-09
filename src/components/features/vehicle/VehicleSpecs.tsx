import { Fuel, Gauge, Settings, Users, DoorOpen, Calendar } from "lucide-react"

interface VehicleSpecsProps {
  specs: {
    transmission?: string
    fuelType?: string
    seats?: number
    doors?: number
    year?: number
    engineSize?: string // e.g., "2.0L"
  }
}

export function VehicleSpecs({ specs }: VehicleSpecsProps) {
  const specItems = [
    {
      icon: Settings,
      label: "Transmission",
      value: specs.transmission || "Automatic",
    },
    {
      icon: Fuel,
      label: "Fuel Type",
      value: specs.fuelType || "Petrol",
    },
    {
      icon: Users,
      label: "Seats",
      value: specs.seats ? `${specs.seats} Seats` : "5 Seats",
    },
    {
      icon: Gauge,
      label: "Engine",
      value: specs.engineSize || "2.0L",
    },
    {
      icon: DoorOpen,
      label: "Doors",
      value: specs.doors ? `${specs.doors} Doors` : "4 Doors",
    },
    {
      icon: Calendar,
      label: "Year",
      value: specs.year || "2024",
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
      {specItems.map((item, index) => (
        <div key={index} className="flex flex-col items-center justify-center p-4 rounded-2xl bg-gray-50 border border-gray-100/50 hover:border-gold/30 hover:shadow-sm transition-all duration-300">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm mb-3">
             <item.icon className="w-5 h-5 text-gold" />
          </div>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">{item.label}</p>
          <p className="font-heading font-bold text-navy text-sm text-center">{item.value}</p>
        </div>
      ))}
    </div>
  )
}
