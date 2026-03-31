import React, { useState, useEffect } from 'react';
import { useAdminStore } from '../Store/AdminStore';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShieldCheck, Facebook, ChevronDown, LogOut } from 'lucide-react';
import gowinLogo from '../../assets/gowin.jpg';

const Navbar = () => {
  const { isAdmin, logout } = useAdminStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

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
    { href: '/details/all', text: 'Destinations' },
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group flex-shrink-0">
            <div className="w-10 h-10 rounded-xl overflow-hidden shadow-sm border border-gray-100 group-hover:shadow-md transition-shadow">
              <img src={gowinLogo} alt="GoWin" className="w-full h-full object-cover" />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-black text-[#0F4C5C] tracking-tight font-sans">
                GoWin
              </span>
              <span className="text-xl font-light text-[#0F4C5C]/60 tracking-tight font-sans hidden sm:inline">
                Travels
              </span>
            </div>
          </Link>

          {/* Center Nav Links */}
          <div className="hidden lg:flex items-center gap-1 bg-gray-50/80 px-2 py-1.5 rounded-xl">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-sans font-semibold transition-all duration-200 ${
                  isActive(link.href)
                    ? 'bg-[#FF7F50] text-white shadow-[0_4px_12px_rgba(255,127,80,0.3)]'
                    : 'text-gray-500 hover:text-[#0F4C5C] hover:bg-white'
                }`}
              >
                {link.text}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Admin Button - Desktop */}
            {isAdmin && (
              <Link
                to="/admin/dashboard"
                className="hidden lg:flex items-center gap-2 bg-[#0F4C5C] text-white px-5 py-2.5 rounded-xl text-sm font-sans font-bold hover:bg-[#0a3845] transition-all shadow-sm"
              >
                <ShieldCheck className="w-4 h-4" />
                Admin
              </Link>
            )}

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
              className="lg:hidden flex items-center justify-center w-10 h-10 rounded-xl bg-gray-50 text-[#0F4C5C] hover:bg-gray-100 transition-all"
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
              <span className="text-lg font-black text-[#0F4C5C] font-sans">GoWin<span className="text-[#FF7F50]">.</span></span>
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
                    ? 'bg-[#FF7F50]/10 text-[#FF7F50]'
                    : 'text-[#1a1a2e] hover:bg-gray-50'
                }`}
              >
                {link.text}
              </Link>
            ))}
          </nav>

          {/* Drawer Footer */}
          <div className="p-5 border-t border-gray-50 space-y-3">
            {isAdmin && (
              <>
                <Link
                  to="/admin/dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full bg-[#0F4C5C] text-white py-3.5 rounded-xl font-sans font-bold text-sm shadow-sm"
                >
                  <ShieldCheck className="w-4 h-4" /> Admin Dashboard
                </Link>
                <button
                  onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                  className="flex items-center justify-center gap-2 w-full py-3.5 text-red-500 font-sans font-bold text-sm border border-red-100 hover:bg-red-50 rounded-xl transition-all"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </>
            )}
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
