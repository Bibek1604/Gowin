import { create } from "zustand";
import { supabase } from "../../supabaseClient";

const usePlaceStore = create((set, get) => ({
  places: [],
  isLoading: false,

  fetchPlaces: async () => {
    // Dedupe only truly-concurrent calls (many components mounting at once).
    // set() is synchronous, so the first caller flips isLoading before any
    // other caller in the same tick can slip through. Must NOT permanently
    // lock this out after one fetch — new/edited destinations from admin
    // need every subsequent call to hit the DB again, not serve stale data.
    if (get().isLoading) return;
    set({ isLoading: true });
    const { data, error } = await supabase
      .from('tour_packages')
      .select('*, categories(name)')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching places:', error);
    } else {
      set({ places: data || [] });
    }
    set({ isLoading: false });
  },

  addPlace: async (placeData) => {
    const { data, error } = await supabase
      .from('tour_packages')
      .insert([{
        title: placeData.title,
        description: placeData.description,
        price: placeData.price,
        location: placeData.location,
        duration: placeData.duration,
        category_id: placeData.category_id,
        destination_type: placeData.destination_type || 'International',
        images: placeData.images, // Array of URLs
        available_dates: placeData.available_dates
      }])
      .select();

    if (error) {
      console.error('Error adding place:', error);
      return { success: false, error };
    }

    set((state) => ({
      places: [data[0], ...state.places],
    }));
    return { success: true };
  },

  updatePlace: async (id, updatedData) => {
    const { data, error } = await supabase
      .from('tour_packages')
      .update({
        title: updatedData.title,
        description: updatedData.description,
        price: updatedData.price,
        location: updatedData.location,
        duration: updatedData.duration,
        category_id: updatedData.category_id,
        destination_type: updatedData.destination_type,
        images: updatedData.images,
        available_dates: updatedData.available_dates
      })
      .eq('id', id)
      .select();

    if (error) {
      console.error('Error updating place:', error);
      return { success: false, error };
    }

    set((state) => ({
      places: state.places.map((p) => (p.id === id ? data[0] : p)),
    }));
    return { success: true };
  },

  deletePlace: async (id) => {
    const { error } = await supabase
      .from('tour_packages')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting place:', error);
      return { success: false, error };
    }

    set((state) => ({
      places: state.places.filter((p) => p.id !== id),
    }));
    return { success: true };
  },
}));

// Live sync: any insert/update/delete on tour_packages — from this admin
// panel, another admin, or another tab — refetches automatically so every
// open page reflects it immediately. No polling, no manual reload.
// Requires Realtime enabled for this table (see supabase/migrations).
supabase
  .channel('tour_packages_realtime')
  .on('postgres_changes', { event: '*', schema: 'public', table: 'tour_packages' }, () => {
    usePlaceStore.getState().fetchPlaces();
  })
  .subscribe();

export default usePlaceStore;
