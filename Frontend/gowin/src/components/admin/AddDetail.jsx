import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit, Trash2, X, Save, MapPin, Calendar, DollarSign, Star } from "lucide-react";
import usePlaceStore from "../Store/PlaceStore"; // Adjust path as needed
import Sidebar from "./Sidebar";
import colors from "../../theme/colors";
import toast, { Toaster } from "react-hot-toast";

// Animation variants for Framer Motion
const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
};

class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-center text-red-600 p-6">
          <h2 className="text-2xl font-bold">Something went wrong.</h2>
          <p>Please refresh the page or try again later.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

function AddPlaceDetails() {
  const { places, addPlace, updatePlace, deletePlace } = usePlaceStore();
  const [selectedPlaceId, setSelectedPlaceId] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlace, setEditingPlace] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    title: "",
    description: "",
    image: "",
    location: "",
    rating: 0,
    price: "",
    bestTime: "",
    highlights: [],
    itinerary: [],
    inclusions: [],
  });
  const [newHighlight, setNewHighlight] = useState("");
  const [newItineraryDay, setNewItineraryDay] = useState({ day: "", title: "", description: "" });
  const [newInclusion, setNewInclusion] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isEditingDetails, setIsEditingDetails] = useState(false);
  const [detailFormData, setDetailFormData] = useState({
    name: "",
    title: "",
    description: "",
    image: "",
    location: "",
    rating: 0,
    price: "",
    bestTime: "",
    highlights: [],
    itinerary: [],
    inclusions: [],
  });
  const [detailNewHighlight, setDetailNewHighlight] = useState("");
  const [detailNewItineraryDay, setDetailNewItineraryDay] = useState({ day: "", title: "", description: "" });
  const [detailNewInclusion, setDetailNewInclusion] = useState("");

  const selectedPlace = places.find((place) => place.id === selectedPlaceId) || null;

  // Current date and time as provided
  const currentDateTime = "11:06 AM +0545 on Friday, May 23, 2025";

  const openModal = (place = null) => {
    if (place) {
      setEditingPlace(place);
      setFormData({
        name: place.placeName || "",
        title: place.placeName || "", // Map placeName to title for consistency
        description: place.description || "",
        image: place.image || "",
        location: place.country || "", // Map country to location
        rating: 0, // Default since AddPlace doesn't have this
        price: "",
        bestTime: "",
        highlights: [],
        itinerary: [],
        inclusions: [],
      });
      setImagePreview(place.image || null);
      setImageFile(null);
    } else {
      setEditingPlace(null);
      setFormData({
        name: "",
        title: "",
        description: "",
        image: "",
        location: "",
        rating: 0,
        price: "",
        bestTime: "",
        highlights: [],
        itinerary: [],
        inclusions: [],
      });
      setImagePreview(null);
      setImageFile(null);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingPlace(null);
    setNewHighlight("");
    setNewItineraryDay({ day: "", title: "", description: "" });
    setNewInclusion("");
    setImageFile(null);
    setImagePreview(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 2 * 1024 * 1024) {
      toast.error("Image size must be less than 2MB!", {
        style: { background: "#fef2f2", color: "#b91c1c" },
      });
      return;
    }
    setImageFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const addHighlight = () => {
    if (newHighlight.trim()) {
      setFormData((prev) => ({
        ...prev,
        highlights: [...prev.highlights, newHighlight.trim()],
      }));
      setNewHighlight("");
    }
  };

  const removeHighlight = (index) => {
    setFormData((prev) => ({
      ...prev,
      highlights: prev.highlights.filter((_, i) => i !== index),
    }));
  };

  const addItineraryDay = () => {
    if (newItineraryDay.day && newItineraryDay.title && newItineraryDay.description) {
      setFormData((prev) => ({
        ...prev,
        itinerary: [...prev.itinerary, { ...newItineraryDay, day: parseInt(newItineraryDay.day) }],
      }));
      setNewItineraryDay({ day: "", title: "", description: "" });
    }
  };

  const removeItineraryDay = (index) => {
    setFormData((prev) => ({
      ...prev,
      itinerary: prev.itinerary.filter((_, i) => i !== index),
    }));
  };

  const addInclusion = () => {
    if (newInclusion.trim()) {
      setFormData((prev) => ({
        ...prev,
        inclusions: [...prev.inclusions, newInclusion.trim()],
      }));
      setNewInclusion("");
    }
  };

  const removeInclusion = (index) => {
    setFormData((prev) => ({
      ...prev,
      inclusions: prev.inclusions.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.title || !formData.description || !formData.location || !formData.rating || !formData.price || !formData.bestTime) {
      toast.error("All fields are required!", {
        style: { background: "#fef2f2", color: "#b91c1c" },
      });
      return;
    }
    if (!editingPlace && !imageFile) {
      toast.error("Image is required for new places!", {
        style: { background: "#fef2f2", color: "#b91c1c" },
      });
      return;
    }

    setLoading(true);
    try {
      if (imageFile) {
        const reader = new FileReader();
        reader.readAsDataURL(imageFile);
        reader.onload = () => {
          const placeData = { ...formData, image: reader.result };
          if (editingPlace) {
            updatePlace(editingPlace.id, {
              id: editingPlace.id,
              placeName: placeData.name, // Map back to placeName
              description: placeData.description,
              country: placeData.location, // Map location back to country
              continent: editingPlace.continent || "", // Preserve continent
              image: placeData.image,
              // Add the new fields
              rating: placeData.rating,
              price: placeData.price,
              bestTime: placeData.bestTime,
              highlights: placeData.highlights,
              itinerary: placeData.itinerary,
              inclusions: placeData.inclusions,
            });
            toast.success("Place updated successfully!", {
              style: { background: "#dcfce7", color: "#15803d" },
            });
            if (selectedPlaceId === editingPlace.id) {
              setDetailFormData(placeData);
            }
          } else {
            const newId = crypto.randomUUID();
            addPlace({
              id: newId,
              placeName: placeData.name, // Map to placeName
              description: placeData.description,
              country: placeData.location, // Map to country
              continent: "", // Default since AddPlaceDetails doesn't collect this
              image: placeData.image,
              // Add the new fields
              rating: placeData.rating,
              price: placeData.price,
              bestTime: placeData.bestTime,
              highlights: placeData.highlights,
              itinerary: placeData.itinerary,
              inclusions: placeData.inclusions,
            });
            toast.success("Place added successfully!", {
              style: { background: "#dcfce7", color: "#15803d" },
            });
            setSelectedPlaceId(newId);
            setDetailFormData(placeData);
          }
          closeModal();
          setLoading(false);
        };
        reader.onerror = () => {
          toast.error("Error reading image file!", {
            style: { background: "#fef2f2", color: "#b91c1c" },
          });
          setLoading(false);
        };
      } else if (editingPlace) {
        updatePlace(editingPlace.id, {
          id: editingPlace.id,
          placeName: formData.name, // Map back to placeName
          description: formData.description,
          country: formData.location, // Map back to country
          continent: editingPlace.continent || "", // Preserve continent
          image: places.find((p) => p.id === editingPlace.id)?.image || "",
          // Add the new fields
          rating: formData.rating,
          price: formData.price,
          bestTime: formData.bestTime,
          highlights: formData.highlights,
          itinerary: formData.itinerary,
          inclusions: formData.inclusions,
        });
        toast.success("Place updated successfully!", {
          style: { background: "#dcfce7", color: "#15803d" },
        });
        if (selectedPlaceId === editingPlace.id) {
          setDetailFormData({
            ...formData,
            image: places.find((p) => p.id === editingPlace.id)?.image || "",
          });
        }
        closeModal();
        setLoading(false);
      }
    } catch (err) {
      toast.error("Failed to save place. Please try again.", {
        style: { background: "#fef2f2", color: "#b91c1c" },
      });
      setLoading(false);
    }
  };

  const handleDelete = () => {
    if (!selectedPlace) return;
    if (window.confirm("Are you sure you want to delete this place?")) {
      try {
        deletePlace(selectedPlace.id);
        setSelectedPlaceId("");
        setDetailFormData({
          name: "",
          title: "",
          description: "",
          image: "",
          location: "",
          rating: 0,
          price: "",
          bestTime: "",
          highlights: [],
          itinerary: [],
          inclusions: [],
        });
        setIsEditingDetails(false);
        toast.success("Place deleted successfully!", {
          style: { background: "#dcfce7", color: "#15803d" },
        });
      } catch (err) {
        toast.error("Failed to delete place. Please try again.", {
          style: { background: "#fef2f2", color: "#b91c1c" },
        });
      }
    }
  };

  const handleSelectPlace = (placeId) => {
    setSelectedPlaceId(placeId);
    const place = places.find((p) => p.id === placeId);
    if (place) {
      setDetailFormData({
        name: place.placeName || "",
        title: place.placeName || "", // Map placeName to title
        description: place.description || "",
        image: place.image || "",
        location: place.country || "", // Map country to location
        rating: place.rating || 0,
        price: place.price || "",
        bestTime: place.bestTime || "",
        highlights: place.highlights || [],
        itinerary: place.itinerary || [],
        inclusions: place.inclusions || [],
      });
      setIsEditingDetails(false);
    } else {
      setDetailFormData({
        name: "",
        title: "",
        description: "",
        image: "",
        location: "",
        rating: 0,
        price: "",
        bestTime: "",
        highlights: [],
        itinerary: [],
        inclusions: [],
      });
    }
  };

  const startEditingDetails = () => {
    setIsEditingDetails(true);
  };

  const saveDetails = () => {
    if (!selectedPlace) return;
    if (!detailFormData.name || !detailFormData.title || !detailFormData.description || !detailFormData.location || !detailFormData.rating || !detailFormData.price || !detailFormData.bestTime) {
      toast.error("All fields are required!", {
        style: { background: "#fef2f2", color: "#b91c1c" },
      });
      return;
    }
    updatePlace(selectedPlace.id, {
      id: selectedPlace.id,
      placeName: detailFormData.name, // Map back to placeName
      description: detailFormData.description,
      country: detailFormData.location, // Map back to country
      continent: selectedPlace.continent || "", // Preserve continent
      image: selectedPlace.image || "",
      rating: detailFormData.rating,
      price: detailFormData.price,
      bestTime: detailFormData.bestTime,
      highlights: detailFormData.highlights,
      itinerary: detailFormData.itinerary,
      inclusions: detailFormData.inclusions,
    });
    toast.success("Details updated successfully!", {
      style: { background: "#dcfce7", color: "#15803d" },
    });
    setIsEditingDetails(false);
  };

  const cancelDetailsEdit = () => {
    setIsEditingDetails(false);
    const place = places.find((p) => p.id === selectedPlaceId);
    if (place) {
      setDetailFormData({
        name: place.placeName || "",
        title: place.placeName || "",
        description: place.description || "",
        image: place.image || "",
        location: place.country || "",
        rating: place.rating || 0,
        price: place.price || "",
        bestTime: place.bestTime || "",
        highlights: place.highlights || [],
        itinerary: place.itinerary || [],
        inclusions: place.inclusions || [],
      });
    }
    setDetailNewHighlight("");
    setDetailNewItineraryDay({ day: "", title: "", description: "" });
    setDetailNewInclusion("");
  };

  const addDetailHighlight = () => {
    if (detailNewHighlight.trim()) {
      setDetailFormData((prev) => ({
        ...prev,
        highlights: [...prev.highlights, detailNewHighlight.trim()],
      }));
      setDetailNewHighlight("");
    }
  };

  const removeDetailHighlight = (index) => {
    setDetailFormData((prev) => ({
      ...prev,
      highlights: prev.highlights.filter((_, i) => i !== index),
    }));
  };

  const addDetailItineraryDay = () => {
    if (detailNewItineraryDay.day && detailNewItineraryDay.title && detailNewItineraryDay.description) {
      setDetailFormData((prev) => ({
        ...prev,
        itinerary: [...prev.itinerary, { ...detailNewItineraryDay, day: parseInt(detailNewItineraryDay.day) }],
      }));
      setDetailNewItineraryDay({ day: "", title: "", description: "" });
    }
  };

  const removeDetailItineraryDay = (index) => {
    setDetailFormData((prev) => ({
      ...prev,
      itinerary: prev.itinerary.filter((_, i) => i !== index),
    }));
  };

  const addDetailInclusion = () => {
    if (detailNewInclusion.trim()) {
      setDetailFormData((prev) => ({
        ...prev,
        inclusions: [...prev.inclusions, detailNewInclusion.trim()],
      }));
      setDetailNewInclusion("");
    }
  };

  const removeDetailInclusion = (index) => {
    setDetailFormData((prev) => ({
      ...prev,
      inclusions: prev.inclusions.filter((_, i) => i !== index),
    }));
  };

  const handleDetailInputChange = (e) => {
    const { name, value } = e.target;
    setDetailFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Filter places for dropdown with defensive checks
  const filteredPlaces = places.filter((place) => {
    if (!place || typeof place !== "object") return false;
    const placeName = place.placeName || "";
    const country = place.country || "";
    const continent = place.continent || "";
    const query = searchQuery.toLowerCase();
    return (
      placeName.toLowerCase().includes(query) ||
      country.toLowerCase().includes(query) ||
      continent.toLowerCase().includes(query)
    );
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-cyan-100 to-teal-100">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-cyan-300 border-t-cyan-600"></div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <section className="min-h-screen bg-gradient-to-br from-cyan-100 to-teal-100 py-12 px-4 sm:px-6 lg:px-8">
        <Toaster position="top-right" reverseOrder={false} />
        <Sidebar />
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex justify-between items-center mb-10"
          >
            <h1 className="text-4xl font-extrabold text-teal-900 tracking-tight">Place Details</h1>
            <button
              onClick={() => openModal()}
              className="bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white px-6 py-3 rounded-lg font-medium shadow-md transition-all duration-300 flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add New Place
            </button>
          </motion.div>

          {/* Place Selection */}
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="mb-8">
            <div className="flex flex-col gap-4">
              <input
                type="text"
                className="w-full p-3 border border-cyan-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition bg-white text-teal-900 placeholder-teal-500"
                placeholder="Search places by name, country, or continent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <select
                value={selectedPlaceId}
                onChange={(e) => handleSelectPlace(e.target.value)}
                className="w-full p-3 border border-cyan-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition bg-white text-teal-900"
              >
                <option value="">Select a place</option>
                {filteredPlaces.map((place) => (
                  <option key={place.id} value={place.id}>
                    {place.placeName || "N/A"}
                  </option>
                ))}
              </select>
            </div>
          </motion.div>

          {/* Place Details Section */}
          {selectedPlace && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="bg-white rounded-xl shadow-lg p-6 border border-teal-200"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-teal-900">
                  {detailFormData.name || "Unnamed Place"}
                </h2>
                <div className="flex gap-4">
                  {!isEditingDetails && (
                    <>

                      <button
                        onClick={handleDelete}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition shadow-md"
                      >
                        <Trash2 className="w-5 h-5" />
                        Delete Place
                      </button>
                      <button
                        onClick={startEditingDetails}
                        className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition shadow-md"
                      >
                        <Edit className="w-5 h-5" />
                        Edit Details
                      </button>
                    </>
                  )}
                </div>
              </div>
              {/* Date and Time Display */}
              <div className="mb-6">
                <p className="text-teal-700 text-sm italic">
                  Details as of {currentDateTime}
                </p>
              </div>
              {isEditingDetails ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-teal-700 mb-2">Name</label>
                      <input
                        type="text"
                        name="name"
                        value={detailFormData.name}
                        onChange={handleDetailInputChange}
                        className="w-full p-3 border border-cyan-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition bg-white"
                        placeholder="e.g., Paris"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-teal-700 mb-2">Title</label>
                      <input
                        type="text"
                        name="title"
                        value={detailFormData.title}
                        onChange={handleDetailInputChange}
                        className="w-full p-3 border border-cyan-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition bg-white"
                        placeholder="e.g., Paris, France"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-teal-700 mb-2">Description</label>
                    <textarea
                      name="description"
                      value={detailFormData.description}
                      onChange={handleDetailInputChange}
                      className="w-full p-3 border border-cyan-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition bg-white"
                      placeholder="e.g., Explore the romantic city..."
                      rows="4"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-teal-700 mb-2">Location</label>
                      <input
                        type="text"
                        name="location"
                        value={detailFormData.location}
                        onChange={handleDetailInputChange}
                        className="w-full p-3 border border-cyan-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition bg-white"
                        placeholder="e.g., France"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-teal-700 mb-2">Rating</label>
                      <input
                        type="number"
                        name="rating"
                        value={detailFormData.rating}
                        onChange={handleDetailInputChange}
                        min="0"
                        max="5"
                        step="0.1"
                        className="w-full p-3 border border-cyan-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition bg-white"
                        placeholder="e.g., 4.5"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-teal-700 mb-2">Price</label>
                      <input
                        type="text"
                        name="price"
                        value={detailFormData.price}
                        onChange={handleDetailInputChange}
                        className="w-full p-3 border border-cyan-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition bg-white"
                        placeholder="e.g., $1,999"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-teal-700 mb-2">Best Time</label>
                      <input
                        type="text"
                        name="bestTime"
                        value={detailFormData.bestTime}
                        onChange={handleDetailInputChange}
                        className="w-full p-3 border border-cyan-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition bg-white"
                        placeholder="e.g., Spring"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <img
                    src={detailFormData.image || "https://via.placeholder.com/400x200"}
                    alt={detailFormData.name || "Place"}
                    className="w-full h-64 object-cover rounded-xl mb-6 shadow-md"
                  />
                  <p className="text-teal-700 mb-6 line-clamp-3">
                    {detailFormData.description || "No description available"}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                    <div className="flex items-center gap-3">
                      <MapPin className="w-6 h-6 text-cyan-600" />
                      <span className="text-teal-800 font-medium">
                        Location: {detailFormData.location || "N/A"}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <DollarSign className="w-6 h-6 text-cyan-600" />
                      <span className="text-teal-800 font-medium">
                        Price: {detailFormData.price || "N/A"}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Star className="w-6 h-6 text-cyan-600" />
                      <span className="text-teal-800 font-medium">
                        Rating: {detailFormData.rating || "N/A"}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="w-6 h-6 text-cyan-600" />
                      <span className="text-teal-800 font-medium">
                        Best Time: {detailFormData.bestTime || "N/A"}
                      </span>
                    </div>
                  </div>
                </>
              )}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-teal-900">Highlights</h3>
                  {isEditingDetails && (
                    <div className="flex gap-3">
                      <input
                        type="text"
                        value={detailNewHighlight}
                        onChange={(e) => setDetailNewHighlight(e.target.value)}
                        className="p-2 border border-cyan-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition bg-white"
                        placeholder="Add a highlight"
                      />
                      <button
                        type="button"
                        onClick={addDetailHighlight}
                        className="bg-cyan-600 hover:bg-cyan-700 text-white px-3 py-2 rounded-lg transition shadow-md"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </div>
                <ul className="list-disc list-inside space-y-3 text-teal-700">
                  {detailFormData.highlights.map((highlight, index) => (
                    <li key={index} className="flex items-center justify-between">
                      <span>{highlight}</span>
                      {isEditingDetails && (
                        <button
                          type="button"
                          onClick={() => removeDetailHighlight(index)}
                          className="text-red-600 hover:text-red-800 ml-4"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-teal-900">Itinerary</h3>
                  {isEditingDetails && (
                    <div className="space-y-3">
                      <div className="flex gap-3">
                        <input
                          type="number"
                          value={detailNewItineraryDay.day}
                          onChange={(e) =>
                            setDetailNewItineraryDay((prev) => ({ ...prev, day: e.target.value }))
                          }
                          className="w-24 p-2 border border-cyan-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition bg-white"
                          placeholder="Day"
                        />
                        <input
                          type="text"
                          value={detailNewItineraryDay.title}
                          onChange={(e) =>
                            setDetailNewItineraryDay((prev) => ({ ...prev, title: e.target.value }))
                          }
                          className="w-full p-2 border border-cyan-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition bg-white"
                          placeholder="Title"
                        />
                      </div>
                      <textarea
                        value={detailNewItineraryDay.description}
                        onChange={(e) =>
                          setDetailNewItineraryDay((prev) => ({ ...prev, description: e.target.value }))
                        }
                        className="w-full p-2 border border-cyan-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition bg-white"
                        placeholder="Description"
                        rows="3"
                      />
                      <button
                        type="button"
                        onClick={addDetailItineraryDay}
                        className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition shadow-md"
                      >
                        <Plus className="w-5 h-5" />
                        Add Day
                      </button>
                    </div>
                  )}
                </div>
                <ul className="space-y-4">
                  {detailFormData.itinerary.map((day, index) => (
                    <li key={index} className="flex items-start justify-between text-teal-700">
                      <div>
                        <span className="font-medium">Day {day.day}: {day.title}</span>
                        <p className="mt-1">{day.description}</p>
                      </div>
                      {isEditingDetails && (
                        <button
                          type="button"
                          onClick={() => removeDetailItineraryDay(index)}
                          className="text-red-600 hover:text-red-800 ml-4"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-teal-900">Inclusions</h3>
                  {isEditingDetails && (
                    <div className="flex gap-3">
                      <input
                        type="text"
                        value={detailNewInclusion}
                        onChange={(e) => setDetailNewInclusion(e.target.value)}
                        className="p-2 border border-cyan-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition bg-white"
                        placeholder="Add an inclusion"
                      />
                      <button
                        type="button"
                        onClick={addDetailInclusion}
                        className="bg-cyan-600 hover:bg-cyan-700 text-white px-3 py-2 rounded-lg transition shadow-md"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </div>
                <ul className="list-disc list-inside space-y-3 text-teal-700">
                  {detailFormData.inclusions.map((inclusion, index) => (
                    <li key={index} className="flex items-center justify-between">
                      <span>{inclusion}</span>
                      {isEditingDetails && (
                        <button
                          type="button"
                          onClick={() => removeDetailInclusion(index)}
                          className="text-red-600 hover:text-red-800 ml-4"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
              {isEditingDetails && (
                <div className="flex justify-end gap-4 mt-6">
                  <button
                    type="button"
                    onClick={cancelDetailsEdit}
                    className="bg-gray-200 hover:bg-gray-300 text-teal-800 px-4 py-2 rounded-lg transition shadow-md"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={saveDetails}
                    className="bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition shadow-md"
                  >
                    <Save className="w-5 h-5" />
                    Save Details
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {/* Modal for Add/Edit Place */}
          <AnimatePresence>
            {isModalOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
              >
                <motion.div
                  variants={modalVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className="bg-white rounded-xl p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-teal-200"
                >
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-teal-900">
                      {editingPlace ? "Edit Place" : "Add New Place"}
                    </h2>
                    <button onClick={closeModal} className="text-teal-600 hover:text-teal-800">
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-teal-700 mb-2">Name</label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-cyan-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition bg-white"
                          placeholder="e.g., Paris"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-teal-700 mb-2">Title</label>
                        <input
                          type="text"
                          name="title"
                          value={formData.title}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-cyan-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition bg-white"
                          placeholder="e.g., Paris, France"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-teal-700 mb-2">Description</label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-cyan-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition bg-white"
                        placeholder="e.g., Explore the romantic city..."
                        rows="4"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-teal-700 mb-2">
                        {editingPlace ? "Upload New Image (Optional)" : "Upload Image"}
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="w-full p-3 border border-cyan-300 rounded-lg text-teal-700 bg-white"
                        required={!editingPlace}
                      />
                      {imagePreview && (
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="mt-4 w-full h-48 object-cover rounded-lg shadow-md"
                        />
                      )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-teal-700 mb-2">Location</label>
                        <input
                          type="text"
                          name="location"
                          value={formData.location}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-cyan-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition bg-white"
                          placeholder="e.g., France"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-teal-700 mb-2">Rating</label>
                        <input
                          type="number"
                          name="rating"
                          value={formData.rating}
                          onChange={handleInputChange}
                          min="0"
                          max="5"
                          step="0.1"
                          className="w-full p-3 border border-cyan-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition bg-white"
                          placeholder="e.g., 4.5"
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-teal-700 mb-2">Price</label>
                        <input
                          type="text"
                          name="price"
                          value={formData.price}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-cyan-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition bg-white"
                          placeholder="e.g., $1,999"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-teal-700 mb-2">Best Time</label>
                        <input
                          type="text"
                          name="bestTime"
                          value={formData.bestTime}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-cyan-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition bg-white"
                          placeholder="e.g., Spring"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-teal-700 mb-2">Highlights</label>
                      <div className="flex gap-3 mb-4">
                        <input
                          type="text"
                          value={newHighlight}
                          onChange={(e) => setNewHighlight(e.target.value)}
                          className="w-full p-3 border border-cyan-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition bg-white"
                          placeholder="Add a highlight"
                        />
                        <button
                          type="button"
                          onClick={addHighlight}
                          className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg transition shadow-md"
                        >
                          <Plus className="w-5 h-5" />
                        </button>
                      </div>
                      <ul className="space-y-3">
                        {formData.highlights.map((highlight, index) => (
                          <li key={index} className="flex items-center justify-between text-teal-700">
                            <span>{highlight}</span>
                            <button
                              type="button"
                              onClick={() => removeHighlight(index)}
                              className="text-red-600 hover:text-red-800 ml-4"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-teal-700 mb-2">Itinerary</label>
                      <div className="space-y-3 mb-4">
                        <div className="flex gap-3">
                          <input
                            type="number"
                            value={newItineraryDay.day}
                            onChange={(e) =>
                              setNewItineraryDay((prev) => ({ ...prev, day: e.target.value }))
                            }
                            className="w-24 p-3 border border-cyan-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition bg-white"
                            placeholder="Day"
                          />
                          <input
                            type="text"
                            value={newItineraryDay.title}
                            onChange={(e) =>
                              setNewItineraryDay((prev) => ({ ...prev, title: e.target.value }))
                            }
                            className="w-full p-3 border border-cyan-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition bg-white"
                            placeholder="Title"
                          />
                        </div>
                        <textarea
                          value={newItineraryDay.description}
                          onChange={(e) =>
                            setNewItineraryDay((prev) => ({ ...prev, description: e.target.value }))
                          }
                          className="w-full p-3 border border-cyan-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition bg-white"
                          placeholder="Description"
                          rows="3"
                        />
                        <button
                          type="button"
                          onClick={addItineraryDay}
                          className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition shadow-md"
                        >
                          <Plus className="w-5 h-5" />
                          Add Day
                        </button>
                      </div>
                      <ul className="space-y-3">
                        {formData.itinerary.map((day, index) => (
                          <li key={index} className="flex items-center justify-between text-teal-700">
                            <span>Day {day.day}: {day.title}</span>
                            <button
                              type="button"
                              onClick={() => removeItineraryDay(index)}
                              className="text-red-600 hover:text-red-800 ml-4"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-teal-700 mb-2">Inclusions</label>
                      <div className="flex gap-3 mb-4">
                        <input
                          type="text"
                          value={newInclusion}
                          onChange={(e) => setNewInclusion(e.target.value)}
                          className="w-full p-3 border border-cyan-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition bg-white"
                          placeholder="Add an inclusion"
                        />
                        <button
                          type="button"
                          onClick={addInclusion}
                          className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg transition shadow-md"
                        >
                          <Plus className="w-5 h-5" />
                        </button>
                      </div>
                      <ul className="space-y-3">
                        {formData.inclusions.map((inclusion, index) => (
                          <li key={index} className="flex items-center justify-between text-teal-700">
                            <span>{inclusion}</span>
                            <button
                              type="button"
                              onClick={() => removeInclusion(index)}
                              className="text-red-600 hover:text-red-800 ml-4"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex justify-end gap-4">
                      <button
                        type="button"
                        onClick={closeModal}
                        className="bg-gray-200 hover:bg-gray-300 text-teal-800 px-6 py-2 rounded-lg transition shadow-md"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className={`bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition shadow-md ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                      >
                        <Save className="w-5 h-5" />
                        {editingPlace ? "Update" : "Save"}
                      </button>
                    </div>
                  </form>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </ErrorBoundary>
  );
}

export default AddPlaceDetails;