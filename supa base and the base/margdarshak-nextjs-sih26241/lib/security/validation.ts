import { z } from 'zod';

export const ChatQuerySchema = z.object({
  sessionId: z.string().uuid(),
  language: z.enum(['en', 'hi']),
  mode: z.enum(['learner', 'parent', 'joint']),
  speakerRole: z.enum(['learner', 'parent']).optional(),
  tradeId: z.string().max(64).optional().nullable(),
  concernCategory: z.enum([
    'income',
    'job_stability',
    'social_perception',
    'course_suitability',
    'progression',
    'duration_cost',
    'sensitive_or_unresolved'
  ]).optional(),
  message: z
    .string()
    .trim()
    .min(2, 'Please enter a question.')
    .max(500, 'Question must be under 500 characters.'),
  context: z.object({
    region: z.string().max(64).optional(),
    education: z.string().max(64).optional(),
    interest: z.string().max(64).optional(),
    incomeBracket: z.string().max(64).optional(),
  }).optional(),
});

export const CounsellorRequestSchema = z.object({
  sessionId: z.string().uuid(),
  name: z.string().trim().min(2, 'Name is required').max(80),
  contact: z
    .string()
    .trim()
    .refine(
      (val) => /^[6-9]\d{9}$/.test(val) || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
      'Enter a valid 10-digit Indian mobile number or email address'
    ),
  preferredLanguage: z.enum(['en', 'hi']),
  region: z.string().max(64).default('All India'),
  tradeId: z.string().max(64).optional().nullable(),
  topicCategory: z.enum([
    'income',
    'job_stability',
    'social_perception',
    'course_suitability',
    'progression',
    'duration_cost',
    'sensitive_or_unresolved'
  ]),
  notes: z.string().trim().max(400).optional(),
  consentGiven: z.literal(true, {
    errorMap: () => ({ message: 'Explicit consent is required to store contact details for a callback.' }),
  }),
  honeypotWebsite: z.string().max(0, 'Bot submission rejected').optional(),
});

export function sanitizeUserText(input: string): string {
  return input
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .trim();
}
