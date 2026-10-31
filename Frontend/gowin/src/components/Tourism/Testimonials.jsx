import React, { useEffect } from 'react';
import Reveal from '../ui/Reveal';
import { Star, Quote } from 'lucide-react';
import useTestimonialStore from '../Store/TestimonialStore';
import SectionHeader from '../ui/SectionHeader';
import SmartImage from '../ui/SmartImage';

const initials = (name = '') => name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]?.toUpperCase()).join('');

const Card = ({ review, idx }) => (
  <Reveal as="figure" delay={(idx % 3) * 0.08}
    className="relative bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_4px_20px_rgba(15,23,42,0.05)] hover:shadow-[0_15px_40px_rgba(15,23,42,0.1)] hover:-translate-y-1 transition-all duration-300 flex flex-col">
    <Quote className="absolute top-5 right-5 w-8 h-8 text-gray-100" aria-hidden="true" />
    <div className="flex gap-0.5 mb-3" aria-label={`${review.rating || 5} out of 5 stars`}>
      {Array.from({ length: Math.min(5, Math.max(1, review.rating || 5)) }).map((_, i) => <Star key={i} className="w-4 h-4 text-[#FBBF24] fill-[#FBBF24]" />)}
    </div>
    <blockquote className="text-[#0F172A]/75 text-sm leading-relaxed flex-1 mb-5">“{review.content}”</blockquote>
    <figcaption className="flex items-center gap-3 pt-4 border-t border-gray-100">
      {review.image_url && !review.image_url.startsWith('data:') ? (
        <SmartImage src={review.image_url} alt="" sizes="64px" className="w-10 h-10 rounded-xl object-cover" />
      ) : (
        <span className="w-10 h-10 rounded-xl bg-[#1E3A8A] text-white text-xs font-bold flex items-center justify-center">{initials(review.user_name)}</span>
      )}
      <div className="min-w-0">
        <p className="font-bold text-[#0F172A] text-sm truncate">{review.user_name}</p>
        {review.designation && <p className="text-[11px] text-[#047857] font-semibold uppercase tracking-wider truncate">{review.designation}</p>}
      </div>
    </figcaption>
  </Reveal>
);

/** Only admin-approved reviews are shown; the section disappears when there are none. */
const Testimonials = () => {
  const { testimonials, fetchTestimonials, loaded } = useTestimonialStore();
  useEffect(() => { fetchTestimonials({ approvedOnly: true }); }, [fetchTestimonials]);
  const reviews = testimonials.filter((t) => t.is_approved).slice(0, 6);
  if (!loaded || reviews.length === 0) return null;

  return (
    <section className="py-14 sm:py-16 lg:py-20 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader label="Traveller feedback" title="What our guests" accent="say" align="center" className="mb-10" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {reviews.map((r, i) => <Card key={r.id} review={r} idx={i} />)}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
