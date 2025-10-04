import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { PropertyWithImages } from './propertyService';

export interface ConversationContext {
  intent: 'buy' | 'rent' | 'new_development' | 'general' | null;
  budget: { min: number | null; max: number | null };
  location: { states: string[]; cities: string[]; areas: string[] };
  propertyType: string[];
  bedrooms: number | null;
  bathrooms: number | null;
  amenities: string[];
  preferences: {
    purpose: 'own_stay' | 'investment' | null;
    tenure: 'freehold' | 'leasehold' | null;
    furnished: 'fully_furnished' | 'partially_furnished' | 'unfurnished' | null;
  };
  personalInfo: {
    salary: number | null;
    familySize: number | null;
    occupation: string | null;
    age: number | null;
    maritalStatus: 'single' | 'married' | 'divorced' | null;
    hasChildren: boolean;
    workLocation: string | null;
  };
  constraints: {
    mustBeNear: string[];
    timeframe: string | null;
    moveInDate: string | null;
    maxCommute: string | null;
  };
  lifestyle: {
    petOwner: boolean;
    carOwner: boolean;
    workFromHome: boolean;
    hobbies: string[];
  };
  conversationStage: 'greeting' | 'gathering' | 'refining' | 'showing' | 'closing';
  missingInfo: string[];
  lastQuery: string;
  conversationHistory: Array<{ role: 'user' | 'ai'; content: string; timestamp: Date }>;
  autoInferredBudget: boolean;
}

export const createDefaultContext = (): ConversationContext => ({
  intent: null,
  budget: { min: null, max: null },
  location: { states: [], cities: [], areas: [] },
  propertyType: [],
  bedrooms: null,
  bathrooms: null,
  amenities: [],
  preferences: { purpose: null, tenure: null, furnished: null },
  personalInfo: {
    salary: null,
    familySize: null,
    occupation: null,
    age: null,
    maritalStatus: null,
    hasChildren: false,
    workLocation: null
  },
  constraints: {
    mustBeNear: [],
    timeframe: null,
    moveInDate: null,
    maxCommute: null
  },
  lifestyle: {
    petOwner: false,
    carOwner: false,
    workFromHome: false,
    hobbies: []
  },
  conversationStage: 'greeting',
  missingInfo: ['intent', 'location', 'budget'],
  lastQuery: '',
  conversationHistory: [],
  autoInferredBudget: false
});

let openai: OpenAI | null = null;
let genAI: GoogleGenerativeAI | null = null;

function initializeAI() {
  const openaiKey = import.meta.env.VITE_OPENAI_API_KEY;
  const geminiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (openaiKey && openaiKey !== 'your_openai_api_key_here' && openaiKey.trim()) {
    try {
      openai = new OpenAI({ apiKey: openaiKey, dangerouslyAllowBrowser: true });
    } catch (error) {
      console.error('OpenAI initialization failed:', error);
    }
  }

  if (geminiKey && geminiKey !== 'your_gemini_api_key_here' && geminiKey.trim()) {
    try {
      genAI = new GoogleGenerativeAI(geminiKey);
    } catch (error) {
      console.error('Gemini initialization failed:', error);
    }
  }
}

initializeAI();

const MALAYSIAN_LOCATIONS = {
  states: [
    'johor', 'kedah', 'kelantan', 'malacca', 'melaka', 'negeri sembilan',
    'pahang', 'penang', 'perak', 'perlis', 'sabah', 'sarawak', 'selangor',
    'terengganu', 'kuala lumpur', 'kl', 'putrajaya', 'labuan'
  ],
  cities: [
    'johor bahru', 'jb', 'georgetown', 'petaling jaya', 'pj', 'subang jaya',
    'cyberjaya', 'shah alam', 'klcc', 'mont kiara', 'bangsar', 'damansara',
    'kajang', 'setia alam', 'sunway', 'puchong', 'ampang', 'cheras'
  ],
  areas: [
    'taman daya', 'taman molek', 'sutera utama', 'sutera', 'mount austin',
    'horizon hills', 'medini', 'iskandar', 'city square', 'paradigm',
    'bukit bintang', 'batu ferringhi', 'setia eco gardens', 'forest city',
    'nusajaya', 'gelang patah', 'skudai', 'taman universiti'
  ]
};

const PROPERTY_TYPES = {
  residential: ['condo', 'condominium', 'apartment', 'flat', 'house', 'terrace',
                'semi-d', 'semi-detached', 'bungalow', 'villa', 'townhouse',
                'studio', 'penthouse', 'duplex'],
  commercial: ['shop', 'shophouse', 'office', 'retail', 'commercial'],
  industrial: ['warehouse', 'factory', 'industrial']
};

const AMENITIES = [
  'pool', 'swimming pool', 'gym', 'fitness', 'parking', 'security', 'garden',
  'furnished', 'wifi', 'internet', 'playground', 'clubhouse', 'tennis',
  'school', 'mall', 'university', 'mrt', 'lrt', 'train', 'hospital',
  'beach', 'sea view', 'city view', 'balcony', 'spa', 'sauna', 'bbq',
  'concierge', 'lift', 'elevator', 'jogging track', 'sky lounge'
];

const JOKE_PATTERNS = [
  /\b(free|rm\s*0|rm\s*1|zero\s+ringgit|no\s+money)\b/i,
  /\b(castle|palace|island|spaceship|moon|mars)\b/i,
  /\b(tree\s*house|treehouse|cave|tent|igloo)\b/i,
  /\b(can\s+i\s+(live\s+in|stay\s+in|rent)\s+(your|the)\s+(office|brain|car))\b/i,
  /\b(sell\s+(your|my)\s+(soul|kidney|car\s+for\s+house))\b/i,
  /\b(magic|unicorn|dragon|fairy)\b/i
];

const JOKE_RESPONSES = [
  "Haha! I love your sense of humor! While I can't make properties appear by magic, I can definitely help you find amazing deals within a real budget. What's your actual price range?",
  "That's hilarious! You're testing me, aren't you? Let's be serious for a moment - I'm here to help you find genuine properties. Tell me what you're really looking for!",
  "You've got jokes! I appreciate that. But seriously, I have some fantastic properties that might actually fit your needs. Want to explore some realistic options?",
  "Nice try! If properties were that easy to get, we'd all be living in mansions! Let me help you find something within reach. What's your budget looking like?",
  "Ha! I wish the property market worked that way! Since we're in the real world, let's find you a place you can actually afford. What's your budget?"
];

