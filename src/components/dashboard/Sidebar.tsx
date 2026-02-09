'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { 
    LayoutDashboard, 
    Calendar, 
    Car, 
    Users, 
    Settings,
    LogOut,
    ChevronRight,
    ClipboardList,
    UserCircle,
    BadgePlus,
    CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function Sidebar() {
    const { user, logout } = useAuth();
    const pathname = usePathname();

    const links = [
        { 
            name: 'Overview', 
            href: '/dashboard', 
            icon: LayoutDashboard,
            roles: ['customer', 'admin', 'company_owner'] 
        },
        { 
            name: 'Booking Requests', 
            href: '/dashboard/all-bookings', 
            icon: ClipboardList,
            roles: ['admin', 'company_owner'] 
        },
        { 
            name: 'Fleet Management', 
            href: '/dashboard/vehicles', 
            icon: Car,
            roles: ['admin', 'company_owner'] 
        },
        { 
            name: 'Approvals', 
            href: '/dashboard/admin/approvals', 
            icon: CheckCircle,
            roles: ['admin'] 
        },
        { 
            name: 'My Bookings', 
            href: '/dashboard/bookings', 
            icon: Calendar,
            roles: ['customer'] 
        },
        { 
            name: 'User Management', 
            href: '/dashboard/users', 
            icon: Users,
            roles: ['admin'] 
        },
        { 
            name: 'Settings', 
            href: '/dashboard/settings', 
            icon: Settings,
            roles: ['customer', 'admin', 'company_owner'] 
        },
    ];

    // Filter links based on user role
    const relevantLinks = links.filter(link => user && link.roles.includes(user.role));

    if (!user) return null;

    return (
        <aside className="w-72 bg-navy min-h-screen flex flex-col fixed left-0 top-0 z-40 shadow-2xl overflow-y-auto border-r border-white/5">
            {/* Logo Section */}
            <div className="h-24 flex flex-col justify-center px-8 border-b border-white/5 bg-navy/50 backdrop-blur-md">
                <Link href="/" className="group block w-full transition-opacity hover:opacity-90">
                    <div className="font-heading font-black text-xl tracking-tight text-white flex items-center gap-2">
                        <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold to-amber-600 flex items-center justify-center text-navy shadow-lg shadow-gold/20">
                            <Car className="w-5 h-5" />
                        </span>
                        RENTAL<span className="text-gold">X</span>
                    </div>
                    <div className="text-[10px] font-bold text-gray-500 tracking-[0.2em] uppercase mt-1 pl-10">
                        Premium Drive
                    </div>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-8 space-y-1">
                <p className="px-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">Menu</p>
                {relevantLinks.map((link) => {
                    // Logic to keep parent active for sub-routes, but exact match for Dashboard overview
                    const isActive = pathname === link.href || (link.href !== '/dashboard' && pathname.startsWith(link.href));
                    const Icon = link.icon;
                    
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`group flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 mb-1 ${
                                isActive 
                                ? 'bg-white/10 text-white shadow-inner font-bold border border-white/5' 
                                : 'text-gray-400 hover:bg-white/5 hover:text-white'
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <Icon className={`w-5 h-5 ${isActive ? 'text-gold' : 'text-gray-500 group-hover:text-gold'} transition-colors duration-300`} />
                                <span className="text-sm tracking-wide">{link.name}</span>
                            </div>
                            {/* {isActive && <div className="w-1.5 h-1.5 rounded-full bg-gold shadow-[0_0_8px_rgba(251,191,36,0.8)] animate-pulse"></div>} */}
                        </Link>
                    )
                })}

                {/* Quick Action Button */}
                {user.role === 'admin' && (
                    <div className="mt-8 px-2">
                        <Link href="/dashboard/vehicles/new">
                            <Button className="w-full bg-gradient-to-r from-gold to-amber-500 hover:from-amber-400 hover:to-amber-500 text-navy font-black shadow-lg shadow-gold/20 h-11 rounded-xl flex items-center justify-center gap-2 transition-all hover:scale-[1.02]">
                                <BadgePlus className="w-5 h-5" /> Add Vehicle
                            </Button>
                        </Link>
                    </div>
                )}
            </nav>

            {/* User Profile Section */}
            <div className="p-4 mt-auto">
                <div className="bg-white/5 rounded-2xl border border-white/5 p-4 backdrop-blur-sm hover:bg-white/10 transition-colors group">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-electric to-blue-600 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/20 text-sm">
                            {(user?.firstName?.[0] || 'U')}{(user?.lastName?.[0] || '')}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-white truncate group-hover:text-gold transition-colors">{user?.firstName} {user?.lastName}</p>
                            <p className="text-[10px] text-gray-400 truncate uppercase tracking-wider font-medium">{user?.role?.replace('_', ' ')}</p>
                        </div>
                    </div>
                    
                    <button 
                        onClick={logout}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-gray-400 hover:text-red-400 bg-black/20 hover:bg-black/40 rounded-xl transition-all duration-300"
                    >
                        <LogOut className="w-3.5 h-3.5" /> Sign Out
                    </button>
                </div>
                
                {/* Footer */}
                <div className="px-4 pt-6 pb-2 text-center">
                    <p className="text-[10px] text-gray-600 font-medium">
                        © 2024 Mediterranean Drive<br/>
                        <span className="opacity-50">Dashboard v2.1.0</span>
                    </p>
                </div>
            </div>
        </aside>
    );
}
