// ============================================================
// GoWin Travels — static site copy that is not stored in the database.
// Destination, category, testimonial and contact data all come from Supabase;
// nothing here is used as a stand-in for missing records.
// ============================================================

/** Contact defaults used until site_settings has been loaded (and as fallback). */
export const DEFAULT_SETTINGS = {
  business_name: 'GoWin International Travel & Tourism',
  tagline: 'From the Himalayas to the world',
  phone: '+977 9851410966',
  whatsapp: '+977 9851410966',
  email: 'Info.gowintravels@gmail.com',
  address: 'Shankhamul-31, Kathmandu, Nepal',
  office_hours: 'Sun–Fri, 9:00 am – 6:00 pm NPT',
  facebook_url: 'https://www.facebook.com/share/15cfo9obmC3/',
  instagram_url: '',
  tiktok_url: '',
  youtube_url: '',
  map_query: 'Shankhamul, Kathmandu, Nepal',
  meta_title: '',
  meta_description: '',
};

/** Services the business actually provides (as stated in its own policies). */
export const SERVICES = [
  {
    slug: 'nepal-tours',
    title: 'Nepal Tours & Experiences',
    short: 'Heritage, pilgrimage, wildlife, lakes and scenic escapes across Nepal.',
    desc: 'Day tours and multi-day packages around Kathmandu, Pokhara, Chitwan, Lumbini and beyond — private vehicles, licensed guides and hotels arranged for you.',
    icon: 'Map',
    link: '/destinations/national',
    cta: 'Browse Nepal tours',
  },
  {
    slug: 'international-holidays',
    title: 'International Holiday Packages',
    short: 'Curated holidays in Asia, the Middle East, Europe and beyond.',
    desc: 'Beach escapes, city breaks, honeymoons and family holidays with flights, hotels and transfers coordinated end to end.',
    icon: 'Globe',
    link: '/destinations/international',
    cta: 'Browse world holidays',
  },
  {
    slug: 'custom-itineraries',
    title: 'Customised Itineraries',
    short: 'Tell us your dates, group and budget — we design the trip around you.',
    desc: 'Family holidays, couple getaways, corporate retreats and group tours tailored to your pace and interests, domestic or international.',
    icon: 'Sparkles',
    link: '/booking',
    cta: 'Plan a custom trip',
  },
  {
    slug: 'flights-hotels',
    title: 'Flight Tickets & Hotel Reservations',
    short: 'Domestic and international air tickets plus hotel bookings.',
    desc: 'We book airline tickets and hotels through our partner network and keep you informed of airline and hotel terms before you pay.',
    icon: 'Plane',
    link: '/contact',
    cta: 'Request a quote',
  },
  {
    slug: 'visa-assistance',
    title: 'Visa Application Assistance',
    short: 'Document preparation and appointment support for your visa.',
    desc: 'Consultation, document checklists, application preparation and visa-centre (including VFS) appointment assistance. Visa decisions rest with the embassy; our service fees cover the professional assistance.',
    icon: 'FileCheck',
    link: '/contact',
    cta: 'Ask about visas',
  },
  {
    slug: 'travel-insurance',
    title: 'Travel Insurance',
    short: 'Insurance arranged through partner providers for your trip.',
    desc: 'We help you choose and purchase travel insurance from partner insurers. Coverage and refunds follow the insurer\'s policy terms.',
    icon: 'ShieldCheck',
    link: '/contact',
    cta: 'Get insurance help',
  },
];

export const WHY_CHOOSE_US = [
  { icon: 'MapPin', title: 'Kathmandu-based team', desc: 'A registered Nepali travel company you can call, message or visit at our Shankhamul office.' },
  { icon: 'Globe', title: 'Nepal and the world', desc: 'Domestic tours plus international holidays, flights, hotels and visa assistance under one roof.' },
  { icon: 'Sparkles', title: 'Built around you', desc: 'Every itinerary can be customised — dates, hotels, pace and budget are adjusted to suit your group.' },
  { icon: 'Wallet', title: 'Clear quotations', desc: 'You receive a written quote with inclusions and exclusions before any payment is made.' },
  { icon: 'MessageCircle', title: 'Fast, personal replies', desc: 'Reach us on WhatsApp, phone or email and speak to the people who plan your trip.' },
  { icon: 'FileCheck', title: 'Paperwork handled', desc: 'Permits, tickets, hotel vouchers and visa documents are prepared and checked for you.' },
];

