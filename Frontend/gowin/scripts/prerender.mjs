// Build-time prerendering for crawlers and link previews.
// Runs after `vite build` (package.json "postbuild").
//
// The site is a client-rendered React app: without this step every URL
// returns the same empty <div id="root"> with the home page's title, so
// WhatsApp / Facebook previews, Bing and AI crawlers saw no page content and
// Google had to render JavaScript to find anything.
//
// For every public route this writes dist/<route>.html containing
//   * the page's own <title>, description, canonical, robots, Open Graph and
//     Twitter tags, and schema.org JSON-LD (same builders as the app: src/lib/schema.js);
//   * the page's real content as plain semantic HTML inside #root, which React
//     replaces when it starts (createRoot), so visitors see the normal app.
// It also writes dist/app.html (bare shell for routes added after the build,
// e.g. a package published later), dist/404.html (served with HTTP 404) and
// dist/sitemap.xml.
//
// Never fails the build: if Supabase is unreachable the static pages are still
// written and destination URLs fall back to the client-rendered shell.
import { createClient } from '@supabase/supabase-js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { DEFAULT_SITE_URL, SITE_NAME, homeGraph, tripGraph, listGraph, pageGraph } from '../src/lib/schema.js';
import { SERVICES, FAQS, NEPAL_TRAVEL_TIPS, WHY_CHOOSE_US, HOW_IT_WORKS, DEFAULT_SETTINGS } from '../src/data/siteContent.js';
import { formatPrice, isNepal, countryFromLocation, phoneDigits, packageTitle } from '../src/lib/format.js';
import { responsiveImage } from '../src/lib/images.js';
import { HERO_SLIDES } from '../src/data/heroSlides.js';
import { BANNERS, BANNER_FOR_ROUTE } from '../src/data/pageBanners.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');

