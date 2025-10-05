import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Bed, Bath, Square, Heart, Phone, Mail, MessageCircle, Car, Wifi, Dumbbell, ArrowLeft } from 'lucide-react';
import { buyPropertiesData } from './BuyPropertiesData';

const BuyPropertyDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const property = buyPropertiesData.find(p => p.id === id);

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Property Not Found</h2>
          <button
            onClick={() => navigate('/buy')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Properties
          </button>
        </div>
      </div>
    );
  }

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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate('/buy')}
          className="flex items-center text-blue-600 hover:text-blue-700 mb-6 font-medium"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Properties for Sale
        </button>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="p-8">
              <div className="mb-6">
                {property.featured && (
                  <span className="inline-block bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold mb-4">
                    Featured Property
                  </span>
                )}
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{property.title}</h1>
                <div className="flex items-center text-gray-600 mb-4">
                  <MapPin className="h-5 w-5 mr-2" />
                  <span>{property.location}</span>
                </div>
                <div className="text-4xl font-bold text-blue-600 mb-6">
                  {formatPrice(property.price)}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <Bed className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Bedrooms</p>
                  <p className="text-lg font-semibold text-gray-900">{property.bedrooms}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <Bath className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Bathrooms</p>
                  <p className="text-lg font-semibold text-gray-900">{property.bathrooms}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <Square className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Square Feet</p>
                  <p className="text-lg font-semibold text-gray-900">{property.sqft.toLocaleString()}</p>
                </div>
              </div>

              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Description</h2>
                <p className="text-gray-600 leading-relaxed">{property.description}</p>
              </div>

              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Amenities</h2>
                <div className="grid grid-cols-2 gap-3">
                  {property.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center space-x-2 text-gray-700">
                      {amenityIcons[amenity] || <span className="text-blue-500">✓</span>}
                      <span className="text-sm">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-blue-50 rounded-xl p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Contact Agent</h2>
                <div className="flex items-center mb-4">
                  <img
                    src={property.agent.image}
                    alt={property.agent.name}
                    className="w-16 h-16 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900">{property.agent.name}</h3>
                    <p className="text-sm text-gray-600">Licensed Property Agent</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <a
                    href={`tel:${property.agent.phone}`}
                    className="flex items-center justify-center w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    <Phone className="h-5 w-5 mr-2" />
                    Call {property.agent.phone}
                  </a>
                  <a
                    href={`mailto:${property.agent.email}`}
                    className="flex items-center justify-center w-full px-4 py-3 bg-white border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors duration-200"
                  >
                    <Mail className="h-5 w-5 mr-2" />
                    Email Agent
                  </a>
                  <button className="flex items-center justify-center w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200">
                    <MessageCircle className="h-5 w-5 mr-2" />
                    WhatsApp
                  </button>
                </div>
              </div>
            </div>

            <div className="p-8 bg-gray-50">
              <div className="space-y-4">
                {property.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${property.title} - Image ${index + 1}`}
                    className="w-full h-64 object-cover rounded-lg shadow-md"
                  />
                ))}
              </div>
              <button className="mt-6 w-full flex items-center justify-center px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                <Heart className="h-5 w-5 mr-2" />
                Save Property
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-xl p-6 shadow-md">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div>
              <span className="font-semibold">Property Type:</span> {property.type.charAt(0).toUpperCase() + property.type.slice(1)}
            </div>
            <div>
              <span className="font-semibold">Listed:</span> {new Date(property.listedDate).toLocaleDateString()}
            </div>
            <div>
              <span className="font-semibold">Property ID:</span> {property.id.toUpperCase()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyPropertyDetailsPage;
