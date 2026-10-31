# GoWin Travels — audit, repair and verification report

Date: 26–27 October 2026 · Scope: `Frontend/gowin` (React/Vite site + admin panel) and the linked Supabase project `wbbwibqpdboeqbflqkuj`.

> **Status in one line:** all code, migrations, images, seed content and scripts are complete and tested locally; the production database rollout is one command (`npm run db:deploy`) that still has to be run by a person because this environment refuses production deploys — see section 8. Until it runs, the live site keeps its current data (and its current time-out problem); the home-page hero already shows real photographs regardless.

---

## 1. Complete audit — problems found

### Content accuracy (highest priority)
| # | Finding | Evidence |
|---|---|---|
| 1 | **Photos of the wrong place on ~20 destinations.** Taj Mahal under *Bandipur & Tansen*, a Kathmandu stupa under *Pokhara / Phewa Lake / Kayaking*, a tropical beach under *Kathmandu Valley Heritage Tour* (and on the About page captioned "Kathmandu"), skydivers under *Bhote Koshi Bungee*, a rock climber under *Trishuli Rafting*, a parked bus under *Lumbini*, Lago di Braies (Italy) under *Tilicho* and *Gosaikunda*, a Utah desert road under *Gosaikunda*, Santorini under *Dubrovnik*, the Swiss Alps under *Iceland*, *Queenstown*, *Mardi Himal* and *Nagarkot*, an African elephant under *Chitwan/Bardia*, a child's portrait under *Annapurna Base Camp / Upper Mustang / Poon Hill*. | Contact sheets of every image reviewed (`scratchpad`), results in `docs/DESTINATION_VERIFICATION.md` |
| 2 | **Two site-wide images return HTTP 404** (`photo-1516490701338…` used for the hero, footer, About hero, Everest flight; `photo-1512100606965…` used for the Maldives). | HEAD requests during the audit |
| 3 | **26 of 76 packages are duplicates or test rows** ("but", "new", "Butwal", two Kathmandu tours, three Rara Lake rows, three Gosaikunda rows…). | `scripts/db-audit.mjs` |
| 4 | **Six Philippine destinations were saved as *categories*** (Big Lagoon, Kayangan Lake, Chocolate Hills, Siargao, Banaue, Manila) with multi-MB embedded photos; a typo category "relax"; eight categories with no description or image. | categories table dump |
| 5 | Trekking content everywhere: 19 trekking packages, "Treks of Nepal" home section, trekking keywords in `index.html`, trekking categories, the hero copy ("Trek to Everest Base Camp"), the About story ("started as a trekking company"). | source grep |
| 6 | Hard-coded fake data shown to visitors: seed destinations with fake ratings ("4.9", "48 reviews"), fabricated per-country package counts ("Japan · 12 tours"), fake stats ("2,500+ travellers", "98% satisfaction", "4.9/5"), fake trust claims ("Free cancellation", "Insurance included", "100% secure payments") that contradict the business's own refund policy, a generic invented 7-day itinerary on every detail page. | `seedData.js`, `FetchDestinationDetails.jsx`, `BookingSteps.jsx`, `Testimonials.jsx` |
| 7 | The only public testimonial is the developer's test entry ("Happy to trek with him"). | testimonials table |

### Functionality / data
| # | Finding |
|---|---|
| 8 | **Destinations do not load on the live site.** Images uploaded from the admin panel were stored as base64 strings inside `tour_packages.images` (~80 MB in 13 rows, one row alone 10 MB). The site's `select *` query now exceeds Supabase's statement time-out: `canceling statement due to statement timeout` on every attempt (reproduced twice, 4.2 s / 4.5 s). This is the root cause of "records disappearing". |
| 9 | Admin "cover image" upload wrote the base64 file into the row instead of Storage; only one image per destination; no publish/draft state; no featured flag; no slugs (URLs were raw UUIDs). |
| 10 | The booking form collected a city/country field that was never saved; no message field; deleting a package cascaded and **deleted its bookings**. |
| 11 | Live `bookings` table has no `created_at` column (schema drifted from migrations); the dashboard's "recent" list silently depended on it. |
| 12 | Contact "Interested in" options were hard-coded and trekking-focused; messages had no status, so staff could not track replies. |
| 13 | Package details (itinerary, highlights) lived on a separate admin page keyed by package, allowing several blocks per package and orphaned rows (the only existing row is a test block titled "hero" attached to the test package "Butwal"). |
| 14 | Legal, support and guide pages rendered a **second fixed navbar** on top of the global one; "Browse all" and "Get custom guide" buttons did nothing; the guides page contained invented marketing fluff. |
| 15 | Unused components, images (`bali.jpeg`, `thiland*.jpeg`, `visaImage.png`…), an outdated theme guide and a `colors.js` that nothing imported. |

