'use client';

import React from 'react';
import { filterKAnonymousGroups } from '@/app/api/admin/metrics/route';

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

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
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
