import React, { useState } from 'react';
import { useAdminStore } from '../Store/AdminStore';
import gowin from '../../assets/gowin.jpg';
import { Link } from 'react-router-dom';
import colors from '../../theme/colors';
import { Button } from '../ui';

const NavLink = ({ href, icon, children }) => (
  <a 
    href={href} 
    className="flex items-center gap-2 font-medium transition-all duration-300 relative group"
    style={{ 
      color: colors.neutral.darkGray,
      fontFamily: 'Inter, Roboto, sans-serif',
    }}
  >
    <i className={`${icon} text-lg`} style={{ color: colors.primary.teal }}></i>
    <span className="hidden lg:inline">{children}</span>
    <span 
      className="absolute bottom-0 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300"
      style={{ background: colors.primary.teal }}
    />
  </a>
);

const Navbar = () => {
  const { isAdmin, login, logout } = useAdminStore();
  const [password, setPassword] = useState('');
  const [showInput, setShowInput] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogin = () => {
    if (password.trim()) {
      login(password);
      setPassword('');
      setShowInput(false);
    }
  };

  const navLinks = [
    { href: '/', icon: 'fas fa-home', text: 'Home' },
    { href: '/aboutus', icon: 'fas fa-info-circle', text: 'About Us' },
    { href: '/contactus', icon: 'fas fa-envelope', text: 'Contact' },
    ...(isAdmin ? [{ href: '/admin', icon: 'fas fa-user-shield', text: 'Admin Panel' }] : []),
  ];

  return (
    <>
      {/* Professional Navbar */}
      <nav 
        className="sticky top-0 z-50 bg-white backdrop-blur-lg"
        style={{ 
          boxShadow: colors.shadows.sm,
          borderBottom: `1px solid ${colors.neutral.lightGray}`,
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <img 
                src={gowin} 
                alt="Gowin Travel" 
                className="h-12 w-12 rounded-full transition-transform duration-300 group-hover:scale-105" 
                style={{ boxShadow: colors.shadows.sm }}
              />
              <div>
                <div 
                  className="text-2xl font-bold heading-font"
                  style={{ 
                    fontFamily: 'Playfair Display, Georgia, serif',
                    color: colors.neutral.charcoal,
                  }}
                >
                  Gowin<span style={{ color: colors.primary.teal }}> International</span>
                </div>
                <div 
                  className="text-xs tracking-wide"
                  style={{ 
                    color: colors.neutral.gray,
                    fontFamily: 'Inter, Roboto, sans-serif',
                  }}
                >
                  Explore Beyond Borders
                </div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link, index) => (
                <NavLink 
                  key={index}
                  href={link.href}
                  icon={link.icon}
                >
                  {link.text}
                </NavLink>
              ))}
            </div>

            {/* Desktop Login/Logout */}
            <div className="hidden md:flex items-center gap-3">
              {!isAdmin && showInput && (
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter Password"
                  className="px-4 py-2 rounded-lg border-2 focus:outline-none transition-all"
                  style={{ 
                    borderColor: colors.neutral.lightGray,
                    fontFamily: 'Inter, Roboto, sans-serif',
                  }}
                  onFocus={(e) => e.target.style.borderColor = colors.primary.teal}
                  onBlur={(e) => e.target.style.borderColor = colors.neutral.lightGray}
                  onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                />
              )}
              <Button
                variant="primary"
                size="md"
                onClick={() => {
                  if (isAdmin) {
                    logout();
                  } else {
                    if (!showInput) setShowInput(true);
                    else handleLogin();
                  }
                }}
              >
                {isAdmin ? 'Logout' : showInput ? 'Submit' : 'Admin Login'}
              </Button>
            </div>

            {/* Mobile Hamburger */}
            <button 
              className="md:hidden text-2xl transition-transform duration-300 hover:scale-110"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <i 
                className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'}`}
                style={{ color: colors.primary.teal }}
              ></i>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div 
            className="md:hidden bg-white p-4 space-y-4 animate-fadeIn"
            style={{ 
              boxShadow: colors.shadows.md,
              borderTop: `1px solid ${colors.neutral.lightGray}`
            }}
          >
            {navLinks.map((link, index) => (
              <a 
                key={index}
                href={link.href} 
                className="flex items-center gap-3 transition-all duration-200 font-medium py-2"
                onClick={() => setIsMobileMenuOpen(false)}
                style={{ 
                  color: colors.neutral.darkGray,
                  fontFamily: 'Inter, Roboto, sans-serif',
                }}
              >
                <i className={`${link.icon} text-xl`} style={{ color: colors.primary.teal }}></i>
                {link.text}
              </a>
            ))}
            
            <div className="pt-4 border-t" style={{ borderColor: colors.neutral.lightGray }}>
              {!isAdmin && showInput && (
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter Password"
                  className="w-full px-4 py-2 rounded-lg border-2 focus:outline-none mb-2 transition-all"
                  style={{ 
                    borderColor: colors.neutral.lightGray,
                    fontFamily: 'Inter, Roboto, sans-serif',
                  }}
                  onFocus={(e) => e.target.style.borderColor = colors.primary.teal}
                  onBlur={(e) => e.target.style.borderColor = colors.neutral.lightGray}
                  onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                />
              )}
              <Button
                variant="primary"
                size="md"
                className="w-full"
                onClick={() => {
                  if (isAdmin) {
                    logout();
                    setIsMobileMenuOpen(false);
                  } else {
                    if (!showInput) setShowInput(true);
                    else handleLogin();
                  }
                }}
              >
                {isAdmin ? 'Logout' : showInput ? 'Submit' : 'Admin Login'}
              </Button>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
