'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function DashboardOverview() {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalBookings: 0,
        activeVehicles: 3, // Hardcoded for now or fetch
        totalRevenue: 0
    });

    useEffect(() => {
        const fetchStats = async () => {
             try {
                 // Fetch Bookings
                 const res = await fetch('/api/bookings');
                 const data = await res.json();
                 
                 let bookingCount = 0;
                 let revenue = 0;
                 let vehicleCount = 0;

                 if (data.success) {
                     const bookings = data.data;
                     bookingCount = bookings.length;
                     // For regular users, this is total spent. For admin, revenue.
                     revenue = bookings.reduce((acc: number, b: any) => acc + (b.totalPrice || 0), 0);
                 }
                 
                 // If admin, fetch vehicle count
                 if (user?.role === 'admin') {
                     const vRes = await fetch('/api/vehicles'); 
                     const vData = await vRes.json();
                     if (vData.success) {
                         vehicleCount = vData.pagination.total;
                     }
                 }

                 setStats({
                     totalBookings: bookingCount,
                     activeVehicles: vehicleCount,
                     totalRevenue: revenue
                 });

             } catch (error) {
                 console.error('Error fetching dashboard stats', error);
             }
        };
        
        if (user) {
            fetchStats();
        }
    }, [user]);

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
                    <p className="text-[var(--text-secondary)]">Welcome back, {user?.name}</p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[var(--surface-light)] p-6 rounded-xl border border-[var(--border)]">
                    <p className="text-sm text-[var(--text-muted)] mb-1">Total Bookings</p>
                    <p className="text-3xl font-bold text-white">{stats.totalBookings}</p>
                </div>
                {user?.role === 'admin' && (
                    <div className="bg-[var(--surface-light)] p-6 rounded-xl border border-[var(--border)]">
                        <p className="text-sm text-[var(--text-muted)] mb-1">Active Vehicles</p>
                        <p className="text-3xl font-bold text-white">{stats.activeVehicles}</p>
                    </div>
                )}
                <div className="bg-[var(--surface-light)] p-6 rounded-xl border border-[var(--border)]">
                    <p className="text-sm text-[var(--text-muted)] mb-1">{user?.role === 'admin' ? 'Total Revenue' : 'Total Spent'}</p>
                    <p className="text-3xl font-bold text-[var(--primary)]">${stats.totalRevenue.toLocaleString()}</p>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-[var(--surface-light)] rounded-xl border border-[var(--border)] p-6">
                <h3 className="text-xl font-bold text-white mb-4">Recent Activity</h3>
                <div className="text-center py-10 text-[var(--text-muted)]">
                    {stats.totalBookings > 0 
                        ? 'Check "My Bookings" for details.' 
                        : 'No recent activity found.'}
                </div>
            </div>
        </div>
    );
}
