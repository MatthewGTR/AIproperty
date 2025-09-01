import React from 'react';
import { MapPin, Bed, Bath, Square, Heart, MessageCircle } from 'lucide-react';
import { Property } from '../types/Property';

interface PropertyListingsProps {
  properties: Property[];
  onPropertyClick: (property: Property) => void;
}

const PropertyListings: React.FC<PropertyListingsProps> = ({ properties, onPropertyClick }) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'decimal',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatPriceRM = (price: number) => {
    return `RM${formatPrice(price)}`;
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Featured Properties</h2>
        <p className="text-gray-600">{properties.length} properties found</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {properties.map((property) => (
          <div
            key={property.id}
            className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer transform hover:scale-105"
            onClick={() => onPropertyClick(property)}
          >
            <div className="relative">
              <img
                src={property.images[0]}
                alt={property.title}
                className="w-full h-64 object-cover"
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

            <div className="p-6">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-semibold text-gray-900 line-clamp-1">{property.title}</h3>
                <span className="text-2xl font-bold text-blue-600">{formatPriceRM(property.price)}</span>
              </div>

              <div className="flex items-center text-gray-600 mb-4">
                <MapPin className="h-4 w-4 mr-1" />
                <span className="text-sm">{property.location}</span>
              </div>

              <div className="flex items-center justify-between text-gray-600 mb-4">
                <div className="flex items-center">
                  <Bed className="h-4 w-4 mr-1" />
                  <span className="text-sm mr-4">{property.bedrooms} bed</span>
                </div>
                <div className="flex items-center">
                  <Bath className="h-4 w-4 mr-1" />
                  <span className="text-sm mr-4">{property.bathrooms} bath</span>
                </div>
                <div className="flex items-center">
                  <Square className="h-4 w-4 mr-1" />
                  <span className="text-sm">{property.sqft.toLocaleString()} sqft</span>
                </div>
              </div>

              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{property.description}</p>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <img
                    src={property.agent.image}
                    alt={property.agent.name}
                    className="w-8 h-8 rounded-full mr-2"
                  />
                  <span className="text-sm font-medium text-gray-700">{property.agent.name}</span>
                </div>
                <button className="flex items-center text-blue-600 hover:text-blue-700 transition-colors duration-200">
                  <MessageCircle className="h-4 w-4 mr-1" />
                  <span className="text-sm">Contact</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {properties.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Search className="h-16 w-16 mx-auto" />
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No properties found</h3>
          <p className="text-gray-600">Try adjusting your search filters to see more results.</p>
        </div>
      )}
    </section>
  );
};

export default PropertyListings;