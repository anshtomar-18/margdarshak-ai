import React from 'react';
import { SOURCES } from '@/lib/db/catalogue';
import { EvidenceBadge } from '@/components/EvidenceBadge';

export default function SourcesPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-2xl font-heading font-bold">Dataset & Evidence Source Registry</h1>
      <div className="space-y-4">
        {SOURCES.map((s) => (
          <div key={s.id} className="bg-surface border border-border rounded-2xl p-5 space-y-2">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h2 className="font-heading font-semibold text-base">{s.title}</h2>
              <EvidenceBadge status={s.verificationStatus} />
            </div>
            <p className="text-xs text-text-secondary">
              <strong>Publisher:</strong> {s.publisher} • <strong>Published:</strong> {s.publicationDate} • <strong>Last Checked:</strong> {s.lastChecked}
            </p>
            <p className="text-xs text-text-secondary">
              <strong>Limitations:</strong> {s.limitationsEn}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
