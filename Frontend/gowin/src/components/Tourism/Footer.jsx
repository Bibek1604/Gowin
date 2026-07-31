import React, { useState, useEffect, useRef } from 'react';
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
  const submittingRef = useRef(false);
  const { places, fetchPlaces } = usePlaceStore();

  useEffect(() => {
    fetchPlaces();
  }, [fetchPlaces]);

  const footerDestinations = places.slice(0, 5);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email || submittingRef.current) return;
    submittingRef.current = true;
    setIsSubscribing(true);
    setSubError('');
    try {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .insert([{ email }]);
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
    } finally {
      submittingRef.current = false;
      setIsSubscribing(false);
    }
  };

  return (
    <footer className="bg-[#0B1220] relative overflow-hidden">
      {/* Nepali prayer-flag accent strip */}
      <div className="h-1 w-full flex">
        <div className="flex-1 bg-[#3B82F6]" />
        <div className="flex-1 bg-white" />
        <div className="flex-1 bg-[#EF4444]" />
        <div className="flex-1 bg-[#10B981]" />
        <div className="flex-1 bg-[#F59E0B]" />
      </div>
      {/* Mountain background */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <img
          src="https://images.unsplash.com/photo-1516490701338-fd7e5a94d6d7?auto=format&fit=crop&w=1600&q=55"
          alt=""
          loading="lazy"
          className="w-full h-full object-cover object-bottom opacity-[0.14]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B1220] via-[#0B1220]/70 to-[#0B1220]/90" />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative pt-16 sm:pt-20 pb-8 sm:pb-10">

        {/* Main grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 mb-10 sm:mb-12">

          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-4 lg:pr-8">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl overflow-hidden shadow-sm border border-white/10">
                <img src={gowinLogo} alt="Gowin" className="w-full h-full object-cover" />
              </div>
              <span className="font-bold text-xl sm:text-2xl text-white leading-tight">GoWin International <span className="text-[#10B981]">Travels and Tourism</span></span>
            </div>
            <p className="text-white/60 mb-6 leading-relaxed text-sm max-w-xs">
              From the Himalayas to the world — curating unforgettable journeys with warm Nepali hospitality since 2020.
            </p>

            {/* Contact info */}
            <div className="space-y-2 mb-6">
              <div className="flex items-center gap-2 text-white/55 text-xs">
                <MapPin className="w-3.5 h-3.5 text-[#10B981] flex-shrink-0" />
                <span>Kathmandu, Nepal</span>
              </div>
              <a href="tel:+9779851410966" className="flex items-center gap-2 text-white/55 hover:text-white text-xs transition-colors">
                <Phone className="w-3.5 h-3.5 text-[#10B981] flex-shrink-0" />
                <span>+977 9851410966</span>
              </a>
              <a href="mailto:Info.gowintravels@gmail.com" className="flex items-center gap-2 text-white/55 hover:text-white text-xs transition-colors">
                <Mail className="w-3.5 h-3.5 text-[#10B981] flex-shrink-0" />
                <span>Info.gowintravels@gmail.com</span>
              </a>
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
          <div className="lg:col-span-2">
            <h4 className="text-xs font-bold text-white mb-5 uppercase tracking-[0.18em] flex items-center gap-2">
              <span className="w-5 h-0.5 bg-[#10B981] rounded-full" />Destinations
            </h4>
            <ul className="space-y-3">
              {footerDestinations.length > 0 ? (
                footerDestinations.map((dest) => (
                  <li key={dest.id}>
                    <Link
                      to={`/places/${dest.id}`}
                      className="text-white/60 hover:text-[#10B981] transition-all hover:translate-x-1 flex items-center gap-2 group text-sm"
                    >
                      <ChevronRight className="w-3.5 h-3.5 text-white/20 group-hover:text-[#10B981] transition-colors flex-shrink-0" />
                      <span className="truncate">{dest.title}</span>
                    </Link>
                  </li>
                ))
              ) : (
                ['Maldives', 'Swiss Alps', 'Safari', 'Santorini', 'Kyoto'].map((link, i) => (
                  <li key={i}>
                    <Link to="/destinations/all" className="text-white/60 hover:text-[#10B981] transition-all hover:translate-x-1 flex items-center gap-2 group text-sm">
                      <ChevronRight className="w-3.5 h-3.5 text-white/20 group-hover:text-[#10B981] transition-colors flex-shrink-0" />
                      {link}
                    </Link>
                  </li>
                ))
              )}
            </ul>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-bold text-white mb-5 uppercase tracking-[0.18em] flex items-center gap-2">
              <span className="w-5 h-0.5 bg-[#10B981] rounded-full" />Quick Links
            </h4>
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
                    className="text-white/60 hover:text-white transition-all hover:translate-x-1 flex items-center gap-2 group text-sm"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-white/20 group-hover:text-white transition-colors flex-shrink-0" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="sm:col-span-2 lg:col-span-4 lg:pl-8">
            <h4 className="text-xs font-bold text-white mb-4 uppercase tracking-[0.18em] flex items-center gap-2">
              <span className="w-5 h-0.5 bg-[#10B981] rounded-full" />Newsletter
            </h4>
            <p className="text-white/60 mb-4 text-sm leading-relaxed">
              Get special offers, free travel guides, and destination inspiration.
            </p>

            {subscribed ? (
              <div className="flex items-center gap-2 text-[#10B981] font-medium bg-[#10B981]/10 border border-[#10B981]/20 px-4 py-3 rounded-xl text-sm">
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
                    className="flex-1 bg-white/5 border border-white/10 text-white placeholder-white/30 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#10B981]/30 focus:border-[#10B981]/40 text-sm min-w-0 transition-all"
                  />
                  <button
                    type="submit"
                    disabled={isSubscribing}
                    className="bg-[#10B981] hover:bg-[#059669] text-white p-2.5 sm:p-3 rounded-xl transition-colors disabled:opacity-60 flex-shrink-0 flex items-center justify-center"
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
          <div className="text-center sm:text-left">
            <p className="text-white/40 text-xs sm:text-sm">© 2026 GoWin Travels · Made with ❤️ in Nepal 🇳🇵</p>
            <p className="text-white/30 text-[11px] mt-1">
              Developed by{' '}
              <a
                href="https://wa.me/9779860056658"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#10B981]/80 hover:text-[#10B981] font-semibold transition-colors"
              >
                Bibek Pandey
              </a>
              {' '}· WhatsApp +977 9860056658
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-xs">
            <Link to="/terms" className="text-white/40 hover:text-white/80 transition-colors">Terms & Conditions</Link>
            <Link to="/privacy" className="text-white/40 hover:text-white/80 transition-colors">Privacy Policy</Link>
            <Link to="/refund" className="text-white/40 hover:text-white/80 transition-colors">Refund Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
