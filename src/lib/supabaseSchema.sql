-- RANDHAWA REAL ESTATE (BASIC PACKAGE)
-- Supabase PostgreSQL Schema with Row Level Security (RLS)

-- 1. BUSINESS SETTINGS TABLE
create table if not exists public.business_settings (
  id text primary key default 'business_settings_default',
  business_name text not null default 'Randhawa Real Estate',
  phone text not null default '+91 90000 00000',
  whatsapp text not null default '+91 90000 00000',
  email text not null default 'hello@randhawarealestate.demo',
  location text not null default 'Gurgaon, Haryana',
  tagline text not null default 'Find a Place That Feels Like Home.',
  logo_url text,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. PROPERTIES TABLE
create table if not exists public.properties (
  id text primary key default gen_random_uuid()::text,
  name text not null,
  slug text not null unique,
  location text not null,
  price numeric not null,
  price_display text not null,
  purpose text not null check (purpose in ('Buy', 'Rent')),
  category text not null check (category in ('Residential', 'Commercial')),
  property_type text not null,
  bhk text,
  area_sqft numeric not null,
  description text not null,
  features jsonb not null default '[]'::jsonb,
  availability_status text not null default 'Available' check (availability_status in ('Available', 'Sold', 'Rented', 'Under Offer')),
  published boolean not null default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. PROPERTY IMAGES TABLE
create table if not exists public.property_images (
  id text primary key default gen_random_uuid()::text,
  property_id text not null references public.properties(id) on delete cascade,
  storage_path text,
  image_url text not null,
  is_featured boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. ENQUIRIES TABLE
create table if not exists public.enquiries (
  id text primary key default gen_random_uuid()::text,
  name text not null,
  phone text not null,
  email text not null,
  message text not null,
  property_id text references public.properties(id) on delete set null,
  property_name text,
  status text not null default 'New' check (status in ('New', 'Contacted', 'Closed')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. ROW LEVEL SECURITY (RLS) POLICIES

-- Enable RLS
alter table public.business_settings enable row level security;
alter table public.properties enable row level security;
alter table public.property_images enable row level security;
alter table public.enquiries enable row level security;

-- Business Settings Policies:
-- Public can read business settings
create policy "Allow public read access to business settings"
  on public.business_settings for select
  using (true);

-- Authenticated admin can update business settings
create policy "Allow admin to update business settings"
  on public.business_settings for all
  to authenticated
  using (true)
  with check (true);

-- Properties Policies:
-- Public can read ONLY published properties
create policy "Allow public read access to published properties"
  on public.properties for select
  using (published = true);

-- Authenticated admin has full access to all properties
create policy "Allow admin full access to properties"
  on public.properties for all
  to authenticated
  using (true)
  with check (true);

-- Property Images Policies:
-- Public can read images for published properties
create policy "Allow public read access to images of published properties"
  on public.property_images for select
  using (
    exists (
      select 1 from public.properties
      where public.properties.id = public.property_images.property_id
      and public.properties.published = true
    )
  );

-- Authenticated admin has full access to property images
create policy "Allow admin full access to property images"
  on public.property_images for all
  to authenticated
  using (true)
  with check (true);

-- Enquiries Policies:
-- Public can insert new enquiries
create policy "Allow public to submit enquiries"
  on public.enquiries for insert
  with check (true);

-- Authenticated admin can read and manage enquiries
create policy "Allow admin full access to enquiries"
  on public.enquiries for all
  to authenticated
  using (true)
  with check (true);

-- Insert Default Business Settings row if not exists
insert into public.business_settings (id, business_name, phone, whatsapp, email, location, tagline)
values (
  'business_settings_default',
  'Randhawa Real Estate',
  '+91 90000 00000',
  '+91 90000 00000',
  'hello@randhawarealestate.demo',
  'Gurgaon, Haryana',
  'Find a Place That Feels Like Home.'
) on conflict (id) do nothing;
