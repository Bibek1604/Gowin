import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar, Users, MapPin, Mail, Phone, ChevronDown,
  CheckCircle, ArrowLeft, ArrowRight, Shield, Clock, Star
} from 'lucide-react';
import usePlaceStore from '../Store/PlaceStore';
import useBookingStore from '../Store/BookingStore';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

const INITIAL_FORM = {
  name: '', email: '', phone: '', address: '',
  destination: '', travelDate: '', travelers: 1,
};

function Booking() {
  const { places, fetchPlaces } = usePlaceStore();
  const { addBooking } = useBookingStore();
  const location = useLocation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    ...INITIAL_FORM,
    destination: location.state?.preFilledDestination || '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => { fetchPlaces(); }, [fetchPlaces]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const err = {};
    if (!formData.name.trim()) err.name = 'Name is required';
    if (!formData.email.trim()) err.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) err.email = 'Invalid email';
    if (!formData.phone.trim()) err.phone = 'Phone is required';
    if (!formData.address.trim()) err.address = 'Address is required';
    if (!formData.destination) err.destination = 'Please select a destination';
    if (!formData.travelDate) err.travelDate = 'Travel date is required';
    if (formData.travelers < 1) err.travelers = 'At least 1 traveler';
    return err;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error('Please fill in all required fields.');
      return;
    }
    setIsSubmitting(true);
    const res = await addBooking({
      tour_id: formData.destination,
      user_name: formData.name,
      user_email: formData.email,
      num_people: formData.travelers,
      travel_date: formData.travelDate,
      phone: formData.phone,
    });
    setIsSubmitting(false);
    if (res.success) {
      setShowConfirmation(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      toast.error('Booking failed. Please try again.');
    }
  };

  const selectedPlace = places.find(p => String(p.id) === String(formData.destination));

  const trustItems = [
    { icon: Shield, title: 'Secure Booking', desc: 'Your data is encrypted and protected.' },
    { icon: Clock, title: 'Free Cancellation', desc: 'Cancel free up to 48 hours before.' },
    { icon: Phone, title: '24/7 Support', desc: 'Our team is always just a call away.' },
    { icon: Star, title: 'Best Price', desc: 'We guarantee the best available rates.' },
  ];

  if (showConfirmation) {
    return (
      <div className="min-h-screen bg-[#F8FAFB] flex items-center justify-center p-4 pt-24 font-sans">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-lg bg-white rounded-2xl sm:rounded-3xl shadow-xl border border-gray-100 p-8 sm:p-12 text-center"
        >
          <div className="w-20 h-20 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-emerald-500" />
          </div>
          <h2 className="heading-font text-2xl sm:text-3xl text-[#0F4C5C] mb-3">Booking Confirmed!</h2>
          <p className="text-gray-500 text-sm sm:text-base leading-relaxed mb-2">
            Your booking request has been received. We'll send a confirmation to:
          </p>
          <p className="text-[#FF7F50] font-bold mb-6">{formData.email}</p>
          <p className="text-gray-400 text-xs sm:text-sm mb-8 leading-relaxed">
            Our team will contact you within 24 hours to confirm details and arrange payment. If you have any questions, call us at <strong>+977 9851410966</strong>.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => navigate('/')}
              className="flex-1 btn-primary justify-center"
            >
              Back to Home <ArrowRight className="w-4 h-4" />
            </button>
            <Link to="/details/all" className="flex-1 btn-secondary justify-center text-center">
              Browse More Tours
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFB] font-sans pt-16">
      <Toaster position="top-right" />

      {/* Header strip */}
      <div className="bg-[#0F4C5C] py-8 sm:py-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 pointer-events-none" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
          <Link to="/" className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm font-medium transition-colors mb-4">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <h1 className="heading-font text-2xl sm:text-3xl md:text-4xl text-white mb-2">Book Your Trip</h1>
          <p className="text-white/60 text-sm sm:text-base max-w-lg">
            Complete the form below and our team will confirm your booking within 24 hours.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">

          {/* Form */}
          <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-5 sm:p-7 border-b border-gray-50 bg-gray-50/50">
              <h2 className="text-base font-bold text-[#0F4C5C]">Traveler Information</h2>
              <p className="text-xs text-gray-400 mt-0.5">All fields marked with * are required</p>
            </div>

            <form onSubmit={handleSubmit} className="p-5 sm:p-7 space-y-5">
              {/* Name + Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-[#0F4C5C] block mb-1.5">Full Name *</label>
                  <input
                    type="text" name="name" value={formData.name} onChange={handleChange}
                    className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF7F50]/20 focus:bg-white transition-all ${errors.name ? 'border-red-300' : 'border-gray-100'}`}
                    placeholder="John Doe"
                  />
                  {errors.name && <p className="text-red-500 text-[10px] mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#0F4C5C] block mb-1.5">Email Address *</label>
                  <input
                    type="email" name="email" value={formData.email} onChange={handleChange}
                    className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF7F50]/20 focus:bg-white transition-all ${errors.email ? 'border-red-300' : 'border-gray-100'}`}
                    placeholder="john@example.com"
                  />
                  {errors.email && <p className="text-red-500 text-[10px] mt-1">{errors.email}</p>}
                </div>
              </div>

              {/* Phone + Travelers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-[#0F4C5C] block mb-1.5">Phone Number *</label>
                  <input
                    type="tel" name="phone" value={formData.phone} onChange={handleChange}
                    className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF7F50]/20 focus:bg-white transition-all ${errors.phone ? 'border-red-300' : 'border-gray-100'}`}
                    placeholder="+977 9800000000"
                  />
                  {errors.phone && <p className="text-red-500 text-[10px] mt-1">{errors.phone}</p>}
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#0F4C5C] block mb-1.5">Number of Travelers *</label>
                  <input
                    type="number" name="travelers" min="1" max="50" value={formData.travelers} onChange={handleChange}
                    className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF7F50]/20 focus:bg-white transition-all ${errors.travelers ? 'border-red-300' : 'border-gray-100'}`}
                  />
                  {errors.travelers && <p className="text-red-500 text-[10px] mt-1">{errors.travelers}</p>}
                </div>
              </div>

              {/* Destination */}
              <div>
                <label className="text-xs font-semibold text-[#0F4C5C] block mb-1.5">Select Tour Package *</label>
                <div className="relative">
                  <select
                    name="destination" value={formData.destination} onChange={handleChange}
                    className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF7F50]/20 focus:bg-white transition-all appearance-none cursor-pointer ${errors.destination ? 'border-red-300' : 'border-gray-100'}`}
                  >
                    <option value="">Choose a destination package</option>
                    {places.map(p => (
                      <option key={p.id} value={p.id}>{p.title} — {p.location}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                </div>
                {errors.destination && <p className="text-red-500 text-[10px] mt-1">{errors.destination}</p>}
              </div>

              {/* Date + Address */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-[#0F4C5C] block mb-1.5">Preferred Travel Date *</label>
                  <input
                    type="date" name="travelDate" value={formData.travelDate} onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                    className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF7F50]/20 focus:bg-white transition-all ${errors.travelDate ? 'border-red-300' : 'border-gray-100'}`}
                  />
                  {errors.travelDate && <p className="text-red-500 text-[10px] mt-1">{errors.travelDate}</p>}
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#0F4C5C] block mb-1.5">Your City / Country *</label>
                  <input
                    type="text" name="address" value={formData.address} onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF7F50]/20 focus:bg-white transition-all"
                    placeholder="e.g. Kathmandu, Nepal"
                  />
                  {errors.address && <p className="text-red-500 text-[10px] mt-1">{errors.address}</p>}
                </div>
              </div>

              <button
                type="submit" disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2.5 bg-[#FF7F50] hover:bg-[#e56a42] text-white py-4 rounded-xl font-bold text-sm transition-all shadow-lg shadow-[#FF7F50]/25 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98]"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <><CheckCircle className="w-4 h-4" /> Confirm Booking Request</>
                )}
              </button>

              <p className="text-center text-[11px] text-gray-400">
                🔒 Your booking is secure. No payment is taken at this stage.
              </p>
            </form>
          </div>

          {/* Sidebar */}
          <div className="lg:w-80 space-y-4">
            {/* Selected package preview */}
            {selectedPlace && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="h-36 overflow-hidden">
                  <img
                    src={selectedPlace.images?.[0] || 'https://images.unsplash.com/photo-1516490701338-fd7e5a94d6d7?w=400&q=80'}
                    alt={selectedPlace.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h4 className="font-bold text-[#0F4C5C] text-sm mb-1 line-clamp-1">{selectedPlace.title}</h4>
                  <div className="flex items-center gap-1 text-gray-400 text-xs mb-3">
                    <MapPin className="w-3 h-3" /> {selectedPlace.location}
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400 flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{selectedPlace.duration}</span>
                    <span className="font-black text-[#0F4C5C]">${selectedPlace.price}<span className="text-xs font-normal text-gray-400">/pp</span></span>
                  </div>
                </div>
              </div>
            )}

            {/* Trust items */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h4 className="text-sm font-bold text-[#0F4C5C] mb-4">Why Book with GoWin?</h4>
              <div className="space-y-3">
                {trustItems.map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-[#0F4C5C]/5 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon className="w-4 h-4 text-[#0F4C5C]" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#0F4C5C]">{item.title}</p>
                        <p className="text-[11px] text-gray-400 mt-0.5">{item.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Contact card */}
            <div className="bg-[#0F4C5C] rounded-2xl p-5 text-white relative overflow-hidden">
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/5 rounded-full pointer-events-none" />
              <p className="text-sm font-bold mb-1 relative z-10">Need Help?</p>
              <p className="text-white/60 text-xs mb-4 relative z-10">Speak to our travel experts directly.</p>
              <a
                href="tel:+9779851410966"
                className="flex items-center gap-2 bg-[#FF7F50] text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-[#e56a42] transition-colors relative z-10"
              >
                <Phone className="w-4 h-4" /> +977 9851410966
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Booking;
