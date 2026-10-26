// Writes public/sitemap.xml from the published destinations in Supabase.
// Runs automatically before `vite build` (see package.json "prebuild").
// Never fails the build: if the database is unreachable the static pages
// are still written.
import { createClient } from '@supabase/supabase-js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// Load .env when present (local builds); hosted builds provide real env vars.
try {
  const lines = fs.readFileSync(path.join(root, '.env'), 'utf8').split('\n');
  for (const raw of lines) {
    const line = raw.replace(/\r$/, '');
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !(m[1] in process.env)) process.env[m[1]] = m[2].replace(/^['"]|['"]$/g, '');
  }
} catch {
  /* no .env file */
}

const SITE = (process.env.VITE_SITE_URL || 'https://gowintravels.com').replace(/\/$/, '');
const url = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const STATIC = [
  ['/', '1.0', 'weekly'], ['/destinations', '0.9', 'weekly'], ['/destinations/national', '0.9', 'weekly'],
  ['/destinations/international', '0.8', 'weekly'], ['/services', '0.7', 'monthly'], ['/booking', '0.7', 'monthly'],
  ['/about', '0.6', 'monthly'], ['/contact', '0.6', 'monthly'], ['/guides', '0.5', 'monthly'], ['/support', '0.5', 'monthly'],
  ['/terms', '0.2', 'yearly'], ['/privacy', '0.2', 'yearly'], ['/refund', '0.2', 'yearly'],
];

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const entry = (loc, priority, changefreq, lastmod) =>
  `  <url><loc>${esc(SITE + loc)}</loc>${lastmod ? `<lastmod>${lastmod.slice(0, 10)}</lastmod>` : ''}<changefreq>${changefreq}</changefreq><priority>${priority}</priority></url>`;

let dynamic = [];
if (url && key) {
  try {
    const sb = createClient(url, key, { auth: { persistSession: false } });
    let { data, error } = await sb.from('tour_packages').select('id,slug,is_published,updated_at,created_at,categories(is_active)');
    if (error && /does not exist/i.test(error.message)) ({ data, error } = await sb.from('tour_packages').select('id,created_at')); // pre-migration
    if (error) throw error;
    dynamic = (data || [])
      .filter((p) => p.is_published !== false && p.categories?.is_active !== false)
      .map((p) => entry(`/places/${p.slug || p.id}`, '0.8', 'monthly', p.updated_at || p.created_at));
  } catch (e) {
    console.warn('sitemap: could not load destinations —', e.message);
  }
}

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${STATIC.map(([l, p, c]) => entry(l, p, c)).join('\n')}\n${dynamic.join('\n')}\n</urlset>\n`;
fs.writeFileSync(path.join(root, 'public', 'sitemap.xml'), xml);
console.log(`sitemap: ${STATIC.length} static + ${dynamic.length} destination URLs → public/sitemap.xml`);
