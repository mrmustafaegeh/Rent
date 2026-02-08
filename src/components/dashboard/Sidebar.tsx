'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export const Sidebar = () => {
    const { user, logout } = useAuth();
    const pathname = usePathname();

    const links = [
        { name: 'Overview', href: '/dashboard', roles: ['customer', 'admin', 'company_owner'] },
        { name: 'My Bookings', href: '/dashboard/bookings', roles: ['customer'] },
        { name: 'Manage Vehicles', href: '/dashboard/vehicles', roles: ['admin', 'company_owner'] },
        { name: 'All Bookings', href: '/dashboard/all-bookings', roles: ['admin', 'company_owner'] },
        { name: 'Users', href: '/dashboard/users', roles: ['admin'] },
        { name: 'Settings', href: '/dashboard/settings', roles: ['customer', 'admin', 'company_owner'] },
    ];

    const allowedLinks = links.filter(link => user && link.roles.includes(user.role));

    return (
        <aside className="w-64 bg-card border-r border-border min-h-screen flex flex-col">
            <div className="h-20 flex items-center px-6 border-b border-border">
                <Link href="/" className="font-bold text-xl tracking-tighter">
                    RENTAL<span className="text-primary">X</span>
                </Link>
            </div>

            <nav className="flex-1 p-4 space-y-1">
                {allowedLinks.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                                isActive 
                                ? 'bg-primary text-primary-foreground' 
                                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                            }`}
                        >
                            {link.name}
                        </Link>
                    )
                })}
            </nav>

            <div className="p-4 border-t border-border">
                <div className="flex items-center gap-3 mb-4 px-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                        {user?.name?.charAt(0)}
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <p className="text-sm font-medium text-foreground truncate">{user?.name}</p>
                        <p className="text-xs text-muted-foreground truncate capitalize">{user?.role}</p>
                    </div>
                </div>
                <button 
                    onClick={logout}
                    className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-red-500 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-colors"
                >
                    Sign Out
                </button>
            </div>
        </aside>
    );
};
