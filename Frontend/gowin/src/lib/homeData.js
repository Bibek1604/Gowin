/** Derive home-page facts from a package row. Only real fields are read; missing data returns null and the row is hidden. */
import { formatPrice, shortDuration, isNepal } from './format.js';
import { BUSINESS_FACTS } from '../data/businessFacts.js';

const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

/** "October – April" → Set{10,11,12,1,2,3,4}; ranges and lists ("March – June, September – November") are expanded. */
export function monthsOf(text) {
  const out = new Set();
  if (!text) return out;
  for (const part of String(text).split(/[,;]/)) {
    const found = [...part.toLowerCase().matchAll(/\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*/g)].map((m) => MONTHS.indexOf(m[1]) + 1);
    if (!found.length) continue;
    if (found.length >= 2 && /[–—-]|\bto\b/.test(part)) {
      let m = found[0];
      for (let guard = 0; guard < 12; guard += 1) { out.add(m); if (m === found[found.length - 1]) break; m = (m % 12) + 1; }
    } else found.forEach((m) => out.add(m));
  }
  return out;
}

/** Short best-season text: "October – April (dry season)" → "Oct–Apr". */
export function shortSeason(text) {
  if (!text) return null;
  const t = String(text).replace(/\s*\(.*?\)/g, '').trim();
  return t.replace(/\b(January|February|March|April|May|June|July|August|September|October|November|December)\b/g, (m) => m.slice(0, 3)).replace(/\s*[–—-]\s*/g, '–');
}

const firstMatch = (list, re) => (Array.isArray(list) ? list.find((x) => re.test(String(x))) : null) || null;

/** Pickup line from the package's own inclusions ("Private vehicle with hotel pick-up …" → "Hotel pickup, Kathmandu"). */
export function pickupOf(place) {
  const inc = place?.details?.inclusions;
  const hit = firstMatch(inc, /pick-?\s?up/i) || firstMatch(inc, /transfer/i);
  if (!hit) return null;
  const s = String(hit);
  if (/hotel pick-?\s?up/i.test(s)) return /kathmandu/i.test(s) ? 'Hotel pickup in Kathmandu' : 'Hotel pickup';
  if (/airport pick-?\s?up/i.test(s)) return 'Airport pickup';
  if (/airport transfer/i.test(s)) return 'Airport transfers';
  return s.length > 40 ? `${s.slice(0, 38).replace(/\s+\S*$/, '')}…` : s;
}

/** International trips: does the package include flights from Kathmandu? Only an explicit inclusion counts. */
export function flightsFromKtm(place) {
  const hit = firstMatch(place?.details?.inclusions, /flight/i);
  return !!hit && /kathmandu|ktm/i.test(hit);
}

/** First sentence of the description, for quote-style one-liners. */
export function oneLiner(place, max = 140) {
  const d = String(place?.description || '').replace(/\s+/g, ' ').trim();
  if (!d) return null;
  const s = d.match(/^.*?[.!?](\s|$)/)?.[0]?.trim() || d;
  return s.length > max ? `${s.slice(0, max - 1).replace(/\s+\S*$/, '')}…` : s;
}

/** Spec rows shown on cards; rows without data are dropped. */
export function specsOf(place, { withPickup = true } = {}) {
  return [
    { key: 'duration', label: 'Duration', value: shortDuration(place?.duration) },
    { key: 'season', label: 'Best season', value: shortSeason(place?.details?.best_time) },
    withPickup ? { key: 'pickup', label: 'Pickup', value: pickupOf(place) } : null,
  ].filter((r) => r && r.value);
}

export const priceOf = (place) => formatPrice(place?.price);

/** "From NPR X" only when the owner has set an approved rate. */
export function nprPrice(place) {
  const rate = Number(BUSINESS_FACTS.nprPerUsd);
  const usd = Number(String(place?.price ?? '').replace(/[^0-9.]/g, ''));
  if (!rate || !usd) return null;
  return `NPR ${Math.round((usd * rate) / 100) * 100}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

const text = (p) => `${p.title} ${p.slug || ''} ${p.location || ''}`;
const cat = (p) => p.categories?.name || '';

/** Every home section's list, chosen once from the published packages (already sorted by display order). */
export function homeSections(published, { daySlots, pilgrimageOrder }) {
  const nepal = published.filter(isNepal);
  const used = new Set();
  const take = (p) => { used.add(p.id); return p; };

  const dayTours = daySlots
    .map((slot) => nepal.find((p) => !used.has(p.id) && slot.match.test(text(p))))
    .filter(Boolean).map(take);

  const rank = (p) => { const i = pilgrimageOrder.findIndex((re) => re.test(text(p))); return i < 0 ? 99 : i; };
  const pilgrimage = nepal.filter((p) => /pilgrim|religio/i.test(cat(p))).sort((a, b) => rank(a) - rank(b)).slice(0, 5);
  const wildlife = nepal.filter((p) => /wildlife|safari/i.test(cat(p))).slice(0, 4);

  // Popular tours: featured order, leaving out what the dedicated sections already show.
  const special = new Set([...dayTours, ...pilgrimage, ...wildlife].map((p) => p.id));
  const popularPool = nepal.filter((p) => !special.has(p.id));
  const popular = (popularPool.length >= 5 ? popularPool : nepal).slice(0, 8);

  const holidays = published.filter((p) => !isNepal(p) && p.price).slice(0, 6);
  return { dayTours, pilgrimage, wildlife, popular, holidays, nepal };
}

/** Nepal packages whose best season overlaps a season by at least two months. */
export function toursForSeason(nepal, monthNums, limit = 4) {
  return nepal.filter((p) => {
    const m = monthsOf(p.details?.best_time);
    return monthNums.filter((n) => m.has(n)).length >= 2;
  }).slice(0, limit);
}
