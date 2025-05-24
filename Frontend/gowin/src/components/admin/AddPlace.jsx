import React, { useState } from 'react';
import Sidebar from './Sidebar';
import usePlaceStore from '../Store/PlaceStore';
import { Toaster, toast } from 'react-hot-toast';
import { motion } from 'framer-motion';

class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
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
  const [placeName, setPlaceName] = useState('');
  const [description, setDescription] = useState('');
  const [country, setCountry] = useState('');
  const [continent, setContinent] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const places = usePlaceStore((state) => state.places);
  const addPlace = usePlaceStore((state) => state.addPlace);
  const updatePlace = usePlaceStore((state) => state.updatePlace);
  const deletePlace = usePlaceStore((state) => state.deletePlace);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 2 * 1024 * 1024) {
      toast.error('Image size must be less than 2MB!', {
        className: 'toast-error',
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

  const validateForm = () => {
    const newErrors = {};
    if (!placeName.trim()) newErrors.placeName = 'Place name is required';
    if (!description.trim()) newErrors.description = 'Description is required';
    if (!country.trim()) newErrors.country = 'Country is required';
    if (!continent.trim()) newErrors.continent = 'Continent is required';
    if (!image && !editingId) newErrors.image = 'Image is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error('Please fill all required fields!', {
        className: 'toast-error',
      });
      return;
    }

    setIsLoading(true);
    const placeData = {
      placeName: placeName.trim(),
      description: description.trim(),
      country: country.trim(),
      continent: continent.trim(),
    };

    try {
      if (image) {
        const reader = new FileReader();
        reader.readAsDataURL(image);
        reader.onload = () => {
          placeData.image = reader.result;
          if (editingId) {
            updatePlace(editingId, { id: editingId, ...placeData });
            toast.success('Place updated successfully!', {
              className: 'toast-success',
            });
          } else {
            addPlace({ id: crypto.randomUUID(), ...placeData });
            toast.success('Place added successfully!', {
              className: 'toast-success',
            });
          }
          resetForm();
        };
        reader.onerror = () => {
          toast.error('Error reading image file!', {
            className: 'toast-error',
          });
        };
      } else if (editingId) {
        const existingPlace = places.find((p) => p.id === editingId);
        if (!existingPlace) {
          toast.error('Place not found!', {
            className: 'toast-error',
          });
          return;
        }
        updatePlace(editingId, {
          id: editingId,
          ...placeData,
          image: existingPlace.image,
        });
        toast.success('Place updated successfully!', {
          className: 'toast-success',
        });
        resetForm();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setPlaceName('');
    setDescription('');
    setCountry('');
    setContinent('');
    setImage(null);
    setImagePreview(null);
    setEditingId(null);
    setErrors({});
  };

  const startEditing = (place) => {
    if (!place || !place.id) {
      toast.error('Invalid place data!', {
        className: 'toast-error',
      });
      return;
    }
    setPlaceName(place.placeName || '');
    setDescription(place.description || '');
    setCountry(place.country || '');
    setContinent(place.continent || '');
    setImage(null);
    setImagePreview(place.image || null);
    setEditingId(place.id);
    setErrors({});
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this place?')) {
      deletePlace(id);
      toast.success('Place deleted successfully!', {
        className: 'toast-success',
      });
    }
  };

  const filteredPlaces = places.filter((place) => {
    if (!place || typeof place !== 'object') return false;
    const placeName = place.placeName || '';
    const country = place.country || '';
    const continent = place.continent || '';
    const query = searchQuery.toLowerCase();
    return (
      placeName.toLowerCase().includes(query) ||
      country.toLowerCase().includes(query) ||
      continent.toLowerCase().includes(query)
    );
  });

  return (
    <ErrorBoundary>
      <div className={`flex min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
        <Sidebar toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />
        <div className="flex-1 p-6 lg:p-8 max-w-7xl mx-auto pl-64 lg:pl-72">
          <Toaster position="top-right" reverseOrder={false} />
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold mb-8 text-center"
          >
            {editingId ? 'Edit Place' : 'Add Place'}
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`bg-white rounded-2xl shadow-lg p-8 mb-10 max-w-lg mx-auto ${isDarkMode ? 'bg-gray-800' : ''}`}
          >
            <div className="space-y-6">
              <div className="relative">
                <label className="block text-sm font-medium">Place Name</label>
                <input
                  type="text"
                  className={`mt-1 w-full p-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 ${
                    errors.placeName ? 'border-red-500' : 'border-gray-300'
                  } ${isDarkMode ? 'bg-gray-700 text-white' : ''}`}
                  value={placeName}
                  onChange={(e) => setPlaceName(e.target.value)}
                  placeholder="Enter place name"
                  aria-invalid={errors.placeName ? 'true' : 'false'}
                  aria-describedby={errors.placeName ? 'placeName-error' : undefined}
                />
                {errors.placeName && (
                  <p id="placeName-error" className="text-red-500 text-sm mt-1 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.414L11 9.586V6z" />
                    </svg>
                    {errors.placeName}
                  </p>
                )}
              </div>
              <div className="relative">
                <label className="block text-sm font-medium">Description</label>
                <textarea
                  className={`mt-1 w-full p-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 ${
                    errors.description ? 'border-red-500' : 'border-gray-300'
                  } ${isDarkMode ? 'bg-gray-700 text-white' : ''}`}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter description"
                  rows="4"
                  aria-invalid={errors.description ? 'true' : 'false'}
                  aria-describedby={errors.description ? 'description-error' : undefined}
                />
                {errors.description && (
                  <p id="description-error" className="text-red-500 text-sm mt-1 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.414L11 9.586V6z" />
                    </svg>
                    {errors.description}
                  </p>
                )}
              </div>
              <div className="relative">
                <label className="block text-sm font-medium">Country</label>
                <input
                  type="text"
                  className={`mt-1 w-full p-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 ${
                    errors.country ? 'border-red-500' : 'border-gray-300'
                  } ${isDarkMode ? 'bg-gray-700 text-white' : ''}`}
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="Enter country"
                  aria-invalid={errors.country ? 'true' : 'false'}
                  aria-describedby={errors.country ? 'country-error' : undefined}
                />
                {errors.country && (
                  <p id="country-error" className="text-red-500 text-sm mt-1 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.414L11 9.586V6z" />
                    </svg>
                    {errors.country}
                  </p>
                )}
              </div>
              <div className="relative">
                <label className="block text-sm font-medium">Continent</label>
                <select
                  className={`mt-1 w-full p-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 ${
                    errors.continent ? 'border-red-500' : 'border-gray-300'
                  } ${isDarkMode ? 'bg-gray-700 text-white' : ''}`}
                  value={continent}
                  onChange={(e) => setContinent(e.target.value)}
                  aria-invalid={errors.continent ? 'true' : 'false'}
                  aria-describedby={errors.continent ? 'continent-error' : undefined}
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
                  <p id="continent-error" className="text-red-500 text-sm mt-1 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.414L11 9.586V6z" />
                    </svg>
                    {errors.continent}
                  </p>
                )}
              </div>
              <div className="relative">
                <label className="block text-sm font-medium">
                  {editingId ? 'Upload New Image (Optional)' : 'Upload Image'}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  className={`mt-1 w-full p-3 border rounded-lg text-gray-500 transition-all duration-200 ${
                    errors.image ? 'border-red-500' : 'border-gray-300'
                  } ${isDarkMode ? 'bg-gray-700 text-white' : ''}`}
                  onChange={handleImageChange}
                  aria-invalid={errors.image ? 'true' : 'false'}
                  aria-describedby={errors.image ? 'image-error' : undefined}
                />
                {errors.image && (
                  <p id="image-error" className="text-red-500 text-sm mt-1 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.414L11 9.586V6z" />
                    </svg>
                    {errors.image}
                  </p>
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
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className={`w-full bg-teal-600 text-white py-3 rounded-lg font-medium hover:bg-teal-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 flex items-center justify-center ${
                    isLoading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  aria-label={editingId ? 'Update Place' : 'Add Place'}
                >
                  {isLoading ? (
                    <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  ) : null}
                  {isLoading ? 'Processing...' : editingId ? 'Update Place' : 'Add Place'}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={resetForm}
                  className="w-full bg-gray-300 text-gray-800 py-3 rounded-lg font-medium hover:bg-gray-400 transition duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  aria-label="Reset Form"
                >
                  Reset
                </motion.button>
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 max-w-lg mx-auto relative"
          >
            <input
              type="text"
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 ${
                isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'
              }`}
              placeholder="Search places by name, country, or continent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search places"
            />
            <svg
              className="absolute right-3 top-3 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold mb-8 text-center"
          >
            Places
          </motion.h2>
          {filteredPlaces.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center text-gray-500"
            >
              <svg
                className="mx-auto h-24 w-24 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447-2.724A1 1 0 0021 13.382V2.618a1 1 0 00-1.447-.894L15 4m0 13l-6-3"
                />
              </svg>
              <p className="mt-4 text-lg">No places found. Add a new destination above!</p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPlaces.map((place) => (
                <motion.div
                  key={place.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className={`bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 relative group ${
                    isDarkMode ? 'bg-gray-800' : ''
                  }`}
                >
                  <img
                    src={place.image || 'https://via.placeholder.com/400x200'}
                    alt={place.placeName || 'Place'}
                    className="w-full h-56 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-semibold">{place.placeName || 'Unknown Place'}</h3>
                    <p className="text-gray-600 mt-2 line-clamp-3">{place.description || 'No description available'}</p>
                    <p className="text-gray-500 mt-1">
                      <span className="font-medium">Country:</span> {place.country || 'Unknown'}
                    </p>
                    <p className="text-gray-500">
                      <span className="font-medium">Continent:</span> {place.continent || 'Unknown'}
                    </p>
                    <div className="flex justify-between mt-4">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => startEditing(place)}
                        className="bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600 transition duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 relative group/button"
                        aria-label={`Edit ${place.placeName || 'place'}`}
                      >
                        Edit
                        <div className="absolute hidden group-hover/button:block bg-teal-800 text-white text-sm px-2 py-1 rounded-md -top-8 left-1/2 transform -translate-x-1/2">
                          Edit this place
                        </div>
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDelete(place.id)}
                        className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 relative group/button"
                        aria-label={`Delete ${place.placeName || 'place'}`}
                      >
                        Delete
                        <div className="absolute hidden group-hover/button:block bg-teal-800 text-white text-sm px-2 py-1 rounded-md -top-8 left-1/2 transform -translate-x-1/2">
                          Delete this place
                        </div>
                      </motion.button>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="mt-4 w-full bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 relative group/button"
                      aria-label={`View details for ${place.placeName || 'place'}`}
                    >
                      View Details
                      <div className="absolute hidden group-hover/button:block bg-teal-800 text-white text-sm px-2 py-1 rounded-md -top-8 left-1/2 transform -translate-x-1/2">
                        See more about this place
                      </div>
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default AddPlace;