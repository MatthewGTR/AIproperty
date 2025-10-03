import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { PropertyWithImages, propertyService } from './propertyService';
import { detectIntent, generateSmartResponse, scorePropertyMatch, generatePropertyDescription } from './aiEnhancedService';

export interface UserProfile {
  intent: 'buy' | 'rent' | null;
  budget: {
    min: number | null;
    max: number | null;
  };
  property_type: string[];
  states: string[];
  areas: string[];
  bedrooms: number | null;
  bathrooms: number | null;
  purpose: 'own_stay' | 'investment' | null;
  tenure: 'freehold' | 'leasehold' | null;
  new_launch: boolean | null;
  amenities: string[];
  known_fields_count: number;
  last_question: string | null;
}

const createDefaultUserProfile = (): UserProfile => {
  return {
    intent: null,
    budget: {
      min: null,
      max: null
    },
    property_type: [],
    states: [],
    areas: [],
    bedrooms: null,
    bathrooms: null,
    purpose: null,
    tenure: null,
    new_launch: null,
    amenities: [],
    known_fields_count: 0,
    last_question: null
  };
};

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

const parseUserQuery = (query: string, currentProfile: UserProfile): UserProfile => {
  const updatedProfile = { ...currentProfile };
  const queryLower = query.toLowerCase();
  
  // Extract intent
  const buyKeywords = ['buy', 'buying', 'purchase', 'purchasing', 'own', 'ownership', 'invest', 'investment'];
  const rentKeywords = ['rent', 'rental', 'renting', 'lease', 'leasing', 'tenant', 'monthly'];
  
  if (buyKeywords.some(keyword => queryLower.includes(keyword)) && !updatedProfile.intent) {
    updatedProfile.intent = 'buy';
  } else if (rentKeywords.some(keyword => queryLower.includes(keyword)) && !updatedProfile.intent) {
    updatedProfile.intent = 'rent';
  }
  
  // Extract budget
  const budgetPatterns = [
    /(?:under|below|less than|max|maximum|budget)\s*rm?\s*(\d+(?:,\d{3})*(?:k|000)?)/gi,
    /(?:above|over|more than|min|minimum)\s*rm?\s*(\d+(?:,\d{3})*(?:k|000)?)/gi,
    /rm?\s*(\d+(?:,\d{3})*(?:k|000)?)\s*(?:to|-)\s*rm?\s*(\d+(?:,\d{3})*(?:k|000)?)/gi
  ];
  
  budgetPatterns.forEach(pattern => {
    const matches = Array.from(queryLower.matchAll(pattern));
    matches.forEach(match => {
      if (match[0].includes('under') || match[0].includes('below') || match[0].includes('max') || match[0].includes('budget')) {
        let maxPrice = parseInt(match[1].replace(/,/g, ''));
        if (match[1].includes('k') || maxPrice < 10000) maxPrice *= 1000;
        updatedProfile.budget.max = maxPrice;
      } else if (match[0].includes('above') || match[0].includes('over') || match[0].includes('min')) {
        let minPrice = parseInt(match[1].replace(/,/g, ''));
        if (match[1].includes('k') || minPrice < 10000) minPrice *= 1000;
        updatedProfile.budget.min = minPrice;
      } else if (match[0].includes('to') || match[0].includes('-')) {
        let minPrice = parseInt(match[1].replace(/,/g, ''));
        let maxPrice = parseInt(match[2].replace(/,/g, ''));
        if (match[1].includes('k') || minPrice < 10000) minPrice *= 1000;
        if (match[2].includes('k') || maxPrice < 10000) maxPrice *= 1000;
        updatedProfile.budget.min = minPrice;
        updatedProfile.budget.max = maxPrice;
      }
    });
  });
  
  // Extract property type
  const propertyTypes = {
    'condo': ['condo', 'condominium'],
    'apartment': ['apartment', 'flat', 'unit'],
    'house': ['house', 'home', 'landed', 'terrace', 'semi-d', 'bungalow', 'townhouse'],
    'villa': ['villa'],
    'studio': ['studio'],
    'shophouse': ['shophouse', 'shop house'],
    'office': ['office'],
    'shop': ['shop', 'retail'],
    'industrial': ['industrial', 'warehouse', 'factory']
  };
  
  Object.entries(propertyTypes).forEach(([type, keywords]) => {
    if (keywords.some(keyword => queryLower.includes(keyword)) && !updatedProfile.property_type.includes(type)) {
      updatedProfile.property_type.push(type);
    }
  });
  
  // Extract bedrooms/bathrooms
  const bedroomMatch = queryLower.match(/(\d+)\s*(?:bed|bedroom|br)/);
  if (bedroomMatch && !updatedProfile.bedrooms) {
    updatedProfile.bedrooms = parseInt(bedroomMatch[1]);
  }
  
  const bathroomMatch = queryLower.match(/(\d+)\s*(?:bath|bathroom)/);
  if (bathroomMatch && !updatedProfile.bathrooms) {
    updatedProfile.bathrooms = parseInt(bathroomMatch[1]);
  }
  
  // Extract locations
  const malaysianStates = [
    'johor', 'kedah', 'kelantan', 'malacca', 'melaka', 'negeri sembilan', 
    'pahang', 'penang', 'perak', 'perlis', 'sabah', 'sarawak', 'selangor', 
    'terengganu', 'kuala lumpur', 'kl', 'putrajaya', 'labuan'
  ];
  
  const areas = [
    'johor bahru', 'jb', 'georgetown', 'petaling jaya', 'pj', 'subang jaya',
    'cyberjaya', 'shah alam', 'klcc', 'mont kiara', 'bangsar', 'damansara',
    'taman daya', 'taman molek', 'sutera utama', 'mount austin', 'horizon hills',
    'medini', 'iskandar', 'city square', 'paradigm', 'bukit bintang', 'cheras',
    'ampang', 'kajang', 'setia alam', 'sunway', 'puchong'
  ];
  
  malaysianStates.forEach(state => {
    if (queryLower.includes(state) && !updatedProfile.states.includes(state)) {
      updatedProfile.states.push(state);
    }
  });
  
  areas.forEach(area => {
    if (queryLower.includes(area) && !updatedProfile.areas.includes(area)) {
      updatedProfile.areas.push(area);
    }
  });
  
  // Extract amenities
  const amenityKeywords = [
    'pool', 'swimming', 'gym', 'fitness', 'parking', 'security', 'garden',
    'furnished', 'wifi', 'internet', 'playground', 'clubhouse', 'tennis',
    'school', 'mall', 'university', 'mrt', 'lrt', 'train', 'hospital'
  ];
  
  amenityKeywords.forEach(amenity => {
    if (queryLower.includes(amenity) && !updatedProfile.amenities.includes(amenity)) {
      updatedProfile.amenities.push(amenity);
    }
  });
  
  // Extract purpose
  if ((queryLower.includes('own stay') || queryLower.includes('live') || queryLower.includes('family')) && !updatedProfile.purpose) {
    updatedProfile.purpose = 'own_stay';
  } else if ((queryLower.includes('invest') || queryLower.includes('rental') || queryLower.includes('roi')) && !updatedProfile.purpose) {
    updatedProfile.purpose = 'investment';
  }
  
  // Extract tenure
  if (queryLower.includes('freehold') && !updatedProfile.tenure) {
    updatedProfile.tenure = 'freehold';
  } else if (queryLower.includes('leasehold') && !updatedProfile.tenure) {
    updatedProfile.tenure = 'leasehold';
  }
  
  // Extract new launch preference
  if ((queryLower.includes('new launch') || queryLower.includes('new development')) && updatedProfile.new_launch === null) {
    updatedProfile.new_launch = true;
  } else if ((queryLower.includes('resale') || queryLower.includes('existing')) && updatedProfile.new_launch === null) {
    updatedProfile.new_launch = false;
  }
  
  // Count known fields
  let count = 0;
  if (updatedProfile.intent) count++;
  if (updatedProfile.budget.min || updatedProfile.budget.max) count++;
  if (updatedProfile.property_type.length > 0) count++;
  if (updatedProfile.states.length > 0 || updatedProfile.areas.length > 0) count++;
  if (updatedProfile.bedrooms) count++;
  if (updatedProfile.purpose) count++;
  if (updatedProfile.tenure) count++;
  if (updatedProfile.new_launch !== null) count++;
  
  updatedProfile.known_fields_count = count;
  
  return updatedProfile;
};

