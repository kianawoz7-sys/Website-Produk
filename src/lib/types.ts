export interface Product {
  id: string;
  name: string;
  slug?: string | null;
  short_description?: string | null;
  full_description?: string | null;
  price?: number | null;
  harga_maks?: number | null;
  show_price: boolean;
  is_starting_price?: boolean;
  button_text?: string | null;
  button_link?: string | null;
  features?: string[] | null;
  image_url?: string | null;
  images?: string[] | null;
  is_visible: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface Testimonial {
  id: string;
  customer_name: string;
  company?: string | null;
  source?: string | null;
  content?: string | null;
  rating?: number | null;
  image_url?: string | null;
  is_visible: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  is_visible: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface ServiceItem {
  id: string;
  name: string;
  related_product_id?: string | null;
  is_visible: boolean;
  sort_order: number;
  created_at?: string;
}

export interface SiteSettings {
  id: number;
  tagline?: string | null;
  advantages?: string[] | null;
  whatsapp_number: string;
  contact_email?: string | null;
  contact_address?: string | null;
  updated_at?: string;
}

export interface Profile {
  id: string;
  role: 'admin';
  full_name?: string | null;
  created_at?: string;
}

export interface PortfolioProject {
  id: string;
  title: string;
  slug?: string | null;
  category: string;
  description?: string | null;
  features?: string[] | null;
  image_url?: string | null;
  images?: string[] | null;
  has_live_url: boolean;
  live_url?: string | null;
  is_featured: boolean;
  is_visible: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}
