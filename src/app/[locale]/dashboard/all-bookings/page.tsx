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
    Download,
    Activity,
    ArrowRight,
    Users,
    TrendingUp,
    ShieldCheck,
    Zap,
    ChevronRight,
    AlertCircle,
    Package
} from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { toast } from 'react-hot-toast';

interface Booking {
    id: string;
    bookingNumber: string;
    customer: {
        firstName: string;
        lastName: string;
        email: string;
        phone?: string;
        avatar?: string;
    } | string; 
    vehicle: {
        brand: string;
        vehicleModel: string;
        dailyPrice: number;
        pricing?: { daily: number };
        images?: { url: string }[];
    } | null;
    startDate: string;
    endDate: string;
    totalPrice: number;
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'in_progress' | 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'IN_PROGRESS';
    paymentStatus: string;
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
            toast.error("Failed to sync reservations");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const updateStatus = async (id: string, status: string) => {
        try {
            const res = await fetch('/api/admin/bookings', {
                method: 'PATCH', 
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status })
            });
            
            if (res.ok) {
                setBookings(bookings.map(b => 
                    b.id === id ? { ...b, status: status as any } : b
                ));
                toast.success(`Booking ${status.toLowerCase()} successfully`);
            } else {
                toast.error("Process failed");
            }
        } catch (error) {
            console.error(error);
            toast.error("Network error");
        }
    };

    // Filter Logic
    const filteredBookings = bookings.filter(booking => {
        const matchesStatus = filterStatus === 'all' || booking.status?.toLowerCase() === filterStatus.toLowerCase();
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
        const s = status?.toLowerCase();
        switch (s) {
            case 'confirmed': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            case 'pending': return 'bg-amber-50 text-amber-600 border-amber-100';
            case 'cancelled': return 'bg-red-50 text-red-500 border-red-100';
            case 'completed': return 'bg-blue-50 text-blue-600 border-blue-100';
            case 'in_progress': return 'bg-purple-50 text-purple-600 border-purple-100';
            default: return 'bg-gray-50 text-gray-500 border-gray-100';
        }
    };

    // Stats
    const activeBookings = bookings.filter(b => b.status?.toLowerCase() === 'confirmed' || b.status?.toLowerCase() === 'in_progress').length;
    const revenue = bookings.reduce((acc, b) => acc + (b.status?.toLowerCase() !== 'cancelled' ? b.totalPrice : 0), 0);

    return (
        <div className="space-y-10 pb-20 w-full max-w-[1500px] mx-auto animate-in fade-in duration-700">
            
            {/* Premium Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                     <div className="flex items-center gap-2 text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] mb-2 px-3 py-1 bg-blue-50 rounded-full w-fit border border-blue-100">
                        <Activity className="w-3 h-3" />
                        Logistics Intelligence
                    </div>
                    <h1 className="text-4xl md:text-5xl font-heading font-black text-navy tracking-tight">
                        Booking <span className="text-electric">Registry</span>
                    </h1>
                    <p className="text-gray-500 mt-2 font-medium">
                        Unified control center for all fleet reservations and lifecycle events.
                    </p>
                </div>
                <div className="flex gap-4 w-full md:w-auto">
                    <button className="flex-1 md:flex-none h-14 px-8 rounded-2xl border border-gray-100 bg-white text-navy text-[10px] font-black uppercase tracking-widest hover:border-navy hover:text-navy transition-all flex items-center justify-center gap-3">
                        <Download className="w-4 h-4" /> EXPORT MANIFEST
                    </button>
                </div>
            </div>

            {/* Logistics Status Strip */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-5 group hover:border-blue-200 transition-all">
                    <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-all">
                        <Users className="w-7 h-7" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Total Load</p>
                        <p className="text-2xl font-black text-navy">{bookings.length} <span className="text-sm font-medium text-gray-300">Res.</span></p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-5 group hover:border-emerald-200 transition-all">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-all">
                        <ShieldCheck className="w-7 h-7" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Active Operations</p>
                        <p className="text-2xl font-black text-navy">{activeBookings}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-5 group hover:border-amber-200 transition-all">
                    <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-white transition-all">
                        <Clock className="w-7 h-7" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Awaiting Action</p>
                        <p className="text-2xl font-black text-navy">{bookings.filter(b => b.status === 'pending').length}</p>
                    </div>
                </div>
                <div className="bg-navy p-6 rounded-[2rem] shadow-xl shadow-navy/20 text-white flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-white/10 text-gold flex items-center justify-center">
                        <TrendingUp className="w-7 h-7" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-white/40 uppercase tracking-widest leading-none mb-1">Gross Lifecycle Value</p>
                        <p className="text-2xl font-black text-white">€{revenue.toLocaleString()}</p>
                    </div>
                </div>
            </div>

            {/* Advanced Filters */}
            <div className="bg-white/80 backdrop-blur-md p-4 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col xl:flex-row justify-between items-center gap-6 sticky top-4 z-20">
                <div className="flex items-center gap-2 overflow-x-auto w-full xl:w-auto scrollbar-hide py-1">
                    {['all', 'pending', 'confirmed', 'in_progress', 'completed', 'cancelled'].map((status) => (
                        <button
                            key={status}
                            onClick={() => { setFilterStatus(status); setCurrentPage(1); }}
                            className={`px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border ${
                                filterStatus === status 
                                ? 'bg-navy text-gold border-navy shadow-lg shadow-navy/20' 
                                : 'bg-white text-gray-400 border-gray-100 hover:border-gray-300 hover:text-navy'
                            }`}
                        >
                            {status.replace('_', ' ')}
                        </button>
                    ))}
                </div>
                
                <div className="relative w-full xl:w-96">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                    <input 
                        placeholder="Search reference, customer, or identifier..." 
                        className="w-full h-14 pl-14 pr-4 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:border-gray-200 focus:ring-0 transition-all text-sm font-bold text-navy"
                        value={searchTerm}
                        onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                    />
                </div>
            </div>

            {/* Registry Table */}
            <div className="bg-white rounded-[3rem] border border-gray-100 shadow-[0_12px_45px_rgba(0,0,0,0.02)] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-50">
                                <th className="p-8 text-[10px] font-black text-gray-400 uppercase tracking-widest">Metadata</th>
                                <th className="p-8 text-[10px] font-black text-gray-400 uppercase tracking-widest">Customer Entity</th>
                                <th className="p-8 text-[10px] font-black text-gray-400 uppercase tracking-widest">Asset Allocated</th>
                                <th className="p-8 text-[10px] font-black text-gray-400 uppercase tracking-widest">Operational Window</th>
                                <th className="p-8 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status / Value</th>
                                <th className="p-8 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={6} className="p-32 text-center">
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="w-12 h-12 border-4 border-navy/10 border-t-navy rounded-full animate-spin"></div>
                                            <p className="text-navy font-black text-[10px] uppercase tracking-widest opacity-40">Synchronizing global registry</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : paginatedBookings.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-32 text-center">
                                        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8 border border-gray-100">
                                            <Package className="w-10 h-10 text-gray-200" />
                                        </div>
                                        <h3 className="text-2xl font-black text-navy mb-3">No matching records</h3>
                                        <p className="text-gray-400 max-w-sm mx-auto font-medium">Clear filters to view the full logistics manifest.</p>
                                    </td>
                                </tr>
                            ) : (
                                paginatedBookings.map((booking) => (
                                    <tr key={booking.id} className="hover:bg-blue-50/10 transition-all duration-300 group">
                                        {/* Metadata */}
                                        <td className="p-8 align-top">
                                            <div className="flex flex-col gap-2">
                                                <span className="font-mono text-xs font-black text-navy bg-navy/5 px-2.5 py-1.5 rounded-xl w-fit border border-navy/5">
                                                    #{booking.bookingNumber}
                                                </span>
                                                <div className="flex items-center gap-2 text-[10px] text-gray-400 font-black uppercase tracking-widest">
                                                    <Clock className="w-3 h-3 text-gold" />
                                                    {new Date(booking.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </div>
                                            </div>
                                        </td>
                                        
                                        {/* Customer */}
                                        <td className="p-8 align-top">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-12 h-12 rounded-[1rem] flex items-center justify-center text-sm font-black shadow-inner border border-white/50
                                                    ${(booking.customer && typeof booking.customer === 'object') ? 'bg-gradient-to-br from-navy to-electric text-white shadow-xl shadow-navy/20' : 'bg-gray-100 text-gray-400'}`}
                                                >
                                                    {(booking.customer && typeof booking.customer === 'object') ? (booking.customer.firstName?.[0] || 'G') : 'G'}
                                                </div>
                                                <div>
                                                    <div className="font-black text-navy text-base tracking-tight leading-none mb-1.5">
                                                        {(booking.customer && typeof booking.customer === 'object') 
                                                            ? `${booking.customer.firstName} ${booking.customer.lastName}` 
                                                            : 'Guest User'}
                                                    </div>
                                                    <div className="text-[10px] text-gray-400 font-bold tracking-widest uppercase">
                                                        {(booking.customer && typeof booking.customer === 'object') ? booking.customer.email : 'External Channel'}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Vehicle */}
                                        <td className="p-8 align-top">
                                            {booking.vehicle ? (
                                                <div className="space-y-1">
                                                    <div className="font-black text-navy text-sm tracking-tight">{booking.vehicle.brand}</div>
                                                    <div className="text-electric font-bold text-xs">{booking.vehicle.vehicleModel}</div>
                                                    <div className="flex items-center gap-1.5 text-[9px] text-gray-400 font-black uppercase tracking-widest pt-1">
                                                        <Zap className="w-3 h-3 text-gold" />
                                                        Asset ID: {booking.id.substring(0, 8)}
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2 text-red-500 bg-red-50 px-3 py-1.5 rounded-xl w-fit">
                                                    <AlertCircle className="w-4 h-4" />
                                                    <span className="text-[10px] font-black uppercase tracking-widest">Asset Retired</span>
                                                </div>
                                            )}
                                        </td>

                                        {/* Schedule */}
                                        <td className="p-8 align-top">
                                            <div className="flex items-center gap-6">
                                                <div className="flex flex-col gap-1.5">
                                                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Outbound</div>
                                                    <div className="font-black text-navy text-sm">{new Date(booking.startDate).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}</div>
                                                </div>
                                                <ChevronRight className="w-4 h-4 text-gray-200" />
                                                <div className="flex flex-col gap-1.5 text-right">
                                                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Inbound</div>
                                                    <div className="font-black text-navy text-sm">{new Date(booking.endDate).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}</div>
                                                </div>
                                            </div>
                                            <div className="mt-4 flex items-center gap-2 text-[10px] text-gray-400 font-bold bg-gray-50/50 p-2 rounded-xl border border-gray-100/50">
                                                <MapPin className="w-3 h-3 text-electric" />
                                                <span className="truncate max-w-[150px]">{booking.pickupLocation}</span>
                                            </div>
                                        </td>

                                        {/* Status */}
                                        <td className="p-8 align-top">
                                            <div className="flex flex-col gap-3 items-start">
                                                <Badge className={`px-4 py-1.5 text-[9px] font-black uppercase tracking-[0.2em] border shadow-sm rounded-full ${getStatusColor(booking.status)}`}>
                                                    {booking.status.replace('_', ' ')}
                                                </Badge>
                                                
                                                <div>
                                                    <div className="text-[9px] font-black text-gray-300 uppercase tracking-widest mb-0.5">Execution Value</div>
                                                    <div className="font-black text-xl text-navy leading-none">€{booking.totalPrice.toLocaleString()}</div>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Actions */}
                                        <td className="p-8 align-top text-right">
                                            <div className="flex justify-end gap-3 translate-x-2 group-hover:translate-x-0 transition-transform duration-500">
                                                {booking.status?.toLowerCase() === 'pending' ? (
                                                    <div className="flex gap-2">
                                                        <button 
                                                            className="h-12 px-6 rounded-2xl bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest shadow-xl shadow-emerald-500/20 hover:scale-105 active:scale-95 transition-all"
                                                            onClick={() => updateStatus(booking.id, 'confirmed')}
                                                        >
                                                            Authorize
                                                        </button>
                                                        <button 
                                                            className="h-12 w-12 rounded-2xl border border-red-100 text-red-500 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center"
                                                            onClick={() => updateStatus(booking.id, 'cancelled')}
                                                        >
                                                            <XCircle className="w-5 h-5" />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button className="h-12 w-12 rounded-2xl bg-gray-50 text-gray-400 hover:bg-navy hover:text-white transition-all flex items-center justify-center">
                                                         <MoreHorizontal className="w-5 h-5" />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                
                {/* Pagination */}
                <div className="bg-gray-50/50 p-8 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        Manifest Range: <span className="text-navy">{(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredBookings.length)}</span> of <span className="text-navy">{filteredBookings.length}</span> Records
                    </div>
                    
                    <Pagination 
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                </div>
            </div>

            {/* Strategy Context */}
             {!isLoading && filteredBookings.length > 0 && (
                <div className="bg-navy rounded-[3rem] p-12 text-white flex flex-col md:flex-row justify-between items-center gap-10 shadow-3xl shadow-navy/30 relative overflow-hidden group">
                    <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/[0.03] rounded-full blur-[100px] pointer-events-none group-hover:bg-white/[0.05] transition-all duration-1000"></div>
                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                        <div className="w-20 h-20 rounded-[2rem] bg-gold/10 flex items-center justify-center border border-gold/20 shrink-0">
                             <TrendingUp className="w-10 h-10 text-gold" />
                        </div>
                        <div>
                            <h4 className="text-3xl font-black mb-3 tracking-tight">Revenue <span className="text-gold">Acceleration</span></h4>
                            <p className="text-white/60 text-sm font-medium max-w-xl leading-relaxed">
                                Monitor your reservation load in real-time. High confirmation rates and optimal vehicle rotation are key indicators of a healthy fleet operation. 
                            </p>
                        </div>
                    </div>
                    <div className="relative z-10 flex gap-4 shrink-0">
                         <button className="h-14 px-10 rounded-2xl bg-white text-navy text-[11px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-white/5">
                            Insights Report
                         </button>
                    </div>
                </div>
             )}
        </div>
    );
}
