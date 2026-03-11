import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tags, Plus, Edit2, Trash2, X, Upload, Image as ImageIcon } from 'lucide-react';
import useCategoryStore from '../Store/CategoryStore';
import { Toaster, toast } from 'react-hot-toast';

const AddCategory = () => {
  const [form, setForm] = useState({ name: '', description: '', image: '' });
  const [imagePreview, setImagePreview] = useState(null);
  const [editId, setEditId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { categories, addCategory, updateCategory, deleteCategory, fetchCategories, isLoading } = useCategoryStore();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setForm(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const openModal = (cat = null) => {
    if (cat) {
      setForm({ name: cat.name, description: cat.description || '', image: cat.image_url || '' });
      setImagePreview(cat.image_url || null);
      setEditId(cat.id);
    } else {
      setForm({ name: '', description: '', image: '' });
      setImagePreview(null);
      setEditId(null);
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error('Category name is required');
      return;
    }

    const categoryData = {
      category: form.name,
      description: form.description,
      image: form.image
    };

    const res = editId 
      ? await updateCategory(editId, categoryData)
      : await addCategory(categoryData);

    if (res.success) {
      toast.success(editId ? 'Category updated' : 'Category created');
      setIsModalOpen(false);
      fetchCategories();
    } else {
      toast.error('Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this category? This might affect places linked to it.')) {
      const res = await deleteCategory(id);
      if (res.success) toast.success('Deleted successfully');
      else toast.error('Delete failed');
    }
  };

  return (
    <div className="p-12 font-sans min-h-screen">
      <Toaster position="top-right" />
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-3xl font-bold text-[#0F4C5C] tracking-tight">Trip Categories</h1>
            <p className="text-gray-500 text-lg mt-1">Organize your tours by types and themes</p>
          </div>
          <button
            onClick={() => openModal()}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white bg-[#0F4C5C] hover:bg-[#0a3845] transition-all shadow-lg shadow-[#0F4C5C]/10"
          >
            <Plus className="w-5 h-5" />
            Add Category
          </button>
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3].map(i => <div key={i} className="h-48 bg-white rounded-[2rem] animate-pulse border border-gray-100 shadow-sm" />)}
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-[2rem] border border-gray-100">
            <Tags className="w-16 h-16 text-gray-100 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No categories yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => (
              <div key={cat.id} className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:-translate-y-1 transition-all duration-300 group">
                <div className="h-32 bg-gray-100 overflow-hidden relative">
                  {cat.image_url ? (
                    <img src={cat.image_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={cat.name} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="w-8 h-8 text-gray-300" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>
                
                <div className="p-6">
                  <h4 className="text-lg font-bold text-[#0F4C5C] mb-2">{cat.name}</h4>
                  <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed mb-6">
                    {cat.description || "No description provided."}
                  </p>
                  
                  <div className="flex gap-2 pt-4 border-t border-gray-50">
                    <button
                      onClick={() => openModal(cat)}
                      className="flex-1 text-xs font-bold text-[#2A9D8F] bg-[#2A9D8F]/10 py-2.5 rounded-xl hover:bg-[#2A9D8F] hover:text-white transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Edit2 className="w-3.5 h-3.5" /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(cat.id)}
                      className="flex-1 text-xs font-bold text-red-500 bg-red-50 py-2.5 rounded-xl hover:bg-red-500 hover:text-white transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modern Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-[#0F4C5C]/20 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                <h3 className="text-2xl font-bold text-[#0F4C5C]">
                  {editId ? 'Update Category' : 'Create Category'}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-400 hover:text-red-500 shadow-sm transition-all">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-[#0F4C5C]">Category Name</label>
                  <input
                    type="text"
                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#2A9D8F] transition-all"
                    placeholder="e.g. Adventure, Relaxing, City Tours"
                    value={form.name}
                    onChange={e => setForm({...form, name: e.target.value})}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-[#0F4C5C]">Description</label>
                  <textarea
                    rows="3"
                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#2A9D8F] transition-all resize-none"
                    placeholder="What kind of tours belong here?"
                    value={form.description}
                    onChange={e => setForm({...form, description: e.target.value})}
                  />
                </div>

                <div className="space-y-4">
                  <label className="text-sm font-bold text-[#0F4C5C]">Cover Image</label>
                  <div className="flex gap-4">
                    <label className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-2xl p-6 hover:bg-gray-50 transition-all cursor-pointer group">
                      <Upload className="w-6 h-6 text-gray-300 group-hover:text-[#2A9D8F] mb-1" />
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Upload</span>
                      <input type="file" onChange={handleImageChange} className="hidden" accept="image/*" />
                    </label>
                    {imagePreview && (
                      <div className="w-24 h-24 rounded-2xl overflow-hidden border border-gray-100 shadow-sm relative shrink-0">
                        <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" />
                        <button type="button" onClick={() => setImagePreview(null)} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full">
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button type="submit" className="flex-1 py-4 bg-[#FF7F50] text-white rounded-2xl font-bold hover:bg-[#ff6a33] transition-all shadow-lg shadow-[#FF7F50]/20">
                    {editId ? 'Save Changes' : 'Create Category'}
                  </button>
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-8 py-4 bg-gray-100 text-gray-500 rounded-2xl font-bold hover:bg-gray-200 transition-all">
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

export default AddCategory;