import { useAuthStore } from "../store/authStore.js";
import { useNavigate } from "react-router-dom";

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user, logout, token, isAdmin } = useAuthStore();

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
      <p>Email verified: {user.emailVerified ? "True" : "False"}</p>
      <button onClick={handleLogout}>Logout</button>
      {isAdmin ? (
        <p>You have admin privileges.</p>
      ) : (
        <p>You do not have admin privileges</p>
      )}
    </div>
  );
}
