'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import OptimizedImage from '@/components/ui/OptimizedImage';

// Initialize Stripe (placeholder key if not provided)
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder');

function CheckoutForm({ total, onSuccess }: { total: number, onSuccess: () => void }) {
    const stripe = useStripe();
    const elements = useElements();
    const [message, setMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!stripe || !elements) return;

        setIsLoading(true);

        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                // In a real app we'd redirect to a success page or handle handleNextAction
                return_url: `${window.location.origin}/dashboard/bookings`,
            },
            redirect: 'if_required' 
        });

        if (error) {
            setMessage(error.message || 'An unexpected error occurred.');
        } else {
            // Payment succeeded!
            onSuccess();
        }

        setIsLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <PaymentElement />
            {message && <div className="text-red-500 text-sm">{message}</div>}
            <Button className="w-full mt-4" size="lg" isLoading={isLoading} disabled={!stripe || isLoading}>
                Pay ${total}
            </Button>
        </form>
    );
}

function CheckoutContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { user, isAuthenticated } = useAuth();
    
    const vehicleId = searchParams.get('vehicleId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const pickupLocation = searchParams.get('pickupLocation') || 'Ercan Airport';
    const dropoffLocation = searchParams.get('dropoffLocation') || 'Ercan Airport';

    const [vehicle, setVehicle] = useState<any>(null);
    const [clientSecret, setClientSecret] = useState('');
    const [isCreatingBooking, setIsCreatingBooking] = useState(false);

    useEffect(() => {
        const fetchVehicle = async () => {
            if (vehicleId) {
                const res = await fetch(`/api/vehicles/${vehicleId}`);
                const data = await res.json();
                setVehicle(data);
            }
        };
        fetchVehicle();
    }, [vehicleId]);

    useEffect(() => {
        if (vehicle && startDate && endDate) {
             const start = new Date(startDate);
             const end = new Date(endDate);
             const diffDays = Math.ceil(Math.abs(end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
             
             if (diffDays > 0) {
                 fetch('/api/checkout', {
                     method: 'POST',
                     headers: { 'Content-Type': 'application/json' },
                     body: JSON.stringify({ vehicleId: vehicle._id, days: diffDays })
                 })
                 .then(res => res.json())
                 .then(data => {
                     if(data.clientSecret) setClientSecret(data.clientSecret);
                 })
                 .catch(err => console.error("Stripe Intent Error", err));
             }
        }
    }, [vehicle, startDate, endDate]);

    const calculateTotal = () => {
        if (!vehicle || !startDate || !endDate) return 0;
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffDays = Math.ceil(Math.abs(end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
        return diffDays * vehicle.pricing.daily;
    };

    const handleSuccess = async () => {
        setIsCreatingBooking(true);
        try {
            // Create Booking in Database upon success
            const bookingRes = await fetch('/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    vehicleId,
                    customerEmail: user?.email,
                    startDate,
                    endDate,
                    pickupLocation,
                    dropoffLocation
                })
            });

            const bookingData = await bookingRes.json();
            
            if (bookingData.success) {
                 // In real Stripe flow, we might update status here or via webhook
                 // For now, assume success means confirmed or paid
                 router.push('/dashboard/bookings');
            } else {
                 console.error('Failed to create booking', bookingData);
                 alert('Payment succeeded but booking creation failed. Please contact support.');
            }

        } catch (err) {
            console.error(err);
        } finally {
            setIsCreatingBooking(false);
        }
    };

    if (!vehicle) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin text-[var(--primary)] text-4xl">●</div></div>;

    const total = calculateTotal();

    return (
        <div className="flex flex-col min-h-screen bg-[var(--background)]">
            <Header />
            <main className="flex-1 pt-24 pb-12">
                <div className="container mx-auto px-4 max-w-4xl">
                    <h1 className="text-3xl font-bold mb-8">Checkout</h1>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Summary */}
                        <div className="bg-[var(--surface-light)] p-6 rounded-xl border border-[var(--border)] h-fit">
                            <h2 className="text-xl font-bold mb-4 border-b border-[var(--border)] pb-4">Booking Summary</h2>
                            
                            <div className="flex gap-4 mb-4">
                                <div className="w-24 h-16 bg-[var(--surface-lighter)] rounded overflow-hidden relative">
                                    <OptimizedImage 
                                        src={vehicle.images?.[0]?.url || '/images/car-placeholder.jpg'} 
                                        alt={vehicle.brand} 
                                        fill
                                        className="object-cover w-full h-full"
                                    />
                                </div>
                                <div>
                                    <h3 className="font-bold">{vehicle.brand} {vehicle.vehicleModel}</h3>
                                    <p className="text-sm text-[var(--text-secondary)]">{vehicle.category}</p>
                                </div>
                            </div>

                            <div className="space-y-2 text-sm text-[var(--text-secondary)] mb-4">
                                <div className="flex justify-between">
                                    <span>Pick-up</span>
                                    <span className="text-white text-right">
                                        {startDate}<br/>
                                        <span className="text-xs text-[var(--text-muted)] capitalize">{pickupLocation}</span>
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Drop-off</span>
                                    <span className="text-white text-right">
                                        {endDate}<br/>
                                        <span className="text-xs text-[var(--text-muted)] capitalize">{dropoffLocation}</span>
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Total Days</span>
                                    <span className="text-white">{Math.ceil(Math.abs(new Date(endDate!).getTime() - new Date(startDate!).getTime()) / (1000 * 60 * 60 * 24))}</span>
                                </div>
                            </div>

                            <div className="border-t border-[var(--border)] pt-4 flex justify-between items-center text-lg font-bold">
                                <span>Total</span>
                                <span>${total}</span>
                            </div>
                        </div>

                        {/* Payment Form */}
                        <div className="bg-[var(--surface-light)] p-6 rounded-xl border border-[var(--border)]">
                            <h2 className="text-xl font-bold mb-4">Payment Details</h2>
                            
                            {clientSecret ? (
                                <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'night', variables: { colorPrimary: '#3b82f6', colorBackground: '#27272a', colorText: '#ffffff' } } }}>
                                     <CheckoutForm total={total} onSuccess={handleSuccess} />
                                </Elements>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-10 text-[var(--text-muted)]">
                                    {vehicleId ? <div className="animate-spin text-2xl mb-2">⟳</div> : null}
                                    <p>{vehicleId ? 'Initializing Payment...' : 'Invalid Request'}</p>
                                    <p className="text-xs mt-2">Make sure Stripe Keys are configured.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default function CheckoutPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[var(--background)]" />}>
            <CheckoutContent />
        </Suspense>
    );
}
