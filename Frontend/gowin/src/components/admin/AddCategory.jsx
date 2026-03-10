import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Sidebar from './Sidebar';
import useCategoryStore from '../Store/CategoryStore';
import colors from '../../theme/colors';

const AddCategory = () => {
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [editId, setEditId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState('');

  const { categories, addCategory, updateCategory, deleteCategory, fetchCategories, isLoading } = useCategoryStore();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const generateId = () => crypto.randomUUID();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB');
        return;
      }
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!category.trim() || !description.trim()) {
      setError('Category name and description are required');
      return;
    }

    const categoryData = {
      category,
      description,
      image: imagePreview,
    };

    let result;
    if (editId) {
      result = await updateCategory(editId, categoryData);
      if (result.success) alert('Category updated successfully!');
    } else {
      result = await addCategory(categoryData);
      if (result.success) alert('Category added successfully!');
    }

    if (result && result.success) {
      resetForm();
    } else if (result) {
      setError('Failed to save category. Please try again.');
    }
  };

  const resetForm = () => {
    setCategory('');
    setDescription('');
    setImage(null);
    setImagePreview(null);
    setEditId(null);
    setError('');
    setIsModalOpen(false);
  };

  const handleEdit = (cat) => {
    setCategory(cat.name);
    setDescription(cat.description);
    setImagePreview(cat.image_url);
    setEditId(cat.id);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      deleteCategory(id);
      alert('Category deleted successfully!');
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 ml-64 p-12" style={{ background: colors.neutral.offWhite, fontFamily: 'Outfit, sans-serif' }}>
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold uppercase tracking-tight" style={{ color: colors.primary.navy }}>Categories</h2>
              <p className="text-slate-500 text-sm mt-1">Manage tour destinations and groupings</p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-xs text-white transition-all shadow-md hover:brightness-110 active:scale-95"
              style={{ background: colors.primary.navy }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <span>Add Category</span>
            </button>
          </div>

          {/* Category List */}
          {categories.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No categories added yet. Start by adding one!</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {categories.map((cat) => (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center justify-between p-6 bg-white rounded-2xl border border-slate-200 shadow-sm"
                >
                  <div className="flex items-center space-x-4">
                    {cat.image_url && (
                      <img
                        src={cat.image_url}
                        alt={cat.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    )}
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800">{cat.name}</h4>
                      <p className="text-gray-600">{cat.description}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(cat)}
                      className="text-xs uppercase tracking-widest font-bold px-3 py-1 text-sky-500 hover:text-sky-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(cat.id)}
                      className="text-xs uppercase tracking-widest font-bold px-3 py-1 text-red-500 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Modal for Add/Edit */}
          {isModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-xl p-8 w-full max-w-md"
              >
                <h3 className="text-2xl font-bold text-gray-800 mb-6">
                  {editId ? 'Edit Category' : 'Add New Category'}
                </h3>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && <p className="text-red-500 text-sm">{error}</p>}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category Name
                    </label>
                    <input
                      type="text"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-sky-500 transition"
                      placeholder="e.g. Adventure, Wellness..."
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                      rows="4"
                      placeholder="Enter category description"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category Image
                    </label>
                    <div className="flex items-center space-x-4">
                      <label className="cursor-pointer bg-gray-100 border border-gray-300 rounded-lg p-3 w-full text-center hover:bg-gray-200 transition">
                        <span className="text-gray-600">
                          {image ? 'Change Image' : 'Choose Image'}
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </label>
                      {imagePreview && (
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-4 pt-4">
                    <button
                      type="submit"
                      className="flex-1 py-4 rounded-xl font-bold uppercase tracking-widest text-xs text-white transition-all"
                      style={{ background: colors.accent.orange }}
                    >
                      {editId ? 'Save Changes' : 'Create Category'}
                    </button>
                    <button
                      type="button"
                      onClick={resetForm}
                      className="flex-1 py-4 rounded-xl font-bold uppercase tracking-widest text-xs transition-all bg-slate-100 text-slate-400 hover:bg-slate-200"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddCategory;