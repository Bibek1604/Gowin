// ============================================================
// GoWin Travels — editorial content for the 20 showcase packages
// (10 in Nepal, 10 international) that appear on the home page.
//
// Keyed by package slug and merged into the plan by content-plan.mjs.
// Every entry carries: display order, a factual description, duration,
// best time, highlights, inclusions, exclusions and a day-by-day
// itinerary. Prices are NOT set here — they stay as recorded in the
// database (or "price on request") until the owner confirms them.
// ============================================================

const NEPAL_SEASON = 'October – April';
const INTL_VISA = 'Visa fees (we assist with the application)';
const INTL_AIR = 'International airfare (quoted separately for your dates)';
const INSURANCE = 'Travel insurance';
const TIPS = 'Tips and personal expenses';

export const SHOWCASE = {
  // ======================= NEPAL (1–10) =======================
  'kathmandu-valley-heritage-tour': {
    sort_order: 1, duration: '4 Days / 3 Nights',
    description: 'The Kathmandu Valley holds seven UNESCO World Heritage monument zones within a short drive of each other. Over three full days you visit the great stupas of Boudhanath and Swayambhunath, the riverside temple complex of Pashupatinath and the three medieval palace squares of Kathmandu, Patan and Bhaktapur with a licensed city guide and private vehicle.',
    details: {
      best_time: NEPAL_SEASON,
      highlights: ['Boudhanath Stupa and its monastery quarter', 'Pashupatinath Temple on the Bagmati River', 'Swayambhunath (Monkey Temple) hilltop views', 'Kathmandu Durbar Square and Kumari Ghar', 'Patan Durbar Square and Patan Museum', 'Bhaktapur: Nyatapola, 55-Window Palace and Pottery Square'],
      inclusions: ['3 nights hotel in Kathmandu with breakfast', 'Airport pick-up and drop-off', 'Private air-conditioned vehicle for all sightseeing', 'Licensed English-speaking city guide', 'All applicable government taxes'],
      exclusions: ['Nepal visa fee and international airfare', 'Heritage site entrance fees (paid at the gate)', 'Lunches and dinners', INSURANCE, TIPS],
      itinerary: [
        { day: 1, title: 'Arrive in Kathmandu', description: 'Welcome at Tribhuvan International Airport and transfer to your hotel. Evening orientation walk through Thamel or Asan bazaar.' },
        { day: 2, title: 'Kathmandu heritage sites', description: 'Morning at Pashupatinath and Boudhanath, afternoon at Swayambhunath and Kathmandu Durbar Square with the Hanuman Dhoka palace and Kumari Ghar.' },
        { day: 3, title: 'Patan and Bhaktapur', description: 'Patan Durbar Square, the Golden Temple and Patan Museum, then on to Bhaktapur for Nyatapola, the 55-Window Palace, Dattatreya Square and Pottery Square.' },
        { day: 4, title: 'Departure', description: 'Free time for shopping or an optional early Everest mountain flight, then transfer to the airport.' },
      ],
    },
  },
  'pokhara-sarangkot-escape': {
    sort_order: 2, duration: '5 Days / 4 Nights',
    description: 'Pokhara is Nepal\'s lakeside city with the Annapurna range standing directly above it. This relaxed itinerary pairs a sunrise at Sarangkot and boating on Phewa Lake with the World Peace Pagoda, Davis Falls, Gupteshwor Cave and the International Mountain Museum, with a free day for Begnas Lake or an optional paragliding flight.',
    details: {
      best_time: NEPAL_SEASON,
      highlights: ['Sunrise over Annapurna and Machhapuchhre from Sarangkot', 'Boating on Phewa Lake to Tal Barahi temple', 'World Peace Pagoda viewpoint', 'Davis Falls and Gupteshwor Cave', 'Lakeside cafés, cycling and markets'],
      inclusions: ['4 nights lakeside hotel with breakfast', 'Kathmandu – Pokhara – Kathmandu by tourist coach (flight upgrade available)', 'Private vehicle for sightseeing including the Sarangkot sunrise drive', 'Boat ride on Phewa Lake', 'English-speaking guide'],
      exclusions: ['Entrance fees to sites and museums', 'Lunches and dinners', 'Paragliding, zip-line and other optional activities', INSURANCE, TIPS],
      itinerary: [
        { day: 1, title: 'Kathmandu to Pokhara', description: 'Scenic drive along the Trishuli and Marsyangdi rivers (about 6–7 hours) or a 25-minute flight. Evening free by the lake.' },
        { day: 2, title: 'Sarangkot sunrise and city sights', description: 'Early drive to Sarangkot for sunrise over the Annapurnas, then Bindhyabasini temple, Seti River gorge, Davis Falls, Gupteshwor Cave and the International Mountain Museum.' },
        { day: 3, title: 'Phewa Lake and World Peace Pagoda', description: 'Boat across Phewa Lake to Tal Barahi temple, short walk up to the World Peace Pagoda for the lake-and-mountain panorama. Free afternoon.' },
        { day: 4, title: 'Begnas Lake or free day', description: 'Day trip to the quieter Begnas and Rupa lakes, or stay in Pokhara for an optional tandem paragliding flight from Sarangkot.' },
        { day: 5, title: 'Return to Kathmandu', description: 'Morning at leisure, then coach or flight back to Kathmandu.' },
      ],
    },
  },
  'chitwan-jungle-safari': {
    sort_order: 3, duration: '4 Days / 3 Nights',
    description: 'Chitwan National Park on Nepal\'s southern plains is a UNESCO World Heritage site and home to the greater one-horned rhinoceros, gharial crocodiles, hundreds of bird species and a small population of Bengal tigers. The stay combines jeep safaris, a canoe ride on the Rapti River, guided jungle walks and an evening with the local Tharu community.',
    details: {
      best_time: 'October – March',
      highlights: ['Jeep safari inside Chitwan National Park', 'One-horned rhinoceros, deer, gharial and bird sightings', 'Canoe ride on the Rapti River', 'Tharu village visit and cultural programme', 'Sunset over the river from the park edge'],
      inclusions: ['3 nights at a jungle resort with all meals', 'Transfers from Kathmandu or Pokhara by tourist coach (private vehicle on request)', 'Jeep safari, canoe ride, jungle walk and Tharu cultural programme', 'National park entry permit', 'Licensed nature guide'],
      exclusions: ['Drinks and personal expenses', 'Optional activities not listed', INSURANCE, TIPS],
      itinerary: [
        { day: 1, title: 'Drive to Chitwan', description: 'Drive from Kathmandu (5–6 hours) or Pokhara (4–5 hours) to Sauraha. Afternoon Tharu village walk, sunset by the Rapti River and an evening Tharu stick-dance programme.' },
        { day: 2, title: 'Canoe, jungle walk and jeep safari', description: 'Morning canoe ride down the Rapti looking for gharial and marsh mugger crocodiles, followed by a guided jungle walk. Afternoon jeep safari deep inside the park.' },
        { day: 3, title: 'Full-day jeep safari', description: 'A longer drive into the core area and grasslands for the best chance of rhino and, with luck, tiger or sloth bear sightings. Bird watching at Bis Hazari Tal on the way back.' },
        { day: 4, title: 'Bird-watching walk and departure', description: 'Early morning bird-watching walk along the river, breakfast and onward journey.' },
      ],
    },
  },
  'lumbini-buddha-circuit': {
    sort_order: 4, duration: '7 Days / 6 Nights',
    description: 'A pilgrimage to the birthplace of the Buddha and the lesser-visited sites of his early life. From the Maya Devi Temple and Ashoka Pillar in Lumbini\'s sacred garden, the circuit continues to Tilaurakot (ancient Kapilvastu), Kudan, Niglihawa, Gotihawa, Devdaha and the Ramagrama stupa, with Kathmandu\'s Buddhist landmarks at either end.',
    details: {
      best_time: 'October – March',
      highlights: ['Maya Devi Temple, marker stone and the sacred pond', 'Ashoka Pillar (249 BCE)', 'International monastic zone and the World Peace Pagoda', 'Tilaurakot: the archaeological site of Kapilvastu', 'Ramagrama relic stupa and Devdaha', 'Boudhanath and Swayambhunath in Kathmandu'],
      inclusions: ['6 nights hotel accommodation with breakfast (Kathmandu and Lumbini)', 'Kathmandu – Bhairahawa – Kathmandu flights (or private vehicle on request)', 'Private vehicle for all excursions around Lumbini', 'Experienced guide for the Buddhist sites', 'Kathmandu sightseeing with guide'],
      exclusions: ['Nepal visa fee and international airfare', 'Entrance fees to monuments and museums', 'Lunches and dinners', INSURANCE, TIPS],
      itinerary: [
        { day: 1, title: 'Arrive in Kathmandu', description: 'Airport welcome and hotel transfer. Evening visit to Boudhanath Stupa for the circumambulation at dusk.' },
        { day: 2, title: 'Kathmandu Buddhist sites, fly to Lumbini', description: 'Morning at Swayambhunath and Patan\'s Golden Temple, afternoon flight to Bhairahawa (35 minutes) and drive to Lumbini.' },
        { day: 3, title: 'Lumbini sacred garden', description: 'Maya Devi Temple, the Ashoka Pillar, Puskarini pond and the ruins of ancient monasteries, then the eastern and western monastic zones by rickshaw and the World Peace Pagoda.' },
        { day: 4, title: 'Tilaurakot and Kapilvastu sites', description: 'Drive west to Tilaurakot, the walled city where Prince Siddhartha grew up, with Kudan, Niglihawa and Gotihawa.' },
        { day: 5, title: 'Ramagrama and Devdaha', description: 'East to the Ramagrama stupa, the only unopened relic stupa of the Buddha, and Devdaha, the home of Queen Maya Devi.' },
        { day: 6, title: 'Return to Kathmandu', description: 'Morning at leisure in Lumbini, flight back to Kathmandu, free evening.' },
        { day: 7, title: 'Departure', description: 'Transfer to the airport for your onward flight.' },
      ],
    },
  },
  'nepal-golden-triangle': {
    sort_order: 5, duration: '7 Days / 6 Nights',
    description: 'Nepal\'s classic first-time itinerary, paced for families and groups: the temples and palace squares of the Kathmandu Valley, a jungle safari in Chitwan National Park and the lakes and mountain views of Pokhara, with private transport, hotels and guides arranged throughout.',
    details: {
      best_time: NEPAL_SEASON,
      highlights: ['Kathmandu Valley heritage sites with a city guide', 'Jeep safari and canoe ride in Chitwan National Park', 'Sunrise at Sarangkot and boating on Phewa Lake', 'Private vehicle between the three cities', 'Hotel category of your choice'],
      inclusions: ['6 nights hotel accommodation (3-star by default, upgrades available) with breakfast; all meals in Chitwan', 'Private vehicle for the whole trip, including city sightseeing', 'Chitwan jungle activities and park permit', 'Licensed guides in Kathmandu and Chitwan', 'Airport transfers'],
      exclusions: ['Nepal visa fee and international airfare', 'Entrance fees to heritage sites', 'Lunches and dinners outside Chitwan', 'Optional activities (paragliding, mountain flight)', INSURANCE, TIPS],
      itinerary: [
        { day: 1, title: 'Arrive in Kathmandu', description: 'Airport welcome and transfer to the hotel. Short evening walk in Thamel.' },
        { day: 2, title: 'Kathmandu sightseeing', description: 'Pashupatinath, Boudhanath, Swayambhunath and Patan Durbar Square with your guide.' },
        { day: 3, title: 'Drive to Chitwan', description: 'Drive to Sauraha (5–6 hours). Afternoon Tharu village walk and sunset by the Rapti River.' },
        { day: 4, title: 'Chitwan jungle activities', description: 'Canoe ride and jungle walk in the morning, jeep safari in the afternoon, Tharu cultural show in the evening.' },
        { day: 5, title: 'Drive to Pokhara', description: 'Drive to Pokhara (4–5 hours). Afternoon boating on Phewa Lake and a lakeside evening.' },
        { day: 6, title: 'Pokhara sightseeing', description: 'Sarangkot sunrise, World Peace Pagoda, Davis Falls, Gupteshwor Cave and the Mountain Museum. Free afternoon.' },
        { day: 7, title: 'Fly to Kathmandu and depart', description: 'Morning flight to Kathmandu (25 minutes) connecting to your international departure, or an extra night in Kathmandu on request.' },
      ],
    },
  },
  'nagarkot-dhulikhel-sunrise': {
    sort_order: 6, duration: '3 Days / 2 Nights',
    description: 'Two hill towns on the rim of the Kathmandu Valley with wide Himalayan views. From Nagarkot the dawn panorama runs from Langtang and Ganesh Himal to the Jugal and Rolwaling ranges, with the tip of Everest visible on very clear days. Village walks, Changu Narayan temple and the Namobuddha monastery fill the days between sunrises.',
    details: {
      best_time: NEPAL_SEASON,
      highlights: ['Himalayan sunrise from Nagarkot', 'Walk from Nagarkot to Changu Narayan, the valley\'s oldest temple', 'Dhulikhel old town and Namobuddha monastery', 'Bhaktapur Durbar Square on the way'],
      inclusions: ['2 nights hill resort accommodation with breakfast (Nagarkot and Dhulikhel)', 'Private vehicle from and back to Kathmandu', 'Guided walks', 'Bhaktapur stop with guide'],
      exclusions: ['Entrance fees', 'Lunches and dinners', INSURANCE, TIPS],
      itinerary: [
        { day: 1, title: 'Kathmandu to Nagarkot via Bhaktapur', description: 'Visit Bhaktapur Durbar Square, then drive up to Nagarkot (2,175 m) for sunset over the hills.' },
        { day: 2, title: 'Sunrise and walk to Dhulikhel', description: 'Dawn at the Nagarkot viewpoint, breakfast, then a gentle 3–4 hour walk down through villages to Changu Narayan; drive on to Dhulikhel and visit Namobuddha monastery.' },
        { day: 3, title: 'Dhulikhel sunrise and return', description: 'Morning views from Dhulikhel, visit the old Newari town and Panauti, drive back to Kathmandu (1.5 hours).' },
      ],
    },
  },
  'bhaktapur-durbar-square-tour': {
    sort_order: 7, duration: '1 Day',
    description: 'A full day in Bhaktapur, the best-preserved of the valley\'s three medieval cities. Walk through Durbar Square with the 55-Window Palace and Golden Gate, climb the five-tiered Nyatapola temple steps, watch potters at work in Pottery Square and taste the city\'s famous juju dhau (king curd) before continuing to the hilltop temple of Changu Narayan.',
    details: {
      best_time: NEPAL_SEASON,
      highlights: ['Nyatapola Temple and Taumadhi Square', '55-Window Palace and Golden Gate', 'Dattatreya Square and the Peacock Window', 'Pottery Square', 'Changu Narayan temple (UNESCO)'],
      inclusions: ['Private vehicle with hotel pick-up and drop-off in Kathmandu', 'Licensed city guide', 'Bottled water'],
      exclusions: ['Bhaktapur and Changu Narayan entrance fees', 'Lunch', TIPS],
      itinerary: [
        { day: 1, title: 'Bhaktapur and Changu Narayan', description: 'Pick-up at 8:30 am. Guided walk through Durbar, Taumadhi, Dattatreya and Pottery squares with time for lunch in a courtyard café, then a short drive to Changu Narayan. Back in Kathmandu by late afternoon.' },
      ],
    },
  },
  'muktinath-pilgrimage-tour': {
    sort_order: 8, duration: '5 Days / 4 Nights',
    description: 'Muktinath, at 3,800 m in Mustang, is sacred to both Hindus and Buddhists: pilgrims bathe under its 108 water spouts and visit the Jwala Mai temple with its natural flame. The trip reaches it the comfortable way, by air to Jomsom and jeep up the Kali Gandaki valley through Kagbeni, with Pokhara at either end. Mountain flights depend on the weather, and a road alternative is arranged if needed.',
    details: {
      best_time: 'March – June, September – November',
      highlights: ['Muktinath temple and the 108 water spouts', 'Jwala Mai temple with its natural eternal flame', 'Kagbeni, the gateway to Upper Mustang', 'Marpha village and its apple orchards', 'Flight along the Kali Gandaki gorge between Dhaulagiri and Annapurna'],
      inclusions: ['4 nights hotel accommodation with breakfast (Pokhara and Jomsom)', 'Kathmandu – Pokhara – Jomsom flights and return', 'Shared jeep Jomsom – Muktinath – Jomsom', 'Annapurna Conservation Area entry permit', 'Guide and all transfers'],
      exclusions: ['Lunches and dinners', 'Puja and temple offerings', 'Costs arising from weather delays beyond our control', INSURANCE, TIPS],
      itinerary: [
        { day: 1, title: 'Kathmandu to Pokhara', description: 'Flight (25 minutes) or private drive to Pokhara. Afternoon at leisure by Phewa Lake.' },
        { day: 2, title: 'Fly to Jomsom, Muktinath darshan', description: 'Early 20-minute flight to Jomsom, jeep to Ranipauwa via Kagbeni (about 2 hours), short walk up to Muktinath for the temple visit and ritual bath. Overnight in Ranipauwa or back in Jomsom.' },
        { day: 3, title: 'Kagbeni and Marpha', description: 'Explore the medieval village of Kagbeni and the whitewashed lanes of Marpha before returning to Jomsom.' },
        { day: 4, title: 'Fly back to Pokhara', description: 'Morning flight to Pokhara. Afternoon boating on Phewa Lake or a visit to Bindhyabasini temple.' },
        { day: 5, title: 'Return to Kathmandu', description: 'Flight or drive back to Kathmandu.' },
      ],
    },
  },
  'bandipur-tansen-heritage-trail': {
    sort_order: 9, duration: '4 Days / 3 Nights',
    description: 'Two hill towns that grew rich on the old trade route between Tibet and India. Bandipur\'s car-free Newari bazaar sits on a ridge facing the Annapurna, Manaslu and Langtang ranges, while Tansen further south keeps its Durbar, temples and traditional metalwork, with the ruined riverside palace of Rani Mahal a half-day walk away.',
    details: {
      best_time: NEPAL_SEASON,
      highlights: ['Bandipur\'s pedestrian bazaar of 18th-century Newari houses', 'Sunrise from Thani Mai viewpoint over the Marsyangdi valley', 'Siddha Gufa, one of Nepal\'s largest caves', 'Tansen Durbar, Amar Narayan temple and the Shreenagar hill', 'Rani Mahal palace on the Kali Gandaki'],
      inclusions: ['3 nights heritage guesthouse or hotel with breakfast', 'Private vehicle from Kathmandu, returning to Kathmandu or Pokhara', 'Local guide for walks and village visits'],
      exclusions: ['Lunches and dinners', 'Entrance fees', INSURANCE, TIPS],
      itinerary: [
        { day: 1, title: 'Kathmandu to Bandipur', description: 'Drive west along the Prithvi Highway and up to Bandipur (4–5 hours). Afternoon bazaar walk and sunset from Tundikhel.' },
        { day: 2, title: 'Bandipur walks', description: 'Sunrise from Thani Mai, then walk to Siddha Gufa cave and the village of Ramkot; Bindabasini and Khadga Devi temples.' },
        { day: 3, title: 'Bandipur to Tansen', description: 'Drive south to Tansen (3–4 hours). Tansen Durbar, Amar Narayan temple and the bazaar\'s metal and dhaka-weaving workshops.' },
        { day: 4, title: 'Rani Mahal and onward', description: 'Morning walk or jeep ride to Rani Mahal on the Kali Gandaki river, then drive to Pokhara (3–4 hours) or Kathmandu (7 hours).' },
      ],
    },
  },
  'bardiya-wilderness-safari': {
    sort_order: 10, duration: '6 Days / 5 Nights',
    description: 'Bardiya National Park in Nepal\'s far west is larger and far quieter than Chitwan, and offers some of the best chances in Nepal of seeing a wild Bengal tiger. Days are spent on jeep safaris and guided walks through sal forest and grassland, on the Karnali River looking for Gangetic dolphins, and in the Tharu villages around Thakurdwara.',
    details: {
      best_time: 'October – March',
      highlights: ['Tiger tracking by jeep and on foot with expert naturalists', 'Wild elephants, rhinos, swamp deer and gharial', 'Gangetic river dolphins on the Karnali', 'Tharu culture around Thakurdwara', 'Far fewer visitors than Chitwan'],
      inclusions: ['5 nights jungle lodge accommodation with all meals', 'Kathmandu – Nepalgunj – Kathmandu flights', 'Land transfers Nepalgunj – Bardiya', 'All park activities listed, park permits and naturalist guide'],
      exclusions: ['Drinks and personal expenses', 'Optional Karnali rafting', INSURANCE, TIPS],
      itinerary: [
        { day: 1, title: 'Kathmandu to Bardiya', description: 'One-hour flight to Nepalgunj, then a 2–3 hour drive to Thakurdwara. Evening Tharu village walk.' },
        { day: 2, title: 'Full-day jeep safari', description: 'Early start into the park\'s grasslands and riverine forest with a packed lunch, looking for tiger, rhino and wild elephant.' },
        { day: 3, title: 'Jungle walk and Karnali River', description: 'Morning guided walk from the lodge, afternoon at the Karnali looking for Gangetic dolphins and gharial.' },
        { day: 4, title: 'Second jeep safari', description: 'A different route through the park, with bird watching at the wetlands.' },
        { day: 5, title: 'Thakurdwara and Tharu culture', description: 'Thakurdwara temple, the crocodile breeding centre and a Tharu cultural programme in the evening.' },
        { day: 6, title: 'Return to Kathmandu', description: 'Drive to Nepalgunj and fly back to Kathmandu.' },
      ],
    },
  },

  // ==================== INTERNATIONAL (1–10) ====================
  'maldives-overwater-villa': {
    sort_order: 1, duration: '7 Days / 6 Nights',
    description: 'Six nights on a Maldivian resort island with a mix of beach and overwater villa stays. Days revolve around the house reef, lagoon excursions and sunsets: snorkelling, a sandbank picnic, a dolphin cruise and a visit to a local island, with transfers from Malé by speedboat or seaplane included.',
    details: {
      best_time: 'November – April (dry season)',
      highlights: ['Overwater villa with direct lagoon access', 'Snorkelling on the resort house reef', 'Sunset dolphin cruise', 'Sandbank picnic and local island visit', 'Half-board or all-inclusive meal plans available'],
      inclusions: ['6 nights resort accommodation (beach and overwater villa combination) with breakfast', 'Speedboat or seaplane transfers from Malé', 'Snorkelling equipment', 'Sunset cruise and local island excursion'],
      exclusions: [INTL_AIR, 'Maldives Green Tax and resort service charges where not included', 'Meals and drinks beyond the chosen meal plan', 'Spa treatments and water sports', INSURANCE, TIPS],
      itinerary: [
        { day: 1, title: 'Arrive in Malé', description: 'Welcome at Velana International Airport and transfer to the resort by speedboat or seaplane. Settle in and watch the first sunset from the jetty.' },
        { day: 2, title: 'House reef', description: 'Guided snorkelling on the house reef in the morning, afternoon at leisure on the beach.' },
        { day: 3, title: 'Sandbank picnic', description: 'Boat trip to an uninhabited sandbank with a picnic lunch and snorkelling stops.' },
        { day: 4, title: 'Local island visit', description: 'Visit a nearby inhabited island to see village life, the mosque and the harbour.' },
        { day: 5, title: 'Dolphin cruise', description: 'Free day; late afternoon dhoni cruise to spot spinner dolphins at sunset.' },
        { day: 6, title: 'At leisure', description: 'Overwater villa day: swim, kayak or book a spa treatment.' },
        { day: 7, title: 'Departure', description: 'Transfer back to Malé for your flight home.' },
      ],
    },
  },
  'bali-island-retreat': {
    sort_order: 2, duration: '10 Days / 9 Nights',
    description: 'Ten days across Bali\'s two sides: the rice terraces, water temples and craft villages around Ubud, then the beaches, cliff temples and sunsets of the south coast, with a day trip to the dramatic coastline of Nusa Penida. Private driver and guide throughout.',
    details: {
      best_time: 'April – October (dry season)',
      highlights: ['Tegalalang and Jatiluwih rice terraces', 'Tirta Empul and Ulun Danu Beratan water temples', 'Tanah Lot and Uluwatu sunsets with Kecak dance', 'Nusa Penida: Kelingking Beach, Broken Beach and Crystal Bay', 'Jimbaran seafood dinner on the beach'],
      inclusions: ['9 nights hotel accommodation with breakfast (5 in Ubud, 4 in Seminyak)', 'Airport transfers and private air-conditioned car with English-speaking driver-guide on tour days', 'Nusa Penida fast-boat day trip', 'Kecak dance tickets at Uluwatu'],
      exclusions: [INTL_AIR, 'Indonesia visa on arrival', 'Temple and attraction entrance fees unless listed', 'Lunches and dinners', INSURANCE, TIPS],
      itinerary: [
        { day: 1, title: 'Arrive in Bali', description: 'Welcome at Denpasar airport and transfer to Ubud (about 1.5 hours).' },
        { day: 2, title: 'Ubud', description: 'Tegalalang rice terraces, Ubud Monkey Forest, Ubud Palace and the art market.' },
        { day: 3, title: 'Temples of central Bali', description: 'Tirta Empul holy springs, Gunung Kawi rock shrines and Goa Gajah (Elephant Cave).' },
        { day: 4, title: 'Kintamani and coffee country', description: 'Views of Mount Batur and its lake from Kintamani, a coffee plantation visit and the Tegenungan waterfall.' },
        { day: 5, title: 'Ulun Danu, Jatiluwih and Tanah Lot', description: 'Ulun Danu Beratan temple on Lake Bratan, the UNESCO-listed Jatiluwih terraces and sunset at Tanah Lot.' },
        { day: 6, title: 'Transfer to Seminyak', description: 'Free morning in Ubud, then drive to the coast. Evening on Seminyak beach.' },
        { day: 7, title: 'Nusa Penida day trip', description: 'Fast boat to Nusa Penida for Kelingking Beach, Angel\'s Billabong, Broken Beach and snorkelling at Crystal Bay.' },
        { day: 8, title: 'Uluwatu and Jimbaran', description: 'Afternoon at Uluwatu cliff temple, Kecak dance at sunset and a seafood dinner on Jimbaran beach.' },
        { day: 9, title: 'Free day', description: 'Beach, spa or shopping in Seminyak and Canggu.' },
        { day: 10, title: 'Departure', description: 'Transfer to Denpasar airport.' },
      ],
    },
  },
  'santorini-luxury-escape': {
    sort_order: 3, duration: '8 Days / 7 Nights',
    description: 'Athens and Santorini in one trip. Two nights in Athens for the Acropolis and Plaka, then five nights in a caldera-view hotel on Santorini: the sunset at Oia, a boat trip to the volcano and hot springs, the cliff path from Fira to Oia, the island\'s wineries and the Minoan site of Akrotiri.',
    details: {
      best_time: 'May – June, September – October',
      highlights: ['Acropolis and the Acropolis Museum, Athens', 'Caldera-view hotel in Fira, Imerovigli or Oia', 'Sunset at Oia', 'Volcano and hot-springs boat trip', 'Santorini wineries and the Akrotiri excavations'],
      inclusions: ['2 nights hotel in Athens and 5 nights caldera-view hotel in Santorini, with breakfast', 'Athens – Santorini flight or ferry', 'Airport and port transfers', 'Guided Acropolis visit', 'Caldera boat trip'],
      exclusions: [INTL_AIR, 'Schengen visa fees (we assist with the application)', 'Entrance fees unless listed', 'Lunches and dinners', INSURANCE, TIPS],
      itinerary: [
        { day: 1, title: 'Arrive in Athens', description: 'Transfer to your hotel in the Plaka district. Evening stroll below the Acropolis.' },
        { day: 2, title: 'Athens', description: 'Guided visit to the Acropolis and its museum, then the Ancient Agora, Syntagma and Monastiraki.' },
        { day: 3, title: 'Athens to Santorini', description: 'Flight (45 minutes) or ferry to Santorini, transfer to the hotel. Sunset at Oia.' },
        { day: 4, title: 'Volcano boat trip', description: 'Sail to Nea Kameni to walk on the volcano, swim in the hot springs and stop at Thirassia island.' },
        { day: 5, title: 'Fira to Oia caldera path', description: 'Walk the cliff-top path through Firostefani and Imerovigli to Oia (about 3 hours), or by bus with stops.' },
        { day: 6, title: 'Akrotiri and wineries', description: 'The Bronze Age town of Akrotiri, Red Beach and a tasting at two Santorini wineries.' },
        { day: 7, title: 'At leisure', description: 'Free day: Perissa black-sand beach, Pyrgos village or an optional sunset catamaran cruise.' },
        { day: 8, title: 'Departure', description: 'Fly to Athens to connect with your flight home.' },
      ],
    },
  },
  'dubai-desert-skyline': {
    sort_order: 4, duration: '5 Days / 4 Nights',
    description: 'A compact Dubai package covering the essentials: a guided city tour, the Burj Khalifa observation deck, a desert safari with dune bashing and a barbecue dinner, a dhow cruise and a day trip to Abu Dhabi\'s Sheikh Zayed Grand Mosque. Hotel, transfers and tours are bundled; UAE visa assistance is available.',
    details: {
      best_time: 'November – March',
      highlights: ['Burj Khalifa "At the Top" observation deck', 'Desert safari with dune bashing, camel ride and barbecue dinner', 'Dhow cruise dinner on Dubai Marina or the Creek', 'Sheikh Zayed Grand Mosque in Abu Dhabi', 'Dubai Mall, Palm Jumeirah and Jumeirah Beach'],
      inclusions: ['4 nights hotel accommodation with breakfast', 'Airport transfers', 'Half-day Dubai city tour', 'Burj Khalifa 124th/125th floor ticket', 'Desert safari with dinner', 'Dhow cruise with dinner', 'Abu Dhabi day tour'],
      exclusions: [INTL_AIR, 'UAE tourist visa', 'Tourism Dirham fee payable at the hotel', 'Lunches and dinners not listed', INSURANCE, TIPS],
      itinerary: [
        { day: 1, title: 'Arrive in Dubai', description: 'Airport transfer and check-in. Evening dhow cruise with dinner.' },
        { day: 2, title: 'City tour and Burj Khalifa', description: 'Jumeirah Mosque, Burj Al Arab photo stop, Palm Jumeirah and the old Al Fahidi quarter, then Dubai Mall and the Burj Khalifa observation deck at sunset.' },
        { day: 3, title: 'Desert safari', description: 'Free morning. Afternoon pick-up for dune bashing, camel ride, sandboarding and a barbecue dinner with shows at a desert camp.' },
        { day: 4, title: 'Abu Dhabi', description: 'Day trip to Abu Dhabi: Sheikh Zayed Grand Mosque, the Corniche and a photo stop at Emirates Palace.' },
        { day: 5, title: 'Departure', description: 'Time for last-minute shopping, then transfer to the airport.' },
      ],
    },
  },
  'bangkok-temple-city-tour': {
    sort_order: 5, duration: '6 Days / 5 Nights',
    description: 'Bangkok\'s royal temples, canals and markets in five nights. The Grand Palace, Wat Pho and Wat Arun, a morning at the Damnoen Saduak floating market and the Maeklong railway market, a day among the ruins of Ayutthaya, and free time for the city\'s malls, street food and a dinner cruise on the Chao Phraya.',
    details: {
      best_time: 'November – February',
      highlights: ['Grand Palace and the Temple of the Emerald Buddha', 'Wat Pho reclining Buddha and Wat Arun by river ferry', 'Damnoen Saduak floating market and Maeklong railway market', 'Ayutthaya historical park (UNESCO)', 'Chao Phraya dinner cruise'],
      inclusions: ['5 nights hotel accommodation with breakfast', 'Airport transfers', 'Guided temple tour, floating-market tour and Ayutthaya day trip', 'Chao Phraya dinner cruise'],
      exclusions: [INTL_AIR, 'Thailand visa where applicable', 'Entrance fees unless listed', 'Lunches and dinners not listed', INSURANCE, TIPS],
      itinerary: [
        { day: 1, title: 'Arrive in Bangkok', description: 'Airport transfer and check-in. Evening free around Sukhumvit or Khao San Road.' },
        { day: 2, title: 'Royal temples', description: 'Grand Palace and Wat Phra Kaew, Wat Pho and a ferry across the river to Wat Arun.' },
        { day: 3, title: 'Floating and railway markets', description: 'Early drive to Damnoen Saduak floating market and the Maeklong railway market. Afternoon at leisure.' },
        { day: 4, title: 'Ayutthaya', description: 'Day trip to the former capital: Wat Mahathat, Wat Phra Si Sanphet and Wat Chaiwatthanaram.' },
        { day: 5, title: 'Free day and dinner cruise', description: 'Shopping at ICONSIAM or Chatuchak weekend market, Jim Thompson House. Evening dinner cruise on the Chao Phraya.' },
        { day: 6, title: 'Departure', description: 'Transfer to the airport.' },
      ],
    },
  },
  'singapore-city-escape': {
    sort_order: 6, duration: '5 Days / 4 Nights',
    description: 'Four nights in Singapore built around the city\'s big attractions: a guided city tour through Chinatown, Little India and Kampong Glam, Gardens by the Bay, a day on Sentosa with Universal Studios or the S.E.A. Aquarium, and an evening at the Night Safari.',
    details: {
      best_time: 'February – April (driest months); good year-round',
      highlights: ['Gardens by the Bay: Cloud Forest, Flower Dome and the Supertree light show', 'Marina Bay skyline and Merlion Park', 'Sentosa: Universal Studios Singapore or S.E.A. Aquarium', 'Night Safari', 'Hawker food in Chinatown and Little India'],
      inclusions: ['4 nights hotel accommodation with breakfast', 'Airport transfers', 'Half-day city tour', 'Gardens by the Bay conservatory tickets', 'Universal Studios or S.E.A. Aquarium ticket', 'Night Safari ticket with transfers'],
      exclusions: [INTL_AIR, 'Singapore visa where applicable', 'Lunches and dinners', 'Cable car and other optional attractions', INSURANCE, TIPS],
      itinerary: [
        { day: 1, title: 'Arrive in Singapore', description: 'Airport transfer. Evening at Marina Bay for the Spectra light-and-water show.' },
        { day: 2, title: 'City tour and Gardens by the Bay', description: 'Merlion Park, Chinatown, Little India and Kampong Glam in the morning; Cloud Forest, Flower Dome and the Supertree Grove in the afternoon.' },
        { day: 3, title: 'Sentosa', description: 'Full day on Sentosa island at Universal Studios Singapore or the S.E.A. Aquarium, ending with the Wings of Time show.' },
        { day: 4, title: 'Free day and Night Safari', description: 'Orchard Road shopping or the National Museum, then an evening at the Night Safari.' },
        { day: 5, title: 'Departure', description: 'Transfer to Changi airport.' },
      ],
    },
  },
  'paris-romance-getaway': {
    sort_order: 7, duration: '6 Days / 5 Nights',
    description: 'Five nights in Paris paced for couples: the Eiffel Tower and the Champs-Élysées, the Louvre and the islands of the Seine, a day at the Palace of Versailles, Montmartre at dusk and an evening cruise on the river. Central hotel, transfers and the key tickets are arranged in advance.',
    details: {
      best_time: 'April – June, September – October',
      highlights: ['Eiffel Tower summit at sunset', 'Louvre Museum with timed entry', 'Notre-Dame, Sainte-Chapelle and the Latin Quarter', 'Palace and gardens of Versailles', 'Seine evening cruise and Montmartre'],
      inclusions: ['5 nights centrally located hotel with breakfast', 'Airport transfers', 'Eiffel Tower and Louvre tickets', 'Versailles day trip with train tickets and palace entry', 'Seine river cruise'],
      exclusions: [INTL_AIR, 'Schengen visa fees (we assist with the application)', 'Lunches and dinners', 'Paris metro passes', INSURANCE, TIPS],
      itinerary: [
        { day: 1, title: 'Arrive in Paris', description: 'Transfer to the hotel. Evening walk along the Seine to see the Eiffel Tower sparkle on the hour.' },
        { day: 2, title: 'Eiffel Tower and the Champs-Élysées', description: 'Trocadéro, Eiffel Tower ascent, Champ de Mars, then the Arc de Triomphe and the Champs-Élysées.' },
        { day: 3, title: 'Louvre and the islands', description: 'Morning at the Louvre, Tuileries garden, then Île de la Cité with Notre-Dame and Sainte-Chapelle. Evening Seine cruise.' },
        { day: 4, title: 'Versailles', description: 'Day trip by train to the Palace of Versailles, the Hall of Mirrors and the gardens.' },
        { day: 5, title: 'Montmartre and free time', description: 'Sacré-Cœur and the artists\' square, Opéra Garnier and the Galeries Lafayette rooftop. Afternoon at leisure.' },
        { day: 6, title: 'Departure', description: 'Transfer to Charles de Gaulle airport.' },
      ],
    },
  },
  'swiss-alps-adventure': {
    sort_order: 8, duration: '7 Days / 6 Nights',
    description: 'Six nights in Interlaken between lakes Thun and Brienz, with the big mountain excursions of the Bernese Oberland: the cogwheel railway to Jungfraujoch, the cable cars to Schilthorn and Grindelwald First, the Lauterbrunnen valley waterfalls, a lake cruise and a day in Lucerne. Rail tickets for the listed journeys are included.',
    details: {
      best_time: 'June – September (summer); December – March for snow',
      highlights: ['Jungfraujoch, "Top of Europe", by cogwheel train', 'Schilthorn and the car-free village of Mürren', 'Lauterbrunnen valley and Trümmelbach Falls', 'Lake Thun or Lake Brienz cruise', 'Lucerne: Chapel Bridge and Mount Pilatus or Titlis'],
      inclusions: ['6 nights hotel accommodation in Interlaken with breakfast', 'Zurich airport – Interlaken rail tickets', 'Rail and cable-car tickets for Jungfraujoch, Schilthorn, Grindelwald First and Lucerne', 'Lake cruise ticket'],
      exclusions: [INTL_AIR, 'Schengen visa fees (we assist with the application)', 'Lunches and dinners', 'Paragliding and other optional activities', INSURANCE, TIPS],
      itinerary: [
        { day: 1, title: 'Arrive in Zurich, train to Interlaken', description: 'Scenic train from Zurich airport to Interlaken (about 2 hours). Evening walk along the Aare.' },
        { day: 2, title: 'Jungfraujoch', description: 'Train via Grindelwald or Lauterbrunnen and the Eiger Express to Jungfraujoch (3,454 m): Sphinx observatory, Ice Palace and the Aletsch glacier.' },
        { day: 3, title: 'Lauterbrunnen and Schilthorn', description: 'Trümmelbach Falls inside the mountain, cable car to Mürren and on to the Schilthorn summit.' },
        { day: 4, title: 'Lakes and Harder Kulm', description: 'Boat cruise on Lake Brienz or Lake Thun, afternoon funicular to Harder Kulm above Interlaken.' },
        { day: 5, title: 'Lucerne', description: 'Day trip to Lucerne: Chapel Bridge, the Lion Monument and old town, with an optional ascent of Mount Pilatus or Titlis.' },
        { day: 6, title: 'Grindelwald First', description: 'Cable car to First for the cliff walk and the Bachalpsee lake path. Free afternoon in Interlaken.' },
        { day: 7, title: 'Departure', description: 'Train to Zurich airport.' },
      ],
    },
  },
  'phuket-beach-paradise': {
    sort_order: 9, duration: '7 Days / 6 Nights',
    description: 'Six nights in Phuket with the island\'s best boat days built in: a speedboat trip to the Phi Phi islands, Phang Nga Bay with James Bond Island and sea-cave canoeing, and a day on the beaches of Krabi. In between, Phuket Old Town, the Big Buddha and the sunset at Promthep Cape.',
    details: {
      best_time: 'November – April',
      highlights: ['Phi Phi islands by speedboat (Maya Bay, Pileh Lagoon, Bamboo Island)', 'Phang Nga Bay, James Bond Island and sea-cave canoeing', 'Krabi: Railay Beach and the Four Islands', 'Big Buddha, Wat Chalong and Phuket Old Town', 'Promthep Cape sunset'],
      inclusions: ['6 nights beach hotel accommodation with breakfast', 'Airport transfers', 'Phi Phi islands speedboat tour with lunch', 'Phang Nga Bay tour with lunch', 'Half-day Phuket city tour'],
      exclusions: [INTL_AIR, 'Thailand visa where applicable', 'National park fees payable on the boat tours', 'Dinners and drinks', INSURANCE, TIPS],
      itinerary: [
        { day: 1, title: 'Arrive in Phuket', description: 'Airport transfer to your beach hotel. Evening on Patong or Kata beach.' },
        { day: 2, title: 'Phi Phi islands', description: 'Speedboat to Phi Phi Leh and Phi Phi Don: Maya Bay, Pileh Lagoon, Viking Cave, Monkey Beach and lunch on the island.' },
        { day: 3, title: 'Phuket city tour', description: 'Big Buddha, Wat Chalong, the Sino-Portuguese streets of Old Town, Karon viewpoint and sunset at Promthep Cape.' },
        { day: 4, title: 'Phang Nga Bay', description: 'Longtail boat and sea canoe through the limestone bay, James Bond Island and the floating village of Koh Panyee.' },
        { day: 5, title: 'Beach day', description: 'Free day at the beach, optional spa or the Simon Cabaret show in the evening.' },
        { day: 6, title: 'Krabi day trip', description: 'Boat to Railay Beach and the Four Islands (Chicken Island, Tup, Poda and Phra Nang) with snorkelling stops.' },
        { day: 7, title: 'Departure', description: 'Transfer to Phuket airport.' },
      ],
    },
  },
  'el-nido-big-lagoon': {
    sort_order: 10, duration: '5 Days / 4 Nights',
    description: 'El Nido on the northern tip of Palawan is the gateway to Bacuit Bay\'s limestone islands and lagoons. Two island-hopping days take in the Big Lagoon, Secret Lagoon, Shimizu Island and Seven Commandos Beach, then the Hidden and Secret beaches and Matinloc Shrine, with a free day for Nacpan Beach and the sunset at Las Cabanas.',
    details: {
      best_time: 'December – May (dry season)',
      highlights: ['Kayaking inside the Big Lagoon', 'Island-hopping tours A and C in Bacuit Bay', 'Secret Lagoon, Hidden Beach and Matinloc Shrine', 'Nacpan Beach', 'Sunset at Las Cabanas'],
      inclusions: ['4 nights hotel or resort accommodation with breakfast', 'Transfers from El Nido or Puerto Princesa airport', 'Island-hopping tours A and C with lunch', 'Kayak rental at the Big Lagoon'],
      exclusions: [INTL_AIR, 'Domestic flights Manila – El Nido / Puerto Princesa (quoted with your package)', 'El Nido eco-tourism development fee and lagoon entrance fees', 'Dinners and drinks', INSURANCE, TIPS],
      itinerary: [
        { day: 1, title: 'Arrive in El Nido', description: 'Fly direct to El Nido (Lio airport) or to Puerto Princesa and transfer by van (5–6 hours). Evening on the town beach.' },
        { day: 2, title: 'Island-hopping Tour A', description: 'Big Lagoon by kayak, Secret Lagoon, Shimizu Island and Seven Commandos Beach with a beach lunch.' },
        { day: 3, title: 'Island-hopping Tour C', description: 'Helicopter Island, Matinloc Shrine, Secret Beach and Hidden Beach, with snorkelling stops.' },
        { day: 4, title: 'Nacpan Beach and Las Cabanas', description: 'Morning at the four-kilometre Nacpan Beach, sunset at Las Cabanas beach bar.' },
        { day: 5, title: 'Departure', description: 'Transfer to the airport for your flight to Manila.' },
      ],
    },
  },
};
