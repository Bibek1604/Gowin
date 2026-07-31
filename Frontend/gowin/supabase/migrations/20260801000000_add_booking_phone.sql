-- The booking form collects a phone number but the bookings table never stored it.
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS phone TEXT;
