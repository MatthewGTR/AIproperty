import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { PropertyWithImages } from './propertyService';

let openai: OpenAI | null = null;
let genAI: GoogleGenerativeAI | null = null;
let isInitialized = false;

function initAI() {
  if (isInitialized) return;
  
  const openaiKey = import.meta.env.VITE_OPENAI_API_KEY;
  const geminiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
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
  properties: PropertyWithImages[],
  locationInfo?: LocationInfo
): Promise<{ response: string; matchedProperties: PropertyWithImages[] }> => {
  
  // Check if this is a property-related query
  const isPropertyQuery = isPropertyRelated(userQuery);
  
  if (!isPropertyQuery) {
    // Handle non-property questions with ChatGPT
    const chatResponse = await handleGeneralChat(userQuery);
    return {
      response: chatResponse,
      matchedProperties: []
    };
  }

  // Enhanced property matching with aggressive keyword detection
  const matchedProperties = findRelevantPropertiesEnhanced(userQuery, properties, locationInfo);
  
  let aiResponse = '';
  
  if (matchedProperties.length > 0) {
    const intentInfo = getIntentInfo(userQuery);
    const locationInfo = extractLocationFromQuery(userQuery);
    const priceInfo = extractPriceFromQuery(userQuery);
    
    aiResponse = `Perfect! I found ${matchedProperties.length} ${intentInfo}`;
    if (locationInfo) aiResponse += ` in ${locationInfo}`;
    if (priceInfo) aiResponse += ` within your budget`;
    aiResponse += `. Here are my top recommendations:`;
  } else {
    aiResponse = generateSmartFollowUp(userQuery);
  }

  return {
    response: aiResponse,
    matchedProperties
  };
};

const isPropertyRelated = (query: string): boolean => {
  const propertyKeywords = [
    // Transaction types
    'buy', 'buying', 'purchase', 'rent', 'rental', 'lease', 'sell', 'selling',
    // Property types
    'house', 'apartment', 'condo', 'villa', 'studio', 'room', 'flat', 'home', 'property', 'unit',
    'terrace', 'semi-d', 'bungalow', 'townhouse', 'duplex', 'penthouse', 'shophouse',
    // Features
    'bedroom', 'bathroom', 'sqft', 'parking', 'furnished', 'pool', 'gym', 'security',
    // Locations (Malaysia specific)
    'johor', 'kuala lumpur', 'kl', 'penang', 'selangor', 'klcc', 'mont kiara', 'bangsar',
    'petaling jaya', 'pj', 'cyberjaya', 'shah alam', 'subang', 'damansara', 'cheras',
    'ampang', 'kajang', 'putrajaya', 'taman', 'jalan', 'bukit', 'bandar',
    // Price related
    'rm', 'ringgit', 'price', 'budget', 'cost', 'expensive', 'cheap', 'affordable',
    'under', 'below', 'above', 'maximum', 'minimum', 'k', '000',
    // Real estate terms
    'agent', 'listing', 'mortgage', 'loan', 'deposit', 'investment', 'viewing', 'tour'
  ];
  
  const query_lower = query.toLowerCase();
  return propertyKeywords.some(keyword => query_lower.includes(keyword));
};

const handleGeneralChat = async (query: string): Promise<string> => {
  try {
    if (openai) {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a friendly AI assistant. Keep responses concise (2-3 sentences max) and helpful. If asked about properties, redirect to property search."
          },
          {
            role: "user",
            content: query
          }
        ],
        max_tokens: 150,
        temperature: 0.7
      });
      
      return completion.choices[0]?.message?.content || "I'm here to help! Feel free to ask me anything about properties or just chat.";
    } else if (genAI) {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const result = await model.generateContent(`You are a friendly AI assistant. Keep responses concise (2-3 sentences max). User query: ${query}`);
      const response = await result.response;
      return response.text() || "I'm here to help! Feel free to ask me anything about properties or just chat.";
    }
  } catch (error) {
    console.error('Error with AI chat:', error);
  }
  
  // Fallback responses for entertainment
  const fallbackResponses = [
    "That's interesting! I'm primarily a property expert, but I enjoy chatting. Is there anything about real estate I can help you with?",
    "I'd love to chat more about that! By the way, are you looking for any properties? I have some great recommendations.",
    "Thanks for sharing! I'm here whenever you want to explore properties or just have a friendly conversation.",
    "That's cool! I'm always here to help with property searches or just to chat when you're taking a break."
  ];
  
  return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
};

