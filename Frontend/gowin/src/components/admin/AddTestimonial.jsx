import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Plus, Edit2, Trash2, X, Upload, CheckCircle, Clock, User, Filter } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import { supabase } from '../../supabaseClient';

const AddTestimonial = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [filter, setFilter] = useState('all'); // all, approved, pending

  const [form, setForm] = useState({
    user_name: '',
    designation: '',
    content: '',
    rating: 5,
    image_url: '',
    is_approved: false
  });

  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Failed to fetch testimonials');
    } else {
      setTestimonials(data || []);
    }
    setIsLoading(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setForm(prev => ({ ...prev, image_url: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const openModal = (testimonial = null) => {
    if (testimonial) {
      setForm({
        user_name: testimonial.user_name || '',
        designation: testimonial.designation || '',
        content: testimonial.content || '',
        rating: testimonial.rating || 5,
        image_url: testimonial.image_url || '',
        is_approved: testimonial.is_approved || false
      });
      setImagePreview(testimonial.image_url || null);
      setEditingId(testimonial.id);
    } else {
      setForm({
        user_name: '',
        designation: '',
        content: '',
        rating: 5,
        image_url: '',
        is_approved: true // Default to approved when admin adds
      });
      setImagePreview(null);
      setEditingId(null);
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.user_name || !form.content) {
      toast.error('Name and Content are required');
      return;
    }

    if (editingId) {
      const { error } = await supabase
        .from('testimonials')
        .update(form)
        .eq('id', editingId);

      if (error) toast.error('Update failed');
      else {
        toast.success('Testimonial updated');
        setIsModalOpen(false);
        fetchTestimonials();
      }
    } else {
      const { error } = await supabase
        .from('testimonials')
        .insert([form]);

      if (error) toast.error('Creation failed');
      else {
        toast.success('Testimonial added');
        setIsModalOpen(false);
        fetchTestimonials();
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this testimonial?')) {
      const { error } = await supabase
        .from('testimonials')
        .delete()
        .eq('id', id);

      if (error) toast.error('Delete failed');
      else {
        toast.success('Deleted successfully');
        fetchTestimonials();
      }
    }
  };

  const toggleApproval = async (testimonial) => {
    const { error } = await supabase
      .from('testimonials')
      .update({ is_approved: !testimonial.is_approved })
      .eq('id', testimonial.id);

    if (error) toast.error('Status update failed');
    else {
      toast.success(testimonial.is_approved ? 'Unapproved' : 'Approved');
      fetchTestimonials();
    }
  };

  const filteredTestimonials = testimonials.filter(t => {
    if (filter === 'approved') return t.is_approved;
    if (filter === 'pending') return !t.is_approved;
    return true;
  });

  return (
    <div className="p-12 font-sans min-h-screen">
      <Toaster position="top-right" />
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-3xl font-bold text-[#0F4C5C] tracking-tight">Testimonials</h1>
            <p className="text-gray-500 text-lg mt-1">Manage customer reviews and feedback</p>
          </div>
          <button
            onClick={() => openModal()}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white bg-[#0F4C5C] hover:bg-[#0a3845] transition-all shadow-lg shadow-[#0F4C5C]/10"
          >
            <Plus className="w-5 h-5" />
            Add Testimonial
          </button>
        </div>

        {/* Filter Bar */}
        <div className="flex gap-4 mb-10 overflow-x-auto pb-2 scrollbar-none">
           {[
             { id: 'all', label: 'All Reviews', icon: <Filter className="w-4 h-4" /> },
             { id: 'approved', label: 'Approved', icon: <CheckCircle className="w-4 h-4" /> },
             { id: 'pending', label: 'Pending', icon: <Clock className="w-4 h-4" /> }
           ].map((btn) => (
             <button
               key={btn.id}
               onClick={() => setFilter(btn.id)}
               className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm transition-all whitespace-nowrap shadow-sm border ${
                 filter === btn.id 
                 ? 'bg-[#0F4C5C] text-white border-[#0F4C5C] shadow-[#0F4C5C]/20' 
                 : 'bg-white text-gray-500 border-gray-100 hover:border-[#0F4C5C]/30'
               }`}
             >
               {btn.icon}
               {btn.label}
             </button>
           ))}
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1,2,3].map(i => <div key={i} className="h-64 bg-white rounded-[2rem] animate-pulse border border-gray-100" />)}
          </div>
        ) : filteredTestimonials.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-[2rem] border border-gray-100">
             <Star className="w-16 h-16 text-gray-100 mx-auto mb-4" />
             <p className="text-gray-400">No testimonials found for this filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTestimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-white rounded-[2rem] border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] p-8 flex flex-col hover:-translate-y-1 transition-all duration-300">
                <div className="flex justify-between items-start mb-6">
                   <div className="flex items-center gap-4">
                      {testimonial.image_url ? (
                        <img src={testimonial.image_url} className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md" alt={testimonial.user_name} />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-[#0F4C5C] font-bold border border-gray-100">
                           {testimonial.user_name[0]}
                        </div>
                      )}
                      <div>
                         <h4 className="font-bold text-[#0F4C5C] leading-tight">{testimonial.user_name}</h4>
                         <p className="text-xs text-gray-400 font-medium">{testimonial.designation || 'Traveler'}</p>
                      </div>
                   </div>
                   <div className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${testimonial.is_approved ? 'bg-[#FF7F50]/10 text-[#FF7F50]' : 'bg-[#FF7F50]/10 text-[#FF7F50]'}`}>
                      {testimonial.is_approved ? 'Approved' : 'Pending'}
                   </div>
                </div>

                <div className="flex gap-1 mb-4">
                   {[...Array(5)].map((_, i) => (
                     <Star key={i} className={`w-3 h-3 ${i < testimonial.rating ? 'text-[#FF7F50] fill-[#FF7F50]' : 'text-gray-200'}`} />
                   ))}
                </div>

                <p className="text-gray-500 text-sm italic leading-relaxed flex-1 mb-8">
                  "{testimonial.content}"
                </p>

                <div className="flex gap-2 pt-6 border-t border-gray-50">
                   <button 
                    onClick={() => toggleApproval(testimonial)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all ${
                      testimonial.is_approved 
                      ? 'bg-gray-50 text-gray-400 hover:bg-orange-50 hover:text-[#FF7F50]' 
                      : 'bg-[#FF7F50]/10 text-[#FF7F50] hover:bg-[#FF7F50] hover:text-white shadow-sm'
                    }`}
                   >
                     {testimonial.is_approved ? <X className="w-3.5 h-3.5" /> : <CheckCircle className="w-3.5 h-3.5" />}
                     {testimonial.is_approved ? 'Unapprove' : 'Approve'}
                   </button>
                   <div className="flex gap-2">
                      <button onClick={() => openModal(testimonial)} className="p-2.5 rounded-xl bg-[#0F4C5C]/5 text-[#0F4C5C] hover:bg-[#0F4C5C] hover:text-white transition-all shadow-sm">
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => handleDelete(testimonial.id)} className="p-2.5 rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                   </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-[#0F4C5C]/20 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                <h3 className="text-2xl font-bold text-[#0F4C5C]">
                  {editingId ? 'Edit Testimonial' : 'New Testimonial'}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-400 hover:text-red-500 shadow-sm transition-all">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                 <div className="flex gap-6 items-center">
                    <div className="shrink-0">
                       <label className="w-20 h-20 rounded-full bg-gray-50 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-all overflow-hidden relative group">
                          {imagePreview ? (
                            <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" />
                          ) : (
                            <Upload className="w-6 h-6 text-gray-300 group-hover:text-[#FF7F50]" />
                          )}
                          <input type="file" onChange={handleImageChange} className="hidden" accept="image/*" />
                       </label>
                    </div>
                    <div className="flex-1 space-y-4">
                       <div>
                          <label className="text-xs font-bold text-[#0F4C5C] uppercase tracking-widest mb-1 block">Full Name</label>
                          <input 
                            type="text" value={form.user_name}
                            onChange={e => setForm({...form, user_name: e.target.value})}
                            className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none"
                            placeholder="e.g. John Doe"
                          />
                       </div>
                       <div>
                          <label className="text-xs font-bold text-[#0F4C5C] uppercase tracking-widest mb-1 block">Designation</label>
                          <input 
                            type="text" value={form.designation}
                            onChange={e => setForm({...form, designation: e.target.value})}
                            className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none"
                            placeholder="e.g. Frequent Traveler"
                          />
                       </div>
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-6">
                    <div>
                       <label className="text-xs font-bold text-[#0F4C5C] uppercase tracking-widest mb-1 block">Rating</label>
                       <select 
                         value={form.rating} onChange={e => setForm({...form, rating: parseInt(e.target.value)})}
                         className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none"
                       >
                          {[5,4,3,2,1].map(r => <option key={r} value={r}>{r} Stars</option>)}
                       </select>
                    </div>
                    <div className="flex items-center gap-2 pt-6">
                       <input 
                        type="checkbox" checked={form.is_approved}
                        onChange={e => setForm({...form, is_approved: e.target.checked})}
                        className="w-5 h-5 accent-[#FF7F50]"
                       />
                       <span className="text-sm font-bold text-[#0F4C5C]">Visible Publicly</span>
                    </div>
                 </div>

                 <div>
                    <label className="text-xs font-bold text-[#0F4C5C] uppercase tracking-widest mb-1 block">Feedback Content</label>
                    <textarea 
                      rows="4" value={form.content}
                      onChange={e => setForm({...form, content: e.target.value})}
                      className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl md:rounded-[2.5rem] outline-none resize-none"
                      placeholder="Write the customer's experience..."
                    />
                 </div>

                 <div className="flex gap-4 pt-4">
                    <button type="submit" className="flex-1 py-4 bg-[#FF7F50] text-white rounded-2xl font-bold hover:bg-[#ff6a33] transition-all shadow-xl shadow-[#FF7F50]/20">
                       {editingId ? 'Save Changes' : 'Publish Review'}
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

export default AddTestimonial;
