import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, FileText, UserCheck, Database, Info, Activity } from "lucide-react";
import Navbar from "./Navbar";

const PrivacyPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Header */}
      <section className="relative pt-40 pb-20 overflow-hidden bg-[#F8FAFB]">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-[#FF7F50]/5 blur-[100px] rounded-full -mr-32 -mt-32" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center md:text-left">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="mb-6 flex items-center justify-center md:justify-start">
               <span className="section-label">Legal Foundation</span>
            </div>
            <h1 className="heading-font text-5xl md:text-7xl text-[#1a1a2e] mb-6">
              Privacy <span className="text-[#FF7F50]">Policy.</span>
            </h1>
            <p className="text-gray-500 text-lg md:text-xl font-medium max-w-2xl leading-relaxed mx-auto md:mx-0">
              Transparent protection. Your trust is the foundation of our elite hospitality.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Policy Content */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="space-y-16">
            
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               className="bg-[#F8FAFB] p-8 md:p-12 rounded-[2.5rem] border border-gray-100"
            >
              <h2 className="heading-font text-3xl text-[#1a1a2e] mb-2 flex items-center gap-3">
                 <Info className="w-8 h-8 text-[#FF7F50]" /> 1. Introduction
              </h2>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-6">Effective Date: March 14, 2026</p>
              <p className="text-gray-500 leading-relaxed text-sm">
                Go Win International Travel and Tourism Pvt. Ltd. ("Company", "we", "our", or "us") respects your privacy and is committed to protecting the personal information of our customers, partners, and website visitors. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our travel services, visit our website, or communicate with us.
              </p>
            </motion.div>

            <div className="space-y-12">
               {/* Collect */}
               <section>
                  <h3 className="heading-font text-2xl text-[#1a1a2e] mb-6 flex items-center gap-3">
                    <UserCheck className="w-6 h-6 text-[#FF7F50]" /> 2. Information We Collect
                  </h3>
                  <p className="text-gray-500 leading-relaxed text-sm mb-6">
                    We may collect personal information when you book travel services, request visa assistance, contact us, or visit our website. Personal information may include:
                  </p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {["Full name", "Date of birth", "Nationality", "Passport details", "Phone number", "Email address", "Address", "Payment details", "Travel preferences"].map(item => (
                       <li key={item} className="flex items-center gap-3 text-sm font-bold text-[#1a1a2e] bg-[#F8FAFB] px-5 py-3.5 rounded-2xl border border-gray-100">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#FF7F50]" /> {item}
                       </li>
                    ))}
                  </ul>
                  <p className="text-gray-500 leading-relaxed text-sm mt-6">
                    We may also automatically collect information such as IP address, browser type, device information, and website usage data.
                  </p>
               </section>

               {/* Visa Info */}
               <section className="bg-[#0F4C5C] p-8 md:p-12 rounded-[2.5rem] text-white overflow-hidden relative group">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 blur-[80px] rounded-full -mr-32 -mt-32" />
                  <h3 className="heading-font text-2xl text-white mb-6 flex items-center gap-3">
                    <FileText className="w-6 h-6 text-[#FF7F50]" /> 3. Visa Applications
                  </h3>
                  <p className="text-white/70 leading-relaxed text-sm mb-8">
                    For visa processing and travel documentation purposes, we may request additional personal or professional information depending on the requirements of the respective embassy. This may include:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      "Employment details", "Company information", "Registration documents", 
                      "PAN / Tax documents", "Audit reports", 
                      "Bank statements", "Business ownership proof", 
                      "Invitation letters"
                    ].map(item => (
                       <div key={item} className="text-[11px] font-bold uppercase tracking-widest text-white/50 flex items-center gap-3">
                          <div className="w-1 h-1 rounded-full bg-[#FF7F50]" /> {item}
                       </div>
                    ))}
                  </div>
                  <div className="mt-8 p-4 bg-[#FF7F50]/10 border border-[#FF7F50]/20 rounded-xl">
                     <p className="text-[10px] font-bold text-[#FF7F50] uppercase tracking-widest">
                       Clients are responsible for providing accurate and genuine documents when requested.
                     </p>
                  </div>
               </section>

               {/* Usage */}
               <section>
                  <h3 className="heading-font text-2xl text-[#1a1a2e] mb-6 flex items-center gap-3">
                    <Activity className="w-6 h-6 text-[#FF7F50]" /> 4. How We Use Information
                  </h3>
                  <div className="space-y-3">
                    {[
                      "Process travel bookings", "Arrange airline tickets and hotel reservations", 
                      "Assist with visa applications", "Communicate booking confirmations and updates", 
                      "Provide customer support", "Improve our services", "Comply with legal requirements"
                    ].map((item, i) => (
                       <div key={i} className="flex gap-4 p-4 rounded-2xl border border-gray-100 hover:shadow-md transition-shadow bg-white">
                          <div className="text-[#FF7F50] font-black">{i + 1}.</div>
                          <p className="text-gray-500 text-sm font-medium">{item}</p>
                       </div>
                    ))}
                  </div>
               </section>

               {/* Sharing */}
               <section>
                  <h3 className="heading-font text-2xl text-[#1a1a2e] mb-6 flex items-center gap-3">
                    <Database className="w-6 h-6 text-[#FF7F50]" /> 5. Sharing of Information
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed p-6 bg-[#F8FAFB] rounded-2xl border border-gray-100">
                    We may share information with trusted third parties such as: Airlines, Hotels, Tour operators, Visa processing centers (including VFS or similar agencies), Insurance companies, and Government authorities or embassies when required for visa processing.
                  </p>
               </section>

               {/* Grid terms */}
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
                     <h4 className="heading-font text-xl text-[#0F4C5C] mb-3">6. Data Protection</h4>
                     <p className="text-gray-500 text-xs leading-relaxed">
                        We take reasonable technical and organizational measures to protect your personal information against unauthorized access, misuse, loss, or disclosure.
                     </p>
                  </div>
                  <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
                     <h4 className="heading-font text-xl text-[#0F4C5C] mb-3">7. Cookies</h4>
                     <p className="text-gray-500 text-xs leading-relaxed">
                        Our website may use cookies to improve user experience and analyze website traffic. Users may disable cookies through browser settings.
                     </p>
                  </div>
               </div>

               {/* List Terms */}
               <section className="space-y-6">
                  {[
                     { t:"8. Third-Party Websites", d:"Our website may contain links to external websites. We are not responsible for the privacy practices of those websites." },
                     { t:"9. Data Retention", d:"We retain personal data only as long as necessary to provide services, meet legal obligations, and resolve disputes." },
                     { t:"10. Children's Privacy", d:"Our services are not intended for individuals under 18 without parental consent." },
                     { t:"11. Policy Changes", d:"Go Win International Travel and Tourism Pvt. Ltd. reserves the right to modify this Privacy Policy at any time without prior notice." }
                  ].map(x => (
                     <div key={x.t} className="border-l-2 border-[#FF7F50] pl-6 py-1">
                        <h4 className="text-sm font-bold text-[#1a1a2e] mb-1">{x.t}</h4>
                        <p className="text-gray-500 text-xs leading-relaxed">{x.d}</p>
                     </div>
                  ))}
               </section>

               {/* Contact Block */}
               <section className="bg-[#F8FAFB] p-10 rounded-[2.5rem] border border-gray-100 text-center">
                  <h3 className="heading-font text-2xl text-[#1a1a2e] mb-3">12. Contact Information</h3>
                  <p className="text-gray-500 text-sm mb-5">For questions regarding this Privacy Policy, please contact:</p>
                  <p className="text-[#0F4C5C] font-bold uppercase tracking-widest text-xs leading-relaxed max-w-xs mx-auto">
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
