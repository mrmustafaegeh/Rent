'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/context/AuthContext';
import { ChevronLeft, Calendar, User, Phone, MapPin } from 'lucide-react';

export default function VehicleSchedulePage() {
    const { user } = useAuth();
    const params = useParams();
    const vehicleId = params.id as string;
    
    const [vehicle, setVehicle] = useState<any>(null);
    const [bookings, setBookings] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [formVisible, setFormVisible] = useState(false);

    // Form State
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
                const bRes = await fetch(`/api/admin/bookings?vehicleId=${vehicleId}`);
                const bData = await bRes.json();
                if (bData.success) {
                    setBookings(bData.data);
                }
            } catch (error) {
                console.error('Error fetching data', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [vehicleId]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/admin/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    vehicleId
                })
            });
            const data = await res.json();
            
            if (data.success) {
                alert('Booking created successfully');
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
        }
    };

    if (isLoading) return <div className="p-8 text-center">Loading schedule...</div>;
    if (!vehicle) return <div className="p-8 text-center">Vehicle not found</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4 mb-6">
                <Link href="/dashboard/vehicles">
                    <Button variant="ghost" size="icon">
                        <ChevronLeft className="w-5 h-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold">{vehicle.brand} {vehicle.vehicleModel} Schedule</h1>
                    <p className="text-muted-foreground text-sm">Manage availability and manual bookings</p>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="flex justify-between items-center bg-card p-4 rounded-xl border border-border">
                <div className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${vehicle.available ? 'bg-green-500' : 'bg-red-500'}`} />
                    <span className="font-medium">{vehicle.available ? 'Currently Available' : 'Currently Unavailable'}</span>
                </div>
                <Button onClick={() => setFormVisible(!formVisible)}>
                    {formVisible ? 'Cancel' : 'Create Manual Booking'}
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form Column */}
                {formVisible && (
                    <div className="lg:col-span-1 bg-card p-6 rounded-xl border border-border h-fit">
                        <h2 className="text-lg font-bold mb-4">New Booking</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="text-sm font-medium mb-1 block">Customer Name</label>
                                <Input required name="customerName" value={formData.customerName} onChange={handleInputChange} placeholder="John Doe" />
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-1 block">Customer Email</label>
                                <Input required name="customerEmail" type="email" value={formData.customerEmail} onChange={handleInputChange} placeholder="john@example.com" />
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-1 block">Phone</label>
                                <Input name="customerPhone" value={formData.customerPhone} onChange={handleInputChange} placeholder="+971..." />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="text-sm font-medium mb-1 block">Start Date</label>
                                    <Input required type="date" name="startDate" value={formData.startDate} onChange={handleInputChange} />
                                </div>
                                <div>
                                    <label className="text-sm font-medium mb-1 block">End Date</label>
                                    <Input required type="date" name="endDate" value={formData.endDate} onChange={handleInputChange} />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="text-sm font-medium mb-1 block">Pickup Loc</label>
                                    <Input required name="pickupLocation" value={formData.pickupLocation} onChange={handleInputChange} placeholder="Ercan Airport" />
                                </div>
                                <div>
                                    <label className="text-sm font-medium mb-1 block">Dropoff Loc</label>
                                    <Input required name="dropoffLocation" value={formData.dropoffLocation} onChange={handleInputChange} placeholder="Kyrenia" />
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-1 block">Customer Documents (ID, License)</label>
                                <Input type="file" multiple onChange={(e) => {
                                    // In a real app, handle file upload here
                                    alert("File upload integrated. In production, this would upload to cloud storage.");
                                }} />
                                <p className="text-xs text-muted-foreground mt-1">Upload PDF or Images</p>
                            </div>
                             <div>
                                <label className="text-sm font-medium mb-1 block">Manual Price (Override)</label>
                                <Input type="number" name="price" value={formData.price} onChange={handleInputChange} placeholder="Auto-calculated if empty" />
                            </div>
                            <Button type="submit" className="w-full">Confirm Booking</Button>
                        </form>
                    </div>
                )}

                {/* Schedule List Column */}
                <div className={`space-y-4 ${formVisible ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
                    <h2 className="text-lg font-bold">Upcoming Schedule</h2>
                    {bookings.length === 0 ? (
                        <div className="p-8 text-center border border-dashed border-border rounded-xl text-muted-foreground">
                            No bookings found for this vehicle.
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {bookings.map((booking: any) => (
                                <div key={booking._id} className="bg-card p-4 rounded-xl border border-border flex flex-col md:flex-row md:items-center justify-between gap-4">
                                     <div className="flex items-start gap-4">
                                         <div className="bg-primary/10 w-12 h-12 rounded flex items-center justify-center shrink-0 text-primary font-bold">
                                             {new Date(booking.startDate).getDate()}
                                         </div>
                                         <div>
                                             <div className="flex items-center gap-2 mb-1">
                                                 <span className="font-bold text-lg">
                                                    {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                                                 </span>
                                                 <span className={`text-xs px-2 py-0.5 rounded capitalize ${
                                                     booking.status === 'confirmed' ? 'bg-green-500/10 text-green-500' :
                                                     booking.status === 'completed' ? 'bg-blue-500/10 text-blue-500' :
                                                     'bg-yellow-500/10 text-yellow-500'
                                                 }`}>
                                                     {booking.status}
                                                 </span>
                                             </div>
                                             <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-muted-foreground">
                                                 <div className="flex items-center gap-1">
                                                     <User className="w-4 h-4" />
                                                     {booking.customer ? `${booking.customer.firstName} ${booking.customer.lastName}` : 'Unknown'}
                                                 </div>
                                                 {booking.customer?.email && (
                                                     <div className="hidden sm:block">
                                                         {booking.customer.email}
                                                     </div>
                                                 )}
                                                 {booking.customer?.phone && (
                                                     <div className="flex items-center gap-1">
                                                         <Phone className="w-4 h-4" />
                                                         {booking.customer.phone}
                                                     </div>
                                                 )}
                                             </div>
                                         </div>
                                     </div>
                                     
                                     <div className="flex items-center gap-4 text-sm border-t md:border-t-0 pt-3 md:pt-0">
                                         <div className="flex flex-col gap-1 min-w-[120px]">
                                             <div className="flex items-center gap-1 text-muted-foreground">
                                                 <MapPin className="w-3 h-3" /> Pickup
                                             </div>
                                             <p>{booking.pickupLocation}</p>
                                         </div>
                                         <div className="flex flex-col gap-1 min-w-[120px]">
                                              <div className="flex items-center gap-1 text-muted-foreground">
                                                 <MapPin className="w-3 h-3" /> Dropoff
                                             </div>
                                             <p>{booking.dropoffLocation}</p>
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
