'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import AvatarUpload from '@/components/ui/AvatarUpload';
import { User, Lock, Trash2, Mail, Phone, MapPin, Bell, Shield, Save } from 'lucide-react';
import { Separator } from '@/components/ui/Separator';

export default function SettingsPage() {
  const { user } = useAuth(); 
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  
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
    e.preventDefault();
    setLoading(true);
    setMessage(null);

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
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
      } else {
        setMessage({ type: 'error', text: 'Failed to update profile' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error updating profile' });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }

    setLoading(true);
    setMessage(null);

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
        setMessage({ type: 'success', text: 'Password changed successfully!' });
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        setMessage({ type: 'error', text: 'Failed to change password' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error changing password' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h1 className="text-3xl font-heading font-black text-navy">Account Settings</h1>
           <p className="text-gray-500 mt-1">Manage your personal information and security preferences.</p>
        </div>
      </div>

      {message && (
        <div className={`p-4 rounded-xl flex items-center gap-3 border ${
          message.type === 'success' 
            ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
            : 'bg-red-50 text-red-700 border-red-200'
        }`}>
          {message.type === 'success' ? <Shield className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
          <span className="font-medium">{message.text}</span>
        </div>
      )}

      {/* Profile Settings */}
      <form onSubmit={handleProfileUpdate} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Col: Avatar & Basic Info */}
        <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm text-center">
                 <div className="mb-6">
                    <label className="block text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Profile Photo</label>
                     <div className="flex justify-center -mt-6 mb-4">
                        <AvatarUpload 
                            value={formData.image}
                            onChange={(url) => setFormData(prev => ({ ...prev, image: url }))}
                            firstName={formData.firstName}
                            lastName={formData.lastName}
                        />
                    </div>
                 </div>
                 <div className="text-center">
                     <h2 className="text-xl font-bold text-navy">{formData.firstName} {formData.lastName}</h2>
                     <p className="text-gray-400 text-sm break-all">{formData.email}</p>
                 </div>
            </div>

             <div className="bg-navy rounded-3xl p-6 border border-navy shadow-lg shadow-navy/20 text-white">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-gold" /> Data Privacy
                </h3>
                <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                    Your data is stored securely. We do not share your personal information with third parties without your consent.
                </p>
                <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer group p-2 rounded-lg hover:bg-white/5 transition-colors">
                        <input 
                            type="checkbox" 
                            name="newsletter"
                            checked={formData.newsletter}
                            onChange={handleChange}
                            className="w-5 h-5 rounded border-white/30 bg-white/10 text-gold focus:ring-gold"
                        />
                        <span className="text-gray-200 text-sm font-medium">Subscribe to newsletter</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer group p-2 rounded-lg hover:bg-white/5 transition-colors">
                        <input 
                            type="checkbox" 
                            name="smsNotifications"
                            checked={formData.smsNotifications}
                            onChange={handleChange}
                            className="w-5 h-5 rounded border-white/30 bg-white/10 text-gold focus:ring-gold"
                        />
                        <span className="text-gray-200 text-sm font-medium">Enable SMS notifications</span>
                    </label>
                </div>
            </div>
        </div>

        {/* Right Col: Detailed Form */}
        <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                    <div className="w-10 h-10 rounded-full bg-navy/5 flex items-center justify-center text-navy">
                        <User className="w-5 h-5" />
                    </div>
                    <h2 className="text-xl font-bold text-navy">Personal Details</h2>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <Input
                        label="First Name"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        className="bg-gray-50"
                    />
                    <Input
                        label="Last Name"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                         className="bg-gray-50"
                    />
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                     <div className="relative">
                        <Mail className="absolute left-3 top-[34px] w-4 h-4 text-gray-400 z-10" />
                        <Input
                            label="Email Address"
                            name="email"
                            type="email"
                            value={formData.email}
                            disabled
                            className="bg-gray-100 opacity-70 cursor-not-allowed pl-9"
                        />
                    </div>
                    <div className="relative">
                        <Phone className="absolute left-3 top-[34px] w-4 h-4 text-gray-400 z-10" />
                         <Input
                            label="Phone Number"
                            name="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="+1 (555) 000-0000"
                            className="bg-gray-50 pl-9"
                        />
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                 <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                    <div className="w-10 h-10 rounded-full bg-navy/5 flex items-center justify-center text-navy">
                        <MapPin className="w-5 h-5" />
                    </div>
                    <h2 className="text-xl font-bold text-navy">Address Information</h2>
                </div>
                <div className="space-y-6">
                    <Input
                        label="Street Address"
                        name="street"
                        value={formData.street}
                        onChange={handleChange}
                        placeholder="123 Main St"
                         className="bg-gray-50"
                    />
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <Input
                             label="City"
                             name="city"
                             value={formData.city}
                             onChange={handleChange}
                              className="bg-gray-50"
                        />
                        <Input
                             label="State"
                             name="state"
                             value={formData.state}
                             onChange={handleChange}
                              className="bg-gray-50"
                        />
                        <Input
                             label="Zip Code"
                             name="zipCode"
                             value={formData.zipCode}
                             onChange={handleChange}
                              className="bg-gray-50"
                        />
                        <Input
                             label="Country"
                             name="country"
                             value={formData.country}
                             onChange={handleChange}
                              className="bg-gray-50"
                        />
                    </div>
                </div>
                
                <div className="mt-8 flex justify-end">
                     <Button type="submit" isLoading={loading} className="bg-navy text-gold hover:bg-navy/90 font-bold px-8 h-12 rounded-xl shadow-lg shadow-navy/20">
                        <Save className="w-4 h-4 mr-2" /> Save Changes
                     </Button>
                </div>
            </div>
        </div>
      </form>

      {/* Security Section */}
      <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
            <div className="w-10 h-10 rounded-full bg-navy/5 flex items-center justify-center text-navy">
                <Lock className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-navy">Security Settings</h2>
        </div>

        <form onSubmit={handlePasswordChange} className="max-w-2xl">
           <div className="space-y-6">
               <Input
                    label="Current Password"
                    name="currentPassword"
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChangeInput}
                    required
                     className="bg-gray-50"
                />

                <div className="grid md:grid-cols-2 gap-6">
                    <Input
                        label="New Password"
                        name="newPassword"
                        type="password"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChangeInput}
                        required
                        minLength={6}
                         className="bg-gray-50"
                    />
                    <Input
                        label="Confirm New Password"
                        name="confirmPassword"
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChangeInput}
                        required
                        minLength={6}
                         className="bg-gray-50"
                    />
                </div>
                
                <div className="pt-2">
                    <Button type="submit" isLoading={loading} variant="outline" className="border-gray-200 hover:border-navy text-navy font-bold h-11 px-6 rounded-xl">
                        Update Password
                    </Button>
                </div>
           </div>
        </form>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-50 rounded-3xl p-8 border border-red-100">
        <div className="flex items-center gap-3 mb-4">
             <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-500">
                <Trash2 className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-red-700">Danger Zone</h2>
        </div>
        <p className="text-red-600/70 mb-6 text-sm max-w-2xl font-medium">
          Once you delete your account, there is no going back. This will permanently delete your profile, booking history, and remove your data from our servers.
        </p>
        <Button variant="outline" className="bg-white border-red-200 text-red-500 hover:bg-red-500 hover:text-white hover:border-red-500 font-bold h-11 px-6 rounded-xl transition-all shadow-sm">
          Delete Account
        </Button>
      </div>
    </div>
  );
}
