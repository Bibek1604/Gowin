// Read-only checks that the live content is consistent after migrate-content.mjs,
// including that every photo link actually loads. Exits non-zero when a check fails.
// Usage: node --env-file=.env scripts/verify-content.mjs [--json report.json]
import fs from 'node:fs';
import { createClient } from '@supabase/supabase-js';

const sb = createClient(process.env.VITE_SUPABASE_URL, (process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY), { auth: { persistSession: false } });
const UA = 'GoWinTravels-verify/1.0 (info.gowintravels@gmail.com)';
const jsonOut = process.argv[process.argv.indexOf('--json') + 1];
let failures = 0;
const check = (ok, label, detail = '') => { console.log(`${ok ? 'PASS' : 'FAIL'} ${label}${detail ? ` — ${detail}` : ''}`); if (!ok) failures++; };
const titles = (list) => list.map((p) => p.title).join(', ');

const { data: cats, error: cErr } = await sb.from('categories').select('*');
const { data: pkgs, error: pErr } = await sb.from('tour_packages').select('id,title,slug,description,location,duration,category_id,destination_type,is_published,is_featured,sort_order,images,image_credit,categories(name,slug,is_active),place_details(best_time,highlights,inclusions,exclusions,itinerary),package_images(id,url,source_url,credit,alt_text,sort_order,is_primary)');
if (cErr || pErr) { console.error(cErr?.message || pErr?.message); process.exit(1); }

// As the anon key, RLS should already hide unpublished rows and inactive categories.
const unpublishedVisible = pkgs.filter((p) => p.is_published === false).length;
const inactiveVisible = cats.filter((c) => c.is_active === false).length;
check(unpublishedVisible === 0, 'RLS hides unpublished packages from visitors', unpublishedVisible ? `${unpublishedVisible} visible — apply 20261026000001_rls_policies.sql` : '');
check(inactiveVisible === 0, 'RLS hides inactive categories from visitors', inactiveVisible ? `${inactiveVisible} visible` : '');

const published = pkgs.filter((p) => p.is_published !== false);
const nepal = published.filter((p) => p.destination_type === 'National');
const international = published.filter((p) => p.destination_type !== 'National');
check(published.length > 0, `published packages visible: ${published.length}`);
check(nepal.length >= 20, `at least 20 Nepal destinations are published (${nepal.length})`);
check(international.length >= 20, `at least 20 international destinations are published (${international.length})`);
const trekking = published.filter((p) => /\btrek|expedition|base camp/i.test(p.title));
check(trekking.length === 0, 'no trekking packages are published', titles(trekking));
const noSlug = published.filter((p) => !p.slug);
check(noSlug.length === 0, 'every published package has a slug', titles(noSlug));
const dupSlugs = published.map((p) => p.slug).filter((s, i, a) => s && a.indexOf(s) !== i);
check(dupSlugs.length === 0, 'slugs are unique', dupSlugs.join(', '));
const dataUri = pkgs.filter((p) => (p.images || []).some((u) => u.startsWith('data:')));
check(dataUri.length === 0, 'no base64 images remain in tour_packages', titles(dataUri));
const catData = cats.filter((c) => c.image_url?.startsWith('data:'));
check(catData.length === 0, 'no base64 images remain in categories', catData.map((c) => c.name).join(', '));
const noDesc = published.filter((p) => !p.description || p.description.length < 40);
check(noDesc.length === 0, 'every published package has a description', titles(noDesc));
const noLoc = published.filter((p) => !p.location);
check(noLoc.length === 0, 'every published package has a location', titles(noLoc));
const noCat = published.filter((p) => !p.category_id || p.categories?.is_active === false);
check(noCat.length === 0, 'every published package has an active category', titles(noCat));
const featured = published.filter((p) => p.is_featured);
check(featured.length >= 3 && featured.length <= 8, `featured packages between 3 and 8 (${featured.length})`);
const intlBadLocation = published.filter((p) => p.destination_type !== 'National' && !/,/.test(p.location || '') && !/^singapore$/i.test(p.location || ''));
check(intlBadLocation.length === 0, 'international locations are "Place, Country"', intlBadLocation.map((p) => `${p.title}: ${p.location}`).join('; '));
const nepalBadLocation = nepal.filter((p) => !/nepal$/i.test(p.location || ''));
check(nepalBadLocation.length === 0, 'Nepal locations end with "Nepal"', nepalBadLocation.map((p) => `${p.title}: ${p.location}`).join('; '));

