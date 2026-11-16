import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, CalendarDays, MapPin, Gauge } from 'lucide-react';
import TOUR_MEDIA from '../../data/tourMedia.json';
import { coverImage, coverAlt } from '../../lib/format';
import { responsiveImage } from '../../lib/images';

/**
 * A package's cover photo. Uses the self-hosted AVIF/WebP copy from
 * public/media/tours when scripts/build-tour-media.py has made one, otherwise
 * the remote photo with responsive variants.
 *  variant 'card' → 600×450, 'wide' → 1200×750 (with 600 for small screens)
 */
export function TourImage({ place, variant = 'card', sizes, eager = false, className = '', alt }) {
  const widths = TOUR_MEDIA[place?.slug] || [];
  const wide = variant === 'wide' && widths.includes(1200);
  const [w, h] = wide ? [1200, 750] : [600, 450];
  const altText = alt ?? coverAlt(place);
  const common = { width: w, height: h, alt: altText, loading: eager ? 'eager' : 'lazy', decoding: 'async', className };
  if (widths.includes(600)) {
    const base = `/media/tours/${place.slug}`;
    const set = (ext) => (wide ? `${base}-600.${ext} 600w, ${base}-1200.${ext} 1200w` : `${base}-600.${ext} 600w`);
    const sz = sizes || (wide ? '(min-width: 1024px) 60vw, 100vw' : '(min-width: 768px) 380px, 82vw');
    return (
      <picture>
        <source type="image/avif" srcSet={set('avif')} sizes={sz} />
        <source type="image/webp" srcSet={set('webp')} sizes={sz} />
        <img src={`${base}-600.webp`} {...common} />
      </picture>
    );
  }
  const url = coverImage(place);
  if (!url) return <span className={`block w-full h-full bg-gradient-to-br from-[#1E3A8A] to-[#0B1220] ${className}`} aria-hidden="true" />;
  const r = responsiveImage(url);
  return <img src={r.src} srcSet={r.srcSet} sizes={sizes || '(min-width: 768px) 600px, 100vw'} {...common} />;
}

/** Season / static photo under public/media (pass the path without extension). */
export function MediaImage({ base, alt, width = 1200, height = 750, sizes = '(min-width: 1024px) 50vw, 100vw', className = '' }) {
  return (
    <picture>
      <source type="image/avif" srcSet={`${base.replace(/-1200$/, '-600')}.avif 600w, ${base}.avif 1200w`} sizes={sizes} />
      <source type="image/webp" srcSet={`${base.replace(/-1200$/, '-600')}.webp 600w, ${base}.webp 1200w`} sizes={sizes} />
      <img src={`${base}.webp`} alt={alt} width={width} height={height} loading="lazy" decoding="async" className={className} />
    </picture>
  );
}

/** Left-aligned section title with an optional "VIEW ALL →" pill on the right. */
export function SectionHead({ id, eyebrow, title, lead, to, cta = 'View all', extra, className = '' }) {
  return (
    <div className={`gh-head ${className}`}>
      <div className="rv">
        {eyebrow && <span className="gh-eyebrow">{eyebrow}</span>}
        <h2 id={id} className="gh-title">{title}</h2>
        {lead && <p className="gh-lead">{lead}</p>}
      </div>
      <div className="rv flex items-center gap-3" style={{ '--i': 1 }}>
        {extra}
        {to && <Link to={to} className="gh-pill">{cta} <ArrowRight aria-hidden="true" /></Link>}
      </div>
    </div>
  );
}

const SPEC_ICON = { duration: Clock, season: CalendarDays, pickup: MapPin, difficulty: Gauge };

/** Spec rows with small icons: Duration · Best season · Pickup. */
export function Specs({ rows, inline = false, className = '' }) {
  if (!rows?.length) return null;
  return (
    <ul className={`gh-specs ${className}`} style={inline ? { display: 'flex', flexWrap: 'wrap', gap: '8px 20px' } : undefined}>
      {rows.map((r) => {
        const Icon = SPEC_ICON[r.key] || Clock;
        return (
          <li key={r.key}><Icon aria-hidden="true" /><span className="k">{r.label}</span><span>{r.value}</span></li>
        );
      })}
    </ul>
  );
}

export const FromPrice = ({ price, className = '' }) => (price
  ? <p className={`gh-from ${className}`}>From <b className="num">{price}</b></p>
  : <p className={`gh-from ${className}`}>Price on request</p>);

/**
 * Adds `.is-in` to the section the first time it scrolls into view; children
 * with `.rv` fade and rise (80 ms stagger via --i). Content stays visible
 * without JavaScript and under prefers-reduced-motion.
 */
export function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (typeof IntersectionObserver === 'undefined' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    // Already on screen when React starts: don't hide it again.
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight && r.bottom > 0) return undefined;
    el.classList.add('gh-rv-on');
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) { el.classList.add('is-in'); io.disconnect(); }
    }, { rootMargin: '0px 0px -12% 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}

/** Section wrapper with reveal + heading id wiring. */
export function Section({ id, labelledBy, tone = '', className = '', children }) {
  const ref = useReveal();
  return (
    <section ref={ref} id={id} aria-labelledby={labelledBy} className={`gh-sec ${tone} ${className}`}>
      <div className="gh-wrap">{children}</div>
    </section>
  );
}

/** Stops a timer-driven rotation for good once the visitor interacts. */
export function usePrefersReducedMotion() {
  const ref = useRef(typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches);
  return ref.current;
}
