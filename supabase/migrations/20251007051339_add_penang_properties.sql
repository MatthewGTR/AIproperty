/*
  # Add Penang Properties
  
  This migration adds more properties in Penang to provide better coverage for users searching in that area.
  
  ## Properties Added
  - 3 sale properties in Penang (Georgetown, Batu Ferringhi)
  - 2 rent properties in Penang
  - Price range: RM650k-RM3.5M (sale), RM2.5k-RM5k/month (rent)
  
  ## Security
  - All properties use demo agent
  - RLS policies already in place
*/

DO $$
DECLARE
  demo_agent_id uuid := '11111111-1111-1111-1111-111111111111'::uuid;
  prop_id uuid;
BEGIN

-- Sale Property 1: Penang Beachfront Villa - Batu Ferringhi
INSERT INTO properties (title, description, price, property_type, listing_type, bedrooms, bathrooms, sqft, address, city, state, country, amenities, featured, agent_id, status, created_at, updated_at)
VALUES ('Penang Beachfront Villa - Batu Ferringhi', 'Stunning beachfront villa with direct beach access. Panoramic sea views, private infinity pool, and lush tropical gardens. Perfect for luxury living or holiday retreat.', 3500000, 'villa', 'sale', 6, 5, 4500, 'Batu Ferringhi', 'Penang', 'Penang', 'Malaysia', ARRAY['Beachfront', 'Private Pool', 'Sea View', 'Garden', 'Luxury Finishes', 'Double Garage'], true, demo_agent_id, 'active', '2025-01-09', '2025-01-09')
RETURNING id INTO prop_id;

