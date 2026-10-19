import { Link } from "react-router";

// card:
export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8">
        {/* Brand */}
        <div className="flex flex-col items-center mb-6">
          <Link
            to="/"
            className="flex items-center gap-2 text-2xl font-bold text-indigo-600"
          >
            <span className="text-3xl">📊</span>
            <span>LivePoll</span>
          </Link>

          <h1 className="text-2xl font-bold text-gray-800 mt-4">{title}</h1>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1 text-center">{subtitle}</p>
          )}
        </div>

        {/* Form area */}
        {children}

        {/* Footer link (e.g., "Don't have an account? Sign up") */}
        {footer && (
          <div className="mt-6 text-center text-sm text-gray-600">{footer}</div>
        )}
      </div>
    </div>
  );
}
