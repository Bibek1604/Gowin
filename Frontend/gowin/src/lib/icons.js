import {
  Map, Globe, Sparkles, Plane, FileCheck, ShieldCheck, MapPin, Wallet, MessageCircle,
  Search, CalendarCheck, PlaneTakeoff, Sun, Car, Luggage, Heart, Compass, Mountain,
  TreePalm, Binoculars, Landmark, Waves, Users, Castle, Camera, Tent,
} from 'lucide-react';

/** Lucide icons referenced by name from static content files. */
export const ICONS = {
  Map, Globe, Sparkles, Plane, FileCheck, ShieldCheck, MapPin, Wallet, MessageCircle,
  Search, CalendarCheck, PlaneTakeoff, Sun, Car, Luggage, Heart, Compass, Mountain,
  TreePalm, Binoculars, Landmark, Waves, Users, Castle, Camera, Tent,
};

export const iconFor = (name, fallback = Compass) => ICONS[name] || fallback;

/** Pick a sensible icon for a category by its name. */
export function categoryIcon(name = '') {
  const n = name.toLowerCase();
  if (/wild|safari|jungle/.test(n)) return Binoculars;
  if (/lake|water|river|fall/.test(n)) return Waves;
  if (/beach|island|relax/.test(n)) return TreePalm;
  if (/pilgrim|religio|temple|spirit/.test(n)) return Landmark;
  if (/cultur|heritage|histor/.test(n)) return Castle;
  if (/adventure|extreme|aerial|paraglid|raft/.test(n)) return Mountain;
  if (/family|group/.test(n)) return Users;
  if (/honeymoon|couple|romance/.test(n)) return Heart;
  if (/luxury/.test(n)) return Sparkles;
  if (/city|urban|sightseeing/.test(n)) return Camera;
  if (/nature|scenic|village/.test(n)) return Tent;
  return Compass;
}
