import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { Search, Globe, Map as MapIcon, SlidersHorizontal, X, Compass } from 'lucide-react';
import usePlaceStore, { selectPublished, sortPlaces } from '../Store/PlaceStore';
import useCategoryStore, { selectActive } from '../Store/CategoryStore';
import DestinationCard from './DestinationCard';
import PageHero from '../ui/PageHero';
import EmptyState from '../ui/EmptyState';
import { CardSkeleton } from '../ui/Skeleton';
import { Select } from '../ui/FormField';
import { useSEO } from '../../lib/seo';
import { useHeroImage } from '../../lib/useHeroImage';
import { countryFromLocation, isNepal } from '../../lib/format';

const PAGE = 12;
const SORTS = [['featured', 'Featured first'], ['newest', 'Newest'], ['price-asc', 'Price: low to high'], ['price-desc', 'Price: high to low'], ['title', 'A – Z']];

const TYPE_META = {
  all: { title: 'All destinations', subtitle: 'Every tour and holiday package we currently offer, in Nepal and abroad.', label: 'Destinations' },
  national: { title: 'Nepal tours & experiences', subtitle: 'Heritage cities, pilgrimages, wildlife safaris, lakes and scenic escapes across Nepal.', label: 'Nepal collection' },
  international: { title: 'International holidays', subtitle: 'Beaches, cities, honeymoons and family holidays — flights, hotels and visas arranged alongside.', label: 'World collection' },
};

