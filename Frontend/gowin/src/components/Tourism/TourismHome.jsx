import React, { useMemo } from 'react';
import Hero from './Hero';
import DestinationGrid from './DestinationGrid';
import CategoryGrid from './CategoryGrid';
import CountryShowcase from './CountryShowcase';
import ServicesGrid from './ServicesGrid';
import WhyChooseUs from './WhyChooseUs';
import HowItWorks from './HowItWorks';
import Testimonials from './Testimonials';
import CTA from './CTA';
import usePlaceStore, { selectPublished, sortPlaces } from '../Store/PlaceStore';
import useSettingsStore from '../Store/SettingsStore';
import { useSEO, agencyJsonLd } from '../../lib/seo';
import { isNepal } from '../../lib/format';

const TourismHome = () => {
  const { places, loaded } = usePlaceStore();
  const { settings } = useSettingsStore();
  useSEO({
    title: 'Nepal Tours, Holidays & Travel Services in Kathmandu',
    description: settings.meta_description || 'GoWin International Travel & Tourism: Nepal heritage tours, pilgrimages, wildlife safaris and lakeside escapes, international holiday packages, flights, hotels and visa assistance from Kathmandu.',
    path: '/',
    jsonLd: agencyJsonLd(settings),
  });

  const { nepal, world } = useMemo(() => {
    const published = selectPublished(places);
    return {
      nepal: sortPlaces(published.filter(isNepal), 'featured').slice(0, 10),
      world: sortPlaces(published.filter((p) => !isNepal(p)), 'featured').slice(0, 10),
    };
  }, [places]);

  return (
    <main className="home-main bg-white text-[#0F172A]">
      <Hero />
      <DestinationGrid
        id="nepal" label="Top 10 in Nepal" title="Explore" accent="Nepal"
        subtitle="Kathmandu's heritage, Pokhara's lakes, Chitwan's jungle, Lumbini's sacred garden and the hill towns in between: our pick of ten Nepal experiences."
        items={nepal} loading={!loaded} linkTo="/destinations/national" linkLabel="All Nepal tours" bg="bg-white"
      />
      <CategoryGrid />
      <DestinationGrid
        id="world" label="Top 10 international" title="World" accent="holidays"
        subtitle="Ten holidays beyond Nepal: beaches, islands, cities and honeymoons, with flights, hotels and visas arranged from Kathmandu."
        items={world} loading={!loaded} linkTo="/destinations/international" linkLabel="All holidays" bg="bg-[#F8FAFC]"
      />
      <CountryShowcase bg="bg-white" />
      <ServicesGrid />
      <WhyChooseUs />
      <HowItWorks />
      <Testimonials />
      <CTA />
    </main>
  );
};

export default TourismHome;
