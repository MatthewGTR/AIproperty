import OpenAI from 'openai';
import { Property } from '../types/Property';

let openai: OpenAI | null = null;

// Initialize OpenAI only if API key is available
const initializeOpenAI = () => {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  if (apiKey && apiKey !== 'your_openai_api_key_here' && apiKey.trim() !== '') {
    openai = new OpenAI({
      apiKey: apiKey,
      dangerouslyAllowBrowser: true
    });
    return true;
  }
  return false;
};

export interface LocationInfo {
  address: string;
  lat: number;
  lng: number;
  neighborhood?: string;
  city?: string;
  state?: string;
  country?: string;
}

export const searchPropertiesWithAI = async (
  userQuery: string, 
  properties: Property[],
  locationInfo?: LocationInfo
): Promise<{ response: string; matchedProperties: Property[] }> => {
  // Check if OpenAI is available
  const hasOpenAI = initializeOpenAI();
  
  if (!hasOpenAI || !openai) {
    console.warn('OpenAI API key not configured. Using fallback matching.');
    const matchedProperties = findMatchingProperties(userQuery, properties);
    const fallbackResponse = generateFallbackResponse(userQuery, matchedProperties);
    
    return {
      response: fallbackResponse,
      matchedProperties
    };
  }

  try {
    // Create a detailed property context for the AI
    const propertyContext = properties.map(p => ({
      id: p.id,
      title: p.title,
      location: p.location,
      price: p.price,
      type: p.type,
      bedrooms: p.bedrooms,
      bathrooms: p.bathrooms,
      sqft: p.sqft,
      amenities: p.amenities,
      description: p.description
    }));

    const locationContext = locationInfo ? 
      `User's current/searched location: ${locationInfo.address} (${locationInfo.lat}, ${locationInfo.lng})` : 
      '';

    const systemPrompt = `You are an expert real estate AI assistant helping users find their perfect property. 

Available Properties:
${JSON.stringify(propertyContext, null, 2)}

${locationContext}

Your task:
1. Analyze the user's query to understand their preferences (location, budget, property type, amenities, etc.)
2. Match properties from the available list based on their criteria
3. Provide a helpful, conversational response explaining why you selected these properties
4. If location is mentioned, consider proximity and neighborhood characteristics
5. Be specific about property features that match their needs
6. If no perfect matches exist, suggest the closest alternatives and explain why

Respond in a friendly, professional tone as a knowledgeable real estate expert. Keep responses concise but informative.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userQuery }
      ],
      max_tokens: 500,
      temperature: 0.7
    });

    const aiResponse = completion.choices[0]?.message?.content || 
      "I'd be happy to help you find the perfect property! Could you tell me more about what you're looking for?";

    // Simple keyword matching as fallback for property selection
    const matchedProperties = findMatchingProperties(userQuery, properties);

    return {
      response: aiResponse,
      matchedProperties
    };
  } catch (error) {
    console.warn('OpenAI API Error (falling back to local matching):', error);
    
    // Fallback to local matching if API fails
    const matchedProperties = findMatchingProperties(userQuery, properties);
    const fallbackResponse = generateFallbackResponse(userQuery, matchedProperties, locationInfo);
    
    return {
      response: fallbackResponse,
      matchedProperties
    };
  }
};

// Fallback function for when API is not available
const findMatchingProperties = (query: string, properties: Property[]): Property[] => {
  const queryLower = query.toLowerCase();
  
  const matchedProperties = properties.filter(property => {
    const searchText = `${property.title} ${property.location} ${property.description} ${property.amenities.join(' ')} ${property.type}`.toLowerCase();
    
    // Location matching
    if (queryLower.includes('downtown') && searchText.includes('downtown')) return true;
    if (queryLower.includes('beach') && searchText.includes('beach')) return true;
    if (queryLower.includes('new york') && searchText.includes('new york')) return true;
    if (queryLower.includes('california') && searchText.includes('california')) return true;
    if (queryLower.includes('austin') && searchText.includes('austin')) return true;
    if (queryLower.includes('boston') && searchText.includes('boston')) return true;
    if (queryLower.includes('miami') && searchText.includes('miami')) return true;
    
    // Property type matching
    if (queryLower.includes('apartment') && property.type === 'apartment') return true;
    if (queryLower.includes('house') && property.type === 'house') return true;
    if (queryLower.includes('villa') && property.type === 'villa') return true;
    if (queryLower.includes('condo') && property.type === 'condo') return true;
    
    // Budget matching
    if (queryLower.includes('luxury') && property.price > 1000000) return true;
    if (queryLower.includes('affordable') && property.price < 500000) return true;
    if (queryLower.includes('budget') && property.price < 600000) return true;
    
    // Amenity matching
    if (queryLower.includes('pool') && searchText.includes('pool')) return true;
    if (queryLower.includes('gym') && searchText.includes('gym')) return true;
    if (queryLower.includes('parking') && searchText.includes('parking')) return true;
    if (queryLower.includes('garden') && searchText.includes('garden')) return true;
    
    // Bedroom matching
    if (queryLower.includes('1 bed') && property.bedrooms === 1) return true;
    if (queryLower.includes('2 bed') && property.bedrooms === 2) return true;
    if (queryLower.includes('3 bed') && property.bedrooms === 3) return true;
    if (queryLower.includes('4 bed') && property.bedrooms === 4) return true;
    if (queryLower.includes('5 bed') && property.bedrooms === 5) return true;
    
    return false;
  });

  return matchedProperties.length > 0 ? matchedProperties : properties.filter(p => p.featured);
};

const generateFallbackResponse = (query: string, properties: Property[], locationInfo?: LocationInfo): string => {
  if (properties.length === 0) {
    return "I'm currently experiencing high demand and using my backup search system. I couldn't find properties matching your exact criteria, but let me show you some featured properties that might interest you. Could you provide more details about what you're looking for?";
  }
  
  if (properties.length === 1) {
    const property = properties[0];
    return `Great! Using my backup search system, I found an excellent match: "${property.title}" in ${property.location}. It's a ${property.bedrooms}-bedroom ${property.type} priced at $${property.price.toLocaleString()}. This property features ${property.amenities.slice(0, 3).join(', ')} and more. Would you like to see more details?`;
  }
  
  const priceRange = {
    min: Math.min(...properties.map(p => p.price)),
    max: Math.max(...properties.map(p => p.price))
  };
  
  const locationText = locationInfo ? ` in the ${locationInfo.city || locationInfo.address} area` : '';
  
  return `I'm using my backup search system due to high demand, but I found ${properties.length} great properties${locationText} that match your criteria! The price range is from $${priceRange.min.toLocaleString()} to $${priceRange.max.toLocaleString()}. You can see all the recommendations below. Would you like me to help narrow down the search?`;
};