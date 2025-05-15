import { create } from 'zustand';

const useCategoryStore = create((set) => ({
    categories: [],

    addCategory: (category) => set((state) => ({
        categories: [...state.categories, category]
    })),

    updateCategory: (index, updatedCategory) => set((state) => ({
        categories: state.categories.map((cat, idx) => 
            idx === index ? updatedCategory : cat
        )
    })),

    deleteCategory: (index) => set((state) => ({
        categories: state.categories.filter((_, idx) => idx !== index)
    }))
}));

export default useCategoryStore;
