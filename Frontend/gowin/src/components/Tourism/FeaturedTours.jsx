import React, { useEffect } from 'react';
import { Clock, Star, MapPin, ArrowRight, Users, Flame, Globe, Map } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import usePlaceStore from '../Store/PlaceStore';
import { SEED_DESTINATIONS_NEPAL, SEED_DESTINATIONS_INTERNATIONAL } from '../../data/seedData';

const FEATURED_SEED = [
  SEED_DESTINATIONS_NEPAL[0],
  SEED_DESTINATIONS_INTERNATIONAL[0],
  SEED_DESTINATIONS_NEPAL[1],
  SEED_DESTINATIONS_INTERNATIONAL[2],
];

const TourCard = ({ tour, idx }) => {
  const isSeeded = String(tour.id).startsWith('seed-');
  const link = isSeeded ? '/destinations/all' : `/places/${tour.id}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: idx * 0.08 }}
      className="group bg-white rounded-2xl sm:rounded-3xl overflow-hidden border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.10)] transition-all duration-500 hover:-translate-y-1 flex flex-col sm:flex-row"
    >
      {/* Image */}
      <div className="relative sm:w-[42%] h-48 sm:h-auto overflow-hidden flex-shrink-0">
        <img
          src={tour.images?.[0] || 'https://images.unsplash.com/photo-1468581264429-2548ef9eb732?auto=format&fit=crop&w=600&q=80'}
          alt={tour.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/5 to-transparent sm:bg-gradient-to-r sm:from-transparent sm:to-transparent" />

        {/* Flame badge for first 2 */}
        {idx < 2 && (
          <div className="absolute top-3 left-3 flex items-center gap-1 bg-[#10B981] px-2.5 py-1 rounded-lg text-[10px] font-bold text-white shadow-sm">
            <Flame className="w-3 h-3 fill-white" /> Featured
          </div>
        )}

        {/* Type badge */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-lg text-[9px] font-bold text-white">
          {tour.destination_type === 'National' ? <Map className="w-2.5 h-2.5" /> : <Globe className="w-2.5 h-2.5" />}
          {tour.destination_type === 'National' ? 'Nepal' : 'International'}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-5 sm:p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1 text-[#10B981] text-[9px] font-bold uppercase tracking-widest">
              <MapPin className="w-2.5 h-2.5 flex-shrink-0" />
              <span className="truncate">{tour.location}</span>
            </div>
            <div className="flex items-center gap-1 bg-[#FBBF24]/10 px-2 py-0.5 rounded-lg">
              <Star className="w-3 h-3 text-[#FBBF24] fill-[#FBBF24]" />
              <span className="text-[10px] font-bold text-[#1E3A8A]">{tour.rating || '4.9'}</span>
            </div>
          </div>
          <h3 className="text-base sm:text-lg font-bold text-[#0F172A] leading-tight group-hover:text-[#1E3A8A] transition-colors mb-2 line-clamp-2">
            {tour.title}
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 leading-relaxed line-clamp-2 mb-3">
            {tour.description}
          </p>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-50">
          <div className="flex items-center gap-3 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> {tour.duration?.split('/')[0]?.trim() || '7 Days'}
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5" /> Group
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-right">
              <span className="text-[9px] text-gray-400 block">From</span>
              <span className="text-[#1E3A8A] font-black text-lg">${tour.price}</span>
            </div>
            <Link
              to={link}
              className="w-9 h-9 bg-[#1E3A8A] rounded-xl flex items-center justify-center text-white hover:bg-[#10B981] transition-colors shadow-sm"
            >
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const FeaturedTours = () => {
  const { places, fetchPlaces, isLoading } = usePlaceStore();
  useEffect(() => { fetchPlaces(); }, [fetchPlaces]);

  const liveTours = places.slice(0, 4);
  const featured = liveTours.length >= 2 ? liveTours : FEATURED_SEED;

  return (
    <section id="tours" className="py-16 sm:py-20 md:py-24 bg-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#10B981]/5 rounded-full blur-3xl -mr-48 -mt-48 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#1E3A8A]/3 rounded-full blur-3xl -ml-32 -mb-32 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 sm:mb-12 gap-5">
          <div>
            <span className="section-label mb-3 block">Handpicked For You</span>
            <h2 className="heading-font text-3xl sm:text-4xl md:text-5xl text-[#0F172A]">
              Featured <span className="text-[#1E3A8A]">Tours</span>
            </h2>
            <p className="text-gray-500 text-sm md:text-base mt-2 sm:mt-3 max-w-lg leading-relaxed">
              Carefully crafted itineraries combining premium comfort with authentic local experiences — from Nepal's Himalayas to the world's finest destinations.
            </p>
          </div>
          <Link to="/destinations/all" className="btn-secondary flex-shrink-0 text-sm">
            All Tours <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-48 sm:h-56 bg-gray-50 rounded-2xl animate-pulse" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            {featured.map((tour, idx) => <TourCard key={tour.id} tour={tour} idx={idx} />)}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedTours;
