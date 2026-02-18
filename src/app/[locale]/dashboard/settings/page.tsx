'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import AvatarUpload from '@/components/ui/AvatarUpload';
import { 
    User, 
    Lock, 
    Trash2, 
    Mail, 
    Phone, 
    MapPin, 
    Bell, 
    Shield, 
    Save,
    Settings,
    Activity,
    ShieldCheck,
    MailCheck,
    MessageSquare,
    Target,
    Zap,
    AlertTriangle,
    CheckCircle2,
    ArrowRight
} from 'lucide-react';
import { Separator } from '@/components/ui/Separator';
import { toast } from 'react-hot-toast';

export default function SettingsPage() {
  const { user } = useAuth(); 
  const [loading, setLoading] = useState(false);
  
  // Profile Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    image: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    newsletter: true,
    smsNotifications: true
  });

  // Password Form State
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Fetch latest user data on mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch('/api/auth/me');
        const data = await res.json();
        if (data.success && data.data) {
          const u = data.data;
          setFormData({
            firstName: u.firstName || '',
            lastName: u.lastName || '',
            email: u.email || '',
            phone: u.phone || '',
            image: u.image || '',
            street: u.address?.street || '',
            city: u.address?.city || '',
            state: u.address?.state || '',
            zipCode: u.address?.zipCode || '',
            country: u.address?.country || '',
            newsletter: u.preferences?.newsletter ?? true,
            smsNotifications: u.preferences?.smsNotifications ?? true
          });
        }
      } catch (err) {
        console.error('Failed to fetch user profile');
        toast.error("Telemetry sync failed");
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handlePasswordChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    const toastId = toast.loading('Synchronizing profile intelligence...');

    try {
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        image: formData.image,
        address: {
            street: formData.street,
            city: formData.city,
            state: formData.state,
            zipCode: formData.zipCode,
            country: formData.country
        },
        preferences: {
            newsletter: formData.newsletter,
            smsNotifications: formData.smsNotifications
        }
      };

      const res = await fetch('/api/auth/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        toast.success('Identity manifestation finalized', { id: toastId });
      } else {
        toast.error('Registry commitment failed', { id: toastId });
      }
    } catch (error) {
      toast.error('Identity system error', { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Encryption sequence mismatch');
      return;
    }

    setLoading(true);
    const toastId = toast.loading('Updating security protocols...');

    try {
      const res = await fetch('/api/users/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });

      if (res.ok) {
        toast.success('Security authorization updated', { id: toastId });
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        toast.error('Authentication protocol failed', { id: toastId });
      }
    } catch (error) {
      toast.error('Security system interference', { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-12 pb-24 w-full max-w-[1500px] mx-auto animate-in fade-in duration-700">
      
      {/* Premium Header */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-8">
        <div>
           <div className="flex items-center gap-2 text-[10px] font-black text-navy uppercase tracking-[0.2em] mb-2 px-3 py-1 bg-gray-100 rounded-full w-fit border border-gray-200">
             <Settings className="w-3 h-3" />
             Account Calibration
           </div>
           <h1 className="text-4xl md:text-5xl font-heading font-black text-navy tracking-tight">
             Identity <span className="text-electric">Parameters</span>
           </h1>
           <p className="text-gray-500 mt-2 font-medium">Manage your digital presence and authorization protocols.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Left Column: Avatar & Strategic Sections (4 cols) */}
        <div className="lg:col-span-4 space-y-10">
            
            {/* Identity Visualization */}
            <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-[0_15px_60px_rgba(0,0,0,0.03)] text-center relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-bl-[4rem] -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
                 <div className="relative z-10 flex flex-col items-center">
                    <div className="mb-8">
                        <AvatarUpload 
                            value={formData.image}
                            onChange={(url) => setFormData(prev => ({ ...prev, image: url }))}
                            firstName={formData.firstName}
                            lastName={formData.lastName}
                        />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-navy mb-1 tracking-tight">{formData.firstName} {formData.lastName}</h2>
                        <div className="flex items-center justify-center gap-2 text-gray-400">
                            <MailCheck className="w-4 h-4" />
                            <span className="text-xs font-bold break-all opacity-60">{formData.email}</span>
                        </div>
                    </div>
                 </div>
            </div>

            {/* Strategic Preferences */}
            <div className="bg-navy rounded-[3rem] p-10 text-white relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-[64px] group-hover:bg-white/10 transition-all duration-1000"></div>
                <div className="relative z-10 space-y-8">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gold/10 flex items-center justify-center border border-gold/20">
                             <Target className="w-6 h-6 text-gold" />
                        </div>
                        <h3 className="font-black text-xl tracking-tight">Engagement</h3>
                    </div>
                    
                    <div className="space-y-4">
                        <label className="flex items-center justify-between group cursor-pointer p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all border border-white/5">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                                    <Mail className="w-4 h-4 text-gray-400 group-hover:text-white" />
                                </div>
                                <span className="text-xs font-black uppercase tracking-widest">Newsletter Manifest</span>
                            </div>
                            <input 
                                type="checkbox" 
                                name="newsletter"
                                checked={formData.newsletter}
                                onChange={handleChange}
                                className="w-10 h-6 rounded-full appearance-none bg-white/20 checked:bg-gold transition-all cursor-pointer relative after:content-[''] after:absolute after:top-1 after:left-1 after:w-4 after:h-4 after:bg-white after:rounded-full after:transition-all checked:after:translate-x-4 border-none ring-0 outline-none"
                            />
                        </label>

                        <label className="flex items-center justify-between group cursor-pointer p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all border border-white/5">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                                    <MessageSquare className="w-4 h-4 text-gray-400 group-hover:text-white" />
                                </div>
                                <span className="text-xs font-black uppercase tracking-widest">Instant Telemetry</span>
                            </div>
                            <input 
                                type="checkbox" 
                                name="smsNotifications"
                                checked={formData.smsNotifications}
                                onChange={handleChange}
                                className="w-10 h-6 rounded-full appearance-none bg-white/20 checked:bg-gold transition-all cursor-pointer relative after:content-[''] after:absolute after:top-1 after:left-1 after:w-4 after:h-4 after:bg-white after:rounded-full after:transition-all checked:after:translate-x-4 border-none ring-0 outline-none"
                            />
                        </label>
                    </div>
                </div>
            </div>
        </div>

        {/* Right Column: Profile & Security (8 cols) */}
        <div className="lg:col-span-8 space-y-12">
            
            {/* Manifest Details */}
            <form onSubmit={handleProfileUpdate} className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-[0_15px_60px_rgba(0,0,0,0.03)] space-y-10">
                <div className="flex items-center justify-between gap-4 pb-8 border-b border-gray-50">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-electric/5 flex items-center justify-center text-electric">
                            <User className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-black text-navy text-xl tracking-tight">Profile Specification</h3>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Primary identity attributes</p>
                        </div>
                    </div>
                    <Button type="submit" isLoading={loading} className="bg-navy text-gold hover:bg-gold hover:text-navy h-14 px-8 rounded-2xl font-black text-[10px] uppercase tracking-widest border-none active:scale-95 shadow-xl shadow-navy/20 flex gap-3">
                        <Save className="w-4 h-4" /> COMMIT CHANGES
                    </Button>
                </div>
                
                <div className="grid md:grid-cols-2 gap-8">
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Given Name</label>
                        <Input
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                            className="bg-gray-50 border-transparent focus:bg-white focus:border-gray-100 h-14 rounded-2xl text-navy font-bold uppercase tracking-wider px-6"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Surname</label>
                        <Input
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            required
                            className="bg-gray-50 border-transparent focus:bg-white focus:border-gray-100 h-14 rounded-2xl text-navy font-bold uppercase tracking-wider px-6"
                        />
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Registry (ReadOnly)</label>
                        <div className="relative">
                            <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                            <Input
                                name="email"
                                type="email"
                                value={formData.email}
                                disabled
                                className="bg-gray-100/50 opacity-50 cursor-not-allowed h-14 rounded-2xl text-navy font-bold pl-14"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Contact Protocol</label>
                        <div className="relative">
                            <Phone className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                            <Input
                                name="phone"
                                type="tel"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="+1 (555) 000-0000"
                                className="bg-gray-50 border-transparent focus:bg-white focus:border-gray-100 h-14 rounded-2xl text-navy font-bold pl-14 tracking-widest"
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-8 pt-6 border-t border-gray-50">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-navy/5 flex items-center justify-center text-navy/40">
                            <MapPin className="w-5 h-5" />
                        </div>
                        <h4 className="font-black text-navy text-sm uppercase tracking-widest">Geographic Anchor</h4>
                    </div>
                    
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Location Address</label>
                            <Input
                                name="street"
                                value={formData.street}
                                onChange={handleChange}
                                placeholder="Manifest Zone Identifier"
                                className="bg-gray-50 border-transparent focus:bg-white focus:border-gray-100 h-14 rounded-2xl text-navy font-bold px-6"
                            />
                        </div>
                        
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">City Hub</label>
                                <Input name="city" value={formData.city} onChange={handleChange} className="bg-gray-50 border-transparent focus:bg-white h-14 rounded-2xl text-navy font-bold px-6" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Territory</label>
                                <Input name="state" value={formData.state} onChange={handleChange} className="bg-gray-50 border-transparent focus:bg-white h-14 rounded-2xl text-navy font-bold px-6" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Postcode</label>
                                <Input name="zipCode" value={formData.zipCode} onChange={handleChange} className="bg-gray-50 border-transparent focus:bg-white h-14 rounded-2xl text-navy font-bold px-6" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nation</label>
                                <Input name="country" value={formData.country} onChange={handleChange} className="bg-gray-50 border-transparent focus:bg-white h-14 rounded-2xl text-navy font-bold px-6" />
                            </div>
                        </div>
                    </div>
                </div>
            </form>

            {/* Security Clearance */}
            <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-[0_15px_60px_rgba(0,0,0,0.03)] space-y-10">
                <div className="flex items-center justify-between gap-4 pb-8 border-b border-gray-50">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600">
                            <Lock className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-black text-navy text-xl tracking-tight">Encryption Clearance</h3>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Rotate authentication credentials</p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handlePasswordChange} className="space-y-8">
                   <div className="grid md:grid-cols-3 gap-8">
                       <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Master Key</label>
                            <Input
                                name="currentPassword"
                                type="password"
                                placeholder="••••••••"
                                value={passwordData.currentPassword}
                                onChange={handlePasswordChangeInput}
                                required
                                className="bg-gray-50 border-transparent focus:bg-white h-14 rounded-2xl text-navy font-bold px-6"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Evolutionary Input</label>
                            <Input
                                name="newPassword"
                                type="password"
                                placeholder="New Key"
                                value={passwordData.newPassword}
                                onChange={handlePasswordChangeInput}
                                required
                                minLength={6}
                                className="bg-gray-50 border-transparent focus:bg-white h-14 rounded-2xl text-navy font-bold px-6"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Key Verification</label>
                            <Input
                                name="confirmPassword"
                                type="password"
                                placeholder="Repeat Key"
                                value={passwordData.confirmPassword}
                                onChange={handlePasswordChangeInput}
                                required
                                minLength={6}
                                className="bg-gray-50 border-transparent focus:bg-white h-14 rounded-2xl text-navy font-bold px-6"
                            />
                        </div>
                   </div>
                   
                   <Button type="submit" isLoading={loading} className="w-full h-14 bg-navy text-gold hover:bg-amber-600 hover:text-white font-black text-[10px] uppercase tracking-widest rounded-2xl shadow-xl shadow-navy/10 active:scale-95 border-none">
                      ROTATE AUTHENTICATION MANIFEST
                   </Button>
                </form>
            </div>

            {/* Termination Protocol */}
            <div className="bg-red-50 p-12 rounded-[3.5rem] border border-red-100 flex flex-col md:flex-row items-center justify-between gap-10 group relative overflow-hidden">
                <div className="absolute inset-0 pattern-grid opacity-[0.1] pointer-events-none"></div>
                <div className="relative z-10 space-y-4">
                    <div className="flex items-center gap-4">
                         <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-red-500 shadow-sm border border-red-100">
                             <Trash2 className="w-6 h-6" />
                         </div>
                         <h3 className="text-2xl font-black text-red-900 tracking-tight leading-none">Termination Protocol</h3>
                    </div>
                    <p className="text-red-900/40 text-sm font-medium max-w-lg leading-relaxed">
                      Initiating account decommissioning will result in permanent purging of all manifest history, identity records, and access tokens. This protocol is irreversible.
                    </p>
                </div>
                <button className="relative z-10 h-16 px-10 bg-red-500 text-white font-black text-[11px] uppercase tracking-widest rounded-2xl hover:bg-navy transition-all active:scale-95 shadow-2xl shadow-red-500/20">
                    AUTHORIZE DECOMMISSIONING
                </button>
            </div>
        </div>
      </div>
    </div>
  );
}
