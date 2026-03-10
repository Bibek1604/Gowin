import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Globe,
  MapPin,
  Coffee,
  Info,
  ArrowRight,
  Navigation,
  Compass,
  Star
} from "lucide-react";
import usePlaceStore from "../Store/PlaceStore";
import { Button, SectionHeader } from "../ui";
import colors from "../../theme/colors";

function DestinationCard({ destination }) {
  return (
    <div
      className="relative h-full flex flex-col rounded-[2.5rem] border border-white/5 shadow-2x transition-all duration-500 group hover:translate-y-[-5px]"
      style={{ fontFamily: 'Outfit, sans-serif', background: 'rgba(255, 255, 255, 0.03)', backdropFilter: 'blur(10px)' }}
    >
      <div className="relative h-64 overflow-hidden">
        <img
          src={destination.image || "/placeholder.svg"}
          alt={destination.placeName}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent opacity-90" />

        {/* Price Badge */}
        <div className="absolute top-4 left-4">
          <div
            className="px-4 py-1.5 rounded-full text-[9px] font-black text-white backdrop-blur-xl shadow-2xl uppercase tracking-[0.1em]"
            style={{ background: 'rgba(56, 189, 248, 0.3)', border: '1px solid rgba(255, 255, 255, 0.1)' }}
          >
            {destination.price || "$2,199"}
          </div>
        </div>
      </div>

      <div className="p-6 flex-grow flex flex-col">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-[1px] bg-sky-400 opacity-50"></div>
          <span className="text-[9px] font-black uppercase tracking-[0.3em] text-sky-400">{destination.continent}</span>
        </div>

        <h3 className="text-2xl font-black text-white tracking-tight mb-3 group-hover:text-sky-300 transition-colors leading-tight">
          {destination.placeName}
        </h3>

        <p className="flex-grow text-xs text-slate-400 mb-6 line-clamp-2 leading-relaxed font-medium">
          {destination.description}
        </p>

        <div className="flex items-center justify-between pt-5 border-t border-white/5">
          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-300">
            <MapPin className="w-3 h-3 text-orange-400" />
            <span className="uppercase tracking-widest">{destination.country}</span>
          </div>

          <Link to={`/details/${destination.id}`}>
            <motion.div
              whileHover={{ x: 3 }}
              className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-sky-400 hover:text-white transition-colors"
            >
              Explore <ArrowRight className="w-3 h-3" />
            </motion.div>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function DestinationsCarousel() {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(3);
  const carouselRef = useRef(null);

  const places = usePlaceStore((state) => state.places);

  useEffect(() => {
    const loadDestinations = async () => {
      try {
        if (places.length === 0) {
          setDestinations([
            {
              id: "1",
              placeName: "Kyoto",
              description: "Experience the charm of traditional Japan.",
              continent: "Asia",
              country: "Japan",
              image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600",
              rating: 4.8,
              price: "$2,199",
              bestTime: "Spring & Fall",
            },
          ]);
        } else {
          setDestinations(
            places.map((place) => ({
              ...place,
              rating: place.rating || 4.8,
              price: place.price || "$2,199",
              bestTime: place.bestTime || "Spring & Fall",
            }))
          );
        }
      } catch (error) {
        console.error("Error loading destinations:", error);
        setError("Failed to load destinations. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadDestinations();
  }, [places]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setVisibleCount(1);
      } else if (window.innerWidth < 1024) {
        setVisibleCount(2);
      } else {
        setVisibleCount(3);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prev) =>
      prev < destinations.length - visibleCount ? prev + 1 : 0
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prev) =>
      prev > 0 ? prev - 1 : destinations.length - visibleCount
    );
  };

  const totalPages = Math.ceil(destinations.length / visibleCount);
  const currentPage = Math.floor(currentIndex / visibleCount);

  const headerIcons = [];

  return (
    <section
      className="py-24 px-4 overflow-hidden relative"
      style={{ background: '#020617' }}
    >
      {/* Dynamic Route Background */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <path d="M 0 100 Q 250 50 500 200 T 1000 100" fill="none" stroke="white" strokeWidth="2" strokeDasharray="8 8" />
          <path d="M 0 400 Q 300 300 600 500 T 1200 400" fill="none" stroke="white" strokeWidth="2" strokeDasharray="8 8" />
          <path d="M 100 0 Q 300 400 0 800" fill="none" stroke="white" strokeWidth="2" strokeDasharray="8 8" opacity="0.5" />
        </svg>
      </div>

      <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/10 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/10 blur-[120px] rounded-full"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <SectionHeader
          title="World Explorer"
          subtitle="Simple steps to your next great adventure"
          className="text-sky-400 mb-20"
        />

        {loading ? (
          <div className="flex justify-center items-center h-96">
            <div
              className="animate-spin rounded-full h-16 w-16 border-4 border-t-4"
              style={{ borderColor: colors.neutral.lightGray, borderTopColor: colors.primary.navy }}
            />
          </div>
        ) : error ? (
          <div
            className="text-center bg-red-50 p-6 rounded-xl shadow-sm max-w-xl mx-auto"
            style={{ color: colors.accent.coral }}
          >
            <div className="text-xl font-semibold mb-2">
              <i className="fas fa-exclamation-triangle mr-2"></i>
              Oops!
            </div>
            {error}
          </div>
        ) : (
          <div className="relative">
            {/* Navigation Buttons */}
            <button
              onClick={prevSlide}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 glass rounded-full p-5 shadow-2xl -ml-8 focus:outline-none transition-all duration-500 transform hover:scale-110 hover:bg-sky-500 group"
              aria-label="Previous destination"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>

            {/* Carousel */}
            <div className="overflow-hidden">
              <motion.div
                ref={carouselRef}
                className="flex gap-6"
                animate={{ x: `-${currentIndex * (100 / visibleCount)}%` }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                {destinations.map((destination) => (
                  <div
                    key={destination.id}
                    className="flex-none w-full sm:w-1/2 lg:w-1/3 px-2"
                  >
                    <DestinationCard destination={destination} />
                  </div>
                ))}
              </motion.div>
            </div>

            <button
              onClick={nextSlide}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 glass rounded-full p-5 shadow-2xl -mr-8 focus:outline-none transition-all duration-500 transform hover:scale-110 hover:bg-sky-500 group"
              aria-label="Next destination"
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>

            {/* Pagination Dots */}
            <div className="flex justify-center mt-8 space-x-2">
              {Array.from({ length: totalPages }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index * visibleCount)}
                  className="h-3 rounded-full transition-all duration-300 focus:outline-none hover:opacity-80"
                  style={{
                    width: currentPage === index ? '40px' : '10px',
                    background: currentPage === index ? colors.primary.navy : 'rgba(255,255,255,0.1)'
                  }}
                  aria-label={`Go to page ${index + 1}`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
