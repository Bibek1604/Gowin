import React, { useState, useEffect } from 'react';
import { Mail, Instagram, Facebook, Twitter, ChevronRight, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import gowinLogo from '../../assets/gowin.jpg';
import usePlaceStore from '../Store/PlaceStore';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [subError, setSubError] = useState('');
  const { places, fetchPlaces } = usePlaceStore();

  useEffect(() => {
    if (places.length === 0) {
      fetchPlaces();
    }
  }, [fetchPlaces, places.length]);

  const footerDestinations = places.slice(0, 5);

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
            <p className="text-gray-500 mb-6 leading-relaxed text-sm">
              Elite concierge dedicated to curating the world's most breathtaking travel experiences.
            </p>
            <div className="flex gap-4">
              <a href="https://www.facebook.com/share/15cfo9obmC3/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-500 hover:bg-[#0F4C5C] hover:text-white transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-[#0F4C5C] text-xl mb-6">Destinations</h4>
            <ul className="space-y-4">
              {footerDestinations.length > 0 ? (
                footerDestinations.map((dest) => (
                  <li key={dest.id}>
                    <Link to={`/places/${dest.id}`} className="text-gray-500 hover:text-[#FF7F50] transition-colors flex items-center gap-2 group">
                      <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#FF7F50] transition-colors" />
                      {dest.title}
                    </Link>
                  </li>
                ))
              ) : (
                ['Maldives', 'Swiss Alps', 'Safari', 'Santorini', 'Kyoto'].map((link, i) => (
                  <li key={i}>
                    <Link to="/details/all" className="text-gray-500 hover:text-[#FF7F50] transition-colors flex items-center gap-2 group">
                      <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#FF7F50] transition-colors" />
                      {link}
                    </Link>
                  </li>
                ))
              )}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-[#0F4C5C] text-xl mb-6">Quick Links</h4>
            <ul className="space-y-4">
              {[
                { name: 'About Us', link: '/about' },
                { name: 'Travel Guides', link: '/guides' },
                { name: 'Refund Policy', link: '/refund' },
                { name: 'Privacy Policy', link: '/privacy' },
                { name: 'Contact Support', link: '/support' }
              ].map((item, i) => (
                <li key={i}>
                  <Link to={item.link} className="text-gray-500 hover:text-[#0F4C5C] transition-colors flex items-center gap-2 group">
                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#0F4C5C] transition-colors" />
                    {item.name}
                  </Link>
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
            <Link to="/terms" className="text-gray-400 hover:text-[#0F4C5C]">Terms & Conditions</Link>
            <Link to="/privacy" className="text-gray-400 hover:text-[#0F4C5C]">Privacy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
