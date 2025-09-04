export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          phone: string | null;
          user_type: 'buyer' | 'seller' | 'agent' | 'admin';
          status: 'pending' | 'approved' | 'rejected' | 'suspended';
          company: string | null;
          license_number: string | null;
          credits: number;
          avatar_url: string | null;
          bio: string | null;
          created_at: string;
          updated_at: string;
          approved_by: string | null;
          approved_at: string | null;
          ai_context: Json | null;
        };
        Insert: {
          id: string;
          email: string;
          full_name: string;
          phone?: string | null;
          user_type?: 'buyer' | 'seller' | 'agent' | 'admin';
          status?: 'pending' | 'approved' | 'rejected' | 'suspended';
          company?: string | null;
          license_number?: string | null;
          credits?: number;
          avatar_url?: string | null;
          bio?: string | null;
          approved_by?: string | null;
          approved_at?: string | null;
          ai_context?: Json | null;
        };
        Update: {
          email?: string;
          full_name?: string;
          phone?: string | null;
          user_type?: 'buyer' | 'seller' | 'agent' | 'admin';
          status?: 'pending' | 'approved' | 'rejected' | 'suspended';
          company?: string | null;
          license_number?: string | null;
          credits?: number;
          avatar_url?: string | null;
          bio?: string | null;
          updated_at?: string;
          approved_by?: string | null;
          approved_at?: string | null;
          ai_context?: Json | null;
        };
      };
      properties: {
        Row: {
          id: string;
          title: string;
          description: string;
          property_type: 'house' | 'apartment' | 'condo' | 'villa' | 'studio' | 'shophouse';
          listing_type: 'sale' | 'rent';
          price: number;
          bedrooms: number;
          bathrooms: number;
          sqft: number;
          address: string;
          city: string;
          state: string;
          country: string;
          latitude: number | null;
          longitude: number | null;
          amenities: string[];
          furnished: 'fully_furnished' | 'partially_furnished' | 'unfurnished' | null;
          availability_date: string | null;
          deposit_info: string | null;
          agent_id: string;
          status: 'draft' | 'active' | 'sold' | 'rented' | 'inactive';
          featured: boolean;
          views_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          title: string;
          description: string;
          property_type: 'house' | 'apartment' | 'condo' | 'villa' | 'studio' | 'shophouse';
          listing_type?: 'sale' | 'rent';
          price: number;
          bedrooms?: number;
          bathrooms?: number;
          sqft: number;
          address: string;
          city: string;
          state: string;
          country?: string;
          latitude?: number | null;
          longitude?: number | null;
          amenities?: string[];
          furnished?: 'fully_furnished' | 'partially_furnished' | 'unfurnished' | null;
          availability_date?: string | null;
          deposit_info?: string | null;
          agent_id: string;
          status?: 'draft' | 'active' | 'sold' | 'rented' | 'inactive';
          featured?: boolean;
        };
        Update: {
          title?: string;
          description?: string;
          property_type?: 'house' | 'apartment' | 'condo' | 'villa' | 'studio' | 'shophouse';
          listing_type?: 'sale' | 'rent';
          price?: number;
          bedrooms?: number;
          bathrooms?: number;
          sqft?: number;
          address?: string;
          city?: string;
          state?: string;
          country?: string;
          latitude?: number | null;
          longitude?: number | null;
          amenities?: string[];
          furnished?: 'fully_furnished' | 'partially_furnished' | 'unfurnished' | null;
          availability_date?: string | null;
          deposit_info?: string | null;
          status?: 'draft' | 'active' | 'sold' | 'rented' | 'inactive';
          featured?: boolean;
          updated_at?: string;
        };
      };
      property_images: {
        Row: {
          id: string;
          property_id: string;
          image_url: string;
          alt_text: string | null;
          display_order: number;
          is_primary: boolean;
          created_at: string;
        };
        Insert: {
          property_id: string;
          image_url: string;
          alt_text?: string | null;
          display_order?: number;
          is_primary?: boolean;
        };
        Update: {
          image_url?: string;
          alt_text?: string | null;
          display_order?: number;
          is_primary?: boolean;
        };
      };
      inquiries: {
        Row: {
          id: string;
          property_id: string;
          inquirer_id: string | null;
          inquirer_name: string;
          inquirer_email: string;
          inquirer_phone: string | null;
          message: string;
          inquiry_type: 'viewing' | 'general' | 'price' | 'financing';
          status: 'new' | 'contacted' | 'scheduled' | 'completed' | 'closed';
          agent_response: string | null;
          responded_at: string | null;
          created_at: string;
        };
        Insert: {
          property_id: string;
          inquirer_id?: string | null;
          inquirer_name: string;
          inquirer_email: string;
          inquirer_phone?: string | null;
          message: string;
          inquiry_type?: 'viewing' | 'general' | 'price' | 'financing';
          status?: 'new' | 'contacted' | 'scheduled' | 'completed' | 'closed';
        };
        Update: {
          status?: 'new' | 'contacted' | 'scheduled' | 'completed' | 'closed';
          agent_response?: string | null;
          responded_at?: string | null;
        };
      };
      favorites: {
        Row: {
          id: string;
          user_id: string;
          property_id: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          property_id: string;
        };
        Update: {};
      };
      property_views: {
        Row: {
          id: string;
          property_id: string;
          viewer_id: string | null;
          viewer_ip: string | null;
          user_agent: string | null;
          viewed_at: string;
        };
        Insert: {
          property_id: string;
          viewer_id?: string | null;
          viewer_ip?: string | null;
          user_agent?: string | null;
        };
        Update: {};
      };
      credit_transactions: {
        Row: {
          id: string;
          user_id: string;
          transaction_type: 'addition' | 'deduction';
          amount: number;
          reason: string;
          property_id: string | null;
          admin_id: string | null;
          created_at: string;
        };
        Insert: {
          user_id: string;
          transaction_type: 'addition' | 'deduction';
          amount: number;
          reason: string;
          property_id?: string | null;
          admin_id?: string | null;
        };
        Update: {};
      };
    };
  };
}