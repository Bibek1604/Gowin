import { create } from 'zustand';
import { supabase } from '../../supabaseClient';
import { clean } from '../../lib/format';

export const BOOKING_STATUSES = ['Pending', 'Confirmed', 'Completed', 'Cancelled'];

const MISSING_COLUMN = (error) => error && (error.code === '42703' || /column .* does not exist/i.test(error.message || ''));

const useBookingStore = create((set, get) => ({
  bookings: [],
  isLoading: false,
  error: null,
  loaded: false,

  fetchBookings: async () => {
    if (get().isLoading) return;
    set({ isLoading: true, error: null });
    const { data, error } = await supabase.from('bookings').select('*').order('booking_date', { ascending: false });
    if (error) {
      console.error('fetchBookings:', error.message);
      set({ error: error.message, isLoading: false, loaded: true });
      return;
    }
    set({ bookings: data || [], isLoading: false, loaded: true });
  },

  /** Public booking request. Resolves { success, data, error }. */
  addBooking: async (form) => {
    const full = {
      tour_id: form.tour_id || null,
      tour_title: clean(form.tour_title) || null,
      user_name: clean(form.user_name),
      user_email: clean(form.user_email).toLowerCase(),
      phone: clean(form.phone) || null,
      num_people: Math.max(1, parseInt(form.num_people, 10) || 1),
      travel_date: clean(form.travel_date) || null,
      address: clean(form.address) || null,
      message: clean(form.message) || null,
      status: 'Pending',
    };
    let { data, error } = await supabase.from('bookings').insert(full).select('*').single();
    if (MISSING_COLUMN(error)) {
      // Database not yet migrated: store the fields the legacy table knows about.
      const { tour_title, address, message, ...legacy } = full; // eslint-disable-line no-unused-vars
      ({ data, error } = await supabase.from('bookings').insert(legacy).select('*').single());
    }
    if (error) return { success: false, error };
    set((s) => ({ bookings: [data, ...s.bookings] }));
    return { success: true, data };
  },

  updateBooking: async (id, patch) => {
    const { data, error } = await supabase.from('bookings').update(patch).eq('id', id).select('*').single();
    if (error) return { success: false, error };
    set((s) => ({ bookings: s.bookings.map((b) => (b.id === id ? data : b)) }));
    return { success: true, data };
  },

  deleteBooking: async (id) => {
    const { error } = await supabase.from('bookings').delete().eq('id', id);
    if (error) return { success: false, error };
    set((s) => ({ bookings: s.bookings.filter((b) => b.id !== id) }));
    return { success: true };
  },
}));

export default useBookingStore;
