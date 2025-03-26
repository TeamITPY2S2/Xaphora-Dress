// src/pages/BuyerSignup.js
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./BuyerSignup.css"; // Import the CSS file

function BuyerSignup() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName]   = useState("");
  const [email, setEmail]         = useState("");
  const [password, setPassword]   = useState("");
  const [message, setMessage]     = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // POST request to the /users endpoint
      const response = await fetch("/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        // Optionally store a token or userType if returned
        // localStorage.setItem("token", data.token);
        // localStorage.setItem("userType", data.userType || "buyer");
        setMessage("Signup successful!");
        // Redirect to dashboard
        navigate("/api/auth/login");
      } else {
        setMessage(data.message || "Signup failed");
      }
    } catch (error) {
      console.error("Signup error:", error);
      setMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="signup-container">
      <h2 className="signup-title">Buyer Signup</h2>
      {message && <p className="signup-message">{message}</p>}

      <form className="signup-form" onSubmit={handleSubmit}>
        <label className="signup-label">First Name</label>
        <input
          type="text"
          className="signup-input"
          required
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />

        <label className="signup-label">Last Name</label>
        <input
          type="text"
          className="signup-input"
          required
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />

        <label className="signup-label">Email</label>
        <input
          type="email"
          className="signup-input"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label className="signup-label">Password</label>
        <input
          type="password"
          className="signup-input"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit" className="signup-button">Sign Up</button>
      </form>

      <p className="signup-footer">
        Already registered?{" "}
        <Link to="/api/auth/login" className="signup-link">
          Login here
        </Link>

        <p className="login-footer">
                 <Link to="/seller/signup" className="login-link">Signup as a <b>Seller</b></Link>
              </p>

      </p>
    </div>
  );
}

export default BuyerSignup;