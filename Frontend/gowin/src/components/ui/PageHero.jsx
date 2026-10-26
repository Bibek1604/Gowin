import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import SmartImage from './SmartImage';

/**
 * Shared page banner: background photo with brand gradient, breadcrumb,
 * eyebrow label, title and subtitle. Keeps every inner page consistent.
 */
const PageHero = ({ title, subtitle, label, image, crumbs = [], size = 'md', children, align = 'left' }) => {
  const heights = { sm: 'min-h-[220px] sm:min-h-[260px]', md: 'min-h-[280px] sm:min-h-[340px]', lg: 'min-h-[360px] sm:min-h-[440px]' };
  return (
    <section className={`relative ${heights[size] || heights.md} flex items-end overflow-hidden bg-[#0F172A]`}>
      {image && <SmartImage src={image} alt="" priority className="absolute inset-0 w-full h-full object-cover" aria-hidden="true" />}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0B1220]/95 via-[#1E3A8A]/60 to-[#0B1220]/30" />
      <div className={`relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-10 sm:pb-14 ${align === 'center' ? 'text-center' : ''}`}>
        {crumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className={`flex items-center gap-1.5 text-[11px] sm:text-xs text-white/60 mb-4 flex-wrap ${align === 'center' ? 'justify-center' : ''}`}>
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            {crumbs.map((c, i) => (
              <React.Fragment key={i}>
                <ChevronRight className="w-3 h-3 text-white/30" />
                {c.to ? <Link to={c.to} className="hover:text-white transition-colors">{c.label}</Link> : <span className="text-white/85">{c.label}</span>}
              </React.Fragment>
            ))}
          </nav>
        )}
        {label && <span className="inline-block text-[10px] sm:text-[11px] font-bold text-[#34D399] uppercase tracking-[0.25em] mb-3">{label}</span>}
        <h1 className="heading-font text-3xl sm:text-4xl lg:text-5xl text-white max-w-3xl mx-auto">{title}</h1>
        {subtitle && <p className={`text-white/75 text-sm sm:text-base lg:text-lg mt-3 max-w-2xl leading-relaxed ${align === 'center' ? 'mx-auto' : ''}`}>{subtitle}</p>}
        {children}
      </div>
    </section>
  );
};

export default PageHero;
