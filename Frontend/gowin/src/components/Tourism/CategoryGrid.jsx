import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import useCategoryStore, { selectActive } from '../Store/CategoryStore';
import usePlaceStore, { selectPublished } from '../Store/PlaceStore';
import SectionHeader from '../ui/SectionHeader';
import SmartImage from '../ui/SmartImage';
import { CardSkeleton } from '../ui/Skeleton';
import { categoryIcon } from '../../lib/icons';
import { coverImage } from '../../lib/format';

/** Browse-by-experience grid: only categories that actually have published packages. */
const CategoryGrid = ({ limit = 8, title = 'Browse by', accent = 'experience', compact = false }) => {
  const { categories, loaded: catsLoaded } = useCategoryStore();
  const { places, loaded: placesLoaded } = usePlaceStore();

  const items = useMemo(() => {
    const published = selectPublished(places);
    return selectActive(categories)
      .map((c) => {
        const inCat = published.filter((p) => p.category_id === c.id);
        return { ...c, count: inCat.length, image: c.image_url || coverImage(inCat.find(coverImage)) };
      })
      .filter((c) => c.count > 0)
      .slice(0, limit);
  }, [categories, places, limit]);

  const loading = !catsLoaded || !placesLoaded;
  if (!loading && items.length === 0) return null;

  return (
    <section className={`${compact ? 'py-10' : 'py-14 sm:py-16 lg:py-20'} bg-white`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {!compact && (
          <SectionHeader label="Travel styles" title={title} accent={accent} subtitle="Every package is grouped by the kind of experience it offers, so you can jump straight to what you love." align="center" className="mb-10" />
        )}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {loading ? <CardSkeleton count={4} className="h-40 sm:h-48" /> : items.map((c, i) => {
            const Icon = categoryIcon(c.name);
            return (
              <motion.div key={c.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: (i % 4) * 0.06 }}>
                <Link to={`/destinations?category=${encodeURIComponent(c.slug || c.name)}`} className="group relative block h-40 sm:h-48 rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(15,23,42,0.08)] hover:shadow-[0_18px_40px_rgba(15,23,42,0.18)] hover:-translate-y-1 transition-all duration-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#10B981]">
                  <SmartImage src={c.image} alt="" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B1220]/90 via-[#0B1220]/25 to-transparent" />
                  <div className="absolute inset-0 p-4 flex flex-col justify-end">
                    <span className="w-9 h-9 rounded-xl bg-white/15 backdrop-blur border border-white/20 text-white flex items-center justify-center mb-2 group-hover:bg-[#10B981] group-hover:border-[#10B981] transition-colors"><Icon className="w-4 h-4" /></span>
                    <h3 className="text-white font-bold text-sm sm:text-base leading-tight">{c.name}</h3>
                    <p className="text-white/60 text-[11px] flex items-center gap-1 mt-0.5">{c.count} package{c.count === 1 ? '' : 's'} <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" /></p>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;
