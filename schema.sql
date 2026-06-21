-- Run this in the Supabase SQL Editor

-- 1. Create Tables

-- Events Table
CREATE TABLE events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  date timestamp with time zone NOT NULL,
  location text NOT NULL,
  description text,
  image_url text,
  rsvp_link text,
  created_at timestamp with time zone DEFAULT now()
);

-- Jobs Table
CREATE TABLE jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  company text NOT NULL,
  type text NOT NULL, -- e.g., Full-time, Contract, Remote
  location text NOT NULL,
  salary text,
  link text,
  description text,
  requirements text,
  logo_url text,
  created_at timestamp with time zone DEFAULT now()
);

-- Vendors Table
CREATE TABLE vendors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL,
  location text NOT NULL,
  phone text NOT NULL,
  image_url text,
  instagram text,
  tiktok text,
  linkedin text,
  created_at timestamp with time zone DEFAULT now()
);

-- Services Table
CREATE TABLE services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL,
  description text,
  phone text NOT NULL,
  image_url text,
  created_at timestamp with time zone DEFAULT now()
);

-- 2. Create Storage Bucket for Images
insert into storage.buckets (id, name, public) values ('images', 'images', true);

-- 3. Set up Row Level Security (RLS)

-- Enable RLS
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- Allow public read access to all tables
CREATE POLICY "Public profiles are viewable by everyone." ON events FOR SELECT USING (true);
CREATE POLICY "Public profiles are viewable by everyone." ON jobs FOR SELECT USING (true);
CREATE POLICY "Public profiles are viewable by everyone." ON vendors FOR SELECT USING (true);
CREATE POLICY "Public profiles are viewable by everyone." ON services FOR SELECT USING (true);

-- Allow authenticated users to insert/update/delete (Admin only)
CREATE POLICY "Admins can insert events" ON events FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admins can update events" ON events FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Admins can delete events" ON events FOR DELETE TO authenticated USING (true);

CREATE POLICY "Admins can insert jobs" ON jobs FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admins can update jobs" ON jobs FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Admins can delete jobs" ON jobs FOR DELETE TO authenticated USING (true);

CREATE POLICY "Admins can insert vendors" ON vendors FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admins can update vendors" ON vendors FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Admins can delete vendors" ON vendors FOR DELETE TO authenticated USING (true);

CREATE POLICY "Admins can insert services" ON services FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admins can update services" ON services FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Admins can delete services" ON services FOR DELETE TO authenticated USING (true);

-- 4. Storage Bucket Policies (Allow public read, allow authenticated users to upload/delete)
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'images');
CREATE POLICY "Admin Upload" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'images');
CREATE POLICY "Admin Update" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'images');
CREATE POLICY "Admin Delete" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'images');
