"use client"

import React, { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MapPin, Clock, Star, Globe, Navigation, ArrowRight, Activity, Filter, Map } from "lucide-react"
import { Link, useParams } from "react-router-dom"
import usePlaceStore from "../Store/PlaceStore"

const AllDestinations = () => {
  const { type } = useParams(); // Get 'national' or 'international' from URL
  const { places, fetchPlaces, isLoading } = usePlaceStore()
  
  // Set initial filter based on URL if present
  const initialTypeFilter = type 
    ? type.charAt(0).toUpperCase() + type.slice(1) 
    : "All";

  const [categoryFilter, setCategoryFilter] = useState("All Categories")
  const [typeFilter, setTypeFilter] = useState(initialTypeFilter)

  useEffect(() => {
    fetchPlaces()
    window.scrollTo(0, 0)
  }, [fetchPlaces])

  useEffect(() => {
    if (type) {
      setTypeFilter(type.charAt(0).toUpperCase() + type.slice(1));
    }
  }, [type]);

  const categories = ["All Categories", ...new Set(places.map(p => p.category).filter(Boolean))]

  const filteredPlaces = places.filter(p => {
    const categoryMatch = categoryFilter === "All Categories" || p.category === categoryFilter;
    const typeMatch = typeFilter === "All" || (p.destination_type || 'International') === typeFilter;
    return categoryMatch && typeMatch;
  });

  return (
    <div className="min-h-screen bg-white">

      {/* Premium Hero Header */}
      <section className="relative pt-48 pb-32 overflow-hidden bg-[#F8FAFB]">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-[#0F4C5C]/5 blur-[120px] rounded-full -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-1/3 h-full bg-[#FF7F50]/5 blur-[120px] rounded-full -ml-32 -mb-32" />

        <div className="max-w-7xl mx-auto px-6 sm:px-12 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#0F4C5C]/5 text-[#0F4C5C] rounded-xl text-[10px] font-black uppercase tracking-[0.3em] mb-8 border border-[#0F4C5C]/10">
              {typeFilter === 'National' ? <Map className="w-4 h-4 text-[#FF7F50]" /> : <Globe className="w-4 h-4 text-[#FF7F50]" />}
              {typeFilter} Odyssey
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-[#0F4C5C] tracking-tighter leading-[0.9] mb-8">
              Explore Our <br />
              <span className="text-[#FF7F50]">{typeFilter === 'All' ? 'Global' : typeFilter} Collection.</span>
            </h1>
            <p className="text-gray-400 text-xl font-medium leading-relaxed max-w-2xl">
              {typeFilter === 'National' 
                ? "Discover the hidden gems of Nepal, from spiritual sanctuaries to daring mountain adventures."
                : "From the azure coasts of the Mediterranean to the emerald peaks of the Himalayas, discover a collection curated for the elite traveler."
              }
            </p>
          </motion.div>
        </div>
      </section>

      {/* Dual Filter Bar */}
      <section className="sticky top-[80px] z-40 bg-white/90 backdrop-blur-xl border-b border-gray-100 py-6 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 sm:px-12">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            
            {/* Left: Destination Type Toggle */}
            <div className="flex items-center gap-2 p-1.5 bg-gray-50 rounded-2xl border border-gray-100/50 shadow-inner">
               {['All', 'National', 'International'].map((t) => (
                  <button
                    key={t}
                    onClick={() => setTypeFilter(t)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all duration-300 ${
                      typeFilter === t 
                      ? 'bg-[#0F4C5C] text-white shadow-lg shadow-[#0F4C5C]/20' 
                      : 'text-gray-400 hover:text-[#0F4C5C] hover:bg-white/50'
                    }`}
                  >
                    {t === 'National' && <Map className="w-3.5 h-3.5" />}
                    {t === 'International' && <Globe className="w-3.5 h-3.5" />}
                    {t}
                  </button>
               ))}
            </div>

            {/* Right: Category Chips */}
            <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-hide max-w-full lg:max-w-[60%]">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border-2
                    ${categoryFilter === cat
                      ? 'bg-transparent border-[#FF7F50] text-[#FF7F50]'
                      : 'bg-transparent border-transparent text-gray-400 hover:text-[#0F4C5C]'}`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="hidden xl:flex items-center gap-3 text-[#0F4C5C] shrink-0">
              <Filter className="w-4 h-4" />
              <span className="text-[11px] font-black uppercase tracking-widest">{filteredPlaces.length} Destinations Found</span>
            </div>
          </div>
        </div>
      </section>

      {/* Destinations Grid */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-12">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <div key="loading" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="aspect-[4/5] bg-gray-50 rounded-[3rem] animate-pulse" />
                ))}
              </div>
            ) : filteredPlaces.length === 0 ? (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="py-32 text-center"
              >
                <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8 text-gray-300">
                  <Activity className="w-10 h-10" />
                </div>
                <h3 className="text-3xl font-black text-[#0F4C5C] tracking-tighter mb-4">No {typeFilter} Destinations Found</h3>
                <p className="text-gray-400 font-medium max-w-sm mx-auto">We couldn't find any journeys matching your criteria in the {typeFilter} collection.</p>
              </motion.div>
            ) : (
              <motion.div 
                key="grid"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20"
              >
                {filteredPlaces.map((place, index) => (
                  <motion.div
                    key={place.id}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: (index % 3) * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Link to={`/places/${place.id}`} className="group block">
                      <div className="relative aspect-[4/5] rounded-[3.5rem] overflow-hidden shadow-2xl mb-8 border border-gray-100">
                        <img
                          src={place.images?.[0] || 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=800&q=80'}
                          alt={place.title}
                          className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                        {/* Interactive Badges */}
                        <div className="absolute top-8 left-8 flex flex-col gap-3">
                          <span className="px-4 py-2 bg-white/20 backdrop-blur-md border border-white/30 rounded-full text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                             {place.destination_type === 'National' ? <Map className="w-3 h-3" /> : <Globe className="w-3 h-3" />}
                             {place.destination_type || 'International'}
                          </span>
                        </div>

                        <div className="absolute bottom-10 left-10 right-10">
                          <div className="flex items-center gap-2 text-[#FF7F50] mb-3">
                            <MapPin className="w-4 h-4" />
                            <span className="text-[11px] font-black uppercase tracking-[0.2em]">{place.location}</span>
                          </div>
                          <h3 className="text-3xl font-black text-white tracking-tighter mb-4 leading-none">{place.title}</h3>
                          <div className="flex items-center justify-between">
                            <div className="flex items-baseline gap-1 text-white">
                              <span className="text-2xl font-black">${place.price}</span>
                              <span className="text-[10px] font-bold opacity-60 uppercase">/ Person</span>
                            </div>
                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#0F4C5C] scale-0 group-hover:scale-100 transition-all origin-center shadow-lg group-hover:bg-[#FF7F50] group-hover:text-white">
                              <ArrowRight className="w-5 h-5" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

    </div>
  )
}

export default AllDestinations
