import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { propertyService, PropertyWithImages } from '../services/propertyService';
import PropertyCardNew from './PropertyCardNew';

interface RentPageProps {
  user: { id: string; name: string; email: string; userType: string; credits: number } | null;
}

const RentPage: React.FC<RentPageProps> = ({ user }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [allProperties, setAllProperties] = useState<PropertyWithImages[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<PropertyWithImages[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      const properties = await propertyService.getProperties({ listing_type: 'rent' });
      setAllProperties(properties);
      setFilteredProperties(properties);
    } catch (error) {
      console.error('Error loading properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setFilteredProperties(allProperties);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = allProperties.filter(property =>
      property.title.toLowerCase().includes(query) ||
      property.city.toLowerCase().includes(query) ||
      property.state.toLowerCase().includes(query) ||
      property.property_type.toLowerCase().includes(query) ||
      property.description.toLowerCase().includes(query)
    );
    setFilteredProperties(filtered);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handlePropertyClick = (property: PropertyWithImages) => {
    navigate(`/property/${property.id}`);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-white border-b border-gray-200 px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Properties for Rent</h1>
          <p className="text-gray-600 text-lg">Find your perfect rental home across Malaysia</p>
        </div>
      </div>

      <div className="bg-gray-50 px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="relative flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Search by location, property type, or keywords..."
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={handleSearch}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
            >
              Search
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-6 flex justify-between items-center">
          <p className="text-gray-600">{filteredProperties.length} properties found {searchQuery ? `for "${searchQuery}"` : 'across Malaysia'}</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredProperties.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No properties found matching your search.</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setFilteredProperties(allProperties);
                  }}
                  className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Clear Search
                </button>
              </div>
            ) : (
              filteredProperties.map((property) => (
                <PropertyCardNew
                  key={property.id}
                  property={property}
                  onClick={handlePropertyClick}
                />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RentPage;
