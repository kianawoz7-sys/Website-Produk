-- Migration: Add harga_maks to public.products table
-- Run this query in your Supabase SQL Editor

ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS harga_maks NUMERIC DEFAULT NULL;
