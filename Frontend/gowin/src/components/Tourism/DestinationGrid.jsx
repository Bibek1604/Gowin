import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import DestinationCard from './DestinationCard';
import SectionHeader from '../ui/SectionHeader';
import { CardSkeleton } from '../ui/Skeleton';

/**
 * "Top 10" section: a swipeable row on phones, a 5-column grid from the
 * large breakpoint. Cards are numbered so the curated order is visible.
 */
const DestinationGrid = ({ id, label, title, accent, subtitle, items = [], loading = false, linkTo, linkLabel = 'View all', bg = 'bg-white' }) => {
  if (!loading && items.length === 0) return null;
  return (
    <section id={id} className={`py-14 sm:py-16 lg:py-20 ${bg}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          label={label} title={title} accent={accent} subtitle={subtitle} className="mb-8"
          action={linkTo && (
            <Link to={linkTo} className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-[#1E3A8A]/15 text-[#1E3A8A] text-xs font-bold uppercase tracking-wider hover:bg-[#1E3A8A] hover:text-white transition-colors">
              {linkLabel} <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        />
        <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 -mx-4 px-4 no-scrollbar lg:grid lg:grid-cols-4 xl:grid-cols-5 lg:gap-5 lg:overflow-visible lg:pb-0 lg:mx-0 lg:px-0">
          {loading
            ? <CardSkeleton count={5} className="min-w-[250px] lg:min-w-0 h-[380px]" />
            : items.map((d, i) => <DestinationCard key={d.id} dest={d} index={i} rank={i + 1} variant="responsive" priority={i < 2} />)}
        </div>
      </div>
    </section>
  );
};

export default DestinationGrid;
