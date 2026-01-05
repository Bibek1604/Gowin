import React from 'react';
import PropTypes from 'prop-types';
import colors from '../../theme/colors';

const Card = ({ 
  children, 
  className = '', 
  hover = true,
  padding = 'p-6',
  ...props 
}) => {
  return (
    <div
      className={`
        bg-white rounded-lg
        ${hover ? 'transition-all duration-300 ease-out' : ''}
        ${padding}
        ${className}
      `}
      style={{ 
        fontFamily: 'Inter, Roboto, sans-serif',
        boxShadow: colors.shadows.card,
      }}
      onMouseEnter={(e) => {
        if (hover) {
          e.currentTarget.style.boxShadow = colors.shadows.cardHover;
          e.currentTarget.style.transform = 'translateY(-4px)';
        }
      }}
      onMouseLeave={(e) => {
        if (hover) {
          e.currentTarget.style.boxShadow = colors.shadows.card;
          e.currentTarget.style.transform = 'translateY(0)';
        }
      }}
      {...props}
    >
      {children}
    </div>
  );
};

Card.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  hover: PropTypes.bool,
  padding: PropTypes.string,
};

export default Card;
