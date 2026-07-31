-- GoWin Travels starter data. Run once in the Supabase SQL editor.
-- Safe to re-run: skips rows that already exist (matched by name/title).

INSERT INTO categories (name)
SELECT 'Trekking' WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Trekking');
INSERT INTO categories (name)
SELECT 'Leisure' WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Leisure');
INSERT INTO categories (name)
SELECT 'Cultural' WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Cultural');
INSERT INTO categories (name)
SELECT 'Wildlife' WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Wildlife');
INSERT INTO categories (name)
SELECT 'Pilgrimage' WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Pilgrimage');
INSERT INTO categories (name)
SELECT 'Expedition' WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Expedition');
INSERT INTO categories (name)
SELECT 'Nature' WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Nature');
INSERT INTO categories (name)
SELECT 'Luxury' WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Luxury');
INSERT INTO categories (name)
SELECT 'Beach & Relax' WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Beach & Relax');
INSERT INTO categories (name)
SELECT 'Adventure' WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Adventure');
INSERT INTO categories (name)
SELECT 'City & Desert' WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'City & Desert');
INSERT INTO categories (name)
SELECT 'Aerial' WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Aerial');
INSERT INTO categories (name)
SELECT 'Water' WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Water');
INSERT INTO categories (name)
SELECT 'Extreme' WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Extreme');
INSERT INTO categories (name)
SELECT 'Lakes' WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Lakes');

INSERT INTO tour_packages (title, description, price, location, duration, destination_type, images, category_id)
SELECT 'Everest Base Camp Trek', 'Stand at the foot of the world''s highest peak. Trek through Namche Bazaar, Tengboche Monastery and glacial moraines on this iconic Himalayan journey.', 1299, 'Solukhumbu, Nepal', '14 Days / 13 Nights', 'National', ARRAY['https://images.unsplash.com/photo-1516490701338-fd7e5a94d6d7?auto=format&fit=crop&w=800&q=80'], (SELECT id FROM categories WHERE name = 'Trekking' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM tour_packages WHERE title = 'Everest Base Camp Trek');

INSERT INTO tour_packages (title, description, price, location, duration, destination_type, images, category_id)
SELECT 'Annapurna Circuit Trek', 'Cross the 5,416 m Thorong La pass on the world''s most celebrated circuit — from subtropical valleys to the arid Tibetan plateau and Muktinath temple.', 1149, 'Manang – Mustang, Nepal', '12 Days / 11 Nights', 'National', ARRAY['https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80'], (SELECT id FROM categories WHERE name = 'Trekking' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM tour_packages WHERE title = 'Annapurna Circuit Trek');

INSERT INTO tour_packages (title, description, price, location, duration, destination_type, images, category_id)
SELECT 'Pokhara & Sarangkot Escape', 'Paddle across Phewa Lake at sunrise, catch the Annapurna panorama from Sarangkot and unwind along Nepal''s most relaxed lakeside town.', 499, 'Pokhara, Nepal', '5 Days / 4 Nights', 'National', ARRAY['https://images.unsplash.com/photo-1605640840605-14ac1855827b?auto=format&fit=crop&w=800&q=80'], (SELECT id FROM categories WHERE name = 'Leisure' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM tour_packages WHERE title = 'Pokhara & Sarangkot Escape');

INSERT INTO tour_packages (title, description, price, location, duration, destination_type, images, category_id)
SELECT 'Kathmandu Valley Heritage Tour', 'Seven UNESCO World Heritage sites in one valley — Pashupatinath, Boudhanath, Swayambhunath and the medieval durbar squares of Bhaktapur and Patan.', 399, 'Kathmandu – Bhaktapur – Patan', '4 Days / 3 Nights', 'National', ARRAY['https://images.unsplash.com/photo-1614082242765-7c98ca0f3df3?auto=format&fit=crop&w=800&q=80'], (SELECT id FROM categories WHERE name = 'Cultural' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM tour_packages WHERE title = 'Kathmandu Valley Heritage Tour');

