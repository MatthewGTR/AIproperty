import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Property } from '../types/Property';

let openai: OpenAI | null = null;
let genAI: GoogleGenerativeAI | null = null;
let isInitialized = false;

function initAI() {
  if (isInitialized) return;
  
  const openaiKey = import.meta.env.VITE_OPENAI_API_KEY;
  const geminiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
  console.log('Initializing AI services...');
  console.log('OpenAI key available:', !!openaiKey && openaiKey !== 'your_openai_api_key_here');
  console.log('Gemini key available:', !!geminiKey && geminiKey !== 'your_gemini_api_key_here');
  
  if (openaiKey && openaiKey !== 'your_openai_api_key_here' && openaiKey.trim()) {
    try {
      openai = new OpenAI({ apiKey: openaiKey, dangerouslyAllowBrowser: true });
      console.log('OpenAI initialized successfully');
    } catch (error) {
      console.error('Failed to initialize OpenAI:', error);
      openai = null;
    }
  }
  
  if (geminiKey && geminiKey !== 'your_gemini_api_key_here' && geminiKey.trim()) {
    try {
      genAI = new GoogleGenerativeAI(geminiKey);
      console.log('Gemini initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Gemini:', error);
      genAI = null;
    }
  }
  
  isInitialized = true;
}

// Initialize AI services when module loads
initAI();

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
  // First, find relevant properties
  const matchedProperties = findRelevantProperties(userQuery, properties, locationInfo);
  
  // Generate appropriate response based on matches
  let aiResponse = '';

  if (matchedProperties.length > 0) {
    const intentInfo = getIntentInfo(userQuery);
    aiResponse = `Great! I found ${matchedProperties.length} ${intentInfo} that match your criteria.`;
  } else {
    aiResponse = generateNoMatchResponse(userQuery);
  }

  return {
    response: aiResponse,
    matchedProperties
  };
};

const generateNoMatchResponse = (userQuery: string): string => {
  const q = userQuery.toLowerCase();
  
  // Detect intent
  const buyKeywords = ['buy', 'buying', 'purchase', 'purchasing', 'own', 'ownership', 'invest', 'investment'];
  const rentKeywords = ['rent', 'rental', 'renting', 'lease', 'leasing', 'tenant', 'monthly'];
  
  const isBuyIntent = buyKeywords.some(keyword => q.includes(keyword));
  const isRentIntent = rentKeywords.some(keyword => q.includes(keyword));
  
  let response = '';
  
  if (isBuyIntent) {
    response = "I couldn't find properties for sale matching your criteria. Could you provide:\n• Your budget range?\n• Preferred area or city?\n• Number of bedrooms?\n• Any specific amenities?";
  } else if (isRentIntent) {
    response = "I couldn't find rental properties matching your requirements. Could you provide:\n• Your monthly budget?\n• Preferred area?\n• Number of bedrooms?\n• Furnished or unfurnished preference?";
  } else {
    response = "I'd love to help you find the perfect property! Could you tell me:\n• Are you looking to buy or rent?\n• Your budget?\n• Preferred area?\n• Property type?";
  }
  
  return response;
};

const getIntentInfo = (userQuery: string): string => {
  const q = userQuery.toLowerCase();
  const buyKeywords = ['buy', 'buying', 'purchase', 'purchasing', 'own', 'ownership', 'invest', 'investment'];
  const rentKeywords = ['rent', 'rental', 'renting', 'lease', 'leasing', 'tenant', 'monthly'];
  
  const isBuyIntent = buyKeywords.some(keyword => q.includes(keyword));
  const isRentIntent = rentKeywords.some(keyword => q.includes(keyword));
  
  if (isBuyIntent && !isRentIntent) {
    return 'properties for sale';
  } else if (isRentIntent && !isBuyIntent) {
    return 'rental properties';
  } else {
    return 'properties';
  }
};


const findRelevantProperties = (query: string, properties: Property[], locationInfo?: LocationInfo): Property[] => {
  const q = query.toLowerCase();
  
  // Intent detection - Buy vs Rent
  const buyKeywords = ['buy', 'buying', 'purchase', 'purchasing', 'own', 'ownership', 'invest', 'investment', 'mortgage', 'loan', 'down payment', 'for sale'];
  const rentKeywords = ['rent', 'rental', 'renting', 'lease', 'leasing', 'tenant', 'monthly', 'deposit', 'furnished', 'for rent'];
  
  const isBuyIntent = buyKeywords.some(keyword => q.includes(keyword));
  const isRentIntent = rentKeywords.some(keyword => q.includes(keyword));
  
  // Filter properties based on intent
  let filteredProperties: Property[] = [];
  
  if (isBuyIntent && !isRentIntent) {
    // User wants to buy - show only sale properties
    filteredProperties = properties.filter(p => p.listing_type === 'sale');
  } else if (isRentIntent && !isBuyIntent) {
    // User wants to rent - show only rental properties
    filteredProperties = properties.filter(p => p.listing_type === 'rent');
  } else {
    // No clear intent - use all properties
    filteredProperties = properties;
  }
  
  // Location-based matching
  const locationKeywords = [
    'johor bahru', 'jb', 'kuala lumpur', 'kl', 'penang', 'selangor',
    'taman daya', 'taman molek', 'sutera', 'mount austin', 'klcc',
    'mont kiara', 'bangsar', 'cyberjaya', 'petaling jaya', 'pj'
  ];
  
  for (const location of locationKeywords) {
    if (q.includes(location)) {
      const matches = filteredProperties.filter(p => 
        p.city?.toLowerCase().includes(location) || 
        p.address?.toLowerCase().includes(location)
      );
      if (matches.length > 0) return matches.slice(0, 3);
    }
  }
  
  // Price range matching
  const priceMatch = q.match(/(?:under|below|less than|maximum|max|up to|budget)\s*rm?\s*(\d{1,3}(?:,?\d{3})*(?:k|000)?)/i);
  if (priceMatch) {
    let targetPrice = parseFloat(priceMatch[1].replace(/,/g, ''));
    if (priceMatch[1].toLowerCase().includes('k')) {
      targetPrice *= 1000;
    }
    
    const matches = filteredProperties.filter(p => 
      p.price <= targetPrice
    ).sort((a, b) => a.price - b.price);
    
    if (matches.length > 0) return matches.slice(0, 3);
  }
  
  // Property type matching
  const typeKeywords = {
    'house': 'house',
    'apartment': 'apartment',
    'condo': 'condo',
    'villa': 'villa',
    'studio': 'studio'
  };
  
  for (const [keyword, type] of Object.entries(typeKeywords)) {
    if (q.includes(keyword)) {
      const matches = filteredProperties.filter(p => p.property_type === type);
      if (matches.length > 0) return matches.slice(0, 3);
    }
  }
  
  // Bedroom/bathroom matching
  const bedroomMatch = query.match(/(\d+)\s*(?:bed|bedroom)/i);
  if (bedroomMatch) {
    const bedrooms = parseInt(bedroomMatch[1]);
    const matches = filteredProperties.filter(p => p.bedrooms === bedrooms);
    if (matches.length > 0) return matches.slice(0, 3);
  }
  
  // If no specific matches, return empty array
  return [];
}