# GoWin Travels — website audit, competitor benchmark and improvements

Date: 31 October 2026 · Scope: https://www.gowintravels.com (repo `Frontend/gowin`, Vercel project `gowin`, Supabase project `wbbwibqpdboeqbflqkuj`).
Follows the 26–27 October repair (`docs/AUDIT_AND_FIX_REPORT.md`). Every number below was measured in this session; anything not measured is marked **unverified**.

> **One action is still needed from the owner:** the row-level-security migration has **not** been applied to the production database, so bookings, contact messages, subscriber emails and the admin list are readable — and every table writable — with the public key that ships in the website. This environment is not allowed to push production database changes. Run `npm run db:push` (section 9).

---

## 1. What the site is (discovery)

| Item | Finding (evidence) |
|---|---|
| Business | Go Win International Travel and Tourism Pvt. Ltd., Shankhamul-31, Kathmandu (`site_settings`, legal pages). Inquiry-based: no online payment; staff confirm and quote (Booking page, FAQ). |
| Products | 52 published packages: 21 Nepal (heritage, pilgrimage, wildlife, lakes, adventure activities, scenic) and 31 international (beach, city, honeymoon, Philippines). Plus flights, hotels, visa assistance, insurance (`SERVICES`). No trekking (removed on purpose in the October repair). |
| Stack | React 19 + Vite 6 + Tailwind 4, Zustand stores, Supabase (Postgres, Auth, Storage, Realtime). Client-side rendered SPA, deployed to Vercel from `main`, Cloudflare in front (DNS proxied). |
| Admin | `/login` → `/admin`: destinations (gallery by link), categories, bookings, messages, testimonials, subscribers, settings. Access = Supabase Auth user whose email is in `admin_users` (2 rows). |
| Data | 84 packages (52 published), 152 photo rows, 26 categories (12 active), 1 booking, 2 messages, 3 subscribers, 1 testimonial (not approved). |
| Migrations | All applied **except** `20261026000001_rls_policies.sql` (row-level security) and the new `20261031000000_form_guards.sql` (`supabase migration list`). |

## 2. Inventory — problems found and what was done