INSERT INTO tour_packages (title, description, price, location, duration, destination_type, images, category_id)
SELECT 'Chitwan Jungle Safari', 'Track one-horned rhinos and Royal Bengal tigers by jeep and dugout canoe through Nepal''s first national park, a UNESCO World Heritage site.', 549, 'Chitwan National Park, Nepal', '5 Days / 4 Nights', 'National', ARRAY['https://images.unsplash.com/photo-1549366021-9f761d450615?auto=format&fit=crop&w=800&q=80'], (SELECT id FROM categories WHERE name = 'Wildlife' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM tour_packages WHERE title = 'Chitwan Jungle Safari');

INSERT INTO tour_packages (title, description, price, location, duration, destination_type, images, category_id)
SELECT 'Lumbini & Buddha Circuit', 'Trace the birthplace of Lord Buddha through the sacred garden, Maya Devi Temple and the international monastic zone of Lumbini.', 649, 'Lumbini, Nepal', '7 Days / 6 Nights', 'National', ARRAY['https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80'], (SELECT id FROM categories WHERE name = 'Pilgrimage' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM tour_packages WHERE title = 'Lumbini & Buddha Circuit');

INSERT INTO tour_packages (title, description, price, location, duration, destination_type, images, category_id)
SELECT 'Upper Mustang Expedition', 'Journey into the forbidden kingdom — wind-carved canyons, whitewashed gompas and the walled medieval city of Lo Manthang beyond the Himalayas.', 1899, 'Lo Manthang, Mustang', '15 Days / 14 Nights', 'National', ARRAY['https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&w=800&q=80'], (SELECT id FROM categories WHERE name = 'Expedition' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM tour_packages WHERE title = 'Upper Mustang Expedition');

INSERT INTO tour_packages (title, description, price, location, duration, destination_type, images, category_id)
SELECT 'Langtang Valley Trek', 'The closest Himalayan valley to Kathmandu — Tamang villages, yak pastures and the panoramic climb to Kyanjin Ri at 4,773 m.', 849, 'Rasuwa, Nepal', '9 Days / 8 Nights', 'National', ARRAY['https://images.unsplash.com/photo-1434394354979-a235cd36269d?auto=format&fit=crop&w=800&q=80'], (SELECT id FROM categories WHERE name = 'Trekking' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM tour_packages WHERE title = 'Langtang Valley Trek');

INSERT INTO tour_packages (title, description, price, location, duration, destination_type, images, category_id)
SELECT 'Rara Lake Wilderness', 'Fly into remote Karnali and camp beside Nepal''s largest lake — a sapphire mirror ringed by pine forest inside Rara National Park.', 1099, 'Mugu, Karnali', '8 Days / 7 Nights', 'National', ARRAY['https://images.unsplash.com/photo-1439066615861-d1af74d74000?auto=format&fit=crop&w=800&q=80'], (SELECT id FROM categories WHERE name = 'Nature' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM tour_packages WHERE title = 'Rara Lake Wilderness');

INSERT INTO tour_packages (title, description, price, location, duration, destination_type, images, category_id)
SELECT 'Gosaikunda Holy Lakes Trek', 'Climb through rhododendron forest to the sacred alpine lakes at 4,380 m — a pilgrimage site wrapped in Himalayan legend.', 749, 'Langtang National Park', '7 Days / 6 Nights', 'National', ARRAY['https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=800&q=80'], (SELECT id FROM categories WHERE name = 'Trekking' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM tour_packages WHERE title = 'Gosaikunda Holy Lakes Trek');

INSERT INTO tour_packages (title, description, price, location, duration, destination_type, images, category_id)
SELECT 'Nagarkot & Dhulikhel Sunrise', 'Watch dawn ignite an 8,000 m skyline from Everest to Annapurna, then hike village trails between Nagarkot and Dhulikhel.', 299, 'Nagarkot, Nepal', '3 Days / 2 Nights', 'National', ARRAY['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80'], (SELECT id FROM categories WHERE name = 'Leisure' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM tour_packages WHERE title = 'Nagarkot & Dhulikhel Sunrise');

