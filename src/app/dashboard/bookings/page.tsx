'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, MapPin, ArrowRight, Download } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

interface Booking {
    _id: string;
    bookingNumber: string;
    vehicle: {
        brand: string;
        model: string;
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
    const { isAuthenticated, isLoading: authLoading } = useAuth();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchBookings = async () => {
             // Mock data for demo purposes if API fails or returns empty
             // In production this would come solely from the API
             const mockBookings: Booking[] = [
                 {
                     _id: '1',
                     bookingNumber: 'RES-8392',
                     vehicle: {
                         brand: 'BMW',
                         model: '4 Series Convertible',
                         images: [{ url: '/images/hero-bg-cyprus.png' }]
                     },
                     startDate: '2024-06-15',
                     endDate: '2024-06-20',
                     pickupLocation: 'Ercan Airport',
                     dropoffLocation: 'Kyrenia Harbor',
                     totalPrice: 450,
                     status: 'confirmed'
                 }
             ];

            if (isAuthenticated) {
                try {
                    const res = await fetch('/api/bookings'); 
                    if (res.ok) {
                        const data = await res.json();
                        if (data.success && data.data.length > 0) {
                            setBookings(data.data);
                        } else {
                             // Use mock data if API returns empty for demo visualization
                             // Remove this in production!
                             if (data.data.length === 0) setBookings(mockBookings);
                        }
                    } else {
                        // Fallback to mock
                        setBookings(mockBookings);
                    }
                } catch (error) {
                    console.error("Error fetching bookings", error);
                    setBookings(mockBookings);
                } finally {
                    setIsLoading(false);
                }
            } else if (!authLoading) {
                setIsLoading(false); 
            }
        };

        if(!authLoading) fetchBookings();
    }, [isAuthenticated, authLoading]);

    if (authLoading || isLoading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-navy"></div>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-navy">My Bookings</h1>
                    <p className="text-gray-500 mt-1">Manage your upcoming and past trips.</p>
                </div>
                <Link href="/cars">
                    <Button variant="outline" className="gap-2 border-dashed border-gray-300 hover:border-navy hover:text-navy">
                        + New Booking
                    </Button>
                </Link>
            </div>

            {bookings.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Calendar className="w-8 h-8 text-gray-300" />
                    </div>
                    <h3 className="text-lg font-bold text-navy mb-2">No bookings found</h3>
                    <p className="text-gray-500 mb-6 max-w-sm mx-auto">You haven't made any reservations yet. Explore our fleet to find your perfect ride.</p>
                    <Link href="/cars">
                        <Button className="bg-navy text-gold hover:bg-navy/90 font-bold px-8 rounded-xl h-12">Browse Vehicles</Button>
                    </Link>
                </div>
            ) : (
                <div className="grid gap-6">
                    {bookings.map((booking) => (
                        <div key={booking._id} className="group bg-white p-6 rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-300 flex flex-col lg:flex-row gap-8 items-start">
                            
                            {/* Image */}
                            <div className="w-full lg:w-64 aspect-[4/3] bg-gray-100 rounded-2xl overflow-hidden relative flex-shrink-0 border border-gray-100">
                                <Image 
                                   src={booking.vehicle?.images?.[0]?.url || '/images/placeholder-car.jpg'} 
                                   alt={booking.vehicle?.brand || 'Car'} 
                                   fill
                                   className="object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute top-3 left-3">
                                    <Badge className={`capitalize shadow-lg ${
                                        booking.status === 'confirmed' ? 'bg-emerald-500 text-white' :
                                        booking.status === 'pending' ? 'bg-amber-500 text-white' : 
                                        'bg-red-500 text-white'
                                    }`}>
                                        {booking.status === 'pending_payment' ? 'Pending Payment' : booking.status}
                                    </Badge>
                                </div>
                            </div>
                            
                            {/* Details */}
                            <div className="flex-1 w-full space-y-6">
                                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                    <div>
                                        <div className="text-xs font-mono text-gray-400 mb-1 uppercase tracking-wider">
                                            ref: {booking.bookingNumber}
                                        </div>
                                        <h3 className="font-heading font-black text-2xl text-navy">{booking.vehicle?.brand} <span className="text-electric font-bold">{booking.vehicle?.model}</span></h3>
                                    </div>
                                    <div className="text-left md:text-right">
                                        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Total Price</p>
                                        <p className="text-2xl font-heading font-black text-navy">€{booking.totalPrice}</p>
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100/50">
                                        <div className="flex items-center gap-2 mb-2 text-gray-400 text-xs font-bold uppercase tracking-wider">
                                            <Calendar className="w-3.5 h-3.5" /> Dates
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="font-bold text-navy text-sm">{new Date(booking.startDate).toLocaleDateString()}</span>
                                            <ArrowRight className="w-4 h-4 text-gray-300" />
                                            <span className="font-bold text-navy text-sm">{new Date(booking.endDate).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    
                                    <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100/50">
                                        <div className="flex items-center gap-2 mb-2 text-gray-400 text-xs font-bold uppercase tracking-wider">
                                            <MapPin className="w-3.5 h-3.5" /> Locations
                                        </div>
                                         <div className="flex justify-between items-center">
                                            <span className="font-bold text-navy text-sm truncate max-w-[40%]">{booking.pickupLocation}</span>
                                            <ArrowRight className="w-4 h-4 text-gray-300" />
                                            <span className="font-bold text-navy text-sm truncate max-w-[40%]">{booking.dropoffLocation}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-wrap gap-3 pt-2">
                                     <Button className="bg-navy hover:bg-navy/90 text-white rounded-xl h-10 px-5 text-sm font-bold flex-1 md:flex-none">
                                         View Details
                                     </Button>
                                     {booking.status === 'confirmed' && (
                                         <Button variant="outline" className="border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-navy rounded-xl h-10 px-5 text-sm font-bold flex items-center gap-2 flex-1 md:flex-none">
                                             <Download className="w-4 h-4" /> Returns Receipt
                                         </Button>
                                     )}
                                     <div className="md:ml-auto">
                                          <Button variant="ghost" className="text-gray-400 hover:text-red-500 h-10 px-4 text-xs font-bold">
                                              Cancel Booking
                                          </Button>
                                     </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