export const searchPropertiesWithAI = async (
  userQuery: string, 
  properties: PropertyWithImages[],
  locationInfo?: any,
  conversationHistory?: string[],
  currentUserProfile?: UserProfile
): Promise<{ response: string; matchedProperties: PropertyWithImages[]; userProfile: UserProfile }> => {
  
  // Use provided profile or create default
  const userProfile = currentUserProfile || createDefaultUserProfile();
  
  // Parse user query and update profile
  const updatedProfile = parseUserQuery(userQuery, userProfile);
  
  // Detect user intent (jokes, silly questions, greetings, etc.)
  const intent = detectIntent(userQuery);
  const smartResponse = generateSmartResponse(userQuery, intent);

  if (smartResponse) {
    return {
      response: smartResponse,
      matchedProperties: [],
      userProfile: updatedProfile
    };
  }

  // Check if this is a property-related query
  const isPropertyQuery = isPropertyRelated(userQuery);

  if (!isPropertyQuery) {
    // Handle non-property questions with ChatGPT
    const chatResponse = await handleGeneralChat(userQuery);
    return {
      response: chatResponse,
      matchedProperties: [],
      userProfile: updatedProfile
    };
  }

  // Check if we have enough information to search
  if (updatedProfile.known_fields_count >= 3) {
    // Search for properties
    const searchFilters: any = {};
    
    if (updatedProfile.intent) {
      searchFilters.listing_type = updatedProfile.intent === 'buy' ? 'sale' : 'rent';
    }
    
    if (updatedProfile.budget.min) {
      searchFilters.min_price = updatedProfile.budget.min;
    }
    
    if (updatedProfile.budget.max) {
      searchFilters.max_price = updatedProfile.budget.max;
    }
    
    if (updatedProfile.property_type.length > 0) {
      searchFilters.property_type = updatedProfile.property_type[0];
    }
    
    if (updatedProfile.bedrooms) {
      searchFilters.bedrooms = updatedProfile.bedrooms;
    }
    
    if (updatedProfile.states.length > 0) {
      searchFilters.city = updatedProfile.states[0];
    } else if (updatedProfile.areas.length > 0) {
      searchFilters.city = updatedProfile.areas[0];
    }
    
    searchFilters.limit = 6;
    
    try {
      let allProperties = await propertyService.getProperties({ limit: 50 });

      // Score and rank properties
      const scoredProperties = allProperties
        .map(property => ({
          property,
          score: scorePropertyMatch(property, {
            intent: updatedProfile.intent,
            budget: updatedProfile.budget,
            property_type: updatedProfile.property_type,
            states: updatedProfile.states,
            areas: updatedProfile.areas,
            bedrooms: updatedProfile.bedrooms,
            amenities: updatedProfile.amenities
          })
        }))
        .filter(item => item.score > 20)
        .sort((a, b) => b.score - a.score)
        .slice(0, 6);

      const matchedProperties = scoredProperties.map(item => item.property);

      if (matchedProperties.length > 0) {
        let response = `Great! I found ${matchedProperties.length} properties that match your needs:\n\n`;

        matchedProperties.forEach((property, index) => {
          const matchReasons = getMatchReasons(property, updatedProfile);
          const description = generatePropertyDescription(property, matchReasons);
          response += `${index + 1}. ${description}\n\n`;
        });

        response += "Click on any property below to see full details!";

        return {
          response: response.trim(),
          matchedProperties,
          userProfile: updatedProfile
        };
      } else {
        // Try with relaxed filters
        const relaxedProperties = await propertyService.getProperties({
          listing_type: searchFilters.listing_type,
          limit: 6
        });

        if (relaxedProperties.length > 0) {
          return {
            response: "I couldn't find exact matches, but here are some similar properties you might like. Try adjusting your budget or location?",
            matchedProperties: relaxedProperties,
            userProfile: updatedProfile
          };
        }

        return {
          response: "No properties match your criteria right now. Try adjusting your budget or location preferences, or tell me more about what you're looking for!",
          matchedProperties: [],
          userProfile: updatedProfile
        };
      }
    } catch (error) {
      console.error('Error searching properties:', error);
      return {
        response: "Sorry, I'm having trouble searching right now. Please try again.",
        matchedProperties: [],
        userProfile: updatedProfile
      };
    }
  } else {
    // Ask clarifying question
    const question = generateClarifyingQuestion(updatedProfile);
    updatedProfile.last_question = question;
    
    return {
      response: question,
      matchedProperties: [],
      userProfile: updatedProfile
    };
  }
};