// ---------- env (.env for local builds; hosted builds set real variables) ----------
try {
  for (const raw of fs.readFileSync(path.join(root, '.env'), 'utf8').split('\n')) {
    const m = raw.replace(/\r$/, '').match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !(m[1] in process.env)) process.env[m[1]] = m[2].replace(/^['"]|['"]$/g, '');
  }
} catch { /* no .env */ }

const SITE = (process.env.VITE_SITE_URL || DEFAULT_SITE_URL).replace(/\/$/, '');
const SB_URL = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SB_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// ---------- data ----------
let places = [];
let categories = [];
let settings = { ...DEFAULT_SETTINGS };
let dataOk = false;
if (SB_URL && SB_KEY) {
  try {
    const sb = createClient(SB_URL, SB_KEY, { auth: { persistSession: false } });
    const [pk, cat, st] = await Promise.all([
      sb.from('tour_packages').select('id,slug,title,description,price,location,duration,destination_type,sort_order,is_featured,is_published,created_at,updated_at,category_id,categories(id,name,slug,is_active),place_details(*),package_images(url,alt_text,credit,source_url,sort_order,is_primary)').eq('is_published', true),
      sb.from('categories').select('id,name,slug,description,is_active,sort_order'),
      sb.from('site_settings').select('*').eq('id', 1).maybeSingle(),
    ]);
    if (pk.error) throw pk.error;
    places = (pk.data || [])
      .filter((p) => p.slug && p.categories?.is_active !== false)
      .map((p) => {
        const gallery = (p.package_images || []).filter((g) => /^https?:/.test(g.url || '')).sort((a, b) => Number(b.is_primary) - Number(a.is_primary) || a.sort_order - b.sort_order);
        const d = Array.isArray(p.place_details) ? p.place_details[0] : p.place_details;
        return { ...p, gallery, details: d || {} };
      })
      .sort((a, b) => (a.sort_order ?? 100) - (b.sort_order ?? 100) || Number(b.is_featured) - Number(a.is_featured) || new Date(b.created_at) - new Date(a.created_at));
    categories = (cat.data || []).filter((c) => c.is_active !== false);
    if (st.data) settings = { ...settings, ...Object.fromEntries(Object.entries(st.data).filter(([, v]) => v !== null && v !== '')) };
    dataOk = true;
  } catch (e) {
    console.warn('prerender: could not load content from Supabase —', e.message, '(static pages only)');
  }
}
const nepal = places.filter(isNepal);
const world = places.filter((p) => !isNepal(p));

// ---------- html helpers ----------
const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const trim160 = (s) => { const t = String(s || '').replace(/\s+/g, ' ').trim(); return t.length <= 160 ? t : `${t.slice(0, 157).replace(/\s+\S*$/, '')}…`; };
const a = (href, text, attrs = '') => `<a href="${esc(href)}"${attrs}>${esc(text)}</a>`;
const list = (items) => (items.length ? `<ul>${items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>` : '');
const placeHref = (p) => `/places/${p.slug}`;
const wa = (text) => { const d = phoneDigits(settings.whatsapp || settings.phone); return d ? `https://wa.me/${d}?text=${encodeURIComponent(text)}` : null; };

const card = (p) => {
  const facts = [p.location, p.duration, formatPrice(p.price) ? `from ${formatPrice(p.price)} per person` : 'Price on request', p.categories?.name].filter(Boolean).join(' · ');
  return `<li><h3>${a(placeHref(p), p.title)}</h3><p class="pr-facts">${esc(facts)}</p>${p.description ? `<p>${esc(trim160(p.description))}</p>` : ''}</li>`;
};

const header = `<header class="pr-head"><a class="pr-brand" href="/">GoWin <span>Travels</span></a><nav aria-label="Main">${[
  ['/destinations', 'Destinations'], ['/destinations/national', 'Nepal tours'], ['/destinations/international', 'International'],
  ['/services', 'Services'], ['/about', 'About'], ['/contact', 'Contact'], ['/booking', 'Plan a trip'],
].map(([h, t]) => a(h, t)).join('')}</nav></header>`;

const footer = () => `<footer class="pr-foot"><p><strong>${esc(settings.business_name)}</strong> — ${esc(settings.address)}</p>
<p>Phone / WhatsApp: ${a(`tel:+${phoneDigits(settings.phone)}`, settings.phone)} · Email: ${a(`mailto:${settings.email}`, settings.email)} · ${esc(settings.office_hours)}</p>
<nav aria-label="Legal">${a('/support', 'Help & FAQ')} · ${a('/guides', 'Nepal travel tips')} · ${a('/terms', 'Terms & Conditions')} · ${a('/privacy', 'Privacy Policy')} · ${a('/refund', 'Refund Policy')}</nav></footer>`;

const crumbsHtml = (crumbs) => `<nav aria-label="Breadcrumb" class="pr-crumbs"><ol>${crumbs.map((c) => `<li>${c.path ? a(c.path, c.name) : `<span aria-current="page">${esc(c.name)}</span>`}</li>`).join('')}</ol></nav>`;

// Minimal styling so the static HTML is readable for the moment before React starts
// (and for anyone without JavaScript). Scoped to .pr-*.
const STYLE = `<style data-prerender>.pr{overflow-x:clip;font-family:'DM Sans',system-ui,sans-serif;color:#0F172A;max-width:72rem;margin:0 auto;padding:0 1rem 3rem;line-height:1.6}.pr a{color:#1E3A8A}.pr-head{display:flex;flex-wrap:wrap;gap:.75rem 1.5rem;align-items:center;justify-content:space-between;padding:1rem 0;border-bottom:1px solid #E2E8F0}.pr-brand{font-weight:800;font-size:1.25rem;text-decoration:none}.pr-brand span{color:#10B981}.pr-head nav{display:flex;flex-wrap:wrap;gap:.25rem 1rem;font-size:.9rem}.pr h1{font-family:'Plus Jakarta Sans',system-ui,sans-serif;font-size:clamp(1.8rem,5vw,2.8rem);line-height:1.15;margin:2rem 0 .75rem}.pr h2{font-size:1.35rem;margin:2rem 0 .5rem}.pr h3{font-size:1.05rem;margin:0}.pr ul.pr-cards{list-style:none;padding:0;display:grid;gap:1rem;grid-template-columns:repeat(auto-fill,minmax(16rem,1fr))}.pr ul.pr-cards li{border:1px solid #E2E8F0;border-radius:.75rem;padding:1rem}.pr-facts{color:#475569;font-size:.85rem;margin:.25rem 0}.pr-crumbs ol{list-style:none;display:flex;flex-wrap:wrap;gap:.5rem;padding:0;margin:1rem 0 0;font-size:.85rem}.pr-crumbs li+li:before{content:'›';margin-right:.5rem;color:#94A3B8}.pr img{max-width:100%;height:auto;border-radius:.75rem}.pr-foot{margin-top:3rem;padding-top:1rem;border-top:1px solid #E2E8F0;font-size:.85rem;color:#475569}.pr-hero{position:relative;width:100vw;margin:0 calc(50% - 50vw);min-height:88vh;display:flex;align-items:center;justify-content:center;background:#0B1220;overflow:hidden}.pr-overlay{position:relative}.pr-overlay .pr-head{position:absolute;top:0;left:1rem;right:1rem;z-index:3;border:0}.pr-overlay .pr-head a{color:#fff}.pr-banner{position:relative;width:100vw;margin:0 calc(50% - 50vw);min-height:400px;display:flex;align-items:flex-end;background:#0F172A;overflow:hidden}@media(min-width:640px){.pr-banner{min-height:440px}}.pr-banner img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;border-radius:0}.pr-banner:after{content:'';position:absolute;inset:0;background:linear-gradient(0deg,rgba(11,18,32,.95),rgba(30,58,138,.6),rgba(11,18,32,.3))}.pr-banner-text{position:relative;z-index:1;width:100%;max-width:72rem;margin:0 auto;padding:7rem 1rem 2.5rem;color:rgba(255,255,255,.8)}.pr-banner-text h1{color:#fff;margin-top:.5rem}.pr-banner-text a,.pr-banner-text .pr-crumbs{color:rgba(255,255,255,.75)}.pr-cover{display:block;width:100vw;max-width:none!important;margin:0 calc(50% - 50vw);height:420px;object-fit:cover;border-radius:0!important;background:#0F172A}@media(min-width:640px){.pr-cover{height:460px}}@media(min-width:1024px){.pr-cover{height:540px}}.pr-hero img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;border-radius:0}.pr-hero:after{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(11,18,32,.9),rgba(30,58,138,.6),rgba(11,18,32,.45))}.pr-hero-text{position:relative;z-index:1;max-width:48rem;padding:7rem 1rem 6rem;text-align:center;color:#fff}.pr-hero-text h1{color:#fff;margin-top:0}.pr-hero-text p{color:rgba(255,255,255,.85)}.pr-cta{display:inline-block;background:#047857;color:#fff!important;padding:.6rem 1.1rem;border-radius:.75rem;text-decoration:none;font-weight:600;margin:.25rem .5rem .25rem 0}</style>`;

// ---------- template ----------
const template = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
if (!template.includes('<div id="root"></div>')) throw new Error('prerender: dist/index.html has no empty #root — was it already prerendered?');

const setMeta = (html, attr, key, content) => {
  const re = new RegExp(`<meta ${attr}="${key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}" content="[^"]*"\\s*/?>`);
  const tag = `<meta ${attr}="${key}" content="${esc(content)}" />`;
  return re.test(html) ? html.replace(re, tag) : html.replace('</head>', `  ${tag}\n</head>`);
};

function render({ route, title, description, image, type = 'website', noindex = false, jsonLd, body, preload, overlay = false, data }) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} — Nepal Tours & World Holidays`;
  const desc = trim160(description || settings.meta_description);
  const url = `${SITE}${route === '/' ? '/' : route}`;
  const img = image || `${SITE}/og-cover.jpg`;
  let html = template.replace(/<title>[^<]*<\/title>/, `<title>${esc(fullTitle)}</title>`);
  html = setMeta(html, 'name', 'description', desc);
  html = setMeta(html, 'name', 'robots', noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large');
  html = setMeta(html, 'property', 'og:title', fullTitle);
  html = setMeta(html, 'property', 'og:description', desc);
  html = setMeta(html, 'property', 'og:type', type);
  html = setMeta(html, 'property', 'og:image', img);
  html = setMeta(html, 'property', 'og:url', url);
  html = setMeta(html, 'name', 'twitter:title', fullTitle);
  html = setMeta(html, 'name', 'twitter:description', desc);
  html = setMeta(html, 'name', 'twitter:image', img);
  // the hero photo is only preloaded on the home page
  if (route !== '/') html = html.replace(/\s*<link rel="preload" as="image" href="\/hero\/[^>]*>/, '');
  const extra = [
    noindex ? '' : `<link rel="canonical" href="${esc(url)}" />`,
    preload ? `<link rel="preload" as="image" href="${esc(preload.src)}"${preload.srcSet ? ` imagesrcset="${esc(preload.srcSet)}" imagesizes="100vw"` : ''} fetchpriority="high" />` : '',
    jsonLd ? `<script type="application/ld+json" data-prerender>${JSON.stringify(jsonLd).replace(/</g, '\\u003c')}</script>` : '',
    // the page's own record, so the app renders it at once instead of a loading skeleton
    data ? `<script type="application/json" id="prerender-data">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>` : '',
    STYLE,
  ].filter(Boolean).join('\n  ');
  html = html.replace('</head>', `  ${extra}\n</head>`);
  html = html.replace('<div id="root"></div>', `<div id="root"><div class="pr${overlay ? ' pr-overlay' : ''}">${header}<main>${body}</main>${footer()}</div></div>`);
  return html;
}

const pages = [];
const BANNER_HEAD = /^(<nav aria-label="Breadcrumb"[\s\S]*?<\/nav>)<h1>([\s\S]*?)<\/h1>(<p>[\s\S]*?<\/p>)?/;
/** Pages with a banner photo in the app (src/data/pageBanners.js) get the same photo here, at least as large. */
function withBanner(route, opts) {
  const key = BANNER_FOR_ROUTE[route];
  if (!key || !BANNER_HEAD.test(opts.body)) return opts;
  const img = responsiveImage(BANNERS[key]);
  const banner = `<section class="pr-banner"><img src="${img.src}"${img.srcSet ? ` srcset="${img.srcSet}" sizes="100vw"` : ''} alt="" width="1920" height="1080" fetchpriority="high" decoding="sync" /><div class="pr-banner-text">$1<h1>$2</h1>$3</div></section>`;
  return { ...opts, overlay: true, preload: img, body: opts.body.replace(BANNER_HEAD, banner), image: opts.image || `${SITE}${BANNERS[key]}` };
}
const add = (route, opts, file) => pages.push({ route, file: file || (route === '/' ? 'index.html' : `${route.slice(1)}.html`), html: render({ route, ...withBanner(route, opts) }) });

// ---------- home ----------
const HERO = HERO_SLIDES[0];
add('/', {
  title: 'Nepal Tours, Holidays & Travel Services in Kathmandu',
  description: settings.meta_description || 'GoWin International Travel & Tourism: Nepal heritage tours, pilgrimages, wildlife safaris and lakeside escapes, international holiday packages, flights, hotels and visa assistance from Kathmandu.',
  jsonLd: homeGraph(SITE, settings),
  overlay: true,
  // Same photo and headline as the React hero, so the largest paint happens with the static HTML.
  body: `<section class="pr-hero"><img src="${HERO.image}" srcset="${HERO.image.replace(/\.webp$/, '-960.webp')} 960w, ${HERO.image} 1920w" sizes="100vw" width="1920" height="1080" alt="${esc(HERO.alt)}" fetchpriority="high" decoding="sync" />
