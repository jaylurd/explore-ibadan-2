-- Run this in your Supabase SQL Editor

-- 1. Create Hotels & Restaurants Table
CREATE TABLE hotels_restaurants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL,              -- 'Hotel' or 'Restaurant'
  location text NOT NULL,
  phone text NOT NULL,
  description text,
  price_range text,                -- e.g., '₦', '₦₦', '₦₦₦', '₦₦₦₦'
  rating numeric(2,1) DEFAULT 4.0, -- e.g., 4.5
  image_url text,
  instagram text,
  website text,
  created_at timestamp with time zone DEFAULT now()
);

-- 2. Set up Row Level Security (RLS)
ALTER TABLE hotels_restaurants ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Public can view hotels_restaurants" ON hotels_restaurants FOR SELECT USING (true);

-- Allow authenticated users to insert/update/delete (Admin only)
CREATE POLICY "Admins can insert hotels_restaurants" ON hotels_restaurants FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admins can update hotels_restaurants" ON hotels_restaurants FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Admins can delete hotels_restaurants" ON hotels_restaurants FOR DELETE TO authenticated USING (true);