export class SmartPropertyAI {
  private context: ConversationContext;

  constructor(initialContext?: ConversationContext) {
    this.context = initialContext || createDefaultContext();
  }

  async processMessage(userMessage: string): Promise<{
    response: string;
    context: ConversationContext;
    shouldShowProperties: boolean;
    confidence: number;
  }> {
    this.context.lastQuery = userMessage;
    this.context.conversationHistory.push({
      role: 'user',
      content: userMessage,
      timestamp: new Date()
    });

    const lowerMessage = userMessage.toLowerCase().trim();

    // Check for jokes and silly questions first
    if (this.isJoke(lowerMessage)) {
      const response = this.getRandomJokeResponse();
      this.addAIResponse(response);
      return {
        response,
        context: this.context,
        shouldShowProperties: false,
        confidence: 1.0
      };
    }

    // Handle greetings
    if (this.isGreeting(lowerMessage)) {
      const response = this.getGreetingResponse();
      this.addAIResponse(response);
      return {
        response,
        context: this.context,
        shouldShowProperties: false,
        confidence: 1.0
      };
    }

    // Handle farewells
    if (this.isFarewell(lowerMessage)) {
      const response = this.getFarewellResponse();
      this.addAIResponse(response);
      return {
        response,
        context: this.context,
        shouldShowProperties: false,
        confidence: 1.0
      };
    }

    // Handle thank you
    if (this.isThankYou(lowerMessage)) {
      const response = "You're very welcome! Is there anything else you'd like to know about properties or would you like me to refine the search?";
      this.addAIResponse(response);
      return {
        response,
        context: this.context,
        shouldShowProperties: false,
        confidence: 1.0
      };
    }

    // Handle joke requests
    if (this.isJokeRequest(lowerMessage)) {
      const response = "Here's one: Why did the property agent bring a ladder to work? Because they wanted to reach the HIGH-RISE apartments! 😄 Now, let's find you a real property that'll make you smile!";
      this.addAIResponse(response);
      return {
        response,
        context: this.context,
        shouldShowProperties: false,
        confidence: 1.0
      };
    }

    // Check if this is a refinement query
    const isRefinement = this.isRefinementQuery(lowerMessage);

    // Extract information from message
    await this.extractInformation(userMessage);

    // Determine response based on context
    const response = await this.generateSmartResponse(isRefinement);
    this.addAIResponse(response.text);

    return {
      response: response.text,
      context: this.context,
      shouldShowProperties: response.showProperties,
      confidence: response.confidence
    };
  }

  private isRefinementQuery(message: string): boolean {
    // Detect if user is adding more filters/refinements to existing search
    const refinementIndicators = [
      'in johor', 'in kl', 'in penang', 'in selangor', // Adding location
      'with pool', 'with gym', 'with parking', // Adding amenities
      'near', 'close to', // Adding proximity
      'cheaper', 'lower', 'reduce', // Budget adjustment
      'bigger', 'larger', 'more bedrooms', // Size adjustment
      'only', 'just', 'specifically', // Narrowing down
      'actually', 'preferably', 'better if' // Preference adjustment
    ];

    // If user has already seen properties (conversation stage is showing/refining)
    // and they provide new criteria, it's a refinement
    if (this.context.conversationStage === 'showing' || this.context.conversationStage === 'refining') {
      return refinementIndicators.some(indicator => message.includes(indicator)) ||
             message.split(' ').length <= 5; // Short messages after showing are usually refinements
    }

    return false;
  }

  private isJoke(message: string): boolean {
    return JOKE_PATTERNS.some(pattern => pattern.test(message));
  }

  private getRandomJokeResponse(): string {
    return JOKE_RESPONSES[Math.floor(Math.random() * JOKE_RESPONSES.length)];
  }

  private isGreeting(message: string): boolean {
    const greetings = ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening', 'greetings', 'howdy', 'sup', 'yo'];
    return greetings.some(g => message === g || message.startsWith(g + ' ') || message.startsWith(g + ','));
  }

  private getGreetingResponse(): string {
    const greetings = [
      "Hi there! I'm here to help you find the perfect property. What are you looking for today?",
      "Hello! Welcome! I'd love to help you with your property search. What brings you here?",
      "Hey! Great to see you! Let's find you an amazing property. What are you interested in?",
      "Hi! I'm your property assistant. Tell me what you're looking for and I'll help you find it!",
      "Hello! Ready to find your ideal property? Just tell me what you have in mind!",
      "Hi there! Let's get started on finding your perfect place. What are you thinking?"
    ];
    this.context.conversationStage = 'gathering';
    return greetings[Math.floor(Math.random() * greetings.length)];
  }

  private isFarewell(message: string): boolean {
    const farewells = ['bye', 'goodbye', 'see you', 'later', 'farewell', 'take care', 'gotta go', 'have to go'];
    return farewells.some(f => message.includes(f));
  }

  private getFarewellResponse(): string {
    return "Thanks for chatting with me! Feel free to come back anytime you need help finding properties. Have a wonderful day!";
  }

  private isThankYou(message: string): boolean {
    return ['thank', 'thanks', 'appreciate', 'thx', 'ty'].some(t => message.includes(t));
  }

  private isJokeRequest(message: string): boolean {
    return message.includes('joke') || message.includes('funny') || message.includes('make me laugh');
  }

