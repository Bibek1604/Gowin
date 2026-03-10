import React from 'react';
import gowin from '../../assets/gowin.jpg';
import { motion } from 'framer-motion';
import { Facebook, Instagram, Twitter, Linkedin, Mail, Phone, MapPin, Send, Heart, ArrowRight } from 'lucide-react';

const Footer = () => {
  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook', color: '#1877F2' },
    { icon: Instagram, href: '#', label: 'Instagram', color: '#E4405F' },
    { icon: Twitter, href: '#', label: 'Twitter', color: '#1DA1F2' },
    { icon: Linkedin, href: '#', label: 'LinkedIn', color: '#0A66C2' },
  ];

  const companyLinks = [
    { text: 'About Us', href: '/aboutus' },
    { text: 'Our Services', href: '/#services' },
    { text: 'Contact Us', href: '/contactus' },
    { text: 'Privacy Policy', href: '#' },
  ];

  const destinations = [
    { text: 'Bali, Indonesia', href: '#' },
    { text: 'Bangkok, Thailand', href: '#' },
    { text: 'Kerala, India', href: '#' },
    { text: 'Dubai, UAE', href: '#' },
  ];

  return (
    <footer className="relative bg-[#0b1121] text-slate-400 pt-24 pb-12 overflow-hidden font-outfit">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-sky-500/30 to-transparent" />
      <div className="absolute -left-20 top-40 w-80 h-80 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -right-20 bottom-20 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">

        {/* Top Section: Branding & Newsletter */}
        <div className="grid lg:grid-cols-2 gap-16 mb-20 items-center">
          <div>
            <div className="flex items-center gap-4 mb-6">
              <img src={gowin} alt="Gowin Travel" className="h-14 w-14 rounded-full border-2 border-slate-800 shadow-2xl" />
              <div>
                <h2 className="text-2xl font-black text-white tracking-tighter uppercase">
                  Go Win<span className="text-sky-500">.</span>
                </h2>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-sky-400/80">International</p>
              </div>
            </div>
            <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-md">
              Crafting extraordinary journeys and seamless global experiences since 2020. Your trust, our priority.
            </p>
          </div>

          <div className="relative p-8 rounded-3xl bg-slate-900/50 border border-slate-800/50 backdrop-blur-sm">
            <h3 className="text-white font-black uppercase tracking-widest text-xs mb-4 flex items-center gap-2">
              <Send className="w-4 h-4 text-sky-500" /> Subscribe to Adventure
            </h3>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 bg-slate-800/50 border border-slate-700 rounded-2xl px-5 py-4 text-sm font-semibold focus:outline-none focus:border-sky-500 transition-all text-white placeholder:text-slate-500"
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-sky-500 hover:bg-sky-600 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-sky-500/20 transition-colors"
              >
                Join Now
              </motion.button>
            </div>
          </div>
        </div>

        {/* Middle Section: Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-20">

          <div className="col-span-2 md:col-span-1">
            <h4 className="text-white font-black uppercase tracking-widest text-xs mb-8">Contact Info</h4>
            <ul className="space-y-5">
              <li className="flex items-start gap-4">
                <div className="mt-1 p-2 bg-slate-900 rounded-lg border border-slate-800">
                  <MapPin className="w-4 h-4 text-sky-400" />
                </div>
                <span className="text-sm font-medium leading-relaxed">Kathmandu, Nepal<br />Shankhamul-31</span>
              </li>
              <li className="flex items-center gap-4">
                <div className="p-2 bg-slate-900 rounded-lg border border-slate-800">
                  <Phone className="w-4 h-4 text-sky-400" />
                </div>
                <span className="text-sm font-medium">+977 9851410966</span>
              </li>
              <li className="flex items-center gap-4">
                <div className="p-2 bg-slate-900 rounded-lg border border-slate-800">
                  <Mail className="w-4 h-4 text-sky-400" />
                </div>
                <span className="text-sm font-medium">info@gowin.com</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-black uppercase tracking-widest text-xs mb-8">Company</h4>
            <ul className="space-y-4">
              {companyLinks.map((link, i) => (
                <li key={i}>
                  <a href={link.href} className="text-sm font-semibold hover:text-sky-400 transition-colors flex items-center gap-2 group">
                    <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    {link.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-black uppercase tracking-widest text-xs mb-8">Destinations</h4>
            <ul className="space-y-4">
              {destinations.map((link, i) => (
                <li key={i}>
                  <a href={link.href} className="text-sm font-semibold hover:text-sky-400 transition-colors flex items-center gap-2 group">
                    <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    {link.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-2 md:col-span-1">
            <h4 className="text-white font-black uppercase tracking-widest text-xs mb-8">Locate Us</h4>
            <div className="rounded-2xl overflow-hidden border border-slate-800 shadow-2xl h-36 grayscale hover:grayscale-0 transition-all duration-700">
              <iframe
                title="Office Location"
                className="w-full h-full border-none"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.222211266228!2d85.33676327452445!3d27.709755325740768!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb199f2782b155%3A0xf0c9c78d248b062d!2sBig%20Mart%20Shankhamul!5e0!3m2!1sen!2snp!4v1716551892004!5m2!1sen!2snp"
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </div>

        {/* Bottom Section: Socials & Copyright */}
        <div className="pt-12 border-t border-slate-800/50 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex gap-4">
            {socialLinks.map((social, i) => (
              <motion.a
                key={i}
                href={social.href}
                whileHover={{ y: -4, backgroundColor: social.color }}
                className="w-11 h-11 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-transparent transition-all shadow-sm"
              >
                <social.icon className="w-5 h-5" />
              </motion.a>
            ))}
          </div>

          <div className="text-center md:text-right">
            <p className="text-xs font-bold uppercase tracking-widest mb-1.5">
              © 2025 Go Win International. All rights reserved.
            </p>
            <p className="text-[10px] font-medium text-slate-500 flex items-center justify-center md:justify-end gap-1.5">
              Designed with <Heart className="w-3 h-3 text-sky-500 fill-sky-500 animate-pulse" /> by
              <a href="#" className="text-sky-400 hover:text-sky-300 font-bold transition-colors">Bibek Pandey</a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
