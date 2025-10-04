import { useState, useEffect } from 'react';
import Hero from './components/Hero';

function App() {
  useEffect(() => {
    console.log('✅ App component mounted');
    console.log('📍 Supabase URL:', import.meta.env.VITE_SUPABASE_URL ? 'Configured' : 'Missing');
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Hero />
    </div>
  );
}

export default App;
