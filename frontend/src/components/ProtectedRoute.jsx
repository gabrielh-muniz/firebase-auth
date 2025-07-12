import { useAuthStore } from "../store/authStore.js";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuthStore();

  return !isAuthenticated ? <Navigate to="/login" replace /> : children;
}
