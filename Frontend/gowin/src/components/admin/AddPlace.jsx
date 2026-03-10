import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import usePlaceStore from '../Store/PlaceStore';
import useCategoryStore from '../Store/CategoryStore';
import { Toaster, toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import colors from '../../theme/colors';


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
  const [price, setPrice] = useState('');
  const [duration, setDuration] = useState('');
  const [location, setLocation] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [errors, setErrors] = useState({});
  const [isDarkMode, setIsDarkMode] = useState(false);

  const { places, addPlace, updatePlace, deletePlace, fetchPlaces, isLoading } = usePlaceStore();
  const { categories, fetchCategories } = useCategoryStore();

  useEffect(() => {
    fetchPlaces();
    fetchCategories();
  }, [fetchPlaces, fetchCategories]);

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
    if (!placeName.trim()) newErrors.placeName = 'Title is required';
    if (!description.trim()) newErrors.description = 'Description is required';
    if (!price) newErrors.price = 'Price is required';
    if (!location.trim()) newErrors.location = 'Location is required';
    if (!categoryId) newErrors.categoryId = 'Category is required';
    if (!image && !editingId) newErrors.image = 'Image is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error('Please fill all required fields!');
      return;
    }

    const placeData = {
      title: placeName.trim(),
      description: description.trim(),
      price: parseFloat(price),
      duration: duration.trim(),
      location: location.trim(),
      category_id: categoryId,
      images: [imagePreview],
    };

    try {
      let result;
      if (editingId) {
        result = await updatePlace(editingId, placeData);
        if (result.success) toast.success('Place updated successfully!');
      } else {
        result = await addPlace(placeData);
        if (result.success) toast.success('Place added successfully!');
      }

      if (result && result.success) {
        resetForm();
      }
    } catch (err) {
      console.error(err);
      toast.error('An error occurred.');
    }
  };

  const resetForm = () => {
    setPlaceName('');
    setDescription('');
    setPrice('');
    setDuration('');
    setLocation('');
    setCategoryId('');
    setImage(null);
    setImagePreview(null);
    setEditingId(null);
    setErrors({});
  };

  const startEditing = (place) => {
    setPlaceName(place.title || '');
    setDescription(place.description || '');
    setPrice(place.price || '');
    setDuration(place.duration || '');
    setLocation(place.location || '');
    setCategoryId(place.category_id || '');
    setImagePreview(place.images ? place.images[0] : null);
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
    const title = place.title || '';
    const location = place.location || '';
    const query = searchQuery.toLowerCase();
    return (
      title.toLowerCase().includes(query) ||
      location.toLowerCase().includes(query)
    );
  });

  return (
    <ErrorBoundary>
      <div className="flex min-h-screen" style={{ background: colors.neutral.offWhite, fontFamily: 'Outfit, sans-serif' }}>
        <Sidebar />
        <div className="flex-1 ml-64 p-12">
          <Toaster position="top-right" />

          {/* Page Header */}
          <div className="mb-12">
            <h1 className="text-3xl font-bold uppercase tracking-tight" style={{ color: colors.primary.navy }}>
              Destinations
            </h1>
            <p className="text-slate-500 text-sm mt-1">Manage global travel spots and pricing</p>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-2xl border border-slate-200 p-10 mb-16 shadow-sm"
          >
            <h3 className="text-xl font-bold mb-8 uppercase tracking-wider" style={{ color: colors.primary.navy }}>
              {editingId ? 'Modify Destination' : 'New Destination'}
            </h3>
            <div className="space-y-6">
              <div className="relative">
                <label className="block text-sm font-medium">Place Name</label>
                <input
                  type="text"
                  className={`mt-1 w-full p-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 ${errors.placeName ? 'border-red-500' : 'border-gray-300'
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
                  className={`mt-1 w-full p-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 ${errors.description ? 'border-red-500' : 'border-gray-300'
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
                <label className="block text-sm font-medium">Category</label>
                <select
                  className={`mt-1 w-full p-3 border rounded-lg focus:ring-2 focus:ring-teal-500 transition-all duration-200 ${errors.categoryId ? 'border-red-500' : 'border-gray-300'
                    } ${isDarkMode ? 'bg-gray-700 text-white' : ''}`}
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
                {errors.categoryId && <p className="text-red-500 text-sm mt-1">{errors.categoryId}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <label className="block text-sm font-medium">Price ($)</label>
                  <input
                    type="number"
                    className={`mt-1 w-full p-3 border rounded-lg focus:ring-2 focus:ring-teal-500 transition-all duration-200 ${errors.price ? 'border-red-500' : 'border-gray-300'
                      } ${isDarkMode ? 'bg-gray-700 text-white' : ''}`}
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="e.g. 150"
                  />
                  {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
                </div>
                <div className="relative">
                  <label className="block text-sm font-medium">Duration</label>
                  <input
                    type="text"
                    className={`mt-1 w-full p-3 border rounded-lg focus:ring-2 focus:ring-teal-500 transition-all duration-200 ${isDarkMode ? 'bg-gray-700 text-white' : ''}`}
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="e.g. 3 Days / 2 Nights"
                  />
                </div>
              </div>

              <div className="relative">
                <label className="block text-sm font-medium">Location</label>
                <input
                  type="text"
                  className={`mt-1 w-full p-3 border rounded-lg focus:ring-2 focus:ring-teal-500 transition-all duration-200 ${errors.location ? 'border-red-500' : 'border-gray-300'
                    } ${isDarkMode ? 'bg-gray-700 text-white' : ''}`}
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Pokhara, Nepal"
                />
                {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
              </div>
              <div className="relative">
                <label className="block text-sm font-medium">
                  {editingId ? 'Upload New Image (Optional)' : 'Upload Image'}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  className={`mt-1 w-full p-3 border rounded-lg text-gray-500 transition-all duration-200 ${errors.image ? 'border-red-500' : 'border-gray-300'
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
              <div className="flex space-x-4 pt-6">
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="flex-1 py-4 rounded-xl font-bold uppercase tracking-widest text-xs text-white"
                  style={{ background: colors.accent.orange }}
                >
                  {isLoading ? 'Processing...' : editingId ? 'Update Place' : 'Add Place'}
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={resetForm}
                  className="flex-1 bg-slate-100 text-slate-400 py-4 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-slate-200"
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
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPlaces.map((place) => (
                <div
                  key={place.id}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all"
                >
                  <img
                    src={(place.images && place.images[0]) || 'https://via.placeholder.com/400x200'}
                    alt={place.title || 'Place'}
                    className="w-full h-52 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-lg font-bold uppercase tracking-tight" style={{ color: colors.primary.navy }}>
                      {place.title}
                    </h3>
                    <p className="text-slate-500 text-sm mt-2 line-clamp-2">{place.description}</p>

                    <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
                      <span className="text-xl font-black" style={{ color: colors.accent.orange }}>
                        ${place.price}
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => startEditing(place)}
                          className="text-[10px] uppercase tracking-widest font-bold text-sky-500 hover:text-sky-700"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(place.id)}
                          className="text-[10px] uppercase tracking-widest font-bold text-red-500 hover:text-red-700"
                        >
                          Delete
                        </button>
                      </div>
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