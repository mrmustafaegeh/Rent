'use client';

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Slider } from "@/components/ui/Slider"
import { Checkbox } from "@/components/ui/Checkbox"
import { Separator } from "@/components/ui/Separator"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { ChevronDown, ChevronUp, FilterX } from "lucide-react"

// Hardcoded for now, could be dynamic
const CATEGORIES = ["Luxury", "Sports", "SUV", "Economy", "Sedan", "Convertible", "Van"]
const TRANSMISSIONS = ["Automatic", "Manual"]
const FUEL_TYPES = ["Petrol", "Diesel", "Electric", "Hybrid"]
const BRANDS = ["Mercedes-Benz", "BMW", "Audi", "Porsche", "Land Rover", "Toyota", "Nissan", "Kia", "Hyundai"]

export function CarFilters() {
    const router = useRouter()
    const searchParams = useSearchParams()
    
    // State to hold filter values
    const [priceRange, setPriceRange] = useState([0, 2000])
    
    // Sync local state with URL when params change
    useEffect(() => {
        const minPrice = searchParams.get('minPrice') ? parseInt(searchParams.get('minPrice')!) : 0
        const maxPrice = searchParams.get('maxPrice') ? parseInt(searchParams.get('maxPrice')!) : 2000
        setPriceRange([minPrice, maxPrice])
    }, [searchParams])

    const handleFilterChange = (key: string, value: string, checked: boolean) => {
        const params = new URLSearchParams(searchParams.toString())
        
        if (key === 'category' || key === 'brand' || key === 'transmission') {
            const current = params.getAll(key)
            if (checked) {
                params.append(key, value)
            } else {
                params.delete(key)
                current.filter(c => c !== value).forEach(c => params.append(key, c))
            }
        }
        
        router.push(`/cars?${params.toString()}`, { scroll: false })
    }
    
    const applyPriceFilter = () => {
        const params = new URLSearchParams(searchParams.toString())
        params.set('minPrice', priceRange[0].toString())
        params.set('maxPrice', priceRange[1].toString())
        router.push(`/cars?${params.toString()}`, { scroll: false })
    }

    const clearFilters = () => {
        router.push('/cars')
        setPriceRange([0, 2000])
    }
    
    const isChecked = (key: string, value: string) => {
        return searchParams.getAll(key).includes(value)
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg">Filters</h3>
                <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8 px-2 text-destructive hover:text-destructive">
                    <FilterX className="mr-2 h-4 w-4" />
                    Reset
                </Button>
            </div>
            
            <Separator />
            
            {/* Price Range */}
            <div className="space-y-4">
                <h4 className="font-medium text-sm">Price Range (Daily)</h4>
                <div className="pt-2">
                    <Slider 
                        defaultValue={[0, 2000]} 
                        max={3000} 
                        step={50} 
                        value={priceRange}
                        onValueChange={setPriceRange} // Update local state
                        onValueCommit={applyPriceFilter} // Update URL on release
                        className="my-4"
                    />
                    <div className="flex items-center justify-between gap-4">
                         <div className="flex items-center border rounded px-2 py-1 bg-background">
                             <span className="text-xs mr-1">€</span>
                             <span className="text-sm font-medium">{priceRange[0]}</span>
                         </div>
                         <span className="text-muted-foreground">-</span>
                         <div className="flex items-center border rounded px-2 py-1 bg-background">
                             <span className="text-xs mr-1">€</span>
                             <span className="text-sm font-medium">{priceRange[1]}</span>
                         </div>
                    </div>
                </div>
            </div>
            
            <Separator />
            
            {/* Categories */}
            <div className="space-y-3">
                <h4 className="font-medium text-sm">Category</h4>
                <div className="space-y-2">
                    {CATEGORIES.map((cat) => (
                        <div key={cat} className="flex items-center space-x-2">
                            <Checkbox 
                                id={`cat-${cat}`} 
                                checked={isChecked('category', cat)}
                                onCheckedChange={(checked) => handleFilterChange('category', cat, checked as boolean)}
                            />
                            <Label htmlFor={`cat-${cat}`} className="cursor-pointer">
                                {cat}
                            </Label>
                        </div>
                    ))}
                </div>
            </div>

             <Separator />
            
            {/* Transmission */}
            <div className="space-y-3">
                <h4 className="font-medium text-sm">Transmission</h4>
                <div className="space-y-2">
                    {TRANSMISSIONS.map((trans) => (
                        <div key={trans} className="flex items-center space-x-2">
                            <Checkbox 
                                id={`trans-${trans}`} 
                                checked={isChecked('transmission', trans)}
                                onCheckedChange={(checked) => handleFilterChange('transmission', trans, checked as boolean)}
                            />
                            <Label htmlFor={`trans-${trans}`} className="cursor-pointer">
                                {trans}
                            </Label>
                        </div>
                    ))}
                </div>
            </div>
            
            <Separator />

             {/* Brands */}
            <div className="space-y-3">
                <h4 className="font-medium text-sm">Brands</h4>
                <div className="space-y-2">
                     {BRANDS.map((brand) => (
                        <div key={brand} className="flex items-center space-x-2">
                            <Checkbox 
                                id={`brand-${brand}`} 
                                checked={isChecked('brand', brand)}
                                onCheckedChange={(checked) => handleFilterChange('brand', brand, checked as boolean)}
                            />
                            <Label htmlFor={`brand-${brand}`} className="cursor-pointer">
                                {brand}
                            </Label>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
