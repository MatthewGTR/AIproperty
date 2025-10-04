import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Properties from './pages/Properties';
import AIChat from './pages/AIChat';
import Favorites from './pages/Favorites';
import AgentDashboard from './pages/AgentDashboard';
import Login from './pages/Login';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/properties" element={<Properties />} />
          <Route path="/ai-chat" element={<AIChat />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/agent-dashboard" element={<AgentDashboard />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
