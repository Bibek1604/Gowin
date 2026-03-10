"use client"

import React, { useState, useEffect } from "react";
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
            `Explore the charm of ${place.placeName || "this destination"
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
      <div className="flex justify-center items-center h-screen bg-[#020617]">
        <div className="flex flex-col items-center gap-6">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="h-20 w-20 rounded-full border-2 border-white/5 border-t-sky-400 shadow-[0_0_30px_rgba(56,189,248,0.3)]"
          />
          <motion.p
            className="text-[10px] font-black uppercase tracking-[0.4em] text-sky-400"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Mapping Your Odyssey...
          </motion.p>
        </div>
      </div>
    )
  }

  if (error || !destination) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#020617] px-6">
        <motion.div
          className="text-center p-12 glass rounded-[2.5rem] shadow-2xl max-w-lg border border-white/5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="w-20 h-20 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto mb-8">
            <Sparkles className="w-10 h-10 text-rose-500" />
          </div>
          <h2 className="text-3xl font-black uppercase tracking-tighter mb-4 text-white">Something Went Wrong</h2>
          <p className="text-slate-400 mb-10 font-medium leading-relaxed">{error || "No destination details found."}</p>
          <button
            className="w-full py-5 rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-xs text-white transition-all shadow-2xl hover:bg-sky-500"
            style={{ background: colors.primary.navy }}
            onClick={() => window.history.back()}
          >
            Back to Destinations
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <section
      className="py-12 px-4 md:px-6 min-h-screen relative overflow-hidden"
      style={{ background: '#020617', fontFamily: 'Outfit, sans-serif' }}
    >
      {/* Background Route Decor */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none z-0">
        <svg className="w-full h-full" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
          <path d="M 0 200 Q 500 50 1000 200" fill="none" stroke="white" strokeWidth="1" strokeDasharray="8 8" />
          <path d="M 200 0 Q 400 500 200 1000" fill="none" stroke="white" strokeWidth="1" strokeDasharray="8 8" opacity="0.5" />
        </svg>
      </div>

      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-sky-500/5 blur-[150px] rounded-full"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/5 blur-[150px] rounded-full"></div>
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <motion.div
          className="relative rounded-[3rem] overflow-hidden shadow-2xl mb-16 border border-white/5"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "circOut" }}
        >
          <motion.img
            src={destination.image}
            alt={destination.title}
            className="w-full h-96 sm:h-[40rem] object-cover contrast-[1.1]"
            loading="lazy"
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 10 }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/40 to-transparent" />

          <div className="absolute bottom-12 left-12 right-12">
            <div className="flex items-center gap-3 mb-6">
              <span className="px-4 py-1.5 rounded-full bg-sky-500/20 backdrop-blur-md text-[10px] font-black uppercase tracking-[0.3em] text-sky-400 border border-sky-500/30">Official Selection</span>
            </div>
            <motion.h1
              className="text-5xl sm:text-8xl font-black text-white mb-8 tracking-tighter drop-shadow-2xl"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {destination.title}
            </motion.h1>
            <motion.div
              className="flex flex-wrap gap-6 text-white text-[10px] uppercase font-black tracking-[0.2em]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center px-6 py-3 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-xl">
                <MapPin className="w-4 h-4 mr-3 text-sky-400" />
                <span className="text-sky-300">{destination.location}</span>
              </div>
              <div className="flex items-center px-6 py-3 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-xl">
                <Star className="w-4 h-4 mr-3 text-sky-400 fill-sky-400" />
                <span className="text-sky-300">{destination.rating} Global Rating</span>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description Card */}
            <motion.div
              className="glass rounded-[2rem] p-12 border border-white/5 relative overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/10 blur-3xl rounded-full translate-x-12 -translate-y-12"></div>
              <h2 className="text-2xl font-black uppercase tracking-[0.2em] text-sky-400 mb-8">Overview</h2>
              <p className="text-slate-300 leading-[1.8] text-lg font-medium">{destination.description}</p>
            </motion.div>

            {/* Highlights Card */}
            <motion.div
              className="glass rounded-[2rem] p-12 border border-white/5 shadow-2xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-2xl font-black uppercase tracking-[0.2em] text-sky-400 mb-10">Premium Experiences</h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {destination.highlights.map((highlight, index) => (
                  <li
                    key={index}
                    className="flex flex-col p-6 rounded-[1.5rem] bg-white/5 border border-white/5 hover:border-sky-500/30 transition-all group"
                  >
                    <div className="w-10 h-10 rounded-full bg-sky-500/10 flex items-center justify-center mb-4 group-hover:bg-sky-500 transition-colors">
                      <Check className="w-5 h-5 text-sky-400 group-hover:text-white" />
                    </div>
                    <p className="text-slate-200 font-bold uppercase tracking-wider text-xs leading-relaxed">{highlight}</p>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              className="glass rounded-[2rem] p-12 border border-white/5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div
                className="flex justify-between items-center cursor-pointer group"
                onClick={() => setShowItinerary(!showItinerary)}
              >
                <h2 className="text-2xl font-black uppercase tracking-[0.2em] text-sky-400">Voyage Itinerary</h2>
                <motion.div
                  animate={{ rotate: showItinerary ? 180 : 0 }}
                  className="w-10 h-10 rounded-full glass shrink-0 flex items-center justify-center group-hover:bg-sky-500 transition-colors"
                >
                  <ChevronDown className="w-6 h-6 text-white" />
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
                      <div
                        key={index}
                        className="pl-8 pb-8 border-l-2 relative last:pb-0"
                        style={{ borderLeftColor: colors.accent.skyBlue }}
                      >
                        <div
                          className="absolute -left-[9px] top-4 w-4 h-4 rounded-full border-2 border-[#020617] scale-125"
                          style={{ background: colors.primary.navy }}
                        />
                        <div className="glass p-8 rounded-[1.5rem] border border-white/5 hover:border-white/10 transition-colors">
                          <h3 className="text-lg font-black text-white mb-3 uppercase tracking-widest">
                            Day {day.day}: {day.title}
                          </h3>
                          <p className="text-slate-400 leading-relaxed font-medium">{day.description}</p>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          <div className="relative">
            <motion.div
              className="glass rounded-[2.5rem] p-2 border border-white/10 sticky top-28 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)]"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="p-10">
                <div className="mb-10 p-8 rounded-[2rem] text-center relative overflow-hidden group" style={{ background: colors.primary.navy }}>
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <p className="text-[10px] font-black tracking-[0.4em] mb-4 text-white/60 uppercase">Starting From</p>
                  <p className="text-5xl font-black text-white tracking-tighter shadow-sm">
                    {destination.price}
                  </p>
                </div>

                <div className="space-y-6 mb-10">
                  <div className="flex items-center p-6 rounded-2xl bg-white/5 border border-white/5">
                    <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center mr-4">
                      <MapPin className="w-6 h-6 text-orange-500" />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">DESTINATION</p>
                      <p className="text-white font-black text-sm uppercase tracking-tight">{destination.title}</p>
                    </div>
                  </div>
                </div>

                <motion.button
                  onClick={handleBooking}
                  className="w-full py-6 rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-xs text-white transition-all shadow-2xl"
                  style={{ background: colors.accent.orange }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Embark Journey
                </motion.button>

                <div className="flex items-center justify-center gap-4 mt-8 opacity-40">
                  <Check className="w-4 h-4 text-sky-400" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-white">Elite Experiences Guaranteed</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default DestinationDetails

