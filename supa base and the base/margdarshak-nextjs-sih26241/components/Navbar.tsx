'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from './AuthProvider';
import { Compass, User, LogOut, LogIn, ShieldAlert } from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();
  const { user, role, signOut, isLoading } = useAuth();

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/counselling', label: 'Counselling' },
    { href: '/explore-trades', label: 'Explore Trades' },
    { href: '/pathways', label: 'Pathways' },
    { href: '/request-counsellor', label: 'Request Counsellor' },
    { href: '/admin', label: 'Admin Insights' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-surface/90 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white shadow-sm">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-heading font-extrabold text-lg text-text-primary">
                MARGDARSHAK
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary-tint text-primary font-mono font-semibold">
                SIH26241
              </span>
            </div>
            <p className="text-[9px] text-text-secondary uppercase tracking-wider">AI Career Guidance Platform</p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  isActive
                    ? 'bg-primary text-white font-semibold'
                    : 'text-text-secondary hover:text-text-primary hover:bg-surface-tint'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Auth Section */}
        <div className="flex items-center space-x-3">
          {isLoading ? (
            <div className="w-16 h-8 bg-surface-tint animate-pulse rounded-lg" />
          ) : user ? (
            <div className="flex items-center space-x-2.5">
              <div className="flex items-center space-x-2 bg-surface-tint border border-border px-3 py-1.5 rounded-xl">
                <div className="w-6 h-6 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center uppercase">
                  {user.email?.charAt(0) || 'U'}
                </div>
                <div className="text-left text-xs">
                  <div className="font-medium text-text-primary max-w-[110px] truncate leading-tight">
                    {user.user_metadata?.full_name || user.email?.split('@')[0]}
                  </div>
                  <div className="text-[9px] text-text-secondary capitalize">
                    {role}
                  </div>
                </div>
              </div>
              <button
                onClick={() => signOut()}
                className="flex items-center space-x-1 text-xs px-3 py-1.5 rounded-lg border border-border hover:bg-red-50 text-red-600 transition"
                title="Log out from Supabase"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center space-x-1.5 text-xs px-3.5 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white font-semibold shadow-sm transition"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
