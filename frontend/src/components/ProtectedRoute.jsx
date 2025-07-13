import { useAuthStore } from "../store/authStore.js";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isCheckingAuth } = useAuthStore();

  if (isCheckingAuth) return <div>Loading...</div>;

  return !isAuthenticated ? <Navigate to="/login" replace /> : children;
}
