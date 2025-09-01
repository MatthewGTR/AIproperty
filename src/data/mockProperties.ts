import { Property } from '../types/Property';

export const mockProperties: Property[] = [
  {
    id: '1',
    title: 'Modern Downtown Apartment',
    location: 'Downtown, New York',
    price: 850000,
    type: 'apartment',
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1200,
    images: [
      'https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    description: 'Beautiful modern apartment in the heart of downtown with stunning city views and premium amenities.',
    amenities: ['Gym', 'Pool', 'Parking', 'Concierge', 'Rooftop Deck'],
    agent: {
      name: 'Sarah Johnson',
      phone: '+1 (555) 123-4567',
      email: 'sarah@realestate.com',
      image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150'
    },
    featured: true,
    listedDate: '2025-01-15'
  },
  {
    id: '2',
    title: 'Luxury Family Villa',
    location: 'Beverly Hills, CA',
    price: 2500000,
    type: 'villa',
    bedrooms: 5,
    bathrooms: 4,
    sqft: 3500,
    images: [
      'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    description: 'Spectacular luxury villa with panoramic views, private pool, and premium finishes throughout.',
    amenities: ['Private Pool', 'Garden', 'Garage', 'Security System', 'Wine Cellar'],
    agent: {
      name: 'Michael Chen',
      phone: '+1 (555) 987-6543',
      email: 'michael@luxuryrealty.com',
      image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150'
    },
    featured: true,
    listedDate: '2025-01-14'
  },
  {
    id: '3',
    title: 'Cozy Suburban House',
    location: 'Austin, TX',
    price: 420000,
    type: 'house',
    bedrooms: 3,
    bathrooms: 2,
    sqft: 1800,
    images: [
      'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    description: 'Charming family home in quiet neighborhood with large backyard and modern updates.',
    amenities: ['Backyard', 'Garage', 'Updated Kitchen', 'Hardwood Floors'],
    agent: {
      name: 'Emma Rodriguez',
      phone: '+1 (555) 456-7890',
      email: 'emma@homefinders.com',
      image: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=150'
    },
    featured: false,
    listedDate: '2025-01-13'
  },
  {
    id: '4',
    title: 'Urban Loft',
    location: 'Brooklyn, NY',
    price: 675000,
    type: 'apartment',
    bedrooms: 1,
    bathrooms: 1,
    sqft: 900,
    images: [
      'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    description: 'Stylish loft apartment with exposed brick walls, high ceilings, and industrial charm.',
    amenities: ['High Ceilings', 'Exposed Brick', 'Modern Appliances', 'Near Subway'],
    agent: {
      name: 'David Kim',
      phone: '+1 (555) 234-5678',
      email: 'david@urbanrealty.com',
      image: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150'
    },
    featured: false,
    listedDate: '2025-01-12'
  },
  {
    id: '5',
    title: 'Beachfront Condo',
    location: 'Miami Beach, FL',
    price: 1200000,
    type: 'condo',
    bedrooms: 3,
    bathrooms: 3,
    sqft: 2200,
    images: [
      'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    description: 'Stunning oceanfront condo with breathtaking views, private balcony, and resort-style amenities.',
    amenities: ['Ocean View', 'Balcony', 'Beach Access', 'Spa', 'Valet Parking'],
    agent: {
      name: 'Isabella Martinez',
      phone: '+1 (555) 345-6789',
      email: 'isabella@coastalrealty.com',
      image: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150'
    },
    featured: true,
    listedDate: '2025-01-11'
  },
  {
    id: '6',
    title: 'Historic Townhouse',
    location: 'Boston, MA',
    price: 950000,
    type: 'house',
    bedrooms: 4,
    bathrooms: 3,
    sqft: 2500,
    images: [
      'https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    description: 'Beautifully restored historic townhouse with original details, modern amenities, and prime location.',
    amenities: ['Historic Details', 'Modern Kitchen', 'Garden', 'Fireplace', 'Parking'],
    agent: {
      name: 'James Wilson',
      phone: '+1 (555) 567-8901',
      email: 'james@heritagehomes.com',
      image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150'
    },
    featured: false,
    listedDate: '2025-01-10'
  }
];