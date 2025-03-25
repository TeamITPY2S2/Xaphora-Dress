// src/pages/Login.js
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css"; // Import your CSS styling

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8070/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store token and userType in localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("userType", data.userType);

        setMessage("Login successful!");

        // Redirect based on userType
        if (data.userType === "super-admin") {
          navigate("/superadmin");
        } else {
          navigate("/home");
        }
      } else {
        setMessage(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      setMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">LOGIN</h2>
      <form className="login-form" onSubmit={handleSubmit}>
        <label className="login-label">EMAIL</label>
        <input
          type="email"
          className="login-input"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label className="login-label password-label">PASSWORD</label>
        <input
          type="password"
          className="login-input"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit" className="login-button">LOG IN</button>
      </form>

      <p className="login-footer">
        <Link to="/signup" className="login-link">Forgot your password?</Link>
      </p>

      <p className="login-footer">
        Create Account <Link to="/signup" className="login-link">Sign Up</Link>
      </p>

      <p className="login-footer">
         <Link to="/seller/login" className="login-link">Log as a <b>Seller</b></Link>
      </p>

      <div className="login-message">{message}</div>
    </div>
  );
}

export default Login;