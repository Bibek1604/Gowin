import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  MapPin,
  Calendar,
  Star,
  Heart,
  ChevronDown,
  ChevronUp,
  Clock,
  DollarSign,
  BookOpen,
} from "lucide-react";
import usePlaceStore from "../Store/PlaceStore"; // Adjust path as needed

function DestinationDetails() {
  const { placeId } = useParams();
  const { places } = usePlaceStore();

  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showItinerary, setShowItinerary] = useState(false);
  const [bookingDetails, setBookingDetails] = useState({
    travelers: 1,
    date: "",
    specialRequests: "",
  });

  useEffect(() => {
    const loadDestination = () => {
      try {
        // Fetch place by placeId from usePlaceStore
        const place = places.find((p) => p.id === placeId);

        if (!place) {
          setError("No destination found for this ID.");
          setLoading(false);
          return;
        }

        // Map place data to match expected structure
        const mappedDestination = {
          id: place.id,
          title: place.placeName || place.title || "Unknown Destination", // Use placeName or title
          image:
            place.image || "https://via.placeholder.com/1200x600?text=No+Image",
          location: place.country || place.location || "Unknown Location", // Use country or location
          rating: place.rating || 0,
          description: place.description || "No description available.",
          highlights: place.highlights || ["No highlights available"],
          itinerary:
            place.itinerary && place.itinerary.length > 0
              ? place.itinerary
              : [{ day: 1, title: "Arrival", description: "Arrive and explore." }],
          price: place.price || "$0",
          bestTime: place.bestTime || "Any time",
          inclusions: place.inclusions || ["No inclusions specified"],
        };

        setDestination(mappedDestination);
        setLoading(false);
      } catch (err) {
        setError("Failed to load destination details.");
        setLoading(false);
      }
    };

    loadDestination();
  }, [placeId, places]);

  const handleBookingChange = (e) => {
    const { name, value } = e.target;
    setBookingDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    if (destination) {
      alert(
        `Booking submitted for ${destination.title}!\nTravelers: ${
          bookingDetails.travelers
        }\nDate: ${bookingDetails.date}\nRequests: ${
          bookingDetails.specialRequests
        }`
      );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-r from-cyan-50 to-teal-50">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-cyan-200 border-t-cyan-600"></div>
      </div>
    );
  }

  if (error || !destination) {
    return (
      <div className="text-center text-red-500 bg-red-50 p-6 rounded-xl shadow-sm max-w-xl mx-auto mt-16">
        <div className="text-xl font-semibold mb-2">Oops!</div>
        {error || "No destination details available."}
      </div>
    );
  }

  return (
    <section className="py-16 px-4 bg-gradient-to-r from-cyan-50 to-teal-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Hero */}
        <div className="relative rounded-3xl overflow-hidden shadow-xl">
          <img
            src={destination.image}
            alt={destination.title}
            className="w-full h-[500px] object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="absolute bottom-8 left-8 right-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              {destination.title}
            </h1>
            <div className="flex items-center mt-4 text-white/90">
              <MapPin className="w-5 h-5 mr-2" />
              <span>{destination.location}</span>
              <span className="mx-4">•</span>
              <Star className="w-5 h-5 mr-2 fill-amber-500 text-amber-500" />
              <span>{destination.rating}</span>
            </div>
          </div>
          <button
            onClick={() => setIsFavorite(!isFavorite)}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/40 transition-colors"
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart
              className={`w-6 h-6 ${
                isFavorite ? "text-red-500 fill-red-500" : "text-white"
              }`}
            />
          </button>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-12">
            {/* Description */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-teal-800 mb-4">
                About {destination.title}
              </h2>
              <p className="text-teal-600 leading-relaxed">
                {destination.description}
              </p>
            </div>

            {/* Highlights */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-teal-800 mb-4">
                Highlights
              </h2>
              <ul className="space-y-3">
                {destination.highlights.map((highlight, index) => (
                  <li key={index} className="flex items-start">
                    <Star className="w-5 h-5 text-cyan-500 mr-3 mt-1" />
                    <span className="text-teal-600">{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Itinerary */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <button
                className="flex justify-between items-center w-full text-2xl font-bold text-teal-800 mb-4"
                onClick={() => setShowItinerary(!showItinerary)}
              >
                Itinerary
                {showItinerary ? (
                  <ChevronUp className="w-6 h-6" />
                ) : (
                  <ChevronDown className="w-6 h-6" />
                )}
              </button>
              {showItinerary && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {destination.itinerary.map((day, index) => (
                    <div key={index} className="mb-6">
                      <h3 className="text-lg font-semibold text-teal-700">
                        Day {day.day}: {day.title}
                      </h3>
                      <p className="text-teal-600 mt-2">{day.description}</p>
                    </div>
                  ))}
                </motion.div>
              )}
            </div>
          </div>

          {/* Right Column: Booking */}
          <div className="space-y-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg sticky top-24">
              <h2 className="text-2xl font-bold text-teal-800 mb-4">
                Book Your Trip
              </h2>
              <div className="space-y-4">
                <div className="flex items-center text-teal-700">
                  <DollarSign className="w-5 h-5 mr-2 text-cyan-500" />
                  <span className="font-semibold">
                    Price: {destination.price}
                  </span>
                </div>
                <div className="flex items-center text-teal-700">
                  <Calendar className="w-5 h-5 mr-2 text-cyan-500" />
                  <span>Best Time: {destination.bestTime}</span>
                </div>
                <div className="flex items-center text-teal-700">
                  <Clock className="w-5 h-5 mr-2 text-cyan-500" />
                  <span>Duration: {destination.itinerary.length} days</span>
                </div>
              </div>
              <form className="mt-6 space-y-4" onSubmit={handleBookingSubmit}>
                <div>
                  <label className="block text-sm font-medium text-teal-700 mb-2">
                    Number of Travelers
                  </label>
                  <input
                    type="number"
                    name="travelers"
                    value={bookingDetails.travelers}
                    onChange={handleBookingChange}
                    min="1"
                    className="w-full p-3 border border-cyan-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-teal-700 mb-2">
                    Travel Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={bookingDetails.date}
                    onChange={handleBookingChange}
                    className="w-full p-3 border border-cyan-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-teal-700 mb-2">
                    Special Requests
                  </label>
                  <textarea
                    name="specialRequests"
                    value={bookingDetails.specialRequests}
                    onChange={handleBookingChange}
                    rows="4"
                    className="w-full p-3 border border-cyan-200 rounded-lg"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-cyan-500 to-teal-500 text-white py-3 rounded-lg font-semibold hover:from-cyan-600 hover:to-teal-600"
                >
                  Book Now
                </button>
              </form>
            </div>

            {/* Inclusions */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-teal-800 mb-4">
                What's Included
              </h2>
              <ul className="space-y-3">
                {destination.inclusions.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <BookOpen className="w-5 h-5 text-cyan-500 mr-3 mt-1" />
                    <span className="text-teal-600">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <a
            href="/"
            className="inline-block bg-gradient-to-r from-cyan-500 to-teal-500 text-white px-8 py-3 rounded-full font-semibold hover:from-cyan-600 hover:to-teal-600"
          >
            Explore More Destinations
          </a>
        </div>
      </div>
    </section>
  );
}

export default DestinationDetails;