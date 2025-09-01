import { Property } from '../types/Property';

export const mockProperties: Property[] = [
  {
    id: '1',
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
    id: '2',
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
    id: '3',
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
    id: '4',
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
    id: '5',
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
    id: '6',
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
    id: '7',
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
    id: '8',
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
    id: '9',
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
    id: '10',
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
    id: '11',
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
    id: '12',
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
    id: '13',
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
    id: '14',
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
    id: '15',
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
    id: '16',
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
    id: '17',
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
    id: '18',
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
    id: '19',
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
    id: '20',
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
  },
  // New Agent Profiles with Properties
  {
    id: '21',
    title: 'Executive Condo in Bangsar',
    location: 'Bangsar, Kuala Lumpur',
    price: 1350000,
    type: 'condo',
    bedrooms: 3,
    bathrooms: 3,
    sqft: 1800,
    images: [
      'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    description: 'Premium executive condominium in trendy Bangsar with city skyline views and upscale amenities.',
    amenities: ['City View', 'Premium Gym', 'Infinity Pool', 'Concierge', 'Wine Storage'],
    agent: {
      name: 'Dr. Amelia Tan',
      phone: '+60 12-888-9999',
      email: 'amelia@eliterealty.my',
      image: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=150'
    },
    featured: true,
    listedDate: '2025-01-17'
  },
  {
    id: '22',
    title: 'Garden Villa in Tropicana',
    location: 'Tropicana, Selangor',
    price: 2200000,
    type: 'villa',
    bedrooms: 5,
    bathrooms: 4,
    sqft: 3800,
    images: [
      'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    ],
    description: 'Cozy studio in the heart of KL entertainment district. Walking distance to shopping and dining.',
    amenities: ['Furnished', 'Near Monorail', 'Shopping Nearby', 'Restaurants'],
    agent: {
      name: 'Sarah Lim',
      phone: '+60 13-222-3333',
      email: 'sarah@cityrentals.my',
      image: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=150'
    },
    featured: false,
    listedDate: '2025-01-19'
  },
  {
    id: '23',
    title: 'Family House for Rent - Subang Jaya',
    location: 'Subang Jaya, Selangor',
    price: 2200,
    type: 'house',
    bedrooms: 4,
    bathrooms: 3,
    sqft: 2000,
    images: [
      'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    description: 'Spacious family home in established neighborhood. Great for families with children.',
    amenities: ['Garden', 'Parking', 'Near Schools', 'Playground'],
    agent: {
      name: 'David Wong',
      phone: '+60 14-333-4444',
      email: 'david@familyrentals.my',
      image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150'
    },
    featured: true,
    listedDate: '2025-01-18'
  },
  {
    id: '24',
    title: 'Modern Condo for Rent - Mont Kiara',
    location: 'Mont Kiara, Kuala Lumpur',
    price: 4200,
    type: 'condo',
    bedrooms: 3,
    bathrooms: 2,
    sqft: 1500,
    images: [
      'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    description: 'Premium condominium in expat-friendly Mont Kiara with excellent facilities.',
    amenities: ['Swimming Pool', 'Gym', 'Tennis Court', 'Security', 'Parking'],
    agent: {
      name: 'Michelle Chen',
      phone: '+60 15-444-5555',
      email: 'michelle@premiumrentals.my',
      image: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150'
    },
    featured: true,
    listedDate: '2025-01-17'
  },
  {
    id: '25',
    title: 'Budget Room for Rent - Cheras',
    location: 'Cheras, Kuala Lumpur',
    price: 600,
    type: 'apartment',
    bedrooms: 1,
    bathrooms: 1,
    sqft: 300,
    images: [
      'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    description: 'Affordable single room for students and young professionals. Near public transport.',
    amenities: ['Furnished', 'Near MRT', 'Shared Kitchen', 'Utilities Included'],
    agent: {
      name: 'Kumar Raj',
      phone: '+60 16-555-6666',
      email: 'kumar@budgetrentals.my',
      image: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150'
    },
    featured: false,
    listedDate: '2025-01-16'
  },
  {
    id: '26',
    title: 'Serviced Apartment for Rent - Cyberjaya',
    location: 'Cyberjaya, Selangor',
    price: 2800,
    type: 'apartment',
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1000,
    images: [
      'https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    description: 'Modern serviced apartment in tech hub with hotel-like amenities and services.',
    amenities: ['Fully Serviced', 'Housekeeping', 'Gym', 'Pool', 'Business Center'],
    agent: {
      name: 'Lisa Tan',
      phone: '+60 17-666-7777',
      email: 'lisa@servicedapartments.my',
      image: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=150'
    },
    featured: true,
    listedDate: '2025-01-15'
  },
  {
    id: '27',
    title: 'Penthouse for Rent - Damansara Heights',
    location: 'Damansara Heights, KL',
    price: 8500,
    type: 'condo',
    bedrooms: 4,
    bathrooms: 3,
    sqft: 2500,
    images: [
      'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    description: 'Luxury penthouse with panoramic city views and premium finishes throughout.',
    amenities: ['City View', 'Private Lift', 'Jacuzzi', 'Wine Cellar', 'Maid Room'],
    agent: {
      name: 'James Lim',
      phone: '+60 18-777-8888',
      email: 'james@luxuryrentals.my',
      image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150'
    },
    featured: true,
    listedDate: '2025-01-14'
  },
  {
    id: '28',
    title: 'Shared House for Rent - Petaling Jaya',
    location: 'Petaling Jaya, Selangor',
    price: 800,
    type: 'house',
    bedrooms: 1,
    bathrooms: 1,
    sqft: 400,
    images: [
      'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    description: 'Room in shared house with common areas. Perfect for students and young professionals.',
    amenities: ['Shared Kitchen', 'WiFi', 'Parking', 'Near LRT'],
    agent: {
      name: 'Amy Ng',
      phone: '+60 19-888-9999',
      email: 'amy@sharedliving.my',
      image: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150'
    },
    featured: false,
    listedDate: '2025-01-13'
  },
  {
    id: '29',
    title: 'Beachfront Condo for Rent - Penang',
    location: 'Batu Ferringhi, Penang',
    price: 3200,
    type: 'condo',
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1100,
    images: [
      'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    description: 'Stunning beachfront condominium with direct beach access and resort facilities.',
    amenities: ['Beach Access', 'Sea View', 'Swimming Pool', 'Restaurant', 'Spa'],
    agent: {
      name: 'Peter Loh',
      phone: '+60 12-999-0000',
      email: 'peter@penangrentals.my',
      image: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150'
    },
    featured: true,
    listedDate: '2025-01-12'
  },
  {
    id: '30',
    title: 'Executive Condo for Rent - Bangsar',
    location: 'Bangsar, Kuala Lumpur',
    price: 4800,
    type: 'condo',
    bedrooms: 3,
    bathrooms: 2,
    sqft: 1400,
    images: [
      'https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    description: 'Executive condominium in trendy Bangsar with easy access to shopping and dining.',
    amenities: ['Furnished', 'Gym', 'Pool', 'Security', 'Shopping Nearby'],
    agent: {
      name: 'Rachel Tan',
      phone: '+60 13-000-1111',
      email: 'rachel@bangsarrentals.my',
      image: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=150'
    },
    featured: false,
    listedDate: '2025-01-11'
  }
];