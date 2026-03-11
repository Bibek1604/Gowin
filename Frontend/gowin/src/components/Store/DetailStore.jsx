import { create } from 'zustand';
import { supabase } from '../../supabaseClient';

const useDetailsStore = create((set) => ({
  details: [],
  isLoading: false,

  fetchDetails: async (placeId) => {
    set({ isLoading: true });
    const query = supabase.from('place_details').select('*');
    if (placeId) query.eq('place_id', placeId);

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching details:', error);
    } else {
      set({ details: data || [] });
    }
    set({ isLoading: false });
  },

  addDetails: async (detailData) => {
    const { data, error } = await supabase
      .from('place_details')
      .insert([detailData])
      .select();

    if (error) {
      console.error('Error adding detail:', error);
      return { success: false, error };
    }

    set((state) => ({ details: [data[0], ...state.details] }));
    return { success: true };
  },

  updateDetails: async (id, updatedDetail) => {
    const { data, error } = await supabase
      .from('place_details')
      .update(updatedDetail)
      .eq('id', id)
      .select();

    if (error) {
      console.error('Error updating detail:', error);
      return { success: false, error };
    }

    set((state) => ({
      details: state.details.map((d) => (d.id === id ? data[0] : d)),
    }));
    return { success: true };
  },

  deleteDetails: async (id) => {
    const { error } = await supabase
      .from('place_details')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting detail:', error);
      return { success: false, error };
    }

    set((state) => ({
      details: state.details.filter((d) => d.id !== id),
    }));
    return { success: true };
  },
}));

export default useDetailsStore;