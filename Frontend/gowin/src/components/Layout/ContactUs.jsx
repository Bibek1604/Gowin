import React from 'react';
import baliHero from '../../assets/bali-hero.jpeg';
import thilandHero from '../../assets/thiland-hero.jpeg';
import kerelaHero from '../../assets/kerela-hero.jpeg';
import { SectionHeader } from '../ui';
import { MapPin, Phone, Mail, Headset, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const ContactUs = () => {
  const contactItems = [
    {
      icon: MapPin,
      label: 'Our Office',
      value: 'Kathmandu, Shankhamul',
      sub: 'Headquarters',
      href: null,
    },
    {
      icon: Phone,
      label: 'Direct Line',
      value: '+977 9851410966',
      sub: '24/7 Support',
      href: 'tel:+9779851410966',
    },
    {
      icon: Mail,
      label: 'Email Address',
      value: 'info@gowin.com',
      sub: 'Digital Desk',
      href: 'mailto:info@gowin.com',
    },
  ];

  return (
    <div className="relative min-h-screen bg-white py-16 px-5 sm:px-8 md:py-20 lg:py-24 overflow-hidden font-outfit">
      {/* Subtle background decoration */}
      <div className="absolute inset-0 opacity-[0.025] pointer-events-none">
        <div className="absolute -left-20 top-20 w-96 h-96 bg-[#0F4C5C]/10 rounded-full blur-3xl" />
        <div className="absolute -right-20 bottom-10 w-80 h-80 bg-[#FF7F50]/10 rounded-full blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-14 md:mb-16 lg:mb-20">
          <SectionHeader
            title="Get in Touch"
            subtitle="We're here to help plan your perfect journey"
          />
        </div>

        <div className="grid lg:grid-cols-2 gap-10 xl:gap-16 items-start">
          {/* Left – Visuals */}
          <div className="grid grid-cols-2 gap-5 md:gap-6 order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="col-span-2 md:col-span-1"
            >
              <div className="space-y-5 md:space-y-6">
                <div className="overflow-hidden rounded-3xl shadow-sm border border-slate-100">
                  <img
                    src={baliHero}
                    alt="Bali landscape"
                    className="w-full h-52 sm:h-64 md:h-72 object-cover transition-transform duration-700 hover:scale-105"
                  />
                </div>

                <div className="rounded-2xl bg-white/60 backdrop-blur-md border border-[#0F4C5C]/10 p-5 shadow-sm">
                  <div className="flex items-center gap-3 mb-2.5">
                    <div className="p-2.5 bg-[#0F4C5C]/5 rounded-lg">
                      <MapPin className="w-4 h-4 text-[#0F4C5C]" />
                    </div>
                    <span className="text-[10px] md:text-xs font-semibold uppercase tracking-wider text-[#FF7F50]">
                      Travel Anywhere
                    </span>
                  </div>
                  <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
                    Expert guidance from planning to landing — wherever your journey takes you.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="col-span-2 md:col-span-1 pt-4 md:pt-12"
            >
              <div className="space-y-5 md:space-y-6">
                <div className="overflow-hidden rounded-3xl shadow-sm border border-slate-100">
                  <img
                    src={thilandHero}
                    alt="Thailand beach"
                    className="w-full h-52 sm:h-64 object-cover transition-transform duration-700 hover:scale-105"
                  />
                </div>
                <div className="overflow-hidden rounded-3xl shadow-sm border border-slate-100">
                  <img
                    src={kerelaHero}
                    alt="Kerala backwaters"
                    className="w-full h-52 sm:h-64 object-cover transition-transform duration-700 hover:scale-105"
                  />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right – Contact Cards */}
          <div className="order-1 lg:order-2 space-y-5 md:space-y-6">
            {contactItems.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                {item.href ? (
                  <a
                    href={item.href}
                    className="group flex items-center gap-4 p-5 md:p-6 bg-white border border-slate-100 rounded-2xl hover:border-[#FF7F50]/30 hover:shadow-md transition-all duration-300"
                  >
                    <ContactCardContent item={item} />
                  </a>
                ) : (
                  <div className="flex items-center gap-4 p-5 md:p-6 bg-white border border-slate-100 rounded-2xl hover:border-[#FF7F50]/30 hover:shadow-md transition-all duration-300">
                    <ContactCardContent item={item} />
                  </div>
                )}
              </motion.div>
            ))}

            {/* Concierge / Support banner */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="relative p-6 md:p-8 bg-gradient-to-br from-[#0F4C5C]/5 to-white rounded-2xl border border-[#0F4C5C]/10 shadow-sm overflow-hidden group"
            >
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-[#0F4C5C]/5 rounded-full blur-2xl" />

              <div className="relative flex items-start sm:items-center gap-5">
                <div className="shrink-0 w-14 h-14 rounded-xl bg-[#0F4C5C] flex items-center justify-center shadow-md">
                  <Headset className="w-7 h-7 text-white" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2.5 mb-1.5">
                    <div className="w-2 h-2 rounded-full bg-[#FF7F50] animate-pulse" />
                    <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-[#FF7F50]">
                      24/7 Live Support
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-semibold text-slate-800 mb-1.5">
                    Travel Concierge
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Instant help from real travel experts — planning, changes, emergencies.
                  </p>
                </div>

                <ArrowRight className="hidden sm:block w-5 h-5 text-[#0F4C5C]/30 group-hover:text-[#FF7F50] group-hover:translate-x-1 transition-all" />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

function ContactCardContent({ item }) {
  const Icon = item.icon;
  return (
    <>
      <div className="shrink-0 w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-[#0F4C5C]/5 flex items-center justify-center group-hover:bg-[#FF7F50] transition-colors duration-300">
        <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-[#0F4C5C] group-hover:text-white transition-colors" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider text-[#FF7F50]">
            {item.sub}
          </span>
        </div>
        <h3 className="text-xs sm:text-sm font-medium text-slate-500 uppercase tracking-wide mb-0.5">
          {item.label}
        </h3>
        <div className="text-sm sm:text-base font-semibold text-slate-700 group-hover:text-[#0F4C5C] transition-colors">
          {item.value}
        </div>
      </div>

      <ArrowRight className="hidden sm:block w-4 h-4 text-transparent group-hover:text-[#FF7F50] group-hover:translate-x-1 transition-all duration-300" />
    </>
  );
}

export default ContactUs;