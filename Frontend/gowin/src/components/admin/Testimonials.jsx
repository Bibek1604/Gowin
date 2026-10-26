import React, { useEffect, useMemo, useState } from 'react';
import { Plus, Edit2, Trash2, Star, CheckCircle, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import useTestimonialStore from '../Store/TestimonialStore';
import AdminPage, { Toolbar, SearchBox, Chips, ErrorBanner } from './AdminPage';
import Modal from '../ui/Modal';
import ConfirmDialog from '../ui/ConfirmDialog';
import EmptyState from '../ui/EmptyState';
import StatusBadge from '../ui/StatusBadge';
import SmartImage from '../ui/SmartImage';
import ImageUploader from '../ui/ImageUploader';
import { Field, Input, Select, Textarea, Toggle } from '../ui/FormField';
import { CardSkeleton } from '../ui/Skeleton';
import { friendlyError } from '../../lib/errors';

const EMPTY = { user_name: '', designation: '', content: '', rating: 5, image_url: '', is_approved: true };

const Testimonials = () => {
  const { testimonials, fetchTestimonials, saveTestimonial, patchTestimonial, deleteTestimonial, isLoading, loaded, error } = useTestimonialStore();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [confirm, setConfirm] = useState(null);
  const [busyId, setBusyId] = useState(null);

  useEffect(() => { fetchTestimonials(); }, [fetchTestimonials]);
  useEffect(() => { if (formOpen) setForm(editing ? { user_name: editing.user_name || '', designation: editing.designation || '', content: editing.content || '', rating: editing.rating || 5, image_url: editing.image_url && !editing.image_url.startsWith('data:') ? editing.image_url : '', is_approved: editing.is_approved === true } : EMPTY); }, [formOpen, editing]);

  const list = useMemo(() => {
    const q = search.trim().toLowerCase();
    return testimonials.filter((t) => (filter === 'all' || (filter === 'approved' ? t.is_approved : !t.is_approved)) && (!q || [t.user_name, t.designation, t.content].some((v) => (v || '').toLowerCase().includes(q))));
  }, [testimonials, filter, search]);

  const submit = async (e) => {
    e.preventDefault();
    if (saving) return;
    if (!form.user_name.trim() || form.content.trim().length < 10) { toast.error('Add the reviewer name and the review text.'); return; }
    setSaving(true);
    const res = await saveTestimonial(form, editing?.id || null);
    setSaving(false);
    if (!res.success) { toast.error(friendlyError(res.error)); return; }
    toast.success(editing ? 'Review updated' : 'Review added');
    setFormOpen(false);
  };

  const toggle = async (t) => {
    setBusyId(t.id);
    const res = await patchTestimonial(t.id, { is_approved: !t.is_approved });
    setBusyId(null);
    if (res.success) toast.success(res.data.is_approved ? 'Review is now visible on the website' : 'Review hidden');
    else toast.error(friendlyError(res.error));
  };

  const remove = async () => {
    if (!confirm) return;
    setBusyId(confirm.id);
    const res = await deleteTestimonial(confirm.id);
    setBusyId(null); setConfirm(null);
    if (res.success) toast.success('Review deleted');
    else toast.error(friendlyError(res.error));
  };

  return (
    <AdminPage title="Testimonials" subtitle="Only approved reviews appear on the website. Add genuine feedback from real customers."
      actions={<button type="button" onClick={() => { setEditing(null); setFormOpen(true); }} className="btn-primary text-sm"><Plus className="w-4 h-4" /> Add review</button>}>
      <ErrorBanner error={error && friendlyError({ message: error })} />
      <Toolbar>
        <SearchBox value={search} onChange={setSearch} placeholder="Search reviews…" />
        <Chips value={filter} onChange={setFilter} options={[{ value: 'all', label: 'All', count: testimonials.length }, { value: 'approved', label: 'Visible', count: testimonials.filter((t) => t.is_approved).length }, { value: 'pending', label: 'Hidden', count: testimonials.filter((t) => !t.is_approved).length }]} />
      </Toolbar>
      {isLoading && !loaded ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"><CardSkeleton count={3} className="h-56" /></div>
      ) : list.length === 0 ? (
        <EmptyState icon={Star} title="No reviews here" text="Add a review from a real customer, or change the filter." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {list.map((t) => (
            <article key={t.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3 min-w-0">
                  {t.image_url && !t.image_url.startsWith('data:') ? <SmartImage src={t.image_url} alt="" className="w-11 h-11 rounded-xl object-cover" /> : <span className="w-11 h-11 rounded-xl bg-[#1E3A8A] text-white font-bold flex items-center justify-center">{(t.user_name?.[0] || '?').toUpperCase()}</span>}
                  <div className="min-w-0"><p className="text-sm font-bold text-[#0F172A] truncate">{t.user_name}</p><p className="text-xs text-gray-500 truncate">{t.designation || 'Traveller'}</p></div>
                </div>
                <StatusBadge status={t.is_approved ? 'Approved' : 'Hidden'} />
              </div>
              <div className="flex gap-0.5 mb-2">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className={`w-3.5 h-3.5 ${i < (t.rating || 5) ? 'text-[#FBBF24] fill-[#FBBF24]' : 'text-gray-200'}`} />)}</div>
              <p className="text-sm text-gray-600 leading-relaxed flex-1 line-clamp-5">“{t.content}”</p>
              <div className="flex gap-1.5 mt-4 pt-3 border-t border-gray-100">
                <button type="button" onClick={() => toggle(t)} disabled={busyId === t.id} className={`flex-1 inline-flex items-center justify-center gap-1 py-2 rounded-lg text-xs font-semibold disabled:opacity-60 ${t.is_approved ? 'bg-gray-50 text-gray-600 hover:bg-gray-200' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white'}`}>{t.is_approved ? <><EyeOff className="w-3.5 h-3.5" /> Hide</> : <><CheckCircle className="w-3.5 h-3.5" /> Approve</>}</button>
                <button type="button" onClick={() => { setEditing(t); setFormOpen(true); }} className="w-9 inline-flex items-center justify-center rounded-lg text-[#1E3A8A] bg-[#1E3A8A]/5 hover:bg-[#1E3A8A] hover:text-white" aria-label="Edit"><Edit2 className="w-3.5 h-3.5" /></button>
                <button type="button" onClick={() => setConfirm(t)} className="w-9 inline-flex items-center justify-center rounded-lg text-red-500 bg-red-50 hover:bg-red-500 hover:text-white" aria-label="Delete"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </article>
          ))}
        </div>
      )}

      <Modal open={formOpen} onClose={saving ? undefined : () => setFormOpen(false)} title={editing ? 'Edit review' : 'Add review'} size="sm"
        footer={<div className="flex gap-2 justify-end"><button type="button" onClick={() => setFormOpen(false)} disabled={saving} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-600 bg-white border border-gray-200">Cancel</button><button type="submit" form="review-form" disabled={saving} className="btn-primary text-sm disabled:opacity-60">{saving ? 'Saving…' : editing ? 'Save changes' : 'Add review'}</button></div>}>
        <form id="review-form" onSubmit={submit} noValidate className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Customer name" required htmlFor="r-name"><Input id="r-name" value={form.user_name} onChange={(e) => setForm((f) => ({ ...f, user_name: e.target.value }))} /></Field>
            <Field label="Trip / designation" htmlFor="r-designation" hint="e.g. Family trip · Chitwan"><Input id="r-designation" value={form.designation} onChange={(e) => setForm((f) => ({ ...f, designation: e.target.value }))} /></Field>
          </div>
          <Field label="Review" required htmlFor="r-content"><Textarea id="r-content" rows={4} value={form.content} onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))} placeholder="In the customer's own words" /></Field>
          <div className="grid grid-cols-2 gap-4 items-end">
            <Field label="Rating" htmlFor="r-rating"><Select id="r-rating" value={form.rating} onChange={(e) => setForm((f) => ({ ...f, rating: Number(e.target.value) }))}>{[5, 4, 3, 2, 1].map((r) => <option key={r} value={r}>{r} star{r > 1 ? 's' : ''}</option>)}</Select></Field>
            <Toggle checked={form.is_approved} onChange={(v) => setForm((f) => ({ ...f, is_approved: v }))} label="Visible on website" />
          </div>
          <ImageUploader label="Customer photo (optional)" value={form.image_url ? [form.image_url] : []} onChange={(imgs) => setForm((f) => ({ ...f, image_url: imgs[0] || '' }))} folder="testimonials" max={1} />
        </form>
      </Modal>
      <ConfirmDialog open={!!confirm} danger loading={busyId === confirm?.id} title="Delete this review?" confirmLabel="Delete" message={<>The review from <strong>{confirm?.user_name}</strong> will be removed permanently.</>} onConfirm={remove} onCancel={() => setConfirm(null)} />
    </AdminPage>
  );
};

export default Testimonials;
