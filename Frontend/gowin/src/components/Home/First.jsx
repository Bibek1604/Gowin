"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { ArrowRightIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { Navigation, Compass, Star, MapPin, ArrowRight } from "lucide-react";
import { useSwipeable } from "react-swipeable";
import { Button } from "../ui";
import colors from "../../theme/colors";
import usePlaceStore from "../Store/PlaceStore";

// Updated destinations array with HD images
// Backup default destinations if database is empty
const defaultDestinations = [
  {
    id: 1,
    name: "Bali",
    title: "BALI, INDONESIA",
    description:
      "Immerse yourself in a paradise of lush landscapes, ancient temples, and pristine beaches. Experience the perfect blend of relaxation and adventure.",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=1200&auto=format&fit=crop",
    featured: true,
  },
  {
    id: 2,
    name: "Thailand",
    title: "THAILAND",
    description:
      "Explore vibrant cities, golden temples, and idyllic islands. Thailand offers an unforgettable journey through rich culture and natural beauty.",
    image: "https://images.unsplash.com/photo-1528181304800-259b08848526?q=80&w=1200&auto=format&fit=crop",
    featured: false,
  },
  {
    id: 3,
    name: "Santorini",
    title: "SANTORINI, GREECE",
    description:
      "Experience the breathtaking beauty of white-washed buildings against the deep blue Aegean Sea. A perfect romantic getaway with stunning sunsets.",
    image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?q=80&w=1200&auto=format&fit=crop",
    featured: false,
  },
]

// Cleaned up Hero background for professional clarity
const AnimatedBackground = () => <div className="absolute inset-0 bg-slate-900/10 pointer-events-none" />;

// Progress bar component for carousel
const ProgressBar = ({ isPaused, activeDestination }) => {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let interval
    if (!isPaused) {
      setProgress(0)
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) return 0
          return prev + 0.5
        })
      }, 20)
    }

    return () => clearInterval(interval)
  }, [isPaused, activeDestination])

  return (
    <div className="w-full h-1 bg-white/20 rounded-full mt-4 overflow-hidden">
      <motion.div
        className="h-full rounded-full"
        style={{ width: `${progress}%`, background: colors.gradients.primary }}
        transition={{ ease: "linear" }}
      />
    </div>
  )
}

