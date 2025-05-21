import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import usePlaceStore from "../Store/PlaceStore"; // Adjust the path as needed
import toast, { Toaster } from "react-hot-toast";

const PlaceManager = () => {
  // Form state for adding or editing
  const [placeName, setPlaceName] = useState("");
  const [description, setDescription] = useState("");
  const [country, setCountry] = useState("");
  const [continent, setContinent] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [editingId, setEditingId] = useState(null);

  // Zustand store
  const places = usePlaceStore((state) => state.places);
  const addPlace = usePlaceStore((state) => state.addPlace);
  const updatePlace = usePlaceStore((state) => state.updatePlace);
  const deletePlace = usePlaceStore((state) => state.deletePlace);

  // Pre-fill form with Kyoto details as default
  useEffect(() => {
    if (!editingId) {
      setPlaceName("Kyoto");
      setDescription("Immerse yourself in ancient temples, traditional gardens, and serene Zen culture.");
      setCountry("Japan");
      setContinent("Asia");
      setImage(null);
      setImagePreview("https://images.unsplash.com/photo-1542051841857-7347e4e83db1"); // Placeholder Kyoto image
    }
  }, [editingId]);

  // Handle image change and preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
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

  // Handle form submission for adding or updating
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!placeName || !description || !country || !continent || (!image && !editingId)) {
      toast.error("All fields are required!", {
        style: { background: "#fef2f2", color: "#b91c1c" },
      });
      return;
    }

    const placeData = {
      placeName,
      description,
      country,
      continent,
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
      updatePlace(editingId, {
        id: editingId,
        ...placeData,
        image: places.find((p) => p.id === editingId).image,
      });
      toast.success("Place updated successfully!", {
        style: { background: "#dcfce7", color: "#15803d" },
      });
      resetForm();
    }
  };

  // Reset form fields and editing state
  const resetForm = () => {
    setPlaceName("Kyoto");
    setDescription("Immerse yourself in ancient temples, traditional gardens, and serene Zen culture.");
    setCountry("Japan");
    setContinent("Asia");
    setImage(null);
    setImagePreview("https://images.unsplash.com/photo-1542051841857-7347e4e83db1");
    setEditingId(null);
  };

  // Start editing a place
  const startEditing = (place) => {
    setPlaceName(place.placeName);
    setDescription(place.description);
    setCountry(place.country);
    setContinent(place.continent);
    setImage(null);
    setImagePreview(place.image);
    setEditingId(place.id);
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

  return (
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
                className="mt-1 w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={placeName}
                onChange={(e) => setPlaceName(e.target.value)}
                placeholder="e.g., Kyoto"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                className="mt-1 w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g., Immerse yourself in ancient temples..."
                rows="4"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Country</label>
              <input
                type="text"
                className="mt-1 w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="e.g., Japan"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Continent</label>
              <input
                type="text"
                className="mt-1 w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={continent}
                onChange={(e) => setContinent(e.target.value)}
                placeholder="e.g., Asia"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {editingId ? "Upload New Image (Optional)" : "Upload Image"}
              </label>
              <input
                type="file"
                accept="image/*"
                className="mt-1 w-full p-3 border rounded-lg text-gray-500"
                onChange={handleImageChange}
                required={!editingId}
              />
              {(imagePreview || (editingId && places.find((p) => p.id === editingId)?.image)) && (
                <img
                  src={imagePreview || places.find((p) => p.id === editingId)?.image}
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
                Cancel
              </button>
            </div>
          </form>
        </div>
        {/* Places List */}
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Places</h2>
        {places.length === 0 ? (
          <div className="text-center text-gray-500">
            <p>No places added yet. Add Kyoto or other destinations above!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {places.map((place) => (
              <div
                key={place.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden transform hover:scale-105 transition duration-300"
              >
                <img
                  src={place.image}
                  alt={place.placeName}
                  className="w-full h-56 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-800">{place.placeName}</h3>
                  <p className="text-gray-600 mt-2">{place.description}</p>
                  <p className="text-gray-500 mt-1">
                    <span className="font-medium">Country:</span> {place.country}
                  </p>
                  <p className="text-gray-500">
                    <span className="font-medium">Continent:</span> {place.continent}
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
  );
};

export default PlaceManager;