import { PropertyWithImages } from './propertyService';

export interface AIResponse {
  response: string;
  isJoke: boolean;
  isSilly: boolean;
}

const sillyQuestions = [
  'can i buy a house for free',
  'do you have a house for rm1',
  'can i live in your office',
  'do you sell castles',
  'can i buy the petronas towers',
  'can i rent your brain',
  'do you have a treehouse',
  'can i buy a house on the moon',
  'do you sell igloos',
  'can my pet buy a house'
];

const jokeResponses = [
  "Haha! I wish properties were that cheap! In reality, I can help you find affordable options within your actual budget.",
  "That's a good one! While I can't make properties free, I can definitely help you find great deals and investment opportunities.",
  "You're funny! But seriously, let me help you find a realistic property that matches your budget and needs.",
  "I love your creativity! Although that's not possible, I have some amazing properties I'd love to show you.",
  "Nice try! While I can't work miracles, I can work my magic to find you the best property deals available."
];

const greetings = ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening', 'greetings', 'howdy', 'sup', 'yo'];
const farewells = ['bye', 'goodbye', 'see you', 'later', 'farewell', 'take care', 'catch you later'];
const thankYous = ['thank you', 'thanks', 'appreciate it', 'thx', 'ty'];

const offTopicKeywords = [
  'weather', 'food', 'movie', 'music', 'game', 'sport', 'politics', 'news',
  'restaurant', 'recipe', 'tv show', 'celebrity', 'football', 'basketball'
];

export const detectIntent = (query: string): {
  isSilly: boolean;
  isJoke: boolean;
  isGreeting: boolean;
  isFarewell: boolean;
  isThankYou: boolean;
  isOffTopic: boolean;
} => {
  const lowerQuery = query.toLowerCase();

  const isSilly = sillyQuestions.some(q => lowerQuery.includes(q));
  const isJoke = lowerQuery.includes('joke') || lowerQuery.includes('funny') || lowerQuery.includes('make me laugh');
  const isGreeting = greetings.some(g => lowerQuery === g || lowerQuery.startsWith(g + ' ') || lowerQuery.startsWith(g + ','));
  const isFarewell = farewells.some(f => lowerQuery.includes(f));
  const isThankYou = thankYous.some(t => lowerQuery.includes(t));
  const isOffTopic = offTopicKeywords.some(k => lowerQuery.includes(k));

  return { isSilly, isJoke, isGreeting, isFarewell, isThankYou, isOffTopic };
};

export const generateSmartResponse = (query: string, intent: ReturnType<typeof detectIntent>): string | null => {
  const { isSilly, isJoke, isGreeting, isFarewell, isThankYou, isOffTopic } = intent;

  if (isSilly) {
    const randomJoke = jokeResponses[Math.floor(Math.random() * jokeResponses.length)];
    return randomJoke;
  }

  if (isJoke) {
    return "Here's one: Why did the property agent cross the road? To show the house on the other side! Now, how about we find you a real property that'll make you smile?";
  }

  if (isGreeting) {
    return "Hello! I'm your property assistant. I can help you find houses, condos, apartments, or any property you're looking for. What are you interested in?";
  }

  if (isFarewell) {
    return "Goodbye! Feel free to come back anytime you need property assistance. Have a great day!";
  }

  if (isThankYou) {
    return "You're welcome! Is there anything else I can help you with regarding properties?";
  }

  if (isOffTopic) {
    return "That's interesting! But I'm specialized in property searches. How about we find you a perfect home or investment property instead?";
  }

  return null;
};

export const scorePropertyMatch = (property: PropertyWithImages, criteria: {
  intent?: 'buy' | 'rent' | null;
  budget?: { min: number | null; max: number | null };
  property_type?: string[];
  states?: string[];
  areas?: string[];
  bedrooms?: number | null;
  amenities?: string[];
}): number => {
  let score = 0;

  // Intent match (30 points)
  if (criteria.intent) {
    if (criteria.intent === 'buy' && property.listing_type === 'sale') score += 30;
    if (criteria.intent === 'rent' && property.listing_type === 'rent') score += 30;
  }

  // Budget match (25 points)
  if (criteria.budget) {
    if (criteria.budget.max && property.price <= criteria.budget.max) {
      score += 25;
    } else if (criteria.budget.max && property.price > criteria.budget.max) {
      score -= 10;
    }

    if (criteria.budget.min && property.price >= criteria.budget.min) {
      score += 10;
    }
  }

  // Property type match (20 points)
  if (criteria.property_type && criteria.property_type.length > 0) {
    if (criteria.property_type.includes(property.property_type)) {
      score += 20;
    }
  }

  // Location match (15 points)
  if (criteria.states && criteria.states.length > 0) {
    if (criteria.states.some(state => property.state.toLowerCase().includes(state.toLowerCase()))) {
      score += 15;
    }
  }

  if (criteria.areas && criteria.areas.length > 0) {
    if (criteria.areas.some(area =>
      property.city.toLowerCase().includes(area.toLowerCase()) ||
      property.address.toLowerCase().includes(area.toLowerCase())
    )) {
      score += 15;
    }
  }

  // Bedrooms match (10 points)
  if (criteria.bedrooms) {
    if (property.bedrooms === criteria.bedrooms) {
      score += 10;
    } else if (Math.abs(property.bedrooms - criteria.bedrooms) === 1) {
      score += 5;
    }
  }

  // Amenities match (5 points each, max 20)
  if (criteria.amenities && criteria.amenities.length > 0) {
    let amenityScore = 0;
    criteria.amenities.forEach(requestedAmenity => {
      if (property.amenities.some(propAmenity =>
        propAmenity.toLowerCase().includes(requestedAmenity.toLowerCase())
      )) {
        amenityScore += 5;
      }
    });
    score += Math.min(amenityScore, 20);
  }

  // Boost for featured properties
  if (property.featured) {
    score += 5;
  }

  return score;
};

export const generatePropertyDescription = (
  property: PropertyWithImages,
  matchReasons: string[]
): string => {
  const price = property.listing_type === 'rent'
    ? `RM${property.price.toLocaleString()}/month`
    : `RM${property.price.toLocaleString()}`;

  const location = `${property.city}`;
  const size = `${property.sqft.toLocaleString()} sqft`;
  const rooms = property.bedrooms > 0
    ? `${property.bedrooms}BR ${property.bathrooms}BA`
    : `Studio`;

  const reasons = matchReasons.length > 0 ? ` Perfect because: ${matchReasons.join(', ')}.` : '';

  return `${property.title} in ${location} - ${price} | ${rooms}, ${size}${reasons}`;
};
