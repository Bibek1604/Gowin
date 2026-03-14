"use client"

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Scale, FileText, CheckCircle, AlertTriangle, ShieldCheck, HelpCircle, ArrowRight } from "lucide-react";
import Navbar from "./Navbar";
import Footer from "../Home/Footer";

const TermsConditions = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Header */}
      <section className="relative pt-48 pb-24 overflow-hidden bg-[#F1F3F4]">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-[#0F4C5C]/5 blur-[120px] rounded-full -mr-32 -mt-32" />
        <div className="max-w-7xl mx-auto px-6 sm:px-12 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#0F4C5C]/5 text-[#0F4C5C] rounded-full text-xs font-black uppercase tracking-[0.3em] mb-8 border border-[#0F4C5C]/10">
               <Scale className="w-4 h-4 text-[#2A9D8F]" /> Legal Agreement
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-[#0F4C5C] tracking-tighter leading-none mb-6">
              Terms & <span className="text-[#2A9D8F]">Conditions.</span>
            </h1>
            <p className="text-gray-400 text-xl font-medium max-w-2xl leading-relaxed">
              Establishing clear expectations for your global adventures with Go Win International.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6 sm:px-12">
          
          <div className="space-y-16">
            
            <section className="bg-gray-50 p-12 rounded-[3.5rem] border border-gray-100">
               <h2 className="text-3xl font-black text-[#0F4C5C] mb-6 tracking-tight flex items-center gap-4">
                  <ShieldCheck className="w-8 h-8 text-[#2A9D8F]" /> 1. Agreement to Terms
               </h2>
               <p className="text-gray-500 font-medium leading-relaxed">
                  By using our services or website, you agree to be bound by these Terms and Conditions. Go Win International Travel and Tourism Pvt. Ltd. provides luxury concierge and travel services subject to your compliance with all terms, conditions, and notices contained herein.
               </p>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
               <div>
                  <h3 className="text-xl font-black text-[#0F4C5C] mb-4 tracking-tight flex items-center gap-3">
                     <CheckCircle className="w-5 h-5 text-[#2A9D8F]" /> 2. Booking Verification
                  </h3>
                  <p className="text-gray-500 text-sm font-medium leading-relaxed">
                     All bookings are subject to availability and confirmation. A booking is only finalized once full payment or a specified deposit is received and confirmed by our system.
                  </p>
               </div>
               <div>
                  <h3 className="text-xl font-black text-[#0F4C5C] mb-4 tracking-tight flex items-center gap-3">
                     <AlertTriangle className="w-5 h-5 text-[#FF7F50]" /> 3. Liability Disclaimer
                  </h3>
                  <p className="text-gray-500 text-sm font-medium leading-relaxed">
                     While we curate the highest quality experiences, Go Win is not liable for service disruptions caused by third-party providers (airlines, hotels) or unforeseen natural events.
                  </p>
               </div>
            </div>

            <section className="bg-[#0F4C5C] p-12 rounded-[3.5rem] text-white">
               <h3 className="text-2xl font-black mb-6 tracking-tight flex items-center gap-4">
                  <FileText className="w-6 h-6 text-[#FF7F50]" /> 4. User Responsibilities
               </h3>
               <div className="space-y-4">
                  {[
                    "Provide accurate personal and financial details",
                    "Maintain valid travel documentation (Passports, Visas)",
                    "Adhere to local laws and customs of destination countries",
                    "Notify us immediately of any booking changes or cancellations"
                  ].map((resp, i) => (
                    <div key={i} className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
                       <ArrowRight className="w-5 h-5 text-[#2A9D8F] shrink-0" />
                       <p className="text-white/70 font-bold text-sm">{resp}</p>
                    </div>
                  ))}
               </div>
            </section>

            <section>
               <h3 className="text-2xl font-black text-[#0F4C5C] mb-6 tracking-tight flex items-center gap-4">
                  <HelpCircle className="w-6 h-6 text-[#2A9D8F]" /> 5. Intellectual Property
               </h3>
               <p className="text-gray-500 font-medium leading-relaxed">
                  All content, branding, logos, and digital assets on this platform remain the exclusive property of Go Win International Travel and Tourism Pvt. Ltd. Unauthorized reproduction or use is strictly prohibited.
               </p>
            </section>

            <section className="bg-gray-50 p-12 rounded-[3.5rem] border border-dashed border-gray-200 text-center">
               <h3 className="text-xl font-black text-[#0F4C5C] mb-4 tracking-tight uppercase">Governing Law</h3>
               <p className="text-gray-500 font-medium mb-8">
                 These terms are governed by the laws of Nepal. Any disputes shall be subject to the exclusive jurisdiction of the courts of Kathmandu.
               </p>
               <div className="flex flex-col items-center">
                  <p className="text-xs font-black text-[#FF7F50] uppercase tracking-[0.3em] mb-4">Last Updated</p>
                  <p className="text-[#0F4C5C] font-black uppercase tracking-widest leading-relaxed">
                    March 14, 2026
                  </p>
               </div>
            </section>

          </div>

        </div>
      </section>
    </div>
  );
};

export default TermsConditions;
