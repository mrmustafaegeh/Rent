'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

interface Booking {
    _id: string;
    bookingNumber: string;
    customer: {
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
    };
    vehicle: {
        brand: string;
        vehicleModel: string;
        images: { url: string; isPrimary: boolean }[];
    };
    startDate: string;
    endDate: string;
    totalPrice: number;
    status: string;
    paymentStatus: string;
    pickupLocation: string;
    dropoffLocation: string;
    createdAt: string;
}

export default function BookingConfirmationsPage() {
    const { user, isLoading: authLoading } = useAuth();
    const router = useRouter();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [confirming, setConfirming] = useState<string | null>(null);
    const [filter, setFilter] = useState<'pending' | 'all'>('pending');

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
        }
    }, [user, authLoading, router]);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/admin/bookings');
            const data = await response.json();

            if (data.success) {
                // Filter based on selected tab
                let filtered = data.data;
                if (filter === 'pending') {
                    filtered = data.data.filter((b: Booking) => 
                        b.status === 'pending' || b.status === 'pending_payment'
                    );
                }
                setBookings(filtered);
            } else {
                console.error('Failed to fetch bookings:', data.error);
            }
        } catch (error) {
            console.error('Error fetching bookings:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchBookings();
        }
    }, [user, filter]);

    const handleConfirmBooking = async (bookingId: string) => {
        if (!confirm('Are you sure you want to confirm this booking? This will send a confirmation email to the customer.')) {
            return;
        }

        try {
            setConfirming(bookingId);
            const response = await fetch('/api/admin/bookings/confirm', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ bookingId }),
            });

            const data = await response.json();

            if (data.success) {
                alert('✅ Booking confirmed and email sent to customer!');
                fetchBookings(); // Refresh the list
            } else {
                alert(`❌ Failed to confirm booking: ${data.error}`);
            }
        } catch (error) {
            console.error('Error confirming booking:', error);
            alert('❌ An error occurred while confirming the booking');
        } finally {
            setConfirming(null);
        }
    };

    const handleRejectBooking = async (bookingId: string) => {
        if (!confirm('Are you sure you want to cancel this booking?')) {
            return;
        }

        try {
            setConfirming(bookingId);
            const response = await fetch('/api/admin/bookings', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    id: bookingId,
                    status: 'cancelled'
                }),
            });

            const data = await response.json();

            if (data.success) {
                alert('Booking cancelled');
                fetchBookings();
            } else {
                alert(`Failed to cancel booking: ${data.error}`);
            }
        } catch (error) {
            console.error('Error cancelling booking:', error);
        } finally {
            setConfirming(null);
        }
    };

    if (authLoading || !user) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending':
            case 'pending_payment':
                return 'bg-yellow-100 text-yellow-800';
            case 'confirmed':
                return 'bg-green-100 text-green-800';
            case 'in_progress':
                return 'bg-blue-100 text-blue-800';
            case 'completed':
                return 'bg-gray-100 text-gray-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const pendingCount = bookings.filter(b => 
        b.status === 'pending' || b.status === 'pending_payment'
    ).length;

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Booking Confirmations</h1>
                    <p className="mt-2 text-gray-600">
                        Review and confirm customer bookings
                    </p>
                </div>

                {/* Filter Tabs */}
                <div className="mb-6 border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8">
                        <button
                            onClick={() => setFilter('pending')}
                            className={`${
                                filter === 'pending'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
                        >
                            Pending
                            {pendingCount > 0 && (
                                <span className="ml-2 bg-blue-100 text-blue-600 py-0.5 px-2 rounded-full text-xs font-semibold">
                                    {pendingCount}
                                </span>
                            )}
                        </button>
                        <button
                            onClick={() => setFilter('all')}
                            className={`${
                                filter === 'all'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
                        >
                            All Bookings
                        </button>
                    </nav>
                </div>

                {/* Loading State */}
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                            <p className="mt-4 text-gray-600">Loading bookings...</p>
                        </div>
                    </div>
                ) : bookings.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                        <svg
                            className="mx-auto h-12 w-12 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                            />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">
                            {filter === 'pending' ? 'No pending bookings' : 'No bookings found'}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                            {filter === 'pending' 
                                ? 'All bookings have been processed.' 
                                : 'No bookings available at the moment.'}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {bookings.map((booking) => (
                            <div
                                key={booking._id}
                                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                            >
                                <div className="p-6">
                                    <div className="flex items-start justify-between">
                                        {/* Left Side - Booking Info */}
                                        <div className="flex-1">
                                            <div className="flex items-center gap-4 mb-4">
                                                <h3 className="text-lg font-semibold text-gray-900">
                                                    {booking.bookingNumber}
                                                </h3>
                                                <span
                                                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                                                        booking.status
                                                    )}`}
                                                >
                                                    {booking.status}
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {/* Customer Info */}
                                                <div>
                                                    <p className="text-sm text-gray-500 mb-1">Customer</p>
                                                    <p className="font-medium text-gray-900">
                                                        {booking.customer ? `${booking.customer.firstName} ${booking.customer.lastName}` : 'Guest User'}
                                                    </p>
                                                    <p className="text-sm text-gray-600">{booking.customer?.email || 'No contact info'}</p>
                                                    <p className="text-sm text-gray-600">{booking.customer?.phone || 'No phone provided'}</p>
                                                </div>

                                                {/* Vehicle Info */}
                                                <div>
                                                    <p className="text-sm text-gray-500 mb-1">Vehicle</p>
                                                    <p className="font-medium text-gray-900">
                                                        {booking.vehicle ? `${booking.vehicle.brand} ${booking.vehicle.vehicleModel}` : 'Vehicle not found'}
                                                    </p>
                                                </div>

                                                {/* Dates */}
                                                <div>
                                                    <p className="text-sm text-gray-500 mb-1">Rental Period</p>
                                                    <p className="text-sm text-gray-900">
                                                        <span className="font-medium">From:</span> {formatDate(booking.startDate)}
                                                    </p>
                                                    <p className="text-sm text-gray-900">
                                                        <span className="font-medium">To:</span> {formatDate(booking.endDate)}
                                                    </p>
                                                </div>

                                                {/* Location */}
                                                <div>
                                                    <p className="text-sm text-gray-500 mb-1">Location</p>
                                                    <p className="text-sm text-gray-900">
                                                        <span className="font-medium">Pickup:</span> {booking.pickupLocation}
                                                    </p>
                                                    <p className="text-sm text-gray-900">
                                                        <span className="font-medium">Dropoff:</span> {booking.dropoffLocation}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Price */}
                                            <div className="mt-4 pt-4 border-t border-gray-200">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm text-gray-500">Total Price</span>
                                                    <span className="text-2xl font-bold text-blue-600">
                                                        €{booking.totalPrice}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    {(booking.status === 'pending' || booking.status === 'pending_payment') && (
                                        <div className="mt-6 pt-6 border-t border-gray-200 flex gap-3">
                                            <button
                                                onClick={() => handleConfirmBooking(booking._id)}
                                                disabled={confirming === booking._id}
                                                className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                            >
                                                {confirming === booking._id ? (
                                                    <>
                                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                        <span>Confirming...</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                        <span>Confirm & Send Email</span>
                                                    </>
                                                )}
                                            </button>
                                            <button
                                                onClick={() => handleRejectBooking(booking._id)}
                                                disabled={confirming === booking._id}
                                                className="flex-1 bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                            >
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                                <span>Cancel Booking</span>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
