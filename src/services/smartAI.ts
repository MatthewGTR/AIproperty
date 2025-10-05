import OpenAI from 'openai';
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

function initializeAI() {
  const openaiKey = import.meta.env.VITE_OPENAI_API_KEY;

  if (openaiKey && openaiKey !== 'your_openai_api_key_here' && openaiKey.trim()) {
    try {
      openai = new OpenAI({ apiKey: openaiKey, dangerouslyAllowBrowser: true });
    } catch (error) {
      console.error('OpenAI initialization failed:', error);
    }
  }
}

initializeAI();

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

    if (!openai) {
      return {
        response: "ChatGPT is not configured. Please add your OpenAI API key to the .env file.",
        context: this.context,
        shouldShowProperties: false,
        confidence: 0
      };
    }

    try {
      const systemPrompt = this.buildSystemPrompt();
      const conversationMessages = this.buildConversationMessages();

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          ...conversationMessages,
          { role: "user", content: userMessage }
        ],
        temperature: 0.7,
        max_tokens: 800,
        response_format: { type: "json_object" }
      });

      const responseContent = completion.choices[0]?.message?.content;
      if (!responseContent) {
        throw new Error("No response from ChatGPT");
      }

      const aiResponse = JSON.parse(responseContent);

      this.updateContextFromAI(aiResponse);

      const response = aiResponse.response || "I'm here to help you find properties!";
      this.context.conversationHistory.push({
        role: 'ai',
        content: response,
        timestamp: new Date()
      });

      const shouldShowProperties = aiResponse.shouldShowProperties === true ||
                                   (aiResponse.readyToSearch === true && this.hasActionableSearchCriteria());

      return {
        response,
        context: this.context,
        shouldShowProperties,
        confidence: aiResponse.confidence || 0.8
      };

    } catch (error) {
      console.error('ChatGPT error:', error);
      return {
        response: "I apologize, I'm having trouble processing that. Could you rephrase your request?",
        context: this.context,
        shouldShowProperties: false,
        confidence: 0
      };
    }
  }

  private buildSystemPrompt(): string {
    return `You are a friendly, conversational property assistant in Malaysia. Your goal is to chat naturally with users, build rapport, and gradually gather information about their property needs.

PERSONALITY:
- Warm, friendly, and natural (like a helpful friend)
- Can discuss any topic briefly
- Smoothly gather property information through conversation
- Remember everything the user tells you

CRITICAL: Always respond with valid JSON in this exact format:
{
  "response": "your friendly response here",
  "extractedInfo": {
    "intent": null or "buy" or "rent" or "new_development",
    "budget": {"min": null or number, "max": null or number},
    "location": {"states": [], "cities": [], "areas": []},
    "propertyType": [],
    "bedrooms": null or number,
    "bathrooms": null or number,
    "amenities": [],
    "personalInfo": {
      "salary": null or number,
      "familySize": null or number,
      "occupation": null or string,
      "age": null or number,
      "maritalStatus": null or "single" or "married" or "divorced",
      "hasChildren": false or true,
      "workLocation": null or string
    },
    "lifestyle": {
      "petOwner": false or true,
      "carOwner": false or true,
      "workFromHome": false or true,
      "hobbies": []
    },
    "constraints": {
      "mustBeNear": [],
      "timeframe": null or string,
      "maxCommute": null or string
    }
  },
  "readyToSearch": false or true,
  "shouldShowProperties": false or true,
  "confidence": 0.8
}

INFORMATION GATHERING STRATEGY:
1. Start with casual conversation and greetings
2. Naturally ask about their property needs (buy/rent)
3. Learn about their lifestyle, work, family
4. Understand their budget (or infer from salary)
5. Discover location preferences
6. Learn about property type and size needs
7. Understand amenities and lifestyle requirements

MALAYSIAN PROPERTY CONTEXT:
- States: Johor, KL, Selangor, Penang, etc.
- Cities: Johor Bahru, Petaling Jaya, Georgetown, etc.
- Property types: condo, apartment, house, terrace, semi-d, bungalow, villa
- Budget ranges: Rent RM800-10000/month, Sale RM200k-5M+
- If user mentions salary, calculate budget: Rent = 30% of salary, Buy = 35% DSR over 25 years

EXTRACTION RULES:
- Extract ALL information from the current message AND remember previous context
- Budget: Look for "RM", "ringgit", numbers with "k" (1000), salary mentions
- Location: Malaysian states, cities, areas, neighborhoods
- Personal: Family size, children, pets, work location, occupation, salary
- Lifestyle: Mentions of hobbies, work from home, car, pets
- Intent: "buy", "rent", "invest", "lease"
- Set "readyToSearch" to true when you have: (intent + budget) OR (intent + location) OR (budget + location)
- Set "shouldShowProperties" to true only when readyToSearch is true

CONVERSATION RULES:
1. NEVER force property talk - chat naturally
2. If user asks about weather/food/life: answer briefly, then relate to property if natural
3. Build rapport before diving into requirements
4. Ask ONE question at a time, conversationally
5. Acknowledge what they share before asking more
6. Be encouraging and positive
7. When you have enough info, summarize and offer to search

Current conversation context:
${JSON.stringify(this.context, null, 2)}`;
  }

  private buildConversationMessages(): Array<{ role: 'user' | 'assistant'; content: string }> {
    return this.context.conversationHistory
      .slice(-6)
      .map(msg => ({
        role: msg.role === 'user' ? 'user' as const : 'assistant' as const,
        content: msg.content
      }));
  }

  private updateContextFromAI(aiResponse: any): void {
    if (!aiResponse.extractedInfo) return;

    const info = aiResponse.extractedInfo;

    if (info.intent && !this.context.intent) {
      this.context.intent = info.intent;
      this.removeMissingInfo('intent');
    }

    if (info.budget) {
      if (info.budget.min) this.context.budget.min = info.budget.min;
      if (info.budget.max) this.context.budget.max = info.budget.max;
      if (info.budget.min || info.budget.max) this.removeMissingInfo('budget');
    }

    if (info.location) {
      if (info.location.states?.length > 0) {
        this.context.location.states = [...new Set([...this.context.location.states, ...info.location.states])];
        this.removeMissingInfo('location');
      }
      if (info.location.cities?.length > 0) {
        this.context.location.cities = [...new Set([...this.context.location.cities, ...info.location.cities])];
        this.removeMissingInfo('location');
      }
      if (info.location.areas?.length > 0) {
        this.context.location.areas = [...new Set([...this.context.location.areas, ...info.location.areas])];
        this.removeMissingInfo('location');
      }
    }

    if (info.propertyType?.length > 0) {
      this.context.propertyType = [...new Set([...this.context.propertyType, ...info.propertyType])];
    }

    if (info.bedrooms) this.context.bedrooms = info.bedrooms;
    if (info.bathrooms) this.context.bathrooms = info.bathrooms;

    if (info.amenities?.length > 0) {
      this.context.amenities = [...new Set([...this.context.amenities, ...info.amenities])];
    }

    if (info.personalInfo) {
      Object.keys(info.personalInfo).forEach(key => {
        if (info.personalInfo[key] !== null && info.personalInfo[key] !== undefined) {
          (this.context.personalInfo as any)[key] = info.personalInfo[key];
        }
      });
    }

    if (info.lifestyle) {
      Object.keys(info.lifestyle).forEach(key => {
        if (info.lifestyle[key] !== null && info.lifestyle[key] !== undefined) {
          if (key === 'hobbies' && Array.isArray(info.lifestyle[key])) {
            this.context.lifestyle.hobbies = [...new Set([...this.context.lifestyle.hobbies, ...info.lifestyle[key]])];
          } else {
            (this.context.lifestyle as any)[key] = info.lifestyle[key];
          }
        }
      });
    }

    if (info.constraints) {
      if (info.constraints.mustBeNear?.length > 0) {
        this.context.constraints.mustBeNear = [...new Set([...this.context.constraints.mustBeNear, ...info.constraints.mustBeNear])];
      }
      if (info.constraints.timeframe) this.context.constraints.timeframe = info.constraints.timeframe;
      if (info.constraints.maxCommute) this.context.constraints.maxCommute = info.constraints.maxCommute;
    }

    this.updateConversationStage();
  }

  private removeMissingInfo(field: string): void {
    this.context.missingInfo = this.context.missingInfo.filter(f => f !== field);
  }

  private updateConversationStage(): void {
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
    if (this.context.intent && (this.context.budget.max || this.context.budget.min)) {
      return true;
    }

    if (this.context.intent &&
        (this.context.location.cities.length > 0 ||
         this.context.location.areas.length > 0 ||
         this.context.location.states.length > 0)) {
      return true;
    }

    if ((this.context.budget.max || this.context.budget.min) &&
        (this.context.location.cities.length > 0 ||
         this.context.location.areas.length > 0 ||
         this.context.location.states.length > 0)) {
      return true;
    }

    if (this.context.intent && this.context.propertyType.length > 0) {
      return true;
    }

    if ((this.context.budget.min && this.context.budget.min >= 1000000) ||
        (this.context.budget.max && this.context.budget.max >= 2000000)) {
      return true;
    }

    if (this.context.propertyType.length > 0 &&
        (this.context.budget.max || this.context.budget.min)) {
      return true;
    }

    if (this.context.autoInferredBudget &&
        (this.context.location.cities.length > 0 || this.context.personalInfo.workLocation)) {
      return true;
    }

    return false;
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

  if (context.budget.max && property.price <= context.budget.max) {
    score += 20;
    reasons.push('within your budget');
    if (context.budget.min && property.price >= context.budget.min) {
      score += 5;
    }
  } else if (context.budget.max && property.price > context.budget.max) {
    score -= 15;
  }

  const locationScore = calculateLocationScore(property, context);
  score += locationScore.score;
  if (locationScore.reason) reasons.push(locationScore.reason);

  if (context.propertyType.length > 0) {
    if (context.propertyType.includes(property.property_type)) {
      score += 15;
      reasons.push(`${property.property_type} as requested`);
    }
  }

  if (context.bedrooms) {
    if (property.bedrooms === context.bedrooms) {
      score += 10;
      reasons.push(`exactly ${context.bedrooms} bedrooms`);
    } else if (Math.abs(property.bedrooms - context.bedrooms) === 1) {
      score += 5;
    }
  }

  const amenityScore = calculateAmenityScore(property, context);
  score += amenityScore.score;
  if (amenityScore.reasons.length > 0) {
    reasons.push(...amenityScore.reasons);
  }

  if (context.preferences.furnished && property.furnished === context.preferences.furnished) {
    score += 5;
    reasons.push(context.preferences.furnished.replace('_', ' '));
  }

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

  if (context.location.cities.length > 0) {
    for (const city of context.location.cities) {
      if (propCity.includes(city.toLowerCase()) || propAddress.includes(city.toLowerCase())) {
        score += 20;
        reason = `in ${city}`;
        break;
      }
    }
  }

  if (context.location.areas.length > 0 && score === 0) {
    for (const area of context.location.areas) {
      if (propCity.includes(area.toLowerCase()) || propAddress.includes(area.toLowerCase())) {
        score += 18;
        reason = `in ${area}`;
        break;
      }
    }
  }

  if (context.location.states.length > 0 && score === 0) {
    for (const state of context.location.states) {
      if (propState.includes(state.toLowerCase())) {
        score += 10;
        reason = `in ${state}`;
        break;
      }
    }
  }

  return { score, reason };
}

function calculateAmenityScore(
  property: PropertyWithImages,
  context: ConversationContext
): { score: number; reasons: string[] } {
  let score = 0;
  const reasons: string[] = [];

  if (context.amenities.length === 0) {
    return { score, reasons };
  }

  const matchedAmenities: string[] = [];

  for (const contextAmenity of context.amenities) {
    for (const propAmenity of property.amenities) {
      if (propAmenity.toLowerCase().includes(contextAmenity.toLowerCase()) ||
          contextAmenity.toLowerCase().includes(propAmenity.toLowerCase())) {
        if (!matchedAmenities.includes(contextAmenity)) {
          matchedAmenities.push(contextAmenity);
          score += 5;
        }
      }
    }
  }

  if (matchedAmenities.length > 0) {
    if (matchedAmenities.length === 1) {
      reasons.push(`has ${matchedAmenities[0]}`);
    } else if (matchedAmenities.length === 2) {
      reasons.push(`has ${matchedAmenities.join(' and ')}`);
    } else {
      reasons.push(`has ${matchedAmenities.slice(0, 2).join(', ')} and more`);
    }
  }

  return { score, reasons };
}
