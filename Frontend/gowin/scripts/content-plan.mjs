// ============================================================
// GoWin Travels — content correction plan (single source of truth)
//
// Consumed by scripts/migrate-content.mjs (applies it to the live database)
// and by the QA harness (simulates the result for screenshots). Every image
// key refers to supabase/media/manifest.json, whose photos were visually
// verified against the real place before being added.
// ============================================================

export const NEPAL_SEASON = 'October – April';

export const CATEGORIES = [
  { slug: 'cultural',   name: 'Cultural & Heritage',       sort: 10,  image: 'bhaktapur-nyatapola',  description: 'Temples, palaces, living traditions and UNESCO heritage sites.' },
  { slug: 'pilgrimage', name: 'Religious & Pilgrimage',    sort: 20,  image: 'lumbini-maya-devi',    description: 'Sacred sites and spiritual journeys for Hindu and Buddhist travellers.' },
  { slug: 'city',       name: 'City Tours & Sightseeing',  sort: 30,  image: 'singapore-aerial',     description: 'Landmarks, food and culture of the world\'s great cities.' },
  { slug: 'nature',     name: 'Nature & Scenic',           sort: 40,  image: 'rara-lake',            description: 'Hill stations, viewpoints, tea gardens and scenic landscapes.' },
  { slug: 'wildlife',   name: 'Wildlife & Safari',         sort: 50,  image: 'chitwan-rhino-2',      description: 'Jungle safaris and national parks, from rhinos in Chitwan to tigers in Bardia.' },
  { slug: 'lakes',      name: 'Lakes & Waterfalls',        sort: 60,  image: 'phewa-lake',           description: 'Boating, lakeside stays and waterfalls across Nepal.' },
  { slug: 'adventure',  name: 'Adventure Activities',      sort: 70,  image: 'pokhara-paragliding',  description: 'Paragliding, rafting, bungee jumping and scenic flights.' },
  { slug: 'beach',      name: 'Beach & Islands',           sort: 80,  image: 'philippines-el-nido',  description: 'Island escapes, lagoons and beach resorts.' },
  { slug: 'luxury',     name: 'Luxury',                    sort: 90,  image: 'maldives-villas',      description: 'Premium resorts and bespoke experiences.' },
  { slug: 'historical', name: 'Historical Wonders',        sort: 100, image: 'petra-treasury',       description: 'Ancient cities and world-famous monuments.' },
  { slug: 'family',     name: 'Family Holidays',           sort: 110, image: 'chitwan-jeep-safari',  description: 'Relaxed itineraries with activities for every age.' },
  { slug: 'honeymoon',  name: 'Honeymoon & Couples',       sort: 120, image: 'santorini',            description: 'Romantic getaways and couple-friendly stays.' },
];

/** Existing category rows (by id) that become the categories above. */
export const CATEGORY_RENAMES = {
  '16c070c1-9cf7-4e1a-b305-fec6070961e3': 'cultural',
  'a33a63c2-6555-44c5-ba14-d276e9335210': 'pilgrimage',
  'e1aa2001-7c9c-4cb4-97d8-b6c9c6a99de3': 'city',
  '1153de7d-56f3-405c-8816-f7247744e2cc': 'nature',
  '5addf952-d112-4362-bc81-4734a50dce9d': 'wildlife',
  '53225211-32af-486a-907d-ec8a16d5b5d0': 'lakes',
  '8ca469fc-a1b9-4f09-96b7-6173a7b8bea3': 'adventure',
  '78ff959d-f870-4078-a4ee-bd653e1f1146': 'beach',
  '5b5e16f8-65f2-4b60-b181-ccd80e86b7fc': 'luxury',
  'bc6f3878-1e5f-4032-a701-c42cd5b746f5': 'historical',
};

/** Rows to hide (never deleted): trekking/expedition, duplicates, and the six
 *  Philippine destinations that were entered as categories (recreated as packages). */
