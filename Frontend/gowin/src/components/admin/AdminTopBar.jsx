import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Menu, Bell, Home, ChevronRight, ExternalLink } from 'lucide-react';

const routeMap = {
  '/admin': { label: 'Dashboard', parent: null },
  '/admin/dashboard': { label: 'Dashboard', parent: null },
  '/admin/add-place': { label: 'Manage Destinations', parent: 'Dashboard' },
  '/admin/add-detail': { label: 'Manage Details', parent: 'Dashboard' },
  '/admin/add-category': { label: 'Manage Categories', parent: 'Dashboard' },
  '/admin/add-booking': { label: 'Manage Bookings', parent: 'Dashboard' },
  '/admin/testimonials': { label: 'Testimonials', parent: 'Dashboard' },
  '/admin/messages': { label: 'Messages', parent: 'Dashboard' },
  '/admin/subscribers': { label: 'Subscribers', parent: 'Dashboard' },
};

const AdminTopBar = ({ onMenuToggle }) => {
  const location = useLocation();
  const route = routeMap[location.pathname] || { label: 'Admin', parent: null };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-gray-100 px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
      {/* Left: Mobile menu + Breadcrumb */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onMenuToggle}
          className="lg:hidden flex items-center justify-center w-9 h-9 rounded-xl bg-gray-50 text-gray-500 hover:bg-gray-100 transition-all flex-shrink-0"
          aria-label="Toggle sidebar"
        >
          <Menu className="w-4 h-4" />
        </button>

        <nav className="flex items-center gap-1.5 text-sm min-w-0">
          <Link to="/admin" className="flex items-center gap-1 text-gray-400 hover:text-[#1E3A8A] transition-colors flex-shrink-0">
            <Home className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-xs font-medium">Admin</span>
          </Link>
          {route.parent && (
            <>
              <ChevronRight className="w-3 h-3 text-gray-300 flex-shrink-0" />
              <Link to="/admin" className="text-xs text-gray-400 hover:text-[#1E3A8A] transition-colors hidden sm:block font-medium">
                {route.parent}
              </Link>
            </>
          )}
          <ChevronRight className="w-3 h-3 text-gray-300 flex-shrink-0" />
          <span className="text-xs text-[#1E3A8A] font-semibold truncate">{route.label}</span>
        </nav>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <Link
          to="/"
          target="_blank"
          className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-[#1E3A8A] bg-gray-50 hover:bg-gray-100 px-3 py-2 rounded-lg transition-all"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          View Site
        </Link>
        <div className="w-8 h-8 rounded-xl bg-[#1E3A8A] flex items-center justify-center text-white text-xs font-bold shadow-sm">
          A
        </div>
      </div>
    </header>
  );
};

export default AdminTopBar;
