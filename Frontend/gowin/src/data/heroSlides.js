/**
 * Home-page hero backgrounds. Four real photographs, bundled with the site
 * (public/hero/*.webp, 1920×1080) so the hero never depends on the database.
 * Sources and licences: public/hero/manifest.json and supabase/media/sources.json.
 */
export const HERO_SLIDES = [
  {
    id: 'sarangkot',
    image: '/hero/sarangkot-annapurna.webp',
    alt: 'Phewa Lake and the Annapurna range seen from Sarangkot above Pokhara',
    kicker: 'Nepal · Nature & Scenic',
    title: 'Sunrise over the Annapurnas',
    text: 'Phewa Lake, Sarangkot and the mountains above Pokhara, Nepal\'s most relaxed lakeside city.',
    to: '/places/pokhara-sarangkot-escape',
    cta: 'Explore Pokhara',
    credit: 'Saroj Pandey, CC BY-SA 3.0, via Wikimedia Commons',
  },
  {
    id: 'boudhanath',
    image: '/hero/kathmandu-boudhanath.webp',
    alt: 'Boudhanath Stupa surrounded by the rooftops of Kathmandu, seen from above',
    kicker: 'Nepal · Cultural & Heritage',
    title: 'Kathmandu\'s living heritage',
    text: 'Seven UNESCO World Heritage sites in one valley: great stupas, riverside temples and medieval palace squares.',
    to: '/places/kathmandu-valley-heritage-tour',
    cta: 'Kathmandu Valley tour',
    credit: 'Photo via Unsplash',
  },
  {
    id: 'chitwan',
    image: '/hero/chitwan-jeep-safari.webp',
    alt: 'Visitors on an open jeep safari in the grasslands of Chitwan National Park',
    kicker: 'Nepal · Wildlife & Safari',
    title: 'Into the jungle at Chitwan',
    text: 'Jeep safaris, canoe rides and rhino country in Nepal\'s first national park, a UNESCO World Heritage site.',
    to: '/places/chitwan-jungle-safari',
    cta: 'Chitwan safari',
    credit: 'USAID Biodiversity & Forestry, public domain, via Wikimedia Commons',
  },
  {
    id: 'santorini',
    image: '/hero/santorini-oia.webp',
    alt: 'Whitewashed houses of Oia on the caldera cliffs of Santorini at dusk',
    kicker: 'International · Beach & Islands',
    title: 'Holidays beyond Nepal',
    text: 'Beaches, islands and cities across Asia, the Middle East and Europe, with flights, hotels and visas arranged from Kathmandu.',
    to: '/destinations/international',
    cta: 'International holidays',
    credit: 'Photo via Unsplash',
  },
];
