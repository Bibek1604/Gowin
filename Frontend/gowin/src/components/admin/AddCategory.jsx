import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Sidebar from './Sidebar';
import useCategoryStore from '../Store/CategoryStore';

const AddCategory = () => {
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [editId, setEditId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState('');

  const { categories, addCategory, updateCategory, deleteCategory } = useCategoryStore();

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!category.trim() || !description.trim()) {
      setError('Category name and description are required');
      return;
    }

    const categoryData = {
      id: editId || generateId(),
      category,
      description,
      image: imagePreview,
    };

    if (editId) {
      updateCategory(editId, categoryData);
      alert('Category updated successfully!');
    } else {
      addCategory(categoryData);
      alert('Category added successfully!');
    }

    resetForm();
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
    setCategory(cat.category);
    setDescription(cat.description);
    setImagePreview(cat.image);
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
      <div className="flex-1 ml-64 p-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Category Management</h2>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition flex items-center space-x-2"
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
                  className="flex items-center justify-between p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition"
                >
                  <div className="flex items-center space-x-4">
                    {cat.image && (
                      <img
                        src={cat.image}
                        alt={cat.category}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    )}
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800">{cat.category}</h4>
                      <p className="text-gray-600">{cat.description}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(cat)}
                      className="text-indigo-600 hover:text-indigo-800 font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(cat.id)}
                      className="text-red-600 hover:text-red-800 font-medium"
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
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                      placeholder="Enter category name"
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
                  <div className="flex space-x-4">
                    <button
                      type="submit"
                      className="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
                    >
                      {editId ? 'Update Category' : 'Add Category'}
                    </button>
                    <button
                      type="button"
                      onClick={resetForm}
                      className="flex-1 bg-gray-300 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-400 transition"
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