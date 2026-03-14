"use client"

import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { MapPin, Clock, Star, Globe, Navigation, ArrowRight, Activity, Filter } from "lucide-react"
import { Link } from "react-router-dom"
import usePlaceStore from "../Store/PlaceStore"
import Navbar from "../Tourism/Navbar"
import Footer from "../Home/Footer"

const AllDestinations = () => {
  const { places, fetchPlaces, isLoading } = usePlaceStore()
  const [filter, setFilter] = useState("All")

  useEffect(() => {
    fetchPlaces()
    window.scrollTo(0, 0)
  }, [fetchPlaces])

  const categories = ["All", ...new Set(places.map(p => p.category).filter(Boolean))]

  const filteredPlaces = filter === "All"
    ? places
    : places.filter(p => p.category === filter)

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
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#0F4C5C]/5 text-[#0F4C5C] rounded-xl text-[10px] font-black uppercase tracking-[0.3em] mb-8 border border-[#0F4C5C]/10">
              <Globe className="w-4 h-4 text-[#FF7F50]" /> World Collection
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-[#0F4C5C] tracking-tighter leading-[0.9] mb-8">
              Explore Our <br />
              <span className="text-[#FF7F50]">Global Odyssey.</span>
            </h1>
            <p className="text-gray-400 text-xl font-medium leading-relaxed max-w-xl">
              From the azure coasts of the Mediterranean to the emerald peaks of the Himalayas, discover a collection curated for the elite traveler.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="sticky top-[80px] z-40 bg-white/90 backdrop-blur-xl border-b border-gray-100 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-8 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all whitespace-nowrap
                  ${filter === cat
                    ? 'bg-[#0F4C5C] text-white shadow-xl shadow-[#0F4C5C]/20'
                    : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="hidden md:flex items-center gap-3 text-[#0F4C5C]">
            <Filter className="w-4 h-4" />
            <span className="text-[11px] font-black uppercase tracking-widest">{filteredPlaces.length} Destinations Found</span>
          </div>
        </div>
      </section>

      {/* Destinations Grid */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-12">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="aspect-[4/5] bg-gray-50 rounded-[3rem] animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20">
              {filteredPlaces.map((place, index) => (
                <motion.div
                  key={place.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: (index % 3) * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Link to={`/places/${place.id}`} className="group block">
                    <div className="relative aspect-[4/5] rounded-[3.5rem] overflow-hidden shadow-2xl mb-8">
                      <img
                        src={place.images?.[0]}
                        alt={place.title}
                        className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                      {/* Interactive Badges */}
                      <div className="absolute top-8 left-8 flex flex-col gap-3">
                        <span className="px-4 py-2 bg-white/20 backdrop-blur-md border border-white/30 rounded-full text-white text-[10px] font-black uppercase tracking-widest">
                          {place.category || 'Featured'}
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
                          <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full text-[#0F4C5C] text-[10px] font-black uppercase tracking-widest scale-0 group-hover:scale-100 transition-transform origin-right">
                            Book Now <ArrowRight className="w-3 h-3" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}

          {!isLoading && filteredPlaces.length === 0 && (
            <div className="py-32 text-center">
              <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8 text-gray-300">
                <Activity className="w-10 h-10" />
              </div>
              <h3 className="text-3xl font-black text-[#0F4C5C] tracking-tighter mb-4">No Destinations Found</h3>
              <p className="text-gray-400 font-medium max-w-sm mx-auto">We couldn't find any destinations matching this category. Please try a different selection.</p>
            </div>
          )}
        </div>
      </section>

    </div>
  )
}

export default AllDestinations
