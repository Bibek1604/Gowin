import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import usePlaceStore from '../Store/PlaceStore';
import useBookingStore from '../Store/BookingStore';
import useCategoryStore from '../Store/CategoryStore';
import {
  Map, Calendar, Tags, TrendingUp, Activity,
  Star, Mail, Users, Plus, ArrowRight, CheckCircle,
  Clock, XCircle, MapPin
} from 'lucide-react';

const statusConfig = {
  Confirmed: { color: 'text-emerald-600 bg-emerald-50', icon: CheckCircle },
  Cancelled: { color: 'text-red-500 bg-red-50', icon: XCircle },
  Pending: { color: 'text-amber-600 bg-amber-50', icon: Clock },
};

function Dashboard() {
  const { places, fetchPlaces } = usePlaceStore();
  const { bookings, fetchBookings } = useBookingStore();
  const { categories, fetchCategories } = useCategoryStore();
  const [messagesCount, setMessagesCount] = useState(0);
  const [subscribersCount, setSubscribersCount] = useState(0);

  useEffect(() => {
    fetchPlaces();
    fetchBookings();
    fetchCategories();
    fetchCounts();
  }, [fetchPlaces, fetchBookings, fetchCategories]);

  const fetchCounts = async () => {
    const { count: mCount } = await supabase.from('contact_messages').select('*', { count: 'exact', head: true });
    const { count: sCount } = await supabase.from('newsletter_subscribers').select('*', { count: 'exact', head: true });
    setMessagesCount(mCount || 0);
    setSubscribersCount(sCount || 0);
  };

  const stats = useMemo(() => {
    const confirmedBookings = bookings.filter(b => b.status === 'Confirmed');
    const pendingBookings = bookings.filter(b => b.status === 'Pending');
    const recentBookings = [...bookings].slice(0, 6);
    return {
      totalPlaces: places.length,
      totalBookings: bookings.length,
      totalCategories: categories.length,
      confirmedBookings: confirmedBookings.length,
      pendingBookings: pendingBookings.length,
      recentBookings,
    };
  }, [places, bookings, categories]);

  const statCards = [
    {
      title: 'Total Packages',
      value: stats.totalPlaces,
      icon: Map,
      color: 'text-[#1E3A8A]',
      bg: 'bg-[#1E3A8A]/8',
      trend: '+12%',
      link: '/admin/add-place',
    },
    {
      title: 'Total Bookings',
      value: stats.totalBookings,
      icon: Calendar,
      color: 'text-[#10B981]',
      bg: 'bg-[#10B981]/8',
      trend: '+23%',
      link: '/admin/add-booking',
    },
    {
      title: 'Messages',
      value: messagesCount,
      icon: Mail,
      color: 'text-violet-600',
      bg: 'bg-violet-50',
      trend: 'Live',
      link: '/admin/messages',
    },
    {
      title: 'Subscribers',
      value: subscribersCount,
      icon: Users,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      trend: '+10%',
      link: '/admin/subscribers',
    },
  ];

  const quickActions = [
    { label: 'Add Destination', to: '/admin/add-place', icon: Map, desc: 'Create a new tour package' },
    { label: 'View Bookings', to: '/admin/add-booking', icon: Calendar, desc: 'Manage reservations' },
    { label: 'Read Messages', to: '/admin/messages', icon: Mail, desc: 'Customer inquiries' },
    { label: 'Manage Categories', to: '/admin/add-category', icon: Tags, desc: 'Organise tours by type' },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 min-h-screen font-sans">
      {/* Header */}
      <div className="mb-6 lg:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1E3A8A] tracking-tight">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Welcome back — here's what's happening at GoWin Travels.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5 mb-6 lg:mb-8">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <Link
              key={i}
              to={card.link}
              className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${card.bg} ${card.color} group-hover:scale-110 transition-transform`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold text-[#10B981] bg-[#10B981]/10 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                  <TrendingUp className="w-2.5 h-2.5" />
                  {card.trend}
                </span>
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-[#1E3A8A] mb-1">{card.value}</p>
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">{card.title}</p>
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 lg:gap-6">
        {/* Recent Bookings */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-gray-50">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#10B981]/10 flex items-center justify-center">
                <Activity className="w-4 h-4 text-[#10B981]" />
              </div>
              <h2 className="text-base font-bold text-[#1E3A8A]">Recent Bookings</h2>
            </div>
            <Link to="/admin/add-booking" className="text-xs font-semibold text-[#10B981] hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-gray-50">
            {stats.recentBookings.length > 0 ? (
              stats.recentBookings.map((booking, i) => {
                const place = places.find(p => p.id === (booking.tour_id || booking.placeId));
                const status = booking.status || 'Pending';
                const StatusIcon = statusConfig[status]?.icon || Clock;
                return (
                  <div key={i} className="flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50/50 transition-colors">
                    <div className="w-9 h-9 bg-[#1E3A8A]/5 rounded-xl flex items-center justify-center text-[#1E3A8A] font-bold text-sm flex-shrink-0">
                      {(booking.user_name?.[0] || booking.name?.[0] || 'T').toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#1E3A8A] truncate">
                        {booking.user_name || booking.name || 'Traveler'}
                      </p>
                      <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-0.5">
                        <MapPin className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">{place?.title || 'Unknown Package'}</span>
                        {booking.travel_date && (
                          <>
                            <span>·</span>
                            <span className="flex-shrink-0">{booking.travel_date}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <span className={`hidden sm:flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1 rounded-full ${statusConfig[status]?.color || 'text-gray-500 bg-gray-50'}`}>
                      <StatusIcon className="w-3 h-3" />
                      {status}
                    </span>
                  </div>
                );
              })
            ) : (
              <div className="py-16 text-center">
                <Calendar className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                <p className="text-gray-400 text-sm">No bookings yet.</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions + Summary */}
        <div className="space-y-5">
          {/* Quick Actions */}
          <div className="bg-[#1E3A8A] rounded-2xl p-5 relative overflow-hidden">
            <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/5 rounded-full pointer-events-none" />
            <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-white/5 rounded-full pointer-events-none" />
            <h2 className="text-sm font-bold text-white mb-1 relative z-10">Quick Actions</h2>
            <p className="text-white/50 text-xs mb-4 relative z-10">Common management tasks</p>
            <div className="space-y-2 relative z-10">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Link
                    key={action.to}
                    to={action.to}
                    className="flex items-center gap-3 p-3 rounded-xl bg-white/8 hover:bg-white/15 border border-white/10 transition-all group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#10B981] flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white group-hover:translate-x-0.5 transition-transform">{action.label}</p>
                      <p className="text-xs text-white/40">{action.desc}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Booking summary */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="text-sm font-bold text-[#1E3A8A] mb-4">Booking Summary</h3>
            <div className="space-y-3">
              {[
                { label: 'Confirmed', value: stats.confirmedBookings, color: 'bg-emerald-500' },
                { label: 'Pending', value: stats.pendingBookings, color: 'bg-amber-400' },
                { label: 'Total', value: stats.totalBookings, color: 'bg-[#1E3A8A]' },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3">
                  <div className={`w-2.5 h-2.5 rounded-full ${item.color} flex-shrink-0`} />
                  <span className="text-xs text-gray-500 flex-1">{item.label}</span>
                  <span className="text-sm font-bold text-[#1E3A8A]">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
