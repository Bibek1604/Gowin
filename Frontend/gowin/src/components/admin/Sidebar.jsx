import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAdminStore } from '../Store/AdminStore';
import {
  LayoutDashboard, MapPin, ListPlus, Tags, CalendarCheck,
  LogOut, ShieldCheck, Star, Mail, Users, X
} from 'lucide-react';
import gowinLogo from '../../assets/gowin.jpg';

const navItems = [
  { name: 'Dashboard', to: '/admin', icon: LayoutDashboard },
  { name: 'Destinations', to: '/admin/add-place', icon: MapPin },
  { name: 'Details', to: '/admin/add-detail', icon: ListPlus },
  { name: 'Categories', to: '/admin/add-category', icon: Tags },
  { name: 'Bookings', to: '/admin/add-booking', icon: CalendarCheck },
  { name: 'Testimonials', to: '/admin/testimonials', icon: Star },
  { name: 'Messages', to: '/admin/messages', icon: Mail },
  { name: 'Subscribers', to: '/admin/subscribers', icon: Users },
];

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { logout } = useAdminStore();

  const isActive = (path) =>
    location.pathname === path ||
    (path === '/admin' && location.pathname === '/admin/dashboard');

  const handleLogout = () => {
    logout();
    onClose?.();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-100
          shadow-[4px_0_24px_rgba(0,0,0,0.04)] z-50 flex flex-col font-sans
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-50">
          <Link to="/admin" className="flex items-center gap-3 group" onClick={onClose}>
            <div className="w-10 h-10 rounded-xl overflow-hidden shadow-sm group-hover:shadow-md transition-shadow">
              <img src={gowinLogo} alt="GoWin" className="w-full h-full object-cover" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#0F4C5C] leading-none">
                GoWin<span className="text-[#FF7F50]">.</span>
              </h2>
              <p className="text-[9px] uppercase font-bold text-[#FF7F50] tracking-widest mt-0.5">Admin Panel</p>
            </div>
          </Link>
          {/* Mobile close button */}
          <button
            onClick={onClose}
            className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg bg-gray-50 text-gray-400 hover:bg-gray-100 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-5 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 px-3">Menu</p>
          <ul className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.to);
              return (
                <li key={item.name}>
                  <Link
                    to={item.to}
                    onClick={onClose}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                      active
                        ? 'bg-[#0F4C5C] text-white shadow-md shadow-[#0F4C5C]/20'
                        : 'text-gray-500 hover:bg-gray-50 hover:text-[#0F4C5C]'
                    }`}
                  >
                    <Icon className={`w-4 h-4 flex-shrink-0 ${active ? 'text-white' : 'text-gray-400'}`} />
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-50 space-y-3">
          <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
            <div className="w-9 h-9 bg-white rounded-lg shadow-sm flex items-center justify-center text-[#FF7F50] flex-shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-[#0F4C5C] truncate">Admin</p>
              <p className="text-xs text-gray-400">System Manager</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm text-[#FF7F50] bg-[#FF7F50]/10 hover:bg-[#FF7F50] hover:text-white transition-colors duration-200"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
