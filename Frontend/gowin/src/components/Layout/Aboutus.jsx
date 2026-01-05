import React from 'react';
import visaImage from '../../assets/visaImage.png';
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
    <div 
      className="px-4 py-16 min-h-screen"
      style={{ background: `linear-gradient(135deg, ${colors.neutral.white} 0%, ${colors.neutral.offWhite} 100%)` }}
    >
      <div className="max-w-5xl mx-auto">
        <SectionHeader
          title="About Us"
          icons={headerIcons}
        />

        <p className="text-base md:text-lg mb-12 text-center max-w-3xl mx-auto leading-relaxed font-normal" style={{ color: colors.neutral.gray, fontFamily: 'Inter, Roboto, sans-serif' }}>
          <i className="fas fa-quote-left mr-2" style={{ color: colors.accent.orange }}></i>
          At Gowin Travels, we specialize in offering expert travel solutions, visa assistance, and guided holiday planning for destinations around the globe. With our experienced team and top-notch support, we ensure that your travel experience is smooth, stress-free, and memorable.
          <i className="fas fa-quote-right ml-2" style={{ color: colors.accent.orange }}></i>
        </p>
        
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div className="w-full md:w-1/2">
            <img
              src={visaImage}
              alt="Visa Guidance"
              className="w-full rounded-2xl shadow-2xl object-cover transform hover:scale-105 transition-all duration-300"
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
    </div>
  );
};

export default AboutUs;
