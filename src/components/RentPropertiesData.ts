export interface RentalProperty {
  id: string;
  title: string;
  location: string;
  monthlyRent: number;
  deposit: string;
  type: 'condo' | 'apartment' | 'house' | 'studio';
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  images: string[];
  description: string;
  amenities: string[];
  furnished: 'Fully Furnished' | 'Partially Furnished' | 'Unfurnished';
  availability: string;
  agent: {
    name: string;
    phone: string;
    email: string;
    image: string;
  };
}

export const rentPropertiesData: RentalProperty[] = [
  {
    id: 'r1',
    title: 'Luxury 3BR Condo - Sutera Avenue',
    location: 'Sutera Utama, Johor Bahru',
    monthlyRent: 3200,
    deposit: '2 months + 1 month advance',
    type: 'condo',
    bedrooms: 3,
    bathrooms: 2,
    sqft: 1400,
    images: [
      'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    description: 'Stunning 3-bedroom condominium with city views in premium Sutera development. Close to Singapore CIQ checkpoint with world-class facilities including infinity pool and sky gym.',
    amenities: ['City View', 'Infinity Pool', 'Gym', 'Security', 'Near CIQ', 'Shopping Mall'],
    furnished: 'Fully Furnished',
    availability: 'Available Now',
    agent: {
      name: 'Ahmad Rahman',
      phone: '+60 12-345-6789',
      email: 'ahmad@suterarealty.com',
      image: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150'
    }
  },
  {
    id: 'r2',
    title: 'Modern 2BR Apartment - Taman Molek',
    location: 'Taman Molek, Johor Bahru',
    monthlyRent: 1800,
    deposit: '2 months + 1 month advance',
    type: 'apartment',
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1100,
    images: [
      'https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    description: 'Contemporary 2-bedroom apartment in established Taman Molek. Walking distance to international schools, shopping centers, and restaurants. Perfect for expat families.',
    amenities: ['Swimming Pool', 'Playground', 'Security', 'Near International School', 'Shopping Nearby'],
    furnished: 'Fully Furnished',
    availability: 'Available from Feb 1st',
    agent: {
      name: 'Michelle Chen',
      phone: '+60 15-444-5555',
      email: 'michelle@molekrentals.com',
      image: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150'
    }
  },
  {
    id: 'r3',
    title: 'Cozy Studio - City Square Area',
    location: 'City Centre, Johor Bahru',
    monthlyRent: 1200,
    deposit: '2 months + 1 month advance',
    type: 'studio',
    bedrooms: 1,
    bathrooms: 1,
    sqft: 550,
    images: [
      'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    description: 'Stylish studio apartment in the heart of JB city center. Perfect for young professionals who want to be close to business district with easy access to shopping and dining.',
    amenities: ['City Center', 'Near Mall', 'Public Transport', 'Restaurants', 'Business District'],
    furnished: 'Fully Furnished',
    availability: 'Available Now',
    agent: {
      name: 'Sarah Lim',
      phone: '+60 13-222-3333',
      email: 'sarah@cityrentals.my',
      image: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=150'
    }
  },
  {
    id: 'r4',
    title: 'Family House - Taman Daya',
    location: 'Taman Daya, Johor Bahru',
    monthlyRent: 2200,
    deposit: '2 months + 1 month advance',
    type: 'house',
    bedrooms: 4,
    bathrooms: 3,
    sqft: 2000,
    images: [
      'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    description: 'Spacious double-storey terrace house in established Taman Daya neighborhood. Perfect for families with children, featuring a private garden and close to reputable schools.',
    amenities: ['Private Garden', 'Parking', 'Near Schools', 'Shopping Mall', 'Playground'],
    furnished: 'Partially Furnished',
    availability: 'Available from Jan 15th',
    agent: {
      name: 'David Wong',
      phone: '+60 14-333-4444',
      email: 'david@dayarentals.com',
      image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150'
    }
  },
  {
    id: 'r5',
    title: 'Serviced Apartment - Paradigm Mall Area',
    location: 'Skudai, Johor Bahru',
    monthlyRent: 2800,
    deposit: '1 month + 1 month advance',
    type: 'apartment',
    bedrooms: 2,
    bathrooms: 2,
    sqft: 900,
    images: [
      'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    description: 'Modern serviced apartment near Paradigm Mall and universities. Ideal for professionals and students with high-speed internet, housekeeping services, and mall connectivity.',
    amenities: ['Near Mall', 'Housekeeping', 'High Speed Internet', 'Near University', 'Gym'],
    furnished: 'Fully Furnished',
    availability: 'Available Now',
    agent: {
      name: 'Lisa Tan',
      phone: '+60 17-666-7777',
      email: 'lisa@paradigmserviced.com',
      image: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=150'
    }
  },
  {
    id: 'r6',
    title: 'Penthouse - Mount Austin',
    location: 'Mount Austin, Johor Bahru',
    monthlyRent: 4500,
    deposit: '3 months + 1 month advance',
    type: 'condo',
    bedrooms: 4,
    bathrooms: 3,
    sqft: 2200,
    images: [
      'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    description: 'Exclusive penthouse in prestigious Mount Austin with panoramic city views. Features private balcony, premium fittings, and access to exclusive club facilities.',
    amenities: ['City View', 'Private Balcony', 'Club House', 'Security', 'Prestigious Area'],
    furnished: 'Fully Furnished',
    availability: 'Available from March 1st',
    agent: {
      name: 'James Lim',
      phone: '+60 18-777-8888',
      email: 'james@mountaustinrentals.com',
      image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150'
    }
  },
  {
    id: 'r7',
    title: 'Budget Room - Taman Universiti',
    location: 'Taman Universiti, Johor Bahru',
    monthlyRent: 600,
    deposit: '1 month + 1 month advance',
    type: 'apartment',
    bedrooms: 1,
    bathrooms: 1,
    sqft: 300,
    images: [
      'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    description: 'Affordable single room perfect for students and young professionals. Located in university area with easy access to campus, food courts, and public transportation.',
    amenities: ['Near University', 'Student Area', 'Food Courts', 'Public Transport', 'WiFi'],
    furnished: 'Fully Furnished',
    availability: 'Available Now',
    agent: {
      name: 'Kumar Raj',
      phone: '+60 16-555-6666',
      email: 'kumar@universitirentals.com',
      image: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150'
    }
  },
  {
    id: 'r8',
    title: 'Executive Condo - Horizon Hills',
    location: 'Horizon Hills, Johor Bahru',
    monthlyRent: 3800,
    deposit: '2 months + 1 month advance',
    type: 'condo',
    bedrooms: 3,
    bathrooms: 2,
    sqft: 1600,
    images: [
      'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    description: 'Premium executive condominium in exclusive Horizon Hills golf resort community. Features golf course views, resort facilities, and 24-hour security.',
    amenities: ['Golf Course View', 'Resort Facilities', 'Swimming Pool', 'Tennis Court', '24hr Security'],
    furnished: 'Fully Furnished',
    availability: 'Available from Feb 15th',
    agent: {
      name: 'Peter Loh',
      phone: '+60 12-999-0000',
      email: 'peter@horizonrentals.com',
      image: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150'
    }
  },
  {
    id: 'r9',
    title: 'Shophouse Upper Floor - Jalan Wong Ah Fook',
    location: 'Jalan Wong Ah Fook, Johor Bahru',
    monthlyRent: 1500,
    deposit: '2 months + 1 month advance',
    type: 'house',
    bedrooms: 2,
    bathrooms: 1,
    sqft: 800,
    images: [
      'https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    description: 'Heritage shophouse upper floor in historic Jalan Wong Ah Fook. Perfect for those who appreciate old-world charm in the heart of JB\'s heritage district.',
    amenities: ['Heritage Building', 'City Center', 'Historic Area', 'Near Attractions', 'Character Property'],
    furnished: 'Unfurnished',
    availability: 'Available Now',
    agent: {
      name: 'Rachel Tan',
      phone: '+60 13-000-1111',
      email: 'rachel@heritagerentals.com',
      image: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=150'
    }
  },
  {
    id: 'r10',
    title: 'New Launch Condo - Medini Iskandar',
    location: 'Medini, Iskandar Puteri',
    monthlyRent: 2600,
    deposit: '2 months + 1 month advance',
    type: 'condo',
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1000,
    images: [
      'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    description: 'Brand new condominium in fast-growing Medini district near Legoland. Features modern smart home technology, high-speed internet, and resort-style facilities.',
    amenities: ['Smart Home', 'Near Legoland', 'Swimming Pool', 'New Development', 'High Speed Internet'],
    furnished: 'Fully Furnished',
    availability: 'Available from Feb 1st',
    agent: {
      name: 'Kevin Ng',
      phone: '+60 11-222-3333',
      email: 'kevin@medinirentals.com',
      image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150'
    }
  }
];
