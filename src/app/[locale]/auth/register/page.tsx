'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import OptimizedImage from '@/components/ui/OptimizedImage';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function RegisterPage() {
  const t = useTranslations('Auth.register');
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
        setError(t('error.match'));
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
        setError(data.error || t('error.failed'));
      }
    } catch (err) {
      setError(t('error.unexpected'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-navy">
      {/* Background with Overlay */}
      <div className="absolute inset-0 z-0">
         <OptimizedImage
           src="/images/auth-sidebar.png"
           alt="Background"
           fill
           className="w-full h-full object-cover opacity-40 scale-105"
           priority
         />
         <div className="absolute inset-0 bg-gradient-to-b from-navy/80 via-navy/60 to-navy/90" />
      </div>

      {/* Glass Card */}
      <div className="relative z-10 w-full max-w-lg p-8 md:p-10 bg-black/30 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl animate-in fade-in zoom-in-95 duration-500">
        
        {/* Header */}
        <div className="text-center mb-8 space-y-2">
            <h1 className="text-4xl font-heading font-black text-white tracking-tight">{t('title')}</h1>
            <p className="text-gray-300 font-medium">{t('subtitle')}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-4 bg-red-500/10 text-red-200 border border-red-500/20 rounded-xl text-sm font-medium flex items-center gap-3 backdrop-blur-sm">
                 <span className="w-2 h-2 rounded-full bg-red-400 shrink-0" />
                 {error}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">{t('firstName')}</label>
                    <Input
                        id="firstName"
                        type="text"
                        placeholder="John"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-500 focus:bg-white/15 h-12 rounded-xl focus:border-gold/50 focus:ring-gold/20 transition-all font-bold"
                    />
                </div>
                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">{t('lastName')}</label>
                    <Input
                        id="lastName"
                        type="text"
                        placeholder="Doe"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-500 focus:bg-white/15 h-12 rounded-xl focus:border-gold/50 focus:ring-gold/20 transition-all font-bold"
                    />
                </div>
            </div>

            <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">{t('email')}</label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:bg-white/10 h-12 rounded-xl focus:border-gold/50 focus:ring-gold/20 transition-all font-medium"
                />
            </div>

            <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">{t('phone')}</label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 234 567 8900"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:bg-white/10 h-12 rounded-xl focus:border-gold/50 focus:ring-gold/20 transition-all font-medium"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">{t('password')}</label>
                    <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-500 focus:bg-white/15 h-12 rounded-xl focus:border-gold/50 focus:ring-gold/20 transition-all font-bold"
                    />
                </div>
                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">{t('confirmPassword')}</label>
                     <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="••••••••"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-500 focus:bg-white/15 h-12 rounded-xl focus:border-gold/50 focus:ring-gold/20 transition-all font-bold"
                      />
                </div>
            </div>

            <Button 
                type="submit" 
                className="w-full h-12 mt-4 bg-gradient-to-r from-gold to-amber-500 hover:from-amber-400 hover:to-gold text-navy font-black text-lg rounded-xl shadow-lg shadow-gold/10 hover:shadow-gold/20 hover:-translate-y-0.5 transition-all duration-300" 
                isLoading={isLoading}
            >
                {t('submit')}
            </Button>

            <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-white/10"></span>
                </div>
                <div className="relative flex justify-center text-[10px] font-black uppercase tracking-widest">
                    <span className="bg-transparent px-4 text-gray-500 backdrop-blur-xl">Or continue with</span>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
                <button
                    type="button"
                    onClick={() => signIn('google', { callbackUrl: '/' })}
                    className="flex flex-col items-center justify-center gap-2 px-3 py-3 border border-white/10 rounded-xl bg-white/5 hover:bg-white/10 transition-all hover:-translate-y-0.5 text-white text-xs font-bold group"
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
                    className="flex flex-col items-center justify-center gap-2 px-3 py-3 border border-white/10 rounded-xl bg-white/5 hover:bg-white/10 transition-all hover:-translate-y-0.5 text-white text-xs font-bold group"
                >
                    <svg className="w-5 h-5 text-[#1877F2] group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.791-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    Facebook
                </button>
                <button
                    type="button"
                    onClick={() => signIn('apple', { callbackUrl: '/' })}
                    className="flex flex-col items-center justify-center gap-2 px-3 py-3 border border-white/10 rounded-xl bg-white/5 hover:bg-white/10 transition-all hover:-translate-y-0.5 text-white text-xs font-bold group"
                >
                    <svg className="w-5 h-5 text-white group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-.38-.18-1.07-.38-1.98-.38-.89 0-1.57.19-1.91.35-1.09.52-2.12.57-3.13.43-2.61-.37-5.11-4.43-5.11-8.52 0-3.79 2.1-5.78 4.14-5.78 1.07 0 1.84.42 2.45.85.58.4 1.15.8 1.95.8.79 0 1.25-.42 2.15-.9.99-.54 1.85-.75 2.53-.75.76 0 2.92.23 4.25 2.22-3.48 1.93-2.91 6.3 1.14 7.96-.64 1.74-1.52 3.32-3.36 3.22zM15.22 3.6c.06-1.8 1.48-3.23 3.03-3.6.43 2.01-1.68 3.59-3.03 3.6z"/>
                    </svg>
                    Apple
                </button>
            </div>
        </form>

        <div className="text-center mt-8 pt-8 border-t border-white/10 text-gray-400 text-sm">
            <p className="mb-2">{t('partner.title')}</p>
            <Link href="/auth/partner-register" className="inline-flex items-center gap-2 text-electric hover:text-white transition-all font-black uppercase tracking-widest text-xs group">
                {t('partner.cta')} <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </Link>
        </div>
      </div>
    </div>
  );
}
