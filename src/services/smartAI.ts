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
  messageCount: number;
  lastPropertyReminder: number;
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
  autoInferredBudget: false,
  messageCount: 0,
  lastPropertyReminder: 0
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
    this.context.messageCount++;
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
        max_tokens: 300,
        response_format: { type: "json_object" }
      });

      const responseContent = completion.choices[0]?.message?.content;
      if (!responseContent) {
        throw new Error("No response from ChatGPT");
      }

      const aiResponse = JSON.parse(responseContent);

      this.updateContextFromAI(aiResponse);

      const response = aiResponse.response || "I'm here to help you find properties!";

      if (aiResponse.propertyReminded === true) {
        this.context.lastPropertyReminder = this.context.messageCount;
      }
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
    // Build compact context summary
    const contextSummary = this.buildCompactContext();

    return `You are a friendly Malaysian property assistant. Chat naturally and extract property needs.

RESPOND WITH JSON:
{"response": "text", "extractedInfo": {"intent": null/"buy"/"rent", "budget": {"min": num, "max": num}, "location": {"states": [], "cities": [], "areas": []}, "propertyType": [], "bedrooms": num, "bathrooms": num}, "shouldShowProperties": bool, "confidence": 0.8}

RULES:
1. Extract location/budget/bedrooms from user message
2. If user requests properties → set shouldShowProperties: true
3. Mention property count when showing: "Found X properties in [location]"
4. After showing, ask to refine

LOCATIONS:
- "KL"/"Kuala Lumpur" → cities: ["Kuala Lumpur"]
- "Penang" → states: ["Penang"]
- "Johor" → states: ["Johor"]
- Extract ONLY what user mentions

BUDGET:
- "under RM500k" → max: 500000
- Salary mentioned → calculate budget (Rent=30%, Buy=35% DSR/25yrs)

SHOW PROPERTIES WHEN:
- User says "recommend"/"find"/"show"/"properties"
- Use ANY available filter (location/budget/bedrooms)
- Set shouldShowProperties: true

${contextSummary}`;
  }

  private buildCompactContext(): string {
    const parts: string[] = [];

    if (this.context.intent) parts.push(`Intent: ${this.context.intent}`);
    if (this.context.budget.min || this.context.budget.max) {
      parts.push(`Budget: ${this.context.budget.min || 0}-${this.context.budget.max || '∞'}`);
    }
    if (this.context.location.cities.length > 0) {
      parts.push(`Cities: ${this.context.location.cities.join(', ')}`);
    }
    if (this.context.location.states.length > 0) {
      parts.push(`States: ${this.context.location.states.join(', ')}`);
    }
    if (this.context.bedrooms) parts.push(`Beds: ${this.context.bedrooms}`);
    if (this.context.propertyType.length > 0) {
      parts.push(`Type: ${this.context.propertyType.join(', ')}`);
    }

    return parts.length > 0 ? `\nCurrent context: ${parts.join(' | ')}` : '';
  }

  private shouldRemindAboutProperties(): boolean {
    const hasNoIntent = !this.context.intent;
    const messagesSinceReminder = this.context.messageCount - this.context.lastPropertyReminder;
    const shouldRemind = hasNoIntent && this.context.messageCount >= 10 && messagesSinceReminder >= 10;
    return shouldRemind;
  }

  private buildConversationMessages(): Array<{ role: 'user' | 'assistant'; content: string }> {
    return this.context.conversationHistory
      .slice(-3)
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
      // Check if this is a new specific location request (user changing their search)
      const hasNewLocation = (info.location.states?.length > 0) ||
                            (info.location.cities?.length > 0) ||
                            (info.location.areas?.length > 0);

      if (hasNewLocation) {
        // If user specifies a new location in this message, REPLACE old location context
        // This prevents accumulation of unrelated locations
        this.context.location = {
          states: info.location.states || [],
          cities: info.location.cities || [],
          areas: info.location.areas || []
        };
        this.removeMissingInfo('location');
      }
      console.log('Updated location context:', this.context.location);
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
    // More flexible: Any single criteria is enough to search
    const hasLocation = this.context.location.cities.length > 0 ||
                        this.context.location.areas.length > 0 ||
                        this.context.location.states.length > 0 ||
                        this.context.personalInfo.workLocation;

    const hasBudget = this.context.budget.max ||
                      this.context.budget.min ||
                      this.context.personalInfo.salary;

    const hasBedrooms = this.context.bedrooms !== null;
    const hasBathrooms = this.context.bathrooms !== null;
    const hasPropertyType = this.context.propertyType.length > 0;
    const hasIntent = this.context.intent !== null;
    const hasAmenities = this.context.amenities.length > 0;

    // Any single criteria is actionable
    return hasLocation || hasBudget || hasBedrooms || hasBathrooms ||
           hasPropertyType || hasIntent || hasAmenities;
  }

  getContext(): ConversationContext {
    return this.context;
  }

  updateContext(context: ConversationContext): void {
    this.context = context;
  }

  async generateNoPropertiesResponse(location: string): Promise<string> {
    if (!openai) {
      return `I'm sorry, I couldn't find any properties in ${location} at the moment. Would you like to try a different area?`;
    }

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are a friendly property assistant. The user searched for properties in ${location} but none were found.

            Respond naturally and helpfully:
            1. Apologize that no properties are available in ${location}
            2. Suggest nearby areas or alternative locations in Malaysia
            3. Ask if they'd like to see properties in a different area
            4. Keep it brief and friendly (2-3 sentences max)`
          },
          {
            role: "user",
            content: `I searched for properties in ${location}`
          }
        ],
        temperature: 0.7,
        max_tokens: 150
      });

      return completion.choices[0]?.message?.content ||
             `I'm sorry, I couldn't find any properties in ${location} at the moment. Would you like to try a different area?`;
    } catch (error) {
      console.error('Error generating no properties response:', error);
      return `I'm sorry, I couldn't find any properties in ${location} at the moment. Would you like to try a different area?`;
    }
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

  const propCity = property.city.toLowerCase().trim();
  const propState = property.state.toLowerCase().trim();
  const propAddress = property.address.toLowerCase().trim();

  // Helper function for more precise matching
  const matchesLocation = (text: string, location: string): boolean => {
    const searchTerm = location.toLowerCase().trim();
    // Check for exact match or word boundary match
    return text === searchTerm ||
           text.includes(` ${searchTerm} `) ||
           text.startsWith(`${searchTerm} `) ||
           text.endsWith(` ${searchTerm}`) ||
           text.includes(searchTerm);
  };

  if (context.location.cities.length > 0) {
    for (const city of context.location.cities) {
      if (matchesLocation(propCity, city) || matchesLocation(propAddress, city)) {
        score += 20;
        reason = `in ${city}`;
        break;
      }
    }
  }

  if (context.location.areas.length > 0 && score === 0) {
    for (const area of context.location.areas) {
      if (matchesLocation(propCity, area) || matchesLocation(propAddress, area)) {
        score += 18;
        reason = `in ${area}`;
        break;
      }
    }
  }

  if (context.location.states.length > 0 && score === 0) {
    for (const state of context.location.states) {
      if (matchesLocation(propState, state)) {
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
