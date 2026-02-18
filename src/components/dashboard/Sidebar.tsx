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
    CheckCircle,
    MessageSquare,
    Building2
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
            name: 'Confirmations', 
            href: '/dashboard/confirmations', 
            icon: CheckCircle,
            roles: ['admin', 'company_owner'] 
        },
        { 
            name: 'Fleet Management', 
            href: '/dashboard/vehicles', 
            icon: Car,
            roles: ['admin', 'company_owner'] 
        },
        { 
            name: 'Partner Requests', 
            href: '/dashboard/admin/partners/request', 
            icon: Building2,
            roles: ['admin'] 
        },
        { 
            name: 'Vehicle Approvals', 
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
            name: 'Messages', 
            href: '/dashboard/admin/messages', 
            icon: MessageSquare,
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
    const relevantLinks = links.filter(link => {
        if (!user) return false;
        const userRole = user.role.toLowerCase();
        return link.roles.some(role => role.toLowerCase() === userRole);
    });

    if (!user) return null;

    return (
        <aside className="w-72 bg-navy min-h-screen flex flex-col fixed left-0 top-0 z-40 shadow-[4px_0_24px_rgba(0,0,0,0.3)] overflow-y-auto border-r border-white/5">
            {/* Logo Section */}
            <div className="h-24 flex flex-col justify-center px-8 border-b border-white/5 bg-navy/80 backdrop-blur-xl sticky top-0 z-10">
                <Link href="/" className="group block w-full transition-all hover:scale-[1.02]">
                    <div className="font-heading font-black text-2xl tracking-tight text-white flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold via-amber-500 to-amber-600 flex items-center justify-center text-navy shadow-[0_8px_16px_rgba(255,215,0,0.2)] group-hover:shadow-[0_8px_24px_rgba(255,215,0,0.4)] transition-all">
                            <Car className="w-6 h-6" />
                        </div>
                        <div className="flex flex-col">
                            <span className="leading-none">RENTAL<span className="text-gold">X</span></span>
                            <span className="text-[10px] font-black text-gray-500 tracking-[0.3em] uppercase mt-1">Premium</span>
                        </div>
                    </div>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-8 space-y-2">
                <div className="px-6 mb-6">
                    <p className="text-[11px] font-black text-gray-500 uppercase tracking-[0.2em] opacity-80">Main Menu</p>
                </div>
                
                {relevantLinks.map((link) => {
                    const isActive = pathname === link.href || (link.href !== '/dashboard' && pathname.startsWith(link.href));
                    const Icon = link.icon;
                    
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`group flex items-center justify-between px-6 py-4 rounded-2xl transition-all duration-300 ${
                                isActive 
                                ? 'bg-white/10 text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] font-bold border border-white/10' 
                                : 'text-gray-400 hover:bg-white/5 hover:text-white translate-x-0 hover:translate-x-1'
                            }`}
                        >
                            <div className="flex items-center gap-4">
                                <div className={`p-2 rounded-lg transition-colors duration-300 ${isActive ? 'bg-gold/10' : 'bg-transparent group-hover:bg-white/5'}`}>
                                    <Icon className={`w-5 h-5 ${isActive ? 'text-gold' : 'text-gray-500 group-hover:text-gold'}`} />
                                </div>
                                <span className="text-[13px] font-medium tracking-wide">{link.name}</span>
                            </div>
                            {isActive && (
                                <div className="w-1.5 h-6 rounded-full bg-gold shadow-[0_0_12px_rgba(251,191,36,0.5)]" />
                            )}
                        </Link>
                    )
                })}

                {user.role === 'admin' && (
                    <div className="mt-10 px-2">
                        <Link href="/dashboard/vehicles/new">
                            <Button className="w-full bg-gradient-to-br from-gold to-amber-600 hover:from-amber-400 hover:to-amber-500 text-navy font-black shadow-[0_12px_24px_rgba(251,191,36,0.2)] h-14 rounded-2xl flex items-center justify-center gap-3 transition-all hover:-translate-y-1 hover:shadow-[0_16px_32px_rgba(251,191,36,0.3)] border-none">
                                <BadgePlus className="w-6 h-6" /> Add New Vehicle
                            </Button>
                        </Link>
                    </div>
                )}
            </nav>

            {/* Profile Section */}
            <div className="p-6 mt-auto">
                <div className="bg-white/5 backdrop-blur-xl rounded-[2rem] border border-white/10 p-5 group hover:bg-white/[0.08] transition-all duration-500">
                    <div className="flex items-center gap-4 mb-5">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-electric via-blue-600 to-indigo-700 flex items-center justify-center text-white font-black shadow-[0_8px_16px_rgba(10,182,212,0.2)] text-base group-hover:scale-105 transition-transform">
                            {(user?.firstName?.[0] || 'U')}{(user?.lastName?.[0] || '')}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[14px] font-black text-white truncate group-hover:text-gold transition-colors">{user?.firstName} {user?.lastName}</p>
                            <p className="text-[10px] text-gray-500 truncate uppercase font-black tracking-widest mt-0.5">{user?.role?.replace('_', ' ')}</p>
                        </div>
                    </div>
                    
                    <button 
                        onClick={logout}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 text-xs font-black text-gray-400 hover:text-white bg-white/5 hover:bg-red-500/20 rounded-xl transition-all duration-300 border border-transparent hover:border-red-500/30"
                    >
                        <LogOut className="w-4 h-4" /> SIGN OUT
                    </button>
                </div>
                
                <div className="mt-6 text-center">
                    <p className="text-[9px] text-gray-600 font-black tracking-widest uppercase opacity-50">
                        Mediterranean Drive<br/>
                        Dashboard v2.5.0
                    </p>
                </div>
            </div>
        </aside>
    );
}
