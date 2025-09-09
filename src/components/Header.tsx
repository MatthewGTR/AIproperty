import React from 'react';
import { Search, User, PlusCircle, Menu, MessageCircle, Settings, CreditCard } from 'lucide-react';

interface HeaderProps {
  user: { id: string; name: string; email: string; userType: string; credits: number } | null;
  onAuthClick: () => void;
  onSubmitClick: () => void;
  onLogout: () => void;
  onAgentsClick: () => void;
  onBuyClick: () => void;
  onRentClick: () => void;
  onNewDevelopmentClick: () => void;
  onAdminClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  user, 
  onAuthClick, 
  onSubmitClick, 
  onLogout, 
  onAgentsClick, 
  onRentClick, 
  onBuyClick, 
  onNewDevelopmentClick,
  onAdminClick 
}) => {
  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Search className="h-8 w-8 text-blue-600 mr-2" />
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-gray-900">AI Property</span>
              <span className="text-xs text-blue-600 font-medium -mt-1">Smart AI, Smart Home</span>
            </div>
              <span className="text-2xl font-bold text-gray-900">AI Property</span>
             <span className="text-xs text-blue-600 font-medium -mt-1">Smart AI, Smart Home</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <button 
              onClick={onBuyClick}
              className="text-gray-700 hover:text-blue-600 transition-colors duration-200"
            >
              Buy
            </button>
            <button 
              onClick={onRentClick}
              className="text-gray-700 hover:text-blue-600 transition-colors duration-200"
            >
              Rent
            </button>
            <button 
              onClick={onNewDevelopmentClick}
              className="text-gray-700 hover:text-blue-600 transition-colors duration-200"
            >
              New Development
            </button>
            <button 
              onClick={onAgentsClick}
              className="text-gray-700 hover:text-blue-600 transition-colors duration-200"
            >
              Agents
            </button>
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {user && (user.userType === 'agent' || user.userType === 'seller') && (
              <button
                onClick={onSubmitClick}
                className="hidden sm:flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors duration-200"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                List Property
              </button>
            )}

            {user ? (
              <div className="flex items-center space-x-3">
                {user.userType === 'agent' && (
                  <div className="flex items-center space-x-2 bg-blue-50 px-3 py-1 rounded-lg">
                    <CreditCard className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-700">{user.credits} credits</span>
                  </div>
                )}
                
                <div className="flex items-center space-x-2">
                  <MessageCircle className="h-5 w-5 text-gray-600" />
                  <span className="hidden sm:inline text-sm text-gray-700">Messages</span>
                </div>
                <div className="relative group">
                  <button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                    <User className="h-5 w-5 text-gray-600" />
                    <span className="hidden sm:inline text-sm font-medium text-gray-700">{user.name}</span>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="py-1">
                      <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</a>
                      <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">My Properties</a>
                      <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Saved Searches</a>
                      {user.userType === 'admin' && (
                        <button 
                          onClick={onAdminClick}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <Settings className="inline h-4 w-4 mr-2" />
                          Admin Panel
                        </button>
                      )}
                      <button 
                        onClick={onLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={onAuthClick}
                className="flex items-center px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-colors duration-200"
              >
                <User className="h-4 w-4 mr-2" />
                Sign In
              </button>
            )}

            <button className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200">
              <Menu className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;