import React from 'react';
import PropTypes from 'prop-types';
import colors from '../../theme/colors';

const SectionHeader = ({ 
  title, 
  subtitle, 
  icons = [],
  centered = true,
  className = '',
}) => {
  return (
    <div className={`${centered ? 'text-center' : ''} mb-16 ${className}`}>
      {icons.length > 0 && (
        <div className="flex justify-center gap-4 mb-6 animate-fadeIn">
          {icons.map((icon, index) => (
            <i 
              key={index} 
              className={`${icon.name} text-3xl md:text-4xl transition-transform hover:scale-110`}
              style={{ color: icon.color }}
            ></i>
          ))}
        </div>
      )}
      <h2 
        className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 heading-font animate-slideUp"
        style={{ 
          color: colors.neutral.charcoal,
          fontFamily: 'Playfair Display, Georgia, serif',
          letterSpacing: '-0.02em',
        }}
      >
        {title}
      </h2>
      {subtitle && (
        <p 
          className="text-lg md:text-xl max-w-3xl mx-auto leading-relaxed animate-fadeIn"
          style={{ 
            color: colors.neutral.gray,
            fontFamily: 'Inter, Roboto, sans-serif',
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
};

SectionHeader.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  icons: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      color: PropTypes.string.isRequired,
    })
  ),
  centered: PropTypes.bool,
  className: PropTypes.string,
};

export default SectionHeader;
