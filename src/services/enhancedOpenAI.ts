import { PropertyWithImages, propertyService } from './propertyService';
import { SmartPropertyAI, ConversationContext, createDefaultContext, scoreProperty } from './smartAI';

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
  // Initialize AI if not already done
  if (!aiInstance) {
    initializeSmartAI(currentContext);
  } else if (currentContext) {
    aiInstance!.updateContext(currentContext);
  }

  try {
    // Process the message with smart AI
    const aiResponse = await aiInstance!.processMessage(userMessage);

    let matchedProperties: PropertyWithImages[] = [];

    // If AI suggests showing properties, fetch and rank them
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

    // Fallback response
    return {
      response: "I apologize, but I encountered an issue. Could you please rephrase your request?",
      matchedProperties: [],
      context: aiInstance?.getContext() || createDefaultContext()
    };
  }
};

async function findBestMatchingProperties(
  context: ConversationContext
): Promise<PropertyWithImages[]> {
  try {
    // Build search filters from context
    const filters: any = {};

    // Intent to listing type
    if (context.intent === 'buy') {
      filters.listing_type = 'sale';
    } else if (context.intent === 'rent') {
      filters.listing_type = 'rent';
    }

    // Budget
    if (context.budget.min) {
      filters.min_price = context.budget.min;
    }
    if (context.budget.max) {
      filters.max_price = context.budget.max;
    }

    // Location (prioritize cities, then areas, then states)
    // Use the most specific location available
    if (context.location.cities.length > 0) {
      filters.city = context.location.cities[0];
    } else if (context.location.areas.length > 0) {
      filters.city = context.location.areas[0];
    } else if (context.location.states.length > 0) {
      filters.city = context.location.states[0];
    }

    console.log('Search filters:', filters);

    // Property type
    if (context.propertyType.length > 0) {
      filters.property_type = context.propertyType[0];
    }

    // Bedrooms
    if (context.bedrooms) {
      filters.bedrooms = context.bedrooms;
    }

    // Fetch more properties than needed for better ranking
    filters.limit = 50;

    const allProperties = await propertyService.getProperties(filters);

    // Score and rank all properties
    const scoredProperties = allProperties
      .map(property => {
        const { score, reasons } = scoreProperty(property, context);
        return { property, score, reasons };
      })
      .filter(item => item.score > 15) // Only show properties with decent match
      .sort((a, b) => b.score - a.score)
      .slice(0, 6);

    // If no good matches, try with relaxed filters
    if (scoredProperties.length === 0) {
      const relaxedFilters = {
        listing_type: filters.listing_type,
        limit: 6
      };
      return await propertyService.getProperties(relaxedFilters);
    }

    return scoredProperties.map(item => item.property);
  } catch (error) {
    console.error('Error finding properties:', error);
    return [];
  }
}

export const getAIContext = (): ConversationContext => {
  if (!aiInstance) {
    return createDefaultContext();
  }
  return aiInstance.getContext();
};

export const resetAIContext = (): void => {
  aiInstance = new SmartPropertyAI(createDefaultContext());
};

// Export types for use in components
export type { ConversationContext };
export { createDefaultContext };
