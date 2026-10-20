import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";

const GlobalHeader = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logoutUser } = useAuth(); // Get user data and logout function
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    setMenuOpen(false);
    navigate("/"); // Redirect to home on logout
  };

  const navLinks = [
    { label: "Home", to: "/" },
    { label: "Dashboard", to: "/dashboard" },
    { label: "Create Poll", to: "/create-poll" },
  ];
  return (
    <div className="globalHeaderContainer">
      <header className="bg-white shadow-md fixed top-0 left-0 right-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-2 text-xl font-bold text-indigo-600"
            >
              <span className="text-2xl">📊</span>
              <span>LivePoll</span>
            </Link>

            {/* Desktop navigation */}
            <nav className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  className="text-gray-600 hover:text-indigo-600 font-medium transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Desktop Auth Section */}
            <div className="hidden md:flex items-center gap-3">
              {user ? (
                <>
                  <span className="text-sm font-medium text-gray-700">
                    Hi, {user.name.split(" ")[0]} {/* Show first name only */}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 font-medium transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-4 py-2 text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-colors shadow"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden text-2xl text-gray-700 focus:outline-none"
              aria-label="Toggle menu"
            >
              {menuOpen ? "✕" : "☰"}
            </button>
          </div>

          {/* Mobile dropdown menu */}
          {menuOpen && (
            <div className="md:hidden pb-4 flex flex-col gap-2 bg-white border-t mt-2 pt-2">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  onClick={() => setMenuOpen(false)}
                  className="px-3 py-2 rounded-lg text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 font-medium"
                >
                  {link.label}
                </Link>
              ))}

              <div className="border-t pt-3 mt-2 flex flex-col gap-2">
                {user ? (
                  <>
                    <span className="px-3 py-2 text-sm text-gray-500 font-medium">
                      Logged in as {user.name}
                    </span>
                    <button
                      onClick={handleLogout}
                      className="px-3 py-2 text-left rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 font-medium"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setMenuOpen(false)}
                      className="px-3 py-2 text-indigo-600 font-medium"
                    >
                      Login
                    </Link>
                    <Link
                      to="/signup"
                      onClick={() => setMenuOpen(false)}
                      className="px-3 py-2 rounded-lg bg-indigo-600 text-white font-medium text-center"
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </header>
    </div>
  );
};

export default GlobalHeader;
