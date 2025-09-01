import React, { useState } from 'react';
import { X, MapPin, Bed, Bath, Square, Heart, Share2, Phone, Mail, MessageCircle, Car, Wifi, Dumbbell } from 'lucide-react';
import { Property } from '../types/Property';

interface PropertyDetailsProps {
  property: Property;
  onClose: () => void;
  user: { name: string; email: string } | null;
}

const PropertyDetails: React.FC<PropertyDetailsProps> = ({ property, onClose, user }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showContactForm, setShowContactForm] = useState(false);
  const [message, setMessage] = useState('');

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'decimal',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatPriceRM = (price: number) => {
    return `RM${formatPrice(price)}`;
  };

  const amenityIcons: { [key: string]: React.ReactNode } = {
    'Gym': <Dumbbell className="h-5 w-5" />,
    'Pool': <span className="text-blue-500">🏊</span>,
    'Parking': <Car className="h-5 w-5" />,
    'Wifi': <Wifi className="h-5 w-5" />,
    'Garden': <span className="text-green-500">🌿</span>,
    'Security System': <span className="text-red-500">🔒</span>,
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      alert(`Message sent to ${property.agent.name}: ${message}`);
      setMessage('');
      setShowContactForm(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">{property.title}</h2>
          <div className="flex items-center space-x-2">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200">
              <Heart className="h-5 w-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200">
              <Share2 className="h-5 w-5 text-gray-600" />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <X className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-6">
          {/* Left Column - Images and Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="relative">
              <img
                src={property.images[currentImageIndex]}
                alt={property.title}
                className="w-full h-96 object-cover rounded-xl"
              />
              {property.images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {property.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                        index === currentImageIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Property Info */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold text-blue-600">{formatPriceRM(property.price)}</span>
                <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-medium">
                  {property.type.charAt(0).toUpperCase() + property.type.slice(1)}
                </span>
              </div>

              <div className="flex items-center text-gray-600">
                <MapPin className="h-5 w-5 mr-2" />
                <span>{property.location}</span>
              </div>

              <div className="flex items-center space-x-6 text-gray-600">
                <div className="flex items-center">
                  <Bed className="h-5 w-5 mr-2" />
                  <span>{property.bedrooms} Bedrooms</span>
                </div>
                <div className="flex items-center">
                  <Bath className="h-5 w-5 mr-2" />
                  <span>{property.bathrooms} Bathrooms</span>
                </div>
                <div className="flex items-center">
                  <Square className="h-5 w-5 mr-2" />
                  <span>{property.sqft.toLocaleString()} sqft</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Description</h3>
              <p className="text-gray-600 leading-relaxed">{property.description}</p>
            </div>

            {/* Amenities */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Amenities</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {property.amenities.map((amenity) => (
                  <div key={amenity} className="flex items-center p-3 bg-gray-50 rounded-lg">
                    {amenityIcons[amenity] || <span className="text-blue-500">✓</span>}
                    <span className="ml-2 text-sm text-gray-700">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Agent and Contact */}
          <div className="space-y-6">
            {/* Agent Card */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Agent</h3>
              <div className="flex items-center mb-4">
                <img
                  src={property.agent.image}
                  alt={property.agent.name}
                  className="w-16 h-16 rounded-full mr-4"
                />
                <div>
                  <h4 className="font-semibold text-gray-900">{property.agent.name}</h4>
                  <p className="text-sm text-gray-600">Licensed Real Estate Agent</p>
                </div>
              </div>

              <div className="space-y-3">
                <button className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
                  <Phone className="h-4 w-4 mr-2" />
                  Call {property.agent.phone}
                </button>
                <button
                  onClick={() => setShowContactForm(!showContactForm)}
                  className="w-full flex items-center justify-center px-4 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors duration-200"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Send Message
                </button>
                <button className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                  <Mail className="h-4 w-4 mr-2" />
                  Email Agent
                </button>
              </div>
            </div>

            {/* Contact Form */}
            {showContactForm && (
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Send a Message</h4>
                {!user ? (
                  <p className="text-gray-600 text-sm mb-4">Please sign in to send messages to agents.</p>
                ) : (
                  <div className="space-y-4">
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="I'm interested in this property..."
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      rows={4}
                    />
                    <button
                      onClick={handleSendMessage}
                      className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    >
                      Send Message
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Property Stats */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h4 className="font-semibold text-gray-900 mb-4">Property Stats</h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Listed Date:</span>
                  <span className="font-medium">{new Date(property.listedDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Property Type:</span>
                  <span className="font-medium capitalize">{property.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Square Feet:</span>
                  <span className="font-medium">{property.sqft.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Price per sqft:</span>
                  <span className="font-medium">RM{Math.round(property.price / property.sqft).toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Schedule Tour */}
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white">
              <h4 className="font-semibold mb-2">Schedule a Tour</h4>
              <p className="text-sm text-orange-100 mb-4">See this property in person</p>
              <button className="w-full bg-white text-orange-600 py-2 rounded-lg font-medium hover:bg-orange-50 transition-colors duration-200">
                Book Tour
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;