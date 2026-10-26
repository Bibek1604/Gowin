import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { SERVICES } from '../../data/siteContent';
import { iconFor } from '../../lib/icons';
import SectionHeader from '../ui/SectionHeader';

/** The services the company actually offers. `full` shows long descriptions (Services page). */
const ServicesGrid = ({ full = false, header = true }) => (
  <section className={`${full ? 'py-14 sm:py-16' : 'py-14 sm:py-16 lg:py-20'} bg-white`}>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {header && (
        <SectionHeader
          label="What we do" title="One team for the" accent="whole journey"
          subtitle="Tours, holidays, tickets, hotels, visas and insurance — arranged together so you only deal with one point of contact."
          align="center" className="mb-10"
          action={!full ? <Link to="/services" className="btn-secondary text-sm">All services <ArrowRight className="w-4 h-4" /></Link> : null}
        />
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {SERVICES.map((s, i) => {
          const Icon = iconFor(s.icon);
          return (
            <motion.div key={s.slug} id={s.slug} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: (i % 3) * 0.07 }}
              className="group flex flex-col p-6 rounded-2xl border border-gray-100 bg-white hover:bg-[#F8FAFC] hover:border-[#1E3A8A]/15 hover:shadow-md transition-all duration-300">
              <span className="w-11 h-11 rounded-xl bg-[#1E3A8A]/8 text-[#1E3A8A] flex items-center justify-center mb-4 group-hover:bg-[#10B981] group-hover:text-white transition-colors"><Icon className="w-5 h-5" /></span>
              <h3 className="text-base font-bold text-[#0F172A] mb-1.5">{s.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed flex-1">{full ? s.desc : s.short}</p>
              <Link to={s.link} className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-[#1E3A8A] group-hover:text-[#10B981] uppercase tracking-wider">{s.cta} <ArrowRight className="w-3.5 h-3.5" /></Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  </section>
);

export default ServicesGrid;
