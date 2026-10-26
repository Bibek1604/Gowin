import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import DestinationCard from './DestinationCard';
import SectionHeader from '../ui/SectionHeader';
import { CardSkeleton } from '../ui/Skeleton';

/** Horizontal, swipeable row of destination cards with a section header. */
const DestinationCarousel = ({ label, title, accent, subtitle, items = [], loading = false, linkTo, linkLabel = 'View all', bg = 'bg-white', id }) => {
  const ref = useRef(null);
  const [can, setCan] = useState({ left: false, right: false });

  const check = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    setCan({ left: el.scrollLeft > 4, right: el.scrollLeft < el.scrollWidth - el.clientWidth - 4 });
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    check();
    el.addEventListener('scroll', check, { passive: true });
    window.addEventListener('resize', check);
    return () => { el.removeEventListener('scroll', check); window.removeEventListener('resize', check); };
  }, [check, items.length]);

  if (!loading && items.length === 0) return null;

  const scroll = (dir) => ref.current?.scrollBy({ left: dir * Math.max(280, ref.current.clientWidth * 0.8), behavior: 'smooth' });

  return (
    <section id={id} className={`py-14 sm:py-16 lg:py-20 ${bg}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          label={label} title={title} accent={accent} subtitle={subtitle} className="mb-8"
          action={
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => scroll(-1)} disabled={!can.left} aria-label="Scroll left"
                className="w-10 h-10 rounded-xl border border-gray-200 bg-white text-[#1E3A8A] flex items-center justify-center hover:bg-[#1E3A8A] hover:text-white hover:border-[#1E3A8A] transition-colors disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-[#1E3A8A]">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button type="button" onClick={() => scroll(1)} disabled={!can.right} aria-label="Scroll right"
                className="w-10 h-10 rounded-xl border border-gray-200 bg-white text-[#1E3A8A] flex items-center justify-center hover:bg-[#1E3A8A] hover:text-white hover:border-[#1E3A8A] transition-colors disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-[#1E3A8A]">
                <ChevronRight className="w-4 h-4" />
              </button>
              {linkTo && (
                <Link to={linkTo} className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-[#1E3A8A]/15 text-[#1E3A8A] text-xs font-bold uppercase tracking-wider hover:bg-[#1E3A8A] hover:text-white transition-colors">
                  {linkLabel} <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              )}
            </div>
          }
        />
        <div ref={ref} className="flex gap-4 sm:gap-5 overflow-x-auto snap-x snap-mandatory pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 no-scrollbar">
          {loading ? (
            <div className="flex gap-4 sm:gap-5">
              <CardSkeleton count={4} className="min-w-[250px] sm:min-w-[280px] h-[380px]" />
            </div>
          ) : (
            items.map((d, i) => <DestinationCard key={d.id} dest={d} index={i} variant="carousel" />)
          )}
        </div>
      </div>
    </section>
  );
};

export default DestinationCarousel;
