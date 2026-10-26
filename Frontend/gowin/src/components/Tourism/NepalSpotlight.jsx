import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, ArrowRight, MapPin } from 'lucide-react';
import usePlaceStore, { selectPublished, sortPlaces } from '../Store/PlaceStore';
import SectionHeader from '../ui/SectionHeader';
import SmartImage from '../ui/SmartImage';
import { formatPrice, shortDuration, isNepal, placePath, coverImage } from '../../lib/format';

/** Expanding-card showcase of featured Nepal experiences (real data only). */
const NepalSpotlight = () => {
  const { places } = usePlaceStore();
  const spots = useMemo(() => {
    const nepal = selectPublished(places).filter((p) => isNepal(p) && coverImage(p));
    return sortPlaces(nepal, 'featured').slice(0, 5);
  }, [places]);
  const [active, setActive] = useState(0);

  if (spots.length < 3) return null;

  return (
    <section className="py-14 sm:py-16 lg:py-20 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          label="Nepal spotlight" title="Experiences across" accent="Nepal"
          subtitle="Heritage cities, sacred sites, jungle safaris and lakeside escapes — hover or tap a card to preview it."
          className="mb-8"
          action={<Link to="/destinations/national" className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 border border-[#1E3A8A]/15 rounded-xl text-xs font-bold uppercase tracking-widest text-[#1E3A8A] hover:bg-[#1E3A8A] hover:text-white transition-colors">All Nepal tours <ArrowRight className="w-3.5 h-3.5" /></Link>}
        />
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.6 }} className="flex flex-col lg:flex-row gap-3 lg:h-[480px]">
          {spots.map((p, i) => {
            const isActive = i === active;
            return (
              <div
                key={p.id}
                onMouseEnter={() => setActive(i)}
                onClick={() => setActive(i)}
                className={`relative rounded-3xl overflow-hidden cursor-pointer transition-all duration-500 ease-out h-56 lg:h-full ${isActive ? 'lg:flex-[4]' : 'lg:flex-[1]'}`}
              >
                <SmartImage src={coverImage(p)} alt={p.title} className="absolute inset-0 w-full h-full object-cover" />
                <div className={`absolute inset-0 transition-opacity duration-500 ${isActive ? 'bg-gradient-to-t from-[#0B1220]/90 via-[#0B1220]/30 to-transparent' : 'bg-[#0B1220]/45'}`} />
                <span className="absolute top-4 left-4 w-9 h-9 rounded-xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center text-white text-xs font-bold">{String(i + 1).padStart(2, '0')}</span>
                {!isActive && (
                  <div className="absolute inset-0 hidden lg:flex items-center justify-center">
                    <span className="text-white font-bold text-lg whitespace-nowrap -rotate-90 drop-shadow">{p.title}</span>
                  </div>
                )}
                <div className={`absolute bottom-0 inset-x-0 p-5 sm:p-7 transition-all duration-500 ${isActive ? 'opacity-100 translate-y-0' : 'lg:opacity-0 lg:translate-y-4'}`}>
                  {p.location && <p className="flex items-center gap-1.5 text-[#34D399] text-[10px] font-bold uppercase tracking-[0.2em] mb-2"><MapPin className="w-3 h-3" /> {p.location}</p>}
                  <h3 className="heading-font text-xl sm:text-3xl text-white mb-2">{p.title}</h3>
                  {p.description && <p className="text-white/70 text-sm mb-4 line-clamp-2 max-w-lg">{p.description}</p>}
                  <div className="flex flex-wrap items-center gap-3">
                    {shortDuration(p.duration) && <span className="inline-flex items-center gap-1.5 bg-white/10 border border-white/15 px-3 py-1.5 rounded-full text-white text-xs font-semibold"><Clock className="w-3 h-3" /> {shortDuration(p.duration)}</span>}
                    <span className="text-white text-sm font-bold">{formatPrice(p.price) ? <><span className="text-white/50 text-[10px] uppercase mr-1">From</span>{formatPrice(p.price)}</> : 'Price on request'}</span>
                    <Link to={placePath(p)} className="ml-auto inline-flex items-center gap-2 bg-white text-[#0F172A] px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-[#10B981] hover:text-white transition-colors">
                      View details <ArrowRight className="w-3.5 h-3.5" />
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

export default NepalSpotlight;
