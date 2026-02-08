'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';

interface Booking {
    _id: string;
    bookingNumber: string;
    customer: {
        firstName: string;
        lastName: string;
        email: string;
    } | string; // Could be populated or ID
    vehicle: {
        brand: string;
        vehicleModel: string;
        pricing: { daily: number };
    };
    startDate: string;
    endDate: string;
    totalPrice: number;
    status: string;
    createdAt: string;
}

export default function AllBookingsPage() {
    const { user } = useAuth();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchBookings = async () => {
        try {
            const res = await fetch('/api/bookings');
            const data = await res.json();
            
            // Should add populate logic in API for customer if not present
            setBookings(data.data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const updateStatus = async (id: string, status: string) => {
        try {
            const res = await fetch(`/api/bookings/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            });
            const data = await res.json();
            
            if (data.success) {
                // Refresh list locally
                setBookings(bookings.map(b => 
                    b._id === id ? { ...b, status } : b
                ));
            } else {
                alert('Failed to update status');
            }
        } catch (error) {
            console.error(error);
            alert('Error updating status');
        }
    };

    if (isLoading) return <div>Loading...</div>;

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-white">All Bookings</h1>

            <div className="bg-[var(--surface-light)] rounded-xl border border-[var(--border)] overflow-hidden">
                <table className="w-full text-left border-collapse">
                     <thead>
                        <tr className="border-b border-[var(--border)] bg-[var(--surface-lighter)]">
                            <th className="p-4 text-xs font-semibold text-[var(--text-muted)] uppercase">Ref</th>
                            <th className="p-4 text-xs font-semibold text-[var(--text-muted)] uppercase">Vehicle</th>
                            <th className="p-4 text-xs font-semibold text-[var(--text-muted)] uppercase">Customer</th>
                            <th className="p-4 text-xs font-semibold text-[var(--text-muted)] uppercase">Dates</th>
                            <th className="p-4 text-xs font-semibold text-[var(--text-muted)] uppercase">Total</th>
                            <th className="p-4 text-xs font-semibold text-[var(--text-muted)] uppercase">Status</th>
                            <th className="p-4 text-xs font-semibold text-[var(--text-muted)] uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border)]">
                        {bookings.map((booking) => (
                            <tr key={booking._id} className="hover:bg-[var(--surface-lighter)]/50 transition-colors">
                                <td className="p-4 text-sm font-mono text-[var(--text-secondary)]">{booking.bookingNumber}</td>
                                <td className="p-4">
                                    <div className="font-medium">{booking.vehicle?.brand} {booking.vehicle?.vehicleModel}</div>
                                </td>
                                <td className="p-4 text-sm">
                                    {/* Handle populated customer or just ID fallback */}
                                    {typeof booking.customer === 'object' ? `${booking.customer.firstName} ${booking.customer.lastName}` : 'Guest User'}
                                    <div className="text-xs text-[var(--text-muted)]">
                                         {typeof booking.customer === 'object' ? booking.customer.email : ''}
                                    </div>
                                </td>
                                <td className="p-4 text-sm text-[var(--text-secondary)]">
                                    <div>{new Date(booking.startDate).toLocaleDateString()}</div>
                                    <div className="text-xs">to {new Date(booking.endDate).toLocaleDateString()}</div>
                                </td>
                                <td className="p-4 font-bold">${booking.totalPrice}</td>
                                <td className="p-4">
                                     <span className={`px-2 py-1 rounded text-xs uppercase font-bold ${
                                        booking.status === 'confirmed' ? 'bg-green-500/20 text-green-500' :
                                        booking.status === 'pending' ? 'bg-yellow-500/20 text-yellow-500' : 
                                        'bg-red-500/20 text-red-500'
                                    }`}>
                                        {booking.status}
                                    </span>
                                </td>
                                <td className="p-4">
                                    {booking.status === 'pending' && (
                                        <div className="flex gap-2">
                                            <Button size="sm" className="h-7 px-2 text-xs bg-green-600 hover:bg-green-700" onClick={() => updateStatus(booking._id, 'confirmed')}>Approve</Button>
                                            <Button size="sm" className="h-7 px-2 text-xs bg-red-600 hover:bg-red-700" onClick={() => updateStatus(booking._id, 'cancelled')}>Reject</Button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                 {bookings.length === 0 && (
                    <div className="p-8 text-center text-[var(--text-muted)]">
                        No bookings found.
                    </div>
                )}
            </div>
        </div>
    );
}