  private async extractInformation(message: string): Promise<void> {
    const lowerMessage = message.toLowerCase();

    // Extract personal information first (salary, family, etc.)
    this.extractPersonalInfo(lowerMessage);

    // Extract constraints and lifestyle
    this.extractConstraints(lowerMessage);
    this.extractLifestyle(lowerMessage);

    // Calculate budget from salary if mentioned
    if (this.context.personalInfo.salary && !this.context.budget.max) {
      this.calculateAffordabilityFromSalary();
    }

    // Extract intent with smart inference
    if (!this.context.intent) {
      const inferredIntent = this.inferIntentFromContext(lowerMessage);
      if (inferredIntent) {
        this.context.intent = inferredIntent;
        this.removeMissingInfo('intent');
      }
    }

    // Extract budget (explicit mentions override salary calculation)
    this.extractBudget(lowerMessage);

    // Extract location
    this.extractLocation(lowerMessage);

    // Extract property type
    this.extractPropertyType(lowerMessage);

    // Extract bedrooms (infer from family size if not explicit)
    this.extractBedrooms(lowerMessage);
    if (!this.context.bedrooms && this.context.personalInfo.familySize) {
      this.inferBedroomsFromFamily();
    }

    // Extract bathrooms
    this.extractBathrooms(lowerMessage);

    // Extract amenities
    this.extractAmenities(lowerMessage);

    // Extract preferences
    this.extractPreferences(lowerMessage);

    // Update conversation stage
    this.updateConversationStage();
  }

  private matchesIntent(message: string, intent: 'buy' | 'rent' | 'new_development'): boolean {
    const patterns = {
      buy: ['buy', 'buying', 'purchase', 'purchasing', 'own', 'ownership', 'invest in', 'acquire', 'for sale', 'looking for'],
      rent: ['rent', 'rental', 'renting', 'lease', 'leasing', 'tenant', 'monthly', 'for rent', 'per month', '/month'],
      new_development: ['new launch', 'new development', 'new project', 'launching', 'pre-launch', 'under construction']
    };
    return patterns[intent].some(keyword => message.includes(keyword));
  }

  private inferIntentFromContext(message: string): 'buy' | 'rent' | 'new_development' | null {
    const lowerMessage = message.toLowerCase();

    // Check for new development indicators first
    if (this.matchesIntent(lowerMessage, 'new_development')) {
      return 'new_development';
    }

    // Check for explicit rent indicators
    if (this.matchesIntent(lowerMessage, 'rent')) {
      return 'rent';
    }

    // Check for explicit buy indicators
    if (this.matchesIntent(lowerMessage, 'buy')) {
      return 'buy';
    }

    // Contextual inference from price
    const priceInference = this.inferIntentFromPrice(lowerMessage);
    if (priceInference) {
      return priceInference;
    }

    // Contextual inference from property type and modifiers
    const propertyInference = this.inferIntentFromPropertyType(lowerMessage);
    if (propertyInference) {
      return propertyInference;
    }

    return null;
  }

  private inferIntentFromPrice(message: string): 'buy' | 'rent' | null {
    // Extract any price mentioned
    const pricePatterns = [
      /(?:above|over|more than|at least)\s*(?:rm\s*)?(\d+(?:,?\d{3})*(?:\.\d+)?)\s*([km])?(?:\s*million)?/gi,
      /(?:under|below|less than|max|maximum)\s*(?:rm\s*)?(\d+(?:,?\d{3})*(?:\.\d+)?)\s*([km])?(?:\s*million)?/gi,
      /(?:rm\s*)?(\d+(?:,?\d{3})*(?:\.\d+)?)\s*([km])?(?:\s*million)?/gi
    ];

    let maxPrice = 0;
    let hasMonthlyContext = false;

    // Check for monthly/rental context
    if (message.includes('monthly') || message.includes('per month') ||
        message.includes('/month') || message.includes('month')) {
      hasMonthlyContext = true;
    }

    pricePatterns.forEach(pattern => {
      const matches = Array.from(message.matchAll(pattern));
      matches.forEach(match => {
        let price = parseFloat(match[1].replace(/,/g, ''));

        // Handle 'million' keyword
        if (message.includes('million')) {
          price *= 1000000;
        }
        // Handle suffixes
        else if (match[2] === 'k') {
          price *= 1000;
        } else if (match[2] === 'm') {
          price *= 1000000;
        }
        // If it's a small number without context, infer from size
        else if (price < 10000 && !hasMonthlyContext) {
          // Numbers like 500, 600, 2 without context
          if (price < 100) {
            // Could be 500k, 2m, etc.
            price *= 1000;
          } else {
            // 5000, 8000 likely means RM5000, RM8000
            // Keep as is for now
          }
        }

        if (price > maxPrice) {
          maxPrice = price;
        }
      });
    });

    if (maxPrice === 0) {
      return null;
    }

    // If monthly context is present, it's rent regardless of price
    if (hasMonthlyContext) {
      return 'rent';
    }

    // Price-based inference for buying
    // If price is above RM50,000, it's very likely buying
    if (maxPrice >= 50000) {
      return 'buy';
    }

    // If price is under RM10,000 without monthly context, still likely rent
    if (maxPrice < 10000) {
      return 'rent';
    }

    // Middle range (10k-50k) - ambiguous, need more context
    return null;
  }

  private inferIntentFromPropertyType(message: string): 'buy' | 'rent' | null {
    const lowerMessage = message.toLowerCase();

    // Luxury indicators strongly suggest buying
    const luxuryIndicators = [
      'luxury', 'premium', 'exclusive', 'prestigious', 'high-end', 'upscale',
      'villa', 'bungalow', 'mansion', 'penthouse',
      'private pool', 'private garden', 'private lift', 'wine cellar',
      'gated community', 'golf course'
    ];

    const hasLuxuryIndicator = luxuryIndicators.some(indicator => lowerMessage.includes(indicator));

    // Investment indicators suggest buying
    const investmentIndicators = [
      'investment', 'roi', 'rental income', 'capital appreciation',
      'property investment', 'invest', 'portfolio'
    ];

    const hasInvestmentIndicator = investmentIndicators.some(indicator => lowerMessage.includes(indicator));

    // Ownership indicators
    const ownershipIndicators = [
      'own home', 'first home', 'dream home', 'family home',
      'settle down', 'permanent'
    ];

    const hasOwnershipIndicator = ownershipIndicators.some(indicator => lowerMessage.includes(indicator));

    // If luxury, investment, or ownership indicators with no explicit rent mention
    if ((hasLuxuryIndicator || hasInvestmentIndicator || hasOwnershipIndicator) &&
        !this.matchesIntent(lowerMessage, 'rent')) {
      return 'buy';
    }

    // Temporary/short-term indicators suggest renting
    const temporaryIndicators = [
      'temporary', 'short term', 'short-term', 'few months',
      'temporary stay', 'relocating', 'just moved', 'transfer',
      'student', 'intern', 'contract work'
    ];

    const hasTemporaryIndicator = temporaryIndicators.some(indicator => lowerMessage.includes(indicator));

    if (hasTemporaryIndicator && !this.matchesIntent(lowerMessage, 'buy')) {
      return 'rent';
    }

    return null;
  }

