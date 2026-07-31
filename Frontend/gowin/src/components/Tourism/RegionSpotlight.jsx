import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Clock, ArrowRight, MapPin } from 'lucide-react';
import usePlaceStore from '../Store/PlaceStore';
import { SEED_DESTINATIONS_NEPAL } from '../../data/seedData';

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=900&q=75';

// Expanding-cards showcase. Every card strictly uses its own place's image + data.
const RegionSpotlight = () => {
  const { places } = usePlaceStore();
  const source = places.length > 0 ? places : SEED_DESTINATIONS_NEPAL;
  const spots = source.filter(p => (p.destination_type || 'National') === 'National').slice(0, 5);
  const [active, setActive] = useState(Math.min(2, Math.max(spots.length - 1, 0)));

  if (spots.length === 0) return null;

  return (
    <section className="py-14 sm:py-20 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="flex items-end justify-between gap-4 mb-8 sm:mb-10">
          <div>
            <span className="section-label mb-3">Himalayan Spotlight</span>
            <h2 className="heading-font text-3xl sm:text-4xl text-[#0F172A]">
              Treks of <span className="text-[#10B981]">Nepal</span>
            </h2>
            <p className="text-gray-500 text-sm sm:text-base mt-2 max-w-xl">
              A hand-picked shortlist — each card opens the full route, itinerary and booking.
            </p>
          </div>
          <Link
            to="/destinations/national"
            className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 border border-[#1E3A8A]/15 rounded-xl text-xs font-bold uppercase tracking-widest text-[#1E3A8A] hover:bg-[#1E3A8A] hover:text-white transition-all flex-shrink-0"
          >
            View All <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </motion.div>

        {/* Expanding cards */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 }}
          className="flex flex-col lg:flex-row gap-3 lg:h-[480px]">
          {spots.map((p, i) => {
            const isActive = i === active;
            return (
              <div
                key={p.id}
                onMouseEnter={() => setActive(i)}
                onClick={() => setActive(i)}
                className={`relative rounded-3xl overflow-hidden cursor-pointer transition-all duration-500 ease-out h-56 lg:h-full ${
                  isActive ? 'lg:flex-[4]' : 'lg:flex-[1]'
                }`}
              >
                <img
                  src={p.images?.[0] || FALLBACK_IMG}
                  alt={p.title}
                  loading="lazy"
                  onError={(e) => { if (e.currentTarget.src !== FALLBACK_IMG) e.currentTarget.src = FALLBACK_IMG; }}
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div className={`absolute inset-0 transition-opacity duration-500 ${
                  isActive ? 'bg-gradient-to-t from-[#0B1220]/90 via-[#0B1220]/30 to-transparent' : 'bg-[#0B1220]/40'
                }`} />

                {/* Number badge */}
                <span className="absolute top-4 left-4 z-10 w-9 h-9 rounded-xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center text-white text-xs font-bold">
                  {String(i + 1).padStart(2, '0')}
                </span>

                {/* Collapsed: vertical title */}
                {!isActive && (
                  <div className="absolute inset-0 hidden lg:flex items-center justify-center">
                    <span className="text-white font-bold text-lg tracking-tight whitespace-nowrap -rotate-90 drop-shadow-md">
                      {p.title}
                    </span>
                  </div>
                )}

                {/* Expanded content */}
                <div className={`absolute bottom-0 left-0 right-0 p-5 sm:p-7 transition-all duration-500 ${
                  isActive ? 'opacity-100 translate-y-0' : 'opacity-100 lg:opacity-0 lg:translate-y-4'
                }`}>
                  <div className="flex items-center gap-1.5 text-[#10B981] text-[10px] font-bold uppercase tracking-[0.2em] mb-2">
                    <MapPin className="w-3 h-3" /> {p.location}
                  </div>
                  <h3 className="heading-font text-xl sm:text-3xl text-white mb-2">{p.title}</h3>
                  <p className="text-white/70 text-sm mb-4 line-clamp-2 max-w-lg">{p.description}</p>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-sm border border-white/15 px-3 py-1.5 rounded-full text-white text-xs font-semibold">
                      <Clock className="w-3 h-3" /> {p.duration?.split('/')[0]?.trim() || 'Flexible'}
                    </span>
                    <span className="text-white text-sm font-bold">
                      <span className="text-white/50 text-[10px] font-bold uppercase mr-1">From</span>${p.price}
                    </span>
                    <Link
                      to={`/places/${p.id}`}
                      className="ml-auto inline-flex items-center gap-2 bg-white text-[#0F172A] px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-[#10B981] hover:text-white transition-all"
                    >
                      Open the route <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default RegionSpotlight;
