import React from 'react';
import Reveal from '../ui/Reveal';
import { Link } from 'react-router-dom';
import { HOW_IT_WORKS } from '../../data/siteContent';
import { iconFor } from '../../lib/icons';
import SectionHeader from '../ui/SectionHeader';

const HowItWorks = () => (
  <section className="py-14 sm:py-16 lg:py-20 bg-[#F8FAFC]">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <SectionHeader
        label="Simple process" title="How booking" accent="works"
        subtitle="No online payment, no automatic confirmation — a real person checks availability and sends you a written quote first."
        className="mb-10"
        action={<Link to="/booking" className="btn-primary">Start a request</Link>}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {HOW_IT_WORKS.map((step, i) => {
          const Icon = iconFor(step.icon);
          return (
            <Reveal delay={i * 0.08} key={step.num}
              className="relative bg-white border border-gray-100 rounded-2xl p-6 overflow-hidden hover:shadow-[0_12px_40px_rgba(15,23,42,0.08)] hover:-translate-y-1 transition-all duration-300">
              <span className="absolute top-4 right-5 text-5xl font-black text-[#1E3A8A]/[0.06] leading-none select-none" aria-hidden="true">{step.num}</span>
              <span className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 text-white ${i % 2 ? 'bg-[#1E3A8A]' : 'bg-[#10B981]'}`}><Icon className="w-5 h-5" /></span>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">Step {step.num}</p>
              <h3 className="text-base font-bold text-[#0F172A] mb-1.5">{step.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
            </Reveal>
          );
        })}
      </div>
    </div>
  </section>
);

export default HowItWorks;