export const CATEGORY_HIDE = [
  '4651dee4-c4bf-447f-8b6c-0085ef3549d2', // Trekking
  '26aff996-b731-425d-abed-8fdedf065994', // Expedition
  '659e10af-7c77-4975-a690-63f881ae31d4', // relax (typo duplicate)
  'cbb82371-a249-40fd-915f-1bb4698043b4', // Leisure → Nature & Scenic
  'f4ec7bff-7be3-4496-9fcb-214b28bcd90f', // City & Desert → City Tours
  '722c431c-7a04-4761-9c8f-fa8704f93782', // Aerial → Adventure
  '19fd3e4e-ffb9-4ebb-abd7-02b5e9e566d5', // Water → Adventure
  '5ed3fce4-6de0-4e29-8ebf-707fd59e97ed', // Extreme → Adventure
  '9efc8c92-87a8-4994-99a4-40109a9ecdd9', 'd6ce513e-4331-4461-97cf-f28c010d0c00', '6eb127e7-4fa0-4206-87d7-fb159efc7b08',
  '7dfa51fd-25aa-4835-bdbb-c26d09aeba18', 'd035a69d-2679-459c-a332-c8b0d1df78ba', 'f67e00d8-5623-4ba6-be35-27b7567c12bc',
];

/** Packages that stay published, with their corrected data. */
export const KEEP = {
  // ---- Nepal ----
  'bf6ea64d-4242-461a-8ba5-46b9400c3f60': { slug: 'kathmandu-valley-heritage-tour', category: 'cultural', location: 'Kathmandu Valley, Nepal', images: ['kathmandu-boudhanath', 'kathmandu-pashupatinath', 'kathmandu-swayambhunath', 'patan-durbar-square'], featured: true,
    details: { best_time: NEPAL_SEASON, highlights: ['Pashupatinath Temple', 'Boudhanath Stupa', 'Swayambhunath (Monkey Temple)', 'Patan Durbar Square', 'Bhaktapur Durbar Square'] } },
  '38bcbe8d-7f37-4da5-9c45-48f22d348657': { slug: 'bhaktapur-durbar-square-tour', category: 'cultural', location: 'Bhaktapur, Nepal', images: ['bhaktapur-nyatapola'],
    details: { best_time: NEPAL_SEASON, highlights: ['Nyatapola Temple', '55-Window Palace and Golden Gate', 'Pottery Square', 'Dattatreya Square and Peacock Window'] } },
  'cb09b00f-ac33-49c3-bae6-e5f0fedae684': { slug: 'pokhara-sarangkot-escape', category: 'nature', location: 'Pokhara, Nepal', images: ['pokhara-sarangkot-view', 'pokhara-machhapuchhre', 'phewa-lake'], featured: true,
    details: { best_time: NEPAL_SEASON, highlights: ['Sunrise over the Annapurna range from Sarangkot', 'Boating on Phewa Lake to Tal Barahi temple', 'World Peace Pagoda', 'Davis Falls and Gupteshwor Cave', 'Lakeside cafés and markets'] } },
  'b46e58a3-9751-48cf-a86a-80f6776a0aa3': { slug: 'phewa-lake-boating', title: 'Phewa Lake Boating & Tal Barahi Temple', category: 'lakes', location: 'Pokhara, Nepal', images: ['phewa-lake', 'phewa-lake-boats'], details: { best_time: NEPAL_SEASON } },
  '39a6c2de-f4a5-4685-bc24-c6ed757019e6': { slug: 'begnas-rupa-lakes', category: 'lakes', location: 'Kaski, Nepal', images: ['begnas-lake'], details: { best_time: NEPAL_SEASON } },
  '4cf90bb3-6325-47af-be23-48f99986a715': { slug: 'rara-lake-wilderness', category: 'nature', location: 'Rara National Park, Mugu, Nepal', images: ['rara-lake', 'rara-lake-peaks'],
    details: { best_time: 'April – June, September – November', highlights: ['Nepal\'s largest lake at 2,990 m', 'Flight to Talcha airstrip', 'Pine forests of Rara National Park', 'Lakeside camping or lodge stay'] } },
  '7378c17f-7762-4b8a-8ad0-da32d6dbca98': { slug: 'chitwan-jungle-safari', category: 'wildlife', location: 'Chitwan National Park, Nepal', images: ['chitwan-rhino', 'chitwan-jeep-safari', 'chitwan-rhino-2'], featured: true,
    details: { best_time: 'October – March', highlights: ['Jeep safari inside Chitwan National Park', 'One-horned rhinoceros and deer sightings', 'Canoe ride on the Rapti River', 'Tharu village and cultural programme', 'Bird watching'] } },
  '4cd9340a-452f-4a53-b804-bd2e90d951cd': { slug: 'bardiya-wilderness-safari', category: 'wildlife', location: 'Bardiya National Park, Nepal', images: ['bardia-tiger'],
    details: { best_time: 'October – March', highlights: ['Nepal\'s best chances of spotting a Bengal tiger', 'Jeep and walking safaris', 'Karnali River', 'Wild elephants and Gangetic dolphins'] } },
  '9c315995-ced7-4151-af98-313348895bae': { slug: 'lumbini-buddha-circuit', category: 'pilgrimage', location: 'Lumbini, Nepal', images: ['lumbini-maya-devi'], featured: true,
    details: { best_time: NEPAL_SEASON, highlights: ['Maya Devi Temple, birthplace of the Buddha', 'Ashoka Pillar', 'Sacred garden and pond', 'International monastic zone', 'World Peace Pagoda'] } },
  'fff9b142-78da-4a2e-8de5-9ff2293ff927': { slug: 'muktinath-pilgrimage-tour', category: 'pilgrimage', location: 'Muktinath, Mustang, Nepal', images: ['muktinath-temple', 'muktinath-winter'],
    details: { best_time: 'March – June, September – November', highlights: ['Muktinath temple and 108 water spouts', 'Flight or drive via Jomsom', 'Kagbeni village', 'Kali Gandaki valley'] } },
  '2b18a2e1-2b70-4673-bf44-628fa9cab9b9': { slug: 'janakpur-temple-tour', category: 'pilgrimage', location: 'Janakpur, Nepal', images: ['janakpur-janaki-mandir'],
    details: { best_time: 'October – March', highlights: ['Janaki Mandir', 'Ram Mandir and Dhanush Sagar', 'Mithila art and culture'] } },
  'a2a49faf-c158-44a6-a117-253a6be9c2db': { slug: 'nagarkot-dhulikhel-sunrise', category: 'nature', location: 'Nagarkot, Nepal', images: ['nagarkot-himalaya'],
    details: { best_time: NEPAL_SEASON, highlights: ['Himalayan sunrise panorama', 'Village walks between Nagarkot and Dhulikhel', 'Changu Narayan temple'] } },
  '7607720e-3bd4-43ad-acfc-599ef49f67fd': { slug: 'bandipur-tansen-heritage-trail', category: 'cultural', location: 'Bandipur, Tanahun, Nepal', images: ['bandipur-bazaar'],
    details: { best_time: NEPAL_SEASON, highlights: ['Car-free Newari bazaar of Bandipur', 'Bindabasini temple', 'Siddha Gufa cave', 'Tansen\'s Rani Mahal'] } },
  '070de557-1357-40db-89f1-cc05bc612197': { slug: 'ilam-tea-garden-escape', category: 'nature', location: 'Ilam, Nepal', images: ['ilam-tea-garden'],
    details: { best_time: 'March – May, October – November', highlights: ['Kanyam tea gardens', 'Tea factory visit and tasting', 'Antu Danda sunrise'] } },
  '1bfc66ff-1bd7-4117-b68e-e9d77a3435a8': { slug: 'paragliding-pokhara', category: 'adventure', location: 'Sarangkot, Pokhara, Nepal', images: ['pokhara-paragliding'], details: { best_time: 'October – April' } },
  '65b13ed6-73fa-44aa-93b4-d8f732d45841': { slug: 'trishuli-rafting', category: 'adventure', location: 'Trishuli River, Nepal', images: ['trishuli-rafting'], details: { best_time: 'September – December, March – May' } },
  '50178225-dd81-4821-a4d7-231f13d42b85': { slug: 'everest-mountain-flight', category: 'adventure', location: 'Kathmandu, Nepal', images: ['everest-aerial', 'everest-khumbu'], details: { best_time: 'October – April' } },
  '62b6a38c-4949-4f6f-a15f-51821f45f223': { slug: 'bhote-koshi-bungee-jump', category: 'adventure', location: 'Bhote Koshi, Sindhupalchok, Nepal', images: ['bhotekoshi-bridge'] },
  'a6e73b8e-89f4-43c1-82e6-15529baf63d4': { slug: 'kayaking-phewa-lake', category: 'adventure', location: 'Pokhara, Nepal', images: ['phewa-lake-boats', 'phewa-lake'] },
  // ---- International ----
  '6717d38d-f8df-4f52-a5b4-9b1498e9392e': { slug: 'santorini-luxury-escape', category: 'luxury', location: 'Santorini, Greece', images: ['santorini'], featured: true },
  'fa612fde-522e-4441-8030-e5bf5d5af123': { slug: 'bali-island-retreat', category: 'beach', location: 'Bali, Indonesia', images: ['bali-nusa-penida', 'bali-ulun-danu'], featured: true },
  'c7f969a5-aa52-450e-ac88-7de29f6f3183': { slug: 'swiss-alps-adventure', category: 'nature', location: 'Interlaken, Switzerland', images: ['swiss-alps-lake', 'swiss-alps-sunset'] },
  '72cb9551-8149-418e-86b2-df6dd5000f4d': { slug: 'maldives-overwater-villa', category: 'honeymoon', location: 'North Malé Atoll, Maldives', images: ['maldives-villas'], featured: true },
  'de8e77f4-deae-46da-9f43-2bd687b7ff4c': { slug: 'kyoto-cultural-journey', category: 'cultural', location: 'Kyoto, Japan', images: ['kyoto-yasaka', 'japan-fuji'] },
  '780bb99b-e069-4c9a-a175-b29583747f45': { slug: 'kenya-safari', category: 'wildlife', location: 'Maasai Mara, Kenya', images: ['kenya-savanna'] },
  '399eae8c-81b1-410b-b4bb-8d2f153730be': { slug: 'paris-romance-getaway', category: 'honeymoon', location: 'Paris, France', images: ['paris-eiffel-blossom', 'paris-eiffel-seine'] },
  'ff70a388-b496-4f98-908a-04d020bf5875': { slug: 'dubai-desert-skyline', category: 'city', location: 'Dubai, United Arab Emirates', images: ['dubai-skyline', 'dubai-burj'] },
  '322b548e-11e4-4e9d-90f0-b6648a986762': { slug: 'machu-picchu-sacred-valley', title: 'Machu Picchu & Sacred Valley', category: 'historical', location: 'Cusco, Peru', images: ['machu-picchu'],
    description: 'Reach the Inca citadel of Machu Picchu by scenic train from the Sacred Valley, with Cusco\'s colonial streets, Ollantaytambo, Pisac market and Andean villages on a relaxed itinerary — no multi-day hiking required.' },
  '51c4e711-9b2b-4fed-a03d-257ded927b8e': { slug: 'egypt-pyramids-nile-cruise', category: 'historical', location: 'Cairo, Egypt', images: ['egypt-giza'] },
  'f148fa10-0cf8-4c2e-8109-6cb17581d469': { slug: 'venice-canal-romance', category: 'honeymoon', location: 'Venice, Italy', images: ['venice-canal', 'venice-rialto'] },
  'bc3ce086-a9c1-45b2-bbfc-3666a7bd6ae2': { slug: 'sydney-harbour-explorer', category: 'city', location: 'Sydney, Australia', images: ['sydney-opera', 'sydney-harbour'] },
  'c75a08bd-f660-4f95-9655-a99e0cea228c': { slug: 'bangkok-temple-city-tour', category: 'city', location: 'Bangkok, Thailand', images: ['bangkok-wat-arun'] },
  '4493def1-e6fd-4bc5-815a-0d0d0da7e861': { slug: 'petra-jordan-desert', category: 'historical', location: 'Petra, Jordan', images: ['petra-treasury'] },
  '040d8b23-cd18-412e-92b6-039121f6e874': { slug: 'iceland-northern-lights', category: 'nature', location: 'Reykjavik, Iceland', images: ['iceland-aurora'] },
  '35ea099b-2b14-43eb-a433-ec42b9869b1c': { slug: 'singapore-city-escape', category: 'city', location: 'Singapore', images: ['singapore-marina-bay', 'singapore-aerial'] },
  '544ba1e1-77a2-4592-a43d-794781558354': { slug: 'great-wall-of-china-tour', category: 'historical', location: 'Beijing, China', images: ['great-wall'] },
  'bfc7f56a-aea6-4cec-9dd0-a29e470e5ead': { slug: 'barcelona-culture-beach', category: 'city', location: 'Barcelona, Spain', images: ['barcelona-sagrada'] },
  '638842cb-db6a-4815-8d58-6271f066f3bb': { slug: 'amsterdam-canal-discovery', category: 'city', location: 'Amsterdam, Netherlands', images: ['amsterdam-canal'] },
  '94d28185-dfe8-4dfd-83d1-9b775df0f01a': { slug: 'cape-town-adventure', category: 'nature', location: 'Cape Town, South Africa', images: ['cape-town-table-mountain'] },
  'a3abb7b8-377d-4c43-800a-a3118c2b8a61': { slug: 'rome-colosseum-vatican', category: 'historical', location: 'Rome, Italy', images: ['rome-colosseum'] },
  'da04af6b-ea43-4b6b-a576-c52b77732212': { slug: 'new-york-city-highlights', category: 'city', location: 'New York, United States', images: ['new-york-skyline'] },
  '263e0336-f757-4101-86c7-6ec5ba1555d1': { slug: 'phuket-beach-paradise', category: 'beach', location: 'Phuket, Thailand', images: ['phuket-beach', 'thailand-railay'] },
  '32d744da-2b92-4560-9bba-00ab13bc49a8': { slug: 'dubrovnik-coastal-charm', category: 'city', location: 'Dubrovnik, Croatia', images: ['dubrovnik-old-town'] },
  'c15ca688-7b7d-4bb8-ac0b-b57d5938dfac': { slug: 'queenstown-adventure-escape', category: 'adventure', location: 'Queenstown, New Zealand', images: ['queenstown-lakefront'] },
};

