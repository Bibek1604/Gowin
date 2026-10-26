import React, { useEffect, useMemo, useState } from 'react';
import { ChevronDown, ChevronUp, Link2 } from 'lucide-react';
import toast from 'react-hot-toast';
import Modal from '../ui/Modal';
import { Field, Input, Select, Textarea, Toggle } from '../ui/FormField';
import ImageUploader from '../ui/ImageUploader';
import TagListInput from '../ui/TagListInput';
import ItineraryEditor from '../ui/ItineraryEditor';
import usePlaceStore from '../Store/PlaceStore';
import useCategoryStore, { selectActive } from '../Store/CategoryStore';
import { slugify } from '../../lib/slugify';
import { friendlyError } from '../../lib/errors';

const EMPTY = {
  title: '', slug: '', destination_type: 'National', category_id: '', location: '', price: '', duration: '',
  description: '', images: [], image_credit: '', is_published: true, is_featured: false, sort_order: 100,
  details: { best_time: '', highlights: [], inclusions: [], exclusions: [], itinerary: [] },
};

const fromPlace = (p) => ({
  ...EMPTY,
  title: p.title || '', slug: p.slug || '', destination_type: p.destination_type || 'International', category_id: p.category_id || '',
  location: p.location || '', price: p.price ?? '', duration: p.duration || '', description: p.description || '',
  images: p.images || [], image_credit: p.image_credit || '', is_published: p.is_published !== false, is_featured: p.is_featured === true, sort_order: p.sort_order ?? 100,
  details: { ...EMPTY.details, ...(p.details ? { best_time: p.details.best_time || '', highlights: p.details.highlights || [], inclusions: p.details.inclusions || [], exclusions: p.details.exclusions || [], itinerary: p.details.itinerary || [] } : {}) },
});

