'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import ImageUpload from '@/components/ui/ImageUpload';

export default function EditVehiclePage() {
  const router = useRouter();
  const params = useParams(); // params.id
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
      images: [] as string[]
  });

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const res = await fetch(`/api/vehicles/${params.id}`);
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        
        // API returns the vehicle object directly
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
          // Construct payload matching the API schema
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
              images: formData.images.map((url, index) => ({
                 url,
                 isPrimary: index === 0 
              })),
              // preserve other fields if needed, but PUT usually replaces whole doc or fields provided
              // API uses findByIdAndUpdate with body, so only fields in body are updated? No, typical PUT replaces.
              // But this API implementation: `Vehicle.findByIdAndUpdate(id, body, { new: true })`.
              // So it updates fields present in body.
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

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-white">Edit Vehicle</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6 bg-[var(--surface-light)] p-8 rounded-xl border border-[var(--border)]">
            <div className="grid grid-cols-2 gap-4">
                <Input label="Brand" name="brand" value={formData.brand} onChange={handleChange} required />
                <Input label="Model" name="vehicleModel" value={formData.vehicleModel} onChange={handleChange} required />
            </div>

            <div className="grid grid-cols-3 gap-4">
                 <Input label="Year" name="year" type="number" value={formData.year} onChange={handleChange} required />
                 {/* Selects */}
                 <div className="space-y-2">
                     <label className="text-sm font-medium text-[var(--text-secondary)]">Category</label>
                     <select name="category" value={formData.category} onChange={handleChange} className="w-full h-11 px-4 bg-[var(--surface)] border border-[var(--border)] rounded-lg text-white">
                         <option>Luxury</option>
                         <option>Sports</option>
                         <option>SUV</option>
                         <option>Sedan</option>
                         <option>Electric</option>
                     </select>
                 </div>
                 <Input label="Seats" name="seats" type="number" value={formData.seats} onChange={handleChange} required />
            </div>

            <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                     <label className="text-sm font-medium text-[var(--text-secondary)]">Transmission</label>
                     <select name="transmission" value={formData.transmission} onChange={handleChange} className="w-full h-11 px-4 bg-[var(--surface)] border border-[var(--border)] rounded-lg text-white">
                         <option>Automatic</option>
                         <option>Manual</option>
                     </select>
                 </div>
                 <div className="space-y-2">
                     <label className="text-sm font-medium text-[var(--text-secondary)]">Fuel Type</label>
                     <select name="fuelType" value={formData.fuelType} onChange={handleChange} className="w-full h-11 px-4 bg-[var(--surface)] border border-[var(--border)] rounded-lg text-white">
                         <option>Petrol</option>
                         <option>Diesel</option>
                         <option>Electric</option>
                         <option>Hybrid</option>
                     </select>
                 </div>
            </div>

            
            <div className="grid grid-cols-3 gap-4">
                <Input label="Daily Price ($)" name="priceDaily" type="number" value={formData.priceDaily} onChange={handleChange} required />
                <Input label="Weekly Price ($)" name="priceWeekly" type="number" value={formData.priceWeekly} onChange={handleChange} />
                <Input label="Monthly Price ($)" name="priceMonthly" type="number" value={formData.priceMonthly} onChange={handleChange} />
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--text-secondary)]">Vehicle Images</label>
                <div className="text-xs text-[var(--text-muted)] mb-2">First image is primary. Drag & drop works!</div>
                <ImageUpload 
                   value={formData.images} 
                   onChange={(urls) => setFormData(prev => ({ ...prev, images: urls }))} 
                   multiple 
                />
            </div>

            <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="ghost" onClick={() => router.back()}>Cancel</Button>
                <Button type="submit" isLoading={isSaving}>Save Changes</Button>
            </div>
        </form>
    </div>
  );
}
