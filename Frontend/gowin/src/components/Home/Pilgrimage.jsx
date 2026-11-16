import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Section, SectionHead, TourImage, Specs, FromPrice } from './ui';
import { TourCard } from './PopularTours';
import { specsOf, priceOf, oneLiner } from '../../lib/homeData';
import { placePath } from '../../lib/format';

/** Short horizontal label for a narrow panel: "Muktinath Pilgrimage Tour" → "Muktinath". */
const shortName = (t) => String(t).split(/\s(?:&|and|–|-|Temple|Pilgrimage|Tour|Circuit)\b/)[0];

export default function Pilgrimage({ items }) {
  const [active, setActive] = useState(0);
  if (items.length < 2) return null;

  return (
    <Section id="pilgrimage" labelledBy="pilgrim-title">
      <SectionHead id="pilgrim-title" eyebrow="Pilgrimage tours" title="|Sacred sites| of Nepal, with transport and stays arranged" to="/destinations/national" />

      {/* desktop: expanding panels */}
      <div className="gh-panels hidden md:flex rv" style={{ '--i': 2 }}>
        {items.map((p, n) => {
          const on = n === active;
          return (
            <article key={p.id} className={`gh-panel ${on ? 'active' : ''}`} onMouseEnter={() => setActive(n)} aria-labelledby={`pil-${p.id}`}>
              <TourImage place={p} variant="wide" sizes="(min-width: 768px) 60vw, 100vw" alt={on ? undefined : ''} />
              <button type="button" className="gh-panel-btn" onClick={() => setActive(n)} onFocus={() => setActive(n)} aria-expanded={on} aria-controls={`pil-body-${p.id}`}>
                <span className="n num">{String(n + 1).padStart(2, '0')}</span>
                <span className="l">{shortName(p.title)}</span>
              </button>
              <div id={`pil-body-${p.id}`} className="gh-panel-body on-photo" hidden={!on}>
                <span className="text-[12px] font-semibold tracking-[.18em] uppercase text-white/80 num">{String(n + 1).padStart(2, '0')} · {p.location}</span>
                <h3 id={`pil-${p.id}`} className="text-[32px] leading-tight mt-2 mb-0 text-white">{p.title}</h3>
                {oneLiner(p, 120) && <p className="mt-3 mb-0 text-[15px] leading-relaxed text-white/85 max-w-[52ch]">{oneLiner(p, 120)}</p>}
                <Specs rows={specsOf(p)} />
                <div className="flex flex-wrap items-center gap-6">
                  <FromPrice price={priceOf(p)} />
                  <Link to={placePath(p)} className="gh-pill white">Explore tour <ArrowRight aria-hidden="true" /></Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* mobile: stacked cards */}
      <ul className="md:hidden grid gap-6 list-none p-0 m-0">
        {items.map((p) => <li key={p.id} className="rv"><TourCard place={p} /></li>)}
      </ul>
    </Section>
  );
}
