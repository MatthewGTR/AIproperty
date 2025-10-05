import React, { useState } from 'react';
import { MapPin, Bed, Bath, Square, Heart, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { buyPropertiesData } from './BuyPropertiesData';

interface BuyPageProps {
  user: { id: string; name: string; email: string; userType: string; credits: number } | null;
}

const BuyPage: React.FC<BuyPageProps> = ({ user }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const buyProperties = buyPropertiesData;

  const formatPrice = (price: number) => {
    return `RM${price.toLocaleString()}`;
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

  const handlePropertyClick = (propertyId: string) => {
    navigate(`/buy/${propertyId}`);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-white border-b border-gray-200 px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Properties for Sale</h1>
          <p className="text-gray-600 text-lg">Discover your dream home across Malaysia</p>
        </div>
      </div>

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
              onClick={() => handlePropertyClick(property.id)}
            >
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
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  <Heart className="h-5 w-5 text-gray-600" />
                </button>
              </div>

              <div className="p-5">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{property.title}</h3>
                <div className="flex items-center text-gray-600 mb-3">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="text-sm">{property.location}</span>
                </div>

                <div className="text-2xl font-bold text-blue-600 mb-4">
                  {formatPrice(property.price)}
                </div>

                <div className="flex items-center justify-between text-gray-600 text-sm mb-4">
                  <div className="flex items-center">
                    <Bed className="h-4 w-4 mr-1" />
                    <span>{property.bedrooms} Beds</span>
                  </div>
                  <div className="flex items-center">
                    <Bath className="h-4 w-4 mr-1" />
                    <span>{property.bathrooms} Baths</span>
                  </div>
                  <div className="flex items-center">
                    <Square className="h-4 w-4 mr-1" />
                    <span>{property.sqft.toLocaleString()} sqft</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePropertyClick(property.id);
                    }}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          )))}
        </div>
      </div>
    </div>
  );
};

export default BuyPage;