  private extractBudget(message: string): void {
    // Pattern: RM 500,000 or RM 500k or 500000 or 500k or 2 million
    const budgetPatterns = [
      /(?:under|below|less than|max|maximum|budget|up to)\s*(?:rm\s*)?(\d+(?:,?\d{3})*(?:\.\d+)?)\s*([km])?(?:\s*million)?/gi,
      /(?:above|over|more than|min|minimum|at least)\s*(?:rm\s*)?(\d+(?:,?\d{3})*(?:\.\d+)?)\s*([km])?(?:\s*million)?/gi,
      /(?:rm\s*)?(\d+(?:,?\d{3})*(?:\.\d+)?)\s*([km])?\s*(?:to|-)\s*(?:rm\s*)?(\d+(?:,?\d{3})*(?:\.\d+)?)\s*([km])?(?:\s*million)?/gi,
      /budget\s*(?:is|of|:)?\s*(?:rm\s*)?(\d+(?:,?\d{3})*(?:\.\d+)?)\s*([km])?(?:\s*million)?/gi
    ];

    budgetPatterns.forEach(pattern => {
      const matches = Array.from(message.matchAll(pattern));
      matches.forEach(match => {
        if (match[0].includes('under') || match[0].includes('below') || match[0].includes('less than') ||
            match[0].includes('max') || match[0].includes('up to')) {
          let maxPrice = parseFloat(match[1].replace(/,/g, ''));
          // Check for 'million' in the matched text
          if (match[0].toLowerCase().includes('million')) {
            maxPrice *= 1000000;
          } else if (match[2] === 'k') {
            maxPrice *= 1000;
          } else if (match[2] === 'm') {
            maxPrice *= 1000000;
          } else if (maxPrice < 10000) {
            maxPrice *= 1000;
          }
          this.context.budget.max = maxPrice;
          this.removeMissingInfo('budget');
        } else if (match[0].includes('above') || match[0].includes('over') || match[0].includes('more than') ||
                   match[0].includes('min') || match[0].includes('at least')) {
          let minPrice = parseFloat(match[1].replace(/,/g, ''));
          // Check for 'million' in the matched text
          if (match[0].toLowerCase().includes('million')) {
            minPrice *= 1000000;
          } else if (match[2] === 'k') {
            minPrice *= 1000;
          } else if (match[2] === 'm') {
            minPrice *= 1000000;
          } else if (minPrice < 10000) {
            minPrice *= 1000;
          }
          this.context.budget.min = minPrice;
          this.removeMissingInfo('budget');
        } else if (match[0].includes('to') || match[0].includes('-')) {
          let minPrice = parseFloat(match[1].replace(/,/g, ''));
          let maxPrice = parseFloat(match[3].replace(/,/g, ''));
          // Check for 'million' in the matched text
          if (match[0].toLowerCase().includes('million')) {
            minPrice *= 1000000;
            maxPrice *= 1000000;
          } else {
            if (match[2] === 'k') minPrice *= 1000;
            if (match[2] === 'm') minPrice *= 1000000;
            if (match[4] === 'k') maxPrice *= 1000;
            if (match[4] === 'm') maxPrice *= 1000000;
            if (minPrice < 10000) minPrice *= 1000;
            if (maxPrice < 10000) maxPrice *= 1000;
          }
          this.context.budget.min = minPrice;
          this.context.budget.max = maxPrice;
          this.removeMissingInfo('budget');
        } else {
          let price = parseFloat(match[1].replace(/,/g, ''));
          // Check for 'million' in the matched text
          if (match[0].toLowerCase().includes('million')) {
            price *= 1000000;
          } else if (match[2] === 'k') {
            price *= 1000;
          } else if (match[2] === 'm') {
            price *= 1000000;
          } else if (price < 10000) {
            price *= 1000;
          }
          this.context.budget.max = price;
          this.removeMissingInfo('budget');
        }
      });
    });
  }

  private extractLocation(message: string): void {
    MALAYSIAN_LOCATIONS.states.forEach(state => {
      if (message.includes(state) && !this.context.location.states.includes(state)) {
        this.context.location.states.push(state);
        this.removeMissingInfo('location');
      }
    });

    MALAYSIAN_LOCATIONS.cities.forEach(city => {
      if (message.includes(city) && !this.context.location.cities.includes(city)) {
        this.context.location.cities.push(city);
        this.removeMissingInfo('location');
      }
    });

    MALAYSIAN_LOCATIONS.areas.forEach(area => {
      if (message.includes(area) && !this.context.location.areas.includes(area)) {
        this.context.location.areas.push(area);
        this.removeMissingInfo('location');
      }
    });
  }

  private extractPropertyType(message: string): void {
    Object.values(PROPERTY_TYPES).flat().forEach(type => {
      if (message.includes(type) && !this.context.propertyType.includes(type)) {
        this.context.propertyType.push(type);
      }
    });
  }

  private extractBedrooms(message: string): void {
    const bedroomPatterns = [
      /(\d+)\s*(?:bed|bedroom|br)(?:room)?s?/i,
      /(?:bed|bedroom|br)(?:room)?s?\s*[:=]?\s*(\d+)/i
    ];

    bedroomPatterns.forEach(pattern => {
      const match = message.match(pattern);
      if (match && !this.context.bedrooms) {
        this.context.bedrooms = parseInt(match[1]);
      }
    });
  }

  private extractBathrooms(message: string): void {
    const bathroomPatterns = [
      /(\d+)\s*(?:bath|bathroom)(?:room)?s?/i,
      /(?:bath|bathroom)(?:room)?s?\s*[:=]?\s*(\d+)/i
    ];

    bathroomPatterns.forEach(pattern => {
      const match = message.match(pattern);
      if (match && !this.context.bathrooms) {
        this.context.bathrooms = parseInt(match[1]);
      }
    });
  }

