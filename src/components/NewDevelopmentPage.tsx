import React, { useState } from 'react';
import { X, MapPin, Calendar, Building, Users, Star, Phone, Mail, MessageCircle, Search, Filter } from 'lucide-react';

interface NewDevelopment {
  id: string;
  name: string;
  developer: string;
  location: string;
  launchDate: string;
  completionDate: string;
  totalUnits: number;
  priceRange: {
    min: number;
    max: number;
  };
  unitTypes: string[];
  images: string[];
  description: string;
  amenities: string[];
  highlights: string[];
  status: 'Coming Soon' | 'Launching' | 'Selling' | 'Nearly Sold Out';
  agent: {
    name: string;
    phone: string;
    email: string;
    image: string;
    company: string;
  };
  featured: boolean;
}

interface NewDevelopmentPageProps {
  onClose: () => void;
  user: { id: string; name: string; email: string; userType: string; credits: number } | null;
}

const NewDevelopmentPage: React.FC<NewDevelopmentPageProps> = ({ onClose, user }) => {
  const [selectedDevelopment, setSelectedDevelopment] = useState<NewDevelopment | null>(null);

  const newDevelopments: NewDevelopment[] = [
    {
      id: 'nd1',
      name: 'Tropez Residences',
      developer: 'UEM Sunrise Berhad',
      location: 'Danga Bay, Johor Bahru',
      launchDate: '2025-03-15',
      completionDate: '2028-12-31',
      totalUnits: 438,
      priceRange: {
        min: 580000,
        max: 1200000
      },
      unitTypes: ['Studio', '1+1 Bedroom', '2 Bedroom', '3 Bedroom'],
      images: [
        'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      description: 'Tropez Residences is a premium waterfront development offering stunning sea views and resort-style living. Located at Danga Bay with direct access to the waterfront promenade and close proximity to Singapore.',
      amenities: ['Infinity Pool', 'Sky Gym', 'Waterfront Promenade', 'Clubhouse', 'BBQ Area', 'Children Playground', '24hr Security', 'Covered Parking'],
      highlights: ['Sea View', 'Waterfront Living', 'Near Singapore', 'Resort Facilities', 'Investment Potential'],
      status: 'Launching',
      agent: {
        name: 'Jennifer Lim',
        phone: '+60 12-345-6789',
        email: 'jennifer@uemsunrise.com',
        image: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=150',
        company: 'UEM Sunrise Sales Team'
      },
      featured: true
    },
    {
      id: 'nd2',
      name: 'Medini Signature',
      developer: 'Iskandar Investment Berhad',
      location: 'Medini, Iskandar Puteri',
      launchDate: '2025-02-20',
      completionDate: '2029-06-30',
      totalUnits: 650,
      priceRange: {
        min: 450000,
        max: 950000
      },
      unitTypes: ['1 Bedroom', '2 Bedroom', '3 Bedroom', 'Duplex'],
      images: [
        'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      description: 'Medini Signature represents modern urban living in the heart of Iskandar Malaysia. Smart home technology meets contemporary design with excellent connectivity to Legoland and Premium Outlets.',
      amenities: ['Smart Home System', 'Rooftop Garden', 'Co-working Space', 'Gym & Yoga Studio', 'Swimming Pool', 'Retail Podium', 'EV Charging', 'Shuttle Service'],
      highlights: ['Smart Home', 'Near Legoland', 'Modern Design', 'Investment Hub', 'Integrated Development'],
      status: 'Coming Soon',
      agent: {
        name: 'Ahmad Zulkifli',
        phone: '+60 17-234-5678',
        email: 'ahmad@iskandarinvest.com',
        image: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150',
        company: 'Iskandar Investment Sales'
      },
      featured: true
    },
    {
      id: 'nd3',
      name: 'Austin Heights Residences',
      developer: 'Austin Land & Property',
      location: 'Mount Austin, Johor Bahru',
      launchDate: '2025-04-10',
      completionDate: '2028-08-31',
      totalUnits: 288,
      priceRange: {
        min: 750000,
        max: 1800000
      },
      unitTypes: ['2 Bedroom', '3 Bedroom', '4 Bedroom', 'Penthouse'],
      images: [
        'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      description: 'Austin Heights Residences offers luxury hillside living with panoramic city views. Located in prestigious Mount Austin area with exclusive amenities and premium finishes throughout.',
      amenities: ['Infinity Pool', 'Sky Lounge', 'Private Lift Lobby', 'Concierge Service', 'Wine Cellar', 'Private Dining', 'Valet Parking', 'Spa & Wellness'],
      highlights: ['City Views', 'Luxury Living', 'Prestigious Location', 'Premium Finishes', 'Exclusive Amenities'],
      status: 'Selling',
      agent: {
        name: 'Catherine Wong',
        phone: '+60 16-345-6789',
        email: 'catherine@austinland.com',
        image: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150',
        company: 'Austin Land Sales Team'
      },
      featured: true
    },
    {
      id: 'nd4',
      name: 'Eco Sanctuary',
      developer: 'EcoWorld Development',
      location: 'Eco Botanic, Iskandar Puteri',
      launchDate: '2025-05-25',
      completionDate: '2029-03-31',
      totalUnits: 520,
      priceRange: {
        min: 520000,
        max: 1100000
      },
      unitTypes: ['1+1 Bedroom', '2 Bedroom', '3 Bedroom', '3+1 Bedroom'],
      images: [
        'https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      description: 'Eco Sanctuary embraces sustainable living with green building features and lush landscaping. Part of the award-winning Eco Botanic township with integrated lifestyle amenities.',
      amenities: ['Green Building', 'Botanical Gardens', 'Eco Park', 'Solar Panels', 'Rainwater Harvesting', 'Cycling Tracks', 'Organic Garden', 'Wellness Center'],
      highlights: ['Sustainable Living', 'Green Technology', 'Award-winning Township', 'Nature Integration', 'Eco-friendly'],
      status: 'Coming Soon',
      agent: {
        name: 'David Tan',
        phone: '+60 19-456-7890',
        email: 'david@ecoworld.my',
        image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
        company: 'EcoWorld Sales Gallery'
      },
      featured: false
    },
    {
      id: 'nd5',
      name: 'Puteri Harbour Residences',
      developer: 'UMLand Berhad',
      location: 'Puteri Harbour, Iskandar Puteri',
      launchDate: '2025-06-15',
      completionDate: '2028-11-30',
      totalUnits: 380,
      priceRange: {
        min: 680000,
        max: 1500000
      },
      unitTypes: ['2 Bedroom', '3 Bedroom', '4 Bedroom', 'Sky Villa'],
      images: [
        'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      description: 'Puteri Harbour Residences offers waterfront luxury living with marina views and yacht club access. Located in the prestigious Puteri Harbour precinct with international schools and shopping.',
      amenities: ['Marina Views', 'Yacht Club Access', 'Infinity Pool', 'Tennis Court', 'Kids Club', 'Function Rooms', 'Jogging Track', 'Waterfront Dining'],
      highlights: ['Marina Living', 'Yacht Club', 'International Schools', 'Waterfront Views', 'Luxury Lifestyle'],
      status: 'Nearly Sold Out',
      agent: {
        name: 'Michelle Loh',
        phone: '+60 15-567-8901',
        email: 'michelle@umland.com',
        image: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=150',
        company: 'UMLand Sales Team'
      },
      featured: true
    }
  ];

  const formatPrice = (price: number) => {
    return `RM${price.toLocaleString()}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Coming Soon': return 'bg-blue-100 text-blue-800';
      case 'Launching': return 'bg-green-100 text-green-800';
      case 'Selling': return 'bg-orange-100 text-orange-800';
      case 'Nearly Sold Out': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center shadow-sm z-40">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">New Developments</h1>
          <p className="text-gray-600">Discover upcoming and launching projects in Johor Bahru</p>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
        >
          <X className="h-6 w-6 text-gray-600" />
        </button>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-gray-50 px-6 py-4 sticky top-[88px] z-30">
        <div className="max-w-4xl mx-auto flex space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search new developments in Johor Bahru..."
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button className="flex items-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200">
            <Filter className="h-5 w-5 mr-2 text-gray-600" />
            <span>Filter</span>
          </button>
        </div>
      </div>

      {/* Developments Grid */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-6 flex justify-between items-center">
          <p className="text-gray-600">{newDevelopments.length} new developments found in Johor Bahru</p>
          <div className="flex space-x-2">
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>Sort by Launch Date</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Completion Date</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {newDevelopments.map((development) => (
            <div
              key={development.id}
              className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
              onClick={() => setSelectedDevelopment(development)}
            >
              {/* Development Image */}
              <div className="relative">
                <img
                  src={development.images[0]}
                  alt={development.name}
                  className="w-full h-64 object-cover"
                />
                <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(development.status)}`}>
                  {development.status}
                </div>
                {development.featured && (
                  <div className="absolute top-4 right-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Featured
                  </div>
                )}
              </div>

              {/* Development Details */}
              <div className="p-6">
                <div className="mb-4">
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">{development.name}</h3>
                  <p className="text-blue-600 font-medium mb-2">by {development.developer}</p>
                  <div className="flex items-center text-gray-600 mb-3">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span className="text-sm">{development.location}</span>
                  </div>
                  <div className="text-2xl font-bold text-purple-600">
                    {formatPrice(development.priceRange.min)} - {formatPrice(development.priceRange.max)}
                  </div>
                </div>

                {/* Key Info */}
                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>Launch: {new Date(development.launchDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Building className="h-4 w-4 mr-2" />
                    <span>{development.totalUnits} units</span>
                  </div>
                </div>

                {/* Unit Types */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {development.unitTypes.map((type) => (
                      <span key={type} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                        {type}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{development.description}</p>

                {/* Highlights */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {development.highlights.slice(0, 3).map((highlight) => (
                      <div key={highlight} className="flex items-center px-2 py-1 bg-blue-50 text-blue-700 rounded-lg">
                        <Star className="h-3 w-3 mr-1" />
                        <span className="text-xs font-medium">{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Agent Info */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-center">
                    <img
                      src={development.agent.image}
                      alt={development.agent.name}
                      className="w-10 h-10 rounded-full mr-3"
                    />
                    <div>
                      <div className="text-sm font-medium text-gray-900">{development.agent.name}</div>
                      <div className="text-xs text-gray-600">{development.agent.company}</div>
                    </div>
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
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Interested in New Developments?</h3>
            <p className="text-purple-100 mb-6">Get early bird pricing and exclusive previews. Our AI assistant can help you find the perfect new development based on your investment goals and preferences.</p>
            <button 
              onClick={onClose}
              className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-purple-50 transition-colors duration-200"
            >
              Ask Our AI Assistant
            </button>
          </div>
        </div>
      </div>

      {/* Development Details Modal */}
      {selectedDevelopment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">{selectedDevelopment.name}</h2>
              <button
                onClick={() => setSelectedDevelopment(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <X className="h-5 w-5 text-gray-600" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <img
                  src={selectedDevelopment.images[0]}
                  alt={selectedDevelopment.name}
                  className="lg:col-span-2 w-full h-64 lg:h-80 object-cover rounded-xl"
                />
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Developer</h3>
                    <p className="text-blue-600 font-medium">{selectedDevelopment.developer}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Price Range</h3>
                    <p className="text-2xl font-bold text-purple-600">
                      {formatPrice(selectedDevelopment.priceRange.min)} - {formatPrice(selectedDevelopment.priceRange.max)}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Status</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(selectedDevelopment.status)}`}>
                      {selectedDevelopment.status}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Project Details</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Launch Date:</span>
                        <span className="font-medium">{new Date(selectedDevelopment.launchDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Completion:</span>
                        <span className="font-medium">{new Date(selectedDevelopment.completionDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Units:</span>
                        <span className="font-medium">{selectedDevelopment.totalUnits}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Location:</span>
                        <span className="font-medium">{selectedDevelopment.location}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Unit Types</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedDevelopment.unitTypes.map((type) => (
                        <span key={type} className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium">
                          {type}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Description</h3>
                    <p className="text-gray-600 leading-relaxed">{selectedDevelopment.description}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Amenities</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {selectedDevelopment.amenities.map((amenity) => (
                        <div key={amenity} className="flex items-center p-3 bg-gray-50 rounded-lg">
                          <span className="text-blue-500 mr-2">✓</span>
                          <span className="text-sm text-gray-700">{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Sales Team</h3>
                    <div className="flex items-center mb-4">
                      <img
                        src={selectedDevelopment.agent.image}
                        alt={selectedDevelopment.agent.name}
                        className="w-16 h-16 rounded-full mr-4"
                      />
                      <div>
                        <h4 className="font-semibold text-gray-900">{selectedDevelopment.agent.name}</h4>
                        <p className="text-sm text-gray-600">{selectedDevelopment.agent.company}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <button className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
                        <Phone className="h-4 w-4 mr-2" />
                        Call {selectedDevelopment.agent.phone}
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
                  
                  <div className="mt-6 bg-purple-50 rounded-xl p-6">
                    <h4 className="font-semibold text-purple-900 mb-2">Key Highlights</h4>
                    <div className="space-y-2">
                      {selectedDevelopment.highlights.map((highlight) => (
                        <div key={highlight} className="flex items-center text-purple-700">
                          <Star className="h-4 w-4 mr-2" />
                          <span className="text-sm">{highlight}</span>
                        </div>
                      ))}
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

export default NewDevelopmentPage;