| Page / feature | Existing implementation | Problem (evidence) | Severity | Done |
|---|---|---|---|---|
| Database security | RLS migration written but not applied | Anonymous key can read `bookings`, `contact_messages`, `newsletter_subscribers`, `admin_users` and insert into `categories` (probe in `db:audit`) | **Critical** | Migration reviewed and improved (`(select is_admin())` per statement, `search_path=''`); booking/contact inserts fixed so they keep working under RLS; `db:verify` now checks that customer tables are not readable. **Push needs the owner** (section 9). |
| Public forms vs RLS | `insert(...).select('*')` | Under RLS visitors cannot read bookings, so PostgREST would reject every booking/contact submission the moment RLS goes live | **Critical** | Inserts no longer read the row back (verified in E2E: no `return=representation`). |
| Data loading | Every page loaded **all 84** packages with `select *` | Unpublished legacy rows still hold base64 photos: **11.2 MB of JSON on every page view** (curl: 11,163,742 bytes, 3.4 s) | **Critical** | Visitors load published rows only (**196 KB**, 57× smaller); admin panel loads all. |
| Package pages for crawlers | `noindex` while loading | A rendered snapshot of `/places/chitwan-jungle-safari` on the live site still showed `noindex, nofollow`, title "Destination", no H1 after network idle | **Critical** | `noindex` only for a confirmed missing package; package data embedded in the page; page fetches its own row immediately. |
| Raw HTML (all pages) | Empty `<div id="root">`, same title/description everywhere | Live home page: 23 words, 0 H1, no canonical, no JSON-LD (section 4). WhatsApp/Facebook previews of every package showed the home page | **High** | Build-time prerendering of 65 public URLs (section 5). |
| Canonical host | `https://gowintravels.com` in canonical, sitemap, OG | Apex **307-redirects** to `www` — every canonical pointed to a redirect | **High** | Canonical origin is `https://www.gowintravels.com` everywhere. Apex → www should be a permanent (308) redirect in Vercel → Domains (**owner**). |
| Unknown URLs | Catch-all rewrite to `index.html` | Every unknown URL answered **200** (soft 404s) | **High** | Real 404 status (`404.html`, still runs the app so late-published packages render). |
| Security headers | none | No CSP, X-Frame-Options, nosniff, Referrer-Policy, Permissions-Policy (`curl -I`) | **High** | Added in `vercel.json`; CSP replayed locally against all pages: **0 violations**. Long-lived caching for hashed assets. |
| Spam protection | none | Forms had validation and double-click protection only | Medium | Honeypot, minimum fill time, per-browser cooldown, length limits (client) + `form_guards` migration: CHECK constraints and a 5-per-10-minutes burst trigger (server). |
| Images | Full-size originals everywhere | Home page **18 MB**; Lighthouse "properly size images" 8.4 MB | **High** | `srcset` for Unsplash (`w=`), Wikimedia (500/960/1280) and bundled heroes (960/1920); hero mounts only visible slides; width/height hints. |
| Fonts | Google Fonts CSS (render-blocking, third party) | 750–1,090 ms render-blocking | Medium | Self-hosted `@fontsource` (Latin subset, 7 weights). |
| JavaScript | 470 kB initial, framer-motion for fade-ins | TBT 490 ms mobile | Medium | framer-motion replaced by a 30-line `Reveal` component (−116 kB); every route except home code-split; app evaluates after the first paint. |
| Hero (home) | H1 = rotating photo caption; autoplay every 7 s | H1 did not say what GoWin does and changed every 7 s; auto-rotation without a real pause control (WCAG 2.2.2); later slides became new LCP candidates | Medium | Stable H1 + value proposition; caption chip links the photo to its tour; no autoplay; bigger controls. |
| Hero search | Enter jumped to the first suggestion | Typing "beach" + Enter opened one random package | Low | Enter opens the results page (`/destinations?q=`). |
| Mobile package page | Thumbnails over the title; booking card below the itinerary | Title covered on 375 px; price/CTA far down the page | Medium | Thumbnails below the photo on phones; sticky price + Request + WhatsApp bar. |
| Accessibility | — | Lighthouse a11y 85 (home): white on #10B981 = 2.5:1, unnamed search button, heading jumps, focusable hidden drawer, 16–20 px tap targets, no skip link | Medium | Accessible accent `#047857` (5.5:1), grey text `gray-500`, labels, heading order, `inert` drawer, 24 px+ targets, skip link. **100** on all tested pages. |
| Structured data | TouristTrip with `availability: InStock` | Availability was invented (inquiry-based business) | Low | Removed. Graph per page: TravelAgency + WebSite (home), TouristTrip with day-by-day ItemList + Offer only when a price is published + BreadcrumbList (packages), CollectionPage/ItemList (listings). No ratings or review counts. |
| Listing titles | "International holidays" | International packages are sold to Nepal-based travellers; search intent is "…from Nepal" | Low | Intent-matched title tags (H1s unchanged). |
| `npm run db:deploy` | `supabase db push --linked` | Would now fail: the RLS file is dated before already-applied migrations (`DbPushMissingRemoteError`) | Medium | `--include-all` added. |
| Dead config | `_redirects` (Netlify), `generate-sitemap.mjs`, committed stale `sitemap.xml` with UUID URLs | — | Low | Removed; sitemap is generated from the same data as the pages. |

## 3. Competitor benchmark

Raw HTML of each home page fetched on 31 Oct 2026 (what a crawler without JavaScript and every link preview sees). Scores (0–10) are given **only** for these measured dimensions; UX, booking flow and content depth were not tested on competitor sites and are **unverified**.

