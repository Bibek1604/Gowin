# GoWin Travels — website & admin panel

Public website and content-management panel for **Go Win International Travel and Tourism Pvt. Ltd.** (Kathmandu).
React 19 + Vite 6 + Tailwind 4 on the front end, Supabase (Postgres, Auth, Storage, Realtime) as the backend. Deployed on Vercel from the `main` branch.

## Run locally

```bash
cd Frontend/gowin
cp .env.example .env          # fill in VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
npm install
npm run dev                   # http://localhost:5173
```

`npm run build` writes `dist/` (and regenerates `public/sitemap.xml` from the published destinations first). `npm run lint` runs ESLint.

## Database

Schema lives in `supabase/migrations/` and is applied with the Supabase CLI (the project is already linked):

```bash
npx supabase db push --linked
```

Migrations added in October 2026:

| File | What it does |
|---|---|
| `20261026000000_platform_schema.sql` | Adds `slug`, `is_published`, `is_featured`, `image_credit` to packages; `slug`, `is_active`, `sort_order` to categories; booking/inquiry fields; `site_settings` and `admin_users` tables; the public `media` storage bucket. Idempotent, nothing is dropped. |
| `20261026000001_rls_policies.sql` | Turns on row-level security everywhere: visitors read published content and submit forms; only sign-ins listed in `admin_users` can change anything. Apply **after** the content migration below. |

One-off content correction (photos, categories, trekking removal, duplicates, the two home-page top-10 lists) — the plan is `scripts/content-plan.mjs`, the editorial text for the 20 showcase packages is `scripts/showcase-content.mjs`. Everything runs in the right order with one command:

```bash
npm run db:backup -- backup.json      # snapshot first
npm run db:deploy -- --dry-run        # preview
npm run db:deploy                     # schema → content → RLS → verify
```

`db:deploy` is idempotent: re-running it re-applies the plan (prices are never touched). The individual steps are still available as `db:push`, `db:migrate-content` and `db:verify`. Other scripts: `npm run db:audit` (read-only overview of every table), `npm run media:build` (rebuilds `supabase/media/*.webp` from `sources.json`; needs Python 3 + Pillow).

## Admin panel

* URL: `/login` → `/admin`. Accounts are Supabase Auth users whose email is also in the `admin_users` table (managed under **Settings → Admin access**). Create the login itself in the Supabase dashboard (*Authentication → Users → Invite*). Self-service sign-up should stay disabled.
* **Destinations**: create/edit packages with multiple photos (uploaded to the `media` bucket and resized in the browser), trip details (best time, highlights, inclusions, exclusions, itinerary), publish/unpublish and featured toggles, and a **display order** (1–10 fills the home-page "Top 10 in Nepal" / "Top 10 international" lists; 100 is the default). Unpublish instead of delete to keep history.
* **Categories**: travel styles with cover photo, order and active flag. Hiding a category hides its packages.
* **Bookings / Messages**: requests from the website with status workflow, notes and reply links. **Testimonials**: only approved reviews are public. **Subscribers**: newsletter list with CSV export. **Settings**: phone, WhatsApp, email, address, hours, social links and SEO defaults used across the site.

## Images

All destination photos are self-hosted in Supabase Storage (`media/library/*.webp`). The source, licence and verification note for each one is recorded in `supabase/media/sources.json` / `manifest.json`; Wikimedia Commons photos carry a credit that is displayed on the detail page.

The four home-page hero backgrounds are bundled with the site (`public/hero/*.webp`, 1920×1080, built by the same pipeline; see `public/hero/manifest.json` and `src/data/heroSlides.js`), so the first screen always shows a real photograph even if the database is slow.

## Environment variables

| Name | Where | Purpose |
|---|---|---|
| `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` | `.env`, Vercel | Public Supabase credentials (the anon key is safe to expose; RLS protects the data). `NEXT_PUBLIC_*` names from the Vercel–Supabase integration are accepted too. |
| `VITE_SITE_URL` | optional | Canonical site URL for SEO tags and the sitemap (default `https://gowintravels.com`). |
| `VITE_ADMIN_EMAILS` | optional | Extra client-side allowlist for `/admin`. Server-side access is the `admin_users` table. |

## Project layout

```
src/
  App.jsx                 routes (public + lazy-loaded admin)
  components/Store/       zustand stores (one per table) — all Supabase access lives here
  components/Tourism/     public pages and sections
  components/Details/     destination detail page
  components/Layout/      booking, login, route guards
  components/admin/       admin panel screens
  components/ui/          shared building blocks (modal, forms, uploader, badges…)
  lib/                    helpers: SEO tags, storage upload, formatting, slugs, errors
  data/siteContent.js     static copy (services, FAQs, travel tips, defaults)
  data/heroSlides.js      the four bundled hero photographs and their captions
scripts/                  database audit, backup, content migration, verification, sitemap
supabase/migrations/      schema history;   supabase/media/   verified image library
docs/                     audit and verification reports
```
