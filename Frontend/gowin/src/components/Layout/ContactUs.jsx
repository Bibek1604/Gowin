import React from 'react';
import Contact from '../../assets/Contact.png';
import { Card, SectionHeader } from '../ui';
import colors from '../../theme/colors';

const ContactUs = () => {
  const headerIcons = [
    { name: 'fas fa-headset', color: colors.accent.orange },
    { name: 'fas fa-phone-alt', color: colors.primary.teal },
    { name: 'fas fa-envelope', color: colors.accent.skyBlue },
  ];

  const contactDetails = [
    {
      icon: 'fas fa-map-marker-alt',
      iconColor: colors.accent.orange,
      title: 'Location',
      content: 'Kathmandu, Shankhamul',
    },
    {
      icon: 'fas fa-phone',
      iconColor: colors.accent.skyBlue,
      title: 'Phone',
      content: '+977 9851410966',
      href: 'tel:+9779851410966',
      linkIcon: 'fas fa-mobile-alt',
    },
    {
      icon: 'fas fa-clock',
      iconColor: colors.accent.yellow,
      title: 'Available Hours',
      content: [
        { icon: 'fas fa-calendar-day', text: 'Sunday to Friday', color: colors.accent.skyBlue },
        { icon: 'fas fa-business-time', text: '10:00 AM – 7:30 PM', color: colors.accent.orange },
      ],
    },
  ];

  return (
    <div 
      className="px-4 py-16 min-h-screen"
      style={{ background: `linear-gradient(135deg, ${colors.neutral.white} 0%, ${colors.neutral.offWhite} 100%)` }}
    >
      <div className="max-w-5xl mx-auto">
        <SectionHeader
          title="Contact Us"
          subtitle="We're here to help you plan your perfect journey!"
          icons={headerIcons}
        />

        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div className="w-full md:w-1/2">
            <img
              src={Contact}
              alt="Go Win Travels"
              className="w-full rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300"
            />
          </div>

          <div className="space-y-6 md:w-1/2">
            {contactDetails.map((detail, index) => (
              <Card key={index}>
                <h2 
                  className="text-xl md:text-2xl font-bold mb-3 subheading-font flex items-center gap-3"
                  style={{ color: colors.primary.teal }}
                >
                  <i className={detail.icon} style={{ color: detail.iconColor }}></i>
                  {detail.title}
                </h2>
                
                {typeof detail.content === 'string' && !detail.href && (
                  <p className="leading-relaxed" style={{ color: colors.neutral.gray, fontFamily: 'Inter, Roboto, sans-serif' }}>{detail.content}</p>
                )}
                
                {detail.href && (
                  <a 
                    href={detail.href}
                    className="flex items-center gap-2 font-medium transition-all hover:underline"
                    style={{ color: colors.accent.orange }}
                  >
                    {detail.linkIcon && <i className={detail.linkIcon}></i>}
                    {detail.content}
                  </a>
                )}
                
                {Array.isArray(detail.content) && (
                  <div className="space-y-2">
                    {detail.content.map((item, idx) => (
                      <p key={idx} style={{ color: colors.neutral.gray }}>
                        <i className={`${item.icon} mr-2`} style={{ color: item.color }}></i>
                        {item.text}
                      </p>
                    ))}
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
