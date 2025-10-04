import { supabase } from '../lib/supabase';
import { Database } from '../lib/database.types';
import { getAllDummyProperties } from './dummyProperties';

type Property = Database['public']['Tables']['properties']['Row'];
type PropertyInsert = Database['public']['Tables']['properties']['Insert'];
type PropertyUpdate = Database['public']['Tables']['properties']['Update'];
type PropertyImage = Database['public']['Tables']['property_images']['Row'];
type Inquiry = Database['public']['Tables']['inquiries']['Row'];
type InquiryInsert = Database['public']['Tables']['inquiries']['Insert'];

export interface PropertyWithImages extends Property {
  property_images: PropertyImage[];
  profiles: {
    full_name: string;
    phone: string | null;
    email: string;
    avatar_url: string | null;
    company: string | null;
  };
}

export const propertyService = {
  // Get all active properties with images and agent info
  async getProperties(filters?: {
    listing_type?: 'sale' | 'rent';
    city?: string;
    property_type?: string;
    min_price?: number;
    max_price?: number;
    bedrooms?: number;
    limit?: number;
  }): Promise<PropertyWithImages[]> {
    // First try to get properties from database
    let query = supabase
      .from('properties')
      .select(`
        *,
        property_images(*),
        profiles!properties_agent_id_fkey(full_name, phone, email, avatar_url, company)
      `)
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (filters?.listing_type) {
      query = query.eq('listing_type', filters.listing_type);
    }
    if (filters?.city) {
      query = query.ilike('city', `%${filters.city}%`);
    }
    if (filters?.property_type) {
      query = query.eq('property_type', filters.property_type);
    }
    if (filters?.min_price) {
      query = query.gte('price', filters.min_price);
    }
    if (filters?.max_price) {
      query = query.lte('price', filters.max_price);
    }
    if (filters?.bedrooms) {
      query = query.eq('bedrooms', filters.bedrooms);
    }
    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching properties:', error);
      throw error;
    }

    // If no properties found in database, return dummy properties
    if (!data || data.length === 0) {
      return this.getFilteredDummyProperties(filters);
    }

    return data || [];
  },

  // Get filtered dummy properties
  getFilteredDummyProperties(filters?: {
    listing_type?: 'sale' | 'rent';
    city?: string;
    property_type?: string;
    min_price?: number;
    max_price?: number;
    bedrooms?: number;
    limit?: number;
  }): PropertyWithImages[] {
    let properties = getAllDummyProperties();
    // Apply filters
    if (filters?.listing_type) {
      properties = properties.filter(p => p.listing_type === filters.listing_type);
    }
    if (filters?.city) {
      properties = properties.filter(p =>
        p.city.toLowerCase().includes(filters.city!.toLowerCase())
      );
    }
    if (filters?.property_type) {
      properties = properties.filter(p => p.property_type === filters.property_type);
    }
    if (filters?.min_price) {
      properties = properties.filter(p => p.price >= filters.min_price!);
    }
    if (filters?.max_price) {
      properties = properties.filter(p => p.price <= filters.max_price!);
    }
    if (filters?.bedrooms) {
      properties = properties.filter(p => p.bedrooms === filters.bedrooms);
    }
    if (filters?.limit) {
      properties = properties.slice(0, filters.limit);
    }

    return properties;
  },

  // Legacy method - kept for compatibility
  getSampleProperties(filters?: {
    listing_type?: 'sale' | 'rent';
    city?: string;
    property_type?: string;
    min_price?: number;
    max_price?: number;
    bedrooms?: number;
    limit?: number;
  }): PropertyWithImages[] {
    return this.getFilteredDummyProperties(filters);
  },


  // Get single property with full details
  async getProperty(id: string): Promise<PropertyWithImages | null> {
    const { data, error } = await supabase
      .from('properties')
      .select(`
        *,
        property_images(*),
        profiles!properties_agent_id_fkey(full_name, phone, email, avatar_url, company)
      `)
      .eq('id', id)
      .eq('status', 'active')
      .single();

    if (error) {
      console.error('Error fetching property:', error);
      return null;
    }

    return data;
  },

  // Create new property listing
  async createProperty(propertyData: PropertyInsert, images: string[]): Promise<{ success: boolean; property?: Property; error?: string }> {
    try {
      // Check if user has enough credits (for agents)
      const { data: profile } = await supabase
        .from('profiles')
        .select('user_type, credits')
        .eq('id', propertyData.agent_id)
        .single();

      if (profile?.user_type === 'agent' && profile.credits < 5) {
        return { success: false, error: 'Insufficient credits. You need 5 credits to list a property.' };
      }

      // Create property
      const { data: property, error: propertyError } = await supabase
        .from('properties')
        .insert(propertyData)
        .select()
        .single();

      if (propertyError) {
        throw propertyError;
      }

      // Add images
      if (images.length > 0) {
        const imageInserts = images.map((url, index) => ({
          property_id: property.id,
          image_url: url,
          display_order: index,
          is_primary: index === 0
        }));

        const { error: imagesError } = await supabase
          .from('property_images')
          .insert(imageInserts);

        if (imagesError) {
          console.error('Error adding images:', imagesError);
        }
      }

      // Deduct credits for agents
      if (profile?.user_type === 'agent') {
        await supabase
          .from('credit_transactions')
          .insert({
            user_id: propertyData.agent_id,
            transaction_type: 'deduction',
            amount: 5,
            reason: `Property listing: ${propertyData.title}`,
            property_id: property.id
          });

        await supabase
          .from('profiles')
          .update({ credits: profile.credits - 5 })
          .eq('id', propertyData.agent_id);
      }

      return { success: true, property };
    } catch (error: any) {
      console.error('Error creating property:', error);
      return { success: false, error: error.message };
    }
  },

  // Update property
  async updateProperty(id: string, updates: PropertyUpdate): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('properties')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  // Delete property
  async deleteProperty(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  // Track property view
  async trackPropertyView(propertyId: string, viewerId?: string): Promise<void> {
    try {
      await supabase
        .from('property_views')
        .insert({
          property_id: propertyId,
          viewer_id: viewerId,
          viewer_ip: null, // Could be populated from request headers
          user_agent: navigator.userAgent
        });
    } catch (error) {
      console.error('Error tracking view:', error);
    }
  },

  // Submit inquiry
  async submitInquiry(inquiryData: InquiryInsert): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('inquiries')
        .insert(inquiryData);

      if (error) throw error;
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  // Get inquiries for agent
  async getInquiries(agentId: string): Promise<Inquiry[]> {
    const { data, error } = await supabase
      .from('inquiries')
      .select(`
        *,
        properties!inquiries_property_id_fkey(title, address)
      `)
      .eq('properties.agent_id', agentId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching inquiries:', error);
      return [];
    }

    return data || [];
  },

  // Add/remove favorite
  async toggleFavorite(userId: string, propertyId: string): Promise<{ success: boolean; isFavorited: boolean }> {
    try {
      // Check if already favorited
      const { data: existing } = await supabase
        .from('favorites')
        .select('id')
        .eq('user_id', userId)
        .eq('property_id', propertyId)
        .single();

      if (existing) {
        // Remove favorite
        await supabase
          .from('favorites')
          .delete()
          .eq('user_id', userId)
          .eq('property_id', propertyId);
        return { success: true, isFavorited: false };
      } else {
        // Add favorite
        await supabase
          .from('favorites')
          .insert({ user_id: userId, property_id: propertyId });
        return { success: true, isFavorited: true };
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      return { success: false, isFavorited: false };
    }
  },

  // Get user favorites
  async getFavorites(userId: string): Promise<PropertyWithImages[]> {
    const { data, error } = await supabase
      .from('favorites')
      .select(`
        properties(
          *,
          property_images(*),
          profiles!properties_agent_id_fkey(full_name, phone, email, avatar_url, company)
        )
      `)
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching favorites:', error);
      return [];
    }

    return data?.map(item => item.properties).filter(Boolean) || [];
  },

  // Search properties with AI-like filtering
  async searchProperties(query: string): Promise<PropertyWithImages[]> {
    const q = query.toLowerCase();
    
    // Detect intent
    const buyKeywords = ['buy', 'buying', 'purchase', 'purchasing', 'own', 'ownership', 'invest', 'investment'];
    const rentKeywords = ['rent', 'rental', 'renting', 'lease', 'leasing', 'tenant', 'monthly'];
    
    const isBuyIntent = buyKeywords.some(keyword => q.includes(keyword));
    const isRentIntent = rentKeywords.some(keyword => q.includes(keyword));
    
    let listingType: 'sale' | 'rent' | undefined;
    if (isBuyIntent && !isRentIntent) {
      listingType = 'sale';
    } else if (isRentIntent && !isBuyIntent) {
      listingType = 'rent';
    }

    // Extract location
    const locationKeywords = [
      'johor bahru', 'jb', 'kuala lumpur', 'kl', 'penang', 'georgetown',
      'petaling jaya', 'pj', 'subang jaya', 'cyberjaya', 'putrajaya',
      'shah alam', 'klcc', 'mont kiara', 'bangsar', 'damansara',
      'taman daya', 'taman molek', 'sutera utama', 'mount austin'
    ];
    
    let cityFilter: string | undefined;
    for (const location of locationKeywords) {
      if (q.includes(location)) {
        cityFilter = location;
        break;
      }
    }

    // Extract price range
    const priceMatch = q.match(/(?:under|below|less than|maximum|max|up to|budget)\s*rm\s*(\d{1,3}(?:,?\d{3})*(?:k|000)?)/i);
    let maxPrice: number | undefined;
    if (priceMatch) {
      maxPrice = parseFloat(priceMatch[1].replace(/,/g, ''));
      if (priceMatch[1].toLowerCase().includes('k')) {
        maxPrice *= 1000;
      }
    }

    // Extract bedrooms
    const bedroomMatch = q.match(/(\d+)\s*(?:bed|bedroom)/i);
    const bedrooms = bedroomMatch ? parseInt(bedroomMatch[1]) : undefined;

    // Extract property type
    const typeKeywords = {
      'house': 'house',
      'apartment': 'apartment',
      'condo': 'condo',
      'villa': 'villa',
      'studio': 'studio'
    };
    
    let propertyType: string | undefined;
    for (const [keyword, type] of Object.entries(typeKeywords)) {
      if (q.includes(keyword)) {
        propertyType = type;
        break;
      }
    }

    return this.getProperties({
      listing_type: listingType,
      city: cityFilter,
      property_type: propertyType,
      max_price: maxPrice,
      bedrooms: bedrooms,
      limit: 6
    });
  }
};