| Site | Status / size | Words in raw HTML | H1 | Canonical | JSON-LD types | Sitemap | Reviews / WhatsApp in HTML | Languages (hreflang) |
|---|---|---|---|---|---|---|---|---|
| nepalhikingteam.com | 200 · 402 kB | 2,412 | "Local Experts in Himalayan Trekking" | ✓ | TravelAgency, WebSite | 200 | ✓ / ✓ | — |
| tourradar.com | 200 · 282 kB | 1,655 | 2 H1s ("Black Friday") | ✓ | Product, Organization, WebSite | 200 | ✓ / — | 6 |
| nepaltravels.com | 200 · 65 kB (2.6 s) | 1,127 | "Discover your next adventure with us." | ✗ | none | **500** | ✓ / — | — |
| acethehimalaya.com | 200 · 1,353 kB | 7,504 | "Experience the Difference!" | ✓ | Place, TravelAgency, Organization, WebSite, WebPage | 200 | ✓ / ✓ | — |
| intrepidtravel.com | 200 · 522 kB | 1,224 | "Real and remarkable small group trips worldwide" | ✓ | none on home | 200 | ✓ / — | 61 |
| **gowintravels.com (live, before)** | 200 · 3 kB | **23** | **none** | ✗ | none | 200 | — / — | — |
| **gowintravels.com (this build)** | 200 · 19 kB | **1,353** | "Nepal tours & world holidays, planned in Kathmandu" | ✓ | TravelAgency, WebSite | 200 | — / ✓ | — |

| Measured dimension (0–10) | NHT | TourRadar | Nepal Travels | Ace | Intrepid | GoWin before | GoWin now |
|---|---|---|---|---|---|---|---|
| Crawlable content | 9 | 8 | 7 | 10 | 8 | 1 | 8 |
| Metadata & canonical | 9 | 8 | 5 | 8 | 9 | 3 | 10 |
| Structured data | 7 | 7 | 0 | 9 | 3 | 0 | 8 |
| Social proof in page | 8 | 9 | 6 | 9 | 8 | 0 | 0 |

