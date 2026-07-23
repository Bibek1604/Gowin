import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, Globe, Map, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import usePlaceStore from '../Store/PlaceStore';
import { SEED_DESTINATIONS_NEPAL, SEED_DESTINATIONS_INTERNATIONAL } from '../../data/seedData';
import DestinationCard from './DestinationCard';

const PopularDestinations = ({ type = 'International', title, subtitle, bgColor = 'bg-white' }) => {
  const { places, isLoading, fetchPlaces } = usePlaceStore();
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  useEffect(() => {
    if (places.length === 0) fetchPlaces();
  }, [fetchPlaces, places.length]);

  const livePlaces = places.filter(p => (p.destination_type || 'International') === type);
  const seedData = type === 'National' ? SEED_DESTINATIONS_NEPAL : SEED_DESTINATIONS_INTERNATIONAL;
  const displayPlaces = livePlaces.length > 0 ? livePlaces : seedData;

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5);
    }
  };

  useEffect(() => {
    const node = scrollRef.current;
    if (node) {
      node.addEventListener('scroll', checkScroll);
      checkScroll();
      window.addEventListener('resize', checkScroll);
      return () => { node.removeEventListener('scroll', checkScroll); window.removeEventListener('resize', checkScroll); };
    }
  }, [displayPlaces]);

  const scroll = (dir) => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: dir === 'left' ? -300 : 300, behavior: 'smooth' });
  };

  return (
    <section className={`py-12 md:py-16 ${bgColor} relative overflow-hidden`}>
      {type === 'International' && (
        <div className="absolute top-0 right-0 w-72 h-72 bg-[#FF7F50]/4 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-end mb-7 sm:mb-8 gap-4 border-b border-gray-100 pb-5">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#0F4C5C]/5 text-[#0F4C5C] rounded-lg text-[9px] font-black uppercase tracking-widest mb-3 border border-[#0F4C5C]/10">
              {type === 'National' ? <Map className="w-3 h-3 text-[#FF7F50]" /> : <Globe className="w-3 h-3 text-[#FF7F50]" />}
              {type === 'National' ? '🇳🇵 Nepal Collection' : '🌍 International'}
            </div>
            <h2 className="heading-font text-2xl sm:text-3xl md:text-4xl text-[#1a1a2e] tracking-tight leading-none">
              {title || type}{' '}
              <span className="text-[#0F4C5C]">Destinations</span>
            </h2>
            {subtitle && <p className="text-gray-500 text-xs sm:text-sm mt-2 max-w-md leading-relaxed">{subtitle}</p>}
          </div>

          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <div className="flex items-center gap-1.5">
              {[['left', canScrollLeft], ['right', canScrollRight]].map(([dir, enabled]) => (
                <button
                  key={dir}
                  onClick={() => scroll(dir)}
                  disabled={!enabled}
                  className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center transition-all border ${
                    enabled
                      ? 'bg-white border-gray-100 text-[#0F4C5C] shadow-sm hover:bg-[#0F4C5C] hover:text-white hover:border-[#0F4C5C]'
                      : 'bg-gray-50 text-gray-200 cursor-not-allowed border-gray-50'
                  }`}
                >
                  {dir === 'left' ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </button>
              ))}
            </div>
            <Link
              to={`/destinations/${type.toLowerCase()}`}
              className="group flex items-center gap-1.5 sm:gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-white border border-[#0F4C5C]/10 text-[#0F4C5C] rounded-xl font-bold text-[9px] sm:text-[10px] uppercase tracking-widest hover:bg-[#0F4C5C] hover:text-white transition-all shadow-sm"
            >
              View All <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Carousel */}
        <div
          ref={scrollRef}
          className="flex gap-4 sm:gap-5 overflow-x-auto snap-x snap-mandatory pb-6 -mx-4 sm:mx-0 px-4 sm:px-0"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {isLoading ? (
            [1, 2, 3, 4].map(i => (
              <div key={i} className="min-w-[240px] sm:min-w-[272px] h-[360px] sm:h-[400px] bg-gradient-to-br from-gray-50 to-gray-100 rounded-[26px] animate-pulse flex-shrink-0" />
            ))
          ) : (
            displayPlaces.map((dest, idx) => (
              <DestinationCard key={dest.id} dest={dest} index={idx} variant="carousel" />
            ))
          )}
        </div>

        {displayPlaces.length > 2 && (
          <p className="sm:hidden text-center text-[10px] text-gray-400 font-medium mt-1">
            ← Swipe to explore more →
          </p>
        )}
      </div>
    </section>
  );
};

export default PopularDestinations;
