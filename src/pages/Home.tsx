import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Home as HomeIcon, TrendingUp, MessageSquare } from 'lucide-react';
import PropertyCard from '../components/PropertyCard';
import { propertyService, PropertyWithImages } from '../services/propertyService';

export default function Home() {
  const [featuredProperties, setFeaturedProperties] = useState<PropertyWithImages[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadFeaturedProperties();
  }, []);

  const loadFeaturedProperties = async () => {
    try {
      const properties = await propertyService.getAll();
      setFeaturedProperties(properties.slice(0, 6));
    } catch (error) {
      console.error('Error loading properties:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-4">Find Your Dream Property</h1>
            <p className="text-xl mb-8 text-blue-100">
              AI-powered property search in Malaysia
            </p>

            {/* Search Bar */}
            <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-xl p-2 flex gap-2">
              <input
                type="text"
                placeholder="Search by location, price, or type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-4 py-3 text-slate-900 focus:outline-none rounded-lg"
              />
              <Link
                to={`/properties?search=${searchQuery}`}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Search className="w-5 h-5" />
                <span>Search</span>
              </Link>
            </div>

            {/* AI Chat Button */}
            <div className="mt-8">
              <Link
                to="/ai-chat"
                className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors shadow-lg text-lg font-semibold"
              >
                <MessageSquare className="w-6 h-6" />
                <span>Try Our AI Property Assistant</span>
              </Link>
              <p className="mt-3 text-blue-100 text-sm">
                Tell us your salary & family size - We'll find the perfect property!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <MessageSquare className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">AI-Powered Search</h3>
            <p className="text-slate-600">
              Chat with our AI assistant to find properties based on your salary, family size, and preferences.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
              <MapPin className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Prime Locations</h3>
            <p className="text-slate-600">
              Properties in Johor, KL, Penang, Selangor and major cities across Malaysia.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-amber-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Verified Listings</h3>
            <p className="text-slate-600">
              All properties verified by licensed agents with transparent pricing.
            </p>
          </div>
        </div>

        {/* Featured Properties */}
        <div>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-slate-900">Featured Properties</h2>
            <Link to="/properties" className="text-blue-600 hover:text-blue-700 font-semibold">
              View All →
            </Link>
          </div>

          {featuredProperties.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-xl shadow-md">
              <HomeIcon className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-700 mb-2">No Properties Yet</h3>
              <p className="text-slate-500 mb-6">Be the first to list your property!</p>
              <Link
                to="/agent-dashboard"
                className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                List Your Property
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
