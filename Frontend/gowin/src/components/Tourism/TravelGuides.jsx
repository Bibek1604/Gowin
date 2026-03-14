"use client"

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Map, Camera, Luggage, Umbrella, Sun, Plane, Compass, ArrowRight, Heart } from "lucide-react";
import Navbar from "./Navbar";
import Footer from "../Home/Footer";

const TravelGuides = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const guides = [
    {
      title: "Packing Like a Pro",
      category: "Essentials",
      icon: <Luggage className="w-8 h-8" />,
      image: "https://images.unsplash.com/photo-1527631746610-bca00a040d60?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      desc: "Master the art of carrying just enough. Discover our checklist for every climate."
    },
    {
      title: "Photography Secrets",
      category: "Creative",
      icon: <Camera className="w-8 h-8" />,
      image: "https://images.unsplash.com/photo-1542332213-9b5a5a3fad35?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      desc: "Capture the soul of your destination. Pro tips for iPhone and DSLR enthusiasts."
    },
    {
      title: "Visa Navigation",
      category: "Legal",
      icon: <Map className="w-8 h-8" />,
      image: "https://images.unsplash.com/photo-1436491865332-7a61a109c05d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      desc: "Decoding documentation requirements for global hotspots with ease."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-48 pb-32 overflow-hidden bg-[#F0F9F8]">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-[#2A9D8F]/10 blur-[120px] rounded-full -mr-32 -mt-32" />
        <div className="max-w-7xl mx-auto px-6 sm:px-12 relative z-10 flex flex-col md:flex-row items-center gap-20">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="md:w-1/2"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#2A9D8F]/10 text-[#0F4C5C] rounded-full text-xs font-black uppercase tracking-[0.3em] mb-8 border border-[#2A9D8F]/20">
               <Compass className="w-4 h-4 text-[#2A9D8F]" /> Expert Insights
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-[#0F4C5C] tracking-tighter leading-none mb-8">
              Travel <br />
              <span className="text-[#2A9D8F]">Guides.</span>
            </h1>
            <p className="text-gray-400 text-xl font-medium leading-relaxed max-w-lg mb-10">
              Curated wisdom from our seasoned explorers. Prepare for your next odyssey with confidence and style.
            </p>
            <div className="flex items-center gap-4">
               <div className="flex -space-x-3">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-12 h-12 rounded-full border-4 border-white overflow-hidden bg-gray-100">
                      <img src={`https://i.pravatar.cc/150?u=${i}`} alt="" />
                    </div>
                  ))}
               </div>
               <p className="text-sm font-bold text-[#0F4C5C] tracking-tight">Joined by 12,000+ travelers</p>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="md:w-1/2 relative"
          >
             <div className="relative z-10 rounded-[4rem] overflow-hidden shadow-2xl rotate-3">
                <img src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" className="w-full h-[500px] object-cover" alt="" />
             </div>
             <div className="absolute -bottom-10 -left-10 bg-white p-8 rounded-[3rem] shadow-2xl z-20 border border-gray-50 flex items-center gap-4">
                <div className="w-14 h-14 bg-[#FF7F50] rounded-2xl flex items-center justify-center text-white">
                   <Sun className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-lg font-black text-[#0F4C5C]">Local Wisdom</p>
                  <p className="text-xs font-bold text-gray-400 uppercase">Season 2026 Updated</p>
                </div>
             </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Guides Grid */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-6 sm:px-12">
          <div className="flex justify-between items-end mb-20">
             <div>
                <h2 className="text-4xl font-black text-[#0F4C5C] tracking-tight mb-4 uppercase">Popular Guides</h2>
                <div className="w-20 h-2 bg-[#FF7F50] rounded-full" />
             </div>
             <button className="text-[11px] font-black uppercase tracking-widest text-[#2A9D8F] hover:text-[#0F4C5C] transition-colors flex items-center gap-2">
                Browse All <ArrowRight className="w-4 h-4" />
             </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
             {guides.map((guide, i) => (
               <motion.div 
                 key={i}
                 initial={{ opacity: 0, y: 30 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ delay: i * 0.1 }}
                 className="group cursor-pointer"
               >
                 <div className="relative aspect-square rounded-[3.5rem] overflow-hidden shadow-lg mb-8">
                    <img src={guide.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={guide.title} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-10 left-10 p-4 bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl text-white">
                       {guide.icon}
                    </div>
                 </div>
                 <div className="px-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#FF7F50] mb-3">{guide.category}</p>
                    <h3 className="text-2xl font-black text-[#0F4C5C] tracking-tight mb-4 group-hover:text-[#2A9D8F] transition-colors">{guide.title}</h3>
                    <p className="text-gray-400 font-medium text-sm leading-relaxed mb-6">{guide.desc}</p>
                    <div className="flex items-center gap-4 text-[11px] font-black uppercase tracking-widest text-[#0F4C5C]">
                       Read More <Heart className="w-4 h-4 text-[#FF7F50]" />
                    </div>
                 </div>
               </motion.div>
             ))}
          </div>
        </div>
      </section>

      {/* Tips Section */}
      <section className="py-24 bg-[#0F4C5C] overflow-hidden relative">
         <div className="absolute -right-32 top-0 w-[40rem] h-[40rem] bg-[#2A9D8F]/20 rounded-full blur-[120px]" />
         <div className="max-w-7xl mx-auto px-6 sm:px-12 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
               <div className="space-y-12">
                  <h2 className="text-5xl font-black text-white tracking-widest leading-none">THE <br /> GOWIN <br /> WAY.</h2>
                  <div className="space-y-8">
                     {[
                       { title: "Arrival Protocols", list: ["Luxury pickup integration", "Instant SIM setup", "Currency optimization"] },
                       { title: "Health & Safety", list: ["Premium insurance validation", "Local clinic networks", "Emergency protocols"] }
                     ].map((item, i) => (
                       <div key={i} className="border-l-4 border-[#FF7F50] pl-8">
                          <h4 className="text-xl font-black text-[#2A9D8F] mb-4 tracking-tight uppercase">{item.title}</h4>
                          <div className="flex flex-wrap gap-3">
                             {item.list.map(li => (
                               <span key={li} className="px-4 py-2 bg-white/5 rounded-full text-white/60 text-xs font-bold uppercase tracking-widest">{li}</span>
                             ))}
                          </div>
                       </div>
                     ))}
                  </div>
               </div>
               <div className="bg-white/10 backdrop-blur-2xl border border-white/20 p-16 rounded-[4rem]">
                  <Plane className="w-16 h-16 text-[#FF7F50] mb-8" />
                  <h3 className="text-3xl font-black text-white mb-6 tracking-tight">Ready to start?</h3>
                  <p className="text-white/60 text-lg font-medium leading-relaxed mb-10">
                    Your guide is just the beginning. Let us handle the complexity while you enjoy the discovery.
                  </p>
                  <button className="bg-white text-[#0F4C5C] px-12 py-5 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-[#FF7F50] hover:text-white transition-all shadow-2xl">
                    Get Custom Guide
                  </button>
               </div>
            </div>
         </div>
      </section>
    </div>
  );
};

export default TravelGuides;
