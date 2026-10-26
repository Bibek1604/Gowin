import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';
import PageHero from '../ui/PageHero';
import DestinationCarousel from './DestinationCarousel';
import usePlaceStore, { selectPublished, sortPlaces } from '../Store/PlaceStore';
import { NEPAL_TRAVEL_TIPS } from '../../data/siteContent';
import { iconFor } from '../../lib/icons';
import { useSEO } from '../../lib/seo';
import { useHeroImage } from '../../lib/useHeroImage';
import { isNepal } from '../../lib/format';

const TravelGuides = () => {
  const { places, loaded } = usePlaceStore();
  const heroImage = useHeroImage(/nagarkot|pokhara|sarangkot/i, { nepalOnly: true });
  useSEO({ title: 'Nepal Travel Tips & Guides', description: 'Practical advice for visiting Nepal: best season, visa on arrival, getting around, packing, money and cultural etiquette, from a Kathmandu travel company.', path: '/guides', image: heroImage || undefined });
  const nepal = sortPlaces(selectPublished(places).filter(isNepal), 'featured').slice(0, 10);

  return (
    <div className="bg-white">
      <PageHero title="Nepal travel tips" label="Before you go" subtitle="Practical, up-to-date pointers from our Kathmandu team — seasons, visas, transport, packing and etiquette." image={heroImage} crumbs={[{ label: 'Travel tips' }]} size="sm" />
      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {NEPAL_TRAVEL_TIPS.map((tip, i) => {
            const Icon = iconFor(tip.icon);
            return (
              <motion.article key={tip.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: (i % 3) * 0.07 }} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow">
                <span className="w-11 h-11 rounded-xl bg-[#1E3A8A]/8 text-[#1E3A8A] flex items-center justify-center mb-4"><Icon className="w-5 h-5" /></span>
                <h2 className="text-base font-bold text-[#0F172A] mb-3">{tip.title}</h2>
                <ul className="space-y-2">
                  {tip.points.map((p) => <li key={p} className="flex items-start gap-2 text-sm text-gray-600 leading-relaxed"><Check className="w-4 h-4 text-[#10B981] flex-shrink-0 mt-0.5" />{p}</li>)}
                </ul>
              </motion.article>
            );
          })}
        </div>
        <p className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 text-xs text-gray-400">Visa rules, fees and transport schedules change. We confirm the current requirements for your nationality and dates when you book with us.</p>
      </section>
      <DestinationCarousel label="Put it into practice" title="Popular Nepal" accent="experiences" items={nepal} loading={!loaded} linkTo="/destinations/national" bg="bg-[#F8FAFC]" />
      <section className="py-14 bg-[#1E3A8A] text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="heading-font text-2xl sm:text-3xl mb-3">Need help with visas, tickets or planning?</h2>
          <p className="text-white/70 text-sm sm:text-base mb-6">Our team handles paperwork and logistics for Nepal and for your trips abroad.</p>
          <Link to="/contact" className="btn-primary">Talk to us <ArrowRight className="w-4 h-4" /></Link>
        </div>
      </section>
    </div>
  );
};

export default TravelGuides;
