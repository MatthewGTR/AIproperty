import React, { useState } from 'react';
import { X, Upload, MapPin, Home, Bed, Bath, Square, CreditCard, AlertCircle } from 'lucide-react';
import { authService } from '../services/authService';

interface SubmitPropertyProps {
  onClose: () => void;
  user: { id: string; name: string; email: string; userType: string; credits: number } | null;
  onUserUpdate: (user: { id: string; name: string; email: string; userType: string; credits: number }) => void;
}

const SubmitProperty: React.FC<SubmitPropertyProps> = ({ onClose, user, onUserUpdate }) => {
  const [formData, setFormData] = useState({
    title: '', location: '', price: '', type: 'house', bedrooms: '', bathrooms: '', sqft: '', description: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const POSTING_COST = 5; // Credits required to post a property

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    setLoading(true);
    setError('');

    // Check if user has enough credits (for agents)
    if (user.userType === 'agent' && user.credits < POSTING_COST) {
      setError(`Insufficient credits. You need ${POSTING_COST} credits to post a property. Current balance: ${user.credits} credits.`);
      setLoading(false);
      return;
    }

    try {
      // Simulate property submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Deduct credits for agents
      if (user.userType === 'agent') {
        const deductResult = authService.deductCredits(
          user.id, 
          POSTING_COST, 
          `Property listing: ${formData.title}`,
          `prop_${Date.now()}`
        );
        
        if (!deductResult.success) {
          setError(deductResult.message);
          setLoading(false);
          return;
        }
        
        // Update user credits in parent component
        const updatedUser = authService.getCurrentUser(user.id);
        if (updatedUser) {
          onUserUpdate({
            id: updatedUser.id,
            name: updatedUser.name,
            email: updatedUser.email,
            userType: updatedUser.userType,
            credits: updatedUser.credits
          });
        }
      }
      
      alert('Property submitted successfully!');
      onClose();
    } catch (err) {
      setError('Failed to submit property. Please try again.');
    } finally {
      setLoading(false);
    }
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

        {user.userType === 'agent' && user.credits < POSTING_COST && (
          <div className="mx-6 mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-yellow-800 text-sm font-medium">Insufficient Credits</p>
                <p className="text-yellow-700 text-sm mt-1">
                  You need {POSTING_COST} credits to post a property. Please contact admin to purchase more credits.
                </p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <input
            type="text"
            placeholder="Property Title"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            className="w-full px-4 py-3 border rounded-lg"
            required
          />
          
          <div className="relative">
            <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Location"
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
              className="w-full pl-10 pr-4 py-3 border rounded-lg"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              placeholder="Price (RM)"
              value={formData.price}
              onChange={(e) => setFormData({...formData, price: e.target.value})}
              className="px-4 py-3 border rounded-lg"
              required
            />
            <select
              value={formData.type}
              onChange={(e) => setFormData({...formData, type: e.target.value})}
              className="px-4 py-3 border rounded-lg"
            >
              <option value="house">House</option>
              <option value="apartment">Apartment</option>
              <option value="condo">Condo</option>
              <option value="villa">Villa</option>
            </select>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <input type="number" placeholder="Bedrooms" value={formData.bedrooms} onChange={(e) => setFormData({...formData, bedrooms: e.target.value})} className="px-4 py-3 border rounded-lg" required />
            <input type="number" placeholder="Bathrooms" value={formData.bathrooms} onChange={(e) => setFormData({...formData, bathrooms: e.target.value})} className="px-4 py-3 border rounded-lg" required />
            <input type="number" placeholder="Sq Ft" value={formData.sqft} onChange={(e) => setFormData({...formData, sqft: e.target.value})} className="px-4 py-3 border rounded-lg" required />
          </div>

          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            className="w-full px-4 py-3 border rounded-lg h-24"
            required
          />

          <button 
            type="submit" 
            disabled={loading || (user.userType === 'agent' && user.credits < POSTING_COST)}
            className="w-full bg-emerald-600 text-white py-3 rounded-lg hover:bg-emerald-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Submitting...' : `Submit Property${user.userType === 'agent' ? ` (-${POSTING_COST} credits)` : ''}`}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SubmitProperty;