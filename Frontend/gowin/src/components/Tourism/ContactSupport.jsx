"use client"

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Headphones, MessageCircle, Mail, Phone, Clock, FileQuestion, HelpCircle, ArrowRight } from "lucide-react";
import Navbar from "./Navbar";
import Footer from "../Home/Footer";

const ContactSupport = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const faqs = [
    { q: "How do I modify my flight booking?", a: "Contact our 24/7 concierge through the dashboard or call our direct line for priority adjustments." },
    { q: "What documents are required for Nepal visas?", a: "A valid passport (6 months+), passport-size photos, and a completed visa form. We handle all paperwork for our clients." },
    { q: "When will I receive my travel insurance policy?", a: "Insurance documents are transmitted electronically within 24 hours of package confirmation." }
  ];

  return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar />
      
      {/* Hero Header */}
      <section className="relative pt-48 pb-12 overflow-hidden bg-[#F8FAFB]">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#0F4C5C]/5 text-[#0F4C5C] rounded-full text-xs font-black uppercase tracking-[0.3em] mb-8 border border-[#0F4C5C]/10">
               <Headphones className="w-4 h-4 text-[#FF7F50]" /> 24/7 Priority Support
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-[#0F4C5C] tracking-tighter leading-none mb-6 italic">
               Support <span className="text-[#FF7F50]">Center.</span>
            </h1>
            <p className="text-gray-400 text-xl font-medium max-w-2xl mx-auto leading-relaxed">
              We're here to ensure your journey is as smooth as your destination.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Support Channels */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 sm:px-12">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
              {[
                { icon: <MessageCircle className="w-8 h-8 text-[#FF7F50]" />, label: "Live Chat", value: "Instant Response", status: "Online Now", color: "bg-[#FF7F50]/5 border-[#FF7F50]/10" },
                { icon: <Mail className="w-8 h-8 text-[#FF7F50]" />, label: "Email Support", value: "Info.gowintravels@gmail.com", status: "2h Wait Time", color: "bg-[#FF7F50]/5 border-[#FF7F50]/10" },
                { icon: <Phone className="w-8 h-8 text-[#0F4C5C]" />, label: "Elite Line", value: "+977 9851410966", status: "24/7 Active", color: "bg-[#0F4C5C]/5 border-[#0F4C5C]/10" }
              ].map((item, i) => (
                <div key={i} className={`p-10 rounded-[3rem] border transition-all hover:shadow-xl ${item.color}`}>
                   <div className="mb-6">{item.icon}</div>
                   <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">{item.label}</p>
                   <h4 className="text-xl font-black text-[#0F4C5C] mb-6 tracking-tight break-words">{item.value}</h4>
                   <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#FF7F50]">
                      <div className="w-2 h-2 rounded-full bg-[#FF7F50] animate-pulse" /> {item.status}
                   </div>
                </div>
              ))}
           </div>

           {/* FAQ Section */}
           <div className="bg-[#0F4C5C] rounded-[4rem] p-16 md:p-24 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-[#FF7F50]/10 rounded-full blur-[120px] -mr-48 -mt-48" />
              <div className="relative z-10 max-w-3xl">
                 <h2 className="text-4xl md:text-5xl font-black text-white tracking-widest leading-none mb-12 uppercase">Frequently <br /> Asked.</h2>
                 <div className="space-y-8">
                    {faqs.map((faq, i) => (
                       <motion.div 
                         key={i}
                         initial={{ opacity: 0, x: -20 }}
                         whileInView={{ opacity: 1, x: 0 }}
                         viewport={{ once: true }}
                         className="group cursor-pointer"
                       >
                          <h4 className="text-xl font-black text-white mb-4 tracking-tight flex items-center gap-4 group-hover:text-[#FF7F50] transition-colors">
                             <HelpCircle className="w-6 h-6 text-[#FF7F50] shrink-0" /> {faq.q}
                          </h4>
                          <p className="pl-10 text-white/50 text-sm font-medium leading-relaxed max-w-2xl border-l-2 border-white/5 transition-all group-hover:border-[#FF7F50]">
                             {faq.a}
                          </p>
                       </motion.div>
                    ))}
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* Office Locations */}
      <section className="py-24 bg-white border-t border-gray-50">
         <div className="max-w-7xl mx-auto px-6 sm:px-12 text-center">
            <div className="flex flex-col items-center mb-16">
               <FileQuestion className="w-12 h-12 text-[#FF7F50] mb-6" />
               <h3 className="text-3xl font-black text-[#0F4C5C] tracking-tight uppercase">Visit Our Headquarters</h3>
            </div>
            <div className="bg-gray-50 p-12 rounded-[3.5rem] inline-block border border-gray-100 max-w-xl">
               <p className="text-[#0F4C5C] font-black uppercase tracking-widest text-xl mb-4">Kathmandu Office</p>
               <p className="text-gray-400 font-medium leading-relaxed mb-6">Shankhamul-31, Kathmandu, Nepal</p>
               <div className="flex items-center justify-center gap-8 border-t border-gray-200 pt-6">
                  <div className="flex items-center gap-2 text-xs font-black text-[#FF7F50] uppercase">
                     <Clock className="w-4 h-4" /> 9:00 AM - 6:00 PM
                  </div>
                  <div className="flex items-center gap-2 text-xs font-black text-[#FF7F50] uppercase">
                     <Clock className="w-4 h-4" /> Sun - Fri
                  </div>
               </div>
            </div>
         </div>
      </section>
    </div>
  );
};

export default ContactSupport;
