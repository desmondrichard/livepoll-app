import { Link } from "react-router";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <div className="text-8xl mb-6">🔍</div>

      <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-2">
        Page Not Found
      </h1>

      <p className="text-gray-500 mb-8 max-w-md mx-auto">
        Oops! The page you are looking for doesn't exist, has been moved, or you
        might have typed the URL incorrectly.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => window.history.back()}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border-2 border-gray-200 text-gray-700 hover:bg-gray-50 font-semibold transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Go Back
        </button>

        <Link
          to="/"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-md transition-colors"
        >
          <Home className="w-5 h-5" />
          Return Home
        </Link>
      </div>
    </div>
  );
}
