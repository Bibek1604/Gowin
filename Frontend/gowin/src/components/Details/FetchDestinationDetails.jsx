"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import {
  MapPin,
  Calendar,
  Star,
  Heart,
  ChevronDown,
  ChevronUp,
  Plane,
  Sparkles,
  Check,
} from "lucide-react"
import usePlaceStore from "../Store/PlaceStore" // Adjust path as needed
import React from "react"
import { Line } from "react-chartjs-2"
import { Link } from "react-router-dom"
import colors from "../../theme/colors"
function DestinationDetails() {
  const { placeId } = useParams()
  const navigate = useNavigate()
  const { places } = usePlaceStore()

  const [destination, setDestination] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isFavorite, setIsFavorite] = useState(false)
  const [showItinerary, setShowItinerary] = useState(false)

  useEffect(() => {
    // Always scroll to top when this component mounts
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    const loadDestination = () => {
      try {
        const place = places.find((p) => p.id === placeId)

        if (!place) {
          setError("No destination found for this ID.")
          setLoading(false)
          return
        }

        const mappedDestination = {
          id: place.id,
          title: place.placeName || place.title || "Unknown Destination",
          image: place.image || "https://via.placeholder.com/1200x600?text=Discover+Your+Journey",
          location: place.country || place.location || "Unknown Location",
          rating: place.rating || 4.8,
          description:
            place.description ||
            `Explore the charm of ${
              place.placeName || "this destination"
            }. Wander through vibrant streets, relax on serene beaches, and immerse yourself in local culture. This journey promises unforgettable memories.`,
          highlights: place.highlights || [
            "Lasting Memories: Unforgettable experiences",
            "Find Peace: Relax and reconnect",
            "Culinary Delights: Savor local flavors",
            "Adventure Awaits: Discover new wonders",
          ],
          itinerary:
            place.itinerary && place.itinerary.length > 0
              ? place.itinerary
              : [
                  {
                    day: 1,
                    title: "Arrival",
                    description:
                      "Arrive and settle in. Enjoy a relaxing evening as you take in the beauty of your new surroundings.",
                  },
                  {
                    day: 2,
                    title: "Exploration",
                    description:
                      "Discover the destination's highlights, from scenic landscapes to bustling markets.",
                  },
                  {
                    day: 3,
                    title: "Cultural Immersion",
                    description:
                      "Connect with the local culture through unique experiences and reflect on your journey.",
                  },
                ],
          price: place.price || "$2,199",
          bestTime: place.bestTime || "Spring & Fall",
          testimonials: [
            {
              name: "Sarah M.",
              quote: "A life-changing trip. I came back inspired.",
              rating: 5,
            },
            {
              name: "David L.",
              quote: "Unforgettable memories. Highly recommend!",
              rating: 5,
            },
          ],
        }

        setDestination(mappedDestination)
        setLoading(false)
      } catch (err) {
        setError("Failed to load destination details.")
        setLoading(false)
      }
    }

    loadDestination()
  }, [placeId, places])

  const handleBooking = () => {
    navigate('/booking', { 
      state: { 
        preFilledDestination: destination?.id,
        destinationName: destination?.title,
        destinationLocation: destination?.location
      } 
    })
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-teal-100 via-blue-50 to-white">
        <div className="flex flex-col items-center gap-6">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="h-16 w-16 rounded-full border-4 border-teal-300 border-t-teal-700"
          />
          <motion.p 
            className="text-teal-700 font-semibold text-xl tracking-tight"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Crafting Your Adventure...
          </motion.p>
        </div>
      </div>
    )
  }

  if (error || !destination) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-white px-6">
        <motion.div 
          className="text-center p-10 bg-white rounded-3xl shadow-2xl max-w-lg border border-teal-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-5 tracking-tight">Something Went Wrong</h2>
          <p className="text-gray-700 mb-8 text-lg">{error || "No destination details available."}</p>
          <button
            className="bg-teal-600 text-white py-3 px-10 rounded-full font-semibold text-lg hover:bg-teal-700 transition duration-300 shadow-lg hover:shadow-xl"
            onClick={() => window.history.back()}
          >
            Back to Destinations
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <section className="py-16 px-4 md:px-6 bg-gradient-to-br from-teal-50 via-blue-50 to-white min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <motion.div
          className="relative rounded-3xl overflow-hidden shadow-2xl mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <motion.img
            src={destination.image}
            alt={destination.title}
            className="w-full h-96 sm:h-[32rem] object-cover"
            loading="lazy"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
          <div 
            className="absolute inset-0"
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Crect fill='rgba(0,168,150,0.1)' width='100' height='100'/%3E%3C/svg%3E")` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          
          <div className="absolute bottom-8 left-8 right-8">
            <motion.h1 
              className="text-4xl sm:text-5xl font-extrabold text-white mb-4 tracking-tight drop-shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {destination.title}
            </motion.h1>
            <motion.div 
              className="flex flex-wrap gap-6 text-white/95 text-base sm:text-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="flex items-center bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <MapPin className="w-5 h-5 mr-2 text-teal-300" />
                <span>{destination.location}</span>
              </div>
              <div className="flex items-center bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <Star className="w-5 h-5 mr-2 fill-amber-400 text-amber-400" />
                <span>{destination.rating} (128 reviews)</span>
              </div>
              <div className="flex items-center bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <Calendar className="w-5 h-5 mr-2 text-teal-300" />
                <span>{destination.bestTime}</span>
              </div>
            </motion.div>
          </div>
          
          <motion.button
            onClick={() => setIsFavorite(!isFavorite)}
            className="absolute top-6 right-6 p-3 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 transition duration-300 shadow-md"
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
          >
            <Heart
              className={`w-7 h-7 ${isFavorite ? "text-red-500 fill-red-500" : "text-white fill-white/50"}`}
            />
          </motion.button>
        </motion.div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description Card */}
            <motion.div
              className="bg-white rounded-3xl shadow-xl p-8 border border-teal-100/50 hover:shadow-2xl transition duration-300"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="p-2 rounded-lg" style={{ background: colors.gradients.primary }}>
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Your Journey</h2>
              </div>
              <p className="text-gray-700 leading-relaxed text-lg text-justify">{destination.description}</p>
            </motion.div>

            {/* Highlights Card */}
            <motion.div
              className="bg-white rounded-3xl shadow-xl p-8 border border-teal-100/50 hover:shadow-2xl transition duration-300"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg" style={{ background: colors.gradients.warm }}>
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Why Visit?</h2>
              </div>
              <ul className="space-y-4">
                {destination.highlights.map((highlight, index) => (
                  <motion.li
                    key={index}
                    className="flex items-start p-3 rounded-xl bg-gradient-to-r from-teal-50 to-blue-50 border border-teal-100"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    whileHover={{ x: 8 }}
                  >
                    <Check className="w-6 h-6 mr-3 text-teal-600 flex-shrink-0 mt-0.5" />
                    <p className="text-gray-700 text-lg">{highlight}</p>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Itinerary Card */}
            <motion.div
              className="bg-white rounded-3xl shadow-xl p-8 border border-teal-100/50 hover:shadow-2xl transition duration-300"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
            >
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => setShowItinerary(!showItinerary)}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg" style={{ background: colors.gradients.cool }}>
                    <Plane className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Itinerary</h2>
                </div>
                <motion.div animate={{ rotate: showItinerary ? 180 : 0 }} transition={{ duration: 0.4 }}>
                  {showItinerary ? (
                    <ChevronUp className="w-7 h-7 text-teal-600" />
                  ) : (
                    <ChevronDown className="w-7 h-7 text-teal-600" />
                  )}
                </motion.div>
              </div>
              <AnimatePresence>
                {showItinerary && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="mt-8 space-y-6"
                  >
                    {destination.itinerary.map((day, index) => (
                      <motion.div
                        key={index}
                        className="relative pl-12 pb-4 border-l-4"
                        style={{ borderLeftColor: index % 2 === 0 ? colors.primary.teal : colors.accent.orange }}
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                      >
                        <div 
                          className="absolute -left-5 top-0 w-10 h-10 rounded-full text-white flex items-center justify-center text-base font-bold shadow-md flex items-center justify-center"
                          style={{ background: index % 2 === 0 ? colors.primary.teal : colors.accent.orange }}
                        >
                          {day.day}
                        </div>
                        <div className="bg-gradient-to-r from-teal-50 to-blue-50 p-5 rounded-xl border border-teal-100">
                          <h3 className="text-xl font-bold text-gray-900 mb-2 tracking-tight">
                            Day {day.day}: {day.title}
                          </h3>
                          <p className="text-gray-700 text-lg">{day.description}</p>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Right Column - Booking Card */}
          <div>
            <motion.div
              className="bg-white rounded-3xl shadow-xl p-8 border border-teal-100/50 sticky top-8 hover:shadow-2xl transition duration-300"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
            >
              <div className="mb-6">
                <p className="text-gray-600 text-sm font-medium tracking-wide mb-2">STARTING FROM</p>
                <p className="text-4xl font-extrabold text-transparent bg-clip-text" style={{ backgroundImage: colors.gradients.warm }}>
                  {destination.price}
                </p>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center p-3 rounded-lg bg-teal-50 border border-teal-200">
                  <MapPin className="w-5 h-5 text-teal-600 mr-3" />
                  <div>
                    <p className="text-xs text-gray-600 font-semibold">DESTINATION</p>
                    <p className="text-gray-900 font-semibold">{destination.title}</p>
                  </div>
                </div>
                <div className="flex items-center p-3 rounded-lg bg-blue-50 border border-blue-200">
                  <Calendar className="w-5 h-5 text-blue-600 mr-3" />
                  <div>
                    <p className="text-xs text-gray-600 font-semibold">BEST TIME</p>
                    <p className="text-gray-900 font-semibold">{destination.bestTime}</p>
                  </div>
                </div>
              </div>

              <motion.button
                onClick={handleBooking}
                className="w-full py-4 px-6 rounded-full font-bold text-lg text-white transition duration-300 shadow-lg hover:shadow-xl relative overflow-hidden group"
                style={{ background: colors.gradients.warm }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <Plane className="w-5 h-5" />
                  Book Your Adventure
                </span>
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition duration-300" />
              </motion.button>

              <p className="text-center text-gray-600 text-sm mt-6 leading-relaxed">
                ✓ Best Price Guarantee<br/>
                ✓ 24/7 Customer Support<br/>
                ✓ Free Cancellation
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default DestinationDetails

