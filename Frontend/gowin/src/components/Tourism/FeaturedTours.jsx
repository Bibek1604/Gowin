import React, { useEffect } from 'react';
import { Clock, Star, MapPin, ArrowRight, ShieldCheck, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import usePlaceStore from '../Store/PlaceStore';

const FeaturedTours = () => {
  const { places, fetchPlaces, isLoading } = usePlaceStore();
  useEffect(() => { fetchPlaces(); }, [fetchPlaces]);
  const featured = places.slice(0, 4);

  return (
    <section id="tours" className="py-20 md:py-28 bg-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF7F50]/5 rounded-full blur-3xl -mr-48 -mt-48" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-16 gap-6">
          <div>
            <span className="section-label mb-4 block">Handpicked For You</span>
            <h2 className="heading-font text-4xl md:text-5xl text-[#1a1a2e]">
              Featured <span className="text-[#0F4C5C]">Tours</span>
            </h2>
            <p className="text-gray-500 text-sm md:text-base mt-3 max-w-lg leading-relaxed">
              Carefully crafted itineraries combining premium comfort with authentic local experiences.
            </p>
          </div>
          <Link to="/details/all" className="btn-secondary flex-shrink-0">
            All Tours <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Tours */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[1,2,3,4].map(i => <div key={i} className="h-60 bg-gray-100 rounded-3xl animate-pulse" />)}
          </div>
        ) : featured.length === 0 ? (
          <div className="text-center py-20">
            <ShieldCheck className="w-12 h-12 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400">New adventures arriving soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {featured.map((tour, idx) => (
              <div
                key={tour.id}
                className="group bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.10)] transition-all duration-500 hover:-translate-y-1 flex flex-col sm:flex-row"
              >
                {/* Image */}
                <div className="relative sm:w-2/5 h-52 sm:h-auto overflow-hidden flex-shrink-0">
                  <img
                    src={tour.images?.[0] || 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=600&q=80'}
                    alt={tour.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-3 left-3 flex items-center gap-1 bg-white/95 backdrop-blur-sm px-2.5 py-1.5 rounded-xl shadow-sm">
                    <Star className="w-3 h-3 text-[#FFD23F] fill-[#FFD23F]" />
                    <span className="text-xs font-bold text-[#1a1a2e]">4.9</span>
                  </div>
                  {idx === 0 && (
                    <div className="absolute top-3 right-3 bg-[#FF7F50] text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1.5 rounded-xl">
                      Best Seller
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-6 flex flex-col justify-between flex-1">
                  <div>
                    <div className="flex items-center gap-1.5 text-[#0F4C5C]/50 text-[10px] font-semibold uppercase tracking-widest mb-2">
                      <MapPin className="w-3 h-3 text-[#FF7F50]" /> {tour.location}
                    </div>
                    <h3 className="heading-font text-xl text-[#1a1a2e] mb-3 group-hover:text-[#0F4C5C] transition-colors" style={{lineHeight:1.2}}>
                      {tour.title}
                    </h3>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {tour.duration && (
                        <span className="flex items-center gap-1.5 bg-gray-50 text-gray-500 text-xs font-medium px-3 py-1.5 rounded-xl border border-gray-100">
                          <Clock className="w-3 h-3" /> {tour.duration}
                        </span>
                      )}
                      <span className="flex items-center gap-1.5 bg-gray-50 text-gray-500 text-xs font-medium px-3 py-1.5 rounded-xl border border-gray-100">
                        <ShieldCheck className="w-3 h-3 text-[#0F4C5C]" /> Certified Guide
                      </span>
                      <span className="flex items-center gap-1.5 bg-gray-50 text-gray-500 text-xs font-medium px-3 py-1.5 rounded-xl border border-gray-100">
                        <Users className="w-3 h-3" /> Group Available
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                    <div>
                      <span className="text-[10px] text-gray-400 uppercase tracking-widest block">From</span>
                      <span className="text-2xl font-black text-[#0F4C5C]">${tour.price}</span>
                      <span className="text-xs text-gray-400"> /person</span>
                    </div>
                    <Link
                      to="/booking"
                      state={{ preFilledDestination: tour.id, destinationName: tour.title }}
                      className="btn-primary"
                    >
                      Book Now
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
