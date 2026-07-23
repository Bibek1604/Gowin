import React from 'react';
import Hero from './Hero';
import PopularDestinations from './PopularDestinations';
import TravelCategories from './TravelCategories';
import FeaturedTours from './FeaturedTours';
import BookingSteps from './BookingSteps';
import Testimonials from './Testimonials';
import WhyChooseUs from './WhyChooseUs';
import CTA from './CTA';

const TourismHome = () => {
  return (
    <div className="font-sans bg-white text-dark-gray overflow-hidden">
      <main>
        <Hero />

        {/* Nepal Destinations */}
        <PopularDestinations
          type="National"
          title="Explore Nepal"
          subtitle="From Everest Base Camp to jungle safaris — discover the breathtaking beauty and rich heritage of Nepal."
          bgColor="bg-white"
        />

        {/* International Destinations */}
        <PopularDestinations
          type="International"
          title="Global Collection"
          subtitle="Handpicked world destinations — Santorini, Bali, Swiss Alps, Maldives and beyond."
          bgColor="bg-[#F8FAFB]"
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
