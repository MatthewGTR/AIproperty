import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Property } from '../types/Property';

let openai: OpenAI | null = null;
let genAI: GoogleGenerativeAI | null = null;

const initAI = () => {
  const openaiKey = import.meta.env.VITE_OPENAI_API_KEY;
  const geminiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
  if (openaiKey && openaiKey !== 'your_openai_api_key_here' && openaiKey.trim()) {
    openai = new OpenAI({ apiKey: openaiKey, dangerouslyAllowBrowser: true });
  }
  
  if (geminiKey && geminiKey !== 'your_gemini_api_key_here' && geminiKey.trim()) {
    genAI = new GoogleGenerativeAI(geminiKey);
  }
};

export interface LocationInfo {
  address: string;
  lat: number;
  lng: number;
  neighborhood?: string;
  city?: string;
  state?: string;
  country?: string;
}

export const searchPropertiesWithAI = async (
  userQuery: string, 
  properties: Property[],
  locationInfo?: LocationInfo
): Promise<{ response: string; matchedProperties: Property[] }> => {
  const isPropertyQuery = isPropertyRelated(userQuery);
  initAI();

  try {
    if (genAI) {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const matchedProperties = isPropertyQuery ? findMatches(userQuery, properties, locationInfo) : [];
      
      const prompt = isPropertyQuery ? 
        `You are a Malaysian real estate AI expert. Available properties: ${JSON.stringify(properties.map(p => ({
          id: p.id, title: p.title, location: p.location, price: p.price, type: p.type,
          bedrooms: p.bedrooms, bathrooms: p.bathrooms, sqft: p.sqft, amenities: p.amenities
        })))}
        
        ${locationInfo ? `User location: ${locationInfo.address}` : ''}
        
        Query: "${userQuery}"
        
        Provide expert property advice, match exact locations, calculate affordability (28% rule), and give investment insights.` :
        
        `You are a helpful AI assistant. Query: "${userQuery}"
        
        Provide comprehensive answers on any topic while mentioning you're also a Malaysian property expert when relevant.`;

      const result = await model.generateContent(prompt);
      return { response: result.response.text(), matchedProperties };
    }

    if (openai) {
      const matchedProperties = isPropertyQuery ? findMatches(userQuery, properties, locationInfo) : [];
      
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { 
            role: "system", 
            content: isPropertyQuery ? 
              "You are a Malaysian real estate expert. Provide professional property consultation." :
              "You are a helpful AI assistant. Answer any question comprehensively."
          },
          { role: "user", content: userQuery }
        ],
        max_tokens: 500,
        temperature: 0.7,
      });

      return {
        response: completion.choices[0]?.message?.content || "How can I help you today?",
        matchedProperties
      };
    }

    const matchedProperties = isPropertyQuery ? findMatches(userQuery, properties, locationInfo) : [];
    return { response: generateFallback(userQuery, matchedProperties, locationInfo), matchedProperties };

  } catch (error) {
    const matchedProperties = isPropertyQuery ? findMatches(userQuery, properties, locationInfo) : [];
    return { response: generateFallback(userQuery, matchedProperties, locationInfo), matchedProperties };
  }
};

const isPropertyRelated = (query: string): boolean => {
  const keywords = ['house', 'apartment', 'condo', 'property', 'rent', 'buy', 'bedroom', 'price', 'location', 'taman', 'klcc', 'johor', 'salary', 'afford', 'mortgage'];
  return keywords.some(k => query.toLowerCase().includes(k));
};

const findMatches = (query: string, properties: Property[], locationInfo?: LocationInfo): Property[] => {
  const q = query.toLowerCase();
  
  // Exact location matches
  const locations = ['taman daya', 'taman molek', 'sutera utama', 'mount austin', 'klcc', 'mont kiara', 'bangsar'];
  for (const loc of locations) {
    if (q.includes(loc)) {
      const matches = properties.filter(p => p.location.toLowerCase().includes(loc));
      if (matches.length > 0) return matches;
    }
  }
  
  // Salary affordability
  const salaryMatch = query.match(/(\d{1,3}(?:,\d{3})*)/);
  if ((q.includes('salary') || q.includes('afford')) && salaryMatch) {
    const salary = parseFloat(salaryMatch[1].replace(/,/g, ''));
    const maxPrice = salary * 12 * 0.28 * 12 * 30 / 0.065 / 0.8; // Simplified calculation
    return properties.filter(p => p.price <= maxPrice).sort((a, b) => a.price - b.price);
  }
  
  // General matching
  const matches = properties.filter(p => {
    const text = `${p.title} ${p.location} ${p.description} ${p.amenities.join(' ')} ${p.type}`.toLowerCase();
    return q.split(' ').some(word => word.length > 2 && text.includes(word));
  });
  
  return matches.length > 0 ? matches : properties.filter(p => p.featured);
};

