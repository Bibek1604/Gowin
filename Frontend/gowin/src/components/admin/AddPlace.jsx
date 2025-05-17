import React, { useState } from "react";
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
    // State for editing
    const [editingId, setEditingId] = useState(null);

    // Zustand store
    const places = usePlaceStore((state) => state.places);
    const addPlace = usePlaceStore((state) => state.addPlace);
    const updatePlace = usePlaceStore((state) => state.updatePlace);
    const deletePlace = usePlaceStore((state) => state.deletePlace);

    // Handle form submission for adding or updating
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!placeName || !description || !country || !continent || (!image && !editingId)) {
            toast.error("All fields are required!");
            return;
        }

        const placeData = {
            placeName,
            description,
            country,
            continent,
        };

        if (image) {
            // Convert image to base64
            const reader = new FileReader();
            reader.readAsDataURL(image);
            reader.onload = () => {
                placeData.image = reader.result;

                if (editingId) {
                    // Update existing place
                    updatePlace(editingId, { id: editingId, ...placeData });
                    toast.success("Place updated successfully!");
                } else {
                    // Add new place
                    addPlace({ id: crypto.randomUUID(), ...placeData });
                    toast.success("Place added successfully!");
                }

                // Reset form
                resetForm();
            };
            reader.onerror = () => {
                toast.error("Error reading image file!");
            };
        } else if (editingId) {
            // Update without changing image
            updatePlace(editingId, { id: editingId, ...placeData, image: places.find((p) => p.id === editingId).image });
            toast.success("Place updated successfully!");
            resetForm();
        }
    };

    // Reset form fields and editing state
    const resetForm = () => {
        setPlaceName("");
        setDescription("");
        setCountry("");
        setContinent("");
        setImage(null);
        setEditingId(null);
    };

    // Start editing a place
    const startEditing = (place) => {
        setPlaceName(place.placeName);
        setDescription(place.description);
        setCountry(place.country);
        setContinent(place.continent);
        setImage(null); // Image is optional for updates
        setEditingId(place.id);
    };

    // Handle deletion
    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this place?")) {
            deletePlace(id);
            toast.success("Place deleted successfully!");
        }
    };

    return (
        <>
            <Sidebar />
            <div className="p-6 max-w-4xl mx-auto mt-10">
                {/* Toaster for toast notifications */}
                <Toaster position="top-right" reverseOrder={false} />
                <h2 className="text-2xl font-bold mb-6 text-center">
                    {editingId ? "Edit Place" : "Add Place"}
                </h2>
                {/* Form for adding or editing */}
                <div className="bg-white rounded-xl shadow-md p-6 mb-8 max-w-md mx-auto">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block mb-2 font-semibold">Place Name</label>
                            <input
                                type="text"
                                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                value={placeName}
                                onChange={(e) => setPlaceName(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-2 font-semibold">Description</label>
                            <textarea
                                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                            ></textarea>
                        </div>
                        <div>
                            <label className="block mb-2 font-semibold">Country Name</label>
                            <input
                                type="text"
                                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                value={country}
                                onChange={(e) => setCountry(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-2 font-semibold">Continent</label>
                            <input
                                type="text"
                                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                value={continent}
                                onChange={(e) => setCountry(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-2 font-semibold">
                                {editingId ? "Upload New Image (Optional)" : "Upload Image"}
                            </label>
                            <input
                                type="file"
                                className="w-full p-3 border rounded-lg"
                                onChange={(e) => setImage(e.target.files[0])}
                                required={!editingId}
                            />
                            {editingId && places.find((p) => p.id === editingId)?.image && (
                                <img
                                    src={places.find((p) => p.id === editingId).image}
                                    alt="Current"
                                    className="mt-2 w-full h-32 object-cover rounded-lg"
                                />
                            )}
                        </div>
                        <div className="flex space-x-4">
                            <button
                                type="submit"
                                className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition"
                            >
                                {editingId ? "Update Place" : "Add Place"}
                            </button>
                            {editingId && (
                                <button
                                    type="button"
                                    className="w-full bg-gray-500 text-white py-3 rounded-lg font-semibold hover:bg-gray-600 transition"
                                    onClick={resetForm}
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
                </div>
                {/* List of places */}
                <h2 className="text-2xl font-bold mb-6 text-center">Places</h2>
                {places.length === 0 ? (
                    <p className="text-center">No places added yet.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {places.map((place) => (
                            <div
                                key={place.id}
                                className="bg-white p-4 rounded-xl shadow-md"
                            >
                                <img
                                    src={place.image}
                                    alt={place.placeName}
                                    className="w-full h-48 object-cover rounded-lg mb-4"
                                />
                                <h3 className="text-xl font-semibold">{place.placeName}</h3>
                                <p className="text-gray-600">{place.description}</p>
                                <p className="text-gray-600">Country: {place.country}</p>
                                <p className="text-gray-600">Continent: {place.continent}</p>
                                <div className="flex justify-between mt-4">
                                    <button
                                        className="bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600"
                                        onClick={() => startEditing(place)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600"
                                        onClick={() => handleDelete(place.id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};

export default PlaceManager;