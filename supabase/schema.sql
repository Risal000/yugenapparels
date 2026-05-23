-- ============================================
-- Yūgen Apparels — Supabase Schema
-- Run this in Supabase SQL Editor
-- ============================================

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  price NUMERIC NOT NULL,
  original_price NUMERIC,
  category TEXT NOT NULL,
  subcategory TEXT,
  description TEXT,
  image_url TEXT,
  hover_image_url TEXT,
  sizes TEXT[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  in_stock BOOLEAN DEFAULT TRUE,
  color_variants JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT,
  customer_phone TEXT,
  customer_email TEXT,
  items JSONB DEFAULT '[]',
  total NUMERIC DEFAULT 0,
  status TEXT DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Products: anyone can read, only authenticated can write
CREATE POLICY "Public can read products" ON products
  FOR SELECT USING (TRUE);

CREATE POLICY "Anyone can insert products" ON products
  FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "Anyone can update products" ON products
  FOR UPDATE USING (TRUE);

CREATE POLICY "Anyone can delete products" ON products
  FOR DELETE USING (TRUE);

-- Orders: anyone can create, anyone can read/update (admin uses password gate)
CREATE POLICY "Anyone can read orders" ON orders
  FOR SELECT USING (TRUE);

CREATE POLICY "Anyone can create orders" ON orders
  FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "Anyone can update orders" ON orders
  FOR UPDATE USING (TRUE);

-- Storage bucket for product images
-- Run this too:
-- INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', TRUE);

-- Storage policy: allow public reads and uploads
-- CREATE POLICY "Public read product images" ON storage.objects
--   FOR SELECT USING (bucket_id = 'product-images');
-- CREATE POLICY "Anyone can upload product images" ON storage.objects
--   FOR INSERT WITH CHECK (bucket_id = 'product-images');
