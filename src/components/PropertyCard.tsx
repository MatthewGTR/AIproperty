import { MapPin, Bed, Bath, Maximize, Tag, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PropertyWithImages } from '../services/propertyService';

interface PropertyCardProps {
  property: PropertyWithImages;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const formatPrice = (price: number) => {
    return `RM ${price.toLocaleString()}${property.listing_type === 'rent' ? '/month' : ''}`;
  };

  return (
    <Link to={`/property/${property.id}`} className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer">
      {/* Image */}
      <div className="relative h-48 bg-slate-200">
        {property.images && property.images.length > 0 ? (
          <img
            src={property.images[0]}
            alt={property.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400">
            <MapPin className="w-12 h-12" />
          </div>
        )}
        <div className="absolute top-2 right-2 flex gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
            property.listing_type === 'sale'
              ? 'bg-blue-500 text-white'
              : 'bg-emerald-500 text-white'
          }`}>
            For {property.listing_type === 'sale' ? 'Sale' : 'Rent'}
          </span>
          <button
            onClick={(e) => {
              e.preventDefault();
              alert('Add to favorites - will be connected!');
            }}
            className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-pink-50 transition-colors"
          >
            <Heart className="w-4 h-4 text-pink-500" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-lg text-slate-900 mb-1 line-clamp-1">{property.title}</h3>
        <p className="text-sm text-slate-600 mb-3 flex items-center gap-1">
          <MapPin className="w-4 h-4" />
          {property.city}, {property.state}
        </p>

        <div className="flex items-center gap-4 mb-3 text-sm text-slate-600">
          <div className="flex items-center gap-1">
            <Bed className="w-4 h-4" />
            <span>{property.bedrooms} bed</span>
          </div>
          <div className="flex items-center gap-1">
            <Bath className="w-4 h-4" />
            <span>{property.bathrooms} bath</span>
          </div>
          <div className="flex items-center gap-1">
            <Maximize className="w-4 h-4" />
            <span>{property.sqft.toLocaleString()} sqft</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-slate-200">
          <div className="flex items-center gap-1 text-blue-600 font-bold text-xl">
            <Tag className="w-5 h-5" />
            {formatPrice(property.price)}
          </div>
        </div>
      </div>
    </Link>
  );
}
