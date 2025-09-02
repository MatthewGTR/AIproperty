import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Property } from '../types/Property';

let openai: OpenAI | null = null;
let genAI: GoogleGenerativeAI | null = null;

const initAI = () => {
  const openaiKey = import.meta.env.VITE_OPENAI_API_KEY;
  const geminiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
  if (openaiKey && openaiKey !== 'your_openai_api_key_here' && openaiKey.trim()) {
    openai = new OpenAI({ apiKey: openaiKey, dangerouslyAllowBrowser: true });
  }
  
  if (geminiKey && geminiKey !== 'your_gemini_api_key_here' && geminiKey.trim()) {
    genAI = new GoogleGenerativeAI(geminiKey);
  }
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
  initAI();

  try {
    let aiResponse = '';
    
    // Try ChatGPT first
    if (openai) {
      try {
        const completion = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [
            { 
              role: "user", 
              content: userQuery 
            }
          ],
          max_tokens: 1500,
          temperature: 0.7,
        });

        aiResponse = completion.choices[0]?.message?.content || "I couldn't generate a response.";
      } catch (openaiError: any) {
        console.warn('OpenAI API Error:', openaiError.message);
        
        // Try Gemini as backup
        if (genAI) {
          const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
          const result = await model.generateContent(userQuery);
          aiResponse = result.response.text();
        } else {
          throw new Error('No AI service available');
        }
      }
    } else if (genAI) {
      // Use Gemini if OpenAI not available
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
      const result = await model.generateContent(userQuery);
      aiResponse = result.response.text();
    } else {
      // Fallback response when no AI service is available
      aiResponse = generateFallbackResponse(userQuery);
    }

    // Check if the response is property-related
    const isPropertyRelated = checkIfPropertyRelated(aiResponse, userQuery);
    
    let matchedProperties: Property[] = [];
    
    if (isPropertyRelated) {
      // Find relevant properties from our database
      matchedProperties = findRelevantProperties(userQuery, properties, locationInfo);
      
      // Add property suggestions to the response if we found matches
      if (matchedProperties.length > 0) {
        aiResponse += `\n\n**🏠 Relevant Properties from Our Database:**\nI found ${matchedProperties.length} properties that might interest you. Check them out below!`;
      }
    }

    return {
      response: aiResponse,
      matchedProperties
    };

  } catch (error) {
    console.error('AI Service Error:', error);
    return {
      response: "I'm sorry, I'm having trouble connecting to the AI service right now. Please try again later.",
      matchedProperties: []
    };
  }
};

const generateFallbackResponse = (userQuery: string): string => {
  const q = userQuery.toLowerCase();
  
  // Property-related fallback responses
  if (q.includes('property') || q.includes('house') || q.includes('apartment') || q.includes('condo') || q.includes('buy') || q.includes('rent')) {
    return "I can help you find properties in our database. Let me search for relevant options based on your query.";
  }
  
  // Finance-related fallback responses
  if (q.includes('mortgage') || q.includes('loan') || q.includes('finance') || q.includes('investment') || q.includes('price') || q.includes('afford')) {
    return "For detailed financial advice and calculations, please configure an AI API key. I can still help you browse our property listings.";
  }
  
  // General fallback
  return "I'm a property search assistant. I can help you find properties in our database. Please ask me about houses, apartments, condos, or rental properties.";
};

const checkIfPropertyRelated = (aiResponse: string, userQuery: string): boolean => {
  const propertyKeywords = [
    'property', 'properties', 'real estate', 'house', 'houses', 'home', 'homes',
    'apartment', 'apartments', 'condo', 'condos', 'condominium', 'villa', 'villas',
    'rent', 'rental', 'buy', 'buying', 'sell', 'selling', 'purchase', 'investment',
    'mortgage', 'loan', 'financing', 'down payment', 'deposit',
    'bedroom', 'bedrooms', 'bathroom', 'bathrooms', 'sqft', 'square feet',
    'location', 'neighborhood', 'area', 'district', 'development',
    'malaysia', 'kuala lumpur', 'johor bahru', 'penang', 'selangor', 'klcc',
    'mont kiara', 'bangsar', 'cyberjaya', 'petaling jaya', 'subang jaya',
    'taman', 'jalan', 'bukit', 'shah alam', 'ampang', 'cheras',
    'agent', 'broker', 'listing', 'market', 'price', 'value', 'valuation'
  ];

  const combinedText = (aiResponse + ' ' + userQuery).toLowerCase();
  
  return propertyKeywords.some(keyword => combinedText.includes(keyword));
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