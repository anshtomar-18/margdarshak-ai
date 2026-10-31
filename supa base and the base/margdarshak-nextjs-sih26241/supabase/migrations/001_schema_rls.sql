-- ============================================================================
-- MARGDARSHAK (SIH26241 - MSDE) DATABASE SCHEMA, PGVECTOR & RLS POLICIES
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Enum Types
CREATE TYPE verification_status_type AS ENUM ('verified', 'estimate', 'illustrative', 'unavailable');
CREATE TYPE user_mode_type AS ENUM ('learner', 'parent', 'joint');
CREATE TYPE concern_category_type AS ENUM (
  'income',
  'job_stability',
  'social_perception',
  'course_suitability',
  'progression',
  'duration_cost',
  'sensitive_or_unresolved'
);
CREATE TYPE resolution_status_type AS ENUM ('answered', 'fallback', 'escalated');
CREATE TYPE request_status_type AS ENUM ('pending', 'in_progress', 'completed', 'deleted');

-- 1. SOURCES TABLE
CREATE TABLE public.sources (
  id TEXT PRIMARY KEY,
  publisher TEXT NOT NULL,
  title TEXT NOT NULL,
  publication_date DATE NOT NULL,
  reference_url TEXT NOT NULL,
  coverage TEXT NOT NULL,
  last_checked DATE NOT NULL,
  limitations_en TEXT NOT NULL,
  limitations_hi TEXT NOT NULL,
  verification_status verification_status_type NOT NULL DEFAULT 'illustrative',
  embedding vector(1536),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. TRADES TABLE
CREATE TABLE public.trades (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name_en TEXT NOT NULL,
  name_hi TEXT NOT NULL,
  description_en TEXT NOT NULL,
  description_hi TEXT NOT NULL,
  category TEXT NOT NULL,
  regions TEXT[] NOT NULL DEFAULT '{}',
  duration_months INTEGER NOT NULL,
  nsqf_level INTEGER NOT NULL CHECK (nsqf_level BETWEEN 1 AND 8),
  eligibility_en TEXT NOT NULL,
  eligibility_hi TEXT NOT NULL,
  job_roles_en TEXT[] NOT NULL DEFAULT '{}',
  job_roles_hi TEXT[] NOT NULL DEFAULT '{}',
  work_conditions_en TEXT NOT NULL,
  work_conditions_hi TEXT NOT NULL,
  is_illustrative BOOLEAN NOT NULL DEFAULT TRUE,
  source_id TEXT NOT NULL REFERENCES public.sources(id) ON DELETE RESTRICT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. QUALIFICATIONS & PATHWAYS TABLE
CREATE TABLE public.qualifications (
  id TEXT PRIMARY KEY,
  trade_id TEXT NOT NULL REFERENCES public.trades(id) ON DELETE CASCADE,
  nsqf_level INTEGER NOT NULL CHECK (nsqf_level BETWEEN 1 AND 8),
  qualification_en TEXT NOT NULL,
  qualification_hi TEXT NOT NULL,
  role_title_en TEXT NOT NULL,
  role_title_hi TEXT NOT NULL,
  prerequisites_en TEXT NOT NULL,
  prerequisites_hi TEXT NOT NULL,
  progression_options_en TEXT NOT NULL,
  progression_options_hi TEXT NOT NULL,
  typical_experience_en TEXT NOT NULL,
  typical_experience_hi TEXT NOT NULL,
  source_id TEXT NOT NULL REFERENCES public.sources(id) ON DELETE RESTRICT
);

-- 4. PROVIDER OUTCOMES TABLE
CREATE TABLE public.provider_outcomes (
  id TEXT PRIMARY KEY,
  trade_id TEXT NOT NULL REFERENCES public.trades(id) ON DELETE CASCADE,
  provider_name TEXT NOT NULL,
  course_name_en TEXT NOT NULL,
  course_name_hi TEXT NOT NULL,
  region TEXT NOT NULL,
  placement_rate_pct NUMERIC(5,2), -- Nullable: missing data shown as Unavailable
  earnings_min_inr INTEGER,        -- Nullable: missing data shown as Unavailable
  earnings_max_inr INTEGER,
  training_cost_inr INTEGER,       -- Nullable: missing data shown as Unavailable
  reporting_period TEXT NOT NULL,
  sample_size INTEGER,
  source_id TEXT NOT NULL REFERENCES public.sources(id) ON DELETE RESTRICT,
  verified_at DATE NOT NULL,
  is_stale BOOLEAN NOT NULL DEFAULT FALSE,
  evidence_status verification_status_type NOT NULL DEFAULT 'illustrative',
  limitations_en TEXT NOT NULL,
  limitations_hi TEXT NOT NULL
);

-- 5. CONCERNS TABLE (De-identified session analytics, 30-day retention)
CREATE TABLE public.concerns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL, -- Pseudonymous UUID, no PII
  language TEXT NOT NULL CHECK (language IN ('en', 'hi')),
  user_mode user_mode_type NOT NULL DEFAULT 'joint',
  region TEXT NOT NULL DEFAULT 'All India',
  trade_id TEXT REFERENCES public.trades(id) ON DELETE SET NULL,
  concern_category concern_category_type NOT NULL,
  resolution_status resolution_status_type NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '30 days')
);

