import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
import { Section, SectionHead, TourImage, Specs, FromPrice } from './ui';
import { specsOf, priceOf } from '../../lib/homeData';
import { placePath } from '../../lib/format';

/** Tour card: photo on top, category + price badges, spec rows, price and a single link (whole card is clickable). */
export function TourCard({ place, cta = 'Explore tour', eager = false }) {
  const price = priceOf(place);
  return (
    <article className="gh-card hoverable h-full">
      <div className="gh-media">
        <TourImage place={place} eager={eager} />
        {place.categories?.name && <span className="gh-badge" style={{ left: 14, top: 14 }}>{place.categories.name}</span>}
        {price && <span className="gh-badge dark num" style={{ right: 14, top: 14 }}>{price}</span>}
      </div>
      <div className="flex flex-col flex-1 p-6">
        <h3 className="text-[22px] leading-snug m-0">
          <Link to={placePath(place)} className="text-[#0F172A] no-underline after:absolute after:inset-0 after:content-[''] after:rounded-[20px]">{place.title}</Link>
        </h3>
        {place.location && <p className="mt-1.5 mb-0 flex items-center gap-1.5 text-[13px] text-[#475569]"><MapPin className="w-3.5 h-3.5" aria-hidden="true" />{place.location}</p>}
        <Specs rows={specsOf(place)} className="mt-5 pt-5 border-t border-[#E2E8F0]" />
        <div className="mt-auto pt-6 flex items-end justify-between gap-3">
          <FromPrice price={price} />
          <span className="text-[12px] font-semibold uppercase tracking-[.14em] text-[#1E3A8A] inline-flex items-center gap-1.5" aria-hidden="true">{cta} <ArrowRight className="w-4 h-4" /></span>
        </div>
      </div>
    </article>
  );
}

export default function PopularTours({ items }) {
  const track = useRef(null);
  const [active, setActive] = useState(0);

  // Active = the slide whose centre is nearest the track's centre.
  const measure = useCallback(() => {
    const t = track.current;
    if (!t) return;
    const mid = t.scrollLeft + t.clientWidth / 2;
    let best = 0; let dist = Infinity;
    [...t.children].forEach((el, i) => { const d = Math.abs(el.offsetLeft + el.offsetWidth / 2 - mid); if (d < dist) { dist = d; best = i; } });
    setActive(best);
  }, []);

  useEffect(() => {
    const t = track.current;
    if (!t) return undefined;
    let raf = 0;
    const onScroll = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(measure); };
    t.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    measure();
    return () => { cancelAnimationFrame(raf); t.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); };
  }, [measure, items.length]);

  const go = (i) => {
    const t = track.current;
    const el = t?.children[Math.max(0, Math.min(items.length - 1, i))];
    if (!el) return;
    const mobile = window.innerWidth < 768;
    t.scrollTo({ left: mobile ? el.offsetLeft - 16 : el.offsetLeft - (t.clientWidth - el.offsetWidth) / 2, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  };
  const onKey = (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); go(active + 1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(active - 1); }
  };

  if (!items.length) return null;
  const arrows = (
    <div className="hidden sm:flex gap-2">
      <button type="button" className="gh-arrow" onClick={() => go(active - 1)} disabled={active === 0} aria-label="Previous tour" aria-controls="popular-track"><ChevronLeft aria-hidden="true" /></button>
      <button type="button" className="gh-arrow" onClick={() => go(active + 1)} disabled={active >= items.length - 1} aria-label="Next tour" aria-controls="popular-track"><ChevronRight aria-hidden="true" /></button>
    </div>
  );

  return (
    <Section id="popular-tours" labelledBy="popular-title" className="!pb-[56px] lg:!pb-[96px] overflow-hidden">
      <SectionHead id="popular-title" eyebrow="Popular Nepal tours" title="Multi-day tours across Nepal" to="/destinations/national" extra={arrows} />
      <div className="rv" style={{ '--i': 2 }} role="region" aria-roledescription="carousel" aria-label="Popular Nepal tours" onKeyDown={onKey}>
        <p className="sr-only">Use the left and right arrow keys to move between tours.</p>
        <ul id="popular-track" ref={track} className="gh-track list-none m-0 -mx-4 sm:mx-[calc(50%-50vw)]" tabIndex={0} aria-label="Tours, scrollable">
          {items.map((p, i) => (
            <li key={p.id} className={`gh-slide ${i === active ? 'active' : ''}`} aria-roledescription="slide" aria-label={`${i + 1} of ${items.length}`}
              onFocusCapture={() => { if (i !== active) go(i); }}>
              <TourCard place={p} />
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
