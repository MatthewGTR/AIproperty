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
  locationInfo?: LocationInfo,
  conversationHistory?: string[]
): Promise<{ response: string; matchedProperties: PropertyWithImages[] }> => {
  
  // Check if this is a property-related query
  const isPropertyQuery = isPropertyRelated(userQuery);
  
  if (!isPropertyQuery) {
    // Handle non-property questions with ChatGPT
    const chatResponse = await handleGeneralChat(userQuery, conversationHistory);
    return {
      response: chatResponse,
      matchedProperties: []
    };
  }

  // Enhanced property matching with aggressive keyword detection
  const matchedProperties = findRelevantPropertiesEnhanced(userQuery, properties, locationInfo, conversationHistory);
  
  let aiResponse = '';
  
  if (matchedProperties.length > 0) {
    aiResponse = generatePropertyResponse(userQuery, matchedProperties);
  } else {
    aiResponse = generateSmartFollowUp(userQuery, conversationHistory);
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

const handleGeneralChat = async (query: string, conversationHistory?: string[]): Promise<string> => {
  // Check if user is asking the same question repeatedly
  if (conversationHistory && conversationHistory.length > 2) {
    const lastQueries = conversationHistory.slice(-3);
    const isRepeating = lastQueries.some(prev => 
      query.toLowerCase().includes(prev.toLowerCase()) || 
      prev.toLowerCase().includes(query.toLowerCase())
    );
    
    if (isRepeating) {
      return "I notice you're asking similar questions. Let me help you differently! What specific type of property are you looking for? House, apartment, or condo?";
    }
  }

  try {
    if (openai) {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a friendly AI assistant for a property website. Keep responses concise (1-2 sentences max). Always end with a gentle redirect to property search."
          },
          {
            role: "user",
            content: query
          }
        ],
        max_tokens: 100,
        temperature: 0.7
      });
      
      const response = completion.choices[0]?.message?.content || "I'm here to help!";
      return response + " Looking for any properties today?";
    } else if (genAI) {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const result = await model.generateContent(`You are a friendly AI assistant for a property website. Keep responses concise (1-2 sentences max). Always end with asking about properties. User query: ${query}`);
      const response = await result.response;
      return response.text() || "I'm here to help! Looking for any properties?";
    }
  } catch (error) {
    console.error('Error with AI chat:', error);
  }
  
  // Fallback responses for entertainment
  const fallbackResponses = [
    "That's interesting! Are you looking for any properties today?",
    "Cool! By the way, need help finding a house or apartment?",
    "Nice! Looking for any properties to buy or rent?",
    "Awesome! Want to see some great property deals?"
  ];
  
  return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
};

