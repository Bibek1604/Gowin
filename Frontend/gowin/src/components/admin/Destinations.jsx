import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus, Edit2, Trash2, Eye, EyeOff, Star, MapPin, Clock, ExternalLink, Archive } from 'lucide-react';
import toast from 'react-hot-toast';
import usePlaceStore from '../Store/PlaceStore';
import useCategoryStore from '../Store/CategoryStore';
import AdminPage, { Toolbar, SearchBox, Chips, ErrorBanner } from './AdminPage';
import DestinationForm from './DestinationForm';
import ConfirmDialog from '../ui/ConfirmDialog';
import EmptyState from '../ui/EmptyState';
import SmartImage from '../ui/SmartImage';
import StatusBadge from '../ui/StatusBadge';
import { CardSkeleton } from '../ui/Skeleton';
import { Select } from '../ui/FormField';
import { formatPrice, coverImage, placePath, isNepal } from '../../lib/format';
import { friendlyError } from '../../lib/errors';

const Destinations = () => {
  const { places, isLoading, loaded, error, patchPlace, deletePlace } = usePlaceStore();
  const { categories } = useCategoryStore();
  const [params, setParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('published');
  const [region, setRegion] = useState('all');
  const [category, setCategory] = useState('');
  const [editing, setEditing] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [confirm, setConfirm] = useState(null);
  const [busyId, setBusyId] = useState(null);

  useEffect(() => { if (params.get('new') === '1') { setEditing(null); setFormOpen(true); setParams({}, { replace: true }); } }, [params, setParams]);

  const counts = useMemo(() => ({
    published: places.filter((p) => p.is_published).length,
    unpublished: places.filter((p) => !p.is_published).length,
    featured: places.filter((p) => p.is_featured).length,
    all: places.length,
  }), [places]);

  const list = useMemo(() => {
    const q = search.trim().toLowerCase();
    return places.filter((p) => {
      if (status === 'published' && !p.is_published) return false;
      if (status === 'unpublished' && p.is_published) return false;
      if (status === 'featured' && !p.is_featured) return false;
      if (region === 'nepal' && !isNepal(p)) return false;
      if (region === 'international' && isNepal(p)) return false;
      if (category && p.category_id !== category) return false;
      if (q && !(p.title?.toLowerCase().includes(q) || p.location?.toLowerCase().includes(q) || p.categories?.name?.toLowerCase().includes(q))) return false;
      return true;
    });
  }, [places, status, region, category, search]);

  const toggle = async (p, field) => {
    setBusyId(p.id);
    const res = await patchPlace(p.id, { [field]: !p[field] });
    setBusyId(null);
    if (!res.success) { toast.error(friendlyError(res.error)); return; }
    if (field === 'is_published') toast.success(res.data.is_published ? 'Published — now visible on the website' : 'Unpublished — hidden from visitors');
    else toast.success(res.data.is_featured ? 'Added to featured' : 'Removed from featured');
  };

  const remove = async () => {
    if (!confirm) return;
    setBusyId(confirm.id);
    const res = await deletePlace(confirm.id);
    setBusyId(null);
    setConfirm(null);
    if (res.success) toast.success('Destination deleted permanently');
    else toast.error(friendlyError(res.error));
  };

  return (
    <AdminPage title="Destinations & packages" subtitle="Everything visitors can browse. Unpublish to hide a destination without losing it."
      actions={<button type="button" onClick={() => { setEditing(null); setFormOpen(true); }} className="btn-primary text-sm"><Plus className="w-4 h-4" /> Add destination</button>}>
      <ErrorBanner error={error && friendlyError({ message: error })} />
      <Toolbar>
        <SearchBox value={search} onChange={setSearch} placeholder="Search by title, location or category…" />
        <Chips value={status} onChange={setStatus} options={[{ value: 'published', label: 'Published', count: counts.published }, { value: 'unpublished', label: 'Unpublished', count: counts.unpublished }, { value: 'featured', label: 'Featured', count: counts.featured }, { value: 'all', label: 'All', count: counts.all }]} />
        <div className="flex gap-2">
          <Select value={region} onChange={(e) => setRegion(e.target.value)} className="!py-2 !w-auto text-xs font-semibold" aria-label="Region"><option value="all">All regions</option><option value="nepal">Nepal</option><option value="international">International</option></Select>
          <Select value={category} onChange={(e) => setCategory(e.target.value)} className="!py-2 !w-auto text-xs font-semibold" aria-label="Category"><option value="">All categories</option>{categories.map((c) => <option key={c.id} value={c.id}>{c.name}{c.is_active ? '' : ' (inactive)'}</option>)}</Select>
        </div>
      </Toolbar>

      {isLoading && !loaded ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4"><CardSkeleton count={8} className="h-72" /></div>
      ) : list.length === 0 ? (
        <EmptyState icon={MapPin} title={places.length === 0 ? 'No destinations yet' : 'Nothing matches these filters'} text={places.length === 0 ? 'Create your first destination to start building the catalogue.' : 'Try another status, region or search term.'}
          action={<button type="button" onClick={() => { setEditing(null); setFormOpen(true); }} className="btn-primary text-sm"><Plus className="w-4 h-4" /> Add destination</button>} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
          {list.map((p) => (
            <article key={p.id} className={`bg-white rounded-2xl border shadow-sm overflow-hidden flex flex-col ${p.is_published ? 'border-gray-100' : 'border-dashed border-gray-300 opacity-90'}`}>
              <div className="relative h-44 bg-gray-100">
                <SmartImage src={coverImage(p)} alt="" className="w-full h-full object-cover" />
                <div className="absolute top-2.5 left-2.5 right-2.5 flex items-start justify-between gap-2">
                  <StatusBadge status={p.is_published ? 'Published' : 'Archived'} />
                  {p.is_featured && <StatusBadge status="Featured" />}
                </div>
                <span className="absolute bottom-2.5 left-2.5 text-[10px] font-bold text-white bg-[#0F172A]/70 backdrop-blur px-2 py-1 rounded-md">{isNepal(p) ? 'Nepal' : 'International'} · {p.categories?.name || 'No category'}</span>
                {p.images.length > 1 && <span className="absolute bottom-2.5 right-2.5 text-[10px] font-bold text-white bg-[#0F172A]/70 backdrop-blur px-2 py-1 rounded-md">{p.images.length} photos</span>}
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="font-bold text-[#0F172A] text-sm leading-snug line-clamp-2">{p.title}</h3>
                <p className="text-xs text-gray-500 mt-1 flex items-center gap-1 truncate"><MapPin className="w-3 h-3 flex-shrink-0" />{p.location || 'No location'}</p>
                <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1"><Clock className="w-3 h-3 flex-shrink-0" />{p.duration || 'Flexible'} · <span className="font-semibold text-[#1E3A8A]">{formatPrice(p.price) || 'On request'}</span></p>
                {!p.slug && <p className="text-[10px] text-amber-600 mt-1">No URL slug yet — save once to generate.</p>}
                <div className="mt-auto pt-3 border-t border-gray-100 grid grid-cols-4 gap-1.5 mt-3">
                  <button type="button" onClick={() => { setEditing(p); setFormOpen(true); }} className="col-span-2 inline-flex items-center justify-center gap-1 py-2 rounded-lg text-xs font-semibold text-[#1E3A8A] bg-[#1E3A8A]/5 hover:bg-[#1E3A8A] hover:text-white transition-colors"><Edit2 className="w-3.5 h-3.5" /> Edit</button>
                  <button type="button" onClick={() => toggle(p, 'is_published')} disabled={busyId === p.id} title={p.is_published ? 'Unpublish' : 'Publish'} aria-label={p.is_published ? 'Unpublish' : 'Publish'} className="inline-flex items-center justify-center py-2 rounded-lg text-xs font-semibold text-gray-600 bg-gray-50 hover:bg-gray-200 transition-colors disabled:opacity-50">{p.is_published ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}</button>
                  <button type="button" onClick={() => toggle(p, 'is_featured')} disabled={busyId === p.id} title={p.is_featured ? 'Remove from featured' : 'Feature on home page'} aria-label="Toggle featured" className={`inline-flex items-center justify-center py-2 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50 ${p.is_featured ? 'text-[#B45309] bg-[#FBBF24]/20 hover:bg-[#FBBF24]/40' : 'text-gray-600 bg-gray-50 hover:bg-gray-200'}`}><Star className={`w-3.5 h-3.5 ${p.is_featured ? 'fill-current' : ''}`} /></button>
                  {p.is_published && p.slug && <a href={placePath(p)} target="_blank" rel="noopener noreferrer" className="col-span-2 inline-flex items-center justify-center gap-1 py-2 rounded-lg text-xs font-semibold text-gray-600 bg-gray-50 hover:bg-gray-200 transition-colors"><ExternalLink className="w-3.5 h-3.5" /> View on site</a>}
                  {!p.is_published && <span className="col-span-2 inline-flex items-center justify-center gap-1 py-2 rounded-lg text-xs text-gray-400 bg-gray-50"><Archive className="w-3.5 h-3.5" /> Hidden from site</span>}
                  <button type="button" onClick={() => setConfirm(p)} className="col-span-2 inline-flex items-center justify-center gap-1 py-2 rounded-lg text-xs font-semibold text-red-500 bg-red-50 hover:bg-red-500 hover:text-white transition-colors"><Trash2 className="w-3.5 h-3.5" /> Delete</button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      <DestinationForm open={formOpen} onClose={() => setFormOpen(false)} place={editing} />
      <ConfirmDialog open={!!confirm} danger loading={busyId === confirm?.id} title="Delete this destination permanently?" confirmLabel="Delete permanently"
        message={<>“{confirm?.title}” and its trip details will be removed from the database. Bookings that mention it are kept. If you only want to hide it, cancel and use <strong>Unpublish</strong> instead.</>}
        onConfirm={remove} onCancel={() => setConfirm(null)} />
    </AdminPage>
  );
};

export default Destinations;
