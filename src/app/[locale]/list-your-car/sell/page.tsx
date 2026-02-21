'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import ImageUpload from '@/components/ui/ImageUpload';
import { ChevronLeft, Info, DollarSign, Image as ImageIcon, Car, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';
import { useTranslations } from 'next-intl';

export default function SellCarPage() {
    const t = useTranslations('ListCar');
    const router = useRouter();
    const { user, isLoading: authLoading } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    
    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/auth/login?callbackUrl=/list-your-car/sell');
        }
    }, [user, authLoading, router]);

    const [formData, setFormData] = useState({
        brand: '',
        vehicleModel: '',
        year: new Date().getFullYear(),
        category: 'Sedan',
        transmission: 'Automatic',
        fuelType: 'Petrol',
        mileage: '',
        condition: 'Used',
        salePrice: '',
        location: '',
        images: [] as string[]
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const payload = {
                ...formData,
                type: 'sale',
                year: Number(formData.year),
                mileage: Number(formData.mileage),
                salePrice: Number(formData.salePrice),
                images: formData.images.map((url, index) => ({
                   url,
                   isPrimary: index === 0 
                })),
                available: true,
                owner: user?.id
            };

            const res = await fetch('/api/vehicles', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...payload, owner: user?.id })
            });

            if (res.ok) {
                setSuccess(true);
                window.scrollTo(0, 0);
            } else {
                const data = await res.json();
                alert(data.error || 'Failed to list vehicle');
            }
        } catch (error) {
            console.error(error);
            alert('Error listing vehicle');
        } finally {
            setIsLoading(false);
        }
    };

    if (authLoading || !user) return null;

    if (success) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col">
                <Header />
                <main className="flex-1 flex items-center justify-center p-4">
                    <div className="bg-white p-8 rounded-3xl shadow-xl max-w-lg w-full text-center space-y-6 border border-gray-100">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600 mb-4">
                            <CheckCircle className="w-10 h-10" />
                        </div>
                        <h2 className="text-3xl font-heading font-black text-navy">{t('success.title')}</h2>
                        <p className="text-gray-500 font-medium">
                            {t('success.desc')}
                        </p>
                        <div className="pt-4 flex flex-col gap-3">
                            <Link href="/dashboard/all-bookings">
                                <Button className="w-full h-12 bg-navy text-white rounded-xl font-bold">
                                    {t('success.dashboard')}
                                </Button>
                            </Link>
                            <Link href="/">
                                <Button variant="ghost" className="w-full h-12 text-gray-500 font-bold hover:bg-gray-50 rounded-xl">
                                    {t('success.home')}
                                </Button>
                            </Link>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header />
            
            <main className="flex-1 py-12 px-4 sm:px-6">
                <div className="max-w-4xl mx-auto space-y-8">
                    <div className="text-center space-y-2">
                        <span className="text-gold font-bold uppercase tracking-widest text-xs">{t('overline')}</span>
                        <h1 className="text-4xl font-heading font-black text-navy">{t('title')}</h1>
                        <p className="text-gray-500 font-medium max-w-xl mx-auto">
                            {t('subtitle')}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Vehicle Details */}
                        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                            <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                                <div className="w-10 h-10 rounded-full bg-navy/5 flex items-center justify-center text-navy">
                                    <Car className="w-5 h-5" />
                                </div>
                                <h2 className="text-xl font-bold text-navy">{t('sections.info')}</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Input label={t('fields.brand')} name="brand" placeholder="e.g. BMW" value={formData.brand} onChange={handleChange} required className="text-black bg-gray-50 h-12 rounded-xl border-transparent focus:bg-white focus:border-gray-200" />
                                <Input label={t('fields.model')} name="vehicleModel" placeholder="e.g. X5" value={formData.vehicleModel} onChange={handleChange} required className="text-black bg-gray-50 h-12 rounded-xl border-transparent focus:bg-white focus:border-gray-200" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <Input label={t('fields.year')} name="year" type="number" value={formData.year} onChange={handleChange} required className="text-black bg-gray-50 h-12 rounded-xl border-transparent focus:bg-white focus:border-gray-200" />
                                <div className="space-y-2">
                                     <label className="text-xs font-bold text-black uppercase tracking-wider ml-1">{t('fields.condition')}</label>
                                     <select 
                                        name="condition" 
                                        value={formData.condition} 
                                        onChange={handleChange} 
                                        className="w-full h-12 px-4 bg-gray-50 border border-transparent rounded-xl text-black font-bold appearance-none focus:outline-none focus:ring-2 focus:ring-navy/5 focus:bg-white transition-all cursor-pointer"
                                     >
                                         <option>New</option>
                                         <option>Used</option>
                                         <option>Certified Pre-Owned</option>
                                     </select>
                                </div>
                                <Input label={t('fields.mileage')} name="mileage" type="number" placeholder="0" value={formData.mileage} onChange={handleChange} required className="text-black bg-gray-50 h-12 rounded-xl border-transparent focus:bg-white focus:border-gray-200" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                     <label className="text-xs font-bold text-black uppercase tracking-wider ml-1">{t('fields.category')}</label>
                                     <select name="category" value={formData.category} onChange={handleChange} className="w-full h-12 px-4 bg-gray-50 border border-transparent rounded-xl text-black font-bold appearance-none focus:outline-none focus:ring-2 focus:ring-navy/5 focus:bg-white transition-all cursor-pointer">
                                         <option>Sedan</option>
                                         <option>SUV</option>
                                         <option>Sports</option>
                                         <option>Luxury</option>
                                         <option>Van</option>
                                         <option>Economy</option>
                                         <option>Electric</option>
                                     </select>
                                </div>
                                <div className="space-y-2">
                                     <label className="text-xs font-bold text-black uppercase tracking-wider ml-1">{t('fields.transmission')}</label>
                                     <select name="transmission" value={formData.transmission} onChange={handleChange} className="w-full h-12 px-4 bg-gray-50 border border-transparent rounded-xl text-black font-bold appearance-none focus:outline-none focus:ring-2 focus:ring-navy/5 focus:bg-white transition-all cursor-pointer">
                                         <option>Automatic</option>
                                         <option>Manual</option>
                                     </select>
                                </div>
                                <div className="space-y-2">
                                     <label className="text-xs font-bold text-black uppercase tracking-wider ml-1">{t('fields.fuelType')}</label>
                                     <select name="fuelType" value={formData.fuelType} onChange={handleChange} className="w-full h-12 px-4 bg-gray-50 border border-transparent rounded-xl text-black font-bold appearance-none focus:outline-none focus:ring-2 focus:ring-navy/5 focus:bg-white transition-all cursor-pointer">
                                         <option>Petrol</option>
                                         <option>Diesel</option>
                                         <option>Electric</option>
                                         <option>Hybrid</option>
                                     </select>
                                </div>
                            </div>
                            
                            <Input label={t('fields.location')} name="location" placeholder="e.g. Istanbul, Turkey" value={formData.location} onChange={handleChange} required className="text-black bg-gray-50 h-12 rounded-xl border-transparent focus:bg-white focus:border-gray-200" />
                        </div>

                        {/* Pricing & Images */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                                <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                                    <div className="w-10 h-10 rounded-full bg-navy/5 flex items-center justify-center text-navy">
                                        <DollarSign className="w-5 h-5" />
                                    </div>
                                    <h2 className="text-xl font-bold text-navy">{t('sections.pricing')}</h2>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-black uppercase tracking-wider ml-1 mb-2 block">{t('fields.price')}</label>
                                    <Input 
                                        name="salePrice" 
                                        type="number" 
                                        placeholder="0.00" 
                                        value={formData.salePrice} 
                                        onChange={handleChange} 
                                        required 
                                        className="bg-navy text-white placeholder:text-gray-400 h-16 text-2xl font-black text-center rounded-xl border-transparent focus:ring-4 focus:ring-navy/20"
                                    />
                                </div>
                            </div>

                            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                                <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                                    <div className="w-10 h-10 rounded-full bg-navy/5 flex items-center justify-center text-navy">
                                        <ImageIcon className="w-5 h-5" />
                                    </div>
                                    <h2 className="text-xl font-bold text-navy">{t('sections.photos')}</h2>
                                </div>
                                <div className="bg-gray-50 rounded-2xl p-2 border border-dashed border-gray-200">
                                     <ImageUpload 
                                        value={formData.images} 
                                        onChange={(urls) => setFormData(prev => ({ ...prev, images: urls }))} 
                                        multiple 
                                     />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end pt-4">
                            <Button 
                                type="submit" 
                                isLoading={isLoading}
                                className="bg-navy text-gold hover:bg-navy/90 font-bold h-14 px-10 rounded-xl shadow-xl shadow-navy/20 text-lg"
                            >
                                {t('submit')}
                            </Button>
                        </div>
                    </form>
                </div>
            </main>
            
            <Footer />
        </div>
    );
}
