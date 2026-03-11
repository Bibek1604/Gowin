import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit2, Trash2, X, Save, MapPin, Calendar, DollarSign, Star, Info, List, CheckCircle2, Clock } from "lucide-react";
import usePlaceStore from "../Store/PlaceStore";
import useDetailsStore from "../Store/DetailStore";
import toast, { Toaster } from "react-hot-toast";

function AddDetail() {
  const { places, fetchPlaces } = usePlaceStore();
  const { details, fetchDetails, addDetails, updateDetails, deleteDetails, isLoading } = useDetailsStore();
  
  const [selectedPlaceId, setSelectedPlaceId] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [form, setForm] = useState({
    title: "",
    description: "",
    rating: 5,
    best_time: "",
    highlights: [],
    itinerary: [],
    inclusions: []
  });

  const [newHighlight, setNewHighlight] = useState("");
  const [newInclusion, setNewInclusion] = useState("");
  const [newDay, setNewDay] = useState({ day: "", title: "", description: "" });

  useEffect(() => {
    fetchPlaces();
  }, [fetchPlaces]);

  useEffect(() => {
    if (selectedPlaceId) {
      fetchDetails(selectedPlaceId);
    }
  }, [selectedPlaceId, fetchDetails]);

  const openModal = (detail = null) => {
    if (!selectedPlaceId) {
      toast.error("Please select a place first");
      return;
    }
    if (detail) {
      setForm({
        title: detail.title || "",
        description: detail.description || "",
        rating: detail.rating || 5,
        best_time: detail.best_time || "",
        highlights: detail.highlights || [],
        itinerary: detail.itinerary || [],
        inclusions: detail.inclusions || []
      });
      setEditingId(detail.id);
    } else {
      setForm({
        title: "",
        description: "",
        rating: 5,
        best_time: "",
        highlights: [],
        itinerary: [],
        inclusions: []
      });
      setEditingId(null);
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description) {
      toast.error("Title and Description are required");
      return;
    }

    const payload = { ...form, place_id: selectedPlaceId };
    const res = editingId 
      ? await updateDetails(editingId, payload)
      : await addDetails(payload);

    if (res.success) {
      toast.success(editingId ? "Details updated" : "Details added");
      setIsModalOpen(false);
      fetchDetails(selectedPlaceId);
    } else {
      toast.error("Operation failed");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this detail block?")) {
      const res = await deleteDetails(id);
      if (res.success) toast.success("Deleted");
      else toast.error("Delete failed");
    }
  };

  // List Management
  const addHighlight = () => {
    if (newHighlight.trim()) {
      setForm(prev => ({ ...prev, highlights: [...prev.highlights, newHighlight.trim()] }));
      setNewHighlight("");
    }
  };

  const addInclusion = () => {
    if (newInclusion.trim()) {
      setForm(prev => ({ ...prev, inclusions: [...prev.inclusions, newInclusion.trim()] }));
      setNewInclusion("");
    }
  };

  const addItineraryDay = () => {
    if (newDay.day && newDay.title) {
      setForm(prev => ({ 
        ...prev, 
        itinerary: [...prev.itinerary, { ...newDay, day: parseInt(newDay.day) }].sort((a,b) => a.day - b.day)
      }));
      setNewDay({ day: "", title: "", description: "" });
    }
  };

  const removeItem = (type, index) => {
    setForm(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="p-12 font-sans min-h-screen">
      <Toaster position="top-right" />
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-3xl font-bold text-[#0F4C5C] tracking-tight">Expanded Details</h1>
            <p className="text-gray-500 text-lg mt-1">Add itinerary, highlights, and inclusions for specific destinations</p>
          </div>
        </div>

        {/* Place Selection Card */}
        <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-[0_4px_25px_rgb(0,0,0,0.02)] mb-10">
           <label className="block text-sm font-bold text-[#0F4C5C] mb-4 uppercase tracking-widest">Step 1: Select a Destination</label>
           <select 
             value={selectedPlaceId}
             onChange={(e) => setSelectedPlaceId(e.target.value)}
             className="w-full p-5 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#2A9D8F] text-[#0F4C5C] font-bold text-lg cursor-pointer"
           >
             <option value="">-- Choose a Place --</option>
             {places.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
           </select>
        </div>

        {selectedPlaceId && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
             <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-[#0F4C5C]">Saved Details for this Place</h3>
                <button 
                  onClick={() => openModal()}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white bg-[#0F4C5C] hover:bg-[#0a3845] transition-all shadow-lg shadow-[#0F4C5C]/10"
                >
                  <Plus className="w-5 h-5" />
                  New Detail Block
                </button>
             </div>

             {isLoading ? (
               <div className="space-y-4">
                  {[1,2].map(i => <div key={i} className="h-40 bg-white rounded-3xl animate-pulse" />)}
               </div>
             ) : details.length === 0 ? (
               <div className="text-center py-20 bg-white rounded-[2.5rem] border border-gray-100">
                  <Info className="w-16 h-16 text-gray-100 mx-auto mb-4" />
                  <p className="text-gray-400">No expanded details yet for this place.</p>
               </div>
             ) : (
               <div className="grid grid-cols-1 gap-6">
                  {details.map((detail) => (
                    <div key={detail.id} className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.02)] group">
                       <div className="flex justify-between items-start mb-6">
                          <div>
                             <h4 className="text-xl font-bold text-[#0F4C5C]">{detail.title}</h4>
                             <div className="flex items-center gap-1 mt-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star key={i} className={`w-3 h-3 ${i < detail.rating ? 'text-[#FF7F50] fill-[#FF7F50]' : 'text-gray-200'}`} />
                                ))}
                             </div>
                          </div>
                          <div className="flex gap-2">
                             <button onClick={() => openModal(detail)} className="p-3 rounded-xl bg-[#0F4C5C]/5 text-[#0F4C5C] hover:bg-[#0F4C5C] hover:text-white transition-all">
                                <Edit2 className="w-4 h-4" />
                             </button>
                             <button onClick={() => handleDelete(detail.id)} className="p-3 rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all">
                                <Trash2 className="w-4 h-4" />
                             </button>
                          </div>
                       </div>
                       
                       <p className="text-gray-500 mb-8 leading-relaxed max-w-3xl">{detail.description}</p>
                       
                       <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                          <div>
                             <h5 className="font-bold text-[#2A9D8F] text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4" /> Highlights
                             </h5>
                             <ul className="space-y-2">
                                {detail.highlights?.map((h, i) => <li key={i} className="text-sm text-gray-500 flex gap-2"><span>•</span> {h}</li>)}
                             </ul>
                          </div>
                          <div>
                             <h5 className="font-bold text-[#0F4C5C] text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                                <Clock className="w-4 h-4" /> Itinerary
                             </h5>
                             <ul className="space-y-3">
                                {detail.itinerary?.map((day, i) => (
                                  <li key={i} className="text-sm">
                                     <span className="font-bold text-[#0F4C5C]">Day {day.day}:</span>
                                     <span className="text-gray-500 ml-2">{day.title}</span>
                                  </li>
                                ))}
                             </ul>
                          </div>
                          <div>
                             <h5 className="font-bold text-[#FF7F50] text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                                <MapPin className="w-4 h-4" /> Inclusions
                             </h5>
                             <ul className="space-y-2">
                                {detail.inclusions?.map((inc, i) => <li key={i} className="text-sm text-gray-500 flex gap-2"><span>✓</span> {inc}</li>)}
                             </ul>
                          </div>
                       </div>
                    </div>
                  ))}
               </div>
             )}
          </motion.div>
        )}

      </div>

      {/* Detail Modal */}
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
              className="relative w-full max-w-4xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                <h3 className="text-2xl font-bold text-[#0F4C5C]">
                  {editingId ? 'Edit Detail Block' : 'New Detail Block'}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-400 hover:text-red-500 shadow-sm transition-all">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 overflow-y-auto custom-scrollbar flex-1 space-y-10">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <label className="text-sm font-bold text-[#0F4C5C] mb-2 block uppercase">Block Title</label>
                      <input 
                        type="text" 
                        value={form.title}
                        onChange={e => setForm({...form, title: e.target.value})}
                        className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#2A9D8F] outline-none"
                        placeholder="e.g. Overview & Highlights"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-bold text-[#0F4C5C] mb-2 block uppercase">Description</label>
                      <textarea 
                        rows="4"
                        value={form.description}
                        onChange={e => setForm({...form, description: e.target.value})}
                        className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#2A9D8F] outline-none resize-none"
                        placeholder="Main text description for the detail page..."
                      />
                    </div>
                    <div className="flex gap-8">
                       <div className="flex-1">
                          <label className="text-sm font-bold text-[#0F4C5C] mb-2 block uppercase">Rating (1-5)</label>
                          <input 
                            type="number" min="1" max="5"
                            value={form.rating}
                            onChange={e => setForm({...form, rating: parseInt(e.target.value)})}
                            className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none"
                          />
                       </div>
                       <div className="flex-1">
                          <label className="text-sm font-bold text-[#0F4C5C] mb-2 block uppercase">Best Time</label>
                          <input 
                            type="text"
                            value={form.best_time}
                            onChange={e => setForm({...form, best_time: e.target.value})}
                            className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none"
                            placeholder="e.g. Sep - Nov"
                          />
                       </div>
                    </div>
                  </div>

                  {/* Highlights & Inclusions */}
                  <div className="space-y-6">
                     <div>
                        <label className="text-sm font-bold text-[#0F4C5C] mb-2 block uppercase">Highlights</label>
                        <div className="flex gap-2 mb-4">
                           <input 
                             type="text" value={newHighlight} 
                             onChange={e => setNewHighlight(e.target.value)}
                             className="flex-1 p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none"
                             placeholder="Add highlight..."
                           />
                           <button type="button" onClick={addHighlight} className="p-3 bg-[#2A9D8F] text-white rounded-xl hover:bg-[#238b7e] shadow-lg shadow-[#2A9D8F]/10">
                              <Plus className="w-5 h-5" />
                           </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                           {form.highlights.map((h, i) => (
                             <span key={i} className="bg-[#2A9D8F]/10 text-[#2A9D8F] px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 group">
                                {h}
                                <X onClick={() => removeItem('highlights', i)} className="w-3 h-3 cursor-pointer hover:text-red-500" />
                             </span>
                           ))}
                        </div>
                     </div>

                     <div>
                        <label className="text-sm font-bold text-[#0F4C5C] mb-2 block uppercase">Inclusions</label>
                        <div className="flex gap-2 mb-4">
                           <input 
                             type="text" value={newInclusion} 
                             onChange={e => setNewInclusion(e.target.value)}
                             className="flex-1 p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none"
                             placeholder="Add inclusion..."
                           />
                           <button type="button" onClick={addInclusion} className="p-3 bg-[#FF7F50] text-white rounded-xl hover:bg-[#ff6a33] shadow-lg shadow-[#FF7F50]/10">
                              <Plus className="w-5 h-5" />
                           </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                           {form.inclusions.map((inc, i) => (
                             <span key={i} className="bg-[#FF7F50]/10 text-[#FF7F50] px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-2">
                                {inc}
                                <X onClick={() => removeItem('inclusions', i)} className="w-3 h-3 cursor-pointer hover:text-red-500" />
                             </span>
                           ))}
                        </div>
                     </div>
                  </div>
                </div>

                {/* Itinerary */}
                <div className="pt-8 border-t border-gray-50">
                   <label className="text-sm font-bold text-[#0F4C5C] mb-6 block uppercase tracking-widest text-center">Comprehensive Itinerary</label>
                   <div className="bg-gray-50/50 rounded-3xl p-8 border border-gray-100">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                         <input 
                           type="number" placeholder="Day (e.g. 1)" 
                           value={newDay.day} onChange={e => setNewDay({...newDay, day: e.target.value})}
                           className="p-4 bg-white border border-gray-100 rounded-2xl outline-none"
                         />
                         <input 
                           type="text" placeholder="Day Title" 
                           value={newDay.title} onChange={e => setNewDay({...newDay, title: e.target.value})}
                           className="md:col-span-2 p-4 bg-white border border-gray-100 rounded-2xl outline-none"
                         />
                         <button type="button" onClick={addItineraryDay} className="bg-[#0F4C5C] text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-[#0a3845] transition-all">
                            <Plus className="w-5 h-5" /> Add Day
                         </button>
                         <textarea 
                           className="md:col-span-4 p-4 bg-white border border-gray-100 rounded-2xl outline-none resize-none mt-2"
                           placeholder="What happens on this day? (Optional)"
                           value={newDay.description} onChange={e => setNewDay({...newDay, description: e.target.value})}
                         />
                      </div>

                      <div className="space-y-3">
                         {form.itinerary.map((day, i) => (
                           <div key={i} className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center justify-between shadow-sm">
                              <div className="flex items-center gap-4">
                                 <div className="w-10 h-10 rounded-xl bg-[#0F4C5C] text-white flex items-center justify-center font-bold text-xs uppercase">D{day.day}</div>
                                 <div>
                                    <p className="font-bold text-[#0F4C5C]">{day.title}</p>
                                    <p className="text-xs text-gray-400 truncate max-w-sm">{day.description}</p>
                                 </div>
                              </div>
                              <X onClick={() => removeItem('itinerary', i)} className="w-5 h-5 text-gray-300 hover:text-red-500 cursor-pointer" />
                           </div>
                         ))}
                      </div>
                   </div>
                </div>

                <div className="flex gap-4 pt-4 sticky bottom-0 bg-white">
                  <button type="submit" className="flex-1 py-5 bg-[#FF7F50] text-white rounded-2xl font-bold hover:bg-[#ff6a33] transition-all shadow-xl shadow-[#FF7F50]/20 flex items-center justify-center gap-2">
                     <Save className="w-5 h-5" />
                     {editingId ? 'Update Detail block' : 'Save Details'}
                  </button>
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-12 py-5 bg-gray-100 text-gray-500 rounded-2xl font-bold hover:bg-gray-200 transition-all">
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
}

export default AddDetail;