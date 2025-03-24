import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";  // Added Link import

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Use the full URL if your backend is on port 8070
      const response = await fetch("http://localhost:8070/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store the token and userType in localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("userType", data.userType);

        setMessage("Login successful!");
        // Redirect to a universal dashboard
        navigate("/dashboard");
      } else {
        // If not 2xx, show the server's error message or a fallback
        setMessage(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      setMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "0 auto" }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <label>Email</label><br />
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        /><br /><br />

        <label>Password</label><br />
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        /><br /><br />

        <button type="submit">Login</button>
        <p style={{ marginTop: "10px" }}>
          Create Account <Link to="/signup">Sign Up</Link>
        </p>
      </form>
      <div style={{ color: "red", marginTop: "10px" }}>{message}</div>
    </div>
  );
}

export default Login;