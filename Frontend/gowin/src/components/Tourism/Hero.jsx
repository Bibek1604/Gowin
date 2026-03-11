import React from 'react';
import { Search, MapPin, Calendar, Users } from 'lucide-react';

const Hero = () => {
  return (
    <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-white">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[#0F4C5C]/5 opacity-50 z-10"></div>
        <img
          src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
          alt="Beautiful destination"
          className="w-full h-full object-cover rounded-b-[4rem] opacity-90"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mt-12">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white drop-shadow-lg mb-6 leading-tight">
          Discover <span className="text-[#g34234]">Amazing</span> Places
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-xl text-white/90 font-medium drop-shadow-md pb-12">
          Explore the world's most beautiful destinations with our premium curated travels and unforgettable experiences.
        </p>

        <div className="mt-10 max-w-4xl mx-auto bg-white rounded-3xl p-4 md:p-6 shadow-2xl flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex-1 w-full flex items-center bg-gray-50 px-4 py-3 rounded-2xl border border-gray-100 focus-within:ring-2 focus-within:ring-[#2A9D8F] transition-all">
            <MapPin className="text-[#2A9D8F] h-6 w-6 mr-3" />
            <input
              type="text"
              placeholder="Where do you want to go?"
              className="bg-transparent w-full focus:outline-none text-gray-700 placeholder-gray-400 font-medium"
            />
          </div>

          <button className="w-full md:w-auto bg-[#0F4C5C] hover:bg-[#0c3e4b] text-white px-8 py-4 rounded-2xl font-semibold shadow-lg shadow-[#0F4C5C]/30 transition-all flex items-center justify-center gap-2 h-full text-lg">
            <Search className="h-5 w-5" />
            Explore Destinations
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
