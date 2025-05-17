import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import useDetailsStore from "../Store/DetailStore";
import usePlaceStore from "../Store/PlaceStore";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AddDetail = () => {
  const navigate = useNavigate();
  const [selectedPlace, setSelectedPlace] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [formData, setFormData] = useState({
    placeId: "",
    title: "",
    description: "",
    highlights: "",
    bestTime: "",
    entryFee: "",
    duration: "",
    openingHours: "",
    activities: "",
    tourPackages: "",
    contact: "",
    accessibilityInfo: "",
    nearbyAttractions: "",
    safetyTips: "",
  });

  const places = usePlaceStore((state) => state.places);
  const { details, adddetails, updatedetails, deletedetails, getDetailsByPlace } = useDetailsStore(
    (state) => ({
      details: state.details,
      adddetails: state.adddetails,
      updatedetails: state.updatedetails,
      deletedetails: state.deletedetails,
      getDetailsByPlace: state.getDetailsByPlace,
    })
  );

  useEffect(() => {
    if (selectedPlace) {
      try {
        // Call getDetailsByPlace with the store state
        const selectedDetails = getDetailsByPlace(selectedPlace)({ details });
        const placeDetails = selectedDetails[0]; // Get the first matching detail
        if (placeDetails) {
          setFormData(placeDetails);
        } else {
          setFormData({
            placeId: selectedPlace,
            title: "",
            description: "",
            highlights: "",
            bestTime: "",
            entryFee: "",
            duration: "",
            openingHours: "",
            activities: "",
            tourPackages: "",
            contact: "",
            accessibilityInfo: "",
            nearbyAttractions: "",
            safetyTips: "",
          });
        }
      } catch (error) {
        toast.error("Error fetching place details");
        console.error(error);
      }
    }
  }, [selectedPlace, details, getDetailsByPlace]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.placeId) return "Please select a place";
    if (!formData.title.trim()) return "Title is required";
    if (formData.title.length > 100) return "Title must be under 100 characters";
    if (!formData.description.trim()) return "Description is required";
    if (formData.description.length < 50) return "Description must be at least 50 characters";
    if (formData.description.length > 1000) return "Description must be under 1000 characters";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const error = validateForm();
    if (error) {
      toast.error(error);
      return;
    }

    // Wrap the action in a Promise
    const action = new Promise((resolve, reject) => {
      try {
        const result = formData.placeId && details.some((d) => d.placeId === formData.placeId)
          ? updatedetails(formData.placeId, formData)
          : adddetails({ ...formData, id: crypto.randomUUID() });
        resolve(result);
      } catch (error) {
        reject(error);
      }
    });

    try {
      await toast.promise(action, {
        loading: formData.placeId && details.some((d) => d.placeId === formData.placeId) ? "Updating details..." : "Adding details...",
        success: formData.placeId && details.some((d) => d.placeId === formData.placeId) ? "Details updated successfully!" : "Details added successfully!",
        error: "An error occurred!",
      });

      resetForm();
      navigate("/login");
    } catch (error) {
      console.error("Submit error:", error);
    }
  };

  const handleDelete = () => {
    if (formData.placeId) {
      toast.promise(
        new Promise((resolve, reject) => {
          try {
            const result = deletedetails(formData.placeId);
            resolve(result);
          } catch (error) {
            reject(error);
          }
        }),
        {
          loading: "Deleting details...",
          success: "Details deleted successfully!",
          error: "Error deleting details!",
        }
      );
      resetForm();
      setShowDeleteModal(false);
      navigate("/login");
    }
  };

  const resetForm = () => {
    setFormData({
      placeId: "",
      title: "",
      description: "",
      highlights: "",
      bestTime: "",
      entryFee: "",
      duration: "",
      openingHours: "",
      activities: "",
      tourPackages: "",
      contact: "",
      accessibilityInfo: "",
      nearbyAttractions: "",
      safetyTips: "",
    });
    setSelectedPlace("");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-6 ml-64 lg:ml-80 max-w-5xl mx-auto mt-10 bg-white rounded-xl shadow-xl">
        <Toaster position="top-right" />
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Manage Place Details</h2>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Place</label>
            <select
              name="placeId"
              value={formData.placeId}
              onChange={(e) => {
                setSelectedPlace(e.target.value);
                handleInputChange(e);
              }}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select Place</option>
              {places.map((place) => (
                <option key={place.id} value={place.id}>
                  {place.placeName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              name="title"
              placeholder="Title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Best Time to Visit</label>
            <input
              type="text"
              name="bestTime"
              placeholder="Best Time to Visit"
              value={formData.bestTime}
              onChange={handleInputChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-32"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Highlights</label>
            <input
              type="text"
              name="highlights"
              placeholder="Highlights"
              value={formData.highlights}
              onChange={handleInputChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Entry Fee</label>
            <input
              type="text"
              name="entryFee"
              placeholder="Entry Fee"
              value={formData.entryFee}
              onChange={handleInputChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
            <input
              type="text"
              name="duration"
              placeholder="Duration"
              value={formData.duration}
              onChange={handleInputChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Opening Hours</label>
            <input
              type="text"
              name="openingHours"
              placeholder="Opening Hours"
              value={formData.openingHours}
              onChange={handleInputChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Activities</label>
            <textarea
              name="activities"
              placeholder="Activities"
              value={formData.activities}
              onChange={handleInputChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-24"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Tour Packages</label>
            <textarea
              name="tourPackages"
              placeholder="Tour Packages"
              value={formData.tourPackages}
              onChange={handleInputChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-24"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contact Info</label>
            <input
              type="text"
              name="contact"
              placeholder="Contact Information"
              value={formData.contact}
              onChange={handleInputChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Accessibility Info</label>
            <input
              type="text"
              name="accessibilityInfo"
              placeholder="Accessibility Information"
              value={formData.accessibilityInfo}
              onChange={handleInputChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Nearby Attractions</label>
            <textarea
              name="nearbyAttractions"
              placeholder="Nearby Attractions"
              value={formData.nearbyAttractions}
              onChange={handleInputChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-24"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Safety Tips</label>
            <textarea
              name="safetyTips"
              placeholder="Safety Tips"
              value={formData.safetyTips}
              onChange={handleInputChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-24"
            />
          </div>

          <div className="md:col-span-2 flex justify-between">
            <button
              type="submit"
              className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
            >
              {formData.placeId && details.some((d) => d.placeId === formData.placeId) ? "Update Details" : "Add Details"}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-500 text-white py-3 px-6 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Reset Form
            </button>
            {formData.placeId && details.some((d) => d.placeId === formData.placeId) && (
              <button
                type="button"
                onClick={() => setShowDeleteModal(true)}
                className="bg-red-600 text-white py-3 px-6 rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete Details
              </button>
            )}
          </div>
        </form>

        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
              <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete the details for this place? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="bg-gray-300 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddDetail;