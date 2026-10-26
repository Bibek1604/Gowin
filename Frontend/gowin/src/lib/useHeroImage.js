import { useMemo } from 'react';
import usePlaceStore, { selectPublished } from '../components/Store/PlaceStore';
import { coverImage, isNepal } from './format';

/** Picks a real, published package photo for page banners (preferring a title match). */
export function useHeroImage(pattern, { nepalOnly = false } = {}) {
  const { places } = usePlaceStore();
  return useMemo(() => {
    const pool = selectPublished(places).filter((p) => coverImage(p) && (!nepalOnly || isNepal(p)));
    const match = pattern ? pool.find((p) => pattern.test(p.title) || pattern.test(p.location || '')) : null;
    return coverImage(match || pool[0]) || null;
  }, [places, pattern, nepalOnly]);
}
