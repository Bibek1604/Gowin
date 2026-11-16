"""Self-host the home page's tour photos.

Reads every published package from Supabase (the same source the site uses),
downloads its cover photo once and writes, under public/media/tours/:

  <slug>-600.avif / .webp    600x450 (4:3)  - cards        (all packages)
  <slug>-1200.avif / .webp  1200x750 (16:10) - feature/banner (Nepal packages)

and src/data/tourMedia.json, which the components read to decide whether a
local copy exists. Packages added later simply fall back to the remote photo
until this script is run again:

    python -I scripts/build-tour-media.py

Nothing about the tours themselves (titles, prices, ...) is stored here.
"""
import io
import json
import os
import re
import sys
import urllib.parse
import urllib.request
from pathlib import Path

from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / 'public' / 'media' / 'tours'
MANIFEST = ROOT / 'src' / 'data' / 'tourMedia.json'
UA = {'User-Agent': 'gowin-site-build/1.0 (image cache)'}


def env():
    vals = {}
    for line in (ROOT / '.env').read_text(encoding='utf8').splitlines():
        m = re.match(r'\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$', line)
        if m:
            vals[m.group(1)] = m.group(2).strip().strip('"\'')
    vals.update({k: v for k, v in os.environ.items() if k.startswith('VITE_')})
    return vals


def get(url, headers=None):
    req = urllib.request.Request(url, headers={**UA, **(headers or {})})
    with urllib.request.urlopen(req, timeout=60) as r:
        return r.read()


def big_variant(url):
    """Ask the photo host for a ~1600px version instead of the stored size."""
    u = urllib.parse.urlparse(url)
    if u.hostname == 'images.unsplash.com':
        q = dict(urllib.parse.parse_qsl(u.query))
        q.update({'w': '1600', 'q': '80', 'fm': 'jpg'})
        return urllib.parse.urlunparse(u._replace(query=urllib.parse.urlencode(q)))
    if u.hostname == 'upload.wikimedia.org' and '/thumb/' in url:
        return re.sub(r'/\d+px-([^/]+)$', r'/1280px-\1', url)
    return url


def cover(img, w, h):
    return ImageOps.fit(img.convert('RGB'), (w, h), Image.LANCZOS, centering=(0.5, 0.5))


def main():
    e = env()
    base = e['VITE_SUPABASE_URL'].rstrip('/')
    key = e.get('VITE_SUPABASE_PUBLISHABLE_KEY') or e['VITE_SUPABASE_ANON_KEY']
    sel = 'slug,destination_type,images,package_images(url,is_primary,sort_order)'
    rows = json.loads(get(f'{base}/rest/v1/tour_packages?select={urllib.parse.quote(sel, safe=",()")}&is_published=eq.true',
                          {'apikey': key, 'Authorization': f'Bearer {key}'}))
    OUT.mkdir(parents=True, exist_ok=True)
    manifest = {}
    for p in rows:
        slug = p.get('slug')
        imgs = sorted([g for g in p.get('package_images') or [] if str(g.get('url', '')).startswith('http')],
                      key=lambda g: (not g.get('is_primary'), g.get('sort_order') or 0))
        src = imgs[0]['url'] if imgs else next((u for u in p.get('images') or [] if str(u).startswith('http')), None)
        if not slug or not src:
            continue
        nepal = p.get('destination_type') == 'National'
        sizes = [(600, 450)] + ([(1200, 750)] if nepal else [])
        try:
            data = get(big_variant(src))
            img = Image.open(io.BytesIO(data))
            img = ImageOps.exif_transpose(img)
        except Exception as ex:  # keep going; that package uses its remote photo
            print(f'skip {slug}: {ex}', file=sys.stderr)
            continue
        widths = []
        for w, h in sizes:
            if img.width < w * 0.8:
                continue  # never upscale a small original into a blurry banner
            im = cover(img, w, h)
            im.save(OUT / f'{slug}-{w}.avif', quality=52, speed=6)
            im.save(OUT / f'{slug}-{w}.webp', quality=72, method=6)
            widths.append(w)
        if widths:
            manifest[slug] = widths
            print(f'{slug}: {widths}')
    MANIFEST.write_text(json.dumps(dict(sorted(manifest.items())), indent=1) + '\n', encoding='utf8')
    print(f'{len(manifest)} packages -> {MANIFEST.relative_to(ROOT)}')


if __name__ == '__main__':
    main()
