import React, { useState, useEffect } from 'react';
import { Search, MapPin, Navigation, ArrowRight, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import usePlaceStore from '../Store/PlaceStore';

const Hero = () => {
  const navigate = useNavigate();
  const { places, fetchPlaces } = usePlaceStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    fetchPlaces();
  }, [fetchPlaces]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim().length > 0) {
      const filtered = places.filter(place =>
        place.title.toLowerCase().includes(value.toLowerCase()) ||
        place.location.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 5);
      setSuggestions(filtered);
      setShowDropdown(true);
    } else {
      setSuggestions([]);
      setShowDropdown(true); // Still show available ones on focus
    }
  };

  const selectPlace = (id) => {
    navigate(`/places/${id}`);
    setSearchTerm('');
    setShowDropdown(false);
  };

  const handleExplore = () => {
    // Search button takes you to the gallery with all options
    navigate('/details/all');
  };

  return (
    <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-white">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[#0F4C5C]/35 opacity-70 z-10"></div>
        <img
          src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
          alt="Beautiful destination"
          className="w-full h-full object-cover rounded-b-[4rem] opacity-90 shadow-2xl"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mt-12">
        <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-white drop-shadow-2xl mb-8 leading-[0.9]">
          Discover <span className="text-[#FF7F50]">Amazing</span> <br /> Global Voyages.
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-xl text-white/95 font-medium drop-shadow-md pb-16">
          Elite curated experiences designed for the world's most discerning travelers. Explore our collection.
        </p>

        {/* Professional Search Bar - Dynamically shows destinations */}
        <div className="mt-10 max-w-4xl mx-auto relative px-4 text-left">
          <div className="bg-white rounded-[2.5rem] p-4 md:p-6 shadow-[0_40px_100px_rgba(0,0,0,0.15)] flex flex-col md:flex-row gap-4 items-center justify-between border border-gray-100">
            <div 
              className="flex-1 w-full flex items-center bg-gray-50 px-6 py-4 rounded-2xl border border-gray-100 focus-within:ring-4 focus-within:ring-[#0F4C5C]/5 transition-all cursor-text"
              onClick={() => document.getElementById('hero-search-input')?.focus()}
            >
              <MapPin className="text-[#0F4C5C] h-6 w-6 mr-4 opacity-50" />
              <input
                id="hero-search-input"
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                onFocus={() => setShowDropdown(true)}
                onBlur={() => setTimeout(() => setShowDropdown(false), 250)}
                placeholder="Where to next?"
                className="bg-transparent w-full focus:outline-none text-[#0F4C5C] placeholder-[#0F4C5C]/30 font-bold text-lg"
              />
            </div>

            <button
              onClick={handleExplore}
              className="w-full md:w-auto bg-[#0F4C5C] hover:bg-[#0a3845] text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-2xl shadow-[#0F4C5C]/20 active:scale-95 text-xs"
            >
              <Search className="h-5 w-5" />
              Check Availability
            </button>
          </div>

          {/* Dynamic Suggestions Dropdown - Names Only */}
          {showDropdown && places.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white/98 backdrop-blur-3xl rounded-[1.5rem] shadow-[0_30px_60px_rgba(0,0,0,0.15)] border border-gray-100 overflow-hidden z-[500] animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="max-h-[320px] overflow-y-auto scrollbar-hide py-2">
                {(searchTerm ? suggestions : places.slice(0, 8)).map((place, index) => (
                  <button
                    key={place.id}
                    onClick={() => selectPlace(place.id)}
                    className="w-full relative group px-8 py-3.5 transition-all duration-300 text-left hover:bg-gray-50 border-b border-gray-50 last:border-b-0"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-5">
                        <span className="text-[9px] font-black text-[#0F4C5C]/15 group-hover:text-[#FF7F50] transition-colors">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <h4 className="font-bold text-[#0F4C5C] text-base tracking-tight group-hover:text-[#FF7F50] group-hover:translate-x-1 transition-all duration-300">
                          {place.title}
                        </h4>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-gray-200 opacity-0 group-hover:opacity-100 group-hover:text-[#FF7F50] group-hover:translate-x-1 transition-all" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Hero;
