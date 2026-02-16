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
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

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
                alert('Booking created successfully');
                // Refresh bookings
                const bRes = await fetch(`/api/admin/bookings?vehicleId=${vehicleId}`);
                const bData = await bRes.json();
                setBookings(bData.data || []);
            } else {
                alert(data.error || 'Failed to create booking');
            }
        } catch (error) {
            console.error('Error creating booking', error);
            alert('Something went wrong');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) return (
        <div className="flex h-[50vh] items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-navy"></div>
        </div>
    );
    
    if (!vehicle) return (
        <div className="flex flex-col items-center justify-center h-[50vh] text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
            <h3 className="text-xl font-bold text-navy">Vehicle Not Found</h3>
            <Link href="/dashboard/vehicles" className="mt-4 text-electric hover:underline">Return to Fleet</Link>
        </div>
    );

    return (
        <div className="space-y-8 pb-12 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/vehicles">
                        <Button variant="ghost" size="icon" className="rounded-full bg-white border border-gray-200 hover:border-navy hover:text-navy transition-all h-10 w-10">
                            <ChevronLeft className="w-5 h-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-heading font-black text-navy">{vehicle.brand} <span className="text-electric">{vehicle.vehicleModel}</span></h1>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mt-0.5">
                            <Badge variant="outline" className={`border-transparent px-0 font-bold ${vehicle.available ? 'text-emerald-500' : 'text-red-500'}`}>
                                <span className={`w-2 h-2 rounded-full mr-2 ${vehicle.available ? 'bg-emerald-500' : 'bg-red-500'}`} />
                                {vehicle.available ? 'Available for Rent' : 'Currently Unavailable'}
                            </Badge>
                            <span className="text-gray-300">•</span>
                            <span>{vehicle.plateNumber || 'No Plate #'}</span>
                        </div>
                    </div>
                </div>
                
                <Button 
                    onClick={() => setFormVisible(!formVisible)}
                    className={`${formVisible ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' : 'bg-navy text-gold hover:bg-navy/90 shadow-lg shadow-navy/20'} font-bold gap-2 transition-all rounded-xl h-11 px-6`}
                >
                    {formVisible ? <XCircle className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    {formVisible ? 'Cancel Booking' : 'Manual Booking'}
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form Column */}
                {formVisible && (
                    <div className="lg:col-span-1 bg-white p-6 rounded-3xl border border-gray-100 shadow-xl shadow-navy/5 h-fit sticky top-6 z-10 animate-in slide-in-from-right-4 duration-300">
                        <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-100">
                            <Calendar className="w-5 h-5 text-electric" />
                            <h2 className="text-lg font-bold text-navy">New Manual Booking</h2>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-4 bg-gray-50 p-4 rounded-xl border border-gray-100/50">
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Customer Details</h3>
                                <div>
                                    <Input required name="customerName" value={formData.customerName} onChange={handleInputChange} placeholder="Full Name" className="bg-white" />
                                </div>
                                <div>
                                    <Input required name="customerEmail" type="email" value={formData.customerEmail} onChange={handleInputChange} placeholder="Email Address" className="bg-white" />
                                </div>
                                <div>
                                    <Input name="customerPhone" value={formData.customerPhone} onChange={handleInputChange} placeholder="Phone Number" className="bg-white" />
                                </div>
                            </div>

                            <div className="space-y-4 bg-gray-50 p-4 rounded-xl border border-gray-100/50">
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Trip Details</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Start Date</label>
                                        <Input required type="date" name="startDate" value={formData.startDate} onChange={handleInputChange} className="bg-white text-xs" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">End Date</label>
                                        <Input required type="date" name="endDate" value={formData.endDate} onChange={handleInputChange} className="bg-white text-xs" />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <Input required name="pickupLocation" value={formData.pickupLocation} onChange={handleInputChange} placeholder="Pickup Location (e.g. Airport)" className="bg-white" />
                                    <Input required name="dropoffLocation" value={formData.dropoffLocation} onChange={handleInputChange} placeholder="Dropoff Location" className="bg-white" />
                                </div>
                            </div>

                            <div className="space-y-4 bg-gray-50 p-4 rounded-xl border border-gray-100/50">
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Payment</h3>
                                <div className="relative">
                                     <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <Input 
                                        type="number" 
                                        name="price" 
                                        value={formData.price} 
                                        onChange={handleInputChange} 
                                        placeholder="Total Price (Auto-calc if empty)" 
                                        className="bg-white pl-9" 
                                    />
                                </div>
                            </div>
                            
                            <Button type="submit" isLoading={isSubmitting} className="w-full bg-navy hover:bg-navy/90 text-gold font-bold h-12 rounded-xl shadow-lg shadow-navy/10 mt-2">
                                Confirm Booking
                            </Button>
                        </form>
                    </div>
                )}

                {/* Schedule List Column */}
                <div className={`space-y-6 ${formVisible ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-navy flex items-center gap-2">
                            <Clock className="w-5 h-5 text-gray-400" /> Upcoming Schedule
                        </h2>
                        <span className="text-sm font-bold text-gray-400 bg-gray-100 px-3 py-1 rounded-lg">
                            {bookings.length} Bookings
                        </span>
                    </div>

                    {bookings.length === 0 ? (
                        <div className="p-12 text-center border-2 border-dashed border-gray-200 rounded-3xl bg-gray-50/50">
                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                                <Calendar className="w-8 h-8 text-gray-300" />
                            </div>
                            <h3 className="text-lg font-bold text-navy">No bookings scheduled</h3>
                            <p className="text-gray-400 mt-1 max-w-sm mx-auto">This vehicle is free for the foreseeable future. Add a manual booking to block dates.</p>
                            {!formVisible && (
                                <Button onClick={() => setFormVisible(true)} variant="outline" className="mt-4 border-gray-300">
                                    Create Booking
                                </Button>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {bookings.map((booking: any) => (
                                <div key={booking._id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row gap-6 group">
                                     {/* Date Badge */}
                                     <div className="flex flex-row md:flex-col items-center justify-start md:justify-start gap-4 md:gap-2 min-w-[80px] md:border-r border-gray-100 md:pr-6 shrink-0">
                                         <div className="flex flex-col items-center justify-center bg-navy/5 w-16 h-16 rounded-xl text-navy group-hover:bg-navy group-hover:text-gold transition-colors shrink-0">
                                             <span className="text-xl font-black leading-none">{new Date(booking.startDate).getDate()}</span>
                                             <span className="text-[10px] uppercase font-bold tracking-wider opacity-70">
                                                 {new Date(booking.startDate).toLocaleString('default', { month: 'short' })}
                                             </span>
                                         </div>
                                         <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                                             booking.status === 'confirmed' ? 'bg-emerald-100 text-emerald-600' :
                                             booking.status === 'pending' ? 'bg-amber-100 text-amber-600' : 'bg-gray-100 text-gray-500'
                                         }`}>
                                             {booking.status}
                                         </span>
                                     </div>
                                     
                                     {/* Details */}
                                     <div className="flex-1 space-y-4 min-w-0">
                                         <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                                             <div className="flex-1 min-w-0">
                                                 <div className="flex flex-wrap items-center gap-2 mb-1">
                                                      <h3 className="font-bold text-navy text-lg truncate">
                                                        {(booking.customer && typeof booking.customer === 'object') ? `${booking.customer.firstName} ${booking.customer.lastName}` : (booking.customerName || 'Guest User')}
                                                      </h3>
                                                     {booking.customer?.phone && (
                                                         <span className="text-xs font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded-md flex items-center gap-1 whitespace-nowrap">
                                                             <Phone className="w-3 h-3" /> {booking.customer.phone}
                                                         </span>
                                                     )}
                                                 </div>
                                                  <p className="text-sm text-gray-500 font-medium flex items-center gap-1 truncate">
                                                      <User className="w-3.5 h-3.5 shrink-0" /> {(booking.customer && typeof booking.customer === 'object') ? booking.customer.email : (booking.customerEmail || 'No email')}
                                                  </p>
                                             </div>
                                             <div className="text-left sm:text-right shrink-0">
                                                 <span className="block text-2xl font-black text-navy">€{booking.totalPrice}</span>
                                                 <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400">Total</span>
                                             </div>
                                         </div>

                                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100/50">
                                             <div className="flex items-center gap-3 min-w-0">
                                                 <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center border border-gray-100 shadow-sm text-electric shrink-0">
                                                     <MapPin className="w-4 h-4" />
                                                 </div>
                                                 <div className="min-w-0">
                                                     <span className="text-[10px] uppercase font-bold text-gray-400 block">Pickup</span>
                                                     <span className="text-sm font-bold text-navy truncate block" title={booking.pickupLocation}>{booking.pickupLocation}</span>
                                                 </div>
                                             </div>
                                             <div className="flex items-center gap-3 min-w-0">
                                                 <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center border border-gray-100 shadow-sm text-orange shrink-0">
                                                     <MapPin className="w-4 h-4" />
                                                 </div>
                                                 <div className="min-w-0">
                                                     <span className="text-[10px] uppercase font-bold text-gray-400 block">Dropoff</span>
                                                     <span className="text-sm font-bold text-navy truncate block" title={booking.dropoffLocation}>{booking.dropoffLocation}</span>
                                                 </div>
                                             </div>
                                         </div>
                                     </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
