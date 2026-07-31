import React from 'react';
import { MapPin, Users, ShieldCheck, ArrowRight, Star, Mountain, Globe, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const stats = [
  { value: '2,500+', label: 'Happy Travelers', icon: Users },
  { value: '100+', label: 'Destinations', icon: Globe },
  { value: '20+', label: 'Countries Covered', icon: Award },
  { value: '4.9', label: 'Average Rating', icon: Star },
];

const values = [
  {
    icon: <MapPin className="w-5 h-5" />,
    title: 'Authentic Experiences',
    desc: 'We go beyond tourist trails to give you genuine cultural connections and hidden gems.',
    color: 'bg-[#1E3A8A]/8 text-[#1E3A8A]',
  },
  {
    icon: <Users className="w-5 h-5" />,
    title: 'Personal Concierge',
    desc: 'Every trip is tailored to your travel style with a dedicated expert guiding you.',
    color: 'bg-[#10B981]/8 text-[#10B981]',
  },
  {
    icon: <ShieldCheck className="w-5 h-5" />,
    title: 'Safety First',
    desc: 'All guides are certified, insurance is included, and our team is always reachable.',
    color: 'bg-emerald-50 text-emerald-600',
  },
  {
    icon: <Mountain className="w-5 h-5" />,
    title: 'Local Expertise',
    desc: 'Born in Kathmandu, we know Nepal\'s mountains, rivers and cultures intimately.',
    color: 'bg-violet-50 text-violet-600',
  },
];

const About = () => {
  return (
    <div className="bg-white font-sans pt-16">
      {/* Hero Banner */}
      <section className="relative h-64 sm:h-80 md:h-96 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1516490701338-fd7e5a94d6d7?auto=format&fit=crop&w=1600&q=85"
          alt="GoWin Travels Nepal"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#0B1220]/90 via-[#1E3A8A]/75 to-transparent" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <span className="text-[10px] font-bold text-[#10B981] uppercase tracking-widest mb-3">Our Story</span>
          <h1 className="heading-font text-3xl sm:text-4xl md:text-5xl text-white mb-3">About GoWin Travels</h1>
          <p className="text-white/70 text-sm sm:text-base max-w-xl leading-relaxed">
            Nepal's premier travel agency — connecting adventurers with the world since 2020.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 sm:py-20 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#10B981]/4 rounded-full blur-3xl -ml-32 -mt-32 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center">
            {/* Image stack */}
            <div className="lg:w-1/2 relative w-full">
              <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border-4 sm:border-8 border-white aspect-[4/3]">
                <img
                  src="https://images.unsplash.com/photo-1614082242765-7c98ca0f3df3?auto=format&fit=crop&w=900&q=85"
                  alt="Kathmandu Nepal"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Floating stat card */}
              <div className="absolute -bottom-5 -right-2 sm:-right-6 bg-white p-4 sm:p-5 rounded-2xl shadow-xl border border-gray-100 z-10 animate-bounce-slow">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#10B981]/10 rounded-xl flex items-center justify-center text-[#10B981]">
                    <Star className="w-5 h-5 fill-[#10B981]" />
                  </div>
                  <div>
                    <p className="text-xl font-black text-[#1E3A8A]">4.9/5</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Avg. Rating</p>
                  </div>
                </div>
              </div>
              {/* Second floating card */}
              <div className="absolute -top-4 -left-2 sm:-left-5 bg-[#1E3A8A] p-4 rounded-2xl shadow-xl z-10 hidden sm:block">
                <p className="text-2xl font-black text-white">5+</p>
                <p className="text-[9px] font-bold text-white/60 uppercase tracking-widest">Years</p>
              </div>
            </div>

            {/* Content */}
            <div className="lg:w-1/2">
              <span className="section-label mb-4 block">Who We Are</span>
              <h2 className="heading-font text-3xl sm:text-4xl text-[#1E3A8A] mb-5 leading-tight">
                Crafting Extraordinary Journeys Since <span className="text-[#10B981]">2020</span>
              </h2>
              <p className="text-gray-500 text-sm sm:text-base leading-relaxed mb-5">
                GoWin Travels was founded in Kathmandu with a simple belief: travel should transform you. We started as a trekking company in the Himalayas and grew into a full-service travel agency covering both Nepal and international destinations.
              </p>
              <p className="text-gray-500 text-sm sm:text-base leading-relaxed mb-8">
                Our team of local experts has walked every trail, visited every temple and built relationships with the best hotels, guides and transport operators so you don't have to worry about a thing.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {values.map((v, i) => (
                  <div key={i} className="flex gap-3 p-4 rounded-xl border border-gray-100 hover:border-[#1E3A8A]/10 hover:bg-[#F8FAFC] transition-all">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${v.color}`}>
                      {v.icon}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#1E3A8A] mb-0.5">{v.title}</h4>
                      <p className="text-xs text-gray-500 leading-relaxed">{v.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Link to="/contact" className="btn-primary inline-flex">
                Get In Touch <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 sm:py-16 bg-[#1E3A8A] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-12 -mb-12 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {stats.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="text-center"
                >
                  <div className="flex justify-center mb-2">
                    <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                      <Icon className="w-5 h-5 text-[#10B981]" />
                    </div>
                  </div>
                  <div className="text-3xl sm:text-4xl font-black text-white mb-1">{s.value}</div>
                  <div className="text-white/50 text-[10px] sm:text-xs font-bold uppercase tracking-widest">{s.label}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 sm:py-16 bg-white border-t border-gray-100">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="heading-font text-2xl sm:text-3xl md:text-4xl text-[#1E3A8A] mb-4">
            Ready to Start Your <span className="text-[#10B981]">Adventure?</span>
          </h2>
          <p className="text-gray-500 text-sm sm:text-base leading-relaxed mb-6">
            Reach out and one of our travel experts will craft a personalised itinerary just for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/booking" className="btn-primary">Book a Trip <ArrowRight className="w-4 h-4" /></Link>
            <Link to="/contact" className="btn-secondary">Contact Us</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
