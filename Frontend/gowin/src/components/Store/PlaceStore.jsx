import { create } from "zustand";
import { supabase } from "../../supabaseClient";

const usePlaceStore = create((set) => ({
  places: [],
  isLoading: false,

  fetchPlaces: async () => {
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

export default usePlaceStore;
