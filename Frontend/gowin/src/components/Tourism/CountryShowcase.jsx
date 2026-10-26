import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Globe } from 'lucide-react';
import usePlaceStore, { selectPublished } from '../Store/PlaceStore';
import SectionHeader from '../ui/SectionHeader';
import SmartImage from '../ui/SmartImage';
import { countryFromLocation, coverImage, isNepal } from '../../lib/format';

/** International destinations grouped by country — counts and photos come from real packages. */
const CountryShowcase = ({ limit = 8, bg = 'bg-[#F8FAFC]' }) => {
  const { places, loaded } = usePlaceStore();
  const countries = useMemo(() => {
    const groups = new Map();
    for (const p of selectPublished(places)) {
      if (isNepal(p)) continue;
      const country = countryFromLocation(p.location);
      if (!country) continue;
      const g = groups.get(country) || { name: country, count: 0, image: null, sample: [] };
      g.count += 1;
      if (!g.image && coverImage(p)) g.image = coverImage(p);
      if (g.sample.length < 2) g.sample.push(p.title);
      groups.set(country, g);
    }
    return [...groups.values()].sort((a, b) => b.count - a.count || a.name.localeCompare(b.name)).slice(0, limit);
  }, [places, limit]);

  if (!loaded || countries.length === 0) return null;

  return (
    <section className={`py-14 sm:py-16 lg:py-20 ${bg}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          label="Browse by country" title="Where in the" accent="world?"
          subtitle="Holiday packages beyond Nepal, grouped by country. Flights, hotels and visas can be arranged alongside."
          className="mb-8"
          action={<Link to="/destinations/international" className="inline-flex items-center gap-2 px-5 py-2.5 border border-[#1E3A8A]/15 rounded-xl text-xs font-bold uppercase tracking-widest text-[#1E3A8A] hover:bg-[#1E3A8A] hover:text-white transition-colors"><Globe className="w-3.5 h-3.5" /> All countries</Link>}
        />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {countries.map((c, i) => (
            <motion.div key={c.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-40px' }} transition={{ delay: (i % 4) * 0.06 }}>
              <Link to={`/destinations/international?country=${encodeURIComponent(c.name)}`} className="group relative block h-40 sm:h-48 rounded-[22px] overflow-hidden shadow-[0_2px_16px_rgba(30,58,138,0.08)] hover:shadow-[0_20px_44px_rgba(30,58,138,0.2)] hover:-translate-y-1.5 transition-all duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#10B981]">
                <SmartImage src={c.image} alt={c.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1200ms]" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1220]/85 via-[#0B1220]/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4 flex items-end justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="text-white font-bold text-sm sm:text-base leading-tight">{c.name}</h3>
                    <p className="text-white/60 text-[11px] truncate">{c.sample.join(' · ')}</p>
                  </div>
                  <span className="flex-shrink-0 bg-white/15 backdrop-blur border border-white/20 text-white text-[10px] font-bold px-2 py-1 rounded-lg flex items-center gap-1">{c.count} <ArrowRight className="w-3 h-3" /></span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CountryShowcase;
