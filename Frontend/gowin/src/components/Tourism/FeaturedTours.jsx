import React, { useEffect } from 'react';
import { Clock, Star, MapPin, ArrowRight, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import usePlaceStore from '../Store/PlaceStore';

const FeaturedTours = () => {
  const { places, fetchPlaces, isLoading } = usePlaceStore();

  useEffect(() => {
    fetchPlaces();
  }, [fetchPlaces]);

  // Featured could be the ones with highest price or just last 2
  const featured = places.slice(0, 4); 

  return (
    <section id="tours" className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-xl">
            <h2 className="text-4xl md:text-5xl font-bold text-[#0F4C5C] mb-6 tracking-tight">Handpicked Adventures</h2>
            <p className="text-gray-500 text-lg leading-relaxed">
              Explore our most popular and curated travel experiences. Each tour is crafted with premium comfort and authentic exploration in mind.
            </p>
          </div>
          <Link to="/details/all" className="flex items-center gap-2 text-[#2A9D8F] font-bold hover:text-[#0F4C5C] transition-all group pb-2 border-b-2 border-[#2A9D8F]/20 hover:border-[#0F4C5C]">
            Explore All Excursions <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {[1,2].map(i => (
              <div key={i} className="h-64 bg-gray-50 rounded-[2.5rem] animate-pulse border border-gray-100" />
            ))}
          </div>
        ) : featured.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-[3rem] border border-dashed border-gray-200">
             <ShieldCheck className="w-16 h-16 text-gray-200 mx-auto mb-4" />
             <p className="text-gray-400 font-medium">New adventures are arriving soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {featured.map(tour => (
              <div key={tour.id} className="flex flex-col sm:flex-row bg-white rounded-[2.5rem] overflow-hidden shadow-[0_4px_30px_rgb(0,0,0,0.03)] hover:shadow-[0_25px_50px_rgba(15,76,92,0.12)] transition-all duration-500 border border-gray-100 group">
                <div className="sm:w-2/5 h-64 sm:h-auto relative overflow-hidden">
                  <img 
                    src={tour.images?.[0] || 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=800&q=80'} 
                    alt={tour.title} 
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-1000"
                  />
                  <div className="absolute top-4 left-4">
                     <div className="bg-[#0F4C5C] text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-xl shadow-lg flex items-center gap-1.5">
                        <Star className="w-3 h-3 text-[#FF7F50] fill-[#FF7F50]" /> 4.9
                     </div>
                  </div>
                </div>
                <div className="p-8 sm:w-3/5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-[#2A9D8F] mb-3 font-bold uppercase text-[10px] tracking-widest">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{tour.location}</span>
                    </div>
                    <h3 className="text-2xl font-bold text-[#0F4C5C] mb-5 leading-tight group-hover:text-[#FF7F50] transition-colors">{tour.title}</h3>
                    <div className="flex flex-wrap items-center gap-4 mb-8">
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-xl border border-gray-100 text-xs text-gray-400 font-bold">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{tour.duration || 'Flexible'}</span>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-xl border border-gray-100 text-xs text-gray-400 font-bold">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#2A9D8F]" />
                        <span>Certified</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-6 border-t border-gray-50 mt-auto">
                    <div>
                      <span className="text-3xl font-extrabold text-[#0F4C5C]">${tour.price}</span>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[2px]">Per person</p>
                    </div>
                    <Link to="/booking" state={{ preFilledDestination: tour.id, destinationName: tour.title }} className="bg-[#FF7F50] text-white px-8 py-3.5 rounded-2xl font-bold hover:bg-[#ff6a33] transition-all shadow-xl shadow-[#FF7F50]/20 active:scale-95">
                      Book Trip
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedTours;
