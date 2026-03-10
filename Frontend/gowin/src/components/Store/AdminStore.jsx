import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAdminStore = create(
  persist(
    (set) => ({
      isAdmin: false,
      isLoading: false,

      login: async (email, password) => {
        // As requested: direct password verification
        const ADMIN_EMAIL = "admin@gowin.com";
        const ADMIN_PASSWORD = "#Shankhamul#123#abc#gowin";

        if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
          set({ isAdmin: true });
          return { success: true };
        } else {
          set({ isAdmin: false });
          return { success: false, error: "Invalid admin credentials" };
        }
      },

      logout: () => {
        set({ isAdmin: false });
      },

      // Keep this for compatibility with the updated App.jsx, but it does nothing now
      initialize: () => {
        set({ isLoading: false });
      },
    }),
    {
      name: 'admin-auth-storage',
    }
  )
);
