import { createClient } from '@supabase/supabase-js';

// Vite exposes VITE_* variables; the Vercel ⇄ Supabase integration provides the
// NEXT_PUBLIC_* names, so accept either (see envPrefix in vite.config.js).
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  // Surface the misconfiguration loudly instead of failing on the first query.
  console.error('Supabase is not configured: set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
}

export const supabase = createClient(supabaseUrl || 'http://localhost', supabaseKey || 'missing-key', {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false },
});

/** Public URL of a file in the `media` storage bucket. */
export const mediaUrl = (path) => supabase.storage.from('media').getPublicUrl(path).data.publicUrl;
