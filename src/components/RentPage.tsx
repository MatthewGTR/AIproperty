import React, { useState } from 'react';
import { MapPin, Bed, Bath, Square, Heart, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { rentPropertiesData, RentalProperty } from './RentPropertiesData';


interface RentPageProps {
  user: { id: string; name: string; email: string; userType: string; credits: number } | null;
}

const RentPage: React.FC<RentPageProps> = ({ user }) => {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState<{ [key: string]: number }>({});
  const [likedProperties, setLikedProperties] = useState<Set<string>>(new Set());

  const rentalProperties = rentPropertiesData;

  const formatRent = (rent: number) => {
    return `RM${rent.toLocaleString()}/month`;
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
              onClick={() => navigate(`/rent/${property.id}`)}
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

    </div>
  );
};

export default RentPage;