const findRelevantPropertiesEnhanced = (query: string, properties: PropertyWithImages[], locationInfo?: LocationInfo): PropertyWithImages[] => {
  const q = query.toLowerCase();
  
  // Enhanced intent detection with more keywords
  const buyKeywords = ['buy', 'buying', 'purchase', 'purchasing', 'own', 'ownership', 'invest', 'investment', 'mortgage', 'loan', 'down payment', 'for sale', 'acquire', 'get', 'want to own'];
  const rentKeywords = ['rent', 'rental', 'renting', 'lease', 'leasing', 'tenant', 'monthly', 'deposit', 'furnished', 'for rent', 'stay', 'live', 'temporary'];
  
  const isBuyIntent = buyKeywords.some(keyword => q.includes(keyword));
  const isRentIntent = rentKeywords.some(keyword => q.includes(keyword));
  
  // Filter by intent first
  let filteredProperties = properties;
  if (isBuyIntent && !isRentIntent) {
    filteredProperties = properties.filter(p => p.listing_type === 'sale');
  } else if (isRentIntent && !isBuyIntent) {
    filteredProperties = properties.filter(p => p.listing_type === 'rent');
  }
  
  // Enhanced location matching with more variations
  const locationMatches = findLocationMatches(q, filteredProperties);
  if (locationMatches.length > 0) {
    filteredProperties = locationMatches;
  }
  
  // Enhanced price matching
  const priceMatches = findPriceMatches(q, filteredProperties);
  if (priceMatches.length > 0) {
    filteredProperties = priceMatches;
  }
  
  // Enhanced property type matching
  const typeMatches = findTypeMatches(q, filteredProperties);
  if (typeMatches.length > 0) {
    filteredProperties = typeMatches;
  }
  
  // Enhanced bedroom matching
  const bedroomMatches = findBedroomMatches(q, filteredProperties);
  if (bedroomMatches.length > 0) {
    filteredProperties = bedroomMatches;
  }
  
  // Enhanced amenity matching
  const amenityMatches = findAmenityMatches(q, filteredProperties);
  if (amenityMatches.length > 0) {
    filteredProperties = amenityMatches;
  }
  
  // Sort by relevance and return top matches
  return filteredProperties.slice(0, 4);
};

const findLocationMatches = (query: string, properties: PropertyWithImages[]): PropertyWithImages[] => {
  const locationKeywords = [
    // Major cities
    { keywords: ['johor bahru', 'jb', 'johor'], match: ['johor', 'jb'] },
    { keywords: ['kuala lumpur', 'kl'], match: ['kuala lumpur', 'kl'] },
    { keywords: ['penang', 'georgetown'], match: ['penang'] },
    { keywords: ['selangor'], match: ['selangor'] },
    
    // Specific areas
    { keywords: ['klcc', 'city centre', 'city center'], match: ['klcc', 'city centre', 'city center'] },
    { keywords: ['mont kiara'], match: ['mont kiara'] },
    { keywords: ['bangsar'], match: ['bangsar'] },
    { keywords: ['petaling jaya', 'pj'], match: ['petaling jaya', 'pj'] },
    { keywords: ['cyberjaya'], match: ['cyberjaya'] },
    { keywords: ['shah alam'], match: ['shah alam'] },
    { keywords: ['subang'], match: ['subang'] },
    { keywords: ['damansara'], match: ['damansara'] },
    { keywords: ['cheras'], match: ['cheras'] },
    { keywords: ['ampang'], match: ['ampang'] },
    { keywords: ['kajang'], match: ['kajang'] },
    { keywords: ['putrajaya'], match: ['putrajaya'] },
    
    // Johor specific
    { keywords: ['taman daya'], match: ['taman daya'] },
    { keywords: ['taman molek'], match: ['taman molek'] },
    { keywords: ['sutera'], match: ['sutera'] },
    { keywords: ['mount austin'], match: ['mount austin'] },
    { keywords: ['iskandar'], match: ['iskandar'] },
    { keywords: ['medini'], match: ['medini'] }
  ];
  
  for (const location of locationKeywords) {
    if (location.keywords.some(keyword => query.includes(keyword))) {
      const matches = properties.filter(p => 
        location.match.some(match => 
          p.city?.toLowerCase().includes(match) || 
          p.address?.toLowerCase().includes(match) ||
          p.state?.toLowerCase().includes(match)
        )
      );
      if (matches.length > 0) return matches;
    }
  }
  
  return [];
};

const findPriceMatches = (query: string, properties: PropertyWithImages[]): PropertyWithImages[] => {
  // Enhanced price detection patterns
  const pricePatterns = [
    /(?:under|below|less than|maximum|max|up to|budget)\s*rm?\s*(\d{1,3}(?:,?\d{3})*(?:k|000)?)/i,
    /(?:above|over|more than|minimum|min|from)\s*rm?\s*(\d{1,3}(?:,?\d{3})*(?:k|000)?)/i,
    /rm?\s*(\d{1,3}(?:,?\d{3})*(?:k|000)?)\s*(?:to|-)?\s*rm?\s*(\d{1,3}(?:,?\d{3})*(?:k|000)?)/i,
    /budget\s*rm?\s*(\d{1,3}(?:,?\d{3})*(?:k|000)?)/i
  ];
  
  for (const pattern of pricePatterns) {
    const match = query.match(pattern);
    if (match) {
      let price1 = parseFloat(match[1].replace(/,/g, ''));
      if (match[1].toLowerCase().includes('k')) price1 *= 1000;
      
      let price2 = match[2] ? parseFloat(match[2].replace(/,/g, '')) : null;
      if (price2 && match[2].toLowerCase().includes('k')) price2 *= 1000;
      
      let matches: PropertyWithImages[] = [];
      
      if (query.includes('under') || query.includes('below') || query.includes('max')) {
        matches = properties.filter(p => p.price <= price1);
      } else if (query.includes('above') || query.includes('over') || query.includes('min')) {
        matches = properties.filter(p => p.price >= price1);
      } else if (price2) {
        matches = properties.filter(p => p.price >= price1 && p.price <= price2);
      } else {
        matches = properties.filter(p => Math.abs(p.price - price1) / price1 <= 0.2);
      }
      
      if (matches.length > 0) return matches.sort((a, b) => a.price - b.price);
    }
  }
  
  return [];
};

