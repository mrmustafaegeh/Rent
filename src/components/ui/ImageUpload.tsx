'use client';

import React, { useState, useCallback } from 'react';
import OptimizedImage from '@/components/ui/OptimizedImage';

interface ImageUploadProps {
  value: string[];
  onChange: (value: string[]) => void;
  multiple?: boolean;
  className?: string;
  maxFiles?: number;
}

export default function ImageUpload({ 
  value = [], 
  onChange, 
  multiple = false, 
  className = '',
  maxFiles = 5
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const onDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await handleUpload(e.dataTransfer.files);
    }
  };

  const handleUpload = async (files: FileList) => {
    setIsUploading(true);
    const newUrls: string[] = [];

    // Convert FileList to Array
    const fileArray = Array.from(files);

    try {
      // Upload each file
      const uploadPromises = fileArray.map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);

        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Upload failed');
        
        return data.url;
      });

      const results = await Promise.all(uploadPromises);
      
      // Filter out failures
      const validUrls = results.filter((url): url is string => !!url);
      
      // Update parent state
      if (multiple) {
        onChange([...value, ...validUrls]);
      } else {
        onChange([validUrls[0]]); // Replace if single mode
      }

    } catch (error: any) {
      console.error('Upload error:', error);
      alert(error.message || 'Failed to upload image(s). Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = (urlToRemove: string) => {
    onChange(value.filter((url) => url !== urlToRemove));
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => document.getElementById('image-upload-input')?.click()}
        className={`
          relative border-2 border-dashed rounded-xl p-8 transition-all duration-300 cursor-pointer text-center
          ${isDragging 
            ? 'border-[var(--primary)] bg-[var(--primary)]/10 scale-[1.02]' 
            : 'border-[var(--border)] hover:border-[var(--primary)] hover:bg-[var(--surface-light)]'
          }
        `}
      >
        <input
          id="image-upload-input"
          type="file"
          accept="image/*"
          multiple={multiple}
          className="hidden"
          onChange={(e) => e.target.files && handleUpload(e.target.files)}
          disabled={isUploading}
        />
        
        <div className="flex flex-col items-center justify-center gap-3">
          {isUploading ? (
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--primary)] mb-2"></div>
              <p className="text-sm text-[var(--text-secondary)]">Uploading...</p>
            </div>
          ) : (
            <>
              <div className="bg-[var(--surface)] p-3 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[var(--primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-white">Click or drag images here</p>
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  Supports JPG, PNG, WEBP (Max 5MB)
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {value.length > 0 && (
        <div className={`grid gap-4 ${multiple ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4' : 'grid-cols-1 w-full max-w-xs'}`}>
          {value.map((url, index) => (
            <div key={`${url}-${index}`} className="group relative aspect-[4/3] rounded-lg overflow-hidden border border-[var(--border)] bg-[var(--surface-light)]">
              <OptimizedImage
                src={url}
                alt="Uploaded image"
                fill
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(url);
                  }}
                  className="bg-red-500/90 text-white p-2 rounded-full hover:bg-red-600 transition-colors transform hover:scale-110"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
