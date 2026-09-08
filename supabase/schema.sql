-- =========================================================
-- KyDev Jasa Website — Supabase Schema & Storage Policies
-- =========================================================

create extension if not exists "pgcrypto";

-- Utility function: auto-update updated_at
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- ---------------------------------------------------------
-- PROFILES (role admin)
-- ---------------------------------------------------------
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'admin' check (role in ('admin')),
  full_name text,
  created_at timestamptz not null default now()
);

create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, role, full_name)
  values (new.id, 'admin', new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- ---------------------------------------------------------
-- PRODUCTS
-- ---------------------------------------------------------
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text,
  short_description text,
  full_description text,
  price numeric,
  show_price boolean not null default false,
  features jsonb not null default '[]'::jsonb,
  image_url text,
  is_visible boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists idx_products_slug on products (slug);

drop trigger if exists trg_products_updated_at on products;
create trigger trg_products_updated_at
  before update on products
  for each row execute procedure set_updated_at();

-- ---------------------------------------------------------
-- TESTIMONIALS
-- ---------------------------------------------------------
create table if not exists testimonials (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  company text,
  source text,
  content text,
  rating smallint check (rating between 1 and 5),
  image_url text,
  is_visible boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_testimonials_updated_at on testimonials;
create trigger trg_testimonials_updated_at
  before update on testimonials
  for each row execute procedure set_updated_at();

-- ---------------------------------------------------------
-- FAQS
-- ---------------------------------------------------------
create table if not exists faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  is_visible boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_faqs_updated_at on faqs;
create trigger trg_faqs_updated_at
  before update on faqs
  for each row execute procedure set_updated_at();

-- ---------------------------------------------------------
-- SERVICES (Footer)
-- ---------------------------------------------------------
create table if not exists services (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  related_product_id uuid references products(id) on delete set null,
  is_visible boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------
-- SITE_SETTINGS
-- ---------------------------------------------------------
create table if not exists site_settings (
  id integer primary key default 1,
  tagline text,
  advantages jsonb not null default '[]'::jsonb,
  whatsapp_number text not null default '',
  contact_email text,
  contact_address text,
  updated_at timestamptz not null default now(),
  constraint site_settings_singleton check (id = 1)
);

insert into site_settings (id, tagline, whatsapp_number, advantages, contact_email, contact_address)
values (
  1, 
  'Jasa Pembuatan Website Profesional & Elegan untuk Bisnis Anda', 
  '6281234567890',
  '["Desain Mewah & Minimalis ala Apple", "Performa Cepat & Mobile Friendly", "Integrasi WhatsApp Langsung ke HP Anda", "Full Kontrol Konten lewat Admin Dashboard"]'::jsonb,
  'contact@kydev.id',
  'Jakarta, Indonesia'
)
on conflict (id) do nothing;

drop trigger if exists trg_site_settings_updated_at on site_settings;
create trigger trg_site_settings_updated_at
  before update on site_settings
  for each row execute procedure set_updated_at();

-- ---------------------------------------------------------
-- RLS (ROW LEVEL SECURITY)
-- ---------------------------------------------------------
alter table profiles enable row level security;
alter table products enable row level security;
alter table testimonials enable row level security;
alter table faqs enable row level security;
alter table services enable row level security;
alter table site_settings enable row level security;

-- PROFILES
create policy "profiles: user can read own profile"
  on profiles for select
  using (auth.uid() = id);

-- PRODUCTS
create policy "products: public can read visible"
  on products for select
  using (is_visible = true);

create policy "products: admin can read all"
  on products for select
  using (auth.role() = 'authenticated');

create policy "products: admin can insert"
  on products for insert
  with check (auth.role() = 'authenticated');

create policy "products: admin can update"
  on products for update
  using (auth.role() = 'authenticated');

create policy "products: admin can delete"
  on products for delete
  using (auth.role() = 'authenticated');

-- TESTIMONIALS
create policy "testimonials: public can read visible"
  on testimonials for select
  using (is_visible = true);

create policy "testimonials: admin can read all"
  on testimonials for select
  using (auth.role() = 'authenticated');

create policy "testimonials: admin can insert"
  on testimonials for insert
  with check (auth.role() = 'authenticated');

create policy "testimonials: admin can update"
  on testimonials for update
  using (auth.role() = 'authenticated');

create policy "testimonials: admin can delete"
  on testimonials for delete
  using (auth.role() = 'authenticated');

-- FAQS
create policy "faqs: public can read visible"
  on faqs for select
  using (is_visible = true);

create policy "faqs: admin can read all"
  on faqs for select
  using (auth.role() = 'authenticated');

create policy "faqs: admin can insert"
  on faqs for insert
  with check (auth.role() = 'authenticated');

create policy "faqs: admin can update"
  on faqs for update
  using (auth.role() = 'authenticated');

create policy "faqs: admin can delete"
  on faqs for delete
  using (auth.role() = 'authenticated');

-- SERVICES
create policy "services: public can read visible"
  on services for select
  using (is_visible = true);

create policy "services: admin can read all"
  on services for select
  using (auth.role() = 'authenticated');

create policy "services: admin can insert"
  on services for insert
  with check (auth.role() = 'authenticated');

create policy "services: admin can update"
  on services for update
  using (auth.role() = 'authenticated');

create policy "services: admin can delete"
  on services for delete
  using (auth.role() = 'authenticated');

-- SITE_SETTINGS
create policy "site_settings: public can read"
  on site_settings for select
  using (true);

create policy "site_settings: admin can insert"
  on site_settings for insert
  with check (auth.role() = 'authenticated');

create policy "site_settings: admin can update"
  on site_settings for update
  using (auth.role() = 'authenticated');

-- ---------------------------------------------------------
-- PORTFOLIOS (Produk Jadi & Portofolio Karya Buatan KyDev)
-- ---------------------------------------------------------
create table if not exists portfolios (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique,
  category text not null default 'Aplikasi',
  description text,
  features jsonb not null default '[]'::jsonb,
  image_url text,
  has_live_url boolean not null default false,
  live_url text,
  is_featured boolean not null default false,
  is_visible boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_portfolios_updated_at on portfolios;
create trigger trg_portfolios_updated_at
  before update on portfolios
  for each row execute procedure set_updated_at();

alter table portfolios enable row level security;

create policy "portfolios: public can read visible"
  on portfolios for select
  using (is_visible = true);

create policy "portfolios: admin can read all"
  on portfolios for select
  using (auth.role() = 'authenticated');

create policy "portfolios: admin can insert"
  on portfolios for insert
  with check (auth.role() = 'authenticated');

create policy "portfolios: admin can update"
  on portfolios for update
  using (auth.role() = 'authenticated');

create policy "portfolios: admin can delete"
  on portfolios for delete
  using (auth.role() = 'authenticated');

-- ---------------------------------------------------------
-- INDEXES
-- ---------------------------------------------------------
create index if not exists idx_products_visible_sort on products (is_visible, sort_order);
create index if not exists idx_testimonials_visible_sort on testimonials (is_visible, sort_order);
create index if not exists idx_faqs_visible_sort on faqs (is_visible, sort_order);
create index if not exists idx_services_visible_sort on services (is_visible, sort_order);
create index if not exists idx_portfolios_visible_sort on portfolios (is_visible, sort_order);

-- ---------------------------------------------------------
-- STORAGE: public-images bucket policies
-- ---------------------------------------------------------
create policy "public-images: public can read"
  on storage.objects for select
  using ( bucket_id = 'public-images' );

create policy "public-images: admin can upload"
  on storage.objects for insert
  with check (
    bucket_id = 'public-images'
    and auth.role() = 'authenticated'
  );

create policy "public-images: admin can update"
  on storage.objects for update
  using (
    bucket_id = 'public-images'
    and auth.role() = 'authenticated'
  );

create policy "public-images: admin can delete"
  on storage.objects for delete
  using (
    bucket_id = 'public-images'
    and auth.role() = 'authenticated'
  );
