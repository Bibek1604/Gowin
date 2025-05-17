import { create } from "zustand";
import { persist } from "zustand/middleware";

const usePlaceStore = create(
  persist(
    (set) => ({
      places: [],
      addPlace: (place) =>
        set((state) => ({
          places: [...state.places, place],
        })),
      updatePlace: (id, updatedPlace) =>
        set((state) => ({
          places: state.places.map((place) =>
            place.id === id ? updatedPlace : place
          ),
        })),
      deletePlace: (id) =>
        set((state) => ({
          places: state.places.filter((place) => place.id !== id),
        })),
    }),
    {
      name: "place-storage",
    }
  )
);

export default usePlaceStore;