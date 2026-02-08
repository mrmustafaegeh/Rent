'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

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
                alert('Account request submitted successfully! Our team will review your application.');
                router.push('/auth/login');
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
        <div className="min-h-screen bg-[var(--background)] flex items-center justify-center p-4">
            <div className="max-w-3xl w-full bg-[var(--surface-light)] border border-[var(--border)] rounded-2xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--primary)]/10 blur-[100px] rounded-full pointer-events-none" />
                
                <div className="relative z-10">
                    <div className="text-center mb-10">
                        <Link href="/" className="inline-block mb-4">
                            <span className="text-2xl font-bold tracking-tighter">RENTAL<span className="text-[var(--primary)]">X</span></span>
                        </Link>
                        <h1 className="text-3xl font-bold mb-2">Become a Partner</h1>
                        <p className="text-[var(--text-secondary)]">Join the exclusive fleet network and list your premium vehicles.</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg text-sm text-center">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Section 1: User Account */}
                        <div>
                            <h3 className="text-xl font-semibold mb-4 pb-2 border-b border-[var(--border)]">Account Details</h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <Input label="First Name" name="firstName" placeholder="John" value={formData.firstName} onChange={handleChange} required />
                                <Input label="Last Name" name="lastName" placeholder="Doe" value={formData.lastName} onChange={handleChange} required />
                                <Input label="Email" name="userEmail" type="email" placeholder="john@example.com" value={formData.userEmail} onChange={handleChange} required />
                                <Input label="Password" name="password" type="password" placeholder="••••••••" value={formData.password} onChange={handleChange} required />
                                <Input label="Phone" name="userPhone" placeholder="+971..." value={formData.userPhone} onChange={handleChange} required />
                            </div>
                        </div>

                        {/* Section 2: Company Info */}
                        <div>
                            <h3 className="text-xl font-semibold mb-4 pb-2 border-b border-[var(--border)]">Company Information</h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <Input label="Company Name" name="companyName" placeholder="Prestige Rentals LLC" value={formData.companyName} onChange={handleChange} required />
                                <Input label="Company Email" name="companyEmail" type="email" placeholder="contact@prestige.com" value={formData.companyEmail} onChange={handleChange} required />
                                <Input label="Company Phone" name="companyPhone" placeholder="+971..." value={formData.companyPhone} onChange={handleChange} required />
                                <Input label="Headquarters City" name="companyAddress" placeholder="Dubai" value={formData.companyAddress} onChange={handleChange} required />
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-sm font-medium text-[var(--text-secondary)]">Description</label>
                                    <textarea 
                                        name="companyDescription"
                                        placeholder="Tell us about your fleet..."
                                        className="w-full min-h-[100px] px-4 py-3 bg-[var(--surface)] border border-[var(--border)] rounded-lg text-white placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)] transition-all resize-y"
                                        value={formData.companyDescription}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-4">
                            <Button className="w-full text-lg h-12" isLoading={isLoading}>Submit Application</Button>
                        </div>
                    </form>

                    <p className="mt-8 text-center text-sm text-[var(--text-secondary)]">
                        Already have a partner account?{' '}
                        <Link href="/auth/login" className="text-[var(--primary)] hover:underline font-medium">
                            Log in here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
