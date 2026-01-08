import React from 'react';
import kerelaHero from '../../assets/kerela-hero.jpeg';
import thiland2 from '../../assets/thiland-2.jpeg';
import bali from '../../assets/bali.jpeg';
import { Card, IconBadge, SectionHeader } from '../ui';
import colors from '../../theme/colors';

const AboutUs = () => {
  const headerIcons = [
    { name: 'fas fa-passport', color: colors.accent.orange },
    { name: 'fas fa-plane-departure', color: colors.primary.teal },
    { name: 'fas fa-globe-americas', color: colors.accent.skyBlue },
    { name: 'fas fa-suitcase-rolling', color: colors.accent.yellow },
  ];

  const services = [
    {
      icon: 'fas fa-user-tie',
      gradient: 'vibrant',
      title: 'Visa Expert',
      description: 'Get expert advice on visa requirements and document preparation for any country.',
    },
    {
      icon: 'fas fa-route',
      gradient: 'primary',
      title: 'Visa Guidance',
      description: 'Step-by-step guidance throughout the visa application process to ensure approval.',
    },
    {
      icon: 'fas fa-hands-helping',
      gradient: 'warm',
      title: 'Travel Support',
      description: 'Comprehensive support from flight booking to hotel accommodations and itinerary planning.',
    },
    {
      icon: 'fas fa-calendar-check',
      gradient: 'cool',
      title: 'VFS Appointment',
      description: 'We support visa applicants through the entire application process. If you\'re ready to arrange your visa application appointment.',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero/Header Section */}
      <div className="text-center mb-16">
        <SectionHeader title="About Us" icons={headerIcons} />
        <p
          className="text-base md:text-lg mb-12 text-center max-w-3xl mx-auto leading-relaxed font-normal"
          style={{ color: colors.neutral.gray, fontFamily: 'Inter, Roboto, sans-serif' }}
        >
          <i className="fas fa-quote-left mr-2" style={{ color: colors.accent.orange }}></i>
          At Gowin Travels, we specialize in offering expert travel solutions, visa assistance, and guided holiday planning for destinations around the globe. With our experienced team and top-notch support, we ensure that your travel experience is smooth, stress-free, and memorable.
          <i className="fas fa-quote-right ml-2" style={{ color: colors.accent.orange }}></i>
        </p>
      </div>

      {/* Images + Services Section */}
      <div className="mb-20">
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div className="w-full md:w-1/2 grid grid-cols-2 gap-4">
            <img
              src={kerelaHero}
              alt="Kerala Backwaters"
              className="rounded-2xl shadow-xl object-cover h-36 md:h-44 w-full hover:scale-105 transition-all duration-300"
            />
            <img
              src={thiland2}
              alt="Thailand Culture"
              className="rounded-2xl shadow-xl object-cover h-36 md:h-44 w-full hover:scale-105 transition-all duration-300"
            />
            <img
              src={bali}
              alt="Bali Island"
              className="rounded-2xl shadow-xl object-cover h-36 md:h-44 w-full hover:scale-105 transition-all duration-300"
            />
            <img
              src={kerelaHero}
              alt="Kerala Backwaters Duplicate"
              className="rounded-2xl shadow-xl object-cover h-36 md:h-44 w-full hover:scale-105 transition-all duration-300"
            />
          </div>

          <div className="space-y-6 md:w-1/2">
            {services.map((service, index) => (
              <Card key={index}>
                <div className="flex items-center gap-4 mb-3">
                  <IconBadge icon={service.icon} gradient={service.gradient} />
                  <h2
                    className="text-xl md:text-2xl font-semibold subheading-font"
                    style={{ color: colors.primary.teal }}
                  >
                    {service.title}
                  </h2>
                </div>
                <p style={{ color: colors.neutral.gray }}>{service.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Why Trust Us Section */}
      <div className="mt-20">
        <SectionHeader title="Why Trust Us?" icons={[{ name: 'fas fa-thumbs-up', color: colors.accent.orange }]} />
        <div className="grid md:grid-cols-3 gap-8 mt-10">
          <Card>
            <h3 className="text-xl font-bold mb-2" style={{ color: colors.primary.teal }}>Transparent Service</h3>
            <p style={{ color: colors.neutral.gray }}>No hidden fees, honest advice, and clear communication at every step.</p>
          </Card>
          <Card>
            <h3 className="text-xl font-bold mb-2" style={{ color: colors.primary.teal }}>Thousands of Happy Clients</h3>
            <p style={{ color: colors.neutral.gray }}>We have helped thousands of travelers achieve their dream journeys and visas.</p>
          </Card>
          <Card>
            <h3 className="text-xl font-bold mb-2" style={{ color: colors.primary.teal }}>Certified & Experienced Team</h3>
            <p style={{ color: colors.neutral.gray }}>Our team is certified, highly trained, and passionate about travel and customer care.</p>
          </Card>
        </div>
      </div>

      {/* Our Experience Section */}
      <div className="mt-20">
        <SectionHeader title="Our Experience" icons={[{ name: 'fas fa-briefcase', color: colors.primary.teal }]} />
        <div className="grid md:grid-cols-2 gap-8 mt-10">
          <Card>
            <h3 className="text-xl font-bold mb-2" style={{ color: colors.primary.teal }}>4+ Years in Travel Industry</h3>
            <p style={{ color: colors.neutral.gray }}>
              We have over a decade of experience in travel, tourism, and visa consultation, working with clients from all over the world.
            </p>
          </Card>
          <Card>
            <h3 className="text-xl font-bold mb-2" style={{ color: colors.primary.teal }}>Global Network</h3>
            <p style={{ color: colors.neutral.gray }}>
              Our partnerships with embassies, airlines, and hotels ensure you get the best support and deals.
            </p>
          </Card>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mt-20 mb-10">
        <SectionHeader title="Frequently Asked Questions" icons={[{ name: 'fas fa-question-circle', color: colors.accent.skyBlue }]} />
        <div className="space-y-6 max-w-3xl mx-auto mt-10">
          <Card>
            <h4 className="text-lg font-semibold mb-1" style={{ color: colors.primary.teal }}>How long does the visa process take?</h4>
            <p style={{ color: colors.neutral.gray }}>Processing times vary by country and visa type, but we guide you through every step and keep you updated.</p>
          </Card>
          <Card>
            <h4 className="text-lg font-semibold mb-1" style={{ color: colors.primary.teal }}>Can you help with urgent travel plans?</h4>
            <p style={{ color: colors.neutral.gray }}>Yes! We offer expedited services and personalized support for urgent travel needs.</p>
          </Card>
          <Card>
            <h4 className="text-lg font-semibold mb-1" style={{ color: colors.primary.teal }}>What documents do I need for a visa?</h4>
            <p style={{ color: colors.neutral.gray }}>We provide a detailed checklist and review your documents to ensure everything is in order for your application.</p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;