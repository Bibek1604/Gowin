import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, MapPin, ArrowRight, ChevronLeft, ChevronRight, Globe, Map as MapIcon, Tag, Camera } from 'lucide-react';
import usePlaceStore, { selectPublished } from '../Store/PlaceStore';
import { HERO_SLIDES } from '../../data/heroSlides';
import { placePath, countryFromLocation, isNepal } from '../../lib/format';

/**
 * Home hero: four bundled, verified destination photographs (src/data/heroSlides.js)
 * rotate behind the search box. Slides never depend on the database, so the
 * first paint is always a real photo; the stats below are computed from live data.
 */
const Hero = () => {
  const navigate = useNavigate();
  const { places, loaded } = usePlaceStore();
  const [active, setActive] = useState(0);
  const [term, setTerm] = useState('');
  const [open, setOpen] = useState(false);
  const blurTimer = useRef(null);
  const slides = HERO_SLIDES;
  const slide = slides[active];

  const published = useMemo(() => selectPublished(places), [places]);

  const stats = useMemo(() => {
    const countries = new Set(published.filter((p) => !isNepal(p)).map((p) => countryFromLocation(p.location)).filter(Boolean));
    const categories = new Set(published.map((p) => p.categories?.name).filter(Boolean));
    return [
      { value: published.length, label: 'Tours & packages', icon: MapIcon },
      { value: countries.size + (published.some(isNepal) ? 1 : 0), label: 'Countries', icon: Globe },
      { value: categories.size, label: 'Travel styles', icon: Tag },
    ];
  }, [published]);

  // Only mount photos that are on screen, were shown already, or come next
  // (after first paint) — not all four full-size images up front.
  const [mounted, setMounted] = useState(() => new Set([0]));
  useEffect(() => {
    const t = setTimeout(() => setMounted((m) => new Set([...m, active, (active + 1) % slides.length])), active === 0 ? 2500 : 0);
    setMounted((m) => (m.has(active) ? m : new Set([...m, active])));
    return () => clearTimeout(t);
  }, [active, slides.length]);

  // No autoplay: auto-rotating photos need a pause control (WCAG 2.2.2) and each
  // new slide counted as a fresh "largest paint". Visitors use the arrows / dots.

  const suggestions = useMemo(() => {
    const q = term.trim().toLowerCase();
    if (!q) return published.slice(0, 6);
    return published.filter((p) => p.title?.toLowerCase().includes(q) || p.location?.toLowerCase().includes(q) || p.categories?.name?.toLowerCase().includes(q)).slice(0, 6);
  }, [term, published]);

  const go = (p) => { navigate(placePath(p)); setTerm(''); setOpen(false); };
  const submit = (e) => {
    e.preventDefault();
    // Enter shows every match on the results page; picking a suggestion opens that package.
    navigate(term.trim() ? `/destinations?q=${encodeURIComponent(term.trim())}` : '/destinations');
  };

  return (
    <section className="relative min-h-[88vh] sm:min-h-screen flex flex-col overflow-hidden bg-[#0B1220]">
      {/* Background photographs */}
      {slides.map((s, i) => (
        <div key={s.id} className={`absolute inset-0 transition-opacity duration-[900ms] ${i === active ? 'opacity-100' : 'opacity-0'}`} aria-hidden={i !== active}>
          {mounted.has(i) && (
            <img
              src={s.image} srcSet={`${s.image.replace(/\.webp$/, '-960.webp')} 960w, ${s.image} 1920w`} sizes="100vw"
              alt={i === active ? s.alt : ''} width="1920" height="1080"
              loading={i === 0 ? 'eager' : 'lazy'} fetchPriority={i === 0 ? 'high' : 'low'} decoding={i === 0 ? 'sync' : 'async'}
              className={`w-full h-full object-cover ${i === active ? 'animate-kenburns' : ''}`}
            />
          )}
        </div>
      ))}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0B1220]/90 via-[#1E3A8A]/60 to-[#0B1220]/45" />

      <div className="relative z-10 flex-1 flex flex-col justify-center max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-28 pb-24 sm:pb-28">
        <div className="max-w-3xl mx-auto text-center flex flex-col items-center">
          <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-full mb-6">
            <span className="w-2 h-2 bg-[#10B981] rounded-full" aria-hidden="true" />
            <span className="text-white/90 text-[11px] font-bold uppercase tracking-[0.2em]">Travel company · Kathmandu, Nepal</span>
          </span>

          {/* Stable H1: says what GoWin does, whichever photo is showing. */}
          <h1 className="heading-font text-[2.1rem] sm:text-5xl lg:text-[4rem] text-white mb-4 drop-shadow-lg" style={{ lineHeight: 1.08 }}>
            Nepal tours &amp; world holidays, <span className="text-[#34D399]">planned in Kathmandu</span>
          </h1>
          <p className="text-white/85 text-[0.95rem] sm:text-base lg:text-lg leading-relaxed max-w-xl mb-8">
            Heritage tours, wildlife safaris, pilgrimages and lakeside escapes across Nepal, plus international holidays, flights, hotels and visa help. Tell us your dates and we reply with a written quote.
          </p>

          {/* Search */}
          <form onSubmit={submit} className="relative w-full max-w-xl mb-6 text-left" role="search">
            <label htmlFor="hero-search" className="sr-only">Search destinations</label>
            <div className="flex items-center bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.35)] pl-4 pr-2 py-2 gap-2 focus-within:ring-2 focus-within:ring-[#10B981]/60">
              <MapPin className="w-5 h-5 text-[#10B981] flex-shrink-0" />
              <input
                id="hero-search" type="text" value={term} autoComplete="off"
                onChange={(e) => { setTerm(e.target.value); setOpen(true); }}
                onFocus={() => { clearTimeout(blurTimer.current); setOpen(true); }}
                onBlur={() => { blurTimer.current = setTimeout(() => setOpen(false), 200); }}
                placeholder="Where would you like to go?"
                className="flex-1 min-w-0 text-sm font-medium text-[#0F172A] placeholder-gray-400 bg-transparent focus:outline-none py-2"
              />
              <button type="submit" aria-label="Search destinations" className="btn-primary !px-4 !py-2.5 text-sm"><Search className="w-4 h-4" aria-hidden="true" /><span className="hidden sm:inline">Search</span></button>
            </div>
            {open && loaded && (
              <div className="absolute top-full inset-x-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50">
                {suggestions.length ? (
                  <ul className="max-h-[260px] overflow-y-auto">
                    {suggestions.map((p) => (
                      <li key={p.id}>
                        <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => go(p)} className="w-full px-4 py-2.5 text-left flex items-center gap-3 hover:bg-gray-50 border-b border-gray-50 last:border-0 group">
                          <span className="w-8 h-8 rounded-lg bg-[#10B981]/10 flex items-center justify-center flex-shrink-0"><MapPin className="w-3.5 h-3.5 text-[#10B981]" /></span>
                          <span className="min-w-0 flex-1">
                            <span className="block text-sm font-semibold text-[#0F172A] truncate group-hover:text-[#1E3A8A]">{p.title}</span>
                            <span className="block text-xs text-gray-500 truncate">{p.location}</span>
                          </span>
                          <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-[#10B981]" />
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="px-4 py-4 text-sm text-gray-500">No matches. <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => navigate('/booking')} className="text-[#10B981] font-semibold">Request a custom trip</button></p>
                )}
                <Link to="/destinations" onMouseDown={(e) => e.preventDefault()} className="block px-4 py-2.5 bg-gray-50 border-t border-gray-100 text-center text-xs font-bold text-[#059669] hover:underline">Browse all destinations</Link>
              </div>
            )}
          </form>

          <div className="flex items-center gap-3 flex-wrap justify-center">
            <Link to="/destinations" className="btn-primary">Browse tours <ArrowRight className="w-4 h-4" /></Link>
            <Link to="/booking" className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/25 text-white text-sm font-semibold rounded-[0.875rem] hover:bg-white/20 transition-colors">
              Plan a custom trip
            </Link>
          </div>
        </div>

        {/* Always rendered (values fill in when data arrives) so the hero never jumps. */}
        {!(loaded && published.length === 0) && (
          <div className="mt-12 sm:mt-16 w-full max-w-2xl mx-auto grid grid-cols-3 gap-3 sm:gap-4" aria-busy={!loaded}>
            {stats.map((s) => (
              <div key={s.label} className="text-center bg-white/[0.07] backdrop-blur-md border border-white/15 rounded-2xl py-4 px-2">
                <s.icon className="w-4 h-4 text-[#10B981] mx-auto mb-1.5" aria-hidden="true" />
                <div className="text-2xl sm:text-3xl font-black text-white tabular-nums">{loaded ? s.value : '–'}</div>
                <div className="text-[10px] text-white/60 font-bold uppercase tracking-widest mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Slide controls */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
        <button type="button" onClick={() => setActive((a) => (a - 1 + slides.length) % slides.length)} aria-label="Previous photo" className="w-11 h-11 rounded-full bg-white/10 border border-white/20 text-white flex items-center justify-center hover:bg-[#10B981] hover:border-[#10B981] transition-colors"><ChevronLeft className="w-4 h-4" /></button>
        <div className="flex items-center gap-1.5">
          {slides.map((s, i) => (
            <button key={s.id} type="button" onClick={() => setActive(i)} aria-label={`Show photo: ${s.title}`} aria-current={i === active}
              className="h-6 min-w-6 px-1 flex items-center justify-center group">
              <span className={`block h-2 rounded-full transition-all ${i === active ? 'w-7 bg-[#10B981]' : 'w-2 bg-white/40 group-hover:bg-white/70'}`} />
            </button>
          ))}
        </div>
        <button type="button" onClick={() => setActive((a) => (a + 1) % slides.length)} aria-label="Next photo" className="w-11 h-11 rounded-full bg-white/10 border border-white/20 text-white flex items-center justify-center hover:bg-[#10B981] hover:border-[#10B981] transition-colors"><ChevronRight className="w-4 h-4" /></button>
      </div>

      {/* What the photo shows → its tour, plus the credit (required for Creative Commons photographs) */}
      <div className="hidden sm:block absolute bottom-6 left-6 z-20 max-w-xs">
        <Link key={`cap-${active}`} to={slide.to} className="group block animate-fadeIn">
          <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#34D399]">{slide.kicker}</span>
          <span className="block text-sm font-semibold text-white group-hover:underline">{slide.title} <ArrowRight className="inline w-3.5 h-3.5" aria-hidden="true" /></span>
        </Link>
      </div>
      <p className="absolute bottom-1.5 right-3 sm:right-5 z-20 flex items-center gap-1 text-[10px] text-white/55 max-w-[60%] truncate">
        <Camera className="w-3 h-3 flex-shrink-0" aria-hidden="true" /> <span className="truncate">{slide.credit}</span>
      </p>
    </section>
  );
};

export default Hero;