INSERT INTO tour_packages (title, description, price, location, duration, destination_type, images, category_id)
SELECT 'Bandipur & Tansen Heritage Trail', 'Wander car-free Newari bazaars frozen in the 18th century, with Himalayan views from the Thani Mai ridge above Bandipur.', 449, 'Bandipur, Nepal', '4 Days / 3 Nights', 'National', ARRAY['https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=800&q=80'], (SELECT id FROM categories WHERE name = 'Cultural' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM tour_packages WHERE title = 'Bandipur & Tansen Heritage Trail');

INSERT INTO tour_packages (title, description, price, location, duration, destination_type, images, category_id)
SELECT 'Santorini Luxury Escape', 'Perch above the caldera in a whitewashed cliff-side villa and watch the sun melt into the Aegean Sea every evening.', 2499, 'Santorini, Greece', '8 Days / 7 Nights', 'International', ARRAY['https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=80'], (SELECT id FROM categories WHERE name = 'Luxury' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM tour_packages WHERE title = 'Santorini Luxury Escape');

INSERT INTO tour_packages (title, description, price, location, duration, destination_type, images, category_id)
SELECT 'Bali Island Retreat', 'Jungle yoga retreats, ancient temple ceremonies and world-class surf breaks blend seamlessly on the Island of the Gods.', 1199, 'Ubud & Seminyak, Indonesia', '10 Days / 9 Nights', 'International', ARRAY['https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80'], (SELECT id FROM categories WHERE name = 'Beach & Relax' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM tour_packages WHERE title = 'Bali Island Retreat');

INSERT INTO tour_packages (title, description, price, location, duration, destination_type, images, category_id)
SELECT 'Swiss Alps Adventure', 'Ski pristine powder, hike azure alpine lakes and ride the rack railway to Jungfraujoch, the Top of Europe.', 3199, 'Interlaken, Switzerland', '7 Days / 6 Nights', 'International', ARRAY['https://images.unsplash.com/photo-1527668752968-14dc70a27c95?auto=format&fit=crop&w=800&q=80'], (SELECT id FROM categories WHERE name = 'Adventure' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM tour_packages WHERE title = 'Swiss Alps Adventure');

INSERT INTO tour_packages (title, description, price, location, duration, destination_type, images, category_id)
SELECT 'Maldives Overwater Villa', 'Step from your glass-floor villa directly into turquoise lagoons teeming with manta rays, turtles and neon reef fish.', 4299, 'North Malé Atoll, Maldives', '7 Days / 6 Nights', 'International', ARRAY['https://images.unsplash.com/photo-1512100606965-79612a713bb5?auto=format&fit=crop&w=800&q=80'], (SELECT id FROM categories WHERE name = 'Luxury' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM tour_packages WHERE title = 'Maldives Overwater Villa');

INSERT INTO tour_packages (title, description, price, location, duration, destination_type, images, category_id)
SELECT 'Kyoto Cultural Journey', 'Walk bamboo groves at dawn, join a tea ceremony and marvel at a thousand crimson torii gates at Fushimi Inari.', 2199, 'Kyoto, Japan', '9 Days / 8 Nights', 'International', ARRAY['https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80'], (SELECT id FROM categories WHERE name = 'Cultural' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM tour_packages WHERE title = 'Kyoto Cultural Journey');

INSERT INTO tour_packages (title, description, price, location, duration, destination_type, images, category_id)
SELECT 'Dubai City & Desert', 'From the observation deck of the Burj Khalifa to sunset dune-bashing and a Bedouin-style desert camp under the stars.', 1799, 'Dubai, UAE', '6 Days / 5 Nights', 'International', ARRAY['https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80'], (SELECT id FROM categories WHERE name = 'City & Desert' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM tour_packages WHERE title = 'Dubai City & Desert');

