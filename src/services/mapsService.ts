import { Loader } from '@googlemaps/js-api-loader';

export interface LocationInfo {
  address: string;
  lat: number;
  lng: number;
  neighborhood?: string;
  city?: string;
  state?: string;
  country?: string;
  placeId?: string;
  formattedAddress?: string;
}

let googleMapsLoader: Loader | null = null;
let isGoogleMapsInitialized = false;

const initGoogleMaps = async (): Promise<boolean> => {
  if (isGoogleMapsInitialized) return true;

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  if (!apiKey || apiKey === 'your_google_maps_api_key_here' || !apiKey.trim()) {
    console.warn('Google Maps API key not configured. Using fallback geocoding.');
    return false;
  }

  try {
    googleMapsLoader = new Loader({
      apiKey: apiKey,
      version: 'weekly',
      libraries: ['places', 'geometry']
    });

    await googleMapsLoader.load();
    isGoogleMapsInitialized = true;
    return true;
  } catch (error) {
    console.error('Failed to initialize Google Maps:', error);
    return false;
  }
};

export const geocodeAddress = async (address: string): Promise<LocationInfo | null> => {
  const hasGoogleMaps = await initGoogleMaps();

  if (!hasGoogleMaps) {
    // Fallback: Use predefined Malaysian locations
    return geocodeFallback(address);
  }

  try {
    const geocoder = new google.maps.Geocoder();

    const result = await new Promise<google.maps.GeocoderResult | null>((resolve) => {
      geocoder.geocode(
        {
          address: address,
          region: 'MY', // Malaysia
          componentRestrictions: {
            country: 'MY'
          }
        },
        (results, status) => {
          if (status === 'OK' && results && results[0]) {
            resolve(results[0]);
          } else {
            resolve(null);
          }
        }
      );
    });

    if (!result) {
      return geocodeFallback(address);
    }

    const location = result.geometry.location;
    const addressComponents = result.address_components;

    let city = '';
    let state = '';
    let neighborhood = '';

    addressComponents.forEach(component => {
      if (component.types.includes('locality')) {
        city = component.long_name;
      }
      if (component.types.includes('administrative_area_level_1')) {
        state = component.long_name;
      }
      if (component.types.includes('sublocality') || component.types.includes('neighborhood')) {
        neighborhood = component.long_name;
      }
    });

    return {
      address: address,
      formattedAddress: result.formatted_address,
      lat: location.lat(),
      lng: location.lng(),
      city: city || 'Unknown',
      state: state || 'Unknown',
      country: 'Malaysia',
      neighborhood: neighborhood,
      placeId: result.place_id
    };
  } catch (error) {
    console.error('Geocoding error:', error);
    return geocodeFallback(address);
  }
};

const geocodeFallback = (address: string): LocationInfo => {
  const addressLower = address.toLowerCase();

  // Malaysian cities with approximate coordinates
  const malaysianLocations: Record<string, { lat: number; lng: number; state: string }> = {
    'kuala lumpur': { lat: 3.1390, lng: 101.6869, state: 'Kuala Lumpur' },
    'kl': { lat: 3.1390, lng: 101.6869, state: 'Kuala Lumpur' },
    'johor bahru': { lat: 1.4927, lng: 103.7414, state: 'Johor' },
    'jb': { lat: 1.4927, lng: 103.7414, state: 'Johor' },
    'penang': { lat: 5.4164, lng: 100.3327, state: 'Penang' },
    'georgetown': { lat: 5.4145, lng: 100.3292, state: 'Penang' },
    'ipoh': { lat: 4.5975, lng: 101.0901, state: 'Perak' },
    'shah alam': { lat: 3.0738, lng: 101.5183, state: 'Selangor' },
    'petaling jaya': { lat: 3.1073, lng: 101.6067, state: 'Selangor' },
    'pj': { lat: 3.1073, lng: 101.6067, state: 'Selangor' },
    'subang jaya': { lat: 3.0435, lng: 101.5801, state: 'Selangor' },
    'klang': { lat: 3.0333, lng: 101.4500, state: 'Selangor' },
    'seremban': { lat: 2.7297, lng: 101.9381, state: 'Negeri Sembilan' },
    'malacca': { lat: 2.1896, lng: 102.2501, state: 'Malacca' },
    'melaka': { lat: 2.1896, lng: 102.2501, state: 'Malacca' },
    'johor': { lat: 1.4854, lng: 103.7618, state: 'Johor' },
    'cyberjaya': { lat: 2.9213, lng: 101.6559, state: 'Selangor' },
    'putrajaya': { lat: 2.9264, lng: 101.6964, state: 'Putrajaya' },
    'kota kinabalu': { lat: 5.9804, lng: 116.0735, state: 'Sabah' },
    'kuching': { lat: 1.5535, lng: 110.3593, state: 'Sarawak' },
  };

  // Find matching location
  for (const [key, value] of Object.entries(malaysianLocations)) {
    if (addressLower.includes(key)) {
      return {
        address: address,
        lat: value.lat,
        lng: value.lng,
        city: key.charAt(0).toUpperCase() + key.slice(1),
        state: value.state,
        country: 'Malaysia'
      };
    }
  }

  // Default to KL if no match
  return {
    address: address,
    lat: 3.1390,
    lng: 101.6869,
    city: 'Kuala Lumpur',
    state: 'Kuala Lumpur',
    country: 'Malaysia'
  };
};

export const calculateDistance = async (
  origin: { lat: number; lng: number },
  destination: { lat: number; lng: number }
): Promise<number | null> => {
  const hasGoogleMaps = await initGoogleMaps();

  if (!hasGoogleMaps) {
    // Fallback: Haversine formula
    return calculateDistanceFallback(origin, destination);
  }

  try {
    const originLatLng = new google.maps.LatLng(origin.lat, origin.lng);
    const destLatLng = new google.maps.LatLng(destination.lat, destination.lng);

    const distance = google.maps.geometry.spherical.computeDistanceBetween(
      originLatLng,
      destLatLng
    );

    return distance / 1000; // Convert to kilometers
  } catch (error) {
    console.error('Distance calculation error:', error);
    return calculateDistanceFallback(origin, destination);
  }
};

const calculateDistanceFallback = (
  origin: { lat: number; lng: number },
  destination: { lat: number; lng: number }
): number => {
  // Haversine formula
  const R = 6371; // Earth's radius in km
  const dLat = toRad(destination.lat - origin.lat);
  const dLon = toRad(destination.lng - origin.lng);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(origin.lat)) *
    Math.cos(toRad(destination.lat)) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return distance;
};

const toRad = (degrees: number): number => {
  return degrees * (Math.PI / 180);
};