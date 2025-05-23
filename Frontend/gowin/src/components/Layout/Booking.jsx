"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Calendar, Users, MapPin, Mail, Phone, ChevronDown } from "lucide-react"
import usePlaceStore from "../Store/PlaceStore" // Adjust path as needed
import useBookingStore from "../Store/BookingStore" // Adjust path as needed
import React from "react"
import { Link } from "react-router-dom"
import { v4 as uuidv4 } from "uuid" // Add uuid for generating booking IDs

function Booking() {
  const { places } = usePlaceStore()
  const { addBooking } = useBookingStore()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    destination: "",
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
    <section className="py-16 px-6 bg-gradient-to-br from-teal-50 via-blue-50 to-white min-h-screen">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Book Your Adventure</h1>
          <p className="text-lg text-gray-700 mt-3">Fill in your details to start your journey!</p>
          <Link
            to="/admin"
            className="mt-4 inline-block bg-teal-600 text-white py-3 px-8 rounded-full font-semibold text-lg hover:bg-teal-700 transition duration-300 shadow-lg"
          >
            View Admin Panel
          </Link>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl shadow-xl p-8 border border-teal-100/50"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        >
          {/* Name */}
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <label className="block text-gray-900 font-semibold mb-2" htmlFor="name">
              Full Name
            </label>
            <div className="relative">
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full p-4 rounded-lg border ${errors.name ? "border-red-400" : "border-teal-200"} focus:outline-none focus:ring-2 focus:ring-teal-500 transition duration-300`}
                placeholder="Enter your full name"
              />
              <Users className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-teal-500" />
            </div>
            {errors.name && (
              <motion.p
                className="text-red-500 text-sm mt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {errors.name}
              </motion.p>
            )}
          </motion.div>

          {/* Email */}
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            <label className="block text-gray-900 font-semibold mb-2" htmlFor="email">
              Email
            </label>
            <div className="relative">
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full p-4 rounded-lg border ${errors.email ? "border-red-400" : "border-teal-200"} focus:outline-none focus:ring-2 focus:ring-teal-500 transition duration-300`}
                placeholder="Enter your email"
              />
              <Mail className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-teal-500" />
            </div>
            {errors.email && (
              <motion.p
                className="text-red-500 text-sm mt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {errors.email}
              </motion.p>
            )}
          </motion.div>

          {/* Phone */}
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
          >
            <label className="block text-gray-900 font-semibold mb-2" htmlFor="phone">
              Phone Number
            </label>
            <div className="relative">
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className={`w-full p-4 rounded-lg border ${errors.phone ? "border-red-400" : "border-teal-200"} focus:outline-none focus:ring-2 focus:ring-teal-500 transition duration-300`}
                placeholder="Enter your phone number"
              />
              <Phone className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-teal-500" />
            </div>
            {errors.phone && (
              <motion.p
                className="text-red-500 text-sm mt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {errors.phone}
              </motion.p>
            )}
          </motion.div>

          {/* Address */}
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.6 }}
          >
            <label className="block text-gray-900 font-semibold mb-2" htmlFor="address">
              Address
            </label>
            <div className="relative">
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className={`w-full p-4 rounded-lg border ${errors.address ? "border-red-400" : "border-teal-200"} focus:outline-none focus:ring-2 focus:ring-teal-500 transition duration-300`}
                placeholder="Enter your address"
              />
              <MapPin className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-teal-500" />
            </div>
            {errors.address && (
              <motion.p
                className="text-red-500 text-sm mt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {errors.address}
              </motion.p>
            )}
          </motion.div>

          {/* Destination */}
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.7 }}
          >
            <label className="block text-gray-900 font-semibold mb-2" htmlFor="destination">
              Destination
            </label>
            <div className="relative">
              <select
                id="destination"
                name="destination"
                value={formData.destination}
                onChange={handleInputChange}
                className={`w-full p-4 rounded-lg border ${errors.destination ? "border-red-400" : "border-teal-200"} focus:outline-none focus:ring-2 focus:ring-teal-500 transition duration-300 appearance-none bg-white`}
              >
                <option value="">Select a destination</option>
                {places.map((place) => (
                  <option key={place.id} value={place.id}>
                    {place.placeName || place.title || "Unknown Destination"}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-teal-500 pointer-events-none" />
            </div>
            {errors.destination && (
              <motion.p
                className="text-red-500 text-sm mt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {errors.destination}
              </motion.p>
            )}
          </motion.div>

          {/* Travel Date */}
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.8 }}
          >
            <label className="block text-gray-900 font-semibold mb-2" htmlFor="travelDate">
              Travel Date
            </label>
            <div className="relative">
              <input
                type="date"
                id="travelDate"
                name="travelDate"
                value={formData.travelDate}
                onChange={handleInputChange}
                className={`w-full p-4 rounded-lg border ${errors.travelDate ? "border-red-400" : "border-teal-200"} focus:outline-none focus:ring-2 focus:ring-teal-500 transition duration-300`}
              />
              <Calendar className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-teal-500" />
            </div>
            {errors.travelDate && (
              <motion.p
                className="text-red-500 text-sm mt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {errors.travelDate}
              </motion.p>
            )}
          </motion.div>

          {/* Number of Travelers */}
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.9 }}
          >
            <label className="block text-gray-900 font-semibold mb-2" htmlFor="travelers">
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
                className={`w-full p-4 rounded-lg border ${errors.travelers ? "border-red-400" : "border-teal-200"} focus:outline-none focus:ring-2 focus:ring-teal-500 transition duration-300`}
                placeholder="Enter number of travelers"
              />
              <Users className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-teal-500" />
            </div>
            {errors.travelers && (
              <motion.p
                className="text-red-500 text-sm mt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {errors.travelers}
              </motion.p>
            )}
          </motion.div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-4 rounded-full font-semibold text-lg text-white transition duration-300 shadow-lg hover:shadow-xl ${
              isSubmitting ? "bg-teal-400 cursor-not-allowed" : "bg-teal-600 hover:bg-teal-700"
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 1 }}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-teal-200 mr-3"></div>
                Processing...
              </div>
            ) : (
              "Confirm Booking"
            )}
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
              className="mt-8 bg-teal-50 rounded-3xl p-6 text-center border border-teal-200"
            >
              <h2 className="text-2xl font-bold text-teal-700 mb-3">Booking Confirmed!</h2>
              <p className="text-gray-700 text-lg">
                Thank you, {formData.name || "Traveler"}! Your adventure to{" "}
                {places.find((p) => p.id === formData.destination)?.placeName || "your destination"} is booked. We'll send a confirmation to {formData.email || "your email"}.
              </p>
              <motion.button
                onClick={() => setShowConfirmation(false)}
                className="mt-6 bg-teal-600 text-white py-3 px-8 rounded-full font-semibold text-lg hover:bg-teal-700 transition duration-300 shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Close
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}

export default Booking