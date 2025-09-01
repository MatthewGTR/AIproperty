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
  const isPropertyQuery = isPropertyRelated(userQuery);
  initAI();

  try {
    if (genAI) {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const matchedProperties = isPropertyQuery ? findMatches(userQuery, properties, locationInfo) : [];
      
      const prompt = isPropertyQuery ? 
        `You are a Malaysian real estate AI expert. Available properties: ${JSON.stringify(properties.map(p => ({
          id: p.id, title: p.title, location: p.location, price: p.price, type: p.type,
          bedrooms: p.bedrooms, bathrooms: p.bathrooms, sqft: p.sqft, amenities: p.amenities
        })))}
        
        ${locationInfo ? `User location: ${locationInfo.address}` : ''}
        
        Query: "${userQuery}"
        
        Provide expert property advice, match exact locations, calculate affordability (28% rule), and give investment insights.` :
        
        `You are a helpful AI assistant. Query: "${userQuery}"
        
        Provide comprehensive answers on any topic while mentioning you're also a Malaysian property expert when relevant.`;

      const result = await model.generateContent(prompt);
      return { response: result.response.text(), matchedProperties };
    }

    if (openai) {
      const matchedProperties = isPropertyQuery ? findMatches(userQuery, properties, locationInfo) : [];
      
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { 
            role: "system", 
            content: isPropertyQuery ? 
              "You are a Malaysian real estate expert. Provide professional property consultation." :
              "You are a helpful AI assistant. Answer any question comprehensively."
          },
          { role: "user", content: userQuery }
        ],
        max_tokens: 500,
        temperature: 0.7,
      });

      return {
        response: completion.choices[0]?.message?.content || "How can I help you today?",
        matchedProperties
      };
    }

    const matchedProperties = isPropertyQuery ? findMatches(userQuery, properties, locationInfo) : [];
    return { response: generateFallback(userQuery, matchedProperties, locationInfo), matchedProperties };

  } catch (error) {
    const matchedProperties = isPropertyQuery ? findMatches(userQuery, properties, locationInfo) : [];
    return { response: generateFallback(userQuery, matchedProperties, locationInfo), matchedProperties };
  }
};

const isPropertyRelated = (query: string): boolean => {
  const keywords = ['house', 'apartment', 'condo', 'property', 'rent', 'buy', 'bedroom', 'price', 'location', 'taman', 'klcc', 'johor', 'salary', 'afford', 'mortgage'];
  return keywords.some(k => query.toLowerCase().includes(k));
};

const findMatches = (query: string, properties: Property[], locationInfo?: LocationInfo): Property[] => {
  const q = query.toLowerCase();
  
  // Exact location matches
  const locations = ['taman daya', 'taman molek', 'sutera utama', 'mount austin', 'klcc', 'mont kiara', 'bangsar'];
  for (const loc of locations) {
    if (q.includes(loc)) {
      const matches = properties.filter(p => p.location.toLowerCase().includes(loc));
      if (matches.length > 0) return matches;
    }
  }
  
  // Salary affordability
  const salaryMatch = query.match(/(\d{1,3}(?:,\d{3})*)/);
  if ((q.includes('salary') || q.includes('afford')) && salaryMatch) {
    const salary = parseFloat(salaryMatch[1].replace(/,/g, ''));
    const maxPrice = salary * 12 * 0.28 * 12 * 30 / 0.065 / 0.8; // Simplified calculation
    return properties.filter(p => p.price <= maxPrice).sort((a, b) => a.price - b.price);
  }
  
  // General matching
  const matches = properties.filter(p => {
    const text = `${p.title} ${p.location} ${p.description} ${p.amenities.join(' ')} ${p.type}`.toLowerCase();
    return q.split(' ').some(word => word.length > 2 && text.includes(word));
  });
  
  return matches.length > 0 ? matches : properties.filter(p => p.featured);
};

const generateFallback = (query: string, properties: Property[], locationInfo?: LocationInfo): string => {
  const q = query.toLowerCase();
  
  if (q.includes('hello') || q.includes('hi')) {
    return "Hello! I'm your AI assistant. I can help with any questions and specialize in Malaysian real estate. What would you like to know?";
  }
  
  if (q.includes('math') || q.includes('+') || q.includes('-')) {
    return "I can help with calculations! I'm also great with real estate math like mortgage payments and affordability. What would you like to calculate?";
  }
  
  if (properties.length === 0) {
    return "I couldn't find exact matches, but I have great alternatives! What's most important to you - location, price, or features?";
  }
  
  if (properties.length === 1) {
    const p = properties[0];
    return `Perfect match: "${p.title}" in ${p.location} for RM${p.price.toLocaleString()}. This ${p.bedrooms}-bedroom ${p.type} offers great value!`;
  }
  
  const priceRange = { min: Math.min(...properties.map(p => p.price)), max: Math.max(...properties.map(p => p.price)) };
  return `Found ${properties.length} properties ranging from RM${priceRange.min.toLocaleString()} to RM${priceRange.max.toLocaleString()}. Which interests you most?`;
};