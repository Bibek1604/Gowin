import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  MapPin, Clock, DollarSign, Plus, Edit2, Trash2,
  Search, Upload, X, Globe, Tag
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import usePlaceStore from '../Store/PlaceStore';
import useCategoryStore from '../Store/CategoryStore';

const INITIAL_FORM = {
  title: '',
  description: '',
  price: '',
  duration: '',
  location: '',
  category_id: '',
  destination_type: 'International',
  images: [],
};

const ManageDestinations = () => {
  const [form, setForm] = useState(INITIAL_FORM);
  const [imagePreview, setImagePreview] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('All');
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const { places, addPlace, updatePlace, deletePlace, fetchPlaces, isLoading } = usePlaceStore();
  const { categories, fetchCategories } = useCategoryStore();

  useEffect(() => {
    fetchPlaces();
    fetchCategories();
  }, [fetchPlaces, fetchCategories]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
      setForm(prev => ({ ...prev, images: [reader.result] }));
    };
    reader.readAsDataURL(file);
  };

  const openModal = (place = null) => {
    if (place) {
      setForm({
        title: place.title || '',
        description: place.description || '',
        price: place.price || '',
        duration: place.duration || '',
        location: place.location || '',
        category_id: place.category_id || '',
        destination_type: place.destination_type || 'International',
        images: place.images || [],
      });
      setImagePreview(place.images?.[0] || null);
      setEditingId(place.id);
    } else {
      setForm(INITIAL_FORM);
      setImagePreview(null);
      setEditingId(null);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.category_id) {
      toast.error('Title and category are required');
      return;
    }
    const res = editingId ? await updatePlace(editingId, form) : await addPlace(form);
    if (res.success) {
      toast.success(editingId ? 'Destination updated successfully' : 'Destination created successfully');
      closeModal();
      fetchPlaces();
    } else {
      toast.error('Operation failed. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    const res = await deletePlace(id);
    if (res.success) {
      toast.success('Destination deleted');
      setDeleteConfirmId(null);
    } else {
      toast.error('Delete failed');
    }
  };

  const filteredPlaces = places.filter(p => {
    const matchesSearch =
      p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'All' || p.categories?.name === activeTab;
    return matchesSearch && matchesTab;
  });

  const tabs = ['All', ...categories.map(c => c.name)];

  return (
    <div className="p-4 sm:p-6 lg:p-8 min-h-screen font-sans">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#0F4C5C] tracking-tight">Manage Destinations</h1>
          <p className="text-gray-500 text-sm mt-0.5">Add, edit and manage tour packages</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white bg-[#0F4C5C] hover:bg-[#0a3845] transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" /> Add Destination
        </button>
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-3 flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search by title or location..."
            className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF7F50]/20 focus:border-[#FF7F50]/40 transition-all"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-0.5" style={{ scrollbarWidth: 'none' }}>
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === tab
                  ? 'bg-[#FF7F50] text-white shadow-sm'
                  : 'bg-gray-50 text-gray-500 hover:text-[#0F4C5C] border border-gray-100'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="h-72 bg-white rounded-2xl animate-pulse border border-gray-100" />
          ))}
        </div>
      ) : filteredPlaces.length === 0 ? (
        <div className="py-24 text-center bg-white rounded-2xl border border-gray-100">
          <Search className="w-12 h-12 text-gray-200 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-[#0F4C5C] mb-1">No destinations found</h3>
          <p className="text-gray-400 text-sm">Try adjusting your search or filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <AnimatePresence>
            {filteredPlaces.map((place) => (
              <motion.div
                key={place.id}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-[22px] border border-[#0F4C5C]/[0.06] shadow-[0_2px_12px_rgba(15,76,92,0.06)] overflow-hidden hover:shadow-[0_16px_40px_rgba(15,76,92,0.18)] hover:-translate-y-1 transition-all duration-400 group flex flex-col"
              >
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={place.images?.[0] || 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=500&q=80'}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    alt={place.title}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                  <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-black text-[#FF7F50] shadow-sm flex items-center gap-0.5">
                    <DollarSign className="w-3 h-3" />{place.price}
                  </div>
                  <div className="absolute top-3 right-3 text-[9px] font-bold text-white bg-[#0F4C5C]/80 backdrop-blur-md px-2.5 py-1 rounded-full flex items-center gap-1">
                    <Globe className="w-2.5 h-2.5" />
                    {place.destination_type || 'Intl'}
                  </div>
                  <span className="absolute bottom-3 left-3 text-[9px] font-bold uppercase tracking-widest text-white/95 bg-black/25 backdrop-blur-md px-2.5 py-1 rounded-full flex items-center gap-1">
                    <Tag className="w-2.5 h-2.5" />
                    {place.categories?.name || 'Uncategorised'}
                  </span>
                </div>

                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="font-bold text-[#0F4C5C] text-sm leading-snug line-clamp-2 mb-2 group-hover:text-[#FF7F50] transition-colors">
                    {place.title}
                  </h3>
                  <div className="flex items-center gap-1 text-xs text-gray-400 mb-1">
                    <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="truncate">{place.location}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-400 mb-4">
                    <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                    {place.duration}
                  </div>
                  <div className="mt-auto flex gap-2 pt-3 border-t border-dashed border-gray-100">
                    <button
                      onClick={() => openModal(place)}
                      className="flex-1 text-xs font-semibold text-[#0F4C5C] bg-[#0F4C5C]/5 py-2 rounded-xl hover:bg-[#0F4C5C] hover:text-white transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Edit2 className="w-3.5 h-3.5" /> Edit
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(place.id)}
                      className="flex-1 text-xs font-semibold text-red-500 bg-red-50 py-2 rounded-xl hover:bg-red-500 hover:text-white transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirmId && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setDeleteConfirmId(null)}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-sm bg-white rounded-2xl shadow-xl p-6 text-center"
            >
              <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="text-lg font-bold text-[#0F4C5C] mb-1">Delete Destination?</h3>
              <p className="text-sm text-gray-500 mb-6">This action cannot be undone. All associated data will be permanently removed.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  className="flex-1 py-2.5 text-sm font-semibold text-gray-500 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirmId)}
                  className="flex-1 py-2.5 text-sm font-semibold text-white bg-red-500 rounded-xl hover:bg-red-600 transition-colors"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Create / Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={closeModal}
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gray-50/50">
                <div>
                  <h3 className="text-lg font-bold text-[#0F4C5C]">
                    {editingId ? 'Edit Destination' : 'Add New Destination'}
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">Fill in the details below</p>
                </div>
                <button
                  onClick={closeModal}
                  className="w-9 h-9 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors shadow-sm"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Form */}
              <form onSubmit={handleSubmit} className="p-5 max-h-[75vh] overflow-y-auto space-y-4">
                {/* Title */}
                <div>
                  <label className="text-xs font-semibold text-[#0F4C5C] block mb-1.5">Package Title *</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF7F50]/20 focus:border-[#FF7F50]/50 transition-all"
                    placeholder="e.g. Everest Base Camp Trek"
                    value={form.title}
                    onChange={e => setForm({ ...form, title: e.target.value })}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Category */}
                  <div>
                    <label className="text-xs font-semibold text-[#0F4C5C] block mb-1.5">Category *</label>
                    <div className="relative">
                      <select
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF7F50]/20 appearance-none cursor-pointer"
                        value={form.category_id}
                        onChange={e => setForm({ ...form, category_id: e.target.value })}
                        required
                      >
                        <option value="">Select category</option>
                        {categories.map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </select>
                      <Tag className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-300 w-4 h-4 pointer-events-none" />
                    </div>
                  </div>

                  {/* Type */}
                  <div>
                    <label className="text-xs font-semibold text-[#0F4C5C] block mb-1.5">Destination Type</label>
                    <div className="relative">
                      <select
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF7F50]/20 appearance-none cursor-pointer"
                        value={form.destination_type}
                        onChange={e => setForm({ ...form, destination_type: e.target.value })}
                      >
                        <option value="International">International</option>
                        <option value="National">National (Nepal)</option>
                      </select>
                      <Globe className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-300 w-4 h-4 pointer-events-none" />
                    </div>
                  </div>

                  {/* Price */}
                  <div>
                    <label className="text-xs font-semibold text-[#0F4C5C] block mb-1.5">Price (USD)</label>
                    <div className="relative">
                      <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        className="w-full pl-9 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF7F50]/20 transition-all"
                        placeholder="e.g. 1200"
                        value={form.price}
                        onChange={e => setForm({ ...form, price: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* Duration */}
                  <div>
                    <label className="text-xs font-semibold text-[#0F4C5C] block mb-1.5">Duration</label>
                    <div className="relative">
                      <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        className="w-full pl-9 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF7F50]/20 transition-all"
                        placeholder="e.g. 14 Days / 13 Nights"
                        value={form.duration}
                        onChange={e => setForm({ ...form, duration: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label className="text-xs font-semibold text-[#0F4C5C] block mb-1.5">Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      className="w-full pl-9 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF7F50]/20 transition-all"
                      placeholder="e.g. Solukhumbu, Nepal"
                      value={form.location}
                      onChange={e => setForm({ ...form, location: e.target.value })}
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="text-xs font-semibold text-[#0F4C5C] block mb-1.5">Description</label>
                  <textarea
                    rows="4"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF7F50]/20 transition-all resize-none"
                    placeholder="Describe the tour experience..."
                    value={form.description}
                    onChange={e => setForm({ ...form, description: e.target.value })}
                  />
                </div>

                {/* Image Upload */}
                <div>
                  <label className="text-xs font-semibold text-[#0F4C5C] block mb-1.5">Cover Image</label>
                  <div className="flex gap-3 items-start">
                    <label className="flex-1 flex flex-col items-center justify-center py-6 border-2 border-dashed border-gray-200 hover:border-[#FF7F50]/40 rounded-xl bg-gray-50 hover:bg-white transition-all cursor-pointer group">
                      <Upload className="w-6 h-6 text-gray-300 group-hover:text-[#FF7F50] mb-1.5" />
                      <span className="text-xs text-gray-400 font-medium">Upload image</span>
                      <input type="file" onChange={handleImageChange} className="hidden" accept="image/*" />
                    </label>
                    <AnimatePresence>
                      {imagePreview && (
                        <motion.div
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="w-24 h-24 rounded-xl overflow-hidden border border-gray-100 shadow-sm relative flex-shrink-0"
                        >
                          <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" />
                          <button
                            type="button"
                            onClick={() => { setImagePreview(null); setForm(p => ({ ...p, images: [] })); }}
                            className="absolute top-1 right-1 bg-red-500 text-white p-0.5 rounded-lg"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-[#FF7F50] text-white rounded-xl font-semibold text-sm hover:bg-[#e56a42] transition-all shadow-sm"
                  >
                    {editingId ? 'Save Changes' : 'Create Destination'}
                  </button>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-6 py-3 bg-gray-100 text-gray-500 rounded-xl font-semibold text-sm hover:bg-gray-200 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ManageDestinations;
