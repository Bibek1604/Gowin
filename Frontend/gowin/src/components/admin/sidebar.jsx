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
      color: colors.primary.navy,
    },
    {
      name: 'Add Place',
      to: '/admin/add-place',
      icon: 'fas fa-plus',
      color: colors.accent.skyBlue,
    },
    {
      name: 'Add Details',
      to: '/admin/add-detail',
      icon: 'fas fa-list',
      color: colors.primary.navy,
    },
    {
      name: 'Add Category',
      to: '/admin/add-category',
      icon: 'fas fa-tag',
      color: colors.accent.orange,
    },
    {
      name: 'Bookings',
      to: '/admin/add-booking',
      icon: 'fas fa-calendar',
      color: colors.accent.skyBlue,
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
      className="h-screen w-64 text-white flex flex-col fixed top-0 left-0 shadow-2xl z-50 border-r"
      style={{
        background: `linear-gradient(to bottom, #1d4ed8, #2563eb)`,
        fontFamily: 'Outfit, sans-serif',
        borderColor: 'rgba(255, 255, 255, 0.1)'
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
            style={{ ringColor: colors.accent.skyBlue }}
          />
          <div
            className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white"
            style={{ background: colors.accent.orange }}
          />
        </div>
        <div>
          <h2
            className="text-xl font-bold uppercase tracking-tighter"
            style={{ color: 'white' }}
          >
            Go Win<span style={{ color: colors.accent.skyBlue }}>.</span>
          </h2>
          <p className="text-[10px] uppercase tracking-widest font-bold" style={{ color: colors.accent.skyBlue }}>Admin Panel</p>
        </div>
      </Link>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 overflow-y-auto"
        style={{
          scrollbarWidth: 'none',
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
                  style={{
                    background: isActive
                      ? `${colors.primary.navy}80`
                      : 'transparent',
                    borderLeft: isActive ? `3px solid ${colors.accent.skyBlue}` : '3px solid transparent',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'transparent';
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
                    className="font-medium text-xs uppercase tracking-widest"
                    style={{
                      color: isActive ? 'white' : 'rgba(255, 255, 255, 0.6)',
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

      <div className="p-4 border-t" style={{ borderColor: `${colors.neutral.gray}20` }}>
        <div
          className="p-4 rounded-xl mb-3 flex items-center gap-3"
          style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)' }}
        >
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-800"
          >
            <i className="fas fa-user-shield text-sky-400 text-sm"></i>
          </div>
          <div className="flex-1">
            <p className="font-bold text-xs uppercase tracking-wider" style={{ color: 'white' }}>Admin</p>
            <p className="text-[10px] uppercase opacity-50" style={{ color: 'white' }}>Safe Mode</p>
          </div>
        </div>

        <button
          onClick={logout}
          className="w-full py-3 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2 group text-xs uppercase tracking-widest"
          style={{
            background: colors.primary.navy,
            color: 'white',
            boxShadow: colors.shadows.md
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = colors.accent.orange;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = colors.primary.navy;
          }}
        >
          <i className="fas fa-sign-out-alt"></i>
          Logout
        </button>
      </div>
    </motion.div>
  );
};

export default Sidebar;