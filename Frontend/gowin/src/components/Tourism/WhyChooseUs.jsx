import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { WHY_CHOOSE_US } from '../../data/seedData';

const WhyChooseUs = () => (
  <section className="py-16 sm:py-20 md:py-24 bg-white relative overflow-hidden">
    <div className="absolute inset-0 opacity-[0.025] pointer-events-none" style={{
      backgroundImage: 'radial-gradient(#1E3A8A 1px, transparent 1px)',
      backgroundSize: '32px 32px',
    }} />
    <div className="absolute top-0 left-0 w-96 h-96 bg-[#1E3A8A]/4 rounded-full blur-3xl -ml-32 -mt-32 pointer-events-none" />

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12 sm:mb-14">
        <div>
          <span className="section-label mb-3 block">Why GoWin?</span>
          <h2 className="heading-font text-3xl sm:text-4xl md:text-5xl text-[#0F172A]">
            Travel Smarter, <span className="text-[#10B981]">Explore Further</span>
          </h2>
          <p className="text-gray-500 text-sm md:text-base mt-3 max-w-lg leading-relaxed">
            We're not just a travel agency — we're your local Nepal experts with a global reach, dedicated to crafting journeys that exceed expectations.
          </p>
        </div>
        <Link to="/about" className="btn-primary flex-shrink-0 self-start lg:self-auto">
          About Us <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {WHY_CHOOSE_US.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.07 }}
            className="group p-5 sm:p-6 rounded-2xl border border-gray-100 bg-white hover:bg-[#F8FAFC] hover:border-[#1E3A8A]/10 hover:shadow-md transition-all duration-300 cursor-default"
          >
            <div className="text-3xl mb-4">{item.icon}</div>
            <h3 className="text-base font-bold text-[#1E3A8A] mb-2 group-hover:text-[#10B981] transition-colors">{item.title}</h3>
            <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* Nepal specialty banner */}
      <div className="mt-10 sm:mt-12 relative rounded-2xl sm:rounded-3xl overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1516490701338-fd7e5a94d6d7?auto=format&fit=crop&w=1400&q=80"
          alt="Himalayas Nepal"
          className="w-full h-48 sm:h-64 object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B1220]/90 via-[#1E3A8A]/70 to-transparent" />
        <div className="absolute inset-0 flex items-center px-6 sm:px-10">
          <div className="max-w-lg">
            <span className="inline-block text-[10px] font-bold text-[#10B981] uppercase tracking-widest mb-2">🇳🇵 Nepal Specialists</span>
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3 leading-tight">
              The Best of Nepal, Guided by Locals
            </h3>
            <p className="text-white/70 text-xs sm:text-sm leading-relaxed mb-4 max-w-sm">
              Born in Kathmandu, we know every mountain trail, every hidden monastery and every teahouse worth visiting.
            </p>
            <Link to="/destinations/national" className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#10B981] text-white text-sm font-bold rounded-xl hover:bg-[#059669] transition-all shadow-lg">
              Explore Nepal <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default WhyChooseUs;
