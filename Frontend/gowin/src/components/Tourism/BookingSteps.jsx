import React from 'react';
import { Search, CalendarCheck, PlaneTakeoff, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const steps = [
  {
    num: '01',
    title: 'Choose Destination',
    desc: 'Browse our handpicked global collection and find the perfect destination that speaks to your soul.',
    icon: <Search className="w-5 h-5 sm:w-6 sm:h-6" />,
    accent: 'bg-[#FF7F50]',
    iconColor: 'text-white',
    gradient: 'from-[#FF7F50]/10 to-transparent',
  },
  {
    num: '02',
    title: 'Book Your Trip',
    desc: 'Secure your spot through our fast, encrypted booking system with flexible payment options.',
    icon: <CalendarCheck className="w-5 h-5 sm:w-6 sm:h-6" />,
    accent: 'bg-[#0F4C5C]',
    iconColor: 'text-white',
    gradient: 'from-[#0F4C5C]/10 to-transparent',
  },
  {
    num: '03',
    title: 'Pack & Fly',
    desc: 'Receive your premium travel kit and get ready for an extraordinary adventure.',
    icon: <PlaneTakeoff className="w-5 h-5 sm:w-6 sm:h-6" />,
    accent: 'bg-[#FF7F50]',
    iconColor: 'text-white',
    gradient: 'from-[#FF7F50]/10 to-transparent',
  },
  {
    num: '04',
    title: 'Make Memories',
    desc: 'Experience the world with our expert local guides and world-class travel support.',
    icon: <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6" />,
    accent: 'bg-[#0F4C5C]',
    iconColor: 'text-white',
    gradient: 'from-[#0F4C5C]/10 to-transparent',
  },
];

const BookingSteps = () => (
  <section className="py-16 sm:py-20 md:py-28 bg-white relative overflow-hidden">
    <div className="absolute inset-0 opacity-[0.025] pointer-events-none" style={{
      backgroundImage: 'radial-gradient(#0F4C5C 1px, transparent 1px)',
      backgroundSize: '28px 28px'
    }} />
    <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#FF7F50]/5 rounded-full blur-3xl pointer-events-none" />
    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#0F4C5C]/5 rounded-full blur-3xl pointer-events-none" />

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-12 sm:mb-14 md:mb-20 gap-6 sm:gap-8">
        <div>
          <span className="section-label mb-3 sm:mb-4 block">Simple Process</span>
          <h2 className="heading-font text-3xl sm:text-4xl md:text-5xl text-[#1a1a2e]">
            How It <span className="text-[#FF7F50]">Works</span>
          </h2>
          <p className="text-gray-500 text-sm md:text-base mt-2 sm:mt-3 max-w-lg leading-relaxed">
            Planning your dream trip is simple with GoWin. Four easy steps to your next great adventure.
          </p>
        </div>
        <Link to="/booking" className="btn-primary flex-shrink-0">
          Start Planning Now
        </Link>
      </div>

      {/* Steps */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {steps.map((step, i) => (
          <motion.div
            key={step.num}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className={`relative group bg-gradient-to-br ${step.gradient} border border-gray-100 rounded-2xl sm:rounded-3xl p-5 sm:p-7 hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 overflow-hidden`}
          >
            {/* Connector line (desktop) */}
            {i < steps.length - 1 && (
              <div className="hidden lg:block absolute top-[2.75rem] -right-2.5 w-5 h-0.5 bg-gray-200 z-10" />
            )}

            {/* Watermark number */}
            <div className="absolute top-4 right-5 text-[#0F4C5C]/6 text-5xl sm:text-6xl font-black leading-none select-none">
              {step.num}
            </div>

            {/* Icon */}
            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-5 shadow-sm ${step.accent} ${step.iconColor}`}>
              {step.icon}
            </div>

            {/* Step number pill */}
            <div className="inline-flex items-center gap-1.5 mb-2">
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Step {step.num}</span>
            </div>

            <h3 className="text-sm sm:text-base font-bold text-[#1a1a2e] mb-2">{step.title}</h3>
            <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">{step.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* Trust bar */}
      <div className="mt-12 sm:mt-14 pt-8 sm:pt-10 border-t border-gray-100 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-center">
        {[
          { val: '100%', label: 'Secure Payments' },
          { val: '24/7', label: 'Customer Support' },
          { val: 'Free', label: 'Cancellation (14 days)' },
          { val: '5+', label: 'Years Experience' },
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <div className="text-xl sm:text-2xl font-black text-[#FF7F50]">{item.val}</div>
            <div className="text-gray-400 text-[10px] sm:text-xs uppercase tracking-widest mt-1">{item.label}</div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default BookingSteps;
