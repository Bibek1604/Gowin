import React, { useState, useEffect } from 'react';
import { Search, MapPin, ArrowRight, Shield, Globe, Users, Award } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import usePlaceStore from '../Store/PlaceStore';

const Hero = () => {
  const navigate = useNavigate();
  const { places, fetchPlaces } = usePlaceStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => { fetchPlaces(); }, [fetchPlaces]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value.trim().length > 0) {
      const filtered = places.filter(p =>
        p.title.toLowerCase().includes(value.toLowerCase()) ||
        p.location.toLowerCase().includes(value.toLowerCase())
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

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-16">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=2070&q=90"
          alt="World Travel"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a1f2b]/95 via-[#0F4C5C]/80 to-[#0F4C5C]/30" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 flex flex-col items-center justify-center text-center">
        <div className="max-w-3xl mx-auto flex flex-col items-center">

          {/* Badge */}
          <div className="inline-flex items-center justify-center gap-2.5 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full mb-8 shadow-sm">
            <span className="w-2 h-2 bg-[#FF7F50] rounded-full animate-pulse shadow-[0_0_8px_rgba(255,127,80,0.8)]" />
            <span className="text-white/90 text-[10px] font-bold uppercase tracking-[0.25em]">Nepal's Premier Agency</span>
          </div>

          {/* Heading */}
          <h1 className="heading-font text-5xl sm:text-6xl lg:text-[4.5rem] text-white mb-6 tracking-tight drop-shadow-md mx-auto" style={{ lineHeight: 1.1 }}>
            Explore the World<br />
            with <span className="text-white/95">GoWin</span> International.
          </h1>

          {/* Subtitle */}
          <p className="text-white/70 text-base md:text-lg font-medium leading-relaxed max-w-xl mb-10 mx-auto">
            Discover breathtaking destinations across the globe. Premium travel experiences crafted for the curious, bold, and adventurous.
          </p>

          {/* Search Bar */}
          <div className="relative w-full max-w-xl mx-auto mb-10 text-left">
            <div className="flex items-center bg-white rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.25)] overflow-visible pl-4 pr-2 py-2 gap-2">
              <MapPin className="text-[#FF7F50] h-5 w-5 flex-shrink-0" />
              <input
                id="hero-search"
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                onFocus={() => setShowDropdown(true)}
                onBlur={() => setTimeout(() => setShowDropdown(false), 250)}
                placeholder="Where do you want to go?"
                className="flex-1 text-sm font-medium text-[#1a1a2e] placeholder-gray-300 bg-transparent focus:outline-none py-2"
              />
              <button
                onClick={() => navigate('/details/all')}
                className="btn-primary"
              >
                <Search className="h-4 w-4" /> Explore
              </button>
            </div>

            {/* Suggestions */}
            {showDropdown && places.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50">
                <div className="max-h-[260px] overflow-y-auto">
                  {(searchTerm ? suggestions : places.slice(0, 6)).map((place, idx) => (
                    <button
                      key={place.id}
                      onClick={() => selectPlace(place.id)}
                      className="w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-gray-50 border-b border-gray-50 last:border-0 transition-colors group"
                    >
                      <div className="w-8 h-8 bg-[#FF7F50]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-3.5 h-3.5 text-[#FF7F50]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[#1a1a2e] truncate group-hover:text-[#FF7F50] transition-colors">{place.title}</p>
                        <p className="text-xs text-gray-400">{place.location}</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-200 group-hover:text-[#FF7F50] transition-colors" />
                    </button>
                  ))}
                </div>
                <div className="px-4 py-2.5 bg-gray-50 border-t border-gray-100 text-center">
                  <button onClick={() => navigate('/details/all')} className="text-xs font-semibold text-[#FF7F50] hover:underline">
                    View all destinations →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Quick search tags */}
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <span className="text-white/50 text-xs uppercase tracking-widest font-bold">Popular:</span>
            {places.slice(0, 4).map((p) => (
              <Link key={p.id} to={`/places/${p.id}`}
                className="text-xs font-medium text-white/90 bg-white/10 backdrop-blur-sm border border-white/20 px-3 py-1.5 rounded-lg hover:bg-white/20 hover:text-white transition-all shadow-sm"
              >
                {p.title}
              </Link>
            ))}
          </div>
        </div>

        {/* Stats strip */}
        <div className="mt-20 md:mt-24 flex flex-wrap justify-center gap-10 md:gap-16 border-t border-white/10 pt-10 w-full max-w-4xl mx-auto">
          {[
            { value: `${places.length || '50'}+`, label: 'Destinations' },
            { value: '100+', label: 'Happy Travelers' },
            { value: '5+ Years', label: 'Experience' },
          ].map((s, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl md:text-4xl font-black text-white px-4">{s.value}</div>
              <div className="text-xs text-white/50 font-bold uppercase tracking-widest mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Wave divider */}
      <div className="absolute left-0 right-0 z-10" style={{ bottom: '-1px' }}>
        <svg viewBox="0 0 1440 70" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full" style={{ display: 'block' }}>
          <path d="M0 70L48 60.8C96 52 192 34 288 29.2C384 25 480 34 576 41.2C672 48 768 53 864 51.3C960 50 1056 42 1152 39.2C1248 36 1344 38 1392 39L1440 40V70H0Z" fill="white" />
        </svg>
      </div>
    </section>
  );
};

export default Hero;