/** Create / edit modal for a destination or package, including its trip details. */
const DestinationForm = ({ open, onClose, place = null, onSaved }) => {
  const { savePlace, places } = usePlaceStore();
  const { categories } = useCategoryStore();
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [slugTouched, setSlugTouched] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (!open) return;
    setForm(place ? fromPlace(place) : EMPTY);
    setErrors({});
    setSlugTouched(!!place?.slug);
    setShowDetails(!!(place?.details && (place.details.highlights?.length || place.details.itinerary?.length || place.details.inclusions?.length)));
  }, [open, place]);

  const set = (key, value) => { setForm((f) => ({ ...f, [key]: value })); setErrors((e) => ({ ...e, [key]: '' })); };
  const setDetail = (key, value) => setForm((f) => ({ ...f, details: { ...f.details, [key]: value } }));

  const onTitle = (value) => {
    set('title', value);
    if (!slugTouched) setForm((f) => ({ ...f, title: value, slug: slugify(value) }));
  };

  const activeCategories = useMemo(() => {
    const list = selectActive(categories);
    // keep the current (possibly inactive) category selectable while editing
    if (form.category_id && !list.some((c) => c.id === form.category_id)) {
      const current = categories.find((c) => c.id === form.category_id);
      if (current) return [...list, current];
    }
    return list;
  }, [categories, form.category_id]);

  const validate = () => {
    const e = {};
    if (form.title.trim().length < 3) e.title = 'Give the destination a title (at least 3 characters).';
    if (!form.category_id) e.category_id = 'Choose a category.';
    if (form.slug && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(form.slug)) e.slug = 'Use lowercase letters, numbers and hyphens only.';
    if (form.slug && places.some((p) => p.slug === form.slug && p.id !== place?.id)) e.slug = 'Another destination already uses this URL.';
    if (form.price && !/^\s*\$?\s*\d[\d,]*(\.\d+)?\s*$/.test(String(form.price))) e.price = 'Enter a number (e.g. 1299) or leave empty for "price on request".';
    if (form.is_published && form.images.length === 0) e.images = 'Add at least one photo before publishing.';
    if (form.is_published && form.description.trim().length < 40) e.description = 'Write a short description (40+ characters) before publishing.';
    return e;
  };

  const submit = async (ev) => {
    ev.preventDefault();
    if (saving) return;
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); toast.error('Please fix the highlighted fields.'); return; }
    setSaving(true);
    const payload = { ...form, price: String(form.price).replace(/[^0-9.]/g, '') };
    const res = await savePlace(payload, place?.id || null);
    setSaving(false);
    if (!res.success) { toast.error(friendlyError(res.error)); return; }
    toast.success(place ? 'Destination updated' : 'Destination created');
    onSaved?.(res.data);
    onClose();
  };

  return (
    <Modal open={open} onClose={saving ? undefined : onClose} size="lg" title={place ? 'Edit destination' : 'Add destination'} subtitle={place ? `Editing “${place.title}”` : 'Fill in the basics; trip details are optional.'}
      footer={
        <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex gap-5">
            <Toggle checked={form.is_published} onChange={(v) => set('is_published', v)} label="Published" hint={form.is_published ? 'Visible on the website' : 'Hidden (draft / archived)'} />
            <Toggle checked={form.is_featured} onChange={(v) => set('is_featured', v)} label="Featured" hint="Gets a badge and sorts ahead of other packages" />
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={onClose} disabled={saving} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50">Cancel</button>
            <button type="submit" form="destination-form" disabled={saving} className="btn-primary text-sm disabled:opacity-60">{saving ? 'Saving…' : place ? 'Save changes' : 'Create destination'}</button>
          </div>
        </div>
      }>
      <form id="destination-form" onSubmit={submit} noValidate className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Title" required error={errors.title} htmlFor="d-title" className="sm:col-span-2"><Input id="d-title" value={form.title} onChange={(e) => onTitle(e.target.value)} error={errors.title} placeholder="e.g. Kathmandu Valley Heritage Tour" /></Field>
          <Field label="URL slug" error={errors.slug} htmlFor="d-slug" hint={form.slug ? `/places/${form.slug}` : 'Generated from the title'}>
            <div className="relative"><Link2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><Input id="d-slug" value={form.slug} onChange={(e) => { setSlugTouched(true); set('slug', slugify(e.target.value)); }} error={errors.slug} className="!pl-10" placeholder="kathmandu-valley-heritage-tour" /></div>
          </Field>
          <Field label="Region" required htmlFor="d-type">
            <Select id="d-type" value={form.destination_type} onChange={(e) => set('destination_type', e.target.value)}>
              <option value="National">Nepal (domestic)</option>
              <option value="International">International</option>
            </Select>
          </Field>
          <Field label="Category" required error={errors.category_id} htmlFor="d-category">
            <Select id="d-category" value={form.category_id} onChange={(e) => set('category_id', e.target.value)} error={errors.category_id}>
              <option value="">Select a category…</option>
              {activeCategories.map((c) => <option key={c.id} value={c.id}>{c.name}{c.is_active ? '' : ' (inactive)'}</option>)}
            </Select>
          </Field>
          <Field label="Location" htmlFor="d-location" hint='Use "Place, Country" so country filters work'><Input id="d-location" value={form.location} onChange={(e) => set('location', e.target.value)} placeholder="e.g. Pokhara, Nepal" /></Field>
          <Field label="Starting price (USD per person)" error={errors.price} htmlFor="d-price" hint="Leave empty to show “Price on request”"><Input id="d-price" inputMode="decimal" value={form.price} onChange={(e) => set('price', e.target.value)} error={errors.price} placeholder="e.g. 499" /></Field>
          <Field label="Duration" htmlFor="d-duration"><Input id="d-duration" value={form.duration} onChange={(e) => set('duration', e.target.value)} placeholder="e.g. 5 Days / 4 Nights" /></Field>
          <Field label="Display order" htmlFor="d-order" hint="Lower numbers show first on the home page and in listings (1–10 fill the home-page top lists; 100 = default)"><Input id="d-order" type="number" min="0" step="1" inputMode="numeric" value={form.sort_order} onChange={(e) => set('sort_order', e.target.value)} placeholder="100" /></Field>
        </div>
        <Field label="Description" required={form.is_published} error={errors.description} htmlFor="d-description" hint="Shown on the detail page and used for search engines.">
          <Textarea id="d-description" rows={5} value={form.description} onChange={(e) => set('description', e.target.value)} error={errors.description} placeholder="What makes this experience special, what travellers see and do…" />
        </Field>
        <div>
          <ImageUploader value={form.images} onChange={(imgs) => set('images', imgs)} folder="destinations" />
          {errors.images && <p className="text-red-500 text-[11px] mt-1" role="alert">{errors.images}</p>}
        </div>
        <Field label="Photo credit" htmlFor="d-credit" hint="Required for Creative Commons photos, e.g. “Jane Doe, CC BY-SA 4.0, via Wikimedia Commons”."><Input id="d-credit" value={form.image_credit} onChange={(e) => set('image_credit', e.target.value)} placeholder="Optional" /></Field>

        <div className="border border-gray-200 rounded-2xl overflow-hidden">
          <button type="button" onClick={() => setShowDetails((v) => !v)} aria-expanded={showDetails} className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 text-sm font-bold text-[#0F172A]">
            Trip details (optional) — best time, highlights, inclusions, itinerary
            {showDetails ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
          </button>
          {showDetails && (
            <div className="p-4 space-y-5">
              <Field label="Best time to visit" htmlFor="d-best"><Input id="d-best" value={form.details.best_time} onChange={(e) => setDetail('best_time', e.target.value)} placeholder="e.g. October – April" /></Field>
              <TagListInput label="Highlights" value={form.details.highlights} onChange={(v) => setDetail('highlights', v)} placeholder="e.g. Sunrise over the Annapurna range" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <TagListInput label="Included" value={form.details.inclusions} onChange={(v) => setDetail('inclusions', v)} placeholder="e.g. Private vehicle with driver" />
                <TagListInput label="Not included" value={form.details.exclusions} onChange={(v) => setDetail('exclusions', v)} placeholder="e.g. International flights" color="red" />
              </div>
              <ItineraryEditor value={form.details.itinerary} onChange={(v) => setDetail('itinerary', v)} />
            </div>
          )}
        </div>
      </form>
    </Modal>
  );
};

export default DestinationForm;
