import { create } from 'zustand';
import { supabase } from '../../supabaseClient';

// Admin auth store — now connected to Supabase Auth
export const useAdminStore = create((set) => ({
  isAdmin: false,
  isLoading: true,

  login: async (email, password) => {
    set({ isLoading: true });
    
    // Connect to Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    set({ isLoading: false });

    if (error) {
      console.error('Login failed:', error.message);
      set({ isAdmin: false });
      return { success: false, error: error.message };
    }

    set({ isAdmin: true });
    return { success: true };
  },

  logout: async () => {
    await supabase.auth.signOut();
    set({ isAdmin: false });
  },

  // This checks if you are already logged in when you refresh the page
  initialize: async () => {
    set({ isLoading: true });
    const { data: { session } } = await supabase.auth.getSession();
    set({ isAdmin: !!session, isLoading: false });
  },
}));

