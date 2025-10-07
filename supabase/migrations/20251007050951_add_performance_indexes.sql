/*
  # Add Performance Indexes
  
  This migration adds database indexes to improve query performance for property searches.
  
  ## Indexes Added
  1. **listing_type + status**: Fast filtering for active sale/rent properties
  2. **city**: Fast location-based searches
  3. **bedrooms**: Fast bedroom count filtering
  4. **price**: Fast price range queries
  5. **property_type**: Fast property type filtering
  6. **created_at**: Fast sorting by newest properties
  
  ## Performance Impact
  - Reduces query time from O(n) to O(log n) for indexed fields
  - Dramatically improves search performance with multiple filters
  - Minimal storage overhead
  
  ## Security
  - Indexes do not affect RLS policies
*/

-- Create index for listing type and status (most common filter combination)
CREATE INDEX IF NOT EXISTS idx_properties_listing_status 
ON properties(listing_type, status);

-- Create index for city searches (case-insensitive)
CREATE INDEX IF NOT EXISTS idx_properties_city_lower 
ON properties(LOWER(city));

-- Create index for state searches (case-insensitive)
CREATE INDEX IF NOT EXISTS idx_properties_state_lower 
ON properties(LOWER(state));

-- Create index for bedrooms
CREATE INDEX IF NOT EXISTS idx_properties_bedrooms 
ON properties(bedrooms);

-- Create index for price (for range queries)
CREATE INDEX IF NOT EXISTS idx_properties_price 
ON properties(price);

-- Create index for property type
CREATE INDEX IF NOT EXISTS idx_properties_type 
ON properties(property_type);

-- Create index for created_at (for sorting)
CREATE INDEX IF NOT EXISTS idx_properties_created_at 
ON properties(created_at DESC);

-- Composite index for common search patterns
CREATE INDEX IF NOT EXISTS idx_properties_search 
ON properties(listing_type, status, city, bedrooms) 
WHERE status = 'active';

-- Analyze tables to update query planner statistics
ANALYZE properties;
ANALYZE property_images;
