import React, { useState } from 'react';
import { MapPin, Bed, Bath, Square, Heart, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { buyPropertiesData } from './BuyPropertiesData';

interface BuyPageProps {
  user: { id: string; name: string; email: string; userType: string; credits: number } | null;
}

const BuyPage: React.FC<BuyPageProps> = ({ user }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState<{ [key: string]: number }>({});

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

        <div className="space-y-6">
          {filteredProperties.length === 0 ? (
            <div className="text-center py-12">
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
                  {property.featured && (
                    <div className="absolute top-0 left-0 right-0 h-[15%] bg-gradient-to-br from-amber-400 via-orange-500 to-pink-500 z-10 flex items-center justify-center">
                      <div className="flex items-center space-x-2">
                        <span className="text-white font-bold text-base drop-shadow-lg">✨ FEATURED PROPERTY ✨</span>
                      </div>
                    </div>
                  )}
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
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                    >
                      <Heart className="h-5 w-5 text-gray-600" />
                    </button>
                  </div>

                  <div className="text-3xl font-bold text-blue-600 mb-4">
                    {formatPrice(property.price)}
                  </div>

                  <div className="flex items-center gap-6 text-gray-600 mb-4">
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

                  <p className="text-gray-600 mb-4 line-clamp-2">{property.description}</p>

                  <div className="mt-auto">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePropertyClick(property.id);
                      }}
                      className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
                    >
                      View Full Details
                    </button>
                  </div>
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
