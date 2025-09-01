import React, { useState } from 'react';
import { Send, Bot, User, Sparkles, MapPin } from 'lucide-react';
import { Property } from '../types/Property';
import { searchPropertiesWithAI, LocationInfo } from '../services/openaiService';
import { geocodeAddress, getCurrentLocation } from '../services/mapsService';

interface HeroProps {
  onPropertiesRecommended: (properties: Property[]) => void;
  allProperties: Property[];
}

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  properties?: Property[];
}

const Hero: React.FC<HeroProps> = ({ onPropertiesRecommended, allProperties }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: 'Hi! I\'m your AI property assistant powered by ChatGPT. Tell me what kind of home you\'re looking for - location, budget, size, amenities, or any specific preferences. I can also help you understand neighborhoods and provide location-based advice. What can I help you find today?',
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [userLocation, setUserLocation] = useState<LocationInfo | null>(null);

  // Get user's current location on component mount
  React.useEffect(() => {
    getCurrentLocation().then(location => {
      if (location) {
        setUserLocation(location);
      }
    });
  }, []);

  const handleLocationSearch = async (query: string): Promise<LocationInfo | null> => {
    // Check if the query contains location-related keywords
    const locationKeywords = ['in ', 'near ', 'around ', 'at ', 'location', 'address', 'area'];
    const hasLocationKeyword = locationKeywords.some(keyword => 
      query.toLowerCase().includes(keyword)
    );

    if (hasLocationKeyword) {
      // Extract potential address from the query
      const words = query.split(' ');
      const locationIndex = words.findIndex(word => 
        ['in', 'near', 'around', 'at'].includes(word.toLowerCase())
      );
      
      if (locationIndex !== -1 && locationIndex < words.length - 1) {
        const potentialAddress = words.slice(locationIndex + 1).join(' ');
        return await geocodeAddress(potentialAddress);
      }
    }
    
    return null;
  };

  const handleSendMessage = async () => {
    if (inputMessage.trim()) {
      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        text: inputMessage,
        sender: 'user',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, userMessage]);
      setInputMessage('');
      setIsTyping(true);

      try {
        // Check if user is asking about a specific location
        const searchedLocation = await handleLocationSearch(inputMessage);
        const contextLocation = searchedLocation || userLocation;

        // Get AI response with ChatGPT integration
        const { response, matchedProperties } = await searchPropertiesWithAI(
          inputMessage, 
          allProperties,
          contextLocation
        );
        
        const aiMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          text: response,
          sender: 'ai',
          timestamp: new Date(),
          properties: matchedProperties
        };

        setMessages(prev => [...prev, aiMessage]);
        onPropertiesRecommended(matchedProperties);
      } catch (error) {
        const errorMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          text: "I apologize, but I'm having trouble processing your request right now. Please try again or rephrase your question.",
          sender: 'ai',
          timestamp: new Date(),
          properties: allProperties.filter(p => p.featured)
        };

        setMessages(prev => [...prev, errorMessage]);
        onPropertiesRecommended(allProperties.filter(p => p.featured));
      } finally {
        setIsTyping(false);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickPrompts = [
    "I'm looking for a luxury apartment in downtown with city views",
    "Show me affordable family homes with gardens under $500k", 
    "I have a salary of $60,000, what can I afford?",
    "Where is Taman Daya and are there properties there?",
    "Calculate monthly payment for a $800k house",
    "What neighborhoods are good for young professionals?",
    "I need investment properties with good rental potential",
    "Tell me about market trends in Miami",
    "Find me properties with pools and gyms under $1M",
    "What's the average price per square foot in Austin?"
  ];

  const handleUseCurrentLocation = async () => {
    const location = await getCurrentLocation();
    if (location) {
      setUserLocation(location);
      const locationMessage = `My current location is ${location.address}. Can you show me properties nearby?`;
      setInputMessage(locationMessage);
    }
  };

  return (
    <section className="relative bg-gradient-to-r from-blue-600 to-blue-800 py-20">
      <div className="absolute inset-0 bg-black opacity-20"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Find Your Perfect Home with ChatGPT AI
          </h1>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Chat with our ChatGPT-powered assistant about your dream home. Get location-aware recommendations and neighborhood insights.
          </p>
        </div>

        {/* AI Chat Interface */}
        <div className="bg-white rounded-2xl shadow-2xl max-w-4xl mx-auto overflow-hidden">
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 flex items-center">
            <div className="bg-white bg-opacity-20 rounded-full p-2 mr-3">
              <Bot className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold">ChatGPT Property Assistant</h3>
              <p className="text-xs text-blue-100">Location-aware • Real estate expert</p>
            </div>
            <div className="ml-auto flex items-center">
              <Sparkles className="h-5 w-5 text-yellow-300" />
            </div>
          </div>

          {/* Chat Messages */}
          <div className="h-80 overflow-y-auto p-6 space-y-4 bg-gray-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start space-x-2 max-w-xs lg:max-w-md`}>
                  {message.sender === 'ai' && (
                    <div className="bg-blue-600 rounded-full p-1 mt-1">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                  )}
                  <div
                    className={`px-4 py-3 rounded-2xl ${
                      message.sender === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-900 border border-gray-200'
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    {message.properties && message.properties.length > 0 && (
                      <div className="mt-2 text-xs text-blue-600 font-medium">
                        ✨ {message.properties.length} properties recommended below
                      </div>
                    )}
                    <p className={`text-xs mt-1 ${
                      message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  {message.sender === 'user' && (
                    <div className="bg-gray-600 rounded-full p-1 mt-1">
                      <User className="h-4 w-4 text-white" />
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-2">
                  <div className="bg-blue-600 rounded-full p-1 mt-1">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                  <div className="bg-white text-gray-900 border border-gray-200 px-4 py-3 rounded-2xl">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Prompts */}
          {messages.length === 1 && (
            <div className="px-6 py-4 border-t border-gray-200 bg-white">
              {userLocation && (
                <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center text-sm text-blue-700">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>Current location: {userLocation.city}, {userLocation.state}</span>
                  </div>
                </div>
              )}
              
              <p className="text-sm text-gray-600 mb-3">Try these examples:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {quickPrompts.map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => setInputMessage(prompt)}
                    className="text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm text-gray-700 transition-colors duration-200"
                  >
                    "{prompt}"
                  </button>
                ))}
              </div>
              
              <div className="mt-3 pt-3 border-t border-gray-100">
                <button
                  onClick={handleUseCurrentLocation}
                  className="text-sm text-blue-600 hover:text-blue-700 flex items-center"
                >
                  <MapPin className="h-4 w-4 mr-1" />
                  Use my current location
                </button>
              </div>
            </div>
          )}

          {/* Chat Input */}
          <div className="p-6 bg-white border-t border-gray-200">
            <div className="flex space-x-3">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about properties... (e.g., 'I want a 3-bedroom house in Austin under $500k' or 'What's the best neighborhood for families?')"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isTyping}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isTyping}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* AI Features */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-white">
          <div className="text-center">
            <div className="bg-white bg-opacity-20 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Bot className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-semibold mb-2">ChatGPT Integration</h3>
            <p className="text-blue-100">Powered by OpenAI's ChatGPT for intelligent conversations</p>
          </div>
          <div className="text-center">
            <div className="bg-white bg-opacity-20 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <MapPin className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Location Intelligence</h3>
            <p className="text-blue-100">Google Maps integration for accurate location data and insights</p>
          </div>
          <div className="text-center">
            <div className="bg-white bg-opacity-20 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Sparkles className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Smart Recommendations</h3>
            <p className="text-blue-100">AI-powered property matching with neighborhood expertise</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;