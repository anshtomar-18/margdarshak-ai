'use client';

import React, { useState } from 'react';
import { TRADES, SOURCES } from '@/lib/db/catalogue';
import { EvidenceBadge } from '@/components/EvidenceBadge';

export default function CounsellingPage() {
  const [mode, setMode] = useState<'learner' | 'parent' | 'joint'>('joint');
  const [selectedTradeId, setSelectedTradeId] = useState<string>('TRD-ELEC');
  const trade = TRADES.find((t) => t.id === selectedTradeId) || TRADES[0]!;
  const source = SOURCES.find((s) => s.id === trade.sourceId);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold">Evidence-Grounded Career Counselling</h1>
          <p className="text-sm text-text-secondary">
            Choose Learner, Parent, or Joint Family Mode. All context fields are optional.
          </p>
        </div>
        <div className="flex gap-2">
          {(['learner', 'parent', 'joint'] as const).map((m) => (
            <button
              key={m}
              data-testid={`mode-${m}`}
              onClick={() => setMode(m)}
              className={`px-4 py-2 rounded-xl text-sm font-medium border ${
                mode === m ? 'bg-primary text-white border-primary' : 'bg-surface border-border'
              }`}
            >
              {m === 'joint' ? '👨‍👩‍👧 Joint Family Mode' : m === 'learner' ? '🎓 Learner Mode' : '👪 Parent Mode'}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-surface border border-border rounded-2xl p-5 space-y-3">
        <label className="block text-sm font-semibold">Select Vocational Trade to Inspect:</label>
        <select
          value={selectedTradeId}
          onChange={(e) => setSelectedTradeId(e.target.value)}
          className="w-full md:w-96 border border-border rounded-xl px-3 py-2 bg-background text-sm"
        >
          {TRADES.map((t) => (
            <option key={t.id} value={t.id}>
              {t.nameEn} ({t.nameHi}) — NSQF {t.nsqfLevel}
            </option>
          ))}
        </select>
      </div>

      {mode === 'joint' ? (
        <div className="grid md:grid-cols-2 gap-6">
          <div data-testid="joint-lane-learner" className="bg-surface border-2 border-primary rounded-2xl p-5 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">Learner Lane</span>
            <h2 className="text-lg font-heading font-semibold">Skills, Daily Work & Progression</h2>
            <p className="text-sm text-text-secondary">
              <strong>Roles:</strong> {trade.jobRolesEn.join(', ')}
            </p>
            <p className="text-sm text-text-secondary">
              <strong>Eligibility & Duration:</strong> {trade.eligibilityEn} • {trade.durationMonths} months
            </p>
            <EvidenceBadge status={trade.evidenceStatus} isStale={trade.isStale} />
          </div>

          <div data-testid="joint-lane-parent" className="bg-surface border-2 border-accent rounded-2xl p-5 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800">Parent / Guardian Lane</span>
            <h2 className="text-lg font-heading font-semibold">Earnings, Stability, Cost & Caveats</h2>
            <p className="text-sm text-text-secondary">
              <strong>Starting Range:</strong>{' '}
              {trade.earningsMinInr && trade.earningsMaxInr
                ? `₹${trade.earningsMinInr.toLocaleString('en-IN')} – ₹${trade.earningsMaxInr.toLocaleString('en-IN')}/month`
                : 'Unavailable'}
            </p>
            <p className="text-sm text-text-secondary">
              <strong>Placement Rate ({trade.reportingPeriod}):</strong>{' '}
              {trade.placementRatePct !== null ? `${trade.placementRatePct}%` : 'Unavailable'}
            </p>
            <p className="text-xs text-text-secondary">
              <strong>Caveats:</strong> {trade.limitationsEn} (Source: {source?.publisher})
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-surface border border-border rounded-2xl p-6 space-y-3">
          <h2 className="text-lg font-heading font-semibold">{trade.nameEn}</h2>
          <p className="text-sm text-text-secondary">{trade.limitationsEn}</p>
          <EvidenceBadge status={trade.evidenceStatus} isStale={trade.isStale} />
        </div>
      )}
    </div>
  );
}
