import React, { useEffect, useState } from 'react';
import { Star, Quote, ShieldCheck, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../supabaseClient';
import { SEED_TESTIMONIALS } from '../../data/seedData';

const TestimonialCard = ({ review, featured = false }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className={`relative bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 border shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-[0_15px_40px_rgba(0,0,0,0.10)] transition-all duration-300 hover:-translate-y-1 ${
      featured
        ? 'border-[#FF7F50]/20 ring-2 ring-[#FF7F50]/10'
        : 'border-gray-100'
    }`}
  >
    {/* Quote icon */}
    <div className="absolute top-5 right-5 text-gray-100">
      <Quote className="w-8 h-8 sm:w-10 sm:h-10" />
    </div>

    {/* Stars */}
    <div className="flex gap-0.5 sm:gap-1 mb-3 sm:mb-4">
      {[...Array(review.rating || 5)].map((_, i) => (
        <Star key={i} className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#FFD23F] fill-[#FFD23F]" />
      ))}
    </div>

    {/* Content */}
    <p className="text-[#1a1a2e]/65 text-xs sm:text-sm leading-relaxed mb-5 sm:mb-6 relative z-10 line-clamp-4">
      "{review.content}"
    </p>

    {/* Reviewer */}
    <div className="flex items-center gap-2.5 sm:gap-3 pt-4 sm:pt-5 border-t border-gray-50">
      <img
        src={review.image_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(review.user_name)}&background=0F4C5C&color=fff&size=80`}
        alt={review.user_name}
        className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl object-cover border-2 border-gray-100 flex-shrink-0"
        loading="lazy"
      />
      <div className="min-w-0 flex-1">
        <h4 className="font-bold text-[#1a1a2e] text-sm truncate">{review.user_name}</h4>
        <p className="text-[10px] text-[#FF7F50] font-semibold uppercase tracking-wider truncate">
          {review.designation || 'Verified Traveler'}
        </p>
      </div>
      <div className="flex-shrink-0 w-7 h-7 bg-[#0F4C5C]/5 rounded-full flex items-center justify-center">
        <ShieldCheck className="w-3.5 h-3.5 text-[#0F4C5C]" />
      </div>
    </div>
  </motion.div>
);

const Testimonials = () => {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mobilePage, setMobilePage] = useState(0);

  useEffect(() => {
    const fetchReviews = async () => {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .eq('is_approved', true)
        .order('created_at', { ascending: false })
        .limit(6);
      setReviews(!error && data?.length >= 2 ? data : SEED_TESTIMONIALS);
      setIsLoading(false);
    };
    fetchReviews();
  }, []);

  const totalMobilePages = Math.ceil(reviews.length / 2);

  return (
    <section className="py-16 sm:py-20 md:py-28 bg-[#F8FAFB] relative overflow-hidden">
      <div className="absolute -top-40 -left-40 w-80 h-80 bg-[#0F4C5C]/4 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[#FF7F50]/4 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-14">
          <div className="flex justify-center mb-3 sm:mb-4">
            <span className="section-label">What Travelers Say</span>
          </div>
          <h2 className="heading-font text-3xl sm:text-4xl md:text-5xl text-[#1a1a2e]">
            Real Stories, <span className="text-[#0F4C5C]">Real Journeys</span>
          </h2>
          <p className="text-gray-500 text-sm md:text-base mt-2 sm:mt-3 max-w-xl mx-auto leading-relaxed">
            Hear directly from adventurers who chose GoWin Travels for their dream holidays across Nepal and the world.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-48 sm:h-52 bg-white rounded-2xl animate-pulse border border-gray-100" />
            ))}
          </div>
        ) : (
          <>
            {/* Desktop: 3-column grid */}
            <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {reviews.map((review, idx) => (
                <TestimonialCard key={review.id} review={review} featured={idx === 1} />
              ))}
            </div>

            {/* Mobile: paginated 2-up */}
            <div className="sm:hidden">
              <div className="grid grid-cols-1 gap-4">
                {reviews.slice(mobilePage * 2, mobilePage * 2 + 2).map((review) => (
                  <TestimonialCard key={review.id} review={review} />
                ))}
              </div>
              {totalMobilePages > 1 && (
                <div className="flex items-center justify-center gap-3 mt-6">
                  <button
                    onClick={() => setMobilePage(p => Math.max(0, p - 1))}
                    disabled={mobilePage === 0}
                    className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all ${mobilePage === 0 ? 'text-gray-200 border-gray-100 cursor-not-allowed' : 'text-[#0F4C5C] border-gray-200 hover:bg-[#0F4C5C] hover:text-white hover:border-[#0F4C5C]'}`}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  {[...Array(totalMobilePages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setMobilePage(i)}
                      className={`w-2 h-2 rounded-full transition-all ${i === mobilePage ? 'bg-[#FF7F50] w-5' : 'bg-gray-300'}`}
                    />
                  ))}
                  <button
                    onClick={() => setMobilePage(p => Math.min(totalMobilePages - 1, p + 1))}
                    disabled={mobilePage === totalMobilePages - 1}
                    className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all ${mobilePage === totalMobilePages - 1 ? 'text-gray-200 border-gray-100 cursor-not-allowed' : 'text-[#0F4C5C] border-gray-200 hover:bg-[#0F4C5C] hover:text-white hover:border-[#0F4C5C]'}`}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </>
        )}

        {/* Trust bar */}
        <div className="mt-12 sm:mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4 pt-10 border-t border-gray-200/60">
          {[
            { val: '4.9/5', label: 'Average Rating', emoji: '⭐' },
            { val: '100+', label: 'Happy Travelers', emoji: '🌍' },
            { val: '98%', label: 'Recommend Us', emoji: '👍' },
            { val: '24/7', label: 'Support', emoji: '📞' },
          ].map((item, i) => (
            <div key={i} className="text-center">
              <div className="text-2xl mb-1">{item.emoji}</div>
              <div className="text-xl sm:text-2xl font-black text-[#0F4C5C]">{item.val}</div>
              <div className="text-gray-400 text-[10px] sm:text-xs uppercase tracking-widest mt-0.5">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
