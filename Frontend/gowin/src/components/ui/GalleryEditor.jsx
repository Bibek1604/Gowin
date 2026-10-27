import React, { useRef, useState } from 'react';
import { Upload, X, ChevronUp, ChevronDown, Link2, Star, Loader2, AlertTriangle, Pencil, Check, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';
import { uploadImage } from '../../lib/storage';
import { PLACEHOLDER_IMG } from '../../lib/placeholder';
import { probeImage } from '../../lib/images';

const isHttp = (u) => /^https?:\/\/\S+$/i.test(u || '');
const small = 'w-full px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs text-[#0F172A] placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#10B981]/25';

const Thumb = ({ url, alt }) => {
  const [failed, setFailed] = useState(false);
  return (
    <>
      <img src={failed || !url ? PLACEHOLDER_IMG : url} alt={alt || ''} loading="lazy" decoding="async" className="w-full h-full object-cover" onError={() => setFailed(true)} />
      {failed && (
        <span className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-1 bg-red-600/90 text-white text-[9px] font-bold py-0.5" role="alert">
          <AlertTriangle className="w-2.5 h-2.5" /> Not loading
        </span>
      )}
    </>
  );
};

const IconButton = ({ onClick, disabled, label, className = '', children }) => (
  <button type="button" onClick={onClick} disabled={disabled} aria-label={label} title={label}
    className={`w-7 h-7 rounded-md border border-gray-200 bg-white text-gray-600 hover:text-[#1E3A8A] hover:border-[#1E3A8A]/30 flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed ${className}`}>
    {children}
  </button>
);

const PhotoRow = ({ photo, index, count, onChange, onMove, onRemove, onCover }) => {
  const [editUrl, setEditUrl] = useState(false);
  const [draft, setDraft] = useState(photo.url);
  const [checking, setChecking] = useState(false);

  const saveUrl = async () => {
    const url = draft.trim();
    if (!isHttp(url)) { toast.error('Enter a full link starting with https://'); return; }
    setChecking(true);
    const ok = await probeImage(url);
    setChecking(false);
    if (!ok) { toast.error('That link does not load as an image.'); return; }
    onChange({ ...photo, url });
    setEditUrl(false);
  };

  return (
    <li className="flex gap-3 p-3 rounded-xl border border-gray-200 bg-white">
      <div className="relative w-28 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
        <Thumb url={photo.url} alt={photo.alt_text} />
        {index === 0 && (
          <span className="absolute top-1.5 left-1.5 inline-flex items-center gap-1 bg-[#FBBF24] text-[#0F172A] text-[9px] font-bold px-1.5 py-0.5 rounded-md shadow">
            <Star className="w-2.5 h-2.5 fill-current" /> Cover
          </span>
        )}
      </div>
      <div className="flex-1 min-w-0 space-y-1.5">
        {editUrl ? (
          <div className="flex gap-1.5">
            <input value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); saveUrl(); } }} aria-label="Photo link" className={small} placeholder="https://…/photo.jpg" />
            <IconButton onClick={saveUrl} label="Save link" disabled={checking}>{checking ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}</IconButton>
            <IconButton onClick={() => setEditUrl(false)} label="Cancel"><X className="w-3.5 h-3.5" /></IconButton>
          </div>
        ) : (
          <p className="flex items-center gap-1.5 text-[11px] text-gray-500 min-w-0">
            <a href={photo.url} target="_blank" rel="noopener noreferrer" className="truncate hover:text-[#1E3A8A] inline-flex items-center gap-1 min-w-0"><span className="truncate">{photo.url}</span><ExternalLink className="w-3 h-3 flex-shrink-0" /></a>
            <button type="button" onClick={() => { setDraft(photo.url); setEditUrl(true); }} aria-label="Replace link" title="Replace link" className="flex-shrink-0 text-gray-400 hover:text-[#1E3A8A]"><Pencil className="w-3 h-3" /></button>
          </p>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5">
          <input aria-label="Alt text" value={photo.alt_text || ''} onChange={(e) => onChange({ ...photo, alt_text: e.target.value })} placeholder="Alt text — what the photo shows" className={small} />
          <input aria-label="Photo credit" value={photo.credit || ''} onChange={(e) => onChange({ ...photo, credit: e.target.value })} placeholder="Credit — photographer, licence" className={small} />
          <input aria-label="Source page" value={photo.source_url || ''} onChange={(e) => onChange({ ...photo, source_url: e.target.value })} placeholder="Source page (https://…)" className={small} />
        </div>
      </div>
      <div className="flex flex-col gap-1 flex-shrink-0">
        {index !== 0 && <IconButton onClick={onCover} label="Use as cover"><Star className="w-3.5 h-3.5" /></IconButton>}
        <IconButton onClick={() => onMove(-1)} disabled={index === 0} label="Move up"><ChevronUp className="w-3.5 h-3.5" /></IconButton>
        <IconButton onClick={() => onMove(1)} disabled={index === count - 1} label="Move down"><ChevronDown className="w-3.5 h-3.5" /></IconButton>
        <IconButton onClick={onRemove} label="Remove photo" className="!text-red-500 hover:!border-red-300"><X className="w-3.5 h-3.5" /></IconButton>
      </div>
    </li>
  );
};

