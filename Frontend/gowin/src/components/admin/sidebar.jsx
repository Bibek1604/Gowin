import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const navItems = [
    {
      name: 'Dashboard',
      to: '/admin',
      icon: 'M3 12h18M3 6h18M3 18h18',
      active: false,
    },
    {
      name: 'Categories',
      to: '/admin/add-category',
      icon: 'M4 6h16M4 12h16m-7 6h7',
      active: true,
    },
    {
      name: 'Add Place',
      to: '/admin/add-place',
      icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z',
    },
    {
      name: 'Add Details',
      to: '/admin/add-detail',
      icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
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

  const profileVariants = {
    collapsed: { height: 0, opacity: 0 },
    expanded: { height: 'auto', opacity: 1, transition: { duration: 0.3, ease: 'easeOut' } },
  };

  return (
    <motion.div
      className="h-screen w-64 bg-teal-800 text-white flex flex-col p-6 fixed top-0 left-0 shadow-2xl"
      variants={sidebarVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="flex items-center space-x-3 mb-10">
        <svg className="w-8 h-8 text-coral-500" fill="currentColor" viewBox="0 0 20 20">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
        <h2 className="text-2xl font-bold tracking-tight">Gowin Travel</h2>
      </div>
      <nav className="flex-1">
        <ul className="space-y-2">
          {navItems.map((item, index) => (
            <motion.li
              key={item.name}
              custom={index}
              variants={navItemVariants}
              initial="hidden"
              animate="visible"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to={item.to}
                className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ${
                  item.active
                    ? 'bg-teal-700 text-coral-400 shadow-md'
                    : 'hover:bg-teal-700 hover:text-coral-300'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d={item.icon}
                  />
                </svg>
                <span className="font-medium">{item.name}</span>
              </Link>
            </motion.li>
          ))}
        </ul>
      </nav>
      <div className="mt-auto">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center space-x-3 p-3 rounded-lg hover:bg-teal-700 transition-all duration-200 cursor-pointer"
          onClick={() => setIsProfileOpen(!isProfileOpen)}
        >
          <div className="w-10 h-10 bg-coral-500 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 10a3 3 0 100-6 3 3 0 000 6zm-7 4a7 7 0 0114 0H3z" />
            </svg>
          </div>
          <div>
            <p className="font-semibold text-sm">Travel Admin</p>
            <p className="text-xs text-teal-200">admin@gowintravel.com</p>
          </div>
        </motion.div>
        <motion.div
          variants={profileVariants}
          initial="collapsed"
          animate={isProfileOpen ? 'expanded' : 'collapsed'}
          className="overflow-hidden"
        >
          <div className="p-3 bg-teal-700 rounded-lg mt-2">
            <button className="w-full text-left text-sm hover:text-coral-300 transition">
              Profile Settings
            </button>
            <button className="w-full text-left text-sm hover:text-coral-300 transition mt-2">
              Logout
            </button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Sidebar;