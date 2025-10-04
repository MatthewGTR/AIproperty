import React, { useState, useEffect } from 'react';
import { X, MapPin, Bed, Bath, Square, Heart, Share2, Phone, Mail, MessageCircle, Calendar, Tag, Eye } from 'lucide-react';
import { PropertyWithImages, propertyService } from '../services/propertyService';
import { supabase } from '../lib/supabase';

interface PropertyDetailsNewProps {
  property: PropertyWithImages;
  onClose: () => void;
  user: { id: string; name: string; email: string; userType: string; credits: number } | null;
}

const PropertyDetailsNew: React.FC<PropertyDetailsNewProps> = ({ property, onClose, user }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showContactForm, setShowContactForm] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [inquiryData, setInquiryData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    message: '',
    inquiry_type: 'general' as 'viewing' | 'general' | 'price' | 'financing'
  });
  const [submittingInquiry, setSubmittingInquiry] = useState(false);

  useEffect(() => {
    // Track property view
    if (property.id) {
      propertyService.trackPropertyView(property.id, user?.id);
    }
  }, [property.id, user?.id]);

  const formatPrice = (price: number, listingType: string) => {
    if (listingType === 'rent') {
      return `RM${price.toLocaleString()}/month`;
    }
    return `RM${price.toLocaleString()}`;
  };

  const formatFurnished = (furnished: string | null) => {
    if (!furnished) return 'Not specified';
    return furnished.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const handleSubmitInquiry = async () => {
    if (!inquiryData.name || !inquiryData.email || !inquiryData.message) {
      alert('Please fill in all required fields');
      return;
    }

    setSubmittingInquiry(true);
    try {
      const result = await propertyService.submitInquiry({
        property_id: property.id,
        inquirer_id: user?.id || null,
        inquirer_name: inquiryData.name,
        inquirer_email: inquiryData.email,
        inquirer_phone: inquiryData.phone || null,
        message: inquiryData.message,
        inquiry_type: inquiryData.inquiry_type
      });

      if (result.success) {
        alert('Your inquiry has been sent successfully!');
        setShowContactForm(false);
        setInquiryData({
          name: user?.name || '',
          email: user?.email || '',
          phone: '',
          message: '',
          inquiry_type: 'general'
        });
      } else {
        alert('Failed to send inquiry. Please try again.');
      }
    } catch (error) {
      alert('Failed to send inquiry. Please try again.');
    } finally {
      setSubmittingInquiry(false);
    }
  };

  const handleToggleFavorite = async () => {
    if (!user) {
      alert('Please sign in to save favorites');
      return;
    }

    const result = await propertyService.toggleFavorite(user.id, property.id);
    if (result.success) {
      setIsFavorited(result.isFavorited);
    }
  };

  const images = property.property_images.sort((a, b) => a.display_order - b.display_order);
  const primaryImage = images.find(img => img.is_primary) || images[0];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">{property.title}</h2>
          <div className="flex items-center space-x-2">
            <button 
              onClick={handleToggleFavorite}
              className={`p-2 rounded-lg transition-colors duration-200 ${
                isFavorited ? 'bg-red-50 text-red-600' : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              <Heart className={`h-5 w-5 ${isFavorited ? 'fill-current' : ''}`} />
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
                src={images[currentImageIndex]?.image_url || primaryImage?.image_url}
                alt={property.title}
                className="w-full h-96 object-cover rounded-xl"
              />
              
              {/* Listing Type Badge */}
              <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-sm font-semibold ${
                property.listing_type === 'rent' 
                  ? 'bg-emerald-500 text-white' 
                  : 'bg-blue-500 text-white'
              }`}>
                {property.listing_type === 'rent' ? 'For Rent' : 'For Sale'}
              </div>

              {images.length > 1 && (
                <>
                  {/* Navigation Arrows */}
                  <button
                    onClick={() => setCurrentImageIndex(currentImageIndex > 0 ? currentImageIndex - 1 : images.length - 1)}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all duration-200"
                  >
                    ←
                  </button>
                  <button
                    onClick={() => setCurrentImageIndex(currentImageIndex < images.length - 1 ? currentImageIndex + 1 : 0)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all duration-200"
                  >
                    →
                  </button>
                  
                  {/* Image Counter */}
                  <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                    {currentImageIndex + 1} / {images.length}
                  </div>
                </>
              )}
            </div>

            {/* Property Info */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className={`text-3xl font-bold ${
                  property.listing_type === 'rent' ? 'text-emerald-600' : 'text-blue-600'
                }`}>
                  {formatPrice(property.price, property.listing_type)}
                </span>
                <div className="flex items-center space-x-2">
                  <Tag className="h-5 w-5 text-gray-500" />
                  <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium capitalize">
                    {property.property_type}
                  </span>
                </div>
              </div>

              <div className="flex items-center text-gray-600">
                <MapPin className="h-5 w-5 mr-2" />
                <span>{property.address}, {property.city}, {property.state}</span>
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

              {/* Rental-specific info */}
              {property.listing_type === 'rent' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {property.furnished && (
                    <div className="flex items-center p-3 bg-purple-50 rounded-lg">
                      <span className="font-medium text-purple-800">Furnishing: {formatFurnished(property.furnished)}</span>
                    </div>
                  )}
                  {property.availability_date && (
                    <div className="flex items-center p-3 bg-green-50 rounded-lg">
                      <Calendar className="h-4 w-4 mr-2 text-green-600" />
                      <span className="text-green-800">Available from {new Date(property.availability_date).toLocaleDateString()}</span>
                    </div>
                  )}
                  {property.deposit_info && (
                    <div className="md:col-span-2 p-3 bg-blue-50 rounded-lg">
                      <span className="text-blue-800"><strong>Deposit:</strong> {property.deposit_info}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Description</h3>
              <p className="text-gray-600 leading-relaxed">{property.description}</p>
            </div>

            {/* Amenities */}
            {property.amenities.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Amenities</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {property.amenities.map((amenity) => (
                    <div key={amenity} className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-blue-500 mr-2">✓</span>
                      <span className="text-sm text-gray-700">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Agent and Contact */}
          <div className="space-y-6">
            {/* Agent Card */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Agent</h3>
              <div className="flex items-center mb-4">
                <img
                  src={property.profiles?.avatar_url || 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150'}
                  alt={property.profiles?.full_name || 'Agent'}
                  className="w-16 h-16 rounded-full mr-4"
                />
                <div>
                  <h4 className="font-semibold text-gray-900">{property.profiles?.full_name || 'Property Agent'}</h4>
                  <p className="text-sm text-gray-600">Licensed Real Estate Agent</p>
                  {property.profiles?.company && (
                    <p className="text-sm text-blue-600">{property.profiles?.company}</p>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <button className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
                  <Phone className="h-4 w-4 mr-2" />
                  Call {property.profiles?.phone || 'Agent'}
                </button>
                <button
                  onClick={() => setShowContactForm(!showContactForm)}
                  className="w-full flex items-center justify-center px-4 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors duration-200"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Send Inquiry
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
                <h4 className="font-semibold text-gray-900 mb-4">Send an Inquiry</h4>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Your Name"
                      value={inquiryData.name}
                      onChange={(e) => setInquiryData({...inquiryData, name: e.target.value})}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                    <input
                      type="email"
                      placeholder="Your Email"
                      value={inquiryData.email}
                      onChange={(e) => setInquiryData({...inquiryData, email: e.target.value})}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="tel"
                      placeholder="Phone Number"
                      value={inquiryData.phone}
                      onChange={(e) => setInquiryData({...inquiryData, phone: e.target.value})}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <select
                      value={inquiryData.inquiry_type}
                      onChange={(e) => setInquiryData({...inquiryData, inquiry_type: e.target.value as any})}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="general">General Inquiry</option>
                      <option value="viewing">Schedule Viewing</option>
                      <option value="price">Price Negotiation</option>
                      <option value="financing">Financing Options</option>
                    </select>
                  </div>
                  
                  <textarea
                    value={inquiryData.message}
                    onChange={(e) => setInquiryData({...inquiryData, message: e.target.value})}
                    placeholder="Your message..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
                    rows={4}
                    required
                  />
                  
                  <button
                    onClick={handleSubmitInquiry}
                    disabled={submittingInquiry}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50"
                  >
                    {submittingInquiry ? 'Sending...' : 'Send Inquiry'}
                  </button>
                </div>
              </div>
            )}

            {/* Property Stats */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h4 className="font-semibold text-gray-900 mb-4">Property Details</h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Listed Date:</span>
                  <span className="font-medium">{new Date(property.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Property Type:</span>
                  <span className="font-medium capitalize">{property.property_type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Square Feet:</span>
                  <span className="font-medium">{property.sqft.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Price per sqft:</span>
                  <span className="font-medium">RM{Math.round(property.price / property.sqft).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Views:</span>
                  <span className="font-medium flex items-center">
                    <Eye className="h-4 w-4 mr-1" />
                    {property.views_count}
                  </span>
                </div>
              </div>
            </div>

            {/* Schedule Tour */}
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white">
              <h4 className="font-semibold mb-2">
                {property.listing_type === 'rent' ? 'Schedule a Viewing' : 'Schedule a Tour'}
              </h4>
              <p className="text-sm text-orange-100 mb-4">See this property in person</p>
              <button 
                onClick={() => {
                  setInquiryData({
                    ...inquiryData,
                    inquiry_type: 'viewing',
                    message: `I would like to schedule a ${property.listing_type === 'rent' ? 'viewing' : 'tour'} for this property.`
                  });
                  setShowContactForm(true);
                }}
                className="w-full bg-white text-orange-600 py-2 rounded-lg font-medium hover:bg-orange-50 transition-colors duration-200"
              >
                Book {property.listing_type === 'rent' ? 'Viewing' : 'Tour'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailsNew;