import React from 'react';
import gowin from '../../assets/gowin.jpg';
import colors from '../../theme/colors';

const Footer = () => {
  const socialLinks = [
    { icon: 'fab fa-facebook', href: '#', label: 'Facebook', color: colors.accent.skyBlue },
    { icon: 'fab fa-instagram', href: '#', label: 'Instagram', color: colors.accent.orange },
    { icon: 'fab fa-twitter', href: '#', label: 'Twitter', color: colors.primary.teal },
    { icon: 'fab fa-youtube', href: '#', label: 'YouTube', color: colors.accent.yellow },
  ];

  const companyLinks = [
    { icon: 'fas fa-info-circle', text: 'About Us', href: '/aboutus' },
    { icon: 'fas fa-headset', text: 'Contact', href: '/contactus' },
    { icon: 'fas fa-passport', text: 'Book Now', href: '/booking' },
  ];

  const quickLinks = [
    { icon: 'fas fa-plane-departure', text: 'Destinations', href: '/#places' },
    { icon: 'fas fa-calendar-check', text: 'My Bookings', href: '/booking' },
    { icon: 'fas fa-shield-alt', text: 'Travel Insurance', href: '#' },
  ];

  const contactInfo = [
    { icon: 'fas fa-map-marker-alt', text: 'Kathmandu, Nepal (Shankhamul)' },
    { icon: 'fas fa-phone', text: '+977-9851410966' },
    { icon: 'fas fa-envelope', text: 'info@gowintravel.com' },
  ];

  return (
    <footer 
      className="text-white pt-16 pb-6 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
      style={{ 
        background: `linear-gradient(135deg, ${colors.neutral.charcoal} 0%, ${colors.neutral.darkGray} 100%)`,
        boxShadow: colors.shadows.xl
      }}
    >
      {/* Decorative overlay */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{ 
          backgroundImage: `radial-gradient(circle at 2px 2px, ${colors.primary.teal} 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          
          {/* Branding & Contact */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <img 
                src={gowin} 
                alt="Gowin Travel" 
                className="h-14 w-14 rounded-full shadow-lg ring-2 ring-white/20"
              />
              <div>
                <span 
                  className="text-3xl font-bold block leading-tight"
                  style={{ 
                    fontFamily: 'Playfair Display, Georgia, serif',
                    color: colors.primary.teal,
                    textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                  }}
                >
                  Gowin
                </span>
                <span 
                  className="text-xs tracking-wider"
                  style={{ color: colors.accent.orange }}
                >
                  International
                </span>
              </div>
            </div>
            
            <p 
              className="text-sm leading-relaxed"
              style={{ 
                color: 'rgba(255, 255, 255, 0.85)',
                fontFamily: 'Inter, Roboto, sans-serif'
              }}
            >
              Explore Beyond Borders. Win Every Journey with Gowin's expertly crafted travel experiences.
            </p>
            
            <div className="space-y-3">
              {contactInfo.map((info, index) => (
                <p 
                  key={index} 
                  className="text-sm flex items-start gap-3 hover:translate-x-1 transition-transform"
                  style={{ fontFamily: 'Inter, Roboto, sans-serif' }}
                >
                  <i 
                    className={`${info.icon} mt-1`} 
                    style={{ color: colors.accent.orange, minWidth: '16px' }}
                  ></i>
                  <span style={{ color: 'rgba(255, 255, 255, 0.9)' }}>{info.text}</span>
                </p>
              ))}
            </div>
            
            <div className="flex gap-3 pt-2">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all transform hover:scale-110 hover:-translate-y-1"
                  style={{ 
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    color: 'white',
                    boxShadow: colors.shadows.sm
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = social.color;
                    e.currentTarget.style.boxShadow = colors.shadows.md;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                    e.currentTarget.style.boxShadow = colors.shadows.sm;
                  }}
                >
                  <i className={social.icon}></i>
                </a>
              ))}
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h4 
              className="text-xl font-bold mb-6 flex items-center gap-2" 
              style={{ 
                fontFamily: 'Playfair Display, Georgia, serif',
                color: colors.primary.teal
              }}
            >
              <i className="fas fa-building" style={{ color: colors.accent.orange }}></i>
              Company
            </h4>
            <ul className="space-y-3">
              {companyLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-sm hover:pl-2 transition-all flex items-center gap-3 group"
                    style={{ 
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontFamily: 'Inter, Roboto, sans-serif'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = colors.accent.orange}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)'}
                  >
                    <i className={link.icon} style={{ minWidth: '16px' }}></i>
                    {link.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 
              className="text-xl font-bold mb-6 flex items-center gap-2" 
              style={{ 
                fontFamily: 'Playfair Display, Georgia, serif',
                color: colors.primary.teal
              }}
            >
              <i className="fas fa-link" style={{ color: colors.accent.orange }}></i>
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-sm hover:pl-2 transition-all flex items-center gap-3 group"
                    style={{ 
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontFamily: 'Inter, Roboto, sans-serif'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = colors.accent.orange}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)'}
                  >
                    <i className={link.icon} style={{ minWidth: '16px' }}></i>
                    {link.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Google Map */}
          <div className="w-full">
            <h4 
              className="text-xl font-bold mb-6 flex items-center gap-2"
              style={{ 
                fontFamily: 'Playfair Display, Georgia, serif',
                color: colors.primary.teal
              }}
            >
              <i className="fas fa-map" style={{ color: colors.accent.orange }}></i>
              Find Us
            </h4>
            <iframe
              title="Gowin Travel Location"
              className="w-full h-48 rounded-xl shadow-lg border-2 transition-all hover:scale-105"
              style={{ borderColor: colors.primary.teal }}
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.222211266228!2d85.33676327452445!3d27.709755325740768!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb199f2782b155%3A0xf0c9c78d248b062d!2sBig%20Mart%20Shankhamul!5e0!3m2!1sen!2snp!4v1716551892004!5m2!1sen!2snp"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        {/* Newsletter Section */}
        <div 
          className="py-8 px-6 rounded-2xl mb-8"
          style={{ 
            background: `linear-gradient(135deg, ${colors.primary.teal}20 0%, ${colors.accent.orange}20 100%)`,
            border: `2px solid ${colors.primary.teal}30`
          }}
        >
          <div className="max-w-2xl mx-auto text-center">
            <h4 
              className="text-2xl font-bold mb-3"
              style={{ 
                fontFamily: 'Playfair Display, Georgia, serif',
                color: colors.neutral.white
              }}
            >
              Subscribe to Our Newsletter
            </h4>
            <p 
              className="text-sm mb-4"
              style={{ 
                color: 'rgba(255, 255, 255, 0.85)',
                fontFamily: 'Inter, Roboto, sans-serif'
              }}
            >
              Get exclusive travel deals, destination guides, and adventure inspiration delivered to your inbox.
            </p>
            <div className="flex gap-2 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg border-2 focus:outline-none transition-all"
                style={{ 
                  background: 'rgba(255, 255, 255, 0.95)',
                  borderColor: colors.primary.teal,
                  fontFamily: 'Inter, Roboto, sans-serif',
                  color: colors.neutral.darkGray
                }}
                onFocus={(e) => e.target.style.borderColor = colors.accent.orange}
                onBlur={(e) => e.target.style.borderColor = colors.primary.teal}
              />
              <button
                className="px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105 active:scale-95"
                style={{ 
                  background: colors.accent.orange,
                  color: 'white',
                  boxShadow: colors.shadows.md,
                  fontFamily: 'Inter, Roboto, sans-serif'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = colors.accent.orangeDark}
                onMouseLeave={(e) => e.currentTarget.style.background = colors.accent.orange}
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div 
          className="pt-6 border-t text-center"
          style={{ borderColor: 'rgba(255, 255, 255, 0.2)' }}
        >
          <p 
            className="text-sm mb-2"
            style={{ 
              color: 'rgba(255, 255, 255, 0.7)',
              fontFamily: 'Inter, Roboto, sans-serif'
            }}
          >
            © 2025 Gowin International. All rights reserved.
          </p>
          
          {/* Developer Credit */}
          <p 
            className="text-xs"
            style={{ 
              color: 'rgba(255, 255, 255, 0.6)',
              fontFamily: 'Inter, Roboto, sans-serif'
            }}
          >
            Developed with <i className="fas fa-heart" style={{ color: colors.accent.orange }}></i> by{' '}
            <a
              href="https://www.linkedin.com/in/bibek-pandey-43313723b/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold hover:underline transition-all"
              style={{ color: colors.primary.teal }}
              onMouseEnter={(e) => e.currentTarget.style.color = colors.accent.orange}
              onMouseLeave={(e) => e.currentTarget.style.color = colors.primary.teal}
            >
              Bibek Pandey
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
