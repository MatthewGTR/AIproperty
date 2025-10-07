import React, { useState, useEffect } from 'react';
import { Send, Bot, User, Sparkles, MapPin } from 'lucide-react';
import { PropertyWithImages } from '../services/propertyService';
import { processUserMessage, ConversationContext, createDefaultContext } from '../services/enhancedOpenAI';
import { authService } from '../services/authService';

interface HeroProps {
  user: { id: string; name: string; email: string; userType: string; credits: number } | null;
  onPropertiesRecommended: (properties: PropertyWithImages[]) => void;
}

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  properties?: PropertyWithImages[];
}

const Hero: React.FC<HeroProps> = ({ user, onPropertiesRecommended }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: 'Hi there! I\'m here to help you find the perfect property in Malaysia. What are you looking for?',
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [aiContext, setAiContext] = useState<ConversationContext>(createDefaultContext());

  // Load user's AI context when user changes
  useEffect(() => {
    const loadUserContext = async () => {
      if (user?.id) {
        const savedContext = await authService.getUserAIContext(user.id);
        if (savedContext) {
          // Convert old UserProfile to new ConversationContext if needed
          try {
            setAiContext(savedContext as any);
          } catch (e) {
            setAiContext(createDefaultContext());
          }
        }
      } else {
        setAiContext(createDefaultContext());
      }
    };
    loadUserContext();
  }, [user]);

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
        // Process message with smart AI
        const { response, matchedProperties, context } = await processUserMessage(
          inputMessage,
          aiContext
        );

        const aiMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          text: response,
          sender: 'ai',
          timestamp: new Date(),
          properties: matchedProperties
        };

        setMessages(prev => [...prev, aiMessage]);

        // Update AI context
        setAiContext(context);

        // Save context for logged-in users
        if (user?.id) {
          await authService.saveUserAIContext(user.id, context as any);
        }

        // Show recommended properties
        onPropertiesRecommended(matchedProperties);
      } catch (error) {
        console.error('Chat error:', error);
        const errorMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          text: "Sorry, I encountered an issue. Could you please rephrase that?",
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
    "Looking to rent an apartment in KL under RM2500",
    "Need a condo for sale in KLCC with pool",
    "Want to rent a studio under RM1200",
    "Show me new developments in Iskandar",
    "Looking for luxury villas above RM2 million"
  ];

  return (
    <section className="relative bg-gradient-to-r from-blue-600 to-blue-800 py-12">
      <div className="absolute inset-0 bg-black opacity-20"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Find Your Perfect Home with Smart Property AI
          </h1>
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
                        Found {message.properties.length} properties
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

          {/* Chat Input */}
          <div className="p-6 bg-white border-t border-gray-200">
            <div className="flex space-x-3">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about properties or just chat..."
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
            <p className="text-blue-100 text-sm">Remembers your preferences across sessions</p>
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
            <p className="text-blue-100 text-sm">Personalized recommendations based on your needs</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;