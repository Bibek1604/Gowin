import React from 'react';
import Hero from './Hero';
import PopularDestinations from './PopularDestinations';
import RegionSpotlight from './RegionSpotlight';
import CountryShowcase from './CountryShowcase';
import TravelCategories from './TravelCategories';
import FeaturedTours from './FeaturedTours';
import BookingSteps from './BookingSteps';
import Testimonials from './Testimonials';
import WhyChooseUs from './WhyChooseUs';
import CTA from './CTA';
import { SEED_ADVENTURES, SEED_LAKES } from '../../data/seedData';

const TourismHome = () => {
  return (
    <div className="font-sans bg-white text-dark-gray overflow-hidden">
      <main>
        <Hero />

        {/* Expanding-cards trek spotlight */}
        <RegionSpotlight />

        {/* Explore Nepal */}
        <PopularDestinations
          type="National"
          title="Explore"
          titleAccent="Nepal"
          subtitle="From Everest Base Camp to Rara Lake — the breathtaking beauty and living heritage of Nepal."
          bgColor="bg-white"
        />

        {/* Adventure Activities */}
        <PopularDestinations
          type="National"
          data={SEED_ADVENTURES}
          badge="⚡ Adventure Activities"
          title="Built for"
          titleAccent="Adrenaline"
          subtitle="Paragliding, white-water rafting, bungee and the world's greatest treks — pick your pulse rate."
          bgColor="bg-[#F8FAFC]"
          linkTo="/destinations/national"
        />

        {/* Lakes & Nature */}
        <PopularDestinations
          type="National"
          data={SEED_LAKES}
          badge="🏞️ Lakes & Nature"
          title="Himalayan"
          titleAccent="Lakes"
          subtitle="Phewa, Rara, Tilicho, Gosaikunda — turquoise water at the top of the world."
          bgColor="bg-white"
          linkTo="/destinations/national"
        />

        {/* International by country */}
        <CountryShowcase />

        {/* International packages */}
        <PopularDestinations
          type="International"
          title="Global"
          titleAccent="Collection"
          subtitle="Handpicked world destinations — Santorini, Kyoto, the Swiss Alps, Maldives and beyond."
          bgColor="bg-white"
        />

        <TravelCategories />
        <FeaturedTours />
        <WhyChooseUs />
        <BookingSteps />
        <Testimonials />
        <CTA />
      </main>
    </div>
  );
};

export default TourismHome;
