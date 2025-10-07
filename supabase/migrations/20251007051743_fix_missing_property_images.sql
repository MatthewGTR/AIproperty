/*
  # Fix Missing Property Images
  
  This migration adds images to properties that were missing them.
  
  ## Properties Fixed
  - 6 properties that had no images
  
  ## Security
  - No RLS changes needed
*/

-- Add images for Penang Seaview Condo
INSERT INTO property_images (property_id, image_url, display_order, is_primary)
SELECT 'e1033845-6445-41a0-8972-68b418facc9a'::uuid, 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800', 1, true
WHERE NOT EXISTS (SELECT 1 FROM property_images WHERE property_id = 'e1033845-6445-41a0-8972-68b418facc9a'::uuid);

INSERT INTO property_images (property_id, image_url, display_order, is_primary)
SELECT 'e1033845-6445-41a0-8972-68b418facc9a'::uuid, 'https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg?auto=compress&cs=tinysrgb&w=800', 2, false
WHERE NOT EXISTS (SELECT 1 FROM property_images WHERE property_id = 'e1033845-6445-41a0-8972-68b418facc9a'::uuid AND image_url = 'https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg?auto=compress&cs=tinysrgb&w=800');

INSERT INTO property_images (property_id, image_url, display_order, is_primary)
SELECT 'e1033845-6445-41a0-8972-68b418facc9a'::uuid, 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800', 3, false
WHERE NOT EXISTS (SELECT 1 FROM property_images WHERE property_id = 'e1033845-6445-41a0-8972-68b418facc9a'::uuid AND image_url = 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800');

-- Add images for Affordable 2BR Apartment for Rent (KL)
INSERT INTO property_images (property_id, image_url, display_order, is_primary)
SELECT '3fbaae36-17d4-4182-ba2b-59ec3bfee5ee'::uuid, 'https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg?auto=compress&cs=tinysrgb&w=800', 1, true
WHERE NOT EXISTS (SELECT 1 FROM property_images WHERE property_id = '3fbaae36-17d4-4182-ba2b-59ec3bfee5ee'::uuid);

INSERT INTO property_images (property_id, image_url, display_order, is_primary)
SELECT '3fbaae36-17d4-4182-ba2b-59ec3bfee5ee'::uuid, 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800', 2, false
WHERE NOT EXISTS (SELECT 1 FROM property_images WHERE property_id = '3fbaae36-17d4-4182-ba2b-59ec3bfee5ee'::uuid AND image_url = 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800');

INSERT INTO property_images (property_id, image_url, display_order, is_primary)
SELECT '3fbaae36-17d4-4182-ba2b-59ec3bfee5ee'::uuid, 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800', 3, false
WHERE NOT EXISTS (SELECT 1 FROM property_images WHERE property_id = '3fbaae36-17d4-4182-ba2b-59ec3bfee5ee'::uuid AND image_url = 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800');

-- Add images for Cozy Studio in Cyberjaya
INSERT INTO property_images (property_id, image_url, display_order, is_primary)
SELECT '3a7d5eb5-a074-4a85-b555-5ed15c2a5bec'::uuid, 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800', 1, true
WHERE NOT EXISTS (SELECT 1 FROM property_images WHERE property_id = '3a7d5eb5-a074-4a85-b555-5ed15c2a5bec'::uuid);

INSERT INTO property_images (property_id, image_url, display_order, is_primary)
SELECT '3a7d5eb5-a074-4a85-b555-5ed15c2a5bec'::uuid, 'https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg?auto=compress&cs=tinysrgb&w=800', 2, false
WHERE NOT EXISTS (SELECT 1 FROM property_images WHERE property_id = '3a7d5eb5-a074-4a85-b555-5ed15c2a5bec'::uuid AND image_url = 'https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg?auto=compress&cs=tinysrgb&w=800');

INSERT INTO property_images (property_id, image_url, display_order, is_primary)
SELECT '3a7d5eb5-a074-4a85-b555-5ed15c2a5bec'::uuid, 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800', 3, false
WHERE NOT EXISTS (SELECT 1 FROM property_images WHERE property_id = '3a7d5eb5-a074-4a85-b555-5ed15c2a5bec'::uuid AND image_url = 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800');

-- Add images for Luxury 4BR House in Johor Bahru
INSERT INTO property_images (property_id, image_url, display_order, is_primary)
SELECT 'd871708a-942e-41d8-84a2-17cfce4ddaff'::uuid, 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=800', 1, true
WHERE NOT EXISTS (SELECT 1 FROM property_images WHERE property_id = 'd871708a-942e-41d8-84a2-17cfce4ddaff'::uuid);

INSERT INTO property_images (property_id, image_url, display_order, is_primary)
SELECT 'd871708a-942e-41d8-84a2-17cfce4ddaff'::uuid, 'https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg?auto=compress&cs=tinysrgb&w=800', 2, false
WHERE NOT EXISTS (SELECT 1 FROM property_images WHERE property_id = 'd871708a-942e-41d8-84a2-17cfce4ddaff'::uuid AND image_url = 'https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg?auto=compress&cs=tinysrgb&w=800');

INSERT INTO property_images (property_id, image_url, display_order, is_primary)
SELECT 'd871708a-942e-41d8-84a2-17cfce4ddaff'::uuid, 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800', 3, false
WHERE NOT EXISTS (SELECT 1 FROM property_images WHERE property_id = 'd871708a-942e-41d8-84a2-17cfce4ddaff'::uuid AND image_url = 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800');

-- Add images for Modern 3BR Condo in KLCC
INSERT INTO property_images (property_id, image_url, display_order, is_primary)
SELECT '1d6148e9-bcfe-46ec-8780-217ac91c40df'::uuid, 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800', 1, true
WHERE NOT EXISTS (SELECT 1 FROM property_images WHERE property_id = '1d6148e9-bcfe-46ec-8780-217ac91c40df'::uuid);

INSERT INTO property_images (property_id, image_url, display_order, is_primary)
SELECT '1d6148e9-bcfe-46ec-8780-217ac91c40df'::uuid, 'https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg?auto=compress&cs=tinysrgb&w=800', 2, false
WHERE NOT EXISTS (SELECT 1 FROM property_images WHERE property_id = '1d6148e9-bcfe-46ec-8780-217ac91c40df'::uuid AND image_url = 'https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg?auto=compress&cs=tinysrgb&w=800');

INSERT INTO property_images (property_id, image_url, display_order, is_primary)
SELECT '1d6148e9-bcfe-46ec-8780-217ac91c40df'::uuid, 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800', 3, false
WHERE NOT EXISTS (SELECT 1 FROM property_images WHERE property_id = '1d6148e9-bcfe-46ec-8780-217ac91c40df'::uuid AND image_url = 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800');

-- Add images for Spacious 5BR Villa in Petaling Jaya
INSERT INTO property_images (property_id, image_url, display_order, is_primary)
SELECT 'f9c291ec-fe59-4a3f-902f-47d9b6b88188'::uuid, 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800', 1, true
WHERE NOT EXISTS (SELECT 1 FROM property_images WHERE property_id = 'f9c291ec-fe59-4a3f-902f-47d9b6b88188'::uuid);

INSERT INTO property_images (property_id, image_url, display_order, is_primary)
SELECT 'f9c291ec-fe59-4a3f-902f-47d9b6b88188'::uuid, 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=800', 2, false
WHERE NOT EXISTS (SELECT 1 FROM property_images WHERE property_id = 'f9c291ec-fe59-4a3f-902f-47d9b6b88188'::uuid AND image_url = 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=800');

INSERT INTO property_images (property_id, image_url, display_order, is_primary)
SELECT 'f9c291ec-fe59-4a3f-902f-47d9b6b88188'::uuid, 'https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg?auto=compress&cs=tinysrgb&w=800', 3, false
WHERE NOT EXISTS (SELECT 1 FROM property_images WHERE property_id = 'f9c291ec-fe59-4a3f-902f-47d9b6b88188'::uuid AND image_url = 'https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg?auto=compress&cs=tinysrgb&w=800');
