import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Star, ArrowRight, Globe, Map, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import usePlaceStore from '../Store/PlaceStore';

const PopularDestinations = ({ type = 'International', title, subtitle, bgColor = 'bg-white' }) => {
  const { places, isLoading, fetchPlaces } = usePlaceStore();
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  useEffect(() => { 
    if (places.length === 0) fetchPlaces(); 
  }, [fetchPlaces, places.length]);

  const filteredPlaces = places.filter(p => {
    const pType = p.destination_type || 'International';
    return pType === type;
  });

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
      return () => {
        node.removeEventListener('scroll', checkScroll);
        window.removeEventListener('resize', checkScroll);
      };
    }
  }, [filteredPlaces]);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current;
      const scrollAmount = direction === 'left' ? -320 : 320;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (!isLoading && filteredPlaces.length === 0) return null;

  return (
    <section className={`py-12 md:py-16 ${bgColor} relative`}>
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        
        {/* Premium Header */}
        <div className="flex justify-between items-end mb-8 gap-4 border-b border-gray-100 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#0F4C5C]/5 text-[#0F4C5C] rounded-lg text-[9px] font-black uppercase tracking-widest mb-3 border border-[#0F4C5C]/10">
              {type === 'National' ? <Map className="w-3 h-3 text-[#FF7F50]" /> : <Globe className="w-3 h-3 text-[#FF7F50]" />}
              {type === 'National' ? 'Local Stays' : 'World Destinations'}
            </div>
            <h2 className="heading-font text-3xl md:text-4xl text-[#1a1a2e] tracking-tight leading-none uppercase italic">
               {title || `${type}`} <span className="font-normal opacity-20">/</span> <span className="text-[#0F4C5C]">Collection</span>
            </h2>
          </div>
          
          <div className="flex items-center gap-3">
             <div className="hidden sm:flex items-center gap-2 mr-2">
                <button onClick={() => scroll('left')} disabled={!canScrollLeft} className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all border ${canScrollLeft ? 'bg-white border-gray-100 text-[#0F4C5C] shadow-sm hover:bg-[#0F4C5C] hover:text-white' : 'bg-gray-50 text-gray-200 cursor-not-allowed'}`}><ChevronLeft className="w-4 h-4" /></button>
                <button onClick={() => scroll('right')} disabled={!canScrollRight} className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all border ${canScrollRight ? 'bg-white border-gray-100 text-[#0F4C5C] shadow-sm hover:bg-[#0F4C5C] hover:text-white' : 'bg-gray-50 text-gray-200 cursor-not-allowed'}`}><ChevronRight className="w-4 h-4" /></button>
             </div>
             <Link to={`/destinations/${type.toLowerCase()}`} className="group flex items-center gap-2 px-5 py-2.5 bg-white border border-[#0F4C5C]/10 text-[#0F4C5C] rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-[#0F4C5C] hover:text-white transition-all shadow-sm">
                View More <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
             </Link>
          </div>
        </div>

        {/* High-Quality OYO Style Carousel */}
        <div 
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory pt-2 pb-8"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {isLoading ? (
            [1,2,3,4].map(i => <div key={i} className="min-w-[260px] h-[360px] bg-gray-50 rounded-2xl animate-pulse" />)
          ) : (
            filteredPlaces.map((dest, idx) => (
              <motion.div
                key={dest.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="min-w-[250px] w-[250px] snap-start"
              >
                <Link to={`/places/${dest.id}`} className="group relative bg-white rounded-2xl overflow-hidden block h-[350px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(15,76,92,0.15)] transition-all duration-500 hover:-translate-y-2 border border-gray-100 flex flex-col">
                  {/* Image Area */}
                  <div className="h-[200px] w-full overflow-hidden relative shrink-0">
                    <img src={dest.images?.[0] || 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=500&q=80'} alt={dest.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1.2s]" />
                    
                    {/* Badge */}
                    <div className="absolute top-3 left-3">
                      <div className="bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-lg text-[9px] font-black uppercase text-[#0F4C5C] shadow-md flex items-center gap-1 border border-white">
                        <Star className="w-3 h-3 text-[#FFD23F] fill-[#FFD23F]" /> 4.9
                      </div>
                    </div>
                  </div>

                  {/* Info Area */}
                  <div className="p-5 flex flex-col justify-between flex-1 bg-white">
                    <div>
                      <div className="flex items-center gap-1.5 text-[#FF7F50] mb-2 font-black text-[9px] uppercase tracking-widest leading-none">
                        <MapPin className="w-3 h-3" />
                        {dest.location}
                      </div>
                      <h3 className="heading-font text-[16px] text-[#1a1a2e] font-bold tracking-tight leading-tight group-hover:text-[#0F4C5C] transition-colors line-clamp-2 mb-2">{dest.title}</h3>
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                      <div className="flex flex-col">
                        <span className="text-gray-400 text-[8px] font-black uppercase mb-0.5 tracking-widest leading-none">Starting Experience</span>
                        <div className="flex items-baseline gap-1">
                          <span className="text-[#0F4C5C] text-2xl font-black">${dest.price}</span>
                          <span className="text-gray-400 text-[9px] font-bold uppercase">/pp</span>
                        </div>
                      </div>
                      <div className="w-9 h-9 bg-[#0F4C5C]/5 border border-[#0F4C5C]/10 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:bg-[#FF7F50] group-hover:border-[#FF7F50] group-hover:rotate-[360deg]">
                        <ArrowRight className="w-4 h-4 text-[#0F4C5C] group-hover:text-white" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default PopularDestinations;
