import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCategoryStore = create(
  persist(
    (set) => ({
      categories: [],
      addCategory: (category) =>
        set((state) => ({
          categories: [...state.categories, category],
        })),
      updateCategory: (id, updatedCategory) =>
        set((state) => ({
          categories: state.categories.map((cat) =>
            cat.id === id ? updatedCategory : cat
          ),
        })),
      deleteCategory: (id) =>
        set((state) => ({
          categories: state.categories.filter((cat) => cat.id !== id),
        })),
    }),
    {
      name: 'category-storage',
    }
  )
);

export default useCategoryStore;