  private extractAmenities(message: string): void {
    AMENITIES.forEach(amenity => {
      if (message.includes(amenity) && !this.context.amenities.includes(amenity)) {
        this.context.amenities.push(amenity);
      }
    });
  }

  private extractPreferences(message: string): void {
    if (message.includes('own stay') || message.includes('live in') || message.includes('family')) {
      this.context.preferences.purpose = 'own_stay';
    } else if (message.includes('invest') || message.includes('rental income') || message.includes('roi')) {
      this.context.preferences.purpose = 'investment';
    }

    if (message.includes('freehold')) {
      this.context.preferences.tenure = 'freehold';
    } else if (message.includes('leasehold')) {
      this.context.preferences.tenure = 'leasehold';
    }

    if (message.includes('fully furnished') || message.includes('fully-furnished')) {
      this.context.preferences.furnished = 'fully_furnished';
    } else if (message.includes('partially furnished') || message.includes('partially-furnished')) {
      this.context.preferences.furnished = 'partially_furnished';
    } else if (message.includes('unfurnished')) {
      this.context.preferences.furnished = 'unfurnished';
    }
  }

  private extractPersonalInfo(message: string): void {
    // Extract salary
    const salaryPatterns = [
      /(?:salary|earn|earning|income|make|making)\s*(?:is|of|:)?\s*(?:rm\s*)?(\d+(?:,?\d{3})*(?:\.\d+)?)\s*([km])?/gi,
      /(?:rm\s*)?(\d+(?:,?\d{3})*(?:\.\d+)?)\s*([km])?\s*(?:salary|income|per month|monthly)/gi
    ];

    salaryPatterns.forEach(pattern => {
      const matches = Array.from(message.matchAll(pattern));
      matches.forEach(match => {
        let salary = parseFloat(match[1].replace(/,/g, ''));
        if (match[2] === 'k') salary *= 1000;
        if (match[2] === 'm') salary *= 1000000;
        if (salary < 100 && !match[2]) salary *= 1000; // Assume thousands if small number
        if (!this.context.personalInfo.salary) {
          this.context.personalInfo.salary = salary;
        }
      });
    });

    // Extract family size
    const familyPatterns = [
      /family\s+of\s+(\d+)/gi,
      /(\d+)\s+(?:people|person|members?|family members?)/gi,
      /(?:me|my wife|my husband|my partner)\s+(?:and|&)\s+(\d+)\s+(?:kids?|children)/gi,
      /(\d+)\s+(?:kids?|children)/gi
    ];

    familyPatterns.forEach(pattern => {
      const match = message.match(pattern);
      if (match) {
        const num = parseInt(match[1]);
        if (num > 0 && num < 20) {
          if (message.includes('kids') || message.includes('children')) {
            this.context.personalInfo.familySize = num + 2; // Kids + parents
            this.context.personalInfo.hasChildren = true;
          } else {
            this.context.personalInfo.familySize = num;
          }
        }
      }
    });

    // Marital status
    if (message.includes('married') || message.includes('wife') || message.includes('husband') || message.includes('spouse')) {
      this.context.personalInfo.maritalStatus = 'married';
      if (!this.context.personalInfo.familySize) {
        this.context.personalInfo.familySize = 2;
      }
    } else if (message.includes('single') || message.includes('bachelor')) {
      this.context.personalInfo.maritalStatus = 'single';
      if (!this.context.personalInfo.familySize) {
        this.context.personalInfo.familySize = 1;
      }
    }

    // Work location
    MALAYSIAN_LOCATIONS.cities.forEach(city => {
      if (message.includes(`work in ${city}`) || message.includes(`working in ${city}`) ||
          message.includes(`office in ${city}`) || message.includes(`job in ${city}`)) {
        this.context.personalInfo.workLocation = city;
      }
    });

    // Occupation
    const occupations = [
      'engineer', 'doctor', 'lawyer', 'teacher', 'manager', 'developer',
      'designer', 'accountant', 'banker', 'consultant', 'analyst', 'executive',
      'sales', 'marketing', 'hr', 'finance', 'it', 'software', 'nurse'
    ];

    occupations.forEach(occupation => {
      if (message.includes(occupation) && !this.context.personalInfo.occupation) {
        this.context.personalInfo.occupation = occupation;
      }
    });
  }

  private extractConstraints(message: string): void {
    // Near locations
    const nearPatterns = [
      /near\s+(?:to\s+)?(.+?)(?:\s+and|\s+or|,|$)/gi,
      /close\s+to\s+(.+?)(?:\s+and|\s+or|,|$)/gi,
      /within\s+(?:\d+\s*(?:km|minutes?))?\s+(?:of|from|to)\s+(.+?)(?:\s+and|\s+or|,|$)/gi
    ];

    nearPatterns.forEach(pattern => {
      const matches = Array.from(message.matchAll(pattern));
      matches.forEach(match => {
        const location = match[1].trim();
        if (location && location.length > 2 && location.length < 50) {
          if (!this.context.constraints.mustBeNear.includes(location)) {
            this.context.constraints.mustBeNear.push(location);
          }
        }
      });
    });

    // Timeframe
    if (message.includes('urgent') || message.includes('asap') || message.includes('immediately')) {
      this.context.constraints.timeframe = 'urgent';
    } else if (message.includes('within') && message.includes('month')) {
      this.context.constraints.timeframe = 'within_month';
    } else if (message.includes('few months') || message.includes('3 months')) {
      this.context.constraints.timeframe = 'few_months';
    } else if (message.includes('no rush') || message.includes('flexible')) {
      this.context.constraints.timeframe = 'flexible';
    }

    // Commute time
    const commutePattern = /(\d+)\s*(?:minutes?|mins?|min)\s+(?:commute|drive|travel)/gi;
    const match = message.match(commutePattern);
    if (match) {
      this.context.constraints.maxCommute = match[0];
    }
  }

