import React from 'react';
import { Compass, Map, Mountain, MapPin, Users, ShieldCheck, ArrowRight, Play } from 'lucide-react';

const About = () => {
  return (
    <section id="about" className="py-32 bg-white relative overflow-hidden font-sans">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-[0.03]">
        <div className="absolute top-10 -left-20 w-[40rem] h-[40rem] bg-[#0F4C5C] rounded-full blur-[120px]" />
        <div className="absolute bottom-20 right-0 w-[30rem] h-[30rem] bg-[#FF7F50] rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-12 relative z-10">
        <div className="flex flex-col lg:flex-row gap-24 items-center">

          <div className="lg:w-1/2 relative w-full group">
            {/* Multi-layered image stack */}
            <div className="absolute -inset-4 bg-gradient-to-tr from-[#0F4C5C]/10 to-transparent rounded-[4rem] -rotate-3 scale-105 group-hover:rotate-0 group-hover:scale-100 transition-all duration-700"></div>
            <div className="relative z-10 rounded-[3.5rem] overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.12)] border-[12px] border-white">
              <img
                src="https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=90"
                className="w-full h-[600px] object-cover transform scale-100 group-hover:scale-110 transition-transform duration-[2s]"
                alt="Premium travel exploration"
              />

              {/* Floating Play Button for 'Brand Story' feel */}
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-xl border border-white/40 rounded-full flex items-center justify-center text-white scale-75 group-hover:scale-100 transition-transform duration-500">
                  <Play className="w-8 h-8 fill-white" />
                </div>
              </div>
            </div>

            {/* Floating Experience Card */}
            <div className="absolute -bottom-10 -right-10 bg-white p-8 rounded-[2.5rem] shadow-2xl border border-gray-50 z-20 hidden md:block animate-bounce-slow">
              <div className="flex items-center gap-4 mb-2">
                <div className="w-12 h-12 bg-[#FF7F50]/10 rounded-2xl flex items-center justify-center text-[#FF7F50]">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-2xl font-black text-[#0F4C5C]">3+</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Years of Trust</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:w-1/2">
            <div className="mb-12">

              <h2 className="text-5xl lg:text-6xl font-extrabold text-[#0F4C5C] mb-8 leading-[1.1] tracking-tighter">
                Crafting <span className="text-[#FF7F50]">Ethereal</span> <br /> Journeys Since 2024.
              </h2>
              <p className="text-gray-500 text-lg leading-relaxed mb-10 max-w-lg font-medium">
                We believe travel isn't just about the destination; it's about the transformation. Gowin Travels was born from a passion for authentic discovery and a commitment to premium hospitality.
              </p>
            </div>

            <div className="space-y-10 mb-12">
              {[
                {
                  icon: <MapPin className="w-6 h-6" />,
                  title: "Exclusive Access",
                  desc: "Venture where few dare. We unlock private locations and hidden gems reserved for our guests.",
                  color: "bg-[#0F4C5C]/10 text-[#0F4C5C]"
                },
                {
                  icon: <Users className="w-6 h-6" />,
                  title: "Private Concierge",
                  desc: "Your journey, meticulously handled. From custom itineraries to 24/7 personal travel experts.",
                  color: "bg-[#FF7F50]/10 text-[#FF7F50]"
                }
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-6 group cursor-default">
                  <div className={`w-16 h-16 rounded-3xl flex items-center justify-center shrink-0 transition-all duration-500 group-hover:scale-110 shadow-sm ${item.color}`}>
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="text-xl font-extrabold text-[#0F4C5C] mb-2 tracking-tight group-hover:text-[#FF7F50] transition-colors">{item.title}</h4>
                    <p className="text-gray-400 text-sm leading-relaxed max-w-md font-medium">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-6 pt-4">
              <button className="bg-[#0F4C5C] hover:bg-[#0a3845] text-white px-10 py-5 rounded-[2rem] font-bold text-lg transition-all shadow-xl shadow-[#0F4C5C]/20 flex items-center justify-center gap-3 group active:scale-95">
                Our Story <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <div className="flex items-center gap-4 px-6">
                <div className="w-12 h-12 rounded-full border-2 border-[#FF7F50] flex items-center justify-center text-[#FF7F50]">
                  <Play className="w-4 h-4 fill-[#FF7F50]" />
                </div>
                <p className="text-[#0F4C5C] font-bold text-sm tracking-tight cursor-pointer hover:text-[#FF7F50] transition-colors">Watch Introduction</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default About;
