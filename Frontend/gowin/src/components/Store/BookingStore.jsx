import { create } from 'zustand';
import { supabase } from '../../supabaseClient';

const useBookingStore = create((set) => ({
  bookings: [],
  isLoading: false,

  fetchBookings: async () => {
    set({ isLoading: true });
    const { data, error } = await supabase
      .from('bookings')
      .select('*, tour_packages(title)')
      .order('booking_date', { ascending: false });

    if (error) {
      console.error('Error fetching bookings:', error);
    } else {
      set({ bookings: data || [] });
    }
    set({ isLoading: false });
  },

  addBooking: async (bookingData) => {
    const { data, error } = await supabase
      .from('bookings')
      .insert([{
        tour_id: bookingData.tour_id || bookingData.placeId,
        user_name: bookingData.name || bookingData.user_name,
        user_email: bookingData.email || bookingData.user_email,
        num_people: parseInt(bookingData.num_people || bookingData.guests),
        travel_date: bookingData.travel_date || bookingData.date,
        status: 'Pending'
      }])
      .select();

    if (error) {
      console.error('Error adding booking:', error);
      return { success: false, error };
    }

    set((state) => ({
      bookings: [data[0], ...state.bookings],
    }));
    return { success: true };
  },

  updateBookingStatus: async (id, status) => {
    const { data, error } = await supabase
      .from('bookings')
      .update({ status })
      .eq('id', id)
      .select();

    if (error) {
      console.error('Error updating booking status:', error);
      return { success: false, error };
    }

    set((state) => ({
      bookings: state.bookings.map((b) => (b.id === id ? data[0] : b)),
    }));
    return { success: true };
  },

  deleteBooking: async (id) => {
    const { error } = await supabase
      .from('bookings')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting booking:', error);
      return { success: false, error };
    }

    set((state) => ({
      bookings: state.bookings.filter((b) => b.id !== id),
    }));
    return { success: true };
  },
}));

export default useBookingStore;