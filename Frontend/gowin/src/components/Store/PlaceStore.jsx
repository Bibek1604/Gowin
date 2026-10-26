import { create } from 'zustand';
import { supabase } from '../../supabaseClient';
import { slugify } from '../../lib/slugify';
import { clean } from '../../lib/format';

// One query shape everywhere: the package, its category and its detail block.
export const PLACE_SELECT = '*, categories(id,name,slug,is_active), place_details(*)';
// Shape that also works before the 20261026 migrations have been applied.
const LEGACY_SELECT = '*, categories(id,name), place_details(*)';
const NEW_COLUMNS = ['slug', 'is_published', 'is_featured', 'image_credit'];
const missingColumn = (error) => error && (error.code === '42703' || /column .* does not exist/i.test(error.message || ''));
/** Run a query builder with the full select, falling back to the legacy shape. */
async function withFallback(build) {
  let res = await build(PLACE_SELECT);
  if (missingColumn(res.error)) res = await build(LEGACY_SELECT);
  return res;
}
const stripNewColumns = (payload) => Object.fromEntries(Object.entries(payload).filter(([k]) => !NEW_COLUMNS.includes(k)));

const EMPTY_DETAILS = { best_time: '', rating: null, highlights: [], inclusions: [], exclusions: [], itinerary: [] };

/** Normalise a row from PostgREST into the shape the UI expects. */
export function normalizePlace(row) {
  if (!row) return null;
  const rawDetails = Array.isArray(row.place_details) ? row.place_details[0] : row.place_details;
  const details = rawDetails
    ? {
        ...EMPTY_DETAILS,
        ...rawDetails,
        highlights: rawDetails.highlights || [],
        inclusions: rawDetails.inclusions || [],
        exclusions: rawDetails.exclusions || [],
        itinerary: Array.isArray(rawDetails.itinerary) ? rawDetails.itinerary : [],
      }
    : null;
  return {
    ...row,
    images: Array.isArray(row.images) ? row.images.filter((u) => typeof u === 'string' && u.trim()) : [],
    is_published: row.is_published !== false,
    is_featured: row.is_featured === true,
    details,
  };
}

/** Visitors only ever see published packages in active categories. */
export const selectPublished = (places) =>
  places.filter((p) => p.is_published && p.categories?.is_active !== false);

export const sortPlaces = (places, sort = 'newest') => {
  const list = [...places];
  const num = (p) => Number(String(p.price ?? '').replace(/[^0-9.]/g, '')) || Infinity;
  switch (sort) {
    case 'price-asc': return list.sort((a, b) => num(a) - num(b));
    case 'price-desc': return list.sort((a, b) => (num(b) === Infinity ? -1 : num(b)) - (num(a) === Infinity ? -1 : num(a)));
    case 'title': return list.sort((a, b) => a.title.localeCompare(b.title));
    case 'featured': return list.sort((a, b) => Number(b.is_featured) - Number(a.is_featured) || new Date(b.created_at) - new Date(a.created_at));
    default: return list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }
};

/** Build the tour_packages payload from the admin form. */
function packagePayload(form) {
  return {
    title: clean(form.title),
    slug: slugify(form.slug || form.title) || null,
    description: clean(form.description) || null,
    price: clean(form.price) || null,
    location: clean(form.location) || null,
    duration: clean(form.duration) || null,
    category_id: form.category_id || null,
    destination_type: form.destination_type === 'National' ? 'National' : 'International',
    images: (form.images || []).filter(Boolean),
    image_credit: clean(form.image_credit) || null,
    is_published: form.is_published !== false,
    is_featured: form.is_featured === true,
  };
}

function detailsPayload(form, placeId) {
  const d = form.details || {};
  const list = (arr) => (Array.isArray(arr) ? arr.map(clean).filter(Boolean) : []);
  const itinerary = (Array.isArray(d.itinerary) ? d.itinerary : [])
    .map((day, i) => ({ day: Number(day.day) || i + 1, title: clean(day.title), description: clean(day.description || day.desc) }))
    .filter((day) => day.title)
    .sort((a, b) => a.day - b.day);
  return {
    place_id: placeId,
    title: clean(form.title),
    description: clean(form.description) || null,
    best_time: clean(d.best_time) || null,
    rating: d.rating ? Number(d.rating) : null,
    highlights: list(d.highlights),
    inclusions: list(d.inclusions),
    exclusions: list(d.exclusions),
    itinerary,
  };
}