-- 6. ANSWER FEEDBACK TABLE
CREATE TABLE public.answer_feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL,
  concern_id UUID REFERENCES public.concerns(id) ON DELETE CASCADE,
  is_helpful BOOLEAN NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. COUNSELLOR REQUESTS TABLE (Encrypted contact details at rest + explicit consent)
CREATE TABLE public.counsellor_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reference_code TEXT UNIQUE NOT NULL,
  session_id UUID NOT NULL,
  name_encrypted BYTEA NOT NULL,
  contact_encrypted BYTEA NOT NULL,
  preferred_language TEXT NOT NULL CHECK (preferred_language IN ('en', 'hi')),
  region TEXT NOT NULL DEFAULT 'All India',
  trade_id TEXT REFERENCES public.trades(id) ON DELETE SET NULL,
  topic_category concern_category_type NOT NULL,
  user_notes_sanitized TEXT,
  consent_given BOOLEAN NOT NULL CHECK (consent_given = TRUE),
  consent_timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status request_status_type NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  retention_until TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '30 days')
);

-- 8. ADMIN AUDIT LOGS TABLE
CREATE TABLE public.admin_audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_user_id UUID NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('login', 'csv_export', 'status_change', 'filter_query')),
  details JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. AGGREGATED K-ANONYMITY VIEWS FOR ADMIN DASHBOARD (k >= 5 enforced)
CREATE OR REPLACE VIEW public.admin_concern_aggregates_view AS
SELECT
  concern_category,
  language,
  region,
  COALESCE(trade_id, 'general') AS trade_id,
  resolution_status,
  COUNT(*) AS concern_count
FROM public.concerns
WHERE expires_at > NOW()
GROUP BY concern_category, language, region, COALESCE(trade_id, 'general'), resolution_status
HAVING COUNT(*) >= 5;

-- 10. AUTOMATIC 30-DAY RETENTION CLEANUP FUNCTION
CREATE OR REPLACE FUNCTION public.cleanup_expired_records()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM public.concerns WHERE expires_at <= NOW();
  DELETE FROM public.counsellor_requests WHERE retention_until <= NOW() AND status IN ('completed', 'deleted');
END;
$$;

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================
ALTER TABLE public.sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.qualifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.provider_outcomes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.concerns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.answer_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.counsellor_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;

-- Public read-only access to catalogue tables
CREATE POLICY "Public read sources" ON public.sources FOR SELECT USING (true);
CREATE POLICY "Public read trades" ON public.trades FOR SELECT USING (true);
CREATE POLICY "Public read qualifications" ON public.qualifications FOR SELECT USING (true);
CREATE POLICY "Public read provider_outcomes" ON public.provider_outcomes FOR SELECT USING (true);

-- Public insert-only for counsellor_requests and feedback; no public SELECT
CREATE POLICY "Public insert counsellor_requests" ON public.counsellor_requests
  FOR INSERT WITH CHECK (consent_given = TRUE);

CREATE POLICY "Public insert answer_feedback" ON public.answer_feedback
  FOR INSERT WITH CHECK (true);

-- Service role only for raw concerns table
CREATE POLICY "Service role only on concerns" ON public.concerns
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Admin role policies for audit logs and counsellor request status management
CREATE POLICY "Admin read audit logs" ON public.admin_audit_logs
  FOR SELECT USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "Admin insert audit logs" ON public.admin_audit_logs
  FOR INSERT WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
