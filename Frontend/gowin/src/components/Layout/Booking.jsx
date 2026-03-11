import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Calendar, Users, MapPin, Mail, Phone, ChevronDown, CheckCircle, ArrowLeft } from "lucide-react"
import usePlaceStore from "../Store/PlaceStore"
import useBookingStore from "../Store/BookingStore"
import React from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import toast, { Toaster } from "react-hot-toast"
import colors from "../../theme/colors"

function Booking() {
  const { places, fetchPlaces } = usePlaceStore()
  const { addBooking } = useBookingStore()
  const location = useLocation()
  const navigate = useNavigate()

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

  useEffect(() => {
    fetchPlaces()
  }, [fetchPlaces])

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

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validationErrors = validateForm()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setIsSubmitting(true)

    // Construct booking object for store
    const bookingPayload = {
      tour_id: formData.destination,
      user_name: formData.name,
      user_email: formData.email,
      num_people: formData.travelers,
      travel_date: formData.travelDate,
      phone: formData.phone // Even if store doesn't explicitly map it, we send it
    }

    const res = await addBooking(bookingPayload)

    setIsSubmitting(false)
    if (res.success) {
      setShowConfirmation(true)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      toast.error("Booking failed. Please check your connection.")
    }
  }

  return (
    <section className="py-32 px-4 md:px-6 min-h-screen bg-[#F8FAFB] font-sans relative overflow-hidden">
      <Toaster position="top-right" />

      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#2A9D8F]/5 rounded-full blur-[120px] -mr-32 -mt-32" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#0F4C5C]/5 rounded-full blur-[120px] -ml-32 -mb-32" />

      <div className="max-w-6xl mx-auto relative z-10">

        {/* Navigation */}
        <Link to="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-[#0F4C5C] mb-12 font-bold transition-all hover:-translate-x-1">
          <ArrowLeft className="w-4 h-4" /> Back to Explorations
        </Link>

        {/* Header */}
        <div className="mb-16">
          <h1 className="text-5xl md:text-7xl font-black text-[#0F4C5C] mb-4 tracking-tighter">Reserve Your Trip</h1>
          <p className="text-gray-500 font-medium text-lg max-w-lg">Secure your spot for the adventure of a lifetime with Gowin's premium concierge.</p>
        </div>

        {!showConfirmation ? (
          <div className="flex flex-col lg:flex-row gap-10">
            {/* Form Card */}
            <div className="flex-1 bg-white p-10 md:p-16 rounded-[4rem] shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-gray-100">
              <form onSubmit={handleSubmit} className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-[#0F4C5C] uppercase tracking-[0.2em] pl-1">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full p-5 bg-gray-50 border ${errors.name ? 'border-red-300 ring-4 ring-red-50' : 'border-gray-100'} rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#2A9D8F]/10 focus:bg-white transition-all font-bold text-[#0F4C5C] placeholder:text-gray-300`}
                      placeholder="e.g. John Doe"
                    />
                    {errors.name && <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest pl-1">{errors.name}</p>}
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-[#0F4C5C] uppercase tracking-[0.2em] pl-1">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full p-5 bg-gray-50 border ${errors.email ? 'border-red-300 ring-4 ring-red-50' : 'border-gray-100'} rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#2A9D8F]/10 focus:bg-white transition-all font-bold text-[#0F4C5C] placeholder:text-gray-300`}
                      placeholder="john@example.com"
                    />
                    {errors.email && <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest pl-1">{errors.email}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-[#0F4C5C] uppercase tracking-[0.2em] pl-1">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`w-full p-5 bg-gray-50 border ${errors.phone ? 'border-red-300 ring-4 ring-red-50' : 'border-gray-100'} rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#2A9D8F]/10 focus:bg-white transition-all font-bold text-[#0F4C5C] placeholder:text-gray-300`}
                      placeholder="+977-..."
                    />
                    {errors.phone && <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest pl-1">{errors.phone}</p>}
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-[#0F4C5C] uppercase tracking-[0.2em] pl-1">Travelers</label>
                    <input
                      type="number"
                      name="travelers"
                      value={formData.travelers}
                      onChange={handleInputChange}
                      min="1"
                      className={`w-full p-5 bg-gray-50 border ${errors.travelers ? 'border-red-300 ring-4 ring-red-50' : 'border-gray-100'} rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#2A9D8F]/10 focus:bg-white transition-all font-bold text-[#0F4C5C]`}
                    />
                    {errors.travelers && <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest pl-1">{errors.travelers}</p>}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-[#0F4C5C] uppercase tracking-[0.2em] pl-1">Target Destination</label>
                  <div className="relative">
                    <select
                      name="destination"
                      value={formData.destination}
                      onChange={handleInputChange}
                      className={`w-full p-5 bg-gray-50 border ${errors.destination ? 'border-red-300' : 'border-gray-100'} rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#2A9D8F]/10 focus:bg-white transition-all appearance-none cursor-pointer font-bold text-[#0F4C5C]`}
                    >
                      <option value="">Select an adventure package</option>
                      {places.map((place) => (
                        <option key={place.id} value={place.id}>
                          {place.title || "Adventure Pack"}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                  </div>
                  {errors.destination && <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest pl-1">{errors.destination}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-[#0F4C5C] uppercase tracking-[0.2em] pl-1">Departure Date</label>
                    <input
                      type="date"
                      name="travelDate"
                      value={formData.travelDate}
                      onChange={handleInputChange}
                      className={`w-full p-5 bg-gray-50 border ${errors.travelDate ? 'border-red-300' : 'border-gray-100'} rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#2A9D8F]/10 focus:bg-white transition-all font-bold text-[#0F4C5C]`}
                    />
                    {errors.travelDate && <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest pl-1">{errors.travelDate}</p>}
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-[#0F4C5C] uppercase tracking-[0.2em] pl-1">Origin Address</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className={`w-full p-5 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#2A9D8F]/10 focus:bg-white transition-all font-bold text-[#0F4C5C] placeholder:text-gray-300`}
                      placeholder="Residential city, country"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#2A9D8F] text-white py-5 rounded-3xl font-black text-lg uppercase tracking-[0.2em] hover:bg-[#238b7e] transition-all shadow-2xl shadow-[#2A9D8F]/30 disabled:opacity-50 disabled:cursor-not-allowed mt-4 active:scale-95 flex items-center justify-center gap-4"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
                      Processing
                    </>
                  ) : (
                    <>
                      Confirm Reservation
                      <CheckCircle className="w-6 h-6" />
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Info Panel / Right Card */}
            <div className="lg:w-[380px] space-y-8">
              <div className="bg-white p-10 md:p-12 rounded-[3.5rem] border border-gray-100 shadow-[0_15px_60px_rgba(0,0,0,0.02)] relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#2A9D8F]/5 rounded-full -mr-16 -mt-16 blur-2xl" />

                <h4 className="text-2xl font-black text-[#0F4C5C] mb-8 relative z-10 tracking-tight">Booking Support</h4>

                <ul className="space-y-8 relative z-10">
                  <li className="flex gap-6 group/item">
                    <div className="w-12 h-12 rounded-2xl bg-[#2A9D8F]/10 flex items-center justify-center shrink-0 transition-transform group-hover/item:scale-110 group-hover/item:rotate-6">
                      <CheckCircle className="w-6 h-6 text-[#2A9D8F]" />
                    </div>
                    <div>
                      <p className="font-bold text-[#0F4C5C] text-lg">Flexible Travel</p>
                      <p className="text-sm text-gray-500 font-medium mt-1 leading-relaxed">Free cancellation up to 48 hours before.</p>
                    </div>
                  </li>
                  <li className="flex gap-6 group/item">
                    <div className="w-12 h-12 rounded-2xl bg-[#0F4C5C]/10 flex items-center justify-center shrink-0 transition-transform group-hover/item:scale-110 group-hover/item:rotate-6">
                      <Calendar className="w-6 h-6 text-[#0F4C5C]" />
                    </div>
                    <div>
                      <p className="font-bold text-[#0F4C5C] text-lg">24/7 Assistance</p>
                      <p className="text-sm text-gray-500 font-medium mt-1 leading-relaxed">Our elite team is available round the clock.</p>
                    </div>
                  </li>
                </ul>


              </div>


            </div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[4rem] p-16 md:p-24 text-center border border-gray-100 shadow-[0_30px_100px_rgba(0,0,0,0.05)] relative overflow-hidden"
          >
            <div className="w-28 h-28 bg-[#2A9D8F]/10 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 rotate-6">
              <CheckCircle className="w-14 h-14 text-[#2A9D8F]" />
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-[#0F4C5C] mb-8 tracking-tighter">Reservation Received!</h2>
            <p className="text-gray-500 text-xl max-w-xl mx-auto mb-12 leading-relaxed font-medium">
              Pack your bags! Your trip request is in. We've dispatched a confirmation summary to <span className="text-[#2A9D8F] font-black">{formData.email}</span>.
            </p>
            <button
              onClick={() => navigate('/')}
              className="px-12 py-5 bg-[#0F4C5C] text-white rounded-3xl font-bold text-lg hover:bg-[#0c3e4b] transition-all shadow-2xl shadow-[#0F4C5C]/20 active:scale-95 flex items-center gap-3 mx-auto"
            >
              Back to Home <ArrowLeft className="w-5 h-5 rotate-180" />
            </button>
          </motion.div>
        )}
      </div>
    </section>
  )
}

export default Booking;