import React, { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Clock, Check, X as XIcon, ChevronDown, ChevronUp, ArrowRight, Phone, MessageCircle, Globe, Map as MapIcon, Tag, CalendarDays, Camera, ShieldCheck, ChevronRight, Star } from 'lucide-react';
import usePlaceStore, { selectPublished, sortPlaces } from '../Store/PlaceStore';
import useSettingsStore from '../Store/SettingsStore';
import DestinationCard from '../Tourism/DestinationCard';
import SmartImage from '../ui/SmartImage';
import { Skeleton } from '../ui/Skeleton';
import EmptyState from '../ui/EmptyState';
import { useSEO, tripJsonLd } from '../../lib/seo';
import { formatPrice, isNepal, placePath, coverImage, whatsappLink } from '../../lib/format';

const ItineraryDay = ({ day, title, description, defaultOpen }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-gray-100 rounded-xl overflow-hidden">
      <button type="button" onClick={() => setOpen((v) => !v)} aria-expanded={open} className="w-full flex items-center justify-between gap-3 p-4 text-left hover:bg-gray-50 transition-colors">
        <span className="flex items-center gap-3 min-w-0">
          <span className="w-9 h-9 rounded-lg bg-[#1E3A8A] text-white text-xs font-bold flex items-center justify-center flex-shrink-0">D{day}</span>
          <span className="text-sm font-semibold text-[#0F172A] truncate">{title}</span>
        </span>
        {description ? (open ? <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />) : null}
      </button>
      {open && description && <p className="px-4 pb-4 pl-[4.25rem] text-sm text-gray-500 leading-relaxed">{description}</p>}
    </div>
  );
};

