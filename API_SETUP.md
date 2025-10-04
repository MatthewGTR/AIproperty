# API Keys Setup Guide

This guide will help you configure the optional API keys for enhanced functionality.

## Overview

Your property chatbot works **perfectly without any API keys**! However, you can add these optional services for enhanced features:

| API | Purpose | Required? | Cost |
|-----|---------|-----------|------|
| **OpenAI** | Natural conversation for off-topic questions | ❌ Optional | ~$0.002/chat |
| **Google Gemini** | Backup AI for off-topic questions | ❌ Optional | Free tier available |
| **Google Maps** | Accurate geocoding & distance calculations | ❌ Optional | Free tier: 28,500 calls/month |

---

## What Works Without API Keys?

### ✅ Fully Functional Features (No API Keys Needed)

1. **Smart Property Search**
   - Intent detection (buy/rent)
   - Budget extraction and calculation
   - Salary-based affordability
   - Family size inference
   - Location matching (20+ Malaysian cities)
   - Property type filtering
   - Amenities matching
   - Smart scoring algorithm

2. **Intelligent Conversation**
   - Dynamic greetings (11 variations)
   - Context-aware responses
   - Adaptive behavior (initial vs refinement)
   - Jokes and personality (5+ variations)
   - Thank you responses (12 variations)
   - Basic off-topic handling (6 categories)

3. **Location Services**
   - Built-in Malaysian cities database (20 locations)
   - Haversine distance calculation
   - State and area matching
   - Approximate coordinates

### ⚠️ Limited Without API Keys

1. **Off-Topic Conversations**
   - Without OpenAI/Gemini: Uses predefined responses
   - With OpenAI/Gemini: Natural, context-aware conversations

2. **Geocoding Accuracy**
   - Without Google Maps: Uses approximate coordinates for 20 cities
   - With Google Maps: Precise coordinates for any Malaysian address

---

## Setup Instructions

### Step 1: Copy Environment File

```bash
cp .env.example .env
```

### Step 2: Choose Which APIs to Enable

You can enable **all**, **some**, or **none** of these APIs based on your needs.

---

## 1. OpenAI API (ChatGPT)

### Why Enable?
For natural, conversational responses to off-topic questions.

**Example Without OpenAI:**
```
User: "What's the weather like?"
Bot: "Weather's been pretty typical for Malaysia! By the way, if you're
      property hunting, I can help you find places with great outdoor
      spaces. What kind of property interests you?"
```

**Example With OpenAI:**
```
User: "What's the weather like?"
Bot: "It's been quite hot and humid lately - typical Malaysian weather!
      If you're looking for a property, I'd recommend places with good
      ventilation or air conditioning. What's your budget and preferred area?"
```

### Setup Steps

1. **Get API Key**
   - Visit: https://platform.openai.com/api-keys
   - Sign up or log in
   - Click "Create new secret key"
   - Copy the key (starts with `sk-...`)

2. **Add to .env**
   ```bash
   VITE_OPENAI_API_KEY=sk-your-actual-key-here
   ```

3. **Cost**
   - Model: GPT-3.5-turbo
   - Cost: ~$0.002 per conversation
   - Monthly estimate (100 conversations): ~$0.20

---

## 2. Google Gemini API

### Why Enable?
Backup AI service for off-topic questions (alternative to OpenAI).

**Use Case:** If you don't want to pay for OpenAI or prefer Google's AI.

### Setup Steps

1. **Get API Key**
   - Visit: https://makersuite.google.com/app/apikey
   - Sign in with Google account
   - Click "Create API key"
   - Copy the key

2. **Add to .env**
   ```bash
   VITE_GEMINI_API_KEY=your-gemini-key-here
   ```

3. **Cost**
   - Free tier: 60 requests per minute
   - Paid tier: $0.00025 per 1K characters

### Priority
If both OpenAI and Gemini keys are present, OpenAI is used first.

---

## 3. Google Maps API

### Why Enable?
For accurate geocoding and distance calculations.

**Example Without Google Maps:**
```
User: "Properties near Mont Kiara"
Bot: Uses approximate coordinates from built-in database (±500m accuracy)
```

**Example With Google Maps:**
```
User: "Properties near Mont Kiara"
Bot: Uses precise coordinates from Google Maps API (±10m accuracy)
     Can calculate exact distances to amenities
```

### Setup Steps

1. **Get API Key**
   - Visit: https://console.cloud.google.com/google/maps-apis/
   - Create a new project or select existing
   - Enable these APIs:
     - ✅ Geocoding API
     - ✅ Places API
     - ✅ Maps JavaScript API
   - Go to "Credentials" → "Create credentials" → "API key"
   - Copy the key

2. **Add to .env**
   ```bash
   VITE_GOOGLE_MAPS_API_KEY=your-maps-key-here
   ```

3. **Security (Important!)**

   After creating the key, secure it:
   - Click on the API key
   - Under "Application restrictions":
     - Select "HTTP referrers (websites)"
     - Add your domain: `yourdomain.com/*` and `localhost:*`
   - Under "API restrictions":
     - Select "Restrict key"
     - Enable only: Geocoding API, Places API, Maps JavaScript API
   - Save

4. **Cost**
   - Free tier: $200 credit/month
   - Geocoding: $5 per 1,000 requests
   - Free tier covers ~28,500 geocoding calls/month

---

## Your .env File

After setup, your `.env` should look like:

