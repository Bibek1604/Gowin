import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import usePlaceStore from '../Store/PlaceStore';
import useBookingStore from '../Store/BookingStore';
import useCategoryStore from '../Store/CategoryStore';
import { Map, Calendar, Tags, DollarSign, TrendingUp, User, ListPlus, Activity, Star, Mail, Users } from 'lucide-react';

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
    const totalRevenue = bookings.reduce((sum, b) => sum + (parseFloat(b.amount) || 0), 0);
    const recentBookings = bookings.slice(-5).reverse();

    return {
      totalPlaces: places.length,
      totalBookings: bookings.length,
      totalCategories: categories.length,
      totalRevenue,
      recentBookings,
    };
  }, [places, bookings, categories]);

  const statCards = [
    { title: 'Total Places', value: stats.totalPlaces, icon: <Map className="w-6 h-6" />, color: 'text-[#0F4C5C]', bg: 'bg-[#0F4C5C]/10', trend: '+12%' },
    { title: 'Total Bookings', value: stats.totalBookings, icon: <Calendar className="w-6 h-6" />, color: 'text-[#FF7F50]', bg: 'bg-[#FF7F50]/10', trend: '+23%' },
    { title: 'New Messages', value: messagesCount, icon: <Mail className="w-6 h-6" />, color: 'text-[#2A9D8F]', bg: 'bg-[#2A9D8F]/10', trend: 'Live' },
    { title: 'Subscribers', value: subscribersCount, icon: <Users className="w-6 h-6" />, color: 'text-[#0F4C5C]', bg: 'bg-[#0F4C5C]/10', trend: '+10%' },
  ];

  return (
    <div className="min-h-screen bg-transparent p-12 font-sans">
      
      {/* Header */}
      <div className="mb-12 flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#0F4C5C] mb-2 tracking-tight">Overview</h1>
          <p className="text-gray-500 text-lg">Performance insights for Gowin Travels</p>
        </div>
        <div className="flex bg-white rounded-2xl p-1.5 border border-gray-100 shadow-sm">
           <button className="px-6 py-2 rounded-xl font-bold text-sm bg-[#0F4C5C] text-white shadow-md">Realtime</button>
           <div className="px-6 py-2 rounded-xl font-bold text-sm text-[#2A9D8F] flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-[#2A9D8F] animate-pulse" />
             Live Monitoring
           </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-[2rem] p-8 shadow-[0_4px_25px_rgb(0,0,0,0.02)] border border-gray-100 flex items-center justify-between group hover:-translate-y-1 transition-all duration-500">
            <div>
              <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-2">{stat.title}</p>
              <h3 className="text-3xl font-extrabold text-[#0F4C5C] mb-2">{stat.value}</h3>
              <div className="flex items-center gap-1 text-xs font-bold text-[#2A9D8F] bg-[#2A9D8F]/10 px-2 py-1 rounded-md w-fit">
                <TrendingUp className="w-3 h-3" />
                <span>{stat.trend}</span>
              </div>
            </div>
            <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center ${stat.bg} ${stat.color} group-hover:rotate-12 transition-all duration-500`}>
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Recent Bookings */}
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-10 shadow-[0_4px_25px_rgb(0,0,0,0.02)] border border-gray-100 flex flex-col min-h-[500px]">
          <div className="flex justify-between items-center mb-10">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-[#FF7F50]">
                  <Activity className="w-5 h-5" />
               </div>
               <h2 className="text-xl font-bold text-[#0F4C5C]">Recent Bookings</h2>
            </div>
            <Link to="/admin/add-booking" className="text-[#FF7F50] font-bold text-sm hover:underline flex items-center gap-1 group">
               View All Bookings <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>

          <div className="space-y-4 flex-1">
            {stats.recentBookings.length > 0 ? (
              stats.recentBookings.map((booking, index) => {
                const place = places.find(p => p.id === (booking.tour_id || booking.placeId));
                return (
                  <div key={index} className="flex items-center justify-between p-5 rounded-3xl bg-gray-50/50 hover:bg-white hover:shadow-lg hover:shadow-gray-200/40 border border-transparent hover:border-gray-100 transition-all duration-300">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-[#0F4C5C] font-bold text-lg border border-gray-50">
                        {booking.user_name?.[0] || booking.name?.[0] || 'T'}
                      </div>
                      <div>
                        <h4 className="font-bold text-[#0F4C5C]">{booking.user_name || booking.name || 'Anonymous Traveler'}</h4>
                        <div className="flex items-center gap-2 text-xs text-gray-400 mt-1 font-medium">
                           <span className="flex items-center gap-1"><Map className="w-3 h-3" /> {place?.title || 'Unknown Place'}</span>
                           <span>•</span>
                           <span>{booking.travel_date || booking.travelDate || 'Date N/A'}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-extrabold text-[#0F4C5C] text-lg">${booking.amount || '0'}</p>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#2A9D8F] bg-[#2A9D8F]/10 px-3 py-1 rounded-full mt-1 inline-block">
                        Paid
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center py-20 bg-gray-50/50 rounded-[2rem] border border-dashed border-gray-200">
                <Calendar className="w-16 h-16 text-gray-200 mb-4" />
                <p className="text-gray-400 font-medium">No bookings recorded yet.</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-8">
          <div className="bg-[#0F4C5C] rounded-[2.5rem] p-10 shadow-xl shadow-[#0F4C5C]/20 relative overflow-hidden">
             {/* Decorative circles */}
             <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full" />
             <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-white/5 rounded-full" />
             
             <h2 className="text-xl font-bold text-white mb-2 relative z-10">Administrative</h2>
             <p className="text-white/60 text-sm mb-8 relative z-10">Quick access to management tools</p>
             
             <div className="grid grid-cols-1 gap-4 relative z-10">
                <Link to="/admin/add-place" className="flex items-center gap-4 p-4 rounded-2xl bg-white/10 hover:bg-white/20 transition-all border border-white/10 group">
                   <div className="w-10 h-10 rounded-xl bg-[#FF7F50] flex items-center justify-center text-white shadow-lg shadow-[#FF7F50]/20">
                      <ListPlus className="w-5 h-5" />
                   </div>
                   <span className="font-bold text-white group-hover:translate-x-1 transition-transform">Create Package</span>
                </Link>
                <Link to="/admin/messages" className="flex items-center gap-4 p-4 rounded-2xl bg-white/10 hover:bg-white/20 transition-all border border-white/10 group">
                   <div className="w-10 h-10 rounded-xl bg-[#2A9D8F] flex items-center justify-center text-white shadow-lg shadow-[#2A9D8F]/20">
                      <Mail className="w-5 h-5" />
                   </div>
                   <span className="font-bold text-white group-hover:translate-x-1 transition-transform">Read Messages</span>
                </Link>
                <Link to="/admin/subscribers" className="flex items-center gap-4 p-4 rounded-2xl bg-white/10 hover:bg-white/20 transition-all border border-white/10 group">
                   <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#0F4C5C]">
                      <Users className="w-5 h-5" />
                   </div>
                   <span className="font-bold text-white group-hover:translate-x-1 transition-transform">Email List</span>
                </Link>
             </div>
          </div>

          <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm text-center">
             <div className="w-16 h-16 bg-[#2A9D8F]/10 rounded-full flex items-center justify-center text-[#2A9D8F] mx-auto mb-4">
                <TrendingUp className="w-8 h-8" />
             </div>
             <h4 className="font-bold text-[#0F4C5C] mb-1">High Conversion</h4>
             <p className="text-xs text-gray-400">Your site traffic is up by 15% this week.</p>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;