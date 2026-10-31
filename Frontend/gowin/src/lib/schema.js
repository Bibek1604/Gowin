// schema.org JSON-LD builders shared by the app (src/lib/seo.js) and the
// build-time prerenderer (scripts/prerender.mjs), so crawlers that do not run
// JavaScript and those that do see the same structured data.
// Plain ES module: no React, no import.meta.
//
// Rules: only describe what the page actually shows. No ratings, review
// counts, availability or credentials that are not published on the site.

/** Canonical origin. gowintravels.com (apex) redirects to www, so www is canonical. */
export const DEFAULT_SITE_URL = 'https://www.gowintravels.com';
export const SITE_NAME = 'GoWin Travels';
export const LEGAL_NAME = 'Go Win International Travel and Tourism Pvt. Ltd.';

const strip = (obj) => JSON.parse(JSON.stringify(obj)); // drops undefined

const numericPrice = (price) => {
  if (price === null || price === undefined) return null;
  const raw = String(price).trim();
  if (!raw || /[a-z]/i.test(raw.replace(/usd/i, ''))) return null;
  const n = Number(raw.replace(/[^0-9.]/g, ''));
  return Number.isFinite(n) && n > 0 ? n : null;
};

/** TravelAgency (the business) — identified by #organization so other nodes can reference it. */
export function agencyNode(site, settings = {}) {
  return strip({
    '@type': 'TravelAgency',
    '@id': `${site}/#organization`,
    name: settings.business_name || 'GoWin International Travel & Tourism',
    legalName: LEGAL_NAME,
    alternateName: SITE_NAME,
    url: `${site}/`,
    logo: `${site}/icons/android-chrome-512x512.png`,
    image: `${site}/og-cover.jpg`,
    telephone: settings.phone || undefined,
    email: settings.email || undefined,
    address: {
      '@type': 'PostalAddress',
      streetAddress: settings.address ? String(settings.address).split(',')[0].trim() : undefined,
      addressLocality: 'Kathmandu',
      addressCountry: 'NP',
    },
    areaServed: [{ '@type': 'Country', name: 'Nepal' }, 'Worldwide'],
    sameAs: [settings.facebook_url, settings.instagram_url, settings.tiktok_url, settings.youtube_url].filter(Boolean),
  });
}

/** Home page graph: the business + the website. */
export function homeGraph(site, settings) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      agencyNode(site, settings),
      { '@type': 'WebSite', '@id': `${site}/#website`, url: `${site}/`, name: SITE_NAME, publisher: { '@id': `${site}/#organization` }, inLanguage: 'en' },
    ],
  };
}

/** BreadcrumbList from [{ name, path }] (path relative to the site root). */
export function breadcrumbNode(site, crumbs) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => strip({ '@type': 'ListItem', position: i + 1, name: c.name, item: c.path ? `${site}${c.path}` : undefined })),
  };
}

/** Detail page graph: TouristTrip (+ itinerary, offer when a price is published) and breadcrumbs. */
export function tripGraph(site, place, settings, { path, crumbs } = {}) {
  const d = place.details || (Array.isArray(place.place_details) ? place.place_details[0] : place.place_details) || {};
  const url = `${site}${path || `/places/${place.slug || place.id}`}`;
  const price = numericPrice(place.price);
  const images = (place.gallery?.length ? place.gallery.map((g) => g.url) : place.images || []).filter((u) => typeof u === 'string' && /^https?:/.test(u));
  const days = Array.isArray(d.itinerary) ? d.itinerary.filter((x) => x && x.title) : [];
  const trip = strip({
    '@type': 'TouristTrip',
    '@id': `${url}#trip`,
    name: place.title,
    description: place.description || undefined,
    url,
    image: images.length ? images.slice(0, 6) : undefined,
    touristType: place.categories?.name || undefined,
    // the trip's destination; Nepal packages are stored as destination_type = 'National'
    itinerary: days.length
      ? { '@type': 'ItemList', numberOfItems: days.length, itemListElement: days.map((x, i) => ({ '@type': 'ListItem', position: i + 1, name: `Day ${x.day || i + 1}: ${x.title}`, description: x.description || undefined })) }
      : place.location ? { '@type': 'Place', name: place.location } : undefined,
    offers: price
      ? { '@type': 'Offer', price: String(price), priceCurrency: 'USD', url, description: 'Starting price per person; final quote depends on dates, group size and hotel category.', seller: { '@id': `${site}/#organization` } }
      : undefined,
    provider: { '@id': `${site}/#organization` },
  });
  const graph = [trip, agencyNode(site, settings)];
  if (crumbs?.length) graph.push(breadcrumbNode(site, crumbs));
  return { '@context': 'https://schema.org', '@graph': graph };
}

/** Collection page (destination listings): ItemList of the trips shown. */
export function listGraph(site, { name, path, places, crumbs }) {
  const graph = [{
    '@type': 'CollectionPage',
    '@id': `${site}${path}#page`,
    url: `${site}${path}`,
    name,
    isPartOf: { '@id': `${site}/#website` },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: places.length,
      itemListElement: places.map((p, i) => ({ '@type': 'ListItem', position: i + 1, url: `${site}/places/${p.slug || p.id}`, name: p.title })),
    },
  }];
  if (crumbs?.length) graph.push(breadcrumbNode(site, crumbs));
  return { '@context': 'https://schema.org', '@graph': graph };
}

/** Plain page with breadcrumbs (about, services, policies…). */
export function pageGraph(site, { crumbs, agency, settings }) {
  const graph = [];
  if (agency) graph.push(agencyNode(site, settings));
  if (crumbs?.length) graph.push(breadcrumbNode(site, crumbs));
  return graph.length ? { '@context': 'https://schema.org', '@graph': graph } : null;
}
