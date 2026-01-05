import React from 'react';
import PropTypes from 'prop-types';
import colors from '../../theme/colors';

const IconBadge = ({ 
  icon, 
  gradient = 'vibrant',
  size = 'md',
  className = '',
}) => {
  const gradients = {
    vibrant: colors.gradients.vibrant,
    primary: colors.gradients.primary,
    warm: colors.gradients.warm,
    cool: colors.gradients.cool,
  };

  const sizes = {
    sm: 'p-2 text-lg',
    md: 'p-3 text-2xl',
    lg: 'p-4 text-3xl',
  };

  return (
    <div
      className={`rounded-full inline-flex items-center justify-center ${sizes[size]} ${className}`}
      style={{ background: gradients[gradient] }}
    >
      <i className={`${icon} text-white`}></i>
    </div>
  );
};

IconBadge.propTypes = {
  icon: PropTypes.string.isRequired,
  gradient: PropTypes.oneOf(['vibrant', 'primary', 'warm', 'cool']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  className: PropTypes.string,
};

export default IconBadge;
