import React, { useState } from 'react';
import { X, Upload, MapPin, Home, Bed, Bath, Square, CreditCard, AlertCircle, Plus, Trash2 } from 'lucide-react';
import { propertyService } from '../services/propertyService';
import { supabase } from '../lib/supabase';

interface SubmitPropertyProps {
  onClose: () => void;
  user: { id: string; name: string; email: string; userType: string; credits: number } | null;
  onUserUpdate: (user: { id: string; name: string; email: string; userType: string; credits: number }) => void;
}

const SubmitProperty: React.FC<SubmitPropertyProps> = ({ onClose, user, onUserUpdate }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    property_type: 'house',
    listing_type: 'sale',
    price: '',
    bedrooms: '',
    bathrooms: '',
    sqft: '',
    address: '',
    city: '',
    state: '',
    amenities: [] as string[],
    furnished: 'unfurnished',
    availability_date: '',
    deposit_info: ''
  });
  const [images, setImages] = useState<string[]>(['']);
  const [newAmenity, setNewAmenity] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const POSTING_COST = 5; // Credits required to post a property

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    setLoading(true);
    setError('');

    try {
      const propertyData = {
        title: formData.title,
        description: formData.description,
        property_type: formData.property_type as any,
        listing_type: formData.listing_type as any,
        price: parseFloat(formData.price),
        bedrooms: parseInt(formData.bedrooms) || 0,
        bathrooms: parseInt(formData.bathrooms) || 0,
        sqft: parseInt(formData.sqft),
        address: formData.address,
        city: formData.city,
        state: formData.state,
        amenities: formData.amenities,
        furnished: formData.furnished as any,
        availability_date: formData.availability_date || null,
        deposit_info: formData.deposit_info || null,
        agent_id: user.id,
        status: 'active' as any
      };

      const validImages = images.filter(img => img.trim() !== '');
      const result = await propertyService.createProperty(propertyData, validImages);
      
      if (result.success) {
        // Update user credits in parent component
        const { data: updatedProfile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (updatedProfile) {
          onUserUpdate({
            id: updatedProfile.id,
            name: updatedProfile.full_name,
            email: updatedProfile.email,
            userType: updatedProfile.user_type,
            credits: updatedProfile.credits
          });
        }
        
        alert('Property listed successfully!');
        onClose();
      } else {
        setError(result.error || 'Failed to create property');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to submit property. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const addImageField = () => {
    setImages([...images, '']);
  };

  const removeImageField = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const updateImage = (index: number, value: string) => {
    const newImages = [...images];
    newImages[index] = value;
    setImages(newImages);
  };

  const addAmenity = () => {
    if (newAmenity.trim() && !formData.amenities.includes(newAmenity.trim())) {
      setFormData({
        ...formData,
        amenities: [...formData.amenities, newAmenity.trim()]
      });
      setNewAmenity('');
    }
  };

  const removeAmenity = (amenity: string) => {
    setFormData({
      ...formData,
      amenities: formData.amenities.filter(a => a !== amenity)
    });
  };

  if (!user) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl max-w-md w-full p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Sign In Required</h2>
          <p className="text-gray-600 mb-6">Please sign in to submit a property.</p>
          <button onClick={onClose} className="w-full bg-blue-600 text-white py-3 rounded-lg">Close</button>
        </div>
      </div>
    );
  }

  if (user.userType === 'buyer') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl max-w-md w-full p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Restricted</h2>
          <p className="text-gray-600 mb-6">Only agents and sellers can list properties.</p>
          <button onClick={onClose} className="w-full bg-blue-600 text-white py-3 rounded-lg">Close</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">List Your Property</h2>
            {user.userType === 'agent' && (
              <div className="flex items-center mt-1">
                <CreditCard className="h-4 w-4 text-blue-600 mr-1" />
                <span className="text-sm text-gray-600">
                  Cost: {POSTING_COST} credits | Your balance: {user.credits} credits
                </span>
              </div>
            )}
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
            <AlertCircle className="h-5 w-5 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
            
            <input
              type="text"
              placeholder="Property Title"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <select
                value={formData.listing_type}
                onChange={(e) => setFormData({...formData, listing_type: e.target.value})}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="sale">For Sale</option>
                <option value="rent">For Rent</option>
              </select>
              
              <select
                value={formData.property_type}
                onChange={(e) => setFormData({...formData, property_type: e.target.value})}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="house">House</option>
                <option value="apartment">Apartment</option>
                <option value="condo">Condo</option>
                <option value="villa">Villa</option>
                <option value="studio">Studio</option>
                <option value="shophouse">Shophouse</option>
              </select>
            </div>

            <textarea
              placeholder="Property Description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 h-24"
              required
            />
          </div>

          {/* Location */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Location</h3>
            
            <input
              type="text"
              placeholder="Full Address"
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="City"
                value={formData.city}
                onChange={(e) => setFormData({...formData, city: e.target.value})}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="text"
                placeholder="State"
                value={formData.state}
                onChange={(e) => setFormData({...formData, state: e.target.value})}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {/* Property Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Property Details</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <input
                type="number"
                placeholder={formData.listing_type === 'rent' ? 'Monthly Rent (RM)' : 'Price (RM)'}
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="number"
                placeholder="Square Feet"
                value={formData.sqft}
                onChange={(e) => setFormData({...formData, sqft: e.target.value})}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <input
                type="number"
                placeholder="Bedrooms"
                value={formData.bedrooms}
                onChange={(e) => setFormData({...formData, bedrooms: e.target.value})}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="number"
                placeholder="Bathrooms"
                value={formData.bathrooms}
                onChange={(e) => setFormData({...formData, bathrooms: e.target.value})}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {formData.listing_type === 'rent' && (
              <div className="grid grid-cols-2 gap-4">
                <select
                  value={formData.furnished}
                  onChange={(e) => setFormData({...formData, furnished: e.target.value})}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="unfurnished">Unfurnished</option>
                  <option value="partially_furnished">Partially Furnished</option>
                  <option value="fully_furnished">Fully Furnished</option>
                </select>
                
                <input
                  type="date"
                  placeholder="Available From"
                  value={formData.availability_date}
                  onChange={(e) => setFormData({...formData, availability_date: e.target.value})}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            {formData.listing_type === 'rent' && (
              <input
                type="text"
                placeholder="Deposit Information (e.g., 2 months + 1 month advance)"
                value={formData.deposit_info}
                onChange={(e) => setFormData({...formData, deposit_info: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            )}
          </div>

          {/* Images */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Property Images</h3>
            
            {images.map((image, index) => (
              <div key={index} className="flex space-x-2">
                <input
                  type="url"
                  placeholder={`Image URL ${index + 1}${index === 0 ? ' (Primary)' : ''}`}
                  value={image}
                  onChange={(e) => updateImage(index, e.target.value)}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required={index === 0}
                />
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => removeImageField(index)}
                    className="p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                )}
              </div>
            ))}
            
            <button
              type="button"
              onClick={addImageField}
              className="flex items-center px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors duration-200"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Another Image
            </button>
          </div>

          {/* Amenities */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Amenities</h3>
            
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Add amenity (e.g., Swimming Pool, Gym, Parking)"
                value={newAmenity}
                onChange={(e) => setNewAmenity(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAmenity())}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={addAmenity}
                className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Add
              </button>
            </div>

            {formData.amenities.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.amenities.map((amenity) => (
                  <div key={amenity} className="flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
                    <span className="text-sm">{amenity}</span>
                    <button
                      type="button"
                      onClick={() => removeAmenity(amenity)}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-emerald-600 text-white py-3 rounded-lg hover:bg-emerald-700 transition-colors duration-200 disabled:opacity-50"
          >
            {loading ? 'Creating Listing...' : `Create Listing${user.userType === 'agent' ? ` (-${POSTING_COST} credits)` : ''}`}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SubmitProperty;