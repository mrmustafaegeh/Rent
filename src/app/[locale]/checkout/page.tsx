'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Separator } from '@/components/ui/Separator';
import { ShieldCheck, CreditCard, Wallet, Calendar, MapPin, ArrowRight, CheckCircle, Info, Upload } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { useTranslations } from 'next-intl';

// Initialize Stripe (placeholder key if not provided)
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

function CheckoutForm({ total, onSuccess }: { total: number, onSuccess: () => void }) {
    const t = useTranslations('Checkout');
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
                // Return URL for success
                return_url: `${window.location.origin}/dashboard/bookings`,
            },
            redirect: 'if_required' 
        });

        if (error) {
            setMessage(error.message || t('errors.unexpected'));
        } else {
            onSuccess();
        }

        setIsLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <PaymentElement />
            </div>
            {message && <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg flex items-center gap-2"><Info className="w-4 h-4"/> {message}</div>}
            <Button className="w-full h-12 bg-electric hover:bg-electric/90 text-white font-bold rounded-xl" size="lg" isLoading={isLoading} disabled={!stripe || isLoading}>
                {t('payment.payNow', { total })}
            </Button>
        </form>
    );
}

function CheckoutContent() {
    const t = useTranslations('Checkout');
    const searchParams = useSearchParams();
    const router = useRouter();
    const { user, isLoading: authLoading } = useAuth();

    useEffect(() => {
        if (!authLoading && !user) {
             const returnUrl = encodeURIComponent(window.location.href);
             router.push(`/auth/login?returnUrl=${returnUrl}`);
        }
    }, [user, authLoading, router]);
    
    // URL Params
    const vehicleId = searchParams.get('vehicleId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const pickupLocation = searchParams.get('pickupLocation') || 'Ercan Airport';
    const dropoffLocation = searchParams.get('dropoffLocation') || 'Ercan Airport';

    // State
    const [vehicle, setVehicle] = useState<any>(null);
    const [clientSecret, setClientSecret] = useState('');
    const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'pickup'>('pickup'); // Default to pickup
    const [isProcessing, setIsProcessing] = useState(false);
    
    // Form State
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: user?.email || '',
        phone: '',
        notes: ''
    });

    // Fetch Vehicle
    useEffect(() => {
        const fetchVehicle = async () => {
            if (vehicleId) {
                try {
                    const res = await fetch(`/api/vehicles/${vehicleId}`); // Assuming this API exists
                    // Fallback mock data if API fails or is not implemented yet for this demo
                    if (!res.ok) throw new Error("Failed to fetch");
                    const data = await res.json();
                    setVehicle(data);
                } catch (e) {
                    // Fallback for demo purposes
                    console.error(e);
                }
            }
        };
        fetchVehicle();
    }, [vehicleId]);

    // Payment Intent (Only if paying now)
    useEffect(() => {
        if (vehicle && startDate && endDate && paymentMethod === 'stripe') {
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
    }, [vehicle, startDate, endDate, paymentMethod]);

    const calculateTotal = () => {
        if (!vehicle || !startDate || !endDate) return 0;
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffDays = Math.ceil(Math.abs(end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
        const days = Math.max(1, diffDays);
        
        let dailyRate = vehicle.dailyPrice || 0;
        
        if (days >= 30 && vehicle.monthlyPrice) dailyRate = vehicle.monthlyPrice / 30;
        else if (days >= 7 && vehicle.weeklyPrice) dailyRate = vehicle.weeklyPrice / 7;
        else if (days >= 7) dailyRate = vehicle.dailyPrice * 0.85;
        else if (days >= 3) dailyRate = vehicle.dailyPrice * 0.9;

        return Math.round(days * dailyRate);
    };

    const uploadFile = async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        const res = await fetch('/api/upload', {
            method: 'POST',
            body: formData
        });
        if (!res.ok) throw new Error('Upload failed');
        const data = await res.json();
        return data.url;
    };

    const handleBookingCreation = async () => {
        setIsProcessing(true);
        try {
            let driversLicenseUrl = '';
            let passportUrl = '';

            // 1. Upload Documents if present
            const fd = formData as any;
            if (fd.driversLicense) {
                driversLicenseUrl = await uploadFile(fd.driversLicense);
            }
            if (fd.passport) {
                passportUrl = await uploadFile(fd.passport);
            }

            // 2. Create Booking in Database
            const bookingRes = await fetch('/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    vehicleId,
                    customer: {
                        firstName: formData.firstName,
                        lastName: formData.lastName,
                        email: formData.email,
                        phone: formData.phone
                    },
                    startDate,
                    endDate,
                    pickupLocation,
                    dropoffLocation,
                    driversLicense: driversLicenseUrl,
                    passport: passportUrl,
                    totalPrice: calculateTotal(),
                    status: paymentMethod === 'stripe' ? 'confirmed' : 'pending',
                    paymentStatus: paymentMethod === 'stripe' ? 'paid' : 'pending'
                })
            });

            if (bookingRes.ok) {
                 router.push('/dashboard/bookings?success=true');
            } else {
                 const errData = await bookingRes.json();
                 alert(errData.error || t('errors.failed'));
            }

        } catch (err: any) {
            console.error(err);
            alert(err.message || t('errors.unexpected'));
        } finally {
            setIsProcessing(false);
        }
    };

    if (authLoading || !user || !vehicle) return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header />
            <div className="flex-1 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy"></div>
            </div>
        </div>
    );

    const total = calculateTotal();
    const days = Math.ceil(Math.abs(new Date(endDate!).getTime() - new Date(startDate!).getTime()) / (1000 * 60 * 60 * 24));

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Header />
            <main className="flex-1 py-12">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 max-w-6xl mx-auto">
                        
                        {/* Left Column: Details Form */}
                        <div className="flex-1 space-y-8">
                            <h1 className="text-3xl font-heading font-black text-navy">{t('title')}</h1>
                            
                            {/* 1. Driver Details */}
                            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-8 h-8 rounded-full bg-navy text-gold flex items-center justify-center font-bold text-sm">1</div>
                                    <h2 className="text-xl font-bold text-navy">{t('sections.driver')}</h2>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label className="text-black font-bold">{t('form.firstName')}</Label>
                                        <Input 
                                            placeholder="John" 
                                            className="h-12 rounded-xl bg-gray-50 border-gray-200 text-black placeholder:text-gray-400 focus:bg-white transition-all"
                                            value={formData.firstName}
                                            onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-black font-bold">{t('form.lastName')}</Label>
                                        <Input 
                                            placeholder="Doe" 
                                            className="h-12 rounded-xl bg-gray-50 border-gray-200 text-black placeholder:text-gray-400 focus:bg-white transition-all"
                                            value={formData.lastName}
                                            onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-black font-bold">{t('form.email')}</Label>
                                        <Input 
                                            placeholder="john@example.com" 
                                            type="email"
                                            className="h-12 rounded-xl bg-gray-50 border-gray-200 text-black placeholder:text-gray-400 focus:bg-white transition-all"
                                            value={formData.email}
                                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-black font-bold">{t('form.phone')}</Label>
                                        <Input 
                                            placeholder="+90 533 ..." 
                                            className="h-12 rounded-xl bg-gray-50 border-gray-200 text-black placeholder:text-gray-400 focus:bg-white transition-all"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                        />
                                    </div>
                                    
                                    {/* Document Uploads */}
                                    <div className="col-span-full grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                                         <div className="space-y-2">
                                            <Label className="text-black font-bold flex items-center gap-2">
                                                {t('form.license')} <span className="text-red-500">*</span>
                                            </Label>
                                            <div className="relative group">
                                                <input 
                                                    type="file" 
                                                    id="license"
                                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                                    onChange={(e) => setFormData({...formData, driversLicense: e.target.files?.[0]} as any)}
                                                    required
                                                />
                                                <div className="h-14 rounded-xl bg-gray-50 border-2 border-dashed border-gray-200 group-hover:border-navy/30 group-hover:bg-gray-100 transition-all flex items-center px-4 gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-navy/10 text-navy flex items-center justify-center shrink-0">
                                                        <Upload className="w-4 h-4" />
                                                    </div>
                                                    <span className="text-sm text-gray-400 font-medium truncate">
                                                        {(formData as any).driversLicense?.name || t('form.uploadFront')}
                                                    </span>
                                                </div>
                                            </div>
                                         </div>
                                         <div className="space-y-2">
                                            <Label className="text-black font-bold flex items-center gap-2">
                                                {t('form.passport')} <span className="text-red-500">*</span>
                                            </Label>
                                            <div className="relative group">
                                                 <input 
                                                    type="file" 
                                                    id="passport"
                                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                                    onChange={(e) => setFormData({...formData, passport: e.target.files?.[0]} as any)}
                                                    required
                                                />
                                                <div className="h-14 rounded-xl bg-gray-50 border-2 border-dashed border-gray-200 group-hover:border-navy/30 group-hover:bg-gray-100 transition-all flex items-center px-4 gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-navy/10 text-navy flex items-center justify-center shrink-0">
                                                        <Upload className="w-4 h-4" />
                                                    </div>
                                                    <span className="text-sm text-gray-400 font-medium truncate">
                                                        {(formData as any).passport?.name || t('form.uploadPhoto')}
                                                    </span>
                                                </div>
                                            </div>
                                         </div>
                                    </div>

                                    <div className="col-span-full space-y-2">
                                        <Label className="text-black font-bold">{t('form.notes')}</Label>
                                        <Input 
                                            placeholder={t('form.notesPlaceholder')} 
                                            className="h-12 rounded-xl bg-gray-50 border-gray-200 text-black placeholder:text-gray-400 focus:bg-white transition-all"
                                            value={formData.notes}
                                            onChange={(e) => setFormData({...formData, notes: e.target.value})}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* 2. Payment Method */}
                            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-8 h-8 rounded-full bg-navy text-gold flex items-center justify-center font-bold text-sm">2</div>
                                    <h2 className="text-xl font-bold text-navy">{t('sections.payment')}</h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                    <button 
                                        className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${paymentMethod === 'pickup' ? 'border-navy bg-navy/5' : 'border-gray-200 hover:border-gray-300'}`}
                                        onClick={() => setPaymentMethod('pickup')}
                                    >
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'pickup' ? 'border-navy' : 'border-gray-300'}`}>
                                            {paymentMethod === 'pickup' && <div className="w-2.5 h-2.5 rounded-full bg-navy" />}
                                        </div>
                                        <Wallet className="w-5 h-5 text-navy" />
                                        <div className="text-left">
                                            <span className="block font-bold text-sm text-navy">{t('payment.pickup.title')}</span>
                                            <span className="block text-xs text-gray-500">{t('payment.pickup.desc')}</span>
                                        </div>
                                    </button>

                                    <button 
                                        className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${paymentMethod === 'stripe' ? 'border-navy bg-navy/5' : 'border-gray-200 hover:border-gray-300'}`}
                                        onClick={() => setPaymentMethod('stripe')}
                                        disabled={!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY} // Disable if no key
                                    >
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'stripe' ? 'border-navy' : 'border-gray-300'}`}>
                                            {paymentMethod === 'stripe' && <div className="w-2.5 h-2.5 rounded-full bg-navy" />}
                                        </div>
                                        <CreditCard className="w-5 h-5 text-navy" />
                                        <div className="text-left">
                                            <span className="block font-bold text-sm text-navy">{t('payment.stripe.title')}</span>
                                            <span className="block text-xs text-gray-500">{t('payment.stripe.desc')}</span>
                                        </div>
                                    </button>
                                </div>

                                {paymentMethod === 'stripe' && clientSecret && (
                                    <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'stripe', variables: { colorPrimary: '#0A1628', borderRadius: '12px' } } }}>
                                         <CheckoutForm total={total} onSuccess={handleBookingCreation} />
                                    </Elements>
                                )}

                                {paymentMethod === 'pickup' && (
                                    <div className="bg-gray-50 p-6 rounded-2xl space-y-4">
                                        <div className="flex gap-3">
                                            <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                                            <p className="text-sm text-gray-600">
                                                {t.rich('payment.pickup.info', {
                                                    total,
                                                    highlight: (chunks) => <span className="font-bold text-navy">{chunks}</span>
                                                })}
                                            </p>
                                        </div>
                                        <Button 
                                            className="w-full h-14 bg-navy hover:bg-navy/90 text-gold font-bold rounded-xl text-lg shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
                                            onClick={handleBookingCreation}
                                            isLoading={isProcessing}
                                        >
                                            {t('payment.confirm')} <ArrowRight className="ml-2 w-5 h-5" />
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right Column: Order Summary */}
                        <div className="lg:w-[400px] flex-shrink-0">
                            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-[0_8px_30px_rgba(0,0,0,0.08)] sticky top-24">
                                <h3 className="text-xl font-heading font-bold text-navy mb-6">{t('sections.summary')}</h3>
                                
                                <div className="flex gap-4 mb-6">
                                    <div className="w-24 h-24 bg-gray-100 rounded-xl overflow-hidden relative border border-gray-200">
                                        <Image 
                                            src={vehicle.images?.[0]?.url || '/images/car-placeholder.jpg'} 
                                            alt={vehicle.brand} 
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div>
                                        <Badge variant="outline" className="mb-2 text-xs border-navy/20 text-navy bg-gray-50">{vehicle.category}</Badge>
                                        <h4 className="font-bold text-lg leading-tight text-navy">{vehicle.brand} <span className="block text-electric">{vehicle.vehicleModel}</span></h4>
                                        <p className="text-gray-400 text-sm mt-1">{vehicle.year} • {vehicle.specs?.transmission || 'Auto'}</p>
                                    </div>
                                </div>

                                <Separator className="bg-gray-100 my-6" />

                                <div className="space-y-4 relative">
                                    {/* Timeline line */}
                                    <div className="absolute left-1.5 top-2 bottom-6 w-0.5 bg-gray-100" />
                                    
                                    <div className="relative pl-8">
                                        <div className="absolute left-0 top-1 w-3.5 h-3.5 rounded-full border-2 border-navy bg-white z-10" />
                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Pick-up</span>
                                        <p className="font-bold text-navy text-sm">{startDate}</p>
                                        <p className="text-gray-500 text-xs mt-0.5">{pickupLocation}</p>
                                    </div>
                                    
                                    <div className="relative pl-8">
                                        <div className="absolute left-0 top-1 w-3.5 h-3.5 rounded-full border-2 border-electric bg-white z-10" />
                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Drop-off</span>
                                        <p className="font-bold text-navy text-sm">{endDate}</p>
                                        <p className="text-gray-500 text-xs mt-0.5">{dropoffLocation}</p>
                                    </div>
                                </div>

                                <Separator className="bg-gray-100 my-6" />

                                <div className="space-y-3">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-600">{t('summary.duration')}</span>
                                        <span className="font-bold text-navy">{t('summary.days', { days })}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-600">{t('summary.dailyRate')}</span>
                                        <span className="font-bold text-navy">€{Math.round(total / days)}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-600">{t('summary.taxes')}</span>
                                        <span className="font-bold text-emerald-600">{t('summary.included')}</span>
                                    </div>
                                </div>

                                <Separator className="bg-gray-100 my-6" />

                                <div className="flex justify-between items-end">
                                    <div>
                                        <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">{t('summary.total')}</p>
                                        <p className="text-3xl font-heading font-black text-navy">€{total}</p>
                                    </div>
                                    <div className="bg-gold/10 text-gold-dark px-3 py-1 rounded-lg text-xs font-bold">
                                        {t('summary.bestPrice')}
                                    </div>
                                </div>
                                
                                <div className="mt-6 flex items-start gap-3 bg-blue-50/50 p-4 rounded-xl">
                                    <ShieldCheck className="w-5 h-5 text-blue-600 flex-shrink-0" />
                                    <p className="text-xs text-gray-600 leading-relaxed">
                                        {t('summary.insuranceInfo')}
                                    </p>
                                </div>
                            </div>
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
        <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="animate-spin h-8 w-8 border-2 border-navy border-t-transparent rounded-full" /></div>}>
            <CheckoutContent />
        </Suspense>
    );
}
