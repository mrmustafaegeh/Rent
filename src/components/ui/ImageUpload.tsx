'use client';

import React, { useState, useCallback } from 'react';
import OptimizedImage from '@/components/ui/OptimizedImage';
import { Upload, X, Loader2 } from 'lucide-react';

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
      handleUpload(e.dataTransfer.files);
    }
  };

  const handleUpload = async (files: FileList) => {
    setIsUploading(true);
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
        onChange([...value, ...validUrls].slice(0, maxFiles));
      } else {
        onChange([validUrls[0]]); // Replace if single mode
      }

    } catch (error: any) {
      console.error('Upload error:', error);
      alert(error.message || 'Failed to upload image(s).');
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
          relative border-2 border-dashed rounded-2xl p-8 transition-all duration-500 ease-out cursor-pointer text-center group
          ${isDragging 
            ? 'border-navy bg-navy/5 scale-[1.01]' 
            : 'border-gray-200 hover:border-navy hover:bg-gray-50'
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
              <Loader2 className="w-8 h-8 text-navy animate-spin mb-2" />
              <p className="text-sm text-gray-400 font-bold">Uploading...</p>
            </div>
          ) : (
            <>
              <div className="bg-white p-4 rounded-full shadow-sm border border-gray-100 group-hover:scale-110 transition-transform duration-300">
                <Upload className="w-6 h-6 text-navy" />
              </div>
              <div>
                <p className="font-bold text-navy">Click or drag images here</p>
                <p className="text-xs text-gray-400 mt-1 font-medium">
                  {multiple ? `Up to ${maxFiles} images` : 'Single image'} • JPG, PNG, WEBP
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {value.length > 0 && (
        <div className={`grid gap-4 ${multiple ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4' : 'grid-cols-1 w-full'}`}>
          {value.map((url, index) => (
            <div key={`${url}-${index}`} className="group relative aspect-[4/3] rounded-xl overflow-hidden border border-gray-200 bg-gray-50 shadow-sm">
              <OptimizedImage
                src={url}
                alt={`Vehicle image ${index + 1}`}
                fill
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03] duration-500 ease-out will-change-transform"
              />
              <div className="absolute inset-0 bg-navy/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(url);
                  }}
                  className="bg-white text-red-500 p-2.5 rounded-xl hover:bg-red-50 transition-all transform hover:scale-110 shadow-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              {index === 0 && multiple && (
                <div className="absolute top-2 left-2 bg-gold text-navy text-[10px] font-black px-2 py-0.5 rounded shadow-sm">
                  PRIMARY
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
