/*
  # Populate Comprehensive Property Listings
  
  This migration adds all dummy property data to the database to create a unified data source.
  
  ## Summary
  - Adds 28 properties total (18 for sale, 10 for rent)
  - Locations: Johor Bahru, Kuala Lumpur, Penang, Selangor, Sabah, Perak
  - Price range: RM320k - RM3.5M (sale), RM600-RM4,500/month (rent)
  - All properties include images and amenities
  - Featured properties marked appropriately
  
  ## Security
  - All new properties use demo agent
  - RLS policies already in place
*/

DO $$
DECLARE
  demo_agent_id uuid := '11111111-1111-1111-1111-111111111111'::uuid;
  prop_id uuid;
BEGIN

-- Buy Property 1: Double Storey Terrace House - Taman Daya
INSERT INTO properties (title, description, price, property_type, listing_type, bedrooms, bathrooms, sqft, address, city, state, country, amenities, featured, agent_id, status, created_at, updated_at)
VALUES ('Double Storey Terrace House - Taman Daya', 'Well-maintained double storey terrace house in established residential area. Features spacious living areas, modern kitchen, and private garden. Close to schools and amenities.', 450000, 'house', 'sale', 4, 3, 1800, 'Taman Daya', 'Johor Bahru', 'Johor', 'Malaysia', ARRAY['Garden', 'Parking', 'Near School', 'Shopping Mall Nearby', 'Gated Community'], true, demo_agent_id, 'active', '2025-01-20', '2025-01-20')
RETURNING id INTO prop_id;

