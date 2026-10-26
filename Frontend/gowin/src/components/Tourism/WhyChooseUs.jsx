import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { WHY_CHOOSE_US } from '../../data/siteContent';
import { iconFor } from '../../lib/icons';
import SectionHeader from '../ui/SectionHeader';
import SmartImage from '../ui/SmartImage';
import usePlaceStore, { selectPublished } from '../Store/PlaceStore';
import { coverImage, isNepal } from '../../lib/format';

const WhyChooseUs = () => {
  const { places } = usePlaceStore();
  const banner = selectPublished(places).find((p) => isNepal(p) && p.is_featured && coverImage(p)) || selectPublished(places).find((p) => isNepal(p) && coverImage(p));

  return (
    <section className="py-14 sm:py-16 lg:py-20 bg-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#1E3A8A 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <SectionHeader
          label="Why GoWin" title="Travel planned by people" accent="you can reach"
          subtitle="A small Kathmandu team that answers the phone, writes clear quotes and handles the paperwork."
          className="mb-10"
          action={<Link to="/about" className="btn-primary">About us <ArrowRight className="w-4 h-4" /></Link>}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {WHY_CHOOSE_US.map((item, i) => {
            const Icon = iconFor(item.icon);
            return (
              <motion.div key={item.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: (i % 3) * 0.07 }}
                className="group p-6 rounded-2xl border border-gray-100 bg-white hover:bg-[#F8FAFC] hover:border-[#1E3A8A]/15 hover:shadow-md transition-all duration-300">
                <span className="w-10 h-10 rounded-xl bg-[#10B981]/10 text-[#059669] flex items-center justify-center mb-4"><Icon className="w-5 h-5" /></span>
                <h3 className="text-base font-bold text-[#0F172A] mb-1.5">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </motion.div>
            );
          })}
        </div>

        {banner && (
          <div className="mt-10 relative rounded-3xl overflow-hidden min-h-[240px] flex items-center">
            <SmartImage src={coverImage(banner)} alt="" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0B1220]/92 via-[#1E3A8A]/75 to-[#0B1220]/30" />
            <div className="relative p-7 sm:p-10 max-w-lg">
              <span className="text-[10px] font-bold text-[#34D399] uppercase tracking-widest">Based in Kathmandu</span>
              <h3 className="heading-font text-2xl sm:text-3xl text-white mt-2 mb-3">The best of Nepal, arranged by locals</h3>
              <p className="text-white/70 text-sm leading-relaxed mb-5">Temples, lakes, jungles and mountain views — we know the hotels, drivers and guides, so you don't have to.</p>
              <Link to="/destinations/national" className="btn-primary">Explore Nepal <ArrowRight className="w-4 h-4" /></Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default WhyChooseUs;
