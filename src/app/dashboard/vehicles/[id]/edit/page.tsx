'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import ImageUpload from '@/components/ui/ImageUpload';
import { ChevronLeft, Save, Car, Info, DollarSign, Image as ImageIcon } from 'lucide-react';

export default function EditVehiclePage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState({
      brand: '',
      vehicleModel: '',
      year: new Date().getFullYear(),
      category: 'Luxury',
      transmission: 'Automatic',
      fuelType: 'Petrol',
      seats: 2,
      priceDaily: '',
      priceWeekly: '',
      priceMonthly: '',
      location: '',
      images: [] as string[]
  });

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const res = await fetch(`/api/vehicles/${params.id}`);
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        
        const v = data;
        setFormData({
            brand: v.brand || '',
            vehicleModel: v.vehicleModel || '',
            year: v.year || new Date().getFullYear(),
            category: v.category || 'Luxury',
            transmission: v.transmission || 'Automatic',
            fuelType: v.fuelType || 'Petrol',
            seats: v.seats || 2,
            priceDaily: v.pricing?.daily || '',
            priceWeekly: v.pricing?.weekly || '',
            priceMonthly: v.pricing?.monthly || '',
            location: v.location || '',
            images: v.images ? v.images.map((img: any) => img.url) : []
        });

      } catch (error) {
        console.error(error);
        alert('Error loading vehicle');
        router.push('/dashboard/vehicles');
      } finally {
        setIsLoading(false);
      }
    };
    
    if (params.id) fetchVehicle();
  }, [params.id, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSaving(true);

      try {
          const payload = {
              brand: formData.brand,
              vehicleModel: formData.vehicleModel,
              year: Number(formData.year),
              category: formData.category,
              transmission: formData.transmission,
              fuelType: formData.fuelType,
              seats: Number(formData.seats),
              pricing: {
                  daily: Number(formData.priceDaily),
                  weekly: formData.priceWeekly ? Number(formData.priceWeekly) : undefined,
                  monthly: formData.priceMonthly ? Number(formData.priceMonthly) : undefined
              },
              location: formData.location,
              images: formData.images.map((url, index) => ({
                 url,
                 isPrimary: index === 0 
              })),
          };

          const res = await fetch(`/api/vehicles/${params.id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload)
          });

          if (res.ok) {
              router.push('/dashboard/vehicles');
          } else {
              alert('Failed to update vehicle');
          }
      } catch (error) {
          console.error(error);
          alert('Error updating vehicle');
      } finally {
          setIsSaving(false);
      }
  };

  if (isLoading) return (
      <div className="flex h-[50vh] items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-navy"></div>
      </div>
  );

  return (
    <div className="space-y-6 pb-20 max-w-6xl mx-auto">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
                <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => router.back()}
                    className="rounded-full bg-white border border-gray-200 hover:border-navy hover:text-navy transition-all h-10 w-10 shadow-sm"
                >
                    <ChevronLeft className="w-5 h-5" />
                </Button>
                <div>
                    <h1 className="text-3xl font-heading font-black text-navy">{formData.brand} <span className="text-electric">{formData.vehicleModel}</span></h1>
                    <p className="text-gray-500 font-medium">Edit Vehicle Details</p>
                </div>
            </div>
            <Button 
                onClick={handleSubmit} 
                isLoading={isSaving}
                className="hidden md:flex bg-navy text-gold hover:bg-navy/90 gap-2 font-bold shadow-lg shadow-navy/20 pl-4 pr-6 h-11 rounded-xl"
            >
                <Save className="w-4 h-4" /> Save Changes
            </Button>
        </div>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Details */}
            <div className="lg:col-span-2 space-y-6">
                
                {/* Basic Info */}
                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-8">
                    <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                        <div className="w-10 h-10 rounded-xl bg-electric/10 flex items-center justify-center text-electric">
                            <Car className="w-5 h-5" />
                        </div>
                        <h3 className="font-bold text-navy text-lg">Vehicle Information</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input 
                            label="Brand" 
                            name="brand" 
                            value={formData.brand} 
                            onChange={handleChange} 
                            required 
                            className="bg-gray-50 border-gray-200 focus:bg-white transition-all h-12 rounded-xl"
                        />
                        <Input 
                            label="Model" 
                            name="vehicleModel" 
                            value={formData.vehicleModel} 
                            onChange={handleChange} 
                            required 
                            className="bg-gray-50 border-gray-200 focus:bg-white transition-all h-12 rounded-xl"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                         <Input 
                            label="Year" 
                            name="year" 
                            type="number" 
                            value={formData.year} 
                            onChange={handleChange} 
                            required 
                            className="bg-gray-50 border-gray-200 focus:bg-white transition-all h-12 rounded-xl"
                         />
                         
                         <div className="space-y-2">
                             <label className="text-sm font-bold text-gray-700 ml-1">Category</label>
                             <div className="relative">
                                 <select 
                                    name="category" 
                                    value={formData.category} 
                                    onChange={handleChange} 
                                    className="w-full h-12 px-4 bg-gray-50 border border-gray-200 rounded-xl text-navy font-bold appearance-none focus:outline-none focus:ring-2 focus:ring-navy/5 focus:border-navy transition-all cursor-pointer"
                                 >
                                     <option>Luxury</option>
                                     <option>Sports</option>
                                     <option>SUV</option>
                                     <option>Sedan</option>
                                     <option>Electric</option>
                                 </select>
                                 <ChevronLeft className="w-4 h-4 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 -rotate-90 pointer-events-none" />
                             </div>
                         </div>
                         
                         <Input 
                            label="Seats" 
                            name="seats" 
                            type="number" 
                            value={formData.seats} 
                            onChange={handleChange} 
                            required 
                            className="bg-gray-50 border-gray-200 focus:bg-white transition-all h-12 rounded-xl"
                         />
                    </div>
                    
                    <div>
                         <Input 
                            label="Location" 
                            name="location" 
                            value={formData.location} 
                            onChange={handleChange} 
                            placeholder="e.g. Dubai, Abu Dhabi" 
                            className="bg-gray-50 border-gray-200 focus:bg-white transition-all h-12 rounded-xl"
                        />
                    </div>
                </div>

                {/* Specs */}
                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-8">
                    <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                        <div className="w-10 h-10 rounded-xl bg-orange/10 flex items-center justify-center text-orange">
                            <Info className="w-5 h-5" />
                        </div>
                        <h3 className="font-bold text-navy text-lg">Technical Specs</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                             <label className="text-sm font-bold text-gray-700 ml-1">Transmission</label>
                             <div className="relative">
                                 <select 
                                    name="transmission" 
                                    value={formData.transmission} 
                                    onChange={handleChange} 
                                    className="w-full h-12 px-4 bg-gray-50 border border-gray-200 rounded-xl text-navy font-bold appearance-none focus:outline-none focus:ring-2 focus:ring-navy/5 focus:border-navy transition-all cursor-pointer"
                                 >
                                     <option>Automatic</option>
                                     <option>Manual</option>
                                 </select>
                                 <ChevronLeft className="w-4 h-4 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 -rotate-90 pointer-events-none" />
                             </div>
                        </div>
                        <div className="space-y-2">
                             <label className="text-sm font-bold text-gray-700 ml-1">Fuel Type</label>
                             <div className="relative">
                                 <select 
                                    name="fuelType" 
                                    value={formData.fuelType} 
                                    onChange={handleChange} 
                                    className="w-full h-12 px-4 bg-gray-50 border border-gray-200 rounded-xl text-navy font-bold appearance-none focus:outline-none focus:ring-2 focus:ring-navy/5 focus:border-navy transition-all cursor-pointer"
                                 >
                                     <option>Petrol</option>
                                     <option>Diesel</option>
                                     <option>Electric</option>
                                     <option>Hybrid</option>
                                 </select>
                                 <ChevronLeft className="w-4 h-4 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 -rotate-90 pointer-events-none" />
                             </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Column: Pricing & Images */}
            <div className="space-y-6">
                
                {/* Pricing */}
                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-8">
                    <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-500">
                            <DollarSign className="w-5 h-5" />
                        </div>
                        <h3 className="font-bold text-navy text-lg">Pricing</h3>
                    </div>
                    
                    <div className="space-y-6">
                        <Input 
                            label="Daily Rate (€)" 
                            name="priceDaily" 
                            type="number" 
                            value={formData.priceDaily} 
                            onChange={handleChange} 
                            required 
                            className="bg-gray-50 border-gray-200 focus:bg-white transition-all h-14 rounded-xl text-xl font-black text-navy"
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <Input 
                                label="Weekly Rate" 
                                name="priceWeekly" 
                                type="number" 
                                value={formData.priceWeekly} 
                                onChange={handleChange} 
                                className="bg-gray-50 border-gray-200 h-11 rounded-xl text-sm font-medium"
                            />
                            <Input 
                                label="Monthly Rate" 
                                name="priceMonthly" 
                                type="number" 
                                value={formData.priceMonthly} 
                                onChange={handleChange} 
                                className="bg-gray-50 border-gray-200 h-11 rounded-xl text-sm font-medium"
                            />
                        </div>
                    </div>
                </div>

                {/* Images */}
                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-8">
                    <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                        <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-500">
                            <ImageIcon className="w-5 h-5" />
                        </div>
                        <h3 className="font-bold text-navy text-lg">Vehicle Gallery</h3>
                    </div>
                    
                    <ImageUpload 
                       value={formData.images} 
                       onChange={(urls) => setFormData(prev => ({ ...prev, images: urls }))} 
                       multiple 
                    />
                </div>
                
                {/* Mobile Actions */}
                <div className="flex md:hidden gap-3 pt-4 sticky bottom-4 z-20">
                    <Button type="button" variant="ghost" onClick={() => router.back()} className="flex-1 bg-white shadow-lg border border-gray-100 font-bold h-12 rounded-xl">Cancel</Button>
                    <Button type="submit" isLoading={isSaving} className="flex-1 bg-navy text-gold font-bold shadow-lg shadow-navy/20 h-12 rounded-xl">Save Changes</Button>
                </div>

            </div>
        </form>
    </div>
  );
}