  private extractLifestyle(message: string): void {
    // Pet owner
    if (message.includes('pet') || message.includes('dog') || message.includes('cat')) {
      this.context.lifestyle.petOwner = true;
      if (!this.context.amenities.includes('pet friendly')) {
        this.context.amenities.push('pet friendly');
      }
    }

    // Car owner
    if (message.includes('car') || message.includes('parking') || message.includes('vehicle')) {
      this.context.lifestyle.carOwner = true;
      if (!this.context.amenities.includes('parking')) {
        this.context.amenities.push('parking');
      }
    }

    // Work from home
    if (message.includes('work from home') || message.includes('wfh') || message.includes('remote work')) {
      this.context.lifestyle.workFromHome = true;
      if (!this.context.amenities.includes('wifi')) {
        this.context.amenities.push('wifi');
      }
    }

    // Hobbies that affect property choice
    const hobbyKeywords = {
      'gym': ['gym', 'fitness', 'workout'],
      'swimming': ['swim', 'swimming'],
      'cooking': ['cook', 'cooking', 'chef'],
      'gaming': ['gam', 'gamer', 'gaming'],
      'sports': ['sport', 'tennis', 'basketball']
    };

    Object.entries(hobbyKeywords).forEach(([hobby, keywords]) => {
      if (keywords.some(kw => message.includes(kw))) {
        if (!this.context.lifestyle.hobbies.includes(hobby)) {
          this.context.lifestyle.hobbies.push(hobby);
        }
        // Auto-add amenity
        if (hobby === 'gym' && !this.context.amenities.includes('gym')) {
          this.context.amenities.push('gym');
        }
        if (hobby === 'swimming' && !this.context.amenities.includes('pool')) {
          this.context.amenities.push('pool');
        }
      }
    });
  }

  private calculateAffordabilityFromSalary(): void {
    if (!this.context.personalInfo.salary) return;

    const salary = this.context.personalInfo.salary;

    // Calculate based on intent
    if (this.context.intent === 'rent' || !this.context.intent) {
      // For rent: 30% of salary rule
      const affordableRent = Math.floor(salary * 0.3);
      this.context.budget.max = affordableRent;
      this.context.autoInferredBudget = true;
      this.removeMissingInfo('budget');

      // If salary suggests buying power, infer buy intent
      if (salary >= 5000 && !this.context.intent) {
        this.context.intent = 'buy';
        this.removeMissingInfo('intent');
        // Recalculate for buying
        const affordableProperty = Math.floor(salary * 0.35 * 12 * 25); // 35% DSR, 25 years
        this.context.budget.max = affordableProperty;
      }
    }

    if (this.context.intent === 'buy') {
      // For buying: 35% DSR rule, 25 year loan, assume 4% interest
      // Monthly payment = salary * 0.35
      // Property price ≈ monthly payment * 12 * 25 (simplified)
      const monthlyPayment = salary * 0.35;
      const affordableProperty = Math.floor(monthlyPayment * 12 * 25);
      this.context.budget.max = affordableProperty;
      this.context.autoInferredBudget = true;
      this.removeMissingInfo('budget');
    }
  }

  private inferBedroomsFromFamily(): void {
    const familySize = this.context.personalInfo.familySize || 0;

    if (familySize === 1) {
      this.context.bedrooms = 1; // Studio or 1BR
    } else if (familySize === 2) {
      this.context.bedrooms = 2; // Couple
    } else if (familySize <= 4) {
      this.context.bedrooms = 3; // Small family
    } else if (familySize <= 6) {
      this.context.bedrooms = 4; // Larger family
    } else {
      this.context.bedrooms = 5; // Large family
    }
  }

  private removeMissingInfo(info: string): void {
    this.context.missingInfo = this.context.missingInfo.filter(i => i !== info);
  }

  private updateConversationStage(): void {
    // Determine if we have enough actionable information to show properties
    const hasActionableInfo = this.hasActionableSearchCriteria();

    if (hasActionableInfo) {
      this.context.conversationStage = 'showing';
    } else if (this.context.conversationHistory.length > 2) {
      this.context.conversationStage = 'refining';
    } else {
      this.context.conversationStage = 'gathering';
    }
  }

  private hasActionableSearchCriteria(): boolean {
    // We can show properties if we have ANY of these meaningful combinations:

    // 1. Intent + Budget (show all matching properties nationwide)
    if (this.context.intent && (this.context.budget.max || this.context.budget.min)) {
      return true;
    }

    // 2. Intent + Location (show all properties in that location)
    if (this.context.intent &&
        (this.context.location.cities.length > 0 ||
         this.context.location.areas.length > 0 ||
         this.context.location.states.length > 0)) {
      return true;
    }

    // 3. Budget + Location (can infer intent from budget)
    if ((this.context.budget.max || this.context.budget.min) &&
        (this.context.location.cities.length > 0 ||
         this.context.location.areas.length > 0 ||
         this.context.location.states.length > 0)) {
      return true;
    }

    // 4. Intent + Property Type (e.g., "luxury villas for sale")
    if (this.context.intent && this.context.propertyType.length > 0) {
      return true;
    }

    // 5. Strong luxury/high-value indicators with budget
    if ((this.context.budget.min && this.context.budget.min >= 1000000) ||
        (this.context.budget.max && this.context.budget.max >= 2000000)) {
      // High-value search, show results even without location
      return true;
    }

    // 6. Specific property type with budget
    if (this.context.propertyType.length > 0 &&
        (this.context.budget.max || this.context.budget.min)) {
      return true;
    }

    // 7. Has been calculated from salary (we have complete profile)
    if (this.context.autoInferredBudget &&
        (this.context.location.cities.length > 0 || this.context.personalInfo.workLocation)) {
      return true;
    }

    return false;
  }

  private async generateSmartResponse(isRefinement: boolean = false): Promise<{
    text: string;
    showProperties: boolean;
    confidence: number;
  }> {
    // If we have enough information, show properties
    if (this.context.conversationStage === 'showing') {
      const summary = this.generatePropertySearchSummary(isRefinement);
      return {
        text: summary,
        showProperties: true,
        confidence: 0.9
      };
    }

    // Ask for missing critical information
    if (this.context.missingInfo.length > 0) {
      const question = this.generateSmartQuestion();
      return {
        text: question,
        showProperties: false,
        confidence: 0.8
      };
    }

    // Refine the search
    return {
      text: "Let me search for properties based on what you've told me...",
      showProperties: true,
      confidence: 0.7
    };
  }

