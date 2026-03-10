import { create } from 'zustand';
import { supabase } from '../../supabaseClient';

const useCategoryStore = create((set) => ({
  categories: [],
  isLoading: false,

  fetchCategories: async () => {
    set({ isLoading: true });
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching categories:', error);
    } else {
      set({ categories: data || [] });
    }
    set({ isLoading: false });
  },

  addCategory: async (categoryData) => {
    const { data, error } = await supabase
      .from('categories')
      .insert([{
        name: categoryData.category,
        description: categoryData.description,
        image_url: categoryData.image
      }])
      .select();

    if (error) {
      console.error('Error adding category:', error);
      return { success: false, error };
    }

    set((state) => ({
      categories: [data[0], ...state.categories],
    }));
    return { success: true };
  },

  updateCategory: async (id, updatedData) => {
    const { data, error } = await supabase
      .from('categories')
      .update({
        name: updatedData.category,
        description: updatedData.description,
        image_url: updatedData.image
      })
      .eq('id', id)
      .select();

    if (error) {
      console.error('Error updating category:', error);
      return { success: false, error };
    }

    set((state) => ({
      categories: state.categories.map((cat) =>
        cat.id === id ? data[0] : cat
      ),
    }));
    return { success: true };
  },

  deleteCategory: async (id) => {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting category:', error);
      return { success: false, error };
    }

    set((state) => ({
      categories: state.categories.filter((cat) => cat.id !== id),
    }));
    return { success: true };
  },
}));

export default useCategoryStore;