/** Unpublished, never deleted: trekking packages, duplicates and test rows (reason shown in logs). */
export const ARCHIVE = {
  '7eb6e033-05c0-400d-ad66-32a6984a9101': 'trekking', '2c9d2354-3e42-4275-a86b-dfa20c413900': 'trekking', 'bec753b9-5970-4506-bdeb-1283d575e8ae': 'trekking',
  'f441ed46-b3a2-4d51-86a3-507f6842661f': 'trekking', '0b41681e-c341-4ea3-8b8e-5d9074c7a20a': 'trekking', '856630e4-b892-4bff-aaf3-28b35d2464fa': 'trekking',
  'abffe54d-89f3-4e4e-adc4-a7140eefa403': 'trekking', 'b2a7f3c8-3860-4982-bb0e-51c491280f06': 'trekking', 'd59d7fca-bae5-4f6d-8187-8bb939b37144': 'trekking',
  '2906c6ec-d8fc-49c4-871f-51b81c3c399a': 'trekking', 'cf11d987-4e95-4392-90d7-6795065dffa7': 'trekking', '91d21446-e1bb-4672-b011-c1494f5724d5': 'trekking',
  '1be1efef-9533-4cb2-b836-ee89a5af851d': 'trekking', '16c3832b-441d-47ba-a0a4-89fa585c5e81': 'trekking', '8835ed9a-c285-4d5a-aec2-75e69e3f2ff8': 'trekking',
  'ebf60526-5cbe-4464-98f3-260a59af95c8': 'trekking', '101bcbfb-52ad-443e-b88c-0dced6f334c9': 'trekking', '301c6528-d78e-4a59-8cc4-e2c5330a8274': 'trekking',
  '5d60f6b9-6d44-41b0-ae02-ab6eb3d044af': 'trekking',
  'bb0a3e4b-5fd2-4201-b2d3-c3e752e4f8a1': 'duplicate of pokhara-sarangkot-escape', '44ee55f0-8e85-4310-ac72-ef5c775c5a5c': 'duplicate of kathmandu-valley-heritage-tour',
  'fb037df9-03c4-4e53-be3a-318a780d4c20': 'duplicate of bandipur-tansen-heritage-trail', 'a310af5e-545f-4b71-82a6-5cb5774c1a9c': 'duplicate of bardiya-wilderness-safari',
  'ed1fa78d-655c-4d20-88dc-434346d88631': 'duplicate of nagarkot-dhulikhel-sunrise', 'b4be411c-7998-400f-853e-42f8644154e0': 'duplicate of lumbini-buddha-circuit',
  '22d3eaf7-3ce8-453e-a279-bd0aa8a3a808': 'duplicate of trishuli-rafting', '4b3503e2-42ad-453e-9bbf-9fe9366a4bbf': 'duplicate of paragliding-pokhara',
  '094fe945-bebd-479b-9989-bd353cff4188': 'duplicate of rara-lake-wilderness', '44e6e7e0-6d26-42a4-9ade-4b3e532651f3': 'duplicate of dubai-desert-skyline',
  '84d96390-2fee-4f20-8dfe-399ba5b9b463': 'test row', '266b848a-c06c-4c48-8adc-08b5b1a8c9c9': 'test row', '6d3d57ee-1c27-4627-95a8-2cf36dbbbb54': 'test row',
};

