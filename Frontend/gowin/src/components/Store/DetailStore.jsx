import { create } from "zustand";

const useDetailsStore = create((set, get) => ({
  details: [],
  addDetails: (newDetail) => {
    console.log("Adding detail:", newDetail);
    set((state) => ({ details: [...state.details, newDetail] }));
  },
  updateDetails: (id, updatedDetail) => {
    console.log("Updating detail for id:", id);
    set((state) => ({
      details: state.details.map((d) =>
        d.id === id ? { ...d, ...updatedDetail } : d
      ),
    }));
  },
  deleteDetails: (id) => {
    console.log("Deleting detail for id:", id);
    set((state) => ({
      details: state.details.filter((d) => d.id !== id),
    }));
  },
  getDetailsByPlace: (placeId) => {
    const { details } = get();
    console.log("Fetching details for placeId:", placeId);
    return details.filter((d) => d.placeId === placeId);
  },
}));

export default useDetailsStore;