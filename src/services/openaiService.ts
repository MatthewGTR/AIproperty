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
  const queryLower = query.toLowerCase();
  
  // Handle calculations
  if (queryLower.includes('calculate') || queryLower.includes('monthly payment') || queryLower.includes('mortgage')) {
    const priceMatch = query.match(/\$?(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)/);
    if (priceMatch) {
      const price = parseFloat(priceMatch[1].replace(/,/g, ''));
      const monthlyPayment = calculateMonthlyPayment(price);
      return `Based on a property price of $${price.toLocaleString()}, with a 20% down payment and 6.5% interest rate over 30 years, your estimated monthly payment would be around $${monthlyPayment.toLocaleString()}. This includes principal and interest only. Would you like me to show you properties in this price range?`;
    }
  }
  
  // Handle greetings and general questions
  if (queryLower.includes('hello') || queryLower.includes('hi') || queryLower.includes('hey')) {
    return "Hello! I'm your AI property assistant. I can help you find the perfect home, calculate mortgage payments, provide neighborhood insights, and answer any real estate questions. What are you looking for today?";
  }
  
  if (queryLower.includes('how are you') || queryLower.includes('how do you work')) {
    return "I'm doing great, thank you for asking! I'm here to help you navigate the real estate market. I can search through our property database, provide market insights, calculate costs, and give you personalized recommendations. What would you like to know about?";
  }
  
  // Handle market questions
  if (queryLower.includes('market') || queryLower.includes('trend') || queryLower.includes('price trend')) {
    return "The real estate market varies by location, but I can help you understand pricing in specific areas. Based on our current listings, I'm seeing a range from $420,000 to $2.5M. Would you like me to analyze trends for a specific location or price range?";
  }
  
  // Handle neighborhood questions
  if (queryLower.includes('neighborhood') || queryLower.includes('area') || queryLower.includes('location advice')) {
    const neighborhoods = ['Downtown areas offer urban convenience', 'Suburban areas provide family-friendly environments', 'Beachfront locations offer lifestyle benefits'];
    return `Great question about neighborhoods! ${neighborhoods[Math.floor(Math.random() * neighborhoods.length)]}. I can provide specific insights if you tell me which areas you're considering. What type of lifestyle are you looking for?`;
  }
  
  // Handle investment questions
  if (queryLower.includes('investment') || queryLower.includes('roi') || queryLower.includes('rental')) {
    return "For investment properties, I recommend looking at factors like location growth potential, rental yield, and market demand. Properties in growing areas like Austin and Miami often show good investment potential. Would you like me to show you properties that could work well as investments?";
  }
  
  // Enhanced property search responses
  if (properties.length === 0) {
    const suggestions = [
      "I couldn't find exact matches for your criteria, but I have some great alternatives! Could you tell me more about your must-haves vs nice-to-haves?",
      "No perfect matches right now, but let me show you some similar options that might surprise you. What's most important to you - location, price, or specific features?",
      "I'm not seeing exact matches, but I have some properties that might work with slight adjustments to your criteria. What's your biggest priority?"
    ];
    return suggestions[Math.floor(Math.random() * suggestions.length)];
  }
  
  if (properties.length === 1) {
    const property = properties[0];
    const responses = [
      `Perfect! I found an excellent match: "${property.title}" in ${property.location}. This ${property.bedrooms}-bedroom ${property.type} is priced at $${property.price.toLocaleString()} and features ${property.amenities.slice(0, 3).join(', ')}. The price per square foot is $${Math.round(property.price / property.sqft)}, which is competitive for the area.`,
      `Great news! "${property.title}" looks like exactly what you're looking for. Located in ${property.location}, this ${property.type} offers ${property.bedrooms} bedrooms and ${property.bathrooms} bathrooms for $${property.price.toLocaleString()}. What catches my eye is the ${property.amenities[0]} - that's a great feature!`,
      `I found a fantastic option: "${property.title}" in ${property.location}. At $${property.price.toLocaleString()} for ${property.sqft.toLocaleString()} sq ft, you're getting great value. Plus, it includes ${property.amenities.slice(0, 2).join(' and ')}. Would you like to know more about the neighborhood?`
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }
  
  const priceRange = {
    min: Math.min(...properties.map(p => p.price)),
    max: Math.max(...properties.map(p => p.price))
  };
  
  const locationText = locationInfo ? ` in the ${locationInfo.city || locationInfo.address} area` : '';
  
  const multipleResponses = [
    `Excellent! I found ${properties.length} properties${locationText} that match what you're looking for. Prices range from $${priceRange.min.toLocaleString()} to $${priceRange.max.toLocaleString()}. I've arranged them by how well they match your criteria. Which one catches your eye?`,
    `Great search results! I discovered ${properties.length} options${locationText} in your criteria. The price spread is $${priceRange.min.toLocaleString()} - $${priceRange.max.toLocaleString()}. Each has unique advantages - would you like me to highlight the best features of each?`,
    `Perfect timing! I have ${properties.length} properties${locationText} that fit your needs. Budget-wise, you're looking at $${priceRange.min.toLocaleString()} to $${priceRange.max.toLocaleString()}. Should I help you compare them or do you want to focus on a specific price range?`
  ];
  
  return multipleResponses[Math.floor(Math.random() * multipleResponses.length)];
};

// Simple mortgage calculator
const calculateMonthlyPayment = (price: number, downPaymentPercent: number = 20, interestRate: number = 6.5, years: number = 30): number => {
  const principal = price * (1 - downPaymentPercent / 100);
  const monthlyRate = interestRate / 100 / 12;
  const numPayments = years * 12;
  const monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1);
  return Math.round(monthlyPayment);
};