import React from 'react';
import { X, MapPin, Bed, Bath, Square, Phone, Mail, MessageCircle, Wifi, Car, Dumbbell } from 'lucide-react';

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
  onClose: () => void;
  user: { name: string; email: string } | null;
}

const RentPage: React.FC<RentPageProps> = ({ onClose, user }) => {
  const rentalProperties: RentalProperty[] = [
    {
      id: 'r1',
      title: 'Luxury 3BR Condo - KLCC View',
      location: 'KLCC, Kuala Lumpur',
      monthlyRent: 4500,
      deposit: '2 months + 1 month advance',
      type: 'condo',
      bedrooms: 3,
      bathrooms: 2,
      sqft: 1400,
      images: ['https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800'],
      description: 'Stunning 3-bedroom condominium with panoramic KLCC and city skyline views. Located in prestigious tower with world-class facilities including infinity pool, sky gym, and concierge services.',
      amenities: ['KLCC View', 'Infinity Pool', 'Gym', 'Concierge', 'Security', 'Parking'],
      furnished: 'Fully Furnished',
      availability: 'Available Now',
      agent: {
        name: 'Ahmad Rahman',
        phone: '+60 12-345-6789',
        email: 'ahmad@malaysiarealty.com',
        image: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150'
      }
    },
    {
      id: 'r2',
      title: 'Modern 2BR Apartment - Mont Kiara',
      location: 'Mont Kiara, Kuala Lumpur',
      monthlyRent: 3200,
      deposit: '2 months + 1 month advance',
      type: 'apartment',
      bedrooms: 2,
      bathrooms: 2,
      sqft: 1100,
      images: ['https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg?auto=compress&cs=tinysrgb&w=800'],
      description: 'Contemporary 2-bedroom apartment in expat-friendly Mont Kiara. Walking distance to international schools, shopping malls, and restaurants. Perfect for professionals and families.',
      amenities: ['Swimming Pool', 'Gym', 'Playground', 'Security', 'Near International School', 'Shopping Mall'],
      furnished: 'Fully Furnished',
      availability: 'Available from Feb 1st',
      agent: {
        name: 'Michelle Chen',
        phone: '+60 15-444-5555',
        email: 'michelle@premiumrentals.my',
        image: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150'
      }
    },
    {
      id: 'r3',
      title: 'Cozy Studio - Bukit Bintang',
      location: 'Bukit Bintang, Kuala Lumpur',
      monthlyRent: 1800,
      deposit: '2 months + 1 month advance',
      type: 'studio',
      bedrooms: 1,
      bathrooms: 1,
      sqft: 550,
      images: ['https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800'],
      description: 'Stylish studio apartment in the heart of KL\'s entertainment district. Perfect for young professionals who want to be in the center of the action with easy access to nightlife, shopping, and dining.',
      amenities: ['City Center', 'Near Monorail', 'Shopping Malls', 'Restaurants', 'Nightlife', 'WiFi'],
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
      title: 'Family House - Subang Jaya',
      location: 'Subang Jaya, Selangor',
      monthlyRent: 2800,
      deposit: '2 months + 1 month advance',
      type: 'house',
      bedrooms: 4,
      bathrooms: 3,
      sqft: 2000,
      images: ['https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=800'],
      description: 'Spacious double-storey terrace house in established Subang Jaya neighborhood. Perfect for families with children, featuring a private garden and close to reputable schools and shopping centers.',
      amenities: ['Private Garden', 'Parking', 'Near Schools', 'Shopping Mall', 'Playground', 'Security'],
      furnished: 'Partially Furnished',
      availability: 'Available from Jan 15th',
      agent: {
        name: 'David Wong',
        phone: '+60 14-333-4444',
        email: 'david@familyrentals.my',
        image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150'
      }
    },
    {
      id: 'r5',
      title: 'Serviced Apartment - Cyberjaya',
      location: 'Cyberjaya, Selangor',
      monthlyRent: 2200,
      deposit: '1 month + 1 month advance',
      type: 'apartment',
      bedrooms: 2,
      bathrooms: 2,
      sqft: 900,
      images: ['https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800'],
      description: 'Modern serviced apartment in Malaysia\'s tech hub. Ideal for IT professionals and entrepreneurs with high-speed internet, co-working spaces, and smart home features. Hotel-like services included.',
      amenities: ['High Speed Internet', 'Co-working Space', 'Housekeeping', 'Smart Home', 'Gym', 'Business Center'],
      furnished: 'Fully Furnished',
      availability: 'Available Now',
      agent: {
        name: 'Lisa Tan',
        phone: '+60 17-666-7777',
        email: 'lisa@servicedapartments.my',
        image: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=150'
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
    'KLCC View': <span className="text-green-500">🏙️</span>,
    'City View': <span className="text-green-500">🏙️</span>,
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-7xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center rounded-t-2xl">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Properties for Rent</h2>
            <p className="text-gray-600">Find your perfect rental home in Malaysia</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <X className="h-6 w-6 text-gray-600" />
          </button>
        </div>

        {/* Properties Grid */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {rentalProperties.map((property) => (
              <div key={property.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-300">
                {/* Property Image */}
                <div className="relative">
                  <img
                    src={property.images[0]}
                    alt={property.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 left-4 bg-emerald-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    For Rent
                  </div>
                  <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {property.furnished}
                  </div>
                </div>

                {/* Property Details */}
                <div className="p-5">
                  <div className="mb-3">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{property.title}</h3>
                    <div className="flex items-center text-gray-600 mb-2">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span className="text-sm">{property.location}</span>
                    </div>
                    <div className="text-2xl font-bold text-emerald-600">{formatRent(property.monthlyRent)}</div>
                    <div className="text-sm text-gray-500">{property.deposit}</div>
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
                      <span className="text-sm">{property.sqft} sqft</span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{property.description}</p>

                  {/* Amenities */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {property.amenities.slice(0, 4).map((amenity) => (
                        <div key={amenity} className="flex items-center px-2 py-1 bg-gray-100 rounded-lg">
                          {amenityIcons[amenity] || <span className="text-blue-500">✓</span>}
                          <span className="ml-1 text-xs text-gray-700">{amenity}</span>
                        </div>
                      ))}
                      {property.amenities.length > 4 && (
                        <div className="px-2 py-1 bg-gray-100 rounded-lg">
                          <span className="text-xs text-gray-700">+{property.amenities.length - 4} more</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Availability */}
                  <div className="mb-4 p-2 bg-green-50 rounded-lg">
                    <span className="text-sm font-medium text-green-800">{property.availability}</span>
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
            ))}
          </div>

          {/* Call to Action */}
          <div className="mt-8 text-center">
            <div className="bg-gradient-to-r from-blue-600 to-emerald-600 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Looking for Something Specific?</h3>
              <p className="text-blue-100 mb-6">Our AI assistant can help you find the perfect rental property based on your budget, location preferences, and lifestyle needs.</p>
              <button 
                onClick={onClose}
                className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors duration-200"
              >
                Ask Our AI Assistant
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RentPage;