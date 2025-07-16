import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage.jsx";
import { useAuthStore } from "./store/authStore.js";
import { useEffect } from "react";
import UserAuthControl from "./components/UserAuthControl.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import ForgotPasswordPage from "./pages/ForgotPasswordPage.jsx";

export default function App() {
  const { isAuthenticated, isCheckingAuth, checkAuth, logout, user } =
    useAuthStore();

  useEffect(() => {
    async function checkUserAuth() {
      if (!isAuthenticated && !isCheckingAuth) {
        await checkAuth();
      }
    }
    checkUserAuth();
  }, [checkAuth, isAuthenticated]);

  if (isCheckingAuth) return <div>Loading...</div>;

  return (
    <Router>
      <Routes>
        <Route path="/" element={<div>Home</div>} />
        <Route
          path="/login"
          element={
            <UserAuthControl>
              <LoginPage />
            </UserAuthControl>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <UserAuthControl>
              <ForgotPasswordPage />
            </UserAuthControl>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}
