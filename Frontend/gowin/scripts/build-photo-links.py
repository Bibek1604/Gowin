"""Resolves supabase/media/sources.json into direct photo links (supabase/media/photos.json).

Every destination photo on the site is a link to a real photograph on its
source site, with its source page, credit, licence and alt text recorded
next to it:

  * Wikimedia Commons  — the 1280 px rendition served by upload.wikimedia.org
                         (one of the widths Commons serves to hotlinks); the
                         original file when it is narrower than 1280 px
  * Unsplash           — the images.unsplash.com CDN link at 1600 px
  * owner photos       — files in supabase/media/*.webp that the content
                         migration uploads to the public `media` bucket

Each link is fetched to confirm it loads as an image. Usage:

    python -I scripts/build-photo-links.py [--only key ...] [--sheet DIR]

--sheet writes contact sheets (JPEG grids with labels) for a visual check.
"""
import argparse, io, json, os, re, sys, time, urllib.error, urllib.parse, urllib.request, concurrent.futures as cf, datetime
from html.parser import HTMLParser

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MEDIA = os.path.join(ROOT, 'supabase', 'media')
UA = {'User-Agent': 'GoWinTravels-photo-links/1.0 (info.gowintravels@gmail.com)'}
COMMONS_W = 1280      # Commons serves only certain widths to other sites (250, 500, 960, 1280, 1920 work; see https://w.wiki/GHai)
UNSPLASH_W = 1600


class _Strip(HTMLParser):
    def __init__(self):
        super().__init__(); self.out = []
    def handle_data(self, d):
        self.out.append(d)


def strip_html(s):
    p = _Strip(); p.feed(s or ''); return re.sub(r'\s+', ' ', ''.join(p.out)).strip()


def request(url, method='GET', timeout=60):
    req = urllib.request.Request(url, headers=UA, method=method)
    return urllib.request.urlopen(req, timeout=timeout)


def api(**params):
    params['format'] = 'json'
    with request('https://commons.wikimedia.org/w/api.php?' + urllib.parse.urlencode(params)) as r:
        return json.load(r)


def image_size(data):
    from PIL import Image
    im = Image.open(io.BytesIO(data)); return im.width, im.height


def check_link(url, need_bytes=False):
    """Confirm the link serves an image (HEAD, or GET when the bytes are needed); returns (ok, detail, bytes).
    Wikimedia rate-limits bursts (HTTP 429), so requests to it are paced and retried."""
    wikimedia = 'wikimedia.org' in url
    for attempt in range(4):
        try:
            if wikimedia:
                time.sleep(0.7)
            with request(url, 'GET' if need_bytes else 'HEAD') as r:
                ctype = r.headers.get('Content-Type', '')
                data = r.read() if need_bytes else None
                if r.status != 200 or not ctype.startswith('image/'):
                    return False, f'{r.status} {ctype}', None
                size = len(data) // 1024 if data else int(r.headers.get('Content-Length', 0) or 0) // 1024
                return True, f'{r.status} {ctype} {size} KB', data
        except urllib.error.HTTPError as e:
            if e.code == 429 and attempt < 3:
                time.sleep(8 * (attempt + 1)); continue
            return False, str(e)[:120], None
        except Exception as e:
            return False, str(e)[:120], None
    return False, 'rate limited', None


def resolve_commons(spec):
    title = spec['title'] if spec['title'].startswith('File:') else 'File:' + spec['title']
    data = api(action='query', titles=title, prop='imageinfo', iiprop='url|extmetadata|size|mime', iiurlwidth=COMMONS_W)
    page = next(iter(data['query']['pages'].values()))
    if 'missing' in page or not page.get('imageinfo'):
        raise ValueError(f'not found on Commons: {title}')
    ii = page['imageinfo'][0]; md = ii.get('extmetadata', {})
    lic = md.get('LicenseShortName', {}).get('value', '') or 'unknown licence'
    artist = strip_html(md.get('Artist', {}).get('value', '')) or 'Wikimedia Commons contributor'
    if ii['width'] >= COMMONS_W:
        url = ii['thumburl'].split('?')[0].replace('https://thumb.wikimedia.org/', 'https://upload.wikimedia.org/')
        width, height = ii['thumbwidth'], ii['thumbheight']
    else:
        url = ii['url'].split('?')[0]
        width, height = ii['width'], ii['height']
    return dict(url=url, source_url=ii['descriptionurl'], credit=f'{artist}, {lic}, via Wikimedia Commons', license=lic, width=width, height=height)


def resolve_unsplash(spec):
    pid = spec['id']
    url = f'https://images.unsplash.com/{pid}?auto=format&fit=max&w={UNSPLASH_W}&q=80'
    # Unsplash's CDN id cannot be turned into a photo page without their API, so the CDN link is the source.
    return dict(url=url, source_url=f'https://images.unsplash.com/{pid}', credit='Photo via Unsplash', license='Unsplash License', width=None, height=None)


