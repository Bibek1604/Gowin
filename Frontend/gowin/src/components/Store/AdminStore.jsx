import { create } from 'zustand';
import { supabase } from '../../supabaseClient';

// Admin auth store — connected to Supabase Auth.
// Optional VITE_ADMIN_EMAILS (comma-separated) restricts which accounts count as admin.
// NOTE: this is a UI gate only — real enforcement must be Supabase RLS policies.
const ADMIN_EMAILS = (import.meta.env.VITE_ADMIN_EMAILS || '')
  .split(',').map(e => e.trim().toLowerCase()).filter(Boolean);

const isAllowedAdmin = (email) =>
  ADMIN_EMAILS.length === 0 || ADMIN_EMAILS.includes((email || '').toLowerCase());

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
      set({ isAdmin: false });
      return { success: false, error: error.message };
    }

    if (!isAllowedAdmin(data?.user?.email)) {
      await supabase.auth.signOut();
      set({ isAdmin: false });
      return { success: false, error: 'This account is not authorized for admin access.' };
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
    set({ isAdmin: !!session && isAllowedAdmin(session.user?.email), isLoading: false });
  },
}));

