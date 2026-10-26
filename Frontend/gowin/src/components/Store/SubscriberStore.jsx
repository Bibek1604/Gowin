import { create } from 'zustand';
import { supabase } from '../../supabaseClient';
import { clean } from '../../lib/format';

const useSubscriberStore = create((set, get) => ({
  subscribers: [],
  isLoading: false,
  error: null,
  loaded: false,

  fetchSubscribers: async () => {
    if (get().isLoading) return;
    set({ isLoading: true, error: null });
    const { data, error } = await supabase.from('newsletter_subscribers').select('*').order('created_at', { ascending: false });
    if (error) {
      console.error('fetchSubscribers:', error.message);
      set({ error: error.message, isLoading: false, loaded: true });
      return;
    }
    set({ subscribers: data || [], isLoading: false, loaded: true });
  },

  /** Public newsletter sign-up. */
  subscribe: async (email) => {
    const value = clean(email).toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return { success: false, error: 'Enter a valid email address.' };
    const { error } = await supabase.from('newsletter_subscribers').insert({ email: value });
    if (error) return { success: false, error, duplicate: error.code === '23505' };
    return { success: true };
  },

  deleteSubscriber: async (id) => {
    const { error } = await supabase.from('newsletter_subscribers').delete().eq('id', id);
    if (error) return { success: false, error };
    set((s) => ({ subscribers: s.subscribers.filter((x) => x.id !== id) }));
    return { success: true };
  },
}));

export default useSubscriberStore;
