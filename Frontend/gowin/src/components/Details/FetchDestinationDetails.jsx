import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, Calendar, Star, Heart, ChevronDown, ChevronUp, Clock, DollarSign, Users, BookOpen } from "lucide-react";
import React from "react";

// Mock API function to fetch destination details
async function fetchDestinationDetails(id) {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const destinations = [
    {
      id: 1,
      name: "Kyoto",
      title: "Kyoto, Japan",
      description: "Immerse yourself in ancient temples, traditional gardens, and serene Zen culture.",
      image: "/placeholder.svg?height=600&width=1200&text=Kyoto",
      location: "Asia",
      rating: 4.8,
      price: "$2,199",
      bestTime: "Spring & Fall",
      highlights: [
        "Visit the iconic Fushimi Inari Shrine with its thousands of vermilion torii gates",
        "Explore the historic Gion district and spot geishas",
        "Relax in the serene Arashiyama Bamboo Grove",
        "Experience a traditional tea ceremony",
      ],
      itinerary: [
        { day: 1, title: "Arrival & City Introduction", description: "Arrive in Kyoto, check into your ryokan, and enjoy a guided evening walk." },
        { day: 2, title: "Temples & Shrines", description: "Visit Kinkaku-ji, Ryoan-ji, and Fushimi Inari Shrine." },
        { day: 3, title: "Cultural Immersion", description: "Participate in a tea ceremony and explore Gion." },
        { day: 4, title: "Arashiyama & Departure", description: "Tour the bamboo grove and depart." },
      ],
      inclusions: ["4-star accommodation", "Daily breakfast", "Guided tours", "Transportation"],
      reviews: [
        { user: "Emma S.", rating: 5, comment: "An unforgettable journey through Japan's cultural heart!" },
        { user: "Liam T.", rating: 4.5, comment: "Loved the temples, but the itinerary was packed." },
      ],
    },
    // Add more destinations as needed
  ];
  return destinations.find((dest) => dest.id === parseInt(id)) || destinations[0];
}

// Error Boundary Component
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-center text-red-500 bg-red-50 p-6 rounded-xl shadow-sm max-w-xl mx-auto mt-16">
          <div className="text-xl font-semibold mb-2">Something went wrong!</div>
          <p>{this.state.error?.message || "An unexpected error occurred."}</p>
        </div>
      );
    }
    return this.props.children;
  }
}

