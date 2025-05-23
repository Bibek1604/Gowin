"use client"

import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import {
  MapPin,
  Calendar,
  Star,
  Heart,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import usePlaceStore from "../Store/PlaceStore" // Adjust path as needed
import React from "react"
import { Line } from "react-chartjs-2"
import { Link } from "react-router-dom"
function DestinationDetails() {
  const { placeId } = useParams()
  const { places } = usePlaceStore()

  const [destination, setDestination] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isFavorite, setIsFavorite] = useState(false)
  const [showItinerary, setShowItinerary] = useState(false)

  useEffect(() => {
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-teal-100 via-blue-50 to-white">
        <div className="flex flex-col items-center gap-6">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-teal-500 border-t-teal-700"></div>
          <p className="text-teal-700 font-semibold text-xl tracking-tight animate-pulse">Crafting Your Adventure...</p>
        </div>
      </div>
    )
  }

  if (error || !destination) {
    return (
      <div className="text-center p-10 bg-white rounded-3xl shadow-2xl max-w-lg mx-auto mt-16 border border-teal-200">
        <h2 className="text-4xl font-bold text-gray-900 mb-5 tracking-tight">Something Went Wrong</h2>
        <p className="text-gray-700 mb-8 text-lg">{error || "No destination details available."}</p>
        <button
          className="bg-teal-600 text-white py-3 px-10 rounded-full font-semibold text-lg hover:bg-teal-700 transition duration-300 shadow-lg hover:shadow-xl"
          onClick={() => window.history.back()}
        >
          Back to Destinations
        </button>
      </div>
    )
  }

  return (
    <section className="py-16 px-6 bg-gradient-to-br from-teal-50 via-blue-50 to-white min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Hero */}
        <div className="relative rounded-3xl overflow-hidden shadow-2xl mb-12">
          <motion.img
            src={destination.image}
            alt={destination.title}
            className="w-full h-80 sm:h-[28rem] object-cover"
            loading="lazy"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          <div className="absolute bottom-8 left-8 right-8">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4 tracking-tight drop-shadow-lg">{destination.title}</h1>
            <div className="flex flex-wrap gap-6 text-white/90 text-base sm:text-lg">
              <div className="flex items-center">
                <MapPin className="w-6 h-6 mr-3 text-teal-300" />
                <span>{destination.location}</span>
              </div>
              <div className="flex items-center">
                <Star className="w-6 h-6 mr-3 fill-amber-400 text-amber-400" />
                <span>{destination.rating} (128 reviews)</span>
              </div>
              <div className="flex items-center">
                <Calendar className="w-6 h-6 mr-3 text-teal-300" />
                <span>{destination.bestTime}</span>
              </div>
            </div>
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
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-10">
            {/* Description */}
            <motion.div
              className="bg-white rounded-3xl shadow-xl p-8 border border-teal-100/50"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-5 tracking-tight">Your Journey</h2>
              <p className="text-gray-700 leading-relaxed text-lg">{destination.description}</p>
            </motion.div>

            {/* Highlights */}
            <motion.div
              className="bg-white rounded-3xl shadow-xl p-8 border border-teal-100/50"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-5 tracking-tight">Highlights</h2>
              <ul className="space-y-5">
                {destination.highlights.map((highlight, index) => (
                  <motion.li
                    key={index}
                    className="flex items-start"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <span className="mr-4 text-teal-500 text-2xl">•</span>
                    <p className="text-gray-700 text-lg">{highlight}</p>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Itinerary */}
            <motion.div
              className="bg-white rounded-3xl shadow-xl p-8 border border-teal-100/50"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
            >
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => setShowItinerary(!showItinerary)}
              >
                <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Itinerary</h2>
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
                    className="mt-8 space-y-8"
                  >
                    {destination.itinerary.map((day, index) => (
                      <motion.div
                        key={index}
                        className="relative pl-10 border-l-2 border-teal-400"
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                      >
                        <div className="absolute -left-4 top-0 w-8 h-8 rounded-full bg-teal-500 text-white flex items-center justify-center text-base font-bold shadow-md">
                          {day.day}
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-3 tracking-tight">
                          Day {day.day}: {day.title}
                        </h3>
                        <p className="text-gray-700 text-lg">{day.description}</p>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Right Column: Booking */}
          <div>
            <motion.div
              className="bg-white rounded-3xl shadow-xl p-8 border border-teal-100/50 sticky top-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-6 tracking-tight">Ready to Explore?</h3>
              <p className="text-gray-700 mb-6 text-lg">Starting from <span className="font-semibold text-teal-600">{destination.price}</span></p>
              <Link to='/booking'>
              <button
                className="w-full bg-teal-600 text-white py-4 rounded-full font-semibold text-lg hover:bg-teal-700 transition duration-300 shadow-lg hover:shadow-xl"
                onClick={() => window.location.href = "/booking"}
              >
                Book Your Adventure
              </button>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default DestinationDetails