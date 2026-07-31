import React, { useState, useEffect, useRef } from "react";
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
  const [isSaving, setIsSaving] = useState(false);
  const submittingRef = useRef(false);

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
    if (submittingRef.current) return;
    if (!form.title || !form.description) {
      toast.error("Title and Description are required");
      return;
    }

    submittingRef.current = true;
    setIsSaving(true);
    try {
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
    } finally {
      submittingRef.current = false;
      setIsSaving(false);
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
    <div className="p-4 sm:p-6 lg:p-8 font-sans min-h-screen">
      <Toaster position="top-right" />
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#1E3A8A] tracking-tight">Expanded Details</h1>
          <p className="text-gray-500 text-sm mt-1">Add itinerary, highlights, and inclusions for specific destinations</p>
        </div>

        {/* Place Selection */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm mb-6 flex flex-col sm:flex-row sm:items-center gap-3">
           <label className="text-xs font-bold text-[#1E3A8A] uppercase tracking-widest flex-shrink-0 flex items-center gap-2">
             <MapPin className="w-4 h-4 text-[#10B981]" /> Destination
           </label>
           <select
             value={selectedPlaceId}
             onChange={(e) => setSelectedPlaceId(e.target.value)}
             className="flex-1 px-3 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#10B981]/40 text-[#1E3A8A] font-semibold text-sm cursor-pointer"
           >
             <option value="">-- Choose a Place --</option>
             {places.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
           </select>
           <span className="text-xs text-gray-400 flex-shrink-0">{places.length} places</span>
        </div>

        {!selectedPlaceId && (
          <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200">
            <Info className="w-10 h-10 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">Select a destination above to view and manage its detail blocks.</p>
          </div>
        )}

        {selectedPlaceId && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
             <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-[#1E3A8A]">Saved Details for this Place</h3>
                <button 
                  onClick={() => openModal()}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm rounded-xl font-bold text-white bg-[#1E3A8A] hover:bg-[#172554] transition-all shadow-md"
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
                             <h4 className="text-xl font-bold text-[#1E3A8A]">{detail.title}</h4>
                             <div className="flex items-center gap-1 mt-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star key={i} className={`w-3 h-3 ${i < detail.rating ? 'text-[#10B981] fill-[#10B981]' : 'text-gray-200'}`} />
                                ))}
                             </div>
                          </div>
                          <div className="flex gap-2">
                             <button onClick={() => openModal(detail)} className="p-3 rounded-xl bg-[#1E3A8A]/5 text-[#1E3A8A] hover:bg-[#1E3A8A] hover:text-white transition-all">
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
                             <h5 className="font-bold text-[#10B981] text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4" /> Highlights
                             </h5>
                             <ul className="space-y-2">
                                {detail.highlights?.map((h, i) => <li key={i} className="text-sm text-gray-500 flex gap-2"><span>•</span> {h}</li>)}
                             </ul>
                          </div>
                          <div>
                             <h5 className="font-bold text-[#1E3A8A] text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                                <Clock className="w-4 h-4" /> Itinerary
                             </h5>
                             <ul className="space-y-3">
                                {detail.itinerary?.map((day, i) => (
                                  <li key={i} className="text-sm">
                                     <span className="font-bold text-[#1E3A8A]">Day {day.day}:</span>
                                     <span className="text-gray-500 ml-2">{day.title}</span>
                                  </li>
                                ))}
                             </ul>
                          </div>
                          <div>
                             <h5 className="font-bold text-[#10B981] text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
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
              className="absolute inset-0 bg-[#1E3A8A]/20 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh]"
            >
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-lg font-bold text-[#1E3A8A]">
                  {editingId ? 'Edit Detail Block' : 'New Detail Block'}
                </h3>
                <button onClick={() => setIsModalOpen(false)} aria-label="Close dialog" className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <label className="text-xs font-bold text-[#1E3A8A] mb-1.5 block uppercase tracking-wide">Block Title</label>
                      <input 
                        type="text" 
                        value={form.title}
                        onChange={e => setForm({...form, title: e.target.value})}
                        className="w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#10B981]/40 outline-none"
                        placeholder="e.g. Overview & Highlights"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-[#1E3A8A] mb-1.5 block uppercase tracking-wide">Description</label>
                      <textarea 
                        rows="4"
                        value={form.description}
                        onChange={e => setForm({...form, description: e.target.value})}
                        className="w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#10B981]/40 outline-none resize-none"
                        placeholder="Main text description for the detail page..."
                      />
                    </div>
                    <div className="flex gap-8">
                       <div className="flex-1">
                          <label className="text-xs font-bold text-[#1E3A8A] mb-1.5 block uppercase tracking-wide">Rating (1-5)</label>
                          <input 
                            type="number" min="1" max="5"
                            value={form.rating}
                            onChange={e => setForm({...form, rating: parseInt(e.target.value)})}
                            className="w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-100 rounded-xl outline-none"
                          />
                       </div>
                       <div className="flex-1">
                          <label className="text-xs font-bold text-[#1E3A8A] mb-1.5 block uppercase tracking-wide">Best Time</label>
                          <input 
                            type="text"
                            value={form.best_time}
                            onChange={e => setForm({...form, best_time: e.target.value})}
                            className="w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-100 rounded-xl outline-none"
                            placeholder="e.g. Sep - Nov"
                          />
                       </div>
                    </div>
                  </div>

                  {/* Highlights & Inclusions */}
                  <div className="space-y-6">
                     <div>
                        <label className="text-xs font-bold text-[#1E3A8A] mb-1.5 block uppercase tracking-wide">Highlights</label>
                        <div className="flex gap-2 mb-4">
                           <input 
                             type="text" value={newHighlight} 
                             onChange={e => setNewHighlight(e.target.value)}
                             className="flex-1 px-3 py-2 text-sm bg-gray-50 border border-gray-100 rounded-xl outline-none"
                             placeholder="Add highlight..."
                           />
                           <button type="button" onClick={addHighlight} className="p-2.5 bg-[#10B981] text-white rounded-xl hover:bg-[#059669]">
                              <Plus className="w-5 h-5" />
                           </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                           {form.highlights.map((h, i) => (
                             <span key={i} className="bg-[#10B981]/10 text-[#10B981] px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 group">
                                {h}
                                <X onClick={() => removeItem('highlights', i)} className="w-3 h-3 cursor-pointer hover:text-red-500" />
                             </span>
                           ))}
                        </div>
                     </div>

                     <div>
                        <label className="text-xs font-bold text-[#1E3A8A] mb-1.5 block uppercase tracking-wide">Inclusions</label>
                        <div className="flex gap-2 mb-4">
                           <input 
                             type="text" value={newInclusion} 
                             onChange={e => setNewInclusion(e.target.value)}
                             className="flex-1 px-3 py-2 text-sm bg-gray-50 border border-gray-100 rounded-xl outline-none"
                             placeholder="Add inclusion..."
                           />
                           <button type="button" onClick={addInclusion} className="p-2.5 bg-[#10B981] text-white rounded-xl hover:bg-[#059669]">
                              <Plus className="w-5 h-5" />
                           </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                           {form.inclusions.map((inc, i) => (
                             <span key={i} className="bg-[#10B981]/10 text-[#10B981] px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-2">
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
                   <label className="text-xs font-bold text-[#1E3A8A] mb-4 block uppercase tracking-widest">Comprehensive Itinerary</label>
                   <div className="bg-gray-50/50 rounded-2xl p-4 border border-gray-100">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-4">
                         <input 
                           type="number" placeholder="Day (e.g. 1)" 
                           value={newDay.day} onChange={e => setNewDay({...newDay, day: e.target.value})}
                           className="px-3 py-2.5 text-sm bg-white border border-gray-100 rounded-xl outline-none"
                         />
                         <input 
                           type="text" placeholder="Day Title" 
                           value={newDay.title} onChange={e => setNewDay({...newDay, title: e.target.value})}
                           className="md:col-span-2 px-3 py-2.5 text-sm bg-white border border-gray-100 rounded-xl outline-none"
                         />
                         <button type="button" onClick={addItineraryDay} className="bg-[#1E3A8A] text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-[#172554] transition-all">
                            <Plus className="w-5 h-5" /> Add Day
                         </button>
                         <textarea 
                           className="md:col-span-4 px-3 py-2.5 text-sm bg-white border border-gray-100 rounded-xl outline-none resize-none mt-2"
                           placeholder="What happens on this day? (Optional)"
                           value={newDay.description} onChange={e => setNewDay({...newDay, description: e.target.value})}
                         />
                      </div>

                      <div className="space-y-3">
                         {form.itinerary.map((day, i) => (
                           <div key={i} className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center justify-between shadow-sm">
                              <div className="flex items-center gap-4">
                                 <div className="w-10 h-10 rounded-xl bg-[#1E3A8A] text-white flex items-center justify-center font-bold text-xs uppercase">D{day.day}</div>
                                 <div>
                                    <p className="font-bold text-[#1E3A8A]">{day.title}</p>
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
                  <button type="submit" disabled={isSaving} className="flex-1 py-3 text-sm bg-[#10B981] text-white rounded-xl font-bold hover:bg-[#059669] transition-all shadow-md shadow-[#10B981]/20 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed">
                     <Save className="w-5 h-5" />
                     {isSaving ? 'Saving...' : editingId ? 'Update Detail block' : 'Save Details'}
                  </button>
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 text-sm bg-gray-100 text-gray-500 rounded-xl font-bold hover:bg-gray-200 transition-all">
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