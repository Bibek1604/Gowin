import React from 'react';
import { Map, CreditCard, PlaneTakeoff, CheckCircle, ArrowDown, MapPin } from 'lucide-react';

const BookingSteps = () => {
  const steps = [
    {
      id: 1,
      title: "Explore Destinations",
      desc: "Curate your wishlist from our handpicked gallery of global wonders.",
      icon: <Map className="w-8 h-8" />,
      color: "bg-[#0F4C5C]/10 text-[#0F4C5C]"
    },
    {
      id: 2,
      title: "Secure Reservation",
      desc: "Lodge your request through our encrypted, seamless payment portal.",
      icon: <CreditCard className="w-8 h-8" />,
      color: "bg-[#FF7F50]/10 text-[#FF7F50]"
    },
    {
      id: 3,
      title: "Venture Forth",
      desc: "Receive your premium travel kit and embark on your odyssey.",
      icon: <PlaneTakeoff className="w-8 h-8" />,
      color: "bg-[#FF7F50]/10 text-[#FF7F50]"
    }
  ];

  return (
    <section className="py-32 bg-white relative overflow-hidden font-sans">
      {/* Decorative flow line */}
      <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gray-100 to-transparent hidden lg:block" />

      <div className="max-w-7xl mx-auto px-6 sm:px-12 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-24">
          
          <div className="lg:w-1/2">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#FF7F50]/10 text-[#FF7F50] rounded-full text-xs font-bold uppercase tracking-[0.2em] mb-8 border border-[#FF7F50]/10">
               <MapPin className="w-4 h-4" /> The Road to Discovery
            </div>
            <h2 className="text-5xl lg:text-6xl font-extrabold text-[#0F4C5C] mb-8 tracking-tighter leading-tight">
              A Journey Mapped <br /> <span className="text-[#FF7F50]">Just For You.</span>
            </h2>
            <p className="text-gray-500 text-lg mb-16 max-w-lg leading-relaxed font-medium">
              We've refined the path from daydream to destination. Your seamless transition into the extraordinary starts with three simple steps.
            </p>
            
            <div className="space-y-12 relative">
              {steps.map((step, index) => (
                <div key={step.id} className="flex gap-8 group cursor-default">
                  {/* Step Connector */}
                  {index !== steps.length - 1 && (
                    <div className="absolute left-[39px] top-20 bottom-[-48px] w-[2px] bg-gradient-to-b from-gray-100 via-gray-50 to-transparent hidden md:block"></div>
                  )}
                  
                  <div className={`w-20 h-20 rounded-[2rem] flex-shrink-0 flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-12 shadow-sm ${step.color}`}>
                    {step.icon}
                  </div>
                  
                  <div className="pt-2">
                    <h3 className="text-2xl font-extrabold text-[#0F4C5C] mb-2 tracking-tight group-hover:text-[#FF7F50] transition-colors">{step.title}</h3>
                    <p className="text-[#0F4C5C]/50 leading-relaxed max-w-sm font-medium">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="lg:w-1/2 relative w-full group">
            {/* Visual Frame */}
            <div className="absolute -inset-6 bg-[#0F4C5C]/5 rounded-[4rem] group-hover:scale-105 transition-transform duration-700"></div>
            <div className="relative z-10 rounded-[3.5rem] overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.15)] border-[14px] border-white">
               <img 
                 src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=90" 
                 alt="Elite aviation travel" 
                 className="w-full h-[650px] object-cover transform scale-100 group-hover:scale-110 transition-transform duration-[2.5s] ease-out"
               />
               
               {/* Hover Overlay */}
               <div className="absolute inset-0 bg-gradient-to-t from-[#0F4C5C]/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 flex flex-col justify-end p-12">
                  <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-2">Next Destination</p>
                  <h4 className="text-white text-3xl font-extrabold tracking-tighter">Your Odyssey Awaits.</h4>
               </div>
            </div>
            
            {/* Real-time Interaction Card */}
            <div className="absolute top-20 -left-12 bg-white/95 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-2xl z-20 hidden md:flex flex-col gap-6 animate-float border border-white">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#FF7F50]/20 rounded-2xl flex items-center justify-center text-[#FF7F50] shadow-inner">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none mb-1">Status</p>
                    <p className="font-extrabold text-[#0F4C5C] text-lg">Trip Confirmed!</p>
                  </div>
               </div>
               <div className="flex gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#FF7F50] animate-pulse" />
                  <div className="w-2 h-2 rounded-full bg-[#FF7F50] animate-pulse delay-75" />
                  <div className="w-2 h-2 rounded-full bg-[#0F4C5C] animate-pulse delay-150" />
               </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookingSteps;
