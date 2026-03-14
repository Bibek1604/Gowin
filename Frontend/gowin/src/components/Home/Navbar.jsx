import React, { useState, useEffect } from 'react';
import { useAdminStore } from '../Store/AdminStore';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User, LogOut, ShieldCheck, Globe } from 'lucide-react';
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
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
        isScrolled 
          ? 'bg-white/80 backdrop-blur-xl py-4 shadow-[0_10px_40px_rgba(0,0,0,0.04)] border-b border-gray-100' 
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-12">
        <div className="flex justify-between items-center">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className={`w-12 h-12 rounded-2xl overflow-hidden transition-all duration-500 ${isScrolled ? 'shadow-lg' : 'shadow-xl'}`}>
               <img src={gowinLogo} alt="Gowin" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            </div>
            <div className="flex flex-col">
              <span className={`text-2xl font-black tracking-tighter leading-none transition-colors duration-500 ${isScrolled ? 'text-[#0F4C5C]' : 'text-white drop-shadow-md'}`}>
                Gowin<span className="text-[#FF7F50]">.</span>
              </span>
              <span className={`text-[9px] font-bold uppercase tracking-[0.3em] transition-colors duration-500 ${isScrolled ? 'text-[#FF7F50]' : 'text-white/70'}`}>
                Premium Travels
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`text-sm font-bold uppercase tracking-[0.15em] transition-all duration-300 relative group py-2 
                  ${isScrolled 
                    ? (isActive(link.href) ? 'text-[#0F4C5C]' : 'text-gray-500 hover:text-[#0F4C5C]') 
                    : (isActive(link.href) ? 'text-white' : 'text-white/80 hover:text-white')
                  }`}
              >
                {link.text}
                <span className={`absolute bottom-0 left-0 h-[2px] bg-[#FF7F50] transition-all duration-300 ${isActive(link.href) ? 'w-full' : 'w-0 group-hover:w-full'}`} />
              </Link>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="hidden lg:flex items-center gap-4">
            {isAdmin ? (
               <div className="flex items-center gap-3">
                  <Link 
                    to="/admin/dashboard" 
                    className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all
                      ${isScrolled 
                        ? 'bg-[#0F4C5C] text-white shadow-lg shadow-[#0F4C5C]/20 hover:-translate-y-0.5' 
                        : 'bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white/20'
                      }`}
                  >
                    <ShieldCheck className="w-4 h-4" /> Admin
                  </Link>
                  <button 
                    onClick={logout}
                    className={`p-3 rounded-2xl transition-all ${isScrolled ? 'bg-gray-100 text-gray-500 hover:text-red-500' : 'bg-white/10 text-white hover:bg-red-500/20 hover:text-red-400'}`}
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
               </div>
            ) : (
               <Link 
                 to="/login"
                 className={`flex items-center gap-2 px-8 py-3.5 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all active:scale-95
                   ${isScrolled 
                     ? 'bg-[#0F4C5C] text-white shadow-xl shadow-[#0F4C5C]/20 hover:bg-[#0c3e4b]' 
                     : 'bg-white text-[#0F4C5C] shadow-2xl hover:-translate-y-0.5'
                   }`}
               >
                 <User className="w-4 h-4" /> Member Access
               </Link>
            )}
          </div>

          {/* Mobile Menu Trigger */}
          <button 
            className={`lg:hidden p-3 rounded-2xl transition-all ${isScrolled ? 'bg-gray-100 text-[#0F4C5C]' : 'bg-white/10 text-white'}`}
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
               <div className="flex items-center gap-2">
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
                   className={`text-lg font-bold tracking-tight py-2 transition-colors ${isActive(link.href) ? 'text-[#FF7F50]' : 'text-[#0F4C5C] hover:text-[#FF7F50]'}`}
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
                    className="flex items-center justify-center gap-3 w-full bg-[#0F4C5C] text-white py-5 rounded-[2rem] font-bold shadow-xl shadow-[#0F4C5C]/20"
                   >
                    <User className="w-5 h-5" /> Travel Portal Access
                  </Link>
               )}
               
               <div className="mt-10 flex justify-center gap-6 text-gray-400">
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
