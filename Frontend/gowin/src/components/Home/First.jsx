"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion"
import { ArrowRightIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline"
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

// Enhanced animated background component
const AnimatedBackground = () => {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    let particles = []
    let animationFrameId
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    if (prefersReducedMotion) return

    const setCanvasDimensions = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    setCanvasDimensions()
    window.addEventListener("resize", setCanvasDimensions)

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
          color: `rgba(59, 130, 246, ${Math.random() * 0.4 + 0.1})`, // blue-500
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

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((particle) => {
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

        particle.x += particle.speedX
        particle.y += particle.speedY

        if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1
        if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1
      })

      particles.forEach((particle, i) => {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particle.x - particles[j].x
          const dy = particle.y - particles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 100) {
            ctx.beginPath()
            ctx.strokeStyle = `rgba(59, 130, 246, ${0.2 * (1 - distance / 100)})` // blue-500
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

  return <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none opacity-50" aria-hidden="true" />
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
      }, 20)
    }

    return () => clearInterval(interval)
  }, [isPaused, activeDestination])

  return (
    <div className="w-full h-1.5 bg-gray-600 rounded-full mt-2 overflow-hidden">
      <motion.div
        className="h-full bg-blue-500 rounded-full"
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
    <div className="relative w-full min-h-screen bg-gray-900 text-white font-sans overflow-hidden">
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
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        .glow {
          box-shadow: 0 4px 20px rgba(59, 130, 246, 0.3);
        }
        .hover-glow:hover {
          box-shadow: 0 8px 32px rgba(59, 130, 246, 0.4);
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
          background: linear-gradient(45deg, #3b82f6, #60a5fa);
          background-size: 200% 200%;
          transition: all 0.4s ease;
        }
        .gradient-button:hover {
          background-position: right center;
          transform: scale(1.05);
          box-shadow: 0 10px 25px -5px rgba(59, 130, 246, 0.4);
        }
        .outline-button {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(59, 130, 246, 0.3);
          backdrop-filter: blur(4px);
          transition: all 0.3s ease;
        }
        .outline-button:hover {
          background: rgba(59, 130, 246, 0.1);
          border-color: rgba(59, 130, 246, 0.5);
          box-shadow: 0 10px 25px -5px rgba(59, 130, 246, 0.2);
        }
        @keyframes textGradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animated-gradient-text {
          background: linear-gradient(to right, #1e40af, #3b82f6, #1e40af);
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          animation: textGradient 5s ease infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .animated-gradient-text {
            animation: none;
            background: #3b82f6;
            -webkit-background-clip: text;
            background-clip: text;
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
          background-color: #3b82f6;
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
          border-top: 5px solid #1e40af;
          border-left: 5px solid transparent;
        }
        .price-badge {
          position: absolute;
          top: 10px;
          right: 10px;
          padding: 4px 8px;
          background: linear-gradient(45deg, #3b82f6, #60a5fa);
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
          box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.2);
          transition: all 0.3s ease;
        }
        .card-shadow:hover {
          box-shadow: 0 20px 40px -5px rgba(59, 130, 246, 0.3);
        }
        .text-shadow {
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        }
        .nav-button {
          transition: all 0.3s ease;
        }
        .nav-button:hover {
          transform: scale(1.1);
          background: rgba(255, 255, 255, 0.2);
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
            animate={{ scale: [1, 1.03, 1] }}
            transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            srcSet={`${destinations[activeDestination].image}&w=1200 1200w, ${destinations[activeDestination].image}&w=800 800w, ${destinations[activeDestination].image}&w=400 400w`}
            sizes="(max-width: 640px) 400px, (max-width: 1024px) 800px, 1200px"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/60 via-gray-800/40 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900/50 via-gray-800/30 to-gray-900/20 mix-blend-overlay"></div>
        </motion.div>
      </AnimatePresence>

      <main className="relative z-10 min-h-screen flex flex-col justify-center px-4 sm:px-6 lg:px-8">
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
              className={`text-3xl sm:text-4xl lg:text-6xl font-extrabold leading-tight text-white text-shadow ${prefersReducedMotion ? "text-blue-400" : "animated-gradient-text"}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {destinations[activeDestination].title}
            </motion.h1>
            <motion.p
              className="mt-3 text-sm sm:text-base text-gray-300 leading-relaxed max-w-md mx-auto lg:mx-0 transition-colors duration-300 ease-in-out hover:text-white"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {destinations[activeDestination].description}
            </motion.p>
            <motion.div
              className="mt-6 flex flex-col sm:flex-row items-center lg:items-start gap-3 sm:gap-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >

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
                  className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                    index === activeDestination ? "bg-blue-500 scale-125 glow" : "bg-gray-600"
                  }`}
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
      className={`absolute w-[200px] sm:w-[240px] lg:w-[280px] h-[300px] sm:h-[340px] lg:h-[360px] rounded-2xl overflow-hidden card-shadow cursor-pointer ${
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