INSERT INTO tour_packages (title, description, price, location, duration, destination_type, images, category_id)
SELECT 'Paragliding over Phewa Lake', 'Launch from Sarangkot ridge and thermal alongside Himalayan griffons with the Annapurna range on the horizon.', 95, 'Sarangkot, Pokhara', '30–60 min flight', 'National', ARRAY['https://images.unsplash.com/photo-1441829266145-6d4bfbd38eb4?auto=format&fit=crop&w=800&q=80'], (SELECT id FROM categories WHERE name = 'Aerial' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM tour_packages WHERE title = 'Paragliding over Phewa Lake');

INSERT INTO tour_packages (title, description, price, location, duration, destination_type, images, category_id)
SELECT 'Trishuli White-Water Rafting', 'Grade III+ rapids, canyon scenery and riverside camps on Nepal''s most accessible white-water run.', 65, 'Trishuli River, Nepal', '1–2 Days', 'National', ARRAY['https://images.unsplash.com/photo-1522163182402-834f871fd851?auto=format&fit=crop&w=800&q=80'], (SELECT id FROM categories WHERE name = 'Water' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM tour_packages WHERE title = 'Trishuli White-Water Rafting');

INSERT INTO tour_packages (title, description, price, location, duration, destination_type, images, category_id)
SELECT 'Everest Mountain Flight', 'A window-seat-guaranteed scenic flight past Everest, Lhotse and Ama Dablam — the Himalayas without the trek.', 235, 'Kathmandu, Nepal', '1 Hour', 'National', ARRAY['https://images.unsplash.com/photo-1516490701338-fd7e5a94d6d7?auto=format&fit=crop&w=800&q=80'], (SELECT id FROM categories WHERE name = 'Aerial' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM tour_packages WHERE title = 'Everest Mountain Flight');

INSERT INTO tour_packages (title, description, price, location, duration, destination_type, images, category_id)
SELECT 'Annapurna Base Camp Trek', 'Climb into a natural amphitheatre of 7,000 m peaks — Machhapuchhre, Hiunchuli and Annapurna I towering overhead.', 899, 'Annapurna Sanctuary', '10 Days / 9 Nights', 'National', ARRAY['https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80'], (SELECT id FROM categories WHERE name = 'Trekking' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM tour_packages WHERE title = 'Annapurna Base Camp Trek');

INSERT INTO tour_packages (title, description, price, location, duration, destination_type, images, category_id)
SELECT 'Bhote Koshi Bungee Jump', 'A 160 m free-fall from a suspension bridge over the raging Bhote Koshi — one of the highest bungee jumps on Earth.', 110, 'Bhote Koshi Gorge, Nepal', 'Full Day', 'National', ARRAY['https://images.unsplash.com/photo-1601024445121-e5b82f020549?auto=format&fit=crop&w=800&q=80'], (SELECT id FROM categories WHERE name = 'Extreme' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM tour_packages WHERE title = 'Bhote Koshi Bungee Jump');

INSERT INTO tour_packages (title, description, price, location, duration, destination_type, images, category_id)
SELECT 'Bardiya Wilderness Safari', 'Nepal''s wildest park — the best tiger-tracking odds in the country, plus wild elephants and Gangetic dolphins.', 699, 'Bardiya National Park', '6 Days / 5 Nights', 'National', ARRAY['https://images.unsplash.com/photo-1549366021-9f761d450615?auto=format&fit=crop&w=800&q=80'], (SELECT id FROM categories WHERE name = 'Wildlife' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM tour_packages WHERE title = 'Bardiya Wilderness Safari');

INSERT INTO tour_packages (title, description, price, location, duration, destination_type, images, category_id)
SELECT 'Mardi Himal Ridge Trek', 'The Annapurna region''s best-kept secret — a ridge-line trail straight toward the sacred fishtail peak of Machhapuchhre.', 649, 'Kaski, Nepal', '7 Days / 6 Nights', 'National', ARRAY['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80'], (SELECT id FROM categories WHERE name = 'Trekking' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM tour_packages WHERE title = 'Mardi Himal Ridge Trek');

