// Dumps every content table to a JSON file so content can be restored if a
// later change goes wrong. Base64 image blobs are replaced by a short marker
// (they are exported separately by migrate-content.mjs) so the file stays small.
//
// Usage: node --env-file=.env scripts/backup-content.mjs <output.json>
import { createClient } from '@supabase/supabase-js';
import fs from 'node:fs';

const out = process.argv[2] || `backup-${new Date().toISOString().slice(0, 10)}.json`;
const sb = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY, { auth: { persistSession: false } });

const strip = (v) => (typeof v === 'string' && v.startsWith('data:image')) ? `<base64 ${Math.round(v.length / 1024)}KB>` : v;
const stripRow = (r) => Object.fromEntries(Object.entries(r).map(([k, v]) => [k, Array.isArray(v) ? v.map(strip) : strip(v)]));

const dump = {};
for (const t of ['categories', 'tour_packages', 'place_details', 'bookings', 'testimonials', 'contact_messages', 'newsletter_subscribers']) {
  // tour_packages rows can carry multi-MB base64 images: list them without the
  // images column first, then fetch images one row at a time.
  const listCols = t === 'tour_packages' ? '*' : '*';
  let query = sb.from(t).select(t === 'tour_packages'
    ? 'id,created_at,title,description,price,location,duration,category_id,destination_type,available_dates'
    : listCols);
  const { data, error } = await query;
  if (error) { console.error(t, error.message); process.exitCode = 1; continue; }
  const rows = (data || []).map(stripRow);
  if (t === 'tour_packages') {
    for (const r of rows) {
      const { data: img } = await sb.from(t).select('images').eq('id', r.id).single();
      r.images = (img?.images || []).map(strip);
    }
  }
  dump[t] = rows;
  console.log(`${t}: ${rows.length} rows`);
}
fs.writeFileSync(out, JSON.stringify(dump, null, 2));
console.log('wrote', out);
