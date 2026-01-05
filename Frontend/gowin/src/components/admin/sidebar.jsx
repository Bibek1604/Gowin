import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { useAdminStore } from '../Store/AdminStore';
import colors from '../../theme/colors';
import gowin from '../../assets/gowin.jpg';

const Sidebar = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const location = useLocation();
  const { logout } = useAdminStore();

  const navItems = [
    {
      name: 'Dashboard',
      to: '/admin',
      icon: 'fas fa-chart-line',
      color: colors.accent.orange,
    },
    {
      name: 'Add Place',
      to: '/admin/add-place',
      icon: 'fas fa-map-marked-alt',
      color: colors.primary.teal,
    },
    {
      name: 'Add Details',
      to: '/admin/add-detail',
      icon: 'fas fa-info-circle',
      color: colors.accent.skyBlue,
    },
    {
      name: 'Add Category',
      to: '/admin/add-category',
      icon: 'fas fa-tags',
      color: colors.accent.yellow,
    },
    {
      name: 'Bookings',
      to: '/admin/add-booking',
      icon: 'fas fa-calendar-check',
      color: colors.accent.coral,
    },
  ];

  const sidebarVariants = {
    hidden: { x: -250, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  const navItemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (index) => ({
      opacity: 1,
      y: 0,
      transition: { delay: index * 0.1, duration: 0.3 },
    }),
  };

  return (
    <motion.div
      className="h-screen w-64 text-white flex flex-col fixed top-0 left-0 shadow-2xl z-50"
      style={{ 
        background: `linear-gradient(180deg, ${colors.neutral.charcoal} 0%, ${colors.neutral.darkGray} 100%)`,
        fontFamily: 'Inter, Roboto, sans-serif',
        borderRight: `1px solid ${colors.neutral.gray}40`
      }}
      variants={sidebarVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Logo */}
      <Link to="/admin" className="flex items-center gap-3 p-6 border-b group" style={{ borderColor: `${colors.neutral.gray}30` }}>
        <div className="relative">
          <img 
            src={gowin} 
            alt="Gowin Travel" 
            className="w-12 h-12 rounded-full shadow-lg group-hover:scale-110 transition-transform duration-300 ring-2"
            style={{ ringColor: colors.primary.teal }}
          />
          <div 
            className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white"
            style={{ background: colors.accent.orange }}
          />
        </div>
        <div>
          <h2 
            className="text-2xl font-bold"
            style={{ fontFamily: 'Playfair Display, Georgia, serif', color: colors.primary.teal }}
          >
            Gowin
          </h2>
          <p className="text-xs" style={{ color: colors.accent.orange }}>Admin Dashboard</p>
        </div>
      </Link>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 overflow-y-auto"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: `${colors.primary.teal} transparent`
        }}
      >
        <ul className="space-y-2">
          {navItems.map((item, index) => {
            const isActive = location.pathname === item.to;
            return (
              <motion.li
                key={item.name}
                custom={index}
                variants={navItemVariants}
                initial="hidden"
                animate="visible"
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  to={item.to}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group relative overflow-hidden"
                  style={{
                    background: isActive 
                      ? `linear-gradient(135deg, ${colors.primary.teal}30 0%, ${colors.primary.teal}20 100%)` 
                      : 'transparent',
                    borderLeft: isActive ? `3px solid ${colors.primary.teal}` : '3px solid transparent',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                      e.currentTarget.style.borderLeftColor = colors.accent.orange;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.borderLeftColor = 'transparent';
                    }
                  }}
                >
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center transition-all"
                    style={{ 
                      background: isActive ? item.color : 'rgba(255, 255, 255, 0.1)',
                    }}
                  >
                    <i 
                      className={`${item.icon} text-lg`}
                      style={{ color: isActive ? 'white' : item.color }}
                    ></i>
                  </div>
                  <span 
                    className="font-medium text-sm"
                    style={{ 
                      color: isActive ? colors.primary.teal : 'rgba(255, 255, 255, 0.9)',
                      fontFamily: 'Inter, Roboto, sans-serif'
                    }}
                  >
                    {item.name}
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute right-0 top-0 bottom-0 w-1 rounded-l"
                      style={{ background: colors.accent.orange }}
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              </motion.li>
            );
          })}
        </ul>
      </nav>

      {/* User Profile Section */}
      <div className="p-4 border-t" style={{ borderColor: `${colors.neutral.gray}30` }}>
        <div 
          className="p-4 rounded-xl mb-3"
          style={{ background: `linear-gradient(135deg, ${colors.primary.teal}20 0%, ${colors.accent.orange}20 100%)` }}
        >
          <div className="flex items-center gap-3">
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center ring-2 ring-white/30"
              style={{ background: `linear-gradient(135deg, ${colors.primary.teal} 0%, ${colors.accent.orange} 100%)` }}
            >
              <i className="fas fa-user-shield text-white text-lg"></i>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm" style={{ color: 'white' }}>Admin User</p>
              <p className="text-xs" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Administrator</p>
            </div>
          </div>
        </div>
        
        <button
          onClick={logout}
          className="w-full py-3 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2 group"
          style={{
            background: `linear-gradient(135deg, ${colors.accent.orange} 0%, ${colors.accent.orangeDark} 100%)`,
            color: 'white',
            boxShadow: colors.shadows.md
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = colors.shadows.lg;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = colors.shadows.md;
          }}
        >
          <i className="fas fa-sign-out-alt group-hover:translate-x-1 transition-transform"></i>
          Logout
        </button>
      </div>
    </motion.div>
  );
};

export default Sidebar;