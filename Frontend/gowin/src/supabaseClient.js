import { createClient } from '@supabase/supabase-js';

// Vite exposes VITE_* variables; the Vercel ⇄ Supabase integration provides the
// NEXT_PUBLIC_* names, so accept either (see envPrefix in vite.config.js).
// The browser key is the project's publishable key (sb_publishable_…); the
// legacy JWT "anon" key still works and is used when no publishable key is set.
// Either is public by design — row-level security protects the data.
const env = import.meta.env;
const supabaseUrl = env.VITE_SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.VITE_SUPABASE_PUBLISHABLE_KEY || env.VITE_SUPABASE_ANON_KEY || env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  // Surface the misconfiguration loudly instead of failing on the first query.
  console.error('Supabase is not configured: set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY.');
}

export const supabase = createClient(supabaseUrl || 'http://localhost', supabaseKey || 'missing-key', {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false },
});

/** Public URL of a file in the `media` storage bucket. */
export const mediaUrl = (path) => supabase.storage.from('media').getPublicUrl(path).data.publicUrl;
