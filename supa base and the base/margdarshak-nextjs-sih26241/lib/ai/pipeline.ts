import { z } from 'zod';

export const StructuredAiResponseSchema = z.object({
  intent: z.enum(['factual-quantitative', 'pathway', 'general_guidance', 'sensitive', 'out_of_scope']),
  answer: z.string(),
  verified_facts: z.array(
    z.object({
      claim: z.string(),
      source_id: z.string(),
      source_title: z.string(),
      verified_at: z.string(),
      evidence_status: z.enum(['verified', 'estimate', 'illustrative', 'unavailable']),
    })
  ),
  general_guidance: z.array(z.string()),
  caveats: z.array(z.string()),
  confidence: z.enum(['high', 'medium', 'low']),
  needs_escalation: z.boolean(),
  escalation_reason: z.string().optional(),
});

export type StructuredAiResponse = z.infer<typeof StructuredAiResponseSchema>;

const FORBIDDEN_GUARANTEE_PATTERNS = [
  /100%\s*(job|placement)\s*guarantee/i,
  /guaranteed\s*(salary|job|income|placement)/i,
  /पक्की\s*नौकरी\s*की\s*गारंटी/i,
  /गारंटीड\s*सैलरी/i,
];

/**
 * Post-validates that every number mentioned in the AI answer or verified_facts
 * exists in the allowed numbers extracted from the retrieved database records.
 * Also strips or rejects any job/salary guarantee promises.
 */
export function postValidateAiResponse(
  response: StructuredAiResponse,
  allowedNumbersFromRecords: Set<number>
): { valid: boolean; sanitizedResponse: StructuredAiResponse; strippedNumbers: number[] } {
  const strippedNumbers: number[] = [];

  const checkAndCleanText = (text: string): string => {
    let cleaned = text;
    for (const pattern of FORBIDDEN_GUARANTEE_PATTERNS) {
      cleaned = cleaned.replace(pattern, '[Note: Outcomes depend on local market and assessment; never guaranteed]');
    }
    const numberMatches = cleaned.match(/\d+(?:,\d+)*(?:\.\d+)?/g) || [];
    for (const rawNum of numberMatches) {
      const normalized = Number(rawNum.replace(/,/g, ''));
      if (!Number.isNaN(normalized) && !allowedNumbersFromRecords.has(normalized)) {
        strippedNumbers.push(normalized);
      }
    }
    return cleaned;
  };

  const sanitizedAnswer = checkAndCleanText(response.answer);
  const sanitizedFacts = response.verified_facts.map((f) => ({
    ...f,
    claim: checkAndCleanText(f.claim),
  }));

  if (strippedNumbers.length > 0) {
    return {
      valid: false,
      strippedNumbers,
      sanitizedResponse: {
        ...response,
        answer:
          'Some specific figures requested are not available in our verified catalogue for your selection. Please review the verified source cards below or request a human counsellor callback.',
        verified_facts: sanitizedFacts.filter((f) => {
          const nums = (f.claim.match(/\d+(?:,\d+)*(?:\.\d+)?/g) || []).map((n) => Number(n.replace(/,/g, '')));
          return nums.every((n) => allowedNumbersFromRecords.has(n));
        }),
        confidence: 'low',
        needs_escalation: true,
        escalation_reason: 'Unverified numeric claim intercepted by post-validator.',
      },
    };
  }

  return {
    valid: true,
    strippedNumbers: [],
    sanitizedResponse: {
      ...response,
      answer: sanitizedAnswer,
      verified_facts: sanitizedFacts,
    },
  };
}
