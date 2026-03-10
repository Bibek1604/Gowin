import React from 'react';
import PropTypes from 'prop-types';
import colors from '../../theme/colors';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconRight,
  className = '',
  ...props
}) => {
  const variants = {
    primary: {
      background: colors.accent.orange,
      className: 'text-white font-semibold hover:shadow-lg',
      style: {
        boxShadow: colors.shadows.sm,
      },
      hover: {
        background: colors.accent.orangeDark,
        boxShadow: colors.shadows.md,
      },
    },
    secondary: {
      background: colors.primary.navy,
      className: 'text-white font-semibold hover:shadow-lg',
      style: {
        boxShadow: colors.shadows.sm,
      },
      hover: {
        background: colors.primary.navyDark,
        boxShadow: colors.shadows.md,
      },
    },
    outline: {
      background: 'transparent',
      className: `font-semibold hover:bg-opacity-10`,
      style: {
        border: `2px solid ${colors.primary.navy}`,
        color: colors.primary.navy,
      },
      hover: {
        background: colors.primary.navyMuted,
      },
    },
    ghost: {
      background: 'transparent',
      className: 'font-medium hover:bg-gray-100',
      style: {
        color: colors.neutral.darkGray,
      },
    },
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const selectedVariant = variants[variant];

  return (
    <button
      className={`
        rounded-xl font-bold uppercase tracking-widest
        transition-all duration-300 ease-out
        flex items-center justify-center gap-2
        ${sizes[size]}
        ${selectedVariant.className}
        ${className}
      `}
      style={{
        background: selectedVariant.background,
        fontFamily: 'Outfit, sans-serif',
        fontSize: size === 'sm' ? '10px' : '12px',
        ...selectedVariant.style
      }}
      onMouseEnter={(e) => {
        if (selectedVariant.hover) {
          Object.assign(e.currentTarget.style, selectedVariant.hover);
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = selectedVariant.background;
        e.currentTarget.style.boxShadow = selectedVariant.style?.boxShadow || '';
      }}
      {...props}
    >
      {icon && <i className={icon}></i>}
      {children}
      {iconRight && <i className={iconRight}></i>}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary', 'outline', 'ghost']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  icon: PropTypes.string,
  iconRight: PropTypes.string,
  className: PropTypes.string,
};

export default Button;
