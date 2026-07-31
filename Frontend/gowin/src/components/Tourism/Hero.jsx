import React, { useState, useEffect, useCallback } from 'react';
import { Search, MapPin, ArrowRight, Globe, Users, TrendingUp, ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import usePlaceStore from '../Store/PlaceStore';
import { HERO_SLIDES } from '../../data/seedData';

const Hero = () => {
  const navigate = useNavigate();
  const { places, fetchPlaces } = usePlaceStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => { fetchPlaces(); }, [fetchPlaces]);

  const goToSlide = useCallback((idx) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveSlide(idx);
      setIsTransitioning(false);
    }, 300);
  }, [isTransitioning]);

  // Auto-advance slides
  useEffect(() => {
    const timer = setInterval(() => {
      goToSlide((activeSlide + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [activeSlide, goToSlide]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value.trim().length > 0) {
      const filtered = places.filter(p =>
        p.title?.toLowerCase().includes(value.toLowerCase()) ||
        p.location?.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 6);
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
    setShowDropdown(true);
  };

  const selectPlace = (id) => {
    navigate(`/places/${id}`);
    setSearchTerm('');
    setShowDropdown(false);
  };

  const slide = HERO_SLIDES[activeSlide];
  const stats = [
    { value: places.length > 0 ? `${places.length}+` : '100+', label: 'Destinations', icon: <Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> },
    { value: '2,500+', label: 'Happy Travelers', icon: <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> },
    { value: '98%', label: 'Satisfaction Rate', icon: <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> },
  ];

  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden pt-16">
      {/* Background slides — only active + neighbours are mounted, so the browser
          doesn't decode every full-size image on first paint */}
      {HERO_SLIDES.map((s, i) => {
        const n = HERO_SLIDES.length;
        const isNear = i === activeSlide || i === (activeSlide + 1) % n || i === (activeSlide - 1 + n) % n;
        if (!isNear) return null;
        return (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-700 ${i === activeSlide ? 'opacity-100' : 'opacity-0'}`}
          >
            <img
              src={s.image}
              alt={s.badge}
              decoding="async"
              fetchPriority={i === activeSlide ? 'high' : 'low'}
              className={`w-full h-full object-cover ${i === activeSlide ? 'animate-kenburns' : ''}`}
            />
          </div>
        );
      })}

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0B1220]/95 via-[#1E3A8A]/80 to-[#0a1820]/55 z-10" />

      {/* Main content */}
      <div className="relative z-20 flex-1 flex flex-col items-center justify-center w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-28">
        <div className="max-w-3xl mx-auto flex flex-col items-center w-full text-center">

          {/* Badge */}
          <div
            key={activeSlide}
            className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 sm:px-5 py-1.5 sm:py-2 rounded-full mb-6 sm:mb-7 animate-fadeIn"
          >
            <span className="w-2 h-2 bg-[#10B981] rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
            <span className="text-white/90 text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] sm:tracking-[0.25em]">
              {slide.badge}
            </span>
          </div>

          {/* Headline */}
          <h1
            key={`h-${activeSlide}`}
            className="heading-font text-4xl sm:text-5xl lg:text-[4.25rem] text-white mb-4 sm:mb-5 tracking-tight drop-shadow-lg animate-slideUp px-2"
            style={{ lineHeight: 1.1 }}
          >
            {slide.headline[0]}<br />
            <span className="bg-gradient-to-r from-[#34D399] via-[#10B981] to-[#0EA5E9] bg-clip-text text-transparent">{slide.headline[1]}</span>
          </h1>

          {/* Subtitle */}
          <p
            key={`s-${activeSlide}`}
            className="text-white/70 text-sm sm:text-base md:text-lg font-medium leading-relaxed max-w-xl mb-8 sm:mb-10 px-2 animate-fadeIn"
          >
            {slide.sub}
          </p>

          {/* Search Bar */}
          <div className="relative w-full max-w-xl mx-auto mb-6 sm:mb-8 text-left">
            <div className="flex items-center bg-white rounded-xl sm:rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.3)] focus-within:shadow-[0_8px_50px_rgba(16,185,129,0.4)] focus-within:ring-2 focus-within:ring-[#10B981]/50 transition-all pl-3 sm:pl-4 pr-2 py-1.5 sm:py-2 gap-2 border border-white/10">
              <MapPin className="text-[#10B981] h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                onFocus={() => setShowDropdown(true)}
                onBlur={() => setTimeout(() => setShowDropdown(false), 250)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    if (suggestions.length > 0) selectPlace(suggestions[0].id);
                    else navigate('/destinations/all');
                  }
                }}
                placeholder="Where do you want to go?"
                className="flex-1 text-xs sm:text-sm font-medium text-[#0F172A] placeholder-gray-400 bg-transparent focus:outline-none py-2 min-w-0"
              />
              <button
                onClick={() => navigate('/destinations/all')}
                className="btn-primary text-xs sm:text-sm px-3 sm:px-5 py-2 sm:py-2.5 flex-shrink-0 rounded-lg sm:rounded-xl"
              >
                <Search className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span>Explore</span>
              </button>
            </div>

            {/* Dropdown */}
            {showDropdown && places.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl sm:rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50">
                <div className="max-h-[220px] sm:max-h-[260px] overflow-y-auto">
                  {(searchTerm ? suggestions : places.slice(0, 6)).map((place) => (
                    <button
                      key={place.id}
                      onClick={() => selectPlace(place.id)}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-left flex items-center gap-3 hover:bg-gray-50 border-b border-gray-50 last:border-0 transition-colors group"
                    >
                      <div className="w-8 h-8 bg-[#10B981]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-3.5 h-3.5 text-[#10B981]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[#0F172A] truncate group-hover:text-[#10B981] transition-colors">{place.title}</p>
                        <p className="text-xs text-gray-400">{place.location}</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-[#10B981] transition-colors flex-shrink-0" />
                    </button>
                  ))}
                </div>
                <div className="px-4 py-2.5 bg-gray-50 border-t border-gray-100 text-center">
                  <button onClick={() => navigate('/destinations/all')} className="text-xs font-semibold text-[#059669] hover:underline">
                    View all destinations →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Quick CTA links */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-center">
            <Link
              to={slide.link}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#10B981] text-white text-xs sm:text-sm font-bold rounded-xl hover:bg-[#059669] transition-all shadow-lg shadow-[#10B981]/30 hover:scale-105"
            >
              {slide.cta} <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              to="/about"
              className="flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-sm border border-white/20 text-white text-xs sm:text-sm font-semibold rounded-xl hover:bg-white/20 transition-all"
            >
              <Play className="w-3.5 h-3.5 fill-white" /> Our Story
            </Link>
          </div>

          {/* Popular tags from DB */}
          {places.length > 0 && (
            <div className="flex items-center justify-center gap-2 flex-wrap mt-5 px-2">
              <span className="text-white/40 text-[9px] sm:text-[10px] uppercase tracking-widest font-bold">Popular:</span>
              {places.slice(0, 4).map((p) => (
                <Link
                  key={p.id}
                  to={`/places/${p.id}`}
                  className="text-[10px] sm:text-xs font-medium text-white/80 bg-white/10 backdrop-blur-sm border border-white/20 px-3 py-1 rounded-lg hover:bg-white/20 hover:text-white transition-all"
                >
                  {p.title}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Stats — glass cards */}
        <div className="mt-12 sm:mt-16 lg:mt-20 w-full max-w-3xl mx-auto grid grid-cols-3 gap-3 sm:gap-5">
          {stats.map((s, i) => (
            <div
              key={i}
              className="text-center bg-white/[0.07] backdrop-blur-md border border-white/15 rounded-2xl py-4 sm:py-6 px-2 hover:bg-white/[0.12] hover:border-[#10B981]/40 hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex items-center justify-center gap-1.5 text-[#10B981] mb-1.5">
                {s.icon}
              </div>
              <div className="text-2xl sm:text-3xl md:text-4xl font-black text-white">{s.value}</div>
              <div className="text-[9px] sm:text-[10px] text-white/60 font-bold uppercase tracking-widest mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Slide controls — right edge, clear of content */}
      <div className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-30 hidden md:flex flex-col items-center gap-3">
        <button
          onClick={() => goToSlide((activeSlide - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)}
          aria-label="Previous slide"
          className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-[#10B981] hover:border-[#10B981] transition-all"
        >
          <ChevronLeft className="w-4 h-4 rotate-90" />
        </button>
        {HERO_SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => goToSlide(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`rounded-full transition-all duration-300 ${i === activeSlide ? 'h-6 w-2 bg-[#10B981] shadow-[0_0_10px_rgba(16,185,129,0.7)]' : 'h-2 w-2 bg-white/30 hover:bg-white/60'}`}
          />
        ))}
        <button
          onClick={() => goToSlide((activeSlide + 1) % HERO_SLIDES.length)}
          aria-label="Next slide"
          className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-[#10B981] hover:border-[#10B981] transition-all"
        >
          <ChevronRight className="w-4 h-4 rotate-90" />
        </button>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 hidden sm:flex flex-col items-center gap-1.5 text-white/50 animate-bounce-slow pointer-events-none">
        <span className="text-[9px] font-bold uppercase tracking-[0.25em]">Scroll</span>
        <div className="w-5 h-8 rounded-full border-2 border-white/30 flex justify-center pt-1.5">
          <div className="w-1 h-2 bg-[#10B981] rounded-full" />
        </div>
      </div>

      {/* Wave divider */}
      <div className="absolute left-0 right-0 z-20" style={{ bottom: '-1px' }}>
        <svg viewBox="0 0 1440 70" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full block">
          <path d="M0 70L48 60.8C96 52 192 34 288 29.2C384 25 480 34 576 41.2C672 48 768 53 864 51.3C960 50 1056 42 1152 39.2C1248 36 1344 38 1392 39L1440 40V70H0Z" fill="white" />
        </svg>
      </div>
    </section>
  );
};

export default Hero;
