import React from 'react';
import Hero from './Hero';
import PopularDestinations from './PopularDestinations';
import TravelCategories from './TravelCategories';
import FeaturedTours from './FeaturedTours';
import WhyChooseUs from './WhyChooseUs';
import BookingSteps from './BookingSteps';
import Testimonials from './Testimonials';
import Gallery from './Gallery';
import About from './About';
import Contact from './Contact';
import CTA from './CTA';

const TourismHome = () => {
  return (
    <div className="font-sans bg-white text-gray-800">
      <main>
        <Hero />
        <PopularDestinations />
        <TravelCategories />
        <About />
        <FeaturedTours />
        <WhyChooseUs />
        <BookingSteps />
        <Testimonials />
        <Contact />
        <CTA />
      </main>
    </div>
  );
};

export default TourismHome;
