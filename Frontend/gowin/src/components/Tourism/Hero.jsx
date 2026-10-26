import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, MapPin, ArrowRight, ChevronLeft, ChevronRight, Globe, Map as MapIcon, Tag } from 'lucide-react';
import usePlaceStore, { selectPublished, sortPlaces } from '../Store/PlaceStore';
import SmartImage from '../ui/SmartImage';
import { placePath, coverImage, countryFromLocation, isNepal } from '../../lib/format';
import { PLACEHOLDER_IMG } from '../../lib/placeholder';

const AUTO_MS = 7000;

/** Home hero: slides built from featured (real) packages + destination search. */
const Hero = () => {
  const navigate = useNavigate();
  const { places, loaded } = usePlaceStore();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [term, setTerm] = useState('');
  const [open, setOpen] = useState(false);
  const blurTimer = useRef(null);

  const published = useMemo(() => selectPublished(places), [places]);
  const slides = useMemo(() => {
    const featured = sortPlaces(published.filter((p) => p.is_featured && coverImage(p)), 'newest').slice(0, 5);
    if (featured.length >= 2) return featured;
    const nepalFirst = [...published.filter((p) => isNepal(p) && coverImage(p)), ...published.filter((p) => !isNepal(p) && coverImage(p))];
    return nepalFirst.slice(0, 4);
  }, [published]);

  const stats = useMemo(() => {
    const countries = new Set(published.filter((p) => !isNepal(p)).map((p) => countryFromLocation(p.location)).filter(Boolean));
    const categories = new Set(published.map((p) => p.categories?.name).filter(Boolean));
    return [
      { value: published.length, label: 'Tours & packages', icon: MapIcon },
      { value: countries.size + (published.some(isNepal) ? 1 : 0), label: 'Countries', icon: Globe },
      { value: categories.size, label: 'Travel styles', icon: Tag },
    ];
  }, [published]);

  useEffect(() => {
    if (paused || slides.length < 2) return undefined;
    const t = setInterval(() => setActive((a) => (a + 1) % slides.length), AUTO_MS);
    return () => clearInterval(t);
  }, [paused, slides.length]);

  useEffect(() => { if (active >= slides.length) setActive(0); }, [slides.length, active]);

  const suggestions = useMemo(() => {
    const q = term.trim().toLowerCase();
    if (!q) return published.slice(0, 6);
    return published.filter((p) => p.title?.toLowerCase().includes(q) || p.location?.toLowerCase().includes(q) || p.categories?.name?.toLowerCase().includes(q)).slice(0, 6);
  }, [term, published]);

  const slide = slides[active];
  const go = (p) => { navigate(placePath(p)); setTerm(''); setOpen(false); };
  const submit = (e) => {
    e.preventDefault();
    if (term.trim() && suggestions.length) go(suggestions[0]);
    else navigate(term.trim() ? `/destinations?q=${encodeURIComponent(term.trim())}` : '/destinations');
  };

  return (
    <section className="relative min-h-[88vh] sm:min-h-screen flex flex-col overflow-hidden bg-[#0B1220]" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      {/* Background slides */}
      {slides.length === 0 ? (
        <img src={PLACEHOLDER_IMG} alt="" className="absolute inset-0 w-full h-full object-cover opacity-70" />
      ) : slides.map((s, i) => (
        <div key={s.id} className={`absolute inset-0 transition-opacity duration-[900ms] ${i === active ? 'opacity-100' : 'opacity-0'}`} aria-hidden={i !== active}>
          <SmartImage src={coverImage(s)} alt="" priority={i === 0} className={`w-full h-full object-cover ${i === active ? 'animate-kenburns' : ''}`} />
        </div>
      ))}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0B1220]/92 via-[#1E3A8A]/70 to-[#0B1220]/50" />

      <div className="relative z-10 flex-1 flex flex-col justify-center max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-28 pb-20 sm:pb-28">
        <div className="max-w-3xl mx-auto text-center flex flex-col items-center">
          <span key={`b-${active}`} className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-full mb-6 animate-fadeIn">
            <span className="w-2 h-2 bg-[#10B981] rounded-full animate-pulse" />
            <span className="text-white/90 text-[10px] font-bold uppercase tracking-[0.25em]">
              {slide ? `${isNepal(slide) ? 'Nepal' : 'International'}${slide.categories?.name ? ` · ${slide.categories.name}` : ''}` : 'GoWin International Travel & Tourism'}
            </span>
          </span>

          <h1 key={`h-${active}`} className="heading-font text-4xl sm:text-5xl lg:text-[4.25rem] text-white mb-4 drop-shadow-lg animate-slideUp" style={{ lineHeight: 1.08 }}>
            {slide ? slide.title : <>Travel Nepal, <span className="bg-gradient-to-r from-[#34D399] via-[#10B981] to-[#0EA5E9] bg-clip-text text-transparent">see the world</span></>}
          </h1>
          <p key={`p-${active}`} className="text-white/75 text-sm sm:text-base lg:text-lg leading-relaxed max-w-xl mb-8 animate-fadeIn line-clamp-3">
            {slide?.description || 'Nepal tours, international holidays, flights, hotels and visa assistance — planned by a Kathmandu-based team.'}
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
              <button type="submit" className="btn-primary !px-4 !py-2.5 text-sm"><Search className="w-4 h-4" /><span className="hidden sm:inline">Explore</span></button>
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
                            <span className="block text-xs text-gray-400 truncate">{p.location}</span>
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
            {slide ? (
              <Link to={placePath(slide)} className="btn-primary">View this package <ArrowRight className="w-4 h-4" /></Link>
            ) : (
              <Link to="/destinations" className="btn-primary">Explore destinations <ArrowRight className="w-4 h-4" /></Link>
            )}
            <Link to="/booking" className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/25 text-white text-sm font-semibold rounded-[0.875rem] hover:bg-white/20 transition-colors">
              Plan a custom trip
            </Link>
          </div>
        </div>

        {loaded && published.length > 0 && (
          <div className="mt-12 sm:mt-16 w-full max-w-2xl mx-auto grid grid-cols-3 gap-3 sm:gap-4">
            {stats.map((s) => (
              <div key={s.label} className="text-center bg-white/[0.07] backdrop-blur-md border border-white/15 rounded-2xl py-4 px-2">
                <s.icon className="w-4 h-4 text-[#10B981] mx-auto mb-1.5" />
                <div className="text-2xl sm:text-3xl font-black text-white">{s.value}</div>
                <div className="text-[10px] text-white/60 font-bold uppercase tracking-widest mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {slides.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
          <button type="button" onClick={() => setActive((a) => (a - 1 + slides.length) % slides.length)} aria-label="Previous slide" className="w-9 h-9 rounded-full bg-white/10 border border-white/20 text-white flex items-center justify-center hover:bg-[#10B981] hover:border-[#10B981] transition-colors"><ChevronLeft className="w-4 h-4" /></button>
          <div className="flex items-center gap-1.5">
            {slides.map((s, i) => (
              <button key={s.id} type="button" onClick={() => setActive(i)} aria-label={`Show ${s.title}`} aria-current={i === active}
                className={`h-2 rounded-full transition-all ${i === active ? 'w-7 bg-[#10B981]' : 'w-2 bg-white/40 hover:bg-white/70'}`} />
            ))}
          </div>
          <button type="button" onClick={() => setActive((a) => (a + 1) % slides.length)} aria-label="Next slide" className="w-9 h-9 rounded-full bg-white/10 border border-white/20 text-white flex items-center justify-center hover:bg-[#10B981] hover:border-[#10B981] transition-colors"><ChevronRight className="w-4 h-4" /></button>
        </div>
      )}
    </section>
  );
};

export default Hero;
