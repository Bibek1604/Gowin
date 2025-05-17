import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRightIcon, ChevronLeftIcon, ChevronRightIcon, StarIcon } from "@heroicons/react/24/outline";
import bali from "../../assets/bali.jpeg";
import thailand from "../../assets/thiland.jpeg";
import kerala from "../../assets/kerela.jpeg";

const destinations = [
  {
    id: 1,
    name: "Bali",
    title: "BALI, INDONESIA",
    description:
      "Discover the Island of the Gods, where vibrant culture meets stunning beaches, lush rice terraces, and volcanic landscapes.",
    image: bali,
    price: "$1,200",
    rating: 4.8,
  },
  {
    id: 2,
    name: "Thailand",
    title: "THAILAND",
    description:
      "Experience the Land of Smiles with its golden temples, bustling markets, and pristine islands.",
    image: thailand,
    price: "$1,500",
    rating: 4.7,
  },
  {
    id: 3,
    name: "Kerala",
    title: "KERALA, INDIA",
    description:
      "Explore God's Own Country, famous for its serene backwaters, lush tea plantations, and vibrant wildlife.",
    image: kerala,
    price: "$1,000",
    rating: 4.9,
  },
];

export default function First() {
  const [activeDestination, setActiveDestination] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const autoSlideIntervalRef = useRef(null);

  useEffect(() => {
    if (!isPaused && !isHovering) {
      autoSlideIntervalRef.current = setInterval(() => {
        setActiveDestination((prev) => (prev + 1) % destinations.length);
      }, 4000);
    }
    return () => clearInterval(autoSlideIntervalRef.current);
  }, [isPaused, isHovering]);

  const getVisibleIndices = () => {
    const indices = [];
    indices.push(activeDestination);
    indices.push((activeDestination + 1) % destinations.length);
    indices.push((activeDestination - 1 + destinations.length) % destinations.length);
    return indices;
  };

  const visibleIndices = getVisibleIndices();

  const getSlideStyles = (index) => {
    const position = visibleIndices.indexOf(index);
    if (position === -1) {
      return { x: "100%", scale: 0.6, opacity: 0, zIndex: 0, rotateY: 0 };
    }
    switch (position) {
      case 0:
        return { x: "0%", scale: 1, opacity: 1, zIndex: 30, rotateY: 0 };
      case 1:
        return { x: "65%", scale: 0.85, opacity: 0.8, zIndex: 20, rotateY: 20 };
      case 2:
        return { x: "-65%", scale: 0.85, opacity: 0.8, zIndex: 20, rotateY: -20 };
      default:
        return { x: "100%", scale: 0.6, opacity: 0, zIndex: 0, rotateY: 0 };
    }
  };

  const handleNavigation = (direction) => {
    setIsPaused(true);
    setActiveDestination((prev) =>
      direction === "next"
        ? (prev + 1) % destinations.length
        : (prev - 1 + destinations.length) % destinations.length
    );
    setTimeout(() => setIsPaused(false), 5000);
  };

  const formatIndex = (index) => (index + 1).toString().padStart(2, "0");

  return (
    <div className="relative w-screen h-screen bg-black text-white font-sans overflow-hidden">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@200;300;400;500;600;700&family=Playfair+Display:wght@700;900&display=swap');
        body {
          font-family: 'Inter', sans-serif;
          margin: 0;
          padding: 0;
          overflow: hidden;
        }
        h1, h2, h3 {
          font-family: 'Playfair Display', serif;
        }
        .perspective {
          perspective: 1400px;
        }
        .glass {
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.25);
        }
        .glow {
          box-shadow: 0 0 20px rgba(251, 191, 36, 0.5);
        }
        @keyframes floating {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
          100% { transform: translateY(0px); }
        }
        .floating {
          animation: floating 3.5s ease-in-out infinite;
        }
        .gradient-button {
          background: linear-gradient(45deg, #FBBF24, #F97316);
          background-size: 200% 200%;
          transition: background-position 0.3s ease;
        }
        .gradient-button:hover {
          background-position: right center;
        }
      `}</style>

      {/* Hero Background with Enhanced Parallax */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeDestination}
          initial={{ opacity: 0, scale: 1.2 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.2 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute inset-0 z-0"
        >
          <motion.img
            src={destinations[activeDestination].image}
            alt={destinations[activeDestination].name}
            className="w-full h-full object-cover"
            loading="lazy"
            animate={{ scale: 1.1 }}
            transition={{ duration: 15, repeat: Infinity, repeatType: "reverse", ease: "linear" }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/50 to-black/25"></div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Dots */}
      <div className="fixed left-4 lg:left-12 top-1/2 -translate-y-1/2 hidden sm:flex flex-col gap-4 z-50">
        {destinations.map((_, index) => (
          <motion.button
            key={index}
            className={`w-4 h-4 rounded-full transition-all duration-300 ${
              index === activeDestination ? "bg-amber-400 scale-125 glow" : "bg-white/50"
            }`}
            onClick={() => setActiveDestination(index)}
            whileHover={{ scale: 1.8, backgroundColor: "#FBBF24" }}
            whileTap={{ scale: 1.2 }}
            aria-label={`Go to ${destinations[index].name}`}
          />
        ))}
      </div>

      {/* Hero Section */}
      <main className="relative z-10 h-full flex flex-col justify-center px-6 sm:px-12 lg:px-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeDestination}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="max-w-4xl mx-auto text-center sm:text-left"
          >
            <motion.p
              className="text-lg sm:text-xl lg:text-2xl text-amber-200/85 font-light mb-4 tracking-wide"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.1 }}
            >
              Embark on a Journey of a Lifetime
            </motion.p>
            <motion.h1
              className="text-4xl sm:text-6xl lg:text-8xl font-extrabold bg-clip-text text-transparent bg-gradient-to-b from-amber-100 to-amber-500 leading-tight tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.2 }}
            >
              {destinations[activeDestination].title}
            </motion.h1>
            <motion.p
              className="mt-5 text-base sm:text-lg lg:text-xl text-amber-100/90 leading-relaxed max-w-lg mx-auto sm:mx-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.3 }}
            >
              {destinations[activeDestination].description}
            </motion.p>
            <motion.div
              className="mt-10 flex flex-col sm:flex-row items-center sm:items-start gap-5 sm:gap-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.4 }}
            >
              <motion.button
                className="flex items-center gap-3 gradient-button text-white px-10 py-4 rounded-full font-semibold text-lg sm:text-xl shadow-xl hover:shadow-amber-500/60 transition-all duration-300 glow floating"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
              >
                Book Now
                <ArrowRightIcon className="h-6 w-6" />
              </motion.button>
              <motion.span className="text-xl sm:text-2xl font-semibold text-amber-100">
                From {destinations[activeDestination].price}
              </motion.span>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Enhanced Carousel */}
        <motion.section
          className="relative w-full max-w-6xl mx-auto py-16 px-6 perspective"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <div className="relative h-[360px] sm:h-[420px] flex items-center justify-center gap-10 overflow-hidden">
            <AnimatePresence>
              {destinations.map((destination, index) => (
                <motion.div
                  key={destination.id}
                  className="absolute w-[280px] h-[400px] rounded-3xl overflow-hidden shadow-2xl cursor-pointer"
                  animate={getSlideStyles(index)}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                  onClick={() => setActiveDestination(index)}
                >
                  <div className="relative w-full h-full glass">
                    <img
                      src={destination.image}
                      alt={destination.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                    <div className="absolute bottom-8 left-8 text-white space-y-3">
                      <h3 className="text-2xl font-bold drop-shadow-lg">{destination.name}</h3>
                      <div className="flex items-center">
                        <StarIcon className="h-6 w-6 text-yellow-400" />
                        <span className="ml-2 text-lg font-medium">{destination.rating}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            <button
              className="absolute left-6 top-1/2 -translate-y-1/2 p-4 rounded-full glass hover:scale-110 transition-all duration-300"
              onClick={() => handleNavigation("prev")}
            >
              <ChevronLeftIcon className="h-6 w-6 text-white" />
            </button>
            <button
              className="absolute right-6 top-1/2 -translate-y-1/2 p-4 rounded-full glass hover:scale-110 transition-all duration-300"
              onClick={() => handleNavigation("next")}
            >
              <ChevronRightIcon className="h-6 w-6 text-white" />
            </button>
          </div>

          <div className="flex justify-center mt-8 gap-4">
            {destinations.map((_, index) => (
              <motion.button
                key={index}
                className={`w-4 h-4 rounded-full transition-all duration-300 ${
                  index === activeDestination ? "bg-amber-400 scale-125 glow" : "bg-white/50"
                }`}
                onClick={() => setActiveDestination(index)}
                whileHover={{ scale: 1.5 }}
                whileTap={{ scale: 1.1 }}
              />
            ))}
          </div>
        </motion.section>
      </main>
    </div>
  );
}