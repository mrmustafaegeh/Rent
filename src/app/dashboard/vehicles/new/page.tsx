'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import ImageUpload from '@/components/ui/ImageUpload';
import { ChevronLeft, Plus, Car, Info, DollarSign, Image as ImageIcon, CheckCircle, Save } from 'lucide-react';

export default function NewVehiclePage() {
    const router = useRouter();
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Get Company ID (assuming user is admin/owner)
            const companyRes = await fetch('/api/companies/my-company'); 
            const companyData = companyRes.ok ? await companyRes.json() : {};
            const companyId = companyData.company?._id || user?.companyId;

            const payload = {
                ...formData,
                company: companyId,
                year: Number(formData.year),
                seats: Number(formData.seats),
                pricing: {
                    daily: Number(formData.priceDaily),
                    weekly: formData.priceWeekly ? Number(formData.priceWeekly) : undefined,
                    monthly: formData.priceMonthly ? Number(formData.priceMonthly) : undefined
                },
                images: formData.images.map((url, index) => ({
                   url,
                   isPrimary: index === 0 
                })),
                available: true
            };

            const res = await fetch('/api/vehicles', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                router.push('/dashboard/vehicles');
            } else {
                const data = await res.json();
                alert(data.error || 'Failed to create vehicle');
            }
        } catch (error) {
            console.error(error);
            alert('Error creating vehicle');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-8 pb-24 w-full max-w-[1600px] mx-auto">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => router.back()}
                        className="rounded-xl bg-white border border-gray-200 hover:border-navy hover:bg-navy hover:text-white transition-all h-12 w-12 shadow-sm"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-heading font-black text-navy tracking-tight">Add New Vehicle</h1>
                        <p className="text-gray-500 font-medium">Expand your premium fleet with a new listing.</p>
                    </div>
                </div>
                <div className="hidden md:flex gap-3">
                    <Button 
                        variant="ghost"
                        onClick={() => router.back()}
                        className="text-gray-500 font-bold hover:text-navy hover:bg-white h-12 px-6 rounded-xl"
                    >
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleSubmit} 
                        isLoading={isLoading}
                        className="bg-navy text-gold hover:bg-navy/90 gap-2 font-bold shadow-lg shadow-navy/20 pl-6 pr-8 h-12 rounded-xl transition-all hover:scale-105"
                    >
                        <Save className="w-4 h-4" /> Save Vehicle
                    </Button>
                </div>
            </div>
            
            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Left Column: Details (8 cols) */}
                <div className="lg:col-span-8 space-y-8">
                    
                    {/* Basic Info Card */}
                    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl shadow-gray-100/50 space-y-8 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-navy/5 rounded-bl-full -mr-16 -mt-16 transition-all group-hover:bg-navy/10" />
                        
                        <div className="flex items-center gap-4 pb-6 border-b border-gray-100 relative z-10">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-navy to-electric flex items-center justify-center text-white shadow-lg shadow-navy/20">
                                <Car className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-heading font-black text-navy text-xl">Vehicle Identity</h3>
                                <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Core Information</p>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 relative z-10">
                            <Input 
                                label="Brand" 
                                name="brand" 
                                placeholder="e.g. Porsche" 
                                value={formData.brand} 
                                onChange={handleChange} 
                                required 
                                className="bg-gray-50 border-transparent focus:bg-white focus:border-gray-200 transition-all h-14 rounded-xl text-lg font-bold text-black placeholder:font-normal"
                            />
                            <Input 
                                label="Model" 
                                name="vehicleModel" 
                                placeholder="e.g. 911 Carrera" 
                                value={formData.vehicleModel} 
                                onChange={handleChange} 
                                required 
                                className="bg-gray-50 border-transparent focus:bg-white focus:border-gray-200 transition-all h-14 rounded-xl text-lg font-bold text-black placeholder:font-normal"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                             <Input 
                                label="Year" 
                                name="year" 
                                type="number" 
                                value={formData.year} 
                                onChange={handleChange} 
                                required 
                                className="bg-gray-50 border-transparent focus:bg-white focus:border-gray-200 transition-all h-12 rounded-xl font-bold text-black"
                             />
                             
                             <div className="space-y-2">
                                 <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Category</label>
                                 <div className="relative">
                                     <select 
                                        name="category" 
                                        value={formData.category} 
                                        onChange={handleChange} 
                                        className="w-full h-12 px-4 bg-gray-50 border border-transparent rounded-xl text-black font-bold appearance-none focus:outline-none focus:ring-2 focus:ring-navy/5 focus:bg-white transition-all cursor-pointer"
                                     >
                                         <option>Luxury</option>
                                         <option>Sports</option>
                                         <option>SUV</option>
                                         <option>Sedan</option>
                                         <option>Electric</option>
                                         <option>Convertible</option>
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
                                className="bg-gray-50 border-transparent focus:bg-white focus:border-gray-200 transition-all h-12 rounded-xl font-bold text-black"
                             />
                        </div>
                        
                        <div className="relative z-10">
                             <Input 
                                label="Current Location" 
                                name="location" 
                                value={formData.location} 
                                onChange={handleChange} 
                                placeholder="e.g. Dubai Marina Branch" 
                                className="bg-gray-50 border-transparent focus:bg-white focus:border-gray-200 transition-all h-12 rounded-xl font-bold text-black"
                            />
                        </div>
                    </div>

                    {/* Technical Specs Card */}
                    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl shadow-gray-100/50 space-y-8">
                        <div className="flex items-center gap-4 pb-6 border-b border-gray-100">
                            <div className="w-12 h-12 rounded-2xl bg-orange/10 flex items-center justify-center text-orange shadow-lg shadow-orange/20">
                                <Info className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-heading font-black text-navy text-xl">Technical Specs</h3>
                                <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Performance & Features</p>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                 <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Transmission</label>
                                 <div className="grid grid-cols-2 gap-3">
                                     {['Automatic', 'Manual'].map((type) => (
                                         <button
                                            key={type}
                                            type="button"
                                            onClick={() => setFormData({...formData, transmission: type})}
                                            className={`h-12 rounded-xl text-sm font-bold transition-all border ${
                                                formData.transmission === type 
                                                ? 'bg-navy text-gold border-navy shadow-lg shadow-navy/20' 
                                                : 'bg-gray-50 text-gray-500 border-transparent hover:bg-gray-100'
                                            }`}
                                         >
                                             {type}
                                         </button>
                                     ))}
                                 </div>
                            </div>

                            <div className="space-y-3">
                                 <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Fuel Type</label>
                                 <div className="relative">
                                     <select 
                                        name="fuelType" 
                                        value={formData.fuelType} 
                                        onChange={handleChange} 
                                        className="w-full h-12 px-4 bg-gray-50 border border-transparent rounded-xl text-black font-bold appearance-none focus:outline-none focus:ring-2 focus:ring-navy/5 focus:bg-white transition-all cursor-pointer"
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

                {/* Right Column: Pricing & Images (4 cols) */}
                <div className="lg:col-span-4 space-y-8">
                    
                    {/* Pricing Card */}
                    <div className="bg-navy p-8 rounded-3xl border border-navy shadow-2xl shadow-navy/20 space-y-8 text-white">
                        <div className="flex items-center gap-4 pb-6 border-b border-white/10">
                            <div className="w-12 h-12 rounded-2xl bg-gold/20 flex items-center justify-center text-gold border border-gold/20">
                                <DollarSign className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-heading font-black text-white text-xl">Pricing</h3>
                                <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Rental Rates</p>
                            </div>
                        </div>
                        
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gold uppercase tracking-wider ml-1">Daily Rate (€)</label>
                                <Input 
                                    name="priceDaily" 
                                    type="number" 
                                    placeholder="0.00" 
                                    value={formData.priceDaily} 
                                    onChange={handleChange} 
                                    required 
                                    className="bg-white/10 border-transparent focus:bg-white/20 transition-all h-16 rounded-xl text-3xl font-black text-white placeholder:text-white/20 text-center"
                                />
                            </div>
                            
                            <div className="grid grid-cols-1 gap-4">
                                <Input 
                                    label="Weekly Rate (Optional)" 
                                    name="priceWeekly" 
                                    type="number" 
                                    placeholder="e.g. 1500" 
                                    value={formData.priceWeekly} 
                                    onChange={handleChange} 
                                    className="bg-white/5 border-transparent text-white placeholder:text-gray-500 h-12 rounded-xl text-sm font-medium focus:bg-white/10"
                                />
                                <Input 
                                    label="Monthly Rate (Optional)" 
                                    name="priceMonthly" 
                                    type="number" 
                                    placeholder="e.g. 5000" 
                                    value={formData.priceMonthly} 
                                    onChange={handleChange} 
                                    className="bg-white/5 border-transparent text-white placeholder:text-gray-500 h-12 rounded-xl text-sm font-medium focus:bg-white/10"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Images Card */}
                    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl shadow-gray-100/50 space-y-6">
                        <div className="flex items-center gap-4 pb-6 border-b border-gray-100">
                            <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600">
                                <ImageIcon className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-heading font-black text-navy text-xl">Gallery</h3>
                                <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Vehicle Photos</p>
                            </div>
                        </div>
                        
                        <div className="bg-gray-50 rounded-2xl p-2 border border-dashed border-gray-200">
                             <ImageUpload 
                                value={formData.images} 
                                onChange={(urls) => setFormData(prev => ({ ...prev, images: urls }))} 
                                multiple 
                             />
                        </div>
                        <p className="text-xs text-gray-400 text-center">
                            Supported: JPG, PNG, WEBP. Max 5MB each.
                        </p>
                    </div>
                </div>

                {/* Mobile Sticky Action Bar */}
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 md:hidden z-50 flex gap-3 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
                     <Button type="button" variant="ghost" onClick={() => router.back()} className="flex-1 bg-gray-50 text-gray-600 font-bold h-12 rounded-xl">Cancel</Button>
                     <Button type="submit" isLoading={isLoading} className="flex-[2] bg-navy text-gold font-bold shadow-lg shadow-navy/20 h-12 rounded-xl">Create Vehicle</Button>
                </div>

            </form>
        </div>
    );
}
