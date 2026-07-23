import React from 'react';
import { ArrowRight, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const CTA = () => (
  <section className="relative py-20 sm:py-24 overflow-hidden">
    {/* Background */}
    <div className="absolute inset-0">
      <img
        src="https://images.unsplash.com/photo-1605640840605-14ac1855827b?auto=format&fit=crop&w=1600&q=80"
        alt="Travel CTA"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a1f2b]/96 via-[#0F4C5C]/88 to-[#0a2430]/80" />
    </div>

    <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div className="inline-flex items-center gap-2 bg-[#FF7F50]/20 border border-[#FF7F50]/30 px-4 py-1.5 rounded-full mb-6">
          <span className="w-2 h-2 bg-[#FF7F50] rounded-full animate-pulse" />
          <span className="text-[#FF7F50] text-[10px] font-bold uppercase tracking-widest">Limited Spots Available</span>
        </div>

        <h2 className="heading-font text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white mb-5 leading-tight">
          Your Dream Trip Is<br />
          <span className="text-[#FF7F50]">One Click Away</span>
        </h2>

        <p className="text-white/65 text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl mx-auto mb-8 sm:mb-10">
          From the peaks of the Himalayas to the beaches of the Maldives — let GoWin Travels handle every detail while you focus on making memories.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/booking"
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-7 py-4 bg-[#FF7F50] text-white font-bold text-sm rounded-xl hover:bg-[#e56a42] transition-all shadow-xl shadow-[#FF7F50]/30 hover:scale-105"
          >
            Book Your Trip Now <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href="tel:+9779851410966"
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-7 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-bold text-sm rounded-xl hover:bg-white/20 transition-all"
          >
            <Phone className="w-4 h-4" /> +977 9851410966
          </a>
        </div>

        {/* Trust signals */}
        <div className="flex items-center justify-center gap-6 mt-8 flex-wrap">
          {['✅ Free Cancellation', '🔒 Secure Booking', '24/7 Support'].map((t, i) => (
            <span key={i} className="text-white/50 text-xs font-medium">{t}</span>
          ))}
        </div>
      </motion.div>
    </div>
  </section>
);

export default CTA;
