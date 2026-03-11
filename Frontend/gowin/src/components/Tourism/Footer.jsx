import React, { useState } from 'react';
import { Mail, Instagram, Facebook, Twitter, ChevronRight, CheckCircle } from 'lucide-react';
import { supabase } from '../../supabaseClient';
import gowinLogo from '../../assets/gowin.jpg';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [subError, setSubError] = useState('');

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    setIsSubscribing(true);
    setSubError('');

    const { error } = await supabase
      .from('newsletter_subscribers')
      .insert([{ email }]);

    setIsSubscribing(false);
    if (error) {
      if (error.code === '23505') {
        setSubError('You are already subscribed!');
      } else {
        setSubError('Something went wrong. Try again.');
      }
    } else {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-white pt-20 pb-10 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          <div>
             <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl overflow-hidden shadow-sm">
                 <img src={gowinLogo} alt="Gowin" className="w-full h-full object-cover" />
              </div>
              <span className="font-bold text-2xl text-[#0F4C5C]">Gowin</span>
            </div>
            <p className="text-gray-500 mb-6 leading-relaxed">
              Premium travel agency dedicated to curating the most exciting and unforgettable experiences around the globe.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-500 hover:bg-[#0F4C5C] hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-500 hover:bg-[#0F4C5C] hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-500 hover:bg-[#0F4C5C] hover:text-white transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-[#0F4C5C] text-xl mb-6">Destinations</h4>
            <ul className="space-y-4">
              {['Maldives, Beach', 'Swiss Alps, Mountains', 'Kyoto, City', 'Safari, Africa', 'Santorini, Greece'].map((link, i) => (
                <li key={i}>
                  <a href="#" className="text-gray-500 hover:text-[#FF7F50] transition-colors flex items-center gap-2 group">
                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#FF7F50] transition-colors" />
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-[#0F4C5C] text-xl mb-6">Quick Links</h4>
            <ul className="space-y-4">
              {['About Us', 'Travel Guides', 'Booking Terms', 'Privacy Policy', 'Contact Support'].map((link, i) => (
                <li key={i}>
                  <a href="#" className="text-gray-500 hover:text-[#0F4C5C] transition-colors flex items-center gap-2 group">
                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#0F4C5C] transition-colors" />
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-[#0F4C5C] text-xl mb-6">Newsletter</h4>
            <p className="text-gray-500 mb-4 text-sm">Subscribe to get special offers, free travel guides, and insights.</p>
            
            {subscribed ? (
              <div className="flex items-center gap-2 text-[#2A9D8F] font-medium bg-[#2A9D8F]/10 px-4 py-3 rounded-xl">
                <CheckCircle className="w-5 h-5" />
                You're subscribed!
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  required
                  className="bg-gray-50 border border-gray-100 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F4C5C]"
                />
                {subError && <p className="text-red-500 text-xs">{subError}</p>}
                <button
                  type="submit"
                  disabled={isSubscribing}
                  className="bg-[#0F4C5C] hover:bg-[#0c3e4b] text-white py-3 rounded-xl font-medium transition-colors disabled:opacity-60"
                >
                  {isSubscribing ? 'Subscribing...' : 'Subscribe'}
                </button>
              </form>
            )}
          </div>

        </div>

        <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">© 2026 Gowin. All rights reserved.</p>
          <div className="flex gap-6 text-sm">
            <a href="#" className="text-gray-400 hover:text-[#0F4C5C]">Terms & Conditions</a>
            <a href="#" className="text-gray-400 hover:text-[#0F4C5C]">Privacy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
