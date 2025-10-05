import React, { useState } from 'react';
import { MapPin, Bed, Bath, Square, Heart, Phone, Mail, MessageCircle, Car, Wifi, Dumbbell, Search, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface BuyProperty {
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

interface BuyPageProps {
  user: { id: string; name: string; email: string; userType: string; credits: number } | null;
}

const BuyPage: React.FC<BuyPageProps> = ({ user }) => {
  const navigate = useNavigate();
  const [selectedProperty, setSelectedProperty] = useState<BuyProperty | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const buyProperties: BuyProperty[] = [
    {
      id: 'b1',
      title: 'Double Storey Terrace House - Taman Daya',
      location: 'Taman Daya, Johor Bahru',
      price: 450000,
      type: 'house',
      bedrooms: 4,
      bathrooms: 3,
      sqft: 1800,
      images: [
        'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      description: 'Well-maintained double storey terrace house in established residential area. Features spacious living areas, modern kitchen, and private garden. Close to schools and amenities.',
      amenities: ['Garden', 'Parking', 'Near School', 'Shopping Mall Nearby', 'Gated Community'],
      agent: {
        name: 'Siti Nurhaliza',
        phone: '+60 17-234-5678',
        email: 'siti@johorrealty.com',
        image: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150'
      },
      featured: true,
      listedDate: '2025-01-20'
    },
    {
      id: 'b2',
      title: 'Modern Condo - Sutera Avenue',
      location: 'Sutera Utama, Johor Bahru',
      price: 680000,
      type: 'condo',
      bedrooms: 3,
      bathrooms: 2,
      sqft: 1200,
      images: [
        'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      description: 'Contemporary condominium with city views and premium facilities. Located in prime Sutera area with easy access to Singapore. Perfect for investment or own stay.',
      amenities: ['Swimming Pool', 'Gym', 'Security', 'Parking', 'Near CIQ', 'Shopping Mall'],
      agent: {
        name: 'Ahmad Rahman',
        phone: '+60 12-345-6789',
        email: 'ahmad@suterarealty.com',
        image: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150'
      },
      featured: true,
      listedDate: '2025-01-19'
    },
    {
      id: 'b3',
      title: 'Semi-D House - Taman Molek',
      location: 'Taman Molek, Johor Bahru',
      price: 850000,
      type: 'house',
      bedrooms: 5,
      bathrooms: 4,
      sqft: 2400,
      images: [
        'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      description: 'Spacious semi-detached house in prestigious Taman Molek. Features large living spaces, modern renovations, and beautiful landscaping. Ideal for growing families.',
      amenities: ['Large Garden', 'Renovated', 'Double Garage', 'Near International School', 'Established Area'],
      agent: {
        name: 'Lim Wei Chong',
        phone: '+60 16-789-0123',
        email: 'lim@molekproperties.com',
        image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150'
      },
      featured: true,
      listedDate: '2025-01-18'
    },
    {
      id: 'b4',
      title: 'Apartment - Taman Century',
      location: 'Taman Century, Johor Bahru',
      price: 320000,
      type: 'apartment',
      bedrooms: 3,
      bathrooms: 2,
      sqft: 1000,
      images: [
        'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      description: 'Affordable apartment in mature residential area. Well-maintained building with basic amenities. Great for first-time buyers or investment purposes.',
      amenities: ['Parking', 'Near Market', 'Public Transport', 'Schools Nearby', 'Affordable'],
      agent: {
        name: 'Raj Kumar',
        phone: '+60 19-567-8901',
        email: 'raj@centuryflats.com',
        image: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150'
      },
      featured: false,
      listedDate: '2025-01-17'
    },
    {
      id: 'b5',
      title: 'Luxury Condo - Paradigm Mall Area',
      location: 'Skudai, Johor Bahru',
      price: 750000,
      type: 'condo',
      bedrooms: 3,
      bathrooms: 2,
      sqft: 1400,
      images: [
        'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      description: 'Premium condominium near Paradigm Mall with modern facilities and strategic location. Close to universities and shopping centers. Excellent connectivity to major highways.',
      amenities: ['Near Mall', 'Swimming Pool', 'Gym', 'Security', 'Near University', 'Highway Access'],
      agent: {
        name: 'Michelle Tan',
        phone: '+60 15-444-5555',
        email: 'michelle@paradigmproperties.com',
        image: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150'
      },
      featured: true,
      listedDate: '2025-01-16'
    },
    {
      id: 'b6',
      title: 'Terrace House - Taman Universiti',
      location: 'Taman Universiti, Johor Bahru',
      price: 520000,
      type: 'house',
      bedrooms: 4,
      bathrooms: 3,
      sqft: 1600,
      images: [
        'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      description: 'Single storey terrace house in university area. Popular with students and young families. Good rental potential and capital appreciation prospects.',
      amenities: ['Near University', 'Student Area', 'Good Rental Yield', 'Public Transport', 'Food Courts'],
      agent: {
        name: 'David Wong',
        phone: '+60 14-333-4444',
        email: 'david@universitiproperties.com',
        image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150'
      },
      featured: false,
      listedDate: '2025-01-15'
    },
    {
      id: 'b7',
      title: 'High-Rise Condo - City Square Area',
      location: 'City Centre, Johor Bahru',
      price: 580000,
      type: 'condo',
      bedrooms: 2,
      bathrooms: 2,
      sqft: 900,
      images: [
        'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      description: 'Modern high-rise condominium in JB city center. Walking distance to City Square Mall and transportation hubs. Perfect for urban lifestyle enthusiasts.',
      amenities: ['City Center', 'Near Mall', 'Public Transport', 'Restaurants', 'Entertainment', 'Security'],
      agent: {
        name: 'Lisa Tan',
        phone: '+60 17-666-7777',
        email: 'lisa@citysquareproperties.com',
        image: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=150'
      },
      featured: true,
      listedDate: '2025-01-14'
    },
    {
      id: 'b8',
      title: 'Villa - Mount Austin',
      location: 'Mount Austin, Johor Bahru',
      price: 1200000,
      type: 'villa',
      bedrooms: 5,
      bathrooms: 4,
      sqft: 3200,
      images: [
        'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      description: 'Exclusive villa in prestigious Mount Austin area. Features private pool, landscaped garden, and panoramic city views. Premium location with excellent security.',
      amenities: ['Private Pool', 'City View', 'Garden', 'Security', 'Prestigious Area', 'Double Garage'],
      agent: {
        name: 'James Lim',
        phone: '+60 18-777-8888',
        email: 'james@mountaustinvillas.com',
        image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150'
      },
      featured: true,
      listedDate: '2025-01-13'
    },
    {
      id: 'b9',
      title: 'Shophouse - Jalan Wong Ah Fook',
      location: 'Jalan Wong Ah Fook, Johor Bahru',
      price: 950000,
      type: 'house',
      bedrooms: 0,
      bathrooms: 2,
      sqft: 1800,
      images: [
        'https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      description: 'Heritage shophouse in prime commercial area. Ground floor suitable for business, upper floors for residence. Excellent investment opportunity in historic JB.',
      amenities: ['Commercial Use', 'Heritage Building', 'Prime Location', 'High Traffic', 'Investment Potential'],
      agent: {
        name: 'Peter Loh',
        phone: '+60 12-999-0000',
        email: 'peter@heritageproperties.com',
        image: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150'
      },
      featured: false,
      listedDate: '2025-01-12'
    },
    {
      id: 'b10',
      title: 'New Launch Condo - Medini Iskandar',
      location: 'Medini, Iskandar Puteri',
      price: 620000,
      type: 'condo',
      bedrooms: 3,
      bathrooms: 2,
      sqft: 1100,
      images: [
        'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      description: 'Brand new condominium in Medini Iskandar development. Modern design with smart home features. Close to Legoland and premium outlets. Great for investment.',
      amenities: ['New Launch', 'Smart Home', 'Near Legoland', 'Premium Outlets', 'Modern Design', 'Investment'],
      agent: {
        name: 'Rachel Tan',
        phone: '+60 13-000-1111',
        email: 'rachel@mediniproperties.com',
        image: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=150'
      },
      featured: true,
      listedDate: '2025-01-11'
    },
    {
      id: 'b11',
      title: 'KLCC Luxury Condo - Pavilion Residences',
      location: 'KLCC, Kuala Lumpur',
      price: 2800000,
      type: 'condo',
      bedrooms: 4,
      bathrooms: 4,
      sqft: 2500,
      images: [
        'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      description: 'Ultra-luxury condominium in the heart of KLCC. Breathtaking city skyline views, premium finishes, and world-class facilities. Walking distance to Suria KLCC and Petronas Twin Towers.',
      amenities: ['KLCC View', 'Infinity Pool', 'Concierge', 'Gym', 'Security', 'Shopping Mall'],
      agent: {
        name: 'Sophia Chen',
        phone: '+60 12-888-9999',
        email: 'sophia@klccproperties.com',
        image: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150'
      },
      featured: true,
      listedDate: '2025-01-10'
    },
    {
      id: 'b12',
      title: 'Penang Beachfront Villa - Batu Ferringhi',
      location: 'Batu Ferringhi, Penang',
      price: 3500000,
      type: 'villa',
      bedrooms: 6,
      bathrooms: 5,
      sqft: 4500,
      images: [
        'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      description: 'Stunning beachfront villa with direct beach access. Panoramic sea views, private infinity pool, and lush tropical gardens. Perfect for luxury living or holiday retreat.',
      amenities: ['Beachfront', 'Private Pool', 'Sea View', 'Garden', 'Luxury Finishes', 'Double Garage'],
      agent: {
        name: 'Marcus Lim',
        phone: '+60 16-777-6666',
        email: 'marcus@penangvillas.com',
        image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150'
      },
      featured: true,
      listedDate: '2025-01-09'
    },
    {
      id: 'b13',
      title: 'Modern Townhouse - Subang Jaya',
      location: 'Subang Jaya, Selangor',
      price: 890000,
      type: 'house',
      bedrooms: 4,
      bathrooms: 3,
      sqft: 2200,
      images: [
        'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      description: 'Contemporary 3-storey townhouse in prime Subang Jaya location. Modern minimalist design with quality finishes. Close to shopping malls, schools, and public transport.',
      amenities: ['Gated Community', 'Parking', 'Near Mall', 'Near School', 'Modern Design', 'LRT Access'],
      agent: {
        name: 'Emily Tan',
        phone: '+60 17-555-4444',
        email: 'emily@subanghomes.com',
        image: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=150'
      },
      featured: false,
      listedDate: '2025-01-08'
    },
    {
      id: 'b14',
      title: 'Kota Kinabalu Seaview Condo',
      location: 'Tanjung Aru, Kota Kinabalu',
      price: 650000,
      type: 'condo',
      bedrooms: 3,
      bathrooms: 2,
      sqft: 1300,
      images: [
        'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      description: 'Beautiful sea-facing condominium with stunning sunset views over South China Sea. Walking distance to beach and Prince Philip Park. Resort-style facilities.',
      amenities: ['Sea View', 'Near Beach', 'Swimming Pool', 'Gym', 'Security', 'Sunset View'],
      agent: {
        name: 'Daniel Tan',
        phone: '+60 18-333-2222',
        email: 'daniel@kkproperties.com',
        image: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150'
      },
      featured: true,
      listedDate: '2025-01-07'
    },
    {
      id: 'b15',
      title: 'Heritage Shophouse - Georgetown',
      location: 'Georgetown, Penang',
      price: 1800000,
      type: 'house',
      bedrooms: 0,
      bathrooms: 3,
      sqft: 2800,
      images: [
        'https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      description: 'Beautifully restored pre-war shophouse in UNESCO World Heritage zone. Original features preserved with modern amenities added. Prime location in Armenian Street area.',
      amenities: ['Heritage Building', 'Commercial Use', 'Tourist Area', 'UNESCO Zone', 'Investment Potential', 'High Traffic'],
      agent: {
        name: 'Andrew Khoo',
        phone: '+60 12-444-5555',
        email: 'andrew@penangheritage.com',
        image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150'
      },
      featured: true,
      listedDate: '2025-01-06'
    },
    {
      id: 'b16',
      title: 'Shah Alam Lake View Bungalow',
      location: 'Section 7, Shah Alam',
      price: 2200000,
      type: 'house',
      bedrooms: 6,
      bathrooms: 5,
      sqft: 5000,
      images: [
        'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      description: 'Magnificent corner lot bungalow overlooking Section 7 lake. Spacious rooms, beautiful landscaping, and premium renovations. Perfect for large families.',
      amenities: ['Lake View', 'Corner Lot', 'Large Garden', 'Renovated', 'Prestigious Area', 'Triple Garage'],
      agent: {
        name: 'Sarah Lim',
        phone: '+60 19-666-5555',
        email: 'sarah@shahalamelite.com',
        image: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150'
      },
      featured: false,
      listedDate: '2025-01-05'
    },
    {
      id: 'b17',
      title: 'Ipoh Garden Villa - Tambun',
      location: 'Tambun, Ipoh',
      price: 780000,
      type: 'villa',
      bedrooms: 4,
      bathrooms: 3,
      sqft: 2800,
      images: [
        'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      description: 'Tranquil villa nestled in Tambun hills with limestone mountain views. Large garden, koi pond, and peaceful surroundings. Perfect retirement or weekend home.',
      amenities: ['Mountain View', 'Garden', 'Koi Pond', 'Peaceful', 'Near Hot Springs', 'Retirement Haven'],
      agent: {
        name: 'Vincent Lee',
        phone: '+60 15-888-7777',
        email: 'vincent@ipohvillas.com',
        image: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150'
      },
      featured: false,
      listedDate: '2025-01-04'
    },
    {
      id: 'b18',
      title: 'Mont Kiara Serviced Residence',
      location: 'Mont Kiara, Kuala Lumpur',
      price: 1200000,
      type: 'condo',
      bedrooms: 3,
      bathrooms: 3,
      sqft: 1800,
      images: [
        'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      description: 'Premium serviced residence in exclusive Mont Kiara enclave. Fully furnished with designer interiors. Walking distance to international schools and shopping plazas.',
      amenities: ['Fully Furnished', 'International School', 'Shopping Mall', 'Gym', 'Pool', 'Expatriate Area'],
      agent: {
        name: 'Catherine Wong',
        phone: '+60 13-999-8888',
        email: 'catherine@montkiaraproperties.com',
        image: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=150'
      },
      featured: true,
      listedDate: '2025-01-03'
    }
  ];

  const formatPrice = (price: number) => {
    return `RM${price.toLocaleString()}`;
  };

  const amenityIcons: { [key: string]: React.ReactNode } = {
    'Gym': <Dumbbell className="h-4 w-4" />,
    'WiFi': <Wifi className="h-4 w-4" />,
    'Parking': <Car className="h-4 w-4" />,
    'Swimming Pool': <span className="text-blue-500">🏊</span>,
    'Security': <span className="text-red-500">🔒</span>,
    'Garden': <span className="text-green-500">🌿</span>,
  };

  const filteredProperties = buyProperties.filter(property => {
    if (!searchQuery.trim()) return true;

    const query = searchQuery.toLowerCase();
    return (
      property.title.toLowerCase().includes(query) ||
      property.location.toLowerCase().includes(query) ||
      property.type.toLowerCase().includes(query) ||
      property.description.toLowerCase().includes(query)
    );
  });

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-white border-b border-gray-200 px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Properties for Sale</h1>
          <p className="text-gray-600 text-lg">Discover your dream home across Malaysia</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-gray-50 px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by location, property type, or keywords..."
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Properties Grid */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-6 flex justify-between items-center">
          <p className="text-gray-600">{filteredProperties.length} properties found {searchQuery ? `for "${searchQuery}"` : 'across Malaysia'}</p>
          <div className="flex space-x-2">
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>Sort by Price</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Newest First</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 text-lg">No properties found matching your search.</p>
              <button
                onClick={() => setSearchQuery('')}
                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Clear Search
              </button>
            </div>
          ) : (
            filteredProperties.map((property) => (
            <div
              key={property.id}
              className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
              onClick={() => setSelectedProperty(property)}
            >
              {/* Property Image */}
              <div className="relative">
                <img
                  src={property.images[0]}
                  alt={property.title}
                  className="w-full h-48 object-cover"
                />
                {property.featured && (
                  <div className="absolute top-4 left-4 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Featured
                  </div>
                )}
                <button className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors duration-200">
                  <Heart className="h-5 w-5 text-gray-600" />
                </button>
              </div>

              {/* Property Details */}
              <div className="p-5">
                <div className="mb-3">
                  <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1">{property.title}</h3>
                  <div className="flex items-center text-gray-600 mb-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span className="text-sm">{property.location}</span>
                  </div>
                  <div className="text-2xl font-bold text-blue-600">{formatPrice(property.price)}</div>
                </div>

                {/* Property Stats */}
                <div className="flex items-center justify-between text-gray-600 mb-4">
                  <div className="flex items-center">
                    <Bed className="h-4 w-4 mr-1" />
                    <span className="text-sm mr-3">{property.bedrooms} bed</span>
                  </div>
                  <div className="flex items-center">
                    <Bath className="h-4 w-4 mr-1" />
                    <span className="text-sm mr-3">{property.bathrooms} bath</span>
                  </div>
                  <div className="flex items-center">
                    <Square className="h-4 w-4 mr-1" />
                    <span className="text-sm">{property.sqft.toLocaleString()} sqft</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{property.description}</p>

                {/* Amenities */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {property.amenities.slice(0, 3).map((amenity) => (
                      <div key={amenity} className="flex items-center px-2 py-1 bg-gray-100 rounded-lg">
                        {amenityIcons[amenity] || <span className="text-blue-500">✓</span>}
                        <span className="ml-1 text-xs text-gray-700">{amenity}</span>
                      </div>
                    ))}
                    {property.amenities.length > 3 && (
                      <div className="px-2 py-1 bg-gray-100 rounded-lg">
                        <span className="text-xs text-gray-700">+{property.amenities.length - 3} more</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Agent Info */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-center">
                    <img
                      src={property.agent.image}
                      alt={property.agent.name}
                      className="w-8 h-8 rounded-full mr-2"
                    />
                    <span className="text-sm font-medium text-gray-700">{property.agent.name}</span>
                  </div>
                  <div className="flex space-x-2">
                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200">
                      <Phone className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors duration-200">
                      <MessageCircle className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )))}
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-emerald-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Can't Find What You're Looking For?</h3>
            <p className="text-blue-100 mb-6">Our AI assistant can help you find the perfect property based on your specific requirements and budget.</p>
            <button
              onClick={() => navigate('/')}
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors duration-200"
            >
              Ask Our AI Assistant
            </button>
          </div>
        </div>
      </div>

      {/* Property Details Modal */}
      {selectedProperty && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">{selectedProperty.title}</h2>
              <button
                onClick={() => setSelectedProperty(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <X className="h-5 w-5 text-gray-600" />
              </button>
            </div>
            
            <div className="p-6">
              <img
                src={selectedProperty.images[0]}
                alt={selectedProperty.title}
                className="w-full h-64 object-cover rounded-xl mb-6"
              />
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <div className="mb-4">
                    <div className="text-3xl font-bold text-blue-600 mb-2">{formatPrice(selectedProperty.price)}</div>
                    <div className="flex items-center text-gray-600 mb-4">
                      <MapPin className="h-5 w-5 mr-2" />
                      <span>{selectedProperty.location}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-6 text-gray-600 mb-6">
                    <div className="flex items-center">
                      <Bed className="h-5 w-5 mr-2" />
                      <span>{selectedProperty.bedrooms} Bedrooms</span>
                    </div>
                    <div className="flex items-center">
                      <Bath className="h-5 w-5 mr-2" />
                      <span>{selectedProperty.bathrooms} Bathrooms</span>
                    </div>
                    <div className="flex items-center">
                      <Square className="h-5 w-5 mr-2" />
                      <span>{selectedProperty.sqft.toLocaleString()} sqft</span>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Description</h3>
                    <p className="text-gray-600 leading-relaxed">{selectedProperty.description}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Amenities</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {selectedProperty.amenities.map((amenity) => (
                        <div key={amenity} className="flex items-center p-3 bg-gray-50 rounded-lg">
                          {amenityIcons[amenity] || <span className="text-blue-500">✓</span>}
                          <span className="ml-2 text-sm text-gray-700">{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Agent</h3>
                    <div className="flex items-center mb-4">
                      <img
                        src={selectedProperty.agent.image}
                        alt={selectedProperty.agent.name}
                        className="w-16 h-16 rounded-full mr-4"
                      />
                      <div>
                        <h4 className="font-semibold text-gray-900">{selectedProperty.agent.name}</h4>
                        <p className="text-sm text-gray-600">Licensed Real Estate Agent</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <button className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
                        <Phone className="h-4 w-4 mr-2" />
                        Call {selectedProperty.agent.phone}
                      </button>
                      <button className="w-full flex items-center justify-center px-4 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors duration-200">
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Send Message
                      </button>
                      <button className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                        <Mail className="h-4 w-4 mr-2" />
                        Email Agent
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuyPage;