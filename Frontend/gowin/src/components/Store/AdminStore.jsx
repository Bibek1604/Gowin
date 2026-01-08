// src/Store/AdminStore.js
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAdminStore = create(
  persist(
    (set) => ({
      isAdmin: false,
      login: (password) => {
        if (password === '#Shankhamul#123#abc#gowin') {
          set({ isAdmin: true })
        } else {
          alert('Incorrect password')
        }
      },
      logout: () => set({ isAdmin: false }),
    }),
    {
      name: 'admin-auth', 
    }
  )
)
