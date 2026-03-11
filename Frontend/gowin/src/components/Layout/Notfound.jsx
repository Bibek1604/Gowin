import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Compass, ArrowRight, MapPin, Navigation } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-[#F8FAFB] flex items-center justify-center p-6 relative overflow-hidden font-sans">
      
      {/* Background Decor */}
       <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#0F4C5C]/5 rounded-full blur-[120px] -mr-32 -mt-32" />
       <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#FF7F50]/5 rounded-full blur-[120px] -ml-32 -mb-32" />
       
       <Navigation className="absolute top-20 right-20 w-32 h-32 text-[#0F4C5C]/5 -rotate-12" />
       <MapPin className="absolute bottom-20 left-20 w-24 h-24 text-[#FF7F50]/5 rotate-12" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-2xl w-full text-center relative z-10"
      >
        <div className="relative mb-12">
           <div className="w-32 h-32 bg-white rounded-[2.5rem] shadow-2xl shadow-[#0F4C5C]/5 flex items-center justify-center text-[#0F4C5C] mx-auto mb-10 relative z-10">
              <Compass className="w-16 h-16 animate-spin-slow" />
           </div>
           <div className="absolute inset-0 bg-[#FF7F50]/10 rounded-full blur-3xl scale-110 -z-10 animate-pulse" />
        </div>

        <h1 className="text-8xl font-black text-[#0F4C5C] tracking-tighter mb-4 leading-none">
          4<span className="text-[#FF7F50]">0</span>4
        </h1>
        
        <div className="inline-flex items-center gap-2 px-6 py-2 bg-[#0F4C5C]/5 text-[#0F4C5C] rounded-full text-[10px] font-bold uppercase tracking-[0.3em] mb-8 border border-[#0F4C5C]/10">
           Path Not Found
        </div>

        <h2 className="text-4xl font-extrabold text-[#0F4C5C] mb-6 tracking-tight">
          Oops! You've Ventured <br /> Into the Unknown.
        </h2>
        
        <p className="text-gray-500 text-lg mb-12 max-w-md mx-auto leading-relaxed font-medium">
          It seems this destination hasn't been mapped in our premium collection yet. Let's get you back on course.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-6">
           <Link 
             to="/" 
             className="bg-[#0F4C5C] text-white px-10 py-5 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-[#0a3845] transition-all shadow-xl shadow-[#0F4C5C]/20 active:scale-95 group"
           >
              Return Home <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
           </Link>
           <button 
             onClick={() => window.history.back()}
             className="bg-white text-[#0F4C5C] border border-gray-100 px-10 py-5 rounded-2xl font-bold hover:bg-gray-50 transition-all shadow-sm active:scale-95"
           >
              Previous Page
           </button>
        </div>

        <p className="mt-20 text-gray-300 text-[10px] font-bold uppercase tracking-[0.4em]">
           Lost in Exploration • Gowin Travels 2026
        </p>
      </motion.div>
    </div>
  );
};

export default NotFound;
