import { create } from 'zustand';
import { supabase } from '../../supabaseClient';
import { slugify } from '../../lib/slugify';
import { clean } from '../../lib/format';

const NEW_COLUMNS = ['slug', 'is_active', 'sort_order', 'image_credit'];
const missingColumn = (error) => error && (error.code === '42703' || /column .* does not exist/i.test(error.message || ''));
const stripNewColumns = (payload) => Object.fromEntries(Object.entries(payload).filter(([k]) => !NEW_COLUMNS.includes(k)));

const normalize = (c) => ({ ...c, is_active: c.is_active !== false, sort_order: c.sort_order ?? 100 });
const bySort = (a, b) => a.sort_order - b.sort_order || a.name.localeCompare(b.name);

/** Categories visitors can browse. */
export const selectActive = (categories) => categories.filter((c) => c.is_active);

const useCategoryStore = create((set, get) => ({
  categories: [],
  isLoading: false,
  error: null,
  loaded: false,

  fetchCategories: async () => {
    if (get().isLoading) return;
    set({ isLoading: true, error: null });
    const { data, error } = await supabase.from('categories').select('*');
    if (error) {
      console.error('fetchCategories:', error.message);
      set({ error: error.message, isLoading: false, loaded: true });
      return;
    }
    set({ categories: (data || []).map(normalize).sort(bySort), isLoading: false, loaded: true });
  },

  saveCategory: async (form, id = null) => {
    const payload = {
      name: clean(form.name),
      slug: slugify(form.slug || form.name) || null,
      description: clean(form.description) || null,
      image_url: clean(form.image_url) || null,
      image_credit: clean(form.image_credit) || null,
      is_active: form.is_active !== false,
      sort_order: Number.isFinite(Number(form.sort_order)) ? Number(form.sort_order) : 100,
    };
    if (!payload.name) return { success: false, error: 'Category name is required.' };
    const run = (body) => (id
      ? supabase.from('categories').update(body).eq('id', id).select('*').single()
      : supabase.from('categories').insert(body).select('*').single());
    let { data, error } = await run(payload);
    if (missingColumn(error)) ({ data, error } = await run(stripNewColumns(payload))); // pre-migration database
    if (error) return { success: false, error };
    const cat = normalize(data);
    set((s) => ({ categories: (id ? s.categories.map((c) => (c.id === id ? cat : c)) : [...s.categories, cat]).sort(bySort) }));
    return { success: true, data: cat };
  },

  patchCategory: async (id, patch) => {
    const { data, error } = await supabase.from('categories').update(patch).eq('id', id).select('*').single();
    if (error) return { success: false, error };
    const cat = normalize(data);
    set((s) => ({ categories: s.categories.map((c) => (c.id === id ? cat : c)).sort(bySort) }));
    return { success: true, data: cat };
  },

  deleteCategory: async (id) => {
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) return { success: false, error };
    set((s) => ({ categories: s.categories.filter((c) => c.id !== id) }));
    return { success: true };
  },
}));

let refetchTimer;
supabase
  .channel('categories_realtime')
  .on('postgres_changes', { event: '*', schema: 'public', table: 'categories' }, () => {
    clearTimeout(refetchTimer);
    refetchTimer = setTimeout(() => useCategoryStore.getState().fetchCategories(), 400);
  })
  .subscribe();

export default useCategoryStore;
