import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Property } from '../types/Property';

let openai: OpenAI | null = null;
let genAI: GoogleGenerativeAI | null = null;

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

// Initialize Gemini API
const initializeGemini = () => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (apiKey && apiKey !== 'your_gemini_api_key_here' && apiKey.trim() !== '') {
    genAI = new GoogleGenerativeAI(apiKey);
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
  // First check if this is a property-related query
  const isPropertyQuery = isPropertyRelatedQuery(userQuery);
  
  // Initialize AI services
  const hasGemini = initializeGemini();
  const hasOpenAI = initializeOpenAI();

  try {
    // Try Gemini first if available
    if (hasGemini && genAI) {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      let prompt: string;
      let matchedProperties: Property[] = [];
      
      if (isPropertyQuery) {
        // Create property-specific prompt
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

        prompt = `You are an expert Malaysian real estate AI assistant helping users find their perfect property. You have deep knowledge of Malaysian property market, neighborhoods, pricing trends, and investment opportunities.

Available Properties in Malaysia:
${JSON.stringify(propertyContext, null, 2)}

${locationContext}

User Query: "${userQuery}"

Your task:
1. Analyze the user's query to understand their preferences (location, budget, property type, amenities, lifestyle needs)
2. If they mention salary/income, calculate affordability using Malaysian lending standards (typically 28% of gross income for housing)
3. STRICTLY match properties from the available list based on their criteria - only recommend properties that actually match their requirements
4. Consider Malaysian market context - areas like KLCC, Mont Kiara are premium; Johor Bahru offers value; Penang has heritage appeal
5. Provide investment insights if relevant (rental yields, capital appreciation potential)
6. If a specific location is mentioned (like "Taman Daya"), ONLY show properties from that exact location - do not show properties from other areas
7. Be specific about property features that match their needs
8. If no properties match the exact criteria, clearly state "I don't have any properties available in [location]" and suggest alternative nearby areas
9. Consider Malaysian lifestyle factors (proximity to schools, shopping malls, food courts, etc.)
10. Ask clarifying questions when information is missing (buy vs rent, budget, timeline, etc.)
11. Be conversational and engaging, like talking to a helpful friend

CRITICAL: When filtering by location, be EXACT. If user asks for "Taman Daya", only show properties with "Taman Daya" in the location field. Do not show properties from other areas.

Respond in a friendly, conversational tone as a knowledgeable Malaysian real estate expert. Use natural expressions and ask follow-up questions when needed.`;
      }

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const aiResponse = response.text();

      return {
        response: aiResponse,
        matchedProperties: isPropertyQuery ? findMatchingPropertiesEnhanced(userQuery, properties, locationInfo) : []
      };
    }

    // Fallback to OpenAI if Gemini is not available
    if (hasOpenAI && openai) {
      let systemPrompt: string;
      let matchedProperties: Property[] = [];
      
      if (isPropertyQuery) {
        matchedProperties = findMatchingPropertiesEnhanced(userQuery, properties, locationInfo);
        
        const propertyContext = properties.map(p => ({
      };
    } else {
      // Handle non-property questions with simple responses
      const simpleResponse = handleNonPropertyQuery(userQuery);
      return {
        response: simpleResponse,
        matchedProperties: []
      };
    }

  } catch (error) {
    console.warn('AI API Error (falling back to local matching):', error);
    
    if (isPropertyQuery) {
      const matchedProperties = findMatchingProperties(userQuery, properties);
      const fallbackResponse = generateFallbackResponse(userQuery, matchedProperties, locationInfo);
      
      return {
        response: fallbackResponse,
        matchedProperties
      };
    } else {
      const simpleResponse = handleNonPropertyQuery(userQuery);
      return {
        response: simpleResponse,
        matchedProperties: []
      };
    }
  }
};

// Enhanced property matching function for better AI integration
const findMatchingPropertiesEnhanced = (query: string, properties: Property[], locationInfo?: LocationInfo): Property[] => {
  const queryLower = query.toLowerCase();
  
  // First, check for exact location matches
  const exactLocationMatches = properties.filter(property => {
    const propertyLocation = property.location.toLowerCase();
    
    // Check for exact location name matches
    if (queryLower.includes('taman daya') && propertyLocation.includes('taman daya')) return true;
    if (queryLower.includes('taman molek') && propertyLocation.includes('taman molek')) return true;
    if (queryLower.includes('sutera utama') && propertyLocation.includes('sutera utama')) return true;
    if (queryLower.includes('mount austin') && propertyLocation.includes('mount austin')) return true;
    if (queryLower.includes('klcc') && propertyLocation.includes('klcc')) return true;
    if (queryLower.includes('mont kiara') && propertyLocation.includes('mont kiara')) return true;
    if (queryLower.includes('bangsar') && propertyLocation.includes('bangsar')) return true;
    if (queryLower.includes('petaling jaya') && propertyLocation.includes('petaling jaya')) return true;
    if (queryLower.includes('damansara heights') && propertyLocation.includes('damansara heights')) return true;
    
    return false;
  });
  
  // If we found exact location matches, return only those
  if (exactLocationMatches.length > 0) {
    return exactLocationMatches;
  }
  
  // Handle salary-based affordability first
  if (queryLower.includes('salary') || queryLower.includes('income') || queryLower.includes('earn') || queryLower.includes('afford')) {
    const salaryMatch = query.match(/rm\s*(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)/i);
    if (salaryMatch) {
      const salary = parseFloat(salaryMatch[1].replace(/,/g, ''));
      const affordablePrice = calculateAffordablePrice(salary);
      const affordableProperties = properties.filter(p => p.price <= affordablePrice);
      
      if (affordableProperties.length > 0) {
        return affordableProperties.sort((a, b) => a.price - b.price);
      } else {
        return properties.sort((a, b) => a.price - b.price).slice(0, 5);
      }
    }
  }
  
  // Enhanced location matching with proximity if locationInfo is available
  let locationFilteredProperties = properties;
  if (locationInfo) {
    // If user has location context, prioritize nearby properties
    locationFilteredProperties = properties.filter(property => {
      const propertyLocation = property.location.toLowerCase();
      const userCity = locationInfo.city?.toLowerCase() || '';
      const userState = locationInfo.state?.toLowerCase() || '';
      
      // Check if property is in same city or state
      return propertyLocation.includes(userCity) || 
             propertyLocation.includes(userState) ||
             (userState === 'johor' && propertyLocation.includes('johor')) ||
             (userState === 'selangor' && (propertyLocation.includes('kuala lumpur') || propertyLocation.includes('selangor')));
    });
    
    // If no local matches, use all properties
    if (locationFilteredProperties.length === 0) {
      locationFilteredProperties = properties;
    }
  }
  
  // Apply existing matching logic to filtered properties
  const matchedProperties = findMatchingProperties(query, locationFilteredProperties);
  
  // If still no matches, return featured properties
  return matchedProperties.length > 0 ? matchedProperties : properties.filter(p => p.featured);
};

// Fallback function for when API is not available
const findMatchingProperties = (query: string, properties: Property[]): Property[] => {
  const queryLower = query.toLowerCase();
  
  // First, check for exact location matches
  const exactLocationMatches = properties.filter(property => {
    const propertyLocation = property.location.toLowerCase();
    
    // Check for exact location name matches
    if (queryLower.includes('taman daya') && propertyLocation.includes('taman daya')) return true;
    if (queryLower.includes('taman molek') && propertyLocation.includes('taman molek')) return true;
    if (queryLower.includes('sutera utama') && propertyLocation.includes('sutera utama')) return true;
    if (queryLower.includes('mount austin') && propertyLocation.includes('mount austin')) return true;
    if (queryLower.includes('klcc') && propertyLocation.includes('klcc')) return true;
    if (queryLower.includes('mont kiara') && propertyLocation.includes('mont kiara')) return true;
    if (queryLower.includes('bangsar') && propertyLocation.includes('bangsar')) return true;
    if (queryLower.includes('petaling jaya') && propertyLocation.includes('petaling jaya')) return true;
    if (queryLower.includes('damansara heights') && propertyLocation.includes('damansara heights')) return true;
    
    return false;
  });
  
  // If we found exact location matches, return only those
  if (exactLocationMatches.length > 0) {
    return exactLocationMatches;
  }
  
  // Handle salary-based affordability first
  if (queryLower.includes('salary') || queryLower.includes('income') || queryLower.includes('earn') || queryLower.includes('afford')) {
    const salaryMatch = query.match(/(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)/);
    if (salaryMatch) {
      const salary = parseFloat(salaryMatch[1].replace(/,/g, ''));
      const affordablePrice = calculateAffordablePrice(salary);
      const affordableProperties = properties.filter(p => p.price <= affordablePrice);
      
      // Return affordable properties if found, otherwise return cheapest properties
      if (affordableProperties.length > 0) {
        return affordableProperties.sort((a, b) => a.price - b.price);
      } else {
        // If no properties within budget, show the 5 cheapest properties
        return properties.sort((a, b) => a.price - b.price).slice(0, 5);
      }
    }
  }
  
  let matchedProperties = properties.filter(property => {
    const searchText = `${property.title} ${property.location} ${property.description} ${property.amenities.join(' ')} ${property.type}`.toLowerCase();
    
    // Price range matching
    const priceMatch = queryLower.match(/rm\s*(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)/);
    if (priceMatch) {
      const maxPrice = parseFloat(priceMatch[1].replace(/,/g, ''));
      if (queryLower.includes('under') || queryLower.includes('below') || queryLower.includes('less than')) {
        if (property.price <= maxPrice) return true;
      }
      if (queryLower.includes('around') || queryLower.includes('about')) {
        if (property.price >= maxPrice * 0.8 && property.price <= maxPrice * 1.2) return true;
      }
    }
    
    // Malaysian location matching
    if (queryLower.includes('johor') && searchText.includes('johor')) return true;
    if (queryLower.includes('kuala lumpur') && searchText.includes('kuala lumpur')) return true;
    if (queryLower.includes('kl') && searchText.includes('kuala lumpur')) return true;
    if (queryLower.includes('selangor') && searchText.includes('selangor')) return true;
    if (queryLower.includes('penang') && searchText.includes('penang')) return true;
    if (queryLower.includes('sabah') && searchText.includes('sabah')) return true;
    if (queryLower.includes('klcc') && searchText.includes('klcc')) return true;
    if (queryLower.includes('mont kiara') && searchText.includes('mont kiara')) return true;
    if (queryLower.includes('bangsar') && searchText.includes('bangsar')) return true;
    if (queryLower.includes('petaling jaya') && searchText.includes('petaling jaya')) return true;
    if (queryLower.includes('cyberjaya') && searchText.includes('cyberjaya')) return true;
    if (queryLower.includes('putrajaya') && searchText.includes('putrajaya')) return true;
    
    // Location matching
    if (queryLower.includes('downtown') && searchText.includes('downtown')) return true;
    if (queryLower.includes('beach') && searchText.includes('beach')) return true;
    if (queryLower.includes('city center') && searchText.includes('city')) return true;
    if (queryLower.includes('waterfront') && searchText.includes('waterfront')) return true;
    
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
    
    // General keyword matching
    const keywords = queryLower.split(' ').filter(word => word.length > 2);
    const matchCount = keywords.filter(keyword => searchText.includes(keyword)).length;
    if (matchCount >= Math.min(2, keywords.length)) return true;
    
    return false;
  });

  // If no matches found, try broader search
  if (matchedProperties.length === 0) {
    matchedProperties = properties.filter(property => {
      const searchText = `${property.title} ${property.location} ${property.description}`.toLowerCase();
      const keywords = queryLower.split(' ').filter(word => word.length > 3);
      return keywords.some(keyword => searchText.includes(keyword));
    });
  }
  
  // Return matched properties or featured as fallback
  return matchedProperties.length > 0 ? matchedProperties : properties.filter(p => p.featured);
};

const generateFallbackResponse = (query: string, properties: Property[], locationInfo?: LocationInfo): string => {
  const queryLower = query.toLowerCase();
  
  // Handle specific location queries
  if (queryLower.includes('taman daya')) {
    if (properties.length === 0) {
      return "I don't have any properties currently available in Taman Daya. However, I can show you similar properties in nearby areas like Taman Molek or other parts of Johor Bahru. Would you like me to search for alternatives?";
    }
    const tamanDayaProperties = properties.filter(p => p.location.toLowerCase().includes('taman daya'));
    if (tamanDayaProperties.length > 0) {
      return `Great! I found ${tamanDayaProperties.length} property(ies) in Taman Daya, Johor Bahru. Taman Daya is a well-established residential area known for its family-friendly environment, good schools, and convenient access to amenities. The properties range from RM${Math.min(...tamanDayaProperties.map(p => p.price)).toLocaleString()} to RM${Math.max(...tamanDayaProperties.map(p => p.price)).toLocaleString()}.`;
    }
  }
  
  // Handle salary-based affordability questions
  if (queryLower.includes('salary') || queryLower.includes('income') || queryLower.includes('earn') || queryLower.includes('afford')) {
    const salaryMatch = query.match(/(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)/);
    if (salaryMatch) {
      const salary = parseFloat(salaryMatch[1].replace(/,/g, ''));
      const affordablePrice = calculateAffordablePrice(salary);
      
      return `Based on a salary of RM${salary.toLocaleString()}, you can typically afford a property up to RM${affordablePrice.toLocaleString()} (following the 28% rule). Your estimated monthly payment would be around RM${calculateMonthlyPayment(affordablePrice).toLocaleString()}. Let me show you properties within your budget range.`;
    }
    return "I'd be happy to help you find properties within your budget! Could you tell me your monthly or annual salary in RM? I'll calculate what you can afford and show you suitable options.";
  }
  
  // Handle location queries (where is...)
  if (queryLower.includes('where is') || queryLower.includes('location of') || queryLower.includes('find location')) {
    const locationMatch = query.match(/where is (.+?)[\?\.]*$/i) || query.match(/location of (.+?)[\?\.]*$/i);
    if (locationMatch) {
      const searchLocation = locationMatch[1].trim();
      return `I'd be happy to help you find "${searchLocation}"! Let me search for that location and show you any available properties in that area. This location might be in Malaysia or another region - I can help you understand the area and find suitable properties nearby. Would you like me to search for properties in ${searchLocation}?`;
    }
  }
  
  // Handle calculations
  if (queryLower.includes('calculate') || queryLower.includes('monthly payment') || queryLower.includes('mortgage')) {
    const priceMatch = query.match(/RM?(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)/);
    if (priceMatch) {
      const price = parseFloat(priceMatch[1].replace(/,/g, ''));
      const monthlyPayment = calculateMonthlyPayment(price);
      return `Based on a property price of RM${price.toLocaleString()}, with a 20% down payment and 6.5% interest rate over 30 years, your estimated monthly payment would be around RM${monthlyPayment.toLocaleString()}. This includes principal and interest only. Would you like me to show you properties in this price range?`;
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
    return "The real estate market varies by location, but I can help you understand pricing in specific areas. Based on our current listings, I'm seeing a range from RM280,000 to RM3.2M. Would you like me to analyze trends for a specific location or price range?";
  }
  
  // Handle neighborhood questions
  if (queryLower.includes('neighborhood') || queryLower.includes('area') || queryLower.includes('location advice')) {
    const neighborhoods = ['Downtown areas offer urban convenience', 'Suburban areas provide family-friendly environments', 'Beachfront locations offer lifestyle benefits'];
    return `Great question about neighborhoods! ${neighborhoods[Math.floor(Math.random() * neighborhoods.length)]}. I can provide specific insights if you tell me which areas you're considering. What type of lifestyle are you looking for?`;
  }
  
  // Handle investment questions
  if (queryLower.includes('investment') || queryLower.includes('roi') || queryLower.includes('rental')) {
    return "For investment properties, I recommend looking at factors like location growth potential, rental yield, and market demand. Properties in growing areas like Johor Bahru and Kuala Lumpur often show good investment potential. Would you like me to show you properties that could work well as investments?";
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
      `Perfect! I found an excellent match: "${property.title}" in ${property.location}. This ${property.bedrooms}-bedroom ${property.type} is priced at RM${property.price.toLocaleString()} and features ${property.amenities.slice(0, 3).join(', ')}. The price per square foot is RM${Math.round(property.price / property.sqft)}, which is competitive for the area.`,
      `Great news! "${property.title}" looks like exactly what you're looking for. Located in ${property.location}, this ${property.type} offers ${property.bedrooms} bedrooms and ${property.bathrooms} bathrooms for RM${property.price.toLocaleString()}. What catches my eye is the ${property.amenities[0]} - that's a great feature!`,
      `I found a fantastic option: "${property.title}" in ${property.location}. At RM${property.price.toLocaleString()} for ${property.sqft.toLocaleString()} sq ft, you're getting great value. Plus, it includes ${property.amenities.slice(0, 2).join(' and ')}. Would you like to know more about the neighborhood?`
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }
  
  const priceRange = {
    min: Math.min(...properties.map(p => p.price)),
    max: Math.max(...properties.map(p => p.price))
  };
  
  const locationText = locationInfo ? ` in the ${locationInfo.city || locationInfo.address} area` : '';
  
  const multipleResponses = [
    `Excellent! I found ${properties.length} properties${locationText} that match what you're looking for. Prices range from RM${priceRange.min.toLocaleString()} to RM${priceRange.max.toLocaleString()}. I've arranged them by how well they match your criteria. Which one catches your eye?`,
    `Great search results! I discovered ${properties.length} options${locationText} in your criteria. The price spread is RM${priceRange.min.toLocaleString()} - RM${priceRange.max.toLocaleString()}. Each has unique advantages - would you like me to highlight the best features of each?`,
    `Perfect timing! I have ${properties.length} properties${locationText} that fit your needs. Budget-wise, you're looking at RM${priceRange.min.toLocaleString()} to RM${priceRange.max.toLocaleString()}. Should I help you compare them or do you want to focus on a specific price range?`
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

// Calculate affordable property price based on salary
const calculateAffordablePrice = (annualSalary: number): number => {
  // Using the 28% rule: housing costs should not exceed 28% of gross monthly income
  const monthlyIncome = annualSalary / 12;
  const maxMonthlyPayment = monthlyIncome * 0.28;
  
  // Calculate maximum loan amount based on monthly payment
  const interestRate = 6.5; // 6.5% annual interest rate
  const years = 30;
  const monthlyRate = interestRate / 100 / 12;
  const numPayments = years * 12;
  
  const maxLoanAmount = maxMonthlyPayment * (Math.pow(1 + monthlyRate, numPayments) - 1) / (monthlyRate * Math.pow(1 + monthlyRate, numPayments));
  
  // Assuming 20% down payment
  const maxPropertyPrice = maxLoanAmount / 0.8;
  
  return Math.round(maxPropertyPrice);
};

// Function to detect if query is property-related
const isPropertyRelatedQuery = (query: string): boolean => {
  const queryLower = query.toLowerCase();
  
  // Property-related keywords
  const propertyKeywords = [
    'house', 'apartment', 'condo', 'villa', 'property', 'home', 'rent', 'buy', 'purchase',
    'bedroom', 'bathroom', 'sqft', 'square feet', 'price', 'budget', 'location', 'area',
    'neighborhood', 'amenities', 'pool', 'gym', 'parking', 'garden', 'balcony',
    'mortgage', 'loan', 'down payment', 'investment', 'rental', 'yield',
    'taman', 'klcc', 'mont kiara', 'bangsar', 'petaling jaya', 'johor', 'penang',
    'kuala lumpur', 'selangor', 'cyberjaya', 'putrajaya', 'damansara',
    'real estate', 'agent', 'listing', 'viewing', 'tour', 'inspection'
  ];
  
  // Check if query contains property-related keywords
  const hasPropertyKeywords = propertyKeywords.some(keyword => queryLower.includes(keyword));
  
  // Check for salary/affordability questions (these are property-related)
  const isAffordabilityQuery = queryLower.includes('salary') || queryLower.includes('afford') || queryLower.includes('income');
  
  // Check for location questions that might be property-related
  const isLocationQuery = (queryLower.includes('where is') || queryLower.includes('location of')) && 
                          propertyKeywords.some(keyword => queryLower.includes(keyword));
  
  return hasPropertyKeywords || isAffordabilityQuery || isLocationQuery;
};

// Function to handle non-property queries
const handleNonPropertyQuery = (query: string): string => {
  const queryLower = query.toLowerCase();
  
  // Math questions
  if (queryLower.includes('+') || queryLower.includes('-') || queryLower.includes('*') || queryLower.includes('/') || 
      queryLower.includes('plus') || queryLower.includes('minus') || queryLower.includes('times') || queryLower.includes('divided')) {
    
    // Simple math evaluation for basic operations
    try {
      // Handle "1+1" type questions
      const mathMatch = query.match(/(\d+)\s*[\+\-\*\/]\s*(\d+)/);
      if (mathMatch) {
        const result = eval(mathMatch[0]); // Note: eval is generally unsafe, but for simple math it's okay
        return `The answer is ${result}! 😊\n\nBy the way, I'm primarily a real estate assistant. Is there anything about properties or homes I can help you with today?`;
      }
    } catch (error) {
      return `I can help with simple math, but I'm primarily a real estate assistant! Is there anything about properties or homes I can help you with?`;
    }
  }
  
  // Greetings
  if (queryLower.includes('hello') || queryLower.includes('hi') || queryLower.includes('hey')) {
    return `Hello there! 👋 I'm your AI property assistant. While I can chat about various topics, I'm especially good at helping you find the perfect home! Are you looking to buy or rent a property?`;
  }
  
  // General questions
  if (queryLower.includes('how are you')) {
    return `I'm doing great, thanks for asking! 😊 I'm here and ready to help you with all your property needs. Are you looking for a new home, or do you have questions about the real estate market?`;
  }
  
  // Weather questions
  if (queryLower.includes('weather')) {
    return `I don't have access to current weather data, but I can tell you about properties with great weather protection features like covered parking, indoor pools, or climate-controlled spaces! What kind of property are you interested in?`;
  }
  
  // Time questions
  if (queryLower.includes('time') || queryLower.includes('date')) {
    return `I don't have access to real-time information, but I can help you find properties available right now! Are you looking to move in soon? I can show you properties with immediate availability.`;
  }
  
  // Default response for other non-property questions
  return `That's an interesting question! While I can chat about various topics, I'm specifically designed to be your real estate expert. I can help you find properties, calculate affordability, provide neighborhood insights, and answer all your property-related questions. What kind of home are you looking for?`;
};