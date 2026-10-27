// ============================================================
// GoWin Travels — one-off content migration (idempotent, re-runnable)
//
//   1. resolves every photo in supabase/media/photos.json to a direct link
//      (Wikimedia Commons / Unsplash) — only the owner's own photos are
//      uploaded to the public `media` bucket — and moves every base64 image
//      that is still embedded in a database row into storage;
//   2. fixes categories (slugs, names, cover photos + credits; hides trekking
//      and the six Philippine destinations that were mistakenly saved as
//      categories);
//   3. corrects every destination: title/location/category/slug, the photo
//      rows in package_images (link, source page, credit, alt text, order,
//      cover), trip details, unpublishes trekking packages, duplicates and
//      test rows (nothing is deleted), and adds the Philippine destinations
//      as real packages;
//   4. hides the developer's test testimonial and fills in site settings.
//
// The plan itself lives in scripts/content-plan.mjs.
//
// Run order (or simply `npm run db:deploy`):
//             npx supabase db push --linked   (applies 20261026000000)
//             node --env-file=.env scripts/migrate-content.mjs [--dry-run]
//             npx supabase db push --linked   (applies 20261026000001 — RLS)
//             node --env-file=.env scripts/verify-content.mjs
// ============================================================
import { createClient } from '@supabase/supabase-js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  CATEGORIES, CATEGORY_RENAMES, CATEGORY_HIDE, KEEP, ARCHIVE, PHILIPPINES, NEW_NEPAL,
  DEV_TEST_TESTIMONIAL_ID, SETTINGS_DEFAULTS,
} from './content-plan.mjs';

const DRY = process.argv.includes('--dry-run');
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const mediaDir = path.join(root, 'supabase', 'media');
const photos = JSON.parse(fs.readFileSync(path.join(mediaDir, 'photos.json'), 'utf8'));

