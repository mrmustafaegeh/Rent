'use client';

import React, { useEffect, useState } from 'react';
import { 
    BarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    Legend, 
    ResponsiveContainer, 
    AreaChart, 
    Area, 
    PieChart, 
    Pie, 
    Cell 
} from 'recharts';
import { TrendingUp, Users, Car, CheckCircle, Package } from 'lucide-react';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function AnalyticsPage() {
    const [data, setData] = useState({
        summary: { revenue: 0, bookings: 0 },
        revenueChart: [],
        statusChart: [],
        vehicleChart: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const res = await fetch('/api/admin/analytics');
                const result = await res.json();
                if (result.summary) {
                    setData(result);
                }
            } catch (error) {
                console.error('Failed to fetch analytics:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-96">
                <div className="w-12 h-12 border-4 border-navy border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-20 max-w-[1600px] mx-auto animate-in fade-in duration-700">
            {/* Header */}
            <div>
                <h1 className="text-4xl md:text-5xl font-heading font-black text-navy tracking-tight">
                    Business <span className="text-gold">Intelligence</span>
                </h1>
                <p className="text-gray-500 mt-2 font-medium text-lg">
                    Real-time performance metrics and fleet utilization insights.
                </p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                            <TrendingUp className="w-6 h-6" />
                        </div>
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Revenue YTD</span>
                    </div>
                    <div className="text-3xl font-black text-navy">€{data.summary.revenue.toLocaleString()}</div>
                    <div className="text-xs text-green-500 font-bold mt-2 flex items-center gap-1">
                        +12.5% <span className="text-gray-400 font-medium">from last month</span>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                            <Package className="w-6 h-6" />
                        </div>
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Bookings</span>
                    </div>
                    <div className="text-3xl font-black text-navy">{data.summary.bookings}</div>
                    <div className="text-xs text-green-500 font-bold mt-2 flex items-center gap-1">
                        +5.2% <span className="text-gray-400 font-medium">growth rate</span>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-amber-50 text-amber-600 rounded-xl group-hover:bg-amber-600 group-hover:text-white transition-colors">
                            <Car className="w-6 h-6" />
                        </div>
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Fleet Utilization</span>
                    </div>
                    <div className="text-3xl font-black text-navy">84%</div>
                    <div className="text-xs text-gray-400 mt-2 font-medium">
                        Occupancy rate targets met
                    </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-purple-50 text-purple-600 rounded-xl group-hover:bg-purple-600 group-hover:text-white transition-colors">
                            <Users className="w-6 h-6" />
                        </div>
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Returning Clients</span>
                    </div>
                    <div className="text-3xl font-black text-navy">42%</div>
                    <div className="text-xs text-purple-500 font-bold mt-2 flex items-center gap-1">
                        High <span className="text-gray-400 font-medium">Customer Loyalty</span>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Revenue Chart */}
                <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
                    <h3 className="text-lg font-bold text-navy mb-6 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-blue-500" /> Revenue Forecast
                    </h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data.revenueChart}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#002bc5" stopOpacity={0.1}/>
                                        <stop offset="95%" stopColor="#002bc5" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="name" stroke="#cbd5e1" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#cbd5e1" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `€${value}`} />
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <Tooltip 
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                                    formatter={(value: any) => [`€${Number(value).toLocaleString()}`, 'Revenue']}
                                />
                                <Area type="monotone" dataKey="value" stroke="#002bc5" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Booking Status Distribution */}
                <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
                    <h3 className="text-lg font-bold text-navy mb-6 flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-emerald-500" /> Booking Status
                    </h3>
                    <div className="h-[300px] w-full flex justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data.statusChart}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={5}
                                >
                                    {data.statusChart.map((entry: any, index: number) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                                    ))}
                                </Pie>
                                <Tooltip 
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                                />
                                <Legend layout="vertical" verticalAlign="middle" align="right" iconType="circle" />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Top Vehicles */}
                <div className="lg:col-span-2 bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
                    <h3 className="text-lg font-bold text-navy mb-6 flex items-center gap-2">
                        <Car className="w-5 h-5 text-amber-500" /> Top Performing Assets
                    </h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data.vehicleChart} layout="vertical" margin={{ left: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                                <XAxis type="number" stroke="#cbd5e1" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis type="category" dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} width={150} />
                                <Tooltip 
                                    cursor={{ fill: '#f8fafc' }}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                                />
                                <Bar dataKey="value" fill="#002bc5" radius={[0, 4, 4, 0]} barSize={20}>
                                    {data.vehicleChart.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={index < 3 ? '#d4af37' : '#002bc5'} /> 
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}
