# Margdarshak (मार्गदर्शक) — AI-Enabled Career Counselling & Family Decision-Support Platform
**SIH 2026 • Problem Statement SIH26241 • Ministry of Skill Development and Entrepreneurship (MSDE)**

Margdarshak brings vocational learners and their parents/guardians into the same decision workspace with regional-language support (English + Hindi), traceable outcome records, NSQF progression pathways, and privacy-preserving administrator insights.

## Quick Start (Local Development)

1. **Install dependencies**
   ```bash
   npm install
   ```
2. **Configure environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Fill in your `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `AI_API_KEY`, and a 64-character hex `CONTACT_ENCRYPTION_KEY_HEX`.
3. **Apply Supabase database schema, RLS policies & seed dataset**
   ```bash
   npx supabase db push
   psql $DATABASE_URL -f supabase/seed.sql
   ```
4. **Run the development server**
   ```bash
   npm run dev
   ```
5. **Run unit tests, E2E tests, and security audit**
   ```bash
   npm run test:unit
   npm run test:e2e
   npm run security:audit
   ```

## Importing Official Verified Datasets (NSDC / Skill India / NCVET / PMKVY)
All seeded numbers are marked `is_illustrative = true` by default and display the **Illustrative** badge + demonstration banner. To import official verified data, prepare a CSV or JSON file matching `supabase/migrations/001_schema_rls.sql` (`sources`, `trades`, `qualifications`, `provider_outcomes`) with `verification_status = 'verified'` and `is_illustrative = false`.

## PRD Section 18 End-to-End Demo Script
1. **Language & Trust Model**: Open `/`, inspect the mandatory Demonstration Data banner and the 4 Evidence Badges (`Verified`, `Estimate`, `Illustrative`, `Unavailable`), and toggle between **English** and **हिंदी (Hindi)** in the top bar.
2. **Joint Learner + Parent Counselling (`/counselling`)**: Select **Joint Family Mode**, optionally enter family context (each field has a *"Why we ask"* tooltip and a *Skip* button), and click a learner question chip in the **Learner Lane** and a parent question chip (e.g., *"Salary & Earnings"* or *"Social Respect"*) in the **Parent Lane**.
3. **Evidence-Grounded Answer**: Inspect the separated **Verified/Catalogue Facts** vs. **General Guidance**, expand the **Traceable Source Chips**, test the **Read Aloud (TTS)** button, rate the answer with **Thumbs Up/Down**, and click **Download Family Summary (PDF)**.
4. **Compare Progression Options (`/pathways` & `/explore-trades`)**: Filter trades by region/NSQF level, inspect `Unavailable` and `May be outdated` badges on incomplete/stale records, step through the **NSQF Level 3 → 6 Timeline**, and compare two trades side-by-side.
5. **Unsupported Question & Counsellor Escalation (`/request-counsellor`)**: Ask an unsupported or distressed question (e.g., *"Can you guarantee a ₹1 Lakh/month government job abroad?"* or *"My family is in severe debt and conflict"*). Observe the transparent non-improvising fallback and submit a callback request with explicit consent.
6. **Protected Admin Insights (`/admin`)**: Sign in to the Admin View (`admin@msde-demo.gov.in` / demo access), filter aggregated concern categories by region/language/trade, verify that groups with $k < 5$ records are suppressed for privacy, and export a de-identified CSV summary.
