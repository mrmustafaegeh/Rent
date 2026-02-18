'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { 
    Check, 
    X, 
    Eye, 
    Info, 
    User, 
    Calendar, 
    Settings, 
    Gauge, 
    ShieldCheck, 
    Clock, 
    MapPin, 
    Fuel, 
    Zap,
    Briefcase,
    Activity,
    ChevronRight,
    SearchCheck
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Badge } from '@/components/ui/Badge';
import { toast } from 'react-hot-toast';

export default function ApprovalsList({ initialVehicles }: { initialVehicles: any[] }) {
    const [vehicles, setVehicles] = useState(initialVehicles);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        setVehicles(initialVehicles);
    }, [initialVehicles]);

    const handleAction = async (id: string, newStatus: 'approved' | 'rejected') => {
        if (newStatus === 'rejected' && !confirm('Are you sure you want to dismiss this listing?')) return;
        
        setActionLoading(id);
        try {
            const res = await fetch(`/api/vehicles/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus.toUpperCase() })
            });
            
            if (res.ok) {
                setVehicles(prev => prev.filter(v => v.id !== id));
                router.refresh();
                toast.success(`Listing ${newStatus === 'approved' ? 'authorized' : 'dismissed'} successfully`);
            } else {
                toast.error('Processing failed');
            }
        } catch (error) {
            console.error(error);
            toast.error('An unexpected error occurred');
        } finally {
            setActionLoading(null);
        }
    };

    if (vehicles.length === 0) {
        return (
            <div className="bg-white rounded-[3rem] p-32 text-center border border-dashed border-gray-200 shadow-sm flex flex-col items-center animate-in fade-in zoom-in duration-700">
                <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 mb-8 border border-emerald-100/50 shadow-inner">
                    <Check className="w-10 h-10" />
                </div>
                <h3 className="text-3xl font-black text-navy mb-3 tracking-tight">Queue Cleared</h3>
                <p className="text-gray-400 font-medium max-w-sm mx-auto">
                    There are no customer vehicle listings awaiting moderation at this stage.
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-8 animate-in slide-in-from-bottom-6 duration-700">
            {vehicles.map((vehicle) => (
                <div key={vehicle.id} className="group bg-white rounded-[3rem] border border-gray-100 shadow-[0_12px_45px_rgba(0,0,0,0.02)] hover:shadow-[0_25px_65px_rgba(0,0,0,0.06)] overflow-hidden flex flex-col lg:flex-row transition-all duration-500 relative">
                    
                    {/* Status Strip */}
                    <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-gold/30"></div>

                    {/* Image Section */}
                    <div className="relative w-full lg:w-[450px] h-72 lg:h-auto bg-gray-100 shrink-0 overflow-hidden">
                        <Image 
                            src={vehicle.images?.[0]?.url || '/images/car-placeholder.jpg'} 
                            alt={vehicle.vehicleModel || 'Car'}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
                        />
                        <div className="absolute top-6 left-6 flex gap-2">
                             <Badge className="bg-white/90 backdrop-blur text-navy border-none shadow-xl px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ring-1 ring-black/5">
                                {vehicle.category || 'Luxury'}
                            </Badge>
                            <Badge className="bg-gold text-navy border-none shadow-xl px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest">
                                {vehicle.condition || 'Pre-owned'}
                            </Badge>
                        </div>
                        <div className="absolute bottom-6 left-6 right-6 p-4 bg-navy/60 backdrop-blur-md rounded-2xl border border-white/10 text-white flex justify-between items-center opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                             <div className="flex items-center gap-2">
                                <Activity className="w-4 h-4 text-emerald-400" />
                                <span className="text-[10px] font-black uppercase tracking-widest leading-none mt-0.5">Ready for dispatch</span>
                             </div>
                             <ChevronRight className="w-4 h-4 text-white/40" />
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="flex-1 p-10 flex flex-col justify-between">
                        <div>
                            <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-8">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-gold"></div>
                                        <span className="text-xs font-black text-gray-400 uppercase tracking-[0.25em]">{vehicle.brand}</span>
                                    </div>
                                    <h3 className="text-4xl font-heading font-black text-navy tracking-tight leading-none">
                                        {vehicle.vehicleModel}
                                    </h3>
                                </div>
                                <div className="text-left md:text-right bg-gray-50/50 p-4 rounded-2xl border border-gray-100/50 min-w-[140px]">
                                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Valuation</div>
                                    <div className="text-3xl font-black text-navy leading-none">€{vehicle.salePrice?.toLocaleString()}</div>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                                <div className="flex flex-col gap-1.5 p-4 bg-gray-50/50 rounded-2xl border border-gray-100/30">
                                    <div className="w-7 h-7 rounded-lg bg-white shadow-sm flex items-center justify-center text-gold">
                                        <Calendar className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Production</p>
                                        <p className="text-sm font-black text-navy">{vehicle.year}</p>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1.5 p-4 bg-gray-50/50 rounded-2xl border border-gray-100/30">
                                    <div className="w-7 h-7 rounded-lg bg-white shadow-sm flex items-center justify-center text-gold">
                                        <Gauge className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Mileage</p>
                                        <p className="text-sm font-black text-navy">{vehicle.mileage?.toLocaleString()} <span className="text-[10px] opacity-40">KM</span></p>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1.5 p-4 bg-gray-50/50 rounded-2xl border border-gray-100/30">
                                    <div className="w-7 h-7 rounded-lg bg-white shadow-sm flex items-center justify-center text-gold">
                                        <Settings className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Gearbox</p>
                                        <p className="text-sm font-black text-navy">{vehicle.transmission}</p>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1.5 p-4 bg-gray-50/50 rounded-2xl border border-gray-100/30">
                                    <div className="w-7 h-7 rounded-lg bg-white shadow-sm flex items-center justify-center text-gold">
                                        <Fuel className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Engine</p>
                                        <p className="text-sm font-black text-navy capitalize">{vehicle.fuelType}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                                    <User className="w-3 h-3 text-navy/40" />
                                    <span>OWNER REF: {(vehicle.owner?.id || vehicle.ownerId || '').toString().substring(0, 12)}</span>
                                </div>
                                <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100 uppercase tracking-widest">
                                    <Clock className="w-3 h-3 text-navy/40" />
                                    <span>SUBMITTED: {new Date(vehicle.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>

                        {/* Impact Actions */}
                        <div className="flex flex-col md:flex-row gap-4 mt-10 pt-8 border-t border-gray-50">
                            <Link href={`/vehicles/${vehicle.id}`} target="_blank" className="flex-1">
                                <button className="w-full h-14 rounded-2xl border border-gray-100 text-gray-500 hover:border-gray-300 hover:text-navy transition-all flex items-center justify-center gap-2 text-[11px] font-black uppercase tracking-widest">
                                    <Eye className="w-4 h-4" /> Preview Listing
                                </button>
                            </Link>
                            
                            <div className="flex-1 flex gap-4">
                                <button 
                                    onClick={() => handleAction(vehicle.id, 'rejected')} 
                                    disabled={!!actionLoading}
                                    className="flex-1 h-14 rounded-2xl bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all flex items-center justify-center gap-2 text-[11px] font-black uppercase tracking-widest border border-transparent hover:border-red-100"
                                >
                                    <X className="w-4 h-4" /> Dismiss
                                </button>
                                <button 
                                    onClick={() => handleAction(vehicle.id, 'approved')}
                                    disabled={!!actionLoading}
                                    className="flex-2 h-14 rounded-2xl bg-emerald-500 text-white hover:bg-emerald-600 transition-all flex items-center justify-center gap-2 text-[11px] font-black uppercase tracking-widest shadow-xl shadow-emerald-500/20 px-8"
                                >
                                    <ShieldCheck className="w-5 h-5" /> AUTHORIZE LISTING
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
