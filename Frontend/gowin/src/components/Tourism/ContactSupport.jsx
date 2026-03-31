import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Headphones, MessageCircle, Mail, Phone, Clock, FileQuestion, HelpCircle } from "lucide-react";
import Navbar from "./Navbar";

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
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Header */}
      <section className="relative pt-40 pb-20 overflow-hidden bg-[#F8FAFB]">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#0F4C5C]/5 blur-[100px] rounded-full -mr-20 -mt-20" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="mb-6 flex justify-center">
               <span className="section-label">24/7 Priority Support</span>
            </div>
            <h1 className="heading-font text-5xl md:text-7xl text-[#1a1a2e] mb-6">
               Support <span className="text-[#0F4C5C]">Center.</span>
            </h1>
            <p className="text-gray-500 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
              We're here to ensure your journey is as smooth as your destination.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Support Channels */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-24 max-w-4xl mx-auto">
              {[
                { icon: <Mail className="w-6 h-6 text-[#0F4C5C]" />, label: "Email Support", value: "Info.gowintravels@gmail.com", status: "2h Wait Time", color: "bg-[#F8FAFB] border border-gray-100", text: "text-[#1a1a2e]", muted: "text-gray-400", statColor: "text-[#FF7F50]" },
                { icon: <Phone className="w-6 h-6 text-[#0F4C5C]" />, label: "Elite Line", value: "+977 9851410966", status: "24/7 Active", color: "bg-[#F8FAFB] border border-gray-100", text: "text-[#1a1a2e]", muted: "text-gray-400", statColor: "text-[#FF7F50]" }
              ].map((item, i) => (
                <div key={i} className={`p-8 rounded-3xl transition-transform hover:-translate-y-1 hover:shadow-lg ${item.color}`}>
                   <div className="mb-5 w-12 h-12 bg-white rounded-xl flex items-center justify-center border border-gray-100">{item.icon}</div>
                   <p className={`text-[10px] font-bold uppercase tracking-widest mb-2 ${item.muted}`}>{item.label}</p>
                   <h4 className={`text-lg font-bold mb-6 break-words ${item.text}`}>{item.value}</h4>
                   <div className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest ${item.statColor}`}>
                      <div className="w-1.5 h-1.5 rounded-full bg-[#FF7F50] animate-pulse" /> {item.status}
                   </div>
                </div>
              ))}
           </div>

           {/* FAQ Section */}
           <div className="bg-[#F8FAFB] border border-gray-100 rounded-[2.5rem] p-8 md:p-16 relative overflow-hidden shadow-sm">
              <div className="absolute top-0 right-0 w-80 h-80 bg-[#FF7F50]/5 rounded-full blur-[100px] -mr-40 -mt-40" />
              <div className="relative z-10 max-w-3xl mx-auto md:mx-0">
                 <h2 className="heading-font text-4xl md:text-5xl text-[#1a1a2e] mb-12">Frequently <br /><span className="text-[#0F4C5C]">Asked.</span></h2>
                 <div className="space-y-8">
                    {faqs.map((faq, i) => (
                       <motion.div 
                         key={i}
                         initial={{ opacity: 0, x: -20 }}
                         whileInView={{ opacity: 1, x: 0 }}
                         viewport={{ once: true }}
                         className="group cursor-pointer"
                       >
                          <h4 className="text-base font-bold text-[#1a1a2e] mb-3 flex items-start gap-4 group-hover:text-[#FF7F50] transition-colors">
                             <HelpCircle className="w-5 h-5 text-[#FF7F50] shrink-0 mt-0.5" /> {faq.q}
                          </h4>
                          <p className="pl-9 text-gray-500 text-sm leading-relaxed max-w-2xl border-l-2 border-gray-200 transition-all group-hover:border-[#FF7F50]">
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
      <section className="py-24 bg-[#F8FAFB] border-t border-gray-100">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex flex-col items-center mb-12">
               <FileQuestion className="w-10 h-10 text-[#FF7F50] mb-5" />
               <h3 className="heading-font text-3xl text-[#1a1a2e]">Visit Our Headquarters</h3>
            </div>
            <div className="bg-white p-10 rounded-[2.5rem] inline-block border border-gray-100 max-w-lg shadow-sm">
               <p className="text-[#0F4C5C] font-black uppercase tracking-widest text-lg mb-2">Kathmandu Office</p>
               <p className="text-gray-500 text-sm leading-relaxed mb-6">Shankhamul-31, Kathmandu, Nepal</p>
               <div className="flex justify-center gap-6 border-t border-gray-100 pt-6">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-[#FF7F50] uppercase tracking-wider">
                     <Clock className="w-3.5 h-3.5" /> 9:00 AM - 6:00 PM
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-[#FF7F50] uppercase tracking-wider">
                     <Clock className="w-3.5 h-3.5" /> Sun - Fri
                  </div>
               </div>
            </div>
         </div>
      </section>
    </div>
  );
};

export default ContactSupport;
