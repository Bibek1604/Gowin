import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Globe } from 'lucide-react';
import { SEED_COUNTRIES } from '../../data/seedData';

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=600&q=80';

// International destinations grouped by country
const CountryShowcase = () => (
  <section className="py-12 md:py-16 bg-[#F8FAFC] relative overflow-hidden">
    <div className="absolute top-0 left-0 w-72 h-72 bg-[#0EA5E9]/5 rounded-full blur-3xl -ml-20 -mt-20 pointer-events-none" />

    <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
      <div className="flex flex-col sm:flex-row justify-between sm:items-end mb-7 sm:mb-8 gap-4 border-b border-gray-100 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#1E3A8A]/5 text-[#1E3A8A] rounded-lg text-[9px] font-black uppercase tracking-widest mb-3 border border-[#1E3A8A]/10">
            <Globe className="w-3 h-3 text-[#10B981]" /> Browse by Country
          </div>
          <h2 className="heading-font text-2xl sm:text-3xl md:text-4xl text-[#0F172A] tracking-tight leading-none">
            Where in the <span className="text-[#1E3A8A]">World?</span>
          </h2>
          <p className="text-gray-500 text-xs sm:text-sm mt-2 max-w-md leading-relaxed">
            Handpicked tour collections across 20+ countries — pick a flag and start packing.
          </p>
        </div>
        <Link
          to="/destinations/international"
          className="group flex items-center gap-2 px-5 py-2.5 bg-white border border-[#1E3A8A]/10 text-[#1E3A8A] rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-[#1E3A8A] hover:text-white transition-all shadow-sm self-start sm:self-auto"
        >
          All Countries <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
        {SEED_COUNTRIES.map((c, i) => (
          <motion.div
            key={c.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ delay: Math.min((i % 4) * 0.06, 0.3), duration: 0.45 }}
          >
            <Link
              to="/destinations/international"
              className="group relative block h-40 sm:h-48 rounded-[22px] overflow-hidden shadow-[0_2px_16px_rgba(30,58,138,0.08)] hover:shadow-[0_20px_44px_rgba(30,58,138,0.22)] transition-all duration-500 hover:-translate-y-1.5"
            >
              <img
                src={c.image}
                alt={c.name}
                loading="lazy"
                onError={(e) => { if (e.currentTarget.src !== FALLBACK_IMG) e.currentTarget.src = FALLBACK_IMG; }}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1200ms] ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B1220]/85 via-[#0B1220]/25 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4">
                <div className="flex items-end justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="text-white font-bold text-sm sm:text-base tracking-tight leading-tight">{c.name}</h3>
                    <p className="text-white/60 text-[10px] sm:text-[11px] leading-snug truncate">{c.tagline}</p>
                  </div>
                  <span className="flex-shrink-0 bg-white/15 backdrop-blur-md border border-white/20 text-white text-[9px] font-bold px-2 py-1 rounded-lg">
                    {c.packages} tours
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default CountryShowcase;
