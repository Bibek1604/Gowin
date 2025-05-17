import { create } from "zustand";

const useDetailsStore = create((set) => ({
  details: [],

  adddetails: (detail) => set((state) => ({ details: [...state.details, detail] })),

  updatedetails: (placeId, updatedDetail) =>
    set((state) => ({
      details: state.details.map((detail) =>
        detail.placeId === placeId ? updatedDetail : detail
      ),
    })),

  deletedetails: (placeId) =>
    set((state) => ({
      details: state.details.filter((detail) => detail.placeId !== placeId),
    })),

  getDetailsByPlace: (placeId) => {
    return (state) => state.details.filter((detail) => detail.placeId === placeId);
  },
}));

export default useDetailsStore;