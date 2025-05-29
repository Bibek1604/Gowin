import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";

const usePlaceStore = create(
  persist(
    (set) => ({
      places: [],
      addPlace: (place) =>
        set((state) => ({
          places: [
            ...state.places,
            { ...place, id: place.id || uuidv4() }
          ],
        })),
      updatePlace: (id, updatedPlace) =>
        set((state) => ({
          places: state.places.map((place) =>
            place.id === id ? { ...place, ...updatedPlace } : place
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
