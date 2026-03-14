"use client"

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Lock, FileText, UserCheck, Eye, Database, Info } from "lucide-react";
import Navbar from "./Navbar";
import Footer from "../Home/Footer";

const PrivacyPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Header */}
      <section className="relative pt-48 pb-24 overflow-hidden bg-[#F8FAFB]">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-[#2A9D8F]/5 blur-[120px] rounded-full -mr-32 -mt-32" />
        <div className="max-w-7xl mx-auto px-6 sm:px-12 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center md:text-left"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#0F4C5C]/5 text-[#0F4C5C] rounded-full text-xs font-black uppercase tracking-[0.3em] mb-8 border border-[#0F4C5C]/10">
               <ShieldCheck className="w-4 h-4 text-[#2A9D8F]" /> Legal Foundation
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-[#0F4C5C] tracking-tighter leading-none mb-6">
              Privacy <span className="text-[#2A9D8F]">Policy.</span>
            </h1>
            <p className="text-gray-400 text-xl font-medium max-w-2xl leading-relaxed">
              Transparent protection. Your trust is the foundation of our elite hospitality.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Policy Content */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6 sm:px-12">
          
          <div className="prose prose-xl prose-slate max-w-none space-y-16">
            
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               className="bg-[#F8FAFB] p-12 rounded-[3.5rem] border border-gray-100"
            >
              <h2 className="text-3xl font-black text-[#0F4C5C] mb-6 tracking-tight flex items-center gap-4">
                 <Info className="w-8 h-8 text-[#2A9D8F]" /> 1. Introduction
              </h2>
              <p className="text-gray-500 font-medium leading-relaxed italic">
                Effective Date: March 14, 2026
              </p>
              <p className="text-gray-500 font-medium leading-relaxed mt-4">
                Go Win International Travel and Tourism Pvt. Ltd. ("Company", "we", "our", or "us") respects your privacy and is committed to protecting the personal information of our customers, partners, and website visitors. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our travel services, visit our website, or communicate with us.
              </p>
            </motion.div>

            <div className="space-y-12">
               <section>
                  <h3 className="text-2xl font-black text-[#0F4C5C] mb-6 tracking-tight flex items-center gap-4">
                    <UserCheck className="w-6 h-6 text-[#FF7F50]" /> 2. Information We Collect
                  </h3>
                  <p className="text-gray-500 font-medium leading-relaxed mb-6">
                    We may collect personal information when you book travel services, request visa assistance, contact us, or visit our website. Personal information may include:
                  </p>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {["Full name", "Date of birth", "Nationality", "Passport details", "Phone number", "Email address", "Address", "Payment details", "Travel preferences"].map(item => (
                       <li key={item} className="flex items-center gap-3 text-sm font-bold text-[#0F4C5C] bg-gray-50 px-5 py-3 rounded-xl border border-gray-100">
                          <div className="w-2 h-2 rounded-full bg-[#2A9D8F]" /> {item}
                       </li>
                    ))}
                  </ul>
                  <p className="text-gray-500 font-medium leading-relaxed mt-8">
                    We may also automatically collect information such as IP address, browser type, device information, and website usage data.
                  </p>
               </section>

               <section className="bg-[#0F4C5C] p-12 rounded-[3.5rem] text-white overflow-hidden relative group">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 blur-[100px] rounded-full -mr-32 -mt-32" />
                  <h3 className="text-2xl font-black text-white mb-6 tracking-tight flex items-center gap-4">
                    <FileText className="w-6 h-6 text-[#2A9D8F]" /> 3. Additional Information for Visa Applications
                  </h3>
                  <p className="text-white/70 font-medium leading-relaxed mb-8">
                    For visa processing and travel documentation purposes, we may request additional personal or professional information depending on the requirements of the respective embassy, consulate, or visa application center. This may include but is not limited to:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      "Employment details", "Company information", "Company registration documents", 
                      "PAN / Tax registration documents", "Audit reports or tax clearance documents", 
                      "Bank statements", "Financial documents", "Business ownership proof", 
                      "Invitation letters or supporting documents"
                    ].map(item => (
                       <div key={item} className="text-xs font-bold uppercase tracking-widest text-white/50 flex items-center gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#2A9D8F]" /> {item}
                       </div>
                    ))}
                  </div>
                  <p className="mt-8 text-sm font-black text-[#2A9D8F] uppercase tracking-widest">
                    Clients are responsible for providing accurate and genuine documents when requested.
                  </p>
               </section>

               <section>
                  <h3 className="text-2xl font-black text-[#0F4C5C] mb-6 tracking-tight flex items-center gap-4">
                    <Activity className="w-6 h-6 text-[#2A9D8F]" /> 4. How We Use Your Information
                  </h3>
                  <div className="space-y-4">
                    {[
                      "Process travel bookings", "Arrange airline tickets and hotel reservations", 
                      "Assist with visa applications", "Communicate booking confirmations and updates", 
                      "Provide customer support", "Improve our services", "Comply with legal requirements"
                    ].map((item, i) => (
                       <div key={i} className="flex gap-4 p-5 rounded-2xl border border-gray-50 hover:bg-[#F8FAFB] transition-all">
                          <div className="text-[#2A9D8F] font-black">{i + 1}.</div>
                          <p className="text-gray-500 font-medium">{item}</p>
                       </div>
                    ))}
                  </div>
               </section>

               <section>
                  <h3 className="text-2xl font-black text-[#0F4C5C] mb-6 tracking-tight flex items-center gap-4">
                    <Database className="w-6 h-6 text-[#FF7F50]" /> 5. Sharing of Information
                  </h3>
                  <p className="text-gray-500 font-medium leading-relaxed">
                    We may share information with trusted third parties such as: Airlines, Hotels, Tour operators, Visa processing centers (including VFS or similar agencies), Insurance companies, and Government authorities or embassies when required for visa processing.
                  </p>
               </section>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-[#F8FAFB] p-10 rounded-[2.5rem] border border-gray-100">
                     <h4 className="text-xl font-black text-[#0F4C5C] mb-4 tracking-tight">6. Data Protection</h4>
                     <p className="text-gray-500 text-sm font-medium leading-relaxed">
                        We take reasonable technical and organizational measures to protect your personal information against unauthorized access, misuse, loss, or disclosure.
                     </p>
                  </div>
                  <div className="bg-[#F8FAFB] p-10 rounded-[2.5rem] border border-gray-100">
                     <h4 className="text-xl font-black text-[#0F4C5C] mb-4 tracking-tight">7. Cookies</h4>
                     <p className="text-gray-500 text-sm font-medium leading-relaxed">
                        Our website may use cookies to improve user experience and analyze website traffic. Users may disable cookies through browser settings.
                     </p>
                  </div>
               </div>

               <section className="space-y-8">
                  <div>
                    <h4 className="text-xl font-black text-[#0F4C5C] mb-3 tracking-tight">8. Third-Party Websites</h4>
                    <p className="text-gray-500 font-medium leading-relaxed">
                      Our website may contain links to external websites. We are not responsible for the privacy practices of those websites.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-xl font-black text-[#0F4C5C] mb-3 tracking-tight">9. Data Retention</h4>
                    <p className="text-gray-500 font-medium leading-relaxed">
                      We retain personal data only as long as necessary to provide services, meet legal obligations, and resolve disputes.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-xl font-black text-[#0F4C5C] mb-3 tracking-tight">10. Children's Privacy</h4>
                    <p className="text-gray-500 font-medium leading-relaxed">
                      Our services are not intended for individuals under 18 without parental consent.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-xl font-black text-[#0F4C5C] mb-3 tracking-tight">11. Policy Changes</h4>
                    <p className="text-gray-500 font-medium leading-relaxed">
                      Go Win International Travel and Tourism Pvt. Ltd. reserves the right to modify this Privacy Policy at any time without prior notice.
                    </p>
                  </div>
               </section>

               <section className="bg-gray-50 p-12 rounded-[3.5rem] border border-dashed border-gray-200 text-center">
                  <h3 className="text-2xl font-black text-[#0F4C5C] mb-4 tracking-tight">12. Contact Information</h3>
                  <p className="text-gray-500 font-medium mb-6">For questions regarding this Privacy Policy, please contact:</p>
                  <p className="text-[#0F4C5C] font-black uppercase tracking-widest leading-relaxed">
                    Go Win International Travel and Tourism Pvt. Ltd. <br />
                    Kathmandu, Nepal
                  </p>
               </section>

            </div>

          </div>

        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicy;

import { Activity } from "lucide-react";