const DestinationDetails = () => {
  const { placeId } = useParams();
  const { places, loaded, fetchPlace } = usePlaceStore();
  const { settings } = useSettingsStore();
  const [resolved, setResolved] = useState({ key: null, place: undefined });
  const [activeImg, setActiveImg] = useState(0);

  const fromStore = useMemo(() => places.find((p) => p.slug === placeId || p.id === placeId), [places, placeId]);

  useEffect(() => {
    setActiveImg(0);
    window.scrollTo({ top: 0 });
  }, [placeId]);

  useEffect(() => {
    let cancelled = false;
    if (fromStore) { setResolved({ key: placeId, place: fromStore }); return undefined; }
    if (!loaded) return undefined;
    fetchPlace(placeId).then((p) => { if (!cancelled) setResolved({ key: placeId, place: p || null }); });
    return () => { cancelled = true; };
  }, [placeId, fromStore, loaded, fetchPlace]);

  const place = resolved.key === placeId ? resolved.place : fromStore;
  const visible = place && (place.is_published || places.some((p) => p.id === place.id && !p.is_published) === false);

  const related = useMemo(() => {
    if (!place) return [];
    const pool = selectPublished(places).filter((p) => p.id !== place.id);
    const same = pool.filter((p) => p.category_id && p.category_id === place.category_id);
    const sameType = pool.filter((p) => isNepal(p) === isNepal(place) && !same.includes(p));
    return sortPlaces([...same, ...sameType], 'featured').slice(0, 4);
  }, [places, place]);

  useSEO({
    title: place ? `${place.title}${place.location ? ` – ${place.location}` : ''}` : 'Destination',
    description: place?.description?.slice(0, 160),
    path: place ? placePath(place) : undefined,
    image: coverImage(place) || undefined,
    type: 'article',
    jsonLd: place ? tripJsonLd(place, settings) : undefined,
    noindex: !place,
  });

  if (place === undefined || (!place && !loaded)) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] pt-20">
        <Skeleton className="h-[320px] sm:h-[460px] rounded-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4"><Skeleton className="h-40" /><Skeleton className="h-56" /></div>
          <Skeleton className="h-80" />
        </div>
      </div>
    );
  }

  if (!place || !visible) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] pt-28 pb-16 px-4">
        <div className="max-w-xl mx-auto">
          <EmptyState icon={Globe} title="This destination is not available" text="It may have been removed or unpublished. Browse the current collection or ask us to plan something similar."
            action={<><Link to="/destinations" className="btn-secondary text-sm">Browse destinations</Link><Link to="/booking" className="btn-primary text-sm">Request a custom trip</Link></>} />
        </div>
      </div>
    );
  }

  const gallery = place.gallery?.length ? place.gallery : [{ url: null, alt_text: '', credit: '', source_url: '' }];
  const active = gallery[activeImg] || gallery[0];
  const credits = [...new Set(gallery.map((g) => g.credit).filter(Boolean))];
  const creditLine = credits.length ? credits.join('; ') : place.image_credit;
  const price = formatPrice(place.price);
  const d = place.details;
  const nepal = isNepal(place);
  const wa = whatsappLink(settings.whatsapp || settings.phone, `Hello GoWin Travels, I'm interested in "${place.title}". Could you send me details and a quote?`);
  const bookingLink = `/booking?package=${encodeURIComponent(place.slug || place.id)}`;
  const hasItinerary = d?.itinerary?.length > 0;

  return (
    <article className="bg-[#F8FAFC] min-h-screen">
      {/* Gallery hero */}
      <div className="relative h-[320px] sm:h-[420px] lg:h-[520px] bg-[#0F172A] overflow-hidden">
        <SmartImage key={active.url || 'placeholder'} src={active.url} alt={active.alt_text || place.title} priority className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1220]/90 via-[#0B1220]/25 to-[#0B1220]/20" />
        {active.credit && (
          <span className="absolute bottom-1.5 right-3 sm:right-6 max-w-[55%] inline-flex items-center gap-1 text-[10px] text-white/70">
            <Camera className="w-3 h-3 flex-shrink-0" />
            {active.source_url ? <a href={active.source_url} target="_blank" rel="noopener noreferrer" className="truncate hover:text-white">{active.credit}</a> : <span className="truncate">{active.credit}</span>}
          </span>
        )}
        <div className="absolute inset-x-0 bottom-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6 sm:pb-8">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[11px] text-white/60 mb-3 flex-wrap">
            <Link to="/" className="hover:text-white">Home</Link><ChevronRight className="w-3 h-3 text-white/30" />
            <Link to={nepal ? '/destinations/national' : '/destinations/international'} className="hover:text-white">{nepal ? 'Nepal' : 'International'}</Link>
            {place.categories?.name && <><ChevronRight className="w-3 h-3 text-white/30" /><Link to={`/destinations?category=${encodeURIComponent(place.categories.slug || place.categories.name)}`} className="hover:text-white">{place.categories.name}</Link></>}
          </nav>
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1 bg-white/15 backdrop-blur border border-white/20 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">{nepal ? <MapIcon className="w-3 h-3 text-[#34D399]" /> : <Globe className="w-3 h-3 text-[#34D399]" />}{nepal ? 'Nepal' : 'International'}</span>
            {place.categories?.name && <span className="inline-flex items-center gap-1 bg-white/15 backdrop-blur border border-white/20 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"><Tag className="w-3 h-3 text-[#34D399]" />{place.categories.name}</span>}
            {place.is_featured && <span className="inline-flex items-center gap-1 bg-[#FBBF24] text-[#0F172A] text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"><Star className="w-3 h-3 fill-current" />Featured</span>}
          </div>
          <h1 className="heading-font text-3xl sm:text-4xl lg:text-5xl text-white max-w-3xl">{place.title}</h1>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 mt-3 text-white/80 text-sm">
            {place.location && <span className="inline-flex items-center gap-1.5"><MapPin className="w-4 h-4 text-[#34D399]" />{place.location}</span>}
            {place.duration && <span className="inline-flex items-center gap-1.5"><Clock className="w-4 h-4 text-[#34D399]" />{place.duration}</span>}
            {d?.best_time && <span className="inline-flex items-center gap-1.5"><CalendarDays className="w-4 h-4 text-[#34D399]" />Best time: {d.best_time}</span>}
          </div>
        </div>
        {gallery.length > 1 && (
          <div className="absolute top-20 sm:top-24 right-4 sm:right-6 flex flex-col gap-2 max-h-[60%] overflow-y-auto no-scrollbar" role="tablist" aria-label="Photos">
            {gallery.map((g, i) => (
              <button key={`${g.url}-${i}`} type="button" role="tab" aria-selected={i === activeImg} aria-label={g.alt_text || `Photo ${i + 1}`} title={g.alt_text || undefined} onClick={() => setActiveImg(i)}
                className={`w-14 h-11 sm:w-16 sm:h-12 rounded-lg overflow-hidden border-2 transition-all ${i === activeImg ? 'border-[#10B981] opacity-100' : 'border-white/40 opacity-70 hover:opacity-100'}`}>
                <SmartImage src={g.url} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex flex-col lg:flex-row gap-8">
        <div className="flex-1 min-w-0 space-y-6">
          <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-7">
            <h2 className="text-lg font-bold text-[#0F172A] mb-3">About this {nepal ? 'experience' : 'holiday'}</h2>
            {place.description ? <p className="text-gray-600 text-sm sm:text-base leading-relaxed whitespace-pre-line">{place.description}</p> : <p className="text-gray-400 text-sm">Full description coming soon — contact us for details.</p>}
            {creditLine && <p className="mt-4 text-[11px] text-gray-400 flex items-center gap-1"><Camera className="w-3 h-3" /> Photo{credits.length > 1 ? 's' : ''}: {creditLine}</p>}
          </section>

          {d?.highlights?.length > 0 && (
            <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-7">
              <h2 className="text-lg font-bold text-[#0F172A] mb-4">Highlights</h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {d.highlights.map((h) => <li key={h} className="flex items-start gap-2.5 p-3 rounded-xl bg-[#F8FAFC] border border-gray-100 text-sm text-[#0F172A]"><Star className="w-4 h-4 text-[#FBBF24] fill-[#FBBF24] flex-shrink-0 mt-0.5" />{h}</li>)}
              </ul>
            </section>
          )}

          {(d?.inclusions?.length > 0 || d?.exclusions?.length > 0) && (
            <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {d.inclusions?.length > 0 && (
                <div><h2 className="text-lg font-bold text-[#0F172A] mb-3">What's included</h2>
                  <ul className="space-y-2">{d.inclusions.map((x) => <li key={x} className="flex items-start gap-2 text-sm text-gray-600"><span className="w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0 mt-0.5"><Check className="w-3 h-3 text-emerald-600" /></span>{x}</li>)}</ul></div>
              )}
              {d.exclusions?.length > 0 && (
                <div><h2 className="text-lg font-bold text-[#0F172A] mb-3">Not included</h2>
                  <ul className="space-y-2">{d.exclusions.map((x) => <li key={x} className="flex items-start gap-2 text-sm text-gray-600"><span className="w-5 h-5 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0 mt-0.5"><XIcon className="w-3 h-3 text-red-500" /></span>{x}</li>)}</ul></div>
              )}
            </section>
          )}

          <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-7">
            <h2 className="text-lg font-bold text-[#0F172A] mb-4">Itinerary</h2>
            {hasItinerary ? (
              <div className="space-y-2">{d.itinerary.map((item, i) => <ItineraryDay key={i} day={item.day || i + 1} title={item.title} description={item.description || item.desc} defaultOpen={i === 0} />)}</div>
            ) : (
              <div className="rounded-xl bg-[#F8FAFC] border border-dashed border-gray-200 p-5 text-sm text-gray-500">
                A detailed day-by-day plan is prepared for your dates and group when you enquire — every itinerary can be customised.
                <Link to={bookingLink} className="block mt-2 text-[#10B981] font-bold">Request the itinerary →</Link>
              </div>
            )}
          </section>
        </div>

        <aside className="lg:w-[340px] flex-shrink-0">
          <div className="lg:sticky lg:top-24 space-y-4">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="bg-[#1E3A8A] p-5 text-white">
                {price ? (
                  <>
                    <p className="text-white/60 text-xs font-semibold uppercase tracking-wider">Indicative price from</p>
                    <p className="mt-1 flex items-baseline gap-1"><span className="text-3xl sm:text-4xl font-black">{price}</span><span className="text-white/60 text-xs">/ person</span></p>
                  </>
                ) : (
                  <><p className="text-white/60 text-xs font-semibold uppercase tracking-wider">Pricing</p><p className="text-2xl font-black mt-1">On request</p></>
                )}
                {place.duration && <p className="text-white/70 text-xs mt-2 inline-flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{place.duration}</p>}
              </div>
              <div className="p-5 space-y-3">
                <Link to={bookingLink} className="btn-primary w-full justify-center !py-3.5">Request this package <ArrowRight className="w-4 h-4" /></Link>
                {wa && <a href={wa} target="_blank" rel="noopener noreferrer" className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl border border-[#25D366]/40 text-[#128C7E] text-sm font-semibold hover:bg-[#25D366]/10 transition-colors"><MessageCircle className="w-4 h-4" /> Chat on WhatsApp</a>}
                {settings.phone && <a href={`tel:${settings.phone.replace(/\s+/g, '')}`} className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl border border-gray-200 text-[#1E3A8A] text-sm font-semibold hover:bg-gray-50 transition-colors"><Phone className="w-4 h-4" /> {settings.phone}</a>}
                <p className="text-[11px] text-gray-400 flex items-start gap-1.5 pt-1"><ShieldCheck className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" /> No payment is taken online. We confirm availability and send a written quote with inclusions first.</p>
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-sm space-y-2.5">
              <h3 className="font-bold text-[#0F172A]">At a glance</h3>
              <p className="flex justify-between gap-3 text-gray-600"><span>Region</span><span className="font-semibold text-[#0F172A]">{nepal ? 'Nepal' : 'International'}</span></p>
              {place.categories?.name && <p className="flex justify-between gap-3 text-gray-600"><span>Type</span><span className="font-semibold text-[#0F172A]">{place.categories.name}</span></p>}
              {place.location && <p className="flex justify-between gap-3 text-gray-600"><span>Location</span><span className="font-semibold text-[#0F172A] text-right">{place.location}</span></p>}
              {place.duration && <p className="flex justify-between gap-3 text-gray-600"><span>Duration</span><span className="font-semibold text-[#0F172A]">{place.duration}</span></p>}
              {d?.best_time && <p className="flex justify-between gap-3 text-gray-600"><span>Best time</span><span className="font-semibold text-[#0F172A] text-right">{d.best_time}</span></p>}
              <p className="flex justify-between gap-3 text-gray-600"><span>Customisable</span><span className="font-semibold text-[#0F172A]">Yes</span></p>
            </div>
          </div>
        </aside>
      </div>

      {related.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 sm:pb-20">
          <div className="flex items-end justify-between gap-4 mb-6">
            <h2 className="heading-font text-2xl sm:text-3xl text-[#0F172A]">You may also like</h2>
            <Link to={nepal ? '/destinations/national' : '/destinations/international'} className="text-xs font-bold uppercase tracking-wider text-[#1E3A8A] hover:text-[#10B981] inline-flex items-center gap-1">View all <ArrowRight className="w-3.5 h-3.5" /></Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {related.map((p, i) => <DestinationCard key={p.id} dest={p} index={i} />)}
          </div>
        </section>
      )}
    </article>
  );
};

export default DestinationDetails;
