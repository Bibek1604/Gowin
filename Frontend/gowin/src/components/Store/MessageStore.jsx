import { create } from 'zustand';
import { supabase } from '../../supabaseClient';
import { clean } from '../../lib/format';

export const MESSAGE_STATUSES = ['New', 'Replied', 'Closed'];
const MISSING_COLUMN = (error) => error && (error.code === '42703' || /column .* does not exist/i.test(error.message || ''));

const useMessageStore = create((set, get) => ({
  messages: [],
  isLoading: false,
  error: null,
  loaded: false,

  fetchMessages: async () => {
    if (get().isLoading) return;
    set({ isLoading: true, error: null });
    const { data, error } = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false });
    if (error) {
      console.error('fetchMessages:', error.message);
      set({ error: error.message, isLoading: false, loaded: true });
      return;
    }
    set({ messages: (data || []).map((m) => ({ ...m, status: m.status || 'New' })), isLoading: false, loaded: true });
  },

  /** Public contact form submission. */
  addMessage: async (form) => {
    const full = {
      name: clean(form.name),
      email: clean(form.email).toLowerCase(),
      phone: clean(form.phone) || null,
      destination: clean(form.destination) || null,
      message: clean(form.message),
      status: 'New',
    };
    let { data, error } = await supabase.from('contact_messages').insert(full).select('*').single();
    if (MISSING_COLUMN(error)) {
      const { phone, status, ...legacy } = full; // eslint-disable-line no-unused-vars
      ({ data, error } = await supabase.from('contact_messages').insert(legacy).select('*').single());
    }
    if (error) return { success: false, error };
    return { success: true, data };
  },

  updateMessage: async (id, patch) => {
    const { data, error } = await supabase.from('contact_messages').update(patch).eq('id', id).select('*').single();
    if (error) return { success: false, error };
    set((s) => ({ messages: s.messages.map((m) => (m.id === id ? data : m)) }));
    return { success: true, data };
  },

  deleteMessage: async (id) => {
    const { error } = await supabase.from('contact_messages').delete().eq('id', id);
    if (error) return { success: false, error };
    set((s) => ({ messages: s.messages.filter((m) => m.id !== id) }));
    return { success: true };
  },
}));

export default useMessageStore;