INSERT INTO tour_packages (title, description, price, location, duration, destination_type, images, category_id)
SELECT 'Kayaking on Phewa Lake', 'Glide past the Tal Barahi island temple with the Annapurnas reflected in the water — Pokhara at its most peaceful.', 25, 'Pokhara, Nepal', 'Half Day', 'National', ARRAY['https://images.unsplash.com/photo-1605640840605-14ac1855827b?auto=format&fit=crop&w=800&q=80'], (SELECT id FROM categories WHERE name = 'Water' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM tour_packages WHERE title = 'Kayaking on Phewa Lake');

INSERT INTO tour_packages (title, description, price, location, duration, destination_type, images, category_id)
SELECT 'Phewa Lake', 'Nepal''s most famous lake — wooden boats, the island temple of Tal Barahi and the Machhapuchhre reflection at dawn.', 25, 'Pokhara, Nepal', 'Day Trip', 'National', ARRAY['https://images.unsplash.com/photo-1605640840605-14ac1855827b?auto=format&fit=crop&w=800&q=80'], (SELECT id FROM categories WHERE name = 'Lakes' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM tour_packages WHERE title = 'Phewa Lake');

INSERT INTO tour_packages (title, description, price, location, duration, destination_type, images, category_id)
SELECT 'Rara Lake', 'The "Queen of Lakes" — Nepal''s largest and deepest, hidden in remote Karnali pine forest at 2,990 m.', 1099, 'Mugu, Karnali', '8 Days / 7 Nights', 'National', ARRAY['https://images.unsplash.com/photo-1439066615861-d1af74d74000?auto=format&fit=crop&w=800&q=80'], (SELECT id FROM categories WHERE name = 'Lakes' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM tour_packages WHERE title = 'Rara Lake');

INSERT INTO tour_packages (title, description, price, location, duration, destination_type, images, category_id)
SELECT 'Tilicho Lake', 'One of the highest lakes on Earth at 4,919 m, cradled beneath the north face of Tilicho Peak on the Annapurna Circuit.', 999, 'Manang, Nepal', '10 Days / 9 Nights', 'National', ARRAY['https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=800&q=80'], (SELECT id FROM categories WHERE name = 'Lakes' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM tour_packages WHERE title = 'Tilicho Lake');

INSERT INTO tour_packages (title, description, price, location, duration, destination_type, images, category_id)
SELECT 'Gosaikunda', 'A sacred alpine lake at 4,380 m — legend says Lord Shiva struck the mountain with his trident to create it.', 749, 'Rasuwa, Nepal', '7 Days / 6 Nights', 'National', ARRAY['https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80'], (SELECT id FROM categories WHERE name = 'Lakes' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM tour_packages WHERE title = 'Gosaikunda');

INSERT INTO tour_packages (title, description, price, location, duration, destination_type, images, category_id)
SELECT 'Gokyo Lakes', 'Six turquoise glacial lakes beside the Ngozumpa Glacier, with the Everest panorama from Gokyo Ri above.', 1399, 'Solukhumbu, Nepal', '12 Days / 11 Nights', 'National', ARRAY['https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=800&q=80'], (SELECT id FROM categories WHERE name = 'Lakes' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM tour_packages WHERE title = 'Gokyo Lakes');

INSERT INTO tour_packages (title, description, price, location, duration, destination_type, images, category_id)
SELECT 'Begnas & Rupa Lakes', 'Pokhara''s quieter twin lakes — paddy-field shores, fresh-fish kitchens and barely another tourist in sight.', 199, 'Kaski, Nepal', '2 Days / 1 Night', 'National', ARRAY['https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=800&q=80'], (SELECT id FROM categories WHERE name = 'Lakes' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM tour_packages WHERE title = 'Begnas & Rupa Lakes');


