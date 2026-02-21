'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { 
    Clock, 
    MapPin, 
    Search, 
    XCircle, 
    Briefcase,
    ShieldCheck,
    CheckCircle2,
    Activity,
    Users,
    ChevronRight,
    AlertCircle
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface Booking {
    id: string;
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
                let filtered = data.data;
                if (filter === 'pending') {
                    filtered = data.data.filter((b: Booking) => 
                        b.status?.toLowerCase() === 'pending' || b.status?.toLowerCase() === 'pending_payment'
                    );
                }
                setBookings(filtered);
            } else {
                toast.error("Failed to fetch registry");
            }
        } catch (error) {
            console.error('Error fetching bookings:', error);
            toast.error("Network error sync");
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
        try {
            setConfirming(bookingId);
            const response = await fetch('/api/admin/bookings/confirm', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ bookingId }),
            });

            const data = await response.json();

            if (data.success) {
                toast.success('Booking authorized and client notified');
                fetchBookings(); 
            } else {
                toast.error(`Authorization failed: ${data.error}`);
            }
        } catch (error) {
            toast.error('Logistics execution error');
        } finally {
            setConfirming(null);
        }
    };

    const handleRejectBooking = async (bookingId: string) => {
        if (!confirm('Are you sure you want to cancel this booking?')) return;

        try {
            setConfirming(bookingId);
            const response = await fetch('/api/admin/bookings', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    id: bookingId,
                    status: 'cancelled'
                }),
            });

            const data = await response.json();

            if (data.success) {
                toast.success('Reservation cancelled');
                fetchBookings();
            } else {
                toast.error(`Action failed: ${data.error}`);
            }
        } catch (error) {
            toast.error('System error during cancellation');
        } finally {
            setConfirming(null);
        }
    };

    if (authLoading || !user) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-navy/10 border-t-navy rounded-full animate-spin"></div>
                    <p className="text-navy font-black text-[10px] uppercase tracking-widest opacity-40">Verifying Credentials</p>
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
        const s = status?.toLowerCase();
        switch (s) {
            case 'pending':
            case 'pending_payment':
                return 'bg-amber-50 text-amber-600 border-amber-100';
            case 'confirmed':
                return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            case 'in_progress':
                return 'bg-blue-50 text-blue-600 border-blue-100';
            case 'completed':
                return 'bg-gray-100 text-gray-400 border-gray-100';
            case 'cancelled':
                return 'bg-red-50 text-red-500 border-red-100';
            default:
                return 'bg-gray-50 text-gray-500 border-gray-100';
        }
    };

    const pendingCount = bookings.filter(b => 
        b.status?.toLowerCase() === 'pending' || b.status?.toLowerCase() === 'pending_payment'
    ).length;

    return (
        <div className="space-y-10 pb-20 w-full max-w-[1500px] mx-auto animate-in fade-in duration-700">
            {/* Premium Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                     <div className="flex items-center gap-2 text-[10px] font-black text-amber-500 uppercase tracking-[0.2em] mb-2 px-3 py-1 bg-amber-50 rounded-full w-fit border border-amber-100">
                        <Activity className="w-3 h-3" />
                        Awaiting Verification
                     </div>
                    <h1 className="text-4xl md:text-5xl font-heading font-black text-navy tracking-tight">
                        Booking <span className="text-gold">Authorizations</span>
                    </h1>
                    <p className="text-gray-500 mt-2 font-medium">
                        Review customer submissions and authorize vehicle release for the fleet.
                    </p>
                </div>
                
                <div className="flex bg-white p-1.5 rounded-2xl border border-gray-100 shadow-sm sm:w-auto w-full">
                    <button
                        onClick={() => setFilter('pending')}
                        className={`flex-1 sm:flex-none px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 ${
                            filter === 'pending'
                                ? 'bg-navy text-gold shadow-xl shadow-navy/20'
                                : 'text-gray-400 hover:text-navy hover:bg-gray-50'
                        }`}
                    >
                        Pending {pendingCount > 0 && <span className="w-5 h-5 rounded-full bg-gold text-navy flex items-center justify-center text-[10px]">{pendingCount}</span>}
                    </button>
                    <button
                        onClick={() => setFilter('all')}
                        className={`flex-1 sm:flex-none px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                            filter === 'all'
                                ? 'bg-navy text-gold shadow-xl shadow-navy/20'
                                : 'text-gray-400 hover:text-navy hover:bg-gray-50'
                        }`}
                    >
                        Registry History
                    </button>
                </div>
            </div>

            {/* Content Area */}
            {loading ? (
                <div className="flex h-[40vh] items-center justify-center">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-12 h-12 border-4 border-navy/10 border-t-navy rounded-full animate-spin"></div>
                        <p className="text-navy font-black text-[10px] uppercase tracking-widest opacity-40">Synchronizing global manifest</p>
                    </div>
                </div>
            ) : bookings.length === 0 ? (
                <div className="text-center py-32 bg-white rounded-[3rem] border border-gray-100 shadow-sm">
                    <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8 border border-gray-100">
                        <ShieldCheck className="w-10 h-10 text-gray-200" />
                    </div>
                    <h3 className="text-2xl font-black text-navy mb-3">All Clear</h3>
                    <p className="text-gray-500 max-w-sm mx-auto font-medium">
                        {filter === 'pending' 
                            ? "There are no pending authorizations in the current queue." 
                            : "The booking registry is currently empty."}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-8">
                    {bookings.map((booking) => (
                        <div
                            key={booking.id}
                            className="group bg-white rounded-[3rem] border border-gray-100 shadow-[0_12px_45px_rgba(0,0,0,0.02)] hover:shadow-[0_25px_60px_rgba(0,0,0,0.06)] transition-all duration-500 p-10 flex flex-col xl:flex-row gap-12 items-stretch overflow-hidden relative"
                        >
                            {/* Visual strip for status */}
                            <div className={`absolute top-0 right-0 w-32 h-32 blur-3xl opacity-10 pointer-events-none ${
                                booking.status?.toLowerCase() === 'pending' ? 'bg-amber-400' :
                                booking.status?.toLowerCase() === 'confirmed' ? 'bg-emerald-500' :
                                'bg-gray-400'
                            }`}></div>

                            {/* Section 1: Asset Identity */}
                            <div className="xl:w-1/3 flex flex-col justify-between space-y-8">
                                <div>
                                    <div className="flex items-center gap-4 mb-6">
                                        <span className="font-mono text-xs font-black text-navy bg-navy/5 px-3 py-1.5 rounded-xl border border-navy/5">
                                            #{booking.bookingNumber}
                                        </span>
                                        <Badge className={`px-4 py-1.5 text-[9px] font-black uppercase tracking-[0.2em] border shadow-sm rounded-full ${getStatusColor(booking.status)}`}>
                                            {booking.status?.replace('_', ' ')}
                                        </Badge>
                                    </div>
                                    <h3 className="text-4xl font-black text-navy tracking-tight leading-tight">
                                        {booking.vehicle?.brand} <span className="text-electric">{booking.vehicle?.vehicleModel}</span>
                                    </h3>
                                    <div className="flex items-center gap-2 text-[10px] font-black text-gray-300 uppercase tracking-widest mt-3">
                                        <Clock className="w-3.5 h-3.5" />
                                        Inbound: {new Date(booking.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </div>
                                </div>

                                <div className="bg-gray-50/50 p-8 rounded-[2rem] border border-gray-100/50 flex justify-between items-end">
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Total Value</p>
                                        <div className="text-3xl font-black text-navy leading-none">€{booking.totalPrice.toLocaleString()}</div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Status</p>
                                        <div className="text-[10px] font-black text-electric uppercase tracking-widest">{booking.paymentStatus}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Section 2: Logistics & Window */}
                            <div className="xl:w-1/3 flex flex-col justify-center bg-gray-50/30 p-10 rounded-[2.5rem] border border-gray-100">
                                <div className="space-y-12 relative">
                                    <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-gray-100"></div>
                                    
                                    <div className="relative pl-8">
                                        <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full border-4 border-white bg-navy shadow-sm z-10"></div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Operational Outbound</p>
                                        <div className="font-black text-navy text-lg">{formatDate(booking.startDate)}</div>
                                        <div className="flex items-center gap-2 text-xs font-bold text-gray-400 mt-2">
                                            <MapPin className="w-3.5 h-3.5 text-electric/50" /> {booking.pickupLocation}
                                        </div>
                                    </div>

                                    <div className="relative pl-8">
                                        <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full border-4 border-white bg-electric shadow-sm z-10"></div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Operational Inbound</p>
                                        <div className="font-black text-navy text-lg">{formatDate(booking.endDate)}</div>
                                        <div className="flex items-center gap-2 text-xs font-bold text-gray-400 mt-2">
                                            <MapPin className="w-3.5 h-3.5 text-gold/50" /> {booking.dropoffLocation}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Section 3: Customer Entity & Actions */}
                            <div className="xl:w-1/3 flex flex-col justify-between space-y-10">
                                <div className="bg-navy p-8 rounded-[2rem] text-white shadow-xl shadow-navy/20">
                                    <div className="flex items-center gap-5">
                                        <div className="w-14 h-14 rounded-2xl bg-white/10 text-gold flex items-center justify-center text-xl font-black border border-white/10">
                                            {booking.customer?.firstName?.[0] || 'G'}
                                        </div>
                                        <div>
                                            <div className="font-black text-lg tracking-tight">
                                                {booking.customer ? `${booking.customer.firstName} ${booking.customer.lastName}` : 'Guest User'}
                                            </div>
                                            <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest mt-1 italic">Authorized Entity</div>
                                        </div>
                                    </div>
                                    <div className="mt-6 pt-6 border-t border-white/5 space-y-2">
                                        <div className="flex justify-between items-center text-xs">
                                            <span className="text-white/40 font-bold uppercase tracking-widest text-[9px]">Interface</span>
                                            <span className="font-bold">{booking.customer?.email}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-xs">
                                            <span className="text-white/40 font-bold uppercase tracking-widest text-[9px]">Secure Line</span>
                                            <span className="font-bold">{booking.customer?.phone}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    {(booking.status?.toLowerCase() === 'pending' || booking.status?.toLowerCase() === 'pending_payment') ? (
                                        <>
                                            <button
                                                onClick={() => handleConfirmBooking(booking.id)}
                                                disabled={confirming === booking.id}
                                                className="flex-1 h-16 bg-navy hover:bg-gold text-white hover:text-navy px-8 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] transition-all shadow-2xl shadow-navy/20 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3 border-none group/btn"
                                            >
                                                {confirming === booking.id ? (
                                                    <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                                                ) : (
                                                    <>
                                                        AUTHORIZE RELEASE
                                                        <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                                    </>
                                                )}
                                            </button>
                                            <button
                                                onClick={() => handleRejectBooking(booking.id)}
                                                disabled={confirming === booking.id}
                                                className="w-16 h-16 bg-gray-50 hover:bg-red-50 text-gray-300 hover:text-red-500 rounded-2xl transition-all flex items-center justify-center flex-shrink-0 border border-gray-100 hover:border-red-100"
                                            >
                                                <XCircle className="w-6 h-6" />
                                            </button>
                                        </>
                                    ) : (
                                         <div className="w-full h-16 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-center gap-3">
                                            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Operation Finalized</span>
                                         </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            
            {/* Context Awareness Component */}
            <div className="bg-navy rounded-[3rem] p-12 text-white relative overflow-hidden flex flex-col xl:flex-row items-center justify-between gap-12 group">
                <div className="absolute top-0 right-0 w-96 h-96 bg-electric/10 rounded-full blur-[100px] pointer-events-none group-hover:bg-electric/20 transition-all duration-1000"></div>
                <div className="flex flex-col md:flex-row items-center gap-8 relative z-10 text-center md:text-left">
                    <div className="w-20 h-20 rounded-[2rem] bg-white/10 flex items-center justify-center border border-white/10 shrink-0">
                         <ShieldCheck className="w-10 h-10 text-gold" />
                    </div>
                    <div>
                        <h4 className="text-3xl font-black mb-3 tracking-tight">Curation <span className="text-gold">Philosophy</span></h4>
                        <p className="text-white/60 text-sm font-medium max-w-xl leading-relaxed">
                            Every authorization is a commitment to quality. Ensure customer documentation is valid and insurance coverage is active before releasing premium assets.
                        </p>
                    </div>
                </div>
                <button className="h-14 px-10 rounded-2xl bg-white text-navy text-[11px] font-black uppercase tracking-widest hover:scale-[1.03] duration-500 ease-out will-change-transform active:scale-95 transition-all shadow-xl shadow-white/5 relative z-10 shrink-0">
                    Compliance Docs
                </button>
            </div>
        </div>
    );
}
