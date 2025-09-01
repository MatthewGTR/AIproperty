export interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
  type: 'house' | 'apartment' | 'condo' | 'villa';
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  images: string[];
  description: string;
  amenities: string[];
  agent: {
    name: string;
    phone: string;
    email: string;
    image: string;
  };
  featured: boolean;
  listedDate: string;
}