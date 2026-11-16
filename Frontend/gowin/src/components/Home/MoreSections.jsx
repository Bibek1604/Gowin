import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, Lightbulb, Plane, FileCheck, MapPin, Plus, MessageCircle, Clock } from 'lucide-react';
import { Section, SectionHead, TourImage, MediaImage } from './ui';
import { priceOf, nprPrice, flightsFromKtm, toursForSeason } from '../../lib/homeData';
import { placePath, shortDuration, whatsappLink } from '../../lib/format';
import { iconFor } from '../../lib/icons';
import { slugify } from '../../lib/slugify';
import { SEASONS, HOME_SERVICES, HOME_STEPS, HOME_GUIDES, HOME_FAQS } from '../../data/homeContent';
import { NEPAL_TRAVEL_TIPS } from '../../data/siteContent';
import { BUSINESS_FACTS as F } from '../../data/businessFacts';

/* ---------- 7. Holidays from Kathmandu ---------- */
export function Holidays({ items }) {
  if (!items.length) return null;
  return (
    <Section id="holidays" labelledBy="hol-title" tone="off">
      <SectionHead id="hol-title" eyebrow="Holidays from Kathmandu" title="International holidays for travellers from Nepal" lead="Hotels and sightseeing arranged abroad, with flights from Kathmandu and visa paperwork handled by the same team." to="/destinations/international" />
      <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 list-none p-0 m-0">
        {items.map((p, n) => {
          const npr = nprPrice(p);
          const usd = priceOf(p);
          return (
            <li key={p.id} className="rv" style={{ '--i': n % 3 }}>
              <article className="gh-card hoverable h-full">
                <div className="gh-media"><TourImage place={p} sizes="(min-width: 1024px) 380px, (min-width: 640px) 46vw, 92vw" /></div>
                <div className="flex flex-col flex-1 p-6">
                  <p className="m-0 text-[12px] font-semibold tracking-[.14em] uppercase text-[#475569] flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" aria-hidden="true" />{p.location}</p>
                  <h3 className="text-[22px] leading-snug mt-2 mb-0">
                    <Link to={placePath(p)} className="text-[#0F172A] after:absolute after:inset-0 after:content-[''] after:rounded-[20px]">{p.title}</Link>
                  </h3>
                  <div className="mt-4">
                    {npr ? (<><p className="gh-from m-0">From <b className="num">{npr}</b></p><p className="m-0 mt-1 text-[13px] text-[#475569] num">about {usd} per person</p></>)
                      : <p className="gh-from m-0">From <b className="num">{usd}</b></p>}
                  </div>
                  <p className="mt-4 mb-0 flex items-center gap-2 text-[14px] text-[#475569]"><Plane className="w-4 h-4 text-[#047857]" aria-hidden="true" />{flightsFromKtm(p) ? 'Flights from KTM included' : 'Flights from KTM quoted separately'}</p>
                  <div className="mt-auto pt-5 flex flex-wrap gap-2">
                    {shortDuration(p.duration) && <span className="gh-chip"><Clock aria-hidden="true" />{shortDuration(p.duration)}</span>}
                    <span className="gh-chip green"><FileCheck aria-hidden="true" />Visa help available</span>
                  </div>
                </div>
              </article>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}

/* ---------- 8. Best time to visit ---------- */
export function Seasons({ nepal }) {
  const [i, setI] = useState(() => {
    const m = new Date().getMonth() + 1;
    return Math.max(0, SEASONS.findIndex((s) => s.monthNums.includes(m)));
  });
  const s = SEASONS[i];
  const tours = toursForSeason(nepal, s.monthNums);
  const onKey = (e, n) => {
    const k = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
    if (!k) return;
    e.preventDefault();
    const m = (n + k + SEASONS.length) % SEASONS.length;
    setI(m);
    document.getElementById(`season-tab-${SEASONS[m].id}`)?.focus();
  };
  return (
    <Section id="best-time" labelledBy="season-title">
      <SectionHead id="season-title" eyebrow="Best time to visit Nepal" title="What each season is like" to="/guides" cta="Read the guide" />
      <div role="tablist" aria-label="Seasons" className="gh-tabs rv" style={{ '--i': 1 }}>
        {SEASONS.map((x, n) => (
          <button key={x.id} id={`season-tab-${x.id}`} type="button" role="tab" className="gh-tab" aria-selected={n === i} aria-controls="season-panel" tabIndex={n === i ? 0 : -1}
            onClick={() => setI(n)} onKeyDown={(e) => onKey(e, n)}>
            <b>{x.name}</b><small className="num">{x.months}</small>
          </button>
        ))}
      </div>
      <div id="season-panel" role="tabpanel" aria-labelledby={`season-tab-${s.id}`} className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-start rv" style={{ '--i': 2 }}>
        <div className="gh-card !rounded-[24px] aspect-[16/11] lg:aspect-auto lg:h-full lg:min-h-[480px]">
          <MediaImage key={s.id} base={s.image} alt="" className="absolute inset-0 w-full h-full object-cover" />
        </div>
        <div>
          <h3 className="text-[34px] leading-tight m-0">{s.name} <span className="num text-[18px] font-medium text-[#475569]">{s.months}</span></h3>
          <p className="mt-3 mb-0 text-[16px] leading-relaxed text-[#475569]">{s.summary}</p>
          <dl className="grid grid-cols-2 gap-2 mt-6">
            {Object.entries(s.chips).map(([k, v]) => (
              <div key={k} className="rounded-2xl border border-[#E2E8F0] px-4 py-3">
                <dt className="text-[12px] font-semibold tracking-[.14em] uppercase text-[#475569]">{k}</dt>
                <dd className="m-0 mt-0.5 text-[15px] font-medium text-[#0F172A]">{v}</dd>
              </div>
            ))}
          </dl>
          <ul className="list-none p-0 mt-6 mb-0 space-y-2.5">
            {s.points.map((p) => <li key={p} className="flex gap-3 text-[15px] leading-relaxed text-[#0F172A]"><Check className="w-5 h-5 text-[#047857] flex-shrink-0 mt-0.5" aria-hidden="true" />{p}</li>)}
          </ul>
          {tours.length > 0 && (
            <div className="mt-6">
              <p className="text-[12px] font-semibold tracking-[.14em] uppercase text-[#475569] mb-2">Tours that suit this season</p>
              <ul className="flex flex-wrap gap-2 list-none p-0 m-0">
                {tours.map((t) => <li key={t.id}><Link to={placePath(t)} className="gh-chip hover:bg-[#1E3A8A] hover:text-white min-h-[44px] px-4">{t.title}</Link></li>)}
              </ul>
            </div>
          )}
          <div className="gh-tip mt-6 flex gap-3"><Lightbulb className="w-5 h-5 flex-shrink-0 mt-0.5" aria-hidden="true" /><p className="m-0"><strong>GoWin team tip: </strong>{s.tip}</p></div>
        </div>
      </div>
    </Section>
  );
}

/* ---------- 9. Services ---------- */
export function ServicesHome() {
  return (
    <Section id="services" labelledBy="svc-title" tone="off">
      <SectionHead id="svc-title" eyebrow="Services" title="Tickets, visas, insurance and hotels" to="/services" />
      <ul className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 list-none p-0 m-0">
        {HOME_SERVICES.map((s, n) => {
          const Icon = iconFor(s.icon);
          return (
            <li key={s.title} className="rv" style={{ '--i': n }}>
              <article className="gh-card hoverable h-full p-7">
                <span className="w-14 h-14 rounded-2xl bg-[#1E3A8A] text-white flex items-center justify-center mb-6"><Icon className="w-6 h-6" aria-hidden="true" /></span>
                <h3 className="text-[22px] m-0"><Link to={s.to} className="text-[#0F172A] after:absolute after:inset-0 after:content-[''] after:rounded-[20px]">{s.title}</Link></h3>
                <p className="mt-2 mb-6 text-[15px] leading-relaxed text-[#475569]">{s.desc}</p>
                <span className="mt-auto text-[12px] font-semibold uppercase tracking-[.14em] text-[#1E3A8A] inline-flex items-center gap-1.5" aria-hidden="true">Learn more <ArrowRight className="w-4 h-4" /></span>
              </article>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}

/* ---------- 10. How it works ---------- */
export function HowItWorksHome() {
  const reply = F.quoteReplyHours ? `We reply with a written quote within ${F.quoteReplyHours} hours.` : 'We reply during office hours, Sun–Fri, 9 am – 6 pm NPT.';
  return (
    <Section id="how-it-works" labelledBy="how-title">
      <SectionHead id="how-title" eyebrow="How it works" title="From first message to your trip, in four steps" />
      <ol className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 list-none p-0 m-0">
        {HOME_STEPS.map((s, n) => {
          const Icon = iconFor(s.icon);
          return (
            <li key={s.num} className="rv" style={{ '--i': n }}>
              <article className="relative h-full rounded-[20px] border border-[#E2E8F0] bg-white p-7 overflow-hidden">
                <span className="num absolute right-5 top-3 text-[64px] font-bold leading-none text-[#1E3A8A]/[.08]" aria-hidden="true">{s.num}</span>
                <span className="w-12 h-12 rounded-full bg-[#ECFDF5] text-[#047857] flex items-center justify-center mb-6"><Icon className="w-5 h-5" aria-hidden="true" /></span>
                <p className="num m-0 text-[12px] font-semibold tracking-[.18em] text-[#047857]">STEP {s.num}</p>
                <h3 className="text-[22px] mt-1 mb-0">{s.title}</h3>
                <p className="mt-2 mb-0 text-[15px] leading-relaxed text-[#475569]">{s.desc}</p>
                {n === 0 && <p className="mt-3 mb-0 text-[13px] font-medium text-[#065F46]">{reply}</p>}
              </article>
            </li>
          );
        })}
      </ol>
      <div className="mt-10 rv" style={{ '--i': 4 }}><Link to="/booking" className="gh-pill solid">Start your enquiry <ArrowRight aria-hidden="true" /></Link></div>
    </Section>
  );
}

/* ---------- 11. Travel tips & guides ---------- */
export function GuidesHome() {
  const tips = HOME_GUIDES.map((t) => NEPAL_TRAVEL_TIPS.find((x) => x.title === t)).filter(Boolean);
  if (!tips.length) return null;
  return (
    <Section id="guides" labelledBy="guides-title" tone="off">
      <SectionHead id="guides-title" eyebrow="Travel tips & guides" title="Practical notes before you go" to="/guides" />
      <ul className="grid md:grid-cols-3 gap-6 list-none p-0 m-0">
        {tips.map((t, n) => {
          const Icon = iconFor(t.icon);
          return (
            <li key={t.title} className="rv" style={{ '--i': n }}>
              <article className="gh-card hoverable h-full p-7">
                <span className="w-12 h-12 rounded-2xl bg-[#EEF2FF] text-[#1E3A8A] flex items-center justify-center mb-6"><Icon className="w-5 h-5" aria-hidden="true" /></span>
                <p className="m-0 text-[12px] font-semibold tracking-[.18em] uppercase text-[#047857]">Guide</p>
                <h3 className="text-[24px] leading-snug mt-1 mb-0"><Link to={`/guides#${slugify(t.title)}`} className="text-[#0F172A] after:absolute after:inset-0 after:content-[''] after:rounded-[20px]">{t.title}</Link></h3>
                <p className="mt-3 mb-6 text-[15px] leading-relaxed text-[#475569]">{t.points[0]}</p>
                <span className="mt-auto text-[12px] font-semibold uppercase tracking-[.14em] text-[#1E3A8A] inline-flex items-center gap-1.5" aria-hidden="true">Read more <ArrowRight className="w-4 h-4" /></span>
              </article>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}

/* ---------- 13. FAQ ---------- */
export function faqAnswer(f) {
  let a = f.a;
  if (f.licence && F.tourismLicenceNo) a += ` ${f.licence.replace('{licence}', F.tourismLicenceNo)}`;
  if (f.reply && F.quoteReplyHours) a += ` ${f.reply.replace('{reply}', F.quoteReplyHours)}`;
  return a;
}

export function FaqHome({ whatsapp }) {
  const [open, setOpen] = useState(0);
  return (
    <Section id="faq" labelledBy="faq-title">
      <div className="grid lg:grid-cols-[1.6fr_1fr] gap-12 lg:gap-16 items-start">
        <div>
          <span className="gh-eyebrow rv">FAQ</span>
          <h2 id="faq-title" className="gh-title rv mb-10" style={{ '--i': 1, maxWidth: '24ch' }}>Asked by every traveller. Answered by our Kathmandu team.</h2>
          <ul className="gh-faq rv" style={{ '--i': 2 }}>
            {HOME_FAQS.map((f, n) => {
              const on = open === n;
              return (
                <li key={f.q}>
                  <h3 className="m-0">
                    <button type="button" id={`faq-q-${n}`} className="gh-faq-q" aria-expanded={on} aria-controls={`faq-a-${n}`} onClick={() => setOpen(on ? -1 : n)}>
                      <span className="n num">{String(n + 1).padStart(2, '0')}</span>
                      <span className="t">{f.q}</span>
                      <span className="i" aria-hidden="true"><Plus className="w-4 h-4" /></span>
                    </button>
                  </h3>
                  <div id={`faq-a-${n}`} role="region" aria-labelledby={`faq-q-${n}`} className={`gh-faq-a ${on ? 'open' : ''}`} inert={!on}>
                    <div><p>{faqAnswer(f)}</p></div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
        <aside className="rv lg:sticky lg:top-28 rounded-[24px] bg-[#1E3A8A] text-white p-8" style={{ '--i': 3 }} aria-labelledby="faq-help">
          <h3 id="faq-help" className="text-[28px] leading-tight m-0 text-white">Still have a question?</h3>
          <p className="mt-3 mb-7 text-[15px] leading-relaxed text-white/85">Message the people who plan the trips. We answer Sunday to Friday, 9 am to 6 pm Nepal time.</p>
          {whatsapp && <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="gh-pill white w-full"><MessageCircle aria-hidden="true" />Chat on WhatsApp</a>}
          <Link to="/support" className="gh-pill ghost w-full mt-3">All questions</Link>
        </aside>
      </div>
    </Section>
  );
}

/* ---------- sticky mobile bar (after the hero) ---------- */
export function MobileBar({ whatsapp }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const on = () => setShow(window.scrollY > window.innerHeight * 0.85);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  return (
    <div className={`gh-bar ${show ? 'show' : ''}`} inert={!show}>
      {whatsapp ? <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="gh-pill"><MessageCircle aria-hidden="true" />WhatsApp</a> : <span />}
      <Link to="/booking" className="gh-pill solid">Plan my trip</Link>
    </div>
  );
}

export { whatsappLink };
