import React from 'react';
import Hero from './Hero';
import PopularDestinations from './PopularDestinations';
import TravelCategories from './TravelCategories';
import FeaturedTours from './FeaturedTours';
import BookingSteps from './BookingSteps';
import Testimonials from './Testimonials';

const TourismHome = () => {
  return (
    <div className="font-sans bg-white text-dark-gray overflow-hidden">
      <main>
        <Hero />
        
        {/* National Destinations Section */}
        <PopularDestinations 
          type="National" 
          title="Local Nepal" 
          subtitle="Explore the breathtaking beauty and rich heritage of Nepal, from the Himalayas to the Terai."
          bgColor="bg-white"
        />

        {/* International Destinations Section */}
        <PopularDestinations 
          type="International" 
          title="Global Collection" 
          subtitle="Handpicked global destinations — each one a story waiting to be written."
          bgColor="bg-[#F8FAFB]"
        />

        <TravelCategories />
        <FeaturedTours />
        <BookingSteps />
        <Testimonials />
      </main>
    </div>
  );
};

export default TourismHome;
