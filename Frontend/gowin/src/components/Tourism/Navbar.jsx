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
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md py-4 shadow-sm border-b border-gray-100' 
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-12 flex items-center justify-between">
        
        {/* Left: Brand Identity */}
        <Link to="/" className="flex items-center gap-4 group">
          <div className={`relative transition-all duration-500 rounded-lg overflow-hidden border border-white/20 ${isScrolled ? 'w-10 h-10 shadow-md' : 'w-14 h-14 shadow-xl'}`}>
            <img src={gowinLogo} alt="Gowin" className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col">
            <span className={`text-xl md:text-2xl font-extrabold tracking-tight transition-all duration-500 ${isScrolled ? 'text-[#0F4C5C]' : 'text-white'}`}>
              GOWIN <span className="font-medium opacity-80">INTERNATIONAL</span>
            </span>
            <div className={`h-[1px] bg-[#FF7F50] transition-all duration-500 ${isScrolled ? 'w-full' : 'w-0 group-hover:w-full'}`} />
          </div>
        </Link>

        {/* Center: Essential Navigation */}
        <div className="hidden lg:flex items-center gap-10">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`text-xs font-bold uppercase tracking-widest transition-all duration-300 relative py-1
                ${isScrolled 
                  ? (isActive(link.href) ? 'text-[#0F4C5C]' : 'text-gray-500 hover:text-[#0F4C5C]') 
                  : (isActive(link.href) ? 'text-white border-b border-white' : 'text-white/70 hover:text-white')
                }`}
            >
              {link.text}
              {isScrolled && isActive(link.href) && (
                <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-[#0F4C5C]" />
              )}
            </Link>
          ))}
        </div>

        {/* Right: Premium Actions */}
        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center">
            {isAdmin && (
               <Link 
                 to="/admin/dashboard" 
                 className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-bold text-[10px] uppercase tracking-wider transition-all
                   ${isScrolled 
                     ? 'bg-[#0F4C5C] text-white hover:bg-[#0a3845]' 
                     : 'bg-white text-[#0F4C5C] hover:bg-gray-100 shadow-lg'
                   }`}
               >
                 <ShieldCheck className="w-4 h-4" /> Admin Portal
               </Link>
            )}
          </div>

          {/* Mobile Menu Trigger */}
          <button 
            className={`lg:hidden p-2.5 rounded-xl transition-all ${isScrolled ? 'text-[#0F4C5C]' : 'text-white'}`}
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
                   <a href="https://www.facebook.com/share/15cfo9obmC3/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="hover:text-[#0F4C5C] transition-colors">
                      <Facebook className="w-6 h-6" />
                   </a>
                </div>
            </div>
         </div>
      </div>
    </nav>
  );
};

export default Navbar;


