import React from 'react';
import { MapPin, Bed, Bath, Square, Heart, MessageCircle, Calendar, Tag } from 'lucide-react';
import { PropertyWithImages } from '../services/propertyService';

interface PropertyCardNewProps {
  property: PropertyWithImages;
  onClick: (property: PropertyWithImages) => void;
}

const PropertyCardNew: React.FC<PropertyCardNewProps> = ({ property, onClick }) => {
  const formatPrice = (price: number, listingType: string) => {
    if (listingType === 'rent') {
      return `RM${price.toLocaleString()}/month`;
    }
    return `RM${price.toLocaleString()}`;
  };

  const formatFurnished = (furnished: string | null) => {
    if (!furnished) return '';
    return furnished.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const primaryImage = property.property_images.find(img => img.is_primary)?.image_url || 
                     property.property_images[0]?.image_url || 
                     'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=800';

  return (
    <div
      className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer transform hover:scale-105"
      onClick={() => onClick(property)}
    >
      <div className="relative">
        <img src={primaryImage} alt={property.title} className="w-full h-64 object-cover" />
        
        {/* Listing Type Badge */}
        <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-sm font-semibold ${
          property.listing_type === 'rent' 
            ? 'bg-emerald-500 text-white' 
            : 'bg-blue-500 text-white'
        }`}>
          {property.listing_type === 'rent' ? 'For Rent' : 'For Sale'}
        </div>

        {/* Furnished Badge for Rentals */}
        {property.listing_type === 'rent' && property.furnished && (
          <div className="absolute top-4 right-4 bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
            {formatFurnished(property.furnished)}
          </div>
        )}

        {/* Featured Badge */}
        {property.featured && (
          <div className="absolute bottom-4 left-4 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
            Featured
          </div>
        )}

        <button className="absolute bottom-4 right-4 p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors duration-200">
          <Heart className="h-5 w-5 text-gray-600" />
        </button>
      </div>

      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-semibold text-gray-900 line-clamp-1">{property.title}</h3>
          <span className={`text-2xl font-bold ${
            property.listing_type === 'rent' ? 'text-emerald-600' : 'text-blue-600'
          }`}>
            {formatPrice(property.price, property.listing_type)}
          </span>
        </div>

        <div className="flex items-center text-gray-600 mb-4">
          <MapPin className="h-4 w-4 mr-1" />
          <span className="text-sm">{property.city}, {property.state}</span>
        </div>

        {/* Property Type */}
        <div className="flex items-center mb-4">
          <Tag className="h-4 w-4 mr-1 text-gray-500" />
          <span className="text-sm text-gray-600 capitalize">{property.property_type}</span>
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

        {/* Availability for Rentals */}
        {property.listing_type === 'rent' && property.availability_date && (
          <div className="flex items-center mb-4 p-2 bg-green-50 rounded-lg">
            <Calendar className="h-4 w-4 mr-2 text-green-600" />
            <span className="text-sm text-green-800">
              Available from {new Date(property.availability_date).toLocaleDateString()}
            </span>
          </div>
        )}

        {/* Amenities Preview */}
        {property.amenities.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {property.amenities.slice(0, 3).map((amenity) => (
                <span key={amenity} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                  {amenity}
                </span>
              ))}
              {property.amenities.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                  +{property.amenities.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <img 
              src={property.profiles.avatar_url || 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150'} 
              alt={property.profiles.full_name} 
              className="w-8 h-8 rounded-full mr-2" 
            />
            <span className="text-sm font-medium text-gray-700">{property.profiles.full_name}</span>
          </div>
          <button className="flex items-center text-blue-600 hover:text-blue-700 transition-colors duration-200">
            <MessageCircle className="h-4 w-4 mr-1" />
            <span className="text-sm">Contact</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertyCardNew;