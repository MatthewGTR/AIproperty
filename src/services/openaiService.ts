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
  // Always try to initialize AI services fresh
  const openaiKey = import.meta.env.VITE_OPENAI_API_KEY;
  const geminiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
  console.log('API Keys Status:', { 
    openaiAvailable: !!openaiKey && openaiKey !== 'your_openai_api_key_here',
    geminiAvailable: !!geminiKey && geminiKey !== 'your_gemini_api_key_here'
  });

  try {
    let aiResponse = '';
    
    // Try ChatGPT first if API key is available
    if (openai) {
      try {
        console.log('Attempting OpenAI request...');
        
        const completion = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [
            { 
              role: "system",
              content: "You are a helpful assistant. Answer questions directly and honestly. If you don't know something, say you don't know."
            },
            { 
              role: "user", 
              content: userQuery 
            }
          ],
          max_tokens: 500,
          temperature: 0.7,
        });

        aiResponse = completion.choices[0]?.message?.content || "I couldn't generate a response.";
        console.log('OpenAI response received');
      } catch (openaiError: any) {
        console.error('OpenAI API Error:', openaiError.message);
        
        // Try Gemini as backup if available
        if (genAI) {
          console.log('Falling back to Gemini...');
          try {
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
            const result = await model.generateContent(userQuery);
            aiResponse = result.response.text();
            console.log('Gemini response received');
          } catch (geminiError: any) {
            console.error('Gemini API Error:', geminiError.message);
            aiResponse = generateFallbackResponse(userQuery);
          }
        } else {
          aiResponse = generateFallbackResponse(userQuery);
        }
      }
    } else if (genAI) {
      // Use Gemini if OpenAI not available
      console.log('Using Gemini as primary AI service...');
      try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
        const result = await model.generateContent(userQuery);
        aiResponse = result.response.text();
        console.log('Gemini response received');
      } catch (geminiError: any) {
        console.error('Gemini API Error:', geminiError.message);
        aiResponse = generateFallbackResponse(userQuery);
      }
    } else {
      console.log('No AI API keys configured, using fallback');
      aiResponse = generateFallbackResponse(userQuery);
    }

    // Check if the ChatGPT response is property-related
    const isPropertyRelated = isResponsePropertyRelated(aiResponse);
    
    let matchedProperties: Property[] = [];
    
    if (isPropertyRelated) {
      console.log('Property-related response detected, searching database...');
      matchedProperties = findRelevantProperties(userQuery, properties, locationInfo);
    }

    return {
      response: aiResponse,
      matchedProperties
    };

  } catch (error) {
    console.error('AI Service Error:', error);
    return {
      response: "I'm sorry, I'm having trouble connecting to the AI service right now. Please try again later or check your API key configuration.",
      matchedProperties: []
    };
  }
};

// Check if ChatGPT's response is about property/real estate
const isResponsePropertyRelated = (response: string): boolean => {
  const propertyKeywords = [
    'property', 'properties', 'real estate', 'house', 'houses', 'home', 'homes',
    'apartment', 'apartments', 'condo', 'condos', 'condominium', 'villa', 'villas',
    'rent', 'rental', 'buy', 'buying', 'sell', 'selling', 'purchase', 'investment',
    'mortgage', 'loan', 'financing', 'down payment', 'deposit', 'market value',
    'bedroom', 'bedrooms', 'bathroom', 'bathrooms', 'sqft', 'square feet',
    'location', 'neighborhood', 'area', 'district', 'development', 'listing',
    'agent', 'broker', 'realtor', 'landlord', 'tenant', 'lease', 'ownership'
  ];

  const responseText = response.toLowerCase();
  return propertyKeywords.some(keyword => responseText.includes(keyword));
};

const generateFallbackResponse = (userQuery: string): string => {
  const q = userQuery.toLowerCase();
  
  // Property-related fallback responses
  if (q.includes('property') || q.includes('house') || q.includes('apartment') || q.includes('condo') || q.includes('buy') || q.includes('rent')) {
    return "I can help you search our property database. Let me find relevant properties for you based on your requirements.";
  }
  
  // Finance-related fallback responses
  if (q.includes('mortgage') || q.includes('loan') || q.includes('finance') || q.includes('investment') || q.includes('price') || q.includes('afford')) {
    return "For detailed financial advice, I'd need to connect to an AI service. However, I can help you browse our property listings and provide basic information.";
  }
  
  // General fallback
  return "I'm a property search assistant. I can help you find properties in our database. Please ask me about houses, apartments, condos, or rental properties in Malaysia.";
};

