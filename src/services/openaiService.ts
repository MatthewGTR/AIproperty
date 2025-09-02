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
  initAI();

  try {
    // Try OpenAI first (ChatGPT)
    if (openai) {
      const matchedProperties = findMatches(userQuery, properties, locationInfo);
      
      const systemPrompt = `You are an expert AI assistant with the knowledge of a finance lecturer with 30 years of experience AND a Malaysian real estate expert. You can answer ANY question intelligently.

FINANCE EXPERTISE (30 Years Teaching Experience):
- Investment analysis, portfolio management, risk assessment
- Mortgage calculations, affordability analysis, tax planning
- Economic analysis, market trends, financial planning
- Retirement planning, insurance, wealth management
- Malaysian financial landscape (EPF, banking, regulations)

PROPERTY EXPERTISE:
- Malaysian real estate market analysis
- Property investment strategies
- Neighborhood insights and recommendations
- Market trends and pricing analysis

Available properties: ${JSON.stringify(properties.map(p => ({
  id: p.id, title: p.title, location: p.location, price: p.price, type: p.type,
  bedrooms: p.bedrooms, bathrooms: p.bathrooms, sqft: p.sqft, amenities: p.amenities
})))}

${locationInfo ? `User location context: ${locationInfo.address}` : ''}

Provide comprehensive, intelligent responses. For property queries, recommend specific properties. For finance questions, give detailed professional advice. For general questions, provide thorough, helpful answers.`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4o", // Using latest GPT-4 model
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userQuery }
        ],
        max_tokens: 1000,
        temperature: 0.7,
      });

      return {
        response: completion.choices[0]?.message?.content || "I'm here to help with any questions you have!",
        matchedProperties
      };
    }

    // Try Google Gemini as backup
    if (genAI) {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
      const matchedProperties = findMatches(userQuery, properties, locationInfo);
      
      const prompt = `You are an expert AI assistant with the knowledge of a finance lecturer with 30 years of experience AND a Malaysian real estate expert.

FINANCE EXPERTISE: Investment analysis, portfolio management, mortgage calculations, tax planning, economic analysis, retirement planning, insurance, wealth management, Malaysian financial regulations (EPF, banking, etc.)

PROPERTY EXPERTISE: Malaysian real estate market, property investment, neighborhood insights, market trends, pricing analysis.

Available properties: ${JSON.stringify(properties.map(p => ({
  id: p.id, title: p.title, location: p.location, price: p.price, type: p.type,
  bedrooms: p.bedrooms, bathrooms: p.bathrooms, sqft: p.sqft, amenities: p.amenities
})))}

${locationInfo ? `User location: ${locationInfo.address}` : ''}

User Query: "${userQuery}"

Provide comprehensive, intelligent responses. For property queries, recommend specific properties. For finance questions, give detailed professional advice with calculations where relevant. For general questions, provide thorough, helpful answers.`;

      const result = await model.generateContent(prompt);
      return { 
        response: result.response.text(), 
        matchedProperties 
      };
    }

    // Enhanced fallback with comprehensive responses
    const matchedProperties = findMatches(userQuery, properties, locationInfo);
    return { 
      response: generateIntelligentFallback(userQuery, matchedProperties, locationInfo), 
      matchedProperties 
    };

  } catch (error) {
    console.error('AI Service Error:', error);
    const matchedProperties = findMatches(userQuery, properties, locationInfo);
    return { 
      response: generateIntelligentFallback(userQuery, matchedProperties, locationInfo), 
      matchedProperties 
    };
  }
};

const findMatches = (query: string, properties: Property[], locationInfo?: LocationInfo): Property[] => {
  const q = query.toLowerCase();
  
  // Location-based matching
  const locationKeywords = ['taman daya', 'taman molek', 'sutera utama', 'mount austin', 'klcc', 'mont kiara', 'bangsar', 'johor bahru', 'kuala lumpur', 'penang', 'cyberjaya'];
  for (const location of locationKeywords) {
    if (q.includes(location)) {
      const matches = properties.filter(p => p.location.toLowerCase().includes(location));
      if (matches.length > 0) return matches.slice(0, 6);
    }
  }
  
  // Affordability matching
  const salaryMatch = query.match(/(\d{1,3}(?:,\d{3})*)/);
  if ((q.includes('salary') || q.includes('afford') || q.includes('budget')) && salaryMatch) {
    const amount = parseFloat(salaryMatch[1].replace(/,/g, ''));
    const maxPrice = amount * 12 * 0.28 * 30; // 28% rule, 30-year loan
    return properties.filter(p => p.price <= maxPrice).sort((a, b) => a.price - b.price).slice(0, 6);
  }
  
  // Property type matching
  const typeKeywords = { house: 'house', apartment: 'apartment', condo: 'condo', villa: 'villa' };
  for (const [keyword, type] of Object.entries(typeKeywords)) {
    if (q.includes(keyword)) {
      const matches = properties.filter(p => p.type === type);
      if (matches.length > 0) return matches.slice(0, 6);
    }
  }
  
  // General keyword matching
  const matches = properties.filter(p => {
    const searchText = `${p.title} ${p.location} ${p.description} ${p.amenities.join(' ')} ${p.type}`.toLowerCase();
    return q.split(' ').some(word => word.length > 2 && searchText.includes(word));
  });
  
  return matches.length > 0 ? matches.slice(0, 6) : properties.filter(p => p.featured).slice(0, 6);
};

