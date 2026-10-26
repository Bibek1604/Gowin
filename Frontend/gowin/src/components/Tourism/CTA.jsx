import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Phone, MessageCircle } from 'lucide-react';
import useSettingsStore from '../Store/SettingsStore';
import usePlaceStore, { selectPublished } from '../Store/PlaceStore';
import SmartImage from '../ui/SmartImage';
import { whatsappLink, coverImage } from '../../lib/format';

const CTA = () => {
  const { settings } = useSettingsStore();
  const { places } = usePlaceStore();
  const bg = selectPublished(places).filter(coverImage);
  const image = coverImage(bg[bg.length - 1]);
  const wa = whatsappLink(settings.whatsapp || settings.phone, 'Hello GoWin Travels, I would like a quote for a trip.');

  return (
    <section className="relative py-20 sm:py-24 overflow-hidden bg-[#0B1220]">
      {image && <SmartImage src={image} alt="" className="absolute inset-0 w-full h-full object-cover" />}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0B1220]/95 via-[#1E3A8A]/85 to-[#0B1220]/80" />
      <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <span className="inline-flex items-center gap-2 bg-[#10B981]/20 border border-[#10B981]/30 px-4 py-1.5 rounded-full mb-6 text-[#34D399] text-[10px] font-bold uppercase tracking-widest">Free quotation · No payment to enquire</span>
        <h2 className="heading-font text-3xl sm:text-4xl lg:text-5xl text-white mb-4">Tell us where you want to go.<br /><span className="text-[#34D399]">We'll plan the rest.</span></h2>
        <p className="text-white/70 text-sm sm:text-base lg:text-lg leading-relaxed max-w-xl mx-auto mb-8">Send your dates, group size and ideas — you'll get a written itinerary and price from our Kathmandu team.</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link to="/booking" className="w-full sm:w-auto btn-primary justify-center !px-7 !py-4">Request a quote <ArrowRight className="w-4 h-4" /></Link>
          {wa && <a href={wa} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 bg-white/10 border border-white/20 text-white font-bold text-sm rounded-[0.875rem] hover:bg-white/20 transition-colors"><MessageCircle className="w-4 h-4 text-[#34D399]" /> WhatsApp us</a>}
          {settings.phone && <a href={`tel:${settings.phone.replace(/\s+/g, '')}`} className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 bg-white/10 border border-white/20 text-white font-bold text-sm rounded-[0.875rem] hover:bg-white/20 transition-colors"><Phone className="w-4 h-4" /> {settings.phone}</a>}
        </div>
      </motion.div>
    </section>
  );
};

export default CTA;
