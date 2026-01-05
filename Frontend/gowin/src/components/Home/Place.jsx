import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import React from "react";
import usePlaceStore from "../Store/PlaceStore";
import { Button, SectionHeader } from "../ui";
import colors from "../../theme/colors";

function DestinationCard({ destination }) {
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <div className="relative h-full flex flex-col bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
      <div className="relative h-64 overflow-hidden group">
        <img
          src={destination.image || "/placeholder.svg"}
          alt={destination.placeName}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        
        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsFavorite(!isFavorite);
          }}
          className="absolute top-4 right-4 z-10 p-2 rounded-full backdrop-blur-sm transition-all transform hover:scale-110"
          style={{
            background: isFavorite ? colors.gradients.vibrant : 'rgba(255, 255, 255, 0.2)'
          }}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart className={`w-5 h-5 ${isFavorite ? "text-white fill-white" : "text-white"}`} />
        </button>
        
        {/* Price Badge */}
        <div className="absolute bottom-4 left-4">
          <div 
            className="px-4 py-2 rounded-full text-sm font-bold text-white backdrop-blur-sm shadow-lg"
            style={{ background: colors.gradients.warm }}
          >
            <i className="fas fa-tag mr-2"></i>
            {destination.price || "$2,199"}
          </div>
        </div>
      </div>
      
      <div className="p-5 flex-grow flex flex-col">
        <h3 
          className="text-xl font-bold subheading-font mb-2"
          style={{ color: colors.primary.teal }}
        >
          {destination.placeName}
        </h3>
        
        <p className="flex-grow text-sm mb-4 line-clamp-2 leading-relaxed" style={{ color: colors.neutral.gray }}>
          {destination.description}
        </p>
        
        <div className="space-y-2 pt-3 border-t" style={{ borderColor: colors.accent.skyBlue }}>
          <div className="flex items-center text-sm" style={{ color: colors.neutral.darkGray }}>
            <i className="fas fa-globe w-4 mr-2" style={{ color: colors.accent.skyBlue }}></i>
            <span>{destination.continent}</span>
          </div>
          
          <div className="flex items-center text-sm" style={{ color: colors.neutral.darkGray }}>
            <i className="fas fa-flag w-4 mr-2" style={{ color: colors.primary.teal }}></i>
            <span>{destination.country}</span>
          </div>
          
          <div className="flex items-center text-sm" style={{ color: colors.neutral.darkGray }}>
            <i className="fas fa-calendar-alt w-4 mr-2" style={{ color: colors.accent.yellow }}></i>
            <span>Best: {destination.bestTime || "Spring & Fall"}</span>
          </div>
          
          <Link to={`/details/${destination.id}`} className="block mt-3">
            <Button variant="primary" size="sm" className="w-full" icon="fas fa-info-circle" iconRight="fas fa-arrow-right">
              View Details
            </Button>
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

  const headerIcons = [
    { name: 'fas fa-plane', color: colors.accent.orange },
    { name: 'fas fa-hotel', color: colors.primary.teal },
    { name: 'fas fa-mountain', color: colors.accent.skyBlue },
    { name: 'fas fa-camera', color: colors.accent.yellow },
  ];

  return (
    <section 
      className="py-16 px-4"
      style={{ background: `linear-gradient(135deg, ${colors.neutral.white} 0%, ${colors.neutral.offWhite} 100%)` }}
    >
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          title="Explore Dream Destinations"
          subtitle={
            <>
              <i className="fas fa-compass mr-2" style={{ color: colors.accent.orange }}></i>
              Discover breathtaking locations from around the world
              <i className="fas fa-map-marked-alt ml-2" style={{ color: colors.accent.skyBlue }}></i>
            </>
          }
          icons={headerIcons}
        />

        {loading ? (
          <div className="flex justify-center items-center h-96">
            <div 
              className="animate-spin rounded-full h-16 w-16 border-4 border-t-4"
              style={{ borderColor: colors.neutral.lightGray, borderTopColor: colors.primary.teal }}
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
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-4 shadow-lg -ml-6 focus:outline-none focus:ring-2 transition-all duration-300 transform hover:scale-110"
              style={{ 
                color: colors.primary.teal,
                borderColor: colors.accent.skyBlue,
                border: '2px solid'
              }}
              aria-label="Previous destination"
            >
              <ChevronLeft className="w-6 h-6" />
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
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-4 shadow-lg -mr-6 focus:outline-none focus:ring-2 transition-all duration-300 transform hover:scale-110"
              style={{ 
                color: colors.primary.teal,
                borderColor: colors.accent.skyBlue,
                border: '2px solid'
              }}
              aria-label="Next destination"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Pagination Dots */}
            <div className="flex justify-center mt-8 space-x-2">
              {Array.from({ length: totalPages }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index * visibleCount)}
                  className="h-3 rounded-full transition-all duration-300 focus:outline-none hover:opacity-80"
                  style={{
                    width: currentPage === index ? '32px' : '12px',
                    background: currentPage === index ? colors.gradients.primary : colors.neutral.lightGray
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
