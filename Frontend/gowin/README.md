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

`npm run build` runs `vite build` and then `scripts/prerender.mjs`, which writes a static HTML page for every public URL (home, listings, all published packages, content pages, a real `404.html`) plus `sitemap.xml` and `robots.txt` — see *SEO and prerendering* below. `npm run lint` runs ESLint. To try the production routing locally: `npx serve dist` (uses `public/serve.json`, which mirrors `vercel.json`).

## SEO and prerendering

The app is client-rendered, so without help every URL would return the same empty page. At build time `scripts/prerender.mjs` reads the published content from Supabase (public key, read-only) and writes `dist/<route>.html` with that page's title, description, canonical URL, Open Graph tags, schema.org JSON-LD (`src/lib/schema.js`, shared with the app) and its real content. React replaces that markup when it starts (`src/main.jsx` waits for the hero photo to paint, then loads `src/boot.jsx`).

* Canonical origin: `https://www.gowintravels.com` (`VITE_SITE_URL` overrides it).
* A package published **after** a deploy works for visitors at once (the 404 page runs the app) but is only prerendered and in the sitemap after the next build — use a Vercel deploy hook triggered by a Supabase webhook on `tour_packages` (see `docs/WEBSITE_AUDIT_2026-10-31.md`, section 5).
* `vercel.json` (repo root): clean URLs, real 404s, app-only routes (`/admin`, `/login`, `/details/*`) rewritten to `app.html`, security headers (CSP etc.) and long-term caching for hashed assets. If you add a third-party script, image host or iframe, update the CSP there.
* Inner-page banners use the bundled hero photos (`src/data/pageBanners.js`); keep the prerender in sync if you change them.

## Database

Schema lives in `supabase/migrations/` and is applied with the Supabase CLI (the project is already linked):

```bash
npx supabase db push --linked --include-all     # same as: npm run db:push
```

`--include-all` is needed because the RLS file is dated before migrations that are already applied.

Migrations added in October 2026:

| File | What it does |
|---|---|
| `20261026000000_platform_schema.sql` | Adds `slug`, `is_published`, `is_featured`, `image_credit`, `sort_order` to packages; the `package_images` table (one row per photo: link, source page, credit, alt text, order, cover — existing links are carried over); `slug`, `is_active`, `sort_order`, `image_credit` to categories; booking/inquiry fields; `site_settings` and `admin_users` tables; the public `media` storage bucket. Idempotent, nothing is dropped. |
| `20261027000000_price_optional_and_image_cleanup.sql` | Makes `price` optional ("Price on request"), sets realtime replica identity to the key, and drops three embedded base64 photos that were too large to update through the API (copies exist in `supabase/media` and the bucket). |
| `20261026000001_rls_policies.sql` | Turns on row-level security everywhere: visitors read published content and submit forms; only sign-ins listed in `admin_users` can change anything. Apply **after** the content migration below. **Not yet applied to production (31 Oct 2026)** — run `npm run db:push`. |
| `20261031000000_form_guards.sql` | Server-side limits for the public forms: length / email-shape CHECK constraints (NOT VALID, so old rows are untouched) and a trigger allowing at most 5 bookings or messages per email per 10 minutes from anonymous visitors. |

One-off content correction (photo links, categories, trekking removal, duplicates, the two home-page top-10 lists) — the plan is `scripts/content-plan.mjs`, the editorial text for the 20 showcase packages is `scripts/showcase-content.mjs`, the photo links are `supabase/media/photos.json`. Everything runs in the right order with one command:

```bash
npm run db:backup -- backup.json      # snapshot first
npm run db:deploy -- --dry-run        # preview
npm run db:deploy                     # schema → content → RLS → verify
```

`db:deploy` is idempotent: re-running it re-applies the plan (prices are never touched). The individual steps are still available as `db:push`, `db:migrate-content` and `db:verify` (`db:verify` also fetches every photo link and fails if one does not load). Other scripts: `npm run db:audit` (read-only overview of every table), `npm run media:links` (re-resolves `supabase/media/sources.json` into `photos.json`, checking that each link loads; needs Python 3 + Pillow).