const findRelevantProperties = (query: string, properties: Property[], locationInfo?: LocationInfo): Property[] => {
  const q = query.toLowerCase();
  
  // Location-based matching
  const locationKeywords = [
    'taman daya', 'taman molek', 'sutera utama', 'mount austin', 'klcc', 
    'mont kiara', 'bangsar', 'johor bahru', 'kuala lumpur', 'penang', 
    'cyberjaya', 'petaling jaya', 'subang jaya', 'damansara', 'cheras',
    'ampang', 'shah alam', 'putrajaya', 'kajang', 'setia alam'
  ];
  
  for (const location of locationKeywords) {
    if (q.includes(location)) {
      const matches = properties.filter(p => p.location.toLowerCase().includes(location));
      if (matches.length > 0) return matches.slice(0, 6);
    }
  }
  
  // Price range matching
  const priceMatch = query.match(/rm\s*(\d{1,3}(?:,?\d{3})*(?:k|000)?)/i);
  if (priceMatch) {
    let targetPrice = parseFloat(priceMatch[1].replace(/,/g, ''));
    if (priceMatch[1].toLowerCase().includes('k')) {
      targetPrice *= 1000;
    }
    
    // Find properties within 20% of target price
    const tolerance = targetPrice * 0.2;
    const matches = properties.filter(p => 
      Math.abs(p.price - targetPrice) <= tolerance
    ).sort((a, b) => Math.abs(a.price - targetPrice) - Math.abs(b.price - targetPrice));
    
    if (matches.length > 0) return matches.slice(0, 6);
  }
  
  // Property type matching
  const typeKeywords = {
    'house': 'house',
    'houses': 'house',
    'terrace': 'house',
    'bungalow': 'house',
    'villa': 'villa',
    'villas': 'villa',
    'apartment': 'apartment',
    'apartments': 'apartment',
    'flat': 'apartment',
    'condo': 'condo',
    'condos': 'condo',
    'condominium': 'condo'
  };
  
  for (const [keyword, type] of Object.entries(typeKeywords)) {
    if (q.includes(keyword)) {
      const matches = properties.filter(p => p.type === type);
      if (matches.length > 0) return matches.slice(0, 6);
    }
  }
  
  // Bedroom/bathroom matching
  const bedroomMatch = query.match(/(\d+)\s*(?:bed|bedroom)/i);
  if (bedroomMatch) {
    const bedrooms = parseInt(bedroomMatch[1]);
    const matches = properties.filter(p => p.bedrooms === bedrooms);
    if (matches.length > 0) return matches.slice(0, 6);
  }
  
  // Budget/affordability matching
  const salaryMatch = query.match(/salary.*?rm\s*(\d{1,3}(?:,?\d{3})*)/i) || 
                     query.match(/afford.*?rm\s*(\d{1,3}(?:,?\d{3})*)/i) ||
                     query.match(/budget.*?rm\s*(\d{1,3}(?:,?\d{3})*)/i);
  
  if (salaryMatch) {
    const salary = parseFloat(salaryMatch[1].replace(/,/g, ''));
    const maxPrice = salary * 12 * 0.28 * 30; // 28% rule, 30-year loan approximation
    const matches = properties.filter(p => p.price <= maxPrice)
                              .sort((a, b) => a.price - b.price);
    if (matches.length > 0) return matches.slice(0, 6);
  }
  
  // Amenity matching
  const amenityKeywords = [
    'pool', 'swimming', 'gym', 'fitness', 'security', 'parking', 'garden',
    'playground', 'school', 'mall', 'shopping', 'transport', 'mrt', 'lrt'
  ];
  
  for (const amenity of amenityKeywords) {
    if (q.includes(amenity)) {
      const matches = properties.filter(p => 
        p.amenities.some(a => a.toLowerCase().includes(amenity)) ||
        p.description.toLowerCase().includes(amenity)
      );
      if (matches.length > 0) return matches.slice(0, 6);
    }
  }
  
  // General keyword matching
  const matches = properties.filter(p => {
    const searchText = `${p.title} ${p.location} ${p.description} ${p.amenities.join(' ')} ${p.type}`.toLowerCase();
    return q.split(' ').some(word => word.length > 2 && searchText.includes(word));
  });
  
  if (matches.length > 0) return matches.slice(0, 6);
  
  // Return empty array if no matches found
  return [];
}