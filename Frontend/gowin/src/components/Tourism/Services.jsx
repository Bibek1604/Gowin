import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, HelpCircle } from 'lucide-react';
import PageHero from '../ui/PageHero';
import ServicesGrid from './ServicesGrid';
import CTA from './CTA';
import { FAQS } from '../../data/siteContent';
import { useSEO } from '../../lib/seo';
import { BANNERS } from '../../data/pageBanners';

const Services = () => {
  const heroImage = BANNERS.services;
  useSEO({ title: 'Our Services', description: 'Nepal tours, international holiday packages, custom itineraries, flight tickets, hotel reservations, visa application assistance and travel insurance from GoWin Travels, Kathmandu.', path: '/services', image: heroImage || undefined });

  return (
    <div className="bg-white">
      <PageHero title="Services" label="What we offer" subtitle="Everything a trip needs — tours, holidays, tickets, hotels, visas and insurance — arranged by one team in Kathmandu." image={heroImage} crumbs={[{ label: 'Services' }]} size="sm" />
      <ServicesGrid full />
      <section className="py-14 sm:py-16 bg-[#F8FAFC]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-4 mb-6">
            <h2 className="heading-font text-2xl sm:text-3xl text-[#0F172A]">Common questions</h2>
            <Link to="/support" className="text-xs font-bold uppercase tracking-wider text-[#1E3A8A] hover:text-[#10B981] inline-flex items-center gap-1">All FAQs <ArrowRight className="w-3.5 h-3.5" /></Link>
          </div>
          <div className="space-y-3">
            {FAQS.slice(0, 4).map((f) => (
              <details key={f.q} className="group bg-white rounded-xl border border-gray-100 p-4 sm:p-5">
                <summary className="flex items-start gap-3 cursor-pointer list-none text-sm font-bold text-[#0F172A]"><HelpCircle className="w-4 h-4 text-[#10B981] flex-shrink-0 mt-0.5" />{f.q}</summary>
                <p className="mt-3 pl-7 text-sm text-gray-600 leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
      <CTA />
    </div>
  );
};

export default Services;
