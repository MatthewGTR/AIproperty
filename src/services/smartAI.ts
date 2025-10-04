import OpenAI from 'openai';
import { PropertyWithImages } from './propertyService';

export interface ConversationContext {
  intent: 'buy' | 'rent' | null;
  budget: { min: number | null; max: number | null };
  location: { states: string[]; cities: string[]; areas: string[] };
  propertyType: string[];
  bedrooms: number | null;
  bathrooms: number | null;
  amenities: string[];
  personalInfo: { salary: number | null; familySize: number | null };
  conversationStage: 'greeting' | 'gathering' | 'refining' | 'showing';
  lastQuery: string;
  conversationHistory: Array<{ role: 'user' | 'ai'; content: string }>;
}

export const createDefaultContext = (): ConversationContext => ({
  intent: null,
  budget: { min: null, max: null },
  location: { states: [], cities: [], areas: [] },
  propertyType: [],
  bedrooms: null,
  bathrooms: null,
  amenities: [],
  personalInfo: { salary: null, familySize: null },
  conversationStage: 'greeting',
  lastQuery: '',
  conversationHistory: []
});

let openai: OpenAI | null = null;

function initializeAI() {
  const openaiKey = import.meta.env.VITE_OPENAI_API_KEY;
  if (openaiKey && openaiKey !== 'your_openai_api_key_here' && openaiKey.trim()) {
    try {
      openai = new OpenAI({ apiKey: openaiKey, dangerouslyAllowBrowser: true });
      console.log('✅ ChatGPT initialized');
    } catch (error) {
      console.error('❌ OpenAI init failed:', error);
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
    this.context.conversationHistory.push({ role: 'user', content: userMessage });

    const lowerMessage = userMessage.toLowerCase().trim();

    if (this.isGreeting(lowerMessage)) {
      const response = "Hi! I'm here to help you find properties. Tell me - buying or renting? Budget? Or tell me your salary and family size!";
      this.context.conversationHistory.push({ role: 'ai', content: response });
      return { response, context: this.context, shouldShowProperties: false, confidence: 1.0 };
    }

    if (!this.isPropertyRelated(lowerMessage)) {
      const response = await this.handleGeneralChat(userMessage);
      this.context.conversationHistory.push({ role: 'ai', content: response });
      return { response, context: this.context, shouldShowProperties: false, confidence: 1.0 };
    }

    await this.extractInformation(userMessage);
    const response = this.generateSmartResponse();
    this.context.conversationHistory.push({ role: 'ai', content: response.text });

    return {
      response: response.text,
      context: this.context,
      shouldShowProperties: response.showProperties,
      confidence: response.confidence
    };
  }

  private isGreeting(message: string): boolean {
    const greetings = ['hi', 'hello', 'hey'];
    return greetings.some(g => message === g || message.startsWith(g + ' '));
  }

  private isPropertyRelated(message: string): boolean {
    const keywords = ['buy', 'rent', 'house', 'apartment', 'condo', 'property', 'bedroom', 'bathroom', 'budget', 'price', 'earn', 'salary', 'family', 'kids', 'johor', 'kl', 'penang', 'looking for', 'show me'];
    return keywords.some(keyword => message.includes(keyword));
  }

  private async handleGeneralChat(query: string): Promise<string> {
    if (!openai) {
      return "That's interesting! I'm best at helping with property searches. What are you looking for?";
    }

    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a friendly Malaysian property assistant. Keep responses short and relate to property.' },
          { role: 'user', content: query }
        ],
        max_tokens: 150,
        temperature: 0.8
      });

      return completion.choices[0]?.message?.content || "I'm here to help with properties!";
    } catch (error) {
      return "I'm here to help you find properties. What are you looking for?";
    }
  }

  private async extractInformation(message: string): Promise<void> {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('buy')) this.context.intent = 'buy';
    if (lowerMessage.includes('rent')) this.context.intent = 'rent';

    const salaryMatch = lowerMessage.match(/(?:earn|salary|income)\s*(?:rm\s*)?(\d+(?:,\d+)?(?:k)?)/i);
    if (salaryMatch) {
      let salary = parseFloat(salaryMatch[1].replace(',', '').replace('k', '000'));
      this.context.personalInfo.salary = salary;
      this.context.budget.max = Math.round(salary * 80);
      this.context.intent = this.context.intent || 'buy';
    }

    const familyMatch = lowerMessage.match(/family\s+of\s+(\d+)|(\d+)\s+(?:kids?|children)/i);
    if (familyMatch) {
      const size = parseInt(familyMatch[1] || familyMatch[2]);
      this.context.personalInfo.familySize = size + 2;
      this.context.bedrooms = Math.max(3, Math.ceil(size / 2) + 1);
    }

    const bedroomMatch = lowerMessage.match(/(\d+)\s*(?:bed|br|bedroom)/i);
    if (bedroomMatch) {
      this.context.bedrooms = parseInt(bedroomMatch[1]);
    }

    const locations = ['johor', 'kl', 'kuala lumpur', 'penang', 'selangor'];
    locations.forEach(loc => {
      if (lowerMessage.includes(loc) && !this.context.location.states.includes(loc)) {
        this.context.location.states.push(loc);
      }
    });
  }

  private generateSmartResponse(): { text: string; showProperties: boolean; confidence: number } {
    const hasInfo = this.context.budget.max || this.context.location.states.length > 0 || this.context.intent;

    if (!hasInfo) {
      return {
        text: "I'd love to help! Tell me: Are you buying or renting? What's your budget (or salary)? Location preference?",
        showProperties: false,
        confidence: 0.3
      };
    }

    let response = "";

    if (this.context.personalInfo.salary) {
      const salaryStr = this.context.personalInfo.salary.toLocaleString();
      const budgetStr = this.context.budget.max ? this.context.budget.max.toLocaleString() : '';
      response += `With salary RM${salaryStr}, you can afford up to RM${budgetStr}. `;
    }

    if (this.context.personalInfo.familySize) {
      response += `For a family of ${this.context.personalInfo.familySize}, I recommend ${this.context.bedrooms}+ bedrooms. `;
    }

    response += "\n\nHere are matching properties:";

    return {
      text: response,
      showProperties: true,
      confidence: 0.9
    };
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
    reasons.push('for sale');
  }
  if (context.intent === 'rent' && property.listing_type === 'rent') {
    score += 30;
    reasons.push('for rent');
  }

  if (context.budget.max && property.price <= context.budget.max) {
    score += 25;
    reasons.push('within budget');
  }

  if (context.bedrooms && property.bedrooms >= context.bedrooms) {
    score += 15;
    reasons.push(`${property.bedrooms} bedrooms`);
  }

  if (context.location.states.some(state => property.state.toLowerCase().includes(state))) {
    score += 20;
    reasons.push(`in ${property.state}`);
  }

  return { score, reasons };
};
