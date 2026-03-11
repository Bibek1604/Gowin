import React, { useState, useEffect } from 'react';
import { useAdminStore } from '../Store/AdminStore';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User, LogOut, ShieldCheck, Globe, Instagram, Facebook } from 'lucide-react';
import gowinLogo from '../../assets/gowin.jpg';

const Navbar = () => {
  const { isAdmin, logout } = useAdminStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/', text: 'Home' },
    { href: '/details/all', text: 'Destinations' },
    { href: '/booking', text: 'Reservations' },
    { href: '/contact', text: 'Contact' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-700 ${
        isScrolled 
          ? 'bg-white/90 backdrop-blur-[40px] py-5 shadow-[0_20px_80px_rgba(0,0,0,0.08)] border-b border-gray-100' 
          : 'bg-transparent py-10'
      }`}
    >
      {/* Decorative Brand Stripe - Sophisticated accent */}
      {isScrolled && (
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#2A9D8F] via-[#FF7F50] to-[#2A9D8F] opacity-80" />
      )}

      <div className="max-w-7xl mx-auto px-6 sm:px-12 flex items-center justify-between">
        
        {/* Left: Brand Identity */}
        <Link to="/" className="flex items-center gap-6 group">
          <div className={`relative transition-all duration-700 ${isScrolled ? 'w-12 h-12 shadow-lg' : 'w-20 h-20'}`}>
            <div className={`absolute inset-0 bg-[#2A9D8F]/20 blur-2xl rounded-full transition-opacity duration-700 ${isScrolled ? 'opacity-0' : 'opacity-100'}`} />
            <div className="relative w-full h-full rounded-[1.5rem] overflow-hidden shadow-2xl border-2 border-white/30 transform group-hover:rotate-6 transition-transform">
              <img src={gowinLogo} alt="Gowin" className="w-full h-full object-cover" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className={`text-4xl font-black tracking-tighter leading-none transition-all duration-500 ${isScrolled ? 'text-[#0F4C5C]' : 'text-white drop-shadow-[0_10px_20px_rgba(0,0,0,0.4)]'}`}>
              Gowin<span className="text-[#2A9D8F]">.</span>
            </span>
            <span className={`text-[11px] font-black uppercase tracking-[0.5em] transition-all duration-500 overflow-hidden ${isScrolled ? 'h-0 opacity-0' : 'h-auto opacity-80 text-[#2A9D8F] mt-2'}`}>
              Elite Concierge
            </span>
          </div>
        </Link>

        {/* Center: Essential Navigation */}
        <div className="hidden lg:flex items-center gap-14">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`text-[14px] font-black uppercase tracking-[0.25em] transition-all duration-500 relative group py-2
                ${isScrolled 
                  ? (isActive(link.href) ? 'text-[#0F4C5C]' : 'text-gray-400 hover:text-[#2A9D8F]') 
                  : (isActive(link.href) ? 'text-[#2A9D8F]' : 'text-white hover:text-white/80')
                }`}
            >
              <span className="relative z-10 group-hover:tracking-[0.35em] transition-all duration-500">{link.text}</span>
              <span className={`absolute -bottom-1 left-0 h-[2px] bg-[#2A9D8F] transition-all duration-500 shadow-[0_0_15px_#2A9D8F] ${isActive(link.href) ? 'w-full' : 'w-0 group-hover:w-full'}`} />
            </Link>
          ))}
        </div>

        {/* Right: Premium Actions */}
        <div className="flex items-center gap-6">
          <div className="hidden lg:flex items-center gap-3">
            {isAdmin && (
               <Link 
                 to="/admin/dashboard" 
                 className={`flex items-center gap-3 px-8 py-3.5 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all duration-500
                   ${isScrolled 
                     ? 'bg-[#0F4C5C] text-white shadow-xl shadow-[#0F4C5C]/20 hover:-translate-y-1' 
                     : 'bg-white/10 backdrop-blur-xl text-white border border-white/20 hover:bg-white/20 shadow-2xl'
                   }`}
               >
                 <ShieldCheck className="w-4.5 h-4.5 text-[#2A9D8F]" /> Dashboard
               </Link>
            )}
          </div>

          {/* Mobile Menu Trigger */}
          <button 
            className={`lg:hidden p-4 rounded-2xl transition-all ${isScrolled ? 'bg-gray-100 text-[#0F4C5C]' : 'bg-white/20 text-white border border-white/20'}`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div className={`fixed inset-0 z-[110] lg:hidden transition-all duration-500 ${isMobileMenuOpen ? 'visible' : 'invisible'}`}>
         {/* Backdrop */}
         <div 
           className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-500 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0'}`} 
           onClick={() => setIsMobileMenuOpen(false)}
         />
         
         <div className={`absolute top-0 right-0 w-80 h-full bg-white shadow-2xl transition-transform duration-500 p-10 flex flex-col ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            <div className="flex justify-between items-center mb-16">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl overflow-hidden shadow-md">
                     <img src={gowinLogo} alt="Gowin" className="w-full h-full object-cover" />
                  </div>
                  <span className="text-xl font-black text-[#0F4C5C]">Gowin<span className="text-[#FF7F50]">.</span></span>
               </div>
               <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 bg-gray-50 rounded-xl">
                  <X className="w-5 h-5 text-gray-400" />
               </button>
            </div>

            <nav className="flex flex-col gap-6 mb-auto">
               {navLinks.map((link) => (
                 <Link
                   key={link.href}
                   to={link.href}
                   onClick={() => setIsMobileMenuOpen(false)}
                   className={`text-lg font-black tracking-tight py-2 transition-colors ${isActive(link.href) ? 'text-[#FF7F50]' : 'text-[#0F4C5C] hover:text-[#FF7F50]'}`}
                 >
                   {link.text}
                 </Link>
               ))}
            </nav>

            <div className="pt-10 border-t border-gray-50">
               {isAdmin && (
                  <div className="space-y-4">
                     <Link 
                       to="/admin/dashboard" 
                       onClick={() => setIsMobileMenuOpen(false)}
                       className="flex items-center justify-center gap-3 w-full bg-[#0F4C5C] text-white py-4 rounded-2xl font-bold shadow-lg shadow-[#0F4C5C]/20"
                     >
                        <ShieldCheck className="w-5 h-5" /> Admin Dashboard
                     </Link>
                     <button 
                       onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                       className="w-full py-4 text-red-500 font-bold border-2 border-red-50 hover:bg-red-50 rounded-2xl transition-all"
                     >
                        Sign Out
                     </button>
                  </div>
               )}
               
               <div className="mt-10 flex justify-center gap-6 text-gray-300">
                  <Globe className="w-5 h-5" />
                  <Instagram className="w-5 h-5" />
                  <Facebook className="w-5 h-5" />
               </div>
            </div>
         </div>
      </div>
    </nav>
  );
};

export default Navbar;
