// ============================================================
// GoWin Travels — one-command production rollout
//
//   npm run db:deploy              # everything below
//   npm run db:deploy -- --dry-run # show what would happen, change nothing
//
// Order matters: the content migration writes with the public anon key, so
// it must run after the schema migration (part 1) and BEFORE row-level
// security (part 2) is switched on. `supabase db push` always applies every
// pending migration, so part 2 is set aside during the first push and put
// back (always, even on failure) before the second push.
//
//   1. supabase db push        → 20261026000000_platform_schema.sql
//   2. scripts/migrate-content → photos, categories, trekking removal, top-10 content
//   3. supabase db push        → 20261026000001_rls_policies.sql
//   4. scripts/verify-content  → read-only checks (exit code 1 on failure)
// ============================================================
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@supabase/supabase-js';

const DRY = process.argv.includes('--dry-run');
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const migrations = path.join(root, 'supabase', 'migrations');
const RLS_FILE = '20261026000001_rls_policies.sql';
const parked = path.join(root, 'supabase', `${RLS_FILE}.pending`);
const npx = process.platform === 'win32' ? 'npx.cmd' : 'npx';

// .env is read here so the schema-cache wait below can query the project.
const envFile = path.join(root, '.env');
if (!fs.existsSync(envFile)) throw new Error('.env is missing (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY)');
for (const line of fs.readFileSync(envFile, 'utf8').split(/\r?\n/)) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}
const url = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (!url || !key) throw new Error('.env must define VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');

function run(label, cmd, args, { tolerate = false } = {}) {
  console.log(`\n▶ ${label}\n  ${cmd} ${args.join(' ')}`);
  const res = spawnSync(cmd, args, { cwd: root, stdio: 'inherit', shell: process.platform === 'win32' });
  if (res.status !== 0) {
    if (tolerate) { console.log(`  (expected before part 1 has been applied — continuing dry run)`); return false; }
    throw new Error(`${label} failed (exit ${res.status})`);
  }
  return true;
}

/** PostgREST reloads its schema cache a moment after the migration; wait until the new columns are queryable. */
async function waitForSchema() {
  const sb = createClient(url, key, { auth: { persistSession: false } });
  for (let i = 0; i < 20; i++) {
    const { error } = await sb.from('tour_packages').select('id,slug,is_published,sort_order').limit(1);
    if (!error) return;
    await new Promise((r) => setTimeout(r, 3000));
  }
  throw new Error('The new columns are still not visible through the API after 60 s. Re-run `npm run db:deploy` in a minute.');
}

const pushArgs = ['supabase', 'db', 'push', '--linked', '--yes', ...(DRY ? ['--dry-run'] : [])];
const rlsPath = path.join(migrations, RLS_FILE);
const rlsPresent = fs.existsSync(rlsPath);
try {
  if (rlsPresent) fs.renameSync(rlsPath, parked);
  run('1/4 schema migration (part 1)', npx, pushArgs);
} finally {
  if (rlsPresent) fs.renameSync(parked, rlsPath);
}
if (!DRY) await waitForSchema();
run('2/4 content migration', 'node', ['--env-file=.env', path.join('scripts', 'migrate-content.mjs'), ...(DRY ? ['--dry-run'] : [])], { tolerate: DRY });
run('3/4 row-level security (part 2)', npx, pushArgs);
if (!DRY) run('4/4 verification', 'node', ['--env-file=.env', path.join('scripts', 'verify-content.mjs')]);
console.log(`\n✔ ${DRY ? 'Dry run finished — nothing was changed.' : 'Rollout complete. Open the site, then delete the "__verify__" booking from the admin panel.'}`);
