import { Heart } from 'lucide-react';

export default function Favorites() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">My Favorites</h1>

        <div className="bg-white rounded-xl shadow-md p-16 text-center">
          <Heart className="w-16 h-16 text-pink-300 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-slate-700 mb-2">No favorites yet</h2>
          <p className="text-slate-500">Start adding properties to your favorites list</p>
        </div>
      </div>
    </div>
  );
}
