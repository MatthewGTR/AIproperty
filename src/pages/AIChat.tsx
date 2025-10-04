import Hero from '../components/Hero';

export default function AIChat() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">AI Property Assistant</h1>
          <p className="text-lg text-slate-600">
            Tell me your salary, family size, or preferences - I'll find your perfect property!
          </p>
        </div>
        <Hero />
      </div>
    </div>
  );
}
