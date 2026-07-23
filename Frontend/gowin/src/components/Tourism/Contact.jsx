import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Facebook, Send, CheckCircle, ShieldCheck } from 'lucide-react';
import { supabase } from '../../supabaseClient';
import toast, { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';

const contactInfo = [
  {
    icon: MapPin,
    label: 'Our Office',
    value: 'Shankhamul-31, Kathmandu, Nepal',
    color: 'bg-[#0F4C5C]/8 text-[#0F4C5C]',
  },
  {
    icon: Phone,
    label: 'Call Us',
    value: '+977 9851410966',
    href: 'tel:+9779851410966',
    color: 'bg-[#FF7F50]/8 text-[#FF7F50]',
  },
  {
    icon: Mail,
    label: 'Email Us',
    value: 'Info.gowintravels@gmail.com',
    href: 'mailto:Info.gowintravels@gmail.com',
    color: 'bg-[#0F4C5C]/8 text-[#0F4C5C]',
  },
  {
    icon: Clock,
    label: 'Office Hours',
    value: 'Sun–Fri, 9am–6pm NPT',
    color: 'bg-emerald-50 text-emerald-600',
  },
];

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', destination: '', message: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const { error } = await supabase.from('contact_messages').insert([{
      name: formData.name,
      email: formData.email,
      destination: formData.destination,
      message: formData.message,
    }]);
    setIsLoading(false);
    if (error) {
      toast.error('Something went wrong. Please try again.');
    } else {
      setSubmitted(true);
      toast.success('Message sent! We\'ll be in touch shortly.');
      setFormData({ name: '', email: '', destination: '', message: '' });
      setTimeout(() => setSubmitted(false), 8000);
    }
  };

  return (
    <div className="bg-[#F8FAFB] font-sans pt-16">
      <Toaster position="top-right" />

      {/* Hero */}
      <section className="relative h-48 sm:h-64 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1605640840605-14ac1855827b?auto=format&fit=crop&w=1600&q=80"
          alt="Contact GoWin Travels"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a1f2b]/92 via-[#0F4C5C]/80 to-transparent" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <h1 className="heading-font text-2xl sm:text-3xl md:text-4xl text-white mb-2">Contact Us</h1>
          <p className="text-white/65 text-sm sm:text-base max-w-md">We'd love to hear from you — let's plan your next adventure together.</p>
        </div>
      </section>

      <section className="py-12 sm:py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">

            {/* Left: Contact Info */}
            <div className="lg:w-5/12 space-y-4">
              <div>
                <span className="section-label mb-3 block">Get In Touch</span>
                <h2 className="heading-font text-2xl sm:text-3xl text-[#0F4C5C] mb-3">We're Here to Help</h2>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Whether you're planning a Himalayan trek or a beach holiday in the Maldives, our team is ready to craft the perfect itinerary for you.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
                {contactInfo.map((item, idx) => {
                  const Icon = item.icon;
                  const content = (
                    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${item.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">{item.label}</p>
                        <p className="text-sm font-bold text-[#0F4C5C] truncate">{item.value}</p>
                      </div>
                    </div>
                  );
                  return item.href ? (
                    <a key={idx} href={item.href}>{content}</a>
                  ) : (
                    <div key={idx}>{content}</div>
                  );
                })}
              </div>

              {/* Social */}
              <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Follow Us</p>
                <a
                  href="https://www.facebook.com/share/15cfo9obmC3/?mibextid=wwXIfr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm font-semibold text-[#1877F2] hover:text-[#0F4C5C] transition-colors"
                >
                  <Facebook className="w-5 h-5" />
                  GoWin Travels on Facebook
                </a>
              </div>

              {/* Nepal map placeholder */}
              <div className="relative rounded-xl overflow-hidden h-40 sm:h-48 border border-gray-100 shadow-sm">
                <img
                  src="https://images.unsplash.com/photo-1614082242765-7c98ca0f3df3?auto=format&fit=crop&w=600&q=80"
                  alt="Kathmandu Nepal"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-[#0F4C5C]/50 flex items-center justify-center">
                  <div className="text-center text-white">
                    <MapPin className="w-8 h-8 mx-auto mb-1 text-[#FF7F50]" />
                    <p className="text-sm font-bold">Shankhamul, Kathmandu</p>
                    <p className="text-xs text-white/60">Nepal</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Contact Form */}
            <div className="lg:w-7/12">
              <div className="bg-white p-6 sm:p-8 md:p-10 rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 h-full">
                <div className="flex items-center gap-3 mb-7">
                  <div className="w-10 h-10 bg-[#0F4C5C]/8 rounded-xl flex items-center justify-center text-[#0F4C5C]">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#0F4C5C]">Send Us a Message</h3>
                    <p className="text-xs text-gray-400">We reply within 24 hours</p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="text-xs font-semibold text-[#0F4C5C] block mb-1.5">Full Name *</label>
                      <input
                        type="text" name="name" value={formData.name} onChange={handleChange} required
                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF7F50]/20 focus:border-[#FF7F50]/50 focus:bg-white transition-all"
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-[#0F4C5C] block mb-1.5">Email Address *</label>
                      <input
                        type="email" name="email" value={formData.email} onChange={handleChange} required
                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF7F50]/20 focus:border-[#FF7F50]/50 focus:bg-white transition-all"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#0F4C5C] block mb-1.5">Interested In</label>
                    <select
                      name="destination" value={formData.destination} onChange={handleChange}
                      className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF7F50]/20 focus:bg-white transition-all appearance-none cursor-pointer"
                    >
                      <option value="">Select a destination region</option>
                      <option value="nepal-trekking">Nepal — Trekking & Adventure</option>
                      <option value="nepal-cultural">Nepal — Cultural & Pilgrimage</option>
                      <option value="nepal-wildlife">Nepal — Wildlife Safari</option>
                      <option value="europe">Europe & Mediterranean</option>
                      <option value="asia-pacific">Asia & Pacific</option>
                      <option value="maldives">Maldives & Beach Escapes</option>
                      <option value="africa">African Safaris</option>
                      <option value="other">Something Else</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#0F4C5C] block mb-1.5">Your Message *</label>
                    <textarea
                      name="message" value={formData.message} onChange={handleChange} rows="5" required
                      className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF7F50]/20 focus:border-[#FF7F50]/50 focus:bg-white transition-all resize-none"
                      placeholder="Tell us about your dream trip, travel dates, group size, budget..."
                    />
                  </div>

                  {submitted && (
                    <div className="flex items-center gap-3 text-emerald-600 bg-emerald-50 px-4 py-3 rounded-xl border border-emerald-200 text-sm font-semibold">
                      <CheckCircle className="w-5 h-5 flex-shrink-0" />
                      Message received! Our team will respond within 24 hours.
                    </div>
                  )}

                  <button
                    type="submit" disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2.5 bg-[#0F4C5C] hover:bg-[#0a3845] text-white py-3.5 rounded-xl font-semibold text-sm transition-all shadow-lg shadow-[#0F4C5C]/20 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98]"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <><Send className="w-4 h-4" /> Send Message</>
                    )}
                  </button>

                  <p className="text-center text-[11px] text-gray-400">
                    🔒 Your information is secure and will never be shared.
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
