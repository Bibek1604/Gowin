import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Facebook, ChevronDown, MapPin, ArrowRight } from 'lucide-react';
import gowinLogo from '../../assets/gowin.jpg';
import usePlaceStore from '../Store/PlaceStore';

const Navbar = () => {
  const { places, fetchPlaces } = usePlaceStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Always fetch — the store's own isLoading guard dedupes concurrent
    // calls, but "only if empty" meant this never saw newly-added places
    // once the store had any data at all (see PlaceStore.fetchPlaces).
    fetchPlaces();
  }, [fetchPlaces]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { href: '/', text: 'Home' },
    { href: '/destinations/all', text: 'Destinations' },
    { href: '/booking', text: 'Book Now' },
    { href: '/about', text: 'About' },
    { href: '/contact', text: 'Contact' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
          isScrolled
            ? 'bg-white shadow-[0_2px_20px_rgba(0,0,0,0.06)] py-2'
            : 'bg-white py-3'
        }`}
      >
        {/* Nepali prayer-flag accent strip */}
        <div className="absolute top-0 left-0 right-0 h-0.5 flex">
          <div className="flex-1 bg-[#3B82F6]" />
          <div className="flex-1 bg-gray-200" />
          <div className="flex-1 bg-[#EF4444]" />
          <div className="flex-1 bg-[#10B981]" />
          <div className="flex-1 bg-[#F59E0B]" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group flex-shrink-0">
            <div className="w-10 h-10 rounded-xl overflow-hidden shadow-sm border border-gray-100 group-hover:shadow-md transition-shadow">
              <img src={gowinLogo} alt="GoWin" className="w-full h-full object-cover" />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-black text-[#1E3A8A] tracking-tight font-sans">
                GoWin
              </span>
              <span className="text-xl font-light text-[#1E3A8A]/60 tracking-tight font-sans hidden sm:inline">
                Travels
              </span>
            </div>
          </Link>

          {/* Center Nav Links */}
          <div className="hidden lg:flex items-center gap-1 bg-gray-50/80 px-2 py-1.5 rounded-xl">
            {navLinks.map((link) =>
              link.href === '/destinations/all' ? (
                /* Destinations with hover dropdown */
                <div key={link.href} className="relative group">
                  <Link
                    to={link.href}
                    className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-sans font-semibold transition-all duration-200 ${
                      isActive(link.href)
                        ? 'bg-[#10B981] text-white shadow-[0_4px_12px_rgba(16,185,129,0.3)]'
                        : 'text-gray-500 hover:text-[#1E3A8A] hover:bg-white'
                    }`}
                  >
                    {link.text}
                    <ChevronDown className="w-3.5 h-3.5 transition-transform group-hover:rotate-180" />
                  </Link>
                  <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="w-64 bg-white rounded-2xl shadow-[0_16px_50px_rgba(0,0,0,0.14)] border border-gray-100 overflow-hidden">
                      <div className="max-h-72 overflow-y-auto py-2">
                        {places.slice(0, 7).map((p) => (
                          <Link
                            key={p.id}
                            to={`/places/${p.id}`}
                            className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors"
                          >
                            <div className="w-7 h-7 bg-[#10B981]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                              <MapPin className="w-3.5 h-3.5 text-[#10B981]" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-[#0F172A] truncate">{p.title}</p>
                              <p className="text-[11px] text-gray-400 truncate">{p.location}</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                      <Link
                        to="/destinations/all"
                        className="flex items-center justify-center gap-1.5 px-4 py-3 bg-gray-50 border-t border-gray-100 text-xs font-bold text-[#059669] hover:bg-[#10B981]/10 transition-colors"
                      >
                        View all destinations <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`px-4 py-2 rounded-lg text-sm font-sans font-semibold transition-all duration-200 ${
                    isActive(link.href)
                      ? 'bg-[#10B981] text-white shadow-[0_4px_12px_rgba(16,185,129,0.3)]'
                      : 'text-gray-500 hover:text-[#1E3A8A] hover:bg-white'
                  }`}
                >
                  {link.text}
                </Link>
              )
            )}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Social Link - Desktop */}
            <a
              href="https://www.facebook.com/share/15cfo9obmC3/?mibextid=wwXIfr"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:flex items-center justify-center w-10 h-10 rounded-xl bg-gray-50 text-gray-400 hover:text-[#1877F2] hover:bg-blue-50 transition-all"
            >
              <Facebook className="w-4 h-4" />
            </a>

            {/* Mobile Menu Button */}
            <button
              aria-label="Toggle menu"
              className="lg:hidden flex items-center justify-center w-10 h-10 rounded-xl bg-gray-50 text-[#1E3A8A] hover:bg-gray-100 transition-all"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <div className={`fixed inset-0 z-[110] lg:hidden transition-all duration-400 ${isMobileMenuOpen ? 'visible' : 'invisible pointer-events-none'}`}>
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-400 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setIsMobileMenuOpen(false)}
        />

        {/* Drawer Panel */}
        <div className={`absolute top-0 right-0 w-[300px] h-full bg-white shadow-2xl transition-transform duration-400 flex flex-col ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>

          {/* Drawer Header */}
          <div className="flex items-center justify-between p-5 border-b border-gray-50">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg overflow-hidden shadow-sm">
                <img src={gowinLogo} alt="GoWin" className="w-full h-full object-cover" />
              </div>
              <span className="text-lg font-black text-[#1E3A8A] font-sans">GoWin<span className="text-[#10B981]">.</span></span>
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-9 h-9 flex items-center justify-center rounded-lg bg-gray-50 text-gray-400 hover:bg-gray-100 transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Nav Links */}
          <nav className="flex-1 py-4 px-3 overflow-y-auto">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center px-4 py-3.5 rounded-xl text-[15px] font-sans font-semibold transition-all mb-1 ${
                  isActive(link.href)
                    ? 'bg-[#10B981]/10 text-[#10B981]'
                    : 'text-[#0F172A] hover:bg-gray-50'
                }`}
              >
                {link.text}
              </Link>
            ))}
          </nav>

          {/* Drawer Footer */}
          <div className="p-5 border-t border-gray-50 space-y-3">
            <div className="flex justify-center pt-2">
              <a
                href="https://www.facebook.com/share/15cfo9obmC3/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 text-gray-400 hover:text-[#1877F2] hover:bg-blue-50 transition-all"
              >
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
