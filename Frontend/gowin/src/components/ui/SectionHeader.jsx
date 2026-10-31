import React from 'react';

/** Consistent eyebrow label + heading + subtitle used by every content section. */
const SectionHeader = ({ label, title, accent, subtitle, align = 'left', action = null, className = '', dark = false }) => {
  const center = align === 'center';
  return (
    <div className={`flex flex-col ${center ? 'items-center text-center' : 'sm:flex-row sm:items-end sm:justify-between'} gap-5 ${className}`}>
      <div className={`${center ? 'max-w-2xl' : 'max-w-2xl'} min-w-0`}>
        {label && <span className={`section-label mb-3 ${center ? 'justify-center' : ''} ${dark ? 'on-dark' : ''}`}>{label}</span>}
        <h2 className={`heading-font text-3xl sm:text-4xl lg:text-[2.75rem] ${dark ? 'text-white' : 'text-[#0F172A]'}`}>
          {title}{accent && <> <span className={dark ? 'text-[#34D399]' : 'text-[#1E3A8A]'}>{accent}</span></>}
        </h2>
        {subtitle && <p className={`mt-3 text-sm sm:text-base leading-relaxed ${dark ? 'text-white/70' : 'text-gray-500'}`}>{subtitle}</p>}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
};

export default SectionHeader;
