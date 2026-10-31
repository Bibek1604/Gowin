/**
 * Banner photo for each inner page. These are the bundled hero photographs
 * (public/hero, licences in public/hero/manifest.json), so banners appear
 * instantly, never depend on the database, and the build-time prerender
 * (scripts/prerender.mjs) can show exactly the same image.
 */
export const BANNERS = {
  destinations: '/hero/kathmandu-boudhanath.webp',
  national: '/hero/sarangkot-annapurna.webp',
  international: '/hero/santorini-oia.webp',
  about: '/hero/kathmandu-boudhanath.webp',
  contact: '/hero/kathmandu-boudhanath.webp',
  services: '/hero/chitwan-jeep-safari.webp',
  support: '/hero/chitwan-jeep-safari.webp',
  guides: '/hero/sarangkot-annapurna.webp',
  booking: '/hero/sarangkot-annapurna.webp',
};

/** Route → banner key, shared with the prerenderer. */
export const BANNER_FOR_ROUTE = {
  '/destinations': 'destinations',
  '/destinations/national': 'national',
  '/destinations/international': 'international',
  '/about': 'about',
  '/contact': 'contact',
  '/services': 'services',
  '/support': 'support',
  '/guides': 'guides',
  '/booking': 'booking',
};
