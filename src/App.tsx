import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import PropertyListings from './components/PropertyListings';
import PropertyDetailsPage from './components/PropertyDetailsPage';
import AuthModal from './components/AuthModal';
import SubmitProperty from './components/SubmitProperty';
import AgentsPage from './components/AgentsPage';
import AdminPanel from './components/AdminPanel';
import RentPage from './components/RentPage';
import BuyPage from './components/BuyPage';
import BuyPropertyDetailsPage from './components/BuyPropertyDetailsPage';
import RentPropertyDetailsPage from './components/RentPropertyDetailsPage';
import NewDevelopmentPage from './components/NewDevelopmentPage';
import { PropertyWithImages, propertyService } from './services/propertyService';
import { authService } from './services/authService';

function HomePage({
  user,
  onPropertiesRecommended,
  recommendedProperties,
  onPropertyClick
}: {
  user: any;
  onPropertiesRecommended: (props: PropertyWithImages[]) => void;
  recommendedProperties: PropertyWithImages[];
  onPropertyClick: (prop: PropertyWithImages) => void;
}) {
  return (
    <>
      <Hero user={user} onPropertiesRecommended={onPropertiesRecommended} />
      <PropertyListings properties={recommendedProperties} onPropertyClick={onPropertyClick} />
    </>
  );
}

function App() {
  const navigate = useNavigate();
  const [selectedProperty, setSelectedProperty] = useState<PropertyWithImages | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [showSubmit, setShowSubmit] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [recommendedProperties, setRecommendedProperties] = useState<PropertyWithImages[]>([]);
  const [user, setUser] = useState<{ id: string; name: string; email: string; userType: string; credits: number } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
    loadInitialProperties();
  }, []);

  const checkUser = async () => {
    try {
      const profile = await authService.getCurrentUser();
      if (profile) {
        setUser({
          id: profile.id,
          name: profile.full_name,
          email: profile.email,
          userType: profile.user_type,
          credits: profile.credits
        });
      }
    } catch (error) {
      console.error('Error checking user:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadInitialProperties = async () => {
    try {
      const properties = await propertyService.getProperties({ limit: 12 });
      setRecommendedProperties(properties);
    } catch (error) {
      console.error('Error loading properties:', error);
    }
  };

  const handlePropertiesRecommended = (properties: PropertyWithImages[]) => {
    setRecommendedProperties(properties);
  };

  const handleLogout = async () => {
    await authService.signOut();
    setUser(null);
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        user={user}
        onAuthClick={() => setShowAuth(true)}
        onSubmitClick={() => setShowSubmit(true)}
        onAdminClick={() => setShowAdmin(true)}
        onLogout={handleLogout}
      />

      <Routes>
        <Route
          path="/"
          element={
            <HomePage
              user={user}
              onPropertiesRecommended={handlePropertiesRecommended}
              recommendedProperties={recommendedProperties}
              onPropertyClick={(property) => navigate(`/property/${property.id}`)}
            />
          }
        />
        <Route path="/buy" element={<BuyPage user={user} />} />
        <Route path="/buy/:id" element={<BuyPropertyDetailsPage />} />
        <Route path="/rent" element={<RentPage user={user} />} />
        <Route path="/rent/:id" element={<RentPropertyDetailsPage />} />
        <Route path="/property/:id" element={<PropertyDetailsPage user={user} />} />
        <Route path="/new-development" element={<NewDevelopmentPage user={user} />} />
        <Route path="/agents" element={<AgentsPage />} />
      </Routes>


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
