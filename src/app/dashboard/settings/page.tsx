'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import ImageUpload from '@/components/ui/ImageUpload';

export default function SettingsPage() {
  const { user, login } = useAuth(); // login used to update context if needed, but better to fetch fresh data
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  
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
    setMessage('');

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
        setMessage('Profile updated successfully!');
        // Optionally trigger a re-fetch or context update here
      } else {
        setMessage('Failed to update profile');
      }
    } catch (error) {
      setMessage('Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      // Note: You need an endpoint for this. Assuming /api/users/change-password exists based on previous code
      // If not, we need to create it.
      const res = await fetch('/api/users/change-password', {
        method: 'POST', // Or PUT /api/auth/update-password
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });

      if (res.ok) {
        setMessage('Password changed successfully!');
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        setMessage('Failed to change password');
      }
    } catch (error) {
      setMessage('Error changing password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-white">Account Settings</h1>

      {message && (
        <div className={`mb-6 p-4 rounded-lg flex items-center gap-2 ${
          message.toLowerCase().includes('success') 
            ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
            : 'bg-red-500/10 text-red-400 border border-red-500/20'
        }`}>
          <span>{message}</span>
        </div>
      )}

      {/* Profile Settings */}
      <div className="bg-[var(--surface-light)] rounded-xl border border-[var(--border)] p-8 mb-8">
        <h2 className="text-xl font-bold mb-6 text-white flex items-center gap-2">
            <svg className="w-5 h-5 text-[var(--primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            Personal Information
        </h2>
        <form onSubmit={handleProfileUpdate} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Input
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
            <Input
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
             <Input
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                disabled
                className="opacity-50 cursor-not-allowed"
            />
            <Input
                label="Phone Number"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 (555) 000-0000"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-[var(--text-secondary)]">Profile Image</label>
            <ImageUpload 
              value={formData.image ? [formData.image] : []}
              onChange={(urls) => setFormData(prev => ({ ...prev, image: urls[0] || '' }))}
              multiple={false}
            />
          </div>

          <h3 className="text-lg font-semibold text-white mt-8 mb-4 border-b border-[var(--border)] pb-2">Address</h3>
          <Input
            label="Street Address"
            name="street"
            value={formData.street}
            onChange={handleChange}
            placeholder="123 Main St"
          />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Input
                label="City"
                name="city"
                value={formData.city}
                onChange={handleChange}
            />
            <Input
                label="State"
                name="state"
                value={formData.state}
                onChange={handleChange}
            />
            <Input
                label="Zip Code"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
            />
            <Input
                label="Country"
                name="country"
                value={formData.country}
                onChange={handleChange}
            />
          </div>

          <h3 className="text-lg font-semibold text-white mt-8 mb-4 border-b border-[var(--border)] pb-2">Preferences</h3>
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer group">
                <input 
                    type="checkbox" 
                    name="newsletter"
                    checked={formData.newsletter}
                    onChange={handleChange}
                    className="w-5 h-5 rounded border-gray-600 bg-[var(--surface)] text-[var(--primary)] focus:ring-[var(--primary)]"
                />
                <span className="text-[var(--text-secondary)] group-hover:text-white transition-colors">Subscribe to newsletter</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
                <input 
                    type="checkbox" 
                    name="smsNotifications"
                    checked={formData.smsNotifications}
                    onChange={handleChange}
                    className="w-5 h-5 rounded border-gray-600 bg-[var(--surface)] text-[var(--primary)] focus:ring-[var(--primary)]"
                />
                <span className="text-[var(--text-secondary)] group-hover:text-white transition-colors">Enable SMS notifications</span>
            </label>
          </div>

          <div className="pt-4 flex justify-end">
             <Button type="submit" isLoading={loading}>
                Save Changes
             </Button>
          </div>
        </form>
      </div>

      {/* Password Change */}
      <div className="bg-[var(--surface-light)] rounded-xl border border-[var(--border)] p-8 mb-8">
        <h2 className="text-xl font-bold mb-6 text-white flex items-center gap-2">
            <svg className="w-5 h-5 text-[var(--primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
            Security
        </h2>
        <form onSubmit={handlePasswordChange} className="space-y-6">
          <Input
            label="Current Password"
            name="currentPassword"
            type="password"
            value={passwordData.currentPassword}
            onChange={handlePasswordChangeInput}
            required
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
            />
            <Input
                label="Confirm New Password"
                name="confirmPassword"
                type="password"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChangeInput}
                required
                minLength={6}
            />
          </div>

          <div className="pt-4 flex justify-end">
            <Button type="submit" isLoading={loading} variant="outline">
                Update Password
            </Button>
          </div>
        </form>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-500/5 rounded-xl border border-red-500/20 p-8 mt-8">
        <h2 className="text-xl font-bold text-red-400 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            Danger Zone
        </h2>
        <p className="text-[var(--text-secondary)] mb-6 text-sm">
          Once you delete your account, there is no going back. This will permanently delete your profile and remove your data from our servers.
        </p>
        <Button variant="outline" className="border-red-500/50 text-red-400 hover:bg-red-500/10 hover:border-red-500">
          Delete Account
        </Button>
      </div>
    </div>
  );
}
