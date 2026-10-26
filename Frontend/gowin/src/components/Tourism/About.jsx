import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Users, ShieldCheck, Landmark } from 'lucide-react';
import usePlaceStore, { selectPublished } from '../Store/PlaceStore';
import useSettingsStore from '../Store/SettingsStore';
import PageHero from '../ui/PageHero';
import SmartImage from '../ui/SmartImage';
import ServicesGrid from './ServicesGrid';
import CTA from './CTA';
import { useSEO, agencyJsonLd } from '../../lib/seo';
import { useHeroImage } from '../../lib/useHeroImage';
import { isNepal, countryFromLocation } from '../../lib/format';

const VALUES = [
  { Icon: MapPin, title: 'Local knowledge', desc: 'We are based in Kathmandu and arrange Nepal tours with hotels, drivers and guides we work with regularly.' },
  { Icon: Users, title: 'Personal service', desc: 'Every request is handled by a named team member from first enquiry to the end of the trip.' },
  { Icon: ShieldCheck, title: 'Clear terms', desc: 'Quotes list what is included and excluded; refund terms of airlines, hotels and partners are shared before you pay.' },
  { Icon: Landmark, title: 'Complete travel support', desc: 'Tours, holidays, flight tickets, hotels, visa assistance and insurance arranged under one roof.' },
];

const About = () => {
  const { places, loaded } = usePlaceStore();
  const { settings } = useSettingsStore();
  const heroImage = useHeroImage(/kathmandu|bhaktapur|patan/i, { nepalOnly: true });
  const storyImage = useHeroImage(/bhaktapur|pokhara/i, { nepalOnly: true });
  useSEO({ title: 'About Us', description: `${settings.business_name} is a Kathmandu-based travel company offering Nepal tours, international holidays, flights, hotels and visa assistance.`, path: '/about', image: heroImage || undefined, jsonLd: agencyJsonLd(settings) });

  const facts = useMemo(() => {
    const pub = selectPublished(places);
    const countries = new Set(pub.filter((p) => !isNepal(p)).map((p) => countryFromLocation(p.location)).filter(Boolean));
    return [
      { value: pub.filter(isNepal).length, label: 'Nepal experiences' },
      { value: pub.filter((p) => !isNepal(p)).length, label: 'International packages' },
      { value: countries.size, label: 'Countries covered' },
    ];
  }, [places]);

  return (
    <div className="bg-white">
      <PageHero title={`About ${settings.business_name}`} label="Our story" subtitle="A Kathmandu travel company arranging tours across Nepal and holidays around the world, with the paperwork handled for you." image={heroImage} crumbs={[{ label: 'About' }]} />

      <section className="py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <div className="rounded-3xl overflow-hidden shadow-2xl aspect-[4/3] bg-gray-100">
              <SmartImage src={storyImage} alt="Nepal heritage" className="w-full h-full object-cover" />
            </div>
            {loaded && (
              <div className="absolute -bottom-6 left-4 right-4 sm:left-8 sm:right-8 bg-white rounded-2xl shadow-xl border border-gray-100 grid grid-cols-3 divide-x divide-gray-100">
                {facts.map((f) => <div key={f.label} className="p-3 sm:p-4 text-center"><p className="text-xl sm:text-2xl font-black text-[#1E3A8A]">{f.value}</p><p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-gray-400">{f.label}</p></div>)}
              </div>
            )}
          </div>
          <div className="lg:pl-6 pt-8 lg:pt-0">
            <span className="section-label mb-4">Who we are</span>
            <h2 className="heading-font text-3xl sm:text-4xl text-[#0F172A] mb-5">Travel planned from Kathmandu, <span className="text-[#1E3A8A]">for Nepal and the world</span></h2>
            <p className="text-gray-600 leading-relaxed mb-4">{settings.business_name} is a registered travel and tourism company based in {settings.address || 'Kathmandu, Nepal'}. We arrange cultural and heritage tours, pilgrimages, wildlife safaris, lake and hill-station escapes and family holidays within Nepal, and curated holiday packages abroad.</p>
            <p className="text-gray-600 leading-relaxed mb-8">Alongside tours we book domestic and international air tickets and hotels, assist with visa applications and appointments, and arrange travel insurance through partner providers — so one team looks after the whole journey.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {VALUES.map(({ Icon, title, desc }) => (
                <div key={title} className="flex gap-3 p-4 rounded-xl border border-gray-100 hover:bg-[#F8FAFC] transition-colors">
                  <span className="w-9 h-9 rounded-xl bg-[#10B981]/10 text-[#059669] flex items-center justify-center flex-shrink-0"><Icon className="w-4 h-4" /></span>
                  <div><h3 className="text-sm font-bold text-[#0F172A] mb-0.5">{title}</h3><p className="text-xs text-gray-500 leading-relaxed">{desc}</p></div>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-3">
              <Link to="/destinations" className="btn-primary">Explore destinations <ArrowRight className="w-4 h-4" /></Link>
              <Link to="/contact" className="btn-secondary">Contact the team</Link>
            </div>
          </div>
        </div>
      </section>

      <div className="bg-[#F8FAFC]"><ServicesGrid /></div>
      <CTA />
    </div>
  );
};

export default About;
