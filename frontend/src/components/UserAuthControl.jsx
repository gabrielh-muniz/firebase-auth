import { useAuthStore } from "../store/authStore.js";
import { Navigate } from "react-router-dom";

export default function UserAuthControl({ children }) {
  const { isAuthenticated } = useAuthStore();

  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
}
