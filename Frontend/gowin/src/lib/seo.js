import { useEffect } from 'react';
import { DEFAULT_SITE_URL, SITE_NAME, homeGraph, tripGraph, pageGraph } from './schema';

export { SITE_NAME };
export const SITE_URL = (import.meta.env.VITE_SITE_URL || DEFAULT_SITE_URL).replace(/\/$/, '');
const DEFAULT_DESCRIPTION =
  'GoWin International Travel & Tourism, Kathmandu: Nepal cultural tours, pilgrimages, wildlife safaris, lakes and scenic escapes, plus curated international holidays, flights, hotels and visa assistance.';

function upsertMeta(selector, attrs) {
  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement('meta');
    document.head.appendChild(el);
  }
  Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
  return el;
}

function upsertLink(rel, href) {
  let el = document.head.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

/**
 * Per-route SEO: document title, description, canonical URL, Open Graph /
 * Twitter cards and optional JSON-LD structured data. Values reset when the
 * component unmounts so pages never inherit stale metadata.
 */
export function useSEO({ title, description, path, image, type = 'website', jsonLd, noindex = false } = {}) {
  useEffect(() => {
    const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} — Nepal Tours & World Holidays`;
    const desc = (description || DEFAULT_DESCRIPTION).slice(0, 300);
    const url = `${SITE_URL}${path || window.location.pathname}`;
    const img = image ? (image.startsWith('/') ? `${SITE_URL}${image}` : image) : `${SITE_URL}/og-cover.jpg`;

    document.title = fullTitle;
    upsertMeta('meta[name="description"]', { name: 'description', content: desc });
    upsertMeta('meta[name="robots"]', { name: 'robots', content: noindex ? 'noindex, nofollow' : 'index, follow' });
    upsertMeta('meta[property="og:title"]', { property: 'og:title', content: fullTitle });
    upsertMeta('meta[property="og:description"]', { property: 'og:description', content: desc });
    upsertMeta('meta[property="og:url"]', { property: 'og:url', content: url });
    upsertMeta('meta[property="og:type"]', { property: 'og:type', content: type });
    upsertMeta('meta[property="og:image"]', { property: 'og:image', content: img });
    upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: fullTitle });
    upsertMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: desc });
    upsertMeta('meta[name="twitter:image"]', { name: 'twitter:image', content: img });
    upsertLink('canonical', url);

    // Structured data written into the static HTML at build time is replaced by the live version.
    document.head.querySelectorAll('script[data-prerender]').forEach((el) => el.remove());

    let script;
    if (jsonLd) {
      script = document.createElement('script');
      script.type = 'application/ld+json';
      script.dataset.seo = 'route';
      script.text = JSON.stringify(jsonLd);
      document.head.appendChild(script);
    }
    return () => {
      if (script) script.remove();
    };
  }, [title, description, path, image, type, noindex, JSON.stringify(jsonLd)]); // eslint-disable-line react-hooks/exhaustive-deps
}

/** schema.org graph for a destination detail page (TouristTrip + breadcrumbs). */
export function tripJsonLd(place, settings, crumbs) {
  return tripGraph(SITE_URL, place, settings, { path: `/places/${place.slug || place.id}`, crumbs });
}

/** schema.org TravelAgency + WebSite for the home page. */
export function agencyJsonLd(settings) {
  return homeGraph(SITE_URL, settings);
}

/** TravelAgency (+ optional breadcrumbs) for about / contact. */
export function pageJsonLd(settings, crumbs) {
  return pageGraph(SITE_URL, { agency: true, settings, crumbs });
}