INSERT INTO property_images (property_id, image_url, display_order, is_primary)
VALUES 
  (prop_id, 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800', 1, true),
  (prop_id, 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=800', 2, false),
  (prop_id, 'https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg?auto=compress&cs=tinysrgb&w=800', 3, false);

-- Sale Property 2: Heritage Shophouse - Georgetown
INSERT INTO properties (title, description, price, property_type, listing_type, bedrooms, bathrooms, sqft, address, city, state, country, amenities, featured, agent_id, status, created_at, updated_at)
VALUES ('Heritage Shophouse - Georgetown', 'Beautifully restored pre-war shophouse in UNESCO World Heritage zone. Original features preserved with modern amenities added. Prime location in Armenian Street area.', 1800000, 'house', 'sale', 0, 3, 2800, 'Armenian Street', 'Georgetown', 'Penang', 'Malaysia', ARRAY['Heritage Building', 'Commercial Use', 'Tourist Area', 'UNESCO Zone', 'Investment Potential', 'High Traffic'], true, demo_agent_id, 'active', '2025-01-06', '2025-01-06')
RETURNING id INTO prop_id;

INSERT INTO property_images (property_id, image_url, display_order, is_primary)
VALUES 
  (prop_id, 'https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg?auto=compress&cs=tinysrgb&w=800', 1, true),
  (prop_id, 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=800', 2, false),
  (prop_id, 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800', 3, false);

-- Sale Property 3: Modern Condo - Tanjung Tokong
INSERT INTO properties (title, description, price, property_type, listing_type, bedrooms, bathrooms, sqft, address, city, state, country, amenities, featured, agent_id, status, created_at, updated_at)
VALUES ('Modern Seaview Condo - Tanjung Tokong', 'Contemporary condominium with stunning sea views overlooking Penang strait. Resort-style facilities including infinity pool, gym, and private beach access. Close to Gurney Drive.', 950000, 'condo', 'sale', 4, 3, 1800, 'Tanjung Tokong', 'Penang', 'Penang', 'Malaysia', ARRAY['Sea View', 'Infinity Pool', 'Gym', 'Beach Access', 'Security', 'Near Gurney Drive'], true, demo_agent_id, 'active', '2025-01-08', '2025-01-08')
RETURNING id INTO prop_id;

INSERT INTO property_images (property_id, image_url, display_order, is_primary)
VALUES 
  (prop_id, 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800', 1, true),
  (prop_id, 'https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg?auto=compress&cs=tinysrgb&w=800', 2, false),
  (prop_id, 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800', 3, false);

-- Rent Property 1: Luxury Penthouse - Gurney Drive
INSERT INTO properties (title, description, price, property_type, listing_type, bedrooms, bathrooms, sqft, address, city, state, country, amenities, deposit_info, furnished, featured, agent_id, status, created_at, updated_at)
VALUES ('Luxury Penthouse - Gurney Drive', 'Exclusive penthouse with panoramic sea views and city skyline. Walking distance to Gurney Plaza and famous hawker centers. Fully furnished with premium fittings and appliances.', 5000, 'condo', 'rent', 4, 3, 2000, 'Gurney Drive', 'Georgetown', 'Penang', 'Malaysia', ARRAY['Sea View', 'City View', 'Near Mall', 'Swimming Pool', 'Gym', 'Security'], '3 months + 1 month advance', 'fully_furnished', true, demo_agent_id, 'active', NOW(), NOW())
RETURNING id INTO prop_id;

INSERT INTO property_images (property_id, image_url, display_order, is_primary)
VALUES 
  (prop_id, 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800', 1, true),
  (prop_id, 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800', 2, false),
  (prop_id, 'https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg?auto=compress&cs=tinysrgb&w=800', 3, false);

-- Rent Property 2: Cozy Apartment - Tanjung Bungah
INSERT INTO properties (title, description, price, property_type, listing_type, bedrooms, bathrooms, sqft, address, city, state, country, amenities, deposit_info, furnished, featured, agent_id, status, created_at, updated_at)
VALUES ('Cozy Seaview Apartment - Tanjung Bungah', 'Comfortable 2-bedroom apartment with partial sea view. Perfect for expats and families. Close to international schools and beach. Quiet residential area with easy access to Georgetown.', 2500, 'apartment', 'rent', 2, 2, 1100, 'Tanjung Bungah', 'Penang', 'Penang', 'Malaysia', ARRAY['Partial Sea View', 'Near Beach', 'Near International School', 'Swimming Pool', 'Security', 'Quiet Area'], '2 months + 1 month advance', 'fully_furnished', false, demo_agent_id, 'active', NOW(), NOW())
RETURNING id INTO prop_id;

INSERT INTO property_images (property_id, image_url, display_order, is_primary)
VALUES 
  (prop_id, 'https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg?auto=compress&cs=tinysrgb&w=800', 1, true),
  (prop_id, 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800', 2, false),
  (prop_id, 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800', 3, false);

-- Rent Property 3: Studio - Georgetown
INSERT INTO properties (title, description, price, property_type, listing_type, bedrooms, bathrooms, sqft, address, city, state, country, amenities, deposit_info, furnished, featured, agent_id, status, created_at, updated_at)
VALUES ('Modern Studio - Georgetown Heritage', 'Stylish studio apartment in the heart of Georgetown UNESCO area. Walking distance to street art, cafes, and cultural attractions. Perfect for young professionals or digital nomads.', 1800, 'studio', 'rent', 1, 1, 550, 'Georgetown', 'Georgetown', 'Penang', 'Malaysia', ARRAY['UNESCO Area', 'Near Cafes', 'Cultural District', 'WiFi', 'Public Transport', 'Tourist Area'], '2 months + 1 month advance', 'fully_furnished', false, demo_agent_id, 'active', NOW(), NOW())
RETURNING id INTO prop_id;

INSERT INTO property_images (property_id, image_url, display_order, is_primary)
VALUES 
  (prop_id, 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800', 1, true),
  (prop_id, 'https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg?auto=compress&cs=tinysrgb&w=800', 2, false),
  (prop_id, 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800', 3, false);

END $$;
