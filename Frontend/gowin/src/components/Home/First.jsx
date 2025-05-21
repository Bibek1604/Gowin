"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion"
import { ArrowRightIcon, ChevronLeftIcon, ChevronRightIcon, StarIcon, GlobeAltIcon } from "@heroicons/react/24/outline"
import { useSwipeable } from "react-swipeable"
import React from "react"
// Updated destinations array with HD images
const destinations = [
  {
    id: 1,
    name: "Bali",
    title: "BALI, INDONESIA",
    description:
      "Immerse yourself in a paradise of lush landscapes, ancient temples, and pristine beaches. Experience the perfect blend of relaxation and adventure.",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=1200&auto=format&fit=crop",
    price: 1200,
    rating: 4.9,
    featured: true,
  },
  {
    id: 2,
    name: "Thailand",
    title: "THAILAND",
    description:
      "Explore vibrant cities, golden temples, and idyllic islands. Thailand offers an unforgettable journey through rich culture and natural beauty.",
    image: "https://images.unsplash.com/photo-1528181304800-259b08848526?q=80&w=1200&auto=format&fit=crop",
    price: 950,
    rating: 4.7,
    featured: false,
  },
  {
    id: 3,
    name: "Santorini",
    title: "SANTORINI, GREECE",
    description:
      "Experience the breathtaking beauty of white-washed buildings against the deep blue Aegean Sea. A perfect romantic getaway with stunning sunsets.",
    image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?q=80&w=1200&auto=format&fit=crop",
    price: 1350,
    rating: 4.8,
    featured: false,
  },
]

// Enhanced animated background component
const AnimatedBackground = () => {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    let particles = []
    let animationFrameId
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    // Skip animation if user prefers reduced motion
    if (prefersReducedMotion) return

    // Set canvas dimensions
    const setCanvasDimensions = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    setCanvasDimensions()
    window.addEventListener("resize", setCanvasDimensions)

    // Create particles
    const createParticles = () => {
      particles = []
      const particleCount = Math.min(80, Math.floor(window.innerWidth / 20))

      for (let i = 0; i < particleCount; i++) {
        const size = Math.random() * 3 + 1
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: size,
          originalRadius: size,
          color: `rgba(173, 216, 230, ${Math.random() * 0.4 + 0.1})`,
          speedX: Math.random() * 0.5 - 0.25,
          speedY: Math.random() * 0.5 - 0.25,
          opacity: Math.random() * 0.5 + 0.1,
          pulsate: Math.random() > 0.5,
          pulsateSpeed: Math.random() * 0.02 + 0.01,
          pulsateDirection: 1,
        })
      }
    }

    createParticles()

    // Animate particles
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((particle) => {
        // Pulsate effect
        if (particle.pulsate) {
          particle.radius += particle.pulsateDirection * particle.pulsateSpeed
          if (particle.radius > particle.originalRadius * 1.5 || particle.radius < particle.originalRadius * 0.5) {
            particle.pulsateDirection *= -1
          }
        }

        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
        ctx.fillStyle = particle.color
        ctx.fill()

        // Update position
        particle.x += particle.speedX
        particle.y += particle.speedY

        // Reset position if out of bounds
        if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1
        if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1
      })

      // Draw connecting lines between nearby particles
      particles.forEach((particle, i) => {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particle.x - particles[j].x
          const dy = particle.y - particles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 100) {
            ctx.beginPath()
            ctx.strokeStyle = `rgba(173, 216, 230, ${0.2 * (1 - distance / 100)})`
            ctx.lineWidth = 0.5
            ctx.moveTo(particle.x, particle.y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
      })

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", setCanvasDimensions)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none opacity-70" aria-hidden="true" />
}

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
      }, 20) // 20ms * 200 steps = ~4000ms (4s)
    }

    return () => clearInterval(interval)
  }, [isPaused, activeDestination])

  return (
    <div className="w-full h-1.5 bg-sky-200/30 rounded-full mt-2 overflow-hidden backdrop-blur-sm">
      <motion.div
        className="h-full bg-sky-400 rounded-full"
        style={{ width: `${progress}%` }}
        transition={{ ease: "linear" }}
      />
    </div>
  )
}

