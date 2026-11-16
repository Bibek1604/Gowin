import React, { useMemo } from 'react';
import HeroVideo from '../Home/HeroVideo';
import WhoWeAre from '../Home/WhoWeAre';
import PopularTours from '../Home/PopularTours';
import DayTours from '../Home/DayTours';
import Pilgrimage from '../Home/Pilgrimage';
import Wildlife from '../Home/Wildlife';
import { Holidays, Seasons, ServicesHome, HowItWorksHome, GuidesHome, FaqHome, MobileBar } from '../Home/MoreSections';
import Testimonials from './Testimonials';
import usePlaceStore, { selectPublished, sortPlaces } from '../Store/PlaceStore';
import useSettingsStore from '../Store/SettingsStore';
import { useSEO, agencyJsonLd } from '../../lib/seo';
import { whatsappLink } from '../../lib/format';
import { homeSections } from '../../lib/homeData';
import { DAY_TOUR_SLOTS, PILGRIMAGE_ORDER } from '../../data/homeContent';

/**
 * Home page (redesign v2). Every tour shown comes from the published
 * packages in Supabase; each section uses a different card layout for a
 * different kind of trip. Sections without enough real data are not rendered.
 */
const TourismHome = () => {
  const { places } = usePlaceStore();
  const { settings } = useSettingsStore();
  useSEO({
    title: 'Nepal Tours, Holidays & Travel Services in Kathmandu',
    description: settings.meta_description || 'GoWin International Travel & Tourism: Nepal heritage tours, pilgrimages, wildlife safaris and lakeside escapes, international holiday packages, flights, hotels and visa assistance from Kathmandu.',
    path: '/',
    jsonLd: agencyJsonLd(settings),
  });

  const s = useMemo(
    () => homeSections(sortPlaces(selectPublished(places), 'featured'), { daySlots: DAY_TOUR_SLOTS, pilgrimageOrder: PILGRIMAGE_ORDER }),
    [places],
  );
  const wa = whatsappLink(settings.whatsapp || settings.phone, 'Hello GoWin Travels, I would like to plan a trip.');

  return (
    <main className="gh home-main">
      <HeroVideo />
      <WhoWeAre />
      <PopularTours items={s.popular} />
      <DayTours items={s.dayTours} />
      <Pilgrimage items={s.pilgrimage} />
      <Wildlife items={s.wildlife} />
      <Holidays items={s.holidays} />
      <Seasons nepal={s.nepal} />
      <ServicesHome />
      <HowItWorksHome />
      <GuidesHome />
      <Testimonials />
      <FaqHome whatsapp={wa} />
      <MobileBar whatsapp={wa} />
    </main>
  );
};

export default TourismHome;
