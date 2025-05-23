"use client"

import React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Trash2, MapPin, Calendar, Users, Mail } from "lucide-react"
import { Link } from "react-router-dom"
import useBookingStore from "../Store/BookingStore" // Adjust path based on your project structure
import usePlaceStore from "../Store/PlaceStore" // Adjust path based on your project structure

function AdminPanel() {
  const { bookings, deleteBooking } = useBookingStore()
  const { places } = usePlaceStore()

  // Helper function to get place name by ID with error handling
  const getPlaceName = (placeId) => {
    if (!placeId || !places || !Array.isArray(places)) return "Unknown Destination"
    const place = places.find((p) => p.id === placeId)
    return place ? place.placeName || place.title || "Unknown Destination" : "Unknown Destination"
  }

  return (
    <section className="py-16 px-6 bg-gradient-to-br from-teal-50 via-blue-50 to-white min-h-screen">
      <div className="max-w-3xl mx-auto">
        {/* Header with Title */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-extrabold text-teal-900 tracking-tight">Travel Bookings Admin Dashboard</h1>
          <p className="text-lg text-gray-600 mt-3">View and manage all travel bookings in one place</p>

        </motion.div>

        {/* Bookings List with Cards */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="space-y-6"
        >
          {bookings.length === 0 ? (
            <p className="text-gray-600 text-lg text-center py-8 bg-white rounded-3xl shadow-lg border border-teal-200/50">
              No bookings available at the moment.
            </p>
          ) : (
            <AnimatePresence>
              {bookings.map((booking, index) => (
                <motion.div
                  key={booking.bookingId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="bg-white rounded-3xl shadow-lg p-6 border border-teal-200/50 hover:shadow-xl transition duration-200"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold text-teal-900">{booking.name || "N/A"}</h3>
                    <motion.button
                      onClick={() => deleteBooking(booking.bookingId)}
                      className="text-red-500 hover:text-red-700 transition duration-200"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      aria-label={`Delete booking for ${booking.name || "unknown"}`}
                    >
                      <Trash2 className="w-6 h-6" />
                    </motion.button>
                  </div>
                  <div className="space-y-3 text-gray-700">
                    <p className="flex items-center">
                      <Mail className="w-5 h-5 text-teal-500 mr-3" />
                      <span className="font-medium">Email:</span>&nbsp;{booking.email || "N/A"}
                    </p>
                    <p className="flex items-center">
                      <MapPin className="w-5 h-5 text-teal-500 mr-3" />
                      <span className="font-medium">Destination:</span>&nbsp;{getPlaceName(booking.destination)}
                    </p>
                    <p className="flex items-center">
                      <Calendar className="w-5 h-5 text-teal-500 mr-3" />
                      <span className="font-medium">Travel Date:</span>&nbsp;{booking.travelDate || "N/A"}
                    </p>
                    <p className="flex items-center">
                      <Users className="w-5 h-5 text-teal-500 mr-3" />
                      <span className="font-medium">Travelers:</span>&nbsp;{booking.travelers || "N/A"}
                    </p>
                                        <p className="flex items-center">
                      <Users className="w-5 h-5 text-teal-500 mr-3" />
                      <span className="font-medium">Phone number:</span>&nbsp;{booking.phone || "N/A"}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </motion.div>
      </div>
    </section>
  )
}

export default AdminPanel