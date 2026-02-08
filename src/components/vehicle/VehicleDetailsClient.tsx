'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import OptimizedImage from '@/components/ui/OptimizedImage';
import ShareButtons from '@/components/ui/ShareButtons';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/context/AuthContext';
import ReviewsSection from '@/components/vehicle/ReviewsSection';

interface Vehicle {
  _id: string;
  brand: string;
  vehicleModel: string;
  year: number;
  category: string;
  pricing: {
    daily: number;
  };
  transmission: string;
  fuelType: string;
  seats: number;
  details?: {
    description: string;
  };
  images: { url: string; isPrimary: boolean }[];
  company: {
      name: string;
  }
}

interface VehicleDetailsClientProps {
    vehicle: Vehicle;
}

export default function VehicleDetailsClient({ vehicle }: VehicleDetailsClientProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  // Calculate total price directly (derived state)
  const calculateTotalPrice = () => {
    if (startDate && endDate && vehicle) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 0;
        
        if (diffDays > 0) {
            return diffDays * vehicle.pricing.daily;
        }
    }
    return 0;
  };
  
  const totalPrice = calculateTotalPrice();

  const handleBooking = async () => {
    if (!isAuthenticated) {
        router.push(`/auth/login?redirect=/vehicles/${vehicle._id}`);
        return;
    }

    if (!startDate || !endDate) return;

    // Redirect to checkout with params
    const query = new URLSearchParams({
        vehicleId: vehicle._id,
        startDate,
        endDate
    }).toString();

    router.push(`/checkout?${query}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[var(--background)]">
      <Header />
      
      <main className="flex-1 pt-24 pb-12">
        <div className="container mx-auto px-4">
            {/* Breadcrumb */}
            <div className="mb-6 text-sm text-[var(--text-secondary)]">
                <Link href="/" className="hover:text-white">Home</Link>
                <span className="mx-2">/</span>
                <Link href="/fleet" className="hover:text-white">Fleet</Link>
                <span className="mx-2">/</span>
                <span className="text-white">{vehicle.brand} {vehicle.vehicleModel}</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
                {/* Image Gallery (Simplified) */}
                <div className="space-y-4">
                    <div className="relative h-[400px] lg:h-[500px] rounded-2xl overflow-hidden bg-[var(--surface-light)]">
                        <OptimizedImage 
                            src={vehicle.images?.[0]?.url || ''} 
                            alt={vehicle.vehicleModel}
                            fill
                            className="w-full h-full"
                            priority
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
                        />
                    </div>
                </div>

                {/* Details & Booking */}
                <div>
                    <h1 className="text-4xl font-bold mb-2">{vehicle.brand} {vehicle.vehicleModel} <span className="text-[var(--text-muted)] text-2xl font-normal">{vehicle.year}</span></h1>
                    <p className="text-[var(--primary)] text-3xl font-bold mb-6">${vehicle.pricing.daily}<span className="text-lg text-[var(--text-secondary)] font-normal">/day</span></p>

                    <div className="bg-[var(--surface-light)] rounded-xl p-6 border border-[var(--border)] mb-8">
                         <h3 className="font-bold mb-4">Rental Period</h3>
                         <div className="grid grid-cols-2 gap-4 mb-4">
                             <Input 
                                type="date" 
                                label="Pick-up Date" 
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                min={new Date().toISOString().split('T')[0]}
                             />
                             <Input 
                                type="date" 
                                label="Drop-off Date" 
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                min={startDate || new Date().toISOString().split('T')[0]}
                             />
                         </div>
                         
                         {totalPrice > 0 && (
                             <div className="flex justify-between items-center py-4 border-t border-[var(--border)] mb-4">
                                 <span className="text-[var(--text-secondary)]">Total Estimate</span>
                                 <span className="text-2xl font-bold">${totalPrice}</span>
                             </div>
                         )}

                         <Button size="lg" className="w-full" onClick={handleBooking} disabled={!startDate || !endDate}>
                             {isAuthenticated ? 'Proceed to Checkout' : 'Login to Book'}
                         </Button>
                    </div>

                    <div className="space-y-6">
                        <div>
                             <h3 className="font-bold mb-3">Share this Vehicle</h3>
                             <ShareButtons 
                                vehicle={{ 
                                    id: vehicle._id, 
                                    brand: vehicle.brand, 
                                    model: vehicle.vehicleModel 
                                }} 
                                variant="inline"
                             />
                        </div>

                        <div>
                            <h3 className="text-xl font-bold mb-3">Vehicle Details</h3>
                            <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-sm">
                                <div className="flex justify-between border-b border-[var(--border)] pb-2">
                                    <span className="text-[var(--text-secondary)]">Category</span>
                                    <span>{vehicle.category}</span>
                                </div>
                                <div className="flex justify-between border-b border-[var(--border)] pb-2">
                                    <span className="text-[var(--text-secondary)]">Transmission</span>
                                    <span>{vehicle.transmission || 'Automatic'}</span>
                                </div>
                                <div className="flex justify-between border-b border-[var(--border)] pb-2">
                                    <span className="text-[var(--text-secondary)]">Fuel Type</span>
                                    <span>{vehicle.fuelType || 'Petrol'}</span>
                                </div>
                                <div className="flex justify-between border-b border-[var(--border)] pb-2">
                                    <span className="text-[var(--text-secondary)]">Seats</span>
                                    <span>{vehicle.seats || 2} Persons</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Reviews Section */}
            <ReviewsSection vehicleId={vehicle._id} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
