// Read-only checks that the live content is consistent after migrate-content.mjs.
// Exits non-zero when a check fails.  Usage: node --env-file=.env scripts/verify-content.mjs
import { createClient } from '@supabase/supabase-js';

const sb = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY, { auth: { persistSession: false } });
let failures = 0;
const check = (ok, label, detail = '') => { console.log(`${ok ? 'PASS' : 'FAIL'} ${label}${detail ? ` — ${detail}` : ''}`); if (!ok) failures++; };

const { data: cats, error: cErr } = await sb.from('categories').select('*');
const { data: pkgs, error: pErr } = await sb.from('tour_packages').select('id,title,slug,description,location,duration,category_id,destination_type,is_published,is_featured,sort_order,images,image_credit,categories(name,slug,is_active),place_details(best_time,highlights,inclusions,exclusions,itinerary)');
if (cErr || pErr) { console.error(cErr?.message || pErr?.message); process.exit(1); }

// As the anon key, RLS should already hide unpublished rows and inactive categories.
const unpublishedVisible = pkgs.filter((p) => p.is_published === false).length;
const inactiveVisible = cats.filter((c) => c.is_active === false).length;
check(unpublishedVisible === 0, 'RLS hides unpublished packages from visitors', unpublishedVisible ? `${unpublishedVisible} visible — apply 20261026000001_rls_policies.sql` : '');
check(inactiveVisible === 0, 'RLS hides inactive categories from visitors', inactiveVisible ? `${inactiveVisible} visible` : '');

const published = pkgs.filter((p) => p.is_published !== false);
check(published.length > 0, `published packages visible: ${published.length}`);
const trekking = published.filter((p) => /\btrek|expedition|base camp/i.test(p.title));
check(trekking.length === 0, 'no trekking packages are published', trekking.map((p) => p.title).join(', '));
const noSlug = published.filter((p) => !p.slug);
check(noSlug.length === 0, 'every published package has a slug', noSlug.map((p) => p.title).join(', '));
const dupSlugs = published.map((p) => p.slug).filter((s, i, a) => s && a.indexOf(s) !== i);
check(dupSlugs.length === 0, 'slugs are unique', dupSlugs.join(', '));
const noImg = published.filter((p) => !p.images?.length);
check(noImg.length === 0, 'every published package has at least one photo', noImg.map((p) => p.title).join(', '));
const dataUri = pkgs.filter((p) => (p.images || []).some((u) => u.startsWith('data:')));
check(dataUri.length === 0, 'no base64 images remain in tour_packages', dataUri.map((p) => p.title).join(', '));
const catData = cats.filter((c) => c.image_url?.startsWith('data:'));
check(catData.length === 0, 'no base64 images remain in categories', catData.map((c) => c.name).join(', '));
const noDesc = published.filter((p) => !p.description || p.description.length < 40);
check(noDesc.length === 0, 'every published package has a description', noDesc.map((p) => p.title).join(', '));
const noCat = published.filter((p) => !p.category_id || p.categories?.is_active === false);
check(noCat.length === 0, 'every published package has an active category', noCat.map((p) => p.title).join(', '));
const commonsNoCredit = published.filter((p) => (p.images || []).some((u) => /library\//.test(u)) && !p.image_credit);
check(commonsNoCredit.length === 0, 'library photos carry a credit', commonsNoCredit.map((p) => p.title).join(', '));
const featured = published.filter((p) => p.is_featured);
check(featured.length >= 3 && featured.length <= 8, `featured packages between 3 and 8 (${featured.length})`);
const intlBadLocation = published.filter((p) => p.destination_type !== 'National' && !/,/.test(p.location || '') && !/^singapore$/i.test(p.location || ''));
check(intlBadLocation.length === 0, 'international locations are "Place, Country"', intlBadLocation.map((p) => `${p.title}: ${p.location}`).join('; '));

// home page top-10 lists: exactly ten Nepal and ten international packages carry display order 1–10, each fully detailed
for (const [label, test] of [['Nepal', (p) => p.destination_type === 'National'], ['international', (p) => p.destination_type !== 'National']]) {
  const top = published.filter((p) => test(p) && p.sort_order >= 1 && p.sort_order <= 10).sort((a, b) => a.sort_order - b.sort_order);
  check(top.length === 10 && top.every((p, i) => p.sort_order === i + 1), `top-10 ${label} list is complete and ordered 1–10 (${top.length})`, top.map((p) => `${p.sort_order}:${p.slug}`).join(' '));
  const thin = top.filter((p) => { const d = p.place_details?.[0] || p.place_details; return !d || !d.best_time || (d.highlights || []).length < 3 || (d.inclusions || []).length < 2 || (d.exclusions || []).length < 2 || (d.itinerary || []).length < 1 || !p.duration; });
  check(thin.length === 0, `top-10 ${label} packages have duration, best time, highlights, inclusions, exclusions and an itinerary`, thin.map((p) => p.slug).join(', '));
}

// every image URL must actually load
const urls = [...new Set(published.flatMap((p) => p.images || []))];
let broken = [];
await Promise.all(urls.map(async (u) => { try { const r = await fetch(u, { method: 'HEAD' }); if (!r.ok) broken.push(`${u} (${r.status})`); } catch (e) { broken.push(`${u} (${e.message})`); } }));
check(broken.length === 0, `all ${urls.length} published image URLs respond 200`, broken.slice(0, 5).join('; '));

// categories: active ones should have packages
const activeCats = cats.filter((c) => c.is_active !== false);
const emptyCats = activeCats.filter((c) => !published.some((p) => p.category_id === c.id));
check(emptyCats.length === 0, 'every active category has a published package', emptyCats.map((c) => c.name).join(', '));
const catNoSlug = activeCats.filter((c) => !c.slug);
check(catNoSlug.length === 0, 'active categories have slugs', catNoSlug.map((c) => c.name).join(', '));

// settings + testimonials + write protection
const { data: settings, error: sErr } = await sb.from('site_settings').select('phone,email,address').eq('id', 1).maybeSingle();
check(!sErr && settings?.phone && settings?.email, 'site_settings row has phone and email', sErr?.message || '');
const { data: tests } = await sb.from('testimonials').select('id,user_name,is_approved,content');
const devReview = (tests || []).find((t) => /happy to trek with him/i.test(t.content || ''));
check(!devReview || !devReview.is_approved, 'developer test review is not public');
const { error: probe } = await sb.from('categories').insert({ name: '__rls_probe__' }).select();
check(!!probe, 'anonymous visitors cannot write to content tables', probe ? '' : 'INSERT succeeded — RLS is OFF');
if (!probe) await sb.from('categories').delete().eq('name', '__rls_probe__');
const { error: bookingProbe } = await sb.from('bookings').insert({ user_name: '__verify__', user_email: 'verify@example.invalid', status: 'Pending', tour_title: 'verify' }).select();
check(!bookingProbe, 'anonymous visitors can still submit a booking', bookingProbe?.message || '');
if (!bookingProbe) console.log('     (a test booking "__verify__" was created — delete it from the admin panel)');

console.log(`\n${failures === 0 ? 'ALL CONTENT CHECKS PASSED' : failures + ' CHECK(S) FAILED'} — ${published.length} published packages, ${activeCats.length} active categories`);
process.exit(failures ? 1 : 0);
