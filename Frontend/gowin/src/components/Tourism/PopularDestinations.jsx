import React, { useEffect } from 'react';
import { MapPin, Star, Plane, Mountain, Compass, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import usePlaceStore from '../Store/PlaceStore';

const PopularDestinations = () => {
  const { places, isLoading, fetchPlaces } = usePlaceStore();

  useEffect(() => {
    fetchPlaces();
  }, [fetchPlaces]);

  // If no places in Supabase, we'll show a message or just a few slots
  const displayPlaces = places.slice(0, 6); // Top 6

  return (
    <section id="destinations" className="py-24 bg-white relative overflow-hidden">
      {/* Subtle Background Icons */}
      <Plane className="absolute top-20 left-10 w-64 h-64 text-gray-50 opacity-50 transform -rotate-12" />
      <Mountain className="absolute bottom-10 right-10 w-72 h-72 text-gray-50 opacity-40" />
      <Compass className="absolute top-1/2 left-1/2 w-96 h-96 text-gray-50 opacity-30 transform -translate-x-1/2 -translate-y-1/2" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-[#0F4C5C] mb-4">Explore Top Destinations</h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg leading-relaxed">
            Pack your bags and discover incredible places curated just for you. Your next great adventure starts here with Gowin Travels.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[1,2,3].map(i => (
              <div key={i} className="bg-gray-50 rounded-3xl h-[450px] animate-pulse border border-gray-100" />
            ))}
          </div>
        ) : displayPlaces.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-[3rem] border border-dashed border-gray-200">
             <MapPin className="w-16 h-16 text-gray-200 mx-auto mb-4" />
             <p className="text-gray-400 font-medium">No destinations listed yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {displayPlaces.map(dest => (
              <div key={dest.id} className="bg-white rounded-[2.5rem] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_25px_50px_rgba(15,76,92,0.12)] hover:-translate-y-2 transition-all duration-500 group flex flex-col h-full border border-gray-100">
                <div className="relative h-72 overflow-hidden flex-shrink-0">
                  <img 
                    src={dest.images?.[0] || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80'} 
                    alt={dest.title} 
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-1000"
                  />
                  <div className="absolute top-6 right-6 bg-white/95 backdrop-blur-md px-4 py-2 rounded-2xl flex items-center gap-2 shadow-lg">
                    <Star className="w-4 h-4 text-[#FF7F50] fill-[#FF7F50]" />
                    <span className="text-sm font-extrabold text-[#0F4C5C]">4.9</span>
                  </div>
                  <div className="absolute bottom-6 left-6">
                     <span className="px-4 py-2 bg-[#2A9D8F] text-white text-[10px] font-bold uppercase tracking-widest rounded-xl shadow-lg">
                        {dest.duration || 'Flexible'}
                     </span>
                  </div>
                </div>

                <div className="p-10 flex flex-col flex-grow">
                  <div className="flex items-start gap-2 mb-4">
                    <MapPin className="w-5 h-5 text-[#2A9D8F] flex-shrink-0 mt-1" />
                    <h3 className="text-2xl font-bold text-[#0F4C5C] leading-tight tracking-tight">{dest.title}</h3>
                  </div>
                  <p className="text-gray-500 mb-8 leading-relaxed line-clamp-3 text-sm flex-grow">
                    {dest.description}
                  </p>
                  <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                    <div>
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1">Starting At</p>
                      <p className="text-2xl font-extrabold text-[#FF7F50]">${dest.price}</p>
                    </div>
                    <Link to={`/places/${dest.id}`} className="group/btn flex items-center gap-2 bg-[#0F4C5C]/5 text-[#0F4C5C] hover:bg-[#0F4C5C] hover:text-white px-6 py-3.5 rounded-2xl font-bold transition-all duration-300">
                      Explore <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-20 text-center">
           <Link to="/details/all" className="inline-flex items-center gap-3 text-[#0F4C5C] font-bold hover:text-[#FF7F50] transition-colors group">
              View All Destinations 
              <div className="w-10 h-10 rounded-full border-2 border-current flex items-center justify-center group-hover:scale-110 transition-transform">
                 <ArrowRight className="w-5 h-5" />
              </div>
           </Link>
        </div>
      </div>
    </section>
  );
};

export default PopularDestinations;
