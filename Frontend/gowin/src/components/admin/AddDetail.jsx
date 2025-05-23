import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit, Trash2, X, Save, MapPin, Calendar, DollarSign, Star } from "lucide-react";
import usePlaceStore from "../Store/PlaceStore"; // Adjust path as needed
import Sidebar from "./Sidebar";
import toast, { Toaster } from "react-hot-toast";
import React from "react";

// Animation variants for Framer Motion
const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
};

// Category options for dropdown
const categories = ["Adventure", "Cultural", "Beach", "City", "Nature"];

function DestilStore() {
  const { places, addPlace, updatePlace, deletePlace } = usePlaceStore();
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlace, setEditingPlace] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    title: "",
    description: "",
    image: "",
    location: "",
    category: "",
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

  const openModal = (place = null) => {
    if (place) {
      setEditingPlace(place);
      setFormData({
        ...place,
        highlights: place.highlights || [],
        itinerary: place.itinerary || [],
        inclusions: place.inclusions || [],
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
        category: "",
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
    if (!formData.name || !formData.title || !formData.description || !formData.location || !formData.category || !formData.rating || !formData.price || !formData.bestTime) {
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
            updatePlace(editingPlace.id, placeData);
            toast.success("Place updated successfully!", {
              style: { background: "#dcfce7", color: "#15803d" },
            });
          } else {
            addPlace({ id: crypto.randomUUID(), ...placeData });
            toast.success("Place added successfully!", {
              style: { background: "#dcfce7", color: "#15803d" },
            });
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
          ...formData,
          image: places.find((p) => p.id === editingPlace.id).image,
        });
        toast.success("Place updated successfully!", {
          style: { background: "#dcfce7", color: "#15803d" },
        });
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

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this place?")) {
      try {
        deletePlace(id);
        if (selectedPlace && selectedPlace.id === id) {
          setSelectedPlace(null);
        }
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

  const handleSelectPlace = (place) => {
    setSelectedPlace(place);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-cyan-100 to-teal-100">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-cyan-300 border-t-cyan-600"></div>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-cyan-100 to-teal-100 py-12 px-4 sm:px-6 lg:px-8">
      <Toaster position="top-right" reverseOrder={false} />
      <Sidebar />
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex justify-between items-center mb-10"
        >
          <h1 className="text-4xl font-extrabold text-teal-900 tracking-tight">Travel Destinations</h1>
          <button
            onClick={() => openModal()}
            className="bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white px-6 py-3 rounded-lg font-medium shadow-md transition-all duration-300 flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Destination
          </button>
        </motion.div>

        {/* Destinations Table */}
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="bg-white rounded-2xl shadow-xl p-6 mb-10">
          {places.length === 0 ? (
            <p className="text-center text-teal-700 py-6">No destinations added yet. Click "Add Destination" to start.</p>
          ) : (
            <table className="w-full text-left table-auto">
              <thead>
                <tr className="text-teal-800 border-b border-teal-200">
                  <th className="py-4 px-6">ID</th>
                  <th className="py-4 px-6">Title</th>
                  <th className="py-4 px-6">Location</th>
                  <th className="py-4 px-6">Category</th>
                  <th className="py-4 px-6">Price</th>
                  <th className="py-4 px-6">Rating</th>
                  <th className="py-4 px-6">Actions</th>
                </tr>
              </thead>
              <tbody>
                {places.map((place) => (
                  <motion.tr
                    key={place.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="border-b border-teal-100 hover:bg-teal-50 cursor-pointer"
                    onClick={() => handleSelectPlace(place)}
                  >
                    <td className="py-4 px-6">{place.id}</td>
                    <td className="py-4 px-6">{place.title}</td>
                    <td className="py-4 px-6">{place.location}</td>
                    <td className="py-4 px-6">{place.category}</td>
                    <td className="py-4 px-6">{place.price}</td>
                    <td className="py-4 px-6">{place.rating}</td>
                    <td className="py-4 px-6 flex space-x-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openModal(place);
                        }}
                        className="text-cyan-600 hover:text-cyan-800 transition-colors"
                        aria-label="Edit place"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(place.id);
                        }}
                        className="text-red-600 hover:text-red-800 transition-colors"
                        aria-label="Delete place"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          )}
        </motion.div>

        {/* Place Details Section */}
        {selectedPlace && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="bg-white rounded-2xl shadow-xl p-8 mb-10"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-teal-900">{selectedPlace.title}</h2>
              <button
                onClick={() => setSelectedPlace(null)}
                className="text-teal-600 hover:text-teal-800"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <img
              src={selectedPlace.image}
              alt={selectedPlace.title}
              className="w-full h-64 object-cover rounded-xl mb-6"
            />
            <p className="text-teal-700 mb-4">{selectedPlace.description}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-cyan-600" />
                <span className="text-teal-800 font-medium">Location: {selectedPlace.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-cyan-600" />
                <span className="text-teal-800 font-medium">Category: {selectedPlace.category}</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-cyan-600" />
                <span className="text-teal-800 font-medium">Price: {selectedPlace.price}</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-cyan-600" />
                <span className="text-teal-800 font-medium">Rating: {selectedPlace.rating}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-cyan-600" />
                <span className="text-teal-800 font-medium">Best Time: {selectedPlace.bestTime}</span>
              </div>
            </div>
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-teal-900 mb-3">Highlights</h3>
              <ul className="list-disc list-inside space-y-2 text-teal-700">
                {selectedPlace.highlights.map((highlight, index) => (
                  <li key={index}>{highlight}</li>
                ))}
              </ul>
            </div>
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-teal-900 mb-3">Itinerary</h3>
              <ul className="space-y-4">
                {selectedPlace.itinerary.map((day, index) => (
                  <li key={index} className="text-teal-700">
                    <span className="font-medium">Day {day.day}: {day.title}</span>
                    <p>{day.description}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-teal-900 mb-3">Inclusions</h3>
              <ul className="list-disc list-inside space-y-2 text-teal-700">
                {selectedPlace.inclusions.map((inclusion, index) => (
                  <li key={index}>{inclusion}</li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}

        {/* Modal for Add/Edit Place */}
        <AnimatePresence>
          {isModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
            >
              <motion.div
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="bg-white rounded-2xl p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-teal-900">
                    {editingPlace ? "Edit Destination" : "Add Destination"}
                  </h2>
                  <button onClick={closeModal} className="text-teal-600 hover:text-teal-800">
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-teal-700 mb-1">Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-cyan-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
                        placeholder="e.g., Paris"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-teal-700 mb-1">Title</label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-cyan-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
                        placeholder="e.g., Paris, France"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-teal-700 mb-1">Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-cyan-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
                      placeholder="e.g., Explore the romantic city..."
                      rows="4"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-teal-700 mb-1">
                      {editingPlace ? "Upload New Image (Optional)" : "Upload Image"}
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="w-full p-3 border border-cyan-300 rounded-lg text-teal-700"
                      required={!editingPlace}
                    />
                    {imagePreview && (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="mt-4 w-full h-48 object-cover rounded-lg shadow-sm"
                      />
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-teal-700 mb-1">Location</label>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-cyan-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
                        placeholder="e.g., France"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-teal-700 mb-1">Category</label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-cyan-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
                        required
                      >
                        <option value="" disabled>Select a category</option>
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-teal-700 mb-1">Rating</label>
                      <input
                        type="number"
                        name="rating"
                        value={formData.rating}
                        onChange={handleInputChange}
                        min="0"
                        max="5"
                        step="0.1"
                        className="w-full p-3 border border-cyan-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
                        placeholder="e.g., 4.5"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-teal-700 mb-1">Price</label>
                      <input
                        type="text"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-cyan-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
                        placeholder="e.g., $1,999"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-teal-700 mb-1">Best Time</label>
                      <input
                        type="text"
                        name="bestTime"
                        value={formData.bestTime}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-cyan-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
                        placeholder="e.g., Spring"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-teal-700 mb-1">Highlights</label>
                    <div className="flex gap-2 mb-3">
                      <input
                        type="text"
                        value={newHighlight}
                        onChange={(e) => setNewHighlight(e.target.value)}
                        className="w-full p-3 border border-cyan-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
                        placeholder="Add a highlight"
                      />
                      <button
                        type="button"
                        onClick={addHighlight}
                        className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg transition"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                    <ul className="space-y-2">
                      {formData.highlights.map((highlight, index) => (
                        <li key={index} className="flex items-center justify-between text-teal-700">
                          <span>{highlight}</span>
                          <button
                            type="button"
                            onClick={() => removeHighlight(index)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-teal-700 mb-1">Itinerary</label>
                    <div className="space-y-3 mb-3">
                      <div className="flex gap-2">
                        <input
                          type="number"
                          value={newItineraryDay.day}
                          onChange={(e) =>
                            setNewItineraryDay((prev) => ({ ...prev, day: e.target.value }))
                          }
                          className="w-20 p-3 border border-cyan-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
                          placeholder="Day"
                        />
                        <input
                          type="text"
                          value={newItineraryDay.title}
                          onChange={(e) =>
                            setNewItineraryDay((prev) => ({ ...prev, title: e.target.value }))
                          }
                          className="w-full p-3 border border-cyan-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
                          placeholder="Title"
                        />
                      </div>
                      <textarea
                        value={newItineraryDay.description}
                        onChange={(e) =>
                          setNewItineraryDay((prev) => ({ ...prev, description: e.target.value }))
                        }
                        className="w-full p-3 border border-cyan-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
                        placeholder="Description"
                        rows="3"
                      />
                      <button
                        type="button"
                        onClick={addItineraryDay}
                        className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                      >
                        <Plus className="w-5 h-5" />
                        Add Day
                      </button>
                    </div>
                    <ul className="space-y-2">
                      {formData.itinerary.map((day, index) => (
                        <li key={index} className="flex items-center justify-between text-teal-700">
                          <span>
                            Day {day.day}: {day.title}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeItineraryDay(index)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-teal-700 mb-1">Inclusions</label>
                    <div className="flex gap-2 mb-3">
                      <input
                        type="text"
                        value={newInclusion}
                        onChange={(e) => setNewInclusion(e.target.value)}
                        className="w-full p-3 border border-cyan-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
                        placeholder="Add an inclusion"
                      />
                      <button
                        type="button"
                        onClick={addInclusion}
                        className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                    <ul className="space-y-2">
                      {formData.inclusions.map((inclusion, index) => (
                        <li key={index} className="flex items-center justify-between text-teal-700">
                          <span>{inclusion}</span>
                          <button
                            type="button"
                            onClick={() => removeInclusion(index)}
                            className="text-red-600 hover:text-red-800"
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
                      className="bg-gray-200 hover:bg-gray-300 text-teal-800 px-6 py-2 rounded-lg transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className={`bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
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
  );
}

export default DestilStore;