/** Philippine destinations recreated from the category rows the owner entered. */
export const PHILIPPINES = [
  { catId: '9efc8c92-87a8-4994-99a4-40109a9ecdd9', slug: 'el-nido-big-lagoon', title: 'Big Lagoon, El Nido', location: 'El Nido, Palawan, Philippines', category: 'beach', images: ['philippines-el-nido'] },
  { catId: 'd6ce513e-4331-4461-97cf-f28c010d0c00', slug: 'coron-kayangan-lake', title: 'Kayangan Lake, Coron', location: 'Coron, Palawan, Philippines', category: 'beach', images: ['philippines-coron'] },
  { catId: '6eb127e7-4fa0-4206-87d7-fb159efc7b08', slug: 'bohol-chocolate-hills', title: 'Chocolate Hills, Bohol', location: 'Bohol, Philippines', category: 'nature', images: ['philippines-bohol'] },
  { catId: '7dfa51fd-25aa-4835-bdbb-c26d09aeba18', slug: 'siargao-island', title: 'Siargao Island', location: 'Siargao, Philippines', category: 'beach', images: ['philippines-siargao'] },
  { catId: 'd035a69d-2679-459c-a332-c8b0d1df78ba', slug: 'banaue-rice-terraces', title: 'Banaue Rice Terraces', location: 'Ifugao, Philippines', category: 'nature', images: ['philippines-banaue'] },
  { catId: 'f67e00d8-5623-4ba6-be35-27b7567c12bc', slug: 'manila-heritage', title: 'Manila Heritage & Intramuros', location: 'Manila, Philippines', category: 'cultural', images: ['philippines-manila'] },
];