const AllDestinations = () => {
  const { type: typeParam } = useParams();
  const type = ['national', 'international'].includes(typeParam) ? typeParam : 'all';
  const [params, setParams] = useSearchParams();
  const { places, loaded, error } = usePlaceStore();
  const { categories } = useCategoryStore();
  const [visible, setVisible] = useState(PAGE);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const category = params.get('category') || '';
  const country = params.get('country') || '';
  const q = params.get('q') || '';
  const sort = params.get('sort') || 'featured';

  const setParam = (key, value) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value); else next.delete(key);
    setParams(next, { replace: true });
  };

  useEffect(() => { setVisible(PAGE); }, [type, category, country, q, sort]);

  const published = useMemo(() => selectPublished(places), [places]);
  const scoped = useMemo(() => published.filter((p) => type === 'all' || (type === 'national' ? isNepal(p) : !isNepal(p))), [published, type]);

  const categoryOptions = useMemo(() => {
    const ids = new Set(scoped.map((p) => p.category_id));
    return selectActive(categories).filter((c) => ids.has(c.id)).map((c) => ({ ...c, count: scoped.filter((p) => p.category_id === c.id).length }));
  }, [categories, scoped]);

  const countryOptions = useMemo(() => {
    if (type === 'national') return [];
    const map = new Map();
    for (const p of scoped) { if (isNepal(p)) continue; const c = countryFromLocation(p.location); if (c) map.set(c, (map.get(c) || 0) + 1); }
    return [...map.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  }, [scoped, type]);

  const results = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const list = scoped.filter((p) => {
      if (category && p.categories?.slug !== category && p.categories?.name !== category) return false;
      if (country && countryFromLocation(p.location) !== country) return false;
      if (needle && !(p.title?.toLowerCase().includes(needle) || p.location?.toLowerCase().includes(needle) || p.description?.toLowerCase().includes(needle) || p.categories?.name?.toLowerCase().includes(needle))) return false;
      return true;
    });
    return sortPlaces(list, sort);
  }, [scoped, category, country, q, sort]);

  const meta = TYPE_META[type];
  const activeCategory = categoryOptions.find((c) => c.slug === category || c.name === category);
  const heroImage = useHeroImage(type === 'international' ? /santorini|maldives|bali/i : /pokhara|kathmandu/i);
  useSEO({
    title: activeCategory ? `${activeCategory.name} – ${meta.title}` : country ? `${country} holidays` : meta.title,
    description: meta.subtitle,
    path: `/destinations${type === 'all' ? '' : `/${type}`}`,
    image: heroImage || undefined,
  });

  const activeFilters = [category && { key: 'category', label: activeCategory?.name || category }, country && { key: 'country', label: country }, q && { key: 'q', label: `“${q}”` }].filter(Boolean);

  const Filters = () => (
    <div className="space-y-6">
      <div>
        <label htmlFor="dest-search" className="sr-only">Search</label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input id="dest-search" type="search" value={q} onChange={(e) => setParam('q', e.target.value)} placeholder="Search destinations…"
            className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#10B981]/25" />
        </div>
      </div>
      <div>
        <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Region</h4>
        <div className="space-y-1">
          {[['all', 'All', Compass], ['national', 'Nepal', MapIcon], ['international', 'International', Globe]].map(([t, label, Icon]) => (
            <Link key={t} to={`/destinations${t === 'all' ? '' : `/${t}`}${q ? `?q=${encodeURIComponent(q)}` : ''}`}
              className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${type === t ? 'bg-[#1E3A8A] text-white' : 'text-gray-600 hover:bg-gray-50 hover:text-[#1E3A8A]'}`}>
              <Icon className="w-3.5 h-3.5" /> {label}
            </Link>
          ))}
        </div>
      </div>
      {categoryOptions.length > 0 && (
        <div>
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Experience</h4>
          <div className="space-y-1">
            <button type="button" onClick={() => setParam('category', '')} className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-semibold text-left ${!category ? 'bg-[#10B981]/10 text-[#047857]' : 'text-gray-600 hover:bg-gray-50'}`}>All experiences</button>
            {categoryOptions.map((c) => (
              <button key={c.id} type="button" onClick={() => setParam('category', c.slug || c.name)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-semibold text-left ${(category === c.slug || category === c.name) ? 'bg-[#10B981]/10 text-[#047857]' : 'text-gray-600 hover:bg-gray-50'}`}>
                <span className="truncate">{c.name}</span><span className="text-[11px] text-gray-400 font-medium ml-2">{c.count}</span>
              </button>
            ))}
          </div>
        </div>
      )}
      {countryOptions.length > 0 && (
        <div>
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Country</h4>
          <Select value={country} onChange={(e) => setParam('country', e.target.value)} className="!py-2.5">
            <option value="">All countries</option>
            {countryOptions.map(([name, count]) => <option key={name} value={name}>{name} ({count})</option>)}
          </Select>
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-white min-h-screen">
      <PageHero title={activeCategory ? `${activeCategory.name} in ${type === 'national' ? 'Nepal' : type === 'international' ? 'the world' : 'Nepal & abroad'}` : country ? `${country} holidays` : meta.title}
        subtitle={activeCategory?.description || meta.subtitle} label={meta.label} image={heroImage} crumbs={[{ label: 'Destinations', to: '/destinations' }, ...(type !== 'all' ? [{ label: type === 'national' ? 'Nepal' : 'International' }] : [])]} size="sm" />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:flex lg:gap-10">
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pr-2"><Filters /></div>
        </aside>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-sm text-gray-500"><span className="font-bold text-[#0F172A]">{results.length}</span> package{results.length === 1 ? '' : 's'}</p>
              {activeFilters.map((f) => (
                <button key={f.key} type="button" onClick={() => setParam(f.key, '')} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#1E3A8A]/8 text-[#1E3A8A] text-xs font-semibold hover:bg-[#1E3A8A]/15">{f.label} <X className="w-3 h-3" /></button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => setFiltersOpen(true)} className="lg:hidden inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-[#1E3A8A]"><SlidersHorizontal className="w-4 h-4" /> Filters</button>
              <label htmlFor="sort" className="sr-only">Sort by</label>
              <Select id="sort" value={sort} onChange={(e) => setParam('sort', e.target.value)} className="!w-auto !py-2 !pr-8 text-xs font-semibold">
                {SORTS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </Select>
            </div>
          </div>

          {error && <p className="mb-6 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">We could not load destinations right now. Please refresh or contact us directly.</p>}

          {!loaded ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5"><CardSkeleton count={6} className="h-[400px]" /></div>
          ) : results.length === 0 ? (
            <EmptyState icon={Search} title="No packages match these filters" text="Try another experience or country, or tell us what you have in mind and we'll put together a custom trip."
              action={<><button type="button" onClick={() => setParams({}, { replace: true })} className="btn-secondary text-sm">Clear filters</button><Link to="/booking" className="btn-primary text-sm">Request a custom trip</Link></>} />
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {results.slice(0, visible).map((p, i) => <DestinationCard key={p.id} dest={p} index={i} variant="grid" priority={i < 3} />)}
              </div>
              {visible < results.length && (
                <div className="text-center mt-10">
                  <button type="button" onClick={() => setVisible((v) => v + PAGE)} className="btn-secondary">Show more ({results.length - visible} remaining)</button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Mobile filter drawer */}
      {filtersOpen && (
        <div className="fixed inset-0 z-[110] lg:hidden" role="dialog" aria-label="Filters">
          <div className="absolute inset-0 bg-[#0F172A]/50" onClick={() => setFiltersOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-[300px] max-w-[85vw] bg-white shadow-2xl p-5 overflow-y-auto">
            <div className="flex items-center justify-between mb-5"><h3 className="font-bold text-[#0F172A]">Filters</h3><button type="button" onClick={() => setFiltersOpen(false)} aria-label="Close filters" className="w-9 h-9 rounded-lg bg-gray-50 flex items-center justify-center"><X className="w-4 h-4" /></button></div>
            <Filters />
            <button type="button" onClick={() => setFiltersOpen(false)} className="btn-primary w-full justify-center mt-6">Show {results.length} results</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllDestinations;