function DestinationDetails({ params = { id: "1" } }) {
  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showItinerary, setShowItinerary] = useState(false);
  const [showReviews, setShowReviews] = useState(false);
  const [bookingDetails, setBookingDetails] = useState({
    travelers: 1,
    date: "",
    specialRequests: "",
  });

  useEffect(() => {
    const getDestination = async () => {
      try {
        const data = await fetchDestinationDetails(params.id || "1");
        setDestination(data);
      } catch (err) {
        setError("Failed to load destination details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    getDestination();
  }, [params.id]);

  const handleBookingChange = (e) => {
    const { name, value } = e.target;
    setBookingDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    alert(`Booking submitted for ${destination.title}!\nTravelers: ${bookingDetails.travelers}\nDate: ${bookingDetails.date}\nRequests: ${bookingDetails.specialRequests}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-r from-cyan-50 to-teal-50">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-cyan-200 border-t-cyan-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 bg-red-50 p-6 rounded-xl shadow-sm max-w-xl mx-auto mt-16">
        <div className="text-xl font-semibold mb-2">Oops!</div>
        {error}
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <section className="py-16 px-4 bg-gradient-to-r from-cyan-50 to-teal-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="relative rounded-3xl overflow-hidden shadow-xl">
            <img
              src={destination.image}
              alt={destination.name}
              className="w-full h-[500px] object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-8 left-8 right-8">
              <h1 className="text-4xl md:text-5xl font-bold text-white">{destination.title}</h1>
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
              <Heart className={`w-6 h-6 ${isFavorite ? "text-red-500 fill-red-500" : "text-white"}`} />
            </button>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
            {/* Left Column: Description, Highlights, Itinerary */}
            <div className="lg:col-span-2 space-y-12">
              {/* Description */}
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h2 className="text-2xl font-bold text-teal-800 mb-4">About {destination.title}</h2>
                <p className="text-teal-600 leading-relaxed">{destination.description}</p>
              </div>

              {/* Highlights */}
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h2 className="text-2xl font-bold text-teal-800 mb-4">Highlights</h2>
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
                  {showItinerary ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
                </button>
                {showItinerary && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {destination.itinerary.map((day, index) => (
                      <div key={index} className="mb-6">
                        <h3 className="text-lg font-semibold text-teal-700">Day {day.day}: {day.title}</h3>
                        <p className="text-teal-600 mt-2">{day.description}</p>
                      </div>
                    ))}
                  </motion.div>
                )}
              </div>
            </div>

            {/* Right Column: Booking & Info */}
            <div className="space-y-8">
              {/* Booking Card */}
              <div className="bg-white rounded-2xl p-8 shadow-lg sticky top-24">
                <h2 className="text-2xl font-bold text-teal-800 mb-4">Book Your Trip</h2>
                <div className="space-y-4">
                  <div className="flex items-center text-teal-700">
                    <DollarSign className="w-5 h-5 mr-2 text-cyan-500" />
                    <span className="font-semibold">Price: {destination.price}</span>
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
                <div className="mt-6">
                  <label className="block text-sm font-medium text-teal-700 mb-2">Number of Travelers</label>
                  <input
                    type="number"
                    name="travelers"
                    value={bookingDetails.travelers}
                    onChange={handleBookingChange}
                    min="1"
                    className="w-full p-3 border border-cyan-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  />
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-teal-700 mb-2">Travel Date</label>
                  <input
                    type="date"
                    name="date"
                    value={bookingDetails.date}
                    onChange={handleBookingChange}
                    className="w-full p-3 border border-cyan-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  />
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-teal-700 mb-2">Special Requests</label>
                  <textarea
                    name="specialRequests"
                    value={bookingDetails.specialRequests}
                    onChange={handleBookingChange}
                    className="w-full p-3 border border-cyan-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    rows="4"
                  ></textarea>
                </div>
                <button
                  onClick={handleBookingSubmit}
                  className="w-full mt-6 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white py-3 rounded-lg font-semibold transition shadow-md"
                >
                  Book Now
                </button>
              </div>

              {/* Inclusions */}
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h2 className="text-2xl font-bold text-teal-800 mb-4">What's Included</h2>
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

          {/* Reviews Section */}
          <div className="mt-12 bg-white rounded-2xl p-8 shadow-lg">
            <button
              className="flex justify-between items-center w-full text-2xl font-bold text-teal-800 mb-4"
              onClick={() => setShowReviews(!showReviews)}
            >
              Customer Reviews
              {showReviews ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
            </button>
            {showReviews && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {destination.reviews.map((review, index) => (
                  <div key={index} className="mb-6 border-b border-teal-100 pb-4">
                    <div className="flex items-center mb-2">
                      <Users className="w-5 h-5 text-cyan-500 mr-2" />
                      <span className="font-semibold text-teal-700">{review.user}</span>
                      <div className="flex ml-4">
                        {Array.from({ length: Math.floor(review.rating) }).map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-amber-500 fill-amber-500" />
                        ))}
                        {review.rating % 1 !== 0 && (
                          <Star className="w-4 h-4 text-amber-500 fill-amber-500" style={{ clipPath: "inset(0 50% 0 0)" }} />
                        )}
                      </div>
                    </div>
                    <p className="text-teal-600">{review.comment}</p>
                  </div>
                ))}
              </motion.div>
            )}
          </div>

          {/* Call to Action */}
          <div className="mt-12 text-center">
            <a
              href="/destinations"
              className="inline-block bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white px-8 py-3 rounded-full font-semibold transition shadow-md"
            >
              Explore More Destinations
            </a>
          </div>
        </div>
      </section>
    </ErrorBoundary>
  );
}

export default DestinationDetails;
