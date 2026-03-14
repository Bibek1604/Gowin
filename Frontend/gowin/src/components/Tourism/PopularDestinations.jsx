import React, { useEffect } from 'react';
import { MapPin, Star, ArrowRight, Compass, ShieldCheck, Clock, Navigation } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import usePlaceStore from '../Store/PlaceStore';

const PopularDestinations = () => {
  const { places, isLoading, fetchPlaces } = usePlaceStore();

  useEffect(() => {
    fetchPlaces();
  }, [fetchPlaces]);

  // Display top 6 destinations
  const displayPlaces = places.slice(0, 6);

  return (
    <section id="destinations" className="py-32 bg-[#F8FAFB] relative overflow-hidden font-sans">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#0F4C5C]/5 rounded-full -mr-32 -mt-32 blur-3xl opacity-50" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#FF7F50]/5 rounded-full -ml-32 -mb-32 blur-3xl opacity-50" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
           <div className="max-w-2xl">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-6 py-2 bg-[#0F4C5C]/5 text-[#0F4C5C] rounded-full text-[10px] font-bold uppercase tracking-[0.3em] mb-6 border border-[#0F4C5C]/10"
              >
                <Navigation className="w-4 h-4" /> Global Collection
              </motion.div>
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-5xl md:text-6xl font-black text-[#0F4C5C] tracking-tighter leading-[0.9] mb-6"
              >
                Iconic <span className="text-[#FF7F50]">Destinations.</span>
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-gray-400 text-lg font-medium leading-relaxed"
              >
                Journey through our meticulously curated selection of the world's most breathtaking escapes, designed for the modern explorer.
              </motion.p>
           </div>
           <motion.div
             initial={{ opacity: 0, scale: 0.8 }}
             whileInView={{ opacity: 1, scale: 1 }}
             className="hidden md:flex flex-col items-center gap-2"
           >
              <div className="w-16 h-16 rounded-full border-2 border-dashed border-[#0F4C5C]/20 flex items-center justify-center animate-spin-slow">
                 <Compass className="w-6 h-6 text-[#0F4C5C]/30" />
              </div>
           </motion.div>
        </div>

        {/* Places Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {[1,2,3].map(i => (
              <div key={i} className="bg-white rounded-[3rem] h-[500px] animate-pulse shadow-sm border border-gray-100" />
            ))}
          </div>
        ) : displayPlaces.length === 0 ? (
          <div className="text-center py-32 bg-white rounded-[4rem] border border-dashed border-gray-200">
             <Compass className="w-20 h-20 text-gray-100 mx-auto mb-6" />
             <h3 className="text-2xl font-bold text-[#0F4C5C] mb-2">Expanding Our Horizons</h3>
             <p className="text-gray-400 font-medium">New destinations are being meticulously scouted. Check back soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {displayPlaces.map((dest, idx) => (
              <motion.div 
                key={dest.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="group relative h-[550px] rounded-[3.5rem] overflow-hidden shadow-2xl bg-white border border-gray-50"
              >
                 {/* Main Image */}
                 <div className="absolute inset-0 overflow-hidden">
                    <img 
                      src={dest.images?.[0] || 'https://images.unsplash.com/photo-1542224566-6e85f2e6772f?q=80&w=800&auto=format&fit=crop'} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[4s]" 
                      alt={dest.title} 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0F4C5C] via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                 </div>

                 {/* Top Controls */}
                 <div className="absolute top-8 left-8 right-8 flex justify-between items-start z-20">
                    <div className="px-5 py-2.5 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl flex items-center gap-2 shadow-lg">
                       <Star className="w-4 h-4 text-[#FF7F50] fill-[#FF7F50]" />
                       <span className="text-xs font-black text-white">4.9</span>
                    </div>
                    <div className="w-12 h-12 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl flex items-center justify-center text-white hover:bg-white hover:text-[#0F4C5C] transition-all cursor-pointer">
                       <ShieldCheck className="w-5 h-5" />
                    </div>
                 </div>

                 {/* Content Overlay */}
                 <div className="absolute inset-x-0 bottom-0 p-10 z-20 text-white">
                    <div className="flex items-center gap-2 mb-4 text-[#FF7F50] font-black uppercase text-[10px] tracking-[0.3em]">
                       <MapPin className="w-4 h-4" /> {dest.location || 'Adventure'}
                    </div>
                    <h3 className="text-4xl font-black tracking-tighter mb-4 leading-none">{dest.title}</h3>
                    <p className="text-white/70 text-sm font-medium leading-relaxed mb-8 line-clamp-2 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                       {dest.description}
                    </p>

                    <div className="flex items-center justify-between pt-8 border-t border-white/10">
                       <div className="flex flex-col">
                          <span className="text-[9px] font-black uppercase tracking-widest text-white/40 mb-1">Starting From</span>
                          <span className="text-3xl font-black">${dest.price}</span>
                       </div>
                       <Link 
                        to={`/places/${dest.id}`} 
                        className="w-14 h-14 bg-white text-[#0F4C5C] rounded-2xl flex items-center justify-center hover:bg-[#FF7F50] hover:text-white transition-all shadow-xl group/btn"
                       >
                          <ArrowRight className="w-6 h-6 group-hover/btn:translate-x-1 transition-transform" />
                       </Link>
                    </div>
                 </div>

                 {/* Badge */}
                 <div className="absolute bottom-10 right-10 z-10 translate-y-20 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
                    <div className="bg-[#FF7F50] text-white p-6 rounded-full rotate-12 shadow-2xl flex items-center gap-2">
                       <Clock className="w-4 h-4" />
                       <span className="text-[10px] font-black uppercase tracking-widest">{dest.duration || 'Flexible'}</span>
                    </div>
                 </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Footer Exploration */}
        <div className="mt-24 text-center">
            <Link to="/details/all" className="inline-flex items-center gap-6 group">
               <div className="text-right">
                  <p className="text-xs font-black text-[#0F4C5C] uppercase tracking-[0.3em]">Discover More</p>
                  <p className="text-[#FF7F50] font-medium">Explore all 24+ global destinations</p>
               </div>
               <div className="w-20 h-20 rounded-3xl bg-[#0F4C5C] text-white flex items-center justify-center transform group-hover:rotate-12 transition-all shadow-2xl shadow-[#0F4C5C]/20 border-4 border-white">
                  <ArrowRight className="w-8 h-8" />
               </div>
            </Link>
        </div>
      </div>

      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 12s linear infinite;
        }
      `}</style>
    </section>
  );
};

export default PopularDestinations;