// ---------- photos: one row per link with source, credit, alt text, order and cover ----------
const gallery = (p) => [...(p.package_images || [])].sort((a, b) => Number(b.is_primary) - Number(a.is_primary) || a.sort_order - b.sort_order);
const noPhoto = published.filter((p) => gallery(p).length === 0);
check(noPhoto.length === 0, 'every published package has at least one photo row', titles(noPhoto));
const onePhoto = published.filter((p) => gallery(p).length === 1);
check(onePhoto.length === 0, 'every published package has a gallery (2+ photos)', titles(onePhoto));
const badPrimary = published.filter((p) => gallery(p).filter((g) => g.is_primary).length !== 1 || !gallery(p)[0]?.is_primary);
check(badPrimary.length === 0, 'exactly one cover photo per package, ordered first', titles(badPrimary));
const badOrder = published.filter((p) => gallery(p).some((g, i) => g.sort_order !== i));
check(badOrder.length === 0, 'photo display order is 0..n without gaps', titles(badOrder));
const mismatch = published.filter((p) => JSON.stringify(p.images || []) !== JSON.stringify(gallery(p).map((g) => g.url)));
check(mismatch.length === 0, 'the package image list matches its photo rows (same links, same order)', titles(mismatch));
const allRows = published.flatMap((p) => gallery(p).map((g) => ({ ...g, pkg: p })));
const notHttp = allRows.filter((g) => !/^https?:\/\//i.test(g.url));
check(notHttp.length === 0, 'every photo is an http(s) link', notHttp.map((g) => g.pkg.title).join(', '));
const noAlt = allRows.filter((g) => !g.alt_text || g.alt_text.trim().length < 8);
check(noAlt.length === 0, 'every photo has descriptive alt text', [...new Set(noAlt.map((g) => g.pkg.title))].join(', '));
const noProvenance = allRows.filter((g) => !g.source_url && !/gowin/i.test(g.credit || ''));
check(noProvenance.length === 0, 'every photo has a source page (or is an owner photo)', [...new Set(noProvenance.map((g) => g.pkg.title))].join(', '));
const noCredit = allRows.filter((g) => !g.credit);
check(noCredit.length === 0, 'every photo has a credit', [...new Set(noCredit.map((g) => g.pkg.title))].join(', '));
const commonsNoCredit = allRows.filter((g) => /wikimedia/i.test(g.url) && !/via Wikimedia Commons/i.test(g.credit || ''));
check(commonsNoCredit.length === 0, 'Wikimedia Commons photos carry author + licence credit', [...new Set(commonsNoCredit.map((g) => g.pkg.title))].join(', '));
const creditMismatch = published.filter((p) => { const want = [...new Set(gallery(p).map((g) => g.credit).filter(Boolean))].join('; ') || null; return (p.image_credit || null) !== want; });
check(creditMismatch.length === 0, 'package image_credit summarises its photo credits', titles(creditMismatch));
// the same photo must not be the cover of two different packages
const coverBy = {};
for (const p of published) { const u = gallery(p)[0]?.url; if (u) (coverBy[u] ||= []).push(p.title); }
const sharedCovers = Object.entries(coverBy).filter(([, list]) => list.length > 1);
check(sharedCovers.length === 0, 'no two packages share the same cover photo', sharedCovers.map(([, l]) => l.join(' / ')).join('; '));
// gallery photos may be shared only between packages about the same place (same first location segment) or multi-stop itineraries
const place = (p) => (p.location || '').split(',')[0].trim().toLowerCase();
const multiStop = (p) => /[–—-]/.test(p.location || '') && /\s[–—-]\s/.test(p.location || '');
const usedBy = {};
for (const p of published) for (const g of gallery(p)) (usedBy[g.url] ||= []).push(p);
const wrongShare = Object.values(usedBy).filter((list) => list.length > 1 && !list.every((p) => multiStop(p) || place(p) === place(list.find((x) => !multiStop(x)) || list[0])));
check(wrongShare.length === 0, 'a photo is only reused between packages about the same place', wrongShare.map((l) => titles(l)).join('; '));

// every photo link (packages + categories) must actually load as an image
// Wikimedia rate-limits bursts from one client (HTTP 429), so its links are checked one at a time with a short pause.
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const fetchOk = async (u) => {
  const paced = /wikimedia\.org/.test(u);
  for (let attempt = 0; attempt < 4; attempt++) {
    if (paced) await sleep(700);
    try {
      const r = await fetch(u, { method: 'HEAD', headers: { 'User-Agent': UA }, redirect: 'follow' });
      const type = r.headers.get('content-type') || '';
      if (r.ok && type.startsWith('image/')) return { ok: true };
      if (r.status === 429) { await sleep(8000 * (attempt + 1)); continue; }
      return { ok: false, detail: `${r.status} ${type}` };
    } catch (e) { if (attempt === 3) return { ok: false, detail: e.message }; }
  }
  return { ok: false, detail: 'rate limited' };
};
const activeCats = cats.filter((c) => c.is_active !== false);
const urls = [...new Set([...allRows.map((g) => g.url), ...activeCats.map((c) => c.image_url).filter(Boolean)])];
const broken = [];
let cursor = 0;
const wiki = urls.filter((u) => /wikimedia\.org/.test(u)); const other = urls.filter((u) => !/wikimedia\.org/.test(u));
for (const u of wiki) { const r = await fetchOk(u); if (!r.ok) broken.push(`${u} (${r.detail})`); }
await Promise.all(Array.from({ length: 4 }, async () => {
  while (cursor < other.length) { const u = other[cursor++]; const r = await fetchOk(u); if (!r.ok) broken.push(`${u} (${r.detail})`); }
}));
check(broken.length === 0, `all ${urls.length} photo links load as images`, broken.slice(0, 8).join('; '));
const hosts = {};
for (const u of urls) { const h = new URL(u).host; hosts[h] = (hosts[h] || 0) + 1; }
console.log(`     sources: ${Object.entries(hosts).map(([h, n]) => `${h} ×${n}`).join(', ')}`);

// categories: active ones should have packages, a slug, a cover photo (with credit when it is a Commons photo)
const emptyCats = activeCats.filter((c) => !published.some((p) => p.category_id === c.id));
check(emptyCats.length === 0, 'every active category has a published package', emptyCats.map((c) => c.name).join(', '));
const catNoSlug = activeCats.filter((c) => !c.slug);
check(catNoSlug.length === 0, 'active categories have slugs', catNoSlug.map((c) => c.name).join(', '));
const catNoImg = activeCats.filter((c) => !c.image_url);
check(catNoImg.length === 0, 'active categories have a cover photo', catNoImg.map((c) => c.name).join(', '));
const catNoCredit = activeCats.filter((c) => /wikimedia/i.test(c.image_url || '') && !c.image_credit);
check(catNoCredit.length === 0, 'category Commons photos carry a credit', catNoCredit.map((c) => c.name).join(', '));

// home page top-10 lists: exactly ten Nepal and ten international packages carry display order 1–10, each fully detailed
for (const [label, list] of [['Nepal', nepal], ['international', international]]) {
  const top = list.filter((p) => p.sort_order >= 1 && p.sort_order <= 10).sort((a, b) => a.sort_order - b.sort_order);
  check(top.length === 10 && top.every((p, i) => p.sort_order === i + 1), `top-10 ${label} list is complete and ordered 1–10 (${top.length})`, top.map((p) => `${p.sort_order}:${p.slug}`).join(' '));
  const thin = top.filter((p) => { const d = p.place_details?.[0] || p.place_details; return !d || !d.best_time || (d.highlights || []).length < 3 || (d.inclusions || []).length < 2 || (d.exclusions || []).length < 2 || (d.itinerary || []).length < 1 || !p.duration; });
  check(thin.length === 0, `top-10 ${label} packages have duration, best time, highlights, inclusions, exclusions and an itinerary`, thin.map((p) => p.slug).join(', '));
  const fewPhotos = top.filter((p) => gallery(p).length < 3);
  check(fewPhotos.length === 0, `top-10 ${label} packages have 3+ photos`, fewPhotos.map((p) => p.slug).join(', '));
}

// settings + testimonials + write protection
const { data: settings, error: sErr } = await sb.from('site_settings').select('phone,email,address').eq('id', 1).maybeSingle();
check(!sErr && settings?.phone && settings?.email, 'site_settings row has phone and email', sErr?.message || '');
const { data: tests } = await sb.from('testimonials').select('id,user_name,is_approved,content');
const devReview = (tests || []).find((t) => /happy to trek with him/i.test(t.content || ''));
check(!devReview || !devReview.is_approved, 'developer test review is not public');
const { error: probe } = await sb.from('categories').insert({ name: '__rls_probe__' }).select();
check(!!probe, 'anonymous visitors cannot write to content tables', probe ? '' : 'INSERT succeeded — RLS is OFF');
if (!probe) await sb.from('categories').delete().eq('name', '__rls_probe__');
const { error: imgProbe } = await sb.from('package_images').insert({ package_id: published[0]?.id, url: 'https://example.com/__probe__.jpg' }).select();
check(!!imgProbe, 'anonymous visitors cannot add photos', imgProbe ? '' : 'INSERT succeeded — RLS is OFF');
if (!imgProbe) await sb.from('package_images').delete().eq('url', 'https://example.com/__probe__.jpg');
const { error: bookingProbe } = await sb.from('bookings').insert({ user_name: '__verify__', user_email: 'verify@example.invalid', status: 'Pending', tour_title: 'verify' }).select();
check(!bookingProbe, 'anonymous visitors can still submit a booking', bookingProbe?.message || '');
if (!bookingProbe) console.log('     (a test booking "__verify__" was created — delete it from the admin panel)');

const summary = {
  checked_at: new Date().toISOString(), failures, published: published.length, nepal: nepal.length, international: international.length,
  photos: allRows.length, links_checked: urls.length, sources: hosts, broken,
};
if (jsonOut && jsonOut !== '--json') fs.writeFileSync(jsonOut, JSON.stringify(summary, null, 2));
console.log(`\n${failures === 0 ? 'ALL CONTENT CHECKS PASSED' : failures + ' CHECK(S) FAILED'} — ${published.length} published packages (${nepal.length} Nepal, ${international.length} international), ${allRows.length} photos, ${activeCats.length} active categories`);
process.exit(failures ? 1 : 0);
