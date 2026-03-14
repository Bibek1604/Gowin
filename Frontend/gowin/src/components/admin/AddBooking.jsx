import React, { useEffect, useState } from "react"
import { Trash2, MapPin, Calendar, Users, Mail, Phone, DollarSign, Search, CheckCircle, Clock, XCircle, Filter } from "lucide-react"
import useBookingStore from "../Store/BookingStore"
import usePlaceStore from "../Store/PlaceStore"
import toast, { Toaster } from "react-hot-toast"
import { motion, AnimatePresence } from "framer-motion"

function ManageBookings() {
  const { bookings, deleteBooking, fetchBookings, updateBookingStatus, isLoading } = useBookingStore()
  const { places, fetchPlaces } = usePlaceStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('All')

  useEffect(() => {
    fetchBookings()
    fetchPlaces()
  }, [fetchBookings, fetchPlaces])

  const getPlaceName = (tourId) => {
    if (!tourId || !places?.length) return "Unknown Destination"
    const place = places.find((p) => String(p.id) === String(tourId))
    return place?.title || place?.placeName || "Unknown Destination"
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this booking permanentally?")) return
    const result = await deleteBooking(id)
    if (result?.success) {
      toast.success("Booking expunged")
    } else {
      toast.error("Deletion failed")
    }
  }

  const handleStatusUpdate = async (id, newStatus) => {
    const res = await updateBookingStatus(id, newStatus)
    if (res.success) toast.success(`Status updated to ${newStatus}`)
    else toast.error('Status update failed')
  }

  const statusConfig = {
    'Confirmed': { color: 'text-[#FF7F50] bg-[#FF7F50]/10', icon: <CheckCircle className="w-3 h-3" /> },
    'Cancelled': { color: 'text-red-500 bg-red-50', icon: <XCircle className="w-3 h-3" /> },
    'Pending': { color: 'text-[#FF7F50] bg-[#FF7F50]/10', icon: <Clock className="w-3 h-3" /> }
  }

  const filteredBookings = bookings.filter(b => {
    const matchesSearch = (b.user_name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (b.user_email || '').toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === 'All' || b.status === filterStatus
    return matchesSearch && matchesFilter
  })

  return (
    <div className="p-12 bg-[#F8FAFB] min-h-screen font-sans">
      <Toaster position="top-right" />
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-16 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-2">
             <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#0F4C5C]/5 text-[#0F4C5C] rounded-full text-[10px] font-bold uppercase tracking-[0.2em] mb-4 border border-[#0F4C5C]/10">
                <Calendar className="w-4 h-4" /> Reservation Registry
             </div>
            <h1 className="text-5xl font-extrabold text-[#0F4C5C] tracking-tighter">Travel Odyssey <span className="text-[#FF7F50]">Bookings.</span></h1>
            <p className="text-gray-400 font-medium">Oversee the status and details of every globetrotter's journey.</p>
          </div>
          <div className="bg-white rounded-[2rem] border border-gray-100 px-10 py-6 shadow-[0_10px_40px_rgba(0,0,0,0.02)] flex flex-col items-center">
            <span className="text-4xl font-black text-[#0F4C5C] leading-none">{bookings.length}</span>
            <span className="text-gray-400 text-[10px] uppercase font-bold tracking-widest mt-2">Active Orders</span>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col md:flex-row gap-4 mb-10 items-center">
           <div className="relative flex-1 group w-full">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 w-5 h-5 group-focus-within:text-[#FF7F50] transition-colors" />
              <input 
                type="text" 
                placeholder="Search by traveller name or email..." 
                className="w-full pl-16 pr-8 py-5 bg-white border border-gray-100 rounded-[1.5rem] focus:outline-none focus:ring-2 focus:ring-[#FF7F50]/10 transition-all font-medium text-[#0F4C5C]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>
           <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 no-scrollbar">
              {['All', 'Pending', 'Confirmed', 'Cancelled'].map(status => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-6 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all whitespace-nowrap
                    ${filterStatus === status 
                      ? 'bg-[#0F4C5C] text-white shadow-xl shadow-[#0F4C5C]/20' 
                      : 'bg-white text-gray-400 border border-gray-50 hover:bg-gray-50'
                    }`}
                >
                  {status}
                </button>
              ))}
           </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-[2.5rem] h-80 animate-pulse border border-gray-50" />
            ))}
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="text-center py-32 bg-white rounded-[4rem] border border-gray-100 shadow-[0_20px_60px_rgba(0,0,0,0.02)]">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8">
               <Filter className="w-10 h-10 text-gray-200" />
            </div>
            <p className="text-[#0F4C5C] text-2xl font-bold">No bookings match your criteria.</p>
            <p className="text-gray-400 font-medium mt-2 max-w-sm mx-auto">Try adjusting your filters or search term to discover the hidden records.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {filteredBookings.map((booking) => (
                <motion.div
                  key={booking.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-white rounded-[3rem] border border-gray-50 shadow-[0_10px_50px_rgba(0,0,0,0.02)] overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group relative"
                >
                  {/* Card Header */}
                  <div className="p-8 border-b border-gray-50 bg-[#F8FAFB]/50 flex justify-between items-start">
                    <div className="space-y-1">
                      <h3 className="text-xl font-extrabold text-[#0F4C5C] tracking-tight truncate max-w-[180px]">
                         {booking.user_name || "Anonymous Guest"}
                      </h3>
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${statusConfig[booking.status || 'Pending'].color}`}>
                        {statusConfig[booking.status || 'Pending'].icon}
                        {booking.status || 'Pending'}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(booking.id)}
                      className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-red-500 shadow-sm border border-red-50 hover:bg-red-500 hover:text-white transition-all transform hover:rotate-12"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Card Body */}
                  <div className="p-8 space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-[1.25rem] bg-[#0F4C5C]/5 flex items-center justify-center text-[#0F4C5C] shrink-0 transform group-hover:scale-110 transition-transform">
                        <Mail className="w-5 h-5" />
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none mb-1">Traveller Email</p>
                        <p className="text-[#0F4C5C] font-extrabold truncate text-sm">{booking.user_email || "N/A"}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-[1.25rem] bg-[#FF7F50]/10 flex items-center justify-center text-[#FF7F50] shrink-0 transform group-hover:scale-110 transition-transform">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-[10px] text-[#FF7F50] font-bold uppercase tracking-widest leading-none mb-1">Destination</p>
                        <p className="text-[#0F4C5C] font-extrabold truncate text-sm">{getPlaceName(booking.tour_id)}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6 pt-2">
                      <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-50">
                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5" /> Dept. Date
                        </p>
                        <p className="text-[#0F4C5C] font-black text-sm">{booking.travel_date || "TBD"}</p>
                      </div>
                      <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-50">
                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                          <Users className="w-3.5 h-3.5" /> Party Size
                        </p>
                        <p className="text-[#0F4C5C] font-black text-sm">{booking.num_people || "0"} Travellers</p>
                      </div>
                    </div>

                    {/* Quick Status Update */}
                    <div className="pt-6 border-t border-gray-50 flex gap-2">
                       <button 
                         onClick={() => handleStatusUpdate(booking.id, 'Confirmed')}
                         className="flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl border border-[#FF7F50]/20 text-[#FF7F50] hover:bg-[#FF7F50] hover:text-white transition-all shadow-sm"
                       >
                          Confirm
                       </button>
                       <button 
                         onClick={() => handleStatusUpdate(booking.id, 'Cancelled')}
                         className="flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl border border-red-100 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm"
                       >
                          Cancel
                       </button>
                    </div>
                  </div>
                  
                  {/* Bottom Footer Info */}
                  <div className="px-8 py-5 bg-[#0F4C5C] flex justify-between items-center transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                     <span className="text-white/60 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5" /> {booking.phone || "No Phone"}
                     </span>
                     <div className="flex items-center gap-1.5 text-white font-black">
                        <DollarSign className="w-4 h-4 text-[#FF7F50]" />
                        <span className="text-xl">Paid</span>
                     </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  )
}

export default ManageBookings;