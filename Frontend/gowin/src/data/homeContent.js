// Copy for the home page (redesign v2). Tours themselves always come from
// Supabase; these lists only say which kind of trip goes in which section.

/** Section 4: Kathmandu Valley day tours, in this order. Each slot shows the first published Nepal package matching it. */
export const DAY_TOUR_SLOTS = [
  { key: 'bhaktapur', match: /bhaktapur/i },
  { key: 'patan', match: /patan|lalitpur/i },
  { key: 'kathmandu-durbar', match: /kathmandu (durbar|valley heritage)/i },
  { key: 'pashupati-boudha', match: /pashupati|boudha|bouddha/i },
  { key: 'nagarkot', match: /nagarkot/i },
];

/** Section 5: pilgrimage panels, in this order (others in the category follow). */
export const PILGRIMAGE_ORDER = [/muktinath/i, /lumbini/i, /janakpur/i, /pashupati/i, /gosaikunda/i];

/** Section 8: seasons. Written from the /guides advice; plain statements only. */
export const SEASONS = [
  {
    id: 'spring', name: 'Spring', months: 'Mar–May', monthNums: [3, 4, 5],
    image: '/media/tours/nagarkot-dhulikhel-sunrise-1200',
    summary: 'Warm days, rhododendrons in bloom and good conditions in Chitwan and Pokhara. Haze can hide the peaks by late May.',
    chips: { Crowds: 'Moderate', Views: 'Good, hazier by May', Temp: 'Warm', Daylight: '12–13 h' },
    points: [
      'Rhododendron forests flower in the hills in March and April.',
      'A good time for Chitwan and Bardiya before the heat of late May.',
      'Mornings are clearest; cloud tends to build in the afternoon.',
    ],
    tip: 'Plan mountain viewpoints such as Nagarkot or Sarangkot for sunrise, before the haze rises.',
  },
  {
    id: 'monsoon', name: 'Monsoon', months: 'Jun–Aug', monthNums: [6, 7, 8],
    image: '/media/tours/lumbini-buddha-circuit-1200',
    summary: 'Green and quiet, with rain most days and the mountains often in cloud. Road travel can be slow.',
    chips: { Crowds: 'Low', Views: 'Often cloudy', Temp: 'Hot and humid', Daylight: '13–14 h' },
    points: [
      'Hotels are quieter and easier to book.',
      'Landslides can close mountain roads; allow buffer days.',
      'Domestic flights depend on the weather and can be delayed.',
    ],
    tip: 'Keep a free day before your international flight home in case a domestic flight or road is delayed.',
  },
  {
    id: 'autumn', name: 'Autumn', months: 'Sep–Nov', monthNums: [9, 10, 11],
    image: '/media/tours/pokhara-sarangkot-escape-1200',
    summary: 'Clear skies after the rains, the best mountain views of the year and the Dashain and Tihar festivals.',
    chips: { Crowds: 'High', Views: 'Clearest of the year', Temp: 'Mild', Daylight: '11–12 h' },
    points: [
      'October and November usually have the clearest mountain views.',
      'Dashain and Tihar fall in this season; some offices close for the holidays.',
      'This is the busiest season, so hotels and flights fill early.',
    ],
    tip: 'Book flights and hotels for October and November early; we confirm availability before you pay anything.',
  },
  {
    id: 'winter', name: 'Winter', months: 'Dec–Feb', monthNums: [12, 1, 2],
    image: '/media/tours/chitwan-jungle-safari-1200',
    summary: 'Cool, dry and clear in the hills, with cold mornings. The Terai parks such as Chitwan and Bardiya are comfortable.',
    chips: { Crowds: 'Low to moderate', Views: 'Clear', Temp: 'Cool, cold at night', Daylight: '10–11 h' },
    points: [
      'Skies are mostly clear and dry.',
      'Kathmandu mornings and evenings are cold; bring warm layers.',
      'Fog can delay early flights in the Terai in December and January.',
    ],
    tip: 'Pack a warm jacket even for city tours: early-morning temple visits in Kathmandu are cold.',
  },
];

/** Section 9: the four services, linking to their section on /services. */
export const HOME_SERVICES = [
  { icon: 'Plane', title: 'Flights', desc: 'Domestic and international air tickets booked and confirmed for you.', to: '/services#flights-hotels' },
  { icon: 'FileCheck', title: 'Visa help', desc: 'Document checklists, application preparation and appointment support.', to: '/services#visa-assistance' },
  { icon: 'ShieldCheck', title: 'Travel insurance', desc: 'Cover arranged through partner insurers for your dates and trip.', to: '/services#travel-insurance' },
  { icon: 'Hotel', title: 'Hotels', desc: 'Hotel reservations in Nepal and abroad, matched to your budget.', to: '/services#flights-hotels' },
];

/** Section 10: how it works. Step 1 gets the reply-time line from BUSINESS_FACTS. */
export const HOME_STEPS = [
  { num: '01', icon: 'MessageCircle', title: 'Enquire', desc: 'Send your dates and ideas by form, WhatsApp or phone.' },
  { num: '02', icon: 'FileText', title: 'Written quote', desc: 'You receive an itinerary with the price, inclusions and exclusions.' },
  { num: '03', icon: 'CalendarCheck', title: 'Confirm', desc: 'Approve the quote; we book hotels, transport and tickets.' },
  { num: '04', icon: 'Headphones', title: 'Travel with support', desc: 'Our Kathmandu team stays reachable throughout your trip.' },
];

/** Section 11: three articles from /guides (anchors are the tip titles, slugified). */
export const HOME_GUIDES = ['Best time to visit Nepal', 'Visa on arrival', 'Getting around'];

/** Section 13: FAQ. `{reply}` and `{licence}` are filled from BUSINESS_FACTS or the sentence is dropped. */
export const HOME_FAQS = [
  {
    q: 'Are you licensed?',
    a: 'GoWin International Travel & Tourism is a registered travel company with an office at Shankhamul-31, Kathmandu, where you are welcome to visit us.',
    licence: 'Our Department of Tourism licence number is {licence}.',
  },
  {
    q: 'How fast do you reply?',
    a: 'We answer WhatsApp, phone and email during office hours, Sunday to Friday, 9 am to 6 pm Nepal time.',
    reply: 'A written quote is sent within {reply} hours of your enquiry.',
  },
  {
    q: "What's included in the price?",
    a: 'Each package page lists its inclusions and exclusions, and your written quote repeats them for your dates. Typical inclusions are hotels, transport and guided sightseeing; international flights are quoted separately unless stated.',
  },
  {
    q: 'How do I pay?',
    a: 'Nothing is charged online. Once you approve the written quote we send payment details with your confirmation.',
  },
  {
    q: 'What if I cancel?',
    a: 'Refunds for tickets, hotels and tour services follow the terms of the airline, hotel or operator concerned; our service and consultation fees are non-refundable. The Refund Policy page has the details.',
  },
  {
    q: 'Do I need a visa?',
    a: 'Most nationalities can get a Nepal tourist visa on arrival. For trips abroad we help with document checklists, applications and appointments; the visa decision rests with the embassy.',
  },
];
