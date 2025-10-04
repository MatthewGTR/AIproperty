import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

export interface PropertyWithImages {
  id: string;
  title: string;
  description: string;
  price: number;
  property_type: string;
  listing_type: 'sale' | 'rent';
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  address: string;
  city: string;
  state: string;
  postal_code: string;
  latitude: number | null;
  longitude: number | null;
  amenities: string[];
  images: string[];
  featured: boolean;
  created_at: string;
}

export const propertyService = {
  async getAll(): Promise<PropertyWithImages[]> {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async searchProperties(filters: {
    listing_type?: 'sale' | 'rent';
    min_price?: number;
    max_price?: number;
    bedrooms?: number;
    property_type?: string;
    state?: string;
    city?: string;
  }): Promise<PropertyWithImages[]> {
    let query = supabase.from('properties').select('*');

    if (filters.listing_type) {
      query = query.eq('listing_type', filters.listing_type);
    }
    if (filters.min_price) {
      query = query.gte('price', filters.min_price);
    }
    if (filters.max_price) {
      query = query.lte('price', filters.max_price);
    }
    if (filters.bedrooms) {
      query = query.gte('bedrooms', filters.bedrooms);
    }
    if (filters.property_type) {
      query = query.eq('property_type', filters.property_type);
    }
    if (filters.state) {
      query = query.ilike('state', `%${filters.state}%`);
    }
    if (filters.city) {
      query = query.ilike('city', `%${filters.city}%`);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }
};
