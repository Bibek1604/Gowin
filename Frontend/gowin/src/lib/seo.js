import { useEffect } from 'react';

export const SITE_URL = (import.meta.env.VITE_SITE_URL || 'https://gowintravels.com').replace(/\/$/, '');
export const SITE_NAME = 'GoWin Travels';
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
    const img = image || `${SITE_URL}/og-cover.jpg`;

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

/** schema.org TouristTrip for a destination detail page. */
export function tripJsonLd(place, settings) {
  const offers = place.price
    ? {
        '@type': 'Offer',
        price: String(place.price).replace(/[^0-9.]/g, '') || undefined,
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
        url: `${SITE_URL}/places/${place.slug || place.id}`,
      }
    : undefined;
  return {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    name: place.title,
    description: place.description || undefined,
    image: Array.isArray(place.images) && place.images.length ? place.images : undefined,
    touristType: place.categories?.name || undefined,
    itinerary: place.location
      ? { '@type': 'Place', name: place.location, address: { '@type': 'PostalAddress', addressCountry: place.destination_type === 'National' ? 'NP' : undefined } }
      : undefined,
    offers,
    provider: {
      '@type': 'TravelAgency',
      name: settings?.business_name || 'GoWin International Travel & Tourism',
      telephone: settings?.phone || undefined,
      email: settings?.email || undefined,
      url: SITE_URL,
    },
  };
}

/** schema.org TravelAgency for the home / about / contact pages. */
export function agencyJsonLd(settings) {
  return {
    '@context': 'https://schema.org',
    '@type': 'TravelAgency',
    name: settings?.business_name || 'GoWin International Travel & Tourism',
    url: SITE_URL,
    telephone: settings?.phone || undefined,
    email: settings?.email || undefined,
    address: settings?.address
      ? { '@type': 'PostalAddress', streetAddress: settings.address, addressLocality: 'Kathmandu', addressCountry: 'NP' }
      : { '@type': 'PostalAddress', addressLocality: 'Kathmandu', addressCountry: 'NP' },
    areaServed: ['Nepal', 'Worldwide'],
    sameAs: [settings?.facebook_url, settings?.instagram_url, settings?.tiktok_url, settings?.youtube_url].filter(Boolean),
  };
}
