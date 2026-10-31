/** Small formatting helpers shared by the public site and the admin panel. */

/** "1299" → "$1,299"; non-numeric text is returned as typed; empty → null. */
export function formatPrice(price) {
  if (price === null || price === undefined) return null;
  const raw = String(price).trim();
  if (!raw) return null;
  const num = Number(raw.replace(/[^0-9.]/g, ''));
  if (!Number.isFinite(num) || num <= 0 || /[a-z]/i.test(raw)) return raw.startsWith('$') ? raw : raw;
  return `$${num.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
}

/** First part of a duration string: "7 Days / 6 Nights" → "7 Days". */
export function shortDuration(duration) {
  if (!duration) return null;
  return String(duration).split('/')[0].trim();
}

/** "Santorini, Greece" → "Greece"; "Singapore" → "Singapore". */
export function countryFromLocation(location) {
  if (!location) return null;
  const parts = String(location).split(',').map((s) => s.trim()).filter(Boolean);
  return parts[parts.length - 1] || null;
}

/** Nepal packages are stored as destination_type = 'National'. */
export const isNepal = (place) => (place?.destination_type || 'International') === 'National';

/** Human label for the destination type. */
export const typeLabel = (place) => (isNepal(place) ? 'Nepal' : 'International');

/** Route to a destination's detail page (slug when available, id otherwise). */
export const placePath = (place) => `/places/${place?.slug || place?.id}`;

/** The cover photo row ({ url, alt_text, credit, source_url }) — first entry of the gallery. */
export const primaryImage = (place) => (Array.isArray(place?.gallery) && place.gallery.find((g) => g && typeof g.url === 'string' && g.url.trim())) || null;

/** Cover photo URL: the gallery's first photo, else the first usable entry of the legacy images list. */
export const coverImage = (place) => primaryImage(place)?.url || (Array.isArray(place?.images) && place.images.find((u) => typeof u === 'string' && u.trim())) || null;

/** Alt text for the cover photo: what the photo shows, else "Title – Location". */
export const coverAlt = (place) => primaryImage(place)?.alt_text || [place?.title, place?.location].filter(Boolean).join(' – ');

/** Dates coming from Postgres are ISO strings; show them compactly. */
export function formatDate(value, opts = {}) {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', ...opts });
}

/** Trim and collapse whitespace; returns '' for nullish. */
export const clean = (s) => (s === null || s === undefined ? '' : String(s).replace(/\s+/g, ' ').trim());

/** Digits-only phone for tel:/wa.me links: "+977 9851410966" → "9779851410966". */
export const phoneDigits = (phone) => clean(phone).replace(/[^0-9]/g, '');

/** Build a WhatsApp chat link with a prefilled message. */
export function whatsappLink(phone, text) {
  const digits = phoneDigits(phone);
  if (!digits) return null;
  return `https://wa.me/${digits}${text ? `?text=${encodeURIComponent(text)}` : ''}`;
}

/** Page title for a package: "Title – Location" when that stays short enough for search results, else just the title. */
export const packageTitle = (place) => {
  const withPlace = place?.location ? `${place.title} – ${place.location}` : place?.title || '';
  return withPlace.length <= 58 ? withPlace : place?.title || '';
};
