/*
  # Property Marketing Website Database Schema

  1. New Tables
    - `profiles` - User profiles with extended information
    - `properties` - Property listings with full details
    - `property_images` - Property image management
    - `inquiries` - Contact form submissions and property inquiries
    - `favorites` - User saved properties
    - `property_views` - Track property view analytics
    - `agent_credits` - Credit system for agents
    - `credit_transactions` - Credit transaction history

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Separate policies for different user types (buyers, agents, sellers, admin)

  3. Features
    - Full property CRUD operations
    - User management with roles
    - Credit system for agents
    - Analytics and tracking
    - Inquiry management
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  phone text,
  user_type text NOT NULL CHECK (user_type IN ('buyer', 'seller', 'agent', 'admin')) DEFAULT 'buyer',
  status text NOT NULL CHECK (status IN ('pending', 'approved', 'rejected', 'suspended')) DEFAULT 'pending',
  company text,
  license_number text,
  credits integer DEFAULT 0,
  avatar_url text,
  bio text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  approved_by uuid REFERENCES auth.users(id),
  approved_at timestamptz
);

-- Properties table
CREATE TABLE IF NOT EXISTS properties (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  description text NOT NULL,
  property_type text NOT NULL CHECK (property_type IN ('house', 'apartment', 'condo', 'villa', 'studio', 'shophouse')),
  listing_type text NOT NULL CHECK (listing_type IN ('sale', 'rent')) DEFAULT 'sale',
  price decimal(12,2) NOT NULL,
  bedrooms integer NOT NULL DEFAULT 0,
  bathrooms integer NOT NULL DEFAULT 0,
  sqft integer NOT NULL,
  address text NOT NULL,
  city text NOT NULL,
  state text NOT NULL,
  country text DEFAULT 'Malaysia',
  latitude decimal(10, 8),
  longitude decimal(11, 8),
  amenities text[] DEFAULT '{}',
  furnished text CHECK (furnished IN ('fully_furnished', 'partially_furnished', 'unfurnished')),
  availability_date date,
  deposit_info text,
  agent_id uuid REFERENCES profiles(id) NOT NULL,
  status text NOT NULL CHECK (status IN ('draft', 'active', 'sold', 'rented', 'inactive')) DEFAULT 'draft',
  featured boolean DEFAULT false,
  views_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Property images table
CREATE TABLE IF NOT EXISTS property_images (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id uuid REFERENCES properties(id) ON DELETE CASCADE NOT NULL,
  image_url text NOT NULL,
  alt_text text,
  display_order integer DEFAULT 0,
  is_primary boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Inquiries table
CREATE TABLE IF NOT EXISTS inquiries (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id uuid REFERENCES properties(id) ON DELETE CASCADE NOT NULL,
  inquirer_id uuid REFERENCES profiles(id),
  inquirer_name text NOT NULL,
  inquirer_email text NOT NULL,
  inquirer_phone text,
  message text NOT NULL,
  inquiry_type text NOT NULL CHECK (inquiry_type IN ('viewing', 'general', 'price', 'financing')) DEFAULT 'general',
  status text NOT NULL CHECK (status IN ('new', 'contacted', 'scheduled', 'completed', 'closed')) DEFAULT 'new',
  agent_response text,
  responded_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Favorites table
CREATE TABLE IF NOT EXISTS favorites (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  property_id uuid REFERENCES properties(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, property_id)
);

-- Property views tracking
CREATE TABLE IF NOT EXISTS property_views (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id uuid REFERENCES properties(id) ON DELETE CASCADE NOT NULL,
  viewer_id uuid REFERENCES profiles(id),
  viewer_ip text,
  user_agent text,
  viewed_at timestamptz DEFAULT now()
);

-- Credit transactions table
CREATE TABLE IF NOT EXISTS credit_transactions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  transaction_type text NOT NULL CHECK (transaction_type IN ('addition', 'deduction')),
  amount integer NOT NULL,
  reason text NOT NULL,
  property_id uuid REFERENCES properties(id),
  admin_id uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_transactions ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all approved profiles" ON profiles
  FOR SELECT USING (status = 'approved');

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can manage all profiles" ON profiles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND user_type = 'admin' AND status = 'approved'
    )
  );

-- Properties policies
CREATE POLICY "Anyone can view active properties" ON properties
  FOR SELECT USING (status = 'active');

CREATE POLICY "Agents and sellers can create properties" ON properties
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND user_type IN ('agent', 'seller') 
      AND status = 'approved'
    )
  );

CREATE POLICY "Property owners can update their properties" ON properties
  FOR UPDATE USING (
    agent_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND user_type = 'admin' AND status = 'approved'
    )
  );

CREATE POLICY "Property owners can delete their properties" ON properties
  FOR DELETE USING (
    agent_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND user_type = 'admin' AND status = 'approved'
    )
  );

-- Property images policies
CREATE POLICY "Anyone can view property images" ON property_images
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM properties 
      WHERE id = property_id AND status = 'active'
    )
  );

CREATE POLICY "Property owners can manage images" ON property_images
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM properties 
      WHERE id = property_id AND agent_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND user_type = 'admin' AND status = 'approved'
    )
  );

-- Inquiries policies
CREATE POLICY "Users can create inquiries" ON inquiries
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view own inquiries" ON inquiries
  FOR SELECT USING (
    inquirer_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM properties 
      WHERE id = property_id AND agent_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND user_type = 'admin' AND status = 'approved'
    )
  );

CREATE POLICY "Agents can update inquiries for their properties" ON inquiries
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM properties 
      WHERE id = property_id AND agent_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND user_type = 'admin' AND status = 'approved'
    )
  );

-- Favorites policies
CREATE POLICY "Users can manage own favorites" ON favorites
  FOR ALL USING (user_id = auth.uid());

-- Property views policies
CREATE POLICY "Anyone can create property views" ON property_views
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Property owners and admins can view analytics" ON property_views
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM properties 
      WHERE id = property_id AND agent_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND user_type = 'admin' AND status = 'approved'
    )
  );

-- Credit transactions policies
CREATE POLICY "Users can view own credit transactions" ON credit_transactions
  FOR SELECT USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND user_type = 'admin' AND status = 'approved'
    )
  );

CREATE POLICY "Admins can manage credit transactions" ON credit_transactions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND user_type = 'admin' AND status = 'approved'
    )
  );

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_properties_listing_type ON properties(listing_type);
CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);
CREATE INDEX IF NOT EXISTS idx_properties_city ON properties(city);
CREATE INDEX IF NOT EXISTS idx_properties_price ON properties(price);
CREATE INDEX IF NOT EXISTS idx_properties_bedrooms ON properties(bedrooms);
CREATE INDEX IF NOT EXISTS idx_properties_agent_id ON properties(agent_id);
CREATE INDEX IF NOT EXISTS idx_property_images_property_id ON property_images(property_id);
CREATE INDEX IF NOT EXISTS idx_inquiries_property_id ON inquiries(property_id);
CREATE INDEX IF NOT EXISTS idx_inquiries_status ON inquiries(status);
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_property_views_property_id ON property_views(property_id);

-- Functions for automatic profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, user_type, status)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', 'User'),
    COALESCE(new.raw_user_meta_data->>'user_type', 'buyer'),
    CASE 
      WHEN COALESCE(new.raw_user_meta_data->>'user_type', 'buyer') = 'buyer' THEN 'approved'
      ELSE 'pending'
    END
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for automatic profile creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Function to update property view count
CREATE OR REPLACE FUNCTION increment_property_views()
RETURNS trigger AS $$
BEGIN
  UPDATE properties 
  SET views_count = views_count + 1 
  WHERE id = NEW.property_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for property view counting
DROP TRIGGER IF EXISTS on_property_view ON property_views;
CREATE TRIGGER on_property_view
  AFTER INSERT ON property_views
  FOR EACH ROW EXECUTE PROCEDURE increment_property_views();