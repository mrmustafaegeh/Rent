'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import OptimizedImage from '@/components/ui/OptimizedImage';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (data.success) {
        login(data.token, data.user);
        router.push('/');
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Sidebar - Image */}
      <div className="hidden lg:block w-1/2 relative">
        <OptimizedImage
          src="/images/auth-sidebar.png"
          alt="Premium Car"
          fill
          className="w-full h-full object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute bottom-10 left-10 p-10 text-white z-10 max-w-xl">
          <h1 className="text-5xl font-black mb-6 font-heading leading-tight">Drive the <br/> <span className="text-gold">Extraordinary.</span></h1>
          <p className="text-xl opacity-90 font-medium font-body leading-relaxed">Experience the thrill of the world's most exclusive fleet. Your journey begins here.</p>
        </div>
      </div>

      {/* Right Content - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 bg-white">
        <div className="w-full max-w-md space-y-10">
          <div className="text-center lg:text-left space-y-2">
            <h2 className="text-4xl font-heading font-black text-navy tracking-tight">Welcome Back</h2>
            <p className="text-gray-500 font-medium text-lg">Sign in to access your dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 text-red-600 border border-red-100 rounded-xl text-sm font-medium flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                <span className="w-2 h-2 rounded-full bg-red-600 shrink-0" />
                {error}
              </div>
            )}

            <div className="space-y-5">
                <Input
                id="email"
                type="email"
                label="Email Address"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-gray-50 border-gray-200 text-navy font-medium placeholder:text-gray-400 focus:bg-white h-12 rounded-xl focus:border-electric/50 focus:ring-electric/20 transition-all"
                />

                <div className="space-y-2">
                <Input
                    id="password"
                    type="password"
                    label="Password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-gray-50 border-gray-200 text-navy font-medium placeholder:text-gray-400 focus:bg-white h-12 rounded-xl focus:border-electric/50 focus:ring-electric/20 transition-all"
                />
                <div className="flex justify-end">
                    <Link href="/auth/forgot-password" className="text-sm text-navy/70 hover:text-electric transition-colors font-bold">
                    Forgot password?
                    </Link>
                </div>
                </div>
            </div>

            <Button type="submit" className="w-full h-14 bg-navy hover:bg-navy/90 text-white font-bold text-lg rounded-xl shadow-lg shadow-navy/20 hover:shadow-xl hover:shadow-navy/30 hover:-translate-y-0.5 transition-all duration-300" isLoading={isLoading}>
              Sign In
            </Button>
            
            <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-100"></span>
                </div>
                <div className="relative flex justify-center text-xs font-bold uppercase tracking-widest">
                    <span className="bg-white px-4 text-gray-400">Or continue with</span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <button
                    type="button"
                    onClick={() => signIn('google', { callbackUrl: '/' })}
                    className="flex items-center justify-center gap-3 px-4 py-3.5 border border-gray-200 rounded-xl bg-white hover:bg-gray-50 hover:border-gray-300 transition-all hover:-translate-y-0.5 text-navy text-sm font-bold shadow-sm group"
                >
                    <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
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
                    className="flex items-center justify-center gap-3 px-4 py-3.5 border border-gray-200 rounded-xl bg-white hover:bg-gray-50 hover:border-gray-300 transition-all hover:-translate-y-0.5 text-navy text-sm font-bold shadow-sm group"
                >
                    <svg className="w-5 h-5 text-[#1877F2] group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.791-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    Facebook
                </button>
            </div>
          </form>

          <div className="text-center text-gray-500 text-sm font-medium">
            Don't have an account?{' '}
            <Link href="/auth/register" className="text-electric hover:text-navy transition-colors font-bold">
              Create Account
            </Link>
          </div>

          <div className="text-center text-sm mt-8 pt-8 border-t border-gray-100">
            <p className="text-gray-400 mb-4 font-bold uppercase tracking-widest text-[10px]">Are you a fleet owner?</p>
            <Link href="/auth/partner-register" className="inline-flex items-center gap-3 text-navy hover:text-electric transition-colors font-bold text-sm bg-gray-50 border border-gray-200 px-6 py-3.5 rounded-xl hover:bg-white hover:border-electric/30 hover:shadow-lg group">
              <span className="w-2 h-2 rounded-full bg-gold group-hover:animate-pulse transition-colors" />
              Apply to become a Partner
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
