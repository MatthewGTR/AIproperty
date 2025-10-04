import { PropertyWithImages } from './propertyService';

export interface AIResponse {
  response: string;
  isJoke: boolean;
  isSilly: boolean;
}

export interface ConversationContext {
  hasSeenProperties?: boolean;
  lastIntent?: 'buy' | 'rent' | null;
  conversationCount?: number;
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

const getRandomSillyResponse = (): string => {
  const responses = [
    "That's creative! While I can't help with that, I can find you amazing properties that actually exist.",
    "Love the imagination! Let's focus on real properties that fit your needs.",
    "That's a fun idea! But I've got something better - actual properties you can own or rent.",
    "Nice one! How about we look at realistic options that might surprise you?",
    "I appreciate the humor! Let me show you properties that are actually available."
  ];
  return responses[Math.floor(Math.random() * responses.length)];
};

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

const generateDynamicJoke = (): string => {
  const jokes = [
    {
      joke: "Why don't properties ever get lonely? Because they always have great neighbors!",
      followUp: "Speaking of great properties, what are you looking for?"
    },
    {
      joke: "What's a property's favorite type of music? House music, of course!",
      followUp: "Now, let's find you a place with good vibes!"
    },
    {
      joke: "Why did the condo go to therapy? It had too many issues with commitment!",
      followUp: "Don't worry, I'll help you find a property with no issues!"
    },
    {
      joke: "How do properties communicate? Through their Windows!",
      followUp: "Let me help you find a property that speaks to you!"
    },
    {
      joke: "Why do apartments make terrible comedians? Their jokes always fall flat!",
      followUp: "But seriously, what kind of place are you looking for?"
    }
  ];

  const selected = jokes[Math.floor(Math.random() * jokes.length)];
  return `${selected.joke}\n\n${selected.followUp}`;
};

const generateDynamicGreeting = (context?: ConversationContext): string => {
  // Returning user
  if (context?.conversationCount && context.conversationCount > 1) {
    const returningGreetings = [
      "Welcome back! Ready to continue your property search?",
      "Good to see you again! What would you like to explore today?",
      "Hello again! Let's find you that perfect property.",
      "Hey! Back for more properties? Let's get started!",
      "Welcome back! How can I help you today?"
    ];
    return returningGreetings[Math.floor(Math.random() * returningGreetings.length)];
  }

  // New user - varied greetings
  const greetings = [
    "Hey there! Ready to find your ideal property?",
    "Hello! What kind of property are you looking for today?",
    "Hi! I'm here to help you find the perfect place. What interests you?",
    "Welcome! Let's find you an amazing property. What are you thinking?",
    "Good to see you! Tell me what you're looking for and I'll help you find it.",
    "Hi there! Whether it's buying or renting, I'm here to help. What's on your mind?"
  ];
  return greetings[Math.floor(Math.random() * greetings.length)];
};

const generateDynamicFarewell = (): string => {
  const farewells = [
    "Take care! Come back anytime you need property help.",
    "See you later! Feel free to return when you're ready to search.",
    "Goodbye! I'll be here whenever you need property assistance.",
    "Have a great day! Come back soon if you want to continue searching.",
    "Catch you later! Don't hesitate to return when you're ready.",
    "Take it easy! I'm always here to help with your property search."
  ];
  return farewells[Math.floor(Math.random() * farewells.length)];
};

const generateDynamicThankYou = (context?: ConversationContext): string => {
  // If they've seen properties, offer to refine
  if (context?.hasSeenProperties) {
    const withPropertiesResponses = [
      "Happy to help! Want to see different properties or adjust your filters?",
      "You're welcome! Need to refine the search or explore other areas?",
      "Glad I could assist! Would you like to adjust your budget or location?",
      "Anytime! Want to add more filters or change your preferences?",
      "My pleasure! Feel free to narrow down or expand your search.",
      "You're welcome! Ready to explore more options or focus on specific areas?"
    ];
    return withPropertiesResponses[Math.floor(Math.random() * withPropertiesResponses.length)];
  }

  // General thank you responses
  const responses = [
    "Happy to help! Anything else you'd like to know?",
    "You're welcome! What else can I help you find?",
    "Glad I could assist! Need help with anything else?",
    "Anytime! What else are you curious about?",
    "My pleasure! Feel free to ask me anything about properties.",
    "You're welcome! Ready to start your property search?"
  ];
  return responses[Math.floor(Math.random() * responses.length)];
};

const generateOffTopicResponse = (query: string): string => {
  const topic = query.toLowerCase();
  let specificResponse = "";

  if (topic.includes('weather')) {
    specificResponse = "The weather's always better in a great property! ";
  } else if (topic.includes('food') || topic.includes('restaurant')) {
    specificResponse = "I love good food too! Maybe you need a property near great restaurants? ";
  } else if (topic.includes('movie') || topic.includes('tv')) {
    specificResponse = "Movies are great! You know what else is great? Finding the perfect property! ";
  } else if (topic.includes('sport') || topic.includes('game')) {
    specificResponse = "Sports fan? Maybe you need a place near stadiums or with good sports facilities? ";
  } else {
    specificResponse = "That's interesting! ";
  }

  const redirects = [
    "But let's focus on finding you a perfect property.",
    "How about we find you an amazing place to live?",
    "Let me help you discover properties you'll love.",
    "Shall we look at some properties that match your needs?",
    "Ready to explore some great property options?"
  ];

  return specificResponse + redirects[Math.floor(Math.random() * redirects.length)];
};

export const generateSmartResponse = (
  query: string,
  intent: ReturnType<typeof detectIntent>,
  context?: ConversationContext
): string | null => {
  const { isSilly, isJoke, isGreeting, isFarewell, isThankYou, isOffTopic } = intent;

  if (isSilly) {
    return getRandomSillyResponse();
  }

  if (isJoke) {
    return generateDynamicJoke();
  }

  if (isGreeting) {
    return generateDynamicGreeting(context);
  }

  if (isFarewell) {
    return generateDynamicFarewell();
  }

  if (isThankYou) {
    return generateDynamicThankYou(context);
  }

  if (isOffTopic) {
    return generateOffTopicResponse(query);
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
