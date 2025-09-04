import React, { useState } from 'react';
import { Send, Bot, User, Sparkles, MapPin } from 'lucide-react';
import { PropertyWithImages, propertyService } from '../services/propertyService';
import { searchPropertiesWithAI } from '../services/openaiService';

interface HeroProps {
  onPropertiesRecommended: (properties: PropertyWithImages[]) => void;
}

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  properties?: PropertyWithImages[];
}

const Hero: React.FC<HeroProps> = ({ onPropertiesRecommended }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: 'How can I help you today?',
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

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
        // Search properties using the database
        const matchedProperties = await propertyService.searchProperties(inputMessage);
        
        // Get AI response
        const { response } = await searchPropertiesWithAI(inputMessage, matchedProperties);
        
        const aiMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          text: response,
          sender: 'ai',
          timestamp: new Date(),
          properties: matchedProperties
        };

        setMessages(prev => [...prev, aiMessage]);
        
        // Show recommended properties
        onPropertiesRecommended(matchedProperties);
      } catch (error) {
        const errorMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          text: "Sorry, I'm having trouble right now. Please try again!",
          sender: 'ai',
          timestamp: new Date(),
          properties: []
        };

        setMessages(prev => [...prev, errorMessage]);
        onPropertiesRecommended([]);
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
    "I want to buy a house in Johor Bahru under RM500k",
    "Looking for rental apartment under RM2000",
    "Show me 3-bedroom condos for sale",
    "Find rooms for rent under RM1000"
  ];

  return (
    <section className="relative bg-gradient-to-r from-blue-600 to-blue-800 py-12">
      <div className="absolute inset-0 bg-black opacity-20"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Find Your Perfect Home with Smart Property AI
          </h1>
          <p className="text-lg text-blue-100 mb-6 max-w-3xl mx-auto">
            Chat with our Smart Property AI assistant about your dream home. Get personalized recommendations and neighborhood insights.
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
              <h3 className="font-semibold">Smart Property AI</h3>
              <p className="text-xs text-blue-100">Real estate expert</p>
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
              <p className="text-sm text-gray-600 mb-3">Try these examples:</p>
              <div className="grid grid-cols-1 gap-2">
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
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-white">
          <div className="text-center">
            <div className="bg-white bg-opacity-20 rounded-full p-3 w-12 h-12 mx-auto mb-3 flex items-center justify-center">
              <Bot className="h-6 w-6" />
            </div>
            <h3 className="text-base font-semibold mb-1">Smart AI Integration</h3>
            <p className="text-blue-100 text-sm">Powered by advanced AI for intelligent property conversations</p>
          </div>
          <div className="text-center">
            <div className="bg-white bg-opacity-20 rounded-full p-3 w-12 h-12 mx-auto mb-3 flex items-center justify-center">
              <MapPin className="h-6 w-6" />
            </div>
            <h3 className="text-base font-semibold mb-1">Smart Recommendations</h3>
            <p className="text-blue-100 text-sm">Intelligent property matching with neighborhood expertise</p>
          </div>
          <div className="text-center">
            <div className="bg-white bg-opacity-20 rounded-full p-3 w-12 h-12 mx-auto mb-3 flex items-center justify-center">
              <Sparkles className="h-6 w-6" />
            </div>
            <h3 className="text-base font-semibold mb-1">Expert Insights</h3>
            <p className="text-blue-100 text-sm">Market analysis and investment guidance from AI expertise</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;