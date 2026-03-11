import React, { useEffect, useState } from 'react';
import { Star, Quote, ShieldCheck } from 'lucide-react';
import { supabase } from '../../supabaseClient';

const FALLBACK_REVIEWS = [
  {
    id: 'f1',
    user_name: "Sarah Jenkins",
    designation: "Travel Blogger",
    content: "Unbelievable experience! The booking was flawless, and the guides in Kyoto were incredibly knowledgeable. Highly recommended for premium travelers.",
    rating: 5,
    image_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&w=200&q=80"
  },
  {
    id: 'f2',
    user_name: "David Chen",
    designation: "Adventure Seeker",
    content: "The Swiss Alps hiking tour exceeded all my expectations. High-quality service with transparent pricing and exceptional support throughout the journey.",
    rating: 5,
    image_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&w=200&q=80"
  },
  {
    id: 'f3',
    user_name: "Emily Rodriguez",
    designation: "Family Traveler",
    content: "We booked a 10-day Bali family package. Everything from accommodations to transport was top-notch. Our kids loved every second of the adventure!",
    rating: 5,
    image_url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&w=200&q=80"
  }
];

const Testimonials = () => {
  const [reviews, setReviews] = useState(FALLBACK_REVIEWS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .eq('is_approved', true)
        .order('created_at', { ascending: false })
        .limit(6);

      if (!error && data && data.length > 0) {
        setReviews(data);
      }
      setIsLoading(false);
    };

    fetchTestimonials();
  }, []);

  return (
    <section className="py-24 bg-[#F8FAFB] relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#0F4C5C]/5 rounded-full blur-3xl -mr-48 -mt-48" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#FF7F50]/5 rounded-full blur-3xl -ml-48 -mb-48" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#2A9D8F]/10 text-[#2A9D8F] rounded-full text-xs font-bold uppercase tracking-[0.2em] mb-6 shadow-sm border border-[#2A9D8F]/10">
             <ShieldCheck className="w-4 h-4" /> Guest Experiences
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-[#0F4C5C] mb-6 tracking-tight">Voices of Our Explorers</h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg leading-relaxed">
            Discover the stories and memories created by travelers who ventured into the unknown with Gowin Travels.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[1,2,3].map(i => (
              <div key={i} className="bg-white p-10 rounded-[3rem] h-64 animate-pulse border border-gray-100 shadow-sm" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {reviews.map(review => (
              <div key={review.id} className="bg-white p-10 rounded-[3rem] shadow-[0_10px_40px_rgb(0,0,0,0.03)] border border-gray-100 relative mt-16 hover:-translate-y-2 transition-all duration-500 group">
                <div className="absolute top-10 right-10 opacity-10 group-hover:scale-110 transition-transform duration-500">
                   <Quote className="w-16 h-16 text-[#0F4C5C]" />
                </div>
                
                <div className="absolute -top-12 left-10">
                   <div className="relative">
                      <img
                        src={review.image_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(review.user_name)}&background=0F4C5C&color=fff`}
                        alt={review.user_name}
                        className="w-24 h-24 rounded-[2rem] border-8 border-white shadow-2xl object-cover relative z-10"
                      />
                      <div className="absolute inset-0 bg-[#FF7F50] rounded-[2rem] -rotate-6 scale-95 opacity-20 -z-10 group-hover:rotate-6 transition-transform duration-500" />
                   </div>
                </div>

                <div className="flex gap-1 mb-6 mt-12">
                  {[...Array(review.rating || 5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-[#FF7F50] fill-[#FF7F50]" />
                  ))}
                </div>

                <p className="text-[#0F4C5C]/70 italic mb-8 leading-relaxed relative z-10 text-sm md:text-base font-medium">
                  "{review.content}"
                </p>

                <div className="pt-6 border-t border-gray-50">
                  <h4 className="font-bold text-[#0F4C5C] text-xl mb-1">{review.user_name}</h4>
                  <p className="text-xs text-[#2A9D8F] font-bold uppercase tracking-widest">{review.designation}</p>
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
