/** Turn Supabase/PostgREST errors into messages a non-technical admin understands. */
export function friendlyError(error, fallback = 'Something went wrong. Please try again.') {
  if (!error) return fallback;
  const msg = String(error.message || error);
  const code = error.code || '';
  if (code === '23505' || /duplicate key/i.test(msg)) {
    if (/slug/i.test(msg)) return 'That URL slug is already used by another record. Choose a different one.';
    if (/email/i.test(msg)) return 'This email address is already on the list.';
    return 'A record with the same unique value already exists.';
  }
  if (code === '23503' || /foreign key/i.test(msg)) return 'This record is still referenced by other data (for example bookings) and cannot be removed.';
  if (code === '42501' || /row-level security|permission denied/i.test(msg)) return 'You are not authorised to do this. Sign in with an admin account.';
  if (code === '42703' || /column .* does not exist/i.test(msg)) return 'The database is missing a column — apply the latest migrations (npx supabase db push).';
  if (code === '42P01' || /relation .* does not exist/i.test(msg)) return 'A database table is missing — apply the latest migrations (npx supabase db push).';
  if (code === '23514' || /check constraint/i.test(msg)) return 'One of the values is not allowed by the database.';
  if (/Failed to fetch|NetworkError|network/i.test(msg)) return 'Network error — check your connection and try again.';
  if (/JWT|token/i.test(msg)) return 'Your session has expired. Please sign in again.';
  return msg.length < 160 ? msg : fallback;
}
