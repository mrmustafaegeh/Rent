'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import OptimizedImage from '@/components/ui/OptimizedImage';

interface Booking {
    _id: string;
    bookingNumber: string;
    vehicle: {
        brand: string;
        vehicleModel: string;
        images: { url: string }[];
    };
    startDate: string;
    endDate: string;
    totalPrice: number;
    status: string;
    pickupLocation: string;
    dropoffLocation: string;
}

export default function MyBookingsPage() {
    const { isAuthenticated } = useAuth();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchBookings = async () => {
            if (isAuthenticated) {
                try {
                    const res = await fetch('/api/bookings'); 
                    const data = await res.json();
                    if (data.success) {
                        setBookings(data.data);
                    }
                } catch (error) {
                    console.error("Error fetching bookings", error);
                } finally {
                    setIsLoading(false);
                }
            } else {
                // Not authenticated yet or loading
                setIsLoading(false); 
            }
        };

        fetchBookings();
    }, [isAuthenticated]);

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-white">My Bookings</h1>

            {isLoading ? (
                <div className="text-[var(--text-muted)]">Loading...</div>
            ) : bookings.length === 0 ? (
                <div className="text-center py-20 bg-[var(--surface-light)] rounded-xl border border-[var(--border)]">
                    <p className="text-[var(--text-secondary)] mb-4">You haven't made any bookings yet.</p>
                    <Link href="/fleet">
                        <Button>Browse Vehicles</Button>
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {bookings.map((booking) => (
                        <div key={booking._id} className="bg-[var(--surface-light)] p-6 rounded-xl border border-[var(--border)] flex flex-col md:flex-row gap-6 items-center">
                            <div className="w-full md:w-32 h-24 bg-[var(--surface-lighter)] rounded overflow-hidden relative">
                                <OptimizedImage 
                                   src={booking.vehicle?.images?.[0]?.url || ''} 
                                   alt={booking.vehicle.brand} 
                                   fill
                                   className="w-full h-full"
                                   sizes="(max-width: 768px) 100vw, 150px"
                                />
                            </div>
                            <div className="flex-1 w-full text-center md:text-left">
                                <h3 className="font-bold text-lg">{booking.vehicle?.brand} {booking.vehicle?.vehicleModel}</h3>
                                <p className="text-sm text-[var(--text-secondary)]">
                                    {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                                </p>
                                <p className="text-xs text-[var(--text-muted)] mt-1 flex flex-col md:flex-row gap-2">
                                    <span className="flex items-center gap-1"><span className="text-primary">•</span> Pickup: {booking.pickupLocation}</span>
                                    <span className="flex items-center gap-1"><span className="text-destructive">•</span> Dropoff: {booking.dropoffLocation}</span>
                                </p>
                                <p className="text-xs font-mono text-[var(--text-muted)] mt-1">{booking.bookingNumber}</p>
                            </div>
                            <div className="text-center md:text-right">
                                <p className="text-xl font-bold text-white">${booking.totalPrice}</p>
                                <span className={`inline-block px-2 py-1 rounded text-xs capitalize ${
                                    booking.status === 'confirmed' ? 'bg-green-500/20 text-green-500' :
                                    booking.status === 'pending' ? 'bg-yellow-500/20 text-yellow-500' : 
                                    'bg-red-500/20 text-red-500'
                                }`}>
                                    {booking.status}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
