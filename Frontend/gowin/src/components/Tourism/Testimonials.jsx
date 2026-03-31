import React, { useEffect, useState } from 'react';
import { Star, Quote, ShieldCheck } from 'lucide-react';
import { supabase } from '../../supabaseClient';

const Testimonials = () => {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .eq('is_approved', true)
        .order('created_at', { ascending: false })
        .limit(6);
      setReviews(!error && data?.length ? data : []);
      setIsLoading(false);
    };
    fetch();
  }, []);

  return (
    <section className="py-20 md:py-28 bg-[#F8FAFB] relative overflow-hidden">
      <div className="absolute -top-40 -left-40 w-80 h-80 bg-[#0F4C5C]/4 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[#FF7F50]/4 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <div className="flex justify-center mb-4">
            <span className="section-label">What Travelers Say</span>
          </div>
          <h2 className="heading-font text-4xl md:text-5xl text-[#1a1a2e]">
            Real Stories, <span className="text-[#0F4C5C]">Real Journeys</span>
          </h2>
          <p className="text-gray-500 text-sm md:text-base mt-3 max-w-xl mx-auto leading-relaxed">
            Hear directly from adventurers who chose GoWin Travels for their dream holidays.
          </p>
        </div>



        {/* Reviews */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[1,2,3].map(i => <div key={i} className="h-52 bg-white rounded-3xl animate-pulse border border-gray-100" />)}
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-10 max-w-sm mx-auto">
              <ShieldCheck className="w-12 h-12 text-gray-200 mx-auto mb-3" />
              <p className="text-gray-400 text-sm">Guest reviews coming soon.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {reviews.map((review, idx) => (
              <div
                key={review.id}
                className={`bg-white rounded-3xl p-7 border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_15px_40px_rgba(0,0,0,0.09)] transition-all duration-400 hover:-translate-y-1 relative ${idx === 1 ? 'md:mt-5' : ''}`}
              >
                {/* Quote */}
                <div className="absolute top-6 right-6 text-gray-100">
                  <Quote className="w-9 h-9" />
                </div>

                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(review.rating || 5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-[#FFD23F] fill-[#FFD23F]" />
                  ))}
                </div>

                {/* Text */}
                <p className="text-[#1a1a2e]/65 text-sm leading-relaxed mb-6 relative z-10">
                  "{review.content}"
                </p>

                {/* Reviewer */}
                <div className="flex items-center gap-3 pt-5 border-t border-gray-50">
                  <img
                    src={review.image_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(review.user_name)}&background=0F4C5C&color=fff&size=60`}
                    alt={review.user_name}
                    className="w-10 h-10 rounded-2xl object-cover border-2 border-gray-100"
                  />
                  <div>
                    <h4 className="font-bold text-[#1a1a2e] text-sm">{review.user_name}</h4>
                    <p className="text-[10px] text-[#FF7F50] font-semibold uppercase tracking-wider">
                      {review.designation || 'Verified Traveler'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Testimonials;
