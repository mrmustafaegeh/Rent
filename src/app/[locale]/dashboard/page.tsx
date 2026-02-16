'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { 
    TrendingUp, 
    Users, 
    Car, 
    Calendar, 
    ArrowRight, 
    DollarSign,
    Plus,
    Activity
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function DashboardOverview() {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalBookings: 0,
        activeVehicles: 0,
        totalRevenue: 0,
        recentBookings: [] as any[]
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
             try {
                 // Parallel fetch for efficiency
                 const [bookingsRes, vehiclesRes] = await Promise.all([
                     fetch('/api/bookings'),
                     user?.role === 'admin' || user?.role === 'company_owner' ? fetch(user?.role === 'admin' ? '/api/vehicles' : '/api/vehicles?my=true&limit=100') : Promise.resolve(null)
                 ]);

                 const bookingsData = await bookingsRes.json();
                 const vehiclesData = vehiclesRes ? await vehiclesRes.json() : null;
                 
                 let bookingCount = 0;
                 let revenue = 0;
                 let vehicleCount = 0;
                 let recent = [];

                 if (bookingsData.success) {
                     const bookings = bookingsData.data;
                     bookingCount = bookings.length;
                     revenue = bookings.reduce((acc: number, b: any) => acc + (b.totalPrice || 0), 0);
                     // Sort by date desc
                     const sorted = bookings.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                     recent = sorted.slice(0, 5);
                 }
                 
                 if (vehiclesData && vehiclesData.success) {
                      vehicleCount = vehiclesData.vehicles?.length || 0;
                 }

                 setStats({
                     totalBookings: bookingCount,
                     activeVehicles: vehicleCount,
                     totalRevenue: revenue,
                     recentBookings: recent
                 });

             } catch (error) {
                 console.error('Error fetching dashboard stats', error);
             } finally {
                 setIsLoading(false);
             }
        };
        
        if (user) {
            fetchStats();
        }
    }, [user]);

    const statCards = [
        {
            label: (user?.role === 'admin' || user?.role === 'company_owner') ? 'Total Revenue' : 'Total Spent',
            value: `€${stats.totalRevenue.toLocaleString()}`,
            icon: DollarSign,
            color: 'text-emerald-500',
            bg: 'bg-emerald-50',
            trend: '+12% from last month' // Mock trend
        },
        {
            label: 'Total Bookings',
            value: stats.totalBookings,
            icon: Calendar,
            color: 'text-blue-500',
            bg: 'bg-blue-50',
            trend: '+5 new this week'
        },
        ...((user?.role === 'admin' || user?.role === 'company_owner') ? [{
            label: 'Active Fleet',
            value: stats.activeVehicles,
            icon: Car,
            color: 'text-purple-500',
            bg: 'bg-purple-50',
            trend: '3 vehicles in maintenance'
        }] : [])
    ];

    if (isLoading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-navy"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h1 className="text-3xl font-heading font-black text-navy tracking-tight">Overview</h1>
                    <p className="text-gray-500 mt-1">
                        Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}, 
                        <span className="font-bold text-navy"> {user?.firstName}</span>.
                    </p>
                </div>
                <div className="flex gap-2">
                    {user?.role === 'admin' && (
                        <Link href="/dashboard/vehicles/new">
                            <Button className="bg-navy text-gold hover:bg-navy/90 gap-2 font-bold shadow-lg shadow-navy/20 pl-4 pr-6 h-11 rounded-xl">
                                <Plus className="w-4 h-4" /> Add Vehicle
                            </Button>
                        </Link>
                    )}
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {statCards.map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all group hover:-translate-y-1 duration-300">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${stat.bg} ${stat.color}`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <span className="text-[10px] font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded-lg group-hover:bg-gray-100 transition-colors uppercase tracking-wider">
                                30 Days
                            </span>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{stat.label}</p>
                            <h3 className="text-3xl font-black text-navy tracking-tight">{stat.value}</h3>
                            <p className="text-xs font-medium text-gray-400 mt-2 flex items-center gap-1">
                                <TrendingUp className="w-3 h-3 text-emerald-500" />
                                <span className="text-emerald-500 font-bold">{stat.trend.split(' ')[0]}</span>
                                <span>{stat.trend.split(' ').slice(1).join(' ')}</span>
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Bookings List */}
                <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm p-8 flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-black text-navy flex items-center gap-2">
                            <Activity className="w-5 h-5 text-electric" /> Recent Activity
                        </h3>
                        <Link href={user?.role === 'admin' ? "/dashboard/all-bookings" : "/dashboard/bookings"} className="text-sm font-bold text-electric hover:text-navy transition-colors flex items-center gap-1">
                            View All <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                    
                    {stats.recentBookings.length === 0 ? (
                        <div className="text-center py-10 text-gray-400 flex-1 flex flex-col items-center justify-center">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                <Calendar className="w-8 h-8 text-gray-300" />
                            </div>
                            <p>No recent bookings found.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {stats.recentBookings.map((booking) => (
                                <div key={booking._id} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100 group cursor-pointer">
                                    <div className="w-12 h-12 bg-navy/5 rounded-xl flex flex-col items-center justify-center font-bold text-navy text-xs shrink-0 group-hover:bg-navy group-hover:text-gold transition-colors">
                                        <span className="text-lg leading-none">{new Date(booking.startDate).getDate()}</span>
                                        <span className="text-[9px] uppercase tracking-wider opacity-70">
                                            {new Date(booking.startDate).toLocaleString('default', { month: 'short' })}
                                        </span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-bold text-navy truncate text-sm">
                                            {booking.vehicle?.brand} {booking.vehicle?.vehicleModel}
                                        </h4>
                                        <p className="text-xs text-gray-400 flex items-center gap-2 mt-0.5">
                                            <span className="truncate max-w-[150px] font-medium text-gray-500">
                                                {booking.customer && typeof booking.customer === 'object' ? `${booking.customer.firstName} ${booking.customer.lastName}` : 'Guest'}
                                            </span>
                                            <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                                            <span className="font-mono text-gray-300 text-[10px]">{booking.bookingNumber}</span>
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-bold text-navy text-sm">€{booking.totalPrice}</div>
                                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full inline-block mt-1 ${
                                            booking.status === 'confirmed' ? 'bg-emerald-100 text-emerald-600' :
                                            booking.status === 'pending' ? 'bg-amber-100 text-amber-600' : 'bg-gray-100 text-gray-500'
                                        }`}>
                                            {booking.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Quick Actions / Notifications */}
                <div className="bg-navy text-white rounded-3xl shadow-xl shadow-navy/20 p-8 relative overflow-hidden flex flex-col">
                    {/* Background Pattern */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-electric/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-40 h-40 bg-gold/10 rounded-full blur-2xl translate-y-1/3 -translate-x-1/3"></div>
                    
                    <h3 className="text-xl font-black text-white mb-6 relative z-10 flex items-center gap-2">
                        <span className="w-1 h-6 bg-gold rounded-full"></span>
                        Quick Actions
                    </h3>
                    
                    <div className="space-y-3 relative z-10 flex-1">
                        {(user?.role === 'admin' || user?.role === 'company_owner') ? (
                            <>
                                <Link href="/dashboard/vehicles/new" className="block">
                                    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all cursor-pointer group">
                                        <div className="w-8 h-8 rounded-lg bg-gold/20 flex items-center justify-center text-gold group-hover:scale-110 transition-transform">
                                            <Plus className="w-4 h-4" />
                                        </div>
                                        <span className="font-bold text-sm">Add New Vehicle</span>
                                    </div>
                                </Link>
                                <Link href="/dashboard/all-bookings" className="block">
                                    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all cursor-pointer group">
                                        <div className="w-8 h-8 rounded-lg bg-blue-400/20 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                                            <Calendar className="w-4 h-4" />
                                        </div>
                                        <span className="font-bold text-sm">Review Requests</span>
                                    </div>
                                </Link>
                                {user?.role === 'admin' && (
                                <Link href="/dashboard/users" className="block">
                                    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all cursor-pointer group">
                                        <div className="w-8 h-8 rounded-lg bg-purple-400/20 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                                            <Users className="w-4 h-4" />
                                        </div>
                                        <span className="font-bold text-sm">Manage Users</span>
                                    </div>
                                </Link>
                                )}
                            </>
                        ) : (
                            <>
                                <Link href="/cars" className="block">
                                    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all cursor-pointer group">
                                         <div className="w-8 h-8 rounded-lg bg-emerald-400/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                                            <Car className="w-4 h-4" />
                                        </div>
                                        <span className="font-bold text-sm">Browse Fleet</span>
                                    </div>
                                </Link>
                                <Link href="/dashboard/bookings" className="block">
                                    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all cursor-pointer group">
                                        <div className="w-8 h-8 rounded-lg bg-blue-400/20 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                                            <Calendar className="w-4 h-4" />
                                        </div>
                                        <span className="font-bold text-sm">My Bookings</span>
                                    </div>
                                </Link>
                            </>
                        )}
                    </div>

                    <div className="mt-8 pt-6 border-t border-white/10 relative z-10">
                        <div className="flex items-center justify-between text-xs font-medium text-emerald-400 bg-emerald-400/10 px-3 py-2 rounded-lg border border-emerald-400/20">
                             <span className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                                Systems Operational
                             </span>
                             <span>v1.0.4</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
