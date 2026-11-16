import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Pause, Play } from 'lucide-react';
import { BUSINESS_FACTS } from '../../data/businessFacts';

export const HERO_POSTER = { src: '/media/hero-poster.avif', srcSet: '/media/hero-poster-960.avif 960w, /media/hero-poster.avif 1920w' };
export const HERO_POSTER_ALT = 'Phewa Lake and the Annapurna range seen from Sarangkot above Pokhara';

/** Hero sub-line; the reply-time promise appears only once the owner has set a real number. */
export const heroSubline = () => {
  const h = BUSINESS_FACTS.quoteReplyHours;
  return `Tell us your dates. We reply with a written quote${h ? ` within ${h} hours` : ''}. No payment until you approve it.`;
};

const reducedData = () => {
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches || navigator.connection?.saveData === true;
  } catch { return false; }
};

/**
 * Full-screen hero: a self-hosted, muted, looping video (public/media/hero-*.mp4|webm,
 * made from the site's own Nepal photos) over a poster image. The poster is the
 * largest paint; the video's source is only attached after window 'load', and
 * never under prefers-reduced-motion or Save-Data.
 */
export default function HeroVideo() {
  const videoRef = useRef(null);
  const [videoOn, setVideoOn] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (reducedData()) return undefined;
    const attach = () => setVideoOn(true);
    if (document.readyState === 'complete') { const t = setTimeout(attach, 300); return () => clearTimeout(t); }
    window.addEventListener('load', attach, { once: true });
    return () => window.removeEventListener('load', attach);
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!videoOn || !v) return;
    v.load();
    v.play().catch(() => { /* autoplay refused: the poster stays */ });
  }, [videoOn]);

  const toggle = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) { v.play().catch(() => {}); setPaused(false); } else { v.pause(); setPaused(true); }
  };

  return (
    <section className="gh-hero" aria-labelledby="hero-title">
      <div className="gh-hero-media">
        <img src={HERO_POSTER.src} srcSet={HERO_POSTER.srcSet} sizes="100vw" width="1920" height="1080" alt={HERO_POSTER_ALT} fetchPriority="high" decoding="sync" />
        {videoOn && (
          <video ref={videoRef} className={playing ? 'playing' : ''} autoPlay muted loop playsInline preload="none" poster={HERO_POSTER.src} aria-hidden="true" tabIndex={-1}
            onPlaying={() => setPlaying(true)}>
            <source src="/media/hero-720.mp4" type="video/mp4" media="(max-width: 767px)" />
            <source src="/media/hero-1080.webm" type="video/webm" />
            <source src="/media/hero-1080.mp4" type="video/mp4" />
          </video>
        )}
      </div>
      <div className="gh-wrap">
        <div className="gh-hero-inner">
          <span className="gh-watermark" aria-hidden="true">NEPAL</span>
          <h1 id="hero-title">Nepal tours &amp; world holidays, planned in Kathmandu</h1>
          <div className="gh-rule" aria-hidden="true" />
          <p className="gh-hero-sub">{heroSubline()}</p>
          <div className="gh-hero-ctas">
            <Link to="/booking" className="gh-pill white">Plan my trip <ArrowRight aria-hidden="true" /></Link>
            <Link to="/destinations" className="gh-pill ghost">View tours</Link>
          </div>
        </div>
      </div>
      {videoOn && playing && (
        <button type="button" className="gh-hero-pause" onClick={toggle} aria-label={paused ? 'Play background video' : 'Pause background video'}>
          {paused ? <Play aria-hidden="true" /> : <Pause aria-hidden="true" />}
        </button>
      )}
    </section>
  );
}
