import { z } from 'zod';

const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(20),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(20),
  AI_PROVIDER: z.enum(['gemini', 'openai', 'anthropic']).default('gemini'),
  AI_API_KEY: z.string().min(10),
  AI_MODEL_NAME: z.string().default('gemini-2.5-flash'),
  CONTACT_ENCRYPTION_KEY_HEX: z.string().length(64, 'Must be 32-byte hex string (64 hex chars)'),
  CSRF_SECRET: z.string().min(16),
  CONVERSATION_RETENTION_DAYS: z.coerce.number().int().min(1).max(90).default(30),
  MIN_K_ANONYMITY_THRESHOLD: z.coerce.number().int().min(5).default(5),
});

export type EnvConfig = z.infer<typeof envSchema>;

export function validateServerEnv(): EnvConfig {
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    console.error('Invalid environment configuration:', parsed.error.flatten().fieldErrors);
    throw new Error('Server startup aborted due to invalid environment variables.');
  }
  return parsed.data;
}
