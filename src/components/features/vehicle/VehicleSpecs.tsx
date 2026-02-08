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
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {specItems.map((item, index) => (
        <div key={index} className="flex items-center gap-3 p-4 rounded-lg bg-muted/50 border">
          <item.icon className="w-5 h-5 text-primary" />
          <div>
            <p className="text-xs text-muted-foreground">{item.label}</p>
            <p className="font-medium text-sm">{item.value}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
