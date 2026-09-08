import { createClient } from './supabase/server';
import { Product, Testimonial, FAQ, ServiceItem, SiteSettings, PortfolioProject } from './types';
import {
  defaultProducts,
  defaultTestimonials,
  defaultFaqs,
  defaultServices,
  defaultSiteSettings,
  defaultPortfolios,
} from './mockData';

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .eq('id', 1)
      .maybeSingle();

    if (error || !data) {
      return defaultSiteSettings;
    }

    return {
      id: data.id,
      tagline: data.tagline || defaultSiteSettings.tagline,
      advantages: (data.advantages && Array.isArray(data.advantages) && data.advantages.length > 0)
        ? data.advantages
        : defaultSiteSettings.advantages,
      whatsapp_number: data.whatsapp_number || defaultSiteSettings.whatsapp_number,
      contact_email: data.contact_email || defaultSiteSettings.contact_email,
      contact_address: data.contact_address || defaultSiteSettings.contact_address,
      updated_at: data.updated_at,
    };
  } catch {
    return defaultSiteSettings;
  }
}

export async function getVisibleProducts(): Promise<Product[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_visible', true)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return defaultProducts;
    }

    return data as Product[];
  } catch {
    return defaultProducts;
  }
}

export async function getProductById(idOrSlug: string): Promise<Product | null> {
  try {
    const supabase = createClient();
    // Try matching by slug first, then by id if valid UUID
    let query = supabase.from('products').select('*').eq('is_visible', true);
    
    // Check if looks like UUID
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug);
    if (isUuid) {
      query = query.or(`id.eq.${idOrSlug},slug.eq.${idOrSlug}`);
    } else {
      query = query.eq('slug', idOrSlug);
    }

    const { data, error } = await query.maybeSingle();

    if (!error && data) {
      return data as Product;
    }

    // Check in default products
    const found = defaultProducts.find((p) => p.id === idOrSlug || p.slug === idOrSlug);
    return found || null;
  } catch {
    const found = defaultProducts.find((p) => p.id === idOrSlug || p.slug === idOrSlug);
    return found || null;
  }
}

export async function getVisibleTestimonials(): Promise<Testimonial[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .eq('is_visible', true)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return defaultTestimonials;
    }

    return data as Testimonial[];
  } catch {
    return defaultTestimonials;
  }
}

export async function getVisibleFaqs(): Promise<FAQ[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('faqs')
      .select('*')
      .eq('is_visible', true)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return defaultFaqs;
    }

    return data as FAQ[];
  } catch {
    return defaultFaqs;
  }
}

export async function getVisibleServices(): Promise<ServiceItem[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('is_visible', true)
      .order('sort_order', { ascending: true });

    if (error || !data || data.length === 0) {
      return defaultServices;
    }

    return data as ServiceItem[];
  } catch {
    return defaultServices;
  }
}

export async function getVisiblePortfolios(): Promise<PortfolioProject[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('portfolios')
      .select('*')
      .eq('is_visible', true)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return defaultPortfolios;
    }

    return data as PortfolioProject[];
  } catch {
    return defaultPortfolios;
  }
}

export async function getFeaturedPortfolio(): Promise<PortfolioProject> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('portfolios')
      .select('*')
      .eq('is_visible', true)
      .eq('is_featured', true)
      .order('sort_order', { ascending: true })
      .maybeSingle();

    if (!error && data) {
      return data as PortfolioProject;
    }

    const all = await getVisiblePortfolios();
    return all.find((p) => p.is_featured) || all[0] || defaultPortfolios[0];
  } catch {
    return defaultPortfolios[0];
  }
}
