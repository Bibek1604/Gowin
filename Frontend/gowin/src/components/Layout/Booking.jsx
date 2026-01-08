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
    <section className="py-16 px-4 md:px-6 bg-gradient-to-br from-teal-50 via-blue-50 to-white min-h-screen">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center mb-4">
            <div className="p-3 rounded-full" style={{ background: colors.gradients.primary }}>
              <MapPin className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight mb-2">Book Your Adventure</h1>
          <p className="text-lg text-gray-700">
            {location.state?.destinationName 
              ? `Get ready to explore ${location.state.destinationName}!` 
              : "Fill in your details to start your journey!"}
          </p>
          {location.state?.destinationName && (
            <motion.p 
              className="mt-3 inline-block px-4 py-2 rounded-full text-sm font-semibold"
              style={{ background: colors.gradients.warm, color: 'white' }}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              ✓ Destination Selected: {location.state.destinationName}
            </motion.p>
          )}
        </motion.div>

        {/* Booking Form */}
        <motion.form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl shadow-xl p-8 md:p-10 border border-teal-100/50 hover:shadow-2xl transition duration-300"
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
                  className={`w-full p-4 pl-12 rounded-xl border ${errors.name ? "border-red-400 bg-red-50" : "border-teal-200 bg-white"} focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition duration-300`}
                  placeholder="Enter your full name"
                />
                <Users className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-teal-500" />
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
                  className={`w-full p-4 pl-12 rounded-xl border ${errors.email ? "border-red-400 bg-red-50" : "border-teal-200 bg-white"} focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition duration-300`}
                  placeholder="Enter your email"
                />
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-teal-500" />
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
                  className={`w-full p-4 pl-12 rounded-xl border ${errors.phone ? "border-red-400 bg-red-50" : "border-teal-200 bg-white"} focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition duration-300`}
                  placeholder="Enter your phone number"
                />
                <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-teal-500" />
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
                  className={`w-full p-4 pl-12 rounded-xl border ${errors.address ? "border-red-400 bg-red-50" : "border-teal-200 bg-white"} focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition duration-300`}
                  placeholder="Enter your address"
                />
                <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-teal-500" />
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
                  className={`w-full p-4 pl-12 rounded-xl border ${errors.destination ? "border-red-400 bg-red-50" : "border-teal-200 bg-white"} focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition duration-300 appearance-none`}
                >
                  <option value="">Select a destination</option>
                  {places.map((place) => (
                    <option key={place.id} value={place.id}>
                      {place.placeName || place.title || "Unknown Destination"}
                    </option>
                  ))}
                </select>
                <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-teal-500 pointer-events-none" />
                <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-teal-500 pointer-events-none" />
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
                  className={`w-full p-4 pl-12 rounded-xl border ${errors.travelDate ? "border-red-400 bg-red-50" : "border-teal-200 bg-white"} focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition duration-300`}
                />
                <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-teal-500 pointer-events-none" />
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
                  className={`w-full p-4 pl-12 rounded-xl border ${errors.travelers ? "border-red-400 bg-red-50" : "border-teal-200 bg-white"} focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition duration-300`}
                  placeholder="Enter number of travelers"
                />
                <Users className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-teal-500" />
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
            className={`w-full mt-8 py-4 rounded-xl font-bold text-lg text-white transition duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 relative overflow-hidden group ${
              isSubmitting ? "opacity-75 cursor-not-allowed" : "hover:scale-105"
            }`}
            style={{ background: isSubmitting ? colors.primary.tealMuted : colors.gradients.warm }}
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
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="mt-8 bg-gradient-to-r from-teal-50 to-blue-50 rounded-3xl p-8 text-center border border-teal-300 shadow-xl"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex justify-center mb-4"
              >
                <div className="p-4 rounded-full" style={{ background: colors.gradients.primary }}>
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
              </motion.div>
              <h2 className="text-3xl font-bold text-teal-700 mb-3 tracking-tight">Booking Confirmed! 🎉</h2>
              <p className="text-gray-700 text-lg mb-6">
                Thank you, <span className="font-bold">{formData.name || "Traveler"}</span>! Your adventure to{" "}
                <span className="font-bold">{places.find((p) => p.id === formData.destination)?.placeName || "your destination"}</span> is booked.
              </p>
              <p className="text-gray-600 mb-8">
                We'll send a confirmation email to <span className="font-semibold">{formData.email || "your email"}</span>
              </p>
              <div className="space-y-3 text-left bg-white rounded-xl p-4 mb-6 border border-teal-200">
                <div className="flex items-center text-gray-700">
                  <CheckCircle className="w-5 h-5 text-teal-600 mr-3" />
                  <span>Booking Date: {formData.travelDate || "TBD"}</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <CheckCircle className="w-5 h-5 text-teal-600 mr-3" />
                  <span>Travelers: {formData.travelers}</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <CheckCircle className="w-5 h-5 text-teal-600 mr-3" />
                  <span>Reference: #{new Date().getTime()}</span>
                </div>
              </div>
              <motion.button
                onClick={() => setShowConfirmation(false)}
                className="bg-teal-600 text-white py-3 px-8 rounded-full font-semibold text-lg hover:bg-teal-700 transition duration-300 shadow-lg hover:shadow-xl inline-block"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Done
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}

export default Booking