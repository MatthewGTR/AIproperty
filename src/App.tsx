import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import PropertyListings from './components/PropertyListings';
import PropertyDetails from './components/PropertyDetails';
import AuthModal from './components/AuthModal';
import SubmitProperty from './components/SubmitProperty';
import AgentsPage from './components/AgentsPage';
import AdminPanel from './components/AdminPanel';
import RentPage from './components/RentPage';
import BuyPage from './components/BuyPage';
import NewDevelopmentPage from './components/NewDevelopmentPage';
import { Property } from './types/Property';
import { mockProperties } from './data/mockProperties';

function App() {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [showSubmit, setShowSubmit] = useState(false);
  const [showAgents, setShowAgents] = useState(false);
  const [showRent, setShowRent] = useState(false);
  const [showBuy, setShowBuy] = useState(false);
  const [showNewDevelopment, setShowNewDevelopment] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [recommendedProperties, setRecommendedProperties] = useState<Property[]>(mockProperties);
  const [user, setUser] = useState<{ id: string; name: string; email: string; userType: string; credits: number } | null>(null);

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
        onRentClick={() => setShowRent(true)}
        onBuyClick={() => setShowBuy(true)}
        onNewDevelopmentClick={() => setShowNewDevelopment(true)}
        onAdminClick={() => setShowAdmin(true)}
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
          onUserUpdate={setUser}
        />
      )}
      
      {showAgents && (
        <AgentsPage 
          onClose={() => setShowAgents(false)}
        />
      )}
      
      {showRent && (
        <RentPage 
          onClose={() => setShowRent(false)}
          user={user}
        />
      )}
      
      {showBuy && (
        <BuyPage 
          onClose={() => setShowBuy(false)}
          user={user}
        />
      )}
      
      {showNewDevelopment && (
        <NewDevelopmentPage 
          onClose={() => setShowNewDevelopment(false)}
          user={user}
        />
      )}
      
      {showAdmin && user && (
        <AdminPanel 
          onClose={() => setShowAdmin(false)}
          currentUser={user}
        />
      )}
      
    </div>
  );
}

export default App;