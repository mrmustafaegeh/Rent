'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/Dialog';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Calendar, User, Truck, MapPin, Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

interface Vehicle {
    id: string;
    brand: string;
    vehicleModel: string;
    dailyPrice: number;
    images: { url: string }[];
}

export default function ManualBookingDialog({ onBookingCreated }: { onBookingCreated: () => void }) {
    const [open, setOpen] = useState(false);
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    
    // Form Data
    const [formData, setFormData] = useState({
        startDate: '',
        endDate: '',
        pickupLocation: 'Kyrenia',
        dropoffLocation: 'Kyrenia',
        vehicleId: '',
        customer: {
            firstName: '',
            lastName: '',
            email: '',
            phone: ''
        }
    });

    useEffect(() => {
        if (open && step === 2) {
            fetchVehicles();
        }
    }, [open, step]);

    const fetchVehicles = async () => {
        setLoading(true);
        try {
            // Simplified fetch - ideally filter by dates
            const res = await fetch('/api/vehicles?status=APPROVED&limit=100');
            const data = await res.json();
            if (data.vehicles) setVehicles(data.vehicles);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    status: 'CONFIRMED', 
                    paymentStatus: 'PAY_AT_PICKUP' // Default for admin manual bookings
                })
            });

            if (res.ok) {
                setOpen(false);
                onBookingCreated();
                // Reset form
                setStep(1);
                setFormData({
                    startDate: '',
                    endDate: '',
                    pickupLocation: 'Kyrenia',
                    dropoffLocation: 'Kyrenia',
                    vehicleId: '',
                    customer: { firstName: '', lastName: '', email: '', phone: '' }
                });
            } else {
                alert('Failed to create booking');
            }
        } catch (error) {
            console.error(error);
            alert('Error creating booking');
        } finally {
            setLoading(false);
        }
    };

    const handleNext = () => setStep(step + 1);
    const handleBack = () => setStep(step - 1);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-navy hover:bg-navy/90 text-white shadow-lg font-bold">
                    <Calendar className="w-4 h-4 mr-2" />
                    New Booking
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] bg-white">
                <DialogHeader>
                    <DialogTitle>Create Manual Booking</DialogTitle>
                    <DialogDescription>
                        Step {step} of 3: {step === 1 ? 'Schedule & Location' : step === 2 ? 'Select Vehicle' : 'Customer Details'}
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4">
                    {step === 1 && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Start Date</Label>
                                    <Input 
                                        type="datetime-local" 
                                        value={formData.startDate}
                                        onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>End Date</Label>
                                    <Input 
                                        type="datetime-local" 
                                        value={formData.endDate}
                                        onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Pickup Location</Label>
                                    <select 
                                        className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                        value={formData.pickupLocation}
                                        onChange={(e) => setFormData({...formData, pickupLocation: e.target.value})}
                                    >
                                        <option value="Kyrenia">Kyrenia</option>
                                        <option value="Nicosia">Nicosia</option>
                                        <option value="Famagusta">Famagusta</option>
                                        <option value="Ercan Airport">Ercan Airport</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Dropoff Location</Label>
                                    <select 
                                        className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                        value={formData.dropoffLocation}
                                        onChange={(e) => setFormData({...formData, dropoffLocation: e.target.value})}
                                    >
                                        <option value="Kyrenia">Kyrenia</option>
                                        <option value="Nicosia">Nicosia</option>
                                        <option value="Famagusta">Famagusta</option>
                                        <option value="Ercan Airport">Ercan Airport</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                            {loading ? (
                                <div className="flex justify-center py-8">
                                    <Loader2 className="w-8 h-8 animate-spin text-navy" />
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 gap-3">
                                    {vehicles.map((vehicle) => (
                                        <div 
                                            key={vehicle.id}
                                            onClick={() => setFormData({...formData, vehicleId: vehicle.id})}
                                            className={`flex items-center gap-4 p-3 rounded-xl border cursor-pointer transition-all ${
                                                formData.vehicleId === vehicle.id 
                                                    ? 'border-navy bg-navy/5 ring-1 ring-navy' 
                                                    : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                        >
                                            <div className="w-16 h-12 bg-gray-100 rounded-lg relative overflow-hidden">
                                                {vehicle.images[0]?.url && (
                                                    <Image src={vehicle.images[0].url} alt={vehicle.brand} fill className="object-cover" />
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-bold text-navy">{vehicle.brand} {vehicle.vehicleModel}</h4>
                                                <p className="text-xs text-gray-500">€{vehicle.dailyPrice}/day</p>
                                            </div>
                                            {formData.vehicleId === vehicle.id && (
                                                <div className="w-4 h-4 rounded-full bg-navy flex items-center justify-center">
                                                    <div className="w-2 h-2 bg-white rounded-full" />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>First Name</Label>
                                    <Input 
                                        value={formData.customer.firstName}
                                        onChange={(e) => setFormData({
                                            ...formData, 
                                            customer: {...formData.customer, firstName: e.target.value}
                                        })}
                                        placeholder="John"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Last Name</Label>
                                    <Input 
                                        value={formData.customer.lastName}
                                        onChange={(e) => setFormData({
                                            ...formData, 
                                            customer: {...formData.customer, lastName: e.target.value}
                                        })}
                                        placeholder="Doe"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Email</Label>
                                <Input 
                                    type="email"
                                    value={formData.customer.email}
                                    onChange={(e) => setFormData({
                                        ...formData, 
                                        customer: {...formData.customer, email: e.target.value}
                                    })}
                                    placeholder="john@example.com"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Phone</Label>
                                <Input 
                                    type="tel"
                                    value={formData.customer.phone}
                                    onChange={(e) => setFormData({
                                        ...formData, 
                                        customer: {...formData.customer, phone: e.target.value}
                                    })}
                                    placeholder="+90..."
                                />
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter className="flex justify-between sm:justify-between">
                    {step > 1 ? (
                        <Button variant="outline" onClick={handleBack}>Back</Button>
                    ) : (
                        <div /> 
                    )}
                    
                    {step < 3 ? (
                        <Button 
                            onClick={handleNext} 
                            disabled={
                                (step === 1 && (!formData.startDate || !formData.endDate)) ||
                                (step === 2 && !formData.vehicleId)
                            }
                            className="bg-navy hover:bg-navy/90 text-white"
                        >
                            Next
                        </Button>
                    ) : (
                        <Button 
                            onClick={handleSubmit} 
                            disabled={loading || !formData.customer.email || !formData.customer.firstName}
                            className="bg-navy hover:bg-navy/90 text-white"
                        >
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Create Booking
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
