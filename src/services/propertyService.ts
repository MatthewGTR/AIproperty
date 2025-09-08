import { supabase } from '../lib/supabase';
import { Database } from '../lib/database.types';

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

    // If no properties found in database, return sample properties
    if (!data || data.length === 0) {
      return this.getSampleProperties(filters);
    }

    return data || [];
  },

  // Get sample properties with multiple images
  getSampleProperties(filters?: {
    listing_type?: 'sale' | 'rent';
    city?: string;
    property_type?: string;
    min_price?: number;
    max_price?: number;
    bedrooms?: number;
    limit?: number;
  }): PropertyWithImages[] {
    const sampleProperties: PropertyWithImages[] = [
      {
        id: 'sample-1',
        title: 'Modern Condo in KLCC',
        description: 'Luxurious condominium in the heart of KL with stunning city views and premium facilities.',
        property_type: 'condo',
        listing_type: 'sale',
        price: 850000,
        bedrooms: 3,
        bathrooms: 2,
        sqft: 1400,
        address: '123 KLCC Avenue',
        city: 'Kuala Lumpur',
        state: 'KL',
        country: 'Malaysia',
        latitude: null,
        longitude: null,
        amenities: ['Swimming Pool', 'Gym', 'Security', 'Parking', 'Concierge'],
        furnished: null,
        availability_date: null,
        deposit_info: null,
        agent_id: 'sample-agent-1',
        status: 'active',
        featured: true,
        views_count: 125,
        created_at: '2025-01-16T00:00:00Z',
        updated_at: '2025-01-16T00:00:00Z',
        property_images: [
          {
            id: 'img-1-1',
            property_id: 'sample-1',
            image_url: 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800',
            alt_text: 'Modern condo exterior',
            display_order: 0,
            is_primary: true,
            created_at: '2025-01-16T00:00:00Z'
          },
          {
            id: 'img-1-2',
            property_id: 'sample-1',
            image_url: 'https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg?auto=compress&cs=tinysrgb&w=800',
            alt_text: 'Living room interior',
            display_order: 1,
            is_primary: false,
            created_at: '2025-01-16T00:00:00Z'
          },
          {
            id: 'img-1-3',
            property_id: 'sample-1',
            image_url: 'https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg?auto=compress&cs=tinysrgb&w=800',
            alt_text: 'Kitchen and dining area',
            display_order: 2,
            is_primary: false,
            created_at: '2025-01-16T00:00:00Z'
          }
        ],
        profiles: {
          full_name: 'Ahmad Rahman',
          phone: '+60 12-345-6789',
          email: 'ahmad@malaysiarealty.com',
          avatar_url: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150',
          company: 'Malaysia Realty'
        }
      },
      {
        id: 'sample-2',
        title: 'Terrace House in Taman Daya',
        description: 'Spacious double-storey terrace house in established residential area with easy access to amenities.',
        property_type: 'house',
        listing_type: 'sale',
        price: 420000,
        bedrooms: 4,
        bathrooms: 3,
        sqft: 1800,
        address: '456 Taman Daya Street',
        city: 'Johor Bahru',
        state: 'Johor',
        country: 'Malaysia',
        latitude: null,
        longitude: null,
        amenities: ['Garden', 'Parking', 'Near School', 'Shopping Mall Nearby'],
        furnished: null,
        availability_date: null,
        deposit_info: null,
        agent_id: 'sample-agent-2',
        status: 'active',
        featured: true,
        views_count: 89,
        created_at: '2025-01-15T00:00:00Z',
        updated_at: '2025-01-15T00:00:00Z',
        property_images: [
          {
            id: 'img-2-1',
            property_id: 'sample-2',
            image_url: 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=800',
            alt_text: 'House exterior',
            display_order: 0,
            is_primary: true,
            created_at: '2025-01-15T00:00:00Z'
          },
          {
            id: 'img-2-2',
            property_id: 'sample-2',
            image_url: 'https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg?auto=compress&cs=tinysrgb&w=800',
            alt_text: 'Living room',
            display_order: 1,
            is_primary: false,
            created_at: '2025-01-15T00:00:00Z'
          },
          {
            id: 'img-2-3',
            property_id: 'sample-2',
            image_url: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800',
            alt_text: 'Garden view',
            display_order: 2,
            is_primary: false,
            created_at: '2025-01-15T00:00:00Z'
          }
        ],
        profiles: {
          full_name: 'Siti Nurhaliza',
          phone: '+60 17-234-5678',
          email: 'siti@johorrealty.com',
          avatar_url: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150',
          company: 'Johor Realty'
        }
      },
      {
        id: 'sample-3',
        title: 'Luxury Villa in Mont Kiara',
        description: 'Exclusive villa in prestigious Mont Kiara with private pool and landscaped garden.',
        property_type: 'villa',
        listing_type: 'sale',
        price: 2800000,
        bedrooms: 5,
        bathrooms: 4,
        sqft: 4200,
        address: '789 Mont Kiara Heights',
        city: 'Kuala Lumpur',
        state: 'KL',
        country: 'Malaysia',
        latitude: null,
        longitude: null,
        amenities: ['Private Pool', 'Garden', 'Security', 'Maid Room', 'Double Garage'],
        furnished: null,
        availability_date: null,
        deposit_info: null,
        agent_id: 'sample-agent-3',
        status: 'active',
        featured: true,
        views_count: 203,
        created_at: '2025-01-13T00:00:00Z',
        updated_at: '2025-01-13T00:00:00Z',
        property_images: [
          {
            id: 'img-3-1',
            property_id: 'sample-3',
            image_url: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800',
            alt_text: 'Villa exterior',
            display_order: 0,
            is_primary: true,
            created_at: '2025-01-13T00:00:00Z'
          },
          {
            id: 'img-3-2',
            property_id: 'sample-3',
            image_url: 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=800',
            alt_text: 'Pool area',
            display_order: 1,
            is_primary: false,
            created_at: '2025-01-13T00:00:00Z'
          },
          {
            id: 'img-3-3',
            property_id: 'sample-3',
            image_url: 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800',
            alt_text: 'Interior living space',
            display_order: 2,
            is_primary: false,
            created_at: '2025-01-13T00:00:00Z'
          }
        ],
        profiles: {
          full_name: 'Tan Sook Ling',
          phone: '+60 12-456-7890',
          email: 'tan@luxurymalaysia.com',
          avatar_url: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=150',
          company: 'Luxury Malaysia'
        }
      },
      {
        id: 'sample-4',
        title: 'Luxury 3BR Condo for Rent - Sutera Avenue',
        description: 'Stunning 3-bedroom condominium with city views in premium Sutera development. Close to Singapore CIQ checkpoint.',
        property_type: 'condo',
        listing_type: 'rent',
        price: 3200,
        bedrooms: 3,
        bathrooms: 2,
        sqft: 1400,
        address: '321 Sutera Avenue',
        city: 'Johor Bahru',
        state: 'Johor',
        country: 'Malaysia',
        latitude: null,
        longitude: null,
        amenities: ['City View', 'Infinity Pool', 'Gym', 'Security', 'Near CIQ', 'Shopping Mall'],
        furnished: 'fully_furnished',
        availability_date: '2025-02-01',
        deposit_info: '2 months + 1 month advance',
        agent_id: 'sample-agent-4',
        status: 'active',
        featured: true,
        views_count: 156,
        created_at: '2025-01-20T00:00:00Z',
        updated_at: '2025-01-20T00:00:00Z',
        property_images: [
          {
            id: 'img-4-1',
            property_id: 'sample-4',
            image_url: 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800',
            alt_text: 'Condo exterior view',
            display_order: 0,
            is_primary: true,
            created_at: '2025-01-20T00:00:00Z'
          },
          {
            id: 'img-4-2',
            property_id: 'sample-4',
            image_url: 'https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg?auto=compress&cs=tinysrgb&w=800',
            alt_text: 'Living room with city view',
            display_order: 1,
            is_primary: false,
            created_at: '2025-01-20T00:00:00Z'
          },
          {
            id: 'img-4-3',
            property_id: 'sample-4',
            image_url: 'https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg?auto=compress&cs=tinysrgb&w=800',
            alt_text: 'Master bedroom',
            display_order: 2,
            is_primary: false,
            created_at: '2025-01-20T00:00:00Z'
          }
        ],
        profiles: {
          full_name: 'Ahmad Rahman',
          phone: '+60 12-345-6789',
          email: 'ahmad@suterarealty.com',
          avatar_url: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150',
          company: 'Sutera Realty'
        }
      },
      {
        id: 'sample-5',
        title: 'Cozy Studio for Rent - City Square Area',
        description: 'Stylish studio apartment in the heart of JB city center. Perfect for young professionals.',
        property_type: 'studio',
        listing_type: 'rent',
        price: 1200,
        bedrooms: 1,
        bathrooms: 1,
        sqft: 550,
        address: '654 City Square Plaza',
        city: 'Johor Bahru',
        state: 'Johor',
        country: 'Malaysia',
        latitude: null,
        longitude: null,
        amenities: ['City Center', 'Near Mall', 'Public Transport', 'Restaurants', 'Business District'],
        furnished: 'fully_furnished',
        availability_date: '2025-01-25',
        deposit_info: '2 months + 1 month advance',
        agent_id: 'sample-agent-5',
        status: 'active',
        featured: false,
        views_count: 78,
        created_at: '2025-01-18T00:00:00Z',
        updated_at: '2025-01-18T00:00:00Z',
        property_images: [
          {
            id: 'img-5-1',
            property_id: 'sample-5',
            image_url: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800',
            alt_text: 'Studio apartment overview',
            display_order: 0,
            is_primary: true,
            created_at: '2025-01-18T00:00:00Z'
          },
          {
            id: 'img-5-2',
            property_id: 'sample-5',
            image_url: 'https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg?auto=compress&cs=tinysrgb&w=800',
            alt_text: 'Kitchen area',
            display_order: 1,
            is_primary: false,
            created_at: '2025-01-18T00:00:00Z'
          },
          {
            id: 'img-5-3',
            property_id: 'sample-5',
            image_url: 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800',
            alt_text: 'City view from window',
            display_order: 2,
            is_primary: false,
            created_at: '2025-01-18T00:00:00Z'
          }
        ],
        profiles: {
          full_name: 'Sarah Lim',
          phone: '+60 13-222-3333',
          email: 'sarah@cityrentals.my',
          avatar_url: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=150',
          company: 'City Rentals'
        }
      },
      {
        id: 'sample-6',
        title: 'Penang Hill View Apartment',
        description: 'Heritage area apartment with stunning hill views and walking distance to UNESCO World Heritage sites.',
        property_type: 'apartment',
        listing_type: 'sale',
        price: 650000,
        bedrooms: 2,
        bathrooms: 2,
        sqft: 1100,
        address: '987 Georgetown Heritage Lane',
        city: 'Georgetown',
        state: 'Penang',
        country: 'Malaysia',
        latitude: null,
        longitude: null,
        amenities: ['Hill View', 'Heritage Location', 'Near UNESCO Sites', 'Parking'],
        furnished: null,
        availability_date: null,
        deposit_info: null,
        agent_id: 'sample-agent-6',
        status: 'active',
        featured: false,
        views_count: 92,
        created_at: '2025-01-14T00:00:00Z',
        updated_at: '2025-01-14T00:00:00Z',
        property_images: [
          {
            id: 'img-6-1',
            property_id: 'sample-6',
            image_url: 'https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg?auto=compress&cs=tinysrgb&w=800',
            alt_text: 'Apartment exterior',
            display_order: 0,
            is_primary: true,
            created_at: '2025-01-14T00:00:00Z'
          },
          {
            id: 'img-6-2',
            property_id: 'sample-6',
            image_url: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800',
            alt_text: 'Hill view from balcony',
            display_order: 1,
            is_primary: false,
            created_at: '2025-01-14T00:00:00Z'
          },
          {
            id: 'img-6-3',
            property_id: 'sample-6',
            image_url: 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800',
            alt_text: 'Heritage street view',
            display_order: 2,
            is_primary: false,
            created_at: '2025-01-14T00:00:00Z'
          }
        ],
        profiles: {
          full_name: 'Lim Wei Ming',
          phone: '+60 16-345-6789',
          email: 'lim@penanghomes.com',
          avatar_url: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
          company: 'Penang Homes'
        }
      }
    ];

    // Apply filters to sample properties
    let filteredProperties = sampleProperties;

    if (filters?.listing_type) {
      filteredProperties = filteredProperties.filter(p => p.listing_type === filters.listing_type);
    }
    if (filters?.city) {
      filteredProperties = filteredProperties.filter(p => 
        p.city.toLowerCase().includes(filters.city!.toLowerCase())
      );
    }
    if (filters?.property_type) {
      filteredProperties = filteredProperties.filter(p => p.property_type === filters.property_type);
    }
    if (filters?.min_price) {
      filteredProperties = filteredProperties.filter(p => p.price >= filters.min_price!);
    }
    if (filters?.max_price) {
      filteredProperties = filteredProperties.filter(p => p.price <= filters.max_price!);
    }
    if (filters?.bedrooms) {
      filteredProperties = filteredProperties.filter(p => p.bedrooms === filters.bedrooms);
    }
    if (filters?.limit) {
      filteredProperties = filteredProperties.slice(0, filters.limit);
    }

    return filteredProperties;
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