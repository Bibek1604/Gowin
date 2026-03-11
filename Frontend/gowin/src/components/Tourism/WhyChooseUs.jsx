import React from 'react';
import { ShieldCheck, PiggyBank, CalendarCheck, Headphones, Star, Globe, Heart, Zap } from 'lucide-react';

const features = [
  {
    id: 1,
    title: "Vetted Local Experts",
    desc: "Our guides are certified specialists with centuries of combined cultural heritage knowledge.",
    icon: <ShieldCheck className="w-10 h-10" />,
    color: "text-[#0F4C5C] bg-[#0F4C5C]/5"
  },
  {
    id: 2,
    title: "Transparent Worth",
    desc: "Premium excellence at clear, honest pricing. No hidden fees or unexpected surcharges.",
    icon: <PiggyBank className="w-10 h-10" />,
    color: "text-[#FF7F50] bg-[#FF7F50]/5"
  },
  {
    id: 3,
    title: "Effortless Interface",
    desc: "Book your entire global itinerary in under three minutes through our streamlined portal.",
    icon: <Zap className="w-10 h-10" />,
    color: "text-[#2A9D8F] bg-[#2A9D8F]/5"
  },
  {
    id: 4,
    title: "Elite Concierge 24/7",
    desc: "A dedicated human support team available across every time zone to ensure your comfort.",
    icon: <Headphones className="w-10 h-10" />,
    color: "text-[#0F4C5C] bg-[#0F4C5C]/5"
  }
];

const WhyChooseUs = () => {
  return (
    <section className="py-32 bg-white relative overflow-hidden font-sans">

      {/* Background Subtle Title */}
      <h2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[15rem] font-bold text-gray-50 opacity-[0.4] select-none pointer-events-none whitespace-nowrap">
        GOWIN
      </h2>

      <div className="max-w-7xl mx-auto px-6 sm:px-12 relative z-10">
        <div className="text-center mb-24">

          <h2 className="text-5xl md:text-6xl font-extrabold text-[#0F4C5C] mb-8 tracking-tighter">Beyond the Ordinary.</h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg leading-relaxed font-medium">
            We don't just sell tours; we curate life-defining chapters. Our commitment to excellence defines every mile of your journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {features.map(feature => (
            <div key={feature.id} className="bg-white p-10 rounded-[3rem] shadow-[0_10px_40px_rgb(0,0,0,0.02)] border border-gray-100 hover:shadow-[0_25px_60px_rgba(15,76,92,0.1)] hover:-translate-y-3 transition-all duration-500 group relative">

              <div className={`w-24 h-24 rounded-[2rem] flex items-center justify-center mb-10 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 ${feature.color}`}>
                {feature.icon}
              </div>

              <h3 className="text-2xl font-extrabold text-[#0F4C5C] mb-4 tracking-tight group-hover:text-[#FF7F50] transition-colors">{feature.title}</h3>
              <p className="text-[#0F4C5C]/50 leading-relaxed text-sm font-medium">
                {feature.desc}
              </p>

              {/* Decorative Corner Link Icon */}
              <div className="absolute bottom-8 right-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <Heart className="w-5 h-5 text-[#FF7F50] fill-[#FF7F50]" />
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Social Proof */}
        <div className="mt-24 pt-16 border-t border-gray-50 flex flex-wrap justify-center gap-16 opacity-30 grayscale hover:grayscale-0 transition-all duration-700">
          <div className="flex items-center gap-3 font-bold text-2xl text-[#0F4C5C]">
            <Globe className="w-6 h-6" /> National Trust
          </div>
          <div className="flex items-center gap-3 font-bold text-2xl text-[#0F4C5C]">
            <ShieldCheck className="w-6 h-6" /> SafeTravels
          </div>
          <div className="flex items-center gap-3 font-bold text-2xl text-[#0F4C5C]">
            <Star className="w-6 h-6" /> Global Guild
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
