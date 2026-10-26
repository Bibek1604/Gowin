import { create } from 'zustand';
import { supabase } from '../../supabaseClient';
import { clean } from '../../lib/format';

const useTestimonialStore = create((set, get) => ({
  testimonials: [],
  isLoading: false,
  error: null,
  loaded: false,

  /** Admins see every review (RLS); visitors only get approved ones. */
  fetchTestimonials: async ({ approvedOnly = false } = {}) => {
    if (get().isLoading) return;
    set({ isLoading: true, error: null });
    let query = supabase.from('testimonials').select('*').order('created_at', { ascending: false });
    if (approvedOnly) query = query.eq('is_approved', true);
    const { data, error } = await query;
    if (error) {
      console.error('fetchTestimonials:', error.message);
      set({ error: error.message, isLoading: false, loaded: true });
      return;
    }
    set({ testimonials: data || [], isLoading: false, loaded: true });
  },

  saveTestimonial: async (form, id = null) => {
    const payload = {
      user_name: clean(form.user_name),
      designation: clean(form.designation) || null,
      content: clean(form.content),
      rating: Math.min(5, Math.max(1, parseInt(form.rating, 10) || 5)),
      image_url: clean(form.image_url) || null,
      is_approved: form.is_approved === true,
    };
    if (!payload.user_name || !payload.content) return { success: false, error: 'Name and review text are required.' };
    const query = id
      ? supabase.from('testimonials').update(payload).eq('id', id).select('*').single()
      : supabase.from('testimonials').insert(payload).select('*').single();
    const { data, error } = await query;
    if (error) return { success: false, error };
    set((s) => ({ testimonials: id ? s.testimonials.map((t) => (t.id === id ? data : t)) : [data, ...s.testimonials] }));
    return { success: true, data };
  },

  patchTestimonial: async (id, patch) => {
    const { data, error } = await supabase.from('testimonials').update(patch).eq('id', id).select('*').single();
    if (error) return { success: false, error };
    set((s) => ({ testimonials: s.testimonials.map((t) => (t.id === id ? data : t)) }));
    return { success: true, data };
  },

  deleteTestimonial: async (id) => {
    const { error } = await supabase.from('testimonials').delete().eq('id', id);
    if (error) return { success: false, error };
    set((s) => ({ testimonials: s.testimonials.filter((t) => t.id !== id) }));
    return { success: true };
  },
}));

export default useTestimonialStore;