const getMatchReasons = (property: PropertyWithImages, profile: UserProfile): string[] => {
  const reasons: string[] = [];

  if (profile.intent === 'buy' && property.listing_type === 'sale') {
    reasons.push('for sale as requested');
  } else if (profile.intent === 'rent' && property.listing_type === 'rent') {
    reasons.push('for rent as requested');
  }

  if (profile.bedrooms && property.bedrooms === profile.bedrooms) {
    reasons.push(`${property.bedrooms} bedrooms`);
  }

  if (profile.budget.max && property.price <= profile.budget.max) {
    reasons.push('within your budget');
  }

  if (profile.property_type.length > 0 && profile.property_type.includes(property.property_type)) {
    reasons.push(`${property.property_type} as you wanted`);
  }

  if (profile.areas.length > 0 && profile.areas.some(area =>
    property.city.toLowerCase().includes(area.toLowerCase())
  )) {
    reasons.push('in your preferred area');
  }

  if (profile.states.length > 0 && profile.states.some(state =>
    property.state.toLowerCase().includes(state.toLowerCase())
  )) {
    reasons.push('in your preferred state');
  }

  if (profile.amenities.length > 0) {
    const matchedAmenities = profile.amenities.filter(amenity =>
      property.amenities.some(propAmenity =>
        propAmenity.toLowerCase().includes(amenity.toLowerCase())
      )
    );
    if (matchedAmenities.length > 0) {
      reasons.push(`has ${matchedAmenities.slice(0, 2).join(', ')}`);
    }
  }

  return reasons;
};

