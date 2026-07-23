import React, { useEffect } from 'react';
import { Mountain, Tent, Castle, Binoculars, Map, Compass, Wind, ArrowRight, TreePalm, Waves } from 'lucide-react';
import { motion } from 'framer-motion';
import useCategoryStore from '../Store/CategoryStore';

const icons = [
  Wind, Mountain, TreePalm, Tent, Castle, Binoculars, Compass, Map, Waves,
];

const bgImages = [
  'https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=400&q=80',
];

const TravelCategories = () => {
  const { categories, fetchCategories, isLoading } = useCategoryStore();

  useEffect(() => { fetchCategories(); }, [fetchCategories]);

  return (
    <section className="py-16 sm:py-20 md:py-24 bg-[#F8FAFB] relative overflow-hidden">
      <div className="absolute -top-20 -right-20 w-80 h-80 bg-[#0F4C5C]/4 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-[#FF7F50]/4 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-12">
          <div className="flex justify-center mb-3">
            <span className="section-label">Browse by Style</span>
          </div>
          <h2 className="heading-font text-3xl sm:text-4xl md:text-5xl text-[#1a1a2e]">
            Choose Your <span className="text-[#0F4C5C]">Adventure</span>
          </h2>
          <p className="text-gray-500 text-sm md:text-base mt-2 sm:mt-3 max-w-xl mx-auto leading-relaxed">
            From mountain treks to tropical retreats — find the perfect experience for your travel style.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-40 sm:h-52 bg-gray-100 rounded-2xl sm:rounded-3xl animate-pulse" />
            ))}
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-12 text-gray-400 text-sm">
            Tour categories coming soon...
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            {categories.slice(0, 5).map((cat, idx) => {
              const IconComponent = icons[idx % icons.length];
              return (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.08 }}
                  className={`group relative rounded-2xl sm:rounded-3xl overflow-hidden cursor-pointer shadow-[0_4px_20px_rgba(0,0,0,0.07)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.15)] transition-all duration-500 hover:-translate-y-2 ${
                    idx === 4 ? 'col-span-2 sm:col-span-1' : ''
                  }`}
                  style={{ height: '160px' }}
                >
                  <div className="h-full sm:h-52">
                    <img
                      src={bgImages[idx % bgImages.length]}
                      alt={cat.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628]/88 via-[#0a1628]/20 to-transparent" />
                    <div className="absolute inset-0 bg-[#FF7F50]/0 group-hover:bg-[#FF7F50]/10 transition-colors duration-500" />

                    <div className="absolute inset-0 flex flex-col items-center justify-end p-3 sm:p-5 text-center">
                      <div className="bg-white/15 backdrop-blur-md border border-white/20 p-2 sm:p-3 rounded-xl sm:rounded-2xl text-white mb-2 sm:mb-3 group-hover:bg-[#FF7F50] group-hover:border-[#FF7F50] transition-all duration-300 shadow-sm">
                        <IconComponent className="w-5 h-5 sm:w-6 sm:h-6" />
                      </div>
                      <h3 className="text-xs sm:text-sm font-bold text-white mb-0.5 sm:mb-1 line-clamp-1">{cat.name}</h3>
                      <span className="text-[9px] sm:text-[10px] text-white/50 uppercase tracking-widest group-hover:text-[#FF7F50] transition-colors flex items-center gap-1">
                        Explore <ArrowRight className="w-2.5 h-2.5" />
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default TravelCategories;