export const HOW_IT_WORKS = [
  { num: '01', icon: 'Search', title: 'Choose or describe', desc: 'Pick a package or tell us the kind of trip you have in mind.' },
  { num: '02', icon: 'MessageCircle', title: 'Receive a quote', desc: 'We confirm availability and send a written itinerary with the price and what it includes.' },
  { num: '03', icon: 'CalendarCheck', title: 'Confirm your booking', desc: 'Once you approve, we secure hotels, transport and tickets and share your documents.' },
  { num: '04', icon: 'PlaneTakeoff', title: 'Travel with support', desc: 'Our team stays reachable throughout your trip for any change or question.' },
];

export const FAQS = [
  {
    q: 'How do I book a tour?',
    a: 'Send a booking request from any package page or the Book Now form. We reply with availability and a written quotation; nothing is charged until you confirm.',
  },
  {
    q: 'Can you customise a package?',
    a: 'Yes. Dates, hotel category, group size, transport and activities can all be adjusted. Use the custom trip option on the booking form.',
  },
  {
    q: 'Do you arrange flights, hotels and visas?',
    a: 'Yes — we book domestic and international air tickets and hotels, and assist with visa applications and appointment bookings. Visa approval itself is decided by the embassy.',
  },
  {
    q: 'What is your refund policy?',
    a: 'Refunds for tickets, hotels and tour services follow the terms of the airline, hotel or operator concerned; our service and consultation fees are non-refundable. Full details are on the Refund Policy page.',
  },
  {
    q: 'How can I pay?',
    a: 'Payment details are provided with your confirmation. We do not take online payments through this website.',
  },
  {
    q: 'Do I need travel insurance?',
    a: 'We strongly recommend it and can arrange cover through partner insurers. Policy terms and claims are handled by the insurer.',
  },
];

export const NEPAL_TRAVEL_TIPS = [
  {
    title: 'Best time to visit Nepal',
    icon: 'Sun',
    points: [
      'October–November: clear skies, festival season (Dashain and Tihar) and the best mountain views.',
      'March–April: warm, rhododendrons in bloom, good for Chitwan and Pokhara.',
      'June–September: monsoon — lush and quiet, but expect rain and cloud over the peaks.',
      'December–February: cool and clear in the hills; Terai parks like Chitwan and Bardia are pleasant.',
    ],
  },
  {
    title: 'Visa on arrival',
    icon: 'FileCheck',
    points: [
      'Most nationalities can obtain a tourist visa on arrival at Tribhuvan International Airport and land borders.',
      'Carry a passport valid for at least six months, a passport photo and the fee in cash (USD is accepted).',
      'Fees and eligible nationalities change — confirm with the Department of Immigration before you fly. We help our clients with the paperwork.',
    ],
  },
  {
    title: 'Getting around',
    icon: 'Car',
    points: [
      'Kathmandu–Pokhara is about 25 minutes by air or 6–8 hours by road; Chitwan is roughly 5 hours by road from either city.',
      'Private vehicles with a driver are the most comfortable option for families and groups; tourist buses are economical.',
      'Domestic flights depend on weather — keep a buffer day before international departures.',
    ],
  },
  {
    title: 'Packing essentials',
    icon: 'Luggage',
    points: [
      'Layers: mornings and evenings are cool in the hills even when days are warm.',
      'Comfortable walking shoes, sun protection, a reusable water bottle and any personal medication.',
      'Modest clothing for temples and monasteries; remove shoes and leather items where required.',
    ],
  },
  {
    title: 'Money and connectivity',
    icon: 'Wallet',
    points: [
      'The currency is the Nepali rupee (NPR); ATMs are common in cities, less so in rural areas.',
      'Local SIM cards (Ncell, Nepal Telecom) are inexpensive and available at the airport with your passport.',
      'Tipping guides and drivers is customary but not compulsory.',
    ],
  },
  {
    title: 'Respecting local culture',
    icon: 'Heart',
    points: [
      'Walk clockwise around stupas and prayer wheels; ask before photographing people and rituals.',
      'Use your right hand for giving and receiving; "Namaste" with palms together is the usual greeting.',
      'Many temples restrict entry for non-Hindus to the inner sanctum — your guide will explain what is open.',
    ],
  },
];
