'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Car, Building2, User } from 'lucide-react';

export default function PartnerRegisterPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        userEmail: '',
        userPhone: '',
        password: '',
        companyName: '',
        companyDescription: '',
        companyAddress: '',
        companyPhone: '',
        companyEmail: ''
    });
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        // @ts-ignore
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const res = await fetch('/api/auth/register-partner', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.userEmail,
                    password: formData.password,
                    phone: formData.userPhone,
                    companyName: formData.companyName,
                    companyDescription: formData.companyDescription,
                    companyAddress: formData.companyAddress,
                    companyPhone: formData.companyPhone,
                    companyEmail: formData.companyEmail,
                })
            });

            const data = await res.json();
            
            if (res.ok) {
                // Success
                router.push('/auth/login?registered=partner');
            } else {
                setError(data.error || 'Registration failed');
            }
        } catch (err: any) {
            setError('Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
             {/* Background Decoration */}
             <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold/10 rounded-full blur-[100px] opacity-60" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-navy/5 rounded-full blur-[100px] opacity-60" />
            </div>

            <div className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row relative z-10 border border-gray-100">
                {/* Left Side: Info Panel */}
                <div className="md:w-5/12 bg-navy p-10 text-white flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-navy to-black opacity-50" />
                    <div className="absolute inset-0 bg-[url('/images/pattern-grid.png')] opacity-10" />
                    
                    <div className="relative z-10">
                        <Link href="/" className="inline-flex items-center gap-2 mb-10 group">
                             <span className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white border border-white/10 group-hover:bg-gold group-hover:text-navy transition-all">
                                <Car className="w-4 h-4" />
                            </span>
                            <span className="font-heading font-black text-xl tracking-tight">
                                RENTAL<span className="text-gold">X</span>
                            </span>
                        </Link>
                        
                        <h2 className="text-3xl font-heading font-black leading-tight mb-4">
                            Grow Your Fleet Business
                        </h2>
                        <p className="text-gray-400 text-sm leading-relaxed mb-8">
                            Join Mediterranean Drive's exclusive partner network. List your premium vehicles, manage bookings effortlessly, and reach high-value customers.
                        </p>
                        
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gold border border-white/5">
                                    <Building2 className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm">Company Profile</h4>
                                    <p className="text-xs text-gray-400">Showcase your brand</p>
                                </div>
                            </div>
                             <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gold border border-white/5">
                                    <Car className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm">Fleet Management</h4>
                                    <p className="text-xs text-gray-400">Easy vehicle listing tools</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="relative z-10 mt-10 text-xs text-gray-500 font-medium">
                        © 2024 Mediterranean Drive.
                    </div>
                </div>

                {/* Right Side: Form */}
                <div className="md:w-7/12 p-10 bg-white">
                    <div className="flex justify-end mb-6">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Partner Application</span>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 text-red-500 border border-red-100 rounded-xl text-sm font-medium flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block" />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Personal Details */}
                        <div>
                             <h3 className="text-sm font-black text-navy uppercase tracking-widest mb-4 flex items-center gap-2">
                                <User className="w-4 h-4 text-gold" /> Personal Info
                             </h3>
                             <div className="grid md:grid-cols-2 gap-4">
                                <Input label="First Name" name="firstName" placeholder="John" value={formData.firstName} onChange={handleChange} required className="bg-gray-50 text-black placeholder:text-gray-400 focus:bg-white h-12 rounded-xl" />
                                <Input label="Last Name" name="lastName" placeholder="Doe" value={formData.lastName} onChange={handleChange} required className="bg-gray-50 text-black placeholder:text-gray-400 focus:bg-white h-12 rounded-xl" />
                             </div>
                             <div className="grid md:grid-cols-2 gap-4 mt-4">
                                <Input label="Email" name="userEmail" type="email" placeholder="john@example.com" value={formData.userEmail} onChange={handleChange} required className="bg-gray-50 text-black placeholder:text-gray-400 focus:bg-white h-12 rounded-xl" />
                                <Input label="Phone" name="userPhone" placeholder="+90 533..." value={formData.userPhone} onChange={handleChange} required className="bg-gray-50 text-black placeholder:text-gray-400 focus:bg-white h-12 rounded-xl" />
                             </div>
                             <div className="mt-4">
                                 <Input label="Password" name="password" type="password" placeholder="Min. 8 characters" value={formData.password} onChange={handleChange} required className="bg-gray-50 text-black placeholder:text-gray-400 focus:bg-white h-12 rounded-xl" />
                             </div>
                        </div>

                        <div className="h-px bg-gray-100" />

                        {/* Company Details */}
                         <div>
                             <h3 className="text-sm font-black text-navy uppercase tracking-widest mb-4 flex items-center gap-2">
                                <Building2 className="w-4 h-4 text-gold" /> Company Info
                             </h3>
                             
                             <div className="space-y-4">
                                 <Input label="Company Name" name="companyName" placeholder="Prestige Rentals Ltd." value={formData.companyName} onChange={handleChange} required className="bg-gray-50 text-black placeholder:text-gray-400 focus:bg-white h-12 rounded-xl" />
                                 <div className="grid md:grid-cols-2 gap-4">
                                     <Input label="Company Email" name="companyEmail" type="email" placeholder="info@prestige.com" value={formData.companyEmail} onChange={handleChange} required className="bg-gray-50 text-black placeholder:text-gray-400 focus:bg-white h-12 rounded-xl" />
                                     <Input label="Company Phone" name="companyPhone" placeholder="+90 392..." value={formData.companyPhone} onChange={handleChange} required className="bg-gray-50 text-black placeholder:text-gray-400 focus:bg-white h-12 rounded-xl" />
                                 </div>
                                 <Input label="Headquarters City" name="companyAddress" placeholder="Kyrenia, North Cyprus" value={formData.companyAddress} onChange={handleChange} required className="bg-gray-50 text-black placeholder:text-gray-400 focus:bg-white h-12 rounded-xl" />
                                 
                                 <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Business Description</label>
                                    <textarea 
                                        name="companyDescription"
                                        placeholder="Briefly describe your fleet and services..."
                                        className="w-full min-h-[100px] px-4 py-3 bg-gray-50 border border-transparent rounded-xl text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-navy/5 focus:bg-white transition-all text-sm font-medium resize-none"
                                        value={formData.companyDescription}
                                        onChange={handleChange}
                                    />
                                </div>
                             </div>
                        </div>

                        <Button className="w-full h-14 text-lg font-bold bg-navy text-gold hover:bg-navy/90 rounded-xl shadow-lg shadow-navy/20 mt-4" isLoading={isLoading}>
                            Submit Application
                        </Button>
                    </form>

                    <p className="mt-8 text-center text-sm font-medium text-gray-500">
                        Already a partner?{' '}
                        <Link href="/auth/login" className="text-navy hover:text-gold transition-colors font-bold">
                            Login Dashboard
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
