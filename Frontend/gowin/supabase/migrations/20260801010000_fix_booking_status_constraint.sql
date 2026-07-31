-- The live database had a bookings_status_check constraint (added outside of
-- migrations, likely via Supabase Studio) that didn't match the values the
-- app actually sends ('Pending' / 'Confirmed' / 'Cancelled'), so admin status
-- updates were rejected. Drop whatever exists and recreate it explicitly.
ALTER TABLE bookings DROP CONSTRAINT IF EXISTS bookings_status_check;

ALTER TABLE bookings ADD CONSTRAINT bookings_status_check
  CHECK (status IN ('Pending', 'Confirmed', 'Cancelled'));
