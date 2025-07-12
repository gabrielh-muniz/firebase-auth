import { useAuthStore } from "../store/authStore.js";
import { useNavigate } from "react-router-dom";

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user, logout, token } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div>
      <h2>Dashboard</h2>
      <p>Welcome, {user ? user.email : "Guest"}!</p>
      <p>Your token: {user ? token : "No token available"}</p>
      <p>Id: {user ? user.uid : "No Id provided"}</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
