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
    } catch (error) {
      console.error('Failed to initialize OpenAI:', error);
      openai = null;
    }
  }
  
  if (geminiKey && geminiKey !== 'your_gemini_api_key_here' && geminiKey.trim()) {
    try {
      genAI = new GoogleGenerativeAI(geminiKey);
    } catch (error) {
      console.error('Failed to initialize Gemini:', error);
      genAI = null;
    }
  }
  
  isInitialized = true;
}

initAI();

interface ConversationContext {
  intent?: 'buy' | 'rent';
  location?: string;
  priceRange?: { min?: number; max?: number };
  propertyType?: string;
  bedrooms?: number;
  amenities?: string[];
  askedQuestions: string[];
}

export const searchPropertiesWithAI = async (
  userQuery: string, 
  properties: PropertyWithImages[],
  locationInfo?: any,
  conversationHistory?: string[]
): Promise<{ response: string; matchedProperties: PropertyWithImages[] }> => {
  
  // Build conversation context from history
  const context = buildConversationContext(conversationHistory || [], userQuery);
  
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

  // Find matching properties using context
  const matchedProperties = findPropertiesWithContext(userQuery, properties, context);
  
  // Generate intelligent response with reasoning
  const response = generateIntelligentResponse(userQuery, matchedProperties, context);
  
  return {
    response,
    matchedProperties
  };
};

const buildConversationContext = (history: string[], currentQuery: string): ConversationContext => {
  const context: ConversationContext = {
    askedQuestions: []
  };
  
  const allMessages = [...history, currentQuery];
  const fullConversation = allMessages.join(' ').toLowerCase();
  
  // Extract intent (buy/rent) - once mentioned, remember it
  if (fullConversation.includes('buy') || fullConversation.includes('purchase') || fullConversation.includes('buying')) {
    context.intent = 'buy';
  } else if (fullConversation.includes('rent') || fullConversation.includes('rental') || fullConversation.includes('renting')) {
    context.intent = 'rent';
  }
  
  // Extract location - remember any mentioned location
  const locations = [
    'johor bahru', 'jb', 'johor', 'kuala lumpur', 'kl', 'penang', 'georgetown',
    'selangor', 'klcc', 'mont kiara', 'bangsar', 'petaling jaya', 'pj',
    'cyberjaya', 'putrajaya', 'shah alam', 'subang', 'damansara', 'cheras',
    'ampang', 'kajang', 'taman daya', 'taman molek', 'sutera', 'mount austin',
    'horizon hills', 'medini', 'iskandar', 'city square', 'paradigm'
  ];
  
  for (const location of locations) {
    if (fullConversation.includes(location)) {
      context.location = location;
      break;
    }
  }
  
  // Extract price range
  const pricePatterns = [
    /(?:under|below|less than|max|maximum|budget)\s*rm?\s*(\d+)k?/g,
    /(?:above|over|more than|min|minimum)\s*rm?\s*(\d+)k?/g,
    /rm?\s*(\d+)k?\s*to\s*rm?\s*(\d+)k?/g
  ];
  
  for (const pattern of pricePatterns) {
    const matches = Array.from(fullConversation.matchAll(pattern));
    for (const match of matches) {
      if (match[0].includes('under') || match[0].includes('below') || match[0].includes('max') || match[0].includes('budget')) {
        let maxPrice = parseInt(match[1]);
        if (match[1].includes('k') || maxPrice < 1000) maxPrice *= 1000;
        context.priceRange = { ...context.priceRange, max: maxPrice };
      } else if (match[0].includes('above') || match[0].includes('over') || match[0].includes('min')) {
        let minPrice = parseInt(match[1]);
        if (match[1].includes('k') || minPrice < 1000) minPrice *= 1000;
        context.priceRange = { ...context.priceRange, min: minPrice };
      } else if (match[0].includes('to')) {
        let minPrice = parseInt(match[1]);
        let maxPrice = parseInt(match[2]);
        if (match[1].includes('k') || minPrice < 1000) minPrice *= 1000;
        if (match[2].includes('k') || maxPrice < 1000) maxPrice *= 1000;
        context.priceRange = { min: minPrice, max: maxPrice };
      }
    }
  }
  
  // Extract property type
  const typeKeywords = {
    'house': ['house', 'home', 'landed', 'terrace', 'semi-d', 'bungalow', 'townhouse'],
    'apartment': ['apartment', 'flat', 'unit'],
    'condo': ['condo', 'condominium'],
    'villa': ['villa'],
    'studio': ['studio'],
    'shophouse': ['shophouse', 'shop house']
  };
  
  for (const [type, keywords] of Object.entries(typeKeywords)) {
    if (keywords.some(keyword => fullConversation.includes(keyword))) {
      context.propertyType = type;
      break;
    }
  }
  
  // Extract bedrooms
  const bedroomMatch = fullConversation.match(/(\d+)\s*(?:bed|bedroom|br|room)/);
  if (bedroomMatch) {
    context.bedrooms = parseInt(bedroomMatch[1]);
  }
  
  // Extract amenities
  const amenityKeywords = [
    'pool', 'swimming', 'gym', 'fitness', 'parking', 'security', 'garden',
    'furnished', 'wifi', 'internet', 'playground', 'clubhouse', 'tennis',
    'near school', 'near mall', 'near university', 'city view', 'sea view'
  ];
  
  context.amenities = amenityKeywords.filter(amenity => fullConversation.includes(amenity));
  
  return context;
};