const generateFallback = (query: string, properties: Property[], locationInfo?: LocationInfo): string => {
  const q = query.toLowerCase();
  
  if (q.includes('hello') || q.includes('hi')) {
    return "Hello! I'm your AI assistant. I can help with any questions and specialize in Malaysian real estate. What would you like to know?";
  }
  
  if (q.includes('math') || q.includes('+') || q.includes('-')) {
    return "I can help with calculations! I'm also great with real estate math like mortgage payments and affordability. What would you like to calculate?";
  }
  
  if (q.includes('economics') || q.includes('market') || q.includes('inflation') || q.includes('gdp')) {
    return `**Economic Analysis (30 Years Academic Experience):**

**Malaysian Economic Fundamentals:**
• GDP Growth: 4-6% annually (pre-pandemic trend)
• Inflation Target: 2-3% (Bank Negara Malaysia)
• Interest Rate Corridor: OPR currently 3.00%
• Currency: MYR typically 4.0-4.7 vs USD

**Property Market Economics:**
• **Supply-Demand Dynamics**: Urban areas face housing shortage
• **Price Elasticity**: Property demand relatively inelastic (necessity)
• **Economic Cycles**: Property lags economic cycles by 6-12 months
• **Foreign Investment**: MM2H program impacts luxury segment

**Market Indicators to Watch:**
• Employment rates (affects demand)
• Interest rate trends (affects affordability)
• Government policies (affects supply)
• Infrastructure development (affects location values)

**Current Market Assessment:**
Malaysia's property market shows resilience with selective growth in prime locations.

What specific economic aspect interests you?`;
  }

  if (q.includes('portfolio') || q.includes('diversification') || q.includes('asset allocation')) {
    return `**Portfolio Management (30 Years Teaching Experience):**

**Modern Portfolio Theory:**
• **Diversification**: Don't put all eggs in one basket
• **Correlation**: Combine assets that move differently
• **Risk-Return Optimization**: Maximize return for given risk level
• **Rebalancing**: Maintain target allocation quarterly

**Asset Allocation by Age:**
• **20s-30s**: 80% stocks, 15% bonds, 5% alternatives
• **40s-50s**: 60% stocks, 30% bonds, 10% alternatives
• **60s+**: 40% stocks, 50% bonds, 10% alternatives

**Property in Portfolio:**
• **REITs**: 5-10% allocation for liquidity
• **Direct Property**: 10-20% for long-term wealth
• **Geographic Diversification**: Mix local and international

**Risk Management:**
• Never invest more than 5% in single asset
• Maintain 6-month emergency fund
• Regular portfolio review and rebalancing

What's your current portfolio allocation?`;
  }

  if (q.includes('retirement') || q.includes('epf') || q.includes('pension')) {
    return `**Retirement Planning (30 Years Expertise):**

**Malaysian Retirement Landscape:**
• **EPF**: 11% employee + 12% employer contribution
• **Target**: RM1 million by age 55 (EPF recommendation)
• **Withdrawal**: Age 55 (partial), 60 (full)
• **Life Expectancy**: Plan for 85+ years

**Retirement Calculation:**
• **4% Rule**: Annual expenses = 4% of retirement fund
• **Replacement Ratio**: Need 70-80% of pre-retirement income
• **Inflation Impact**: RM1 today = RM0.55 in 20 years (3% inflation)

**Property in Retirement:**
• **Paid-off Home**: Reduces retirement expenses significantly
• **Rental Income**: Provides inflation-adjusted income stream
• **Downsizing**: Release equity for retirement fund

**EPF Optimization:**
• Voluntary contribution up to RM60k annually
• Property purchase using Account 2
• Top-up for tax relief (RM6k annually)

What's your current age and retirement goals?`;
  }

  if (q.includes('insurance') || q.includes('protection') || q.includes('coverage')) {
    return `**Insurance & Protection Planning (30 Years Experience):**

**Essential Insurance Coverage:**
• **Life Insurance**: 10x annual income minimum
• **Medical**: RM1-2 million coverage recommended
• **Disability**: 60-70% income replacement
• **Property**: Fire, flood, earthquake coverage

**Property-Related Insurance:**
• **MRTA/MLTA**: Mortgage protection (mandatory for loans)
• **Fire Insurance**: Required by banks for mortgaged properties
• **Home Contents**: Personal belongings protection
• **Rental Guarantee**: For investment properties

**Insurance Principles:**
• **Insure the Risk, Not the Premium**: Focus on coverage adequacy
• **Term vs Whole Life**: Term for protection, investment for wealth
• **Regular Review**: Update coverage with life changes

**Cost Optimization:**
• Bundle policies for discounts
• Higher deductibles reduce premiums
• Annual payment vs monthly saves 5-10%

What specific insurance needs do you have?`;
  }

  if (properties.length === 0) {
    return "I couldn't find exact matches, but I have great alternatives! What's most important to you - location, price, or features?";
  }
  
  if (properties.length === 1) {
    const p = properties[0];
    return `Perfect match: "${p.title}" in ${p.location} for RM${p.price.toLocaleString()}. This ${p.bedrooms}-bedroom ${p.type} offers great value!`;
  }
  
  const priceRange = { min: Math.min(...properties.map(p => p.price)), max: Math.max(...properties.map(p => p.price)) };
  return `Found ${properties.length} properties ranging from RM${priceRange.min.toLocaleString()} to RM${priceRange.max.toLocaleString()}. Which interests you most?`;
};