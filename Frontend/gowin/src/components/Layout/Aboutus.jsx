import React from 'react';
import kerelaHero from '../../assets/kerela-hero.jpeg';
import thiland2 from '../../assets/thiland-2.jpeg';
import bali from '../../assets/bali.jpeg';
import gowin from '../../assets/gowin.jpg';           // ← Added here
import { SectionHeader } from '../ui';
import { Users, Target, Award, Shield, Quote, Globe, Briefcase, HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const AboutUs = () => {
  const services = [
    { icon: Users, title: "Visa Expert", desc: "Professional guidance on visa types, requirements & documentation" },
    { icon: Target, title: "Application Guidance", desc: "Step-by-step support to maximize your approval chances" },
    { icon: Award, title: "Full Travel Support", desc: "Flights, hotels, transfers, custom itineraries — all arranged" },
    { icon: Shield, title: "VFS & Embassy Help", desc: "Appointment booking assistance & application process support" },
  ];

  const whyChoose = [
    { icon: Globe, title: "Transparent Fees", text: "No surprises — clear pricing and honest advice always" },
    { icon: Users, title: "Thousands of Happy Travelers", text: "Trusted by people from many countries since 2020" },
    { icon: Shield, title: "Professional & Certified", text: "Experienced, trained team focused on your success" },
  ];

  const quickFacts = [
    { icon: Briefcase, title: "4+ Years Experience", text: "Deep expertise in visa & travel facilitation", bg: 'white' },
    { icon: Globe, title: "Global Connections", text: "Strong network with embassies & travel partners", bg: 'sky' },
  ];

  const faqs = [
    { q: "How long does visa processing take?", a: "Depends on country & type — we give realistic timelines and keep you updated." },
    { q: "Can you help with urgent travel?", a: "Yes — we offer priority consultation for time-sensitive cases." },
    { q: "Do you check documents?", a: "Absolutely. We review every document before submission." },
  ];

  return (
    <div className="relative bg-white py-16 px-5 sm:px-8 md:py-20 lg:py-24 font-outfit overflow-hidden">
      {/* Subtle background blobs */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.015]">
        <div className="absolute -left-40 top-20 w-96 h-96 bg-sky-200/30 rounded-full blur-3xl" />
        <div className="absolute -right-40 bottom-20 w-80 h-80 bg-blue-200/20 rounded-full blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        {/* Hero / Story with Gowin logo */}
        <div className="text-center mb-16 md:mb-20">
          <div className="relative inline-block mb-6">
            <img
              src={gowin}
              alt="Gowin Travels"
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-white shadow-xl mx-auto"
            />
            <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-sky-500 rounded-full border-2 border-white flex items-center justify-center">
              <Globe className="w-4 h-4 text-white" />
            </div>
          </div>

          <SectionHeader
            title="Our Story"
            subtitle="Making international travel simple, safe and joyful"
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-10 max-w-3xl mx-auto p-7 sm:p-10 bg-white/60 backdrop-blur-md rounded-3xl border border-slate-100 shadow-sm relative"
          >
            <Quote className="absolute top-6 left-6 w-10 h-10 text-sky-400/20" />
            <p className="text-base sm:text-lg md:text-xl text-slate-700 leading-relaxed font-medium px-4 sm:px-8">
              Gowin Travels specializes in stress-free visa assistance, thoughtful holiday planning,
              and reliable travel support — helping people from Nepal and beyond explore the world with confidence.
            </p>
            <Quote className="absolute bottom-6 right-6 w-10 h-10 text-sky-400/20 rotate-180" />
          </motion.div>
        </div>

        {/* Services + Gallery */}
        <div className="grid lg:grid-cols-2 gap-10 xl:gap-16 mb-24 lg:mb-32 items-start">
          {/* Gallery – 4 Images Grid */}
          <div className="grid grid-cols-2 gap-4 sm:gap-6 order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="rounded-3xl overflow-hidden shadow-sm border border-slate-100"
            >
              <img src={kerelaHero} alt="Kerala" className="w-full h-48 sm:h-64 object-cover hover:scale-105 transition-transform duration-700" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="rounded-3xl overflow-hidden shadow-sm border border-slate-100 mt-8"
            >
              <img src={thiland2} alt="Thailand" className="w-full h-48 sm:h-64 object-cover hover:scale-105 transition-transform duration-700" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="rounded-3xl overflow-hidden shadow-sm border border-slate-100 -mt-8"
            >
              <img src={bali} alt="Bali" className="w-full h-48 sm:h-64 object-cover hover:scale-105 transition-transform duration-700" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="rounded-3xl overflow-hidden shadow-sm border border-slate-100 relative"
            >
              <img src={gowin} alt="Gowin brand" className="w-full h-48 sm:h-64 object-cover hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-4">
                <p className="text-white text-[10px] sm:text-xs font-medium">Trusted Partner</p>
              </div>
            </motion.div>
          </div>

          {/* Services */}
          <div className="order-1 lg:order-2 space-y-5">
            {services.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group flex gap-5 p-5 sm:p-6 bg-white border border-slate-100 rounded-2xl hover:border-sky-200 hover:shadow-md transition-all duration-300"
              >
                <div className="shrink-0 w-12 h-12 rounded-xl bg-sky-50 flex items-center justify-center group-hover:bg-sky-500 transition-colors">
                  <s.icon className="w-6 h-6 text-sky-500 group-hover:text-white transition-colors" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-slate-800 mb-1.5">{s.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="mb-24 lg:mb-32">
          <div className="text-center mb-12 md:mb-16">
            <SectionHeader title="Why Travel with Gowin?" subtitle="What makes us different" />
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {whyChoose.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-7 bg-white border border-slate-100 rounded-3xl hover:border-sky-200 hover:shadow-md transition-all group"
              >
                <div className="w-14 h-14 rounded-2xl bg-sky-50 flex items-center justify-center mb-5 group-hover:bg-sky-500 transition-colors">
                  <item.icon className="w-7 h-7 text-sky-500 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">{item.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-2 gap-6 md:gap-10 mb-24 lg:mb-32">
          {quickFacts.map((fact, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className={`p-8 md:p-10 rounded-3xl border ${fact.bg === 'sky'
                ? 'bg-gradient-to-br from-sky-500 to-sky-600 text-white border-transparent shadow-lg'
                : 'bg-white border-slate-100 shadow-sm hover:shadow-md hover:border-sky-200'
                } transition-all group`}
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${fact.bg === 'sky' ? 'bg-white/20' : 'bg-sky-50 group-hover:bg-sky-500'
                } transition-colors`}>
                <fact.icon className={`w-7 h-7 ${fact.bg === 'sky' ? 'text-white' : 'text-sky-500 group-hover:text-white'
                  } transition-colors`} />
              </div>
              <h3 className="text-xl md:text-2xl font-semibold mb-3">{fact.title}</h3>
              <p className={`text-sm md:text-base leading-relaxed ${fact.bg === 'sky' ? 'text-sky-50' : 'text-slate-600'
                }`}>{fact.text}</p>
            </motion.div>
          ))}
        </div>

        {/* FAQ */}
        <div>
          <div className="text-center mb-12 md:mb-16">
            <SectionHeader title="Common Questions" subtitle="Quick answers to get you started" />
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-7 bg-white border border-slate-100 rounded-3xl hover:border-sky-200 hover:shadow-md transition-all"
              >
                <HelpCircle className="w-7 h-7 text-sky-400 mb-5" />
                <h4 className="text-base sm:text-lg font-semibold text-slate-800 mb-3">{faq.q}</h4>
                <p className="text-sm text-slate-600 leading-relaxed">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;