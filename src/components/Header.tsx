'use client';

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";

export function Header() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="h-[var(--header-height)] border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-md fixed top-0 w-full z-50">
      <div className="container mx-auto px-4 h-full flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold tracking-tighter">
          RENTAL<span className="text-[var(--primary)]">X</span>
        </Link>
        
        <nav className="hidden md:flex gap-8 items-center">
          <Link href="/fleet" className="text-sm font-medium text-[var(--text-secondary)] hover:text-white transition-colors">Fleet</Link>
          <Link href="/locations" className="text-sm font-medium text-[var(--text-secondary)] hover:text-white transition-colors">Locations</Link>
          <Link href="/how-it-works" className="text-sm font-medium text-[var(--text-secondary)] hover:text-white transition-colors">How It Works</Link>
          {isAuthenticated && (
            <Link href="/wishlist" className="text-sm font-medium text-[var(--text-secondary)] hover:text-white transition-colors flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              Wishlist
            </Link>
          )}
        </nav>

        <div className="flex gap-4 items-center">
            {isAuthenticated ? (
                <>
                    <Link href="/dashboard">
                        <Button variant="ghost" size="sm">Dashboard</Button>
                    </Link>
                    <div className="hidden sm:block w-px h-6 bg-[var(--border)]"></div>
                    <span className="hidden sm:block text-sm font-medium">{user?.name}</span>
                    <button onClick={logout} className="text-sm text-red-500 hover:text-red-400">
                        Sign Out
                    </button>
                </>
            ) : (
                <>
                    <Link href="/auth/login">
                        <Button variant="ghost" size="sm">Log In</Button>
                    </Link>
                    <Link href="/auth/register">
                        <Button variant="primary" size="sm">Sign Up</Button>
                    </Link>
                </>
            )}
        </div>
      </div>
    </header>
  );
}
