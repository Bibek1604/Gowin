import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, ArrowUpRight, Globe, Map as MapIcon, Clock, Tag, Star } from 'lucide-react';
import SmartImage from '../ui/SmartImage';
import { formatPrice, shortDuration, isNepal, placePath, coverImage } from '../../lib/format';

const SIZES = {
  carousel: 'min-w-[250px] sm:min-w-[280px] w-[250px] sm:w-[280px] flex-shrink-0 snap-start',
  // swipeable card on phones, ordinary grid cell from lg
  responsive: 'min-w-[250px] w-[250px] flex-shrink-0 snap-start lg:min-w-0 lg:w-auto lg:flex-shrink',
  grid: 'w-full',
};

/** Destination/package card used in carousels and grids. Shows only real data. */
const DestinationCard = ({ dest, index = 0, variant = 'grid', priority = false, rank = null }) => {
  const price = formatPrice(dest.price);
  const duration = shortDuration(dest.duration);
  const nepal = isNepal(dest);

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay: Math.min((index % 6) * 0.05, 0.3), duration: 0.45, ease: 'easeOut' }}
      className={SIZES[variant] || SIZES.grid}
    >
      <Link
        to={placePath(dest)}
        className="group relative flex flex-col h-full bg-white rounded-[22px] overflow-hidden border border-[#1E3A8A]/[0.07] shadow-[0_2px_14px_rgba(30,58,138,0.07)] hover:shadow-[0_22px_50px_rgba(30,58,138,0.2)] transition-all duration-500 hover:-translate-y-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#10B981]"
      >
        <div className={`relative overflow-hidden flex-shrink-0 ${variant === 'grid' ? 'aspect-[4/3]' : 'h-[200px] sm:h-[220px]'}`}>
          <SmartImage
            src={coverImage(dest)}
            alt={`${dest.title}${dest.location ? ` – ${dest.location}` : ''}`}
            priority={priority}
            className="w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.08]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent" />
          <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2">
            {dest.categories?.name ? (
              <span className="inline-flex items-center gap-1 bg-white/92 backdrop-blur px-2.5 py-1 rounded-full text-[10px] font-bold text-[#1E3A8A] shadow-sm">
                <Tag className="w-2.5 h-2.5 text-[#10B981]" /> {dest.categories.name}
              </span>
            ) : <span />}
            {dest.is_featured && (
              <span className="inline-flex items-center gap-1 bg-[#FBBF24] px-2 py-1 rounded-full text-[10px] font-bold text-[#0F172A] shadow-sm">
                <Star className="w-2.5 h-2.5 fill-current" /> Featured
              </span>
            )}
          </div>
          <span className="absolute bottom-3 left-3 inline-flex items-center gap-1 bg-[#0F172A]/70 backdrop-blur px-2 py-1 rounded-lg text-[10px] font-bold text-white">
            {nepal ? <MapIcon className="w-2.5 h-2.5 text-[#34D399]" /> : <Globe className="w-2.5 h-2.5 text-[#34D399]" />}
            {nepal ? 'Nepal' : 'International'}
          </span>
          {rank && (
            <span aria-label={`Number ${rank}`} className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur border border-white text-[#1E3A8A] text-xs font-black flex items-center justify-center shadow-sm">
              {String(rank).padStart(2, '0')}
            </span>
          )}
        </div>

        <div className="p-4 sm:p-5 flex flex-col flex-1">
          {dest.location && (
            <p className="flex items-center gap-1 text-[#10B981] text-[10px] font-bold uppercase tracking-widest mb-1.5">
              <MapPin className="w-3 h-3 flex-shrink-0" /><span className="truncate">{dest.location}</span>
            </p>
          )}
          <h3 className="text-[15px] sm:text-base font-bold text-[#0F172A] leading-snug line-clamp-2 group-hover:text-[#1E3A8A] transition-colors min-h-[2.6em]">
            {dest.title}
          </h3>
          <div className="mt-auto pt-3 flex items-end justify-between border-t border-dashed border-gray-200 mt-3">
            <div>
              {price ? (
                <>
                  <span className="block text-[9px] font-bold uppercase tracking-widest text-gray-400">From</span>
                  <span className="text-[#1E3A8A] text-xl font-black leading-none">{price}</span>
                  <span className="text-gray-400 text-[10px] font-semibold ml-1">/ person</span>
                </>
              ) : (
                <span className="text-sm font-bold text-[#1E3A8A]">Price on request</span>
              )}
            </div>
            <div className="flex flex-col items-end gap-1.5">
              {duration && <span className="flex items-center gap-1 text-gray-500 text-[11px] font-medium"><Clock className="w-3 h-3" />{duration}</span>}
              <span className="w-8 h-8 rounded-full bg-[#1E3A8A]/5 border border-[#1E3A8A]/10 flex items-center justify-center transition-all duration-300 group-hover:bg-[#10B981] group-hover:border-[#10B981] group-hover:rotate-45">
                <ArrowUpRight className="w-4 h-4 text-[#1E3A8A] group-hover:text-white transition-colors" />
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
};

export default DestinationCard;
