-- ============================================================
-- GoWin Travels — platform hardening, part 1 (schema + storage)
-- Adds publishing/featuring/slug fields, booking + inquiry fields,
-- a site_settings row, an admin allowlist and the public media bucket.
-- Part 2 (20261026000001) enables RLS once content has been migrated.
-- Every statement is idempotent; nothing here drops user content.
-- ============================================================

-- ---------- tour_packages ----------
ALTER TABLE tour_packages ADD COLUMN IF NOT EXISTS slug TEXT;
ALTER TABLE tour_packages ADD COLUMN IF NOT EXISTS is_published BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE tour_packages ADD COLUMN IF NOT EXISTS is_featured BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE tour_packages ADD COLUMN IF NOT EXISTS image_credit TEXT;
-- Manual display order for the home page and listings (lower first; 100 = default).
ALTER TABLE tour_packages ADD COLUMN IF NOT EXISTS sort_order INTEGER NOT NULL DEFAULT 100;
ALTER TABLE tour_packages ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();
CREATE UNIQUE INDEX IF NOT EXISTS tour_packages_slug_key ON tour_packages (slug) WHERE slug IS NOT NULL;
CREATE INDEX IF NOT EXISTS tour_packages_published_idx ON tour_packages (is_published, destination_type);

-- ---------- categories ----------
ALTER TABLE categories ADD COLUMN IF NOT EXISTS slug TEXT;
ALTER TABLE categories ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE categories ADD COLUMN IF NOT EXISTS sort_order INTEGER NOT NULL DEFAULT 100;
CREATE UNIQUE INDEX IF NOT EXISTS categories_slug_key ON categories (slug) WHERE slug IS NOT NULL;

-- ---------- place_details (exactly one block per package) ----------
ALTER TABLE place_details ADD COLUMN IF NOT EXISTS exclusions TEXT[] DEFAULT '{}';
ALTER TABLE place_details ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();
-- keep only the newest block per package so place_id can be unique
DELETE FROM place_details a USING place_details b
  WHERE a.place_id = b.place_id AND a.created_at < b.created_at;
DELETE FROM place_details WHERE place_id IS NULL;
CREATE UNIQUE INDEX IF NOT EXISTS place_details_place_id_key ON place_details (place_id);

-- ---------- bookings ----------
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT now();
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS message TEXT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS admin_notes TEXT;
-- Keep the package name on the booking so history stays readable even if the
-- package is later deleted, and stop deleting bookings together with packages.
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS tour_title TEXT;
UPDATE bookings b SET tour_title = p.title FROM tour_packages p
  WHERE b.tour_id = p.id AND b.tour_title IS NULL;
ALTER TABLE bookings DROP CONSTRAINT IF EXISTS bookings_tour_id_fkey;
ALTER TABLE bookings ADD CONSTRAINT bookings_tour_id_fkey
  FOREIGN KEY (tour_id) REFERENCES tour_packages(id) ON DELETE SET NULL;
ALTER TABLE bookings DROP CONSTRAINT IF EXISTS bookings_status_check;
ALTER TABLE bookings ADD CONSTRAINT bookings_status_check
  CHECK (status IN ('Pending', 'Confirmed', 'Completed', 'Cancelled'));

-- ---------- contact_messages ----------
ALTER TABLE contact_messages ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE contact_messages ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'New';
ALTER TABLE contact_messages DROP CONSTRAINT IF EXISTS contact_messages_status_check;
ALTER TABLE contact_messages ADD CONSTRAINT contact_messages_status_check
  CHECK (status IN ('New', 'Replied', 'Closed'));

-- ---------- site_settings (single row, edited from the admin panel) ----------
CREATE TABLE IF NOT EXISTS site_settings (
  id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  business_name TEXT NOT NULL DEFAULT 'GoWin International Travel & Tourism',
  tagline TEXT,
  phone TEXT,
  whatsapp TEXT,
  email TEXT,
  address TEXT,
  office_hours TEXT,
  facebook_url TEXT,
  instagram_url TEXT,
  tiktok_url TEXT,
  youtube_url TEXT,
  map_query TEXT,
  meta_title TEXT,
  meta_description TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
INSERT INTO site_settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

-- ---------- admin allowlist (who may manage content) ----------
CREATE TABLE IF NOT EXISTS admin_users (
  email TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
-- Every account that already exists in Supabase Auth keeps admin access.
INSERT INTO admin_users (email)
  SELECT lower(email) FROM auth.users WHERE email IS NOT NULL
  ON CONFLICT (email) DO NOTHING;

-- ---------- updated_at maintenance ----------
CREATE OR REPLACE FUNCTION public.set_updated_at() RETURNS TRIGGER
LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS tour_packages_set_updated_at ON tour_packages;
CREATE TRIGGER tour_packages_set_updated_at BEFORE UPDATE ON tour_packages
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
DROP TRIGGER IF EXISTS place_details_set_updated_at ON place_details;
CREATE TRIGGER place_details_set_updated_at BEFORE UPDATE ON place_details
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
DROP TRIGGER IF EXISTS site_settings_set_updated_at ON site_settings;
CREATE TRIGGER site_settings_set_updated_at BEFORE UPDATE ON site_settings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ---------- public media bucket (images live here, never as base64 in rows) ----------
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
  VALUES ('media', 'media', true, 10485760,
          ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'])
  ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "media public read" ON storage.objects;
CREATE POLICY "media public read" ON storage.objects
  FOR SELECT USING (bucket_id = 'media');
-- Temporary bootstrap write access so the one-off content migration
-- (scripts/migrate-content.mjs) can upload images. Replaced by admin-only
-- policies in part 2.
DROP POLICY IF EXISTS "media bootstrap insert" ON storage.objects;
CREATE POLICY "media bootstrap insert" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'media');
DROP POLICY IF EXISTS "media bootstrap update" ON storage.objects;
CREATE POLICY "media bootstrap update" ON storage.objects
  FOR UPDATE USING (bucket_id = 'media');
DROP POLICY IF EXISTS "media bootstrap delete" ON storage.objects;
CREATE POLICY "media bootstrap delete" ON storage.objects
  FOR DELETE USING (bucket_id = 'media');

NOTIFY pgrst, 'reload schema';
