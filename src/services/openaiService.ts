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

const generateAdvancedResponse = (query: string, properties: Property[], locationInfo?: LocationInfo): string => {
  const q = query.toLowerCase();
  
  // Finance & Investment Expertise (30 years experience)
  if (q.includes('investment') || q.includes('roi') || q.includes('return') || q.includes('yield')) {
    if (q.includes('property') || q.includes('real estate')) {
      return `As a finance expert with 30 years of experience, here's my analysis of property investment:

**Property Investment Fundamentals:**
• **Rental Yield Calculation**: Annual rental income ÷ property price × 100. Target 5-8% gross yield in Malaysia
• **Capital Appreciation**: Historical 3-6% annually in prime locations like KLCC, Mont Kiara
• **Total Return**: Rental yield + capital appreciation - expenses (maintenance, tax, vacancy)

**Malaysian Market Insights:**
• **Prime Areas**: KLCC (4-6% yield), Bangsar (5-7%), Johor (6-9% due to Singapore proximity)
• **Financing**: Maximum 90% LTV for first property, 70% for subsequent. Interest rates 4-5%
• **Tax Considerations**: RPGT (0-30% based on holding period), rental income tax (0-30% based on bracket)

**Risk Management:**
• Diversify across locations and property types
• Maintain 6-month expense reserves
• Consider vacancy rates (5-10% in established areas)

Would you like me to analyze specific properties for investment potential?`;
    }
    return `From 30 years in finance education, here are key investment principles:

**Portfolio Theory:**
• Diversification reduces risk without sacrificing returns
• Asset allocation: 60% stocks, 30% bonds, 10% alternatives (age-dependent)
• Rebalancing quarterly maintains target allocation

**Risk-Return Relationship:**
• Higher returns require higher risk tolerance
• Time horizon determines appropriate risk level
• Dollar-cost averaging reduces timing risk

**Valuation Methods:**
• DCF for intrinsic value calculation
• P/E ratios for relative valuation
• Book value for asset-heavy companies

What specific investment topic would you like to explore?`;
  }

  if (q.includes('mortgage') || q.includes('loan') || q.includes('financing') || q.includes('interest')) {
    return `**Mortgage & Financing Expertise (30 Years Experience):**

**Malaysian Mortgage Landscape:**
• **Base Rate**: Currently 3.00% (BNM Overnight Policy Rate)
• **Lending Rates**: 4.20-5.50% depending on bank and profile
• **Loan Tenure**: Up to 35 years (retirement age limit applies)
• **Maximum LTV**: 90% first property, 70% subsequent properties

**Affordability Calculation:**
• **28% Rule**: Monthly housing cost ≤ 28% of gross income
• **36% Rule**: Total debt payments ≤ 36% of gross income
• **Debt Service Ratio (DSR)**: Banks typically allow up to 70%

**Financing Strategies:**
• **Fixed vs Variable**: Fixed for stability, variable for potential savings
• **Refinancing**: Consider when rates drop 0.5% or more
• **Prepayment**: Extra RM500/month can save 5-7 years on 30-year loan

**Example**: RM500k property, 90% loan, 4.5% rate, 30 years = RM2,280/month
Required income: RM8,143/month (28% rule)

Need specific mortgage calculations for any property?`;
  }

  if (q.includes('budget') || q.includes('afford') || q.includes('salary') || q.includes('income')) {
    const salaryMatch = query.match(/(\d{1,3}(?:,\d{3})*)/);
    if (salaryMatch) {
      const salary = parseFloat(salaryMatch[1].replace(/,/g, ''));
      const maxHousing = salary * 0.28;
      const maxLoan = maxHousing * 12 * 30 / 0.045; // 4.5% rate, 30 years
      const maxPrice = maxLoan / 0.9; // 90% LTV
      
      return `**Affordability Analysis for RM${salary.toLocaleString()} Monthly Income:**

**Safe Housing Budget:**
• Maximum monthly payment: RM${maxHousing.toLocaleString()} (28% rule)
• Maximum loan amount: RM${maxLoan.toLocaleString()}
• Maximum property price: RM${maxPrice.toLocaleString()} (with 10% down payment)

**Financial Planning Advice:**
• Emergency fund: 6 months expenses (RM${(salary * 6).toLocaleString()})
• Down payment needed: RM${(maxPrice * 0.1).toLocaleString()}
• Legal fees & stamp duty: ~RM${(maxPrice * 0.03).toLocaleString()}

**Recommended Property Types:**
${properties.filter(p => p.price <= maxPrice).slice(0, 3).map(p => 
  `• ${p.title} - RM${p.price.toLocaleString()} (${p.location})`
).join('\n')}

This analysis follows conservative banking principles I've taught for 30 years.`;
    }
    
    return `**Personal Finance Budgeting (30 Years Teaching Experience):**

**50/30/20 Rule:**
• 50% Needs (housing, utilities, groceries)
• 30% Wants (entertainment, dining out)
• 20% Savings & debt repayment

**Malaysian Context:**
• EPF contribution: 11% employee + 12% employer
• Emergency fund: 6-12 months expenses
• Property down payment: 10-30% of property value

**Budgeting Steps:**
1. Track all expenses for 3 months
2. Categorize into needs vs wants
3. Automate savings first
4. Review and adjust monthly

What's your monthly income? I can provide personalized property affordability analysis.`;
  }

  if (q.includes('tax') || q.includes('rpgt') || q.includes('stamp duty')) {
    return `**Malaysian Property Tax Expertise (30 Years Experience):**

**Real Property Gains Tax (RPGT):**
• Year 1-3: 30% of gains
• Year 4-5: 20% of gains
• Year 6+: 5% of gains (0% for Malaysian citizens on 6th year+)
• Primary residence: Exempt if held 5+ years

**Stamp Duty (Property Purchase):**
• First RM100k: 1%
• Next RM400k: 2%
• Above RM500k: 3%
• First-time buyers: Exemption up to RM500k

**Annual Property Tax:**
• Assessment tax: 6% of annual value
• Quit rent: Varies by state (RM10-100 typically)

**Tax Optimization Strategies:**
• Hold properties 6+ years to minimize RPGT
• Use spouse's name for additional first-time buyer benefits
• Consider REIT investments for tax-efficient property exposure

Need specific tax calculations for any property transaction?`;
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

  if (q.includes('calculate') || q.includes('math') || /\d+[\+\-\*\/]\d+/.test(q)) {
    const mathMatch = query.match(/(\d+(?:\.\d+)?)\s*([\+\-\*\/])\s*(\d+(?:\.\d+)?)/);
    if (mathMatch) {
      const [, num1, operator, num2] = mathMatch;
      const a = parseFloat(num1), b = parseFloat(num2);
      let result = 0;
      switch (operator) {
        case '+': result = a + b; break;
        case '-': result = a - b; break;
        case '*': result = a * b; break;
        case '/': result = b !== 0 ? a / b : NaN; break;
      }
      return `**Mathematical Calculation:**
${a} ${operator} ${b} = ${result}

As a finance lecturer, I can also help with:
• Compound interest calculations
• Present value analysis
• Mortgage payment calculations
• Investment return projections
• Risk assessment formulas

Need any financial calculations?`;
    }
    
    return `**Mathematical & Financial Calculations:**

I can help with various calculations:
• **Basic Math**: Addition, subtraction, multiplication, division
• **Financial Formulas**: PMT, PV, FV, NPV, IRR
• **Property Calculations**: Affordability, yield, ROI
• **Statistical Analysis**: Mean, median, standard deviation
• **Compound Interest**: A = P(1 + r/n)^(nt)

What would you like me to calculate?`;
  }

  // Science & Technology
  if (q.includes('science') || q.includes('physics') || q.includes('chemistry') || q.includes('biology')) {
    return `**Science & Technology Expertise:**

I can help with various scientific topics:
• **Physics**: Mechanics, thermodynamics, electromagnetism, quantum physics
• **Chemistry**: Organic, inorganic, physical chemistry, biochemistry
• **Biology**: Cell biology, genetics, ecology, evolution
• **Technology**: Programming, AI, data science, engineering

What specific scientific topic interests you?`;
  }

  return generateFallback(query, properties, locationInfo);
};

const generateFallback = (query: string, properties: Property[], locationInfo?: LocationInfo): string => {
  const q = query.toLowerCase();
  
  if (q.includes('hello') || q.includes('hi')) {
    return "Hello! I'm your AI assistant. I can help with any questions and specialize in Malaysian real estate. What would you like to know?";
  }
  
  if (q.includes('math') || q.includes('+') || q.includes('-')) {
    return "I can help with calculations! I'm also great with real estate math like mortgage payments and affordability. What would you like to calculate?";
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