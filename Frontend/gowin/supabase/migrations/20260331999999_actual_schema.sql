-- ==========================================
-- GOWIN TRAVELS - SUPABASE SQL SCHEMA
-- ==========================================

-- 1. Categories Table (Must be created first as tour_packages references it)
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT
);

-- 2. Tour Packages Table (The core destination/tour model)
CREATE TABLE IF NOT EXISTS tour_packages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  price TEXT,  -- Uses TEXT to easily support formats like "1,299" or "From $500"
  location TEXT,
  duration TEXT,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  destination_type TEXT DEFAULT 'International', -- Added for National/International split
  images TEXT[] DEFAULT '{}',
  available_dates TEXT[] DEFAULT '{}'
);

-- 3. Place Details Table (Expanded Itinerary, Highlights, and Inclusions)
CREATE TABLE IF NOT EXISTS place_details (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  place_id UUID REFERENCES tour_packages(id) ON DELETE CASCADE,
  title TEXT,
  description TEXT,
  rating INTEGER DEFAULT 5,
  best_time TEXT,
  highlights TEXT[] DEFAULT '{}',
  inclusions TEXT[] DEFAULT '{}',
  itinerary JSONB DEFAULT '[]'::jsonb  -- JSON array of objects: [{day: 1, title: '', description: ''}]
);


-- 4. Bookings Table (Manages customer reservations)
CREATE TABLE IF NOT EXISTS bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  booking_date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  tour_id UUID REFERENCES tour_packages(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  user_email TEXT NOT NULL,
  num_people INTEGER DEFAULT 1,
  travel_date TEXT, 
  status TEXT DEFAULT 'Pending' -- Typical statuses flow: Pending -> Confirmed -> Cancelled
);

-- 5. Testimonials Table (User reviews and ratings)
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  user_name TEXT NOT NULL,
  designation TEXT,
  content TEXT NOT NULL,
  rating INTEGER DEFAULT 5,
  image_url TEXT,
  is_approved BOOLEAN DEFAULT false
);

-- 6. Contact Messages Table (For the main contact forms)
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  destination TEXT,
  message TEXT NOT NULL
);

-- 7. Newsletter Subscribers Table
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  email TEXT NOT NULL UNIQUE
);

-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================
-- Disable RLS initially so your frontend works instantly without policy restrictions.

ALTER TABLE categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE tour_packages DISABLE ROW LEVEL SECURITY;
ALTER TABLE place_details DISABLE ROW LEVEL SECURITY;
ALTER TABLE bookings DISABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials DISABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers DISABLE ROW LEVEL SECURITY;

NOTIFY pgrst, 'reload schema';
