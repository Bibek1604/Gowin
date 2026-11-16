import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, CalendarDays, MapPin } from 'lucide-react';
import { Section, SectionHead, TourImage, FromPrice } from './ui';
import { specsOf, priceOf, oneLiner } from '../../lib/homeData';
import { placePath } from '../../lib/format';

const ICON = { duration: Clock, season: CalendarDays, pickup: MapPin };

export default function Wildlife({ items }) {
  const [i, setI] = useState(0);
  if (!items.length) return null;
  const p = items[i];

  return (
    <Section id="wildlife" labelledBy="wild-title" tone="dark">
      <SectionHead id="wild-title" eyebrow="Wildlife" title="Jungle safaris in the national parks of the Terai" to="/destinations/national" />
      <div className="gh-banner rv" style={{ '--i': 2 }}>
        {items.map((t, n) => (
          <div key={t.id} className="gh-layer" style={{ opacity: n === i ? 1 : 0 }} aria-hidden={n !== i}>
            <TourImage place={t} variant="wide" sizes="(min-width: 1280px) 1180px, 100vw" alt={n === i ? undefined : ''} />
          </div>
        ))}
        <div className="gh-banner-body" aria-live="polite">
          <span className="gh-eyebrow">{p.location}</span>
          <h3 className="text-[34px] sm:text-[44px] leading-[1.08] m-0 text-white">{p.title}</h3>
          {oneLiner(p, 150) && <p className="mt-4 mb-0 text-[16px] leading-relaxed text-white/85">{oneLiner(p, 150)}</p>}
          <ul className="flex flex-wrap gap-2 list-none p-0 mt-6 mb-7">
            {specsOf(p).map((r) => { const I = ICON[r.key]; return <li key={r.key} className="gh-chip glass"><I aria-hidden="true" /><span className="sr-only">{r.label}: </span>{r.value}</li>; })}
          </ul>
          <div className="flex flex-wrap items-center gap-6">
            <FromPrice price={priceOf(p)} />
            <Link to={placePath(p)} className="gh-pill white">Explore the safari <ArrowRight aria-hidden="true" /></Link>
          </div>
        </div>
        {items.length > 1 && (
          <div className="gh-thumbs" role="group" aria-label="Choose a safari">
            {items.map((t, n) => (
              <button key={t.id} type="button" className="gh-thumb" aria-pressed={n === i} onClick={() => setI(n)}
                onKeyDown={(e) => { const k = { ArrowRight: 1, ArrowLeft: -1 }[e.key]; if (k) { e.preventDefault(); const m = (n + k + items.length) % items.length; setI(m); e.currentTarget.parentElement.children[m]?.focus(); } }}>
                <TourImage place={t} alt="" sizes="120px" />
                <span>{t.title.split(/\s(?:Jungle|Wilderness|Safari|National)\b/)[0]}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </Section>
  );
}
