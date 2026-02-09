'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import OptimizedImage from '@/components/ui/OptimizedImage';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        setIsLoading(false);
        return;
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            password: formData.password
        })
      });

      const data = await res.json();

      if (data.success) {
        login(data.token, data.user);
        router.push('/');
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[var(--background)]">
      {/* Left Sidebar - Image */}
      <div className="hidden lg:block w-1/2 relative order-2">
        <OptimizedImage
          src="/images/auth-sidebar.png"
          alt="Premium Car"
          fill
          className="w-full h-full object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-8 text-white z-10 text-center w-full">
           <h1 className="text-4xl font-bold mb-4 font-[family-name:var(--font-geist-sans)]">Join the Club.</h1>
           <p className="text-lg opacity-90">Unlock exclusive rates and priority booking.</p>
        </div>
      </div>

      {/* Right Content - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-20 bg-white order-1">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-heading font-black text-navy mb-2">Create Account</h2>
            <p className="text-gray-500 font-medium">Begin your premium experience today</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-4 bg-red-50 text-red-600 border border-red-100 rounded-xl text-sm font-medium flex items-center gap-2">
                 <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
                 {error}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
                <Input
                id="firstName"
                type="text"
                label="First Name"
                placeholder="John"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="bg-gray-50 border-gray-200 text-black placeholder:text-gray-400 focus:bg-white h-12 rounded-xl"
                />
                 <Input
                id="lastName"
                type="text"
                label="Last Name"
                placeholder="Doe"
                value={formData.lastName}
                onChange={handleChange}
                required
                className="bg-gray-50 border-gray-200 text-black placeholder:text-gray-400 focus:bg-white h-12 rounded-xl"
                />
            </div>

            <Input
              id="email"
              type="email"
              label="Email Address"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              required
              className="bg-gray-50 border-gray-200 text-black placeholder:text-gray-400 focus:bg-white h-12 rounded-xl"
            />

            <Input
              id="phone"
              type="tel"
              label="Phone Number"
              placeholder="+1 234 567 8900"
              value={formData.phone}
              onChange={handleChange}
              required
              className="bg-gray-50 border-gray-200 text-black placeholder:text-gray-400 focus:bg-white h-12 rounded-xl"
            />

            <Input
                id="password"
                type="password"
                label="Password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                className="bg-gray-50 border-gray-200 text-black placeholder:text-gray-400 focus:bg-white h-12 rounded-xl"
              />

             <Input
                id="confirmPassword"
                type="password"
                label="Confirm Password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="bg-gray-50 border-gray-200 text-black placeholder:text-gray-400 focus:bg-white h-12 rounded-xl"
              />

            <div className="pt-2">
                <Button type="submit" className="w-full h-12 bg-navy hover:bg-navy/90 text-gold font-bold rounded-xl shadow-lg shadow-navy/20" isLoading={isLoading}>
                    Sign Up
                </Button>

                <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-gray-100"></span>
                    </div>
                    <div className="relative flex justify-center text-xs font-bold uppercase tracking-wider">
                        <span className="bg-white px-4 text-gray-400">Or continue with</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <button
                        type="button"
                        onClick={() => signIn('google', { callbackUrl: '/' })}
                        className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all hover:-translate-y-0.5 text-navy text-sm font-bold shadow-sm"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Google
                    </button>
                    <button
                        type="button"
                        onClick={() => signIn('facebook', { callbackUrl: '/' })}
                        className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all hover:-translate-y-0.5 text-navy text-sm font-bold shadow-sm"
                    >
                        <svg className="w-5 h-5 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.791-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                        Facebook
                    </button>
                </div>
            </div>
          </form>

          <div className="text-center text-gray-500 text-sm font-medium">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-navy hover:text-gold transition-colors font-bold">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