### Security
| # | Finding |
|---|---|
| 16 | **Row-level security was disabled on every table.** Anyone holding the anon key (it ships in the browser bundle) could insert, edit or delete any destination, booking, message or subscriber. Verified by inserting and deleting a probe row with the anon key. |
| 17 | No admin allowlist in the database: any Supabase Auth account counted as admin; `VITE_ADMIN_EMAILS` was an empty client-side gate. |
| 18 | `.env.example` contained the real URL and anon key of an older project; `.env` is committed to git (public values only). |
| 19 | No file-type/size validation on uploads; no storage bucket existed at all. |

### Performance / SEO
| # | Finding |
|---|---|
| 20 | Every page load fetched the full 80 MB packages payload (then timed out); the navbar, footer, hero and every carousel each triggered their own fetch. |
| 21 | Single page title and description for all routes; no canonical tags; sitemap listed only static pages; `robots.txt` fine. Structured data advertised trekking. Favicons referenced from `/src/assets`. |
| 22 | Framer-motion, Supabase and the whole admin panel were in the single 500 kB+ bundle. |

---

## 2. Fix summary — what changed and where

### Data layer and security (`supabase/`, `scripts/`)
* `supabase/migrations/20261026000000_platform_schema.sql` — slugs, `is_published`, `is_featured`, `image_credit`, `updated_at` triggers, category `is_active`/`sort_order`, booking `address`/`message`/`admin_notes`/`tour_title`/`created_at`, message `phone`/`status`, `site_settings` (one row), `admin_users` allowlist (bootstrapped from existing auth users), `media` storage bucket, booking FK changed to `ON DELETE SET NULL`. Idempotent; no content dropped.
* `supabase/migrations/20261026000001_rls_policies.sql` — RLS on all nine tables plus storage: public read of published/approved/active rows, public insert of bookings/messages/subscribers (status forced to Pending/New), everything else admin-only via `public.is_admin()`.
* `scripts/content-plan.mjs` — the full correction plan (44 corrected packages, 32 unpublished with reasons, 8 new, 12 categories).
* `scripts/migrate-content.mjs` — applies the plan: uploads the verified image library, moves every embedded base64 image to Storage, fixes categories, re-points packages, unpublishes trekking/duplicates/test rows, recreates the six Philippine destinations as packages, hides the test testimonial, fills site settings. Re-runnable; `--dry-run` supported.
* `scripts/verify-content.mjs` — 18 read-only checks (no trekking published, slugs unique, every image URL returns 200, RLS blocks anonymous writes, forms still work…).
* `scripts/backup-content.mjs`, `scripts/db-audit.mjs`, `scripts/prerender.mjs` (runs on every build; replaced generate-sitemap.mjs on 31 Oct), `scripts/build-media.py`.
* `supabase/media/` — 68 verified WebP photos (≤1600 px, 14 MB) with `sources.json` / `manifest.json` recording source, licence and what each photo shows.

