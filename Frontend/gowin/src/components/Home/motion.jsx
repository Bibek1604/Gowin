import React, { useEffect, useRef } from 'react';

/** Logo palette, used in order for letters, chips and accents. */
export const LOGO_COLORS = ['#3E478A', '#2FA8DE', '#F0832A', '#E2332B', '#E9A23B', '#4E7A3A'];
/** Darker shades of the same logo colours for text on white (each ≥ 4.5:1). */
export const LOGO_INKS = ['#3E478A', '#1B6F9C', '#B4530F', '#C62A22', '#94600F', '#41672F'];

const finePointer = () => typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
const reduced = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Interactive heading text. Letters near the pointer lift and take a colour
 * from the GoWin logo; only transform and colour change, so no line reflows
 * (no layout shift). Text between |bars| is the accent, drawn with a moving
 * logo-colour gradient. The accessible name is the plain text (aria-label).
 *
 *   <Kinetic as="h2" text="Multi-day tours across |Nepal|" />
 */
export function Kinetic({ as: Tag = 'span', text, className = '', id, style, wave = false }) {
  const ref = useRef(null);
  const plain = text.replace(/\|/g, '');

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced()) return undefined;
    const letters = [...el.querySelectorAll('.kl')];
    if (wave) el.classList.add('k-wave');
    if (!finePointer()) return undefined;
    let rects = [];
    let raf = 0;
    const measure = () => { rects = letters.map((l) => { const r = l.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; }); };
    const move = (e) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const reach = Math.max(90, el.getBoundingClientRect().height * 0.6);
        letters.forEach((l, i) => {
          const [x, y] = rects[i] || [0, 0];
          const d = Math.hypot(e.clientX - x, e.clientY - y);
          const p = Math.max(0, 1 - d / reach);
          l.style.setProperty('--p', p.toFixed(3));
        });
      });
    };
    const enter = (e) => { measure(); el.classList.add('k-live'); move(e); };
    const leave = () => { cancelAnimationFrame(raf); el.classList.remove('k-live'); letters.forEach((l) => l.style.setProperty('--p', '0')); };
    el.addEventListener('pointerenter', enter);
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', leave);
    window.addEventListener('scroll', measure, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener('pointerenter', enter); el.removeEventListener('pointermove', move); el.removeEventListener('pointerleave', leave);
      window.removeEventListener('scroll', measure);
    };
  }, [text, wave]);

  let n = 0;
  const parts = text.split('|');
  return (
    <Tag ref={ref} id={id} className={`kinetic ${className}`} style={style} aria-label={plain}>
      <span aria-hidden="true">
        {parts.map((part, pi) => {
          const accent = pi % 2 === 1;
          const words = part.split(/(\s+)/);
          return (
            <span key={pi} className={accent ? 'k-accent' : undefined}>
              {words.map((w, wi) => (/^\s+$/.test(w) ? ' ' : w && (
                <span key={wi} className="kw">
                  {[...w].map((ch, ci) => {
                    const i = n; n += 1;
                    return <span key={ci} className="kl" style={{ '--i': i, '--lc': LOGO_COLORS[i % LOGO_COLORS.length] }}>{ch}</span>;
                  })}
                </span>
              )))}
            </span>
          );
        })}
      </span>
    </Tag>
  );
}

/** "NEPAL" watermark: variable weight + width follow the pointer across the hero; logo-colour gradient fill. Absolutely positioned, so nothing else moves. */
export function Watermark({ text = 'NEPAL' }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    const hero = el?.closest('.gh-hero');
    if (!el || !hero || reduced() || !finePointer()) return undefined;
    let raf = 0;
    const move = (e) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = hero.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width;
        const y = (e.clientY - r.top) / r.height;
        el.style.setProperty('--wm-w', String(Math.round(250 + x * 550)));
        el.style.setProperty('--wm-s', String(Math.round(75 + (1 - y) * 25)));
        el.style.setProperty('--wm-x', `${(x * 100).toFixed(1)}%`);
      });
    };
    hero.addEventListener('pointermove', move);
    return () => { cancelAnimationFrame(raf); hero.removeEventListener('pointermove', move); };
  }, []);
  return <span ref={ref} className="gh-watermark" aria-hidden="true">{text}</span>;
}

/** 3D tilt + light glare that follows the pointer (desktop only). Spread the returned props on the card. */
export function useTilt(max = 6) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || reduced() || !finePointer()) return undefined;
    let raf = 0;
    const move = (e) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        el.style.setProperty('--rx', `${(-y * max).toFixed(2)}deg`);
        el.style.setProperty('--ry', `${(x * max).toFixed(2)}deg`);
        el.style.setProperty('--gx', `${((x + 0.5) * 100).toFixed(1)}%`);
        el.style.setProperty('--gy', `${((y + 0.5) * 100).toFixed(1)}%`);
      });
    };
    const leave = () => { cancelAnimationFrame(raf); el.style.setProperty('--rx', '0deg'); el.style.setProperty('--ry', '0deg'); };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', leave);
    return () => { cancelAnimationFrame(raf); el.removeEventListener('pointermove', move); el.removeEventListener('pointerleave', leave); };
  }, [max]);
  return ref;
}

/** Thin logo-gradient bar at the top of the window showing how far down the page you are. */
export function ScrollProgress() {
  const ref = useRef(null);
  useEffect(() => {
    let raf = 0;
    const on = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const h = document.documentElement.scrollHeight - window.innerHeight;
        if (ref.current) ref.current.style.transform = `scaleX(${h > 0 ? Math.min(1, window.scrollY / h) : 0})`;
      });
    };
    on();
    window.addEventListener('scroll', on, { passive: true });
    window.addEventListener('resize', on);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('scroll', on); window.removeEventListener('resize', on); };
  }, []);
  return <div ref={ref} className="gh-progress" aria-hidden="true" />;
}

/** Endless band of place names (from the published Nepal tours), outlined and filled in logo colours. Pauses on hover. */
export function PlaceMarquee({ places }) {
  if (places.length < 4) return null;
  const row = places.map((p, i) => (
    <li key={`${p}-${i}`} className={i % 2 ? 'outline' : ''} style={{ '--lc': LOGO_INKS[i % LOGO_INKS.length] }}>{p}<span className="dot" aria-hidden="true" /></li>
  ));
  return (
    <div className="gh-marquee" role="region" aria-label="Places we travel to in Nepal">
      <ul className="gh-marquee-track">{row}</ul>
      <ul className="gh-marquee-track" aria-hidden="true">{row}</ul>
    </div>
  );
}

/** The five coloured stripes from the GoWin logo, used before eyebrow labels. */
export const LogoStripes = () => (
  <span className="gh-stripes" aria-hidden="true"><i /><i /><i /><i /><i /></span>
);