<div class="pr-hero-text"><h1>Nepal tours &amp; world holidays, planned in Kathmandu</h1>
<p>Heritage tours, wildlife safaris, pilgrimages and lakeside escapes across Nepal, plus international holidays, flights, hotels and visa help. Tell us your dates and we reply with a written quote.</p>
<p>${a('/destinations', 'Browse tours', ' class="pr-cta"')}${a('/booking', 'Plan a custom trip', ' class="pr-cta"')}</p></div></section>
${nepal.length ? `<h2>Top tours in Nepal</h2><ul class="pr-cards">${nepal.slice(0, 10).map(card).join('')}</ul><p>${a('/destinations/national', 'All Nepal tours')}</p>` : ''}
${categories.length ? `<h2>Travel styles</h2>${list(categories.map((c) => c.name))}` : ''}
${world.length ? `<h2>International holidays</h2><ul class="pr-cards">${world.slice(0, 10).map(card).join('')}</ul><p>${a('/destinations/international', 'All international holidays')}</p>` : ''}
<h2>Our services</h2><ul>${SERVICES.map((s) => `<li><strong>${a(s.link, s.title)}</strong> — ${esc(s.short)}</li>`).join('')}</ul>
<h2>Why travel with GoWin</h2><ul>${WHY_CHOOSE_US.map((w) => `<li><strong>${esc(w.title)}</strong> — ${esc(w.desc)}</li>`).join('')}</ul>
<h2>How booking works</h2><ol>${HOW_IT_WORKS.map((h) => `<li><strong>${esc(h.title)}</strong> — ${esc(h.desc)}</li>`).join('')}</ol>`,
});

// ---------- listings ----------
const LISTS = [
  // [route, H1, title tag (search intent), subtitle, packages] — keep in sync with TYPE_META in AllDestinations.jsx
  ['/destinations', 'All destinations', 'Tour & Holiday Packages – Nepal and Worldwide', 'Every tour and holiday package we currently offer, in Nepal and abroad.', places],
  ['/destinations/national', 'Nepal tours & experiences', 'Nepal Tour Packages – Heritage, Safari, Pilgrimage & Lakes', 'Heritage cities, pilgrimages, wildlife safaris, lakes and scenic escapes across Nepal.', nepal],
  ['/destinations/international', 'International holidays', 'International Holiday Packages from Nepal', 'Beaches, cities, honeymoons and family holidays — flights, hotels and visas arranged alongside.', world],
];
for (const [route, name, seoTitle, subtitle, items] of LISTS) {
  const crumbs = [{ name: 'Home', path: '/' }, { name }];
  const countries = route === '/destinations/international' ? [...new Set(items.map((p) => countryFromLocation(p.location)).filter(Boolean))].sort() : [];
  add(route, {
    title: seoTitle,
    description: `${subtitle}${items.length ? ` ${items.length} packages with itineraries, inclusions and prices.` : ''}`,
    jsonLd: items.length ? listGraph(SITE, { name, path: route, places: items, crumbs }) : pageGraph(SITE, { crumbs }),
    body: `${crumbsHtml(crumbs)}<h1>${esc(name)}</h1><p>${esc(subtitle)}</p>${countries.length ? `<p>Countries: ${esc(countries.join(', '))}.</p>` : ''}
