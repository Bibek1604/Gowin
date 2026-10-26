import { supabase } from '../supabaseClient';
import { slugify } from './slugify';

const BUCKET = 'media';
const MAX_WIDTH = 1600;
const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

/**
 * Downscale an image in the browser (max 1600px wide, WebP ~80%) so uploads
 * stay small and pages load fast. Falls back to the original file when the
 * browser cannot encode WebP.
 */
export async function compressImage(file, { maxWidth = MAX_WIDTH, quality = 0.8 } = {}) {
  if (!file.type.startsWith('image/') || file.type === 'image/gif' || file.type === 'image/svg+xml') return file;
  try {
    const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
    const scale = Math.min(1, maxWidth / bitmap.width);
    const width = Math.round(bitmap.width * scale);
    const height = Math.round(bitmap.height * scale);
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    canvas.getContext('2d').drawImage(bitmap, 0, 0, width, height);
    bitmap.close?.();
    const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/webp', quality));
    if (!blob) return file;
    return new File([blob], file.name.replace(/\.[^.]+$/, '') + '.webp', { type: 'image/webp' });
  } catch {
    return file;
  }
}

/**
 * Upload one image to the public `media` bucket and return its public URL.
 * Throws a readable Error on failure (callers show it in a toast).
 */
export async function uploadImage(file, folder = 'uploads') {
  if (!file) throw new Error('No file selected');
  if (!file.type.startsWith('image/')) throw new Error('Only image files can be uploaded');
  if (file.size > MAX_UPLOAD_BYTES) throw new Error('Image is larger than 10 MB');

  const compressed = await compressImage(file);
  const base = slugify(file.name.replace(/\.[^.]+$/, '')) || 'image';
  const ext = compressed.type === 'image/webp' ? 'webp' : (file.name.split('.').pop() || 'jpg').toLowerCase();
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 7)}-${base}.${ext}`;

  const { error } = await supabase.storage.from(BUCKET).upload(path, compressed, {
    contentType: compressed.type || file.type,
    cacheControl: '31536000',
    upsert: false,
  });
  if (error) {
    if (/bucket not found/i.test(error.message)) throw new Error('Storage bucket "media" does not exist yet — apply the database migrations first.');
    if (/row-level security|not authorized|policy/i.test(error.message)) throw new Error('You are not allowed to upload images. Sign in with an admin account.');
    throw new Error(error.message);
  }
  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}

/** Best-effort delete of a file we uploaded (ignores external URLs). */
export async function deleteImageByUrl(url) {
  const marker = `/storage/v1/object/public/${BUCKET}/`;
  const idx = typeof url === 'string' ? url.indexOf(marker) : -1;
  if (idx === -1) return false;
  const path = decodeURIComponent(url.slice(idx + marker.length));
  const { error } = await supabase.storage.from(BUCKET).remove([path]);
  return !error;
}