const generateClarifyingQuestion = (profile: UserProfile): string => {
  if (!profile.intent) {
    return "Are you looking to buy or rent a property?";
  }
  
  if (profile.states.length === 0 && profile.areas.length === 0) {
    return "Which area or state are you interested in?";
  }
  
  if (!profile.budget.min && !profile.budget.max) {
    return "What's your budget range?";
  }
  
  if (profile.property_type.length === 0) {
    return "What type of property are you looking for? (condo, house, apartment, etc.)";
  }
  
  if (!profile.bedrooms) {
    return "How many bedrooms do you need?";
  }
  
  if (!profile.purpose) {
    return "Is this for your own stay or investment?";
  }
  
  return "Tell me more about your preferences to help find the perfect property.";
};

// Export the default profile creator for use in other components
export const getDefaultUserProfile = (): UserProfile => {
  return createDefaultUserProfile();
};

const isPropertyRelated = (query: string): boolean => {
  const propertyKeywords = [
    'buy', 'rent', 'house', 'apartment', 'condo', 'villa', 'studio', 'property',
    'bedroom', 'bathroom', 'sqft', 'rm', 'price', 'budget', 'johor', 'kl',
    'penang', 'selangor', 'furnished', 'pool', 'gym', 'parking', 'agent',
    'freehold', 'leasehold', 'new launch', 'resale', 'investment', 'own stay'
  ];
  
  const queryLower = query.toLowerCase();
  return propertyKeywords.some(keyword => queryLower.includes(keyword));
};

const handleGeneralChat = async (query: string): Promise<string> => {
  try {
    if (openai) {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant. Keep responses brief and friendly. Always end by asking if they're looking for properties."
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
      return response + " Do you look for property?";
    } else if (genAI) {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const result = await model.generateContent(`Keep response brief and friendly. Always end asking about properties. Query: ${query}`);
      const response = await result.response;
      return response.text() || "I'm here to help! Do you look for property?";
    }
  } catch (error) {
    console.error('Error with AI chat:', error);
  }
  
  return "That's interesting! Do you look for property?";
};