'use client';

import { useEffect, useState, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { 
    TrendingUp, 
    Users, 
    Car, 
    Calendar, 
    ArrowRight, 
    DollarSign,
    Plus,
    Activity,
    CreditCard,
    Briefcase,
    Clock,
    LayoutDashboard
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import DashboardAreaChart from '@/components/dashboard/DashboardCharts';

export default function DashboardOverview() {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalBookings: 0,
        activeVehicles: 0,
        totalRevenue: 0,
        totalUsers: 0,
        recentBookings: [] as any[],
        chartData: [] as any[],
        userGrowthData: [] as any[],
        avgDailyRate: 0,
        occupancyRate: 0
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
             try {
                 // Parallel fetch for efficiency
                 const [bookingsRes, vehiclesRes, usersRes] = await Promise.all([
                     fetch('/api/bookings'),
                     user?.role === 'ADMIN' || user?.role === 'PARTNER' ? fetch(user?.role === 'ADMIN' ? '/api/vehicles' : '/api/vehicles?my=true&limit=100') : Promise.resolve(null),
                     user?.role === 'ADMIN' ? fetch('/api/users') : Promise.resolve(null)
                 ]);

                 const bookingsData = await bookingsRes.json();
                 const vehiclesData = vehiclesRes ? await vehiclesRes.json() : null;
                 const usersData = usersRes ? await usersRes.json() : null;
                 
                 let bookingCount = 0;
                 let revenue = 0;
                 let vehicleCount = 0;
                 let userCount = 0;
                 let recent = [];
                 let dailyRevenue: Record<string, number> = {};
                 let dailyUsers: Record<string, number> = {};

                 const now = new Date();
                 const last7Days = Array.from({ length: 7 }, (_, i) => {
                     const d = new Date();
                     d.setDate(now.getDate() - (6 - i));
                     return d.toLocaleDateString('en-US', { weekday: 'short' });
                 });

                 last7Days.forEach(day => {
                     dailyRevenue[day] = 0;
                     dailyUsers[day] = 0;
                 });

                 if (bookingsData.success) {
                     const bookings = bookingsData.data;
                     bookingCount = bookings.length;
                     revenue = bookings.reduce((acc: number, b: any) => acc + (b.totalPrice || 0), 0);
                     
                     bookings.forEach((b: any) => {
                         const bDate = new Date(b.createdAt);
                         const dateStr = bDate.toLocaleDateString('en-US', { weekday: 'short' });
                         if (dailyRevenue[dateStr] !== undefined) {
                             dailyRevenue[dateStr] += b.totalPrice || 0;
                         }
                     });

                     const sorted = [...bookings].sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                     recent = sorted.slice(0, 5);
                 }
                 
                 if (vehiclesData && vehiclesData.success) {
                      vehicleCount = vehiclesData.vehicles?.length || 0;
                 }

                 if (usersData && usersData.success) {
                     userCount = usersData.data?.length || 0;
                     usersData.data?.forEach((u: any) => {
                         const uDate = new Date(u.createdAt);
                         const dateStr = uDate.toLocaleDateString('en-US', { weekday: 'short' });
                         if (dailyUsers[dateStr] !== undefined) {
                             dailyUsers[dateStr] += 1;
                         }
                     });
                 }

                 setStats({
                     totalBookings: bookingCount,
                     activeVehicles: vehicleCount,
                     totalRevenue: revenue,
                     totalUsers: userCount,
                     recentBookings: recent,
                     chartData: Object.entries(dailyRevenue).map(([name, value]) => ({ name, value })),
                     userGrowthData: Object.entries(dailyUsers).map(([name, value]) => ({ name, value })),
                     avgDailyRate: bookingCount > 0 ? revenue / bookingCount : 0,
                     occupancyRate: vehicleCount > 0 ? (bookingCount / 30 / vehicleCount) * 100 : 25 // Simulating monthly occupancy
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
            label: (user?.role === 'ADMIN' || user?.role === 'PARTNER') ? 'Total Revenue' : 'Total Spent',
            value: `€${stats.totalRevenue.toLocaleString()}`,
            icon: DollarSign,
            color: 'text-emerald-500',
            bg: 'bg-emerald-50',
            trend: '+12.5%',
            isPositive: true
        },
        {
            label: 'Reservations',
            value: stats.totalBookings,
            icon: Calendar,
            color: 'text-blue-500',
            bg: 'bg-blue-50',
            trend: '+3.2%',
            isPositive: true
        },
        {
            label: (user?.role === 'ADMIN' || user?.role === 'PARTNER') ? 'Average ADR' : 'Avg. Rental',
            value: `€${Math.round(stats.avgDailyRate).toLocaleString()}`,
            icon: CreditCard,
            color: 'text-amber-500',
            bg: 'bg-amber-50',
            trend: '+0.8%',
            isPositive: true
        },
        ...((user?.role === 'ADMIN') ? [{
            label: 'New Users',
            value: stats.totalUsers,
            icon: Users,
            color: 'text-indigo-500',
            bg: 'bg-indigo-50',
            trend: '+15.2%',
            isPositive: true
        }] : []),
        ...((user?.role === 'ADMIN' || user?.role === 'PARTNER') ? [{
            label: 'Occupancy Rate',
            value: `${Math.round(stats.occupancyRate)}%`,
            icon: Activity,
            color: 'text-purple-500',
            bg: 'bg-purple-50',
            trend: '-2.4%',
            isPositive: false
        }] : [])
    ];

    if (isLoading) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="relative w-16 h-16">
                        <div className="absolute top-0 left-0 w-full h-full border-4 border-navy/10 rounded-full"></div>
                        <div className="absolute top-0 left-0 w-full h-full border-4 border-navy border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    <p className="text-navy font-black text-xs uppercase tracking-[0.3em] opacity-40">Syncing Intelligence</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-10 pb-20 w-full max-w-[1600px] mx-auto">
            {/* Premium Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                     <div className="flex items-center gap-2 text-[10px] font-black text-electric uppercase tracking-[0.2em] mb-2 px-3 py-1 bg-electric/10 rounded-full w-fit">
                        <LayoutDashboard className="w-3 h-3" />
                         Dashboard Overview
                     </div>
                    <h1 className="text-4xl md:text-5xl font-heading font-black text-navy tracking-tight">
                        Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-navy via-blue-800 to-electric">{user?.firstName}</span>
                    </h1>
                    <p className="text-gray-500 mt-2 font-medium">
                        Real-time analytics and platform performance metrics for your fleet.
                    </p>
                </div>
                
                <div className="flex items-center gap-3">
                     <button className="h-12 px-6 rounded-2xl bg-white border border-gray-100 shadow-sm text-navy font-bold text-sm hover:shadow-md transition-all flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        Last 7 Days
                     </button>
                    {user?.role === 'ADMIN' && (
                        <Link href="/dashboard/vehicles/new">
                            <Button className="bg-navy text-gold hover:bg-navy/90 gap-3 font-black shadow-xl shadow-navy/20 h-12 px-6 rounded-2xl transition-all hover:scale-105 active:scale-95">
                                <Plus className="w-5 h-5" /> New Vehicle
                            </Button>
                        </Link>
                    )}
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, i) => (
                    <div key={i} className="bg-white p-7 rounded-[2.5rem] border border-gray-100 shadow-[0_12px_40px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.06)] transition-all group relative overflow-hidden">
                        {/* Decorative background circle */}
                        <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-5 group-hover:scale-150 transition-transform duration-700 ${stat.bg}`}></div>
                        
                        <div className="flex justify-between items-center mb-6 relative z-10">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110 duration-500 ${stat.bg} ${stat.color} shadow-inner`}>
                                <stat.icon className="w-7 h-7" />
                            </div>
                            <div className={`flex items-center gap-1 text-[11px] font-black px-2.5 py-1 rounded-full ${stat.isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                                {stat.isPositive ? <TrendingUp className="w-3 h-3" /> : <Activity className="w-3 h-3" />}
                                {stat.trend}
                            </div>
                        </div>
                        
                        <div className="relative z-10">
                            <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1.5">{stat.label}</p>
                            <h3 className="text-3xl font-black text-navy tracking-tight mb-2">{stat.value}</h3>
                            <div className="h-1.5 w-full bg-gray-50 rounded-full overflow-hidden">
                                <div className={`h-full rounded-full ${stat.color.replace('text', 'bg')} transition-all duration-1000 delay-300`} style={{ width: '70%' }}></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts & Activity Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Revenue Graph */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <DashboardAreaChart 
                            data={stats.chartData} 
                            title="Revenue Performance" 
                            color={user?.role === 'ADMIN' ? '#0f172a' : '#3b82f6'} 
                        />
                        {user?.role === 'ADMIN' && (
                            <DashboardAreaChart 
                                data={stats.userGrowthData} 
                                title="User Growth (New Registrations)" 
                                color="#10b981" 
                            />
                        )}
                    </div>
                    
                    {/* Secondary Metrics Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-gradient-to-br from-navy to-blue-900 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-navy/20 relative overflow-hidden group">
                           <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                           <h4 className="text-sm font-black uppercase tracking-widest opacity-60 mb-6 flex items-center gap-2">
                               <Briefcase className="w-4 h-4" /> Platform Health
                           </h4>
                           <div className="flex items-end justify-between">
                               <div>
                                   <div className="text-4xl font-black mb-2 animate-in fade-in slide-in-from-bottom-2 duration-700">99.9%</div>
                                   <p className="text-xs font-bold text-blue-300">Uptime & Availability</p>
                               </div>
                               <div className="text-right">
                                   <div className="text-xs font-black uppercase tracking-widest text-emerald-400 mb-1">Status</div>
                                   <div className="flex items-center gap-2 justify-end">
                                       <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                                       <span className="text-xs font-bold uppercase tracking-tighter">Operational</span>
                                   </div>
                               </div>
                           </div>
                        </div>
                        
                        <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-[0_12px_40px_rgba(0,0,0,0.03)] group hover:shadow-[0_20px_60px_rgba(0,0,0,0.06)] transition-all">
                           <h4 className="text-sm font-black text-navy uppercase tracking-widest opacity-40 mb-6 flex items-center gap-2 text-navy">
                               <Users className="w-4 h-4" /> Account Manager
                           </h4>
                           <div className="flex items-center gap-4">
                               <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center text-navy font-black shadow-inner group-hover:bg-navy group-hover:text-white transition-all duration-500">
                                   JD
                               </div>
                               <div>
                                   <div className="font-black text-navy">Mustafa Egeh</div>
                                   <p className="text-xs font-bold text-gray-400 mt-0.5 uppercase tracking-tighter">Senior Fleet Consultant</p>
                               </div>
                           </div>
                        </div>
                    </div>
                </div>

                {/* Recent Activity Sidebar */}
                <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-[0_12px_40px_rgba(0,0,0,0.03)] p-8 flex flex-col h-full">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-xl font-black text-navy flex items-center gap-3">
                            <Activity className="w-6 h-6 text-electric" /> 
                            <span>Live Activity</span>
                        </h3>
                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                    </div>
                    
                    {stats.recentBookings.length === 0 ? (
                        <div className="text-center py-20 text-gray-400 flex-1 flex flex-col items-center justify-center">
                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                                <Calendar className="w-10 h-10 text-gray-200" />
                            </div>
                            <p className="font-bold text-sm uppercase tracking-widest opacity-50">No activity logged.</p>
                        </div>
                    ) : (
                        <div className="space-y-6 flex-1">
                            {stats.recentBookings.map((booking) => (
                                <div key={booking.id} className="group relative pl-6 cursor-pointer">
                                    {/* Timeline connector */}
                                    <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gray-100 group-last:bg-transparent"></div>
                                    <div className="absolute left-[-4px] top-1 w-2.5 h-2.5 rounded-full border-2 border-white bg-blue-500 group-hover:scale-150 transition-transform"></div>
                                    
                                    <div className="bg-gray-50/50 group-hover:bg-gray-100 transition-colors rounded-2xl p-4 border border-transparent group-hover:border-gray-200">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                                {new Date(booking.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                            <span className="font-mono text-[9px] font-black text-navy/30">{booking.bookingNumber}</span>
                                        </div>
                                        <h4 className="font-black text-navy text-[13px] leading-tight mb-1">
                                            New {booking.status} reservation
                                        </h4>
                                        <p className="text-[11px] text-gray-500 font-medium line-clamp-1">
                                            {booking.vehicle?.brand} {booking.vehicle?.vehicleModel} for {booking.customer?.name || 'Guest'}
                                        </p>
                                        <div className="mt-3 flex items-center justify-between">
                                            <div className="flex -space-x-2">
                                                {[1].map((i) => (
                                                    <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-navy flex items-center justify-center text-[8px] font-black text-white">
                                                        {(booking.customer?.name?.[0] || 'G')}
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="text-xs font-black text-electric">€{booking.totalPrice}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    
                    <Link href={user?.role === 'ADMIN' ? "/dashboard/all-bookings" : "/dashboard/bookings"} className="mt-8">
                        <Button variant="outline" className="w-full h-12 rounded-2xl border-gray-100 text-navy font-black text-xs uppercase tracking-widest hover:bg-navy hover:text-white transition-all gap-2">
                             Full Activity Log <ArrowRight className="w-4 h-4" />
                        </Button>
                    </Link>
                </div>
            </div>
            
            {/* Context Awareness Section */}
            <div className="bg-amber-50 rounded-[3rem] p-10 border border-amber-100 relative overflow-hidden">
                <div className="absolute top-[-50px] left-[-50px] w-40 h-40 bg-gold/10 rounded-full blur-3xl"></div>
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 rounded-[2rem] bg-white shadow-xl shadow-amber-200/50 flex items-center justify-center text-amber-600">
                            <Clock className="w-8 h-8" />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-navy tracking-tight">System Performance Insight</h3>
                            <p className="text-gray-600 max-w-lg mt-1 font-medium">
                                Your platform is processing bookings <span className="text-emerald-600 font-bold">14% faster</span> than the previous 30-day average. 
                                Customer return rate has improved by <span className="font-bold text-navy">8%</span>.
                            </p>
                        </div>
                    </div>
                    <Button className="bg-white text-navy border border-amber-200 hover:bg-amber-100 shadow-sm font-black rounded-2xl px-8 h-12">
                        View Detailed Report
                    </Button>
                </div>
            </div>
        </div>
    );
}
