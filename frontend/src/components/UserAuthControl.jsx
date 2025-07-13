import { useAuthStore } from "../store/authStore.js";
import { Navigate } from "react-router-dom";

export default function UserAuthControl({ children }) {
  const { isAuthenticated, isCheckingAuth } = useAuthStore();

  if (isCheckingAuth) return <div>Loading...</div>;

  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
}