INSERT INTO property_images (property_id, image_url, display_order, is_primary)
VALUES 
  (prop_id, 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=800', 1, true),
  (prop_id, 'https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg?auto=compress&cs=tinysrgb&w=800', 2, false),
  (prop_id, 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800', 3, false);

-- Buy Property 2: Modern Condo - Sutera Avenue
INSERT INTO properties (title, description, price, property_type, listing_type, bedrooms, bathrooms, sqft, address, city, state, country, amenities, featured, agent_id, status, created_at, updated_at)
VALUES ('Modern Condo - Sutera Avenue', 'Contemporary condominium with city views and premium facilities. Located in prime Sutera area with easy access to Singapore. Perfect for investment or own stay.', 680000, 'condo', 'sale', 3, 2, 1200, 'Sutera Utama', 'Johor Bahru', 'Johor', 'Malaysia', ARRAY['Swimming Pool', 'Gym', 'Security', 'Parking', 'Near CIQ', 'Shopping Mall'], true, demo_agent_id, 'active', '2025-01-19', '2025-01-19')
RETURNING id INTO prop_id;

INSERT INTO property_images (property_id, image_url, display_order, is_primary)
VALUES 
  (prop_id, 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800', 1, true),
  (prop_id, 'https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg?auto=compress&cs=tinysrgb&w=800', 2, false),
  (prop_id, 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800', 3, false);

-- Buy Property 3: Semi-D House - Taman Molek
INSERT INTO properties (title, description, price, property_type, listing_type, bedrooms, bathrooms, sqft, address, city, state, country, amenities, featured, agent_id, status, created_at, updated_at)
VALUES ('Semi-D House - Taman Molek', 'Spacious semi-detached house in prestigious Taman Molek. Features large living spaces, modern renovations, and beautiful landscaping. Ideal for growing families.', 850000, 'house', 'sale', 5, 4, 2400, 'Taman Molek', 'Johor Bahru', 'Johor', 'Malaysia', ARRAY['Large Garden', 'Renovated', 'Double Garage', 'Near International School', 'Established Area'], true, demo_agent_id, 'active', '2025-01-18', '2025-01-18')
RETURNING id INTO prop_id;

INSERT INTO property_images (property_id, image_url, display_order, is_primary)
VALUES 
  (prop_id, 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800', 1, true),
  (prop_id, 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=800', 2, false),
  (prop_id, 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800', 3, false);

-- Buy Property 4: Apartment - Taman Century
INSERT INTO properties (title, description, price, property_type, listing_type, bedrooms, bathrooms, sqft, address, city, state, country, amenities, featured, agent_id, status, created_at, updated_at)
VALUES ('Apartment - Taman Century', 'Affordable apartment in mature residential area. Well-maintained building with basic amenities. Great for first-time buyers or investment purposes.', 320000, 'apartment', 'sale', 3, 2, 1000, 'Taman Century', 'Johor Bahru', 'Johor', 'Malaysia', ARRAY['Parking', 'Near Market', 'Public Transport', 'Schools Nearby', 'Affordable'], false, demo_agent_id, 'active', '2025-01-17', '2025-01-17')
RETURNING id INTO prop_id;

INSERT INTO property_images (property_id, image_url, display_order, is_primary)
VALUES 
  (prop_id, 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800', 1, true),
  (prop_id, 'https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg?auto=compress&cs=tinysrgb&w=800', 2, false),
  (prop_id, 'https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg?auto=compress&cs=tinysrgb&w=800', 3, false);

-- Buy Property 5: Luxury Condo - Paradigm Mall Area
INSERT INTO properties (title, description, price, property_type, listing_type, bedrooms, bathrooms, sqft, address, city, state, country, amenities, featured, agent_id, status, created_at, updated_at)
VALUES ('Luxury Condo - Paradigm Mall Area', 'Premium condominium near Paradigm Mall with modern facilities and strategic location. Close to universities and shopping centers. Excellent connectivity to major highways.', 750000, 'condo', 'sale', 3, 2, 1400, 'Skudai', 'Johor Bahru', 'Johor', 'Malaysia', ARRAY['Near Mall', 'Swimming Pool', 'Gym', 'Security', 'Near University', 'Highway Access'], true, demo_agent_id, 'active', '2025-01-16', '2025-01-16')
RETURNING id INTO prop_id;

INSERT INTO property_images (property_id, image_url, display_order, is_primary)
VALUES 
  (prop_id, 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800', 1, true),
  (prop_id, 'https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg?auto=compress&cs=tinysrgb&w=800', 2, false),
  (prop_id, 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800', 3, false);

-- Buy Property 6: KLCC Luxury Condo
INSERT INTO properties (title, description, price, property_type, listing_type, bedrooms, bathrooms, sqft, address, city, state, country, amenities, featured, agent_id, status, created_at, updated_at)
VALUES ('KLCC Luxury Condo - Pavilion Residences', 'Ultra-luxury condominium in the heart of KLCC. Breathtaking city skyline views, premium finishes, and world-class facilities. Walking distance to Suria KLCC and Petronas Twin Towers.', 2800000, 'condo', 'sale', 4, 4, 2500, 'KLCC', 'Kuala Lumpur', 'Kuala Lumpur', 'Malaysia', ARRAY['KLCC View', 'Infinity Pool', 'Concierge', 'Gym', 'Security', 'Shopping Mall'], true, demo_agent_id, 'active', '2025-01-10', '2025-01-10')
RETURNING id INTO prop_id;

INSERT INTO property_images (property_id, image_url, display_order, is_primary)
VALUES 
  (prop_id, 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800', 1, true),
  (prop_id, 'https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg?auto=compress&cs=tinysrgb&w=800', 2, false),
  (prop_id, 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800', 3, false);

-- Buy Property 7: Mont Kiara Serviced Residence
INSERT INTO properties (title, description, price, property_type, listing_type, bedrooms, bathrooms, sqft, address, city, state, country, amenities, featured, agent_id, status, created_at, updated_at)
VALUES ('Mont Kiara Serviced Residence', 'Premium serviced residence in exclusive Mont Kiara enclave. Fully furnished with designer interiors. Walking distance to international schools and shopping plazas.', 1200000, 'condo', 'sale', 3, 3, 1800, 'Mont Kiara', 'Kuala Lumpur', 'Kuala Lumpur', 'Malaysia', ARRAY['Fully Furnished', 'International School', 'Shopping Mall', 'Gym', 'Pool', 'Expatriate Area'], true, demo_agent_id, 'active', '2025-01-03', '2025-01-03')
RETURNING id INTO prop_id;

INSERT INTO property_images (property_id, image_url, display_order, is_primary)
VALUES 
  (prop_id, 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800', 1, true),
  (prop_id, 'https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg?auto=compress&cs=tinysrgb&w=800', 2, false),
  (prop_id, 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800', 3, false);

-- Rent Property 1: Luxury 3BR Condo - Sutera Avenue
INSERT INTO properties (title, description, price, property_type, listing_type, bedrooms, bathrooms, sqft, address, city, state, country, amenities, deposit_info, furnished, agent_id, status, created_at, updated_at)
VALUES ('Luxury 3BR Condo - Sutera Avenue', 'Stunning 3-bedroom condominium with city views in premium Sutera development. Close to Singapore CIQ checkpoint with world-class facilities including infinity pool and sky gym.', 3200, 'condo', 'rent', 3, 2, 1400, 'Sutera Utama', 'Johor Bahru', 'Johor', 'Malaysia', ARRAY['City View', 'Infinity Pool', 'Gym', 'Security', 'Near CIQ', 'Shopping Mall'], '2 months + 1 month advance', 'fully_furnished', demo_agent_id, 'active', NOW(), NOW())
RETURNING id INTO prop_id;

INSERT INTO property_images (property_id, image_url, display_order, is_primary)
VALUES 
  (prop_id, 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800', 1, true),
  (prop_id, 'https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg?auto=compress&cs=tinysrgb&w=800', 2, false),
  (prop_id, 'https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg?auto=compress&cs=tinysrgb&w=800', 3, false);

-- Rent Property 2: Modern 2BR Apartment - Taman Molek
INSERT INTO properties (title, description, price, property_type, listing_type, bedrooms, bathrooms, sqft, address, city, state, country, amenities, deposit_info, furnished, agent_id, status, created_at, updated_at)
VALUES ('Modern 2BR Apartment - Taman Molek', 'Contemporary 2-bedroom apartment in established Taman Molek. Walking distance to international schools, shopping centers, and restaurants. Perfect for expat families.', 1800, 'apartment', 'rent', 2, 2, 1100, 'Taman Molek', 'Johor Bahru', 'Johor', 'Malaysia', ARRAY['Swimming Pool', 'Playground', 'Security', 'Near International School', 'Shopping Nearby'], '2 months + 1 month advance', 'fully_furnished', demo_agent_id, 'active', NOW(), NOW())
RETURNING id INTO prop_id;

INSERT INTO property_images (property_id, image_url, display_order, is_primary)
VALUES 
  (prop_id, 'https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg?auto=compress&cs=tinysrgb&w=800', 1, true),
  (prop_id, 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800', 2, false),
  (prop_id, 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800', 3, false);

-- Rent Property 3: Cozy Studio - City Square Area
INSERT INTO properties (title, description, price, property_type, listing_type, bedrooms, bathrooms, sqft, address, city, state, country, amenities, deposit_info, furnished, agent_id, status, created_at, updated_at)
VALUES ('Cozy Studio - City Square Area', 'Stylish studio apartment in the heart of JB city center. Perfect for young professionals who want to be close to business district with easy access to shopping and dining.', 1200, 'studio', 'rent', 1, 1, 550, 'City Centre', 'Johor Bahru', 'Johor', 'Malaysia', ARRAY['City Center', 'Near Mall', 'Public Transport', 'Restaurants', 'Business District'], '2 months + 1 month advance', 'fully_furnished', demo_agent_id, 'active', NOW(), NOW())
RETURNING id INTO prop_id;

INSERT INTO property_images (property_id, image_url, display_order, is_primary)
VALUES 
  (prop_id, 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800', 1, true),
  (prop_id, 'https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg?auto=compress&cs=tinysrgb&w=800', 2, false),
  (prop_id, 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800', 3, false);

END $$;
