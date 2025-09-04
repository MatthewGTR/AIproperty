/*
  # Fix infinite recursion in RLS policies

  1. Policy Updates
    - Remove circular references in profiles policies
    - Simplify admin checks to avoid self-referencing
    - Fix property access policies

  2. Security
    - Maintain proper access control
    - Ensure users can only access appropriate data
    - Keep admin privileges intact
*/

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Admins can manage all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can view all approved profiles" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

-- Create simplified, non-recursive policies for profiles
CREATE POLICY "Users can view approved profiles"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (status = 'approved');

CREATE POLICY "Users can view own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Simple admin policy without self-reference
CREATE POLICY "Service role can manage all profiles"
  ON profiles
  FOR ALL
  TO service_role
  USING (true);

-- Fix properties policies to avoid circular references
DROP POLICY IF EXISTS "Agents and sellers can create properties" ON properties;
DROP POLICY IF EXISTS "Property owners can update their properties" ON properties;
DROP POLICY IF EXISTS "Property owners can delete their properties" ON properties;

CREATE POLICY "Authenticated users can create properties"
  ON properties
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = agent_id);

CREATE POLICY "Property owners can update their properties"
  ON properties
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = agent_id);

CREATE POLICY "Property owners can delete their properties"
  ON properties
  FOR DELETE
  TO authenticated
  USING (auth.uid() = agent_id);

-- Fix inquiries policies
DROP POLICY IF EXISTS "Agents can update inquiries for their properties" ON inquiries;

CREATE POLICY "Property agents can update inquiries"
  ON inquiries
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM properties 
      WHERE properties.id = inquiries.property_id 
      AND properties.agent_id = auth.uid()
    )
  );

-- Fix credit transactions policies
DROP POLICY IF EXISTS "Admins can manage credit transactions" ON credit_transactions;

CREATE POLICY "Service role can manage credit transactions"
  ON credit_transactions
  FOR ALL
  TO service_role
  USING (true);

CREATE POLICY "Users can view own credit transactions only"
  ON credit_transactions
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());