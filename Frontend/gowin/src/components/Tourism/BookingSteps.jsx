import React from 'react';
import { Search, CalendarCheck, PlaneTakeoff, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const steps = [
  {
    num: '01',
    title: 'Choose Destination',
    desc: 'Browse our handpicked global collection and find the perfect destination that speaks to your soul.',
    icon: <Search className="w-6 h-6" />,
    accent: 'bg-[#FF7F50]',
  },
  {
    num: '02',
    title: 'Book Your Trip',
    desc: 'Secure your spot through our fast, encrypted booking system with flexible payment options.',
    icon: <CalendarCheck className="w-6 h-6" />,
    accent: 'bg-white',
    iconColor: 'text-[#0F4C5C]',
  },
  {
    num: '03',
    title: 'Pack & Fly',
    desc: 'Receive your premium travel kit and get ready for an extraordinary adventure.',
    icon: <PlaneTakeoff className="w-6 h-6" />,
    accent: 'bg-[#FF7F50]',
  },
  {
    num: '04',
    title: 'Make Memories',
    desc: 'Experience the world with our expert local guides and world-class travel support.',
    icon: <CheckCircle className="w-6 h-6" />,
    accent: 'bg-white',
    iconColor: 'text-[#0F4C5C]',
  },
];

const BookingSteps = () => (
  <section className="py-20 md:py-28 bg-white relative overflow-hidden">
    {/* Decorative dot pattern */}
    <div className="absolute inset-0 opacity-[0.025]" style={{
      backgroundImage: 'radial-gradient(#0F4C5C 1px, transparent 1px)',
      backgroundSize: '28px 28px'
    }} />
    <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#FF7F50]/5 rounded-full blur-3xl" />
    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#0F4C5C]/5 rounded-full blur-3xl" />

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-14 md:mb-20 gap-8">
        <div>
          <span className="section-label mb-4 block">Simple Process</span>
          <h2 className="heading-font text-4xl md:text-5xl text-[#1a1a2e]">
            How It <span className="text-[#FF7F50]">Works</span>
          </h2>
          <p className="text-gray-500 text-sm md:text-base mt-3 max-w-lg leading-relaxed">
            Planning your dream trip is simple with GoWin. Four easy steps to your next great adventure.
          </p>
        </div>
        <Link to="/booking" className="btn-primary flex-shrink-0">
          Start Planning Now
        </Link>
      </div>

      {/* Steps */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {steps.map((step, i) => (
          <div key={step.num} className="relative group bg-[#F8FAFB] border border-gray-100 rounded-3xl p-7 hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300">
            {/* Watermark number */}
            <div className="absolute top-5 right-6 text-[#0F4C5C]/8 text-5xl font-black leading-none select-none">
              {step.num}
            </div>
            {/* Icon */}
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-5 shadow-sm ${step.accent} ${step.iconColor || 'text-white'}`}>
              {step.icon}
            </div>
            <h3 className="text-base font-bold text-[#1a1a2e] mb-2">{step.title}</h3>
            <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
          </div>
        ))}
      </div>

      {/* Trust bar */}
      <div className="mt-14 pt-10 border-t border-gray-100 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        {[
          { val: '100%', label: 'Secure Payments' },
          { val: '24/7', label: 'Customer Support' },
          { val: 'Free', label: 'Cancellation (14 days)' },
          { val: '5+', label: 'Years Experience' },
        ].map((item, i) => (
          <div key={i}>
            <div className="text-2xl font-black text-[#FF7F50]">{item.val}</div>
            <div className="text-gray-400 text-xs uppercase tracking-widest mt-1">{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default BookingSteps;