${items.length ? `<ul class="pr-cards">${items.map(card).join('')}</ul>` : `<p>Our packages are loading. ${a('/booking', 'Ask us to plan a trip')}.</p>`}`,
  });
}

// ---------- package detail pages ----------
for (const p of places) {
  const route = placeHref(p);
  const d = p.details || {};
  const nepalTrip = isNepal(p);
  const listCrumb = nepalTrip ? { name: 'Nepal tours', path: '/destinations/national' } : { name: 'International holidays', path: '/destinations/international' };
  const crumbs = [{ name: 'Home', path: '/' }, listCrumb, { name: p.title }];
  const cover = p.gallery[0];
  const price = formatPrice(p.price);
  const days = (Array.isArray(d.itinerary) ? d.itinerary : []).filter((x) => x && x.title);
  const credits = [...new Set(p.gallery.map((g) => g.credit).filter(Boolean))];
  const related = places.filter((r) => r.id !== p.id && (r.category_id === p.category_id || isNepal(r) === nepalTrip)).slice(0, 4);
  const coverImg = cover ? responsiveImage(cover.url) : null;
  const waLink = wa(`Hello GoWin Travels, I'm interested in "${p.title}". Could you send me details and a quote?`);
  add(route, {
    title: packageTitle(p),
    description: p.description || `${p.title}: ${p.duration || ''} ${nepalTrip ? 'tour in Nepal' : 'holiday'} arranged by GoWin Travels, Kathmandu.`,
    image: cover?.url,
    type: 'article',
    preload: coverImg,
    overlay: !!cover,
    data: { place: { ...p, gallery: undefined, details: undefined } },
    jsonLd: tripGraph(SITE, p, settings, { path: route, crumbs }),
    // Full-bleed cover first, the same size as the React gallery hero, so it is the largest paint.
    body: `${cover ? `<img class="pr-cover" src="${esc(coverImg.src)}"${coverImg.srcSet ? ` srcset="${esc(coverImg.srcSet)}" sizes="100vw"` : ''} alt="${esc(cover.alt_text || p.title)}" width="1280" height="720" fetchpriority="high" decoding="sync" />` : ''}${crumbsHtml(crumbs)}<article><h1>${esc(p.title)}</h1>
<p class="pr-facts">${esc([p.location, p.duration, p.categories?.name].filter(Boolean).join(' · '))}</p>
<p><strong>${price ? `From ${esc(price)} per person` : 'Price on request'}</strong>${d.best_time ? ` · Best time: ${esc(d.best_time)}` : ''}</p>
${p.description ? `<h2>Overview</h2><p>${esc(p.description)}</p>` : ''}
${(d.highlights || []).length ? `<h2>Highlights</h2>${list(d.highlights)}` : ''}
${days.length ? `<h2>Itinerary</h2><ol>${days.map((x) => `<li><strong>Day ${esc(x.day)}: ${esc(x.title)}</strong>${x.description ? ` — ${esc(x.description)}` : ''}</li>`).join('')}</ol>` : ''}
${(d.inclusions || []).length ? `<h2>What's included</h2>${list(d.inclusions)}` : ''}
${(d.exclusions || []).length ? `<h2>Not included</h2>${list(d.exclusions)}` : ''}
<h2>Book or ask a question</h2><p>No online payment: we confirm availability and send a written quote first.</p>
<p>${a(`/booking?package=${encodeURIComponent(p.slug)}`, 'Request this trip', ' class="pr-cta"')}${waLink ? a(waLink, 'Ask on WhatsApp', ' class="pr-cta" rel="noopener"') : ''}</p>
${credits.length ? `<p class="pr-facts">Photos: ${esc(credits.join('; '))}</p>` : ''}
${related.length ? `<h2>Similar trips</h2><ul class="pr-cards">${related.map(card).join('')}</ul>` : ''}</article>`,
  });
}

// ---------- content pages ----------
const simple = (route, title, h1, description, body, extra = {}) => {
  const crumbs = [{ name: 'Home', path: '/' }, { name: title }];
  add(route, { title, description, jsonLd: pageGraph(SITE, { crumbs, ...extra }), body: `${crumbsHtml(crumbs)}<h1>${esc(h1)}</h1>${body}` });
};

simple('/services', 'Our Services', 'Services',
  'Nepal tours, international holiday packages, custom itineraries, flight tickets, hotel reservations, visa application assistance and travel insurance from GoWin Travels, Kathmandu.',
  `<p>Everything a trip needs — tours, holidays, tickets, hotels, visas and insurance — arranged by one team in Kathmandu.</p>${SERVICES.map((s) => `<h2>${esc(s.title)}</h2><p>${esc(s.desc)}</p><p>${a(s.link, s.cta)}</p>`).join('')}`);

simple('/about', 'About Us', `About ${settings.business_name}`,
  `${settings.business_name} is a Kathmandu-based travel company offering Nepal tours, international holidays, flights, hotels and visa assistance.`,
  `<p>A Kathmandu travel company arranging tours across Nepal and holidays around the world.</p>
<p>Alongside tours we book domestic and international air tickets and hotels, assist with visa applications and appointments, and arrange travel insurance through partner providers — so one team looks after the whole journey.</p>
<h2>What we offer</h2><ul>${SERVICES.map((s) => `<li>${a(s.link, s.title)} — ${esc(s.short)}</li>`).join('')}</ul>
<h2>Why travel with us</h2><ul>${WHY_CHOOSE_US.map((w) => `<li><strong>${esc(w.title)}</strong> — ${esc(w.desc)}</li>`).join('')}</ul>
<h2>Visit or contact us</h2><p>${esc(settings.address)} · ${esc(settings.office_hours)}</p>`, { agency: true, settings });

simple('/contact', 'Contact Us', 'Get in touch',
  `Contact GoWin International Travel & Tourism in Kathmandu: ${settings.phone}, ${settings.email}. ${settings.office_hours}.`,
  `<p>Questions about a package, a visa, flights or a custom trip? Message us and a member of the Kathmandu team will reply.</p>
<ul><li>Office: ${esc(settings.address)}</li><li>Phone: ${a(`tel:+${phoneDigits(settings.phone)}`, settings.phone)}</li>${settings.whatsapp ? `<li>WhatsApp: ${a(`https://wa.me/${phoneDigits(settings.whatsapp)}`, settings.whatsapp, ' rel="noopener"')}</li>` : ''}<li>Email: ${a(`mailto:${settings.email}`, settings.email)}</li><li>Hours: ${esc(settings.office_hours)}</li></ul>`, { agency: true, settings });

simple('/booking', 'Plan a Trip / Booking Request', 'Plan your trip',
  'Request a tour package or a custom itinerary from GoWin Travels. No online payment — we confirm availability and send a written quote.',
  `<p>Choose a package or describe a custom trip. We confirm availability and send a written quote — no online payment is taken on this website.</p><h2>How it works</h2><ol>${HOW_IT_WORKS.map((h) => `<li><strong>${esc(h.title)}</strong> — ${esc(h.desc)}</li>`).join('')}</ol>`);

simple('/guides', 'Nepal Travel Tips & Guides', 'Nepal travel tips',
  'Practical advice for visiting Nepal: best season, visa on arrival, getting around, packing, money and cultural etiquette, from a Kathmandu travel company.',
  `<p>Practical pointers from our Kathmandu team — seasons, visas, transport, packing and etiquette.</p>${NEPAL_TRAVEL_TIPS.map((t) => `<h2>${esc(t.title)}</h2>${list(t.points)}`).join('')}`);

simple('/support', 'Help & FAQ', 'Help & frequently asked questions',
  'Answers to common questions about booking, custom trips, flights, hotels, visas, refunds and payments with GoWin Travels.',
  `<p>How bookings, quotes, visas and refunds work — and how to reach a real person quickly.</p>${FAQS.map((f) => `<h2>${esc(f.q)}</h2><p>${esc(f.a)}</p>`).join('')}`);

for (const [route, title, sub, desc] of [
  ['/terms', 'Terms & Conditions', 'The agreement between you and Go Win International Travel and Tourism Pvt. Ltd.', 'Terms and conditions for using the GoWin Travels website and travel services provided by Go Win International Travel and Tourism Pvt. Ltd.'],
  ['/privacy', 'Privacy Policy', 'What we collect, why, and how it is protected.', 'How Go Win International Travel and Tourism Pvt. Ltd. collects, uses and protects personal information for bookings, visa assistance and website visits.'],
  ['/refund', 'Refund Policy', 'How refunds work for the services we arrange.', 'Refund terms for tours, tickets, hotels, visa assistance and insurance arranged by Go Win International Travel and Tourism Pvt. Ltd.'],
]) simple(route, title, title, desc, `<p>${esc(sub)}</p><p>The full text loads with the page. Questions: ${a(`mailto:${settings.email}`, settings.email)}.</p>`);

// ---------- 404 + client shell ----------
pages.push({ route: '(404)', file: '404.html', html: render({ route: '/404', title: 'Page not found', noindex: true, description: 'This page does not exist or has moved. Browse Nepal tours and international holidays from GoWin Travels, Kathmandu.', body: `<h1>Page not found</h1><p>The page you asked for does not exist or has moved.</p><p>${a('/', 'Home')} · ${a('/destinations', 'All destinations')} · ${a('/contact', 'Contact us')}</p>` }) });
// app.html: the untouched client shell (no canonical, no content), served for app-only
// routes — admin, login, and packages published after this build.
fs.writeFileSync(path.join(dist, 'app.html'), template);

for (const pg of pages) {
  const file = path.join(dist, pg.file);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, pg.html);
}

// ---------- sitemap ----------
const today = new Date().toISOString().slice(0, 10);
const lastmod = (p) => (p.updated_at || p.created_at || '').slice(0, 10) || today;
const urls = [
  ...pages.filter((p) => p.route.startsWith('/') && p.route !== '/booking' && !p.route.startsWith('/places/')).map((p) => ({ loc: p.route === '/' ? '/' : p.route })),
  { loc: '/booking' },
  ...places.map((p) => ({ loc: placeHref(p), lastmod: lastmod(p), image: p.gallery[0] })),
];
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls.map((u) => `  <url><loc>${esc(SITE + u.loc)}</loc>${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ''}${u.image ? `<image:image><image:loc>${esc(u.image.url)}</image:loc></image:image>` : ''}</url>`).join('\n')}
</urlset>
`;
fs.writeFileSync(path.join(dist, 'sitemap.xml'), xml);
fs.writeFileSync(path.join(dist, 'robots.txt'), `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /login\n\nSitemap: ${SITE}/sitemap.xml\n`);

console.log(`prerender: ${pages.length} pages (${places.length} packages${dataOk ? '' : ' — content NOT loaded'}), sitemap ${urls.length} URLs, site ${SITE}`);
