import React, { useState } from 'react';
import { useAdminStore } from '../Store/AdminStore';
import gowin from '../../assets/gowin.jpg';
import { Link } from 'react-router-dom';
import colors from '../../theme/colors';
import { Button } from '../ui';

const NavLink = ({ href, children }) => (
  <a
    href={href}
    className="flex items-center font-semibold transition-all duration-300 relative group text-sm tracking-wider uppercase h-full"
    style={{
      color: colors.neutral.charcoal,
      fontFamily: 'Outfit, sans-serif',
    }}
  >
    <span>{children}</span>
    <span
      className="absolute -bottom-1 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300"
      style={{ background: colors.accent.skyBlue }}
    />
  </a>
);

const Navbar = () => {
  const { isAdmin, login, logout } = useAdminStore();
  const [email, setEmail] = useState('admin@gowin.com');
  const [password, setPassword] = useState('');
  const [showInput, setShowInput] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogin = async () => {
    if (password.trim()) {
      const result = await login(email, password);
      if (result.success) {
        setPassword('');
        setShowInput(false);
      } else {
        alert('Invalid credentials');
      }
    }
  };

  const navLinks = [
    { href: '/', text: 'Home' },
    { href: '/aboutus', text: 'About Us' },
    { href: '/contactus', text: 'Contact' },
    ...(isAdmin ? [{ href: '/admin', text: 'Admin Panel' }] : []),
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
                  className="text-2xl font-black uppercase tracking-tighter"
                  style={{
                    fontFamily: 'Outfit, sans-serif',
                    color: colors.primary.navy,
                  }}
                >
                  Go Win<span style={{ color: colors.accent.skyBlue }}> International</span>
                </div>
                <div
                  className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-40 ml-1"
                  style={{
                    fontFamily: 'Outfit, sans-serif',
                    color: colors.primary.navy,
                  }}
                >
                  Explore Beyond Borders
                </div>
              </div>
            </Link>

            <div className="hidden md:flex items-center gap-8 h-full">
              {navLinks.map((link, index) => (
                <NavLink
                  key={index}
                  href={link.href}
                >
                  {link.text}
                </NavLink>
              ))}
            </div>

            {/* Desktop Login/Logout */}
            <div className="hidden md:flex items-center gap-3">
              {!isAdmin && showInput && (
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    className="px-3 py-2 rounded-lg border-2 focus:outline-none transition-all w-40 text-sm"
                    style={{ borderColor: colors.neutral.lightGray }}
                  />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="px-3 py-2 rounded-lg border-2 focus:outline-none transition-all w-32 text-sm"
                    style={{ borderColor: colors.neutral.lightGray }}
                    onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                  />
                </div>
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
              className="md:hidden text-2xl transition-transform duration-300"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <div className="flex flex-col gap-1.5 w-6">
                <span className={`block h-[2px] w-full transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`} style={{ background: colors.primary.navy }} />
                <span className={`block h-[2px] w-full transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`} style={{ background: colors.primary.navy }} />
                <span className={`block h-[2px] w-full transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} style={{ background: colors.primary.navy }} />
              </div>
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
                className="block text-sm font-bold uppercase tracking-widest py-3 border-b border-slate-50"
                onClick={() => setIsMobileMenuOpen(false)}
                style={{
                  color: colors.primary.navy,
                  fontFamily: 'Outfit, sans-serif',
                }}
              >
                {link.text}
              </a>
            ))}

            <div className="pt-4 border-t" style={{ borderColor: colors.neutral.lightGray }}>
              {!isAdmin && showInput && (
                <div className="space-y-2 mb-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Admin Email"
                    className="w-full px-4 py-2 rounded-lg border-2 focus:outline-none transition-all"
                    style={{ borderColor: colors.neutral.lightGray }}
                  />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full px-4 py-2 rounded-lg border-2 focus:outline-none transition-all"
                    style={{ borderColor: colors.neutral.lightGray }}
                    onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                  />
                </div>
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