/**
 * Photo gallery field for a destination. Each entry is a link to a photo with
 * its alt text, credit and source page: { url, alt_text, credit, source_url }.
 * Links are checked in the browser before they are added; uploads go to the
 * media bucket and become links too. The first photo is the cover.
 */
const GalleryEditor = ({ value = [], onChange, folder = 'destinations', max = 10, label = 'Photos' }) => {
  const photos = Array.isArray(value) ? value : [];
  const inputRef = useRef(null);
  const [draft, setDraft] = useState('');
  const [adding, setAdding] = useState(false);
  const [uploading, setUploading] = useState(0);

  const update = (i, next) => onChange(photos.map((p, k) => (k === i ? next : p)));
  const move = (i, dir) => {
    const j = i + dir;
    if (j < 0 || j >= photos.length) return;
    const next = [...photos];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };
  const cover = (i) => onChange([photos[i], ...photos.filter((_, k) => k !== i)]);
  const remove = (i) => onChange(photos.filter((_, k) => k !== i));

  const addLink = async () => {
    const url = draft.trim();
    if (!isHttp(url)) { toast.error('Paste the full link to a photo, starting with https://'); return; }
    if (photos.some((p) => p.url === url)) { toast.error('That photo is already in the list.'); return; }
    if (photos.length >= max) { toast.error(`You can add up to ${max} photos.`); return; }
    setAdding(true);
    const ok = await probeImage(url);
    setAdding(false);
    if (!ok) { toast.error('That link does not load as an image. Use the direct link to the photo file (ending in .jpg, .png or .webp), not a web page.'); return; }
    onChange([...photos, { url, alt_text: '', credit: '', source_url: '' }]);
    setDraft('');
    toast.success('Photo added — now describe it in the alt text');
  };

  const addFiles = async (files) => {
    const list = Array.from(files || []).slice(0, Math.max(0, max - photos.length));
    if (!list.length) { toast.error(`You can add up to ${max} photos.`); return; }
    setUploading(list.length);
    const added = [];
    for (const file of list) {
      try {
        added.push({ url: await uploadImage(file, folder), alt_text: '', credit: '', source_url: '' });
      } catch (e) {
        toast.error(`${file.name}: ${e.message}`);
      } finally {
        setUploading((n) => n - 1);
      }
    }
    if (added.length) {
      onChange([...photos, ...added]);
      toast.success(`${added.length} photo${added.length > 1 ? 's' : ''} uploaded`);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs font-semibold text-[#1E3A8A]">{label} <span className="text-gray-400 font-normal">({photos.length}/{max}) — the first photo is the cover</span></span>
      </div>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addLink(); } }} aria-label="Photo link"
            placeholder="https://upload.wikimedia.org/…/photo.jpg" className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#10B981]/25" />
        </div>
        <button type="button" onClick={addLink} disabled={adding || photos.length >= max} className="px-4 py-2 rounded-xl bg-[#1E3A8A] text-white text-xs font-semibold inline-flex items-center gap-1.5 disabled:opacity-60">
          {adding ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Link2 className="w-3.5 h-3.5" />} Add link
        </button>
        <button type="button" onClick={() => inputRef.current?.click()} disabled={uploading > 0 || photos.length >= max} className="px-4 py-2 rounded-xl border border-gray-200 text-[#1E3A8A] text-xs font-semibold inline-flex items-center gap-1.5 hover:bg-gray-50 disabled:opacity-60">
          {uploading > 0 ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />} {uploading > 0 ? `Uploading ${uploading}…` : 'Upload'}
        </button>
      </div>
      <p className="text-[11px] text-gray-400 mt-1.5">Paste the direct link to a photo (Wikimedia Commons, Unsplash or your own hosting). The link is checked before it is added. Give every photo alt text (what it shows); Creative Commons photos also need the photographer and licence as credit.</p>

      {photos.length > 0 ? (
        <ul className="space-y-2 mt-3" data-gallery="photos">
          {photos.map((p, i) => (
            <PhotoRow key={`${p.url}-${i}`} photo={p} index={i} count={photos.length} onChange={(next) => update(i, next)} onMove={(dir) => move(i, dir)} onRemove={() => remove(i)} onCover={() => cover(i)} />
          ))}
        </ul>
      ) : (
        <div className="mt-3 rounded-xl border-2 border-dashed border-gray-200 p-5 text-center text-xs text-gray-400" onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); addFiles(e.dataTransfer.files); }}>
          No photos yet — add a link above or drop image files here.
        </div>
      )}
      <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => { addFiles(e.target.files); e.target.value = ''; }} />
    </div>
  );
};

export default GalleryEditor;
