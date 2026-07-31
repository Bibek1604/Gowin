import React, { useState, useRef } from 'react';
import { MapPin, Phone, Mail, Clock, Facebook, Send, CheckCircle, ShieldCheck } from 'lucide-react';
import { supabase } from '../../supabaseClient';
import toast, { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';

const contactInfo = [
  {
    icon: MapPin,
    label: 'Our Office',
    value: 'Shankhamul-31, Kathmandu, Nepal',
    color: 'bg-[#1E3A8A]/8 text-[#1E3A8A]',
  },
  {
    icon: Phone,
    label: 'Call Us',
    value: '+977 9851410966',
    href: 'tel:+9779851410966',
    color: 'bg-[#10B981]/8 text-[#10B981]',
  },
  {
    icon: Mail,
    label: 'Email Us',
    value: 'Info.gowintravels@gmail.com',
    href: 'mailto:Info.gowintravels@gmail.com',
    color: 'bg-[#1E3A8A]/8 text-[#1E3A8A]',
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
  const submittingRef = useRef(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submittingRef.current) return;
    submittingRef.current = true;
    setIsLoading(true);
    try {
      const { error } = await supabase.from('contact_messages').insert([{
        name: formData.name,
        email: formData.email,
        destination: formData.destination,
        message: formData.message,
      }]);
      if (error) {
        toast.error('Something went wrong. Please try again.');
      } else {
        setSubmitted(true);
        toast.success('Message sent! We\'ll be in touch shortly.');
        setFormData({ name: '', email: '', destination: '', message: '' });
        setTimeout(() => setSubmitted(false), 8000);
      }
    } finally {
      submittingRef.current = false;
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#F8FAFC] font-sans pt-16">
      <Toaster position="top-right" />

      {/* Hero */}
      <section className="relative h-48 sm:h-64 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1605640840605-14ac1855827b?auto=format&fit=crop&w=1600&q=80"
          alt="Contact GoWin Travels"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#0B1220]/92 via-[#1E3A8A]/80 to-transparent" />
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
                <h2 className="heading-font text-2xl sm:text-3xl text-[#1E3A8A] mb-3">We're Here to Help</h2>
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
                        <p className="text-sm font-bold text-[#1E3A8A] truncate">{item.value}</p>
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
                  className="flex items-center gap-3 text-sm font-semibold text-[#1877F2] hover:text-[#1E3A8A] transition-colors"
                >
                  <Facebook className="w-5 h-5" />
                  GoWin Travels on Facebook
                </a>
              </div>

              {/* Live map — real embed, not a static photo */}
              <div className="relative rounded-xl overflow-hidden h-40 sm:h-48 border border-gray-100 shadow-sm">
                <iframe
                  title="GoWin Travels office — Shankhamul, Kathmandu"
                  src="https://maps.google.com/maps?q=Shankhamul%2C%20Kathmandu%2C%20Nepal&t=&z=14&ie=UTF8&iwloc=&output=embed"
                  className="w-full h-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>

            {/* Right: Contact Form */}
            <div className="lg:w-7/12">
              <div className="bg-white p-6 sm:p-8 md:p-10 rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 h-full">
                <div className="flex items-center gap-3 mb-7">
                  <div className="w-10 h-10 bg-[#1E3A8A]/8 rounded-xl flex items-center justify-center text-[#1E3A8A]">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#1E3A8A]">Send Us a Message</h3>
                    <p className="text-xs text-gray-400">We reply within 24 hours</p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="text-xs font-semibold text-[#1E3A8A] block mb-1.5">Full Name *</label>
                      <input
                        type="text" name="name" value={formData.name} onChange={handleChange} required
                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981]/20 focus:border-[#10B981]/50 focus:bg-white transition-all"
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-[#1E3A8A] block mb-1.5">Email Address *</label>
                      <input
                        type="email" name="email" value={formData.email} onChange={handleChange} required
                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981]/20 focus:border-[#10B981]/50 focus:bg-white transition-all"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#1E3A8A] block mb-1.5">Interested In</label>
                    <select
                      name="destination" value={formData.destination} onChange={handleChange}
                      className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981]/20 focus:bg-white transition-all appearance-none cursor-pointer"
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
                    <label className="text-xs font-semibold text-[#1E3A8A] block mb-1.5">Your Message *</label>
                    <textarea
                      name="message" value={formData.message} onChange={handleChange} rows="5" required
                      className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981]/20 focus:border-[#10B981]/50 focus:bg-white transition-all resize-none"
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
                    className="w-full flex items-center justify-center gap-2.5 bg-[#1E3A8A] hover:bg-[#172554] text-white py-3.5 rounded-xl font-semibold text-sm transition-all shadow-lg shadow-[#1E3A8A]/20 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98]"
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
