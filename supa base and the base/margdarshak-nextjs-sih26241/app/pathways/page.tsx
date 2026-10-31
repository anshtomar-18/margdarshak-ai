'use client';

import React, { useState } from 'react';
import { TRADES } from '@/lib/db/catalogue';

export default function PathwaysPage() {
  const [tradeAId, setTradeAId] = useState('TRD-ELEC');
  const [tradeBId, setTradeBId] = useState('TRD-SOLAR');
  const tradeA = TRADES.find((t) => t.id === tradeAId) || TRADES[0]!;
  const tradeB = TRADES.find((t) => t.id === tradeBId) || TRADES[1]!;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-2xl font-heading font-bold">Interactive NSQF Progression Pathways & Trade Comparison</h1>
      <p className="text-sm text-text-secondary">
        Progression routes are presented as options subject to assessment and institute availability—never automatic guarantees.
      </p>
      <div className="grid md:grid-cols-2 gap-6">
        {[
          { trade: tradeA, setId: setTradeAId },
          { trade: tradeB, setId: setTradeBId },
        ].map(({ trade, setId }, idx) => (
          <div key={idx} className="bg-surface border border-border rounded-2xl p-5 space-y-4">
            <select
              value={trade.id}
              onChange={(e) => setId(e.target.value)}
              className="w-full border border-border rounded-xl px-3 py-2 text-sm bg-background font-medium"
            >
              {TRADES.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.nameEn} (NSQF {t.nsqfLevel})
                </option>
              ))}
            </select>
            <div className="space-y-3">
              {trade.pathways.map((step) => (
                <div key={step.nsqfLevel} className="border-l-4 border-primary pl-3 py-1 space-y-1">
                  <span className="text-xs font-bold text-primary">NSQF Level {step.nsqfLevel} • {step.durationEn}</span>
                  <h3 className="text-sm font-semibold">{step.qualificationEn}</h3>
                  <p className="text-xs text-text-secondary">Role: {step.roleEn} — {step.optionsEn}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
