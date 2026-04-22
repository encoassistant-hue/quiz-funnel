# quiz-funnel — OrthoBelt

High-converting quiz funnel for OrthoBelt (lower back / SI joint pain product).

**Stack:** Next.js 16 · TypeScript · Tailwind CSS · Framer Motion

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Analytics

The quiz writes analytics directly to Supabase from the browser. This is compatible with the repo's static export setup.

For scalable dashboard reads, the analytics page now uses Supabase SQL functions instead of loading the full raw event table into the browser.

Set the analytics environment in your app config:

```bash
NEXT_PUBLIC_ANALYTICS_ENV=dev
```

Recommended values:

- `dev` for local work
- `preview` for staging/preview deploys
- `prod` for production

One-time Supabase step:

1. Open SQL Editor in Supabase.
2. Run `supabase/analytics_functions.sql`.

The dashboard defaults to `prod` so local/dev traffic does not pollute the main view.

Inspect analytics in the browser:

```bash
http://localhost:3000/analytics
```

Run the terminal report:

```bash
npm run analyze:survey
```

Remove the manual test row if needed:

```sql
delete from public.quiz_events
where session_id = 'manual-test-session';
```

## A/B Versions

| URL | Version |
|-----|---------|
| `/` or `/?v=a` | **Version A** — Starts directly at Question 1 (no landing page) |
| `/?v=b` | **Version B** — Landing page first; gender buttons act as quiz entry |

## Quiz Flow

```
[Version B only] Landing Page (gender CTA)
  → Q1: Age
  → Q2: Pain location
  → Q3: Morning stiffness
  → Q4: Daily impact
  → Q5: Duration
  → Results Page 1 — Back Pain Profile Summary
  → Q6: Solutions tried (multi-select)
  → Education Slide — Why nothing works
  → Q7: Biggest concern
  → Q8: Motivation level
  → Results Page 2 — Final pitch + Claim Discount CTA
```

## Key Files

| File | Purpose |
|------|---------|
| `src/lib/quizData.ts` | All questions, options, screen order |
| `src/lib/types.ts` | TypeScript types |
| `src/components/QuizFunnel.tsx` | State machine / orchestrator |
| `src/components/LandingPage.tsx` | Version B landing page |
| `src/components/ResultsPage2.tsx` | Final CTA — update `PRODUCT_URL` here |