## Admin panel

* URL: `/login` → `/admin`. Accounts are Supabase Auth users whose email is also in the `admin_users` table (managed under **Settings → Admin access**). Create the login itself in the Supabase dashboard (*Authentication → Users → Invite*). Self-service sign-up should stay disabled.
* **Destinations**: create/edit packages with a **photo gallery by link** — paste the direct link to a photo (it is checked in the browser before it is accepted), add alt text, credit and source page, re-order, replace or remove photos, pick the cover (first photo); files can still be uploaded to the `media` bucket (resized in the browser) and become links too — plus trip details (best time, highlights, inclusions, exclusions, itinerary), publish/unpublish and featured toggles, and a **display order** (1–10 fills the home-page "Top 10 in Nepal" / "Top 10 international" lists; 100 is the default). Publishing requires at least one photo with alt text. Unpublish instead of delete to keep history.
* **Categories**: travel styles with cover photo (link or upload), photo credit, order and active flag. Hiding a category hides its packages.
* **Bookings / Messages**: requests from the website with status workflow, notes and reply links. **Testimonials**: only approved reviews are public. **Subscribers**: newsletter list with CSV export. **Settings**: phone, WhatsApp, email, address, hours, social links and SEO defaults used across the site.

## Images

Every destination photo is stored as a **direct link to a real photograph on its source site**, one row per photo in `package_images` (`url`, `source_url`, `credit`, `alt_text`, `sort_order`, `is_primary`; the package's `images` column keeps the same links in order for older code and SEO). Sources are Wikimedia Commons (CC BY / CC BY-SA / CC0 / public domain — author and licence are shown as the credit on the detail page and category card) and Unsplash; the owner's own photos, which have no external source, live in `supabase/media/*.webp` and are uploaded to the public `media` bucket. Google Images thumbnails are deliberately not used: they expire, are low-resolution and carry no licence.

`supabase/media/sources.json` is the hand-curated list (Commons file title or Unsplash id, what the photo was verified to show, alt text); `npm run media:links` resolves it into `photos.json` (direct link, source page, credit, size, date checked). The full table is in `docs/DESTINATION_VERIFICATION.md`. Wikimedia only serves certain thumbnail widths to other sites (1280 px is used) and rate-limits bursts, so the scripts pace their requests.

The four home-page hero backgrounds are bundled with the site (`public/hero/*.webp`, 1920×1080, built by the same pipeline; see `public/hero/manifest.json` and `src/data/heroSlides.js`), so the first screen always shows a real photograph even if the database is slow.

## Environment variables

| Name | Where | Purpose |
|---|---|---|
| `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` | `.env`, Vercel | Public Supabase credentials (the anon key is safe to expose; RLS protects the data). `NEXT_PUBLIC_*` names from the Vercel–Supabase integration are accepted too. |
| `VITE_SITE_URL` | optional | Canonical site URL for SEO tags, the prerendered pages and the sitemap (default `https://www.gowintravels.com` — the apex domain redirects to www). |
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
  components/ui/          shared building blocks (modal, forms, gallery editor, badges…)
  lib/                    helpers: SEO tags, storage upload, formatting, slugs, errors
  data/siteContent.js     static copy (services, FAQs, travel tips, defaults)
  data/heroSlides.js      the four bundled hero photographs and their captions
  data/pageBanners.js     which bundled photo each inner page uses as its banner
  lib/schema.js           schema.org JSON-LD builders (app + prerender)
  lib/useSpamGuard.jsx    honeypot / minimum-time / cooldown for public forms
  main.jsx, boot.jsx      start-up: paint the prerendered page first, then mount React
  routes.js               code-split page loaders
scripts/                  prerender + sitemap, database audit, backup, content migration, verification
supabase/migrations/      schema history;   supabase/media/   photo sources + links, owner photos
docs/                     audit and verification reports (latest: WEBSITE_AUDIT_2026-10-31.md)
.claude/skills/           Supabase agent skills for AI coding tools (npx skills add supabase/agent-skills)
```
