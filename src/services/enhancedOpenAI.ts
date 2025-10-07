import { PropertyWithImages, propertyService } from './propertyService';
import { SmartPropertyAI, ConversationContext, createDefaultContext, scoreProperty } from './smartAI';
import { filterStaticProperties, PropertyFilters } from './unifiedPropertyData';

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

      // Build criteria summary
      const criteria = buildCriteriaSummary(aiResponse.context);

      // If no properties found, adjust response
      if (matchedProperties.length === 0) {
        const noPropertiesResponse = `I'm sorry, I couldn't find any properties matching ${criteria} at the moment. Would you like to adjust your criteria or try a different area?`;
        return {
          response: noPropertiesResponse,
          matchedProperties: [],
          context: aiResponse.context
        };
      }

      // Inject property count into AI response
      let finalResponse = aiResponse.response;
      if (!finalResponse.match(/\d+\s+propert(y|ies)/i)) {
        finalResponse = `I found ${matchedProperties.length} ${matchedProperties.length === 1 ? 'property' : 'properties'} ${criteria}. ${finalResponse}`;
      }

      return {
        response: finalResponse,
        matchedProperties,
        context: aiResponse.context
      };
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
    const filters: PropertyFilters = {};

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

    // Location (prioritize areas first, then cities, then states)
    // Areas are most specific, so they should take priority
    if (context.location.areas.length > 0) {
      filters.city = context.location.areas[0];
    } else if (context.location.cities.length > 0) {
      filters.city = context.location.cities[0];
    } else if (context.location.states.length > 0) {
      filters.city = context.location.states[0];
    }

    console.log('Search context:', context.location);
    console.log('Search filters:', filters);

    // Property type
    if (context.propertyType.length > 0) {
      filters.property_type = context.propertyType[0];
    }

    // Bedrooms
    if (context.bedrooms) {
      filters.bedrooms = context.bedrooms;
    }

    // Fetch properties from database first, fallback to static if needed
    let allProperties: PropertyWithImages[] = [];

    try {
      // Try fetching from database
      const dbProperties = await propertyService.getProperties(filters);
      allProperties = dbProperties;
      console.log(`Found ${allProperties.length} properties from database with filters`);

      // If database is empty, use static properties as fallback
      if (allProperties.length === 0) {
        console.log('Database returned no results, trying static properties');
        filters.limit = 50;
        allProperties = filterStaticProperties(filters);
        console.log(`Found ${allProperties.length} properties from static data`);
      }
    } catch (error) {
      console.error('Error fetching from database, falling back to static:', error);
      // Fallback to static properties
      filters.limit = 50;
      allProperties = filterStaticProperties(filters);
      console.log(`Found ${allProperties.length} properties from static data with filters`);
    }

    // If no properties found with location filter, return empty array
    // Don't fall back to showing unrelated properties
    if (allProperties.length === 0 && filters.city) {
      console.log(`No properties found in ${filters.city}`);
      return [];
    }

    // Score and rank all properties
    const scoredProperties = allProperties
      .map(property => {
        const { score, reasons } = scoreProperty(property, context);
        return { property, score, reasons };
      })
      .filter(item => item.score > 15) // Only show properties with decent match
      .sort((a, b) => b.score - a.score)
      .slice(0, 6);

    // If no good matches and user specified a location, return empty
    // Better to show nothing than wrong location
    if (scoredProperties.length === 0 && filters.city) {
      console.log(`No properties scored well for ${filters.city}`);
      return [];
    }

    // If no matches and no location specified, show some properties
    if (scoredProperties.length === 0) {
      const relaxedFilters: PropertyFilters = {
        listing_type: filters.listing_type,
        limit: 6
      };
      return filterStaticProperties(relaxedFilters);
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

function buildCriteriaSummary(context: ConversationContext): string {
  const parts: string[] = [];

  if (context.bedrooms) {
    parts.push(`${context.bedrooms} bedroom${context.bedrooms > 1 ? 's' : ''}`);
  }

  if (context.bathrooms) {
    parts.push(`${context.bathrooms} bathroom${context.bathrooms > 1 ? 's' : ''}`);
  }

  if (context.propertyType.length > 0) {
    parts.push(context.propertyType.join(', '));
  }

  const location = context.location.areas[0] ||
                   context.location.cities[0] ||
                   context.location.states[0];
  if (location) {
    parts.push(`in ${location}`);
  }

  if (context.budget.min && context.budget.max) {
    parts.push(`between RM${context.budget.min.toLocaleString()} - RM${context.budget.max.toLocaleString()}`);
  } else if (context.budget.max) {
    parts.push(`under RM${context.budget.max.toLocaleString()}`);
  } else if (context.budget.min) {
    parts.push(`above RM${context.budget.min.toLocaleString()}`);
  }

  if (context.intent === 'rent') {
    parts.push('for rent');
  } else if (context.intent === 'buy') {
    parts.push('for sale');
  }

  return parts.length > 0 ? parts.join(' ') : 'matching your criteria';
}

// Export types for use in components
export type { ConversationContext };
export { createDefaultContext };