  private generatePropertySearchSummary(isRefinement: boolean = false): string {
    const parts: string[] = [];
    const insights: string[] = [];

    // Main search summary - adjust language based on whether it's initial or refinement
    if (isRefinement) {
      if (this.context.intent === 'buy') {
        parts.push("Got it! Filtering properties FOR SALE");
      } else if (this.context.intent === 'rent') {
        parts.push("Perfect! Filtering properties FOR RENT");
      } else if (this.context.intent === 'new_development') {
        parts.push("Understood! Filtering NEW DEVELOPMENTS");
      } else {
        parts.push("Refining your search");
      }
    } else {
      if (this.context.intent === 'buy') {
        parts.push("Great! I'm searching for properties FOR SALE");
      } else if (this.context.intent === 'rent') {
        parts.push("Perfect! I'm searching for properties FOR RENT");
      } else if (this.context.intent === 'new_development') {
        parts.push("Excellent! I'm searching for NEW DEVELOPMENTS");
      }
    }

    // Location (if specified)
    const hasLocation = this.context.location.cities.length > 0 ||
                        this.context.location.areas.length > 0 ||
                        this.context.location.states.length > 0;

    if (this.context.location.cities.length > 0) {
      parts.push(`in ${this.context.location.cities.join(', ')}`);
    } else if (this.context.location.areas.length > 0) {
      parts.push(`in ${this.context.location.areas.join(', ')}`);
    } else if (this.context.location.states.length > 0) {
      parts.push(`in ${this.context.location.states.join(', ')}`);
    } else {
      // No location specified - show all Malaysia
      parts.push("across Malaysia");
    }

    // Budget with affordability insight
    if (this.context.budget.max && this.context.budget.min) {
      parts.push(`within RM${this.context.budget.min.toLocaleString()} to RM${this.context.budget.max.toLocaleString()}`);
    } else if (this.context.budget.max) {
      if (this.context.autoInferredBudget && this.context.personalInfo.salary) {
        parts.push(`under RM${this.context.budget.max.toLocaleString()}`);
        insights.push(`Based on your RM${this.context.personalInfo.salary.toLocaleString()} salary, this budget keeps you within comfortable affordability guidelines`);
      } else {
        parts.push(`under RM${this.context.budget.max.toLocaleString()}`);
      }
    } else if (this.context.budget.min) {
      parts.push(`above RM${this.context.budget.min.toLocaleString()}`);
    }

    if (this.context.propertyType.length > 0) {
      parts.push(`(${this.context.propertyType.join(' or ')})`);
    }

    // Bedrooms with family context
    if (this.context.bedrooms) {
      if (this.context.personalInfo.familySize && this.context.personalInfo.familySize > 1) {
        parts.push(`with ${this.context.bedrooms} bedrooms`);
        if (this.context.personalInfo.hasChildren) {
          insights.push(`${this.context.bedrooms} bedrooms should work well for your family`);
        }
      } else {
        parts.push(`with ${this.context.bedrooms} bedrooms`);
      }
    }

    let summary = parts.join(' ') + '.';

    // Amenities with lifestyle context
    if (this.context.amenities.length > 0) {
      summary += ` I'll prioritize properties with ${this.context.amenities.slice(0, 3).join(', ')}.`;
    }

    // Add lifestyle insights
    if (this.context.lifestyle.petOwner) {
      insights.push("I'm focusing on pet-friendly properties for you");
    }

    if (this.context.constraints.mustBeNear.length > 0) {
      insights.push(`Looking for locations near ${this.context.constraints.mustBeNear.slice(0, 2).join(' and ')}`);
    }

    if (this.context.personalInfo.workLocation) {
      insights.push(`Considering proximity to your work in ${this.context.personalInfo.workLocation}`);
    }

    if (this.context.constraints.timeframe === 'urgent') {
      insights.push("I'm prioritizing immediately available properties");
    }

    // Add insights if any
    if (insights.length > 0) {
      summary += '\n\n' + insights.join('. ') + '.';
    }

    // Add helpful note if no location specified
    if (!hasLocation && !insights.some(i => i.includes('work'))) {
      summary += '\n\nShowing results from all locations. Feel free to specify a city or area to narrow down your search!';
    }

    summary += '\n\nHere are the best matches I found for you:';

    return summary;
  }

  private generateSmartQuestion(): string {
    const conversationLength = this.context.conversationHistory.filter(h => h.role === 'user').length;
    const hasPartialInfo = this.context.missingInfo.length < 3;

    // What we know so far
    const knowIntent = this.context.intent !== null;
    const knowLocation = this.context.location.cities.length > 0 ||
                         this.context.location.areas.length > 0 ||
                         this.context.location.states.length > 0;
    const knowBudget = this.context.budget.min !== null || this.context.budget.max !== null;
    const knowPropertyType = this.context.propertyType.length > 0;
    const knowBedrooms = this.context.bedrooms !== null;

    // Generate natural, context-aware questions

    // Missing intent
    if (!knowIntent) {
      if (conversationLength <= 1) {
        return "I'd love to help you find the perfect property! Are you looking to buy, rent, or explore new developments?";
      }
      return "Just to clarify - are you interested in buying or renting?";
    }

    // Missing location
    if (!knowLocation) {
      const responses = [
        "Which area are you interested in?",
        "Where would you like this property to be?",
        "What location works best for you?",
        "Which city or neighborhood are you considering?"
      ];

      if (this.context.intent === 'buy') {
        return this.getRandomResponse([
          "Great! Which area are you looking to buy in?",
          "Excellent choice! Where would you like to buy?",
          "Perfect! Which city or area interests you?"
        ]);
      } else if (this.context.intent === 'rent') {
        return this.getRandomResponse([
          "Nice! Where would you like to rent?",
          "Great! Which area are you looking to rent in?",
          "Perfect! What location works for you?"
        ]);
      }
      return this.getRandomResponse(responses);
    }

    // Missing budget
    if (!knowBudget) {
      if (this.context.intent === 'buy') {
        return this.getRandomResponse([
          "What's your budget looking like?",
          "How much are you looking to spend?",
          "What price range are you comfortable with?",
          "Do you have a budget in mind?"
        ]);
      } else if (this.context.intent === 'rent') {
        return this.getRandomResponse([
          "What's your monthly budget?",
          "How much are you looking to spend per month?",
          "What rental budget works for you?",
          "What's your comfortable monthly rental range?"
        ]);
      }
      return "What budget range are you thinking of?";
    }

    // Ask about property type if we have core info
    if (!knowPropertyType && hasPartialInfo) {
      return this.getRandomResponse([
        "What type of property are you interested in?",
        "Are you looking for a condo, house, apartment, or something else?",
        "What kind of property suits your needs?",
        "Do you have a preference for the property type?"
      ]);
    }

    // Ask about bedrooms if we have more info
    if (!knowBedrooms && hasPartialInfo && knowPropertyType) {
      return this.getRandomResponse([
        "How many bedrooms do you need?",
        "What's your preferred number of bedrooms?",
        "How much space are you looking for?",
        "Any specific bedroom requirements?"
      ]);
    }

    // Ask about specific preferences
    if (hasPartialInfo) {
      return this.getRandomResponse([
        "Any specific features or amenities you're looking for?",
        "Is there anything else important to you?",
        "What else matters to you in a property?",
        "Tell me more about your ideal property!"
      ]);
    }

    // Generic follow-up
    return this.getRandomResponse([
      "Tell me more about what you're looking for!",
      "What else can you tell me about your ideal property?",
      "Help me understand your preferences better!",
      "Share more details so I can find the perfect match!"
    ]);
  }

