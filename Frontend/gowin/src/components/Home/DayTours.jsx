import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Pause, Play } from 'lucide-react';
import { Section, SectionHead, TourImage, Specs, FromPrice } from './ui';
import { priceOf, oneLiner, shortSeason, pickupOf } from '../../lib/homeData';
import { placePath, shortDuration } from '../../lib/format';

const ROTATE_MS = 6000;

export default function DayTours({ items }) {
  const [i, setI] = useState(0);
  const [auto, setAuto] = useState(true);
  const rows = useRef([]);
  const chips = useRef([]);
  const reduce = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    if (!auto || reduce || items.length < 2) return undefined;
    const t = setInterval(() => setI((n) => (n + 1) % items.length), ROTATE_MS);
    return () => clearInterval(t);
  }, [auto, reduce, items.length]);

  if (items.length < 2) return null;
  const stop = () => setAuto(false);
  const select = (n, focus = false) => { setI(n); stop(); if (focus) { const r = rows.current[n]; (r && r.offsetParent ? r : chips.current[n])?.focus(); } };
  const onKey = (e, n) => {
    const k = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
    if (k) { e.preventDefault(); select((n + k + items.length) % items.length, true); }
    if (e.key === 'Home') { e.preventDefault(); select(0, true); }
    if (e.key === 'End') { e.preventDefault(); select(items.length - 1, true); }
  };
  const p = items[i];
  const specs = [
    { key: 'duration', label: 'Duration', value: shortDuration(p.duration) },
    { key: 'pickup', label: 'Pickup', value: pickupOf(p) },
    { key: 'season', label: 'Best season', value: shortSeason(p.details?.best_time) },
  ].filter((r) => r.value);

  const pauseBtn = !reduce && (
    <button type="button" onClick={() => setAuto((a) => !a)} className="gh-arrow" aria-label={auto ? 'Pause automatic rotation' : 'Start automatic rotation'}>
      {auto ? <Pause aria-hidden="true" /> : <Play aria-hidden="true" />}
    </button>
  );

  const tabProps = (n) => ({
    role: 'tab', id: `day-tab-${n}`, 'aria-selected': n === i, 'aria-controls': 'day-panel', tabIndex: n === i ? 0 : -1,
    onClick: () => select(n), onKeyDown: (e) => onKey(e, n),
  });

  return (
    <Section id="day-tours" labelledBy="day-title" tone="off">
      <SectionHead id="day-title" eyebrow="Kathmandu Valley day tours" title="Temples, palace squares and a mountain sunrise" to="/destinations/national" extra={pauseBtn} />
      <div className="grid lg:grid-cols-[1.35fr_1fr] gap-8 lg:gap-14 items-stretch" onMouseEnter={stop} onFocusCapture={stop} onTouchStart={stop}>
        {/* mobile: chips above the card */}
        <div className="gh-chips-row lg:hidden" role="tablist" aria-label="Day tours">
          {items.map((t, n) => <button key={t.id} type="button" className="gh-chiptab" ref={(el) => { chips.current[n] = el; }} {...tabProps(n)} id={`day-chip-${n}`}>{String(n + 1).padStart(2, '0')} · {t.title}</button>)}
        </div>

        <div id="day-panel" role="tabpanel" aria-labelledby={`day-tab-${i}`} className="gh-feature rv on-photo">
          {items.map((t, n) => (
            <div key={t.id} className="gh-layer" style={{ opacity: n === i ? 1 : 0 }} aria-hidden={n !== i}>
              <TourImage place={t} variant="wide" sizes="(min-width: 1024px) 58vw, 100vw" alt={n === i ? undefined : ''} />
            </div>
          ))}
          <div className="gh-feature-body" aria-live={auto ? 'off' : 'polite'}>
            {p.categories?.name && <span className="gh-chip glass mb-4">{p.categories.name}</span>}
            <h3 className="text-[30px] sm:text-[36px] leading-tight m-0 text-white">{p.title}</h3>
            {oneLiner(p) && <p className="gh-quote">“{oneLiner(p)}”</p>}
            <Specs rows={specs} inline className="mb-6" />
            <div className="flex flex-wrap items-center justify-between gap-4">
              <FromPrice price={priceOf(p)} />
              <Link to={placePath(p)} className="gh-pill white">Explore tour <ArrowRight aria-hidden="true" /></Link>
            </div>
          </div>
        </div>

        <ol className="gh-numlist hidden lg:block self-center w-full" role="tablist" aria-label="Day tours" aria-orientation="vertical">
          {items.map((t, n) => (
            <li key={t.id} role="presentation" className="rv" style={{ '--i': n + 1 }}>
              <button type="button" className="gh-numrow" ref={(el) => { rows.current[n] = el; }} {...tabProps(n)}>
                <span className="n num">{String(n + 1).padStart(2, '0')}</span>
                <span className="t">{t.title}</span>
                <span className="m num">{shortDuration(t.duration)}</span>
              </button>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}
