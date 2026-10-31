/** Resolves true when the browser can actually display the URL as an image (used before a photo link is accepted). */
export const probeImage = (url, timeout = 12000) => new Promise((resolve) => {
  const img = new Image();
  const timer = setTimeout(() => { img.src = ''; resolve(false); }, timeout);
  img.onload = () => { clearTimeout(timer); resolve(img.naturalWidth > 0); };
  img.onerror = () => { clearTimeout(timer); resolve(false); };
  img.src = url;
});

const UNSPLASH_WIDTHS = [480, 800, 1200, 1600];
// Wikimedia only serves hot-linked thumbnails at certain widths (others answer HTTP 400).
const COMMONS_WIDTHS = [500, 960, 1280];

/**
 * Responsive variants for the photo hosts we use, so phones stop downloading
 * 1280–1600 px originals for a 360 px card. Unknown hosts are returned as-is.
 *   Unsplash  → ?w= / q= / auto=format (served as AVIF/WebP when supported)
 *   Commons   → /thumb/…/<n>px-File at the widths Commons allows, never above the stored width
 */
export function responsiveImage(url) {
  if (typeof url === 'string' && /^\/hero\/[\w-]+\.webp$/.test(url) && !url.endsWith('-960.webp')) {
    return { src: url, srcSet: `${url.replace(/\.webp$/, '-960.webp')} 960w, ${url} 1920w` }; // bundled hero photos (public/hero)
  }
  if (typeof url !== 'string' || !/^https?:\/\//i.test(url)) return { src: url };
  try {
    const u = new URL(url);
    if (u.hostname === 'images.unsplash.com') {
      const at = (w, q = 70) => { const v = new URL(u); v.searchParams.set('w', String(w)); v.searchParams.set('q', String(q)); v.searchParams.set('auto', 'format'); if (!v.searchParams.has('fit')) v.searchParams.set('fit', 'crop'); return v.toString(); };
      return { src: at(1200), srcSet: UNSPLASH_WIDTHS.map((w) => `${at(w)} ${w}w`).join(', ') };
    }
    if (u.hostname === 'upload.wikimedia.org') {
      const m = url.match(/\/(\d+)px-[^/]+$/);
      if (m && url.includes('/thumb/')) {
        const stored = Number(m[1]);
        const widths = COMMONS_WIDTHS.filter((w) => w <= stored);
        if (widths.length > 1) return { src: url, srcSet: widths.map((w) => `${url.replace(/\/\d+px-([^/]+)$/, `/${w}px-$1`)} ${w}w`).join(', ') };
      }
    }
  } catch { /* not a URL */ }
  return { src: url };
}
