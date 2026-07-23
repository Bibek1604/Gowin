import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Star, ArrowUpRight, Globe, Map, Clock, Heart, Tag } from 'lucide-react';
import PropTypes from 'prop-types';

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=700&q=80';

const VARIANT_SIZES = {
  carousel: 'min-w-[240px] sm:min-w-[272px] w-[240px] sm:w-[272px] flex-shrink-0 snap-start',
  grid: 'w-full',
};

const DestinationCard = ({ dest, index = 0, variant = 'grid' }) => {
  const [liked, setLiked] = useState(false);
  const isSeed = String(dest.id).startsWith('seed-');
  const to = isSeed ? '/details/all' : `/places/${dest.id}`;
  const category = dest.categories?.name;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay: Math.min((index % 6) * 0.06, 0.35), duration: 0.5, ease: 'easeOut' }}
      className={VARIANT_SIZES[variant] || VARIANT_SIZES.grid}
    >
      <Link
        to={to}
        className="group relative flex flex-col h-full bg-white rounded-[26px] overflow-hidden border border-[#0F4C5C]/[0.06] shadow-[0_2px_16px_rgba(15,76,92,0.08)] hover:shadow-[0_24px_56px_rgba(15,76,92,0.22)] transition-all duration-500 ease-out hover:-translate-y-2"
      >
        {/* Hover ring accent */}
        <div className="pointer-events-none absolute inset-0 rounded-[26px] ring-1 ring-inset ring-transparent group-hover:ring-[#FF7F50]/30 transition-all duration-500 z-20" />

        {/* Image */}
        <div className={`relative w-full overflow-hidden flex-shrink-0 ${variant === 'carousel' ? 'h-[190px] sm:h-[215px]' : 'h-[210px] sm:h-[230px]'}`}>
          <img
            src={dest.images?.[0] || FALLBACK_IMG}
            alt={dest.title}
            loading="lazy"
            className="w-full h-full object-cover scale-100 group-hover:scale-[1.12] transition-transform duration-[1400ms] ease-out"
          />
          {/* Base gradient for legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-black/10" />
          {/* Hover intensify */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F4C5C]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Top row: category + wishlist */}
          <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2 z-10">
            {category ? (
              <span className="inline-flex items-center gap-1 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[9px] font-bold text-[#0F4C5C] shadow-sm">
                <Tag className="w-2.5 h-2.5 text-[#FF7F50]" />
                {category}
              </span>
            ) : <span />}

            <button
              type="button"
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setLiked(v => !v); }}
              aria-label="Save destination"
              className="w-7 h-7 rounded-full bg-black/25 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-black/40 transition-colors flex-shrink-0"
            >
              <Heart className={`w-3.5 h-3.5 transition-colors ${liked ? 'text-[#FF7F50] fill-[#FF7F50]' : 'text-white'}`} />
            </button>
          </div>

          {/* Bottom-left: rating, bottom-right: type */}
          <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between z-10">
            <span className="inline-flex items-center gap-1 bg-white/95 backdrop-blur-md px-2 py-1 rounded-lg text-[9px] font-bold text-[#0F4C5C] shadow-sm">
              <Star className="w-2.5 h-2.5 text-[#FFD23F] fill-[#FFD23F]" />
              {dest.rating || dest.place_details?.rating || '4.9'}
            </span>
            <span className="inline-flex items-center gap-1 bg-[#0F4C5C]/85 backdrop-blur-md px-2 py-1 rounded-lg text-[8px] font-bold text-white/95">
              {dest.destination_type === 'National' ? <Map className="w-2.5 h-2.5" /> : <Globe className="w-2.5 h-2.5" />}
              {dest.destination_type === 'National' ? 'Nepal' : 'Intl'}
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="p-4 sm:p-5 flex flex-col justify-between flex-1">
          <div>
            <div className="flex items-center gap-1 text-[#FF7F50] mb-1.5 font-bold text-[9px] uppercase tracking-widest">
              <MapPin className="w-2.5 h-2.5 flex-shrink-0" />
              <span className="truncate">{dest.location}</span>
            </div>
            <h3 className="text-[14px] sm:text-[15px] text-[#1a1a2e] font-bold tracking-tight leading-snug line-clamp-2 group-hover:text-[#0F4C5C] transition-colors min-h-[2.6em]">
              {dest.title}
            </h3>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-dashed border-gray-200 mt-3">
            <div>
              <span className="text-gray-400 text-[8px] font-bold uppercase tracking-widest block mb-0.5">From</span>
              <div className="flex items-baseline gap-0.5">
                <span className="text-[#0F4C5C] text-xl sm:text-2xl font-black">${dest.price}</span>
                <span className="text-gray-400 text-[8px] font-bold uppercase">/pp</span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1.5">
              <div className="flex items-center gap-1 text-gray-400 text-[9px]">
                <Clock className="w-2.5 h-2.5" />
                <span>{dest.duration?.split('/')[0]?.trim() || 'Flexible'}</span>
              </div>
              <div className="w-8 h-8 sm:w-9 sm:h-9 bg-[#0F4C5C]/5 border border-[#0F4C5C]/10 rounded-full flex items-center justify-center transition-all duration-300 group-hover:bg-gradient-to-br group-hover:from-[#FF7F50] group-hover:to-[#ff9a7a] group-hover:border-transparent group-hover:rotate-45">
                <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#0F4C5C] group-hover:text-white transition-colors" />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

DestinationCard.propTypes = {
  dest: PropTypes.object.isRequired,
  index: PropTypes.number,
  variant: PropTypes.oneOf(['carousel', 'grid']),
};

export default DestinationCard;
