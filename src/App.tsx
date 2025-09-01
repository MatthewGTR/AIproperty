import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import PropertyListings from './components/PropertyListings';
import PropertyDetails from './components/PropertyDetails';
import AuthModal from './components/AuthModal';
import ChatBot from './components/ChatBot';
import SubmitProperty from './components/SubmitProperty';
import AgentsPage from './components/AgentsPage';
import { Property } from './types/Property';
import { mockProperties } from './data/mockProperties';

function App() {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [showSubmit, setShowSubmit] = useState(false);
  const [showAgents, setShowAgents] = useState(false);
  const [recommendedProperties, setRecommendedProperties] = useState<Property[]>(mockProperties);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  const handlePropertiesRecommended = (properties: Property[]) => {
    setRecommendedProperties(properties);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        user={user} 
        onAuthClick={() => setShowAuth(true)}
        onSubmitClick={() => setShowSubmit(true)}
        onAgentsClick={() => setShowAgents(true)}
        onLogout={() => setUser(null)}
      />
      
      <Hero 
        onPropertiesRecommended={handlePropertiesRecommended}
        allProperties={mockProperties}
      />
      
      <PropertyListings 
        properties={recommendedProperties}
        onPropertyClick={setSelectedProperty}
      />
      
      {selectedProperty && (
        <PropertyDetails 
          property={selectedProperty}
          onClose={() => setSelectedProperty(null)}
          user={user}
        />
      )}
      
      {showAuth && (
        <AuthModal 
          onClose={() => setShowAuth(false)}
          onLogin={setUser}
        />
      )}
      
      {showSubmit && (
        <SubmitProperty 
          onClose={() => setShowSubmit(false)}
          user={user}
        />
      )}
      
      {showAgents && (
        <AgentsPage 
          onClose={() => setShowAgents(false)}
        />
      )}
      
      <ChatBot />
    </div>
  );
}

export default App;