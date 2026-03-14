import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Instagram, Twitter, Facebook, PlaneTakeoff, Navigation, Send, CheckCircle, ShieldCheck, Headphones, Globe } from 'lucide-react';
import { supabase } from '../../supabaseClient';
import toast, { Toaster } from 'react-hot-toast';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', destination: '', message: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const { error: supabaseError } = await supabase
      .from('contact_messages')
      .insert([{
        name: formData.name,
        email: formData.email,
        destination: formData.destination,
        message: formData.message,
      }]);

    setIsLoading(false);
    if (supabaseError) {
      toast.error('Transmission failed. Please try again.');
    } else {
      setSubmitted(true);
      toast.success('Message Received!');
      setFormData({ name: '', email: '', destination: '', message: '' });
      setTimeout(() => setSubmitted(false), 8000);
    }
  };

  const contactItems = [
    { icon: <MapPin className="w-6 h-6" />, label: "Headquarters", value: "Shankhamul-31, Kathmandu, Nepal", color: "text-[#0F4C5C] bg-[#0F4C5C]/5" },
    { icon: <Phone className="w-6 h-6" />, label: "Direct Support", value: "+977 9851410966", color: "text-[#FF7F50] bg-[#FF7F50]/5" },
    { icon: <Mail className="w-6 h-6" />, label: "Email Inquiry", value: "Info.gowintravels@gmail.com", color: "text-[#0F4C5C] bg-[#0F4C5C]/5" },
    { icon: <Clock className="w-6 h-6" />, label: "Availability", value: "24/7 Premium Support", color: "text-[#0F4C5C] bg-[#0F4C5C]/5" },
  ];

  return (
    <section id="contact" className="py-32 bg-[#F8FAFB] relative overflow-hidden font-sans">
      <Toaster position="top-right" />

      {/* Background travel icons */}
      <PlaneTakeoff className="absolute top-10 right-10 w-64 h-64 text-[#0F4C5C]/5 opacity-40 transform rotate-12" />
      <Navigation className="absolute bottom-10 left-10 w-72 h-72 text-[#FF7F50]/5 opacity-30 transform -rotate-45" />

      <div className="max-w-7xl mx-auto px-6 sm:px-12 relative z-10">
        <div className="text-center mb-24">

          <h2 className="text-5xl md:text-7xl font-black text-[#0F4C5C] mb-8 tracking-tighter">Connect With Us.</h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-xl leading-relaxed font-medium">
            Whether you're seeking a custom itinerary or just have a few questions, our travel experts are ready to assist.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-20">

          {/* Left Side: Contact Info */}
          <div className="lg:w-5/12 space-y-8">
            <div className="grid grid-cols-1 gap-6">
              {contactItems.map((item, idx) => (
                <div key={idx} className="bg-white p-8 rounded-[2.5rem] shadow-[0_10px_40px_rgb(0,0,0,0.02)] border border-gray-50 flex gap-6 items-center group cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-500">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6 ${item.color}`}>
                    {item.icon}
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-none mb-3">{item.label}</p>
                    <h4 className="font-black text-[#0F4C5C] text-xl tracking-tight leading-none break-words">{item.value}</h4>
                  </div>
                </div>
              ))}
            </div>




          </div>

          {/* Right Side: Contact Form */}
          <div className="lg:w-7/12">
            <div className="bg-white p-10 md:p-16 rounded-[3.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.03)] border border-gray-100 h-full">
              <div className="flex items-center gap-3 mb-10">
                <div className="w-12 h-12 bg-[#0F4C5C]/5 rounded-2xl flex items-center justify-center text-[#0F4C5C]">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-3xl font-extrabold text-[#0F4C5C] tracking-tight">Direct Inquiry</h3>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-[#0F4C5C] uppercase tracking-[0.2em] pl-1">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full bg-gray-50/50 border border-gray-100 rounded-[1.5rem] px-8 py-6 focus:outline-none focus:bg-white focus:ring-4 focus:ring-[#0F4C5C]/5 transition-all font-bold text-lg text-[#0F4C5C] placeholder:text-gray-300 placeholder:font-medium"
                      placeholder="Your Name"
                      required
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-[#0F4C5C] uppercase tracking-[0.2em] pl-1">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full bg-gray-50/50 border border-gray-100 rounded-[1.5rem] px-8 py-6 focus:outline-none focus:bg-white focus:ring-4 focus:ring-[#0F4C5C]/5 transition-all font-bold text-lg text-[#0F4C5C] placeholder:text-gray-300 placeholder:font-medium"
                      placeholder="Your@email.com"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-bold text-[#0F4C5C] uppercase tracking-[0.2em] pl-1">Preferred Destination</label>
                  <div className="relative">
                    <select
                      name="destination"
                      value={formData.destination}
                      onChange={handleChange}
                      className="w-full bg-gray-50/50 border border-gray-100 rounded-[1.5rem] px-8 py-6 focus:outline-none focus:bg-white focus:ring-4 focus:ring-[#0F4C5C]/5 transition-all font-bold text-lg text-[#0F4C5C] appearance-none cursor-pointer"
                    >
                      <option value="" disabled>Where are you headed?</option>
                      <option value="europe">Europe & Mediterranean</option>
                      <option value="asia">Asia & Pacific</option>
                      <option value="africa">Wild Africa</option>
                      <option value="americas">The Americas</option>
                    </select>
                    <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                      <Navigation className="w-5 h-5 -rotate-45" />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-bold text-[#0F4C5C] uppercase tracking-[0.2em] pl-1">Your Vision</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="6"
                    className="w-full bg-gray-50/50 border border-gray-100 rounded-[2rem] px-8 py-6 focus:outline-none focus:bg-white focus:ring-4 focus:ring-[#0F4C5C]/5 transition-all font-bold text-lg text-[#0F4C5C] placeholder:text-gray-300 resize-none"
                    placeholder="Tell us about your dream trip..."
                    required
                  ></textarea>
                </div>

                {submitted && (
                  <div className="flex items-center gap-4 text-[#0F4C5C] bg-[#0F4C5C]/5 px-8 py-5 rounded-[2rem] font-bold text-sm border border-[#0F4C5C]/10 animate-pulse">
                    <CheckCircle className="w-6 h-6 shrink-0" />
                    Transmission Received. Expect an expert response soon.
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="group w-full bg-[#0F4C5C] hover:bg-[#0a3845] text-white rounded-[1.5rem] py-5 font-bold text-lg transition-all shadow-2xl shadow-[#0F4C5C]/20 mt-6 flex justify-center items-center gap-3 disabled:opacity-60 active:scale-95"
                >
                  {isLoading ? (
                    <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      Send Transmission
                      <Send className="w-6 h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Contact;
