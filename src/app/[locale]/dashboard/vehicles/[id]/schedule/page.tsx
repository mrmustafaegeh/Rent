'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input'; 
import { useAuth } from '@/context/AuthContext';
import { 
    ChevronLeft, 
    Calendar, 
    User, 
    Phone, 
    MapPin, 
    Clock, 
    CheckCircle,
    XCircle,
    AlertCircle,
    DollarSign,
    Plus,
    Activity,
    ShieldCheck,
    Zap,
    ArrowRight,
    TrendingUp,
    Briefcase
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { VehicleCalendar } from '@/components/dashboard/VehicleCalendar';
import { toast } from 'react-hot-toast';

export default function VehicleSchedulePage() {
    const { user } = useAuth();
    const params = useParams();
    const vehicleId = params.id as string;
    
    // Separate state for vehicle and bookings
    const [vehicle, setVehicle] = useState<any>(null);
    const [bookings, setBookings] = useState<any[]>([]);
    
    // UI State
    const [isLoading, setIsLoading] = useState(true);
    const [formVisible, setFormVisible] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form data
    const [formData, setFormData] = useState({
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        startDate: '',
        endDate: '',
        pickupLocation: '',
        dropoffLocation: '',
        price: ''
    });

    useEffect(() => {
        if (!vehicleId) return;

        const fetchData = async () => {
            try {
                // Fetch Vehicle
                const vRes = await fetch(`/api/vehicles/${vehicleId}`);
                const vData = await vRes.json();
                setVehicle(vData);

                // Fetch Bookings
                if (user) {
                    const bRes = await fetch(`/api/admin/bookings?vehicleId=${vehicleId}`);
                    const bData = await bRes.json();
                    if (bData.success) {
                        setBookings(bData.data);
                    }
                }
            } catch (error) {
                console.error('Error fetching data', error);
                toast.error("Failed to sync fleet data");
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [vehicleId, user]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const res = await fetch('/api/admin/bookings', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...formData,
                    vehicleId
                })
            });
            const data = await res.json();
            
            if (data.success) {
                setFormVisible(false);
                setFormData({
                    customerName: '',
                    customerEmail: '',
                    customerPhone: '',
                    startDate: '',
                    endDate: '',
                    pickupLocation: '',
                    dropoffLocation: '',
                    price: ''
                });
                toast.success('Manual reservation finalized');
                // Refresh bookings
                const bRes = await fetch(`/api/admin/bookings?vehicleId=${vehicleId}`);
                const bData = await bRes.json();
                setBookings(bData.data || []);
            } else {
                toast.error(data.error || 'Execution failed');
            }
        } catch (error) {
            console.error('Error creating booking', error);
            toast.error('Logistics system error');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) return (
        <div className="flex h-[60vh] items-center justify-center">
             <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-navy/10 border-t-navy rounded-full animate-spin"></div>
                <p className="text-navy font-black text-[10px] uppercase tracking-widest opacity-40">Accessing asset timeline</p>
            </div>
        </div>
    );
    
    if (!vehicle) return (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center">
            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6">
                <AlertCircle className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-black text-navy mb-2 tracking-tight">Asset Not Located</h3>
            <p className="text-gray-400 font-medium mb-8">The requested vehicle record could not be found in the registry.</p>
            <Link href="/dashboard/vehicles">
                <Button className="bg-navy text-gold font-black rounded-xl px-8 h-12 gap-2">
                    <ChevronLeft className="w-4 h-4" /> Return to Fleet
                </Button>
            </Link>
        </div>
    );

    return (
        <div className="space-y-12 pb-20 w-full max-w-[1500px] mx-auto animate-in fade-in duration-700">
            {/* Premium Header */}
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-8">
                <div className="flex items-center gap-6">
                    <Link href="/dashboard/vehicles">
                        <button className="h-14 w-14 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:border-navy hover:text-navy transition-all shadow-sm">
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                    </Link>
                    <div>
                         <div className="flex items-center gap-2 text-[10px] font-black text-electric uppercase tracking-[0.2em] mb-2 px-3 py-1 bg-electric/5 rounded-full w-fit border border-electric/10">
                            <Activity className="w-3 h-3" />
                            Operational Schedule
                        </div>
                        <h1 className="text-4xl md:text-5xl font-heading font-black text-navy tracking-tight">
                            {vehicle.brand} <span className="text-electric">{vehicle.vehicleModel}</span>
                        </h1>
                        <div className="flex items-center gap-3 mt-3">
                             <Badge className={`px-3 py-1 text-[9px] font-black uppercase tracking-widest border shadow-sm rounded-full ${vehicle.available ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-500 border-red-100'}`}>
                                <span className={`w-1.5 h-1.5 rounded-full mr-2 ${vehicle.available ? 'bg-emerald-500' : 'bg-red-500'}`} />
                                {vehicle.available ? 'Status: Active' : 'Status: Out of Service'}
                            </Badge>
                            <span className="text-gray-300 font-bold">•</span>
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 px-3 py-1 rounded-full border border-gray-100">PLATFORM REF: {vehicle.plateNumber || 'TBA'}</span>
                        </div>
                    </div>
                </div>
                
                <button 
                    onClick={() => setFormVisible(!formVisible)}
                    className={`h-16 px-10 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-4 ${formVisible ? 'bg-white text-navy border border-navy shadow-none' : 'bg-navy text-gold shadow-2xl shadow-navy/20 active:scale-95'}`}
                >
                    {formVisible ? <XCircle className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                    {formVisible ? 'ABORT CREATION' : 'OVERRIDE SCHEDULE'}
                </button>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 items-start">
                {/* Form Column */}
                {formVisible && (
                    <div className="xl:col-span-4 bg-white p-10 rounded-[3rem] border border-gray-100 shadow-[0_25px_60px_rgba(0,0,0,0.05)] h-fit sticky top-6 z-10 animate-in slide-in-from-right-10 fade-in duration-500">
                        <div className="flex items-center gap-4 mb-10">
                            <div className="w-12 h-12 rounded-2xl bg-electric/10 text-electric flex items-center justify-center">
                                <Plus className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-navy leading-none mb-1.5">Manual Override</h2>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Administrative Booking Entry</p>
                            </div>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="space-y-4">
                                <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">IDENTITY PROFILE</p>
                                <div className="space-y-4">
                                    <Input required name="customerName" value={formData.customerName} onChange={handleInputChange} placeholder="Full Registered Name" className="h-14 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:border-gray-100 font-bold text-navy" />
                                    <Input required name="customerEmail" type="email" value={formData.customerEmail} onChange={handleInputChange} placeholder="Email Identifier" className="h-14 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:border-gray-100 font-bold text-navy" />
                                    <Input name="customerPhone" value={formData.customerPhone} onChange={handleInputChange} placeholder="Primary Phone Secure Line" className="h-14 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:border-gray-100 font-bold text-navy" />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">LOGISTICS WINDOW</p>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block ml-1">OUTBOUND</label>
                                        <Input required type="date" name="startDate" value={formData.startDate} onChange={handleInputChange} className="h-14 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:border-gray-100 font-bold text-navy text-xs" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block ml-1">INBOUND</label>
                                        <Input required type="date" name="endDate" value={formData.endDate} onChange={handleInputChange} className="h-14 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:border-gray-100 font-bold text-navy text-xs" />
                                    </div>
                                </div>
                                <div className="space-y-4 mt-2">
                                    <Input required name="pickupLocation" value={formData.pickupLocation} onChange={handleInputChange} placeholder="Initial Release Location" className="h-14 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:border-gray-100 font-bold text-navy" />
                                    <Input required name="dropoffLocation" value={formData.dropoffLocation} onChange={handleInputChange} placeholder="Return Finalization Point" className="h-14 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:border-gray-100 font-bold text-navy" />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">CONTRACT VALUE</p>
                                <div className="relative">
                                     <DollarSign className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <Input 
                                        type="number" 
                                        name="price" 
                                        value={formData.price} 
                                        onChange={handleInputChange} 
                                        placeholder="Authorized Lifecycle Price" 
                                        className="h-14 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:border-gray-100 font-bold text-navy pl-12" 
                                    />
                                </div>
                            </div>
                            
                            <button 
                                type="submit" 
                                disabled={isSubmitting}
                                className="w-full h-16 bg-navy hover:bg-gold text-white hover:text-navy font-black text-[11px] uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-navy/20 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3 mt-4"
                            >
                                {isSubmitting ? (
                                    <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    <>
                                        EXECUTE RESERVATION
                                        <ArrowRight className="w-4 h-4" />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                )}

                {/* Schedule Column */}
                <div className={`space-y-10 ${formVisible ? 'xl:col-span-8' : 'xl:col-span-12'}`}>
                    <div className="flex items-center justify-between bg-white px-8 py-6 rounded-3xl border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-[1rem] bg-gray-100 text-gray-400 flex items-center justify-center">
                                <Calendar className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-navy leading-none mb-1">Fleet Occupancy</h2>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest italic">Temporal Visibility Map</p>
                            </div>
                        </div>
                        <div className="flex flex-col items-end">
                            <span className="text-2xl font-black text-navy">{bookings.length}</span>
                            <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest">Active Contracts</span>
                        </div>
                    </div>

                    <div className="space-y-12">
                        {/* Calendar View */}
                        <div className="bg-white p-1 rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden">
                             <VehicleCalendar bookings={bookings} />
                        </div>

                        {bookings.length === 0 ? (
                            <div className="p-32 text-center border-2 border-dashed border-gray-100 rounded-[4rem] bg-gray-50/50 flex flex-col items-center">
                                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-10 shadow-[0_12px_30px_rgba(0,0,0,0.03)]">
                                    <ShieldCheck className="w-10 h-10 text-gray-200" />
                                </div>
                                <h3 className="text-3xl font-black text-navy mb-4 tracking-tight leading-none">Un-allocated Resource</h3>
                                <p className="text-gray-400 mt-1 max-w-sm mx-auto font-medium text-lg leading-relaxed">This asset is currently sitting in idle rotation. Initiate a manual booking to mark out-of-service dates.</p>
                            </div>
                        ) : (
                            <div className="space-y-8">
                                <div className="flex items-center gap-3 ml-2">
                                     <div className="h-0.5 w-8 bg-gold rounded-full opacity-50"></div>
                                     <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Operational Timeline</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {bookings.map((booking: any) => (
                                        <div key={booking.id} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-[0_10px_35px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] transition-all duration-500 flex flex-col gap-8 group relative overflow-hidden">
                                             <div className="absolute top-0 right-0 w-24 h-24 bg-navy/5 -translate-y-1/2 translate-x-1/2 rounded-full blur-2xl"></div>
                                             
                                             <div className="flex items-center justify-between relative z-10">
                                                 <div className="flex items-center gap-4">
                                                     <div className="w-14 h-14 rounded-[1.25rem] bg-navy flex flex-col items-center justify-center text-white group-hover:bg-gold group-hover:text-navy transition-all duration-500 shadow-lg shadow-navy/10">
                                                         <span className="text-2xl font-black leading-none">{new Date(booking.startDate).getDate()}</span>
                                                         <span className="text-[9px] uppercase font-black tracking-widest opacity-60">
                                                             {new Date(booking.startDate).toLocaleString('default', { month: 'short' })}
                                                         </span>
                                                     </div>
                                                     <div>
                                                          <h4 className="font-black text-navy text-lg leading-tight mb-1">
                                                            {(booking.customer && typeof booking.customer === 'object') ? `${booking.customer.name || 'Guest'}` : (booking.customerName || 'External Client')}
                                                          </h4>
                                                           <p className="text-[10px] text-gray-400 font-bold flex items-center gap-1.5 uppercase tracking-widest">
                                                              <Clock className="w-3 h-3 text-gold" /> Scheduled Operation
                                                          </p>
                                                     </div>
                                                 </div>
                                                 <Badge className={`px-3 py-1 text-[8px] font-black tracking-widest border shadow-none rounded-full ${
                                                     booking.status?.toLowerCase() === 'confirmed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                                     booking.status?.toLowerCase() === 'pending' ? 'bg-amber-50 text-amber-600 border-amber-100' : 
                                                     booking.status?.toLowerCase() === 'in_progress' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                                     'bg-gray-50 text-gray-500 border-gray-100'
                                                 }`}>
                                                     {booking.status}
                                                 </Badge>
                                             </div>
                                             
                                             <div className="flex justify-between items-center bg-gray-50/50 p-6 rounded-2xl border border-gray-100/50">
                                                 <div className="space-y-1">
                                                      <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest block">Operational Window</span>
                                                      <span className="text-xs font-black text-navy flex items-center gap-2">
                                                          {new Date(booking.startDate).toLocaleDateString()} <ArrowRight className="w-3 h-3 text-gray-200" /> {new Date(booking.endDate).toLocaleDateString()}
                                                      </span>
                                                 </div>
                                                 <div className="text-right">
                                                      <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest block">Contract Total</span>
                                                      <span className="text-xl font-black text-navy">€{booking.totalPrice.toLocaleString()}</span>
                                                 </div>
                                             </div>

                                             <div className="flex items-center gap-6">
                                                 <div className="flex-1 min-w-0">
                                                      <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold mb-1 uppercase tracking-widest">
                                                          <MapPin className="w-3.5 h-3.5 text-electric/40" /> Release Point
                                                      </div>
                                                      <span className="text-xs font-black text-navy truncate block" title={booking.pickupLocation}>{booking.pickupLocation}</span>
                                                 </div>
                                                 <div className="flex-1 min-w-0">
                                                      <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold mb-1 uppercase tracking-widest">
                                                          <MapPin className="w-3.5 h-3.5 text-gold/40" /> Finalization
                                                      </div>
                                                      <span className="text-xs font-black text-navy truncate block" title={booking.dropoffLocation}>{booking.dropoffLocation}</span>
                                                 </div>
                                             </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Strategic Footer Context */}
            <div className="bg-navy rounded-[3rem] p-12 text-white relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-10 shadow-3xl shadow-navy/30 group">
                <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/[0.03] rounded-full blur-[100px] pointer-events-none group-hover:bg-white/[0.05] transition-all duration-1000"></div>
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                    <div className="w-20 h-20 rounded-[2rem] bg-gold/10 flex items-center justify-center border border-gold/20 shrink-0">
                         <TrendingUp className="w-10 h-10 text-gold" />
                    </div>
                    <div>
                        <h4 className="text-3xl font-black mb-3 tracking-tight">Yield <span className="text-gold">Optimization</span></h4>
                        <p className="text-white/60 text-sm font-medium max-w-xl leading-relaxed">
                            Maximized resource utilization drives exponential fleet performance. Ensure low turnover gaps and proactive maintenance scheduling to maintain premium service levels. 
                        </p>
                    </div>
                </div>
                <div className="relative z-10 flex gap-4 shrink-0">
                     <button className="h-14 px-10 rounded-2xl bg-white text-navy text-[11px] font-black uppercase tracking-widest hover:scale-[1.03] duration-500 ease-out will-change-transform active:scale-95 transition-all shadow-xl shadow-white/5">
                        Performance Analytics
                     </button>
                </div>
            </div>
        </div>
    );
}
