import React from 'react';
import { Send, Globe, ArrowRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const CTA = () => {
  return (
    <section className="py-32 relative overflow-hidden bg-white font-sans">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 relative z-10">

        {/* Main CTA Card */}
        <div className="bg-white rounded-[4rem] p-12 md:p-24 text-center shadow-[0_40px_100px_rgba(0,0,0,0.05)] border border-gray-100 relative overflow-hidden group">

          {/* New Soft Decorative elements for Light Theme */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-[#3B82F6]/5 to-transparent rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 transition-transform duration-1000 group-hover:scale-110"></div>
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-[#0F4C5C]/5 to-transparent rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 transition-transform duration-1000 group-hover:scale-110"></div>

          {/* Subtle concentric rings for depth */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-gray-100/50 rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-gray-100/30 rounded-full" />

          <div className="relative z-10">


            <h2 className="text-5xl md:text-7xl font-black text-[#0F4C5C] mb-8 tracking-tighter leading-tight max-w-4xl mx-auto">
              Your Ethereal Journey <br /> Begins with One Click.
            </h2>

            <p className="text-gray-500 text-xl max-w-2xl mx-auto mb-16 leading-relaxed font-medium">
              Step beyond the mundane. Join our elite circle of global wanderers and redefine your perspective on the world with Gowin.
            </p>

            <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
              <Link
                to="/booking"
                className="bg-[#2A9D8F] hover:bg-[#238b7e] text-white px-10 py-5 rounded-3xl font-bold text-lg transition-all shadow-2xl shadow-[#2A9D8F]/20 flex items-center justify-center gap-3 group/btn hover:scale-105 active:scale-95 w-full sm:w-auto"
              >
                Initiate My Travel <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/contact"
                className="bg-white text-[#0F4C5C] border-2 border-[#0F4C5C]/10 hover:border-[#0F4C5C]/20 px-10 py-5 rounded-3xl font-bold text-lg transition-all shadow-lg shadow-[#0F4C5C]/5 hover:scale-105 active:scale-95 w-full sm:w-auto whitespace-nowrap"
              >
                Consult an Expert
              </Link>
            </div>


          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
