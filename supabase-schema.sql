-- Run this in your Supabase SQL Editor

-- Products
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  name text not null,
  price numeric not null,
  original_price numeric,
  category text not null,
  subcategory text,
  description text,
  image_url text,
  hover_image_url text,
  sizes text[],
  tags text[],
  in_stock boolean default true,
  color_variants jsonb
);

-- Orders
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  customer_name text,
  customer_phone text,
  customer_email text,
  items jsonb,
  total numeric,
  status text default 'pending',
  notes text,
  whatsapp_sent boolean default false
);

-- Row Level Security
alter table products enable row level security;
alter table orders enable row level security;

-- Products: public read, authenticated write
create policy "Public can read products" on products for select using (true);
create policy "Authenticated can manage products" on products for all using (auth.role() = 'authenticated');

-- Orders: public insert (for placing orders), authenticated read all
create policy "Anyone can create orders" on orders for insert with check (true);
create policy "Authenticated can read all orders" on orders for select using (auth.role() = 'authenticated');
create policy "Authenticated can update orders" on orders for update using (auth.role() = 'authenticated');

-- Storage bucket for product images
-- Run this separately in the Storage section, or via SQL:
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict do nothing;

create policy "Public can read product images"
on storage.objects for select
using (bucket_id = 'product-images');

create policy "Authenticated can upload product images"
on storage.objects for insert
with check (bucket_id = 'product-images');

create policy "Authenticated can delete product images"
on storage.objects for delete
using (bucket_id = 'product-images');
