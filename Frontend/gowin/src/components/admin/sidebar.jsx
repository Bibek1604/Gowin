import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { useAdminStore } from '../Store/AdminStore';
import { LayoutDashboard, MapPin, ListPlus, Tags, CalendarCheck, LogOut, ShieldCheck, Star, Mail, Users, Compass } from 'lucide-react';
import gowinLogo from '../../assets/gowin.jpg';

const Sidebar = () => {
  const location = useLocation();
  const { logout } = useAdminStore();

  const navItems = [
    {
      name: 'Dashboard',
      to: '/admin',
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      name: 'Add Place',
      to: '/admin/add-place',
      icon: <MapPin className="w-5 h-5" />,
    },
    {
      name: 'Add Details',
      to: '/admin/add-detail',
      icon: <ListPlus className="w-5 h-5" />,
    },
    {
      name: 'Add Category',
      to: '/admin/add-category',
      icon: <Tags className="w-5 h-5" />,
    },
    {
      name: 'Bookings',
      to: '/admin/add-booking',
      icon: <CalendarCheck className="w-5 h-5" />,
    },
    {
      name: 'Testimonials',
      to: '/admin/testimonials',
      icon: <Star className="w-5 h-5" />,
    },
    {
      name: 'Messages',
      to: '/admin/messages',
      icon: <Mail className="w-5 h-5" />,
    },
    {
      name: 'Subscribers',
      to: '/admin/subscribers',
      icon: <Users className="w-5 h-5" />,
    },
  ];

  return (
    <div className="h-screen w-64 bg-white flex flex-col fixed top-0 left-0 shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-50 border-r border-gray-100 font-sans">
      
      {/* Logo */}
      <Link to="/admin" className=" flex items-center gap-3 p-8 border-b border-gray-50 group">
        <div className="w-12 h-12 rounded-2xl overflow-hidden shadow-sm group-hover:scale-105 transition-transform duration-300">
           <img src={gowinLogo} alt="Gowin" className="w-full h-full object-cover" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-[#0F4C5C] leading-none">
            Gowin<span className="text-[#FF7F50]">.</span>
          </h2>
          <p className="text-[10px] uppercase font-bold text-[#2A9D8F] tracking-widest mt-1">Admin Panel</p>
        </div>
      </Link>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-8 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 px-4">Menu</p>
        <ul className="space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.to || (location.pathname === '/admin/dashboard' && item.to === '/admin');
            return (
              <li key={item.name}>
                <Link
                  to={item.to}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                    isActive 
                      ? 'bg-[#0F4C5C] text-white shadow-md shadow-[#0F4C5C]/20' 
                      : 'text-gray-500 hover:bg-gray-50 hover:text-[#0F4C5C]'
                  }`}
                >
                  <div className={`${isActive ? 'text-white' : 'text-gray-400'}`}>
                    {item.icon}
                  </div>
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-6 border-t border-gray-50">
        <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-2xl mb-4 border border-gray-100">
           <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-[#2A9D8F]">
             <ShieldCheck className="w-5 h-5" />
           </div>
           <div>
             <p className="text-sm font-bold text-[#0F4C5C]">Admin</p>
             <p className="text-xs text-gray-400">System Manager</p>
           </div>
        </div>

        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-[#FF7F50] bg-[#FF7F50]/10 hover:bg-[#FF7F50] hover:text-white transition-colors duration-300"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;