"""Builds the self-hosted destination image set from supabase/media/sources.json.

For every entry it downloads the source image (Unsplash, Wikimedia Commons or a
photo exported from the database), normalises orientation, resizes so the longer
edge is at most 1600px and writes a WebP next to the manifest. The resulting
manifest.json records the file, dimensions and attribution text so that
scripts/migrate-content.mjs can upload the files and store credits.

Usage:
    python -I scripts/build-media.py [--owner-dir <dir with exported owner photos>]
"""
import argparse, io, json, os, re, sys, urllib.parse, urllib.request, concurrent.futures as cf
from html.parser import HTMLParser
from PIL import Image, ImageOps

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MEDIA = os.path.join(ROOT, 'supabase', 'media')
UA = {'User-Agent': 'GoWinTravels-media-builder/1.0 (info.gowintravels@gmail.com)'}
MAX_EDGE = 1600
QUALITY = 76


class _Strip(HTMLParser):
    def __init__(self):
        super().__init__(); self.out = []
    def handle_data(self, d):
        self.out.append(d)


def strip_html(s):
    p = _Strip(); p.feed(s or ''); return re.sub(r'\s+', ' ', ''.join(p.out)).strip()


def fetch(url, timeout=60):
    with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=timeout) as r:
        return r.read()


def commons_lookup(query, pick):
    """Re-runs the same search used during the audit and returns the picked file."""
    SEARCH = {
        'phewa-lake': 'Phewa Lake Pokhara boats', 'pokhara-sarangkot': 'Sarangkot Pokhara view Annapurna',
        'begnas-lake': 'Begnas Lake', 'rara-lake': 'Rara Lake Mugu', 'chitwan-rhino': 'Chitwan National Park rhinoceros',
        'bardia': 'Bardia National Park', 'nagarkot': 'Nagarkot sunrise Himalaya', 'bandipur': 'Bandipur bazaar Nepal',
        'bhotekoshi-bungee': 'Bhote Koshi bungee', 'iceland-aurora': 'Aurora borealis Iceland',
        'dubrovnik': 'Dubrovnik old town walls', 'queenstown': 'Queenstown New Zealand lake Wakatipu',
        'pashupatinath': 'Pashupatinath temple', 'swayambhunath': 'Swayambhunath stupa', 'patan-durbar': 'Patan Durbar Square',
        'everest-flight': 'Mount Everest aerial view', 'chitwan-safari': 'Chitwan jeep safari elephant', 'muktinath': 'Muktinath temple',
    }
    OK_LIC = ('cc0', 'cc by', 'cc-by', 'public domain', 'attribution')
    params = dict(action='query', generator='search', gsrsearch=f'filetype:bitmap {SEARCH[query]}', gsrnamespace=6,
                  gsrlimit=8, prop='imageinfo', iiprop='url|extmetadata|size', iiurlwidth=MAX_EDGE, format='json')
    data = json.loads(fetch('https://commons.wikimedia.org/w/api.php?' + urllib.parse.urlencode(params)))
    cands = []
    for p in sorted(data['query']['pages'].values(), key=lambda p: p.get('index', 0)):
        ii = p['imageinfo'][0]; md = ii.get('extmetadata', {})
        lic = md.get('LicenseShortName', {}).get('value', '')
        if not any(k in lic.lower() for k in OK_LIC): continue
        if ii['width'] < 1200 or ii['height'] < 700 or ii['width'] < ii['height']: continue
        cands.append(dict(title=p['title'], thumb=ii['thumburl'], license=lic,
                          artist=strip_html(md.get('Artist', {}).get('value', '')), page=ii['descriptionurl']))
    return cands[pick]


def build(key, spec, owner_dir):
    out = os.path.join(MEDIA, key + '.webp')
    credit, page = '', ''
    if spec['source'] == 'unsplash':
        raw = fetch(f"https://images.unsplash.com/{spec['id']}?auto=format&fit=max&w={MAX_EDGE}&q=85")
        credit = 'Photo via Unsplash'
        page = f"https://unsplash.com/photos/{spec['id'].split('-', 1)[1]}"
    elif spec['source'] == 'commons':
        c = commons_lookup(spec['query'], spec['pick'])
        raw = fetch(c['thumb'])
        credit = f"{c['artist'] or 'Wikimedia Commons contributor'}, {c['license']}, via Wikimedia Commons"
        page = c['page']
    elif spec['source'] == 'owner':
        matches = [f for f in os.listdir(owner_dir) if f.startswith(spec['file'][:20])]
        if not matches: raise FileNotFoundError(spec['file'])
        raw = open(os.path.join(owner_dir, matches[0]), 'rb').read()
        credit = 'GoWin Travels'
    else:
        raise ValueError(spec['source'])
    im = ImageOps.exif_transpose(Image.open(io.BytesIO(raw))).convert('RGB')
    scale = MAX_EDGE / max(im.width, im.height)
    if scale < 1:
        im = im.resize((round(im.width * scale), round(im.height * scale)), Image.LANCZOS)
    im.save(out, 'WEBP', quality=QUALITY, method=6)
    return key, dict(file=f'{key}.webp', width=im.width, height=im.height, bytes=os.path.getsize(out),
                     credit=credit, source_page=page, verified=spec.get('verified', ''))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--owner-dir', default=os.path.join(MEDIA, 'owner-exports'))
    ap.add_argument('--only', nargs='*')
    args = ap.parse_args()
    spec = json.load(open(os.path.join(MEDIA, 'sources.json'), encoding='utf8'))['images']
    manifest_path = os.path.join(MEDIA, 'manifest.json')
    manifest = json.load(open(manifest_path, encoding='utf8')) if os.path.exists(manifest_path) else {}
    todo = [(k, v) for k, v in spec.items() if (not args.only or k in args.only)]
    failures = 0
    with cf.ThreadPoolExecutor(5) as ex:
        futs = {ex.submit(build, k, v, args.owner_dir): k for k, v in todo}
        for f in cf.as_completed(futs):
            k = futs[f]
            try:
                key, info = f.result(); manifest[key] = info
                print(f'ok   {key:28s} {info["width"]}x{info["height"]} {info["bytes"]//1024}KB  {info["credit"][:60]}')
            except Exception as e:
                failures += 1; print(f'FAIL {k}: {e}')
    json.dump(dict(sorted(manifest.items())), open(manifest_path, 'w', encoding='utf8'), indent=2, ensure_ascii=False)
    total = sum(v['bytes'] for v in manifest.values())
    print(f'\n{len(manifest)} images in manifest, {total/1024/1024:.1f} MB total; {failures} failure(s)')
    sys.exit(1 if failures else 0)


if __name__ == '__main__':
    main()
