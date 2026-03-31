import React, { useEffect } from 'react';
import { Mountain, Palmtree, Tent, Castle, Binoculars, Map, Compass, Wind } from 'lucide-react';
import useCategoryStore from '../Store/CategoryStore';

const icons = [
  <Wind className="w-6 h-6" />,
  <Mountain className="w-6 h-6" />,
  <Palmtree className="w-6 h-6" />,
  <Tent className="w-6 h-6" />,
  <Castle className="w-6 h-6" />,
  <Binoculars className="w-6 h-6" />,
  <Compass className="w-6 h-6" />,
  <Map className="w-6 h-6" />,
];

const bgImages = [
  'https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=400&q=80',
];

const TravelCategories = () => {
  const { categories, fetchCategories, isLoading } = useCategoryStore();

  useEffect(() => { fetchCategories(); }, [fetchCategories]);

  return (
    <section className="py-20 md:py-28 bg-[#F8FAFB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <div className="flex justify-center mb-4">
            <span className="section-label">Browse by Style</span>
          </div>
          <h2 className="heading-font text-4xl md:text-5xl text-[#1a1a2e]">
            Choose Your <span className="text-[#0F4C5C]">Adventure</span>
          </h2>
          <p className="text-gray-500 text-sm md:text-base mt-3 max-w-xl mx-auto leading-relaxed">
            From mountain treks to tropical retreats — find the perfect experience for your travel style.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="h-52 bg-gray-100 rounded-3xl animate-pulse" />
            ))}
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-16 text-gray-400">Categories coming soon...</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.slice(0, 5).map((cat, idx) => (
              <div
                key={cat.id}
                className="group relative rounded-3xl overflow-hidden cursor-pointer h-52 shadow-[0_4px_20px_rgba(0,0,0,0.07)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.13)] transition-all duration-500 hover:-translate-y-2"
              >
                <img
                  src={bgImages[idx % bgImages.length]}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628]/85 via-[#0a1628]/30 to-transparent" />
                <div className="absolute inset-0 flex flex-col items-center justify-end p-5 text-center">
                  <div className="bg-white/15 backdrop-blur-md border border-white/20 p-3 rounded-2xl text-white mb-3 group-hover:bg-[#FF7F50] group-hover:border-[#FF7F50] transition-all duration-300">
                    {icons[idx % icons.length]}
                  </div>
                  <h3 className="text-sm font-bold text-white mb-1">{cat.name}</h3>
                  <span className="text-[10px] text-white/45 uppercase tracking-widest group-hover:text-[#FF7F50] transition-colors">Explore →</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default TravelCategories;
