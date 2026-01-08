import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const useBookingStore = create(
  persist(
    (set, get) => ({
      bookings: [],
      addBooking: (booking) =>
        set((state) => ({
          bookings: [...state.bookings, booking],
        })),
      updateBooking: (bookingId, updatedBooking) =>
        set((state) => ({
          bookings: state.bookings.map((booking) =>
            booking.bookingId === bookingId ? { ...booking, ...updatedBooking } : booking
          ),
        })),
        deleteBooking: (bookingId) =>
        set((state) => ({
          bookings: state.bookings.filter((booking) => booking.bookingId !== bookingId),
        })),
      getBookingsByPlaceId: (placeId) =>
        get().bookings.filter((booking) => booking.placeId === placeId),
      getBookingById: (bookingId) =>
        get().bookings.find((booking) => booking.bookingId === bookingId),
    }),
    {
      name: 'booking-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useBookingStore;