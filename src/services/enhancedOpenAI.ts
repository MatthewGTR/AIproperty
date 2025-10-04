import { PropertyWithImages, propertyService } from './propertyService';
import { SmartPropertyAI, createDefaultContext, scoreProperty } from './smartAI';
import type { ConversationContext } from './smartAI';

export interface EnhancedAIResponse {
  response: string;
  matchedProperties: PropertyWithImages[];
  context: ConversationContext;
}

let aiInstance: SmartPropertyAI | null = null;

export const initializeSmartAI = (savedContext?: ConversationContext): void => {
  aiInstance = new SmartPropertyAI(savedContext || createDefaultContext());
};

export const processUserMessage = async (
  userMessage: string,
  currentContext?: ConversationContext
): Promise<EnhancedAIResponse> => {
  if (!aiInstance) {
    initializeSmartAI(currentContext);
  } else if (currentContext) {
    aiInstance!.updateContext(currentContext);
  }

  try {
    const aiResponse = await aiInstance!.processMessage(userMessage);

    let matchedProperties: PropertyWithImages[] = [];

    if (aiResponse.shouldShowProperties && aiResponse.confidence > 0.6) {
      matchedProperties = await findBestMatchingProperties(aiResponse.context);
    }

    return {
      response: aiResponse.response,
      matchedProperties,
      context: aiResponse.context
    };
  } catch (error) {
    console.error('Error processing message:', error);

    return {
      response: "I apologize, but I encountered an issue. Could you please rephrase your request?",
      matchedProperties: [],
      context: aiInstance?.getContext() || createDefaultContext()
    };
  }
};

async function findBestMatchingProperties(context: ConversationContext): Promise<PropertyWithImages[]> {
  try {
    const allProperties = await propertyService.searchProperties({
      listing_type: context.intent || undefined,
      max_price: context.budget.max || undefined,
      bedrooms: context.bedrooms || undefined,
    });

    const scoredProperties = allProperties
      .map(property => {
        const { score, reasons } = scoreProperty(property, context);
        return { property, score, reasons };
      })
      .filter(item => item.score > 20)
      .sort((a, b) => b.score - a.score)
      .slice(0, 6);

    return scoredProperties.map(item => item.property);
  } catch (error) {
    console.error('Error fetching properties:', error);
    return [];
  }
}

export function getAIContext(): ConversationContext | null {
  return aiInstance?.getContext() || null;
}

export { createDefaultContext };
export type { ConversationContext };