export default function Place() {
  const [activeDestination, setActiveDestination] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const autoSlideIntervalRef = useRef(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const prefersReducedMotion =
    typeof window !== "undefined" ? window.matchMedia("(prefers-reduced-motion: reduce)").matches : false

  // Handle mouse movement for parallax effect
  const handleMouseMove = (e) => {
    if (prefersReducedMotion) return
    const { clientX, clientY, currentTarget } = e
    const { left, top, width, height } = currentTarget.getBoundingClientRect()
    mouseX.set((clientX - left) / width - 0.5)
    mouseY.set((clientY - top) / height - 0.5)
  }

  // Auto-slide functionality
  useEffect(() => {
    if (!isPaused && !isHovering) {
      autoSlideIntervalRef.current = setInterval(() => {
        setActiveDestination((prev) => (prev + 1) % destinations.length)
      }, 4000)
    }
    return () => clearInterval(autoSlideIntervalRef.current)
  }, [isPaused, isHovering])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") {
        handleNavigation("prev")
      } else if (e.key === "ArrowRight") {
        handleNavigation("next")
      } else if (e.key === "Enter") {
        // Implement any action for Enter key
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  // Swipe handlers for mobile
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => handleNavigation("next"),
    onSwipedRight: () => handleNavigation("prev"),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  })

  // Get visible indices for carousel
  const getVisibleIndices = () => {
    const indices = []
    indices.push(activeDestination)
    indices.push((activeDestination + 1) % destinations.length)
    indices.push((activeDestination - 1 + destinations.length) % destinations.length)
    return indices
  }

  const visibleIndices = getVisibleIndices()

  // Refactored slide styles with position-based lookup
  const getSlideStyles = (index) => {
    const position = visibleIndices.indexOf(index)

    // Position-based style lookup
    const styleMap = {
      "-1": { x: "100%", scale: 0.6, opacity: 0, zIndex: 0, rotateY: 0 },
      0: { x: "0%", scale: 1, opacity: 1, zIndex: 30, rotateY: 0 },
      1: { x: "65%", scale: 0.85, opacity: 0.7, zIndex: 20, rotateY: 15 },
      2: { x: "-65%", scale: 0.85, opacity: 0.7, zIndex: 20, rotateY: -15 },
    }

    return styleMap[position.toString()] || styleMap["-1"]
  }

  // Navigation handler
  const handleNavigation = (direction) => {
    setIsPaused(true)
    setActiveDestination((prev) =>
      direction === "next" ? (prev + 1) % destinations.length : (prev - 1 + destinations.length) % destinations.length,
    )
    setTimeout(() => setIsPaused(false), 5000)
  }

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-b from-sky-100 via-sky-50 to-white text-sky-950 font-sans overflow-hidden">
      {/* Tailwind CSS for styling */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Playfair+Display:wght@700;900&display=swap');
        body {
          font-family: 'Poppins', sans-serif;
          margin: 0;
          padding: 0;
        }
        h1, h2, h3 {
          font-family: 'Playfair Display', serif;
        }
        .perspective {
          perspective: 1200px;
        }
        .glass {
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }
        .glow {
          box-shadow: 0 4px 20px rgba(14, 165, 233, 0.3);
        }
        .hover-glow:hover {
          box-shadow: 0 8px 32px rgba(14, 165, 233, 0.4);
        }
        @keyframes floating {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
          100% { transform: translateY(0px); }
        }
        .floating {
          animation: floating 3s ease-in-out infinite;
        }
        .gradient-button {
          background: linear-gradient(45deg, #0ea5e9, #38bdf8);
          background-size: 200% 200%;
          transition: all 0.4s ease;
        }
        .gradient-button:hover {
          background-position: right center;
          transform: scale(1.05);
          box-shadow: 0 10px 25px -5px rgba(14, 165, 233, 0.4);
        }
        .outline-button {
          background: rgba(255, 255, 255, 0.2);
          border: 1px solid rgba(14, 165, 233, 0.3);
          backdrop-filter: blur(4px);
          transition: all 0.3s ease;
        }
        .outline-button:hover {
          background: rgba(14, 165, 233, 0.1);
          border-color: rgba(14, 165, 233, 0.5);
          box-shadow: 0 10px 25px -5px rgba(14, 165, 233, 0.2);
        }
        @keyframes textGradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animated-gradient-text {
          background: linear-gradient(to right, #0369a1, #0ea5e9, #0369a1);
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          animation: textGradient 5s ease infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .animated-gradient-text {
            animation: none;
            background-position: 0% 50%;
          }
          .floating {
            animation: none;
          }
        }
        .ribbon {
          position: absolute;
          top: 10px;
          left: -5px;
          padding: 3px 8px;
          background-color: #0ea5e9;
          color: white;
          font-size: 0.75rem;
          font-weight: 600;
          z-index: 10;
        }
        .ribbon:before {
          content: '';
          position: absolute;
          left: 0;
          bottom: -5px;
          border-top: 5px solid #0369a1;
          border-left: 5px solid transparent;
        }
        .price-badge {
          position: absolute;
          top: 10px;
          right: 10px;
          padding: 4px 8px;
          background: linear-gradient(45deg, #0ea5e9, #38bdf8);
          color: white;
          font-size: 0.75rem;
          font-weight: 600;
          border-radius: 4px;
          z-index: 10;
          transform-origin: center;
        }
        .card-hover:hover .price-badge {
          animation: bounce 0.5s ease;
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .bg-pulse {
          animation: pulse 4s ease-in-out infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.5; }
        }
        .card-shadow {
          box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
        }
        .card-shadow:hover {
          box-shadow: 0 20px 40px -5px rgba(14, 165, 233, 0.2);
        }
        .text-shadow {
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        .nav-button {
          transition: all 0.3s ease;
        }
        .nav-button:hover {
          transform: scale(1.1);
          background: rgba(255, 255, 255, 0.3);
        }
      `}</style>

      {/* Enhanced Animated Background */}
      <AnimatedBackground />

      {/* Hero Background with Parallax */}
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
            animate={{ scale: [1, 1.03, 1] }}
            transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            srcSet={`${destinations[activeDestination].image}&w=1200 1200w, ${destinations[activeDestination].image}&w=800 800w, ${destinations[activeDestination].image}&w=400 400w`}
            sizes="(max-width: 768px) 400px, (max-width: 1200px) 800px, 1200px"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-sky-900/50 via-sky-800/30 to-transparent"></div>

          {/* Background overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-sky-100/80 via-sky-50/50 to-white/30 mix-blend-overlay"></div>
        </motion.div>
      </AnimatePresence>

      {/* Hero Section */}
      <main className="relative z-10 min-h-screen flex flex-col justify-center px-4 sm:px-8 lg:px-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeDestination}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            className="max-w-6xl mx-auto text-center lg:text-left"
          >

            <motion.h1
              className={`text-4xl sm:text-5xl lg:text-7xl font-extrabold leading-tight text-shadow ${prefersReducedMotion ? "text-yellow-500" : "animated-gradient-text"}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {destinations[activeDestination].title}
            </motion.h1>
            <motion.p
              className="mt-4 text-base sm:text-lg text-white leading-relaxed max-w-md mx-auto lg:mx-0 transition-colors duration-300 ease-in-out hover:text-white"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {destinations[activeDestination].description}
            </motion.p>
            <motion.div
              className="mt-8 flex flex-col sm:flex-row items-center lg:items-start gap-4 sm:gap-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              {/* Book Now Button */}


            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Carousel Section */}
        <motion.section
          className="relative w-full max-w-7xl mx-auto py-12 px-4 perspective"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          onMouseMove={handleMouseMove}
          {...swipeHandlers}
        >
          <div className="relative h-[320px] sm:h-[400px] flex items-center justify-center gap-6 sm:gap-8">
            <AnimatePresence>
              {destinations.map((destination, index) => {
                return (
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
                )
              })}
            </AnimatePresence>

            {/* Navigation buttons with fade-in effect */}
            <motion.div
              className="absolute inset-0 flex items-center justify-between px-2 pointer-events-none"
              initial={{ opacity: 0.5 }}
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <button
                className="p-3 rounded-full glass hover:bg-sky-100/50 transition-all duration-300 pointer-events-auto nav-button"
                onClick={() => handleNavigation("prev")}
                aria-label="Previous destination"
              >
                <ChevronLeftIcon className="h-5 w-5 text-sky-800" />
              </button>

              <button
                className="p-3 rounded-full glass hover:bg-sky-100/50 transition-all duration-300 pointer-events-auto nav-button"
                onClick={() => handleNavigation("next")}
                aria-label="Next destination"
              >
                <ChevronRightIcon className="h-5 w-5 text-sky-800" />
              </button>
            </motion.div>
          </div>

          {/* Dots and Progress Bar */}
          <div className="flex flex-col items-center mt-6 gap-3">
            <div className="flex justify-center gap-3">
              {destinations.map((_, index) => (
                <motion.button
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === activeDestination ? "bg-sky-500 scale-125 glow" : "bg-sky-200"
                  }`}
                  onClick={() => setActiveDestination(index)}
                  whileHover={{ scale: 1.4 }}
                  whileTap={{ scale: 1.1 }}
                  aria-label={`Go to destination ${index + 1}`}
                  aria-current={index === activeDestination ? "true" : "false"}
                />
              ))}
            </div>

            {/* Progress Bar */}
            <div className="w-32 sm:w-48">
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

    // Position-based style lookup
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
      className={`absolute w-[240px] sm:w-[280px] h-[360px] rounded-2xl overflow-hidden card-shadow cursor-pointer ${
        index === activeDestination ? "hover-glow" : ""
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
        <div className="absolute inset-0 bg-gradient-to-t from-sky-900/80 via-sky-800/40 to-transparent"></div>

        {/* Price Badge */}

        {/* Featured Label */}
        {destination.featured && <div className="ribbon">Featured</div>}

        <div className="absolute bottom-6 left-6 text-white space-y-2">
          <h3 className="text-xl sm:text-2xl font-bold drop-shadow-md">{destination.name}</h3>

        </div>
      </div>
    </motion.div>
  )
}
