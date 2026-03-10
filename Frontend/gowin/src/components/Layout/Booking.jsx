"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Calendar, Users, MapPin, Mail, Phone, ChevronDown, CheckCircle } from "lucide-react"
import usePlaceStore from "../Store/PlaceStore" // Adjust path as needed
import useBookingStore from "../Store/BookingStore" // Adjust path as needed
import React from "react"
import { Link, useLocation } from "react-router-dom"
import { v4 as uuidv4 } from "uuid" // Add uuid for generating booking IDs
import colors from "../../theme/colors"

function Booking() {
  const { places } = usePlaceStore()
  const { addBooking } = useBookingStore()
  const location = useLocation()

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    destination: location.state?.preFilledDestination || "",
    travelDate: "",
    travelers: 1,
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: "" }))
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = "Name is required"
    if (!formData.email.trim()) newErrors.email = "Email is required"
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email format"
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required"
    if (!formData.address.trim()) newErrors.address = "Address is required"
    if (!formData.destination) newErrors.destination = "Please select a destination"
    if (!formData.travelDate) newErrors.travelDate = "Travel date is required"
    if (formData.travelers < 1) newErrors.travelers = "At least one traveler is required"
    return newErrors
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const validationErrors = validateForm()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return ('/')
    }

    setIsSubmitting(true)
    // Create booking object with unique ID
    const booking = {
      bookingId: uuidv4(),
      ...formData,
    }

    // Add booking to store
    addBooking(booking)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setShowConfirmation(true)
      setFormData({
        name: "",
        email: "",
        phone: "",
        address: "",
        destination: "",
        travelDate: "",
        travelers: 1,
      })
    }, 1500)
  }

  return (
    <section
      className="py-20 px-4 md:px-6 min-h-screen"
      style={{ background: colors.neutral.offWhite, fontFamily: 'Outfit, sans-serif' }}
    >
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1
            className="text-4xl sm:text-6xl font-bold uppercase tracking-tight mb-4"
            style={{ color: colors.primary.navy }}
          >
            Start Your Journey
          </h1>
          <p className="text-sm uppercase tracking-widest opacity-60" style={{ color: colors.primary.navy }}>
            {location.state?.destinationName
              ? `Booking for ${location.state.destinationName}`
              : "Reservation Form"}
          </p>
        </motion.div>

        {/* Booking Form */}
        <motion.form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-sm p-8 md:p-12 border border-slate-200"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <motion.div
              className="col-span-1 md:col-span-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <label className="block text-gray-900 font-semibold mb-3" htmlFor="name">
                Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full p-4 rounded-xl border ${errors.name ? "border-red-400 bg-red-50" : "border-slate-200 bg-slate-50"} focus:outline-none focus:ring-1 focus:ring-sky-500 transition-all`}
                  placeholder="e.g. John Doe"
                />
              </div>
              {errors.name && (
                <motion.p
                  className="text-red-500 text-sm mt-2 flex items-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {errors.name}
                </motion.p>
              )}
            </motion.div>

            {/* Email */}
            <motion.div
              className="col-span-1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              <label className="block text-gray-900 font-semibold mb-3" htmlFor="email">
                Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full p-4 rounded-xl border ${errors.email ? "border-red-400 bg-red-50" : "border-slate-200 bg-slate-50"} focus:outline-none focus:ring-1 focus:ring-sky-500 transition-all`}
                  placeholder="email@example.com"
                />
              </div>
              {errors.email && (
                <motion.p
                  className="text-red-500 text-sm mt-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {errors.email}
                </motion.p>
              )}
            </motion.div>

            {/* Phone */}
            <motion.div
              className="col-span-1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.5 }}
            >
              <label className="block text-gray-900 font-semibold mb-3" htmlFor="phone">
                Phone Number
              </label>
              <div className="relative">
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`w-full p-4 rounded-xl border ${errors.phone ? "border-red-400 bg-red-50" : "border-slate-200 bg-slate-50"} focus:outline-none focus:ring-1 focus:ring-sky-500 transition-all`}
                  placeholder="+977-..."
                />
              </div>
              {errors.phone && (
                <motion.p
                  className="text-red-500 text-sm mt-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {errors.phone}
                </motion.p>
              )}
            </motion.div>

            {/* Address */}
            <motion.div
              className="col-span-1 md:col-span-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.6 }}
            >
              <label className="block text-gray-900 font-semibold mb-3" htmlFor="address">
                Address
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className={`w-full p-4 rounded-xl border ${errors.address ? "border-red-400 bg-red-50" : "border-slate-200 bg-slate-50"} focus:outline-none focus:ring-1 focus:ring-sky-500 transition-all`}
                  placeholder="Your Residence Address"
                />
              </div>
              {errors.address && (
                <motion.p
                  className="text-red-500 text-sm mt-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {errors.address}
                </motion.p>
              )}
            </motion.div>

            {/* Destination */}
            <motion.div
              className="col-span-1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.7 }}
            >
              <label className="block text-gray-900 font-semibold mb-3" htmlFor="destination">
                Destination
              </label>
              <div className="relative">
                <select
                  id="destination"
                  name="destination"
                  value={formData.destination}
                  onChange={handleInputChange}
                  className={`w-full p-4 rounded-xl border ${errors.destination ? "border-red-400 bg-red-50" : "border-slate-200 bg-slate-50"} focus:outline-none focus:ring-1 focus:ring-sky-500 transition-all appearance-none`}
                >
                  <option value="">Choose Destination</option>
                  {places.map((place) => (
                    <option key={place.id} value={place.id}>
                      {place.placeName || place.title || "Unknown Destination"}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 opacity-30 pointer-events-none" />
              </div>
              {errors.destination && (
                <motion.p
                  className="text-red-500 text-sm mt-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {errors.destination}
                </motion.p>
              )}
            </motion.div>

            {/* Travel Date */}
            <motion.div
              className="col-span-1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.8 }}
            >
              <label className="block text-gray-900 font-semibold mb-3" htmlFor="travelDate">
                Travel Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  id="travelDate"
                  name="travelDate"
                  value={formData.travelDate}
                  onChange={handleInputChange}
                  className={`w-full p-4 rounded-xl border ${errors.travelDate ? "border-red-400 bg-red-50" : "border-slate-200 bg-slate-50"} focus:outline-none focus:ring-1 focus:ring-sky-500 transition-all`}
                />
              </div>
              {errors.travelDate && (
                <motion.p
                  className="text-red-500 text-sm mt-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {errors.travelDate}
                </motion.p>
              )}
            </motion.div>

            {/* Number of Travelers */}
            <motion.div
              className="col-span-1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.9 }}
            >
              <label className="block text-gray-900 font-semibold mb-3" htmlFor="travelers">
                Number of Travelers
              </label>
              <div className="relative">
                <input
                  type="number"
                  id="travelers"
                  name="travelers"
                  value={formData.travelers}
                  onChange={handleInputChange}
                  min="1"
                  className={`w-full p-4 rounded-xl border ${errors.travelers ? "border-red-400 bg-red-50" : "border-slate-200 bg-slate-50"} focus:outline-none focus:ring-1 focus:ring-sky-500 transition-all`}
                />
              </div>
              {errors.travelers && (
                <motion.p
                  className="text-red-500 text-sm mt-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {errors.travelers}
                </motion.p>
              )}
            </motion.div>
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={isSubmitting}
            className={`w-full mt-12 py-5 rounded-xl font-bold uppercase tracking-widest text-white transition-all shadow-lg active:scale-95 ${isSubmitting ? "opacity-75 cursor-not-allowed" : "hover:brightness-110"
              }`}
            style={{ background: isSubmitting ? colors.neutral.gray : colors.accent.orange }}
            whileHover={{ scale: isSubmitting ? 1 : 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 1 }}
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                <span>Processing...</span>
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                <span>Confirm Booking</span>
              </>
            )}
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition duration-300" />
          </motion.button>
        </motion.form>

        {/* Confirmation Message */}
        <AnimatePresence>
          {showConfirmation && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="mt-12 bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-2xl"
            >
              <h2
                className="text-3xl font-bold uppercase tracking-tight mb-4"
                style={{ color: colors.primary.navy }}
              >
                Booking Success
              </h2>
              <p className="text-slate-600 mb-10">
                Your reservation has been received. Our team will contact you shortly via <span className="font-bold text-slate-900">{formData.email}</span>.
              </p>
              <button
                onClick={() => setShowConfirmation(false)}
                className="bg-slate-900 text-white py-4 px-12 rounded-xl font-bold uppercase tracking-widest text-sm hover:bg-black transition-all"
              >
                Return Home
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}

export default Booking