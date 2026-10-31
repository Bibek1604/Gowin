/** Code-split public pages: one loader per route (shared by App's lazy() routes and boot's preload). */
export const ROUTE_CHUNKS = {
  destinations: () => import('./components/Tourism/AllDestinations'),
  places: () => import('./components/Details/DestinationDetails'),
  booking: () => import('./components/Layout/Booking'),
  contact: () => import('./components/Tourism/Contact'),
  about: () => import('./components/Tourism/About'),
  services: () => import('./components/Tourism/Services'),
  guides: () => import('./components/Tourism/TravelGuides'),
  support: () => import('./components/Tourism/ContactSupport'),
  privacy: () => import('./components/Tourism/PrivacyPolicy'),
  refund: () => import('./components/Tourism/RefundPolicy'),
  terms: () => import('./components/Tourism/TermsConditions'),
};
/** Start loading the code for the page at `pathname` (used before the first render). */
export const preloadRoute = (pathname) => ROUTE_CHUNKS[String(pathname).split('/')[1]]?.() ?? Promise.resolve();
