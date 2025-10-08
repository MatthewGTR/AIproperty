import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Bed, Bath, Square, Heart, Phone, Mail, MessageCircle, ArrowLeft } from 'lucide-react';
import { propertyService, PropertyWithImages } from '../services/propertyService';

interface PropertyDetailsPageProps {
  user: { id: string; name: string; email: string; userType: string; credits: number } | null;
}

const PropertyDetailsPage: React.FC<PropertyDetailsPageProps> = ({ user }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [property, setProperty] = useState<PropertyWithImages | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadProperty(id);
    }
  }, [id]);

  const loadProperty = async (propertyId: string) => {
    try {
      const prop = await propertyService.getProperty(propertyId);
      console.log('Loaded property:', prop);
      console.log('Property profiles:', prop?.profiles);
      if (prop) {
        setProperty(prop);
      } else {
        const allProps = await propertyService.getProperties({});
        const foundProp = allProps.find(p => p.id === propertyId);
        console.log('Found property from list:', foundProp);
        console.log('Found property profiles:', foundProp?.profiles);
        setProperty(foundProp || null);
      }
    } catch (error) {
      console.error('Error loading property:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading property...</p>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Property Not Found</h2>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const formatPrice = (price: number, listingType: string) => {
    if (listingType === 'rent') {
      return `RM${price.toLocaleString()}/month`;
    }
    return `RM${price.toLocaleString()}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate('/')}
          className="flex items-center text-blue-600 hover:text-blue-700 mb-6 font-medium"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Home
        </button>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="p-8">
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{property.title}</h1>
                <div className="flex items-center text-gray-600 mb-4">
                  <MapPin className="h-5 w-5 mr-2" />
                  <span>{property.address ? `${property.address}, ` : ''}{property.city}, {property.state}</span>
                </div>
                <div className={`text-4xl font-bold mb-6 ${
                  property.listing_type === 'rent' ? 'text-emerald-600' : 'text-blue-600'
                }`}>
                  {formatPrice(property.price, property.listing_type)}
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
                  <p className="text-lg font-semibold text-gray-900">{property.sqft?.toLocaleString() || 'N/A'}</p>
                </div>
              </div>

              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Description</h2>
                <p className="text-gray-600 leading-relaxed">{property.description}</p>
              </div>

              {property.amenities && property.amenities.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Amenities</h2>
                  <div className="grid grid-cols-2 gap-3">
                    {property.amenities.map((amenity, index) => (
                      <div key={index} className="flex items-center space-x-2 text-gray-700">
                        <span className="text-blue-500">✓</span>
                        <span className="text-sm">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-blue-50 rounded-xl p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Contact Agent</h2>

                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <img
                      src={property.profiles?.avatar_url || 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150'}
                      alt={property.profiles?.full_name || 'Agent'}
                      className="w-24 h-24 rounded-full object-cover border-3 border-white shadow-lg mb-2"
                    />
                    <h3 className="text-sm font-semibold text-gray-900 text-center">
                      {property.profiles?.full_name || 'Property Agent'}
                    </h3>
                    {property.profiles?.company && (
                      <p className="text-xs text-gray-600 text-center">{property.profiles.company}</p>
                    )}
                  </div>

                  <div className="flex-1 space-y-3">
                    <button className="flex items-center justify-center w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
                      <Phone className="h-5 w-5 mr-2" />
                      Call Agent
                    </button>
                    <button className="flex items-center justify-center w-full px-4 py-3 bg-white border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors duration-200">
                      <Mail className="h-5 w-5 mr-2" />
                      Email Agent
                    </button>
                    <button className="flex items-center justify-center w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200">
                      <MessageCircle className="h-5 w-5 mr-2" />
                      WhatsApp
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 bg-gray-50">
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                {property.property_images && property.property_images.length > 0 ? (
                  property.property_images.map((image, index) => (
                    <img
                      key={index}
                      src={image.image_url}
                      alt={`${property.title} - Image ${index + 1}`}
                      className="w-full h-64 object-cover rounded-lg shadow-md"
                    />
                  ))
                ) : (
                  <img
                    src="https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=800"
                    alt={property.title}
                    className="w-full h-64 object-cover rounded-lg shadow-md"
                  />
                )}
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
              <span className="font-semibold">Property Type:</span> {property.property_type?.charAt(0).toUpperCase() + property.property_type?.slice(1)}
            </div>
            <div>
              <span className="font-semibold">Listing Type:</span> {property.listing_type === 'sale' ? 'For Sale' : 'For Rent'}
            </div>
            <div>
              <span className="font-semibold">Property ID:</span> {property.id.substring(0, 8).toUpperCase()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailsPage;
