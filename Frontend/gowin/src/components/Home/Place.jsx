"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Star,
  MapPin,
  Calendar,
  Heart,
} from "lucide-react";
import { Link } from "react-router-dom";
import usePlaceStore from "../Store/PlaceStore";
import React from "react";

function DestinationCard({ destination }) {
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <div className="relative h-full flex flex-col bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="relative h-64 overflow-hidden">
        <img
          src={
            destination.image ||
            "/placeholder.svg?height=400&width=600&text=Placeholder"
          }
          alt={destination.placeName}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsFavorite(!isFavorite);
          }}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/40 transition-colors"
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart
            className={`w-5 h-5 ${
              isFavorite ? "text-red-500 fill-red-500" : "text-white"
            }`}
          />
        </button>
        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
          <div className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-bold text-teal-700">
            {destination.price || "$2,199"}
          </div>

        </div>
      </div>
      <div className="p-5 flex-grow flex flex-col">
        <h3 className="text-xl font-bold text-teal-800">
          {destination.placeName}
        </h3>
        <p className="text-teal-600 mt-2 flex-grow text-sm">
          {destination.description}
        </p>
        <div className="mt-4 space-y-2 pt-3 border-t border-teal-100">
          <div className="flex items-center text-sm text-teal-700">
            <MapPin className="w-4 h-4 mr-2 text-cyan-500" />
            <span>{destination.continent}</span>
          </div>
                    <div className="flex items-center text-sm text-teal-700">
            <MapPin className="w-4 h-4 mr-2 text-cyan-500" />
            <span>{destination.country}</span>
          </div>
          <div className="flex items-center text-sm text-teal-700">
            <Calendar className="w-4 h-4 mr-2 text-cyan-500" />
            <span>Best time: {destination.bestTime || "Spring & Fall"}</span>
          </div>
          <div className="flex items-center bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full">
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
            <Link
              to="/details"
              className="text-sm font-medium text-teal-700 ml-1"
            >
              <span className="text-sm font-medium text-red-700 ml-1">
                Details
              </span>
            </Link>
          </div>
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
          // Add Kyoto as a default place if store is empty
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
    if (currentIndex < destinations.length - visibleCount) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      setCurrentIndex(destinations.length - visibleCount);
    }
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  // Calculate total pages for pagination
  const totalPages = Math.ceil(destinations.length / visibleCount);
  const currentPage = Math.floor(currentIndex / visibleCount);

  return (
    <section className="py-16 px-4 bg-gradient-to-r from-cyan-50 to-teal-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-700 to-teal-700 bg-clip-text text-transparent">
            Explore Dream Destinations
          </h2>
          <p className="text-lg text-teal-600 max-w-2xl mx-auto">
            Discover breathtaking locations from around the world
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-96">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-cyan-200 border-t-cyan-600"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 bg-red-50 p-6 rounded-xl shadow-sm max-w-xl mx-auto">
            <div className="text-xl font-semibold mb-2">Oops!</div>
            {error}
          </div>
        ) : (
          <div className="relative">
            <button
              onClick={prevSlide}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-cyan-50 rounded-full p-4 shadow-lg text-teal-700 -ml-6 border border-cyan-100 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              aria-label="Previous destination"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <div className="overflow-hidden">
              <motion.div
                ref={carouselRef}
                className="flex gap-6"
                animate={{
                  x: `-${currentIndex * (100 / visibleCount)}%`,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                {destinations.map((destination) => (
                  <div
                    key={destination.id}
                    className="flex-none w-full sm:w-1/2 lg:w-1/3 px-2"
                    style={{ paddingBottom: "1rem" }}
                  >
                    <DestinationCard destination={destination} />
                  </div>
                ))}
              </motion.div>
            </div>

            <button
              onClick={nextSlide}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-cyan-50 rounded-full p-4 shadow-lg text-teal-700 -mr-6 border border-cyan-100 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              aria-label="Next destination"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            <div className="flex justify-center mt-8 space-x-2">
              {Array.from({ length: totalPages }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index * visibleCount)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 focus:outline-none ${
                    currentPage === index
                      ? "bg-gradient-to-r from-cyan-500 to-teal-500 w-8"
                      : "bg-cyan-200 hover:bg-cyan-300"
                  }`}
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