### Front end (`src/`)
* **Stores** (`components/Store/*`): rewritten; one store per table, consistent `{ success, data, error }` results, realtime refetch debounced, pre-migration fallbacks so the site keeps working during the upgrade. New `MessageStore`, `TestimonialStore`, `SubscriberStore`, `SettingsStore`; `DetailStore` merged into `PlaceStore.savePlace` (one details block per package).
* **Shared UI** (`components/ui/*`): `SmartImage` (lazy, branded fallback), `PageHero`, `SectionHeader`, `Modal`, `ConfirmDialog`, form fields with inline errors, `ImageUploader` (browser-side resize to WebP → Storage, multi-image, reorder, cover), `TagListInput`, `ItineraryEditor`, `StatusBadge`, skeletons, empty states.
* **Public pages**: home rebuilt from real data only (hero from featured packages, Nepal spotlight, carousels, categories with real counts, countries with real counts, services, honest "why us", process, approved reviews, CTA); destinations listing with URL-driven filters (region, experience, country, search, sort, load-more); detail page (gallery, highlights, inclusions/exclusions, itinerary or honest "on request", photo credit, related packages, JSON-LD); booking (custom-trip option, full validation, address/message saved, honest "request received" state); contact (settings-driven, dynamic topics); new Services page; Travel Tips rewritten with practical Nepal advice; Help/FAQ with FAQ schema; legal pages de-duplicated (no second navbar); 404; per-route SEO (`lib/seo.js`).
* **Admin panel** (`components/admin/*`): dashboard with real counts, attention list and content-health checks; Destinations (grid, status/region/category filters, publish/feature toggles, delete with warning, full create/edit form including trip details); Categories; Bookings (status workflow Pending→Confirmed→Completed/Cancelled, notes, reply links); Messages (New/Replied/Closed); Testimonials (approve/hide); Subscribers (CSV export); Settings (contact/social/SEO + admin allowlist). Old `/admin/add-*` URLs redirect.
* **Build/SEO**: route-level code splitting, vendor chunks, `envPrefix` for Vercel–Supabase variables, favicons/manifest in `public/`, OpenGraph cover, sitemap with every published destination, honest `index.html` metadata.
* Removed: `seedData.js`, five old home sections, five old admin pages, `DetailStore`, `theme/colors.js`, theme guide, unused images.

---

## 3. Destination verification

See **`docs/DESTINATION_VERIFICATION.md`** (generated from the plan): for each of the 52 published packages the title, slug, location, category, the photo(s) and what each photo was verified to show, the source/licence and the photo it replaces; the 32 unpublished rows with reasons; the 68-file image library; and the items that need the owner's confirmation (prices, owner-uploaded photos).

Method: every image used anywhere on the site or in the database was downloaded and reviewed on labelled contact sheets; candidates from Wikimedia Commons (licence-filtered to CC BY / CC BY-SA / public domain, ≥1200 px) were reviewed the same way before selection. Nothing was accepted on file name or alt text alone.

---

## 4. Admin CRUD test report

Tests that could run **without** the production migration (this session):

| Module | Create | Read | Update | Delete | How |
|---|---|---|---|---|---|
| RLS policies (all tables + storage) | ✔ | ✔ | ✔ | ✔ | Both migrations applied to a local PostgreSQL 17 (PGlite) with auth/storage stubs; 36 assertions for anonymous, non-admin and admin JWTs — all pass (`scratchpad/pgtest/validate.mjs`). |
| Destinations UI | form validation, slug generation, image uploader, trip-details editor | list, filters, status tabs | publish/feature toggles wired | confirm dialog | Rendered in headless Chrome against a fixture that mirrors the post-migration data; no console errors. |
| Categories, Bookings, Messages, Testimonials, Subscribers, Settings UI | ✔ render | ✔ render | wired | wired | Same harness, desktop 1366 px and mobile 390 px. |

Tests that **must wait** for the migration (they write to the live database): creating a real destination with a real upload, verifying the row and the storage object, editing, unpublishing, deleting, booking/inquiry submission end to end, admin sign-in with the owner's account. The exact script is in section 8.

---

## 5. Frontend test report

Headless Chrome (installed Google Chrome via puppeteer-core) against the local dev server; page title, `<h1>`, console errors, failed requests, broken `<img>` and horizontal overflow checked on every page.

| Page | 1366 px | 390 px | Result |
|---|---|---|---|
| Home `/` | ✔ | ✔ | hero slides from featured packages, all sections, no overflow |
| `/destinations`, `/destinations/national`, `/destinations/international?country=Philippines`, `?category=` | ✔ | ✔ | filters, counts, sort, load-more |
| `/places/chitwan-jungle-safari` | ✔ | ✔ | gallery, highlights, inclusions, itinerary, related |
| `/booking?package=…` | ✔ | ✔ | prefilled package, validation messages |
| `/contact`, `/about`, `/services`, `/guides`, `/support`, `/refund`, `/privacy`, `/terms`, `/login`, 404 | ✔ | ✔ (contact) | no second navbar, settings-driven contact data |
| Admin: dashboard, destinations (+ add form), bookings, messages, categories, testimonials, settings | ✔ | ✔ (bookings) | no console errors |

