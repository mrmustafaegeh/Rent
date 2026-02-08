'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function NewVehiclePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
      brand: '',
      vehicleModel: '',
      year: new Date().getFullYear(),
      category: 'Luxury',
      transmission: 'Automatic',
      fuelType: 'Petrol',
      seats: 2,
      priceDaily: '',
      imageUrl: ''
  });

  // Fetch company ID for the logged-in user
  useEffect(() => {
      const fetchCompany = async () => {
          try {
              const res = await fetch('/api/companies/my-company');
              if (res.ok) {
                  const data = await res.json();
                  setCompanyId(data._id);
              } else {
                  // Fallback: use a default company ID from seed data
                  // In production, you'd create a company for the user
                  const companiesRes = await fetch('/api/companies');
                  if (companiesRes.ok) {
                      const companies = await companiesRes.json();
                      if (companies.length > 0) {
                          setCompanyId(companies[0]._id);
                      }
                  }
              }
          } catch (error) {
              console.error('Failed to fetch company:', error);
          }
      };
      fetchCompany();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);

      try {
          if (!companyId) {
              alert('Company information not found. Please contact support.');
              setIsLoading(false);
              return;
          }

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
                  daily: Number(formData.priceDaily)
              },
              images: [{ url: formData.imageUrl, isPrimary: true }],
              company: companyId,
              available: true,
              isApproved: user?.role === 'admin' // Auto-approve if admin
          };

          const res = await fetch('/api/vehicles', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload)
          });

          if (res.ok) {
              router.push('/dashboard/vehicles');
          } else {
              alert('Failed to create vehicle');
          }
      } catch (error) {
          console.error(error);
          alert('Error creating vehicle');
      } finally {
          setIsLoading(false);
      }
  };

  return (
    <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Add New Vehicle</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6 bg-[var(--surface-light)] p-8 rounded-xl border border-[var(--border)]">
            <div className="grid grid-cols-2 gap-4">
                <Input label="Brand" name="brand" placeholder="e.g. Porsche" value={formData.brand} onChange={handleChange} required />
                <Input label="Model" name="vehicleModel" placeholder="e.g. 911 GT3" value={formData.vehicleModel} onChange={handleChange} required />
            </div>

            <div className="grid grid-cols-3 gap-4">
                 <Input label="Year" name="year" type="number" value={formData.year} onChange={handleChange} required />
                 <div className="space-y-2">
                     <label className="text-sm font-medium text-[var(--text-secondary)]">Category</label>
                     <select name="category" value={formData.category} onChange={handleChange} className="w-full h-11 px-4 bg-[var(--surface)] border border-[var(--border)] rounded-lg text-white appearance-none">
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
                     <select name="transmission" value={formData.transmission} onChange={handleChange} className="w-full h-11 px-4 bg-[var(--surface)] border border-[var(--border)] rounded-lg text-white appearance-none">
                         <option>Automatic</option>
                         <option>Manual</option>
                     </select>
                 </div>
                 <div className="space-y-2">
                     <label className="text-sm font-medium text-[var(--text-secondary)]">Fuel Type</label>
                     <select name="fuelType" value={formData.fuelType} onChange={handleChange} className="w-full h-11 px-4 bg-[var(--surface)] border border-[var(--border)] rounded-lg text-white appearance-none">
                         <option>Petrol</option>
                         <option>Diesel</option>
                         <option>Electric</option>
                         <option>Hybrid</option>
                     </select>
                 </div>
            </div>

            <Input label="Daily Price ($)" name="priceDaily" type="number" placeholder="0.00" value={formData.priceDaily} onChange={handleChange} required />

            <div className="space-y-4">
                <Input label="Image URL" name="imageUrl" placeholder="https://..." value={formData.imageUrl} onChange={handleChange} required />
                
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-[var(--border)]" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-[var(--surface-light)] px-2 text-[var(--text-muted)]">Or upload file</span>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <input 
                        type="file" 
                        accept="image/*"
                        onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;

                            const data = new FormData();
                            data.append('file', file);
                            
                            try {
                                setIsLoading(true);
                                const res = await fetch('/api/upload', {
                                    method: 'POST',
                                    body: data
                                });
                                const result = await res.json();
                                if (result.success) {
                                    setFormData(prev => ({ ...prev, imageUrl: result.url }));
                                } else {
                                    alert('Upload failed');
                                }
                            } catch (err) {
                                console.error(err);
                                alert('Upload error');
                            } finally {
                                setIsLoading(false);
                            }
                        }}
                        className="block w-full text-sm text-[var(--text-secondary)]
                          file:mr-4 file:py-2 file:px-4
                          file:rounded-full file:border-0
                          file:text-sm file:font-semibold
                          file:bg-[var(--primary)] file:text-black
                          hover:file:opacity-90 cursor-pointer"
                    />
                </div>
            </div>
            
            {formData.imageUrl && (
                <div className="relative h-48 w-full bg-[var(--surface)] rounded-lg overflow-hidden border border-[var(--border)]">
                    {/* Use standard img for preview to avoid Next.js Image caching complexity during dev upload */}
                    <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                </div>
            )}

            <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="ghost" onClick={() => router.back()}>Cancel</Button>
                <Button type="submit" isLoading={isLoading}>Create Vehicle</Button>
            </div>
        </form>
    </div>
  );
}
