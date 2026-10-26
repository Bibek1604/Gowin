import React, { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, MapPin, Tags, CalendarCheck, Mail, Star, Users, Settings as SettingsIcon, LogOut, Menu, X, ExternalLink, ChevronRight } from 'lucide-react';
import { useAdminStore } from '../Store/AdminStore';
import useBookingStore from '../Store/BookingStore';
import useMessageStore from '../Store/MessageStore';
import gowinLogo from '../../assets/gowin.jpg';
import { useSEO } from '../../lib/seo';

const NAV = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/destinations', label: 'Destinations', icon: MapPin },
  { to: '/admin/categories', label: 'Categories', icon: Tags },
  { to: '/admin/bookings', label: 'Bookings', icon: CalendarCheck, badge: 'pending' },
  { to: '/admin/messages', label: 'Messages', icon: Mail, badge: 'new' },
  { to: '/admin/testimonials', label: 'Testimonials', icon: Star },
  { to: '/admin/subscribers', label: 'Subscribers', icon: Users },
  { to: '/admin/settings', label: 'Settings', icon: SettingsIcon },
];

const AdminLayout = ({ children }) => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { logout, user } = useAdminStore();
  const { bookings, fetchBookings, loaded: bookingsLoaded } = useBookingStore();
  const { messages, fetchMessages, loaded: messagesLoaded } = useMessageStore();

  useEffect(() => { if (!bookingsLoaded) fetchBookings(); if (!messagesLoaded) fetchMessages(); }, [bookingsLoaded, messagesLoaded, fetchBookings, fetchMessages]);
  useEffect(() => { setOpen(false); }, [location.pathname]);

  const current = NAV.find((n) => (n.end ? location.pathname === n.to : location.pathname.startsWith(n.to))) || NAV[0];
  useSEO({ title: `${current.label} · Admin`, noindex: true });

  const badges = {
    pending: bookings.filter((b) => (b.status || 'Pending') === 'Pending').length,
    new: messages.filter((m) => (m.status || 'New') === 'New').length,
  };

  const nav = (
    <nav className="flex-1 px-3 py-4 overflow-y-auto" aria-label="Admin">
      <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">Manage</p>
      <ul className="space-y-0.5">
        {NAV.map(({ to, label, icon: Icon, end, badge }) => (
          <li key={to}>
            <NavLink to={to} end={end} className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${isActive ? 'bg-[#1E3A8A] text-white shadow-md shadow-[#1E3A8A]/20' : 'text-gray-600 hover:bg-gray-50 hover:text-[#1E3A8A]'}`}>
              {({ isActive }) => (
                <>
                  <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                  <span className="flex-1">{label}</span>
                  {badge && badges[badge] > 0 && <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-[#10B981] text-white'}`}>{badges[badge]}</span>}
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );

  const footer = (
    <div className="p-4 border-t border-gray-100 space-y-3">
      <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl">
        <span className="w-9 h-9 rounded-lg bg-[#1E3A8A] text-white text-xs font-bold flex items-center justify-center flex-shrink-0">{(user?.email?.[0] || 'A').toUpperCase()}</span>
        <div className="min-w-0"><p className="text-xs font-bold text-[#0F172A] truncate">{user?.email || 'Admin'}</p><p className="text-[10px] text-gray-400">Administrator</p></div>
      </div>
      <button type="button" onClick={logout} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-[#1E3A8A] bg-[#1E3A8A]/5 hover:bg-[#1E3A8A] hover:text-white transition-colors"><LogOut className="w-4 h-4" /> Sign out</button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F4F6FA] flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-100 flex-col z-40">
        <Link to="/admin" className="flex items-center gap-3 px-5 h-16 border-b border-gray-100">
          <img src={gowinLogo} alt="" width="36" height="36" className="w-9 h-9 rounded-lg object-cover" />
          <span><span className="block text-sm font-black text-[#1E3A8A] leading-none">GoWin Travels</span><span className="block text-[9px] font-bold uppercase tracking-widest text-[#10B981] mt-1">Admin panel</span></span>
        </Link>
        {nav}{footer}
      </aside>

      {/* Mobile drawer */}
      <div className={`fixed inset-0 z-50 lg:hidden ${open ? '' : 'pointer-events-none'}`} aria-hidden={!open}>
        <div className={`absolute inset-0 bg-[#0F172A]/50 transition-opacity ${open ? 'opacity-100' : 'opacity-0'}`} onClick={() => setOpen(false)} />
        <aside className={`absolute inset-y-0 left-0 w-72 max-w-[85vw] bg-white flex flex-col shadow-2xl transition-transform ${open ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex items-center justify-between px-5 h-16 border-b border-gray-100">
            <span className="text-sm font-black text-[#1E3A8A]">GoWin Admin</span>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close menu" className="w-9 h-9 rounded-lg bg-gray-50 flex items-center justify-center"><X className="w-4 h-4" /></button>
          </div>
          {nav}{footer}
        </aside>
      </div>

      <div className="flex-1 flex flex-col min-w-0 lg:ml-64">
        <header className="sticky top-0 z-30 h-16 bg-white/95 backdrop-blur border-b border-gray-100 px-4 sm:px-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button type="button" onClick={() => setOpen(true)} aria-label="Open menu" className="lg:hidden w-9 h-9 rounded-lg bg-gray-50 text-gray-600 flex items-center justify-center"><Menu className="w-4 h-4" /></button>
            <nav className="flex items-center gap-1.5 text-xs min-w-0" aria-label="Breadcrumb">
              <Link to="/admin" className="text-gray-400 hover:text-[#1E3A8A] font-medium">Admin</Link>
              {current.to !== '/admin' && <><ChevronRight className="w-3 h-3 text-gray-300" /><span className="font-semibold text-[#1E3A8A] truncate">{current.label}</span></>}
            </nav>
          </div>
          <a href="/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-[#1E3A8A] bg-gray-50 hover:bg-gray-100 px-3 py-2 rounded-lg"><ExternalLink className="w-3.5 h-3.5" /> View website</a>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