const sb = createClient(process.env.VITE_SUPABASE_URL, (process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY), { auth: { persistSession: false } });
const log = (...a) => console.log(...a);
const slugify = (t) => String(t).normalize('NFKD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
const publicUrl = (p) => sb.storage.from('media').getPublicUrl(p).data.publicUrl;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
// Rows that still embed multi-megabyte base64 photos can push a single update past the
// API's statement timeout; those are retried a few times before being reported.
async function act(label, fn) {
  if (DRY) { log(`  [dry-run] ${label}`); return { data: null, error: null }; }
  let res = await fn();
  for (let attempt = 1; res?.error && /statement timeout/i.test(res.error.message) && attempt <= 3; attempt++) {
    log(`  …  ${label}: timed out, retrying (${attempt}/3)`);
    await sleep(3000 * attempt);
    res = await fn();
  }
  if (res?.error) { console.error(`  FAILED ${label}: ${res.error.message}`); process.exitCode = 1; }
  else log(`  ok  ${label}`);
  return res;
}

// ---------- 0. preflight ----------
{
  const { error } = await sb.from('tour_packages').select('id,slug,is_published,is_featured,sort_order').limit(1);
  if (error) { console.error('Preflight failed: new columns are missing. Run `npx supabase db push --linked` first.\n', error.message); process.exit(1); }
  const { error: iErr } = await sb.from('package_images').select('id').limit(1);
  if (iErr) { console.error('Preflight failed: the package_images table is missing. Run `npx supabase db push --linked` first.\n', iErr.message); process.exit(1); }
  const { error: bErr } = await sb.storage.from('media').list('', { limit: 1 });
  if (bErr) { console.error('Preflight failed: the `media` bucket is missing. Run the migrations first.\n', bErr.message); process.exit(1); }
  log(`Connected to ${new URL(process.env.VITE_SUPABASE_URL).host}${DRY ? ' (DRY RUN — nothing will be written)' : ''}`);
}

// ---------- 1a. photo links; the owner's own photos are uploaded ----------
log('\n1. Photos');
const photoUrl = {};
let linked = 0;
for (const [key, p] of Object.entries(photos)) {
  if (p.url) { photoUrl[key] = p.url; linked++; continue; }
  if (!p.file) throw new Error(`photos.json: "${key}" has neither a url nor a file`);
  const storagePath = `library/${p.file}`;
  photoUrl[key] = publicUrl(storagePath);
  const bytes = fs.readFileSync(path.join(mediaDir, p.file));
  await act(`upload owner photo ${storagePath} (${Math.round(bytes.length / 1024)} KB)`, () =>
    sb.storage.from('media').upload(storagePath, bytes, { contentType: 'image/webp', cacheControl: '31536000', upsert: true }));
}
log(`  ${linked} direct links, ${Object.keys(photos).length - linked} owner photos in storage`);
const photo = (k) => { if (!photos[k]) throw new Error(`content-plan refers to an unknown photo "${k}"`); return photos[k]; };
const credit = (keys) => [...new Set(keys.map((k) => photo(k).credit).filter(Boolean))].join('; ') || null;
const urls = (keys) => keys.map((k) => { photo(k); return photoUrl[k]; });
const imageRows = (packageId, keys) => keys.map((k, i) => ({
  package_id: packageId, url: photoUrl[k], source_url: photo(k).source_url || null, credit: photo(k).credit || null,
  alt_text: photo(k).alt || photo(k).verified || null, sort_order: i, is_primary: i === 0,
}));
/** One row per photo: upsert by (package, url), then drop rows that are no longer in the plan. */
async function syncImages(packageId, keys, label) {
  const rows = imageRows(packageId, keys);
  const res = await act(`  photos ${label}: ${rows.length} link(s)`, () => sb.from('package_images').upsert(rows, { onConflict: 'package_id,url' }).select('id'));
  if (DRY || res.error) return;
  const keep = (res.data || []).map((r) => r.id);
  let q = sb.from('package_images').delete().eq('package_id', packageId);
  if (keep.length) q = q.not('id', 'in', `(${keep.join(',')})`);
  const { error } = await q;
  if (error) { console.error(`  FAILED tidy photos ${label}: ${error.message}`); process.exitCode = 1; }
}

// ---------- 1b. move embedded base64 images into storage ----------
async function offloadDataUri(table, id, column, value, index = 0) {
  const m = String(value).match(/^data:(image\/[\w+]+);base64,(.*)$/s);
  if (!m) return value;
  const ext = m[1].split('/')[1].replace('jpeg', 'jpg').replace('+xml', '');
  const storagePath = `archive/${table}-${id}-${index}.${ext}`;
  const bytes = Buffer.from(m[2], 'base64');
  await act(`offload ${table}/${id.slice(0, 8)} ${column}[${index}] (${Math.round(bytes.length / 1024)} KB) → ${storagePath}`, () =>
    sb.storage.from('media').upload(storagePath, bytes, { contentType: m[1], cacheControl: '31536000', upsert: true }));
  return publicUrl(storagePath);
}

// ---------- 2. categories ----------
log('\n2. Categories');
const { data: existingCats } = await sb.from('categories').select('id,name,slug,description,image_url,is_active');
const catIdBySlug = {};
for (const c of existingCats || []) if (c.slug) catIdBySlug[c.slug] = c.id;

const categoryPatch = (spec) => ({
  name: spec.name, slug: spec.slug, description: spec.description, image_url: urls([spec.image])[0], image_credit: credit([spec.image]), is_active: true, sort_order: spec.sort,
});
for (const [id, slug] of Object.entries(CATEGORY_RENAMES)) {
  const spec = CATEGORIES.find((c) => c.slug === slug);
  const row = (existingCats || []).find((c) => c.id === id);
  if (!row) { log(`  skip ${slug}: row ${id.slice(0, 8)} not found`); continue; }
  catIdBySlug[slug] = id;
  await act(`category ${row.name} → ${spec.name} (${slug})`, () => sb.from('categories').update(categoryPatch(spec)).eq('id', id));
}
for (const spec of CATEGORIES) {
  if (catIdBySlug[spec.slug]) continue;
  const res = await act(`create category ${spec.name}`, () => sb.from('categories').insert(categoryPatch(spec)).select('id').single());
  if (res.data) catIdBySlug[spec.slug] = res.data.id;
}
for (const id of CATEGORY_HIDE) {
  const row = (existingCats || []).find((c) => c.id === id);
  if (!row) continue;
  const patch = { is_active: false, sort_order: 900, slug: row.slug || `legacy-${slugify(row.name)}-${id.slice(0, 6)}` };
  if (row.image_url && row.image_url.startsWith('data:')) patch.image_url = await offloadDataUri('categories', id, 'image_url', row.image_url);
  await act(`hide category ${row.name}`, () => sb.from('categories').update(patch).eq('id', id));
}
for (const row of existingCats || []) {
  if (!CATEGORY_HIDE.includes(row.id) && !CATEGORY_RENAMES[row.id] && row.image_url?.startsWith('data:')) {
    const url = await offloadDataUri('categories', row.id, 'image_url', row.image_url);
    await act(`offloaded image for category ${row.name}`, () => sb.from('categories').update({ image_url: url }).eq('id', row.id));
  }
}

// ---------- 3. destinations ----------
log('\n3. Destinations');
const { data: pkgs, error: pErr } = await sb.from('tour_packages').select('id,title,slug,description,location,duration,price,category_id,destination_type,is_published,is_featured');
if (pErr) { console.error(pErr.message); process.exit(1); }
const { data: details } = await sb.from('place_details').select('id,place_id');
const detailIdByPlace = Object.fromEntries((details || []).map((d) => [d.place_id, d.id]));

async function upsertDetails(placeId, title, description, d) {
  if (!d) return;
  const payload = { place_id: placeId, title, description: description || null, best_time: d.best_time || null, highlights: d.highlights || [], inclusions: d.inclusions || [], exclusions: d.exclusions || [], itinerary: d.itinerary || [] };
  if (detailIdByPlace[placeId]) await act(`  details update ${title}`, () => sb.from('place_details').update(payload).eq('id', detailIdByPlace[placeId]));
  else await act(`  details create ${title}`, () => sb.from('place_details').insert(payload));
}

for (const [id, spec] of Object.entries(KEEP)) {
  const row = (pkgs || []).find((p) => p.id === id);
  if (!row) { log(`  skip ${spec.slug}: row ${id.slice(0, 8)} not found`); continue; }
  const patch = {
    slug: spec.slug, category_id: catIdBySlug[spec.category], location: spec.location, images: urls(spec.images),
    image_credit: credit(spec.images), is_published: true, is_featured: !!spec.featured,
  };
  if (spec.title) patch.title = spec.title;
  if (spec.description) patch.description = spec.description;
  if (spec.duration) patch.duration = spec.duration;
  if (spec.sort_order) patch.sort_order = spec.sort_order;
  await act(`keep ${row.title} → /places/${spec.slug} [${spec.category}] ${spec.images.length} photo(s)`, () => sb.from('tour_packages').update(patch).eq('id', id));
  await syncImages(id, spec.images, spec.slug);
  await upsertDetails(id, spec.title || row.title, spec.description || row.description, spec.details);
}
for (const [id, reason] of Object.entries(ARCHIVE)) {
  const row = (pkgs || []).find((p) => p.id === id);
  if (!row) continue;
  const patch = { is_published: false, is_featured: false, slug: row.slug || `${slugify(row.title) || 'package'}-${id.slice(0, 6)}` };
  const { data: imgRow } = await sb.from('tour_packages').select('images').eq('id', id).single();
  const imgs = imgRow?.images || [];
  if (imgs.some((u) => u.startsWith('data:'))) patch.images = await Promise.all(imgs.map((u, i) => offloadDataUri('tour_packages', id, 'images', u, i)));
  await act(`unpublish ${row.title} (${reason})`, () => sb.from('tour_packages').update(patch).eq('id', id));
}
for (const row of pkgs || []) {
  if (KEEP[row.id] || ARCHIVE[row.id]) continue;
  const { data: imgRow } = await sb.from('tour_packages').select('images').eq('id', row.id).single();
  const imgs = imgRow?.images || [];
  const patch = {};
  if (imgs.some((u) => u.startsWith('data:'))) patch.images = await Promise.all(imgs.map((u, i) => offloadDataUri('tour_packages', row.id, 'images', u, i)));
  if (!row.slug) patch.slug = slugify(row.title) || `package-${row.id.slice(0, 6)}`;
  if (Object.keys(patch).length) await act(`tidy ${row.title}`, () => sb.from('tour_packages').update(patch).eq('id', row.id));
}
// New packages: created once; on a re-run the existing row is brought back in line with the plan (price is never touched).
async function createOrUpdate(spec, payload, label) {
  const existing = (pkgs || []).find((p) => p.slug === spec.slug);
  if (existing) {
    await act(`update ${spec.title} (already exists)`, () => sb.from('tour_packages').update(payload).eq('id', existing.id));
    await syncImages(existing.id, spec.images, spec.slug);
    await upsertDetails(existing.id, spec.title, payload.description, spec.details);
    return;
  }
  const res = await act(label, () => sb.from('tour_packages').insert({ ...payload, price: null }).select('id').single());
  if (res.data) {
    await syncImages(res.data.id, spec.images, spec.slug);
    await upsertDetails(res.data.id, spec.title, payload.description, spec.details);
  }
}
for (const spec of PHILIPPINES) {
  const cat = (existingCats || []).find((c) => c.id === spec.catId);
  await createOrUpdate(spec, { title: spec.title, slug: spec.slug, description: spec.description || cat?.description || null, location: spec.location, duration: spec.duration || null,
    category_id: catIdBySlug[spec.category], destination_type: 'International', images: urls(spec.images), image_credit: credit(spec.images), is_published: true, is_featured: !!spec.featured, sort_order: spec.sort_order || 100 },
  `create ${spec.title} (from category row)`);
}
for (const spec of NEW_NEPAL) {
  await createOrUpdate(spec, { title: spec.title, slug: spec.slug, description: spec.description, location: spec.location, duration: spec.duration || null,
    category_id: catIdBySlug[spec.category], destination_type: 'National', images: urls(spec.images), image_credit: credit(spec.images), is_published: true, is_featured: !!spec.featured, sort_order: spec.sort_order || 100 },
  `create ${spec.title}`);
}

// ---------- 4. reviews, bookings, settings ----------
log('\n4. Reviews, bookings and settings');
const { data: tests } = await sb.from('testimonials').select('id,user_name,content,image_url,is_approved');
for (const t of tests || []) {
  const patch = {};
  if (t.id === DEV_TEST_TESTIMONIAL_ID && t.is_approved) patch.is_approved = false;
  if (t.image_url?.startsWith('data:')) patch.image_url = await offloadDataUri('testimonials', t.id, 'image_url', t.image_url);
  if (Object.keys(patch).length) await act(`testimonial ${t.user_name}: ${Object.keys(patch).join(', ')}`, () => sb.from('testimonials').update(patch).eq('id', t.id));
}
const { data: bookings } = await sb.from('bookings').select('id,tour_id,tour_title');
for (const b of bookings || []) {
  if (b.tour_title || !b.tour_id) continue;
  const p = (pkgs || []).find((x) => x.id === b.tour_id);
  if (p) await act(`booking ${b.id.slice(0, 8)}: remember package title`, () => sb.from('bookings').update({ tour_title: p.title }).eq('id', b.id));
}
const { data: settings } = await sb.from('site_settings').select('*').eq('id', 1).maybeSingle();
const settingsPatch = {};
for (const [k, v] of Object.entries(SETTINGS_DEFAULTS)) if (!settings?.[k]) settingsPatch[k] = v;
if (Object.keys(settingsPatch).length) await act(`site_settings: fill ${Object.keys(settingsPatch).join(', ')}`, () => sb.from('site_settings').update(settingsPatch).eq('id', 1));

log(`\nDone${process.exitCode ? ' with errors' : ''}. Next: npx supabase db push --linked (RLS), then node --env-file=.env scripts/verify-content.mjs`);
