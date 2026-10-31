import React from 'react';
import { VerificationStatus } from '@/lib/db/catalogue';

export function EvidenceBadge({
  status,
  isStale = false,
  lang = 'en',
}: {
  status: VerificationStatus;
  isStale?: boolean;
  lang?: 'en' | 'hi';
}) {
  const styles: Record<VerificationStatus, string> = {
    verified: 'bg-emerald-50 text-emerald-800 border-emerald-300',
    estimate: 'bg-amber-50 text-amber-800 border-amber-300',
    illustrative: 'bg-slate-50 text-slate-700 border-slate-400 border-dashed',
    unavailable: 'bg-gray-100 text-gray-600 border-gray-300',
  };

  const labels: Record<VerificationStatus, { en: string; hi: string }> = {
    verified: { en: 'Verified Source', hi: 'सत्यापित स्रोत' },
    estimate: { en: 'Regional Estimate', hi: 'क्षेत्रीय अनुमान' },
    illustrative: { en: 'Illustrative (Demo)', hi: 'प्रदर्शन डेटा (Illustrative)' },
    unavailable: { en: 'Unavailable', hi: 'अनुपलब्ध' },
  };

  return (
    <span className="inline-flex items-center gap-1.5 flex-wrap">
      <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full border ${styles[status]}`}>
        {labels[status][lang]}
      </span>
      {isStale && (
        <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-orange-100 text-orange-900 border border-orange-300">
          {lang === 'hi' ? 'पुराना हो सकता है' : 'May be outdated'}
        </span>
      )}
    </span>
  );
}
