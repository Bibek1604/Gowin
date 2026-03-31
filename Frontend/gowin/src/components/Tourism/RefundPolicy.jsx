import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { RotateCcw, Ban, Wallet, Calendar, AlertCircle, ShieldAlert, CreditCard } from "lucide-react";
import Navbar from "./Navbar";

const RefundPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const policies = [
    {
      icon: <Ban className="w-8 h-8 text-[#FF7F50]" />,
      title: "1. Service Charges",
      desc: "All consultation fees, service charges, and administrative fees paid to Go Win International Travel and Tourism Pvt. Ltd. are strictly non-refundable. These charges cover professional services such as consultation, document preparation, application assistance, and administrative work."
    },
    {
      icon: <ShieldAlert className="w-8 h-8 text-[#0F4C5C]" />,
      title: "2. Visa Application Fees",
      desc: "Visa fees paid to embassies, consulates, or visa centers are non-refundable regardless of visa approval or rejection."
    },
    {
      icon: <Calendar className="w-8 h-8 text-[#FFD23F]" />,
      title: "3. VFS Appointment Fees",
      desc: "Fees paid for VFS Global or other visa center appointments are generally non-refundable. Refund eligibility will strictly follow the official policies of the respective visa center."
    },
    {
      icon: <AlertCircle className="w-8 h-8 text-[#1a1a2e]" />,
      title: "4. Travel Insurance",
      desc: "Travel insurance purchased through our agency is subject to the terms and refund policies of the respective insurance provider. If the customer violates the insurance policy conditions, refunds may not be granted."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Header */}
      <section className="relative pt-40 pb-20 overflow-hidden bg-[#F8FAFB]">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-[#FF7F50]/5 blur-[120px] rounded-full -mr-32 -mt-32" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center md:text-left">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="mb-6 flex justify-center md:justify-start">
               <span className="section-label">Financial Clarity</span>
            </div>
            <h1 className="heading-font text-5xl md:text-7xl text-[#1a1a2e] mb-6">
              Refund <span className="text-[#0F4C5C]">Policy.</span>
            </h1>
            <p className="text-gray-500 text-lg md:text-xl font-medium max-w-2xl leading-relaxed mx-auto md:mx-0">
              Fairness and precision in every transaction. Understanding our commitment and your coverage.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="space-y-16">
            
            {/* Top Disclaimer */}
            <div className="bg-[#0F4C5C] p-8 md:p-12 rounded-[2.5rem] text-white relative overflow-hidden shadow-2xl">
               <div className="relative z-10">
                  <h2 className="heading-font text-3xl mb-4">Booking Terms & Refunds</h2>
                  <p className="text-white/80 font-medium text-sm leading-relaxed mb-4">
                     Go Win International Travel and Tourism Pvt. Ltd.
                  </p>
                  <div className="inline-block px-4 py-2 bg-white/10 rounded-xl border border-white/20">
                     <span className="text-[10px] uppercase tracking-widest font-bold">Effective Date: March 14, 2026</span>
                  </div>
               </div>
               <Wallet className="absolute -bottom-10 -right-10 w-64 h-64 text-white/5" />
            </div>

            {/* General Policies Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {policies.map((p, i) => (
                 <motion.div 
                   key={i}
                   initial={{ opacity: 0, y: 20 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   viewport={{ once: true }}
                   transition={{ delay: i * 0.1 }}
                   className="card p-8 group flex flex-col"
                 >
                   <div className="mb-6 w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100 transform group-hover:scale-110 transition-transform">
                      {p.icon}
                   </div>
                   <h3 className="heading-font text-xl text-[#1a1a2e] mb-3">{p.title}</h3>
                   <p className="text-gray-500 text-sm leading-relaxed flex-1">{p.desc}</p>
                 </motion.div>
               ))}
            </div>

            {/* Detailed Sections */}
            <div className="space-y-12">
               
               <section className="bg-white p-8 rounded-3xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
                  <h3 className="heading-font text-2xl text-[#1a1a2e] mb-4 flex items-center gap-3">
                     <CreditCard className="w-6 h-6 text-[#FF7F50]" /> 5. Travel Packages & Tickets
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                     Refunds for airline tickets, hotels, tour packages, or other travel services depend entirely on the terms and conditions of the respective airline, hotel, or service provider. Cancellations must be made within the provider's specified window.
                  </p>
               </section>

               <section className="bg-[#F8FAFB] p-8 rounded-3xl border border-[#0F4C5C]/5">
                  <h3 className="heading-font text-2xl text-[#0F4C5C] mb-4 flex items-center gap-3">
                     <ShieldAlert className="w-6 h-6 text-[#0F4C5C]" /> 6. Third-Party Services
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                     Many services are provided by third-party partners such as airlines, hotels, visa centers, insurance companies, and tour operators. Refunds for these services are completely subject to their individual policies, passing through our agency without markup modifications on returned funds.
                  </p>
               </section>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                  <div>
                    <h4 className="text-sm font-bold text-[#1a1a2e] mb-2 uppercase tracking-wide">7. Client Responsibility</h4>
                    <p className="text-gray-500 text-xs leading-relaxed border-l-2 border-[#FF7F50] pl-4">
                      Clients must provide accurate information, complete documentation, and attend appointments as scheduled. Failure to do so may result in loss of payments without refund.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#1a1a2e] mb-2 uppercase tracking-wide">8. Processing Time</h4>
                    <p className="text-gray-500 text-xs leading-relaxed border-l-2 border-[#1a1a2e] pl-4">
                      If a refund is approved by a third-party provider, processing time will depend on that provider and related banking procedures. We process our outbound transfers within 3 business days of receipt.
                    </p>
                  </div>
               </div>

               <section className="bg-[#F8FAFB] p-10 rounded-[2.5rem] mt-8 text-center border border-gray-100">
                  <h3 className="heading-font text-2xl text-[#1a1a2e] mb-3">Important Notice</h3>
                  <p className="text-gray-500 text-xs leading-relaxed mb-6 max-w-sm mx-auto">
                    Go Win International Travel and Tourism Pvt. Ltd. reserves the right to change or update this Refund Policy at any time without prior notice to clients.
                  </p>
                  <div className="flex flex-col items-center">
                     <p className="text-[10px] font-bold text-[#FF7F50] uppercase tracking-widest mb-2">Questions?</p>
                     <p className="text-[#0F4C5C] font-black uppercase tracking-widest text-sm">
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
