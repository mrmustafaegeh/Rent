'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import Image from 'next/image';
import { 
    Calendar, 
    MapPin, 
    ArrowRight, 
    Download, 
    PartyPopper, 
    CheckCircle2, 
    Activity, 
    Clock, 
    Zap, 
    TrendingUp,
    ShieldCheck,
    ChevronRight,
    SearchX,
    Filter,
    Users
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { ReviewDialog } from '@/components/features/ReviewDialog';
import { useSearchParams } from 'next/navigation';
import { toast } from 'react-hot-toast';

interface Booking {
    id: string;
    bookingNumber: string;
    vehicle: {
        id: string;
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
    reviews: { id: string }[];
}

export default function MyBookingsPage() {
    const { isAuthenticated, isLoading: authLoading } = useAuth();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const searchParams = useSearchParams();
    const showSuccess = searchParams.get('success') === 'true';

    const handleDownloadContract = async (bookingId: string, bookingNumber: string) => {
        const toastId = toast.loading('Generating legal documentation...');
        try {
            const res = await fetch(`/api/bookings/${bookingId}/contract`);
            if (!res.ok) throw new Error('Download failed');
            
            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Registry-Manifest-${bookingNumber}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            toast.success('Contract manifestation complete', { id: toastId });
        } catch (error) {
            console.error('Error downloading contract:', error);
            toast.error('Logistics execution error', { id: toastId });
        }
    };

    useEffect(() => {
        const fetchBookings = async () => {
            if (isAuthenticated) {
                try {
                    const res = await fetch('/api/bookings'); 
                    if (res.ok) {
                        const data = await res.json();
                        if (data.success) {
                            setBookings(data.data || []);
                        }
                    }
                } catch (error) {
                    console.error("Error fetching bookings", error);
                    toast.error("Telemetry sync failed");
                } finally {
                    setIsLoading(false);
                }
            } else if (!authLoading) {
                setIsLoading(false); 
            }
        };

        if(!authLoading) fetchBookings();
    }, [isAuthenticated, authLoading]);

    const stats = useMemo(() => ({
        total: bookings.length,
        upcoming: bookings.filter(b => b.status?.toLowerCase() === 'confirmed' || b.status?.toLowerCase() === 'pending').length,
        active: bookings.filter(b => b.status?.toLowerCase() === 'in_progress').length,
        value: bookings.reduce((acc, b) => acc + (b.totalPrice || 0), 0)
    }), [bookings]);

    if (authLoading || isLoading) {
        return (
            <div className="flex h-[70vh] items-center justify-center">
                 <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-navy/10 border-t-navy rounded-full animate-spin"></div>
                    <p className="text-navy font-black text-[10px] uppercase tracking-widest opacity-40">Syncing Reservation Registry</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-12 pb-20 w-full max-w-[1500px] mx-auto animate-in fade-in duration-700">
            {showSuccess && (
                <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-emerald-500/20 mb-8 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700" />
                    <div className="relative z-10 flex flex-col xl:flex-row items-center gap-8">
                        <div className="w-20 h-20 bg-white/20 backdrop-blur-xl rounded-3xl flex items-center justify-center shrink-0 border border-white/20">
                            <PartyPopper className="w-10 h-10 text-white animate-bounce" />
                        </div>
                        <div className="text-center xl:text-left">
                            <h2 className="text-3xl font-black tracking-tight mb-2">Operational Confirmation!</h2>
                            <p className="text-emerald-50 text-base font-medium opacity-90 max-w-xl">Your luxury fleet allocation has been secured. Our logistics team is now preparing your vehicle for deployment. Manifest details sent to encrypted mail.</p>
                        </div>
                        <div className="xl:ml-auto">
                            <Button className="bg-white text-emerald-600 hover:bg-emerald-50 font-black px-10 rounded-2xl h-14 shadow-xl hover:shadow-emerald-500/40 transition-all border-none active:scale-95">
                                <CheckCircle2 className="w-5 h-5 mr-3" /> DISMISS MANIFEST
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Premium Header */}
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-8">
                <div>
                     <div className="flex items-center gap-2 text-[10px] font-black text-electric uppercase tracking-[0.2em] mb-2 px-3 py-1 bg-electric/5 rounded-full w-fit border border-electric/10">
                        <Activity className="w-3 h-3" />
                        Client Registry
                     </div>
                    <h1 className="text-4xl md:text-5xl font-heading font-black text-navy tracking-tight">
                        My <span className="text-electric">Reservations</span>
                    </h1>
                    <p className="text-gray-500 mt-2 font-medium">
                        Monitor scheduled deployments, operational windows, and logistics manifests.
                    </p>
                </div>
                
                <div className="flex flex-wrap gap-4 w-full xl:w-auto">
                    {[
                        { label: 'Total Operations', value: stats.total, icon: Users, color: 'text-navy' },
                        { label: 'Awaiting Deployment', value: stats.upcoming, icon: Clock, color: 'text-amber-600' },
                        { label: 'Manifest Value', value: `€${stats.value.toLocaleString()}`, icon: TrendingUp, color: 'text-emerald-600' },
                    ].map((s, i) => (
                        <div key={i} className="flex-1 min-w-[160px] bg-white px-6 py-4 rounded-2xl border border-gray-100 shadow-sm">
                            <div className="flex items-center justify-between mb-2">
                                <Activity className={`w-4 h-4 ${s.color} opacity-40`} />
                                <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest">{s.label}</span>
                            </div>
                            <div className="text-xl font-black text-navy leading-none">{s.value}</div>
                        </div>
                    ))}
                    <Link href="/cars" className="shrink-0 flex items-center justify-center h-16 w-16 bg-navy text-gold rounded-2xl shadow-xl shadow-navy/20 hover:bg-electric hover:text-white transition-all active:scale-95">
                        <Zap className="w-6 h-6" />
                    </Link>
                </div>
            </div>

            {bookings.length === 0 ? (
                <div className="p-40 text-center bg-white rounded-[4rem] border-2 border-dashed border-gray-100 flex flex-col items-center">
                    <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-10 shadow-inner">
                        <Calendar className="w-10 h-10 text-gray-200" />
                    </div>
                    <h3 className="text-3xl font-black text-navy mb-4 tracking-tight leading-none text-center">Empty Registry Manifest</h3>
                    <p className="text-gray-400 mb-10 max-w-sm mx-auto font-medium text-lg text-center leading-relaxed">No active fleet allocations found in your history. Initiate a new deployment to start your journey.</p>
                    <Link href="/cars">
                        <Button className="bg-navy text-gold hover:bg-gold hover:text-navy font-black px-12 rounded-2xl h-16 shadow-2xl shadow-navy/20 transition-all active:scale-95 border-none text-[11px] uppercase tracking-[0.2em] gap-3">
                            ALLOCATE ASSET <ArrowRight className="w-4 h-4" />
                        </Button>
                    </Link>
                </div>
            ) : (
                <div className="grid gap-10">
                    <div className="flex items-center gap-3 ml-2">
                         <div className="h-0.5 w-8 bg-gold rounded-full opacity-50"></div>
                         <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Deployment Timeline</h3>
                    </div>
                    {bookings.map((booking) => (
                        <div key={booking.id} className="group bg-white p-10 rounded-[3rem] border border-gray-100 shadow-[0_15px_50px_rgba(0,0,0,0.02)] hover:shadow-[0_40px_100px_rgba(0,0,0,0.06)] transition-all duration-700 flex flex-col xl:flex-row gap-12 items-center relative overflow-hidden">
                            {/* Decorative Grid Pattern */}
                            <div className="absolute inset-0 pattern-grid opacity-[0.2] pointer-events-none"></div>
                            
                            {/* Visual Asset Container */}
                            <div className="w-full xl:w-96 aspect-[16/10] bg-gray-50 rounded-[2.5rem] overflow-hidden relative flex-shrink-0 border border-gray-200/50 shadow-2xl shadow-gray-200/50 group-hover:scale-[1.02] transition-transform duration-1000">
                                <Image 
                                   src={booking.vehicle?.images?.[0]?.url || '/images/car-placeholder.jpg'} 
                                   alt={booking.vehicle?.brand || 'Asset'} 
                                   fill
                                   className="object-cover group-hover:scale-110 transition-transform duration-1000"
                                />
                                <div className="absolute top-6 left-6 flex flex-col gap-3">
                                    <Badge className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border border-white/20 shadow-2xl backdrop-blur-md ${
                                        booking.status?.toLowerCase() === 'confirmed' ? 'bg-emerald-500/80 text-white' :
                                        booking.status?.toLowerCase() === 'pending' ? 'bg-amber-500/80 text-white' : 
                                        'bg-navy/80 text-white'
                                    }`}>
                                        {booking.status?.replace('_', ' ')}
                                    </Badge>
                                </div>
                            </div>
                            
                            {/* Operational Intelligence */}
                            <div className="flex-1 w-full space-y-10 relative z-10">
                                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                                    <div>
                                        <div className="flex items-center gap-3 mb-3">
                                             <span className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">REF: {booking.bookingNumber}</span>
                                             <div className="w-1 h-1 bg-gray-200 rounded-full"></div>
                                             <span className="text-[10px] font-black text-electric uppercase tracking-[0.2em]">Verified Transaction</span>
                                        </div>
                                        <h3 className="font-heading font-black text-4xl text-navy transition-colors group-hover:text-electric duration-500">
                                            {booking.vehicle?.brand} <span className="text-electric opacity-40 group-hover:opacity-100 transition-opacity duration-500">{booking.vehicle?.vehicleModel}</span>
                                        </h3>
                                    </div>
                                    <div className="text-left md:text-right bg-gray-50/50 px-8 py-5 rounded-3xl border border-gray-100">
                                        <p className="text-[10px] text-gray-300 font-black uppercase tracking-[0.2em] mb-1">Contract Total</p>
                                        <p className="text-4xl font-black text-navy">€{booking.totalPrice?.toLocaleString()}</p>
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3 text-gray-300 text-[10px] font-black uppercase tracking-[0.2em]">
                                            <Calendar className="w-4 h-4" /> Temporal Window
                                        </div>
                                        <div className="flex items-center gap-6 bg-gray-50/50 p-6 rounded-2xl border border-gray-100/50">
                                            <div className="flex-1 text-center">
                                                 <span className="block text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">OUTBOUND</span>
                                                 <span className="font-black text-navy text-sm">{new Date(booking.startDate).toLocaleDateString()}</span>
                                            </div>
                                            <ArrowRight className="w-5 h-5 text-gray-200" />
                                            <div className="flex-1 text-center">
                                                 <span className="block text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">INBOUND</span>
                                                 <span className="font-black text-navy text-sm">{new Date(booking.endDate).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3 text-gray-300 text-[10px] font-black uppercase tracking-[0.2em]">
                                            <MapPin className="w-4 h-4" /> Operational Locations
                                        </div>
                                        <div className="flex items-center gap-6 bg-gray-50/50 p-6 rounded-2xl border border-gray-100/50">
                                            <div className="flex-1">
                                                 <span className="block text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">RELEASE</span>
                                                 <span className="font-black text-navy text-sm truncate block" title={booking.pickupLocation}>{booking.pickupLocation}</span>
                                            </div>
                                            <ArrowRight className="w-5 h-5 text-gray-200" />
                                            <div className="flex-1 text-right">
                                                 <span className="block text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">FINALIZATION</span>
                                                 <span className="font-black text-navy text-sm truncate block" title={booking.dropoffLocation}>{booking.dropoffLocation}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Logistics Control Panel */}
                                <div className="flex flex-wrap items-center gap-4 pt-6 mt-6 border-t border-gray-100">
                                     <button className="h-16 px-10 rounded-2xl bg-navy text-gold text-[11px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-navy/20 hover:bg-electric hover:text-white transition-all active:scale-95 flex items-center gap-3 flex-1 md:flex-none">
                                         MANAGEMENT <ChevronRight className="w-4 h-4" />
                                     </button>
                                     <button 
                                        onClick={() => handleDownloadContract(booking.id, booking.bookingNumber)}
                                        className="h-16 px-8 rounded-2xl bg-white border border-gray-100 text-gray-400 hover:text-navy hover:border-navy text-[11px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-3 active:scale-95"
                                     >
                                         <Download className="w-4 h-4 text-electric" /> SIGNED MANIFEST
                                     </button>
                                     
                                      <div className="xl:ml-auto flex items-center gap-6 mt-4 xl:mt-0">
                                          {(booking.status?.toLowerCase() === 'completed' || booking.status?.toLowerCase() === 'confirmed') && (
                                              <ReviewDialog 
                                                  bookingId={booking.id}
                                                  vehicleId={booking.vehicle.id}
                                                  vehicleName={`${booking.vehicle.brand} ${booking.vehicle.vehicleModel}`}
                                                  existingReview={booking.reviews && booking.reviews.length > 0}
                                              />
                                          )}
                                          <button className="text-[10px] font-black text-gray-300 hover:text-red-500 uppercase tracking-widest transition-colors flex items-center gap-2">
                                              TERMINATE CONTRACT
                                          </button>
                                      </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Strategic Value Context */}
            <div className="bg-navy rounded-[3rem] p-12 text-white relative overflow-hidden flex flex-col xl:flex-row items-center justify-between gap-12 group">
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/[0.03] rounded-full blur-[100px] pointer-events-none group-hover:bg-white/[0.05] transition-all duration-1000"></div>
                <div className="flex flex-col md:flex-row items-center gap-8 relative z-10 text-center md:text-left">
                    <div className="w-20 h-20 rounded-[2rem] bg-gold/10 flex items-center justify-center border border-gold/20 shrink-0">
                         <ShieldCheck className="w-10 h-10 text-gold" />
                    </div>
                    <div>
                        <h4 className="text-3xl font-black mb-3 tracking-tight">Ecosystem <span className="text-gold">Sovereignty</span></h4>
                        <p className="text-white/60 text-sm font-medium max-w-xl leading-relaxed">
                            Every reservation is a commitment to operational excellence. Monitor your lifecycle metrics to ensure peak resource efficiency and fleet longevity.
                        </p>
                    </div>
                </div>
                <button className="h-14 px-10 rounded-2xl bg-white text-navy text-[11px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-white/5 relative z-10 shrink-0">
                    Insights Report
                </button>
            </div>
        </div>
    );
}
