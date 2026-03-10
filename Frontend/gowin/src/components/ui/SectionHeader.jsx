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
    <div className={`${centered ? 'text-center' : ''} mb-20 ${className}`}>
      <h2
        className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4 animate-slideUp text-sky-500"
        style={{
          fontFamily: 'Outfit, sans-serif',
        }}
      >
        {title}
      </h2>
      <div className="w-12 h-1 bg-sky-400/30 mx-auto mb-6 rounded-full"></div>
      {subtitle && (
        <p
          className="text-sm md:text-base max-w-2xl mx-auto leading-relaxed text-slate-500 font-medium tracking-wide uppercase"
          style={{
            fontFamily: 'Outfit, sans-serif',
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