/** Two classic Nepal products that fill the family and honeymoon categories (price on request). */
export const NEW_NEPAL = [
  { slug: 'nepal-golden-triangle', title: 'Nepal Golden Triangle: Kathmandu, Pokhara & Chitwan', location: 'Kathmandu – Pokhara – Chitwan, Nepal', category: 'family', duration: '7 Days / 6 Nights', images: ['kathmandu-boudhanath', 'pokhara-sarangkot-view', 'chitwan-jeep-safari'], featured: true,
    description: 'Nepal\'s classic first-time itinerary, paced for families and groups: the temples and palace squares of the Kathmandu Valley, the lakes and mountain views of Pokhara, and a jungle safari in Chitwan National Park — with private transport, hotels and guides arranged throughout.',
    details: { best_time: NEPAL_SEASON, highlights: ['Kathmandu Valley heritage sites', 'Sunrise at Sarangkot and boating on Phewa Lake', 'Jeep safari and canoe ride in Chitwan', 'Private vehicle between cities', 'Hotel category of your choice'] } },
  { slug: 'pokhara-honeymoon-escape', title: 'Pokhara Honeymoon Escape', location: 'Pokhara, Nepal', category: 'honeymoon', duration: '4 Days / 3 Nights', images: ['pokhara-machhapuchhre', 'phewa-lake-boats'],
    description: 'A relaxed lakeside stay for couples: sunrise over the Annapurnas from Sarangkot, private boating on Phewa Lake, the World Peace Pagoda and candle-lit dinners by the water, with hotel upgrades and an optional tandem paragliding flight.',
    details: { best_time: NEPAL_SEASON, highlights: ['Lakeside boutique hotel', 'Sunrise excursion to Sarangkot', 'Private boat ride on Phewa Lake', 'World Peace Pagoda at sunset'] } },
];

export const DEV_TEST_TESTIMONIAL_ID = '13d1d1c7-f8ce-4763-9e31-95b5aba2b94a';

export const SETTINGS_DEFAULTS = {
  business_name: 'GoWin International Travel & Tourism', tagline: 'From the Himalayas to the world', phone: '+977 9851410966', whatsapp: '+977 9851410966',
  email: 'Info.gowintravels@gmail.com', address: 'Shankhamul-31, Kathmandu, Nepal', office_hours: 'Sun–Fri, 9:00 am – 6:00 pm NPT',
  facebook_url: 'https://www.facebook.com/share/15cfo9obmC3/', map_query: 'Shankhamul, Kathmandu, Nepal',
  meta_description: 'GoWin International Travel & Tourism, Kathmandu: Nepal cultural tours, pilgrimages, wildlife safaris and lakeside escapes, international holidays, flights, hotels and visa assistance.',
};
