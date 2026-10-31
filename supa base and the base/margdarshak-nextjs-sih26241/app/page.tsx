import React from 'react';
import Link from 'next/link';
import { TRADES, SOURCES } from '@/lib/db/catalogue';
import { EvidenceBadge } from '@/components/EvidenceBadge';

export default function LandingPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-12">
      <section className="bg-gradient-to-br from-primary-tint to-surface border border-border rounded-2xl p-8 space-y-6">
        <span className="inline-block bg-primary text-white text-xs font-semibold px-3 py-1 rounded-full">
          SIH 2026 • Problem Statement SIH26241 • MSDE
        </span>
        <h1 className="text-3xl md:text-4xl font-heading font-bold text-text-primary">
          Margdarshak (मार्गदर्शक): Evidence-Backed Career Counselling for Learners & Families
        </h1>
        <p className="text-base md:text-lg text-text-secondary max-w-3xl">
          Helping learners and parents explore vocational trades, NSQF qualification pathways, realistic earnings ranges, and verified sources side by side—without sales pitches or false job guarantees.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/counselling"
            data-testid="nav-counselling"
            className="bg-primary hover:bg-primary-hover text-white font-medium px-5 py-3 rounded-xl"
          >
            Start Joint Family Counselling →
          </Link>
          <Link
            href="/explore-trades"
            className="bg-surface hover:bg-primary-tint text-primary border border-primary font-medium px-5 py-3 rounded-xl"
          >
            Explore {TRADES.length} Curated Trades
          </Link>
          <Link
            href="/request-counsellor"
            className="bg-accent hover:bg-accent-hover text-text-primary font-semibold px-5 py-3 rounded-xl"
          >
            Request Counsellor Callback
          </Link>
        </div>
      </section>

      <section className="grid md:grid-cols-4 gap-4">
        {(['verified', 'estimate', 'illustrative', 'unavailable'] as const).map((status) => (
          <div key={status} className="bg-surface border border-border rounded-2xl p-5 space-y-2">
            <EvidenceBadge status={status} />
            <p className="text-xs text-text-secondary">
              {status === 'verified' && 'Directly backed by official NCVET or DGT syllabus/framework notifications.'}
              {status === 'estimate' && 'Derived from regional PMKVY sample tracking with stated sample limitations.'}
              {status === 'illustrative' && 'Seeded demonstration figure for SIH26241 evaluation; never presented as an official guarantee.'}
              {status === 'unavailable' && 'Shown transparently when reliable data does not exist—never fabricated.'}
            </p>
          </div>
        ))}
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-heading font-bold">Featured Vocational Trades ({TRADES.length})</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {TRADES.slice(0, 6).map((trade) => (
            <div key={trade.id} className="bg-surface border border-border rounded-2xl p-5 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-heading font-semibold text-base">{trade.nameEn}</h3>
                  <p className="text-xs text-text-secondary">{trade.nameHi}</p>
                </div>
                <span className="bg-primary-tint text-primary text-xs font-semibold px-2.5 py-1 rounded-lg">
                  NSQF {trade.nsqfLevel}
                </span>
              </div>
              <EvidenceBadge status={trade.evidenceStatus} isStale={trade.isStale} />
              <div className="text-xs space-y-1 text-text-secondary">
                <p>
                  <strong>Duration:</strong> {trade.durationMonths} months ({trade.eligibilityEn})
                </p>
                <p>
                  <strong>Starting Range:</strong>{' '}
                  {trade.earningsMinInr && trade.earningsMaxInr
                    ? `₹${trade.earningsMinInr.toLocaleString('en-IN')} – ₹${trade.earningsMaxInr.toLocaleString('en-IN')}/mo`
                    : 'Unavailable'}
                </p>
                <p>
                  <strong>Placement Rate:</strong>{' '}
                  {trade.placementRatePct !== null ? `${trade.placementRatePct}%` : 'Unavailable'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