export default function HeroSection() {
  const { places, fetchPlaces, isLoading } = usePlaceStore();
  const [activeDestination, setActiveDestination] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [isHovering, setIsHovering] = useState(false)

  // Map Supabase places to the format the hero slider expects
  const destinations = places.length > 0
    ? places.map(p => ({
      id: p.id,
      name: p.location || "Adventure",
      title: p.title.toUpperCase(),
      description: p.description,
      image: (p.images && p.images[0]) || "https://via.placeholder.com/1200x800",
      featured: true
    }))
    : defaultDestinations;

  useEffect(() => {
    fetchPlaces();
  }, []);
  const autoSlideIntervalRef = useRef(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const prefersReducedMotion = typeof window !== "undefined" ? window.matchMedia("(prefers-reduced-motion: reduce)").matches : false

  const handleMouseMove = (e) => {
    if (prefersReducedMotion) return
    const { clientX, clientY, currentTarget } = e
    const { left, top, width, height } = currentTarget.getBoundingClientRect()
    mouseX.set((clientX - left) / width - 0.5)
    mouseY.set((clientY - top) / height - 0.5)
  }

  useEffect(() => {
    if (!isPaused && !isHovering) {
      autoSlideIntervalRef.current = setInterval(() => {
        setActiveDestination((prev) => (prev + 1) % destinations.length)
      }, 4000)
    }
    return () => clearInterval(autoSlideIntervalRef.current)
  }, [isPaused, isHovering])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") {
        handleNavigation("prev")
      } else if (e.key === "ArrowRight") {
        handleNavigation("next")
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => handleNavigation("next"),
    onSwipedRight: () => handleNavigation("prev"),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  })

  const getVisibleIndices = () => {
    const indices = []
    indices.push(activeDestination)
    indices.push((activeDestination + 1) % destinations.length)
    indices.push((activeDestination - 1 + destinations.length) % destinations.length)
    return indices
  }

  const visibleIndices = getVisibleIndices()

  const getSlideStyles = (index) => {
    const position = visibleIndices.indexOf(index)
    const styleMap = {
      "-1": { x: "100%", scale: 0.6, opacity: 0, zIndex: 0, rotateY: 0 },
      0: { x: "0%", scale: 1, opacity: 1, zIndex: 30, rotateY: 0 },
      1: { x: "65%", scale: 0.85, opacity: 0.7, zIndex: 20, rotateY: 15 },
      2: { x: "-65%", scale: 0.85, opacity: 0.7, zIndex: 20, rotateY: -15 },
    }
    return styleMap[position.toString()] || styleMap["-1"]
  }

  const handleNavigation = (direction) => {
    setIsPaused(true)
    setActiveDestination((prev) =>
      direction === "next" ? (prev + 1) % destinations.length : (prev - 1 + destinations.length) % destinations.length
    )
    setTimeout(() => setIsPaused(false), 5000)
  }

  return (
    <div
      className="relative w-full min-h-screen text-white font-sans overflow-hidden bg-[#020617]"
    >
      {/* Background Route Trails */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none z-0">
        <svg className="w-full h-full" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
          <path d="M 0 200 Q 500 50 1000 200" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="10 10" className="text-sky-400" />
          <path d="M 200 0 Q 400 500 200 1000" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="10 10" className="text-sky-400" opacity="0.5" />
        </svg>
      </div>

      <div className="absolute top-1/4 left-10 opacity-[0.03] animate-float">
        <Compass className="w-32 h-32" />
      </div>
      <div className="absolute bottom-1/4 right-10 opacity-[0.03] animate-float" style={{ animationDelay: '2s' }}>
        <Navigation className="w-24 h-24 rotate-45" />
      </div>
      <style>{`
        .perspective {
          perspective: 1200px;
        }
        .glass {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.08);
        }
        .glow {
          box-shadow: 0 0 40px rgba(37, 99, 235, 0.3);
        }
        .text-glow {
          text-shadow: 0 0 30px rgba(56, 189, 248, 0.5);
        }
        @keyframes subtle-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: subtle-float 6s ease-in-out infinite;
        }
      `}</style>

      <AnimatedBackground />

      <AnimatePresence mode="wait">
        <motion.div
          key={activeDestination}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="absolute inset-0 z-0"
        >
          <motion.img
            src={destinations[activeDestination].image}
            alt={destinations[activeDestination].name}
            className="w-full h-full object-cover"
            loading="lazy"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 30, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#020617] via-[#020617]/70 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent"></div>
        </motion.div>
      </AnimatePresence>

      <main className="relative z-10 min-h-[90vh] flex flex-col justify-center px-4 sm:px-6 lg:px-12 pt-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeDestination}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 30 }}
            transition={{ duration: 0.8, ease: "circOut" }}
            className="max-w-4xl lg:text-left text-center"
          >
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass mb-6 overflow-hidden relative"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="absolute inset-0 bg-sky-400 opacity-10 animate-pulse"></div>
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400"></span>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-sky-400">Featured Destination</span>
            </motion.div>

            <motion.h1
              className="text-5xl sm:text-7xl lg:text-8xl font-black leading-[0.9] text-white tracking-tighter mb-8"
              style={{ fontFamily: 'Outfit, sans-serif' }}
            >
              {destinations[activeDestination].title.split(',')[0]}
              <span className="block text-sky-400 text-glow">{destinations[activeDestination].title.split(',')[1]}</span>
            </motion.h1>

            <motion.p
              className="mt-6 text-base sm:text-lg text-slate-300 leading-relaxed max-w-xl mx-auto lg:mx-0 opacity-90 font-medium"
              style={{ fontFamily: 'Outfit, sans-serif' }}
            >
              {destinations[activeDestination].description}
            </motion.p>

            <motion.div
              className="mt-12 flex flex-wrap gap-4 justify-center lg:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Button
                variant="primary"
                size="lg"
                className="rounded-full shadow-2xl hover:scale-105 transition-all text-sm uppercase tracking-widest font-black"
                style={{ background: colors.primary.navy }}
              >
                Plan My Trip
              </Button>
              <div className="flex -space-x-3 items-center ml-4">
                {[1, 2, 3, 4].map(i => (
                  <img key={i} src={`https://i.pravatar.cc/100?u=${i}`} className="w-10 h-10 rounded-full border-2 border-slate-900" alt="Explorer" />
                ))}
                <div className="pl-6 text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Joined by 1.2k+ Explorers
                </div>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        <motion.section
          className="relative w-full max-w-7xl mx-auto py-8 sm:py-10 px-4 perspective"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          onMouseMove={handleMouseMove}
          {...swipeHandlers}
        >
          <div className="relative h-[280px] sm:h-[360px] lg:h-[400px] flex items-center justify-center gap-4 sm:gap-6 lg:gap-8">
            <AnimatePresence>
              {destinations.map((destination, index) => (
                <DestinationCard
                  key={destination.id}
                  destination={destination}
                  index={index}
                  activeDestination={activeDestination}
                  isHovering={isHovering}
                  setActiveDestination={setActiveDestination}
                  prefersReducedMotion={prefersReducedMotion}
                  mouseX={mouseX}
                  mouseY={mouseY}
                  visibleIndices={visibleIndices}
                />
              ))}
            </AnimatePresence>

            <motion.div
              className="absolute inset-0 flex items-center justify-between px-2 pointer-events-none"
              initial={{ opacity: 0.5 }}
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <button
                className="p-2 sm:p-3 rounded-full glass hover:bg-gray-800 transition-all duration-300 pointer-events-auto nav-button"
                onClick={() => handleNavigation("prev")}
                aria-label="Previous destination"
              >
                <ChevronLeftIcon className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </button>
              <button
                className="p-2 sm:p-3 rounded-full glass hover:bg-gray-800 transition-all duration-300 pointer-events-auto nav-button"
                onClick={() => handleNavigation("next")}
                aria-label="Next destination"
              >
                <ChevronRightIcon className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </button>
            </motion.div>
          </div>

          <div className="flex flex-col items-center mt-4 sm:mt-6 gap-3">
            <div className="flex justify-center gap-2 sm:gap-3">
              {destinations.map((_, index) => (
                <motion.button
                  key={index}
                  className={`w-2 h-2 sm:w-2 sm:h-2 rounded-full transition-all duration-500 ${index === activeDestination ? "w-8 shadow-lg" : "bg-white/30"
                    }`}
                  style={index === activeDestination ? { background: colors.gradients.primary } : {}}
                  onClick={() => setActiveDestination(index)}
                  whileHover={{ scale: 1.4 }}
                  whileTap={{ scale: 1.1 }}
                  aria-label={`Go to destination ${index + 1}`}
                  aria-current={index === activeDestination ? "true" : "false"}
                />
              ))}
            </div>
            <div className="w-24 sm:w-32 lg:w-48">
              <ProgressBar isPaused={isPaused} activeDestination={activeDestination} />
            </div>
          </div>
        </motion.section>
      </main>
    </div>
  )
}

