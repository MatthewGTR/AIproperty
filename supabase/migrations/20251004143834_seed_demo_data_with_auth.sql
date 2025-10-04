/*
  # Seed Demo Data with Auth User

  1. Overview
    - Creates demo agent in auth.users
    - Creates matching profile
    - Seeds 6 sample properties

  2. Note
    - This uses a placeholder password hash
    - In production, use proper Supabase auth signup
*/

-- Insert demo auth user
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  role
) VALUES (
  '11111111-1111-1111-1111-111111111111',
  '00000000-0000-0000-0000-000000000000',
  'demo@agent.com',
  '$2a$10$placeholder',
  NOW(),
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Demo Agent"}',
  FALSE,
  'authenticated'
) ON CONFLICT (id) DO NOTHING;

-- Insert demo agent profile
INSERT INTO profiles (id, email, full_name, user_type, status)
VALUES (
  '11111111-1111-1111-1111-111111111111',
  'demo@agent.com',
  'Demo Agent',
  'agent',
  'approved'
) ON CONFLICT (id) DO NOTHING;

-- Insert sample properties
INSERT INTO properties (
  title, description, property_type, listing_type, price, bedrooms, bathrooms, sqft,
  address, city, state, amenities, agent_id, status, featured
) VALUES
  (
    'Modern 3BR Condo in KLCC',
    'Stunning modern condominium with panoramic city views. Fully furnished with premium fittings. Walking distance to KLCC and public transport.',
    'condo',
    'sale',
    850000,
    3,
    2,
    1200,
    'Jalan Ampang',
    'Kuala Lumpur',
    'Kuala Lumpur',
    ARRAY['Swimming Pool', 'Gym', 'Parking', '24/7 Security', 'Playground'],
    '11111111-1111-1111-1111-111111111111',
    'active',
    true
  ),
  (
    'Luxury 4BR House in Johor Bahru',
    'Spacious semi-detached house in gated community. Perfect for families with children. Near international schools.',
    'house',
    'sale',
    680000,
    4,
    3,
    2400,
    'Taman Mount Austin',
    'Johor Bahru',
    'Johor',
    ARRAY['Parking', '24/7 Security', 'Garden', 'Playground'],
    '11111111-1111-1111-1111-111111111111',
    'active',
    true
  ),
  (
    'Affordable 2BR Apartment for Rent',
    'Cozy apartment perfect for young professionals or small families. Near shopping malls and LRT station.',
    'apartment',
    'rent',
    1800,
    2,
    1,
    850,
    'Taman Desa',
    'Kuala Lumpur',
    'Kuala Lumpur',
    ARRAY['Parking', 'Security'],
    '11111111-1111-1111-1111-111111111111',
    'active',
    false
  ),
  (
    'Penang Seaview Condo',
    'Beautiful condominium with direct sea views. Modern facilities and prime location in Georgetown.',
    'condo',
    'sale',
    550000,
    3,
    2,
    1100,
    'Gurney Drive',
    'Georgetown',
    'Penang',
    ARRAY['Swimming Pool', 'Gym', 'Parking', 'Sea View'],
    '11111111-1111-1111-1111-111111111111',
    'active',
    true
  ),
  (
    'Spacious 5BR Villa in Petaling Jaya',
    'Grand bungalow with landscaped garden. Perfect for large families. Quiet neighborhood with excellent amenities.',
    'villa',
    'sale',
    1500000,
    5,
    4,
    3800,
    'Section 17',
    'Petaling Jaya',
    'Selangor',
    ARRAY['Parking', 'Garden', 'Swimming Pool', 'Security'],
    '11111111-1111-1111-1111-111111111111',
    'active',
    true
  ),
  (
    'Cozy Studio in Cyberjaya',
    'Modern studio apartment ideal for tech professionals. Near offices and public transport.',
    'studio',
    'rent',
    1200,
    1,
    1,
    450,
    'Shaftsbury Square',
    'Cyberjaya',
    'Selangor',
    ARRAY['Parking', 'Security', 'Gym'],
    '11111111-1111-1111-1111-111111111111',
    'active',
    false
  )
ON CONFLICT DO NOTHING;
