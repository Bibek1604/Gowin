/** URL-safe slug: "Pokhara & Sarangkot Escape" → "pokhara-sarangkot-escape". */
export function slugify(text, maxLength = 80) {
  return String(text || '')
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, maxLength)
    .replace(/-+$/g, '');
}

export const isSlug = (value) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(String(value || ''));
