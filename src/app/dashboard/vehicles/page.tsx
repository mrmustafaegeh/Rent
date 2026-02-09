'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import OptimizedImage from '@/components/ui/OptimizedImage';
import { useAuth } from '@/context/AuthContext';
import { 
    Plus, 
    Search, 
    Edit2, 
    Calendar, 
    Trash2, 
    Car,
    Fuel,
    Settings,
    MoreHorizontal
} from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';

interface Vehicle {
  _id: string;
  brand: string;
  vehicleModel: string;
  year: number;
  category: string;
  pricing: { daily: number };
  images: { url: string }[];
  available: boolean;
  status: string;
  transmission?: string;
  fuelType?: string;
}

export default function AdminVehiclesPage() {
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const url = user?.role === 'admin' ? '/api/vehicles?limit=100' : '/api/vehicles?my=true&limit=100';
        const res = await fetch(url);
        const data = await res.json();
        if (data.success) {
          setVehicles(data.vehicles || []);
        }
      } catch (error) {
        console.error('Failed to fetch vehicles', error);
      } finally {
        setIsLoading(false);
      }
    };
    if (user) fetchVehicles();
  }, [user]);

  const filteredVehicles = vehicles.filter(vehicle => {
      const matchesSearch = 
        vehicle.brand.toLowerCase().includes(searchTerm.toLowerCase()) || 
        vehicle.vehicleModel.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory === 'all' || vehicle.category.toLowerCase() === filterCategory.toLowerCase();
      
      return matchesSearch && matchesCategory;
  });

  // Extract unique categories
  const categories = ['all', ...Array.from(new Set(vehicles.map(v => v.category || 'Other')))];

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-heading font-black text-navy tracking-tight">Fleet Management</h1>
          <p className="text-gray-500 mt-1">Manage your vehicle inventory, pricing, and availability.</p>
        </div>
        <Link href="/dashboard/vehicles/new">
          <Button className="bg-navy text-gold hover:bg-navy/90 gap-2 font-bold shadow-lg shadow-navy/20 pl-4 pr-6">
            <Plus className="w-5 h-5" /> Add New Vehicle
          </Button>
        </Link>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-3 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4 sticky top-4 z-20 layout-pixel-perfect">
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto scrollbar-hide pb-2 md:pb-0">
              {categories.map((cat) => (
                  <button
                      key={cat}
                      onClick={() => setFilterCategory(cat)}
                      className={`px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap capitalize ${
                          filterCategory === cat 
                          ? 'bg-navy text-white shadow-md transform scale-105' 
                          : 'bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-navy'
                      }`}
                  >
                      {cat}
                  </button>
              ))}
          </div>
          
          <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input 
                  placeholder="Search brand, model..." 
                  className="pl-10 h-11 bg-gray-50 border-transparent focus:bg-white focus:border-gray-200 transition-all rounded-xl"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
              />
          </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
            <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                    <th className="p-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Vehicle Details</th>
                    <th className="p-6 text-xs font-bold text-gray-400 uppercase tracking-wider hidden md:table-cell">Specs</th>
                    <th className="p-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Rate</th>
                    <th className="p-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="p-6 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
                {isLoading ? (
                    <tr>
                        <td colSpan={5} className="p-20 text-center">
                            <div className="animate-spin rounded-full h-10 w-10 border-2 border-navy border-t-transparent mx-auto mb-4"></div>
                            <p className="text-gray-500 font-medium">Loading fleet data...</p>
                        </td>
                    </tr>
                ) : filteredVehicles.length === 0 ? (
                    <tr>
                        <td colSpan={5} className="p-20 text-center">
                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-gray-100">
                                <Car className="w-10 h-10 text-gray-300" />
                            </div>
                            <h3 className="font-bold text-navy text-xl mb-2">No vehicles found</h3>
                            <p className="text-gray-400 max-w-sm mx-auto">
                                No vehicles match your current filters. Try "All" or add a new vehicle to get started.
                            </p>
                        </td>
                    </tr>
                ) : (
                    filteredVehicles.map((vehicle) => (
                    <tr key={vehicle._id} className="hover:bg-blue-50/20 transition-all group">
                        <td className="p-6">
                            <div className="flex items-center gap-5">
                                <div className="w-20 h-14 bg-gray-100 rounded-xl overflow-hidden relative shrink-0 border border-gray-100 shadow-inner">
                                    <OptimizedImage 
                                        src={vehicle.images?.[0]?.url || '/images/placeholder-car.jpg'} 
                                        alt={`${vehicle.brand} ${vehicle.vehicleModel}`}
                                        fill 
                                        className="object-cover"
                                    />
                                </div>
                                <div>
                                    <div className="font-black text-navy text-base tracking-tight">{vehicle.brand} <span className="text-electric font-bold">{vehicle.vehicleModel}</span></div>
                                    <div className="text-xs text-gray-400 font-bold mt-1 uppercase tracking-wider bg-gray-50 inline-block px-1.5 py-0.5 rounded">
                                        {vehicle.year} • {vehicle.category}
                                    </div>
                                </div>
                            </div>
                        </td>
                        <td className="p-6 hidden md:table-cell">
                             <div className="flex flex-col gap-1.5 opacity-70">
                                <div className="flex items-center gap-2 text-xs font-medium text-gray-600">
                                    <Settings className="w-3.5 h-3.5 text-navy" />
                                    <span>{vehicle.transmission || 'Automatic'}</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs font-medium text-gray-600">
                                    <Fuel className="w-3.5 h-3.5 text-navy" />
                                    <span>{vehicle.fuelType || 'Petrol'}</span>
                                </div>
                            </div>
                        </td>
                        <td className="p-6">
                            <div className="flex flex-col">
                                <span className="font-black text-navy text-lg leading-none">€{vehicle.pricing.daily}</span>
                                <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mt-1">per day</span>
                            </div>
                        </td>
                        <td className="p-6">
                            <Badge className={`shadow-sm px-3 py-1 text-xs border ${
                                vehicle.available 
                                ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200' 
                                : 'bg-red-50 text-red-700 hover:bg-red-100 border-red-200'
                            }`}>
                                <span className={`w-1.5 h-1.5 rounded-full mr-2 ${vehicle.available ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                                {vehicle.available ? 'Available' : 'Rented'}
                            </Badge>
                        </td>
                        <td className="p-6 text-right">
                            <div className="flex justify-end gap-2 opacity-100 transition-opacity">
                                <Link href={`/dashboard/vehicles/${vehicle._id}/schedule`}>
                                    <Button size="icon" variant="outline" className="h-9 w-9 text-blue-600 bg-blue-50 border-blue-100 hover:bg-blue-100 hover:border-blue-200 rounded-xl transition-colors" title="View Schedule">
                                        <Calendar className="w-4 h-4" />
                                    </Button>
                                </Link>
                                <Link href={`/dashboard/vehicles/${vehicle._id}/edit`}>
                                    <Button size="icon" variant="outline" className="h-9 w-9 text-gray-600 bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300 rounded-xl transition-colors" title="Edit details">
                                        <Edit2 className="w-4 h-4" />
                                    </Button>
                                </Link>
                                <Button size="icon" variant="outline" className="h-9 w-9 text-red-500 bg-red-50 border-red-100 hover:bg-red-100 hover:border-red-200 rounded-xl transition-colors" title="Delete vehicle">
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </td>
                    </tr>
                    ))
                )}
            </tbody>
            </table>
        </div>
        
        {/* Pagination placeholder */}
        <div className="bg-gray-50/50 p-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 font-medium">
             <span>Showing {filteredVehicles.length} vehicles</span>
             <div className="flex gap-2 opacity-50">
                 <Button variant="outline" size="sm" className="h-8 text-xs pointer-events-none" disabled>Previous</Button>
                 <Button variant="outline" size="sm" className="h-8 text-xs pointer-events-none" disabled>Next</Button>
             </div>
        </div>
      </div>
    </div>
  );
}
