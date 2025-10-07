import { buyPropertiesData } from '../components/BuyPropertiesData';
import { rentPropertiesData } from '../components/RentPropertiesData';
import type { PropertyWithImages } from './propertyService';

// Convert Buy properties to unified format
const convertBuyProperties = (): PropertyWithImages[] => {
  return buyPropertiesData.map(prop => ({
    id: prop.id,
    title: prop.title,
    description: prop.description,
    price: prop.price,
    property_type: prop.type,
    listing_type: 'sale' as const,
    bedrooms: prop.bedrooms,
    bathrooms: prop.bathrooms,
    sqft: prop.sqft,
    address: prop.location.split(',')[0] || prop.location,
    city: prop.location.includes(',') ? prop.location.split(',')[1]?.trim() || prop.location : prop.location,
    state: prop.location.includes('Johor') ? 'Johor' :
           prop.location.includes('Kuala Lumpur') || prop.location.includes('KL') ? 'Kuala Lumpur' :
           prop.location.includes('Penang') ? 'Penang' :
           prop.location.includes('Selangor') || prop.location.includes('Shah Alam') || prop.location.includes('Subang') ? 'Selangor' :
           prop.location.includes('Sabah') || prop.location.includes('Kota Kinabalu') ? 'Sabah' :
           prop.location.includes('Perak') || prop.location.includes('Ipoh') ? 'Perak' :
           '',
    country: 'Malaysia',
    latitude: null,
    longitude: null,
    amenities: prop.amenities,
    furnished: null,
    availability_date: null,
    deposit_info: null,
    agent_id: prop.id,
    status: 'active' as const,
    featured: prop.featured,
    views_count: 0,
    created_at: prop.listedDate,
    updated_at: prop.listedDate,
    property_images: prop.images.map((url, index) => ({
      id: `${prop.id}-img-${index}`,
      property_id: prop.id,
      image_url: url,
      display_order: index + 1,
      is_primary: index === 0,
      created_at: prop.listedDate
    })),
    profiles: {
      full_name: prop.agent.name,
      phone: prop.agent.phone,
      email: prop.agent.email,
      avatar_url: prop.agent.image,
      company: null
    }
  }));
};

// Convert Rent properties to unified format
const convertRentProperties = (): PropertyWithImages[] => {
  return rentPropertiesData.map(prop => ({
    id: prop.id,
    title: prop.title,
    description: prop.description,
    price: prop.monthlyRent,
    property_type: prop.type,
    listing_type: 'rent' as const,
    bedrooms: prop.bedrooms,
    bathrooms: prop.bathrooms,
    sqft: prop.sqft,
    address: prop.location.split(',')[0] || prop.location,
    city: prop.location.includes(',') ? prop.location.split(',')[1]?.trim() || prop.location : prop.location,
    state: prop.location.includes('Johor') ? 'Johor' :
           prop.location.includes('Kuala Lumpur') || prop.location.includes('KL') ? 'Kuala Lumpur' :
           prop.location.includes('Penang') ? 'Penang' :
           prop.location.includes('Selangor') || prop.location.includes('Shah Alam') || prop.location.includes('Subang') ? 'Selangor' :
           prop.location.includes('Sabah') || prop.location.includes('Kota Kinabalu') ? 'Sabah' :
           prop.location.includes('Perak') || prop.location.includes('Ipoh') ? 'Perak' :
           '',
    country: 'Malaysia',
    latitude: null,
    longitude: null,
    amenities: prop.amenities,
    furnished: prop.furnished,
    availability_date: prop.availability,
    deposit_info: prop.deposit,
    agent_id: prop.id,
    status: 'active' as const,
    featured: false,
    views_count: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    property_images: prop.images.map((url, index) => ({
      id: `${prop.id}-img-${index}`,
      property_id: prop.id,
      image_url: url,
      display_order: index + 1,
      is_primary: index === 0,
      created_at: new Date().toISOString()
    })),
    profiles: {
      full_name: prop.agent.name,
      phone: prop.agent.phone,
      email: prop.agent.email,
      avatar_url: prop.agent.image,
      company: null
    }
  }));
};

// Get all properties from static data
export const getAllStaticProperties = (): PropertyWithImages[] => {
  const buyProperties = convertBuyProperties();
  const rentProperties = convertRentProperties();
  return [...buyProperties, ...rentProperties];
};

// Filter properties based on criteria
export interface PropertyFilters {
  listing_type?: 'rent' | 'sale';
  city?: string;
  property_type?: string;
  min_price?: number;
  max_price?: number;
  bedrooms?: number;
  limit?: number;
}

export const filterStaticProperties = (filters: PropertyFilters = {}): PropertyWithImages[] => {
  let properties = getAllStaticProperties();

  // Filter by listing type
  if (filters.listing_type) {
    properties = properties.filter(p => p.listing_type === filters.listing_type);
  }

  // Filter by location (search in city, state, and address)
  if (filters.city) {
    const searchTerm = filters.city.toLowerCase();
    properties = properties.filter(p =>
      p.city?.toLowerCase().includes(searchTerm) ||
      p.state?.toLowerCase().includes(searchTerm) ||
      p.address?.toLowerCase().includes(searchTerm)
    );
  }

  // Filter by property type
  if (filters.property_type) {
    properties = properties.filter(p => p.property_type === filters.property_type);
  }

  // Filter by price range
  if (filters.min_price) {
    properties = properties.filter(p => p.price >= filters.min_price!);
  }
  if (filters.max_price) {
    properties = properties.filter(p => p.price <= filters.max_price!);
  }

  // Filter by bedrooms
  if (filters.bedrooms) {
    properties = properties.filter(p => p.bedrooms === filters.bedrooms);
  }

  // Limit results
  if (filters.limit) {
    properties = properties.slice(0, filters.limit);
  }

  return properties;
};
