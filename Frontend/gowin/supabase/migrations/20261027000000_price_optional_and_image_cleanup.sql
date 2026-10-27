-- ============================================================
-- GoWin Travels — fixes found while rolling out 20261026000000 on 27 Oct 2026
-- ============================================================

-- 1. A package without a price shows "Price on request" on the site; the live
--    column was created NOT NULL, so creating such a package (admin form or the
--    content migration) failed. The repo's schema file already had it nullable.
ALTER TABLE tour_packages ALTER COLUMN price DROP NOT NULL;

-- 2. Realtime only needs the row key to notify the site (it refetches on any
--    change). With REPLICA IDENTITY FULL every update writes the whole old row —
--    for rows holding multi-megabyte embedded images that pushed updates past the
--    API statement timeout. DEFAULT (primary key) is enough.
ALTER TABLE tour_packages REPLICA IDENTITY DEFAULT;
ALTER TABLE categories    REPLICA IDENTITY DEFAULT;

-- 3. Three rows still embed base64 photos so large that the API cannot update
--    them in time. Each photo is already safe elsewhere — the package photos as
--    supabase/media/bali-nusa-penida.webp and paris-eiffel-blossom.webp (uploaded
--    to media/library by the content migration), the category photo as
--    media/archive/categories-7dfa51fd-…-0.jpg and media/library/philippines-siargao.webp
--    — so the embedded copies are dropped here; the content migration then writes
--    the proper photo links. Guarded so a re-run changes nothing.
UPDATE tour_packages SET images = '{}'
  WHERE id IN ('fa612fde-522e-4441-8030-e5bf5d5af123', '399eae8c-81b1-410b-b4bb-8d2f153730be')
    AND EXISTS (SELECT 1 FROM unnest(images) AS u WHERE u LIKE 'data:%');
UPDATE categories SET image_url = NULL
  WHERE id = '7dfa51fd-25aa-4835-bdbb-c26d09aeba18' AND image_url LIKE 'data:%';

NOTIFY pgrst, 'reload schema';
