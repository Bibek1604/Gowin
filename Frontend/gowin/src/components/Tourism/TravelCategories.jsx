import React, { useEffect } from 'react';
import { Mountain, Palmtree, Tent, Castle, Binoculars, Map, Compass, Wind } from 'lucide-react';
import useCategoryStore from '../Store/CategoryStore';

const TravelCategories = () => {
  const { categories, fetchCategories, isLoading } = useCategoryStore();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Fallback icons for dynamic categories
  const icons = [
    <Wind className="w-8 h-8" />,
    <Mountain className="w-8 h-8" />,
    <Palmtree className="w-8 h-8" />,
    <Tent className="w-8 h-8" />,
    <Castle className="w-8 h-8" />,
    <Binoculars className="w-8 h-8" />,
    <Compass className="w-8 h-8" />,
    <Map className="w-8 h-8" />
  ];

  const colors = [
    "bg-[#0F4C5C]/10 text-[#0F4C5C]",
    "bg-[#FF7F50]/10 text-[#FF7F50]",
    "bg-[#2A9D8F]/10 text-[#2A9D8F]",
  ];

  return (
    <section className="py-24 bg-[#F8FAFB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-[#0F4C5C] mb-4 tracking-tight">Our Travel Styles</h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg leading-relaxed">
            Every traveler is unique. Find the perfect category that matches your wanderlust spirit.
          </p>
        </div>

        {isLoading ? (
          <div className="flex flex-wrap justify-center gap-8">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="w-40 h-48 bg-gray-50 rounded-3xl animate-pulse border border-gray-100" />
            ))}
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-12 text-gray-400 font-medium">
             Categories are currently being curated...
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-6 md:gap-10">
            {categories.slice(0, 5).map((cat, index) => (
              <div 
                key={cat.id} 
                className="flex flex-col items-center justify-center bg-white p-10 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgba(15,76,92,0.12)] hover:-translate-y-2 transition-all duration-500 min-w-[180px] cursor-pointer group border border-gray-50 relative overflow-hidden"
              >
                {/* Background decorative blob */}
                <div className={`absolute top-0 right-0 w-24 h-24 rounded-full -mr-12 -mt-12 transition-all duration-500 opacity-0 group-hover:opacity-10 ${colors[index % colors.length]}`} />
                
                <div className={`p-6 rounded-2xl mb-6 transition-all duration-500 shadow-sm ${colors[index % colors.length]} group-hover:scale-110 group-hover:shadow-lg`}>
                  {icons[index % icons.length]}
                </div>
                <h3 className="text-xl font-bold text-[#0F4C5C] group-hover:text-[#FF7F50] transition-colors">{cat.name}</h3>
                <p className="text-[10px] uppercase font-extrabold text-[#2A9D8F] tracking-[0.2em] mt-3">Explore Now</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default TravelCategories;
