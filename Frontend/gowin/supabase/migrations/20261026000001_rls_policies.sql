-- ============================================================
-- GoWin Travels — platform hardening, part 2 (row level security)
-- Before this migration every table had RLS disabled, so anybody holding
-- the public anon key (it ships in the browser bundle) could insert, edit
-- or delete any row. From now on:
--   * visitors can read published content and submit bookings, inquiries
--     and newsletter sign-ups;
--   * only signed-in accounts listed in admin_users can manage content.
-- Run scripts/migrate-content.mjs BEFORE applying this file.
-- ============================================================

-- ---------- helper: is the current JWT an allow-listed admin? ----------
CREATE OR REPLACE FUNCTION public.is_admin() RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT COALESCE(
    auth.role() = 'authenticated'
    AND EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE email = lower(COALESCE(auth.jwt() ->> 'email', ''))
    ),
    false);
$$;
REVOKE ALL ON FUNCTION public.is_admin() FROM public;
GRANT EXECUTE ON FUNCTION public.is_admin() TO anon, authenticated;

-- ---------- enable RLS everywhere ----------
ALTER TABLE categories             ENABLE ROW LEVEL SECURITY;
ALTER TABLE tour_packages          ENABLE ROW LEVEL SECURITY;
ALTER TABLE place_details          ENABLE ROW LEVEL SECURITY;
ALTER TABLE package_images         ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings               ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials           ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages       ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings          ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users            ENABLE ROW LEVEL SECURITY;

-- ---------- categories ----------
DROP POLICY IF EXISTS "categories public read"  ON categories;
DROP POLICY IF EXISTS "categories admin all"    ON categories;
CREATE POLICY "categories public read" ON categories
  FOR SELECT USING (is_active OR public.is_admin());
CREATE POLICY "categories admin all" ON categories
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- ---------- tour_packages ----------
DROP POLICY IF EXISTS "packages public read" ON tour_packages;
DROP POLICY IF EXISTS "packages admin all"   ON tour_packages;
CREATE POLICY "packages public read" ON tour_packages
  FOR SELECT USING (is_published OR public.is_admin());
CREATE POLICY "packages admin all" ON tour_packages
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- ---------- place_details ----------
DROP POLICY IF EXISTS "details public read" ON place_details;
DROP POLICY IF EXISTS "details admin all"   ON place_details;
CREATE POLICY "details public read" ON place_details
  FOR SELECT USING (
    public.is_admin() OR EXISTS (
      SELECT 1 FROM tour_packages p WHERE p.id = place_details.place_id AND p.is_published));
CREATE POLICY "details admin all" ON place_details
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- ---------- package_images ----------
DROP POLICY IF EXISTS "images public read" ON package_images;
DROP POLICY IF EXISTS "images admin all"   ON package_images;
CREATE POLICY "images public read" ON package_images
  FOR SELECT USING (
    public.is_admin() OR EXISTS (
      SELECT 1 FROM tour_packages p WHERE p.id = package_images.package_id AND p.is_published));
CREATE POLICY "images admin all" ON package_images
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- ---------- testimonials ----------
DROP POLICY IF EXISTS "testimonials public read" ON testimonials;
DROP POLICY IF EXISTS "testimonials admin all"   ON testimonials;
CREATE POLICY "testimonials public read" ON testimonials
  FOR SELECT USING (is_approved OR public.is_admin());
CREATE POLICY "testimonials admin all" ON testimonials
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- ---------- bookings: anyone may submit, only admins may read/manage ----------
DROP POLICY IF EXISTS "bookings public insert" ON bookings;
DROP POLICY IF EXISTS "bookings admin all"     ON bookings;
CREATE POLICY "bookings public insert" ON bookings
  FOR INSERT WITH CHECK (status = 'Pending');
CREATE POLICY "bookings admin all" ON bookings
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- ---------- contact_messages ----------
DROP POLICY IF EXISTS "messages public insert" ON contact_messages;
DROP POLICY IF EXISTS "messages admin all"     ON contact_messages;
CREATE POLICY "messages public insert" ON contact_messages
  FOR INSERT WITH CHECK (status = 'New');
CREATE POLICY "messages admin all" ON contact_messages
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- ---------- newsletter_subscribers ----------
DROP POLICY IF EXISTS "subscribers public insert" ON newsletter_subscribers;
DROP POLICY IF EXISTS "subscribers admin all"     ON newsletter_subscribers;
CREATE POLICY "subscribers public insert" ON newsletter_subscribers
  FOR INSERT WITH CHECK (true);
CREATE POLICY "subscribers admin all" ON newsletter_subscribers
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- ---------- site_settings ----------
DROP POLICY IF EXISTS "settings public read" ON site_settings;
DROP POLICY IF EXISTS "settings admin write" ON site_settings;
CREATE POLICY "settings public read" ON site_settings
  FOR SELECT USING (true);
CREATE POLICY "settings admin write" ON site_settings
  FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());

-- ---------- admin_users: admins manage the allowlist ----------
DROP POLICY IF EXISTS "admin_users admin all" ON admin_users;
CREATE POLICY "admin_users admin all" ON admin_users
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- ---------- storage: public read, admin-only writes ----------
DROP POLICY IF EXISTS "media bootstrap insert" ON storage.objects;
DROP POLICY IF EXISTS "media bootstrap update" ON storage.objects;
DROP POLICY IF EXISTS "media bootstrap delete" ON storage.objects;
DROP POLICY IF EXISTS "media admin insert" ON storage.objects;
DROP POLICY IF EXISTS "media admin update" ON storage.objects;
DROP POLICY IF EXISTS "media admin delete" ON storage.objects;
CREATE POLICY "media admin insert" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'media' AND public.is_admin());
CREATE POLICY "media admin update" ON storage.objects
  FOR UPDATE USING (bucket_id = 'media' AND public.is_admin());
CREATE POLICY "media admin delete" ON storage.objects
  FOR DELETE USING (bucket_id = 'media' AND public.is_admin());

NOTIFY pgrst, 'reload schema';