const findTypeMatches = (query: string, properties: PropertyWithImages[]): PropertyWithImages[] => {
  const typeKeywords = {
    'house': ['house', 'home', 'landed', 'terrace', 'semi-d', 'bungalow', 'townhouse'],
    'apartment': ['apartment', 'flat', 'unit'],
    'condo': ['condo', 'condominium'],
    'villa': ['villa', 'luxury home'],
    'studio': ['studio', 'studio apartment'],
    'shophouse': ['shophouse', 'shop house']
  };
  
  for (const [type, keywords] of Object.entries(typeKeywords)) {
    if (keywords.some(keyword => query.includes(keyword))) {
      const matches = properties.filter(p => p.property_type === type);
      if (matches.length > 0) return matches;
    }
  }
  
  return [];
};

const findBedroomMatches = (query: string, properties: PropertyWithImages[]): PropertyWithImages[] => {
  const bedroomPatterns = [
    /(\d+)\s*(?:bed|bedroom|br)/i,
    /(\d+)br/i,
    /(\d+)\s*room/i
  ];
  
  for (const pattern of bedroomPatterns) {
    const match = query.match(pattern);
    if (match) {
      const bedrooms = parseInt(match[1]);
      const matches = properties.filter(p => p.bedrooms === bedrooms);
      if (matches.length > 0) return matches;
    }
  }
  
  return [];
};

const findAmenityMatches = (query: string, properties: PropertyWithImages[]): PropertyWithImages[] => {
  const amenityKeywords = [
    'pool', 'swimming', 'gym', 'fitness', 'parking', 'security', 'garden',
    'balcony', 'furnished', 'wifi', 'internet', 'elevator', 'lift',
    'playground', 'clubhouse', 'tennis', 'basketball', 'bbq'
  ];
  
  const queryAmenities = amenityKeywords.filter(amenity => query.includes(amenity));
  
  if (queryAmenities.length > 0) {
    const matches = properties.filter(p => 
      queryAmenities.some(amenity => 
        p.amenities.some(propAmenity => 
          propAmenity.toLowerCase().includes(amenity)
        )
      )
    );
    if (matches.length > 0) return matches;
  }
  
  return [];
};

const extractLocationFromQuery = (query: string): string | null => {
  const locationKeywords = [
    'johor bahru', 'jb', 'kuala lumpur', 'kl', 'penang', 'selangor',
    'klcc', 'mont kiara', 'bangsar', 'petaling jaya', 'pj', 'cyberjaya',
    'taman daya', 'taman molek', 'sutera', 'mount austin'
  ];
  
  const query_lower = query.toLowerCase();
  for (const location of locationKeywords) {
    if (query_lower.includes(location)) {
      return location.toUpperCase();
    }
  }
  
  return null;
};

const extractPriceFromQuery = (query: string): string | null => {
  const priceMatch = query.match(/rm?\s*(\d{1,3}(?:,?\d{3})*(?:k|000)?)/i);
  if (priceMatch) {
    return `RM${priceMatch[1]}`;
  }
  return null;
};

const generateSmartFollowUp = (query: string): string => {
  const q = query.toLowerCase();
  
  // Check what information is missing
  const hasIntent = q.includes('buy') || q.includes('rent') || q.includes('purchase') || q.includes('lease');
  const hasLocation = q.includes('johor') || q.includes('kl') || q.includes('penang') || q.includes('selangor');
  const hasPrice = /rm?\s*\d/.test(q);
  const hasType = q.includes('house') || q.includes('apartment') || q.includes('condo') || q.includes('studio');
  
  if (!hasIntent) {
    return "Are you looking to buy or rent a property? Please let me know your preference and I'll find perfect matches!";
  }
  
  if (!hasLocation) {
    return "Which area are you interested in? I have properties in Johor Bahru, Kuala Lumpur, Penang, and other major cities.";
  }
  
  if (!hasPrice) {
    const intentType = q.includes('rent') ? 'monthly budget' : 'budget';
    return `What's your ${intentType}? This will help me show you the most suitable properties.`;
  }
  
  if (!hasType) {
    return "What type of property are you looking for? House, apartment, condo, or studio?";
  }
  
  return "I couldn't find exact matches. Could you provide more details about your requirements?";
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