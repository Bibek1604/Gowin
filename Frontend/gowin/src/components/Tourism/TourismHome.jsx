import React, { useMemo } from 'react';
import Hero from './Hero';
import NepalSpotlight from './NepalSpotlight';
import DestinationCarousel from './DestinationCarousel';
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
      nepal: sortPlaces(published.filter(isNepal), 'featured').slice(0, 12),
      world: sortPlaces(published.filter((p) => !isNepal(p)), 'featured').slice(0, 12),
    };
  }, [places]);

  return (
    <main className="bg-white text-[#0F172A]">
      <Hero />
      <NepalSpotlight />
      <DestinationCarousel
        id="nepal" label="Nepal collection" title="Explore" accent="Nepal"
        subtitle="Kathmandu's living heritage, Pokhara's lakes, Chitwan's jungle, Lumbini's sacred garden and more."
        items={nepal} loading={!loaded} linkTo="/destinations/national" linkLabel="All Nepal tours" bg="bg-white"
      />
      <CategoryGrid />
      <CountryShowcase />
      <DestinationCarousel
        id="world" label="International collection" title="World" accent="holidays"
        subtitle="Beaches, cities, honeymoons and family holidays across Asia, the Middle East, Europe and beyond."
        items={world} loading={!loaded} linkTo="/destinations/international" linkLabel="All holidays" bg="bg-white"
      />
      <ServicesGrid />
      <WhyChooseUs />
      <HowItWorks />
      <Testimonials />
      <CTA />
    </main>
  );
};

export default TourismHome;