const hasDetailContent = (d) =>
  d.best_time || d.highlights.length || d.inclusions.length || d.exclusions.length || d.itinerary.length;

const usePlaceStore = create((set, get) => ({
  places: [],
  isLoading: false,
  error: null,
  loaded: false,

  fetchPlaces: async () => {
    if (get().isLoading) return;
    set({ isLoading: true, error: null });
    const { data, error } = await withFallback((sel) => supabase.from('tour_packages').select(sel).order('created_at', { ascending: false }));
    if (error) {
      console.error('fetchPlaces:', error.message);
      set({ error: error.message, isLoading: false, loaded: true });
      return;
    }
    set({ places: (data || []).map(normalizePlace), isLoading: false, loaded: true });
  },

  /** Load one package by slug or id (used by detail page when the list is not loaded yet). */
  fetchPlace: async (slugOrId) => {
    const isUuid = /^[0-9a-f-]{36}$/i.test(slugOrId);
    const { data, error } = await withFallback((sel) => supabase.from('tour_packages').select(sel).eq(isUuid ? 'id' : 'slug', slugOrId).maybeSingle());
    if (error) {
      // Slug column missing (pre-migration) — fall back to id only.
      if (!isUuid) return null;
      console.error('fetchPlace:', error.message);
      return null;
    }
    const place = normalizePlace(data);
    if (place) set((s) => ({ places: s.places.some((p) => p.id === place.id) ? s.places.map((p) => (p.id === place.id ? place : p)) : [place, ...s.places] }));
    return place;
  },

  /** Create or update a package plus its detail block. Returns { success, data, error }. */
  savePlace: async (form, id = null) => {
    const payload = packagePayload(form);
    if (!payload.title || payload.title.length < 3) return { success: false, error: 'Title must be at least 3 characters.' };
    if (!payload.category_id) return { success: false, error: 'Choose a category.' };

    const run = (body, sel) => (id
      ? supabase.from('tour_packages').update(body).eq('id', id).select(sel).single()
      : supabase.from('tour_packages').insert(body).select(sel).single());
    let { data, error } = await run(payload, PLACE_SELECT);
    if (missingColumn(error)) ({ data, error } = await run(stripNewColumns(payload), LEGACY_SELECT)); // pre-migration database
    if (error) return { success: false, error };

    // Details block: one row per package. Update if present, insert if needed.
    const details = detailsPayload(form, data.id);
    const existing = Array.isArray(data.place_details) ? data.place_details[0] : data.place_details;
    let detailError = null;
    if (existing) {
      const { error: e } = await supabase.from('place_details').update(details).eq('id', existing.id);
      detailError = e;
    } else if (hasDetailContent(details)) {
      const { error: e } = await supabase.from('place_details').insert(details);
      detailError = e;
    }
    if (detailError) return { success: false, error: detailError };

    // Re-read so the store holds exactly what the database holds.
    const { data: fresh } = await withFallback((sel) => supabase.from('tour_packages').select(sel).eq('id', data.id).single());
    const place = normalizePlace(fresh || data);
    set((s) => ({ places: id ? s.places.map((p) => (p.id === id ? place : p)) : [place, ...s.places] }));
    return { success: true, data: place };
  },

  /** Partial update (publish/feature toggles). */
  patchPlace: async (id, patch) => {
    const { data, error } = await withFallback((sel) => supabase.from('tour_packages').update(patch).eq('id', id).select(sel).single());
    if (error) return { success: false, error };
    const place = normalizePlace(data);
    set((s) => ({ places: s.places.map((p) => (p.id === id ? place : p)) }));
    return { success: true, data: place };
  },

  deletePlace: async (id) => {
    const { error } = await supabase.from('tour_packages').delete().eq('id', id);
    if (error) return { success: false, error };
    set((s) => ({ places: s.places.filter((p) => p.id !== id) }));
    return { success: true };
  },
}));

// Live sync: refetch (debounced) whenever any client changes tour_packages.
let refetchTimer;
supabase
  .channel('tour_packages_realtime')
  .on('postgres_changes', { event: '*', schema: 'public', table: 'tour_packages' }, () => {
    clearTimeout(refetchTimer);
    refetchTimer = setTimeout(() => usePlaceStore.getState().fetchPlaces(), 400);
  })
  .subscribe();

export default usePlaceStore;
