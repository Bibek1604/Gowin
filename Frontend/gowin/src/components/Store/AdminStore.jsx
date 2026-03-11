import { create } from 'zustand';

// Admin auth store — no localStorage persistence
// Session is lost on page refresh (requires re-login)
export const useAdminStore = create((set) => ({
  isAdmin: false,
  isLoading: false,

  login: async (email, password) => {
    const ADMIN_EMAIL = 'admin@gowin.com';
    const ADMIN_PASSWORD = '#Shankhamul#123#abc#gowin';

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      set({ isAdmin: true });
      return { success: true };
    } else {
      set({ isAdmin: false });
      return { success: false, error: 'Invalid admin credentials' };
    }
  },

  logout: () => {
    set({ isAdmin: false });
  },

  initialize: () => {
    set({ isLoading: false });
  },
}));
