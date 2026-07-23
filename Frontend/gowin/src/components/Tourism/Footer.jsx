import React, { useState, useEffect } from 'react';
import { Mail, Facebook, ChevronRight, CheckCircle, MapPin, Phone, Send } from 'lucide-react';
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
    if (places.length === 0) fetchPlaces();
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
    <footer className="bg-[#0a1f2b] pt-16 sm:pt-20 pb-8 sm:pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Main grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-12 mb-12 sm:mb-16">

          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl overflow-hidden shadow-sm border border-white/10">
                <img src={gowinLogo} alt="Gowin" className="w-full h-full object-cover" />
              </div>
              <span className="font-bold text-xl sm:text-2xl text-white">GoWin <span className="text-[#FF7F50]">Travels</span></span>
            </div>
            <p className="text-white/50 mb-6 leading-relaxed text-sm max-w-xs">
              Elite concierge dedicated to curating the world's most breathtaking travel experiences since 2024.
            </p>

            {/* Contact info */}
            <div className="space-y-2 mb-6">
              <div className="flex items-center gap-2 text-white/40 text-xs">
                <Phone className="w-3.5 h-3.5 text-[#FF7F50] flex-shrink-0" />
                <span>+977-XXXX-XXXXX</span>
              </div>
              <div className="flex items-center gap-2 text-white/40 text-xs">
                <Mail className="w-3.5 h-3.5 text-[#FF7F50] flex-shrink-0" />
                <span>info@gowintravels.com</span>
              </div>
            </div>

            <div className="flex gap-3">
              <a
                href="https://www.facebook.com/share/15cfo9obmC3/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-white/40 hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2] transition-all"
              >
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Destinations */}
          <div>
            <h4 className="font-bold text-white text-sm sm:text-base mb-5 uppercase tracking-widest">Destinations</h4>
            <ul className="space-y-3">
              {footerDestinations.length > 0 ? (
                footerDestinations.map((dest) => (
                  <li key={dest.id}>
                    <Link
                      to={`/places/${dest.id}`}
                      className="text-white/45 hover:text-[#FF7F50] transition-colors flex items-center gap-2 group text-sm"
                    >
                      <ChevronRight className="w-3.5 h-3.5 text-white/20 group-hover:text-[#FF7F50] transition-colors flex-shrink-0" />
                      <span className="truncate">{dest.title}</span>
                    </Link>
                  </li>
                ))
              ) : (
                ['Maldives', 'Swiss Alps', 'Safari', 'Santorini', 'Kyoto'].map((link, i) => (
                  <li key={i}>
                    <Link to="/details/all" className="text-white/45 hover:text-[#FF7F50] transition-colors flex items-center gap-2 group text-sm">
                      <ChevronRight className="w-3.5 h-3.5 text-white/20 group-hover:text-[#FF7F50] transition-colors flex-shrink-0" />
                      {link}
                    </Link>
                  </li>
                ))
              )}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-white text-sm sm:text-base mb-5 uppercase tracking-widest">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { name: 'About Us', link: '/about' },
                { name: 'Travel Guides', link: '/guides' },
                { name: 'Refund Policy', link: '/refund' },
                { name: 'Privacy Policy', link: '/privacy' },
                { name: 'Contact Support', link: '/support' },
              ].map((item, i) => (
                <li key={i}>
                  <Link
                    to={item.link}
                    className="text-white/45 hover:text-white transition-colors flex items-center gap-2 group text-sm"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-white/20 group-hover:text-white transition-colors flex-shrink-0" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-bold text-white text-sm sm:text-base mb-3 sm:mb-4 uppercase tracking-widest">Newsletter</h4>
            <p className="text-white/45 mb-4 text-sm leading-relaxed">
              Get special offers, free travel guides, and destination inspiration.
            </p>

            {subscribed ? (
              <div className="flex items-center gap-2 text-[#FF7F50] font-medium bg-[#FF7F50]/10 border border-[#FF7F50]/20 px-4 py-3 rounded-xl text-sm">
                <CheckCircle className="w-4 h-4 flex-shrink-0" />
                You're subscribed!
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2.5">
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email address"
                    required
                    className="flex-1 bg-white/5 border border-white/10 text-white placeholder-white/30 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF7F50]/30 focus:border-[#FF7F50]/40 text-sm min-w-0 transition-all"
                  />
                  <button
                    type="submit"
                    disabled={isSubscribing}
                    className="bg-[#FF7F50] hover:bg-[#e56a42] text-white p-2.5 sm:p-3 rounded-xl transition-colors disabled:opacity-60 flex-shrink-0 flex items-center justify-center"
                    title="Subscribe"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
                {subError && <p className="text-red-400 text-xs">{subError}</p>}
              </form>
            )}

            {/* Trust badges */}
            <div className="mt-5 flex flex-wrap gap-2">
              {['Secure', 'No Spam', 'Unsubscribe anytime'].map((t, i) => (
                <span key={i} className="text-[10px] text-white/25 border border-white/10 px-2 py-1 rounded-lg">
                  {t}
                </span>
              ))}
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/8 pt-7 sm:pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-white/30 text-xs sm:text-sm">© 2026 GoWin Travels. All rights reserved.</p>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-xs">
            <Link to="/terms" className="text-white/30 hover:text-white/60 transition-colors">Terms & Conditions</Link>
            <Link to="/privacy" className="text-white/30 hover:text-white/60 transition-colors">Privacy Policy</Link>
            <Link to="/refund" className="text-white/30 hover:text-white/60 transition-colors">Refund Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
