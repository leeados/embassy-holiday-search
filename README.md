# Thai Embassy Holiday Tracker

A web app for tracking upcoming closure days at Royal Thai Embassies and
Consulates-General. Pick a mission (or enter one manually), and the app
researches its official website and public social accounts to forecast
office-closure days for the next 6 months, with sources and confidence
levels for each entry.

## How it works

1. You choose a mission from a curated list (or supply a name / website /
   social account URLs manually).
2. The server calls the Gemini API with Google Search grounding enabled, and
   asks it to research the mission's official site, social accounts (e.g.
   Facebook), and the standard Royal Thai MFA holiday list for the relevant
   year(s).
3. A second Gemini call converts that research into strict structured JSON
   (date, title, category, source, confidence) for the closure days that fall
   in the next 6 months.
4. Results are rendered grouped by month, each with its category, confidence
   level, and source link. **Nothing is stored** — every scan is computed
   fresh; there is no database or cache.

## Setup

```bash
npm install
cp .env.example .env.local
# then edit .env.local and set GEMINI_API_KEY
npm run dev
```

Open http://localhost:3000.

### Getting a Gemini API key

Create one at https://aistudio.google.com/apikey and put it in
`.env.local` as `GEMINI_API_KEY`. Without it, scans will fail with a clear
"not configured" error — the rest of the UI still loads.

## Limitations

- **Social media coverage is best-effort.** Most platforms (Facebook,
  Instagram, X) block unauthenticated scraping and require login for full
  access. This app does not use platform APIs (none were configured), so it
  relies on Gemini's Google Search grounding to surface publicly indexed
  posts and pages rather than crawling social accounts directly. Ad-hoc,
  very recent announcements may be missed.
- **The curated mission list (`src/lib/thai-missions.ts`) uses best-guess
  official URLs** based on common Thai embassy site naming patterns; some
  may be stale or incorrect. The research step does not blindly trust these
  — it searches to confirm — but you should still verify results against the
  mission's own site before relying on them, and can always use "Other / not
  listed…" to enter a mission by hand.
- **This is not authoritative.** Treat results as a starting point for
  planning, not a replacement for checking the embassy directly before a
  visit, especially for consular/visa appointments.
- No results are persisted between requests, so each scan re-does the full
  research pass (typically 10-40 seconds).

## Tech stack

- Next.js 16 (App Router, TypeScript, Tailwind CSS)
- `@google/genai` for Gemini API access (Google Search grounding + structured
  JSON output)
- No database — fully stateless.