```bash
# Supabase (Already configured)
VITE_SUPABASE_URL=https://...supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...

# Optional: For off-topic conversations
VITE_OPENAI_API_KEY=sk-proj-...
# OR
VITE_GEMINI_API_KEY=AIza...

# Optional: For accurate geocoding
VITE_GOOGLE_MAPS_API_KEY=AIza...
```

---

## Testing Your Setup

### Test Without Any API Keys ✅

1. Start dev server: `npm run dev`
2. Try these queries:
   ```
   "I earn 5000 and have 2 kids"
   → Should calculate budget and show properties ✅

   "Looking for villas above RM2 million"
   → Should show luxury properties ✅

   "What's the weather?"
   → Should use fallback response ⚠️
   ```

### Test With OpenAI/Gemini Key ✅

1. Add key to `.env`
2. Restart dev server
3. Try off-topic questions:
   ```
   "What's the weather?"
   → Should get natural conversation ✅

   "Tell me about KL"
   → Should get conversational response ✅
   ```

### Test With Google Maps Key ✅

1. Add key to `.env`
2. Restart dev server
3. Try location queries:
   ```
   "Properties near KLCC"
   → Should use precise coordinates ✅

   "Show me places in Petaling Jaya"
   → Should geocode accurately ✅
   ```

---

## Troubleshooting

### OpenAI Key Not Working

**Error:** `Invalid API key`
- ✓ Check key starts with `sk-`
- ✓ Ensure no extra spaces
- ✓ Check billing is enabled at https://platform.openai.com/account/billing

**Error:** `Rate limit exceeded`
- You're making too many requests
- Add delay between requests or upgrade plan

### Google Maps Key Not Working

**Error:** `API key not found`
- ✓ Ensure key is in `.env` file
- ✓ Restart dev server after adding key

**Error:** `This API key is not authorized`
- ✓ Enable required APIs in Google Cloud Console
- ✓ Check HTTP referrer restrictions
- ✓ Wait 5 minutes for changes to propagate

### Gemini Key Not Working

**Error:** `Invalid API key`
- ✓ Check key format
- ✓ Ensure API is enabled in Google AI Studio

---

## Cost Estimation

### Small Property Site (100 users/month)

| API | Usage | Cost |
|-----|-------|------|
| **OpenAI** | ~500 conversations | ~$1.00/month |
| **Gemini** | ~500 conversations | $0.00 (free tier) |
| **Google Maps** | ~1,000 geocoding calls | $0.00 (free tier) |

### Medium Property Site (1,000 users/month)

| API | Usage | Cost |
|-----|-------|------|
| **OpenAI** | ~5,000 conversations | ~$10/month |
| **Gemini** | ~5,000 conversations | ~$1.25/month |
| **Google Maps** | ~10,000 geocoding calls | $0.00 (free tier) |

### Large Property Site (10,000 users/month)

| API | Usage | Cost |
|-----|-------|------|
| **OpenAI** | ~50,000 conversations | ~$100/month |
| **Gemini** | ~50,000 conversations | ~$12.50/month |
| **Google Maps** | ~100,000 geocoding calls | ~$15/month |

---

## Recommendations

### For Development/Testing
```bash
# Start with NO API keys - Everything works!
# Test full property search functionality
# Only add APIs if you need specific features
```

### For Small Production Site
```bash
# Option 1: No API keys - Save money, works great! ✅
# Option 2: Google Maps only - For accurate geocoding
VITE_GOOGLE_MAPS_API_KEY=your-key
```

### For Medium Production Site
```bash
# Add Gemini (free) for better conversations
VITE_GEMINI_API_KEY=your-key
VITE_GOOGLE_MAPS_API_KEY=your-key
```

### For Large Production Site
```bash
# Use OpenAI for best conversation quality
VITE_OPENAI_API_KEY=your-key
VITE_GOOGLE_MAPS_API_KEY=your-key
```

---

## Security Best Practices

### ⚠️ NEVER Commit API Keys

```bash
# .env is already in .gitignore ✅
# Never add keys to .env.example
# Never commit .env file
```

### ✅ Use Environment Variables

```bash
# In production (Netlify/Vercel):
# Add API keys in dashboard environment variables
# Keys are never exposed in source code
```

### ✅ Restrict API Keys

1. **OpenAI**: Set usage limits in dashboard
2. **Google Maps**: Set HTTP referrer restrictions
3. **Gemini**: Enable only required APIs

---

## FAQ

### Q: Do I need all three APIs?
**A:** No! Start with none. Your chatbot works perfectly without any API keys.

### Q: Which API should I add first?
**A:** Google Maps if you need accurate geocoding. Otherwise, none!

### Q: Can I use Gemini instead of OpenAI?
**A:** Yes! Gemini is free and works great. OpenAI gives slightly better responses but costs money.

### Q: What happens if I run out of free tier?
**A:** Google Maps: Requests fail gracefully, falls back to built-in database
OpenAI/Gemini: Requests fail, uses predefined responses

### Q: Are API keys required for property search?
**A:** NO! Property search is 100% local and works without any API keys.

---

## Support

Need help? Check:
- OpenAI: https://platform.openai.com/docs
- Google Maps: https://developers.google.com/maps/documentation
- Gemini: https://ai.google.dev/docs

---

## Summary

✅ **Your chatbot works perfectly without any API keys!**
✅ Add OpenAI/Gemini only for natural off-topic conversations
✅ Add Google Maps only for precise geocoding
✅ Start with nothing, add only what you need
✅ Free tier covers most small to medium sites

Happy property hunting! 🏠