const generateIntelligentFallback = (query: string, properties: Property[], locationInfo?: LocationInfo): string => {
  const q = query.toLowerCase();
  
  // Finance and Investment Questions
  if (q.includes('invest') || q.includes('portfolio') || q.includes('return') || q.includes('roi')) {
    return `**Investment Analysis (30 Years Finance Teaching Experience):**

**Property Investment Fundamentals:**
• **Rental Yield**: Target 4-6% gross yield in Malaysia
• **Capital Appreciation**: Historical 3-5% annually in prime areas
• **Total Return**: Rental yield + capital appreciation
• **Investment Timeline**: Minimum 5-7 years for optimal returns

**Malaysian Property Investment Strategy:**
• **Location Priority**: KLCC, Mont Kiara, Bangsar for capital growth
• **Rental Demand**: Near universities, business districts, transport hubs
• **Market Cycles**: Buy during downturns, hold long-term
• **Diversification**: Mix residential, commercial, REITs

**Financial Calculations:**
• **28% Rule**: Monthly housing cost ≤ 28% of gross income
• **Debt Service Ratio**: Total debt ≤ 60% of income (Bank Negara)
• **Down Payment**: Minimum 10% for properties above RM500k

**Risk Management:**
• Vacancy risk: Choose high-demand areas
• Interest rate risk: Consider fixed vs variable rates
• Market risk: Diversify across property types and locations

What specific investment aspect interests you?`;
  }

  if (q.includes('mortgage') || q.includes('loan') || q.includes('financing') || q.includes('bank')) {
    return `**Mortgage & Financing (30 Years Banking Experience):**

**Malaysian Mortgage Landscape:**
• **Base Rate**: Currently 3.00% (Bank Negara OPR)
• **Home Loan Rates**: 4.0-4.5% for good credit profiles
• **Maximum Tenure**: 35 years (some banks up to 40 years)
• **Maximum Financing**: 90% for properties below RM500k, 80-90% above

**Loan Calculation Formula:**
Monthly Payment = P × [r(1+r)^n] / [(1+r)^n - 1]
Where: P = Principal, r = Monthly rate, n = Number of payments

**Example Calculation (RM500k property):**
• Down Payment (10%): RM50,000
• Loan Amount: RM450,000
• Interest Rate: 4.2% annually
• Tenure: 30 years
• **Monthly Payment: RM2,203**

**Debt Service Ratio (DSR):**
• Total monthly debt ≤ 60% of gross income
• For RM2,203 payment, minimum income: RM3,672

**Tips for Better Rates:**
• Maintain good credit score (CTOS/CCRIS)
• Compare multiple banks
• Consider government schemes (PR1MA, MyFirst Home)
• Negotiate with relationship banks

What's your target property price and income level?`;
  }

  if (q.includes('tax') || q.includes('rpgt') || q.includes('stamp duty')) {
    return `**Property Tax Planning (30 Years Tax Advisory Experience):**

**Real Property Gains Tax (RPGT):**
• **Malaysian Citizens**: 0% after 5 years, 5% (4-5 years), 10% (3-4 years), 15% (2-3 years), 30% (0-2 years)
• **Non-Citizens**: 5% after 5 years, 10% (4-5 years), 15% (3-4 years), 20% (2-3 years), 30% (0-2 years)
• **Exemptions**: RM10,000 or 10% of gains (whichever is higher)

**Stamp Duty Calculation:**
• **First RM100k**: 1%
• **Next RM400k**: 2%
• **Next RM500k**: 3%
• **Above RM1M**: 4%

**Example (RM800k property):**
• First RM100k: RM1,000
• Next RM400k: RM8,000
• Next RM300k: RM9,000
• **Total Stamp Duty: RM18,000**

**Annual Property Tax:**
• **Quit Rent**: RM50-200 annually (varies by state)
• **Assessment Tax**: 6% of annual rental value
• **Service Charge**: RM200-500 monthly (condos/apartments)

**Tax Optimization Strategies:**
• Hold properties >5 years to avoid RPGT
• Use spouse's name for additional exemptions
• Consider company ownership for commercial properties
• Claim renovation costs against RPGT

What property transaction are you planning?`;
  }

  if (q.includes('retirement') || q.includes('epf') || q.includes('pension')) {
    return `**Retirement Planning (30 Years Financial Planning Experience):**

**Malaysian Retirement Reality:**
• **EPF Target**: RM1 million by age 55 (only 23% achieve this)
• **Life Expectancy**: Plan for 85+ years (30 years retirement)
• **Inflation Impact**: RM1 today = RM0.41 in 30 years (3% inflation)
• **Healthcare Costs**: Increase 6-8% annually

**Retirement Income Calculation:**
• **4% Withdrawal Rule**: Annual expenses = 4% of retirement fund
• **Example**: RM1M fund = RM40k annual income (RM3,333/month)
• **Replacement Ratio**: Need 70-80% of pre-retirement income

**EPF Optimization Strategies:**
• **Voluntary Contribution**: Up to RM60k annually (tax deductible)
• **Account 2 Usage**: Property purchase, education, healthcare
• **Top-up Benefits**: RM6k annual top-up for tax relief
• **Dividend Rates**: Historical 5-6% annually

**Property in Retirement Planning:**
• **Paid-off Home**: Eliminates largest expense (housing)
• **Rental Properties**: Inflation-adjusted income stream
• **Downsizing Strategy**: Release equity for retirement fund
• **Location Planning**: Near healthcare, public transport

**Retirement Calculation Example:**
Current Age: 35, Target: RM2M by 55
• Required Monthly Savings: RM4,200
• With EPF (23%): Personal savings needed: RM3,234
• Property investment can bridge this gap

What's your current age and retirement target?`;
  }

  if (q.includes('economics') || q.includes('market') || q.includes('inflation') || q.includes('gdp')) {
    return `**Economic Analysis (30 Years Academic & Industry Experience):**

**Malaysian Economic Fundamentals (2025):**
• **GDP Growth**: Target 4.5-5.5% (post-pandemic recovery)
• **Inflation Rate**: 2.5-3.5% (Bank Negara target: 2-3%)
• **OPR (Overnight Policy Rate)**: 3.00% (neutral stance)
• **Unemployment**: 3.3% (near full employment)
• **Currency**: MYR 4.20-4.60 vs USD (managed float)

**Property Market Economics:**
• **Supply-Demand**: Urban shortage, rural oversupply
• **Price Elasticity**: Inelastic demand (necessity good)
• **Interest Rate Sensitivity**: 1% rate increase = 10-15% demand drop
• **Foreign Investment**: MM2H revival impacts luxury segment

**Economic Indicators Impact on Property:**
• **Employment Growth** → Increased housing demand
• **Interest Rates** → Affordability and investment returns
• **Government Policies** → Supply regulations, incentives
• **Infrastructure Development** → Location value appreciation

**Market Cycle Analysis:**
• **Current Phase**: Recovery/Early Growth (post-pandemic)
• **Leading Indicators**: Employment, credit growth, construction permits
• **Lagging Indicators**: Property prices, transaction volumes

**Regional Economic Drivers:**
• **Johor**: Singapore spillover, Iskandar Malaysia development
• **KL/Selangor**: Financial hub, manufacturing, services
• **Penang**: Technology, tourism, heritage preservation

**Investment Timing Strategy:**
• **Buy**: During economic downturns, high interest rates
• **Hold**: Through economic cycles (minimum 7-10 years)
• **Sell**: Peak economic growth, low interest rates

What specific economic aspect would you like me to analyze?`;
  }

  if (q.includes('insurance') || q.includes('protection') || q.includes('coverage') || q.includes('mrta')) {
    return `**Insurance & Protection Planning (30 Years Risk Management Experience):**

**Essential Insurance Portfolio:**
• **Life Insurance**: 10-15x annual income (human capital protection)
• **Medical Insurance**: RM1-2M coverage (inflation-adjusted)
• **Disability Income**: 60-70% income replacement until age 65
• **Critical Illness**: 3-5x annual income for treatment costs

**Property-Related Insurance:**
• **MRTA/MLTA**: Mortgage protection (mandatory for loans)
  - MRTA: Decreasing coverage, lower premium
  - MLTA: Level coverage, higher premium, cash value
• **Fire Insurance**: Required by banks, covers structure
• **Home Contents**: Personal belongings (10-20% of property value)
• **Rental Guarantee**: For investment properties (6-12 months coverage)

**Insurance Calculation Example:**
Income: RM10,000/month
• Life Insurance Need: RM1.2-1.8M
• Annual Premium Budget: 10-15% of income (RM12-18k)
• MRTA for RM500k loan: RM200-300/month

**Risk Assessment Framework:**
• **Human Capital**: Present value of future earnings
• **Property Risk**: Fire, flood, earthquake, theft
• **Liability Risk**: Third-party claims, professional indemnity
• **Longevity Risk**: Outliving retirement savings

**Cost Optimization Strategies:**
• **Bundle Policies**: 10-20% discount with same insurer
• **Higher Deductibles**: Reduce premiums by 15-25%
• **Annual Payment**: Save 5-10% vs monthly payments
• **Regular Review**: Update coverage with life changes

**Malaysian Insurance Landscape:**
• **Takaful vs Conventional**: Shariah-compliant options available
• **Tax Relief**: Life insurance premiums up to RM3k annually
• **EPF Withdrawal**: Account 2 for insurance premiums

What's your current insurance coverage and protection needs?`;
  }

  // Property-specific responses
  if (properties.length > 0) {
    const priceRange = { 
      min: Math.min(...properties.map(p => p.price)), 
      max: Math.max(...properties.map(p => p.price)) 
    };
    
    if (properties.length === 1) {
      const p = properties[0];
      return `**Perfect Property Match Found!**

**${p.title}** in ${p.location}
• **Price**: RM${p.price.toLocaleString()}
• **Details**: ${p.bedrooms} bedrooms, ${p.bathrooms} bathrooms, ${p.sqft.toLocaleString()} sqft
• **Type**: ${p.type.charAt(0).toUpperCase() + p.type.slice(1)}

**Financial Analysis:**
• **Monthly Payment** (90% loan, 4.2%, 30 years): RM${Math.round(p.price * 0.9 * 0.042 / 12 / (1 - Math.pow(1 + 0.042/12, -360))).toLocaleString()}
• **Minimum Income Required**: RM${Math.round(p.price * 0.9 * 0.042 / 12 / (1 - Math.pow(1 + 0.042/12, -360)) / 0.28).toLocaleString()}
• **Down Payment**: RM${(p.price * 0.1).toLocaleString()}

**Investment Potential:**
• **Rental Yield Estimate**: 4-6% annually
• **Price per sqft**: RM${Math.round(p.price / p.sqft)}

This property offers excellent value! Would you like detailed financing options or neighborhood analysis?`;
    }
    
    return `**Found ${properties.length} Properties Matching Your Criteria**

**Price Range**: RM${priceRange.min.toLocaleString()} - RM${priceRange.max.toLocaleString()}

**Financial Planning Insight:**
For the average property (RM${Math.round((priceRange.min + priceRange.max) / 2).toLocaleString()}):
• **Monthly Payment**: RM${Math.round(((priceRange.min + priceRange.max) / 2) * 0.9 * 0.042 / 12 / (1 - Math.pow(1 + 0.042/12, -360))).toLocaleString()}
• **Required Income**: RM${Math.round(((priceRange.min + priceRange.max) / 2) * 0.9 * 0.042 / 12 / (1 - Math.pow(1 + 0.042/12, -360)) / 0.28).toLocaleString()}

**Investment Analysis:**
• **Entry Level**: RM${priceRange.min.toLocaleString()} (good for first-time buyers)
• **Premium Options**: RM${priceRange.max.toLocaleString()} (luxury/investment grade)

Check out the recommended properties below! Need help with financing calculations or market analysis?`;
  }

  // General intelligent responses
  if (q.includes('hello') || q.includes('hi') || q.includes('good morning') || q.includes('good afternoon')) {
    return `Hello! I'm your Smart Property AI with 30 years of finance expertise. I can help you with:

🏠 **Property Questions**: Market analysis, property recommendations, neighborhood insights
💰 **Financial Planning**: Investment strategies, mortgage calculations, affordability analysis  
📊 **Economic Analysis**: Market trends, economic indicators, investment timing
🎯 **Personal Finance**: Retirement planning, insurance, portfolio management
📈 **Investment Advice**: ROI calculations, risk assessment, diversification strategies

What would you like to explore today?`;
  }

  if (q.includes('thank') || q.includes('thanks')) {
    return `You're very welcome! As your AI assistant with extensive finance and property expertise, I'm always here to help. Whether you need property recommendations, financial calculations, investment advice, or economic analysis - just ask! 

Is there anything else you'd like to know about property investment or financial planning?`;
  }

  // Default intelligent response
  return `I understand you're asking about "${query}". As an AI assistant with 30 years of finance expertise and Malaysian property knowledge, I can provide comprehensive insights on:

**Finance & Investment**: Portfolio management, risk analysis, retirement planning, insurance strategies
**Property Market**: Investment opportunities, market trends, affordability analysis
**Economic Analysis**: Market cycles, interest rate impacts, economic indicators
**Personal Finance**: Budgeting, savings strategies, wealth building

Could you provide more specific details about what you'd like to know? I'm here to give you professional-level financial and property advice!`;
};