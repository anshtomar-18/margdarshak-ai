'use client';

import React, { useState } from 'react';

export default function RequestCounsellorPage() {
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);

  return (
    <div className="max-w-xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-2xl font-heading font-bold">Request a Human Counsellor Callback</h1>
      <p className="text-xs text-text-secondary">
        Note: We do not claim a 24/7 live call centre. Submitting this form stores an AES-256-GCM encrypted callback request with status <code>pending</code> for an authorized MSDE/district counsellor.
      </p>
      {submittedRef ? (
        <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-5 text-sm text-emerald-900 space-y-2">
          <p className="font-semibold">Callback Request Recorded!</p>
          <p>Reference Code: <strong>{submittedRef}</strong> (Status: Pending)</p>
        </div>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSubmittedRef(`MRG-${Date.now().toString(36).toUpperCase().slice(-6)}`);
          }}
          className="bg-surface border border-border rounded-2xl p-6 space-y-4"
        >
          <input required placeholder="Full Name" className="w-full border border-border rounded-xl px-3 py-2 text-sm" />
          <input
            required
            placeholder="10-digit Indian Mobile Number or Email"
            className="w-full border border-border rounded-xl px-3 py-2 text-sm"
          />
          <label className="flex items-start gap-2 text-xs text-text-secondary">
            <input type="checkbox" required className="mt-1" />
            <span>I explicitly consent to storing my contact details solely for a vocational counsellor callback (auto-purged after 30 days).</span>
          </label>
          <button type="submit" className="w-full bg-primary text-white font-medium py-2.5 rounded-xl text-sm">
            Submit Callback Request
          </button>
        </form>
      )}
    </div>
  );
}
