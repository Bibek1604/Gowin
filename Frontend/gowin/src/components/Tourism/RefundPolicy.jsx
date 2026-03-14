"use client"

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { RotateCcw, Ban, Wallet, Calendar, AlertCircle, ShieldAlert, CreditCard, ArrowRight } from "lucide-react";
import Navbar from "./Navbar";
import Footer from "../Home/Footer";

const RefundPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const policies = [
    {
      icon: <Ban className="w-8 h-8 text-red-500" />,
      title: "1. Service Charges",
      desc: "All consultation fees, service charges, and administrative fees paid to Go Win International Travel and Tourism Pvt. Ltd. are strictly non-refundable. These charges cover professional services such as consultation, document preparation, application assistance, and administrative work."
    },
    {
      icon: <ShieldAlert className="w-8 h-8 text-[#FF7F50]" />,
      title: "2. Visa Application Fees",
      desc: "Visa fees paid to embassies, consulates, or visa centers are non-refundable regardless of visa approval or rejection."
    },
    {
      icon: <Calendar className="w-8 h-8 text-[#2A9D8F]" />,
      title: "3. VFS or Visa Center Appointment Fees",
      desc: "Fees paid for VFS Global or other visa center appointments are generally non-refundable. Refund eligibility will strictly follow the official policies of the respective visa center."
    },
    {
      icon: <AlertCircle className="w-8 h-8 text-[#0F4C5C]" />,
      title: "4. Travel Insurance",
      desc: "Travel insurance purchased through our agency is subject to the terms and refund policies of the respective insurance provider. If the customer violates the insurance policy conditions, refunds may not be granted."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Header */}
      <section className="relative pt-48 pb-24 overflow-hidden bg-[#FFF8F6]">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-[#FF7F50]/5 blur-[120px] rounded-full -mr-32 -mt-32" />
        <div className="max-w-7xl mx-auto px-6 sm:px-12 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center md:text-left"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#FF7F50]/5 text-[#FF7F50] rounded-full text-xs font-black uppercase tracking-[0.3em] mb-8 border border-[#FF7F50]/10">
               <RotateCcw className="w-4 h-4" /> Financial Clarity
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-[#0F4C5C] tracking-tighter leading-none mb-6">
              Refund <span className="text-[#FF7F50]">Policy.</span>
            </h1>
            <p className="text-gray-400 text-xl font-medium max-w-2xl leading-relaxed">
              Fairness and precision in every transaction. Understanding our commitment and your coverage.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6 sm:px-12">
          
          <div className="space-y-12">
            
            {/* Top Disclaimer */}
            <div className="bg-[#0F4C5C] p-12 rounded-[3.5rem] text-white relative overflow-hidden">
               <div className="relative z-10">
                  <h2 className="text-3xl font-black mb-6 tracking-tight uppercase">Booking Terms & Refunds</h2>
                  <p className="text-white/70 font-medium text-lg leading-relaxed">
                     Go Win International Travel and Tourism Pvt. Ltd. <br />
                     <span className="opacity-50 italic">Effective Date: March 14, 2026</span>
                  </p>
               </div>
               <Wallet className="absolute -bottom-10 -right-10 w-64 h-64 text-white/5" />
            </div>

            {/* General Policies Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               {policies.map((p, i) => (
                 <motion.div 
                   key={i}
                   initial={{ opacity: 0, y: 20 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   viewport={{ once: true }}
                   transition={{ delay: i * 0.1 }}
                   className="p-10 rounded-[3rem] bg-gray-50 border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all group"
                 >
                   <div className="mb-6 transform group-hover:scale-110 transition-transform">{p.icon}</div>
                   <h3 className="text-xl font-black text-[#0F4C5C] mb-4 tracking-tight">{p.title}</h3>
                   <p className="text-gray-500 text-sm font-medium leading-relaxed">{p.desc}</p>
                 </motion.div>
               ))}
            </div>

            {/* Detailed Sections */}
            <div className="space-y-16 pt-12">
               
               <section>
                  <h3 className="text-2xl font-black text-[#0F4C5C] mb-6 tracking-tight flex items-center gap-4">
                     <CreditCard className="w-6 h-6 text-[#2A9D8F]" /> 5. Airline Tickets, Hotels and Travel Packages
                  </h3>
                  <p className="text-gray-500 font-medium leading-relaxed">
                     Refunds for airline tickets, hotels, tour packages, or other travel services depend entirely on the terms and conditions of the respective airline, hotel, or service provider.
                  </p>
               </section>

               <section className="p-12 rounded-[3.5rem] bg-[#2A9D8F]/5 border border-[#2A9D8F]/10">
                  <h3 className="text-2xl font-black text-[#0F4C5C] mb-6 tracking-tight flex items-center gap-4">
                     <ShieldAlert className="w-6 h-6 text-[#2A9D8F]" /> 6. Third-Party Services
                  </h3>
                  <p className="text-gray-500 font-medium leading-relaxed">
                     Many services are provided by third-party partners such as airlines, hotels, visa centers, insurance companies, and tour operators. Refunds for these services are subject to their individual policies.
                  </p>
               </section>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div>
                    <h4 className="text-xl font-black text-[#0F4C5C] mb-4 tracking-tight">7. Client Responsibility</h4>
                    <p className="text-gray-500 font-medium text-sm leading-relaxed">
                      Clients must provide accurate information, complete documentation, and attend appointments as scheduled. Failure to do so may result in loss of payments without refund.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-xl font-black text-[#0F4C5C] mb-4 tracking-tight">8. Processing Time</h4>
                    <p className="text-gray-500 font-medium text-sm leading-relaxed">
                      If a refund is approved by a third-party provider, processing time will depend on that provider and related banking procedures.
                    </p>
                  </div>
               </div>

               <section className="bg-gray-50 p-12 rounded-[3.5rem] border border-dashed border-gray-200 text-center">
                  <h3 className="text-2xl font-black text-[#0F4C5C] mb-4 tracking-tight">Important Notice</h3>
                  <p className="text-gray-500 font-medium mb-8">
                    Go Win International Travel and Tourism Pvt. Ltd. reserves the right to change or update this Refund Policy at any time without prior notice to clients.
                  </p>
                  <div className="flex flex-col items-center">
                     <p className="text-xs font-black text-[#FF7F50] uppercase tracking-[0.3em] mb-4">Questions?</p>
                     <p className="text-[#0F4C5C] font-black uppercase tracking-widest text-lg">
                       Kathmandu, Nepal
                     </p>
                  </div>
               </section>

            </div>

          </div>

        </div>
      </section>
    </div>
  );
};

export default RefundPolicy;
