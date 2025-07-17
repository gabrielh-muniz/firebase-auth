import { useState } from "react";
import { useAuthStore } from "../store/authStore.js";

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const { isLoading, error, sendPasswordResetEmail } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      await sendPasswordResetEmail(email);
      setMessage("Password reset email sent successfully.");
      setEmail("");
    } catch (err) {
      // Error state is handled by the store
    }
  };

  return (
    <div>
      <h2>Forgot Password</h2>
      {error && <p>{error}</p>}
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Sending..." : "Send Reset Email"}
        </button>
      </form>
    </div>
  );
}

export default ForgotPasswordPage;
