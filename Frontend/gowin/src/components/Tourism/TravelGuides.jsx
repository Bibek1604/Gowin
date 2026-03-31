import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Map, Camera, Luggage, Umbrella, Sun, Plane, Compass, ArrowRight, Heart } from "lucide-react";
import Navbar from "./Navbar";

const TravelGuides = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const guides = [
    {
      title: "Packing Like a Pro",
      category: "Essentials",
      icon: <Luggage className="w-6 h-6" />,
      image: "https://images.unsplash.com/photo-1527631746610-bca00a040d60?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      desc: "Master the art of carrying just enough. Discover our checklist for every climate."
    },
    {
      title: "Photography Secrets",
      category: "Creative",
      icon: <Camera className="w-6 h-6" />,
      image: "https://images.unsplash.com/photo-1542332213-9b5a5a3fad35?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      desc: "Capture the soul of your destination. Pro tips for iPhone and DSLR enthusiasts."
    },
    {
      title: "Visa Navigation",
      category: "Legal",
      icon: <Map className="w-6 h-6" />,
      image: "https://images.unsplash.com/photo-1436491865332-7a61a109c05d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      desc: "Decoding documentation requirements for global hotspots with ease."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-40 pb-24 overflow-hidden bg-[#F8FAFB]">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-[#FF7F50]/5 blur-[100px] rounded-full -mr-32 -mt-32" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col md:flex-row items-center gap-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="md:w-1/2"
          >
            <div className="mb-6"><span className="section-label">Expert Insights</span></div>
            <h1 className="heading-font text-5xl md:text-7xl text-[#1a1a2e] mb-6">
              Travel <br />
              <span className="text-[#0F4C5C]">Guides.</span>
            </h1>
            <p className="text-gray-500 text-base md:text-lg max-w-lg mb-10 leading-relaxed">
              Curated wisdom from our seasoned explorers. Prepare for your next odyssey with confidence and style.
            </p>

          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="md:w-1/2 relative"
          >
            <div className="relative z-10 rounded-[2.5rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.15)] rotate-2">
              <img src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" className="w-full h-[450px] object-cover" alt="Travel Guide" />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-3xl shadow-[0_15px_40px_rgba(0,0,0,0.1)] z-20 border border-gray-100 flex items-center gap-4">
              <div className="w-12 h-12 bg-[#FF7F50] rounded-2xl flex items-center justify-center text-white shadow-lg">
                <Sun className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-[#1a1a2e]">Local Wisdom</p>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-0.5">Season 2026 Updated</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Guides Grid */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-16">
            <div>
              <span className="section-label mb-3 block">Featured</span>
              <h2 className="heading-font text-4xl text-[#1a1a2e]">Popular <span className="text-[#0F4C5C]">Guides</span></h2>
            </div>
            <button className="text-sm font-bold text-[#0F4C5C] hover:text-[#FF7F50] transition-colors flex items-center gap-2 border-b-2 border-transparent hover:border-[#FF7F50] pb-1">
              Browse All <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {guides.map((guide, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group cursor-pointer card p-4 flex flex-col"
              >
                <div className="relative h-64 rounded-[1.25rem] overflow-hidden mb-6">
                  <img src={guide.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={guide.title} />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628]/80 to-transparent" />
                  <div className="absolute bottom-4 left-4 p-3 bg-white/20 backdrop-blur-md border border-white/20 rounded-xl text-white">
                    {guide.icon}
                  </div>
                </div>
                <div className="px-2 pb-4 flex flex-col flex-1">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#FF7F50] mb-2">{guide.category}</p>
                  <h3 className="heading-font text-2xl text-[#1a1a2e] mb-3 group-hover:text-[#0F4C5C] transition-colors">{guide.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-6 flex-1">{guide.desc}</p>
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#0F4C5C] group-hover:text-[#FF7F50] transition-colors">
                    Read More <Heart className="w-3 h-3 text-[#FF7F50]" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tips Section */}
      <section className="py-24 bg-[#0F4C5C] overflow-hidden relative">
        <div className="absolute -right-40 top-0 w-96 h-96 bg-[#FF7F50]/10 rounded-full blur-[100px]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="heading-font text-4xl md:text-5xl text-white mb-12">
                The <span className="text-[#FF7F50]">GoWin</span> Way.
              </h2>
              <div className="space-y-8">
                {[
                  { title: "Arrival Protocols", list: ["Luxury pickup integration", "Instant SIM setup", "Currency optimization"] },
                  { title: "Health & Safety", list: ["Premium insurance validation", "Local clinic networks", "Emergency protocols"] }
                ].map((item, i) => (
                  <div key={i} className="border-l-4 border-[#FF7F50] pl-6 py-1">
                    <h4 className="text-lg font-bold text-white mb-3">{item.title}</h4>
                    <div className="flex flex-wrap gap-2">
                      {item.list.map(li => (
                        <span key={li} className="px-3 py-1.5 bg-white/10 rounded-lg text-white/80 text-[10px] font-bold uppercase tracking-wider">{li}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-10 md:p-14 rounded-3xl text-center">
              <Plane className="w-12 h-12 text-[#FF7F50] mx-auto mb-6" />
              <h3 className="heading-font text-3xl text-white mb-4">Ready to start?</h3>
              <p className="text-white/60 text-sm leading-relaxed mb-8">
                Your guide is just the beginning. Let us handle the complexity while you enjoy the discovery.
              </p>
              <button className="btn-primary">
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
