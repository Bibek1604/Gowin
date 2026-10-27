import React, { useEffect, useMemo, useState } from 'react';
import { Plus, Edit2, Trash2, Tags, Eye, EyeOff, Link2 } from 'lucide-react';
import toast from 'react-hot-toast';
import useCategoryStore from '../Store/CategoryStore';
import usePlaceStore from '../Store/PlaceStore';
import AdminPage, { Toolbar, SearchBox, Chips, ErrorBanner } from './AdminPage';
import Modal from '../ui/Modal';
import ConfirmDialog from '../ui/ConfirmDialog';
import EmptyState from '../ui/EmptyState';
import SmartImage from '../ui/SmartImage';
import StatusBadge from '../ui/StatusBadge';
import ImageUploader from '../ui/ImageUploader';
import { Field, Input, Textarea, Toggle } from '../ui/FormField';
import { CardSkeleton } from '../ui/Skeleton';
import { slugify } from '../../lib/slugify';
import { friendlyError } from '../../lib/errors';

const EMPTY = { name: '', slug: '', description: '', image_url: '', image_credit: '', is_active: true, sort_order: 100 };

const Categories = () => {
  const { categories, isLoading, loaded, error, saveCategory, patchCategory, deleteCategory } = useCategoryStore();
  const { places } = usePlaceStore();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('active');
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [slugTouched, setSlugTouched] = useState(false);
  const [saving, setSaving] = useState(false);
  const [confirm, setConfirm] = useState(null);
  const [busyId, setBusyId] = useState(null);

  const usage = useMemo(() => {
    const m = {};
    for (const p of places) if (p.category_id) m[p.category_id] = (m[p.category_id] || 0) + 1;
    return m;
  }, [places]);

  useEffect(() => {
    if (!formOpen) return;
    setForm(editing ? { name: editing.name, slug: editing.slug || '', description: editing.description || '', image_url: editing.image_url || '', image_credit: editing.image_credit || '', is_active: editing.is_active !== false, sort_order: editing.sort_order ?? 100 } : EMPTY);
    setSlugTouched(!!editing?.slug);
  }, [formOpen, editing]);

  const list = categories.filter((c) => (status === 'all' || (status === 'active' ? c.is_active : !c.is_active)) && (!search.trim() || c.name.toLowerCase().includes(search.trim().toLowerCase())));

  const submit = async (e) => {
    e.preventDefault();
    if (saving) return;
    if (form.name.trim().length < 2) { toast.error('Enter a category name.'); return; }
    setSaving(true);
    const res = await saveCategory(form, editing?.id || null);
    setSaving(false);
    if (!res.success) { toast.error(friendlyError(res.error)); return; }
    toast.success(editing ? 'Category updated' : 'Category created');
    setFormOpen(false);
  };

  const toggleActive = async (c) => {
    setBusyId(c.id);
    const res = await patchCategory(c.id, { is_active: !c.is_active });
    setBusyId(null);
    if (res.success) toast.success(res.data.is_active ? 'Category is now active' : 'Category hidden — its packages are hidden from visitors too');
    else toast.error(friendlyError(res.error));
  };

  const remove = async () => {
    if (!confirm) return;
    setBusyId(confirm.id);
    const res = await deleteCategory(confirm.id);
    setBusyId(null); setConfirm(null);
    if (res.success) toast.success('Category deleted');
    else toast.error(friendlyError(res.error));
  };

  return (
    <AdminPage title="Categories" subtitle="Travel styles used to group packages (Cultural, Wildlife, Honeymoon…). Hiding a category hides its packages."
      actions={<button type="button" onClick={() => { setEditing(null); setFormOpen(true); }} className="btn-primary text-sm"><Plus className="w-4 h-4" /> Add category</button>}>
      <ErrorBanner error={error && friendlyError({ message: error })} />
      <Toolbar>
        <SearchBox value={search} onChange={setSearch} placeholder="Search categories…" />
        <Chips value={status} onChange={setStatus} options={[{ value: 'active', label: 'Active', count: categories.filter((c) => c.is_active).length }, { value: 'inactive', label: 'Hidden', count: categories.filter((c) => !c.is_active).length }, { value: 'all', label: 'All', count: categories.length }]} />
      </Toolbar>

      {isLoading && !loaded ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"><CardSkeleton count={6} className="h-48" /></div>
      ) : list.length === 0 ? (
        <EmptyState icon={Tags} title="No categories here" text="Create a category or change the filter." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {list.map((c) => (
            <article key={c.id} className={`bg-white rounded-2xl border shadow-sm overflow-hidden flex ${c.is_active ? 'border-gray-100' : 'border-dashed border-gray-300'}`}>
              <div className="w-28 sm:w-32 bg-gray-100 flex-shrink-0"><SmartImage src={c.image_url} alt="" className="w-full h-full object-cover" /></div>
              <div className="p-4 flex-1 min-w-0 flex flex-col">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0"><h3 className="font-bold text-[#0F172A] text-sm truncate">{c.name}</h3><p className="text-[11px] text-gray-400 truncate flex items-center gap-1"><Link2 className="w-3 h-3" />{c.slug || 'no slug'}</p></div>
                  <StatusBadge status={c.is_active ? 'Published' : 'Hidden'} />
                </div>
                <p className="text-xs text-gray-500 mt-2 line-clamp-2 flex-1">{c.description || 'No description'}</p>
                <p className="text-[11px] text-gray-400 mt-2">{usage[c.id] || 0} package{(usage[c.id] || 0) === 1 ? '' : 's'} · order {c.sort_order}</p>
                <div className="flex gap-1.5 mt-3 pt-3 border-t border-gray-100">
                  <button type="button" onClick={() => { setEditing(c); setFormOpen(true); }} className="flex-1 inline-flex items-center justify-center gap-1 py-2 rounded-lg text-xs font-semibold text-[#1E3A8A] bg-[#1E3A8A]/5 hover:bg-[#1E3A8A] hover:text-white"><Edit2 className="w-3.5 h-3.5" /> Edit</button>
                  <button type="button" onClick={() => toggleActive(c)} disabled={busyId === c.id} title={c.is_active ? 'Hide' : 'Activate'} className="w-9 inline-flex items-center justify-center rounded-lg text-gray-600 bg-gray-50 hover:bg-gray-200 disabled:opacity-50">{c.is_active ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}</button>
                  <button type="button" onClick={() => setConfirm(c)} title="Delete" className="w-9 inline-flex items-center justify-center rounded-lg text-red-500 bg-red-50 hover:bg-red-500 hover:text-white"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      <Modal open={formOpen} onClose={saving ? undefined : () => setFormOpen(false)} title={editing ? 'Edit category' : 'Add category'} size="sm"
        footer={<div className="flex gap-2 justify-end"><button type="button" onClick={() => setFormOpen(false)} disabled={saving} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-600 bg-white border border-gray-200">Cancel</button><button type="submit" form="category-form" disabled={saving} className="btn-primary text-sm disabled:opacity-60">{saving ? 'Saving…' : editing ? 'Save changes' : 'Create category'}</button></div>}>
        <form id="category-form" onSubmit={submit} noValidate className="space-y-4">
          <Field label="Name" required htmlFor="cat-name"><Input id="cat-name" value={form.name} onChange={(e) => { const v = e.target.value; setForm((f) => ({ ...f, name: v, slug: slugTouched ? f.slug : slugify(v) })); }} placeholder="e.g. Honeymoon & Couples" /></Field>
          <Field label="URL slug" htmlFor="cat-slug" hint="Used in filter links"><Input id="cat-slug" value={form.slug} onChange={(e) => { setSlugTouched(true); setForm((f) => ({ ...f, slug: slugify(e.target.value) })); }} /></Field>
          <Field label="Description" htmlFor="cat-desc"><Textarea id="cat-desc" rows={2} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder="One sentence shown on the listing page" /></Field>
          <ImageUploader label="Cover photo" value={form.image_url ? [form.image_url] : []} onChange={(imgs) => setForm((f) => ({ ...f, image_url: imgs[0] || '' }))} folder="categories" max={1} />
          <Field label="Photo credit" htmlFor="c-credit" hint="Shown on the category card. Required for Creative Commons photos (photographer, licence, source)."><Input id="c-credit" value={form.image_credit} onChange={(e) => setForm((f) => ({ ...f, image_credit: e.target.value }))} placeholder="e.g. Jane Doe, CC BY-SA 4.0, via Wikimedia Commons" /></Field>
          <div className="grid grid-cols-2 gap-4 items-end">
            <Field label="Display order" htmlFor="cat-order" hint="Lower numbers first"><Input id="cat-order" type="number" value={form.sort_order} onChange={(e) => setForm((f) => ({ ...f, sort_order: e.target.value }))} /></Field>
            <Toggle checked={form.is_active} onChange={(v) => setForm((f) => ({ ...f, is_active: v }))} label="Active" hint="Visible to visitors" />
          </div>
        </form>
      </Modal>

      <ConfirmDialog open={!!confirm} danger loading={busyId === confirm?.id} title="Delete this category?" confirmLabel="Delete"
        message={(usage[confirm?.id] || 0) > 0 ? <>“{confirm?.name}” is used by {usage[confirm?.id]} package{usage[confirm?.id] === 1 ? '' : 's'}. They will be left without a category and disappear from category filters. Consider hiding the category instead.</> : <>“{confirm?.name}” is not used by any package and will be removed.</>}
        onConfirm={remove} onCancel={() => setConfirm(null)} />
    </AdminPage>
  );
};

export default Categories;
