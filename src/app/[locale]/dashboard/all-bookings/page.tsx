'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Pagination } from '@/components/ui/Pagination';
import { 
    Calendar, 
    MapPin, 
    MoreHorizontal, 
    CheckCircle, 
    XCircle, 
    Clock, 
    Search,
    CreditCard,
    DollarSign,
    Filter,
    Download
} from 'lucide-react';
import { Input } from '@/components/ui/Input';

interface Booking {
    _id: string;
    bookingNumber: string;
    customer: {
        firstName: string;
        lastName: string;
        email: string;
        phone?: string;
    } | string; 
    vehicle: {
        brand: string;
        vehicleModel: string;
        pricing: { daily: number };
        images?: { url: string }[];
    } | null;
    startDate: string;
    endDate: string;
    totalPrice: number;
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'in_progress';
    paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded' | 'pay_at_pickup';
    pickupLocation: string;
    dropoffLocation: string;
    createdAt: string;
}

export default function AllBookingsPage() {
    const { user } = useAuth();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [searchTerm, setSearchTerm] = useState('');
    
    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const fetchBookings = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/bookings');
            const data = await res.json();
            if (data.success) {
                setBookings(data.data);
            }
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
            const res = await fetch('/api/admin/bookings', { // Assuming use of admin route or similar
                method: 'PATCH', 
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status }) // Adjust based on actual API
            });
            
            // Fallback to local update for responsiveness or if API structure differs
             setBookings(bookings.map(b => 
                b._id === id ? { ...b, status: status as any } : b
            ));

        } catch (error) {
            console.error(error);
            alert('Error updating status');
        }
    };

    // Filter Logic
    const filteredBookings = bookings.filter(booking => {
        const matchesStatus = filterStatus === 'all' || booking.status === filterStatus;
        const searchLower = searchTerm.toLowerCase();
        
        let matchesSearch = (booking.bookingNumber || '').toLowerCase().includes(searchLower);
        
        if (booking.customer && typeof booking.customer === 'object') {
             matchesSearch = matchesSearch || 
                (booking.customer.firstName || '').toLowerCase().includes(searchLower) ||
                (booking.customer.lastName || '').toLowerCase().includes(searchLower) ||
                (booking.customer.email || '').toLowerCase().includes(searchLower);
        }
        
        return matchesStatus && matchesSearch;
    });

    // Pagination Logic
    const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
    const paginatedBookings = filteredBookings.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'confirmed': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
            case 'pending': return 'bg-amber-50 text-amber-700 border-amber-200';
            case 'cancelled': return 'bg-red-50 text-red-700 border-red-200';
            case 'completed': return 'bg-blue-50 text-blue-700 border-blue-200';
            case 'in_progress': return 'bg-purple-50 text-purple-700 border-purple-200';
            default: return 'bg-gray-50 text-gray-700 border-gray-200';
        }
    };

    return (
        <div className="space-y-8 pb-12 w-full max-w-[1600px] mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-heading font-black text-navy tracking-tight">Booking Management</h1>
                    <p className="text-gray-500 mt-1 font-medium">Monitor and manage all fleet reservations.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="gap-2 border-gray-200 text-gray-600 hover:text-navy hover:border-navy h-11 rounded-xl font-bold bg-white">
                        <Download className="w-4 h-4" /> Export CSV
                    </Button>
                    {/* Link to schedule page or new booking modal could go here */}
                </div>
            </div>

            {/* Filters & Search Toolbar */}
            <div className="bg-white p-2 rounded-2xl border border-gray-200 shadow-sm flex flex-col lg:flex-row justify-between items-center gap-4 sticky top-4 z-20">
                
                {/* Status Tabs */}
                <div className="flex items-center p-1 gap-1 overflow-x-auto w-full lg:w-auto scrollbar-hide">
                    {['all', 'pending', 'confirmed', 'in_progress', 'completed', 'cancelled'].map((status) => (
                        <button
                            key={status}
                            onClick={() => { setFilterStatus(status); setCurrentPage(1); }}
                            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap uppercase tracking-wider ${
                                filterStatus === status 
                                ? 'bg-navy text-gold shadow-md shadow-navy/20' 
                                : 'text-gray-500 hover:bg-gray-50 hover:text-navy'
                            }`}
                        >
                            {status.replace('_', ' ')}
                        </button>
                    ))}
                </div>
                
                {/* Search */}
                <div className="relative w-full lg:w-96 m-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input 
                        placeholder="Search by name, reference, or email..." 
                        className="pl-11 h-11 bg-gray-50 border-transparent focus:bg-white focus:border-gray-200 transition-all rounded-xl text-sm font-medium"
                        value={searchTerm}
                        onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                    />
                </div>
            </div>

            {/* Bookings Table Card */}
            <div className="bg-white rounded-3xl border border-gray-200 shadow-xl shadow-gray-100/50 overflow-hidden flex flex-col min-h-[600px]">
                <div className="overflow-x-auto flex-1">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="p-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Booking Ref</th>
                                <th className="p-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Customer</th>
                                <th className="p-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Vehicle</th>
                                <th className="p-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Schedule</th>
                                <th className="p-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                                <th className="p-6 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={6} className="p-24 text-center">
                                        <div className="animate-spin rounded-full h-10 w-10 border-2 border-navy border-t-transparent mx-auto mb-4"></div>
                                        <p className="text-gray-500 font-bold">Loading reservations...</p>
                                    </td>
                                </tr>
                            ) : paginatedBookings.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-24 text-center">
                                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-gray-100">
                                            <Search className="w-10 h-10 text-gray-300" />
                                        </div>
                                        <h3 className="font-bold text-navy text-xl mb-2">No bookings found</h3>
                                        <p className="text-gray-400 max-w-xs mx-auto">We couldn't find any bookings matching your current filters.</p>
                                        <Button 
                                            variant="outline" 
                                            className="mt-6 border-gray-200 text-navy font-bold"
                                            onClick={() => { setFilterStatus('all'); setSearchTerm(''); }}
                                        >
                                            Clear Filters
                                        </Button>
                                    </td>
                                </tr>
                            ) : (
                                paginatedBookings.map((booking) => (
                                    <tr key={booking._id} className="hover:bg-blue-50/20 transition-all group">
                                        {/* Reference */}
                                        <td className="p-6 align-top">
                                            <div className="flex flex-col gap-1.5">
                                                <span className="font-mono text-xs font-black text-navy bg-navy/5 px-2 py-1 rounded-md w-fit tracking-wide">
                                                    {booking.bookingNumber}
                                                </span>
                                                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    {new Date(booking.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                                </span>
                                            </div>
                                        </td>
                                        
                                        {/* Customer */}
                                        <td className="p-6 align-top">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black shadow-sm ring-1 ring-inset ring-black/5
                                                    ${(booking.customer && typeof booking.customer === 'object') ? 'bg-gradient-to-br from-electric/20 to-blue-100 text-electric' : 'bg-gray-100 text-gray-500'}`}
                                                >
                                                    {(booking.customer && typeof booking.customer === 'object') ? booking.customer.firstName[0] : 'G'}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-navy text-sm">
                                                        {(booking.customer && typeof booking.customer === 'object') 
                                                            ? `${booking.customer.firstName} ${booking.customer.lastName}` 
                                                            : 'Guest User'}
                                                    </div>
                                                    <div className="text-xs text-gray-400 mt-0.5 font-medium truncate max-w-[150px]">
                                                        {(booking.customer && typeof booking.customer === 'object') ? booking.customer.email : 'No contact info'}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Vehicle */}
                                        <td className="p-6 align-top">
                                            {booking.vehicle ? (
                                                <div>
                                                    <div className="font-bold text-navy text-sm">{booking.vehicle.brand}</div>
                                                    <div className="text-electric font-bold text-xs">{booking.vehicle.vehicleModel}</div>
                                                    <div className="text-[10px] text-gray-400 mt-1 font-bold uppercase tracking-wider">
                                                        €{booking.vehicle.pricing?.daily}/day
                                                    </div>
                                                </div>
                                            ) : (
                                                <span className="text-gray-400 text-xs italic">Vehicle removed</span>
                                            )}
                                        </td>

                                        {/* Schedule */}
                                        <td className="p-6 align-top">
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-1 bg-gradient-to-b from-navy to-electric h-8 rounded-full opacity-20"></div>
                                                    <div className="text-xs">
                                                        <div className="font-bold text-navy">{new Date(booking.startDate).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                                                        <div className="text-gray-400 text-[10px] font-medium uppercase tracking-wider mt-0.5">Pickup</div>
                                                    </div>
                                                    <div className="text-xs">
                                                        <div className="font-bold text-navy">{new Date(booking.endDate).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                                                        <div className="text-gray-400 text-[10px] font-medium uppercase tracking-wider mt-0.5">Return</div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-1.5 text-xs text-gray-500 bg-gray-50 w-fit px-2 py-1 rounded-lg">
                                                    <MapPin className="w-3 h-3 text-gray-400" />
                                                    <span className="font-medium truncate max-w-[140px]" title={booking.pickupLocation}>{booking.pickupLocation}</span>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Status */}
                                        <td className="p-6 align-top">
                                            <div className="flex flex-col gap-3 items-start">
                                                <Badge className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-wider border shadow-sm ${getStatusColor(booking.status)}`}>
                                                    {booking.status === 'confirmed' && <CheckCircle className="w-3 h-3 mr-1.5" />}
                                                    {booking.status === 'cancelled' && <XCircle className="w-3 h-3 mr-1.5" />}
                                                    {booking.status === 'pending' && <Clock className="w-3 h-3 mr-1.5" />}
                                                    {booking.status.replace('_', ' ')}
                                                </Badge>
                                                
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total</span>
                                                    <span className="font-black text-sm text-navy">€{booking.totalPrice}</span>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Actions */}
                                        <td className="p-6 align-top text-right">
                                            <div className="flex justify-end gap-2 opacity-100">
                                                {booking.status === 'pending' ? (
                                                    <>
                                                        <Button 
                                                            size="icon"
                                                            className="h-9 w-9 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl shadow-lg shadow-emerald-500/20 transition-all hover:scale-105"
                                                            onClick={() => updateStatus(booking._id, 'confirmed')}
                                                            title="Approve Booking"
                                                        >
                                                            <CheckCircle className="w-4 h-4" />
                                                        </Button>
                                                        <Button 
                                                            size="icon"
                                                            variant="outline"
                                                            className="h-9 w-9 border-red-200 text-red-500 hover:bg-red-50 rounded-xl hover:border-red-300 transition-all hover:scale-105"
                                                            onClick={() => updateStatus(booking._id, 'cancelled')}
                                                            title="Reject Booking"
                                                        >
                                                            <XCircle className="w-4 h-4" />
                                                        </Button>
                                                    </>
                                                ) : (
                                                    <Button variant="ghost" size="icon" className="h-9 w-9 text-gray-400 hover:text-navy hover:bg-gray-50 rounded-xl">
                                                         <MoreHorizontal className="w-4 h-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                
                {/* Footer with Pagination */}
                <div className="bg-gray-50/50 p-6 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="text-xs font-bold text-gray-500">
                        Showing <span className="text-navy">{paginatedBookings.length}</span> of <span className="text-navy">{filteredBookings.length}</span> reservations
                    </div>
                    
                    <Pagination 
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                </div>
            </div>
        </div>
    );
}
