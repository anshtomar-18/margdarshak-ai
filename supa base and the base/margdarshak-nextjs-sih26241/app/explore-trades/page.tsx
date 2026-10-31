'use client';

import React, { useState } from 'react';
import { getTradesFiltered } from '@/lib/db/catalogue';
import { EvidenceBadge } from '@/components/EvidenceBadge';

export default function ExploreTradesPage() {
  const [search, setSearch] = useState('');
  const [region, setRegion] = useState('All');
  const trades = getTradesFiltered({ search, region });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-2xl font-heading font-bold">Explore Vocational Trades & Verifiable Outcomes</h1>
      <div className="flex flex-wrap gap-3">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search trade name, role, or category..."
          className="border border-border rounded-xl px-3.5 py-2 text-sm bg-surface flex-1 min-w-[240px]"
        />
        <select
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          className="border border-border rounded-xl px-3.5 py-2 text-sm bg-surface"
        >
          {['All', 'North', 'West', 'South', 'East', 'Central'].map((r) => (
            <option key={r} value={r}>
              Region: {r}
            </option>
          ))}
        </select>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        {trades.map((t) => (
          <div key={t.id} className="bg-surface border border-border rounded-2xl p-5 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="font-heading font-semibold text-lg">{t.nameEn}</h2>
                <p className="text-xs text-text-secondary">{t.nameHi}</p>
              </div>
              <EvidenceBadge status={t.evidenceStatus} isStale={t.isStale} />
            </div>
            <p className="text-xs text-text-secondary">
              <strong>NSQF Level:</strong> {t.nsqfLevel} • <strong>Duration:</strong> {t.durationMonths} months
            </p>
            <p className="text-xs text-text-secondary">
              <strong>Caveats:</strong> {t.limitationsEn}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
