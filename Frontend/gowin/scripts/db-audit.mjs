// Read-only audit of the live Supabase database. Prints row counts and a
// compact view of every content table so content accuracy can be verified.
// Usage: node --env-file=.env scripts/db-audit.mjs
import { createClient } from '@supabase/supabase-js';

const url = process.env.VITE_SUPABASE_URL;
const key = process.env.VITE_SUPABASE_ANON_KEY;
if (!url || !key) { console.error('Missing VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY'); process.exit(1); }
const sb = createClient(url, key, { auth: { persistSession: false } });

const tables = ['categories','tour_packages','place_details','bookings','testimonials','contact_messages','newsletter_subscribers'];
console.log('PROJECT HOST:', new URL(url).host);
for (const t of tables) {
  const { count, error } = await sb.from(t).select('*', { count: 'exact', head: true });
  console.log(`${t}: ${error ? 'ERROR ' + error.message : count + ' rows'}`);
}

const { data: cats } = await sb.from('categories').select('id,name,description,image_url,created_at').order('created_at');
console.log('\n=== CATEGORIES ===');
for (const c of cats || []) console.log(`- ${c.name} | desc=${(c.description||'').slice(0,40)} | img=${(c.image_url||'').slice(0,60)}`);

const { data: pk } = await sb.from('tour_packages').select('id,title,location,price,duration,destination_type,images,category_id,categories(name),created_at').order('created_at');
console.log('\n=== TOUR_PACKAGES ===');
for (const p of pk || []) {
  const img = (p.images||[])[0] || '';
  const imgKind = img.startsWith('data:') ? `DATA-URI(${Math.round(img.length/1024)}KB)` : img.slice(0,70);
  console.log(`- [${p.destination_type}] ${p.title} | ${p.location} | $${p.price} | ${p.duration} | cat=${p.categories?.name} | imgs=${(p.images||[]).length} | ${imgKind}`);
}

const { data: det } = await sb.from('place_details').select('id,place_id,title,rating,highlights,inclusions,itinerary');
console.log('\n=== PLACE_DETAILS ===');
for (const d of det || []) console.log(`- place=${d.place_id} | ${d.title} | rating=${d.rating} | hl=${(d.highlights||[]).length} inc=${(d.inclusions||[]).length} it=${(d.itinerary||[]).length}`);

const { data: tst } = await sb.from('testimonials').select('id,user_name,designation,rating,is_approved,image_url');
console.log('\n=== TESTIMONIALS ===');
for (const t of tst || []) console.log(`- ${t.user_name} | ${t.designation} | ${t.rating}★ | approved=${t.is_approved} | img=${(t.image_url||'').slice(0,50)}`);

const { data: bk } = await sb.from('bookings').select('id,user_name,user_email,status,tour_id,travel_date,num_people,phone,created_at').order('created_at',{ascending:false}).limit(15);
console.log('\n=== BOOKINGS (latest 15) ===');
for (const b of bk || []) console.log(`- ${b.created_at?.slice(0,10)} ${b.user_name} | ${b.status} | tour=${b.tour_id} | ${b.travel_date} | ${b.num_people}p | phone=${b.phone}`);

const { data: msg } = await sb.from('contact_messages').select('id,name,email,destination,created_at').order('created_at',{ascending:false}).limit(10);
console.log('\n=== CONTACT_MESSAGES (latest 10) ===');
for (const m of msg || []) console.log(`- ${m.created_at?.slice(0,10)} ${m.name} | ${m.destination}`);

// Storage buckets
const { data: buckets, error: bErr } = await sb.storage.listBuckets();
console.log('\n=== STORAGE BUCKETS ===', bErr ? 'ERROR ' + bErr.message : '');
for (const b of buckets || []) console.log(`- ${b.name} public=${b.public}`);

// Write-permission probe (RLS): try to read auth-less; also check whether anon can see RLS state via a harmless failed insert
const { error: insErr } = await sb.from('categories').insert({ name: '__rls_probe__' }).select();
if (insErr) console.log('\nANON INSERT into categories: BLOCKED ->', insErr.message);
else {
  console.log('\nANON INSERT into categories: ALLOWED (RLS is OFF - anyone can write!) - cleaning up probe row');
  await sb.from('categories').delete().eq('name', '__rls_probe__');
}
