import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Clock, DollarSign, Plus, Edit2, Trash2, Search, Upload, X, Globe, Tag, Sparkles, Filter, MoreHorizontal } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import usePlaceStore from '../Store/PlaceStore';
import useCategoryStore from '../Store/CategoryStore';

const ManageDestinations = () => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    duration: '',
    location: '',
    category_id: '',
    destination_type: 'International',
    images: []
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('All');

  const { places, addPlace, updatePlace, deletePlace, fetchPlaces, isLoading } = usePlaceStore();
  const { categories, fetchCategories } = useCategoryStore();

  useEffect(() => {
    fetchPlaces();
    fetchCategories();
  }, [fetchPlaces, fetchCategories]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setForm(prev => ({ ...prev, images: [reader.result] }));
      };
      reader.readAsDataURL(file);
    }
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
        images: place.images || []
      });
      setImagePreview(place.images?.[0] || null);
      setEditingId(place.id);
    } else {
      setForm({ title: '', description: '', price: '', duration: '', location: '', category_id: '', destination_type: 'International', images: [] });
      setImagePreview(null);
      setEditingId(null);
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.category_id) {
      toast.error('Name and Category are essential');
      return;
    }

    const res = editingId 
      ? await updatePlace(editingId, form)
      : await addPlace(form);

    if (res.success) {
      toast.success(editingId ? 'Odyssey Updated' : 'Destination Published');
      setIsModalOpen(false);
      fetchPlaces();
    } else {
      toast.error('Transmission Error');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Strike this from the records forever?')) {
      const res = await deletePlace(id);
      if (res.success) toast.success('Expunged Successfully');
      else toast.error('Annihilation Failed');
    }
  };

  const filteredPlaces = places.filter(p => {
    const matchesSearch = p.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.location?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchedCategory = activeTab === 'All' || p.categories?.name === activeTab;
    return matchesSearch && matchedCategory;
  });

  return (
    <div className="p-12 min-h-screen bg-[#F8FAFB] font-sans">
      <Toaster position="top-right" />
      <div className="max-w-7xl mx-auto">
        
        {/* Superior Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
           <div className="space-y-3">
             <div className="inline-flex items-center gap-2 px-6 py-2 bg-[#0F4C5C]/5 text-[#0F4C5C] rounded-full text-[10px] font-bold uppercase tracking-[0.3em] mb-4 border border-[#0F4C5C]/10 shadow-sm">
                <Globe className="w-4 h-4" /> Global Portfolio
             </div>
             <h1 className="text-6xl font-black text-[#0F4C5C] tracking-tighter leading-none">Curation <span className="text-[#FF7F50]">Lab.</span></h1>
             <p className="text-gray-400 font-medium text-lg leading-tight">Meticulously manage the world's most sought-after travel experiences.</p>
           </div>
           
           <div className="flex gap-4 w-full md:w-auto">
              <button
                onClick={() => openModal()}
                className="flex-1 md:flex-none flex items-center justify-center gap-3 px-10 py-5 rounded-[2.5rem] font-bold text-white bg-[#0F4C5C] hover:bg-[#0a3845] transition-all shadow-2xl shadow-[#0F4C5C]/20 active:scale-95"
              >
                <Plus className="w-6 h-6" /> Create Destination
              </button>
           </div>
        </div>

        {/* Curation Toolbar */}
        <div className="bg-white rounded-[3.5rem] p-4 shadow-[0_20px_60px_rgba(0,0,0,0.02)] border border-gray-100 flex flex-col lg:flex-row gap-6 mb-12 items-center">
           <div className="relative flex-1 group w-full">
              <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-gray-300 w-6 h-6 group-focus-within:text-[#FF7F50] transition-colors" />
              <input 
                type="text" 
                placeholder="Find a destination by title, region or heritage..." 
                className="w-full pl-20 pr-10 py-6 bg-gray-50/50 border-transparent rounded-[2.5rem] focus:outline-none focus:bg-white focus:ring-4 focus:ring-[#FF7F50]/5 transition-all font-medium text-[#0F4C5C] text-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
           </div>
           
           <div className="flex gap-3 overflow-x-auto w-full lg:w-auto p-2 no-scrollbar">
              {['All', ...categories.map(c => c.name)].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-8 py-5 rounded-[2rem] font-black text-[10px] uppercase tracking-[0.3em] transition-all whitespace-nowrap
                    ${activeTab === tab 
                      ? 'bg-[#FF7F50] text-white shadow-xl shadow-[#FF7F50]/20' 
                      : 'bg-white text-gray-400 hover:text-[#0F4C5C] border border-gray-50'
                    }`}
                >
                  {tab}
                </button>
              ))}
           </div>
        </div>

        {/* Global Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
            {[1,2,3,4,5,6].map(i => <div key={i} className="h-[450px] bg-white rounded-[3.5rem] animate-pulse border border-gray-50 shadow-sm" />)}
          </div>
        ) : filteredPlaces.length === 0 ? (
          <div className="py-40 text-center bg-white rounded-[5rem] border border-gray-100 shadow-xl max-w-4xl mx-auto">
             <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-10">
                <Search className="w-10 h-10 text-gray-200" />
             </div>
             <h3 className="text-3xl font-extrabold text-[#0F4C5C] mb-4">No Odysseys Found.</h3>
             <p className="text-gray-400 font-medium">Try refining your curation or search parameters to reveal results.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
            <AnimatePresence>
              {filteredPlaces.map((place) => (
                <motion.div 
                  key={place.id}
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-white rounded-[3.5rem] border border-gray-50 shadow-[0_15px_60px_rgba(0,0,0,0.03)] overflow-hidden hover:shadow-2xl hover:-translate-y-4 transition-all duration-700 group flex flex-col relative"
                >
                  <div className="relative h-[250px] overflow-hidden">
                    <img 
                      src={place.images?.[0] || 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80'} 
                      className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-[3s]" 
                      alt={place.title}
                    />
                    <div className="absolute top-6 left-6 px-5 py-2.5 bg-white/90 backdrop-blur-xl rounded-2xl font-black text-[#FF7F50] text-xs shadow-xl flex items-center gap-1.5">
                       <DollarSign className="w-3.5 h-3.5" /> {place.price}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  </div>
                  
                  <div className="p-10 flex-1 flex flex-col relative">
                    <div className="mb-4">
                       <span className="text-[10px] uppercase font-black tracking-[0.3em] text-[#FF7F50] mb-2 block">
                         {(place.categories?.name || 'Venture').toUpperCase()}
                       </span>
                       <h3 className="font-black text-[#0F4C5C] text-2xl tracking-tighter leading-tight group-hover:text-[#FF7F50] transition-colors line-clamp-2">
                         {place.title}
                       </h3>
                    </div>
                    
                    <div className="flex items-center gap-3 text-gray-400 font-bold text-xs mb-8">
                      <MapPin className="w-4 h-4 text-gray-300" />
                      {place.location}
                    </div>

                    <p className="text-gray-400 font-medium text-sm leading-relaxed mb-10 line-clamp-3">
                      {place.description}
                    </p>

                    <div className="mt-auto pt-8 border-t border-gray-50 flex items-center justify-between">
                       <div className="flex items-center gap-2.5 text-[#0F4C5C]/40 text-[10px] font-black uppercase tracking-widest">
                          <Clock className="w-4 h-4 text-[#FF7F50]" /> {place.duration}
                       </div>
                       <div className="flex gap-2">
                          <button 
                            onClick={(e) => { e.stopPropagation(); openModal(place); }}
                            className="w-12 h-12 rounded-2xl bg-[#0F4C5C]/5 text-[#0F4C5C] hover:bg-[#0F4C5C] hover:text-white transition-all shadow-sm flex items-center justify-center"
                          >
                            <Edit2 className="w-5 h-5" />
                          </button>
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleDelete(place.id); }}
                            className="w-12 h-12 rounded-2xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm flex items-center justify-center"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                       </div>
                    </div>
                  </div>
                  
                  {/* Premium Tag Overlay */}
                  {place.id % 3 === 0 && (
                     <div className="absolute top-4 right-[-40px] bg-[#FF7F50] text-white px-12 py-2 text-[8px] font-black uppercase tracking-[0.4em] rotate-45 shadow-xl">
                        Featured
                     </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Narrative Modal Experience */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-[#0F4C5C]/30 backdrop-blur-xl">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 100 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 100 }}
              className="relative w-full max-w-4xl bg-white rounded-[4rem] shadow-[0_50px_100px_rgba(0,0,0,0.3)] overflow-hidden border border-white"
            >
              <div className="p-12 border-b border-gray-50 flex justify-between items-center bg-[#F8FAFB]/50">
                <div>
                   <h3 className="text-4xl font-black text-[#0F4C5C] tracking-tighter">
                     {editingId ? 'Refine Odyssey' : 'Publish Discovery'}
                   </h3>
                   <p className="text-gray-400 font-medium mt-1">Populate the global collection with world-class details.</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="w-16 h-16 rounded-[1.5rem] bg-white text-gray-400 hover:text-red-500 shadow-xl flex items-center justify-center transition-all">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-12 max-h-[65vh] overflow-y-auto premium-scrollbar grid grid-cols-1 md:grid-cols-12 gap-10">
                <div className="md:col-span-12 space-y-3">
                   <label className="text-[10px] font-black text-[#0F4C5C] uppercase tracking-[0.4em] pl-2">Signature Title</label>
                   <input
                     type="text"
                     className="w-full p-6 bg-gray-50/50 border border-gray-100 rounded-[1.5rem] focus:outline-none focus:bg-white focus:ring-4 focus:ring-[#FF7F50]/10 transition-all font-black text-2xl text-[#0F4C5C]"
                     placeholder="The Grand Himalayan Odyssey"
                     value={form.title}
                     onChange={e => setForm({...form, title: e.target.value})}
                     required
                   />
                </div>

                <div className="md:col-span-6 space-y-3">
                   <label className="text-[10px] font-black text-[#0F4C5C] uppercase tracking-[0.4em] pl-2">Venture Category</label>
                   <div className="relative">
                      <select
                        className="w-full p-5 bg-gray-50/50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#FF7F50]/10 transition-all font-bold appearance-none cursor-pointer"
                        value={form.category_id}
                        onChange={e => setForm({...form, category_id: e.target.value})}
                        required
                      >
                        <option value="">Map to Category...</option>
                        {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                      </select>
                      <Tag className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300 w-5 h-5 pointer-events-none" />
                   </div>
                </div>

                <div className="md:col-span-6 space-y-3">
                   <label className="text-[10px] font-black text-[#0F4C5C] uppercase tracking-[0.4em] pl-2">Destination Scale</label>
                   <div className="relative">
                      <select
                        className="w-full p-5 bg-gray-50/50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#FF7F50]/10 transition-all font-bold appearance-none cursor-pointer"
                        value={form.destination_type}
                        onChange={e => setForm({...form, destination_type: e.target.value})}
                      >
                        <option value="International">International</option>
                        <option value="National">National</option>
                      </select>
                      <Globe className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300 w-5 h-5 pointer-events-none" />
                   </div>
                </div>

                <div className="md:col-span-6 space-y-3">
                   <label className="text-[10px] font-black text-[#0F4C5C] uppercase tracking-[0.4em] pl-2">Pricing Structure ($)</label>
                   <div className="relative">
                      <input
                        type="text"
                        className="w-full p-5 pl-12 bg-gray-50/50 border border-gray-100 rounded-2xl focus:outline-none focus:bg-white transition-all font-bold text-[#FF7F50]"
                        placeholder="2,199"
                        value={form.price}
                        onChange={e => setForm({...form, price: e.target.value})}
                      />
                      <DollarSign className="absolute left-5 top-1/2 -translate-y-1/2 text-[#FF7F50] w-5 h-5" />
                   </div>
                </div>

                <div className="md:col-span-12 space-y-3">
                   <label className="text-[10px] font-black text-[#0F4C5C] uppercase tracking-[0.4em] pl-2">Narrative Summary</label>
                   <textarea
                     rows="5"
                     className="w-full p-6 bg-gray-50/50 border border-gray-100 rounded-[2rem] focus:outline-none focus:bg-white transition-all font-medium text-gray-600 resize-none leading-relaxed"
                     placeholder="Tell the story of this journey..."
                     value={form.description}
                     onChange={e => setForm({...form, description: e.target.value})}
                   />
                </div>

                <div className="md:col-span-6 space-y-3">
                   <label className="text-[10px] font-black text-[#0F4C5C] uppercase tracking-[0.4em] pl-2">Duration / Scale</label>
                   <div className="relative">
                      <input
                        type="text"
                        className="w-full p-5 pl-12 bg-gray-50/50 border border-gray-100 rounded-2xl focus:outline-none transition-all font-bold"
                        placeholder="7 Days / 6 Nights"
                        value={form.duration}
                        onChange={e => setForm({...form, duration: e.target.value})}
                      />
                      <Clock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 w-5 h-5" />
                   </div>
                </div>

                <div className="md:col-span-6 space-y-3">
                   <label className="text-[10px] font-black text-[#0F4C5C] uppercase tracking-[0.4em] pl-2">Geographical Focus</label>
                   <div className="relative">
                      <input
                        type="text"
                        className="w-full p-5 pl-12 bg-gray-50/50 border border-gray-100 rounded-2xl focus:outline-none transition-all font-bold"
                        placeholder="High Altitude Nepal"
                        value={form.location}
                        onChange={e => setForm({...form, location: e.target.value})}
                      />
                      <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-[#FF7F50] w-5 h-5" />
                   </div>
                </div>

                <div className="md:col-span-12 pt-6">
                   <div className="flex flex-col md:flex-row gap-6 items-center">
                      <div className="flex-1 w-full">
                         <label className="flex flex-col items-center justify-center p-12 border-4 border-dashed border-[#0F4C5C]/5 hover:border-[#FF7F50]/20 rounded-[3rem] bg-[#F8FAFB] hover:bg-white transition-all cursor-pointer group group">
                            <Upload className="w-12 h-12 text-gray-300 group-hover:text-[#FF7F50] mb-4 transform group-hover:-translate-y-2 transition-transform" />
                            <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Master Cover Artifact</span>
                            <input type="file" onChange={handleImageChange} className="hidden" accept="image/*" />
                         </label>
                      </div>
                      <AnimatePresence>
                         {imagePreview && (
                           <motion.div initial={{ scale: 0, x: 20 }} animate={{ scale: 1, x: 0 }} className="w-48 h-48 rounded-[2.5rem] overflow-hidden border-4 border-white shadow-2xl relative shrink-0">
                              <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" />
                              <button type="button" onClick={() => setImagePreview(null)} className="absolute top-3 right-3 bg-red-500 text-white p-2 rounded-xl shadow-lg hover:scale-110 transition-transform">
                                 <X className="w-4 h-4" />
                              </button>
                           </motion.div>
                         )}
                      </AnimatePresence>
                   </div>
                </div>

                <div className="md:col-span-12 flex gap-6 pt-10">
                  <button type="submit" className="flex-1 py-6 bg-[#FF7F50] text-white rounded-[2.5rem] font-black text-xl uppercase tracking-widest hover:bg-[#e56a42] transition-all shadow-xl shadow-[#FF7F50]/20 active:scale-95">
                     {editingId ? 'Refine Odyssey' : 'Authorize Discovery'}
                  </button>
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-12 py-6 bg-white text-[#0F4C5C] border border-gray-100 rounded-[2.5rem] font-black text-xl uppercase tracking-widest hover:bg-gray-50 transition-all shadow-sm">
                     Halt
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