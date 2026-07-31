import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, Activity, Map, Search } from "lucide-react";
import { useParams } from "react-router-dom";
import usePlaceStore from "../Store/PlaceStore";
import DestinationCard from "./DestinationCard";
import {
  SEED_DESTINATIONS_NEPAL,
  SEED_DESTINATIONS_INTERNATIONAL,
  SEED_ADVENTURES,
  SEED_LAKES,
} from "../../data/seedData";

const SEED_ALL = [
  ...SEED_DESTINATIONS_NEPAL,
  ...SEED_DESTINATIONS_INTERNATIONAL,
  ...SEED_ADVENTURES,
  ...SEED_LAKES,
];

const AllDestinations = () => {
  const { type } = useParams();
  const { places, fetchPlaces, isLoading } = usePlaceStore();

  const initialTypeFilter = type
    ? type.charAt(0).toUpperCase() + type.slice(1)
    : "All";

  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [typeFilter, setTypeFilter] = useState(initialTypeFilter);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchPlaces();
    window.scrollTo(0, 0);
  }, [fetchPlaces]);

  useEffect(() => {
    if (type) setTypeFilter(type.charAt(0).toUpperCase() + type.slice(1));
  }, [type]);

  // Fall back to seed data so the catalogue is never empty
  const allPlaces = places.length > 0 ? places : SEED_ALL;

  const categories = [
    "All Categories",
    ...new Set(allPlaces.map(p => p.categories?.name).filter(Boolean)),
  ];

  const filteredPlaces = allPlaces.filter(p => {
    const categoryMatch =
      categoryFilter === "All Categories" ||
      p.categories?.name === categoryFilter;
    const typeMatch =
      typeFilter === "All" ||
      (p.destination_type || "International") === typeFilter;
    const searchMatch =
      !searchQuery ||
      p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location?.toLowerCase().includes(searchQuery.toLowerCase());
    return categoryMatch && typeMatch && searchMatch;
  });

  return (
    <div className="min-h-screen bg-white pt-16">
      {/* Hero Header */}
      <section className="relative pt-12 sm:pt-16 pb-10 sm:pb-14 overflow-hidden bg-[#F8FAFC]">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#1E3A8A]/5 blur-[100px] rounded-full -mr-32 -mt-32 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#10B981]/5 blur-[100px] rounded-full -ml-32 -mb-32 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#1E3A8A]/5 text-[#1E3A8A] rounded-lg text-[10px] font-bold uppercase tracking-widest mb-4 border border-[#1E3A8A]/10">
              {typeFilter === "National" ? (
                <Map className="w-3.5 h-3.5 text-[#10B981]" />
              ) : (
                <Globe className="w-3.5 h-3.5 text-[#10B981]" />
              )}
              {typeFilter === "All" ? "All Destinations" : `${typeFilter} Collection`}
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold text-[#1E3A8A] tracking-tight leading-tight mb-3">
              {typeFilter === "National"
                ? "Explore Nepal"
                : typeFilter === "International"
                ? "International Destinations"
                : "All Destinations"}
            </h1>
            <p className="text-gray-500 text-sm sm:text-base max-w-xl leading-relaxed">
              {typeFilter === "National"
                ? "Discover the breathtaking beauty of Nepal — from the peaks of the Himalayas to the jungles of the Terai."
                : typeFilter === "International"
                ? "Handpicked global experiences crafted for adventurers, families, and luxury seekers alike."
                : "Browse our complete collection of local and international tour packages."}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Sticky Filter Bar — mobile/tablet only */}
      <section className="lg:hidden sticky top-16 z-40 bg-white/95 backdrop-blur-xl border-b border-gray-100 shadow-sm py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            {/* Search */}
            <div className="relative flex-1 min-w-0 w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search destinations..."
                className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981]/20 focus:border-[#10B981]/40 transition-all"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Type Toggle */}
            <div className="flex items-center gap-1 p-1 bg-gray-50 rounded-xl border border-gray-100">
              {["All", "National", "International"].map(t => (
                <button
                  key={t}
                  onClick={() => setTypeFilter(t)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    typeFilter === t
                      ? "bg-[#1E3A8A] text-white shadow-sm"
                      : "text-gray-400 hover:text-[#1E3A8A]"
                  }`}
                >
                  {t === "National" && <Map className="w-3 h-3" />}
                  {t === "International" && <Globe className="w-3 h-3" />}
                  {t}
                </button>
              ))}
            </div>

            {/* Category Chips */}
            <div
              className="flex items-center gap-2 overflow-x-auto pb-0.5 flex-1"
              style={{ scrollbarWidth: "none" }}
            >
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all border ${
                    categoryFilter === cat
                      ? "border-[#10B981] text-[#10B981] bg-[#10B981]/5"
                      : "border-transparent text-gray-400 hover:text-[#1E3A8A]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <span className="hidden lg:block text-xs text-gray-400 font-medium flex-shrink-0">
              {filteredPlaces.length} result{filteredPlaces.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </section>

      {/* Sidebar + Destinations Grid */}
      <section className="py-10 sm:py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 lg:flex lg:gap-8">

          {/* Filter Sidebar — desktop only */}
          <aside className="hidden lg:block w-60 flex-shrink-0 self-start sticky top-24">
            <div className="max-h-[calc(100vh-7rem)] overflow-y-auto pr-1 space-y-6" style={{ scrollbarWidth: 'thin' }}>
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search destinations..."
                  className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981]/20 focus:border-[#10B981]/40 transition-all"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Region */}
              <div>
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2.5">Region</h4>
                <div className="space-y-1">
                  {["All", "National", "International"].map(t => (
                    <button
                      key={t}
                      onClick={() => setTypeFilter(t)}
                      className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold text-left transition-all ${
                        typeFilter === t
                          ? "bg-[#1E3A8A] text-white shadow-sm"
                          : "text-gray-500 hover:bg-gray-50 hover:text-[#1E3A8A]"
                      }`}
                    >
                      {t === "National" ? <Map className="w-3.5 h-3.5" /> : t === "International" ? <Globe className="w-3.5 h-3.5" /> : <Activity className="w-3.5 h-3.5" />}
                      {t === "National" ? "Nepal 🇳🇵" : t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Categories */}
              <div>
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2.5">Category</h4>
                <div className="space-y-1">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setCategoryFilter(cat)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold text-left transition-all ${
                        categoryFilter === cat
                          ? "bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/30"
                          : "text-gray-500 hover:bg-gray-50 hover:text-[#1E3A8A] border border-transparent"
                      }`}
                    >
                      {cat}
                      {categoryFilter === cat && <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />}
                    </button>
                  ))}
                </div>
              </div>

              <p className="text-xs text-gray-400 font-medium border-t border-gray-100 pt-4">
                {filteredPlaces.length} result{filteredPlaces.length !== 1 ? "s" : ""}
              </p>
            </div>
          </aside>

          {/* Grid */}
          <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <div key="loading" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="bg-gray-50 rounded-2xl h-80 animate-pulse" />
                ))}
              </div>
            ) : filteredPlaces.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-24 text-center"
              >
                <Activity className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-[#1E3A8A] mb-2">No destinations found</h3>
                <p className="text-gray-400 text-sm max-w-xs mx-auto">
                  Try adjusting your filters or search term.
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="grid"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6"
              >
                {filteredPlaces.map((place, index) => (
                  <DestinationCard key={place.id} dest={place} index={index} variant="grid" />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AllDestinations;
