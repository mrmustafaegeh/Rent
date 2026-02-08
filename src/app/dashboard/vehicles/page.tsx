'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import OptimizedImage from '@/components/ui/OptimizedImage';
import { useAuth } from '@/context/AuthContext';

interface Vehicle {
  _id: string;
  brand: string;
  vehicleModel: string;
  year: number;
  category: string;
  pricing: { daily: number };
  images: { url: string }[];
  available: boolean;
  status: string; // Assuming we might add status
}

export default function AdminVehiclesPage() {
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const res = await fetch('/api/vehicles');
        const data = await res.json();
        if (data.success) {
          setVehicles(data.vehicles || []);
        }
      } catch (error) {
        console.error('Failed to fetch vehicles');
      } finally {
        setIsLoading(false);
      }
    };
    fetchVehicles();
  }, []);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Manage Fleet</h1>
        <Link href="/dashboard/vehicles/new">
          <Button variant="default">Add New Vehicle</Button>
        </Link>
      </div>

      <div className="bg-[var(--surface-light)] rounded-xl border border-[var(--border)] overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[var(--surface-lighter)]">
              <th className="p-4 text-xs font-semibold text-[var(--text-muted)] uppercase">Vehicle</th>
              <th className="p-4 text-xs font-semibold text-[var(--text-muted)] uppercase">Category</th>
              <th className="p-4 text-xs font-semibold text-[var(--text-muted)] uppercase">Price/Day</th>
              <th className="p-4 text-xs font-semibold text-[var(--text-muted)] uppercase">Status</th>
              <th className="p-4 text-xs font-semibold text-[var(--text-muted)] uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {vehicles.map((vehicle) => (
              <tr key={vehicle._id} className="hover:bg-[var(--surface-lighter)]/50 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[var(--surface)] rounded overflow-hidden relative shrink-0">
                      <OptimizedImage 
                        src={vehicle.images?.[0]?.url || ''} 
                        alt={`${vehicle.brand} ${vehicle.vehicleModel}`}
                        fill 
                        className="w-full h-full object-cover"
                        sizes="48px"
                      />
                    </div>
                    <div>
                      <div className="font-medium text-white">{vehicle.brand} {vehicle.vehicleModel}</div>
                      <div className="text-xs text-[var(--text-muted)]">{vehicle.year}</div>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-sm text-[var(--text-secondary)]">{vehicle.category}</td>
                <td className="p-4 text-sm font-bold text-white">${vehicle.pricing.daily}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs ${
                    vehicle.available ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'
                  }`}>
                    {vehicle.available ? 'Available' : 'Unavailable'}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <Link href={`/dashboard/vehicles/${vehicle._id}/edit`}>
                      <Button variant="ghost" size="sm" className="h-8 px-2 hover:text-primary hover:bg-primary/10">Edit</Button>
                    </Link>
                    <Link href={`/dashboard/vehicles/${vehicle._id}/schedule`}>
                        <Button variant="ghost" size="sm" className="h-8 px-2 hover:text-blue-500 hover:bg-blue-500/10">Schedule</Button>
                    </Link>
                    <Button variant="ghost" size="sm" className="h-8 px-2 text-red-500 hover:text-red-600 hover:bg-red-500/10">Delete</Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {vehicles.length === 0 && (
          <div className="p-8 text-center text-[var(--text-muted)]">
            No vehicles found. Add your first one!
          </div>
        )}
      </div>
    </div>
  );
}
