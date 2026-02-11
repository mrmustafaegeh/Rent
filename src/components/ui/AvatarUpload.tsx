'use client';

import React, { useState, useRef } from 'react';
import { Camera, Loader2, User } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'react-hot-toast';

interface AvatarUploadProps {
  value?: string;
  onChange: (value: string) => void;
  className?: string;
  firstName?: string;
  lastName?: string;
}

export default function AvatarUpload({ 
  value, 
  onChange, 
  className = '',
  firstName = '',
  lastName = ''
}: AvatarUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file');
        return;
    }

    // Validate size (e.g., 5MB)
    if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Upload failed');
      }
      
      onChange(data.url);
      toast.success('Profile photo updated');

    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(error.message || 'Failed to upload image');
    } finally {
      setIsUploading(false);
      // Reset input so same file can be selected again if needed
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const initials = `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();

  return (
    <div className={`relative group w-32 h-32 md:w-40 md:h-40 mx-auto ${className}`}>
      <div 
        onClick={() => !isUploading && fileInputRef.current?.click()}
        className={`
          relative w-full h-full rounded-full overflow-hidden border-4 border-white shadow-xl 
          cursor-pointer transition-all duration-300
          ${isUploading ? 'opacity-50' : 'group-hover:opacity-90'}
        `}
      >
        {value ? (
          <Image
            src={value}
            alt="Profile"
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-navy to-blue-900 flex items-center justify-center text-gold text-3xl font-bold">
            {initials || <User className="w-12 h-12" />}
          </div>
        )}

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Camera className="w-8 h-8 text-white" />
        </div>

        {/* Loading Spinner */}
        {isUploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                <Loader2 className="w-8 h-8 text-white animate-spin" />
            </div>
        )}
      </div>

      {/* Edit Button Badge */}
      <button
        type="button"
        onClick={() => !isUploading && fileInputRef.current?.click()}
        className="absolute bottom-1 right-1 w-10 h-10 bg-gold text-navy rounded-full shadow-lg border-2 border-white flex items-center justify-center hover:bg-white hover:text-navy transition-colors z-10"
      >
        <Camera className="w-5 h-5" />
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
        disabled={isUploading}
      />
    </div>
  );
}