**Adopt:** server-visible content and per-page metadata (all five do it); a stable, specific H1 (Intrepid, NHT); TravelAgency + breadcrumb structured data (NHT, Ace); WhatsApp as a first-class contact (NHT, Ace — GoWin now has it on every package and as a sticky button).
**Adapt:** long-form destination guides (Ace's home page is 7,500 words — useful as separate guide pages, not on the home page); independent reviews (all competitors) — only once GoWin has real, verifiable reviews (Google Business Profile / Tripadvisor); hreflang only if translated pages are ever produced.
**Avoid:** promotional H1s ("Black Friday"), two H1s, unverifiable superlatives ("leading", "5-star rated") without a linked source, sitemap errors (nepaltravels.com returns 500).
**GoWin's differentiation:** one Kathmandu team for both Nepal tours *and* outbound holidays with flights, hotels and visas — a combination none of the trekking specialists offer. The site now says so in its first sentence.

## 4. SEO — crawlability and indexing (verified)

* Every public URL now answers with its own title, description, canonical (`https://www.gowintravels.com/...`), robots, Open Graph/Twitter tags, JSON-LD and readable content. Static audit of all 66 generated pages: **0 problems** (exactly one H1, unique titles ≤ 60 characters, unique descriptions 50–160, canonical = URL, valid JSON-LD with absolute `www` URLs, every sitemap URL has a page).
* `sitemap.xml`: 65 URLs incl. `<lastmod>` and the cover image of each package. `robots.txt` disallows `/admin` and `/login`. Note: Cloudflare prepends its own "managed content signals" block to robots.txt; Lighthouse flags `Content-Signal` as an unknown directive. Harmless for Google; switch it off in Cloudflare → AI Crawl Control if a clean file is preferred (**owner**).
* Status codes (tested against the build with the same rewrite rules): pages 200; `/about/` and `/about.html` → 301 to `/about`; unknown pages and unknown packages → **404**; `/admin/*`, `/login`, `/details/*` → app shell.
* Google Search Console coverage: **unverified** (no access). After deploy: submit `https://www.gowintravels.com/sitemap.xml`, inspect one package URL.

### Keyword → URL map (based on what GoWin actually sells)

| Intent | Market | Target URL |
|---|---|---|
| Nepal tour packages / Nepal holiday packages | international + domestic | `/destinations/national` |
| Kathmandu valley heritage tour, Kathmandu sightseeing tour | international | `/places/kathmandu-valley-heritage-tour` |
| Chitwan jungle safari package / price | both | `/places/chitwan-jungle-safari` |
| Lumbini tour, Buddhist pilgrimage Nepal | international (Asia) | `/places/lumbini-buddha-circuit` |
| Muktinath tour package | domestic + India | `/places/muktinath-pilgrimage-tour` |
| Pokhara tour package, Pokhara honeymoon | domestic | `/places/pokhara-sarangkot-escape`, `/places/pokhara-honeymoon-escape` |
| Nepal golden triangle tour (Kathmandu, Pokhara, Chitwan) | international | `/places/nepal-golden-triangle` |
| Dubai / Bali / Thailand / Maldives package from Nepal | domestic (outbound) | `/places/dubai-desert-skyline`, `/places/bali-island-retreat`, `/places/phuket-beach-paradise`, `/places/maldives-overwater-villa` |
| international tour packages from Nepal | domestic (outbound) | `/destinations/international` |
| visa assistance Kathmandu, VFS appointment help | domestic | `/services` (consider a dedicated `/services/visa-assistance` page) |
| air ticket booking Kathmandu | domestic | `/services` |
| best time to visit Nepal, Nepal visa on arrival | international | `/guides` |

Currency: prices are published in USD (`$`) for every market. For domestic (outbound) packages a NPR "from" price would match local search behaviour — **owner decision**, the data model already accepts free-text prices.

## 5. How prerendering works (no rewrite of the app)

`npm run build` = `vite build` + `scripts/prerender.mjs`. The script reads published packages, categories and settings from Supabase with the public key and writes `dist/<route>.html` for every public URL using the same structured-data builders as the app (`src/lib/schema.js`) and the same copy (`src/data/siteContent.js`, `heroSlides.js`, `pageBanners.js`). React replaces the static markup when it starts; the static hero/cover is the same photo at the same size, so it stays the Largest Contentful Paint. A full SSR framework migration was not justified: the content is small, changes rarely, and this keeps the existing app untouched.

**Packages published after a deploy** render for visitors immediately (404 page runs the app) but are only in the sitemap / static HTML after the next build. Recommended (**owner**, 5 minutes): Vercel → Project → Settings → Git → *Deploy Hooks* → create a hook, then Supabase → Database → Webhooks → on `tour_packages` insert/update → POST to that hook URL. Keep the hook URL secret (not in the website code).

## 6. Performance — before / after (Lighthouse 12, mobile = simulated Moto G Power / slow 4G)

| Page | Before (live) | After (this build, local) |
|---|---|---|
| Home, mobile | Perf 52 · LCP 5.6 s · TBT 490 ms · CLS 0.068 · **18.0 MB** | Perf **72** · LCP 4.0 s · TBT 450 ms · CLS **0.003** · **2.5 MB** |
| Package, mobile | Perf 47 · LCP **54.8 s** · TBT 480 ms · 10.8 MB | Perf **82** · LCP **3.8 s** · TBT 210 ms · CLS 0.054 · **1.0 MB** |
| Listing, mobile | — | Perf 86 · LCP 3.0 s · CLS 0 |
| Home, desktop | Perf 87 · LCP 1.7 s · 18.9 MB | Perf **96** · LCP 1.3 s · CLS 0.002 |
| Accessibility | 85 / 93 / 90 | **100** on every page tested |
| SEO | 92 | **100** |

Real-browser trace with the same throttling: home LCP is the static hero at **2.0 s** (was 5.5 s), package page LCP the static cover at **2.8 s** (was 6.3 s). "After" was measured on a local server without Vercel's CDN; re-measure on the live site after deploy. **Field data** (Chrome UX Report / Search Console Core Web Vitals) is **unverified** — the site has too little traffic for CrUX; check Search Console after 28 days.
Remaining Best-Practices deduction (79): Wikimedia Commons sets a cookie on hot-linked images. Only self-hosting those photos would remove it.

## 7. Design system (tokens in `src/index.css`)

| Token | Value | Use |
|---|---|---|
| `--clr-primary` | `#1E3A8A` navy | headings accents, secondary buttons |
| `--clr-accent` | `#10B981` emerald | decoration, icons, on dark backgrounds |
| `--clr-accent-ink` | `#047857` (5.5:1 on white) | **primary buttons, small labels, text links** — new |
| `--clr-dark` | `#0F172A` | body text, dark sections |
| Body text grey | `gray-500` minimum on white (4.8:1) | never `gray-400` for text |
| Fonts | Plus Jakarta Sans 500/700/800 (headings), DM Sans 400–700 (body), self-hosted | |
| Motion | `Reveal` (fade-up once, disabled by `prefers-reduced-motion`), no autoplaying carousels | |
| Targets | ≥ 24 × 24 px (WCAG 2.2 2.5.8); icon buttons 44 px | |

## 7a. Content and trust (audit only — needs the business)

* **Prices**: 52 published packages, 8 "price on request" (Nepal Golden Triangle, Pokhara Honeymoon and six Philippines packages); prices were not changed and cannot be verified here (**owner** to confirm they are current; consider a "prices checked on" date).
* **Credentials**: no tourism licence / company registration number, NTB/TAAN membership or PAN is shown anywhere. Adding the real numbers to the footer and About page is the single strongest trust signal for both markets (**owner** to supply; do not publish unverified claims). The phrase "a registered Nepali travel company" (Why choose us) should be backed by that number.
* **Reviews**: zero approved testimonials (only the developer's test entry). The site correctly shows none. Collect real reviews (Google Business Profile link after each trip) before adding any review UI or rating schema.
* **Team / author**: no named staff or editor on guides — add real names/photos when available (E-E-A-T).
* **Newsletter**: sign-ups are stored (3) but no sending workflow exists — either connect an email tool or remove the footer form (**owner decision**).

## 8. Testing performed

* `npm run lint` — clean. `npm run build` — 66 pages prerendered from live data.
* 27/27 end-to-end checks (`puppeteer`, writes intercepted so nothing reached production): search suggestions and results, empty state, country filter, package page indexable, mobile sticky bar, booking prefill from package, field validation, exactly one booking POST with complete payload and no read-back, success screen, honeypot drop, contact submit, cooldown, mobile menu inert/open, unknown package → 404 + noindex, keyboard focus.
* Content-Security-Policy from `vercel.json` served locally on 7 routes incl. map iframe, login and admin: 0 violations.
* **After deploy (production, 31 Oct):** all 23 routes return the expected status/title/canonical; security headers present; 27/27 end-to-end checks and 0 CSP violations on the live site (first run found the Cloudflare Web Analytics beacon blocked by the CSP — now allowed). Live Lighthouse mobile: home Perf 62 · LCP 4.5 s · CLS 0.002, package Perf 80 · LCP 3.9 s; desktop home Perf 98 · LCP 1.1 s; accessibility 100; SEO 92 only because of Cloudflare's managed robots.txt directive (section 4).
* Screens checked at 375/390 and 1440 px: no horizontal overflow.
* Not tested: admin create/update/delete on production (no admin login available in this session; admin code paths changed only in how packages are loaded), real email delivery, Search Console.

## 9. Owner actions (in order)

1. **Apply the security migrations** (≈1 minute): `cd Frontend/gowin && npx supabase db push --linked --include-all` (or `npm run db:push`), then `npm run db:verify` — it must report that anonymous visitors cannot read bookings/messages/subscribers/admin_users. Sign in to `/admin` afterwards to confirm editing still works (admin emails in `admin_users` must match the Supabase Auth login exactly, lower-case).
2. Delete the `__verify__` booking that `db:verify` creates.
3. Vercel → Domains: make `gowintravels.com` → `www.gowintravels.com` a **308 permanent** redirect (currently 307).
4. Google Search Console: verify the domain, submit the sitemap, request indexing of the home page and 3–5 key packages.
5. Deploy hook + Supabase webhook (section 5) so new packages are prerendered automatically.
6. Supply licence/registration numbers and real reviews (section 7a).
