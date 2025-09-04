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
        
        // Check if it's a quota/billing error
        if (openaiError.message?.includes('429') || openaiError.message?.includes('quota')) {
          console.log('OpenAI quota exceeded, trying Gemini backup...');
        }
        
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
    let enhancedResponse = aiResponse;
    
    if (isPropertyRelated) {
      console.log('Property-related response detected, searching database...');
      matchedProperties = findRelevantProperties(userQuery, properties, locationInfo);
      
      // If no relevant properties found, enhance the response
      if (matchedProperties.length === 0) {
        enhancedResponse = enhanceResponseForNoMatches(userQuery, aiResponse);
      } else {
        // Add context about the matched properties
        const intentInfo = getIntentInfo(userQuery);
        enhancedResponse = `${aiResponse}\n\nI found ${matchedProperties.length} ${intentInfo} that match your criteria. Take a look at the recommendations below!`;
      }
    }

    return {
      response: enhancedResponse,
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

const enhanceResponseForNoMatches = (userQuery: string, originalResponse: string): string => {
  const q = userQuery.toLowerCase();
  
  // Detect intent
  const buyKeywords = ['buy', 'buying', 'purchase', 'purchasing', 'own', 'ownership', 'invest', 'investment'];
  const rentKeywords = ['rent', 'rental', 'renting', 'lease', 'leasing', 'tenant', 'monthly'];
  
  const isBuyIntent = buyKeywords.some(keyword => q.includes(keyword));
  const isRentIntent = rentKeywords.some(keyword => q.includes(keyword));
  
  let enhancedResponse = originalResponse;
  
  if (isBuyIntent) {
    enhancedResponse += "\n\nI couldn't find properties for sale that exactly match your criteria. Could you help me by providing more details? For example:\n• What's your budget range?\n• Which area or city are you interested in?\n• How many bedrooms do you need?\n• Any specific amenities you're looking for?";
  } else if (isRentIntent) {
    enhancedResponse += "\n\nI couldn't find rental properties that exactly match your requirements. Could you provide more details? For example:\n• What's your monthly budget?\n• Which area would you prefer?\n• How many bedrooms do you need?\n• Do you prefer furnished or unfurnished?\n• When do you need to move in?";
  } else {
    enhancedResponse += "\n\nI'd love to help you find the perfect property! Could you tell me:\n• Are you looking to buy or rent?\n• What's your budget?\n• Which area interests you?\n• What type of property are you looking for?";
  }
  
  return enhancedResponse;
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

const generateFallbackResponse = (userQuery: string): string => {
  const q = userQuery.toLowerCase();
  
  // Check for funny/entertaining questions first
  const funnyResponse = generateFunnyResponse(q);
  if (funnyResponse) {
    return funnyResponse;
  }
  
  // Property-related fallback responses
  if (q.includes('property') || q.includes('house') || q.includes('apartment') || q.includes('condo') || q.includes('buy') || q.includes('rent')) {
    // Detect intent and provide specific guidance
    const buyKeywords = ['buy', 'buying', 'purchase', 'purchasing', 'own', 'ownership', 'invest', 'investment'];
    const rentKeywords = ['rent', 'rental', 'renting', 'lease', 'leasing', 'tenant', 'monthly'];
    
    const isBuyIntent = buyKeywords.some(keyword => q.includes(keyword));
    const isRentIntent = rentKeywords.some(keyword => q.includes(keyword));
    
    if (isBuyIntent) {
      return "I can help you find properties for sale! To give you the best recommendations, could you tell me:\n• Your budget range?\n• Preferred location?\n• Number of bedrooms needed?\n• Any specific requirements?";
    } else if (isRentIntent) {
      return "I can help you find rental properties! To show you the most suitable options, please let me know:\n• Your monthly budget?\n• Preferred area?\n• Number of bedrooms?\n• Furnished or unfurnished preference?";
    } else {
      return "I can help you search our property database! Are you looking to buy or rent? Please provide more details about your requirements.";
    }
  }
  
  // Finance-related fallback responses
  if (q.includes('mortgage') || q.includes('loan') || q.includes('finance') || q.includes('investment') || q.includes('price') || q.includes('afford')) {
    return "For detailed financial advice, I'd need to connect to an AI service. However, I can help you browse our property listings and provide basic information.";
  }
  
  // General fallback
  return "I'm a property search assistant. I can help you find properties in our database. Please ask me about houses, apartments, condos, or rental properties in Malaysia.";
};

const generateFunnyResponse = (query: string): string | null => {
  const funnyPatterns = [
    // Relationship/Dating questions
    {
      keywords: ['girlfriend', 'boyfriend', 'wife', 'husband', 'dating', 'love', 'relationship', 'marry', 'marriage'],
      responses: [
        "I'm a property AI, not a dating app! But I can help you find a lovely home where you can bring your future partner for romantic dinners! 🏠💕",
        "Sorry, I only match people with houses, not with each other! Though a beautiful home might help with the dating game... 😉",
        "I can't find you love, but I can find you a love nest! How about a cozy 2-bedroom condo with city views? 🏙️❤️"
      ]
    },
    // Food questions
    {
      keywords: ['hungry', 'food', 'eat', 'restaurant', 'pizza', 'burger', 'nasi lemak', 'roti canai'],
      responses: [
        "I don't serve food, but I can find you a house near the best mamak stalls in town! 🍜🏠",
        "Sorry, I'm not Foodpanda! But I can show you properties near amazing food courts and restaurants! 🍕🏡",
        "I can't cook, but I can find you a home with a beautiful kitchen where YOU can cook! Plus, near the best food spots! 👨‍🍳🏠"
      ]
    },
    // Weather questions
    {
      keywords: ['weather', 'rain', 'sunny', 'hot', 'cold', 'temperature'],
      responses: [
        "I'm not a weather app, but I can find you a house with great air conditioning for those hot Malaysian days! ☀️❄️",
        "I don't predict weather, but I can predict you'll love a home with a covered parking for rainy days! 🌧️🚗",
        "Weather forecast? Nope! But house forecast? 100% chance of finding your dream home! 🏠⛅"
      ]
    },
    // Technology/AI questions
    {
      keywords: ['robot', 'ai', 'artificial intelligence', 'skynet', 'terminator', 'matrix'],
      responses: [
        "I'm just a friendly property AI! I promise I won't take over the world... just help you take over the property market! 🤖🏠",
        "Beep boop! I'm a good robot who only wants to help you find amazing homes, not destroy humanity! 🤖✨",
        "I'm like JARVIS, but for houses! No world domination plans, just property recommendations! 🏠🤖"
      ]
    },
    // Money/lottery questions
    {
      keywords: ['lottery', 'jackpot', 'rich', 'millionaire', 'billionaire', 'money tree'],
      responses: [
        "I can't make you win the lottery, but I can help you invest wisely in property - the real path to wealth! 💰🏠",
        "No lottery numbers here, but I have property numbers that might make you rich over time! 📈🏡",
        "Money doesn't grow on trees, but property values do grow over time! Let me show you some great investments! 🌳💰"
      ]
    },
    // Existential/philosophical questions
    {
      keywords: ['meaning of life', 'purpose', 'why exist', 'philosophy', 'universe'],
      responses: [
        "The meaning of life? 42... bedrooms in your dream mansion! Let me help you find it! 🏰✨",
        "I exist to help you find the perfect home. That's my purpose! What's yours? Maybe a nice villa? 🏠🤔",
        "Life's too short for bad housing! Let me help you find a place that makes every day meaningful! 🏡💫"
      ]
    },
    // Superhero/fantasy questions
    {
      keywords: ['superman', 'batman', 'spiderman', 'superhero', 'magic', 'wizard', 'dragon'],
      responses: [
        "I'm not Superman, but I can help you find a fortress of solitude... I mean, a beautiful home! 🦸‍♂️🏠",
        "No magic powers here, but finding the perfect property at the right price? That's pretty magical! ✨🏡",
        "I can't fly like Superman, but I can help your property dreams take flight! 🚀🏠"
      ]
    },
    // Random silly questions
    {
      keywords: ['banana', 'monkey', 'elephant', 'purple', 'unicorn', 'dinosaur'],
      responses: [
        "That's... random! But speaking of random, did you know I have some randomly amazing properties to show you? 🦄🏠",
        "Interesting question! Here's an interesting answer: I have some fascinating properties that might interest you more! 🏡😄",
        "You're funny! I like that! Now let me show you something that's seriously amazing - our property listings! 😂🏠"
      ]
    },
    // Time/space questions
    {
      keywords: ['time travel', 'future', 'past', 'space', 'mars', 'moon'],
      responses: [
        "I can't time travel, but I can help you travel to your future dream home! 🚀🏠",
        "No Mars properties yet, but I have some out-of-this-world homes on Earth! 🌍🏡",
        "The future is now! And in the future, you'll be living in an amazing home I help you find! ⏰🏠"
      ]
    }
  ];

  // Check each pattern
  for (const pattern of funnyPatterns) {
    if (pattern.keywords.some(keyword => query.includes(keyword))) {
      // Return a random response from the matching pattern
      const randomIndex = Math.floor(Math.random() * pattern.responses.length);
      return pattern.responses[randomIndex];
    }
  }

  // Check for question marks with non-property content
  if (query.includes('?') && !isQueryPropertyRelated(query)) {
    const genericFunnyResponses = [
      "That's a great question! Here's a better one: What kind of amazing home would you like to live in? 🏠😊",
      "Hmm, interesting! But you know what's more interesting? The perfect property waiting for you! ✨🏡",
      "I love curious minds! Now let me satisfy your curiosity with some incredible property options! 🤔🏠",
      "You're asking the real questions! Speaking of real... real estate! Let me show you some amazing homes! 🏡💭"
    ];
    const randomIndex = Math.floor(Math.random() * genericFunnyResponses.length);
    return genericFunnyResponses[randomIndex];
  }

  return null; // Not a funny question
};

const isQueryPropertyRelated = (query: string): boolean => {
  const propertyKeywords = [
    'property', 'properties', 'house', 'home', 'apartment', 'condo', 'villa',
    'rent', 'buy', 'sell', 'price', 'bedroom', 'bathroom', 'location',
    'investment', 'mortgage', 'agent', 'listing'
  ];
  
  return propertyKeywords.some(keyword => query.includes(keyword));
};

const findRelevantProperties = (query: string, properties: Property[], locationInfo?: LocationInfo): Property[] => {
  const q = query.toLowerCase();
  
  // Intent detection - Buy vs Rent
  const buyKeywords = ['buy', 'buying', 'purchase', 'purchasing', 'own', 'ownership', 'invest', 'investment', 'mortgage', 'loan', 'down payment', 'for sale'];
  const rentKeywords = ['rent', 'rental', 'renting', 'lease', 'leasing', 'tenant', 'monthly', 'deposit', 'furnished', 'for rent'];
  
  const isBuyIntent = buyKeywords.some(keyword => q.includes(keyword));
  const isRentIntent = rentKeywords.some(keyword => q.includes(keyword));
  
  // Filter properties based on intent - be more strict
  let filteredProperties: Property[] = [];
  
  if (isBuyIntent && !isRentIntent) {
    // User wants to buy - show only sale properties (higher prices)
    filteredProperties = properties.filter(p => p.price >= 300000);
  } else if (isRentIntent && !isBuyIntent) {
    // User wants to rent - show only rental properties (monthly rates)
    filteredProperties = properties.filter(p => p.price <= 10000);
  } else {
    // No clear intent detected - use all properties for other filtering
    filteredProperties = properties;
  }
  
  // If no properties match the intent, return empty array
  if ((isBuyIntent || isRentIntent) && filteredProperties.length === 0) {
    return [];
  }
  
  // Location-based matching
  const locationKeywords = [
    'taman daya', 'taman molek', 'sutera utama', 'mount austin', 'klcc', 
    'mont kiara', 'bangsar', 'johor bahru', 'kuala lumpur', 'penang', 
    'cyberjaya', 'petaling jaya', 'subang jaya', 'damansara', 'cheras',
    'ampang', 'shah alam', 'putrajaya', 'kajang', 'setia alam', 'kl',
    'jb', 'pj', 'kota kinabalu', 'georgetown', 'bukit bintang', 'mid valley',
    'wangsa maju', 'horizon hills', 'medini', 'iskandar', 'city centre',
    'paradigm mall', 'skudai', 'batu ferringhi'
  ];
  
  for (const location of locationKeywords) {
    if (q.includes(location)) {
      const matches = filteredProperties.filter(p => p.location.toLowerCase().includes(location));
      if (matches.length > 0) return matches.slice(0, 4);
    }
  }
  
  // Price range matching
  const priceMatch = query.match(/(?:under|below|less than|maximum|max|up to|budget)\s*rm\s*(\d{1,3}(?:,?\d{3})*(?:k|000)?)/i) ||
                     query.match(/rm\s*(\d{1,3}(?:,?\d{3})*(?:k|000)?)\s*(?:or less|maximum|max|budget)/i);
  if (priceMatch) {
    let targetPrice = parseFloat(priceMatch[1].replace(/,/g, ''));
    if (priceMatch[1].toLowerCase().includes('k')) {
      targetPrice *= 1000;
    }
    
    // Find properties under the specified budget
    const matches = filteredProperties.filter(p => 
      p.price <= targetPrice
    ).sort((a, b) => a.price - b.price);
    
    if (matches.length > 0) return matches.slice(0, 4);
  }
  
  // Property type matching
  const typeKeywords = {
    'house': 'house',
    'houses': 'house',
    'terrace': 'house',
    'bungalow': 'house',
    'landed': 'house',
    'villa': 'villa',
    'villas': 'villa',
    'apartment': 'apartment',
    'apartments': 'apartment',
    'flat': 'apartment',
    'studio': 'apartment',
    'condo': 'condo',
    'condos': 'condo',
    'condominium': 'condo',
    'room': 'apartment'
  };
  
  for (const [keyword, type] of Object.entries(typeKeywords)) {
    if (q.includes(keyword)) {
      const matches = filteredProperties.filter(p => p.type === type);
      if (matches.length > 0) return matches.slice(0, 4);
    }
  }
  
  // Bedroom/bathroom matching
  const bedroomMatch = query.match(/(\d+)\s*(?:bed|bedroom)/i);
  if (bedroomMatch) {
    const bedrooms = parseInt(bedroomMatch[1]);
    const matches = filteredProperties.filter(p => p.bedrooms === bedrooms);
    if (matches.length > 0) return matches.slice(0, 4);
  }
  
  // Budget/affordability matching
  const salaryMatch = query.match(/salary.*?rm\s*(\d{1,3}(?:,?\d{3})*)/i) || 
                     query.match(/afford.*?rm\s*(\d{1,3}(?:,?\d{3})*)/i) ||
                     query.match(/budget.*?rm\s*(\d{1,3}(?:,?\d{3})*)/i);
  
  if (salaryMatch) {
    const salary = parseFloat(salaryMatch[1].replace(/,/g, ''));
    const maxPrice = salary * 12 * 0.28 * 30; // 28% rule, 30-year loan approximation
    const matches = filteredProperties.filter(p => p.price <= maxPrice)
                              .sort((a, b) => a.price - b.price);
    if (matches.length > 0) return matches.slice(0, 4);
  }
  
  // Amenity matching
  const amenityKeywords = [
    'pool', 'swimming', 'gym', 'fitness', 'security', 'parking', 'garden',
    'playground', 'school', 'mall', 'shopping', 'transport', 'mrt', 'lrt',
    'furnished', 'unfurnished', 'city view', 'sea view', 'near university',
    'near ciq', 'near singapore', 'golf', 'club house', 'concierge'
  ];
  
  for (const amenity of amenityKeywords) {
    if (q.includes(amenity)) {
      const matches = filteredProperties.filter(p => 
        p.amenities.some(a => a.toLowerCase().includes(amenity)) ||
        p.description.toLowerCase().includes(amenity)
      );
      if (matches.length > 0) return matches.slice(0, 4);
    }
  }
  
  // General keyword matching - only if specific criteria found
  const matches = filteredProperties.filter(p => {
    const searchText = `${p.title} ${p.location} ${p.description} ${p.amenities.join(' ')} ${p.type}`.toLowerCase();
    const queryWords = q.split(' ').filter(word => word.length > 3); // Only longer words
    return queryWords.length > 0 && queryWords.some(word => searchText.includes(word));
  });
  
  if (matches.length > 0) return matches.slice(0, 4);
  
  // Return empty array if no relevant matches found
  return [];
}