import { create } from 'zustand';
import { supabase } from '../../supabaseClient';
import { DEFAULT_SETTINGS } from '../../data/siteContent';

const EDITABLE = Object.keys(DEFAULT_SETTINGS);

/** Site-wide contact details, social links and SEO defaults (single DB row). */
const useSettingsStore = create((set, get) => ({
  settings: { ...DEFAULT_SETTINGS },
  isLoading: false,
  loaded: false,
  available: true, // false when the site_settings table does not exist yet

  fetchSettings: async () => {
    if (get().isLoading) return;
    set({ isLoading: true });
    const { data, error } = await supabase.from('site_settings').select('*').eq('id', 1).maybeSingle();
    if (error) {
      // Table missing until migrations run — keep the compiled-in defaults.
      set({ isLoading: false, loaded: true, available: false });
      return;
    }
    const merged = { ...DEFAULT_SETTINGS };
    for (const key of EDITABLE) if (data?.[key]) merged[key] = data[key];
    set({ settings: merged, isLoading: false, loaded: true, available: true });
  },

  updateSettings: async (patch) => {
    const payload = {};
    for (const key of EDITABLE) if (key in patch) payload[key] = patch[key] === '' ? null : patch[key];
    const { data, error } = await supabase.from('site_settings').update(payload).eq('id', 1).select('*').single();
    if (error) return { success: false, error };
    const merged = { ...DEFAULT_SETTINGS };
    for (const key of EDITABLE) if (data?.[key]) merged[key] = data[key];
    set({ settings: merged });
    return { success: true, data: merged };
  },
}));

export default useSettingsStore;
