import { describe, it, expect } from 'vitest';
import { postValidateAiResponse, StructuredAiResponse } from '../../lib/ai/pipeline';
import { filterKAnonymousGroups } from '../../app/api/admin/metrics/route';

describe('AI Numeric Post-Validation & Anti-Hallucination Guard', () => {
  it('allows numbers that exist in retrieved catalogue records', () => {
    const allowed = new Set<number>([4, 12, 14000, 22000, 68]);
    const sample: StructuredAiResponse = {
      intent: 'factual-quantitative',
      answer: 'At NSQF Level 4, the 12-month Electrician course shows illustrative earnings of 14,000 to 22,000 INR.',
      verified_facts: [
        {
          claim: 'Placement rate reported at 68% across sample centres.',
          source_id: 'SRC-NSDC-DEMO',
          source_title: 'NSDC Demo Catalogue',
          verified_at: '2026-08-01',
          evidence_status: 'illustrative',
        },
      ],
      general_guidance: ['Practical workshop attendance improves readiness.'],
      caveats: ['Illustrative demonstration data.'],
      confidence: 'high',
      needs_escalation: false,
    };

    const res = postValidateAiResponse(sample, allowed);
    expect(res.valid).toBe(true);
    expect(res.strippedNumbers).toHaveLength(0);
  });

  it('intercepts and strips unverified numbers not in retrieved records', () => {
    const allowed = new Set<number>([4, 12]);
    const hallucinated: StructuredAiResponse = {
      intent: 'factual-quantitative',
      answer: 'You will earn 95,000 INR per month with a 99% placement rate.',
      verified_facts: [],
      general_guidance: [],
      caveats: [],
      confidence: 'high',
      needs_escalation: false,
    };

    const res = postValidateAiResponse(hallucinated, allowed);
    expect(res.valid).toBe(false);
    expect(res.strippedNumbers).toContain(95000);
    expect(res.strippedNumbers).toContain(99);
    expect(res.sanitizedResponse.needs_escalation).toBe(true);
  });
});

describe('Admin k >= 5 Anonymity Filter', () => {
  it('suppresses any group with fewer than 5 records', () => {
    const rows = [
      { category: 'income', concern_count: 18 },
      { category: 'social_perception', concern_count: 4 },
      { category: 'sensitive_or_unresolved', concern_count: 2 },
      { category: 'job_stability', concern_count: 11 },
    ];
    const result = filterKAnonymousGroups(rows);
    expect(result.visibleRows).toHaveLength(2);
    expect(result.suppressedRowCount).toBe(2);
  });
});