const findPropertiesWithContext = (query: string, properties: PropertyWithImages[], context: ConversationContext): PropertyWithImages[] => {
  let filtered = [...properties];
  
  // Apply intent filter
  if (context.intent) {
    filtered = filtered.filter(p => p.listing_type === context.intent);
  }
  
  // Apply location filter
  if (context.location) {
    filtered = filtered.filter(p => 
      p.city?.toLowerCase().includes(context.location!) ||
      p.state?.toLowerCase().includes(context.location!) ||
      p.address?.toLowerCase().includes(context.location!)
    );
  }
  
  // Apply price filter
  if (context.priceRange) {
    if (context.priceRange.max) {
      filtered = filtered.filter(p => p.price <= context.priceRange!.max!);
    }
    if (context.priceRange.min) {
      filtered = filtered.filter(p => p.price >= context.priceRange!.min!);
    }
  }
  
  // Apply property type filter
  if (context.propertyType) {
    filtered = filtered.filter(p => p.property_type === context.propertyType);
  }
  
  // Apply bedroom filter
  if (context.bedrooms) {
    filtered = filtered.filter(p => p.bedrooms === context.bedrooms);
  }
  
  // Apply amenity filter
  if (context.amenities && context.amenities.length > 0) {
    filtered = filtered.filter(p => 
      context.amenities!.some(amenity => 
        p.amenities.some(propAmenity => 
          propAmenity.toLowerCase().includes(amenity)
        )
      )
    );
  }
  
  return filtered.slice(0, 6);
  // If user has clear intent but no specific filters, show some properties anyway
  if (context.intent && filtered.length === 0 && !context.location && !context.priceRange && !context.propertyType) {
    return properties.filter(p => p.listing_type === context.intent).slice(0, 6);
  }
  
  return filtered.slice(0, 6);

const generateIntelligentResponse = (query: string, properties: PropertyWithImages[], context: ConversationContext): string => {
  if (properties.length > 0) {
    // Generate response with reasoning
    let response = `Based on our conversation, I found ${properties.length} properties that match your criteria:`;
    
    const reasons = [];
    if (context.intent) reasons.push(`${context.intent === 'buy' ? 'for sale' : 'for rent'}`);
    if (context.location) reasons.push(`in ${context.location}`);
    if (context.priceRange?.max) reasons.push(`under RM${context.priceRange.max.toLocaleString()}`);
    if (context.priceRange?.min) reasons.push(`above RM${context.priceRange.min.toLocaleString()}`);
    if (context.propertyType) reasons.push(`${context.propertyType} type`);
    if (context.bedrooms) reasons.push(`${context.bedrooms} bedrooms`);
    
    if (reasons.length > 0) {
      response += ` These are ${reasons.join(', ')}.`;
    }
    
    return response;
  }
  
  // No matches found - provide helpful guidance
  const missing = [];
  if (!context.intent) missing.push('buy or rent');
  if (!context.location) missing.push('location');
  if (!context.priceRange) missing.push('budget');
  
  if (missing.length > 0) {
    return `I need more details: ${missing.join(', ')}?`;
  }
  
  return "No properties match your exact criteria. Try adjusting your budget or location?";
};

const isPropertyRelated = (query: string): boolean => {
  const propertyKeywords = [
    'buy', 'rent', 'house', 'apartment', 'condo', 'villa', 'studio', 'property',
    'bedroom', 'bathroom', 'sqft', 'rm', 'price', 'budget', 'johor', 'kl',
    'penang', 'selangor', 'furnished', 'pool', 'gym', 'parking', 'agent'
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
            content: "You are a helpful assistant. Keep responses brief (1-2 sentences). Always end by asking if they're looking for properties."
          },
          {
            role: "user",
            content: query
          }
        ],
        max_tokens: 80,
        temperature: 0.7
      });
      
      const response = completion.choices[0]?.message?.content || "I'm here to help!";
      return response + " Are you looking for any properties?";
    } else if (genAI) {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const result = await model.generateContent(`Keep response brief (1-2 sentences). Always end asking about properties. Query: ${query}`);
      const response = await result.response;
      return response.text() || "I'm here to help! Looking for properties?";
    }
  } catch (error) {
    console.error('Error with AI chat:', error);
  }
  
  return "That's interesting! Are you looking for any properties today?";
};