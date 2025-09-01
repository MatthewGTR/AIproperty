export interface LocationInfo {
  address: string;
  lat: number;
  lng: number;
  neighborhood?: string;
  city?: string;
  state?: string;
  country?: string;
}

export const geocodeAddress = async (address: string): Promise<LocationInfo | null> => {
  // Simplified geocoding - returns mock data for demo
  return {
    address: address,
    lat: 3.1390,
    lng: 101.6869,
    city: 'Kuala Lumpur',
    state: 'KL',
    country: 'Malaysia'
  };
};