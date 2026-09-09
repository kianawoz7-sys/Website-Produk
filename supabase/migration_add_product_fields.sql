-- =========================================================
-- Migration: Tambah Field Baru pada Tabel Products (Paket Layanan)
-- Field:
-- 1. is_starting_price: boolean default false (tampilkan prefix "Mulai " sebelum nominal)
-- 2. button_text: text default 'Pilih Paket' (teks tombol CTA produk)
-- 3. button_link: text (opsional / custom URL, buka tab baru jika eksternal)
-- =========================================================

alter table if exists public.products
  add column if not exists is_starting_price boolean not null default false;

alter table if exists public.products
  add column if not exists button_text text default 'Pilih Paket';

alter table if exists public.products
  add column if not exists button_link text;

-- Optional: Isi data yang sudah ada agar konsisten
update public.products
set button_text = 'Pilih Paket'
where button_text is null;

update public.products
set is_starting_price = false
where is_starting_price is null;
