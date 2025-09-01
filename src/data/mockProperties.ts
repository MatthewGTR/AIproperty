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
  },
  // Malaysian Properties
  {
    id: '7',
    title: 'Modern Condo in KLCC',
    location: 'Kuala Lumpur City Centre, KL',
    price: 850000,
    type: 'condo',
    bedrooms: 3,
    bathrooms: 2,
    sqft: 1400,
    images: [
      'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    description: 'Luxurious condominium in the heart of KL with stunning city views and premium facilities.',
    amenities: ['Swimming Pool', 'Gym', 'Security', 'Parking', 'Concierge'],
    agent: {
      name: 'Ahmad Rahman',
      phone: '+60 12-345-6789',
      email: 'ahmad@malaysiarealty.com',
      image: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150'
    },
    featured: true,
    listedDate: '2025-01-16'
  },
  {
    id: '8',
    title: 'Terrace House in Taman Daya',
    location: 'Taman Daya, Johor Bahru',
    price: 420000,
    type: 'house',
    bedrooms: 4,
    bathrooms: 3,
    sqft: 1800,
    images: [
      'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    description: 'Spacious double-storey terrace house in established residential area with easy access to amenities.',
    amenities: ['Garden', 'Parking', 'Near School', 'Shopping Mall Nearby'],
    agent: {
      name: 'Siti Nurhaliza',
      phone: '+60 17-234-5678',
      email: 'siti@johorrealty.com',
      image: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150'
    },
    featured: true,
    listedDate: '2025-01-15'
  },
  {
    id: '9',
    title: 'Penang Hill View Apartment',
    location: 'Georgetown, Penang',
    price: 650000,
    type: 'apartment',
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1100,
    images: [
      'https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    description: 'Heritage area apartment with stunning hill views and walking distance to UNESCO World Heritage sites.',
    amenities: ['Hill View', 'Heritage Location', 'Near UNESCO Sites', 'Parking'],
    agent: {
      name: 'Lim Wei Ming',
      phone: '+60 16-345-6789',
      email: 'lim@penanghomes.com',
      image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150'
    },
    featured: false,
    listedDate: '2025-01-14'
  },
  {
    id: '10',
    title: 'Luxury Villa in Mont Kiara',
    location: 'Mont Kiara, Kuala Lumpur',
    price: 2800000,
    type: 'villa',
    bedrooms: 5,
    bathrooms: 4,
    sqft: 4200,
    images: [
      'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    description: 'Exclusive villa in prestigious Mont Kiara with private pool and landscaped garden.',
    amenities: ['Private Pool', 'Garden', 'Security', 'Maid Room', 'Double Garage'],
    agent: {
      name: 'Tan Sook Ling',
      phone: '+60 12-456-7890',
      email: 'tan@luxurymalaysia.com',
      image: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=150'
    },
    featured: true,
    listedDate: '2025-01-13'
  },
  {
    id: '11',
    title: 'Affordable Flat in Wangsa Maju',
    location: 'Wangsa Maju, Kuala Lumpur',
    price: 280000,
    type: 'apartment',
    bedrooms: 3,
    bathrooms: 2,
    sqft: 900,
    images: [
      'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    description: 'Budget-friendly apartment perfect for first-time buyers with good connectivity to city center.',
    amenities: ['Near LRT', 'Playground', 'Market Nearby', 'Parking'],
    agent: {
      name: 'Raj Kumar',
      phone: '+60 19-567-8901',
      email: 'raj@affordablehomes.my',
      image: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150'
    },
    featured: false,
    listedDate: '2025-01-12'
  },
  {
    id: '12',
    title: 'Beachfront Condo in Kota Kinabalu',
    location: 'Kota Kinabalu, Sabah',
    price: 750000,
    type: 'condo',
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1200,
    images: [
      'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    description: 'Stunning beachfront condominium with panoramic sea views and resort-style facilities.',
    amenities: ['Sea View', 'Beach Access', 'Swimming Pool', 'Gym', 'BBQ Area'],
    agent: {
      name: 'Maria Gonzales',
      phone: '+60 18-678-9012',
      email: 'maria@sabahproperties.com',
      image: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150'
    },
    featured: true,
    listedDate: '2025-01-11'
  },
  {
    id: '13',
    title: 'Shop Office in Subang Jaya',
    location: 'Subang Jaya, Selangor',
    price: 1200000,
    type: 'house',
    bedrooms: 0,
    bathrooms: 2,
    sqft: 2000,
    images: [
      'https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    description: 'Strategic shop office in busy commercial area, perfect for business and investment.',
    amenities: ['Commercial Area', 'High Traffic', 'Parking', 'Near LRT'],
    agent: {
      name: 'Wong Ah Kow',
      phone: '+60 12-789-0123',
      email: 'wong@commercialmy.com',
      image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150'
    },
    featured: false,
    listedDate: '2025-01-10'
  },
  {
    id: '14',
    title: 'Semi-D in Shah Alam',
    location: 'Shah Alam, Selangor',
    price: 950000,
    type: 'house',
    bedrooms: 4,
    bathrooms: 3,
    sqft: 2400,
    images: [
      'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    description: 'Spacious semi-detached house in mature neighborhood with excellent facilities.',
    amenities: ['Garden', 'Covered Car Porch', 'Near School', 'Playground'],
    agent: {
      name: 'Fatimah Abdullah',
      phone: '+60 13-890-1234',
      email: 'fatimah@selangorproperties.com',
      image: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=150'
    },
    featured: false,
    listedDate: '2025-01-09'
  },
  {
    id: '15',
    title: 'High-Rise Condo in Cyberjaya',
    location: 'Cyberjaya, Selangor',
    price: 580000,
    type: 'condo',
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1000,
    images: [
      'https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    description: 'Modern condominium in Malaysia\'s tech hub with smart home features and green environment.',
    amenities: ['Smart Home', 'Green Building', 'Gym', 'Study Room', 'Parking'],
    agent: {
      name: 'Kevin Loh',
      phone: '+60 14-901-2345',
      email: 'kevin@cyberjayahomes.com',
      image: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150'
    },
    featured: true,
    listedDate: '2025-01-08'
  },
  {
    id: '16',
    title: 'Townhouse in Bandar Sunway',
    location: 'Bandar Sunway, Selangor',
    price: 720000,
    type: 'house',
    bedrooms: 3,
    bathrooms: 3,
    sqft: 1600,
    images: [
      'https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    description: 'Modern townhouse near Sunway Pyramid and Sunway University with excellent connectivity.',
    amenities: ['Near University', 'Shopping Mall', 'Theme Park', 'Medical Centre'],
    agent: {
      name: 'Priya Sharma',
      phone: '+60 15-012-3456',
      email: 'priya@sunwayproperties.com',
      image: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150'
    },
    featured: false,
    listedDate: '2025-01-07'
  },
  {
    id: '17',
    title: 'Luxury Condo in Damansara Heights',
    location: 'Damansara Heights, KL',
    price: 1800000,
    type: 'condo',
    bedrooms: 4,
    bathrooms: 3,
    sqft: 2200,
    images: [
      'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    description: 'Premium condominium in exclusive Damansara Heights with panoramic city views.',
    amenities: ['City View', 'Infinity Pool', 'Sky Lounge', 'Concierge', 'Wine Cellar'],
    agent: {
      name: 'Daniel Tan',
      phone: '+60 16-123-4567',
      email: 'daniel@premiumkl.com',
      image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150'
    },
    featured: true,
    listedDate: '2025-01-06'
  },
  {
    id: '18',
    title: 'Budget Apartment in Cheras',
    location: 'Cheras, Kuala Lumpur',
    price: 320000,
    type: 'apartment',
    bedrooms: 3,
    bathrooms: 2,
    sqft: 950,
    images: [
      'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    description: 'Affordable apartment in established area with good public transport connectivity.',
    amenities: ['Near MRT', 'Wet Market', 'Food Court', 'Parking'],
    agent: {
      name: 'Lim Siew Hoon',
      phone: '+60 17-234-5678',
      email: 'lim@cherasflats.com',
      image: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=150'
    },
    featured: false,
    listedDate: '2025-01-05'
  },
  {
    id: '19',
    title: 'Waterfront Condo in Putrajaya',
    location: 'Putrajaya, Malaysia',
    price: 680000,
    type: 'condo',
    bedrooms: 3,
    bathrooms: 2,
    sqft: 1300,
    images: [
      'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    description: 'Serene waterfront condominium in Malaysia\'s administrative capital with lake views.',
    amenities: ['Lake View', 'Jogging Track', 'Playground', 'Mosque Nearby', 'Government Area'],
    agent: {
      name: 'Azman Ibrahim',
      phone: '+60 18-345-6789',
      email: 'azman@putrajayahomes.com',
      image: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150'
    },
    featured: false,
    listedDate: '2025-01-04'
  },
  {
    id: '20',
    title: 'Bungalow in Petaling Jaya',
    location: 'Petaling Jaya, Selangor',
    price: 3200000,
    type: 'house',
    bedrooms: 6,
    bathrooms: 5,
    sqft: 5000,
    images: [
      'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    description: 'Magnificent bungalow in prime PJ location with swimming pool and landscaped garden.',
    amenities: ['Swimming Pool', 'Garden', 'Maid Room', 'Study Room', 'Wine Cellar', 'Security'],
    agent: {
      name: 'Catherine Lee',
      phone: '+60 12-456-7890',
      email: 'catherine@pjluxury.com',
      image: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150'
    },
    featured: true,
    listedDate: '2025-01-03'
  },
  {
    id: '21',
    title: 'Studio in Bukit Bintang',
    location: 'Bukit Bintang, Kuala Lumpur',
    price: 450000,
    type: 'apartment',
    bedrooms: 1,
    bathrooms: 1,
    sqft: 600,
    images: [
      'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    description: 'Compact studio in the heart of KL\'s entertainment district, perfect for young professionals.',
    amenities: ['City Center', 'Near Monorail', 'Shopping Malls', 'Restaurants', 'Nightlife'],
    agent: {
      name: 'Jason Wong',
      phone: '+60 19-567-8901',
      email: 'jason@bukitbintangstudios.com',
      image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150'
    },
    featured: false,
    listedDate: '2025-01-02'
  },
  {
    id: '22',
    title: 'Terrace in Taman Tun Dr Ismail',
    location: 'TTDI, Kuala Lumpur',
    price: 1400000,
    type: 'house',
    bedrooms: 4,
    bathrooms: 3,
    sqft: 2800,
    images: [
      'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    description: 'Renovated terrace house in prestigious TTDI with modern fittings and mature neighborhood.',
    amenities: ['Renovated', 'Near International School', 'Park Nearby', 'Established Area'],
    agent: {
      name: 'Melissa Chong',
    phone: '+60 13-678-9012',
      email: 'melissa@ttdiproperties.com',
      image: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=150'
    },
    featured: true,
    listedDate: '2025-01-01'
  },
  {
    id: '23',
    title: 'Serviced Apartment in Mid Valley',
    location: 'Mid Valley, Kuala Lumpur',
    price: 620000,
    type: 'apartment',
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1050,
    images: [
      'https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    description: 'Fully furnished serviced apartment connected to Mid Valley Megamall with hotel-like amenities.',
    amenities: ['Fully Furnished', 'Mall Connected', 'Housekeeping', 'Concierge', 'Pool'],
    agent: {
      name: 'Robert Lim',
      phone: '+60 14-789-0123',
      email: 'robert@midvalleyserviced.com',
      image: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150'
    },
    featured: false,
    listedDate: '2024-12-31'
  },
  {
    id: '24',
    title: 'Landed Property in Ampang',
    location: 'Ampang, Selangor',
    price: 880000,
    type: 'house',
    bedrooms: 4,
    bathrooms: 3,
    sqft: 2200,
    images: [
      'https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    description: 'Double-storey terrace in Ampang with hill views and easy access to city center.',
    amenities: ['Hill View', 'Near LRT', 'Shopping Complex', 'Schools Nearby'],
    agent: {
      name: 'Nurul Ain',
      phone: '+60 15-890-1234',
      email: 'nurul@ampangproperties.com',
      image: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150'
    },
    featured: false,
    listedDate: '2024-12-30'
  },
  {
    id: '25',
    title: 'New Launch Condo in Setia Alam',
    location: 'Setia Alam, Selangor',
    price: 520000,
    type: 'condo',
    bedrooms: 3,
    bathrooms: 2,
    sqft: 1150,
    images: [
      'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    description: 'Brand new condominium in integrated township with comprehensive facilities and green environment.',
    amenities: ['New Launch', 'Green Township', 'Club House', 'Jogging Track', 'Retail Shops'],
    agent: {
      name: 'Steven Tan',
      phone: '+60 16-901-2345',
      email: 'steven@setiaalamcondo.com',
      image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150'
    },
    featured: true,
    listedDate: '2024-12-29'
  },
  {
    id: '26',
    title: 'Affordable House in Kajang',
    location: 'Kajang, Selangor',
    price: 380000,
    type: 'house',
    bedrooms: 3,
    bathrooms: 2,
    sqft: 1400,
    images: [
      'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    description: 'Affordable single-storey terrace house in Kajang with good potential for renovation.',
    amenities: ['Affordable', 'Near Town', 'Public Transport', 'Market Nearby'],
    agent: {
      name: 'Muthu Krishnan',
      phone: '+60 17-012-3456',
      email: 'muthu@kajangaffordable.com',
      image: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150'
    },
    featured: false,
    listedDate: '2024-12-28'
  }
];