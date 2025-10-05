import React, { useState } from 'react';
import { X, MapPin, Bed, Bath, Square, Heart, Phone, Mail, MessageCircle, Car, Wifi, Dumbbell, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface RentalProperty {
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

interface RentPageProps {
  user: { id: string; name: string; email: string; userType: string; credits: number } | null;
}

const RentPage: React.FC<RentPageProps> = ({ user }) => {
  const navigate = useNavigate();
  const [selectedProperty, setSelectedProperty] = useState<RentalProperty | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState<{ [key: string]: number }>({});
  const [likedProperties, setLikedProperties] = useState<Set<string>>(new Set());

  const rentalProperties: RentalProperty[] = [
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
      description: 'Brand new condominium in Medini Iskandar development with smart home features. Close to Legoland, Premium Outlets, and EduCity. Perfect for modern living.',
      amenities: ['New Launch', 'Smart Home', 'Near Legoland', 'Premium Outlets', 'EduCity'],
      furnished: 'Fully Furnished',
      availability: 'Available from Jan 20th',
      agent: {
        name: 'Amy Ng',
        phone: '+60 19-888-9999',
        email: 'amy@medinirentals.com',
        image: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150'
      }
    }
  ];

  const formatRent = (rent: number) => {
    return `RM${rent.toLocaleString()}/month`;
  };

  const amenityIcons: { [key: string]: React.ReactNode } = {
    'Gym': <Dumbbell className="h-4 w-4" />,
    'WiFi': <Wifi className="h-4 w-4" />,
    'High Speed Internet': <Wifi className="h-4 w-4" />,
    'Parking': <Car className="h-4 w-4" />,
    'Swimming Pool': <span className="text-blue-500">🏊</span>,
    'Infinity Pool': <span className="text-blue-500">🏊</span>,
    'Security': <span className="text-red-500">🔒</span>,
    'City View': <span className="text-green-500">🏙️</span>,
    'Golf Course View': <span className="text-green-500">⛳</span>,
  };

  const getCurrentImageIndex = (propertyId: string) => {
    return currentImageIndex[propertyId] || 0;
  };

  const handleNextImage = (e: React.MouseEvent, propertyId: string, totalImages: number) => {
    e.stopPropagation();
    setCurrentImageIndex(prev => ({
      ...prev,
      [propertyId]: ((prev[propertyId] || 0) + 1) % totalImages
    }));
  };

  const handlePrevImage = (e: React.MouseEvent, propertyId: string, totalImages: number) => {
    e.stopPropagation();
    setCurrentImageIndex(prev => ({
      ...prev,
      [propertyId]: ((prev[propertyId] || 0) - 1 + totalImages) % totalImages
    }));
  };

  const handleLike = (e: React.MouseEvent, propertyId: string) => {
    e.stopPropagation();
    setLikedProperties(prev => {
      const newLiked = new Set(prev);
      if (newLiked.has(propertyId)) {
        newLiked.delete(propertyId);
      } else {
        newLiked.add(propertyId);
      }
      return newLiked;
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-white border-b border-gray-200 px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Properties for Rent</h1>
          <p className="text-gray-600 text-lg">Find your perfect rental home in Johor Bahru</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-gray-50 px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search rental properties in Johor Bahru..."
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Properties Grid */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-6 flex justify-between items-center">
          <p className="text-gray-600">{rentalProperties.length} rental properties found in Johor Bahru</p>
          <div className="flex space-x-2">
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>Sort by Rent</option>
              <option>Rent: Low to High</option>
              <option>Rent: High to Low</option>
              <option>Newest First</option>
            </select>
          </div>
        </div>

        <div className="space-y-6">
          {rentalProperties.map((property) => (
            <div
              key={property.id}
              className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
              onClick={() => setSelectedProperty(property)}
            >
              <div className="flex flex-col md:flex-row">
                <div className="md:w-2/5 relative">
                  <div className="flex gap-1">
                    <div className="w-2/3 relative aspect-[4/3]">
                      <img
                        src={property.images[getCurrentImageIndex(property.id)]}
                        alt={`${property.title} - Main Image`}
                        className="w-full h-full object-cover rounded-l-lg"
                      />
                      {property.images.length > 1 && (
                        <>
                          <button
                            onClick={(e) => handlePrevImage(e, property.id, property.images.length)}
                            className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 bg-white/90 rounded-full shadow-lg hover:bg-white transition-colors duration-200"
                          >
                            <ChevronLeft className="h-4 w-4 text-gray-800" />
                          </button>
                          <button
                            onClick={(e) => handleNextImage(e, property.id, property.images.length)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-white/90 rounded-full shadow-lg hover:bg-white transition-colors duration-200"
                          >
                            <ChevronRight className="h-4 w-4 text-gray-800" />
                          </button>
                          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/50 text-white px-2 py-1 rounded text-xs">
                            {getCurrentImageIndex(property.id) + 1} / {property.images.length}
                          </div>
                        </>
                      )}
                    </div>
                    <div className="w-1/3 flex flex-col gap-1">
                      <div className="flex-1 relative aspect-square">
                        <img
                          src={property.images[(getCurrentImageIndex(property.id) + 1) % property.images.length]}
                          alt={`${property.title} - Thumbnail 1`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 relative aspect-square">
                        <img
                          src={property.images[(getCurrentImageIndex(property.id) + 2) % property.images.length]}
                          alt={`${property.title} - Thumbnail 2`}
                          className="w-full h-full object-cover rounded-tr-lg"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="absolute top-4 left-4 bg-emerald-500 text-white px-3 py-1 rounded-full text-sm font-semibold z-10">
                    For Rent
                  </div>
                  <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold z-10">
                    {property.furnished}
                  </div>
                </div>

                <div className="md:w-3/5 p-6 flex flex-col">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{property.title}</h3>
                      <div className="flex items-center text-gray-600 mb-2">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span className="text-sm">{property.location}</span>
                      </div>
                    </div>
                    <button
                      onClick={(e) => handleLike(e, property.id)}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                    >
                      <Heart className={`h-5 w-5 transition-colors duration-200 ${
                        likedProperties.has(property.id)
                          ? 'fill-red-500 text-red-500'
                          : 'text-gray-600'
                      }`} />
                    </button>
                  </div>

                  <div className="mb-2">
                    <div className="text-3xl font-bold text-emerald-600">{formatRent(property.monthlyRent)}</div>
                    <div className="text-sm text-gray-500">{property.deposit}</div>
                  </div>

                  <div className="flex items-center gap-6 text-gray-600 my-4">
                    <div className="flex items-center">
                      <Bed className="h-5 w-5 mr-2" />
                      <span>{property.bedrooms} Beds</span>
                    </div>
                    <div className="flex items-center">
                      <Bath className="h-5 w-5 mr-2" />
                      <span>{property.bathrooms} Baths</span>
                    </div>
                    <div className="flex items-center">
                      <Square className="h-5 w-5 mr-2" />
                      <span>{property.sqft.toLocaleString()} sqft</span>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-3 line-clamp-2">{property.description}</p>

                  <div className="mb-3 p-2 bg-green-50 rounded-lg inline-block">
                    <span className="text-sm font-medium text-green-800">{property.availability}</span>
                  </div>

                  <div className="mt-auto flex items-center justify-between">
                    <div className="flex items-center">
                      <img
                        src={property.agent.image}
                        alt={property.agent.name}
                        className="w-10 h-10 rounded-full mr-3"
                      />
                      <span className="text-sm font-medium text-gray-700">{property.agent.name}</span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedProperty(property);
                      }}
                      className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors duration-200 font-medium"
                    >
                      View Full Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-emerald-600 to-blue-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Looking for Something Specific?</h3>
            <p className="text-emerald-100 mb-6">Our AI assistant can help you find the perfect rental property based on your budget, location preferences, and lifestyle needs.</p>
            <button
              onClick={() => navigate('/')}
              className="bg-white text-emerald-600 px-6 py-3 rounded-lg font-semibold hover:bg-emerald-50 transition-colors duration-200"
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
                    <div className="text-3xl font-bold text-emerald-600 mb-2">{formatRent(selectedProperty.monthlyRent)}</div>
                    <div className="text-sm text-gray-500 mb-2">{selectedProperty.deposit}</div>
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
                  
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Furnishing</h3>
                    <div className="inline-block px-4 py-2 bg-blue-100 text-blue-800 rounded-lg font-medium">
                      {selectedProperty.furnished}
                    </div>
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
                  <div className="bg-gray-50 rounded-xl p-6 mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Agent</h3>
                    <div className="flex items-center mb-4">
                      <img
                        src={selectedProperty.agent.image}
                        alt={selectedProperty.agent.name}
                        className="w-16 h-16 rounded-full mr-4"
                      />
                      <div>
                        <h4 className="font-semibold text-gray-900">{selectedProperty.agent.name}</h4>
                        <p className="text-sm text-gray-600">Licensed Rental Agent</p>
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

                  <div className="bg-green-50 rounded-xl p-6">
                    <h4 className="font-semibold text-green-900 mb-2">Availability</h4>
                    <p className="text-green-700">{selectedProperty.availability}</p>
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

export default RentPage;