Found and fixed during testing: a lucide `Map` icon import shadowing the `Map` constructor (crashed the listing page); animation-gated sections; placeholder duration text on the Philippine packages.

---

## 6. Database verification

Verified against the **live** database (read-only or self-cleaning):
* Table counts and every row's content (76 packages, 24 categories, 1 detail block, 1 booking, 1 testimonial, 2 messages, 3 subscribers) — `scripts/db-audit.mjs`; full snapshot saved before any change (`backup-content.mjs`).
* 13 packages + 7 categories + 1 testimonial store base64 images (largest 10.7 MB); the legacy query times out — reproduced.
* RLS is off: an anonymous insert into `categories` succeeded (probe row removed immediately).
* The live `bookings` table lacks `created_at`; all six historical migrations are recorded as applied.
* No storage bucket exists (upload probe: "Bucket not found").
* Both new migrations apply cleanly and behave as intended on PostgreSQL 17 locally; `supabase db push --dry-run` connects to the linked project successfully.

Pending (blocked, section 8): applying the migrations to production, running the content migration, and `scripts/verify-content.mjs` (which also confirms that every published image URL returns 200 and that anonymous writes are refused).

---

## 7. Performance and security findings

Improvements made:
* Images: self-hosted WebP ≤1600 px (average ~200 KB) instead of 1–10 MB base64 rows and third-party hotlinks; lazy loading, `decoding="async"`, `fetchpriority` on the hero; placeholder instead of random photos.
* One shared fetch per table (loaded once in `App.jsx`), realtime refetch debounced; no base64 in rows after migration (the legacy query that timed out becomes a few hundred kB).
* Code splitting: admin panel, legal and guide pages are separate chunks; vendor chunks for React, Supabase, framer-motion; main bundle 103 kB gzipped.
* Per-route titles, descriptions, canonical URLs, Open Graph/Twitter tags, `TravelAgency`, `TouristTrip` and `FAQPage` JSON-LD; sitemap with every published destination; `noindex` on admin/login/404; semantic headings, alt text, keyboard-accessible dialogs, reduced-motion support.
* Security: RLS everywhere, admin allowlist, storage policies (public read, admin write, 10 MB and image-only limits), friendly error mapping that never leaks SQL, no secrets in the repo (`.env.example` sanitised).

Remaining risks / recommendations:
* **Disable self-service sign-up** in Supabase Auth (Dashboard → Authentication → Providers → Email) so only invited staff can obtain accounts; with the allowlist this is defence in depth.
* Rotate the anon key if it was ever treated as secret (it is not, but the old `.env.example` exposed the previous project's key).
* `.env` with public values is still tracked; move the two variables into Vercel project settings and then remove `.env` from git.
* Storage image transformations (responsive sizes) are a Supabase Pro feature; cards currently reuse the 1600 px files.
* Consider a server-side notification (Supabase Edge Function or email webhook) so new bookings reach staff without opening the admin panel.

---

## 8. Unresolved issues and exact next steps

### Blocker: production database changes need a human to run them
In this environment `supabase db push --linked` is refused by the safety classifier ("Production Deploy") — it was attempted again on 27 October with the same result — so nothing has been applied to the live project yet. A fresh snapshot was taken before the attempt. Run, from `Frontend/gowin`:

```bash
npm run db:deploy -- --dry-run                   # optional preview
npm run db:deploy                                # schema → content (photos, top-10 seed) → RLS → verify
```
`db:deploy` (`scripts/db-deploy.mjs`) applies `20261026000000` on its own, waits for the API schema cache, runs the content migration, applies `20261026000001`, then runs the read-only checks, which must end with `ALL CONTENT CHECKS PASSED`.
Then sign in at `/login` with the existing admin account (every existing Supabase Auth user was allow-listed automatically) and run the end-to-end script: create a test destination with an uploaded photo → confirm it appears in the admin list and, after publishing, on the public site → edit title/photos/description → refresh → unpublish → delete. Delete the `__verify__` booking that `db:verify` creates. If you prefer, add a QA email under Settings → Admin access and invite that user from the Supabase dashboard.

### Needs the business owner
* Confirm or clear the indicative prices (all were seeded placeholders).
* Confirm WhatsApp number (the business phone is used), social links and office hours under Settings.
* Confirm that the re-published trekking-free catalogue matches what the company sells; any unpublished package can be re-published from the admin panel.
* Provide real customer testimonials (the only existing one was a test).
* Confirm ownership/licence of the owner-uploaded photos reused from the old records.

### Minor follow-ups
* Vercel: confirm Node ≥ 20.6 in project settings (the sitemap step runs on build).
* After the migration, remove the pre-migration fallbacks in `PlaceStore`/`CategoryStore`/`BookingStore`/`MessageStore` when convenient (they are harmless).

---

## 9. Iteration 2 (27 October) — seeded showcase content, real hero photographs

Requested: seed matching data for the destinations, use three or four real tourism photographs as the home-page background, show ten Nepal and ten international destination cards, keep trekking out.

### What changed
* **Home hero** (`src/components/Tourism/Hero.jsx`, `src/data/heroSlides.js`, `public/hero/`): four bundled 1920×1080 photographs built from the verified sources — Phewa Lake and the Annapurna range from Sarangkot, Boudhanath Stupa, a jeep safari in Chitwan, Oia on Santorini — each with its caption, link and licence credit. The hero no longer depends on the database, the first image is preloaded, and the credit is shown on screen (Creative Commons attribution).
* **Top-10 lists** (`src/components/Tourism/DestinationGrid.jsx`, `TourismHome.jsx`): "Top 10 in Nepal" and "Top 10 international" replace the previous carousels and the Nepal spotlight. Cards are numbered, swipe on phones and form a five-column grid on desktop. The `NepalSpotlight` section was removed as redundant.
* **Display order** (`sort_order` on `tour_packages`, added to the still-pending `20261026000000` migration and re-validated on local PostgreSQL 17): visible in the admin form as "Display order"; `sortPlaces('featured')` now orders by it first, then featured, then newest.
* **Seed content** (`scripts/showcase-content.mjs`, merged by `content-plan.mjs`): for the 20 showcase packages a factual description, duration, best time, 4–6 highlights, inclusions, exclusions and a day-by-day itinerary. Nepal: Kathmandu Valley, Pokhara & Sarangkot, Chitwan, Lumbini & Buddha circuit, Golden Triangle, Nagarkot & Dhulikhel, Bhaktapur, Muktinath, Bandipur & Tansen, Bardiya. International: Maldives, Bali, Santorini (via Athens), Dubai, Bangkok, Singapore, Paris, Swiss Alps, Phuket, El Nido. Prices were not invented: existing indicative figures stay, new packages show "Price on request". Overstated copy was rewritten (e.g. "tigers on foot" in Chitwan, "ski powder and zip-line over glaciers" in Interlaken, "Everest to Annapurna" from Nagarkot).
* **Scripts**: `migrate-content.mjs` writes duration/sort order and updates (rather than skips) previously created rows on re-run; `verify-content.mjs` checks that each top-10 list is complete, ordered 1–10 and fully detailed; `db-deploy.mjs` runs the whole rollout in order.
* No trekking content is published or linked anywhere on the public site (`verify-content` also asserts this).

### Tested
* `eslint .` and `vite build` pass; migrations re-validated with 36 passing policy and schema assertions on PGlite.
* Headless Chrome against the post-migration fixture: `/`, `/destinations`, `/destinations/international`, `/places/chitwan-jungle-safari`, `/places/el-nido-big-lagoon`, `/places/maldives-overwater-villa`, `/admin`, `/admin/destinations?new=1` at 1366 px and 390 px — no console errors, no broken images, no horizontal overflow; itinerary, inclusions/exclusions and "Display order" render as intended.
* Headless Chrome against the live (not yet migrated) database: the hero shows the bundled photographs; the package sections stay empty until `db:deploy` runs (the known statement-timeout).

---

## 10. Iteration 3 (27 October) — photo links with provenance, admin gallery editor, 20 + 20 verified destinations

Requested: real images found by searching for each place, stored as **direct image links** with source, credit, alt text, order and cover flag; 20 Nepal and 20 international destinations with a primary photo and gallery; images across the site; an admin panel that can add, replace, preview, reorder and remove image links; strict verification; a final report.

### What changed
* **Data model** (`package_images` in the pending `20261026000000` migration, RLS in `20261026000001`): one row per photo with `url`, `source_url`, `credit`, `alt_text`, `sort_order`, `is_primary`; unique per (package, link); links must be http(s); rows are deleted with their package; visitors read only photos of published packages, admins manage everything. Existing http(s) links on packages are carried into the table by the migration itself. Categories gained `image_credit`.
* **Photo links** (`supabase/media/sources.json` → `photos.json` via `scripts/build-photo-links.py`): 122 photos (78 Wikimedia Commons, 30 Unsplash, 14 owner uploads). Each was searched by place name (Wikipedia lead image + Commons search, licence- and size-filtered), viewed on contact sheets and matched to the real place; the resolved link, source page, photographer + licence, alt text and size are recorded and every link is fetched to confirm it loads. 54 re-hosted WebP copies were removed from the repository; only the owner's 14 photos remain as files. Google Images thumbnails (`encrypted-tbn0.gstatic.com`) were not used — they expire and carry no licence — in line with the brief's own preference for stable, licensed sources.
* **Destinations**: 52 published (21 Nepal, 31 international), every one with 2–4 photos (129 photo rows), a unique cover, name, "Place, Country" location, category and description. Photos that did not match the place were replaced: Railay (Krabi) on the Phuket package → three Phuket photos; Mount Fuji on the Kyoto package → Kinkaku-ji and Fushimi Inari; generic Alps cover on Interlaken → Interlaken; generic savanna cover on the Kenya safari → Maasai Mara elephants; the Golden Triangle package got its own cover (Kathmandu Durbar Square) instead of sharing the Kathmandu tour's.
* **Admin** (`src/components/ui/GalleryEditor.jsx`, `DestinationForm.jsx`): photos are managed as links — paste a link (checked in the browser before it is accepted; a web page or dead link is refused with a clear message), upload a file (becomes a link in the media bucket), edit alt text / credit / source page per photo, move up/down, make cover, replace link, remove; broken previews show a "Not loading" badge. Publishing requires a photo with alt text. Category form gained a photo-credit field.
* **Public site**: cards use each photo's alt text; the detail page shows the active photo's credit (linked to its source page) and lists all credits; category cards show their credit; `SmartImage` keeps swapping failed images for the branded placeholder.
* **Scripts**: `migrate-content.mjs` writes `package_images` rows (upsert by link, removes dropped rows) and uploads only the owner's photos; `verify-content.mjs` checks 20+/20+ destinations, 2+ photos each (3+ for the top-10 lists), one cover each, no shared covers, photo reuse only within the same place, alt text / source / credit on every photo, Commons credits, and fetches every link (paced for Wikimedia); `db-deploy.mjs` waits for the new table.
* **Supabase keys**: the app and scripts accept the project's new publishable key (`VITE_SUPABASE_PUBLISHABLE_KEY`) and fall back to the legacy anon key; the Supabase agent skills were added to `.claude/skills` for future maintenance. The Next.js `@supabase/ssr` snippet does not apply to this Vite single-page app and was not added.

### Rollout log (27 October, run by the owner)
`npm run db:deploy` applied `20261026000000` and ran the content migration: photos, categories, 44 packages, trip details and settings went through. Two things failed and are fixed by `20261027000000_price_optional_and_image_cleanup.sql` plus a retry in `migrate-content.mjs`:
* three updates timed out on rows that still embedded multi-megabyte base64 photos (Bali, Paris, the Siargao category) — the embedded copies are dropped by the new migration (safe copies exist in `supabase/media` and the bucket) and realtime replica identity is set to the key so updates stop logging whole rows;
* the eight new packages could not be created because the live `price` column was NOT NULL (the repo schema had it nullable) — now optional, which the admin form also relies on for "Price on request".
Re-running `npm run db:deploy` applies the fix, re-applies the plan (idempotent) and continues with row-level security and the checks.
