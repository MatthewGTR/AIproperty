import { Loader } from '@googlemaps/js-api-loader';

export interface LocationInfo {
  address: string;
  lat: number;
  lng: number;
  neighborhood?: string;
  city?: string;
  state?: string;
  country?: string;
}

let googleMapsLoader: Loader | null = null;
let isLoaded = false;

const initializeGoogleMaps = async (): Promise<void> => {
  if (isLoaded) return;
  
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    console.warn('Google Maps API key not found');
    return;
  }

  googleMapsLoader = new Loader({
    apiKey,
    version: 'weekly',
    libraries: ['places', 'geometry']
  });

  try {
    await googleMapsLoader.load();
    isLoaded = true;
  } catch (error) {
    console.error('Failed to load Google Maps:', error);
  }
};

export const geocodeAddress = async (address: string): Promise<LocationInfo | null> => {
  try {
    await initializeGoogleMaps();
    
    if (!window.google) {
      console.warn('Google Maps not available');
      return null;
    }

    const geocoder = new window.google.maps.Geocoder();
    
    return new Promise((resolve) => {
      geocoder.geocode({ address }, (results, status) => {
        if (status === 'OK' && results && results[0]) {
          const result = results[0];
          const location = result.geometry.location;
          
          // Extract address components
          const addressComponents = result.address_components;
          let neighborhood = '';
          let city = '';
          let state = '';
          let country = '';
          
          addressComponents?.forEach(component => {
            const types = component.types;
            if (types.includes('neighborhood')) {
              neighborhood = component.long_name;
            } else if (types.includes('locality')) {
              city = component.long_name;
            } else if (types.includes('administrative_area_level_1')) {
              state = component.short_name;
            } else if (types.includes('country')) {
              country = component.long_name;
            }
          });

          resolve({
            address: result.formatted_address,
            lat: location.lat(),
            lng: location.lng(),
            neighborhood,
            city,
            state,
            country
          });
        } else {
          console.error('Geocoding failed:', status);
          resolve(null);
        }
      });
    });
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
};

export const getCurrentLocation = (): Promise<LocationInfo | null> => {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      console.warn('Geolocation is not supported by this browser');
      resolve(null);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        console.log('Got coordinates:', latitude, longitude);
        
        try {
          await initializeGoogleMaps();
          
          if (!window.google) {
            console.warn('Google Maps not available, using coordinates only');
            resolve({
              address: `${latitude}, ${longitude}`,
              lat: latitude,
              lng: longitude
            });
            return;
          }

          const geocoder = new window.google.maps.Geocoder();
          const latlng = new window.google.maps.LatLng(latitude, longitude);
          
          geocoder.geocode({ location: latlng }, (results, status) => {
            if (status === 'OK' && results && results[0]) {
              const result = results[0];
              
              // Extract address components
              const addressComponents = result.address_components;
              let neighborhood = '';
              let city = '';
              let state = '';
              let country = '';
              
              addressComponents?.forEach(component => {
                const types = component.types;
                if (types.includes('neighborhood')) {
                  neighborhood = component.long_name;
                } else if (types.includes('locality')) {
                  city = component.long_name;
                } else if (types.includes('administrative_area_level_1')) {
                  state = component.short_name;
                } else if (types.includes('country')) {
                  country = component.long_name;
                }
              });

              resolve({
                address: result.formatted_address,
                lat: latitude,
                lng: longitude,
                neighborhood,
                city,
                state,
                country
              });
            } else {
              console.warn('Geocoding failed:', status);
              resolve({
                address: `${latitude}, ${longitude}`,
                lat: latitude,
                lng: longitude
              });
            }
          });
        } catch (error) {
          console.error('Error in getCurrentLocation:', error);
          resolve({
            address: `${latitude}, ${longitude}`,
            lat: latitude,
            lng: longitude
          });
        }
      },
      (error) => {
        console.warn('Geolocation access denied or unavailable:', error.message);
        switch(error.code) {
          case error.PERMISSION_DENIED:
            console.warn('User denied the request for Geolocation.');
            break;
          case error.POSITION_UNAVAILABLE:
            console.warn('Location information is unavailable.');
            break;
          case error.TIMEOUT:
            console.warn('The request to get user location timed out.');
            break;
          default:
            console.warn('An unknown error occurred.');
            break;
        }
        resolve(null);
      },
      { 
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 300000 // 5 minutes
      }
    );
  });
};

export const calculateDistance = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number => {
  const R = 3959; // Earth's radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};