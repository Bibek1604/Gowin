import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeftIcon, ChevronRightIcon, StarIcon } from "@heroicons/react/24/outline";

const destinations = [
  {
    id: 1,
    name: "Kyoto",
    title: "KYOTO, JAPAN",
    description: "Immerse yourself in ancient temples, traditional gardens,...",
    image: "https://via.placeholder.com/300x400?text=Kyoto", // Placeholder; replace with actual image
    location: "Asia",
    rating: 4.8,
    price: "$2,199",
    category: "Cultural",
  },
  {
    id: 2,
    name: "Machu Picchu",
    title: "MACHU PICCHU, PERU",
    description: "Discover the ancient Incan citadel nestled high in the Andes Mountains.",
    image: "https://via.placeholder.com/300x400?text=Machu+Picchu", // Placeholder; replace with actual image
    location: "South America",
    rating: 4.9,
    price: "$2,499",
    category: "Adventure",
  },
  {
    id: 3,
    name: "Amalfi Coast",
    title: "AMALFI COAST, ITALY",
    description: "Explore the stunning coastline with colorful villages perched,...",
    image: "https://via.placeholder.com/300x400?text=Amalfi+Coast", // Placeholder; replace with actual image
    location: "Europe",
    rating: 4.7,
    price: "$2,299",
    category: "Coastal",
  },
];

export default function Place() {
  const [current, setCurrent] = useState(0);
  const [autoplay, setAutoplay] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % destinations.length);
    }, 4000);
    setAutoplay(interval);

    return () => {
      if (autoplay) clearInterval(autoplay);
    };
  }, [autoplay]);

  const handleMouseEnter = useCallback(() => {
    if (autoplay) {
      clearInterval(autoplay);
      setAutoplay(null);
    }
  }, [autoplay]);

  const handleMouseLeave = useCallback(() => {
    if (!autoplay) {
      const interval = setInterval(() => {
        setCurrent((prev) => (prev + 1) % destinations.length);
      }, 4000);
      setAutoplay(interval);
    }
  }, [autoplay]);

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <StarIcon
          key={i}
          className={`h-4 w-4 ${i < Math.floor(rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
        />
      );
    }
    return stars;
  };

  const getVisibleIndices = () => {
    const indices = [];
    indices.push((current - 1 + destinations.length) % destinations.length);
    indices.push(current);
    indices.push((current + 1) % destinations.length);
    return indices;
  };

  const visibleIndices = getVisibleIndices();

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 text-gray-800 font-sans">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@400;500&display=swap');
          body {
            font-family: 'Inter', sans-serif;
            margin: 0;
            padding: 0;
          }
          h3 {
            font-family: 'Playfair Display', serif;
          }
          .glass {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border-radius: 16px;
            border: 1px solid rgba(255, 255, 255, 0.2);
          }
          .gradient-button {
            background: linear-gradient(90deg, #38B2AC, #2C5282);
            transition: transform 0.2s ease;
          }
          .gradient-button:hover {
            transform: scale(1.05);
          }
          .card {
            transition: transform 0.3s ease, box-shadow 0.3s ease;
          }
          .card:hover {
            transform: translateY(-4px);
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
          }
        `}
      </style>

      {/* Carousel Section */}
      <section
        className="relative z-10 w-full max-w-5xl mx-auto py-12 px-4"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="relative flex justify-center gap-6">
          {destinations.map((destination, index) => {
            const isVisible = visibleIndices.includes(index);
            const position = visibleIndices.indexOf(index);
            if (!isVisible) return null;

            return (
              <motion.div
                key={destination.id}
                className="relative w-[300px] h-[400px] rounded-2xl overflow-hidden glass card"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{
                  opacity: position === 1 ? 1 : 0.6,
                  scale: position === 1 ? 1 : 0.95,
                }}
                transition={{ duration: 0.5 }}
                onClick={() => setCurrent(index)}
              >
                {/* Placeholder Background */}
                <div className="absolute inset-0 bg-gray-200 opacity-50 blur-lg"></div>

                {/* Category Badge */}
                <div className="absolute top-4 right-4 bg-teal-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                  {destination.category}
                </div>

                {/* Placeholder Image Icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 16l4-4 4 4 4-4 4 4M12 4v16m8-8H4"
                    />
                  </svg>
                </div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-gray-800/80 to-transparent text-white">
                  <h3 className="text-2xl font-bold mb-2">{destination.title}</h3>
                  <div className="flex items-center mb-2">
                    {renderStars(destination.rating)}
                    <span className="ml-2 text-sm font-medium">{destination.rating}</span>
                  </div>
                  <p className="text-sm mb-4 line-clamp-2">{destination.description}</p>
                  <div className="flex justify-between items-center">
                    <button className="gradient-button text-white px-6 py-2 rounded-full font-medium text-sm">
                      EXPLORE NOW
                    </button>
                    <span className="text-lg font-semibold">{destination.price}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>



        {/* Dots Indicator */}
        <div className="flex justify-center mt-6 gap-2">
          {destinations.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                current === index ? "bg-teal-500" : "bg-gray-400"
              }`}
              onClick={() => setCurrent(index)}
              aria-label={`Go to ${destinations[index].name}`}
            />
          ))}
        </div>
      </section>
    </div>
  );
}