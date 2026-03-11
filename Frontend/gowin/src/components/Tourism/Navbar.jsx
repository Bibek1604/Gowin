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
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-700 px-4 md:px-8 ${
        isScrolled 
          ? 'py-4' 
          : 'py-8'
      }`}
    >
      <div 
        className={`mx-auto transition-all duration-700 ease-out relative ${
          isScrolled 
            ? 'max-w-5xl bg-white/80 backdrop-blur-2xl px-8 py-4 rounded-[2.5rem] shadow-[0_30px_100px_rgba(15,76,92,0.15)] border border-white/40 overflow-hidden' 
            : 'max-w-7xl px-4 py-2 bg-transparent'
        }`}
      >
        {/* Top edge gradient stripe on scroll */}
        {isScrolled && (
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#2A9D8F] via-[#0F4C5C] to-[#FF7F50] opacity-60" />
        )}

        <div className="flex justify-between items-center">
          
          {/* Logo Area */}
          <Link to="/" className="flex items-center gap-4 group">
            <div className={`transition-all duration-500 rounded-[1.3rem] overflow-hidden ${isScrolled ? 'w-10 h-10 shadow-lg' : 'w-14 h-14 shadow-[0_20px_50px_rgba(42,157,143,0.3)] scale-110'}`}>
               <img src={gowinLogo} alt="Gowin" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
            </div>
            <div className="flex flex-col">
              <span className={`text-2xl font-black tracking-tighter leading-none transition-all duration-500 ${isScrolled ? 'text-[#0F4C5C]' : 'text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]'}`}>
                Gowin<span className="text-[#FF7F50]">.</span>
              </span>
              {!isScrolled && (
                <span className="text-[9px] font-black uppercase tracking-[0.4em] text-[#2A9D8F] mt-1 shadow-sm px-1 bg-white/10 rounded-sm">
                  Premium Travels
                </span>
              )}
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8 xl:gap-12">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`text-[12px] font-black uppercase tracking-[0.25em] transition-all duration-300 relative group py-2 
                  ${isScrolled 
                    ? (isActive(link.href) ? 'text-[#0F4C5C]' : 'text-gray-400 hover:text-[#2A9D8F]') 
                    : (isActive(link.href) ? 'text-[#FF7F50]' : 'text-white/80 hover:text-white')
                  }`}
              >
                {link.text}
                <span className={`absolute -bottom-1 left-1/2 -translate-x-1/2 h-2 w-2 rounded-full transition-all duration-500 shadow-[0_0_15px_currentColor] 
                  ${isActive(link.href) 
                    ? 'opacity-100 scale-100 bg-[#FF7F50] text-[#FF7F50]' 
                    : 'opacity-0 scale-0 bg-[#2A9D8F] text-[#2A9D8F] group-hover:opacity-60 group-hover:scale-100'}`} 
                />
              </Link>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="hidden lg:flex items-center gap-4">
            {isAdmin ? (
               <div className="flex items-center gap-3">
                  <Link 
                    to="/admin/dashboard" 
                    className={`flex items-center gap-3 px-6 py-2.5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all
                      ${isScrolled 
                        ? 'bg-gradient-to-r from-[#0F4C5C] to-[#0a3845] text-white shadow-xl shadow-[#0F4C5C]/20 hover:-translate-y-0.5' 
                        : 'bg-white/15 backdrop-blur-xl text-white border border-white/30 hover:bg-white/30'
                      }`}
                  >
                    <ShieldCheck className="w-4 h-4 text-[#2A9D8F]" /> Admin
                  </Link>
               </div>
            ) : (
               <Link 
                 to="/login"
                 className={`flex items-center gap-3 px-8 py-4 rounded-[1.8rem] font-black text-[11px] uppercase tracking-[0.2em] transition-all active:scale-95 group/btn relative overflow-hidden
                   ${isScrolled 
                     ? 'bg-gradient-to-br from-[#2A9D8F] via-[#2A9D8F] to-[#0F4C5C] text-white shadow-[0_15px_45px_rgba(42,157,143,0.4)] hover:shadow-[0_20px_60px_rgba(42,157,143,0.5)]' 
                     : 'bg-white text-[#0F4C5C] shadow-2xl hover:-translate-y-1 hover:shadow-white/20'
                   }`}
               >
                 <div className="absolute inset-0 bg-white/20 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                 <User className={`w-4 h-4 transition-transform group-hover/btn:scale-125 z-10 ${isScrolled ? 'text-white/80' : 'text-[#2A9D8F]'}`} /> 
                 <span className="relative z-10">Member Access</span>
               </Link>
            )}
          </div>

          {/* Mobile Menu Trigger */}
          <button 
            className={`lg:hidden p-3 rounded-2xl transition-all shadow-lg ${isScrolled ? 'bg-[#0F4C5C]/5 text-[#0F4C5C]' : 'bg-white/10 text-white border border-white/20'}`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
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
               {isAdmin ? (
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
               ) : (
                  <Link 
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-3 w-full bg-[#2A9D8F] text-white py-5 rounded-[2rem] font-bold shadow-xl shadow-[#2A9D8F]/20"
                   >
                    <User className="w-5 h-5" /> Travel Portal Access
                  </Link>
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