def resolve_owner(spec):
    path = os.path.join(MEDIA, spec['file'])
    if not os.path.exists(path):
        raise FileNotFoundError(spec['file'])
    w, h = image_size(open(path, 'rb').read())
    return dict(url=None, file=spec['file'], source_url=None, credit='GoWin Travels', license='Owner photo', width=w, height=h)


def build(key, spec):
    kind = spec['source']
    info = {'commons': resolve_commons, 'unsplash': resolve_unsplash, 'owner': resolve_owner}[kind](spec)
    info['source'] = kind
    info['alt'] = spec.get('alt') or spec.get('verified') or ''
    info['verified'] = spec.get('verified', '')
    if info.get('url'):
        ok, detail, data = check_link(info['url'], need_bytes=not info.get('width'))
        if not ok:
            raise RuntimeError(f'link does not load: {detail}')
        if data:
            info['width'], info['height'] = image_size(data)
            info['bytes'] = len(data)
        else:
            info['bytes'] = int(detail.split()[-2]) * 1024 if detail.endswith('KB') else None
        info['checked'] = datetime.date.today().isoformat()
    return key, info


def sheets(photos, out_dir):
    """Contact sheets of every photo (6 per row) for a visual check."""
    from PIL import Image, ImageDraw, ImageFont, ImageOps
    os.makedirs(out_dir, exist_ok=True)
    W, H, L, COLS, ROWS = 320, 220, 22, 6, 4
    font = ImageFont.load_default()
    keys = list(photos.keys())

    def small(info):
        if info['source'] == 'commons' and '/thumb/' in (info['url'] or ''):
            return re.sub(r'/\d+px-', '/500px-', info['url'])  # 500 px is one of the widths Commons serves to hotlinks
        if info['source'] == 'unsplash':
            return info['url'].replace(f'w={UNSPLASH_W}', 'w=500')
        return info.get('url') or os.path.join(MEDIA, info['file'])

    def load(info):
        src = small(info)
        if os.path.exists(src):
            data = open(src, 'rb').read()
        else:
            if 'wikimedia.org' in src:
                time.sleep(0.7)
            data = request(src).read()
        return ImageOps.fit(Image.open(io.BytesIO(data)).convert('RGB'), (W, H))

    with cf.ThreadPoolExecutor(2) as ex:
        thumbs = dict(zip(keys, ex.map(lambda k: load(photos[k]), keys)))
    per = COLS * ROWS
    for s in range(0, len(keys), per):
        chunk = keys[s:s + per]; rows = (len(chunk) + COLS - 1) // COLS
        sheet = Image.new('RGB', (COLS * W, rows * (H + L)), 'white'); d = ImageDraw.Draw(sheet)
        for i, k in enumerate(chunk):
            x, y = (i % COLS) * W, (i // COLS) * (H + L)
            sheet.paste(thumbs[k], (x, y)); d.rectangle([x, y + H, x + W, y + H + L], fill='black')
            d.text((x + 4, y + H + 5), f'{k} [{photos[k]["source"][:3]}]', fill='yellow', font=font)
        path = os.path.join(out_dir, f'photos_{s // per + 1}.jpg'); sheet.save(path, quality=80); print('sheet', path)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--only', nargs='*')
    ap.add_argument('--sheet', help='directory for contact sheets')
    ap.add_argument('--sources', default=os.path.join(MEDIA, 'sources.json'))
    ap.add_argument('--out', default=os.path.join(MEDIA, 'photos.json'))
    args = ap.parse_args()
    spec = json.load(open(args.sources, encoding='utf8'))['images']
    photos = json.load(open(args.out, encoding='utf8')) if os.path.exists(args.out) else {}
    todo = [(k, v) for k, v in spec.items() if not args.only or k in args.only]
    failures = []
    with cf.ThreadPoolExecutor(2) as ex:
        futs = {ex.submit(build, k, v): k for k, v in todo}
        for f in cf.as_completed(futs):
            k = futs[f]
            try:
                key, info = f.result(); photos[key] = info
                print(f'ok   {key:30s} {info.get("width")}x{info.get("height")}  {(info.get("url") or info.get("file"))[:70]}')
            except Exception as e:
                failures.append(k); print(f'FAIL {k}: {e}')
    if not args.only:
        for k in list(photos):
            if k not in spec:
                del photos[k]; print(f'drop {k} (no longer in sources.json)')
    json.dump(dict(sorted(photos.items())), open(args.out, 'w', encoding='utf8'), indent=2, ensure_ascii=False)
    kinds = {}
    for v in photos.values():
        kinds[v['source']] = kinds.get(v['source'], 0) + 1
    print(f'\n{len(photos)} photos in {args.out} — ' + ', '.join(f'{k}: {n}' for k, n in sorted(kinds.items())) + f'; {len(failures)} failure(s)')
    if args.sheet:
        sheets(photos, args.sheet)
    sys.exit(1 if failures else 0)


if __name__ == '__main__':
    main()
