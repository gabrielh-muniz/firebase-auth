import { useAuthStore } from "../store/authStore.js";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user, logout, token, isAdmin } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      setMessage("User created successfully");
      setEmail("");
      setPassword("");
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div>
      <h2>Dashboard</h2>
      <p>Welcome, {user ? user.email : "Guest"}!</p>
      <p>Your token: {user ? token : "No token available"}</p>
      <p>Id: {user ? user.uid : "No Id provided"}</p>
      <p>Email verified: {user.emailVerified ? "True" : "False"}</p>
      <button onClick={handleLogout}>Logout</button>
      {isAdmin && (
        <form onSubmit={handleCreateUser}>
          <h3>Create user</h3>
          {message && <p>{message}</p>}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Create</button>
        </form>
      )}
    </div>
  );
}
