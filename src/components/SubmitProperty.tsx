import React, { useState } from 'react';
import { X, Upload, MapPin, Home, Bed, Bath, Square } from 'lucide-react';

interface SubmitPropertyProps {
  onClose: () => void;
  user: { name: string; email: string } | null;
}

const SubmitProperty: React.FC<SubmitPropertyProps> = ({ onClose, user }) => {
  const [formData, setFormData] = useState({
    title: '', location: '', price: '', type: 'house', bedrooms: '', bathrooms: '', sqft: '', description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Property submitted successfully!');
    onClose();
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold">List Your Property</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="h-5 w-5" />
          </button>
        </div>

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

          <button type="submit" className="w-full bg-emerald-600 text-white py-3 rounded-lg hover:bg-emerald-700">
            Submit Property
          </button>
        </form>
      </div>
    </div>
  );
};

export default SubmitProperty;