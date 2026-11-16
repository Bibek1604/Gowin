import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BadgeCheck, Star } from 'lucide-react';
import { Section } from './ui';
import { BUSINESS_FACTS as F, hasFact } from '../../data/businessFacts';

/** Owner photos when supplied, otherwise two of the site's own Kathmandu Valley photos (described as what they show). */
const PHOTOS = [
  F.officePhoto ? { src: F.officePhoto, alt: 'The GoWin Travels office in Shankhamul, Kathmandu' } : { base: '/media/tours/kathmandu-valley-heritage-tour', alt: 'Boudhanath Stupa in Kathmandu, seen from above' },
  F.teamPhoto ? { src: F.teamPhoto, alt: 'The GoWin Travels team in Kathmandu' } : { base: '/media/tours/bhaktapur-durbar-square-tour', alt: 'Temples of Bhaktapur Durbar Square' },
];

const Photo = ({ p, className }) => (
  <div className={`absolute overflow-hidden rounded-[20px] shadow-[0_24px_48px_-16px_rgba(15,23,42,.35)] border-[6px] border-white bg-gray-200 ${className}`}>
    {p.src ? <img src={p.src} alt={p.alt} width="600" height="450" loading="lazy" className="w-full h-full object-cover" /> : (
      <picture>
        <source type="image/avif" srcSet={`${p.base}-600.avif`} />
        <img src={`${p.base}-600.webp`} alt={p.alt} width="600" height="450" loading="lazy" decoding="async" className="w-full h-full object-cover" />
      </picture>
    )}
  </div>
);

export default function WhoWeAre() {
  const stats = [
    hasFact(F.yearsOperating) && { value: `${F.yearsOperating}`, label: 'Years operating' },
    hasFact(F.travellersServed) && { value: `${F.travellersServed}`, label: 'Travellers served' },
    hasFact(F.googleRating) && { value: `${F.googleRating.rating}`, label: `Google rating${F.googleRating.count ? ` · ${F.googleRating.count} reviews` : ''}`, icon: Star },
  ].filter(Boolean);
  const creds = [
    hasFact(F.tourismLicenceNo) && `Dept. of Tourism licence ${F.tourismLicenceNo}`,
    hasFact(F.companyRegNo) && `Company reg. ${F.companyRegNo}`,
    ...(F.memberships || []).map((m) => `${m} member`),
  ].filter(Boolean);

  return (
    <Section id="who-we-are" labelledBy="who-title" tone="off">
      <div className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">
        <div className="rv relative h-[380px] sm:h-[480px] max-w-[560px] w-full mx-auto lg:mx-0">
          <Photo p={PHOTOS[0]} className="left-0 top-0 w-[72%] h-[72%] -rotate-3" />
          <Photo p={PHOTOS[1]} className="right-0 bottom-0 w-[62%] h-[62%] rotate-3" />
          {hasFact(F.tourismLicenceNo) && (
            <div className="absolute left-4 bottom-6 sm:left-8 z-10 flex items-center gap-3 bg-white rounded-2xl shadow-[0_12px_32px_-12px_rgba(15,23,42,.35)] px-4 py-3 max-w-[260px]">
              <BadgeCheck className="w-7 h-7 text-[#047857] flex-shrink-0" aria-hidden="true" />
              <p className="text-[13px] leading-snug text-[#0F172A] font-medium m-0">Licensed by Dept. of Tourism, Nepal · Reg. <span className="num">{F.tourismLicenceNo}</span></p>
            </div>
          )}
        </div>

        <div>
          <span className="gh-eyebrow rv">Who we are</span>
          <h2 id="who-title" className="gh-title rv" style={{ '--i': 1 }}>A Kathmandu team that plans every trip in writing.</h2>
          <div className="rv mt-6 space-y-3 text-[16px] leading-relaxed text-[#475569] max-w-[54ch]" style={{ '--i': 2 }}>
            <p>We are based in Shankhamul, Kathmandu, and arrange Nepal tours, international holidays, flights, hotels and visa help.</p>
            <p>Every trip starts with a written quote that lists the itinerary, the price and what it includes.</p>
            <p>You pay only after you approve it, and the same team stays reachable while you travel.</p>
          </div>

          {stats.length > 0 && (
            <dl className="rv grid grid-cols-3 gap-3 mt-8 max-w-[480px]" style={{ '--i': 3 }}>
              {stats.map((s) => (
                <div key={s.label} className="flex flex-col-reverse bg-white rounded-2xl p-4 shadow-[0_1px_2px_rgba(15,23,42,.04),0_8px_24px_-12px_rgba(15,23,42,.18)]">
                  <dt className="text-[12px] text-[#475569] leading-tight">{s.label}</dt>
                  <dd className="num m-0 text-[28px] font-bold text-[#1E3A8A] flex items-center gap-1">{s.value}{s.icon && <s.icon className="w-5 h-5 fill-[#F59E0B] text-[#F59E0B]" aria-hidden="true" />}</dd>
                </div>
              ))}
            </dl>
          )}

          {creds.length > 0 && <p className="rv mt-6 text-[13px] font-medium text-[#0F172A]" style={{ '--i': 4 }}>{creds.join(' · ')}</p>}

          <div className="rv mt-8" style={{ '--i': 4 }}>
            <Link to="/about" className="gh-pill solid">Meet our team <ArrowRight aria-hidden="true" /></Link>
          </div>
        </div>
      </div>
    </Section>
  );
}