const findRelevantPropertiesEnhanced = (query: string, properties: PropertyWithImages[], locationInfo?: LocationInfo, conversationHistory?: string[]): PropertyWithImages[] => {
  const q = query.toLowerCase();
  
  // If no properties available, return empty
  if (!properties || properties.length === 0) {
    return [];
  }

  // Start with all properties
  let filteredProperties = [...properties];
  
  // Enhanced intent detection
  const buyKeywords = ['buy', 'buying', 'purchase', 'purchasing', 'own', 'ownership', 'invest', 'investment', 'for sale'];
  const rentKeywords = ['rent', 'rental', 'renting', 'lease', 'leasing', 'tenant', 'monthly', 'for rent'];
  
  const isBuyIntent = buyKeywords.some(keyword => q.includes(keyword));
  const isRentIntent = rentKeywords.some(keyword => q.includes(keyword));
  
  // Apply intent filter
  if (isBuyIntent && !isRentIntent) {
    filteredProperties = filteredProperties.filter(p => p.listing_type === 'sale');
  } else if (isRentIntent && !isBuyIntent) {
    filteredProperties = filteredProperties.filter(p => p.listing_type === 'rent');
  }

  // Apply location filter
  const locationMatches = findLocationMatches(q, filteredProperties);
  if (locationMatches.length > 0) {
    filteredProperties = locationMatches;
  }
  
  // Apply price filter
  const priceMatches = findPriceMatches(q, filteredProperties);
  if (priceMatches.length > 0) {
    filteredProperties = priceMatches;
  }
  
  // Apply property type filter
  const typeMatches = findTypeMatches(q, filteredProperties);
  if (typeMatches.length > 0) {
    filteredProperties = typeMatches;
  }
  
  // Apply bedroom filter
  const bedroomMatches = findBedroomMatches(q, filteredProperties);
  if (bedroomMatches.length > 0) {
    filteredProperties = bedroomMatches;
  }
  
  // Apply amenity filter
  const amenityMatches = findAmenityMatches(q, filteredProperties);
  if (amenityMatches.length > 0) {
    filteredProperties = amenityMatches;
  }
  // Check for Johor Bahru variations
  if (query_lower.includes('johor bahru') || query_lower.includes('jb') || query_lower.includes('johor')) {
    const matches = properties.filter(p => 
      p.city?.toLowerCase().includes('johor') || 
      p.state?.toLowerCase().includes('johor') ||
      p.address?.toLowerCase().includes('johor')
    );
    if (matches.length > 0) return matches;
  }
  
  // Check for KL variations
  if (query_lower.includes('kuala lumpur') || query_lower.includes('kl')) {
    const matches = properties.filter(p => 
      p.city?.toLowerCase().includes('kuala lumpur') || 
      p.city?.toLowerCase().includes('kl') ||
      p.state?.toLowerCase().includes('kuala lumpur')
    );
    if (matches.length > 0) return matches;
  }
  
  // Check for other major locations
  const locations = ['penang', 'selangor', 'klcc', 'mont kiara', 'bangsar', 'petaling jaya', 'pj', 'cyberjaya'];
  for (const location of locations) {
    if (query_lower.includes(location)) {
      const matches = properties.filter(p => 
        p.city?.toLowerCase().includes(location) || 
        p.address?.toLowerCase().includes(location) ||
        p.state?.toLowerCase().includes(location)
      );
      if (matches.length > 0) return matches;
    }
  }
  
  return [];
};

const findPriceMatches = (query: string, properties: PropertyWithImages[]): PropertyWithImages[] => {
  const query_lower = query.toLowerCase();
  
  // Check for "under" or "below" price
  let match = query_lower.match(/(?:under|below|less than|max|maximum)\s*rm?\s*(\d+)k?/);
  if (match) {
    let maxPrice = parseInt(match[1]);
    if (query_lower.includes('k') || maxPrice < 1000) {
      maxPrice *= 1000;
    }
    const matches = properties.filter(p => p.price <= maxPrice);
    if (matches.length > 0) return matches.sort((a, b) => a.price - b.price);
  }
  
  // Check for "above" or "over" price
  match = query_lower.match(/(?:above|over|more than|min|minimum)\s*rm?\s*(\d+)k?/);
  if (match) {
    let minPrice = parseInt(match[1]);
    if (query_lower.includes('k') || minPrice < 1000) {
      minPrice *= 1000;
    }
    const matches = properties.filter(p => p.price >= minPrice);
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

const generatePropertyResponse = (query: string, properties: PropertyWithImages[]): string => {
  const q = query.toLowerCase();
  const intentInfo = getIntentInfo(query);
  const locationInfo = extractLocationFromQuery(query);
  const priceInfo = extractPriceFromQuery(query);
  
  let response = `Great! Found ${properties.length} ${intentInfo}`;
  if (locationInfo) response += ` in ${locationInfo}`;
  if (priceInfo) response += ` within budget`;
  response += `:`;
  
  return response;
};

const generateSmartFollowUp = (query: string, conversationHistory?: string[]): string => {
  const q = query.toLowerCase();
  
  // Check if we've asked similar questions before
  if (conversationHistory && conversationHistory.length > 1) {
    const lastResponse = conversationHistory[conversationHistory.length - 1];
    if (lastResponse && lastResponse.includes('budget') && q.includes('budget')) {
      return "I see you mentioned budget again. Could you be more specific? For example: 'under RM500k' or 'RM200k to RM400k'?";
    }
    if (lastResponse && lastResponse.includes('location') && (q.includes('area') || q.includes('location'))) {
      return "Which specific area interests you? Try: 'Johor Bahru', 'KL', 'Penang', or any specific neighborhood.";
    }
  }

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