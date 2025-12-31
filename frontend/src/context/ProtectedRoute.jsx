import { Navigate } from "react-router-dom";
import { useAuth } from "./Authcontext";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return null;

  return user ? children : <Navigate to="/login" />;
}
