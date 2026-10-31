import React, { useRef, useState } from 'react';
import { Upload, X, ChevronLeft, ChevronRight, Link2, Star, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { uploadImage } from '../../lib/storage';
import SmartImage from './SmartImage';

/**
 * Multi-image field. Uploads go to Supabase Storage (resized in the browser),
 * the first image is the cover, and images can be re-ordered or removed.
 * `value` is an array of public URLs; `onChange` receives the new array.
 */
const ImageUploader = ({ value = [], onChange, folder = 'destinations', max = 8, label = 'Images' }) => {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(0);
  const [urlMode, setUrlMode] = useState(false);
  const [urlDraft, setUrlDraft] = useState('');

  const images = Array.isArray(value) ? value : [];

  const addFiles = async (files) => {
    const list = Array.from(files || []).slice(0, Math.max(0, max - images.length));
    if (!list.length) { toast.error(`You can add up to ${max} images.`); return; }
    setUploading(list.length);
    const added = [];
    for (const file of list) {
      try {
        added.push(await uploadImage(file, folder));
      } catch (e) {
        toast.error(`${file.name}: ${e.message}`);
      } finally {
        setUploading((n) => n - 1);
      }
    }
    if (added.length) {
      onChange([...images, ...added]);
      toast.success(`${added.length} image${added.length > 1 ? 's' : ''} uploaded`);
    }
  };

  const move = (i, dir) => {
    const j = i + dir;
    if (j < 0 || j >= images.length) return;
    const next = [...images];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };

  const addUrl = () => {
    const url = urlDraft.trim();
    if (!/^https?:\/\/.+/i.test(url)) { toast.error('Enter a full image URL starting with https://'); return; }
    onChange([...images, url]);
    setUrlDraft('');
    setUrlMode(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs font-semibold text-[#1E3A8A]">{label} <span className="text-gray-400 font-normal">({images.length}/{max}) — first image is the cover</span></span>
        <button type="button" onClick={() => setUrlMode((v) => !v)} className="text-[11px] font-semibold text-gray-500 hover:text-[#1E3A8A] flex items-center gap-1">
          <Link2 className="w-3 h-3" /> {urlMode ? 'Cancel' : 'Add by URL'}
        </button>
      </div>

      {urlMode && (
        <div className="flex gap-2 mb-3">
          <input value={urlDraft} onChange={(e) => setUrlDraft(e.target.value)} placeholder="https://…/photo.jpg"
            className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981]/25" />
          <button type="button" onClick={addUrl} className="px-4 py-2 rounded-xl bg-[#1E3A8A] text-white text-xs font-semibold">Add</button>
        </div>
      )}

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
        {images.map((url, i) => (
          <div key={`${url}-${i}`} className="relative group aspect-[4/3] rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
            <SmartImage src={url} sizes="160px" alt={`Image ${i + 1}`} className="w-full h-full object-cover" />
            {i === 0 && (
              <span className="absolute top-1.5 left-1.5 inline-flex items-center gap-1 bg-[#FBBF24] text-[#0F172A] text-[9px] font-bold px-1.5 py-0.5 rounded-md shadow">
                <Star className="w-2.5 h-2.5 fill-current" /> Cover
              </span>
            )}
            <div className="absolute inset-x-0 bottom-0 flex items-center justify-between p-1.5 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
              <button type="button" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move left" className="w-6 h-6 rounded-md bg-white/90 text-[#0F172A] flex items-center justify-center disabled:opacity-30"><ChevronLeft className="w-3.5 h-3.5" /></button>
              <button type="button" onClick={() => onChange(images.filter((_, k) => k !== i))} aria-label="Remove image" className="w-6 h-6 rounded-md bg-red-500 text-white flex items-center justify-center"><X className="w-3.5 h-3.5" /></button>
              <button type="button" onClick={() => move(i, 1)} disabled={i === images.length - 1} aria-label="Move right" className="w-6 h-6 rounded-md bg-white/90 text-[#0F172A] flex items-center justify-center disabled:opacity-30"><ChevronRight className="w-3.5 h-3.5" /></button>
            </div>
          </div>
        ))}

        {images.length < max && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading > 0}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => { e.preventDefault(); addFiles(e.dataTransfer.files); }}
            className="aspect-[4/3] rounded-xl border-2 border-dashed border-gray-200 hover:border-[#10B981]/50 hover:bg-[#10B981]/5 transition-colors flex flex-col items-center justify-center gap-1 text-gray-400 hover:text-[#10B981] disabled:opacity-60"
          >
            {uploading > 0 ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
            <span className="text-[10px] font-semibold uppercase tracking-wider">{uploading > 0 ? `Uploading ${uploading}…` : 'Upload'}</span>
          </button>
        )}
      </div>
      <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => { addFiles(e.target.files); e.target.value = ''; }} />
      <p className="text-[11px] text-gray-400 mt-2">JPG, PNG or WebP up to 10 MB. Images are resized to 1600px and stored in your own media library.</p>
    </div>
  );
};

export default ImageUploader;
