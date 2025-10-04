# AI Chatbot Architecture

## Clean, Optimized Structure

```
User Input → Hero.tsx → enhancedOpenAI.ts → smartAI.ts
                                                  ↓
                                    ┌─────────────┴─────────────┐
                                    ↓                           ↓
                            Property Question            Non-Property
                            (Local AI - Free)         (ChatGPT - $0.002)
                                    ↓                           ↓
                            Show Properties              Natural Response
```

## Core Files

### 1. `Hero.tsx` (UI Component)
- Handles user input
- Displays chat messages
- Shows property results
- Manages conversation state

### 2. `enhancedOpenAI.ts` (Router - 93 lines)
- Routes messages to smartAI
- Manages conversation context
- Finds matching properties
- Returns formatted response

### 3. `smartAI.ts` (AI Engine - 1,520 lines)
- **Property Detection** - Identifies property queries
- **Information Extraction** - Parses location, budget, bedrooms, etc.
- **Budget Calculation** - From salary (80x multiplier)
- **ChatGPT Integration** - For non-property questions
- **Fallback System** - Smart local responses
- **Context Memory** - Remembers conversation

## AI Behavior

### Property Questions (90% of queries)
```typescript
isPropertyRelated() → true
     ↓
extractInformation()  // Parse budget, location, etc.
     ↓
generateSmartResponse()  // Create response
     ↓
Local AI (instant, free)
```

### Non-Property Questions (10% of queries)
```typescript
isPropertyRelated() → false
     ↓
handleGeneralChat()  // Call ChatGPT
     ↓
ChatGPT API (1-2 sec, $0.002)
     ↓
Fallback if needed (free)
```

## Single AI Provider

**ChatGPT (OpenAI) Only**
- Natural conversations
- Context-aware responses
- Falls back to local if unavailable
- Cost: ~$0.002 per call

## Removed Complexity

❌ Gemini AI (unnecessary)
❌ openaiService.ts (redundant)
❌ aiEnhancedService.ts (redundant)
❌ Multiple AI provider logic

## Environment Setup

```bash
# Required
VITE_OPENAI_API_KEY=sk-proj-...
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...

# Optional
VITE_GOOGLE_MAPS_API_KEY=...  # For location autocomplete
```

## Key Features

✅ **Smart Property Detection**
✅ **Budget from Salary** (80x multiplier)
✅ **Context Memory** (remembers conversation)
✅ **ChatGPT for Off-Topic** (natural responses)
✅ **Fallback System** (always works)
✅ **Joke Detection** (handles silly questions)
✅ **Location Parsing** (Malaysian states/cities)
✅ **Amenity Matching** (pool, gym, parking, etc.)

## Quick Reference

| Question Type | Handler | Speed | Cost |
|---------------|---------|-------|------|
| Property search | Local AI | <100ms | Free |
| Budget calc | Local AI | <50ms | Free |
| Silly/joke | Local pattern | <10ms | Free |
| Weather, food | ChatGPT | 1-2s | $0.002 |
| General chat | ChatGPT | 1-2s | $0.002 |

## Testing

```bash
# Property (local, instant)
"I earn 5000"
"Show me condos in KL"
"3 bedrooms with pool"

# General (ChatGPT, 1-2 sec)
"What's the weather?"
"Good food in Penang?"
"How's traffic?"
```

## Benefits

- **Simple** - One AI provider, clear flow
- **Fast** - Most queries use local AI
- **Smart** - ChatGPT for natural conversation
- **Reliable** - Fallback system always works
- **Cost-effective** - 90% queries free
