-- Run this in your Supabase SQL Editor

-- 1. Create CRM Leads Table
CREATE TABLE crm_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  subject text NOT NULL,
  message text NOT NULL,
  status text DEFAULT 'New', -- Can be 'New', 'Responded', etc.
  created_at timestamp with time zone DEFAULT now()
);

-- 2. Create Analytics Table
CREATE TABLE analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_url text NOT NULL,
  user_agent text,
  created_at timestamp with time zone DEFAULT now()
);

-- 3. Set up Row Level Security (RLS)
ALTER TABLE crm_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;

-- CRM Policies
-- Public can INSERT (submit contact form)
CREATE POLICY "Public can insert leads" ON crm_leads FOR INSERT WITH CHECK (true);
-- Only Admins can SELECT, UPDATE, DELETE leads
CREATE POLICY "Admins can view leads" ON crm_leads FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can update leads" ON crm_leads FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Admins can delete leads" ON crm_leads FOR DELETE TO authenticated USING (true);

-- Analytics Policies
-- Public can INSERT (record a page view)
CREATE POLICY "Public can insert analytics" ON analytics FOR INSERT WITH CHECK (true);
-- Only Admins can SELECT analytics
CREATE POLICY "Admins can view analytics" ON analytics FOR SELECT TO authenticated USING (true);
-- Analytics typically aren't updated or deleted, but just in case:
CREATE POLICY "Admins can delete analytics" ON analytics FOR DELETE TO authenticated USING (true);
