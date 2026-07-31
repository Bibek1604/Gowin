import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Trash2, MapPin, Calendar, Users, Mail, Phone,
  DollarSign, Search, CheckCircle, Clock, XCircle, Filter
} from "lucide-react";
import useBookingStore from "../Store/BookingStore";
import usePlaceStore from "../Store/PlaceStore";
import toast, { Toaster } from "react-hot-toast";

const statusConfig = {
  Confirmed: { color: 'text-emerald-600 bg-emerald-50 border-emerald-200', icon: <CheckCircle className="w-3 h-3" /> },
  Cancelled: { color: 'text-red-500 bg-red-50 border-red-200', icon: <XCircle className="w-3 h-3" /> },
  Pending: { color: 'text-amber-600 bg-amber-50 border-amber-200', icon: <Clock className="w-3 h-3" /> },
};

function ManageBookings() {
  const { bookings, deleteBooking, fetchBookings, updateBookingStatus, isLoading } = useBookingStore();
  const { places, fetchPlaces } = usePlaceStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  useEffect(() => {
    fetchBookings();
    fetchPlaces();
  }, [fetchBookings, fetchPlaces]);

  const getPlaceName = (tourId) => {
    if (!tourId || !places?.length) return 'Unknown Destination';
    const place = places.find(p => String(p.id) === String(tourId));
    return place?.title || 'Unknown Destination';
  };

  const handleDelete = async (id) => {
    const result = await deleteBooking(id);
    if (result?.success) {
      toast.success('Booking deleted');
      setDeleteConfirmId(null);
    } else {
      toast.error('Delete failed');
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    const res = await updateBookingStatus(id, newStatus);
    if (res.success) toast.success(`Status updated to ${newStatus}`);
    else toast.error('Update failed');
  };

  const filteredBookings = bookings.filter(b => {
    const matchesSearch =
      (b.user_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.user_email || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'All' || b.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const statusCounts = {
    Pending: bookings.filter(b => b.status === 'Pending').length,
    Confirmed: bookings.filter(b => b.status === 'Confirmed').length,
    Cancelled: bookings.filter(b => b.status === 'Cancelled').length,
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 min-h-screen font-sans">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1E3A8A] tracking-tight">Manage Bookings</h1>
          <p className="text-gray-500 text-sm mt-0.5">Track and manage all customer reservations</p>
        </div>
        <div className="flex items-center gap-2">
          {Object.entries(statusCounts).map(([status, count]) => (
            <div key={status} className={`text-center px-3 py-2 rounded-xl border text-xs ${statusConfig[status]?.color}`}>
              <div className="font-bold text-base leading-none">{count}</div>
              <div className="font-medium mt-0.5">{status}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-3 flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search by name or email..."
            className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981]/20 focus:border-[#10B981]/40 transition-all"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          {['All', 'Pending', 'Confirmed', 'Cancelled'].map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                filterStatus === status
                  ? 'bg-[#1E3A8A] text-white shadow-sm'
                  : 'bg-gray-50 text-gray-500 border border-gray-100 hover:text-[#1E3A8A]'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings Table */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="bg-white rounded-xl h-16 animate-pulse border border-gray-100" />
          ))}
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-2xl border border-gray-100">
          <Filter className="w-12 h-12 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-400 font-medium">No bookings match your criteria.</p>
          <p className="text-gray-300 text-xs mt-1">Try adjusting your filters or search term.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Table header */}
          <div className="hidden md:grid grid-cols-[1fr_1.5fr_1fr_1fr_auto_auto] gap-4 px-5 py-3 bg-gray-50/80 border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
            <span>Customer</span>
            <span>Destination</span>
            <span>Travel Date</span>
            <span>Status</span>
            <span>Actions</span>
            <span></span>
          </div>

          <div className="divide-y divide-gray-50">
            <AnimatePresence>
              {filteredBookings.map(booking => {
                const status = booking.status || 'Pending';
                const cfg = statusConfig[status] || statusConfig.Pending;
                return (
                  <motion.div
                    key={booking.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col md:grid md:grid-cols-[1fr_1.5fr_1fr_1fr_auto_auto] gap-3 md:gap-4 px-5 py-4 hover:bg-gray-50/50 transition-colors"
                  >
                    {/* Customer */}
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 bg-[#1E3A8A]/5 rounded-lg flex items-center justify-center text-[#1E3A8A] font-bold text-xs flex-shrink-0">
                        {(booking.user_name?.[0] || 'T').toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-[#1E3A8A] truncate">{booking.user_name || 'Traveler'}</p>
                        <p className="text-xs text-gray-400 truncate">{booking.user_email || ''}</p>
                        {booking.phone && (
                          <p className="text-xs text-gray-400 truncate flex items-center gap-1 mt-0.5">
                            <Phone className="w-3 h-3 flex-shrink-0" /> {booking.phone}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Destination */}
                    <div className="flex items-center gap-1.5 text-sm text-gray-600 min-w-0">
                      <MapPin className="w-3.5 h-3.5 text-[#10B981] flex-shrink-0" />
                      <span className="truncate">{getPlaceName(booking.tour_id)}</span>
                    </div>

                    {/* Date */}
                    <div className="flex items-center gap-1.5 text-sm text-gray-600">
                      <Calendar className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                      {booking.travel_date || 'TBD'}
                    </div>

                    {/* Status */}
                    <div>
                      <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1 rounded-full border ${cfg.color}`}>
                        {cfg.icon}
                        {status}
                      </span>
                    </div>

                    {/* Status actions */}
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleStatusUpdate(booking.id, 'Confirmed')}
                        className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 hover:bg-emerald-500 hover:text-white px-2.5 py-1.5 rounded-lg transition-colors border border-emerald-200"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(booking.id, 'Cancelled')}
                        className="text-[10px] font-semibold text-red-500 bg-red-50 hover:bg-red-500 hover:text-white px-2.5 py-1.5 rounded-lg transition-colors border border-red-200"
                      >
                        Cancel
                      </button>
                    </div>

                    {/* Delete */}
                    <button
                      onClick={() => setDeleteConfirmId(booking.id)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg text-red-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Delete Confirm Dialog */}
      <AnimatePresence>
        {deleteConfirmId && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setDeleteConfirmId(null)}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-sm bg-white rounded-2xl shadow-xl p-6 text-center"
            >
              <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-3">
                <Trash2 className="w-5 h-5 text-red-500" />
              </div>
              <h3 className="text-base font-bold text-[#1E3A8A] mb-1">Delete Booking?</h3>
              <p className="text-sm text-gray-500 mb-5">This action cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteConfirmId(null)} className="flex-1 py-2.5 text-sm font-semibold text-gray-500 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors">Cancel</button>
                <button onClick={() => handleDelete(deleteConfirmId)} className="flex-1 py-2.5 text-sm font-semibold text-white bg-red-500 rounded-xl hover:bg-red-600 transition-colors">Delete</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ManageBookings;