  private getRandomResponse(responses: string[]): string {
    return responses[Math.floor(Math.random() * responses.length)];
  }

  private addAIResponse(response: string): void {
    this.context.conversationHistory.push({
      role: 'ai',
      content: response,
      timestamp: new Date()
    });
  }

  getContext(): ConversationContext {
    return this.context;
  }

  updateContext(context: ConversationContext): void {
    this.context = context;
  }
}

export const scoreProperty = (
  property: PropertyWithImages,
  context: ConversationContext
): { score: number; reasons: string[] } => {
  let score = 0;
  const reasons: string[] = [];

  // Intent match (30 points)
  if (context.intent === 'buy' && property.listing_type === 'sale') {
    score += 30;
    reasons.push('for sale as you want');
  } else if (context.intent === 'rent' && property.listing_type === 'rent') {
    score += 30;
    reasons.push('for rent as you want');
  } else if (context.intent === 'new_development' && property.availability_date &&
             new Date(property.availability_date) > new Date()) {
    score += 30;
    reasons.push('new development project');
  }

  // Budget match (25 points)
  if (context.budget.max && property.price <= context.budget.max) {
    score += 20;
    reasons.push('within your budget');
    if (context.budget.min && property.price >= context.budget.min) {
      score += 5;
    }
  } else if (context.budget.max && property.price > context.budget.max) {
    score -= 15;
  }

  // Location match (20 points)
  const locationScore = calculateLocationScore(property, context);
  score += locationScore.score;
  if (locationScore.reason) reasons.push(locationScore.reason);

  // Property type (15 points)
  if (context.propertyType.length > 0) {
    if (context.propertyType.includes(property.property_type)) {
      score += 15;
      reasons.push(`${property.property_type} as requested`);
    }
  }

  // Bedrooms (10 points)
  if (context.bedrooms) {
    if (property.bedrooms === context.bedrooms) {
      score += 10;
      reasons.push(`exactly ${context.bedrooms} bedrooms`);
    } else if (Math.abs(property.bedrooms - context.bedrooms) === 1) {
      score += 5;
    }
  }

  // Amenities (15 points max)
  const amenityScore = calculateAmenityScore(property, context);
  score += amenityScore.score;
  if (amenityScore.reasons.length > 0) {
    reasons.push(...amenityScore.reasons);
  }

  // Preferences (10 points)
  if (context.preferences.furnished && property.furnished === context.preferences.furnished) {
    score += 5;
    reasons.push(context.preferences.furnished.replace('_', ' '));
  }

  // Featured boost (5 points)
  if (property.featured) {
    score += 5;
  }

  return { score, reasons };
};

function calculateLocationScore(
  property: PropertyWithImages,
  context: ConversationContext
): { score: number; reason: string | null } {
  let score = 0;
  let reason: string | null = null;

  const propCity = property.city.toLowerCase();
  const propState = property.state.toLowerCase();
  const propAddress = property.address.toLowerCase();

  // City match (highest priority)
  if (context.location.cities.length > 0) {
    const cityMatch = context.location.cities.some(city =>
      propCity.includes(city) || propAddress.includes(city)
    );
    if (cityMatch) {
      score = 20;
      reason = `in ${property.city}`;
      return { score, reason };
    }
  }

  // Area match
  if (context.location.areas.length > 0) {
    const areaMatch = context.location.areas.some(area =>
      propCity.includes(area) || propAddress.includes(area)
    );
    if (areaMatch) {
      score = 18;
      reason = 'in your preferred area';
      return { score, reason };
    }
  }

  // State match (lower priority)
  if (context.location.states.length > 0) {
    const stateMatch = context.location.states.some(state =>
      propState.includes(state)
    );
    if (stateMatch) {
      score = 10;
      reason = `in ${property.state}`;
      return { score, reason };
    }
  }

  return { score, reason };
}

function calculateAmenityScore(
  property: PropertyWithImages,
  context: ConversationContext
): { score: number; reasons: string[] } {
  if (context.amenities.length === 0) {
    return { score: 0, reasons: [] };
  }

  let score = 0;
  const matchedAmenities: string[] = [];

  context.amenities.forEach(requestedAmenity => {
    const match = property.amenities.some(propAmenity =>
      propAmenity.toLowerCase().includes(requestedAmenity.toLowerCase()) ||
      requestedAmenity.toLowerCase().includes(propAmenity.toLowerCase())
    );
    if (match) {
      score += 5;
      matchedAmenities.push(requestedAmenity);
    }
  });

  const maxScore = Math.min(score, 15);
  const reasons = matchedAmenities.length > 0
    ? [`has ${matchedAmenities.slice(0, 2).join(' and ')}`]
    : [];

  return { score: maxScore, reasons };
}
