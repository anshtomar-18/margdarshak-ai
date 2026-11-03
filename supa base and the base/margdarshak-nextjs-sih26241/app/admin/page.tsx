'use client';

import React from 'react';
import { filterKAnonymousGroups } from '@/app/api/admin/metrics/route';
import { useAuth } from '@/components/AuthProvider';
import Link from 'next/link';
import { ShieldCheck, LogIn, LogOut, AlertCircle } from 'lucide-react';

const SAMPLE_GROUPS = [
  { category: 'Income & Starting Salary', concern_count: 42 },
  { category: 'Job Stability & NAPS Apprenticeship', concern_count: 31 },
  { category: 'NSQF Diploma Progression', concern_count: 24 },
  { category: 'Course Suitability & Duration', concern_count: 19 },
  { category: 'Social Perception of ITI/Vocational Trades', concern_count: 15 },
  { category: 'Sensitive Family Financial Hardship (Escalated)', concern_count: 3 },
];

export default function AdminDashboardPage() {
  const { visibleRows, suppressedRowCount } = filterKAnonymousGroups(SAMPLE_GROUPS);
  const { user, role, signOut, loginAsDemo } = useAuth();

  const isAdmin = role === 'admin' || user?.email?.includes('admin');

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      {/* Admin Auth Status Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-surface border border-border rounded-2xl p-4">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-primary-tint text-primary flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-semibold text-text-primary">Admin Access Level</span>
              <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-semibold ${
                isAdmin ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
              }`}>
                {isAdmin ? 'Authenticated Admin' : 'Public Preview Mode'}
              </span>
            </div>
            <p className="text-xs text-text-secondary">
              {user ? `Logged in as: ${user.email}` : 'Not logged in. Full administrative changes require an authorized account.'}
            </p>
          </div>
        </div>
        <div>
          {user ? (
            <button
              onClick={() => signOut()}
              className="flex items-center space-x-1.5 text-xs px-3 py-1.5 rounded-lg border border-border hover:bg-red-50 text-red-600 transition"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          ) : (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => loginAsDemo('admin')}
                className="text-xs px-3 py-1.5 rounded-lg bg-surface border border-primary text-primary hover:bg-primary-tint transition font-medium"
              >
                1-Click Demo Admin
              </button>
              <Link
                href="/login?redirectTo=/admin"
                className="flex items-center space-x-1 text-xs px-3 py-1.5 rounded-lg bg-primary hover:bg-primary-hover text-white transition font-medium"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Admin Login</span>
              </Link>
            </div>
          )}
        </div>
      </div>

      <h1 className="text-2xl font-heading font-bold">De-Identified Administrator Insights (k ≥ 5 Enforced)</h1>
      <p className="text-xs text-text-secondary">
        Privacy Guard Active: {suppressedRowCount} small group(s) with count &lt; 5 automatically suppressed to prevent re-identification. No raw chat transcripts are ever displayed.
      </p>
      <div className="bg-surface border border-border rounded-2xl p-5 space-y-3">
        {visibleRows.map((row) => (
          <div key={row.category} className="flex items-center justify-between border-b border-border pb-2 text-sm">
            <span>{row.category}</span>
            <span className="font-semibold text-primary">{row.concern_count} sessions</span>
          </div>
        ))}
      </div>
    </div>
  );
}