const DestinationCard = ({
  destination,
  index,
  activeDestination,
  isHovering,
  setActiveDestination,
  prefersReducedMotion,
  mouseX,
  mouseY,
  visibleIndices,
}) => {
  const rotateX = useTransform(mouseY, [-0.5, 0.5], [5, -5])
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-5, 5])

  const getSlideStyles = (index) => {
    const position = visibleIndices.indexOf(index)
    const styleMap = {
      "-1": { x: "100%", scale: 0.6, opacity: 0, zIndex: 0, rotateY: 0 },
      0: { x: "0%", scale: 1, opacity: 1, zIndex: 30, rotateY: 0 },
      1: { x: "65%", scale: 0.85, opacity: 0.7, zIndex: 20, rotateY: 15 },
      2: { x: "-65%", scale: 0.85, opacity: 0.7, zIndex: 20, rotateY: -15 },
    }
    return styleMap[position.toString()] || styleMap["-1"]
  }

  return (
    <motion.div
      className={`absolute w-[220px] sm:w-[260px] lg:w-[300px] h-[340px] sm:h-[380px] lg:h-[400px] rounded-[2rem] overflow-hidden cursor-pointer shadow-2xl transition-all duration-700 ${index === activeDestination ? "ring-2 ring-sky-400 glow" : ""
        }`}
      animate={{
        ...getSlideStyles(index),
        scale: index === activeDestination ? (isHovering ? 1.02 : 1) : getSlideStyles(index).scale,
      }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      onClick={() => setActiveDestination(index)}
      role="button"
      aria-label={`Select ${destination.name}`}
      style={!prefersReducedMotion && index === activeDestination ? { rotateX, rotateY } : {}}
      whileHover={{
        y: -10,
        transition: { duration: 0.3 },
      }}
    >
      <div className="relative w-full h-full glass">
        <img
          src={destination.image || "/placeholder.svg"}
          alt={destination.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-800/40 to-transparent"></div>
        {destination.featured && <div className="ribbon">Featured</div>}
        <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 text-white space-y-1 sm:space-y-2">
          <h3 className="text-lg sm:text-xl lg:text-2xl font-bold drop-shadow-md">{destination.name}</h3>
          <p className="text-xs sm:text-sm text-gray-300">{destination.rating} ★</p>
        </div>
      </div>
    </motion.div>
  )
}