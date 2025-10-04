import { Home, Building2, Heart, User, LogIn, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-blue-600">
            <Building2 className="w-8 h-8" />
            <span>PropertyAI</span>
          </Link>

          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2 text-slate-700 hover:text-blue-600 transition-colors">
              <Home className="w-5 h-5" />
              <span className="hidden sm:inline">Home</span>
            </Link>

            <Link to="/properties" className="flex items-center gap-2 text-slate-700 hover:text-blue-600 transition-colors">
              <Building2 className="w-5 h-5" />
              <span className="hidden sm:inline">Properties</span>
            </Link>

            <Link to="/ai-chat" className="flex items-center gap-2 text-slate-700 hover:text-blue-600 transition-colors">
              <MessageSquare className="w-5 h-5" />
              <span className="hidden sm:inline">AI Assistant</span>
            </Link>

            <Link to="/favorites" className="flex items-center gap-2 text-slate-700 hover:text-blue-600 transition-colors">
              <Heart className="w-5 h-5" />
              <span className="hidden sm:inline">Favorites</span>
            </Link>

            <Link to="/agent-dashboard" className="flex items-center gap-2 text-slate-700 hover:text-blue-600 transition-colors">
              <User className="w-5 h-5" />
              <span className="hidden sm:inline">Agent</span>
            </Link>

            <Link to="/login" className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <LogIn className="w-5 h-5" />
              <span className="hidden sm:inline">Login</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
