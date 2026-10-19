import { Navigate, Outlet } from "react-router";
import { useAuth } from "../../context/AuthContext";

export default function ProtectedRoute() {
  const { user, loading } = useAuth();

  // 1. If loading, show a spinner or blank screen. Do NOT redirect yet.
  if (loading) {
    return <div className="text-center mt-20 text-gray-500">Loading...</div>;
  }

  // 2. If loading is done and there is no user, redirect to login.
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 3. User is logged in, show the page.
  return <Outlet />;
}