import React, { useState } from "react";
import Sidebar from "./Sidebar";
import usePlaceStore from "../Store/PlaceStore"; // Adjust the path as needed
import toast, { Toaster } from "react-hot-toast";

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

const AddPlace = () => {
  const [placeName, setPlaceName] = useState("");
  const [description, setDescription] = useState("");
  const [country, setCountry] = useState("");
  const [continent, setContinent] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [errors, setErrors] = useState({});

  const places = usePlaceStore((state) => state.places);
  const addPlace = usePlaceStore((state) => state.addPlace);
  const updatePlace = usePlaceStore((state) => state.updatePlace);
  const deletePlace = usePlaceStore((state) => state.deletePlace);

  // Handle image change and preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 2 * 1024 * 1024) {
      toast.error("Image size must be less than 2MB!", {
        style: { background: "#fef2f2", color: "#b91c1c" },
      });
      return;
    }
    setImage(file);
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

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    if (!placeName.trim()) newErrors.placeName = "Place name is required";
    if (!description.trim()) newErrors.description = "Description is required";
    if (!country.trim()) newErrors.country = "Country is required";
    if (!continent.trim()) newErrors.continent = "Continent is required";
    if (!image && !editingId) newErrors.image = "Image is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fill all required fields!", {
        style: { background: "#fef2f2", color: "#b91c1c" },
      });
      return;
    }

    const placeData = {
      placeName: placeName.trim(),
      description: description.trim(),
      country: country.trim(),
      continent: continent.trim(),
    };

    if (image) {
      const reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onload = () => {
        placeData.image = reader.result;

        if (editingId) {
          updatePlace(editingId, { id: editingId, ...placeData });
          toast.success("Place updated successfully!", {
            style: { background: "#dcfce7", color: "#15803d" },
          });
        } else {
          addPlace({ id: crypto.randomUUID(), ...placeData });
          toast.success("Place added successfully!", {
            style: { background: "#dcfce7", color: "#15803d" },
          });
        }
        resetForm();
      };
      reader.onerror = () => {
        toast.error("Error reading image file!", {
          style: { background: "#fef2f2", color: "#b91c1c" },
        });
      };
    } else if (editingId) {
      const existingPlace = places.find((p) => p.id === editingId);
      if (!existingPlace) {
        toast.error("Place not found!", {
          style: { background: "#fef2f2", color: "#b91c1c" },
        });
        return;
      }
      updatePlace(editingId, {
        id: editingId,
        ...placeData,
        image: existingPlace.image,
      });
      toast.success("Place updated successfully!", {
        style: { background: "#dcfce7", color: "#15803d" },
      });
      resetForm();
    }
  };

  // Reset form fields
  const resetForm = () => {
    setPlaceName("");
    setDescription("");
    setCountry("");
    setContinent("");
    setImage(null);
    setImagePreview(null);
    setEditingId(null);
    setErrors({});
  };

  // Start editing a place
  const startEditing = (place) => {
    if (!place || !place.id) {
      toast.error("Invalid place data!", {
        style: { background: "#fef2f2", color: "#b91c1c" },
      });
      return;
    }
    setPlaceName(place.placeName || "");
    setDescription(place.description || "");
    setCountry(place.country || "");
    setContinent(place.continent || "");
    setImage(null);
    setImagePreview(place.image || null);
    setEditingId(place.id);
    setErrors({});
  };

  // Handle deletion
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this place?")) {
      deletePlace(id);
      toast.success("Place deleted successfully!", {
        style: { background: "#dcfce7", color: "#15803d" },
      });
    }
  };

  // Filter places with defensive checks
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

  return (
    <ErrorBoundary>
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 p-6 lg:p-8 max-w-7xl mx-auto">
          <Toaster position="top-right" reverseOrder={false} />
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            {editingId ? "Edit Place" : "Add Place"}
          </h2>
          {/* Form */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-10 max-w-lg mx-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Place Name</label>
                <input
                  type="text"
                  className={`mt-1 w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                    errors.placeName ? "border-red-500" : ""
                  }`}
                  value={placeName}
                  onChange={(e) => setPlaceName(e.target.value)}
                  placeholder="Enter place name"
                />
                {errors.placeName && (
                  <p className="text-red-500 text-sm mt-1">{errors.placeName}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  className={`mt-1 w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                    errors.description ? "border-red-500" : ""
                  }`}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter description"
                  rows="4"
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Country</label>
                <input
                  type="text"
                  className={`mt-1 w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                    errors.country ? "border-red-500" : ""
                  }`}
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="Enter country"
                />
                {errors.country && (
                  <p className="text-red-500 text-sm mt-1">{errors.country}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Continent</label>
                <select
                  className={`mt-1 w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                    errors.continent ? "border-red-500" : ""
                  }`}
                  value={continent}
                  onChange={(e) => setContinent(e.target.value)}
                >
                  <option value="">Select continent</option>
                  <option value="Africa">Africa</option>
                  <option value="Antarctica">Antarctica</option>
                  <option value="Asia">Asia</option>
                  <option value="Australia">Australia</option>
                  <option value="Europe">Europe</option>
                  <option value="North America">North America</option>
                  <option value="South America">South America</option>
                </select>
                {errors.continent && (
                  <p className="text-red-500 text-sm mt-1">{errors.continent}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {editingId ? "Upload New Image (Optional)" : "Upload Image"}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  className={`mt-1 w-full p-3 border rounded-lg text-gray-500 ${
                    errors.image ? "border-red-500" : ""
                  }`}
                  onChange={handleImageChange}
                />
                {errors.image && (
                  <p className="text-red-500 text-sm mt-1">{errors.image}</p>
                )}
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="mt-4 w-full h-48 object-cover rounded-lg shadow-sm"
                  />
                )}
              </div>
              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition duration-200"
                >
                  {editingId ? "Update Place" : "Add Place"}
                </button>
                <button
                  type="button"
                  className="w-full bg-gray-300 text-gray-800 py-3 rounded-lg font-medium hover:bg-gray-400 transition duration-200"
                  onClick={resetForm}
                >
                  Reset
                </button>
              </div>
            </form>
          </div>
          {/* Search Bar */}
          <div className="mb-8 max-w-lg mx-auto">
            <input
              type="text"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Search places by name, country, or continent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          {/* Places List */}
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Places</h2>
          {filteredPlaces.length === 0 ? (
            <div className="text-center text-gray-500">
              <p>No places found. Add a new destination above!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPlaces.map((place) => (
                <div
                  key={place.id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden transform hover:scale-105 transition duration-300"
                >
                  <img
                    src={place.image || "https://via.placeholder.com/400x200"}
                    alt={place.placeName || "Place"}
                    className="w-full h-56 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-800">
                      {place.placeName || "Unknown Place"}
                    </h3>
                    <p className="text-gray-600 mt-2 line-clamp-3">
                      {place.description || "No description available"}
                    </p>
                    <p className="text-gray-500 mt-1">
                      <span className="font-medium">Country:</span> {place.country || "Unknown"}
                    </p>
                    <p className="text-gray-500">
                      <span className="font-medium">Continent:</span> {place.continent || "Unknown"}
                    </p>
                    <div className="flex justify-between mt-4">
                      <button
                        className="bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600 transition duration-200"
                        onClick={() => startEditing(place)}
                      >
                        Edit
                      </button>
                      <button
                        className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition duration-200"
                        onClick={() => handleDelete(place.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default AddPlace;