import React from 'react';
import { Search } from 'lucide-react';
import { Property } from '../types/Property';
import PropertyCard from './PropertyCard';

interface PropertyListingsProps {
  properties: Property[];
  onPropertyClick: (property: Property) => void;
}

const PropertyListings: React.FC<PropertyListingsProps> = ({ properties, onPropertyClick }) => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Featured Properties</h2>
        <p className="text-gray-600">{properties.length} properties found</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {properties.map((property) => (
          <PropertyCard
            key={property.id}
            property={property}
            onClick={onPropertyClick}
          />
        ))}
      </div>

      {properties.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Search className="h-16 w-16 mx-auto" />
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Ask our AI assistant above</h3>
          <p className="text-gray-600">Tell our AI what you're looking for and get personalized property recommendations!</p>
        </div>
      ) : null}
    </section>
  );
};

export default PropertyListings;